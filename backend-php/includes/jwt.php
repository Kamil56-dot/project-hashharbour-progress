<?php
/**
 * HashHarbour JWT Helper (HS256)
 * Generates and validates stateless access tokens and rotatable refresh tokens
 * Compatible with RFC 7519 / standard SimpleJWT token claims
 */

declare(strict_types=1);

define('JWT_SECRET', getenv('JWT_SECRET') ?: 'hashharbour-super-secure-jwt-secret-key-change-in-prod');
define('JWT_ACCESS_LIFETIME', 3600);       // 60 minutes
define('JWT_REFRESH_LIFETIME', 604800);    // 7 days

/**
 * Base64Url encode
 */
function base64url_encode(string $data): string
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

/**
 * Base64Url decode
 */
function base64url_decode(string $data): string
{
    return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', (4 - strlen($data) % 4) % 4));
}

/**
 * Compute SHA-256 hash of a raw token for secure database storage in refresh_tokens table
 */
function hash_token(string $token): string
{
    return hash('sha256', $token);
}

/**
 * Generate a signed JWT
 *
 * @param array $payload
 * @param int $lifetimeSeconds
 * @return string
 */
function generate_jwt(array $payload, int $lifetimeSeconds): string
{
    $header = [
        'typ' => 'JWT',
        'alg' => 'HS256'
    ];

    $now = time();
    $payload['iat'] = $now;
    $payload['exp'] = $now + $lifetimeSeconds;

    $base64Header = base64url_encode((string)json_encode($header));
    $base64Payload = base64url_encode((string)json_encode($payload));

    $signature = hash_hmac('sha256', "{$base64Header}.{$base64Payload}", JWT_SECRET, true);
    $base64Signature = base64url_encode($signature);

    return "{$base64Header}.{$base64Payload}.{$base64Signature}";
}

/**
 * Verify and decode a JWT token string
 *
 * @param string $token
 * @return array|null Returns decoded payload array or null if invalid/expired
 */
function verify_jwt(string $token): ?array
{
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return null;
    }

    [$base64Header, $base64Payload, $base64Signature] = $parts;

    $expectedSig = hash_hmac('sha256', "{$base64Header}.{$base64Payload}", JWT_SECRET, true);
    $actualSig = base64url_decode($base64Signature);

    if (!hash_equals($expectedSig, $actualSig)) {
        return null;
    }

    $payload = json_decode(base64url_decode($base64Payload), true);
    if (!is_array($payload)) {
        return null;
    }

    if (isset($payload['exp']) && time() >= $payload['exp']) {
        return null; // Expired
    }

    return $payload;
}

/**
 * Create a paired access and refresh token set for a user
 *
 * @param array $user
 * @return array ['access' => string, 'refresh' => string, 'refresh_hash' => string, 'expires_at' => string]
 */
function create_token_pair(array $user): array
{
    $accessPayload = [
        'token_type' => 'access',
        'user_id'    => (int)$user['id'],
        'email'      => $user['email'],
        'role'       => $user['role'] ?? 'customer',
        'first_name' => $user['first_name'] ?? '',
        'last_name'  => $user['last_name'] ?? '',
    ];

    $refreshPayload = [
        'token_type' => 'refresh',
        'user_id'    => (int)$user['id'],
        'jti'        => bin2hex(random_bytes(16)),
    ];

    $accessToken = generate_jwt($accessPayload, JWT_ACCESS_LIFETIME);
    $refreshToken = generate_jwt($refreshPayload, JWT_REFRESH_LIFETIME);
    $refreshExpiresAt = date('Y-m-d H:i:s', time() + JWT_REFRESH_LIFETIME);

    return [
        'access'       => $accessToken,
        'refresh'      => $refreshToken,
        'token_hash'   => hash_token($refreshToken),
        'expires_at'   => $refreshExpiresAt,
    ];
}

<?php
/**
 * HashHarbour Authentication & Authorization Middleware
 * Equivalent to DRF's IsAuthenticated and role permission classes
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/jwt.php';
require_once __DIR__ . '/response.php';

/**
 * Extract Authorization header across Apache/Nginx environments
 *
 * @return string|null
 */
function get_authorization_header(): ?string
{
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        return trim($_SERVER['HTTP_AUTHORIZATION']);
    }

    if (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        return trim($_SERVER['REDIRECT_HTTP_AUTHORIZATION']);
    }

    if (function_exists('getallheaders')) {
        $headers = getallheaders();
        if (isset($headers['Authorization'])) {
            return trim($headers['Authorization']);
        }
        if (isset($headers['authorization'])) {
            return trim($headers['authorization']);
        }
    }

    return null;
}

/**
 * Extract Bearer token from header
 *
 * @return string|null
 */
function get_bearer_token(): ?string
{
    $header = get_authorization_header();
    if (!empty($header) && preg_match('/Bearer\s(\S+)/i', $header, $matches)) {
        return $matches[1];
    }
    return null;
}

/**
 * Enforce authentication: requires a valid JWT Bearer token
 * Returns authenticated user record or exits with 401 Unauthorized
 *
 * @return array Authenticated user data
 */
function require_auth(): array
{
    $token = get_bearer_token();

    if (!$token) {
        send_error('Authentication credentials were not provided.', 401);
    }

    $payload = verify_jwt($token);

    if (!$payload || ($payload['token_type'] ?? '') !== 'access') {
        send_error('Given token not valid for any token type or has expired.', 401);
    }

    $userId = (int)($payload['user_id'] ?? 0);
    if ($userId <= 0) {
        send_error('Invalid token payload.', 401);
    }

    // Verify user exists and is active in database
    $pdo = get_db();
    $stmt = $pdo->prepare('SELECT id, email, first_name, last_name, role, is_active FROM users WHERE id = :id LIMIT 1');
    $stmt->execute(['id' => $userId]);
    $user = $stmt->fetch();

    if (!$user) {
        send_error('User not found.', 401);
    }

    if ((int)$user['is_active'] !== 1) {
        send_error('User account is inactive.', 401);
    }

    return $user;
}

/**
 * Enforce Role-Based Access Control (RBAC)
 *
 * @param array|string $allowedRoles (e.g. 'admin' or ['admin', 'operator'])
 * @return array Authenticated user data
 */
function require_role(array|string $allowedRoles): array
{
    $user = require_auth();
    $roles = is_array($allowedRoles) ? $allowedRoles : [$allowedRoles];

    if (!in_array($user['role'], $roles, true)) {
        send_error('You do not have permission to perform this action.', 403);
    }

    return $user;
}

<?php
/**
 * POST /api/auth/refresh.php
 * Validates refresh token, checks revocation status, rotates token pair
 * Matches SimpleJWT TokenRefreshView response contract
 */

declare(strict_types=1);

require_once __DIR__ . '/../../includes/cors.php';
require_once __DIR__ . '/../../includes/response.php';
require_once __DIR__ . '/../../includes/jwt.php';
require_once __DIR__ . '/../../config/db.php';

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_error('Method not allowed. Use POST.', 405);
}

$input = get_json_input();
$refreshToken = trim((string)($input['refresh'] ?? ''));

if (empty($refreshToken)) {
    send_error('Refresh token is required.', 400);
}

// 1. Verify cryptographic JWT signature and expiration
$payload = verify_jwt($refreshToken);
if (!$payload || ($payload['token_type'] ?? '') !== 'refresh') {
    send_error('Token is invalid or expired.', 401);
}

$userId = (int)($payload['user_id'] ?? 0);
if ($userId <= 0) {
    send_error('Invalid token payload.', 401);
}

$tokenHash = hash_token($refreshToken);
$pdo = get_db();

// 2. Check refresh_tokens table for revocation and database expiration
$stmt = $pdo->prepare('
    SELECT id, user_id, revoked, expires_at 
    FROM refresh_tokens 
    WHERE token_hash = :token_hash 
    LIMIT 1
');
$stmt->execute(['token_hash' => $tokenHash]);
$tokenRow = $stmt->fetch();

if (!$tokenRow) {
    send_error('Token not recognized or previously revoked.', 401);
}

if ((int)$tokenRow['revoked'] === 1) {
    send_error('This refresh token has been revoked.', 401);
}

if (strtotime($tokenRow['expires_at']) <= time()) {
    send_error('Refresh token has expired.', 401);
}

// 3. Verify user is still active
$userStmt = $pdo->prepare('SELECT id, email, first_name, last_name, role, is_active FROM users WHERE id = :id LIMIT 1');
$userStmt->execute(['id' => $userId]);
$user = $userStmt->fetch();

if (!$user || (int)$user['is_active'] !== 1) {
    send_error('User account is inactive or not found.', 401);
}

// 4. Token Rotation: Mark old token revoked
$revokeStmt = $pdo->prepare('UPDATE refresh_tokens SET revoked = 1 WHERE id = :id');
$revokeStmt->execute(['id' => $tokenRow['id']]);

// 5. Issue new token pair
$tokens = create_token_pair($user);

// 6. Insert new refresh token row
$insertStmt = $pdo->prepare('
    INSERT INTO refresh_tokens (user_id, token_hash, issued_at, expires_at, revoked)
    VALUES (:user_id, :token_hash, NOW(), :expires_at, 0)
');
$insertStmt->execute([
    'user_id'    => $user['id'],
    'token_hash' => $tokens['token_hash'],
    'expires_at' => $tokens['expires_at'],
]);

// Return new token pair
send_json([
    'access'  => $tokens['access'],
    'refresh' => $tokens['refresh'],
], 200);

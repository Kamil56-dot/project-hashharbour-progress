<?php
/**
 * POST /api/auth/login.php
 * Authenticates user via email and password, issuing access & refresh tokens
 * Matches Django's EmailTokenObtainPairView response contract
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
$email = trim((string)($input['email'] ?? ''));
$password = (string)($input['password'] ?? '');

if (empty($email) || empty($password)) {
    send_error('Both email and password are required.', 400);
}

$pdo = get_db();

// Case-insensitive email lookup
$stmt = $pdo->prepare('SELECT id, email, password_hash, first_name, last_name, role, is_active FROM users WHERE LOWER(email) = LOWER(:email) LIMIT 1');
$stmt->execute(['email' => $email]);
$user = $stmt->fetch();

if (!$user) {
    send_error('Invalid email address or password.', 401);
}

if (!password_verify($password, $user['password_hash'])) {
    send_error('Invalid email address or password.', 401);
}

if ((int)$user['is_active'] !== 1) {
    send_error('This account is inactive.', 401);
}

// Generate token pair
$tokens = create_token_pair($user);

// Stateful refresh token storage for revocation & rotation
$insertStmt = $pdo->prepare('
    INSERT INTO refresh_tokens (user_id, token_hash, issued_at, expires_at, revoked)
    VALUES (:user_id, :token_hash, NOW(), :expires_at, 0)
');
$insertStmt->execute([
    'user_id'    => $user['id'],
    'token_hash' => $tokens['token_hash'],
    'expires_at' => $tokens['expires_at'],
]);

// Return payload matching Django shape
send_json([
    'access'  => $tokens['access'],
    'refresh' => $tokens['refresh'],
    'user'    => [
        'id'         => (int)$user['id'],
        'email'      => $user['email'],
        'first_name' => $user['first_name'] ?? '',
        'last_name'  => $user['last_name'] ?? '',
        'role'       => $user['role'],
    ],
], 200);

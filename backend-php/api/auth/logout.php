<?php
/**
 * POST /api/auth/logout.php
 * Revokes the provided refresh token in the refresh_tokens table
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

if (!empty($refreshToken)) {
    $tokenHash = hash_token($refreshToken);
    $pdo = get_db();
    $stmt = $pdo->prepare('UPDATE refresh_tokens SET revoked = 1 WHERE token_hash = :token_hash');
    $stmt->execute(['token_hash' => $tokenHash]);
}

send_json(['message' => 'Logged out successfully.'], 200);

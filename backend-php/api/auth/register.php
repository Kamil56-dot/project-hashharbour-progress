<?php
/**
 * POST /api/auth/register.php
 * Registers a new customer account, hashes password, saves to database,
 * and issues JWT access & refresh tokens for instant login.
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
foreach (['email', 'password', 'first_name', 'firstName', 'last_name', 'lastName'] as $hhField) {
    if (isset($input[$hhField]) && !is_string($input[$hhField])) {
        send_error('Invalid value for ' . $hhField . '.', 400);
    }
}

$email = trim((string)($input['email'] ?? ''));
$password = (string)($input['password'] ?? '');
$firstName = trim((string)($input['first_name'] ?? ($input['firstName'] ?? '')));
$lastName = trim((string)($input['last_name'] ?? ($input['lastName'] ?? '')));

// Validation
if (empty($email) || empty($password)) {
    send_error('Both email and password are required.', 400);
}

if (strlen($email) > 255) {
    send_error('Email address cannot exceed 255 characters.', 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    send_error('Please provide a valid email address.', 400);
}

if (strlen($password) < 6) {
    send_error('Password must be at least 6 characters long.', 400);
}

if (strlen($password) > 72) {
    send_error('Password cannot exceed 72 bytes.', 400);
}

if (mb_strlen($firstName) > 100 || mb_strlen($lastName) > 100) {
    send_error('First and last name cannot exceed 100 characters each.', 400);
}

$pdo = get_db();

// Check if email already registered (case-insensitive)
$checkStmt = $pdo->prepare('SELECT id FROM users WHERE LOWER(email) = LOWER(:email) LIMIT 1');
$checkStmt->execute(['email' => $email]);
if ($checkStmt->fetch()) {
    send_error('An account with this email address already exists.', 409);
}

// Hash password with bcrypt
$passwordHash = password_hash($password, PASSWORD_BCRYPT);

// Insert into users table
$insertUserStmt = $pdo->prepare('
    INSERT INTO users (email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
    VALUES (:email, :password_hash, :first_name, :last_name, "customer", 1, NOW(), NOW())
');
$insertUserStmt->execute([
    'email'         => $email,
    'password_hash' => $passwordHash,
    'first_name'    => $firstName !== '' ? $firstName : null,
    'last_name'     => $lastName !== '' ? $lastName : null,
]);

$userId = (int)$pdo->lastInsertId();

// Retrieve created user
$userStmt = $pdo->prepare('SELECT id, email, first_name, last_name, role, is_active FROM users WHERE id = :id');
$userStmt->execute(['id' => $userId]);
$newUser = $userStmt->fetch();

if (!$newUser) {
    send_error('Failed to create account. Please try again.', 500);
}

// Generate token pair
$tokens = create_token_pair($newUser);

// Store refresh token
$tokenStmt = $pdo->prepare('
    INSERT INTO refresh_tokens (user_id, token_hash, issued_at, expires_at, revoked)
    VALUES (:user_id, :token_hash, NOW(), :expires_at, 0)
');
$tokenStmt->execute([
    'user_id'    => $userId,
    'token_hash' => $tokens['token_hash'],
    'expires_at' => $tokens['expires_at'],
]);

// Return 201 Created with tokens & user object
send_json([
    'message' => 'Registration successful.',
    'access'  => $tokens['access'],
    'refresh' => $tokens['refresh'],
    'user'    => [
        'id'         => (int)$newUser['id'],
        'email'      => $newUser['email'],
        'first_name' => $newUser['first_name'] ?? '',
        'last_name'  => $newUser['last_name'] ?? '',
        'role'       => $newUser['role'],
    ],
], 201);

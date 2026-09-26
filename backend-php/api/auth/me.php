<?php
/**
 * GET /api/auth/me.php
 * Protected endpoint returning profile of the currently authenticated user
 * Verifies require_auth() middleware
 */

declare(strict_types=1);

require_once __DIR__ . '/../../includes/cors.php';
require_once __DIR__ . '/../../includes/response.php';
require_once __DIR__ . '/../../includes/auth.php';

// Requires valid Bearer access token
$currentUser = require_auth();

send_json([
    'message' => 'Authenticated successfully.',
    'user'    => [
        'id'         => (int)$currentUser['id'],
        'email'      => $currentUser['email'],
        'first_name' => $currentUser['first_name'] ?? '',
        'last_name'  => $currentUser['last_name'] ?? '',
        'role'       => $currentUser['role'],
        'is_active'  => (int)$currentUser['is_active'],
    ]
], 200);

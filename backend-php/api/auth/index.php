<?php
/**
 * Auth Router Dispatcher
 * Dispatches /api/auth/login/, /api/auth/refresh/, /api/auth/token/refresh/, /api/auth/me/
 */

declare(strict_types=1);

$uri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?? '';

if (preg_match('#/login/?$#i', $uri)) {
    require __DIR__ . '/login.php';
    exit;
}

if (preg_match('#/(token/)?refresh/?$#i', $uri)) {
    require __DIR__ . '/refresh.php';
    exit;
}

if (preg_match('#/me/?$#i', $uri)) {
    require __DIR__ . '/me.php';
    exit;
}

require_once __DIR__ . '/../../includes/response.php';
send_error('Endpoint not found under /api/auth/. Supported: /login/, /refresh/, /me/', 404);

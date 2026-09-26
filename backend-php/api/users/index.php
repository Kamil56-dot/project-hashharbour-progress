<?php
/**
 * Users API Resource Endpoint [Scaffold]
 * Handles GET /api/users/me/ and user profile management
 * Full implementation scheduled for Phase 2/3.
 */

declare(strict_types=1);

require_once __DIR__ . '/../../includes/cors.php';
require_once __DIR__ . '/../../includes/response.php';

send_json([
    'resource' => 'users',
    'status'   => 'scaffolded',
    'phase'    => 'Phase 1 - Scaffold ready for implementation'
]);

<?php
/**
 * Bookings Totals API Endpoint
 * Handles:
 * - GET /api/bookings/totals/ : Authenticated (staff only: super_admin, admin) - Returns aggregates by status
 */

declare(strict_types=1);

require_once __DIR__ . '/../../includes/cors.php';
require_once __DIR__ . '/../../includes/response.php';
require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../config/db.php';

// Method check: GET only
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'GET') {
    send_error('Method not allowed.', 405);
}

// Authentication & Role check: super_admin and admin only
$currentUser = require_role(['super_admin', 'admin']);

$pdo = get_db();

// Initialise all 5 known statuses to zero
$statuses = ['pending', 'confirmed', 'in_transit', 'completed', 'cancelled'];
$result = [];
foreach ($statuses as $st) {
    $result[$st] = [
        'count' => 0,
        'amount' => 0.0,
    ];
}

// One SQL aggregate query using prepared statement / PDO
$stmt = $pdo->query('
    SELECT status,
           COUNT(*) AS booking_count,
           COALESCE(SUM(COALESCE(total_amount, price_snapshot * quantity)), 0) AS total_amount
    FROM bookings
    GROUP BY status
');
$rows = $stmt->fetchAll();

foreach ($rows as $row) {
    $st = (string)($row['status'] ?? '');
    if (isset($result[$st])) {
        $result[$st]['count'] = (int)$row['booking_count'];
        $result[$st]['amount'] = round((float)$row['total_amount'], 2);
    }
}

send_json($result, 200);

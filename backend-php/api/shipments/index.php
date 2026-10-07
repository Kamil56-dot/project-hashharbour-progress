<?php
/**
 * Shipments API Endpoint
 * Handles:
 * - GET /api/shipments/track/?tracking_no={id} : Public tracking lookup (Unauthenticated)
 * - GET /api/shipments/?tracking_no={id}       : Public tracking lookup (Unauthenticated)
 * - GET /api/shipments/{id}                   : Shipment detail by ID
 * - GET /api/shipments/                       : Authenticated list (Customer: own shipments only; Staff: all shipments)
 */

declare(strict_types=1);

require_once __DIR__ . '/../../includes/cors.php';
require_once __DIR__ . '/../../includes/response.php';
require_once __DIR__ . '/../../config/db.php';

if (empty($_GET) && !empty($_SERVER['QUERY_STRING'])) {
    parse_str($_SERVER['QUERY_STRING'], $_GET);
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$uri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?? '';

if ($method !== 'GET') {
    send_error('Method not allowed.', 405);
}

$pdo = get_db();

// ------------------------------------------------------------------------------
// 1. PUBLIC TRACKING LOOKUP: /api/shipments/track/?tracking_no=... or ?tracking_no=...
// Never requires authentication; completely public for TrackingModal and clients
// ------------------------------------------------------------------------------
$isTrackingRoute = (bool)preg_match('#/shipments/track/?$#i', $uri);
if (isset($_GET['tracking_no']) || $isTrackingRoute) {
    $trackingNo = trim((string)($_GET['tracking_no'] ?? ''));

    if (empty($trackingNo)) {
        send_error('Tracking number parameter is required.', 400);
    }

    $stmt = $pdo->prepare('SELECT * FROM shipments WHERE UPPER(tracking_number) = UPPER(:no) LIMIT 1');
    $stmt->execute(['no' => $trackingNo]);
    $shipment = $stmt->fetch();

    if (!$shipment) {
        send_error('Shipment not found', 404);
    }

    $shipment['id'] = (int)$shipment['id'];
    $shipment['progress_percent'] = (int)$shipment['progress_percent'];
    if (array_key_exists('booking_id', $shipment)) {
        $shipment['booking_id'] = $shipment['booking_id'] !== null ? (int)$shipment['booking_id'] : null;
    }
    if (array_key_exists('user_id', $shipment)) {
        $shipment['user_id'] = $shipment['user_id'] !== null ? (int)$shipment['user_id'] : null;
    }

    send_json($shipment, 200);
}

// ------------------------------------------------------------------------------
// 2. DETAIL BY ID: /api/shipments/{id}
// ------------------------------------------------------------------------------
$id = null;
if (isset($_GET['id']) && is_numeric($_GET['id'])) {
    $id = (int)$_GET['id'];
} elseif (preg_match('#/shipments/(\d+)/?$#i', $uri, $matches)) {
    $id = (int)$matches[1];
}

if ($id !== null) {
    $stmt = $pdo->prepare('SELECT * FROM shipments WHERE id = :id LIMIT 1');
    $stmt->execute(['id' => $id]);
    $shipment = $stmt->fetch();

    if (!$shipment) {
        send_error('Shipment not found', 404);
    }

    $shipment['id'] = (int)$shipment['id'];
    $shipment['progress_percent'] = (int)$shipment['progress_percent'];
    if (array_key_exists('booking_id', $shipment)) {
        $shipment['booking_id'] = $shipment['booking_id'] !== null ? (int)$shipment['booking_id'] : null;
    }
    if (array_key_exists('user_id', $shipment)) {
        $shipment['user_id'] = $shipment['user_id'] !== null ? (int)$shipment['user_id'] : null;
    }

    send_json($shipment, 200);
}

// ------------------------------------------------------------------------------
// 3. LIST OF SHIPMENTS: /api/shipments/
// Requires authentication:
// - Customers may list ONLY their own shipments (user_id = currentUser.id)
// - Staff (super_admin, admin, manager) may list all shipments
// - Unauthenticated requests receive 401 Unauthorized
// ------------------------------------------------------------------------------
require_once __DIR__ . '/../../includes/auth.php';
$currentUser = require_auth();

if ($currentUser['role'] === 'customer') {
    $stmt = $pdo->prepare('SELECT * FROM shipments WHERE user_id = :user_id ORDER BY id DESC');
    $stmt->execute(['user_id' => $currentUser['id']]);
} else {
    // Staff sees all shipments
    $stmt = $pdo->query('SELECT * FROM shipments ORDER BY id ASC');
}

$shipments = $stmt->fetchAll();

foreach ($shipments as &$s) {
    $s['id'] = (int)$s['id'];
    $s['progress_percent'] = (int)$s['progress_percent'];
    if (array_key_exists('booking_id', $s)) {
        $s['booking_id'] = $s['booking_id'] !== null ? (int)$s['booking_id'] : null;
    }
    if (array_key_exists('user_id', $s)) {
        $s['user_id'] = $s['user_id'] !== null ? (int)$s['user_id'] : null;
    }
}
unset($s);

send_json($shipments, 200);

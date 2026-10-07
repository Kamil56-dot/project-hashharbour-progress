<?php
/**
 * Shipments API Endpoint
 * Handles:
 * - GET /api/shipments/track/?tracking_no={id} : Public tracking lookup matching Django track action
 * - GET /api/shipments/                       : Authenticated list of shipments (customer: own only; staff: all)
 * - GET /api/shipments/{id}                   : Authenticated shipment detail (owner or staff only)
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

// 1. Tracking query action: /api/shipments/track/?tracking_no=... (PUBLIC)
if (isset($_GET['tracking_no']) || preg_match('#/shipments/track/?$#i', $uri)) {
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

    send_json($shipment, 200);
}

// All subsequent shipment endpoints require authentication
require_once __DIR__ . '/../../includes/auth.php';
$currentUser = require_auth();
$isStaff = in_array($currentUser['role'], ['super_admin', 'admin', 'manager'], true);

// 2. Detail by ID
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

    // Permission check: staff gets all, customer gets only own
    if (!$isStaff && (int)$shipment['user_id'] !== (int)$currentUser['id']) {
        send_error('You do not have permission to view this shipment.', 403);
    }

    $shipment['id'] = (int)$shipment['id'];
    $shipment['progress_percent'] = (int)$shipment['progress_percent'];

    send_json($shipment, 200);
}

// 3. List of shipments: scoped per user role
if (!$isStaff) {
    $stmt = $pdo->prepare('SELECT * FROM shipments WHERE user_id = :user_id ORDER BY id ASC');
    $stmt->execute(['user_id' => $currentUser['id']]);
} else {
    $stmt = $pdo->query('SELECT * FROM shipments ORDER BY id ASC');
}
$shipments = $stmt->fetchAll();

foreach ($shipments as &$s) {
    $s['id'] = (int)$s['id'];
    $s['progress_percent'] = (int)$s['progress_percent'];
}
unset($s);

send_json($shipments, 200);

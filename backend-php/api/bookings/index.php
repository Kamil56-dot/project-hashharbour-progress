<?php
/**
 * Bookings API Endpoint
 * Handles:
 * - POST /api/bookings/     : Authenticated - Create booking with locked price_snapshot
 * - GET /api/bookings/      : Authenticated - Scoped by role (customer: own only; admin/operator: all)
 * - GET /api/bookings/{id}  : Authenticated - Booking detail (owner or admin/operator only)
 */

declare(strict_types=1);

require_once __DIR__ . '/../../includes/cors.php';
require_once __DIR__ . '/../../includes/response.php';
require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../config/db.php';

// Authentication required for all booking endpoints
$currentUser = require_auth();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$uri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?? '';

if (empty($_GET) && !empty($_SERVER['QUERY_STRING'])) {
    parse_str($_SERVER['QUERY_STRING'], $_GET);
}

// Extract ID from query param or URL slug
$id = null;
if (isset($_GET['id']) && is_numeric($_GET['id'])) {
    $id = (int)$_GET['id'];
} elseif (preg_match('#/bookings/(\d+)/?$#i', $uri, $matches)) {
    $id = (int)$matches[1];
}

$pdo = get_db();

// ------------------------------------------------------------------------------
// 1. GET: Read bookings
// ------------------------------------------------------------------------------
if ($method === 'GET') {
    if ($id !== null) {
        $stmt = $pdo->prepare('
            SELECT b.*, c.container_code, c.type AS container_type, c.size_ft AS container_size,
                   u.email AS customer_email, u.first_name AS customer_first_name, u.last_name AS customer_last_name
            FROM bookings b
            LEFT JOIN containers c ON b.container_id = c.id
            LEFT JOIN users u ON b.user_id = u.id
            WHERE b.id = :id
            LIMIT 1
        ');
        $stmt->execute(['id' => $id]);
        $booking = $stmt->fetch();

        if (!$booking) {
            send_error('Booking not found.', 404);
        }

        // Ownership and permission check
        $isOwner = (int)$booking['user_id'] === (int)$currentUser['id'];
        $isAdminOrOperator = in_array($currentUser['role'], ['admin', 'operator'], true);

        if (!$isOwner && !$isAdminOrOperator) {
            send_error('You do not have permission to view this booking.', 403);
        }

        $booking['id'] = (int)$booking['id'];
        $booking['user_id'] = (int)$booking['user_id'];
        $booking['container_id'] = (int)$booking['container_id'];
        $booking['price_snapshot'] = (float)$booking['price_snapshot'];

        send_json($booking, 200);
    }

    // List view: Scoped per user role
    if ($currentUser['role'] === 'customer') {
        $stmt = $pdo->prepare('
            SELECT b.*, c.container_code, c.type AS container_type, c.size_ft AS container_size
            FROM bookings b
            LEFT JOIN containers c ON b.container_id = c.id
            WHERE b.user_id = :user_id
            ORDER BY b.id DESC
        ');
        $stmt->execute(['user_id' => $currentUser['id']]);
    } else {
        // Admin / Operator sees all bookings
        $stmt = $pdo->query('
            SELECT b.*, c.container_code, c.type AS container_type, c.size_ft AS container_size,
                   u.email AS customer_email, u.first_name AS customer_first_name, u.last_name AS customer_last_name
            FROM bookings b
            LEFT JOIN containers c ON b.container_id = c.id
            LEFT JOIN users u ON b.user_id = u.id
            ORDER BY b.id DESC
        ');
    }

    $bookings = $stmt->fetchAll();
    foreach ($bookings as &$b) {
        $b['id'] = (int)$b['id'];
        $b['user_id'] = (int)$b['user_id'];
        $b['container_id'] = (int)$b['container_id'];
        $b['price_snapshot'] = (float)$b['price_snapshot'];
    }
    unset($b);

    send_json($bookings, 200);
}

// ------------------------------------------------------------------------------
// 2. POST: Create Booking with locked price_snapshot
// ------------------------------------------------------------------------------
if ($method === 'POST') {
    $input = get_json_input();

    $containerId = (int)($input['container_id'] ?? 0);
    $originPort = trim((string)($input['origin_port'] ?? ''));
    $destinationPort = trim((string)($input['destination_port'] ?? ''));
    $startDate = !empty($input['start_date']) ? (string)$input['start_date'] : null;
    $endDate = !empty($input['end_date']) ? (string)$input['end_date'] : null;

    if ($containerId <= 0) {
        send_error('container_id is required.', 400);
    }

    // Look up container price and availability
    $stmt = $pdo->prepare('SELECT id, container_code, type, price, is_bookable FROM containers WHERE id = :id LIMIT 1');
    $stmt->execute(['id' => $containerId]);
    $container = $stmt->fetch();

    if (!$container) {
        send_error('Container not found.', 404);
    }

    if ((int)$container['is_bookable'] === 0) {
        send_error("Container '{$container['type']}' is currently not available for booking.", 400);
    }

    // PRICE-SNAPSHOT PATTERN: Lock the exact container price at booking execution time
    $priceSnapshot = (float)$container['price'];

    // Generate unique booking_reference: "BK-" + 6 random digits
    do {
        $bookingReference = 'BK-' . str_pad((string)random_int(100000, 999999), 6, '0', STR_PAD_LEFT);
        $checkRef = $pdo->prepare('SELECT id FROM bookings WHERE booking_reference = :ref LIMIT 1');
        $checkRef->execute(['ref' => $bookingReference]);
    } while ($checkRef->fetch());

    // Insert new booking record with status = 'pending'
    $insertStmt = $pdo->prepare('
        INSERT INTO bookings (
            booking_reference, user_id, container_id, price_snapshot, status,
            origin_port, destination_port, start_date, end_date, created_at, updated_at
        ) VALUES (
            :ref, :user_id, :container_id, :price_snapshot, :status,
            :origin, :dest, :start_date, :end_date, NOW(), NOW()
        )
    ');

    $insertStmt->execute([
        'ref'            => $bookingReference,
        'user_id'        => $currentUser['id'],
        'container_id'   => $container['id'],
        'price_snapshot' => $priceSnapshot,
        'status'         => 'pending',
        'origin'         => !empty($originPort) ? $originPort : null,
        'dest'           => !empty($destinationPort) ? $destinationPort : null,
        'start_date'     => $startDate,
        'end_date'       => $endDate,
    ]);

    $newBookingId = (int)$pdo->lastInsertId();

    // Fetch the created record with container metadata
    $fetchStmt = $pdo->prepare('
        SELECT b.*, c.container_code, c.type AS container_type, c.size_ft AS container_size
        FROM bookings b
        LEFT JOIN containers c ON b.container_id = c.id
        WHERE b.id = :id
        LIMIT 1
    ');
    $fetchStmt->execute(['id' => $newBookingId]);
    $createdBooking = $fetchStmt->fetch();

    $createdBooking['id'] = (int)$createdBooking['id'];
    $createdBooking['user_id'] = (int)$createdBooking['user_id'];
    $createdBooking['container_id'] = (int)$createdBooking['container_id'];
    $createdBooking['price_snapshot'] = (float)$createdBooking['price_snapshot'];

    send_json($createdBooking, 201);
}

send_error('Method not allowed.', 405);

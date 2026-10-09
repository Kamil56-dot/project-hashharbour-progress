<?php
/**
 * Bookings API Endpoint
 * Handles:
 * - POST  /api/bookings/            : Authenticated - Create booking (standard or checkout mode) with locked price_snapshot
 * - GET   /api/bookings/            : Authenticated - Scoped by role (customer: own only; staff: all)
 * - GET   /api/bookings/{id}        : Authenticated - Booking detail (owner or staff only)
 * - POST  /api/bookings/{id}/cancel : Authenticated - Staff only cancel booking (non-completed/non-cancelled)
 * - PATCH /api/bookings/{id}/status : Authenticated - Staff only status transition (pending -> confirmed -> in_transit -> completed)
 */

declare(strict_types=1);

require_once __DIR__ . '/../../includes/cors.php';
require_once __DIR__ . '/../../includes/response.php';
require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../includes/notifications.php';
require_once __DIR__ . '/../../config/db.php';
if (file_exists(__DIR__ . '/../../config/constants.php')) {
    require_once __DIR__ . '/../../config/constants.php';
}

// Authentication required for all booking endpoints
$currentUser = require_auth();
$isStaff = in_array($currentUser['role'], ['super_admin', 'admin'], true);

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$uri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?? '';

if (empty($_GET) && !empty($_SERVER['QUERY_STRING'])) {
    parse_str($_SERVER['QUERY_STRING'], $_GET);
}

// Extract ID and action from query param or URL slug
$id = null;
$action = $_GET['action'] ?? null;

if (preg_match('#/bookings/(\d+)/cancel/?$#i', $uri, $matches)) {
    $id = (int)$matches[1];
    $action = 'cancel';
} elseif (preg_match('#/bookings/(\d+)/status/?$#i', $uri, $matches)) {
    $id = (int)$matches[1];
    $action = 'status';
} elseif (isset($_GET['id']) && is_numeric($_GET['id'])) {
    $id = (int)$_GET['id'];
} elseif (preg_match('#/bookings/(\d+)/?$#i', $uri, $matches)) {
    $id = (int)$matches[1];
}

$pdo = get_db();

/**
 * Fetch a booking record with containers and customer user metadata
 */
function fetch_booking_with_meta(PDO $pdo, int $id): ?array
{
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

    if ($booking) {
        $booking['id'] = (int)$booking['id'];
        $booking['user_id'] = (int)$booking['user_id'];
        $booking['container_id'] = (int)$booking['container_id'];
        $booking['quantity'] = isset($booking['quantity']) ? (int)$booking['quantity'] : 1;
        $booking['insurance_selected'] = isset($booking['insurance_selected']) ? (int)$booking['insurance_selected'] : 0;
        $booking['price_snapshot'] = (float)$booking['price_snapshot'];
        $booking['total_amount'] = isset($booking['total_amount']) && $booking['total_amount'] !== null ? (float)$booking['total_amount'] : null;
        return $booking;
    }
    return null;
}

// ------------------------------------------------------------------------------
// 1. GET: Read bookings
// ------------------------------------------------------------------------------
if ($method === 'GET' && $action === null) {
    if ($id !== null) {
        $booking = fetch_booking_with_meta($pdo, $id);

        if (!$booking) {
            send_error('Booking not found.', 404);
        }

        // Ownership and permission check
        $isOwner = (int)$booking['user_id'] === (int)$currentUser['id'];

        if (!$isOwner && !$isStaff) {
            send_error('You do not have permission to view this booking.', 403);
        }

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
        // Staff (super_admin, admin) sees all bookings
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
        $b['quantity'] = isset($b['quantity']) ? (int)$b['quantity'] : 1;
        $b['insurance_selected'] = isset($b['insurance_selected']) ? (int)$b['insurance_selected'] : 0;
        $b['price_snapshot'] = (float)$b['price_snapshot'];
        $b['total_amount'] = isset($b['total_amount']) && $b['total_amount'] !== null ? (float)$b['total_amount'] : null;
    }
    unset($b);

    send_json($bookings, 200);
}

// ------------------------------------------------------------------------------
// 2. POST: Create Booking OR Cancel Booking
// ------------------------------------------------------------------------------
if ($method === 'POST') {
    // 2a. Cancel Booking: POST /api/bookings/{id}/cancel
    if ($action === 'cancel') {
        if ($id === null) {
            send_error('Booking ID is required for cancellation.', 400);
        }

        $booking = fetch_booking_with_meta($pdo, $id);
        if (!$booking) {
            send_error('Booking not found.', 404);
        }

        // Only staff can cancel bookings
        if (!$isStaff) {
            send_error('Only staff can cancel bookings.', 403);
        }

        // Staff can cancel any booking whose status is not completed and not cancelled
        if (in_array($booking['status'], ['completed', 'cancelled'], true)) {
            send_error("Cannot cancel booking with status '{$booking['status']}'.", 409);
        }

        $input = get_json_input();
        $reason = isset($input['reason']) ? trim((string)$input['reason']) : null;
        if ($reason !== null) {
            if (mb_strlen($reason) > 255) {
                $reason = mb_substr($reason, 0, 255);
            }
            if ($reason === '') {
                $reason = null;
            }
        }

        try {
            $pdo->beginTransaction();

            // On success: status = 'cancelled', cancelled_at = NOW(), cancelled_by = current user id,
            // cancel_reason = reason or NULL, refund_status unchanged ('none')
            $updateStmt = $pdo->prepare('
                UPDATE bookings
                SET status = "cancelled",
                    cancelled_at = NOW(),
                    cancelled_by = :cancelled_by,
                    cancel_reason = :cancel_reason,
                    updated_at = NOW()
                WHERE id = :id
            ');
            $updateStmt->execute([
                'cancelled_by'  => $currentUser['id'],
                'cancel_reason' => $reason,
                'id'            => $id,
            ]);

            $ownerId = (int)$booking['user_id'];
            $actingUserId = (int)$currentUser['id'];
            if ($ownerId !== $actingUserId) {
                $ref = (string)$booking['booking_reference'];
                notify_user(
                    $pdo,
                    $ownerId,
                    $id,
                    'booking_cancelled',
                    'Booking Cancelled',
                    "Your booking {$ref} has been cancelled. Refund will Credited Under 7-9 Busssiness Days."
                );
            }

            $pdo->commit();
        } catch (Throwable $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            send_error('Failed to cancel booking: ' . $e->getMessage(), 500);
        }

        $updatedBooking = fetch_booking_with_meta($pdo, $id);
        send_json($updatedBooking, 200);
    }

    // 2b. Create Booking: POST /api/bookings/
    if ($action === null && $id === null) {
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

        // PRICE-SNAPSHOT PATTERN: Lock the exact container unit price at booking execution time
        $priceSnapshot = (float)$container['price'];

        // Checkout mode applies when payment_method is present in the payload
        $isCheckoutMode = array_key_exists('payment_method', $input);

        $quantity = 1;
        $insuranceSelected = 0;
        $paymentMethod = null;
        $totalAmount = null;
        $billingName = null;
        $billingAddress = null;
        // ALL newly created bookings, including checkout mode, start as 'pending'
        $status = 'pending';

        if ($isCheckoutMode) {
            // Validate quantity: integer >= 1 and <= 1000
            $rawQty = $input['quantity'] ?? null;
            if (!is_numeric($rawQty) || (int)$rawQty != $rawQty || is_bool($rawQty)) {
                send_error('Quantity must be an integer.', 400);
            }
            $quantity = (int)$rawQty;
            if ($quantity < 1 || $quantity > 1000) {
                send_error('Quantity must be between 1 and 1000.', 400);
            }

            // Validate payment_method: one of card, upi, bank, wallet
            $rawPayment = is_string($input['payment_method']) ? trim($input['payment_method']) : '';
            $allowedPayments = ['card', 'upi', 'bank', 'wallet'];
            if (!in_array($rawPayment, $allowedPayments, true)) {
                send_error('Invalid payment method. Allowed values: card, upi, bank, wallet.', 400);
            }
            $paymentMethod = $rawPayment;

            // Validate billing: object with name, address, city, state, country, postal_code
            if (!isset($input['billing']) || !is_array($input['billing'])) {
                send_error('Billing details are required.', 400);
            }
            $billing = $input['billing'];
            $requiredBillingFields = [
                'name'        => 150,
                'address'     => 200,
                'city'        => 100,
                'state'       => 100,
                'country'     => 100,
                'postal_code' => 50,
            ];
            $cleanBilling = [];
            foreach ($requiredBillingFields as $field => $maxLen) {
                if (!isset($billing[$field]) || !is_string($billing[$field])) {
                    send_error("Billing {$field} is required.", 400);
                }
                $val = trim($billing[$field]);
                if ($val === '') {
                    send_error("Billing {$field} cannot be empty.", 400);
                }
                if (mb_strlen($val) > $maxLen) {
                    send_error("Billing {$field} exceeds maximum length of {$maxLen}.", 400);
                }
                $cleanBilling[$field] = $val;
            }

            $billingName = $cleanBilling['name'];
            $formattedAddress = implode(', ', [
                $cleanBilling['address'],
                $cleanBilling['city'],
                $cleanBilling['state'],
                $cleanBilling['country'],
                $cleanBilling['postal_code'],
            ]);
            if (mb_strlen($formattedAddress) > 500) {
                $formattedAddress = mb_substr($formattedAddress, 0, 500);
            }
            $billingAddress = $formattedAddress;

            // Validate insurance_selected: boolean-ish
            $insuranceRaw = $input['insurance_selected'] ?? false;
            $insuranceSelected = filter_var($insuranceRaw, FILTER_VALIDATE_BOOLEAN) ? 1 : 0;

            // Server computes total itself, ignoring any client-sent amount/price
            $feeHandling = defined('FEE_PORT_HANDLING') ? FEE_PORT_HANDLING : 120.0;
            $feeDoc = defined('FEE_DOCUMENTATION') ? FEE_DOCUMENTATION : 45.0;
            $feeIns = defined('FEE_INSURANCE') ? FEE_INSURANCE : 85.0;
            $insuranceFee = $insuranceSelected ? $feeIns : 0.0;
            $totalAmount = round(($priceSnapshot * $quantity) + $feeHandling + $feeDoc + $insuranceFee, 2);
        }

        // Generate unique booking_reference: "BK-" + 6 random digits
        do {
            $bookingReference = 'BK-' . str_pad((string)random_int(100000, 999999), 6, '0', STR_PAD_LEFT);
            $checkRef = $pdo->prepare('SELECT id FROM bookings WHERE booking_reference = :ref LIMIT 1');
            $checkRef->execute(['ref' => $bookingReference]);
        } while ($checkRef->fetch());

        $customerName = '';
        if (!empty($billingName)) {
            $customerName = trim((string)$billingName);
        } else {
            $userFullName = trim(($currentUser['first_name'] ?? '') . ' ' . ($currentUser['last_name'] ?? ''));
            if ($userFullName !== '') {
                $customerName = $userFullName;
            }
        }

        try {
            $pdo->beginTransaction();

            // Insert new booking record
            $insertStmt = $pdo->prepare('
                INSERT INTO bookings (
                    booking_reference, user_id, container_id, quantity, insurance_selected,
                    price_snapshot, status, payment_method, total_amount, billing_name, billing_address,
                    origin_port, destination_port, start_date, end_date, created_at, updated_at
                ) VALUES (
                    :ref, :user_id, :container_id, :quantity, :insurance_selected,
                    :price_snapshot, :status, :payment_method, :total_amount, :billing_name, :billing_address,
                    :origin, :dest, :start_date, :end_date, NOW(), NOW()
                )
            ');

            $insertStmt->execute([
                'ref'                => $bookingReference,
                'user_id'            => $currentUser['id'],
                'container_id'       => $container['id'],
                'quantity'           => $quantity,
                'insurance_selected' => $insuranceSelected,
                'price_snapshot'     => $priceSnapshot,
                'status'             => $status,
                'payment_method'     => $paymentMethod,
                'total_amount'       => $totalAmount !== null ? number_format($totalAmount, 2, '.', '') : null,
                'billing_name'       => $billingName,
                'billing_address'    => $billingAddress,
                'origin'             => !empty($originPort) ? $originPort : null,
                'dest'               => !empty($destinationPort) ? $destinationPort : null,
                'start_date'         => $startDate,
                'end_date'           => $endDate,
            ]);

            $newBookingId = (int)$pdo->lastInsertId();

            notify_staff_booking_created($pdo, $newBookingId, $bookingReference, $customerName, (int)$currentUser['id']);

            $pdo->commit();
        } catch (Throwable $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            send_error('Failed to create booking: ' . $e->getMessage(), 500);
        }

        $createdBooking = fetch_booking_with_meta($pdo, $newBookingId);
        send_json($createdBooking, 201);
    }
}

// ------------------------------------------------------------------------------
// 3. PATCH: Status Endpoint: PATCH /api/bookings/{id}/status
// ------------------------------------------------------------------------------
if ($method === 'PATCH' && $action === 'status') {
    if (!$isStaff) {
        send_error('Only staff can update booking status.', 403);
    }

    if ($id === null) {
        send_error('Booking ID is required.', 400);
    }

    $booking = fetch_booking_with_meta($pdo, $id);
    if (!$booking) {
        send_error('Booking not found.', 404);
    }

    // Booking already cancelled or completed -> 409
    if ($booking['status'] === 'cancelled' || $booking['status'] === 'completed') {
        send_error("Cannot update status of a {$booking['status']} booking.", 409);
    }

    $input = get_json_input();
    $newStatus = trim((string)($input['status'] ?? ''));

    // Setting 'cancelled' through this endpoint -> 422
    if ($newStatus === 'cancelled') {
        send_error("Cannot cancel booking via status endpoint. Use the cancel endpoint instead.", 422);
    }

    // Strict forward flow only: pending -> confirmed -> in_transit -> completed
    $allowedFlow = [
        'pending'    => 'confirmed',
        'confirmed'  => 'in_transit',
        'in_transit' => 'completed',
    ];

    if (!isset($allowedFlow[$booking['status']]) || $allowedFlow[$booking['status']] !== $newStatus) {
        send_error("Invalid status transition from '{$booking['status']}' to '{$newStatus}'. Status must follow: pending -> confirmed -> in_transit -> completed.", 422);
    }

    try {
        $pdo->beginTransaction();

        $updateStmt = $pdo->prepare('
            UPDATE bookings
            SET status = :status,
                updated_at = NOW()
            WHERE id = :id
        ');
        $updateStmt->execute([
            'status' => $newStatus,
            'id'     => $id,
        ]);

        $ownerId = (int)$booking['user_id'];
        $actingUserId = (int)$currentUser['id'];
        if ($ownerId !== $actingUserId) {
            $ref = (string)$booking['booking_reference'];
            $statusLabel = notification_status_label($newStatus);
            notify_user(
                $pdo,
                $ownerId,
                $id,
                'booking_status_' . $newStatus,
                'Booking Status Updated',
                "Your booking {$ref} is now {$statusLabel}."
            );
        }

        $pdo->commit();
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        send_error('Failed to update booking status: ' . $e->getMessage(), 500);
    }

    $updatedBooking = fetch_booking_with_meta($pdo, $id);
    send_json($updatedBooking, 200);
}

send_error('Method not allowed.', 405);

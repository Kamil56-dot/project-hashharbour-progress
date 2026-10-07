<?php
/**
 * Phase 6 Verification Test Suite
 * Tests:
 * 1. Cancel own booking (Customer) -> 200, status=cancelled, cancelled_at set, price_snapshot intact
 * 2. Cancel other user's booking (Cross-tenant customer) -> 403 Forbidden
 * 3. Customer attempts general status change -> 403 Forbidden
 * 4. Staff updates status (Admin) -> 200 OK
 * 5. Public tracking query without auth -> 200 OK
 * 6. Shipments list without auth -> 401 Unauthorized
 * 7. Shipments list with Customer auth -> Only customer shipments
 * 8. Shipments list with Staff auth -> All shipments
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/db.php';

$baseUrl = 'http://localhost/hashharbour-api';

function run_request(string $method, string $url, ?array $body = null, ?string $token = null): array
{
    $ch = curl_init();
    $headers = ['Content-Type: application/json'];
    if ($token !== null) {
        $headers[] = 'Authorization: Bearer ' . $token;
    }

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    if ($body !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    }

    $response = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $json = json_decode((string)$response, true);
    return ['status' => $status, 'data' => $json, 'raw' => $response];
}

echo "======================================================================\n";
echo "       HASHHARBOUR PHASE 6 - BOOKINGS & SHIPMENTS ALIGNMENT TEST      \n";
echo "======================================================================\n\n";

// [SETUP] Obtain Auth Tokens
echo "[SETUP] Authenticating Customer (demo@hashharbour.com)...\n";
$custRes = run_request('POST', "{$baseUrl}/api/auth/login.php", [
    'email' => 'demo@hashharbour.com',
    'password' => 'password123'
]);
$customerToken = $custRes['data']['access'] ?? null;
if (!$customerToken) {
    die("Setup failed: could not authenticate customer.\n");
}

echo "[SETUP] Authenticating Admin (admin@hashharbour.com)...\n";
$adminRes = run_request('POST', "{$baseUrl}/api/auth/login.php", [
    'email' => 'admin@hashharbour.com',
    'password' => 'password123'
]);
$adminToken = $adminRes['data']['access'] ?? null;
if (!$adminToken) {
    die("Setup failed: could not authenticate admin.\n");
}

// Create a booking owned by customer
$bookingRes = run_request('POST', "{$baseUrl}/api/bookings/", [
    'container_id' => 1,
    'origin_port' => 'Mumbai JNPT, IN',
    'destination_port' => 'Rotterdam, NL',
    'start_date' => '2026-11-01',
    'end_date' => '2026-11-20'
], $customerToken);
$customerBooking = $bookingRes['data'];
$customerBookingId = $customerBooking['id'] ?? null;
$originalPriceSnapshot = $customerBooking['price_snapshot'] ?? null;

if (!$customerBookingId) {
    die("Setup failed: could not create customer booking.\n");
}

echo "Created test booking ID: {$customerBookingId} with locked price_snapshot: {$originalPriceSnapshot}\n\n";

$testsPassed = 0;
$totalTests = 8;

// ----------------------------------------------------------------------
// TEST 1: Customer Cancels Own Booking
// ----------------------------------------------------------------------
echo "[TEST 1] Customer cancels own pending/confirmed booking...\n";
$cancelRes = run_request('POST', "{$baseUrl}/api/bookings/{$customerBookingId}/cancel", [
    'cancel_reason' => 'Schedule changed by exporter'
], $customerToken);

echo "Status: {$cancelRes['status']}\n";
$bData = $cancelRes['data']['booking'] ?? $cancelRes['data'];
if (
    $cancelRes['status'] === 200 &&
    ($bData['status'] ?? '') === 'cancelled' &&
    !empty($bData['cancelled_at']) &&
    (float)$bData['price_snapshot'] === (float)$originalPriceSnapshot
) {
    echo ">>> TEST 1 PASSED! (Status cancelled, cancelled_at recorded, price_snapshot immutable)\n\n";
    $testsPassed++;
} else {
    echo ">>> TEST 1 FAILED! Raw: {$cancelRes['raw']}\n\n";
}

// ----------------------------------------------------------------------
// TEST 2: Customer Attempts to Cancel Another User's Booking
// ----------------------------------------------------------------------
echo "[TEST 2] Customer attempts to cancel another user's booking...\n";
// Create booking under admin user
$adminBookingRes = run_request('POST', "{$baseUrl}/api/bookings/", [
    'container_id' => 2,
    'origin_port' => 'Dubai Port, AE',
    'destination_port' => 'Hamburg, DE'
], $adminToken);
$adminBookingId = $adminBookingRes['data']['id'] ?? null;

$crossCancelRes = run_request('POST', "{$baseUrl}/api/bookings/{$adminBookingId}/cancel", [
    'cancel_reason' => 'Malicious cancel attempt'
], $customerToken);

echo "Status: {$crossCancelRes['status']}\n";
if ($crossCancelRes['status'] === 403) {
    echo ">>> TEST 2 PASSED! (Cross-tenant cancellation blocked with 403 Forbidden)\n\n";
    $testsPassed++;
} else {
    echo ">>> TEST 2 FAILED! Raw: {$crossCancelRes['raw']}\n\n";
}

// ----------------------------------------------------------------------
// TEST 3: Customer Attempts General Status Change (Not Cancel)
// ----------------------------------------------------------------------
echo "[TEST 3] Customer attempts to update booking status directly...\n";
$custUpdateRes = run_request('PATCH', "{$baseUrl}/api/bookings/{$customerBookingId}", [
    'status' => 'in_transit'
], $customerToken);

echo "Status: {$custUpdateRes['status']}\n";
if ($custUpdateRes['status'] === 403) {
    echo ">>> TEST 3 PASSED! (Customer status update blocked with 403 Forbidden)\n\n";
    $testsPassed++;
} else {
    echo ">>> TEST 3 FAILED! Raw: {$custUpdateRes['raw']}\n\n";
}

// ----------------------------------------------------------------------
// TEST 4: Staff Updates Booking Status (Admin)
// ----------------------------------------------------------------------
echo "[TEST 4] Staff (Admin) updates booking status to 'in_transit'...\n";
$staffUpdateRes = run_request('PATCH', "{$baseUrl}/api/bookings/{$adminBookingId}", [
    'status' => 'in_transit'
], $adminToken);

echo "Status: {$staffUpdateRes['status']}\n";
$staffData = $staffUpdateRes['data']['booking'] ?? $staffUpdateRes['data'];
if ($staffUpdateRes['status'] === 200 && ($staffData['status'] ?? '') === 'in_transit') {
    echo ">>> TEST 4 PASSED! (Staff status update succeeded with 200 OK)\n\n";
    $testsPassed++;
} else {
    echo ">>> TEST 4 FAILED! Raw: {$staffUpdateRes['raw']}\n\n";
}

// ----------------------------------------------------------------------
// TEST 5: Public Tracking Lookup (No Authorization Header)
// ----------------------------------------------------------------------
echo "[TEST 5] Public tracking lookup for 'HH-100293' without Auth header...\n";
$publicTrackRes = run_request('GET', "{$baseUrl}/api/shipments/track/?tracking_no=HH-100293", null, null);

echo "Status: {$publicTrackRes['status']}\n";
if ($publicTrackRes['status'] === 200 && ($publicTrackRes['data']['tracking_number'] ?? '') === 'HH-100293') {
    echo ">>> TEST 5 PASSED! (Public tracking query returned 200 without auth)\n\n";
    $testsPassed++;
} else {
    echo ">>> TEST 5 FAILED! Raw: {$publicTrackRes['raw']}\n\n";
}

// ----------------------------------------------------------------------
// TEST 6: Shipments List Without Auth -> 401 Unauthorized
// ----------------------------------------------------------------------
echo "[TEST 6] GET /api/shipments/ without Auth header...\n";
$unauthListRes = run_request('GET', "{$baseUrl}/api/shipments/", null, null);

echo "Status: {$unauthListRes['status']}\n";
if ($unauthListRes['status'] === 401) {
    echo ">>> TEST 6 PASSED! (Listing shipments without auth rejected with 401)\n\n";
    $testsPassed++;
} else {
    echo ">>> TEST 6 FAILED! Raw: {$unauthListRes['raw']}\n\n";
}

// ----------------------------------------------------------------------
// TEST 7: Customer Lists Shipments (Scoped to Own User ID)
// ----------------------------------------------------------------------
echo "[TEST 7] Customer lists shipments (Only own shipments returned)...\n";
$pdo = get_db();
// Assign shipment 1 to customer 1 for testing
$pdo->exec('UPDATE shipments SET user_id = 1 WHERE id = 1');
$pdo->exec('UPDATE shipments SET user_id = 2 WHERE id = 2');

$custShipmentsRes = run_request('GET', "{$baseUrl}/api/shipments/", null, $customerToken);
echo "Status: {$custShipmentsRes['status']}\n";
$custCount = count($custShipmentsRes['data'] ?? []);
$allBelongToCustomer = true;
foreach ($custShipmentsRes['data'] as $s) {
    if ((int)$s['user_id'] !== 1) {
        $allBelongToCustomer = false;
    }
}

if ($custShipmentsRes['status'] === 200 && $custCount > 0 && $allBelongToCustomer) {
    echo ">>> TEST 7 PASSED! (Customer returned {$custCount} shipments, all scoped to user_id=1)\n\n";
    $testsPassed++;
} else {
    echo ">>> TEST 7 FAILED! Raw: {$custShipmentsRes['raw']}\n\n";
}

// ----------------------------------------------------------------------
// TEST 8: Staff Lists All Shipments
// ----------------------------------------------------------------------
echo "[TEST 8] Staff (Admin) lists shipments (All shipments returned)...\n";
$adminShipmentsRes = run_request('GET', "{$baseUrl}/api/shipments/", null, $adminToken);
echo "Status: {$adminShipmentsRes['status']}\n";
$adminCount = count($adminShipmentsRes['data'] ?? []);

if ($adminShipmentsRes['status'] === 200 && $adminCount >= 2) {
    echo ">>> TEST 8 PASSED! (Staff returned all {$adminCount} shipments across all users)\n\n";
    $testsPassed++;
} else {
    echo ">>> TEST 8 FAILED! Raw: {$adminShipmentsRes['raw']}\n\n";
}

echo "======================================================================\n";
echo "                 SUMMARY: {$testsPassed} / {$totalTests} TESTS PASSED\n";
echo "======================================================================\n";

if ($testsPassed === $totalTests) {
    echo "FINAL VERDICT: ALL PASS\n";
    exit(0);
} else {
    echo "FINAL VERDICT: FAIL\n";
    exit(1);
}

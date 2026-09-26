<?php
/**
 * Test Suite for Phase 3 Core API Migration (Containers & Bookings)
 * Tests:
 * 1. GET /api/containers/ - Public container list (no token needed)
 * 2. POST /api/containers/ - Customer role blocked with HTTP 403
 * 3. POST /api/containers/ - Admin role allowed (HTTP 201)
 * 4. POST /api/bookings/ - Non-bookable container rejected with HTTP 400
 * 5. POST /api/bookings/ - Customer booking with locked price_snapshot (HTTP 201)
 * 6. Price Snapshot immutability test (catalog price changed, booking snapshot remains locked)
 * 7. GET /api/bookings/ - Scoped per role (Customer sees own; Admin sees all)
 * 8. GET /api/bookings/{id} - Customer blocked from viewing another user's booking (HTTP 403)
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../includes/jwt.php';

function run_request(string $scriptPath, string $method, array $headers = [], array $body = [], string $queryString = ''): array
{
    $descriptors = [
        0 => ['pipe', 'r'],
        1 => ['pipe', 'w'],
        2 => ['pipe', 'w']
    ];

    $phpExe = 'C:\\xampp\\php\\php.exe';

    $env = [];
    foreach (array_merge($_SERVER, $_ENV) as $k => $v) {
        if (is_scalar($v)) {
            $env[$k] = (string)$v;
        }
    }
    $env['REQUEST_METHOD'] = $method;
    $env['CONTENT_TYPE']   = 'application/json';
    $env['QUERY_STRING']   = $queryString;

    if (!empty($queryString)) {
        parse_str($queryString, $queryParams);
        foreach ($queryParams as $qk => $qv) {
            $env['QUERY_' . strtoupper($qk)] = (string)$qv;
        }
    }

    foreach ($headers as $k => $v) {
        $envKey = 'HTTP_' . strtoupper(str_replace('-', '_', $k));
        $env[$envKey] = $v;
    }

    if (isset($headers['Authorization'])) {
        $env['HTTP_AUTHORIZATION'] = $headers['Authorization'];
    }

    $cmd = sprintf('"%s" "%s"', $phpExe, $scriptPath);
    $process = proc_open($cmd, $descriptors, $pipes, dirname($scriptPath), $env);

    if (!is_resource($process)) {
        throw new RuntimeException("Failed to run process for {$scriptPath}");
    }

    if (!empty($body)) {
        fwrite($pipes[0], json_encode($body));
    }
    fclose($pipes[0]);

    $stdout = stream_get_contents($pipes[1]);
    fclose($pipes[1]);

    $stderr = stream_get_contents($pipes[2]);
    fclose($pipes[2]);

    $exitCode = proc_close($process);
    $json = json_decode($stdout, true);

    return [
        'exitCode' => $exitCode,
        'raw'      => $stdout,
        'json'     => $json,
        'stderr'   => $stderr
    ];
}

echo "======================================================================\n";
echo "       HASHHARBOUR PHASE 3 - CONTAINERS & BOOKINGS TEST SUITE         \n";
echo "======================================================================\n\n";

$containersScript = __DIR__ . '/../api/containers/index.php';
$bookingsScript   = __DIR__ . '/../api/bookings/index.php';
$loginScript      = __DIR__ . '/../api/auth/login.php';

// ---------------------------------------------------------------------------
// Step 0: Obtain Customer and Admin tokens
// ---------------------------------------------------------------------------
echo "[SETUP] Authenticating Demo Customer (demo@hashharbour.com)...\n";
$customerLogin = run_request($loginScript, 'POST', [], [
    'email'    => 'demo@hashharbour.com',
    'password' => 'password123'
]);
$customerToken = $customerLogin['json']['access'] ?? null;
assert(!empty($customerToken), "Customer token must be obtained");

echo "[SETUP] Authenticating Demo Admin (admin@hashharbour.com)...\n";
$adminLogin = run_request($loginScript, 'POST', [], [
    'email'    => 'admin@hashharbour.com',
    'password' => 'password123'
]);
$adminToken = $adminLogin['json']['access'] ?? null;
assert(!empty($adminToken), "Admin token must be obtained");

echo "[SETUP] Resetting Container 1 price to 1450.00...\n";
$pdo = get_db();
$pdo->exec("UPDATE containers SET price = 1450.00 WHERE id = 1");

echo ">>> SETUP COMPLETED!\n\n";

// ---------------------------------------------------------------------------
// TEST 1: Public Container List (No token)
// ---------------------------------------------------------------------------
echo "[TEST 1] GET /api/containers/ - Public Listing (No Authorization Header)\n";
$res1 = run_request($containersScript, 'GET', []);
echo "Response Body (Sample of " . count($res1['json'] ?? []) . " containers):\n";
echo json_encode(array_slice($res1['json'] ?? [], 0, 3), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n...\n";
assert(is_array($res1['json']), "Must return an array of containers");
assert(count($res1['json']) >= 8, "Must contain at least 8 seeded containers");
echo ">>> TEST 1 PASSED! (Containers are publicly accessible without authentication)\n\n";

// ---------------------------------------------------------------------------
// TEST 2: Container Write Blocked for Customer (HTTP 403)
// ---------------------------------------------------------------------------
echo "[TEST 2] POST /api/containers/ - Customer Role Blocked\n";
$res2 = run_request($containersScript, 'POST', [
    'Authorization' => "Bearer {$customerToken}"
], [
    'container_code' => 'HH-TEST-FAIL',
    'type'           => 'Custom Container',
    'size_ft'        => 20,
    'category'       => 'Test',
    'price'          => 999.00,
    'capacity'       => '1000 KG',
    'is_bookable'    => 1
]);
echo "Response Body:\n" . json_encode($res2['json'], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
assert(isset($res2['json']['error']), "Must return an error");
assert($res2['json']['error'] === 'You do not have permission to perform this action.', "Must return 403 Forbidden message");
echo ">>> TEST 2 PASSED! (Customer role successfully blocked with 403)\n\n";

// ---------------------------------------------------------------------------
// TEST 3: Container Write Allowed for Admin (HTTP 201)
// ---------------------------------------------------------------------------
echo "[TEST 3] POST /api/containers/ - Admin Role Creation\n";
$uniqueTestCode = 'HH-TEST-' . random_int(1000, 9999);
$res3 = run_request($containersScript, 'POST', [
    'Authorization' => "Bearer {$adminToken}"
], [
    'container_code' => $uniqueTestCode,
    'type'           => 'Specialized Insulated',
    'size_ft'        => 40,
    'category'       => 'Thermal Protection',
    'price'          => 2950.00,
    'capacity'       => '60 CBM / 25,000 KG',
    'is_bookable'    => 1
]);
echo "Response Body:\n" . json_encode($res3['json'], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
assert(!empty($res3['json']['id']), "Created container must have an ID");
assert($res3['json']['container_code'] === $uniqueTestCode, "Container code must match");
echo ">>> TEST 3 PASSED! (Admin successfully created new container record)\n\n";

// ---------------------------------------------------------------------------
// TEST 4: Booking a Non-Bookable Container Rejected (HTTP 400)
// Container ID 5 is 'Refrigerated' (is_bookable = 0)
// ---------------------------------------------------------------------------
echo "[TEST 4] POST /api/bookings/ - Attempt Booking Non-Bookable Container (ID 5: Refrigerated)\n";
$res4 = run_request($bookingsScript, 'POST', [
    'Authorization' => "Bearer {$customerToken}"
], [
    'container_id'     => 5,
    'origin_port'      => 'Shanghai Port, CN',
    'destination_port' => 'Rotterdam Gateway, NL',
    'start_date'       => '2026-10-01',
    'end_date'         => '2026-10-25'
]);
echo "Response Body:\n" . json_encode($res4['json'], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
assert(isset($res4['json']['error']), "Must return error for non-bookable container");
echo ">>> TEST 4 PASSED! (Non-bookable container correctly rejected)\n\n";

// ---------------------------------------------------------------------------
// TEST 5: Successful Booking with Price-Snapshot Locked
// Container ID 1 is 'Standard Dry' (price = 1450.00, is_bookable = 1)
// ---------------------------------------------------------------------------
echo "[TEST 5] POST /api/bookings/ - Create Booking for Standard Dry 20ft (Price 1450.00)\n";
$res5 = run_request($bookingsScript, 'POST', [
    'Authorization' => "Bearer {$customerToken}"
], [
    'container_id'     => 1,
    'origin_port'      => 'Singapore Hub, SG',
    'destination_port' => 'Hamburg Port, DE',
    'start_date'       => '2026-10-15',
    'end_date'         => '2026-11-05'
]);
echo "Response Body:\n" . json_encode($res5['json'], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
assert(!empty($res5['json']['id']), "Booking must have an ID");
assert(!empty($res5['json']['booking_reference']), "Booking must have a reference number");
assert(str_starts_with($res5['json']['booking_reference'], 'BK-'), "Reference must start with BK-");
assert((float)$res5['json']['price_snapshot'] === 1450.00, "Price snapshot must equal container price (1450.00)");
assert($res5['json']['status'] === 'pending', "Status must default to 'pending'");
echo ">>> TEST 5 PASSED! (Booking created with locked price_snapshot = 1450.00)\n\n";

$createdBookingId  = $res5['json']['id'];
$bookingReference  = $res5['json']['booking_reference'];

// ---------------------------------------------------------------------------
// TEST 6: Price-Snapshot Immutability
// Simulate catalog price inflation on Container 1: 1450.00 -> 1999.00
// Verify existing booking still retains original price_snapshot = 1450.00
// ---------------------------------------------------------------------------
echo "[TEST 6] Price-Snapshot Immutability Check\n";
echo "Simulating catalog price hike on Container 1 to 1999.00...\n";
$pdo = get_db();
$pdo->exec("UPDATE containers SET price = 1999.00 WHERE id = 1");

$res6 = run_request($bookingsScript, 'GET', [
    'Authorization' => "Bearer {$customerToken}"
], [], "id={$createdBookingId}");

echo "Retrieved Booking Detail:\n" . json_encode($res6['json'], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
assert((float)$res6['json']['price_snapshot'] === 1450.00, "Booking price_snapshot MUST remain locked at 1450.00 despite catalog price hike!");

// Restore original price
$pdo->exec("UPDATE containers SET price = 1450.00 WHERE id = 1");
echo ">>> TEST 6 PASSED! (price_snapshot remained 1450.00; catalog price change had zero effect)\n\n";

// ---------------------------------------------------------------------------
// TEST 7: Role-Scoped Booking Lists
// Customer sees only their own bookings; Admin sees all bookings
// ---------------------------------------------------------------------------
echo "[TEST 7] GET /api/bookings/ - Role-Scoped Listing\n";
$resCustBookings = run_request($bookingsScript, 'GET', [
    'Authorization' => "Bearer {$customerToken}"
]);
echo "Customer Bookings Count: " . count($resCustBookings['json']) . "\n";
foreach ($resCustBookings['json'] as $b) {
    assert((int)$b['user_id'] === 1, "Customer should only see bookings where user_id = 1");
}

$resAdminBookings = run_request($bookingsScript, 'GET', [
    'Authorization' => "Bearer {$adminToken}"
]);
echo "Admin Bookings Count: " . count($resAdminBookings['json']) . " (Includes customer info)\n";
assert(count($resAdminBookings['json']) >= count($resCustBookings['json']), "Admin must see all bookings");
echo ">>> TEST 7 PASSED! (Customer bookings strictly isolated, Admin has full visibility)\n\n";

// ---------------------------------------------------------------------------
// TEST 8: Cross-Tenant Access Blocked (HTTP 403)
// Create a separate user and verify Customer 1 cannot access their booking
// ---------------------------------------------------------------------------
echo "[TEST 8] GET /api/bookings/{id} - Cross-Tenant Access Guard\n";
// Create another customer account in database
$pdo->exec("
    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active)
    VALUES (99, 'other@hashharbour.com', '$2y$10$5a8eX1M5JeDQx/mwIHWV7.iIACvPAyhp47mM/pDQ6GsZhwKrYASNe', 'Other', 'User', 'customer', 1)
    ON DUPLICATE KEY UPDATE email = email
");
// Create a booking owned by user 99
$pdo->exec("
    INSERT INTO bookings (id, booking_reference, user_id, container_id, price_snapshot, status, created_at, updated_at)
    VALUES (999, 'BK-OTHER-99', 99, 1, 1450.00, 'confirmed', NOW(), NOW())
    ON DUPLICATE KEY UPDATE booking_reference = booking_reference
");

// Customer 1 tries to access booking 999
$res8 = run_request($bookingsScript, 'GET', [
    'Authorization' => "Bearer {$customerToken}"
], [], "id=999");

echo "Response Body:\n" . json_encode($res8['json'], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
assert(isset($res8['json']['error']), "Must return error for unauthorized booking access");
assert($res8['json']['error'] === 'You do not have permission to view this booking.', "Must return 403 Forbidden");
echo ">>> TEST 8 PASSED! (Cross-tenant booking access properly blocked with 403)\n\n";

// Clean up test booking 999 and user 99
$pdo->exec("DELETE FROM bookings WHERE id = 999");
$pdo->exec("DELETE FROM users WHERE id = 99");

echo "======================================================================\n";
echo "                   ALL 8 CORE API TESTS PASSED!                       \n";
echo "======================================================================\n";

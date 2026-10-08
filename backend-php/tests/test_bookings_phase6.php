<?php
/**
 * Test Suite for Phase 6 - Booking Cancel, Status Flow & Shipment Access
 *
 * Scenarios:
 * 1. Customer cancels own pending (200 + fields set)
 * 2. Customer cancels another user's booking (403)
 * 3. Customer cancels confirmed booking (409)
 * 4. Staff cancel of in_transit booking (200)
 * 5. Staff cancel of completed booking (409)
 * 6. Status flow valid step: pending -> confirmed (200)
 * 7. Status flow skip step: pending -> in_transit (422)
 * 8. Status flow backwards step: confirmed -> pending (422)
 * 9. Customer calling status endpoint blocked (403)
 * 10. Cancelled booking status change blocked (409)
 * 11. Shipments list without token blocked (401)
 * 12. Customer sees only own shipments in list & other user's shipment detail is 403
 * 13. Public tracking lookup remains accessible without token (200)
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../includes/jwt.php';

function run_request(string $scriptPath, string $method, array $headers = [], array $body = [], string $queryString = '', string $requestUri = ''): array
{
    $descriptors = [
        0 => ['pipe', 'r'],
        1 => ['pipe', 'w'],
        2 => ['pipe', 'w']
    ];

    $phpBin = PHP_BINARY;
    $phpDrive = preg_match('/^([a-zA-Z]:)/', $phpBin, $m) ? $m[1] : '';

    $extDir = ini_get('extension_dir');
    if ($extDir && preg_match('/^[\\/][^\\/]/', $extDir) && $phpDrive !== '') {
        $extDir = $phpDrive . $extDir;
    } elseif (!$extDir || !is_dir($extDir)) {
        $candidate = dirname($phpBin) . DIRECTORY_SEPARATOR . 'ext';
        if (is_dir($candidate)) {
            $extDir = $candidate;
        }
    }

    $browscapCandidate = dirname($phpBin) . DIRECTORY_SEPARATOR . 'extras' . DIRECTORY_SEPARATOR . 'browscap.ini';
    $browscap = file_exists($browscapCandidate) ? $browscapCandidate : ini_get('browscap');
    if ($browscap && preg_match('/^[\\/][^\\/]/', $browscap) && $phpDrive !== '') {
        $browscap = $phpDrive . $browscap;
    }

    $cmdParts = [escapeshellarg($phpBin)];
    $iniFile = php_ini_loaded_file();
    if ($iniFile) {
        $cmdParts[] = '-c ' . escapeshellarg($iniFile);
    }
    if ($extDir && is_dir($extDir)) {
        $cmdParts[] = '-d extension_dir=' . escapeshellarg($extDir);
    }
    if ($browscap && file_exists($browscap)) {
        $cmdParts[] = '-d browscap=' . escapeshellarg($browscap);
    }

    $wrapper = tempnam(sys_get_temp_dir(), 'hh_p6_');
    $wrapperCode = '<?php register_shutdown_function(function() { echo "\n__STATUS_CODE__:" . http_response_code(); }); require ' . var_export($scriptPath, true) . ';';
    file_put_contents($wrapper, $wrapperCode);

    $cmd = sprintf('%s "%s"', implode(' ', $cmdParts), $wrapper);

    $env = [];
    foreach (array_merge($_SERVER, $_ENV) as $k => $v) {
        if (is_scalar($v)) {
            $env[$k] = (string)$v;
        }
    }
    $env['REQUEST_METHOD'] = $method;
    $env['CONTENT_TYPE']   = 'application/json';
    $env['QUERY_STRING']   = $queryString;
    $env['REQUEST_URI']    = $requestUri ?: ($queryString ? ('/api/?' . $queryString) : '/api/');

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

    $process = proc_open($cmd, $descriptors, $pipes, dirname($scriptPath), $env);
    if (!is_resource($process)) {
        @unlink($wrapper);
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
    @unlink($wrapper);

    $statusCode = 200;
    if (preg_match('/__STATUS_CODE__:(\d+)/', $stdout, $matches)) {
        $statusCode = (int)$matches[1];
        $stdout = trim(str_replace($matches[0], '', $stdout));
    }

    $json = json_decode($stdout, true);

    return [
        'exitCode'   => $exitCode,
        'statusCode' => $statusCode,
        'raw'        => $stdout,
        'json'       => $json,
        'stderr'     => $stderr
    ];
}

echo "======================================================================\n";
echo "       HASHHARBOUR PHASE 6 - BOOKINGS & SHIPMENTS TEST SUITE          \n";
echo "======================================================================\n\n";

$bookingsScript  = __DIR__ . '/../api/bookings/index.php';
$shipmentsScript = __DIR__ . '/../api/shipments/index.php';
$loginScript     = __DIR__ . '/../api/auth/login.php';

$pdo = get_db();

// Cleanup helper
$cleanupIds = ['bookings' => [], 'shipments' => []];
register_shutdown_function(function() use (&$cleanupIds, $pdo) {
    if (!empty($cleanupIds['bookings'])) {
        $placeholders = implode(',', array_fill(0, count($cleanupIds['bookings']), '?'));
        $stmt = $pdo->prepare("DELETE FROM bookings WHERE id IN ($placeholders)");
        $stmt->execute($cleanupIds['bookings']);
    }
    if (!empty($cleanupIds['shipments'])) {
        $placeholders = implode(',', array_fill(0, count($cleanupIds['shipments']), '?'));
        $stmt = $pdo->prepare("DELETE FROM shipments WHERE id IN ($placeholders)");
        $stmt->execute($cleanupIds['shipments']);
    }
});

// Helper to insert test booking
function create_test_booking(PDO $pdo, int $userId, string $status, array &$cleanupIds): int {
    $ref = 'BK-PH6-' . random_int(100000, 999999);
    $stmt = $pdo->prepare("
        INSERT INTO bookings (booking_reference, user_id, container_id, price_snapshot, status, refund_status, origin_port, destination_port, created_at, updated_at)
        VALUES (:ref, :user_id, 1, 1450.00, :status, 'none', 'Port A', 'Port B', NOW(), NOW())
    ");
    $stmt->execute([
        'ref'     => $ref,
        'user_id' => $userId,
        'status'  => $status
    ]);
    $id = (int)$pdo->lastInsertId();
    $cleanupIds['bookings'][] = $id;
    return $id;
}

// Helper to insert test shipment
function create_test_shipment(PDO $pdo, ?int $userId, string $trackingNo, array &$cleanupIds): int {
    $stmt = $pdo->prepare("
        INSERT INTO shipments (tracking_number, status, origin, destination, vessel, eta, progress_percent, last_update, user_id, created_at, updated_at)
        VALUES (:track, 'In Transit', 'Origin Port', 'Dest Port', 'Test Vessel', '2026-11-01', 50, 'Departed', :user_id, NOW(), NOW())
    ");
    $stmt->execute([
        'track'   => $trackingNo,
        'user_id' => $userId
    ]);
    $id = (int)$pdo->lastInsertId();
    $cleanupIds['shipments'][] = $id;
    return $id;
}

// Step 0: Obtain Customer (ID: 1) and Admin (ID: 2) tokens
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
echo ">>> SETUP COMPLETED!\n\n";

// ---------------------------------------------------------------------------
// TEST 1: Customer cancels own pending (200 + fields set)
// ---------------------------------------------------------------------------
echo "[TEST 1] POST /api/bookings/{id}/cancel - Customer Cancels Own Pending Booking\n";
$b1 = create_test_booking($pdo, 1, 'pending', $cleanupIds);
$res1 = run_request(
    $bookingsScript,
    'POST',
    ['Authorization' => "Bearer {$customerToken}"],
    ['reason' => 'Change of shipping schedule'],
    "id={$b1}&action=cancel",
    "/api/bookings/{$b1}/cancel"
);
echo "Response: HTTP {$res1['statusCode']}, status = " . ($res1['json']['status'] ?? 'null') . "\n";
assert($res1['statusCode'] === 200, "Must return HTTP 200");
assert(($res1['json']['status'] ?? '') === 'cancelled', "Booking status must be 'cancelled'");
assert(!empty($res1['json']['cancelled_at']), "cancelled_at must be set");
assert((int)($res1['json']['cancelled_by'] ?? 0) === 1, "cancelled_by must be customer id (1)");
assert(($res1['json']['cancel_reason'] ?? '') === 'Change of shipping schedule', "cancel_reason must be saved");
assert(($res1['json']['refund_status'] ?? '') === 'none', "refund_status must remain 'none'");
echo ">>> TEST 1 PASSED! (Customer successfully cancelled own pending booking)\n\n";

// ---------------------------------------------------------------------------
// TEST 2: Customer cancels another user's booking (403)
// ---------------------------------------------------------------------------
echo "[TEST 2] POST /api/bookings/{id}/cancel - Customer Cancelling Other User Booking Blocked\n";
$b2 = create_test_booking($pdo, 2, 'pending', $cleanupIds); // User 2's booking
$res2 = run_request(
    $bookingsScript,
    'POST',
    ['Authorization' => "Bearer {$customerToken}"],
    ['reason' => 'Unauthorized attempt'],
    "id={$b2}&action=cancel",
    "/api/bookings/{$b2}/cancel"
);
echo "Response: HTTP {$res2['statusCode']}, error = " . ($res2['json']['error'] ?? 'null') . "\n";
assert($res2['statusCode'] === 403, "Must return HTTP 403");
assert(isset($res2['json']['error']), "Must return error message");
echo ">>> TEST 2 PASSED! (Cross-customer cancellation blocked with 403)\n\n";

// ---------------------------------------------------------------------------
// TEST 3: Customer cancels confirmed booking (409)
// ---------------------------------------------------------------------------
echo "[TEST 3] POST /api/bookings/{id}/cancel - Customer Cancelling Confirmed Booking Blocked\n";
$b3 = create_test_booking($pdo, 1, 'confirmed', $cleanupIds);
$res3 = run_request(
    $bookingsScript,
    'POST',
    ['Authorization' => "Bearer {$customerToken}"],
    ['reason' => 'Customer trying to cancel confirmed'],
    "id={$b3}&action=cancel",
    "/api/bookings/{$b3}/cancel"
);
echo "Response: HTTP {$res3['statusCode']}, error = " . ($res3['json']['error'] ?? 'null') . "\n";
assert($res3['statusCode'] === 409, "Must return HTTP 409");
assert(isset($res3['json']['error']), "Must return error message");
echo ">>> TEST 3 PASSED! (Customer cancelling confirmed booking rejected with 409)\n\n";

// ---------------------------------------------------------------------------
// TEST 4: Staff cancel of in_transit booking (200)
// ---------------------------------------------------------------------------
echo "[TEST 4] POST /api/bookings/{id}/cancel - Staff Cancels In-Transit Booking\n";
$b4 = create_test_booking($pdo, 1, 'in_transit', $cleanupIds);
$res4 = run_request(
    $bookingsScript,
    'POST',
    ['Authorization' => "Bearer {$adminToken}"],
    ['reason' => 'Port embargo emergency cancellation'],
    "id={$b4}&action=cancel",
    "/api/bookings/{$b4}/cancel"
);
echo "Response: HTTP {$res4['statusCode']}, status = " . ($res4['json']['status'] ?? 'null') . "\n";
assert($res4['statusCode'] === 200, "Must return HTTP 200");
assert(($res4['json']['status'] ?? '') === 'cancelled', "Booking status must be 'cancelled'");
assert(!empty($res4['json']['cancelled_at']), "cancelled_at must be populated");
assert((int)($res4['json']['cancelled_by'] ?? 0) === 2, "cancelled_by must be staff id (2)");
assert(($res4['json']['cancel_reason'] ?? '') === 'Port embargo emergency cancellation', "cancel_reason must be set");
echo ">>> TEST 4 PASSED! (Staff successfully cancelled in_transit booking)\n\n";

// ---------------------------------------------------------------------------
// TEST 5: Staff cancel of completed booking (409)
// ---------------------------------------------------------------------------
echo "[TEST 5] POST /api/bookings/{id}/cancel - Staff Cancelling Completed Booking Blocked\n";
$b5 = create_test_booking($pdo, 1, 'completed', $cleanupIds);
$res5 = run_request(
    $bookingsScript,
    'POST',
    ['Authorization' => "Bearer {$adminToken}"],
    ['reason' => 'Attempt cancel completed'],
    "id={$b5}&action=cancel",
    "/api/bookings/{$b5}/cancel"
);
echo "Response: HTTP {$res5['statusCode']}, error = " . ($res5['json']['error'] ?? 'null') . "\n";
assert($res5['statusCode'] === 409, "Must return HTTP 409");
assert(isset($res5['json']['error']), "Must return error message");
echo ">>> TEST 5 PASSED! (Staff cancelling completed booking rejected with 409)\n\n";

// ---------------------------------------------------------------------------
// TEST 6: Status flow valid step: pending -> confirmed (200)
// ---------------------------------------------------------------------------
echo "[TEST 6] PATCH /api/bookings/{id}/status - Staff Moves pending -> confirmed\n";
$b6 = create_test_booking($pdo, 1, 'pending', $cleanupIds);
$res6 = run_request(
    $bookingsScript,
    'PATCH',
    ['Authorization' => "Bearer {$adminToken}"],
    ['status' => 'confirmed'],
    "id={$b6}&action=status",
    "/api/bookings/{$b6}/status"
);
echo "Response: HTTP {$res6['statusCode']}, status = " . ($res6['json']['status'] ?? 'null') . "\n";
assert($res6['statusCode'] === 200, "Must return HTTP 200");
assert(($res6['json']['status'] ?? '') === 'confirmed', "Status must advance to 'confirmed'");
echo ">>> TEST 6 PASSED! (Valid forward status transition succeeded)\n\n";

// ---------------------------------------------------------------------------
// TEST 7: Status flow skip step: pending -> in_transit (422)
// ---------------------------------------------------------------------------
echo "[TEST 7] PATCH /api/bookings/{id}/status - Skipping Step (pending -> in_transit) Blocked\n";
$b7 = create_test_booking($pdo, 1, 'pending', $cleanupIds);
$res7 = run_request(
    $bookingsScript,
    'PATCH',
    ['Authorization' => "Bearer {$adminToken}"],
    ['status' => 'in_transit'],
    "id={$b7}&action=status",
    "/api/bookings/{$b7}/status"
);
echo "Response: HTTP {$res7['statusCode']}, error = " . ($res7['json']['error'] ?? 'null') . "\n";
assert($res7['statusCode'] === 422, "Must return HTTP 422");
assert(isset($res7['json']['error']), "Must return error message");
echo ">>> TEST 7 PASSED! (Skipping status step rejected with 422)\n\n";

// ---------------------------------------------------------------------------
// TEST 8: Status flow backwards step: confirmed -> pending (422)
// ---------------------------------------------------------------------------
echo "[TEST 8] PATCH /api/bookings/{id}/status - Backwards Step (confirmed -> pending) Blocked\n";
$b8 = create_test_booking($pdo, 1, 'confirmed', $cleanupIds);
$res8 = run_request(
    $bookingsScript,
    'PATCH',
    ['Authorization' => "Bearer {$adminToken}"],
    ['status' => 'pending'],
    "id={$b8}&action=status",
    "/api/bookings/{$b8}/status"
);
echo "Response: HTTP {$res8['statusCode']}, error = " . ($res8['json']['error'] ?? 'null') . "\n";
assert($res8['statusCode'] === 422, "Must return HTTP 422");
assert(isset($res8['json']['error']), "Must return error message");
echo ">>> TEST 8 PASSED! (Backwards status step rejected with 422)\n\n";

// ---------------------------------------------------------------------------
// TEST 9: Customer calling status endpoint blocked (403)
// ---------------------------------------------------------------------------
echo "[TEST 9] PATCH /api/bookings/{id}/status - Customer Attempting Status Change Blocked\n";
$b9 = create_test_booking($pdo, 1, 'pending', $cleanupIds);
$res9 = run_request(
    $bookingsScript,
    'PATCH',
    ['Authorization' => "Bearer {$customerToken}"],
    ['status' => 'confirmed'],
    "id={$b9}&action=status",
    "/api/bookings/{$b9}/status"
);
echo "Response: HTTP {$res9['statusCode']}, error = " . ($res9['json']['error'] ?? 'null') . "\n";
assert($res9['statusCode'] === 403, "Must return HTTP 403");
assert(isset($res9['json']['error']), "Must return error message");
echo ">>> TEST 9 PASSED! (Customer role blocked from status endpoint with 403)\n\n";

// ---------------------------------------------------------------------------
// TEST 10: Cancelled booking status change blocked (409)
// ---------------------------------------------------------------------------
echo "[TEST 10] PATCH /api/bookings/{id}/status - Modifying Cancelled Booking Status Blocked\n";
$b10 = create_test_booking($pdo, 1, 'cancelled', $cleanupIds);
$res10 = run_request(
    $bookingsScript,
    'PATCH',
    ['Authorization' => "Bearer {$adminToken}"],
    ['status' => 'confirmed'],
    "id={$b10}&action=status",
    "/api/bookings/{$b10}/status"
);
echo "Response: HTTP {$res10['statusCode']}, error = " . ($res10['json']['error'] ?? 'null') . "\n";
assert($res10['statusCode'] === 409, "Must return HTTP 409");
assert(isset($res10['json']['error']), "Must return error message");
echo ">>> TEST 10 PASSED! (Status change on cancelled booking rejected with 409)\n\n";

// ---------------------------------------------------------------------------
// TEST 11: Shipments list without token blocked (401)
// ---------------------------------------------------------------------------
echo "[TEST 11] GET /api/shipments/ - Unauthenticated Request Blocked (401)\n";
$res11 = run_request(
    $shipmentsScript,
    'GET',
    [],
    [],
    "",
    "/api/shipments/"
);
echo "Response: HTTP {$res11['statusCode']}, error = " . ($res11['json']['error'] ?? 'null') . "\n";
assert($res11['statusCode'] === 401, "Must return HTTP 401");
echo ">>> TEST 11 PASSED! (Shipments listing requires authentication)\n\n";

// ---------------------------------------------------------------------------
// TEST 12: Customer sees only own shipments; detail of other user's = 403
// ---------------------------------------------------------------------------
echo "[TEST 12] GET /api/shipments/ - Customer Scoped Listing & Detail Ownership Guard\n";
$sMine = create_test_shipment($pdo, 1, 'HH-TEST-MINE-' . random_int(1000, 9999), $cleanupIds);
$sOther = create_test_shipment($pdo, 2, 'HH-TEST-OTHER-' . random_int(1000, 9999), $cleanupIds);

// Customer list
$res12List = run_request(
    $shipmentsScript,
    'GET',
    ['Authorization' => "Bearer {$customerToken}"],
    [],
    "",
    "/api/shipments/"
);
echo "Customer shipment list count: " . count($res12List['json'] ?? []) . "\n";
assert($res12List['statusCode'] === 200, "Must return HTTP 200");
$foundMine = false;
foreach ($res12List['json'] as $sh) {
    assert((int)$sh['user_id'] === 1, "Customer must only see own shipments");
    if ((int)$sh['id'] === $sMine) {
        $foundMine = true;
    }
}
assert($foundMine, "Customer must see their newly created shipment");

// Customer detail of other user's shipment -> 403
$res12Detail = run_request(
    $shipmentsScript,
    'GET',
    ['Authorization' => "Bearer {$customerToken}"],
    [],
    "id={$sOther}",
    "/api/shipments/{$sOther}"
);
echo "Customer fetching other user shipment: HTTP {$res12Detail['statusCode']}, error = " . ($res12Detail['json']['error'] ?? 'null') . "\n";
assert($res12Detail['statusCode'] === 403, "Must return HTTP 403");

// Admin list sees all shipments including both
$res12Admin = run_request(
    $shipmentsScript,
    'GET',
    ['Authorization' => "Bearer {$adminToken}"],
    [],
    "",
    "/api/shipments/"
);
assert($res12Admin['statusCode'] === 200, "Staff must return HTTP 200");
$adminShipmentIds = array_column($res12Admin['json'], 'id');
assert(in_array($sMine, $adminShipmentIds), "Staff must see customer shipment");
assert(in_array($sOther, $adminShipmentIds), "Staff must see other shipment");
echo ">>> TEST 12 PASSED! (Shipment access strictly scoped by role and owner)\n\n";

// ---------------------------------------------------------------------------
// TEST 13: Public tracking still 200 without token
// ---------------------------------------------------------------------------
echo "[TEST 13] GET /api/shipments/track/?tracking_no=HH-100293 - Public Tracking Unauthenticated\n";
$res13 = run_request(
    $shipmentsScript,
    'GET',
    [],
    [],
    "tracking_no=HH-100293",
    "/api/shipments/track/?tracking_no=HH-100293"
);
echo "Response: HTTP {$res13['statusCode']}, tracking_number = " . ($res13['json']['tracking_number'] ?? 'null') . "\n";
assert($res13['statusCode'] === 200, "Must return HTTP 200");
assert(($res13['json']['tracking_number'] ?? '') === 'HH-100293', "Tracking number must match");
echo ">>> TEST 13 PASSED! (Public tracking remains freely accessible without authentication)\n\n";

echo "======================================================================\n";
echo "            ALL 13 PHASE 6 BOOKINGS & SHIPMENTS TESTS PASSED!         \n";
echo "======================================================================\n";

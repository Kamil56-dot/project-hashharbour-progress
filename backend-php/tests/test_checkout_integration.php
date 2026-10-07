<?php
/**
 * Test Suite: Checkout & Booking Integration (Phase M1)
 *
 * Verifies:
 * 1. Checkout-mode booking created as pending with billing fields & total_amount stored
 * 2. Customer cancels the checkout-mode pending booking (HTTP 200)
 * 3. Legacy (non-checkout) booking payload continues to work as pending with price_snapshot
 *
 * Rule: Self-cleaning - deletes ONLY rows created during this test run.
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/constants.php';
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

    $wrapper = tempnam(sys_get_temp_dir(), 'hh_m1_');
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
echo "    HASHHARBOUR PHASE M1 - CHECKOUT INTEGRATION TEST SUITE            \n";
echo "======================================================================\n\n";

$bookingsScript = __DIR__ . '/../api/bookings/index.php';
$loginScript    = __DIR__ . '/../api/auth/login.php';

$pdo = get_db();

// Self-cleaning hook
$cleanupBookingIds = [];
register_shutdown_function(function() use (&$cleanupBookingIds, $pdo) {
    if (!empty($cleanupBookingIds)) {
        $placeholders = implode(',', array_fill(0, count($cleanupBookingIds), '?'));
        $stmt = $pdo->prepare("DELETE FROM bookings WHERE id IN ($placeholders)");
        $stmt->execute($cleanupBookingIds);
        echo "\n[CLEANUP] Deleted " . count($cleanupBookingIds) . " test bookings created by this suite.\n";
    }
});

// Setup: Customer Login
echo "[SETUP] Authenticating Demo Customer (demo@hashharbour.com)...\n";
$loginRes = run_request($loginScript, 'POST', [], [
    'email'    => 'demo@hashharbour.com',
    'password' => 'password123'
]);
$customerToken = $loginRes['json']['access'] ?? null;
assert(!empty($customerToken), "Customer token must be obtained");
$headers = ['Authorization' => 'Bearer ' . $customerToken];
echo ">>> Customer logged in successfully!\n\n";

// ---------------------------------------------------------------------------
// TEST 1: Checkout-mode booking created as pending with billing fields & total
// ---------------------------------------------------------------------------
echo "[TEST 1] POST /api/bookings/ - Checkout Mode Creation (Pending + Billing Fields)\n";
$checkoutPayload = [
    'container_id'       => 1,
    'quantity'           => 2,
    'insurance_selected' => true,
    'payment_method'     => 'card',
    'origin_port'        => 'Port of Singapore',
    'destination_port'   => 'Port of Rotterdam',
    'start_date'         => '2026-11-01',
    'end_date'           => '2026-11-20',
    'billing'            => [
        'name'        => 'Integration Test Customer',
        'address'     => '456 Harbour Blvd Suite 10',
        'city'        => 'Singapore',
        'state'       => 'SG-Central',
        'country'     => 'Singapore',
        'postal_code' => '018989'
    ]
];

$res1 = run_request($bookingsScript, 'POST', $headers, $checkoutPayload, '', '/api/bookings/');
echo "HTTP Status: {$res1['statusCode']}\n";
assert($res1['statusCode'] === 201, "Expected HTTP 201 Created for checkout booking");

$b1 = $res1['json'];
assert(!empty($b1['id']), "Booking must have an ID");
$cleanupBookingIds[] = (int)$b1['id'];

assert($b1['status'] === 'pending', "Newly created checkout booking MUST be pending");
assert((int)$b1['quantity'] === 2, "Quantity must be 2");
assert((int)$b1['insurance_selected'] === 1, "Insurance must be 1");
assert($b1['payment_method'] === 'card', "Payment method must be card");
assert($b1['billing_name'] === 'Integration Test Customer', "Billing name must match");
assert(str_contains($b1['billing_address'], '456 Harbour Blvd Suite 10'), "Billing address must contain street");
assert(str_contains($b1['billing_address'], 'Singapore'), "Billing address must contain city/country");

// Validate server-side calculation: ($unitPrice * 2) + port_handling + documentation + insurance
// Container 1 unit price is 1450.00
$unitPrice = (float)$b1['price_snapshot'];
$expectedTotal = round(($unitPrice * 2) + FEE_PORT_HANDLING + FEE_DOCUMENTATION + FEE_INSURANCE, 2);
assert(abs((float)$b1['total_amount'] - $expectedTotal) < 0.01, "Total amount must equal {$expectedTotal}, got {$b1['total_amount']}");

echo ">>> TEST 1 PASSED! (Checkout booking created as pending, total={$b1['total_amount']}, billing recorded)\n\n";

// ---------------------------------------------------------------------------
// TEST 2: Customer cancels the checkout-mode pending booking
// ---------------------------------------------------------------------------
echo "[TEST 2] POST /api/bookings/{id}/cancel - Customer Cancels Checkout-Mode Booking\n";
$res2 = run_request(
    $bookingsScript,
    'POST',
    $headers,
    ['reason' => 'Customer cancellation test on checkout booking'],
    'id=' . $b1['id'] . '&action=cancel',
    '/api/bookings/' . $b1['id'] . '/cancel'
);
echo "HTTP Status: {$res2['statusCode']}\n";
assert($res2['statusCode'] === 200, "Expected HTTP 200 for booking cancellation");
assert($res2['json']['status'] === 'cancelled', "Booking status must be updated to cancelled");
assert((int)$res2['json']['cancelled_by'] === 1, "Cancelled by user ID must be customer (1)");
assert($res2['json']['cancel_reason'] === 'Customer cancellation test on checkout booking', "Reason must be recorded");

echo ">>> TEST 2 PASSED! (Checkout booking successfully cancelled by customer with 200)\n\n";

// ---------------------------------------------------------------------------
// TEST 3: Legacy non-checkout booking payload still works
// ---------------------------------------------------------------------------
echo "[TEST 3] POST /api/bookings/ - Legacy (Non-Checkout) Payload\n";
$legacyPayload = [
    'container_id'     => 1,
    'origin_port'      => 'Port of Los Angeles',
    'destination_port' => 'Port of Tokyo',
    'start_date'       => '2026-12-01',
    'end_date'         => '2026-12-15'
];

$res3 = run_request($bookingsScript, 'POST', $headers, $legacyPayload, '', '/api/bookings/');
echo "HTTP Status: {$res3['statusCode']}\n";
assert($res3['statusCode'] === 201, "Expected HTTP 201 Created for legacy booking");

$b3 = $res3['json'];
assert(!empty($b3['id']), "Legacy booking must have an ID");
$cleanupBookingIds[] = (int)$b3['id'];

assert($b3['status'] === 'pending', "Legacy booking must have status pending");
assert((float)$b3['price_snapshot'] === $unitPrice, "Legacy booking must have price_snapshot");
assert((int)$b3['quantity'] === 1, "Default quantity must be 1");
assert((int)$b3['insurance_selected'] === 0, "Default insurance must be 0");
assert($b3['payment_method'] === null, "Legacy payment_method must be null");
assert($b3['total_amount'] === null, "Legacy total_amount must be null");
assert($b3['billing_name'] === null, "Legacy billing_name must be null");
assert($b3['billing_address'] === null, "Legacy billing_address must be null");

echo ">>> TEST 3 PASSED! (Legacy booking works with locked price_snapshot & defaults)\n\n";

echo "======================================================================\n";
echo "          ALL CHECKOUT INTEGRATION TESTS PASSED!                      \n";
echo "======================================================================\n";

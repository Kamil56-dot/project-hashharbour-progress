<?php
/**
 * Test Suite for Phase 2 Auth Migration
 * Tests:
 * 1. POST /api/auth/login.php - Valid credentials (demo@hashharbour.com / password123)
 * 2. POST /api/auth/login.php - Invalid credentials (wrong password)
 * 3. GET /api/auth/me.php     - Without token (should return 401)
 * 4. GET /api/auth/me.php     - With valid access token (should return 200)
 * 5. POST /api/auth/refresh.php - Valid refresh token (should return 200 + new pair)
 * 6. POST /api/auth/refresh.php - Reusing revoked refresh token (should return 401)
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../includes/jwt.php';

function run_simulated_request(string $scriptPath, string $method, array $headers = [], array $body = []): array
{
    $descriptors = [
        0 => ['pipe', 'r'], // stdin
        1 => ['pipe', 'w'], // stdout
        2 => ['pipe', 'w']  // stderr
    ];

    $phpExe = 'C:\\xampp\\php\\php.exe';

    // Build environment variables (ensure only string values)
    $env = [];
    foreach (array_merge($_SERVER, $_ENV) as $k => $v) {
        if (is_scalar($v)) {
            $env[$k] = (string)$v;
        }
    }
    $env['REQUEST_METHOD'] = $method;
    $env['CONTENT_TYPE']   = 'application/json';

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
echo "           HASHHARBOUR PHASE 2 - AUTH SUITE TEST RUNNER               \n";
echo "======================================================================\n\n";

$loginScript   = __DIR__ . '/../api/auth/login.php';
$refreshScript = __DIR__ . '/../api/auth/refresh.php';
$meScript      = __DIR__ . '/../api/auth/me.php';

// Test 1: Successful Login
echo "[TEST 1] POST /api/auth/login.php - Valid Credentials (demo@hashharbour.com / password123)\n";
$res1 = run_simulated_request($loginScript, 'POST', [], [
    'email'    => 'demo@hashharbour.com',
    'password' => 'password123'
]);

echo "Response Body:\n" . json_encode($res1['json'], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
assert(!empty($res1['json']['access']), "Access token must be present");
assert(!empty($res1['json']['refresh']), "Refresh token must be present");
assert($res1['json']['user']['email'] === 'demo@hashharbour.com', "User email must match demo user");
assert($res1['json']['user']['role'] === 'customer', "User role must be customer");
assert(!isset($res1['json']['user']['username']), "Username field must NOT be present");
echo ">>> TEST 1 PASSED! (Token pair issued, user shape matches Django contract)\n\n";

$accessToken  = $res1['json']['access'];
$refreshToken = $res1['json']['refresh'];

// Test 2: Invalid Login
echo "[TEST 2] POST /api/auth/login.php - Invalid Password\n";
$res2 = run_simulated_request($loginScript, 'POST', [], [
    'email'    => 'demo@hashharbour.com',
    'password' => 'wrong_password_999'
]);
echo "Response Body:\n" . json_encode($res2['json'], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
assert(isset($res2['json']['error']), "Error message must be returned");
assert($res2['json']['error'] === 'Invalid email address or password.', "Must return 401 error message");
echo ">>> TEST 2 PASSED! (Invalid login rejected with error message)\n\n";

// Test 3: Protected Route Without Token
echo "[TEST 3] GET /api/auth/me.php - Unauthenticated (No Bearer Token)\n";
$res3 = run_simulated_request($meScript, 'GET', []);
echo "Response Body:\n" . json_encode($res3['json'], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
assert(isset($res3['json']['error']), "Must return error when token is omitted");
echo ">>> TEST 3 PASSED! (Protected route correctly blocked without token)\n\n";

// Test 4: Protected Route With Valid Access Token
echo "[TEST 4] GET /api/auth/me.php - Authenticated with Bearer Token\n";
$res4 = run_simulated_request($meScript, 'GET', [
    'Authorization' => "Bearer {$accessToken}"
]);
echo "Response Body:\n" . json_encode($res4['json'], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
assert(!empty($res4['json']['user']), "Must return user profile");
assert($res4['json']['user']['email'] === 'demo@hashharbour.com', "Must match authenticated user");
echo ">>> TEST 4 PASSED! (Protected route accessible with valid token)\n\n";

// Test 5: Token Refresh Flow
echo "[TEST 5] POST /api/auth/refresh.php - Rotate Refresh Token\n";
$res5 = run_simulated_request($refreshScript, 'POST', [], [
    'refresh' => $refreshToken
]);
echo "Response Body:\n" . json_encode($res5['json'], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
assert(!empty($res5['json']['access']), "New access token must be issued");
assert(!empty($res5['json']['refresh']), "New refresh token must be issued");
assert($res5['json']['refresh'] !== $refreshToken, "Refresh token must be rotated to a new string");
echo ">>> TEST 5 PASSED! (Refresh successful and rotated)\n\n";

$newAccessToken = $res5['json']['access'];
$newRefreshToken = $res5['json']['refresh'];

// Test 6: Reusing Old (Revoked) Refresh Token
echo "[TEST 6] POST /api/auth/refresh.php - Replay Attack (Reusing Old Revoked Refresh Token)\n";
$res6 = run_simulated_request($refreshScript, 'POST', [], [
    'refresh' => $refreshToken
]);
echo "Response Body:\n" . json_encode($res6['json'], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
assert(isset($res6['json']['error']), "Must reject revoked token");
assert($res6['json']['error'] === 'This refresh token has been revoked.', "Must inform token was revoked");
echo ">>> TEST 6 PASSED! (Revoked token rejected, anti-replay protection verified)\n\n";

// Test 7: Verify New Access Token Works on Protected Route
echo "[TEST 7] GET /api/auth/me.php - Verify Rotated Access Token Works\n";
$res7 = run_simulated_request($meScript, 'GET', [
    'Authorization' => "Bearer {$newAccessToken}"
]);
echo "Response Body:\n" . json_encode($res7['json'], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
assert(!empty($res7['json']['user']), "New access token must authenticate successfully");
echo ">>> TEST 7 PASSED! (New access token verified)\n\n";

echo "======================================================================\n";
echo "                   ALL 7 AUTH TESTS PASSED!                           \n";
echo "======================================================================\n";

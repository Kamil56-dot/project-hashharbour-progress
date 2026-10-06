<?php
/**
 * HashHarbour — Super Admin Seed Script
 * CLI-only utility to initialize the singleton super_admin account.
 *
 * Usage:
 *   php seed_super_admin.php
 *   php seed_super_admin.php [email] [password]
 *   php seed_super_admin.php --email=user@example.com --password=secret
 */

declare(strict_types=1);

// 1. Enforce CLI execution only
if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    echo "Access denied: This script can only be executed via the command line interface (CLI).\n";
    exit(1);
}

require_once __DIR__ . '/../config/db.php';

echo "====================================================\n";
echo "   HashHarbour — Super Admin Provisioning Script    \n";
echo "====================================================\n\n";

$pdo = get_db();

// 2. Refuse execution if a super_admin already exists
$checkStmt = $pdo->query("SELECT id, email, created_at FROM users WHERE role = 'super_admin' LIMIT 1");
$existingSuperAdmin = $checkStmt->fetch();

if ($existingSuperAdmin) {
    echo "[ERROR] Provisioning refused: A super_admin account already exists in the system.\n";
    echo "  Existing ID:    " . $existingSuperAdmin['id'] . "\n";
    echo "  Existing Email: " . $existingSuperAdmin['email'] . "\n";
    echo "  Provisioned At: " . $existingSuperAdmin['created_at'] . "\n\n";
    echo "The HashHarbour security architecture enforces strictly ONE singleton super_admin.\n";
    exit(1);
}

// 3. Extract credentials from CLI arguments or prompt interactively
$email = null;
$password = null;

// Parse options or positional arguments
foreach ($argv as $idx => $arg) {
    if ($idx === 0) continue;
    if (str_starts_with($arg, '--email=')) {
        $email = substr($arg, 8);
    } elseif (str_starts_with($arg, '--password=')) {
        $password = substr($arg, 11);
    }
}

if ($email === null && isset($argv[1]) && !str_starts_with($argv[1], '--')) {
    $email = $argv[1];
}
if ($password === null && isset($argv[2]) && !str_starts_with($argv[2], '--')) {
    $password = $argv[2];
}

// Safety warning if password was provided via CLI argument
if ($password !== null) {
    fwrite(STDERR, "[WARNING] Supplying the password via command-line arguments poses a security risk:\n");
    fwrite(STDERR, "          Shell history and system process lists (e.g. ps, Task Manager) can expose plain text credentials.\n");
    fwrite(STDERR, "          Recommendation: Run the script without arguments to use the interactive prompt securely.\n\n");
}

// Interactive prompt for Email if not supplied via argv
if (empty($email)) {
    echo "Enter super_admin email [default: superadmin@hashharbour.com]: ";
    $inputEmail = trim((string)fgets(STDIN));
    $email = !empty($inputEmail) ? $inputEmail : 'superadmin@hashharbour.com';
}

$email = trim($email);

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "[ERROR] Invalid email format: '{$email}'. Aborting.\n";
    exit(1);
}

// Interactive prompt for Password if not supplied via argv
if (empty($password)) {
    echo "Enter super_admin password (min 12 characters): ";
    $password = trim((string)fgets(STDIN));
}

// 4. Validate minimum password length (12+ characters)
if (strlen($password) < 12) {
    echo "[ERROR] Security requirement failed: Password must be at least 12 characters long.\n";
    echo "  Provided length: " . strlen($password) . " characters.\n";
    exit(1);
}

// 5. Hash password with bcrypt
$passwordHash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);

try {
    $pdo->beginTransaction();

    // 6. Insert new super_admin account
    $insertUser = $pdo->prepare('
        INSERT INTO users (email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
        VALUES (:email, :password_hash, :first_name, :last_name, :role, 1, NOW(), NOW())
    ');

    $insertUser->execute([
        'email'         => $email,
        'password_hash' => $passwordHash,
        'first_name'    => 'Super',
        'last_name'     => 'Admin',
        'role'          => 'super_admin',
    ]);

    $superAdminId = (int)$pdo->lastInsertId();

    // 7. Write role audit log entry (actor_id NULL = system seed)
    $insertAudit = $pdo->prepare('
        INSERT INTO role_audit_log (actor_id, target_id, action, old_role, new_role, ip_address, created_at)
        VALUES (NULL, :target_id, :action, NULL, :new_role, :ip_address, NOW())
    ');

    $insertAudit->execute([
        'target_id'  => $superAdminId,
        'action'     => 'create_user',
        'new_role'   => 'super_admin',
        'ip_address' => '127.0.0.1 (CLI)',
    ]);

    $pdo->commit();

    echo "\n[SUCCESS] Super Admin account provisioned successfully!\n";
    echo "  User ID:    {$superAdminId}\n";
    echo "  Email:      {$email}\n";
    echo "  Role:       super_admin\n";
    echo "  Audit Log:  Recorded with action 'create_user'\n\n";
    exit(0);
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo "[FATAL ERROR] Failed to provision super_admin: " . $e->getMessage() . "\n";
    exit(1);
}

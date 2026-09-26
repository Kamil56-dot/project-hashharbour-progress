<?php
/**
 * HashHarbour Database Configuration & PDO Connection
 * Target: MySQL on XAMPP (default port 3306, user root, no password)
 */

declare(strict_types=1);

define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
define('DB_PORT', getenv('DB_PORT') ?: '3306');
define('DB_NAME', getenv('DB_NAME') ?: 'hashharbour');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') !== false ? getenv('DB_PASS') : '');
define('DB_CHARSET', 'utf8mb4');

/**
 * Returns a shared PDO instance
 *
 * @return PDO
 * @throws PDOException
 */
function get_db(): PDO
{
    static $pdo = null;

    if ($pdo === null) {
        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=%s',
            DB_HOST,
            DB_PORT,
            DB_NAME,
            DB_CHARSET
        );

        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
        ];

        $passwordsToTry = array_unique(array_filter([
            getenv('DB_PASS') !== false ? getenv('DB_PASS') : null,
            '',
            'root'
        ], function($v) { return $v !== null; }));

        $lastException = null;
        foreach ($passwordsToTry as $pass) {
            try {
                $pdo = new PDO($dsn, DB_USER, $pass, $options);
                break;
            } catch (PDOException $e) {
                $lastException = $e;
            }
        }

        if ($pdo === null) {
            http_response_code(500);
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode([
                'error'   => 'Database connection error.',
                'message' => 'Unable to connect to MySQL database. Please verify XAMPP MySQL service is running.',
                'details' => (getenv('APP_DEBUG') === 'true') ? ($lastException ? $lastException->getMessage() : null) : null
            ], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
            exit;
        }
    }

    return $pdo;
}

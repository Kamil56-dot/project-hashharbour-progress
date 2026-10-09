<?php
/**
 * HashHarbour JSON Response Helper
 * Provides consistent JSON response formatting across all API endpoints
 */

declare(strict_types=1);

if (php_sapi_name() !== 'cli') {
    ini_set('display_errors', '0');
    ini_set('log_errors', '1');
    error_reporting(E_ALL);

    set_exception_handler(function (Throwable $e): void {
        error_log(sprintf('Uncaught %s: %s in %s:%d', get_class($e), $e->getMessage(), $e->getFile(), $e->getLine()));
        if (!headers_sent()) {
            http_response_code(500);
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode(['error' => 'Internal server error.'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        }
        exit;
    });

    register_shutdown_function(function (): void {
        $error = error_get_last();
        if ($error !== null && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
            error_log(sprintf('Fatal error: %s in %s on line %d', $error['message'], $error['file'], $error['line']));
            if (!headers_sent()) {
                http_response_code(500);
                header('Content-Type: application/json; charset=UTF-8');
                echo json_encode(['error' => 'Internal server error.'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
            }
        }
    });
}

/**
 * Output JSON payload with HTTP status code and terminate execution
 *
 * @param mixed $data
 * @param int $status_code
 * @param array $headers
 * @return void
 */
function send_json(mixed $data, int $status_code = 200, array $headers = []): void
{
    http_response_code($status_code);
    header('Content-Type: application/json; charset=UTF-8');

    foreach ($headers as $key => $val) {
        header("{$key}: {$val}");
    }

    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Output standardized error response
 *
 * @param string $message
 * @param int $status_code
 * @param mixed $details
 * @return void
 */
function send_error(string $message, int $status_code = 400, mixed $details = null): void
{
    $payload = ['error' => $message];

    if ($details !== null) {
        $payload['details'] = $details;
    }

    send_json($payload, $status_code);
}

/**
 * Read and decode incoming JSON request body
 *
 * @return array
 */
function get_json_input(): array
{
    $raw = file_get_contents('php://input');
    if (empty($raw) && php_sapi_name() === 'cli') {
        $raw = file_get_contents('php://stdin');
    }
    if (empty($raw) && !empty($_POST)) {
        return $_POST;
    }
    if (empty($raw)) {
        return [];
    }

    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

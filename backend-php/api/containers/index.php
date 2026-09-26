<?php
/**
 * Containers API Endpoint
 * Handles:
 * - GET /api/containers/     : Public list of all containers
 * - GET /api/containers/{id} : Public container detail
 * - POST /api/containers/    : Role-protected (admin, operator) - Create container
 * - PUT /api/containers/{id} : Role-protected (admin, operator) - Update container
 * - DELETE /api/containers/{id} : Role-protected (admin, operator) - Delete container
 */

declare(strict_types=1);

require_once __DIR__ . '/../../includes/cors.php';
require_once __DIR__ . '/../../includes/response.php';
require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../config/db.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$uri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?? '';

if (empty($_GET) && !empty($_SERVER['QUERY_STRING'])) {
    parse_str($_SERVER['QUERY_STRING'], $_GET);
}

// Extract ID from query param or URL slug
$id = null;
if (isset($_GET['id']) && is_numeric($_GET['id'])) {
    $id = (int)$_GET['id'];
} elseif (preg_match('#/containers/(\d+)/?$#i', $uri, $matches)) {
    $id = (int)$matches[1];
}

$pdo = get_db();

// ------------------------------------------------------------------------------
// 1. GET: Public read endpoints
// ------------------------------------------------------------------------------
if ($method === 'GET') {
    if ($id !== null) {
        $stmt = $pdo->prepare('SELECT * FROM containers WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $id]);
        $container = $stmt->fetch();

        if (!$container) {
            send_error('Container not found.', 404);
        }

        $container['id'] = (int)$container['id'];
        $container['size_ft'] = (int)$container['size_ft'];
        $container['price'] = (float)$container['price'];
        $container['is_bookable'] = (int)$container['is_bookable'];

        send_json($container, 200);
    }

    $stmt = $pdo->query('SELECT * FROM containers ORDER BY id ASC');
    $containers = $stmt->fetchAll();

    foreach ($containers as &$c) {
        $c['id'] = (int)$c['id'];
        $c['size_ft'] = (int)$c['size_ft'];
        $c['price'] = (float)$c['price'];
        $c['is_bookable'] = (int)$c['is_bookable'];
    }
    unset($c);

    send_json($containers, 200);
}

// ------------------------------------------------------------------------------
// 2. Write Endpoints: Role-protected (admin, operator)
// ------------------------------------------------------------------------------
$currentUser = require_role(['admin', 'operator']);

if ($method === 'POST') {
    $input = get_json_input();

    $code = trim((string)($input['container_code'] ?? ''));
    $type = trim((string)($input['type'] ?? ''));
    $sizeFt = (int)($input['size_ft'] ?? 20);
    $category = trim((string)($input['category'] ?? 'Standard ISO'));
    $price = (float)($input['price'] ?? 0.0);
    $capacity = trim((string)($input['capacity'] ?? ''));
    $isBookable = isset($input['is_bookable']) ? (int)(bool)$input['is_bookable'] : 1;

    if (empty($code) || empty($type) || empty($capacity) || $price < 0) {
        send_error('container_code, type, capacity and a non-negative price are required.', 400);
    }

    // Check code uniqueness
    $checkStmt = $pdo->prepare('SELECT id FROM containers WHERE UPPER(container_code) = UPPER(:code) LIMIT 1');
    $checkStmt->execute(['code' => $code]);
    if ($checkStmt->fetch()) {
        send_error("Container with code '{$code}' already exists.", 400);
    }

    $insert = $pdo->prepare('
        INSERT INTO containers (container_code, type, size_ft, category, price, capacity, is_bookable, created_at, updated_at)
        VALUES (:code, :type, :size_ft, :category, :price, :capacity, :is_bookable, NOW(), NOW())
    ');
    $insert->execute([
        'code'        => $code,
        'type'        => $type,
        'size_ft'     => $sizeFt,
        'category'    => $category,
        'price'       => $price,
        'capacity'    => $capacity,
        'is_bookable' => $isBookable,
    ]);

    $newId = (int)$pdo->lastInsertId();
    $stmt = $pdo->prepare('SELECT * FROM containers WHERE id = :id LIMIT 1');
    $stmt->execute(['id' => $newId]);
    $created = $stmt->fetch();

    $created['id'] = (int)$created['id'];
    $created['size_ft'] = (int)$created['size_ft'];
    $created['price'] = (float)$created['price'];
    $created['is_bookable'] = (int)$created['is_bookable'];

    send_json($created, 201);
}

if ($method === 'PUT') {
    if ($id === null) {
        send_error('Container ID is required in the URL.', 400);
    }

    $stmt = $pdo->prepare('SELECT * FROM containers WHERE id = :id LIMIT 1');
    $stmt->execute(['id' => $id]);
    $existing = $stmt->fetch();

    if (!$existing) {
        send_error('Container not found.', 404);
    }

    $input = get_json_input();

    $code = isset($input['container_code']) ? trim((string)$input['container_code']) : $existing['container_code'];
    $type = isset($input['type']) ? trim((string)$input['type']) : $existing['type'];
    $sizeFt = isset($input['size_ft']) ? (int)$input['size_ft'] : (int)$existing['size_ft'];
    $category = isset($input['category']) ? trim((string)$input['category']) : $existing['category'];
    $price = isset($input['price']) ? (float)$input['price'] : (float)$existing['price'];
    $capacity = isset($input['capacity']) ? trim((string)$input['capacity']) : $existing['capacity'];
    $isBookable = isset($input['is_bookable']) ? (int)(bool)$input['is_bookable'] : (int)$existing['is_bookable'];

    // Check code uniqueness if code changed
    if (strcasecmp($code, $existing['container_code']) !== 0) {
        $checkStmt = $pdo->prepare('SELECT id FROM containers WHERE UPPER(container_code) = UPPER(:code) AND id != :id LIMIT 1');
        $checkStmt->execute(['code' => $code, 'id' => $id]);
        if ($checkStmt->fetch()) {
            send_error("Container with code '{$code}' already exists.", 400);
        }
    }

    $update = $pdo->prepare('
        UPDATE containers 
        SET container_code = :code, type = :type, size_ft = :size_ft, category = :category,
            price = :price, capacity = :capacity, is_bookable = :is_bookable, updated_at = NOW()
        WHERE id = :id
    ');
    $update->execute([
        'code'        => $code,
        'type'        => $type,
        'size_ft'     => $sizeFt,
        'category'    => $category,
        'price'       => $price,
        'capacity'    => $capacity,
        'is_bookable' => $isBookable,
        'id'          => $id,
    ]);

    $stmt = $pdo->prepare('SELECT * FROM containers WHERE id = :id LIMIT 1');
    $stmt->execute(['id' => $id]);
    $updated = $stmt->fetch();

    $updated['id'] = (int)$updated['id'];
    $updated['size_ft'] = (int)$updated['size_ft'];
    $updated['price'] = (float)$updated['price'];
    $updated['is_bookable'] = (int)$updated['is_bookable'];

    send_json($updated, 200);
}

if ($method === 'DELETE') {
    if ($id === null) {
        send_error('Container ID is required in the URL.', 400);
    }

    $stmt = $pdo->prepare('SELECT * FROM containers WHERE id = :id LIMIT 1');
    $stmt->execute(['id' => $id]);
    $existing = $stmt->fetch();

    if (!$existing) {
        send_error('Container not found.', 404);
    }

    // Check if referenced by active bookings
    $check = $pdo->prepare('SELECT COUNT(*) AS cnt FROM bookings WHERE container_id = :id');
    $check->execute(['id' => $id]);
    if ((int)$check->fetch()['cnt'] > 0) {
        send_error('Cannot delete container that is associated with existing bookings.', 400);
    }

    $delete = $pdo->prepare('DELETE FROM containers WHERE id = :id');
    $delete->execute(['id' => $id]);

    send_json([
        'message' => "Container {$existing['container_code']} was deleted successfully.",
        'id'      => $id,
    ], 200);
}

send_error('Method not allowed.', 405);

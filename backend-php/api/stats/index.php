<?php
/**
 * Stats API Endpoint
 * Handles:
 * - GET /api/stats/     : List all platform statistics
 * - GET /api/stats/{id} : Stat detail
 */

declare(strict_types=1);

require_once __DIR__ . '/../../includes/cors.php';
require_once __DIR__ . '/../../includes/response.php';
require_once __DIR__ . '/../../config/db.php';

if (empty($_GET) && !empty($_SERVER['QUERY_STRING'])) {
    parse_str($_SERVER['QUERY_STRING'], $_GET);
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$uri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?? '';

if ($method !== 'GET') {
    send_error('Method not allowed.', 405);
}

$pdo = get_db();

$id = null;
if (isset($_GET['id']) && is_numeric($_GET['id'])) {
    $id = (int)$_GET['id'];
} elseif (preg_match('#/stats/(\d+)/?$#i', $uri, $matches)) {
    $id = (int)$matches[1];
}

if ($id !== null) {
    $stmt = $pdo->prepare('SELECT id, number, label, sublabel, icon_name, order_num AS `order` FROM stat_items WHERE id = :id LIMIT 1');
    $stmt->execute(['id' => $id]);
    $item = $stmt->fetch();

    if (!$item) {
        send_error('Stat item not found', 404);
    }

    $item['id'] = (int)$item['id'];
    $item['order'] = (int)$item['order'];

    send_json($item, 200);
}

$stmt = $pdo->query('SELECT id, number, label, sublabel, icon_name, order_num AS `order` FROM stat_items ORDER BY order_num ASC');
$items = $stmt->fetchAll();

foreach ($items as &$it) {
    $it['id'] = (int)$it['id'];
    $it['order'] = (int)$it['order'];
}
unset($it);

send_json($items, 200);

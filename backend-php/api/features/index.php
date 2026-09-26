<?php
/**
 * Features API Endpoint
 * Handles:
 * - GET /api/features/     : List all platform feature cards
 * - GET /api/features/{id} : Feature card detail
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
} elseif (preg_match('#/features/(\d+)/?$#i', $uri, $matches)) {
    $id = (int)$matches[1];
}

if ($id !== null) {
    $stmt = $pdo->prepare('SELECT id, title, description, icon_name, order_num AS `order` FROM feature_cards WHERE id = :id LIMIT 1');
    $stmt->execute(['id' => $id]);
    $card = $stmt->fetch();

    if (!$card) {
        send_error('Feature card not found', 404);
    }

    $card['id'] = (int)$card['id'];
    $card['order'] = (int)$card['order'];

    send_json($card, 200);
}

$stmt = $pdo->query('SELECT id, title, description, icon_name, order_num AS `order` FROM feature_cards ORDER BY order_num ASC');
$cards = $stmt->fetchAll();

foreach ($cards as &$c) {
    $c['id'] = (int)$c['id'];
    $c['order'] = (int)$c['order'];
}
unset($c);

send_json($cards, 200);

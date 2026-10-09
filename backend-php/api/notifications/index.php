<?php
/**
 * Notifications API Endpoint
 * Handles:
 * - GET   /api/notifications/            : Authenticated - List user notifications (up to 50 newest) + unread count
 * - GET   /api/notifications/unread-count : Authenticated - Return unread notifications count
 * - PATCH /api/notifications/{id}/read   : Authenticated - Mark single notification as read
 * - POST  /api/notifications/mark-all-read : Authenticated - Mark all user notifications as read
 */

declare(strict_types=1);

require_once __DIR__ . '/../../includes/cors.php';
require_once __DIR__ . '/../../includes/response.php';
require_once __DIR__ . '/../../includes/auth.php';
require_once __DIR__ . '/../../config/db.php';

// Authentication required for all notification endpoints
$currentUser = require_auth();
$userId = (int)$currentUser['id'];

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$uri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?? '';

if (empty($_GET) && !empty($_SERVER['QUERY_STRING'])) {
    parse_str($_SERVER['QUERY_STRING'], $_GET);
}

// Extract ID and action from query param or URL slug
$id = null;
$action = $_GET['action'] ?? null;

if (preg_match('#/notifications/(\d+)/read/?$#i', $uri, $matches)) {
    $id = (int)$matches[1];
    $action = 'read';
} elseif (preg_match('#/notifications/unread-count/?$#i', $uri)) {
    $action = 'unread-count';
} elseif (preg_match('#/notifications/mark-all-read/?$#i', $uri)) {
    $action = 'mark-all-read';
} elseif (isset($_GET['id']) && is_numeric($_GET['id'])) {
    $id = (int)$_GET['id'];
} elseif (preg_match('#/notifications/(\d+)/?$#i', $uri, $matches)) {
    $id = (int)$matches[1];
}

$pdo = get_db();

function get_user_unread_count(PDO $pdo, int $userId): int
{
    $stmt = $pdo->prepare('SELECT COUNT(*) FROM notifications WHERE user_id = :user_id AND is_read = 0');
    $stmt->execute(['user_id' => $userId]);
    return (int)$stmt->fetchColumn();
}

// ------------------------------------------------------------------------------
// 1. GET Endpoints
// ------------------------------------------------------------------------------
if ($method === 'GET') {
    // GET /api/notifications/unread-count
    if ($action === 'unread-count') {
        $unreadCount = get_user_unread_count($pdo, $userId);
        send_json(['unread_count' => $unreadCount], 200);
    }

    // GET /api/notifications/ (list up to 50 newest first)
    if ($action === null && $id === null) {
        $stmt = $pdo->prepare('
            SELECT id, booking_id, type, title, message, is_read, created_at
            FROM notifications
            WHERE user_id = :user_id
            ORDER BY created_at DESC, id DESC
            LIMIT 50
        ');
        $stmt->execute(['user_id' => $userId]);
        $rows = $stmt->fetchAll();

        $notifications = [];
        foreach ($rows as $row) {
            $notifications[] = [
                'id'         => (int)$row['id'],
                'booking_id' => $row['booking_id'] !== null ? (int)$row['booking_id'] : null,
                'type'       => (string)$row['type'],
                'title'      => (string)$row['title'],
                'message'    => (string)$row['message'],
                'is_read'    => (int)$row['is_read'],
                'created_at' => (string)$row['created_at'],
            ];
        }

        $unreadCount = get_user_unread_count($pdo, $userId);

        send_json([
            'notifications' => $notifications,
            'unread_count'  => $unreadCount,
        ], 200);
    }

    send_error('Endpoint not found.', 404);
}

// ------------------------------------------------------------------------------
// 2. PATCH Endpoints: PATCH /api/notifications/{id}/read
// ------------------------------------------------------------------------------
if ($method === 'PATCH') {
    if ($action === 'read' && $id !== null) {
        $checkStmt = $pdo->prepare('
            SELECT id, is_read
            FROM notifications
            WHERE id = :id AND user_id = :user_id
            LIMIT 1
        ');
        $checkStmt->execute([
            'id'      => $id,
            'user_id' => $userId,
        ]);
        $notification = $checkStmt->fetch();

        if (!$notification) {
            send_error('Notification not found.', 404);
        }

        if ((int)$notification['is_read'] === 0) {
            $updateStmt = $pdo->prepare('
                UPDATE notifications
                SET is_read = 1
                WHERE id = :id AND user_id = :user_id
            ');
            $updateStmt->execute([
                'id'      => $id,
                'user_id' => $userId,
            ]);
        }

        $unreadCount = get_user_unread_count($pdo, $userId);

        send_json([
            'id'           => $id,
            'is_read'      => 1,
            'unread_count' => $unreadCount,
        ], 200);
    }

    send_error('Endpoint not found.', 404);
}

// ------------------------------------------------------------------------------
// 3. POST Endpoints: POST /api/notifications/mark-all-read
// ------------------------------------------------------------------------------
if ($method === 'POST') {
    if ($action === 'mark-all-read') {
        $updateStmt = $pdo->prepare('
            UPDATE notifications
            SET is_read = 1
            WHERE user_id = :user_id AND is_read = 0
        ');
        $updateStmt->execute(['user_id' => $userId]);
        $updated = $updateStmt->rowCount();

        send_json([
            'updated'      => (int)$updated,
            'unread_count' => 0,
        ], 200);
    }

    send_error('Endpoint not found.', 404);
}

send_error('Method not allowed.', 405);

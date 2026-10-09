<?php
/**
 * HashHarbour Notifications Helper Library
 * Provides notification insertion and dispatch helpers
 */

declare(strict_types=1);

function notification_status_label(string $status): string
{
    switch ($status) {
        case 'confirmed':
            return 'Confirmed';
        case 'in_transit':
            return 'In Transit';
        case 'completed':
            return 'Delivered';
        case 'cancelled':
            return 'Cancelled';
        case 'pending':
            return 'Pending';
        default:
            return $status;
    }
}

function notify_user(PDO $pdo, int $userId, ?int $bookingId, string $type, string $title, string $message): void
{
    $stmt = $pdo->prepare('
        INSERT INTO notifications (user_id, booking_id, type, title, message)
        VALUES (:user_id, :booking_id, :type, :title, :message)
    ');
    $stmt->execute([
        'user_id'    => $userId,
        'booking_id' => $bookingId,
        'type'       => $type,
        'title'      => $title,
        'message'    => $message,
    ]);
}

function notify_staff_booking_created(PDO $pdo, int $bookingId, string $bookingReference, string $customerName, int $actorUserId): void
{
    $stmt = $pdo->prepare('
        SELECT id FROM users
        WHERE role IN ("admin", "super_admin")
          AND is_active = 1
          AND id <> :actor
    ');
    $stmt->execute(['actor' => $actorUserId]);
    $staffUsers = $stmt->fetchAll();

    $name = trim($customerName);
    if ($name === '') {
        $name = 'a customer';
    }

    $title = 'New Booking Received';
    $message = "Booking {$bookingReference} was created by {$name}.";

    foreach ($staffUsers as $staff) {
        notify_user($pdo, (int)$staff['id'], $bookingId, 'booking_created', $title, $message);
    }
}

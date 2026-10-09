-- ==============================================================================
-- HashHarbour Migration 006: Create notifications table
-- Target: MariaDB 10.4+ / MySQL 8.0+
-- Database: hashharbour
-- ==============================================================================
-- PURPOSE:
-- In-app notifications: staff get one when a booking is created;
-- a customer gets one on every status change of their booking incl. cancel.
--
-- IMPORTANT PRE-CONDITIONS & INSTRUCTIONS:
-- 1. Backup first: take a mysqldump backup first and check the last line
--    reads "Dump completed".
-- 2. Pre-conditions: users and bookings tables must exist
--    (they use InnoDB, utf8mb4, utf8mb4_unicode_ci, int(11) ids).
-- ==============================================================================

USE `hashharbour`;

CREATE TABLE IF NOT EXISTS `notifications` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL COMMENT 'Recipient of this notification',
  `booking_id` INT(11) DEFAULT NULL COMMENT 'Related booking, used for click-through',
  `type` VARCHAR(50) NOT NULL COMMENT 'booking_created | booking_status_confirmed | booking_status_in_transit | booking_status_completed | booking_cancelled',
  `title` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_notifications_user_read` (`user_id`, `is_read`),
  KEY `idx_notifications_user_created` (`user_id`, `created_at`),
  KEY `idx_notifications_booking` (`booking_id`),
  CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_notifications_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

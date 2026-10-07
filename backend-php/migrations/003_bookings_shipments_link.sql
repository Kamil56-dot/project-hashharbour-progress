-- ==============================================================================
-- HashHarbour Migration 002: Link Shipments to Bookings & Users + Booking Cancellation Metadata
-- Target: MariaDB 10.4+ / MySQL 8.0+
-- Database: hashharbour
-- ==============================================================================

USE `hashharbour`;

-- ------------------------------------------------------------------------------
-- 1. BOOKINGS TABLE: Add cancellation metadata (cancelled_at, cancel_reason, cancelled_by)
-- ------------------------------------------------------------------------------

ALTER TABLE `bookings`
  ADD COLUMN IF NOT EXISTS `cancelled_at` TIMESTAMP NULL DEFAULT NULL COMMENT 'Timestamp when booking was cancelled',
  ADD COLUMN IF NOT EXISTS `cancel_reason` VARCHAR(255) NULL DEFAULT NULL COMMENT 'Reason provided for cancellation',
  ADD COLUMN IF NOT EXISTS `cancelled_by` INT NULL DEFAULT NULL COMMENT 'User ID who requested or performed cancellation';

-- Add index on cancelled_at if not exists
ALTER TABLE `bookings`
  ADD INDEX IF NOT EXISTS `idx_bookings_cancelled_at` (`cancelled_at`);

-- ------------------------------------------------------------------------------
-- 2. SHIPMENTS TABLE: Add nullable booking_id and user_id foreign relations
-- Existing rows remain fully valid with NULL booking_id / user_id
-- ------------------------------------------------------------------------------

ALTER TABLE `shipments`
  ADD COLUMN IF NOT EXISTS `booking_id` INT NULL DEFAULT NULL COMMENT 'Optional reference to origin booking',
  ADD COLUMN IF NOT EXISTS `user_id` INT NULL DEFAULT NULL COMMENT 'Customer or owner user ID associated with this shipment',
  ADD INDEX IF NOT EXISTS `idx_shipments_booking` (`booking_id`),
  ADD INDEX IF NOT EXISTS `idx_shipments_user` (`user_id`);

-- ------------------------------------------------------------------------------
-- 3. IDEMPOTENT FOREIGN KEYS VIA PROCEDURE
-- ------------------------------------------------------------------------------

DROP PROCEDURE IF EXISTS `add_fk_if_not_exists`;

DELIMITER //
CREATE PROCEDURE `add_fk_if_not_exists`(
    IN target_table VARCHAR(64),
    IN fk_name VARCHAR(64),
    IN fk_definition TEXT
)
BEGIN
    DECLARE fk_count INT;
    SELECT COUNT(*) INTO fk_count
    FROM information_schema.TABLE_CONSTRAINTS
    WHERE CONSTRAINT_SCHEMA = DATABASE()
      AND TABLE_NAME = target_table
      AND CONSTRAINT_NAME = fk_name
      AND CONSTRAINT_TYPE = 'FOREIGN KEY';

    IF fk_count = 0 THEN
        SET @sql = CONCAT('ALTER TABLE `', target_table, '` ADD CONSTRAINT `', fk_name, '` ', fk_definition);
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END//
DELIMITER ;

-- Apply foreign keys
CALL `add_fk_if_not_exists`('shipments', 'fk_shipments_booking', 'FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE SET NULL');
CALL `add_fk_if_not_exists`('shipments', 'fk_shipments_user', 'FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL');

-- Clean up helper procedure
DROP PROCEDURE IF EXISTS `add_fk_if_not_exists`;

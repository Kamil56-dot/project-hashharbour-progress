-- ==============================================================================
-- HashHarbour Migration 002: Bookings Refund Status
-- Target: MariaDB 10.4+ / MySQL 8.0+
-- Database: hashharbour
-- ==============================================================================

USE `hashharbour`;

-- ------------------------------------------------------------------------------
-- 1. ADD refund_status COLUMN TO bookings (Idempotent)
-- ------------------------------------------------------------------------------
ALTER TABLE `bookings`
  ADD COLUMN IF NOT EXISTS `refund_status` ENUM('none', 'pending', 'refunded') NOT NULL DEFAULT 'none';

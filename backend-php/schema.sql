-- ==============================================================================
-- HashHarbour Database Schema (MySQL 8.0+ / MariaDB)
-- Generated for Phase 1 Migration: Django -> PHP + MySQL
-- Charset: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `hashharbour`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `hashharbour`;

-- Disable foreign key checks during table setup
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------------------------
-- 1. USERS TABLE
-- Drop 'username' column entirely: email is the sole login identifier.
-- Role enum supports RBAC: customer, operator, admin.
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(100) DEFAULT NULL,
  `last_name` VARCHAR(100) DEFAULT NULL,
  `role` ENUM('customer', 'operator', 'admin') NOT NULL DEFAULT 'customer',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 2. REFRESH TOKENS TABLE
-- Stateful tracking of refresh tokens for rotation and revocation.
-- Stores SHA-256 hashed token for security (never raw tokens).
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `refresh_tokens`;
CREATE TABLE `refresh_tokens` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `token_hash` VARCHAR(64) NOT NULL,
  `issued_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` DATETIME NOT NULL,
  `revoked` TINYINT(1) NOT NULL DEFAULT 0,
  INDEX `idx_refresh_tokens_hash` (`token_hash`),
  INDEX `idx_refresh_tokens_user` (`user_id`),
  CONSTRAINT `fk_refresh_tokens_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 3. CONTAINERS TABLE
-- ISO shipping container inventory and rental catalog.
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `containers`;
CREATE TABLE `containers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `container_code` VARCHAR(50) NOT NULL UNIQUE,
  `type` VARCHAR(100) NOT NULL,
  `size_ft` INT NOT NULL DEFAULT 20,
  `category` VARCHAR(100) NOT NULL DEFAULT 'Standard ISO',
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `capacity` VARCHAR(100) NOT NULL,
  `is_bookable` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_containers_code` (`container_code`),
  INDEX `idx_containers_type` (`type`),
  INDEX `idx_containers_bookable` (`is_bookable`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 4. BOOKINGS TABLE
-- Container reservation records with the Price-Snapshot Pattern.
-- 'price_snapshot' locks the agreed rate at booking time.
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `bookings`;
CREATE TABLE `bookings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `booking_reference` VARCHAR(50) NOT NULL UNIQUE,
  `user_id` INT NOT NULL,
  `container_id` INT NOT NULL,
  `price_snapshot` DECIMAL(10,2) NOT NULL COMMENT 'Locked price agreed at booking execution time',
  `status` ENUM('pending', 'confirmed', 'in_transit', 'completed', 'cancelled') NOT NULL DEFAULT 'confirmed',
  `origin_port` VARCHAR(150) DEFAULT NULL,
  `destination_port` VARCHAR(150) DEFAULT NULL,
  `start_date` DATE DEFAULT NULL,
  `end_date` DATE DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_bookings_ref` (`booking_reference`),
  INDEX `idx_bookings_user` (`user_id`),
  INDEX `idx_bookings_container` (`container_id`),
  INDEX `idx_bookings_status` (`status`),
  CONSTRAINT `fk_bookings_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_bookings_container` FOREIGN KEY (`container_id`) REFERENCES `containers` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 5. SHIPMENTS TABLE
-- Real-time tracking data matching Django api_shipment model.
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `shipments`;
CREATE TABLE `shipments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `tracking_number` VARCHAR(50) NOT NULL UNIQUE,
  `status` ENUM('Booked', 'In Transit', 'Customs Cleared', 'Delivered') NOT NULL DEFAULT 'In Transit',
  `origin` VARCHAR(150) NOT NULL,
  `destination` VARCHAR(150) NOT NULL,
  `vessel` VARCHAR(100) NOT NULL,
  `eta` DATE NOT NULL,
  `progress_percent` INT NOT NULL DEFAULT 50,
  `last_update` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_shipments_tracking` (`tracking_number`),
  INDEX `idx_shipments_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 6. STAT_ITEMS TABLE
-- Display metrics for landing page matching Django api_statitem model.
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `stat_items`;
CREATE TABLE `stat_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `number` VARCHAR(50) NOT NULL,
  `label` VARCHAR(100) NOT NULL,
  `sublabel` VARCHAR(150) NOT NULL,
  `icon_name` VARCHAR(50) NOT NULL DEFAULT 'Ship',
  `order_num` INT NOT NULL DEFAULT 0,
  INDEX `idx_stat_items_order` (`order_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 7. FEATURE_CARDS TABLE
-- Capability cards matching Django api_featurecard model.
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `feature_cards`;
CREATE TABLE `feature_cards` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(100) NOT NULL,
  `description` TEXT NOT NULL,
  `icon_name` VARCHAR(50) NOT NULL DEFAULT 'Ship',
  `order_num` INT NOT NULL DEFAULT 0,
  INDEX `idx_feature_cards_order` (`order_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ==============================================================================
-- INITIAL SEED DATA
-- Matches Django backend/seed.py + demo accounts & container catalog
-- ==============================================================================

-- 1. Users (password is 'password123' hashed with bcrypt)
INSERT INTO `users` (`id`, `email`, `password_hash`, `first_name`, `last_name`, `role`, `is_active`)
VALUES
  (1, 'demo@hashharbour.com', '$2y$10$5a8eX1M5JeDQx/mwIHWV7.iIACvPAyhp47mM/pDQ6GsZhwKrYASNe', 'Demo', 'User', 'customer', 1),
  (2, 'admin@hashharbour.com', '$2y$10$5a8eX1M5JeDQx/mwIHWV7.iIACvPAyhp47mM/pDQ6GsZhwKrYASNe', 'Admin', 'Officer', 'admin', 1)
ON DUPLICATE KEY UPDATE `email` = VALUES(`email`);

-- 2. Platform Statistics (from Django seed.py)
INSERT INTO `stat_items` (`id`, `number`, `label`, `sublabel`, `icon_name`, `order_num`)
VALUES
  (1, '1200+', 'Shipments Delivered', 'Across the Globe', 'Ship', 1),
  (2, '850+', 'Global Routes', 'Optimized & Reliable', 'Box', 2),
  (3, '980+', 'Trusted Clients', 'Businesses Worldwide', 'Users', 3),
  (4, '95+', 'Countries Connected', 'One Global Network', 'Globe', 4)
ON DUPLICATE KEY UPDATE `number` = VALUES(`number`);

-- 3. Feature Cards (from Django seed.py)
INSERT INTO `feature_cards` (`id`, `title`, `description`, `icon_name`, `order_num`)
VALUES
  (1, 'Smart Booking', 'Book containers instantly with real-time availability and the most competitive rates.', 'Ship', 1),
  (2, 'Real-Time Tracking', 'Track your shipments in real-time across sea, air, and land with complete visibility.', 'Navigation', 2),
  (3, 'Secure & Compliant', 'Built with global compliance standards to ensure secure and reliable trade operations.', 'ShieldCheck', 3)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- 4. Sample Shipments (from Django seed.py)
INSERT INTO `shipments` (`id`, `tracking_number`, `status`, `origin`, `destination`, `vessel`, `eta`, `progress_percent`, `last_update`)
VALUES
  (1, 'HH-100293', 'In Transit', 'Shanghai Port, CN', 'Rotterdam Gateway, NL', 'HH Horizon V-402', '2026-08-04', 68, 'Passed Singapore Strait (12:40 UTC)'),
  (2, 'HH-849201', 'Customs Cleared', 'Singapore Hub, SG', 'Port of Hamburg, DE', 'HH Titan X-109', '2026-07-30', 92, 'Berthing at Terminal 4 (09:15 UTC)')
ON DUPLICATE KEY UPDATE `tracking_number` = VALUES(`tracking_number`);

-- 5. Standard ISO Containers Catalog
INSERT INTO `containers` (`id`, `container_code`, `type`, `size_ft`, `category`, `price`, `capacity`, `is_bookable`)
VALUES
  -- Bookable Containers (is_bookable = 1)
  (1, 'HH-20-DRY', 'Standard Dry', 20, 'Standard ISO', 1450.00, '33.2 CBM / 28,200 KG', 1),
  (2, 'HH-40-DRY', 'Standard Dry', 40, 'Standard ISO', 2250.00, '67.7 CBM / 28,750 KG', 1),
  (3, 'HH-40-HC', 'High Cube', 40, 'High Cube ISO', 2600.00, '76.4 CBM / 28,600 KG', 1),
  (4, 'HH-20-TANK', 'Oil/Tank', 20, 'Liquid Bulk', 3100.00, '26,000 Liters / 30,480 KG', 1),

  -- Non-bookable Containers (is_bookable = 0)
  (5, 'HH-20-REEF', 'Refrigerated', 20, 'Cold Chain', 3200.00, '28.3 CBM / 27,400 KG', 0),
  (6, 'HH-40-OT', 'Open Top', 40, 'Specialized Cargo', 2850.00, '65.5 CBM / 31,500 KG', 0),
  (7, 'HH-40-FR', 'Flat Rack', 40, 'OOG / Heavy Machinery', 3400.00, '45,000 KG Payload', 0),
  (8, 'HH-20-ISOTANK', 'Tank/ISO Special', 20, 'Chemical & Hazardous Bulk', 3850.00, '24,000 Liters / 32,000 KG', 0)
ON DUPLICATE KEY UPDATE 
  `container_code` = VALUES(`container_code`),
  `type` = VALUES(`type`),
  `size_ft` = VALUES(`size_ft`),
  `category` = VALUES(`category`),
  `price` = VALUES(`price`),
  `capacity` = VALUES(`capacity`),
  `is_bookable` = VALUES(`is_bookable`);


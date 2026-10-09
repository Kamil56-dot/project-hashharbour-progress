-- ==============================================================================
-- HashHarbour Migration 004: Update Container Pricing and Availability
-- Target: MariaDB 10.4+ / MySQL 8.0+
-- Database: hashharbour
-- ==============================================================================

USE `hashharbour`;

-- 1. Oil/Tank (id 4): Update price to 2263.00
UPDATE `containers`
SET `price` = 2263.00
WHERE `id` = 4;

-- 2. Reefer (id 5): Update price to 2590.00 and set is_bookable = 1
UPDATE `containers`
SET `price` = 2590.00,
    `is_bookable` = 1
WHERE `id` = 5;

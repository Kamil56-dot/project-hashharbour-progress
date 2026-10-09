-- ==============================================================================
-- HashHarbour Migration 005: Remove Manager Role from users.role ENUM
-- Target: MariaDB 10.4+ / MySQL 8.0+
-- Database: hashharbour
-- ==============================================================================
-- IMPORTANT PRE-CONDITIONS & INSTRUCTIONS:
-- 1. Backup first: take a mysqldump of the database and verify the last line
--    reads "Dump completed" before running any schema migration.
-- 2. Precheck query:
--    SELECT COUNT(*) FROM users WHERE role = 'manager';
--    This count MUST return 0 before applying this migration.
-- 3. Safety guarantee: No UPDATE/DELETE or silent role demotion is performed.
--    If any row with role = 'manager' still exists, the ALTER TABLE statement
--    below will deliberately fail.
-- ==============================================================================

USE `hashharbour`;

ALTER TABLE `users`
  MODIFY COLUMN `role` ENUM('customer', 'admin', 'super_admin') NOT NULL DEFAULT 'customer';

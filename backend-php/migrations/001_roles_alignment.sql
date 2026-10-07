-- ==============================================================================
-- HashHarbour Migration 001: Roles Alignment & Singleton Super Admin Enforcement
-- Target: MariaDB 10.4+ / MySQL 8.0+
-- Database: hashharbour
-- ==============================================================================

USE `hashharbour`;

-- ------------------------------------------------------------------------------
-- 1. ENUM ALIGNMENT: operator -> manager, add super_admin
-- ------------------------------------------------------------------------------

-- Step a: Temporarily widen enum to accept both operator and manager
ALTER TABLE `users`
  MODIFY COLUMN `role` ENUM('customer', 'operator', 'manager', 'admin', 'super_admin') NOT NULL DEFAULT 'customer';

-- Step b: Migrate any existing operator records to manager
UPDATE `users`
  SET `role` = 'manager'
  WHERE `role` = 'operator';

-- Step c: Lock final enum (operator removed)
ALTER TABLE `users`
  MODIFY COLUMN `role` ENUM('customer', 'manager', 'admin', 'super_admin') NOT NULL DEFAULT 'customer';

-- ------------------------------------------------------------------------------
-- 2. ENFORCE SINGLETON SUPER ADMIN: Persistent Generated Column + Unique Index
-- ------------------------------------------------------------------------------

-- Step d: Add STORED generated column and unique constraint
-- Uses IF NOT EXISTS to guarantee idempotent re-runs on MariaDB 10.4+
ALTER TABLE `users`
  ADD COLUMN IF NOT EXISTS `super_admin_flag` TINYINT(1)
    GENERATED ALWAYS AS (IF(`role` = 'super_admin', 1, NULL)) STORED,
  ADD UNIQUE INDEX IF NOT EXISTS `idx_unique_super_admin` (`super_admin_flag`);

-- ------------------------------------------------------------------------------
-- 3. DEFENSE IN DEPTH: Immutable Super Admin Triggers
-- ------------------------------------------------------------------------------

-- Step e.1: Trigger to block demotion or promotion to super_admin via UPDATE
DROP TRIGGER IF EXISTS `trg_users_before_update_super_admin`;
DELIMITER //
CREATE TRIGGER `trg_users_before_update_super_admin`
BEFORE UPDATE ON `users`
FOR EACH ROW
BEGIN
    -- Prohibit demoting or changing super_admin role
    IF OLD.role = 'super_admin' AND NEW.role <> 'super_admin' THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Operation prohibited: The super_admin role cannot be changed or demoted.';
    END IF;

    -- Prohibit promoting any existing user to super_admin via UPDATE
    IF NEW.role = 'super_admin' AND OLD.role <> 'super_admin' THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Operation prohibited: Existing users cannot be promoted to super_admin via UPDATE.';
    END IF;
END//
DELIMITER ;

-- Step e.2: Trigger to block deletion of the super_admin account
DROP TRIGGER IF EXISTS `trg_users_before_delete_super_admin`;
DELIMITER //
CREATE TRIGGER `trg_users_before_delete_super_admin`
BEFORE DELETE ON `users`
FOR EACH ROW
BEGIN
    IF OLD.role = 'super_admin' THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Operation prohibited: The super_admin account cannot be deleted.';
    END IF;
END//
DELIMITER ;

-- ------------------------------------------------------------------------------
-- 4. ROLE AUDIT LOG TABLE
-- ------------------------------------------------------------------------------

-- Step f: Create role_audit_log table with RESTRICT foreign keys and indexes
CREATE TABLE IF NOT EXISTS `role_audit_log` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `actor_id` INT NULL COMMENT 'NULL indicates system/CLI seed script',
  `target_id` INT NOT NULL COMMENT 'User whose role was assigned or changed',
  `action` ENUM('create_user', 'role_change') NOT NULL,
  `old_role` VARCHAR(20) DEFAULT NULL,
  `new_role` VARCHAR(20) NOT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_role_audit_target` (`target_id`),
  INDEX `idx_role_audit_created` (`created_at`),
  CONSTRAINT `fk_role_audit_actor` FOREIGN KEY (`actor_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_role_audit_target` FOREIGN KEY (`target_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

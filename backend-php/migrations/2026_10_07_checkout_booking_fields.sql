-- Migration: Add checkout and payment fields to bookings table
-- Date: 2026-10-07
-- Phase: 4 (Checkout & Payment)
-- Database: MariaDB / MySQL (Supports ADD COLUMN IF NOT EXISTS)

ALTER TABLE `bookings`
  ADD COLUMN IF NOT EXISTS `quantity` INT NOT NULL DEFAULT 1 AFTER `container_id`,
  ADD COLUMN IF NOT EXISTS `insurance_selected` TINYINT(1) NOT NULL DEFAULT 0 AFTER `quantity`,
  ADD COLUMN IF NOT EXISTS `payment_method` VARCHAR(20) NULL DEFAULT NULL AFTER `status`,
  ADD COLUMN IF NOT EXISTS `total_amount` DECIMAL(12,2) NULL DEFAULT NULL AFTER `payment_method`,
  ADD COLUMN IF NOT EXISTS `billing_name` VARCHAR(150) NULL DEFAULT NULL AFTER `total_amount`,
  ADD COLUMN IF NOT EXISTS `billing_address` VARCHAR(500) NULL DEFAULT NULL AFTER `billing_name`;

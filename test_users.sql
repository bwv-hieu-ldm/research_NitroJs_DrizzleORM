-- Test Users for Authentication Testing
-- Run these SQL statements to create test users

-- First, make sure the users table exists and has the required columns
-- If you need to add the auth columns, run this first:
-- ALTER TABLE `users` ADD COLUMN `password` VARCHAR(255) NOT NULL AFTER `email`;
-- ALTER TABLE `users` ADD COLUMN `role` VARCHAR(50) NOT NULL DEFAULT 'user' AFTER `password`;

-- Clear existing test users (optional)
DELETE FROM `users` WHERE `email` IN ('admin@example.com', 'moderator@example.com', 'user@example.com');

-- Insert Admin User
-- Password: password123 (bcrypt hash)
INSERT INTO `users` (`name`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
('Admin User', 'admin@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', NOW(), NOW());

-- Insert Moderator User  
-- Password: password123 (bcrypt hash)
INSERT INTO `users` (`name`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
('Moderator User', 'moderator@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'moderator', NOW(), NOW());

-- Insert Regular User
-- Password: password123 (bcrypt hash)
INSERT INTO `users` (`name`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
('Regular User', 'user@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', NOW(), NOW());

-- Verify the users were created
SELECT `id`, `name`, `email`, `role`, `created_at` FROM `users` WHERE `email` LIKE '%@example.com';

-- Test login credentials:
-- admin@example.com / password123
-- moderator@example.com / password123  
-- user@example.com / password123

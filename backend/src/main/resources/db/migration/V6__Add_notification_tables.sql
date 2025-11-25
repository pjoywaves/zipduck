-- V6: Add notification subscription and log tables
-- Feature: 002-auth-notification-system
-- Date: 2025-11-25

-- Notification subscriptions
CREATE TABLE IF NOT EXISTS notification_subscriptions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    region VARCHAR(100) NULL COMMENT 'NULL for all regions',
    min_income BIGINT NULL COMMENT 'NULL for no minimum',
    max_income BIGINT NULL COMMENT 'NULL for no maximum',
    notification_type ENUM('NEW', 'DEADLINE') NOT NULL COMMENT 'NEW: new subscription offer, DEADLINE: deadline approaching',
    delivery_method ENUM('EMAIL', 'PUSH', 'BOTH') NOT NULL DEFAULT 'BOTH',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_active_type (active, notification_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='User notification subscriptions for housing subscription offers';

-- Notification send logs
CREATE TABLE IF NOT EXISTS notification_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    subscription_id BIGINT NOT NULL,
    offer_id BIGINT NOT NULL COMMENT 'Housing subscription offer ID',
    sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    delivery_type ENUM('EMAIL', 'PUSH') NOT NULL,
    status ENUM('SUCCESS', 'FAILED') NOT NULL,
    failure_reason TEXT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subscription_id) REFERENCES notification_subscriptions(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_offer_date (user_id, offer_id, (DATE(sent_at))) COMMENT 'Prevent duplicate notifications within 24 hours',
    INDEX idx_sent_at (sent_at),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Notification send history and duplicate prevention';

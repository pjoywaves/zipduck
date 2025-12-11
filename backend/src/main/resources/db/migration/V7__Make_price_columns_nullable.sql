-- ==========================================
-- V7: Make price columns nullable
-- ==========================================
-- Reason: Public data API does not always provide price information
--         This causes insertion failures when max_price/min_price are null
-- Date: 2025-12-11
-- ==========================================

ALTER TABLE subscriptions MODIFY COLUMN min_price BIGINT NULL;
ALTER TABLE subscriptions MODIFY COLUMN max_price BIGINT NULL;
-- T107: MySQL Query Optimization and Index Addition
-- Performance indexes for improved query speed
-- Created: Phase 7

-- ==========================================
-- PDF Tables (if not created by V2)
-- ==========================================
CREATE TABLE IF NOT EXISTS pdf_documents (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    cache_key VARCHAR(255) UNIQUE,
    processing_status VARCHAR(20) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_cache_key (cache_key),
    INDEX idx_status (processing_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS pdf_analysis_results (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    pdf_id BIGINT NOT NULL,
    subscription_id BIGINT,
    extracted_text TEXT,
    extracted_criteria JSON,
    match_score INT,
    age_eligible BOOLEAN,
    income_eligible BOOLEAN,
    household_eligible BOOLEAN,
    housing_owned_eligible BOOLEAN,
    overall_eligible BOOLEAN,
    recommendations TEXT,
    ocr_warning TEXT,
    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pdf_id) REFERENCES pdf_documents(id) ON DELETE CASCADE,
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL,
    INDEX idx_pdf_id (pdf_id),
    INDEX idx_subscription_id (subscription_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- Favorites Table (New in Phase 6)
-- ==========================================
CREATE TABLE IF NOT EXISTS favorites (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    subscription_id BIGINT NOT NULL,
    note VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_subscription (user_id, subscription_id),
    INDEX idx_user_id (user_id),
    INDEX idx_subscription_id (subscription_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- Performance Indexes for Subscriptions
-- ==========================================

-- Composite index for active subscriptions by date range
CREATE INDEX idx_active_application_dates
ON subscriptions(is_active, application_start_date, application_end_date);

-- Index for filtering by eligibility criteria
-- Note: MySQL does not support partial indexes with WHERE clause
CREATE INDEX idx_eligibility_age
ON subscriptions(is_active, min_age, max_age);

CREATE INDEX idx_eligibility_income
ON subscriptions(is_active, min_income, max_income);

CREATE INDEX idx_eligibility_household
ON subscriptions(is_active, min_household_members, max_household_members);

-- Index for price range queries
CREATE INDEX idx_price_range
ON subscriptions(min_price, max_price, is_active);

-- Composite index for location-based active subscriptions
CREATE INDEX idx_location_active_date
ON subscriptions(location, is_active, application_end_date);

-- ==========================================
-- Performance Indexes for User Profiles
-- ==========================================

-- Composite index for eligibility matching
CREATE INDEX idx_profile_criteria
ON user_profiles(age, annual_income, household_members, housing_owned);

-- ==========================================
-- Performance Indexes for PDF Documents
-- ==========================================

-- Composite index for user's PDF status queries
-- Note: removed DESC as it's not supported in CREATE INDEX in MySQL
CREATE INDEX idx_user_status_uploaded
ON pdf_documents(user_id, processing_status, uploaded_at);

-- ==========================================
-- Performance Indexes for Eligibility Matches (if table exists)
-- ==========================================

CREATE TABLE IF NOT EXISTS eligibility_matches (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    subscription_id BIGINT NOT NULL,
    match_score INT NOT NULL,
    age_eligible BOOLEAN NOT NULL,
    income_eligible BOOLEAN NOT NULL,
    household_eligible BOOLEAN NOT NULL,
    housing_owned_eligible BOOLEAN NOT NULL,
    overall_eligible BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE,
    INDEX idx_user_subscription (user_id, subscription_id),
    INDEX idx_match_score (match_score),
    INDEX idx_overall_eligible (overall_eligible, match_score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- Optimize Existing Tables
-- ==========================================

-- Add index for frequently joined columns
-- Note: MySQL 5.x does not support IF NOT EXISTS in CREATE INDEX
-- These may fail if indexes already exist, which is okay
-- CREATE INDEX idx_updated_at ON users(updated_at DESC);
-- CREATE INDEX idx_created_updated ON subscriptions(created_at, updated_at);

-- ==========================================
-- Query Hints and Statistics
-- ==========================================

-- Analyze tables to update statistics for query optimizer
ANALYZE TABLE users;
ANALYZE TABLE user_profiles;
ANALYZE TABLE subscriptions;
ANALYZE TABLE favorites;
ANALYZE TABLE pdf_documents;
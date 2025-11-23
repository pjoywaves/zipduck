-- User Story 1: Profile Creation and Unified Recommendation View
-- Add users and update schema for new entity structure

-- Drop old tables first to avoid constraint conflicts
DROP TABLE IF EXISTS eligibility_match;
DROP TABLE IF EXISTS favorite;
DROP TABLE IF EXISTS pdf_analysis_result;
DROP TABLE IF EXISTS pdf_document;
DROP TABLE IF EXISTS subscription;
DROP TABLE IF EXISTS user_profile;

-- ==========================================
-- Users Table
-- ==========================================
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- User Profiles Table (Updated)
-- ==========================================
CREATE TABLE user_profiles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNIQUE NOT NULL,
    age INT NOT NULL,
    annual_income BIGINT NOT NULL,
    household_members INT NOT NULL,
    housing_owned INT NOT NULL,
    location_preferences VARCHAR(500),
    notifications_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    CONSTRAINT chk_age CHECK (age >= 19 AND age <= 150),
    CONSTRAINT chk_income CHECK (annual_income >= 0),
    CONSTRAINT chk_household CHECK (household_members >= 1),
    CONSTRAINT chk_housing CHECK (housing_owned >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- Subscriptions Table (Updated with new structure)
-- ==========================================
CREATE TABLE subscriptions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    address VARCHAR(1000),
    housing_type VARCHAR(50) NOT NULL,
    min_price BIGINT NOT NULL,
    max_price BIGINT NOT NULL,

    -- Eligibility criteria
    min_age INT,
    max_age INT,
    min_income BIGINT,
    max_income BIGINT,
    min_household_members INT,
    max_household_members INT,
    max_housing_owned INT,
    special_qualifications VARCHAR(2000),
    preference_categories VARCHAR(1000),

    -- Application period
    application_start_date DATE NOT NULL,
    application_end_date DATE NOT NULL,

    -- Data source tracking
    data_source VARCHAR(20) NOT NULL DEFAULT 'PUBLIC_DB',
    is_merged BOOLEAN NOT NULL DEFAULT FALSE,
    public_data_id VARCHAR(500),
    pdf_document_id VARCHAR(500),

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    detail_url VARCHAR(2000),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_data_source (data_source),
    INDEX idx_location (location),
    INDEX idx_active (is_active),
    INDEX idx_active_period (is_active, application_end_date),
    INDEX idx_public_data_id (public_data_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
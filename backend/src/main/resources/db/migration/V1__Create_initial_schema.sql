-- ZipDuck Initial Schema
-- Created: 2025-11-21
-- Version: V1

-- ==========================================
-- User Profile Table
-- ==========================================
CREATE TABLE user_profile (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    age INT NOT NULL,
    annual_income DECIMAL(15,2) NOT NULL,
    household_members INT NOT NULL,
    housing_owned INT NOT NULL,
    location_preferences JSON,
    notification_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    CONSTRAINT chk_age CHECK (age >= 19 AND age <= 100),
    CONSTRAINT chk_income CHECK (annual_income >= 0),
    CONSTRAINT chk_household CHECK (household_members >= 1),
    CONSTRAINT chk_housing CHECK (housing_owned >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- Subscription Table (Public + PDF Sources)
-- ==========================================
CREATE TABLE subscription (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    source ENUM('PUBLIC_DB', 'PDF_UPLOAD', 'MERGED') NOT NULL,
    external_id VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    housing_type VARCHAR(100),
    price_range JSON,
    eligibility_requirements JSON NOT NULL,
    application_period_start DATE,
    application_period_end DATE,
    preference_categories JSON,
    is_active BOOLEAN DEFAULT TRUE,
    merged_pdf_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_source (source),
    INDEX idx_location (location),
    INDEX idx_active_period (is_active, application_period_end),
    UNIQUE KEY unique_external_id (external_id, source)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- PDF Document Table
-- ==========================================
CREATE TABLE pdf_document (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    cache_key VARCHAR(255) UNIQUE,
    processing_status ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED') NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_cache_key (cache_key),
    INDEX idx_status (processing_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- PDF Analysis Result Table
-- ==========================================
CREATE TABLE pdf_analysis_result (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    pdf_id BIGINT NOT NULL,
    subscription_id BIGINT,
    extracted_criteria JSON NOT NULL,
    match_score DECIMAL(5,2),
    qualification_status ENUM('QUALIFIED', 'DISQUALIFIED', 'PARTIAL') NOT NULL,
    match_details JSON,
    recommendations TEXT,
    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pdf_id) REFERENCES pdf_document(id) ON DELETE CASCADE,
    FOREIGN KEY (subscription_id) REFERENCES subscription(id) ON DELETE SET NULL,
    INDEX idx_pdf_id (pdf_id),
    INDEX idx_subscription_id (subscription_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- Eligibility Match Table
-- ==========================================
CREATE TABLE eligibility_match (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(255) NOT NULL,
    subscription_id BIGINT NOT NULL,
    match_score DECIMAL(5,2) NOT NULL,
    requirements_met JSON NOT NULL,
    requirements_failed JSON,
    qualification_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subscription_id) REFERENCES subscription(id) ON DELETE CASCADE,
    INDEX idx_user_subscription (user_id, subscription_id),
    INDEX idx_score (match_score DESC),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- Favorite Table
-- ==========================================
CREATE TABLE favorite (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(255) NOT NULL,
    subscription_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subscription_id) REFERENCES subscription(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_subscription (user_id, subscription_id),
    INDEX idx_user_id (user_id),
    INDEX idx_subscription_id (subscription_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ==========================================
-- V8: Add public data fields to subscriptions
-- ==========================================
-- Reason: Map all available fields from public data API to subscription entity
--         Provides comprehensive housing subscription information
-- Date: 2025-12-11
-- ==========================================

-- Basic information fields
ALTER TABLE subscriptions ADD COLUMN house_manage_no VARCHAR(100) COMMENT '주택관리번호';
ALTER TABLE subscriptions ADD COLUMN zip_code VARCHAR(20) COMMENT '우편번호';
ALTER TABLE subscriptions ADD COLUMN housing_detail_type VARCHAR(100) COMMENT '주택상세구분 (민영/국민)';
ALTER TABLE subscriptions ADD COLUMN rent_type VARCHAR(50) COMMENT '분양구분 (분양/임대)';
ALTER TABLE subscriptions ADD COLUMN supply_count INT COMMENT '공급세대수';

-- Schedule fields
ALTER TABLE subscriptions ADD COLUMN announcement_date DATE COMMENT '공고일';
ALTER TABLE subscriptions ADD COLUMN special_supply_start_date DATE COMMENT '특별공급 시작일';
ALTER TABLE subscriptions ADD COLUMN special_supply_end_date DATE COMMENT '특별공급 마감일';
ALTER TABLE subscriptions ADD COLUMN winner_announcement_date DATE COMMENT '당첨자발표일';
ALTER TABLE subscriptions ADD COLUMN contract_start_date DATE COMMENT '계약 시작일';
ALTER TABLE subscriptions ADD COLUMN contract_end_date DATE COMMENT '계약 종료일';

-- Business info fields
ALTER TABLE subscriptions ADD COLUMN constructor_name VARCHAR(200) COMMENT '시행사';
ALTER TABLE subscriptions ADD COLUMN builder_name VARCHAR(200) COMMENT '건설업체';

-- Contact and URL fields
ALTER TABLE subscriptions ADD COLUMN model_house_phone VARCHAR(50) COMMENT '모델하우스 전화번호';
ALTER TABLE subscriptions ADD COLUMN homepage_url VARCHAR(500) COMMENT '홈페이지 주소';

-- Region info fields
ALTER TABLE subscriptions ADD COLUMN subscription_area_code VARCHAR(50) COMMENT '청약지역코드';
ALTER TABLE subscriptions ADD COLUMN subscription_area_name VARCHAR(100) COMMENT '청약지역명';
ALTER TABLE subscriptions ADD COLUMN move_in_year_month VARCHAR(10) COMMENT '입주예정년월 (YYYYMM)';

-- Characteristics fields
ALTER TABLE subscriptions ADD COLUMN is_speculation_area BOOLEAN COMMENT '투기과열지구';
ALTER TABLE subscriptions ADD COLUMN is_adjustment_target_area BOOLEAN COMMENT '조정대상지역';

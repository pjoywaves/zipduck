-- Test data for development and testing
-- User Story 1: Profile Creation and Unified Recommendation View

-- ==========================================
-- Test Users
-- ==========================================
INSERT INTO users (user_id, username, email, password, status) VALUES
    ('USR001', '김민수', 'minsu.kim@example.com', '$2a$10$dummyHashedPassword1', 'ACTIVE'),
    ('USR002', '이영희', 'younghee.lee@example.com', '$2a$10$dummyHashedPassword2', 'ACTIVE'),
    ('USR003', '박철수', 'chulsoo.park@example.com', '$2a$10$dummyHashedPassword3', 'ACTIVE');

-- ==========================================
-- Test User Profiles
-- ==========================================
-- Get the actual user IDs that were just inserted
INSERT INTO user_profiles (user_id, age, annual_income, household_members, housing_owned, location_preferences, notifications_enabled)
SELECT id, 28, 35000000, 1, 0, '서울,경기', TRUE FROM users WHERE user_id = 'USR001'
UNION ALL
SELECT id, 32, 45000000, 3, 0, '서울,인천', TRUE FROM users WHERE user_id = 'USR002'
UNION ALL
SELECT id, 25, 28000000, 2, 1, '부산,경남', FALSE FROM users WHERE user_id = 'USR003';

-- ==========================================
-- Test Subscriptions (청약 데이터)
-- ==========================================
INSERT INTO subscriptions (
    name, location, address, housing_type,
    min_price, max_price,
    min_age, max_age, min_income, max_income,
    min_household_members, max_household_members, max_housing_owned,
    special_qualifications, preference_categories,
    application_start_date, application_end_date,
    data_source, is_merged, public_data_id, is_active, detail_url
) VALUES
    -- 서울 강남 아파트
    (
        '강남 센트럴 아이파크',
        '서울',
        '서울특별시 강남구 역삼동 123-45',
        'APARTMENT',
        400000000, 800000000,
        19, 39, 20000000, 70000000,
        1, 4, 0,
        '무주택세대구성원, 청약통장 가입 6개월 이상',
        '신혼부부 특별공급, 생애최초 특별공급',
        '2025-12-01', '2025-12-15',
        'PUBLIC_DB', FALSE, 'PUB_2025_001', TRUE,
        'https://www.applyhome.co.kr/example1'
    ),

    -- 경기 성남 아파트
    (
        '판교 푸르지오',
        '경기',
        '경기도 성남시 분당구 판교동 567-89',
        'APARTMENT',
        350000000, 600000000,
        19, 45, 15000000, 80000000,
        1, 5, 1,
        '청약저축 또는 청약예금 가입자',
        '다자녀 특별공급, 노부모부양 특별공급',
        '2025-12-10', '2025-12-20',
        'PUBLIC_DB', FALSE, 'PUB_2025_002', TRUE,
        'https://www.applyhome.co.kr/example2'
    ),

    -- 인천 연수구 오피스텔
    (
        '송도 더샵 센트럴시티',
        '인천',
        '인천광역시 연수구 송도동 101-11',
        'OFFICETEL',
        300000000, 500000000,
        19, 50, 10000000, 60000000,
        1, 6, 0,
        '무주택세대구성원',
        '일반공급, 신혼부부 특별공급',
        '2025-11-25', '2025-12-05',
        'PUBLIC_DB', FALSE, 'PUB_2025_003', TRUE,
        'https://www.applyhome.co.kr/example3'
    ),

    -- 부산 해운대 아파트
    (
        '해운대 엘시티',
        '부산',
        '부산광역시 해운대구 우동 1234-56',
        'APARTMENT',
        280000000, 450000000,
        19, 40, 12000000, 50000000,
        1, 4, 1,
        '청약통장 가입 1년 이상',
        '생애최초 특별공급, 신혼부부 특별공급',
        '2025-12-05', '2025-12-18',
        'PUBLIC_DB', FALSE, 'PUB_2025_004', TRUE,
        'https://www.applyhome.co.kr/example4'
    ),

    -- 과거 청약 (테스트용)
    (
        '과거 청약 테스트',
        '서울',
        '서울특별시 마포구 상암동',
        'VILLA',
        400000000, 700000000,
        19, 35, 25000000, 65000000,
        1, 3, 0,
        '무주택세대구성원',
        '일반공급',
        '2025-01-01', '2025-01-15',
        'PUBLIC_DB', FALSE, 'PUB_2025_000', FALSE,
        'https://www.applyhome.co.kr/example_old'
    );
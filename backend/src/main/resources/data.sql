-- 테스트용 임시 데이터
-- 주의: 이 파일은 개발 환경에서만 사용됩니다

-- 예시 사용자 데이터
INSERT INTO users (username, email, created_at) VALUES
  ('testuser1', 'test1@example.com', NOW()),
  ('testuser2', 'test2@example.com', NOW());

-- 예시 구독 데이터
-- INSERT INTO subscriptions (...) VALUES (...);
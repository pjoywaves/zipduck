# Quick Start Guide: 인증/인가 시스템 및 알림 기능

**Feature**: 002-auth-notification-system
**Date**: 2025-11-25

## 개발 환경 설정

### 1. 필수 환경 변수 설정

`.env` 파일에 다음 환경 변수 추가:

```bash
# JWT
JWT_SECRET=your-256-bit-secret-key-here-minimum-32-characters

# OAuth2
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
KAKAO_CLIENT_ID=your-kakao-app-key
KAKAO_CLIENT_SECRET=your-kakao-client-secret

# AWS SES (Email)
AWS_SES_SMTP_USERNAME=your-ses-smtp-username
AWS_SES_SMTP_PASSWORD=your-ses-smtp-password

# Firebase (Push Notification)
FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/firebase-service-account.json
```

### 2. 의존성 추가

`backend/build.gradle.kts`에 다음 추가:

```kotlin
dependencies {
    // OAuth2 Client
    implementation("org.springframework.boot:spring-boot-starter-oauth2-client")
    
    // Email
    implementation("org.springframework.boot:spring-boot-starter-mail")
    
    // Firebase Admin SDK
    implementation("com.google.firebase:firebase-admin:9.2.0")
}
```

### 3. 데이터베이스 마이그레이션

Flyway 마이그레이션 파일 생성:

**V2__add_auth_tables.sql**:
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NULL,
    name VARCHAR(100) NOT NULL,
    profile_image VARCHAR(500) NULL,
    account_status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_account_status (account_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE oauth_accounts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    provider ENUM('GOOGLE', 'KAKAO') NOT NULL,
    provider_id VARCHAR(255) NOT NULL,
    linked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_provider_id (provider, provider_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**V3__add_notification_tables.sql**:
```sql
CREATE TABLE notification_subscriptions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    region VARCHAR(100) NULL,
    min_income BIGINT NULL,
    max_income BIGINT NULL,
    notification_type ENUM('NEW', 'DEADLINE') NOT NULL,
    delivery_method ENUM('EMAIL', 'PUSH', 'BOTH') NOT NULL DEFAULT 'BOTH',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_active_type (active, notification_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE notification_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    subscription_id BIGINT NOT NULL,
    offer_id BIGINT NOT NULL,
    sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    delivery_type ENUM('EMAIL', 'PUSH') NOT NULL,
    status ENUM('SUCCESS', 'FAILED') NOT NULL,
    failure_reason TEXT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subscription_id) REFERENCES notification_subscriptions(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_offer_date (user_id, offer_id, (DATE(sent_at))),
    INDEX idx_sent_at (sent_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 4. Redis 설정 확인

`application.yml`에 Redis 설정 확인:

```yaml
spring:
  data:
    redis:
      host: localhost
      port: 6379
```

## 로컬 개발 실행

### 1. Redis 시작

```bash
docker run -d -p 6379:6379 redis:latest
```

### 2. MySQL 시작

```bash
docker-compose up -d mysql
```

### 3. 백엔드 실행

```bash
cd backend
./gradlew bootRun
```

### 4. 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

## API 테스트

### 회원가입

```bash
curl -X POST http://localhost:8080/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@zipduck.com",
    "password": "Password123",
    "name": "테스트유저"
  }'
```

### 로그인

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@zipduck.com",
    "password": "Password123"
  }'
```

### 보호된 API 호출 (JWT 토큰 사용)

```bash
curl -X GET http://localhost:8080/api/v1/users/me \
  -H "Authorization: Bearer <your-access-token>"
```

### 알림 구독 생성

```bash
curl -X POST http://localhost:8080/api/v1/notifications/subscriptions \
  -H "Authorization: Bearer <your-access-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "region": "서울",
    "minIncome": 30000000,
    "maxIncome": 60000000,
    "notificationType": "NEW",
    "deliveryMethod": "BOTH"
  }'
```

## OAuth 설정

### Google OAuth 설정

1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 프로젝트 생성 또는 선택
3. API 및 서비스 > 사용자 인증 정보
4. OAuth 2.0 클라이언트 ID 생성
5. 승인된 리디렉션 URI 추가: `http://localhost:8080/oauth2/callback/google`

### Kakao OAuth 설정

1. [Kakao Developers](https://developers.kakao.com) 접속
2. 애플리케이션 생성
3. 플랫폼 설정 > Web > 사이트 도메인 등록
4. Redirect URI 설정: `http://localhost:8080/oauth2/callback/kakao`
5. 동의항목 설정: 닉네임, 이메일

## 테스트 실행

### 단위 테스트

```bash
cd backend
./gradlew test
```

### 통합 테스트

```bash
./gradlew integrationTest
```

## 트러블슈팅

### JWT Secret 관련 오류

```
Error: JWT secret key must be at least 256 bits
```

**해결**: `.env` 파일의 `JWT_SECRET`을 최소 32자 이상으로 설정

### OAuth 리다이렉트 오류

```
Error: redirect_uri_mismatch
```

**해결**: Google/Kakao Console에서 Redirect URI를 정확히 등록했는지 확인

### Redis 연결 오류

```
Error: Unable to connect to Redis
```

**해결**: Redis 서버가 실행 중인지 확인 (`docker ps | grep redis`)

### Flyway 마이그레이션 실패

```
Error: Migration checksum mismatch
```

**해결**: Flyway 히스토리 테이블 확인 및 필요 시 재설정

```sql
DELETE FROM flyway_schema_history WHERE version = 'V2';
```

## 다음 단계

1. `/speckit.tasks` 명령으로 구체적인 작업 목록 생성
2. P1 작업(회원가입/로그인)부터 순차적으로 구현
3. 각 작업 완료 후 테스트 실행 및 검증

## 참고 문서

- [spec.md](./spec.md) - 기능 명세서
- [plan.md](./plan.md) - 구현 계획
- [research.md](./research.md) - 기술 조사 결과
- [data-model.md](./data-model.md) - 데이터 모델 설계
- [contracts/](./contracts/) - API 계약서

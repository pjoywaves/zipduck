# Data Model: 인증/인가 시스템 및 알림 기능

**Feature**: 002-auth-notification-system
**Date**: 2025-11-25

## Entity Relationship Diagram

```
User (1) ─── (N) OAuthAccount
  │
  └─ (1) ─── (N) NotificationSubscription
                   │
                   └─ (1) ─── (N) NotificationLog

RefreshToken (Redis)
  └─ userId → User
```

## 1. User (사용자)

**Purpose**: 서비스 가입 사용자 정보 관리

**Fields**:
- `id`: BIGINT, PK, Auto Increment
- `email`: VARCHAR(255), UNIQUE, NOT NULL
- `password`: VARCHAR(255), NULL (OAuth만 사용 시)
- `name`: VARCHAR(100), NOT NULL
- `profileImage`: VARCHAR(500), NULL
- `accountStatus`: ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED')
- `createdAt`: TIMESTAMP
- `updatedAt`: TIMESTAMP

**Indexes**:
- PRIMARY KEY: id
- UNIQUE INDEX: email
- INDEX: accountStatus

**Validation**:
- Email: RFC 5322 형식
- Password: 최소 8자, 영문+숫자
- Name: 1-100자

**SQL**:
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
```

---

## 2. OAuthAccount (소셜 계정)

**Purpose**: 소셜 로그인 정보 관리

**Fields**:
- `id`: BIGINT, PK
- `userId`: BIGINT, FK → users.id
- `provider`: ENUM('GOOGLE', 'KAKAO')
- `providerId`: VARCHAR(255)
- `linkedAt`: TIMESTAMP

**Indexes**:
- PRIMARY KEY: id
- FOREIGN KEY: userId
- UNIQUE INDEX: (provider, providerId)

**SQL**:
```sql
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

---

## 3. RefreshToken (Redis)

**Purpose**: 토큰 갱신 관리

**Fields**:
- `token`: STRING (PK)
- `userId`: LONG
- `issuedAt`: TIMESTAMP
- `expiresAt`: TIMESTAMP
- `revoked`: BOOLEAN

**Redis Config**:
- Key: `refresh_token:{token}`
- TTL: 7일 (604800초)

**Java Entity**:
```java
@RedisHash(value = "refresh_token", timeToLive = 604800)
public class RefreshToken {
    @Id
    private String token;
    private Long userId;
    private LocalDateTime issuedAt;
    private LocalDateTime expiresAt;
    private boolean revoked;
}
```

---

## 4. NotificationSubscription (알림 구독)

**Purpose**: 청약 알림 구독 설정

**Fields**:
- `id`: BIGINT, PK
- `userId`: BIGINT, FK → users.id
- `region`: VARCHAR(100), NULL
- `minIncome`: BIGINT, NULL
- `maxIncome`: BIGINT, NULL
- `notificationType`: ENUM('NEW', 'DEADLINE')
- `deliveryMethod`: ENUM('EMAIL', 'PUSH', 'BOTH')
- `active`: BOOLEAN
- `createdAt`: TIMESTAMP
- `updatedAt`: TIMESTAMP

**Indexes**:
- PRIMARY KEY: id
- FOREIGN KEY: userId
- INDEX: (active, notificationType)

**SQL**:
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
```

---

## 5. NotificationLog (알림 발송 이력)

**Purpose**: 알림 발송 이력 및 중복 방지

**Fields**:
- `id`: BIGINT, PK
- `userId`: BIGINT, FK → users.id
- `subscriptionId`: BIGINT, FK → notification_subscriptions.id
- `offerId`: BIGINT
- `sentAt`: TIMESTAMP
- `deliveryType`: ENUM('EMAIL', 'PUSH')
- `status`: ENUM('SUCCESS', 'FAILED')
- `failureReason`: TEXT, NULL

**Indexes**:
- PRIMARY KEY: id
- UNIQUE INDEX: (userId, offerId, DATE(sentAt)) -- 24시간 중복 방지
- INDEX: sentAt

**SQL**:
```sql
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

---

## State Transitions

### User Account Status
```
ACTIVE → INACTIVE (비활성화)
ACTIVE → SUSPENDED (정지)
INACTIVE → ACTIVE (재활성화)
SUSPENDED → ACTIVE (정지 해제)
```

### NotificationSubscription Active
```
true → false (구독 취소)
false → true (재구독)
```

---

## Performance Considerations

1. **User**: email UNIQUE INDEX로 로그인 최적화
2. **OAuthAccount**: (provider, providerId) UNIQUE INDEX로 소셜 로그인 최적화
3. **NotificationSubscription**: (active, notificationType) 복합 INDEX로 알림 발송 쿼리 최적화
4. **NotificationLog**: UNIQUE 제약으로 중복 방지, sentAt INDEX로 이력 조회 최적화
5. **RefreshToken**: Redis로 빠른 조회 및 TTL 자동 관리

---

## Flyway Migrations

- `V2__add_auth_tables.sql`: users, oauth_accounts
- `V3__add_notification_tables.sql`: notification_subscriptions, notification_logs

# Technical Research: 인증/인가 시스템 및 알림 기능

**Feature**: 002-auth-notification-system

**Date**: 2025-11-25

**Purpose**: 인증 시스템 및 알림 기능 구현을 위한 기술 조사 및 의사결정 문서

## Executive Summary

Spring Boot 3.2.1 기반 ZipDuck 플랫폼에 JWT 토큰 기반 인증, OAuth 2.0 소셜 로그인, 비동기 알림 시스템을 구현합니다.

## 1. JWT 인증 전략

### Decision: jjwt 0.12.3 + Spring Security 6

**Rationale**:
- 프로젝트에 이미 jjwt 0.12.3가 설치되어 있음
- Spring Boot 3.2.1은 Spring Security 6.x와 함께 제공됨
- type-safe builder API 제공

**Alternatives Considered**:
1. Auth0 java-jwt - Rejected (jjwt가 더 활발히 유지보수됨)
2. Nimbus JOSE+JWT - Rejected (단순 JWT 관리에는 과도함)

**Security Considerations**:
- JWT Secret은 최소 256비트
- 환경 변수로 관리: JWT_SECRET
- Access Token 만료: 1시간
- Refresh Token 만료: 7일

## 2. Refresh Token 저장소

### Decision: Redis

**Rationale**:
- 프로젝트에 이미 Redis가 설치되어 있음
- TTL 기능으로 만료 처리 자동화
- 빠른 조회 성능 O(1)
- 로그아웃 시 즉시 무효화 가능

**Alternatives Considered**:
1. MySQL Database - Rejected (DB 부하 증가)
2. In-Memory - Rejected (서버 재시작 시 손실)

## 3. 비밀번호 암호화

### Decision: BCrypt

**Rationale**:
- Spring Security 기본 제공
- Adaptive hashing
- 솔트 자동 생성
- OWASP 권장

**Implementation**:
- Strength 10 (약 0.1초 소요)

## 4. OAuth 2.0 통합

### Decision: Spring Security OAuth2 Client

**Rationale**:
- Spring Boot 3.2.1에 기본 포함
- Google, Kakao 설정 간편
- Authorization Code Grant 플로우 자동 처리

**Providers**:
- Google OAuth 2.0: Client ID/Secret
- Kakao OAuth 2.0: App Key

## 5. 이메일 알림 서비스

### Decision: AWS SES

**Rationale**:
- AWS 인프라 사용 중
- 비용 효율적 (월 62,000통 무료)
- 높은 전달률
- Spring Boot 통합 용이

**Alternatives Considered**:
1. SendGrid - Rejected (비용)
2. Gmail SMTP - Rejected (하루 500통 제한)

## 6. 푸시 알림 서비스

### Decision: Firebase Cloud Messaging (FCM)

**Rationale**:
- 무료 (무제한)
- Android와 iOS 모두 지원
- 신뢰성 높은 전달률
- Firebase Admin SDK for Java 제공

**Alternatives Considered**:
1. OneSignal - Rejected (10,000 구독자 이후 유료)

## 7. 알림 스케줄링

### Decision: Spring @Scheduled + Cron Expression

**Rationale**:
- Spring Boot에 기본 포함
- Cron 표현식으로 정확한 시간 제어
- 간단한 배치 작업에 적합

**Alternatives Considered**:
1. Quartz Scheduler - Rejected (과도한 기능)
2. Spring Batch - Rejected (대용량 처리 불필요)

## 8. 비동기 알림 처리

### Decision: Spring @Async + ThreadPoolTaskExecutor

**Rationale**:
- Spring Boot 내장 기능
- 알림 발송 실패가 API 응답에 영향 없음
- 대량 발송 시 빠름

**Alternatives Considered**:
1. Message Queue - Rejected (현재 규모에 과도)

## 9. 중복 알림 방지

### Decision: NotificationLog 테이블 + Unique Constraint

**Rationale**:
- 데이터베이스 제약조건으로 보장
- 발송 이력 추적 가능

**Alternatives Considered**:
1. Redis Set - Rejected (TTL 설정 복잡)

## 10. 에러 응답 표준화

### Decision: RFC 7807 Problem Details

**Rationale**:
- HTTP API 에러 응답 표준
- Spring Boot 3.x에서 기본 지원

**Error Codes**:
- AUTH001: User Already Exists
- AUTH002: Invalid Credentials  
- AUTH003: Token Expired
- NOTI001: Subscription Not Found

## Dependencies to Add

```kotlin
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-oauth2-client")
    implementation("org.springframework.boot:spring-boot-starter-mail")
    implementation("com.google.firebase:firebase-admin:9.2.0")
}
```

## Environment Variables Required

```
JWT_SECRET=<256-bit-secret>
GOOGLE_CLIENT_ID=<google-id>
GOOGLE_CLIENT_SECRET=<google-secret>
KAKAO_CLIENT_ID=<kakao-id>
KAKAO_CLIENT_SECRET=<kakao-secret>
AWS_SES_SMTP_USERNAME=<ses-username>
AWS_SES_SMTP_PASSWORD=<ses-password>
```

## Performance Benchmarks

| Operation | Target | 
|-----------|--------|
| JWT 토큰 생성 | < 10ms |
| JWT 토큰 검증 | < 5ms |
| 비밀번호 검증 | < 100ms |
| 이메일 발송 | < 2초 |
| 푸시 발송 | < 500ms |
| 1000명 알림 | < 10분 |

## Security Checklist

- [x] 비밀번호 평문 저장 금지
- [x] JWT Secret 환경 변수 관리
- [x] OAuth Secret 환경 변수 관리
- [x] HTTPS Only
- [x] CORS 설정
- [x] Rate Limiting
- [x] SQL Injection 방지
- [x] XSS 방지
- [x] CSRF 방지

## Monitoring & Logging

**Metrics**:
- auth.login.success
- auth.login.failure
- notification.email.sent
- notification.push.sent
- notification.failed

**Alerts**:
- 로그인 실패율 > 30%
- 알림 발송 실패율 > 5%

## Conclusion

모든 기술 결정은 기존 Spring Boot 3.2.1 아키텍처와 호환되며 프로덕션 배포 가능합니다.

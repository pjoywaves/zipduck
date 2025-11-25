# Implementation Tasks: 인증/인가 시스템 및 알림 기능

**Feature**: 002-auth-notification-system
**Branch**: `002-auth-notification-system`
**Date**: 2025-11-25

## Overview

이 문서는 인증/인가 시스템 및 알림 기능 구현을 위한 실행 가능한 작업 목록입니다.

**총 작업 수**: 58개
**User Stories**: 4개 (P1: 1개, P2: 2개, P3: 1개)
**병렬 실행 가능 작업**: 32개

## Implementation Strategy

### MVP Scope (Minimum Viable Product)
**User Story 1 (P1)만 구현**:
- 회원가입/로그인 기본 인증
- JWT 토큰 발급 및 검증
- 사용자 프로필 관리

MVP 완료 후 독립적으로 테스트 가능하며, 나머지 스토리는 점진적으로 추가 가능합니다.

### Incremental Delivery
1. **Phase 1-2**: Setup & Foundational (1-2일)
2. **Phase 3 (US1)**: Basic Auth (3-4일) → **MVP 릴리스 가능**
3. **Phase 4 (US2)**: OAuth (2-3일)
4. **Phase 5 (US3)**: Notification (3-4일)
5. **Phase 6 (US4)**: Polish (1-2일)

---

## Phase 1: Setup & Project Initialization

**Goal**: 프로젝트 환경 설정 및 의존성 추가

### Tasks

- [ ] T001 환경 변수 설정 (.env 파일에 JWT_SECRET, OAuth Client ID/Secret 추가)
- [ ] T002 [P] build.gradle.kts에 의존성 추가 (OAuth2 Client, Mail, Firebase)
- [ ] T003 [P] application.yml 업데이트 (JWT, OAuth2, Mail, Redis 설정)
- [ ] T004 Redis 연결 확인 및 RefreshToken용 설정 추가
- [ ] T005 Flyway 마이그레이션 파일 생성 (V2__add_auth_tables.sql, V3__add_notification_tables.sql)

---

## Phase 2: Foundational - Security & Core Config

**Goal**: 모든 User Story에서 공통으로 사용할 보안 및 설정 구현

**Blocking Prerequisites**: 이 Phase를 완료해야 User Story 구현 가능

### Tasks

- [ ] T006 [P] SecurityConfig 생성 (backend/src/main/java/com/zipduck/auth/config/SecurityConfig.java)
- [ ] T007 [P] JwtConfig 생성 (backend/src/main/java/com/zipduck/auth/config/JwtConfig.java)
- [ ] T008 [P] BCryptPasswordEncoder Bean 등록 (SecurityConfig.java)
- [ ] T009 [P] GlobalExceptionHandler 업데이트 (backend/src/main/java/com/zipduck/api/exception/GlobalExceptionHandler.java에 인증 예외 추가)
- [ ] T010 [P] ErrorResponse를 RFC 7807 ProblemDetail로 표준화 (GlobalExceptionHandler.java)
- [ ] T011 [P] AsyncConfig 생성 (backend/src/main/java/com/zipduck/notification/config/AsyncConfig.java, @EnableAsync 및 ThreadPoolTaskExecutor 설정)

---

## Phase 3: User Story 1 - 회원가입 및 로그인 (P1)

**Priority**: P1 (최우선)
**Goal**: 이메일/비밀번호 기반 회원가입, 로그인, JWT 토큰 관리 구현

**Independent Test Criteria**:
- 회원가입 폼에서 이메일과 비밀번호 입력하여 계정 생성 가능
- 생성된 계정으로 로그인하여 JWT 토큰 받기
- JWT 토큰으로 사용자 프로필 조회 가능

### Domain Layer (Models)

- [ ] T012 [P] [US1] User Entity 생성 (backend/src/main/java/com/zipduck/auth/domain/User.java)
- [ ] T013 [P] [US1] RefreshToken Entity 생성 (backend/src/main/java/com/zipduck/auth/domain/RefreshToken.java, @RedisHash 사용)
- [ ] T014 [P] [US1] UserRepository 인터페이스 생성 (backend/src/main/java/com/zipduck/auth/repository/UserRepository.java)
- [ ] T015 [P] [US1] RefreshTokenRepository 인터페이스 생성 (backend/src/main/java/com/zipduck/auth/repository/RefreshTokenRepository.java)

### Service Layer

- [ ] T016 [US1] TokenService 구현 (backend/src/main/java/com/zipduck/auth/service/TokenService.java, JWT 생성/검증/갱신)
- [ ] T017 [US1] UserService 구현 (backend/src/main/java/com/zipduck/auth/service/UserService.java, 사용자 CRUD)
- [ ] T018 [US1] AuthService 구현 (backend/src/main/java/com/zipduck/auth/service/AuthService.java, 회원가입/로그인/로그아웃)

### DTOs

- [ ] T019 [P] [US1] SignupRequest DTO 생성 (backend/src/main/java/com/zipduck/auth/dto/SignupRequest.java, @Valid 검증)
- [ ] T020 [P] [US1] LoginRequest DTO 생성 (backend/src/main/java/com/zipduck/auth/dto/LoginRequest.java)
- [ ] T021 [P] [US1] TokenResponse DTO 생성 (backend/src/main/java/com/zipduck/auth/dto/TokenResponse.java)
- [ ] T022 [P] [US1] UserProfileDto DTO 생성 (backend/src/main/java/com/zipduck/auth/dto/UserProfileDto.java)

### Controller Layer (API Endpoints)

- [ ] T023 [US1] AuthController 구현 (backend/src/main/java/com/zipduck/auth/controller/AuthController.java, signup/login/logout/refresh)
- [ ] T024 [US1] UserController 구현 (backend/src/main/java/com/zipduck/auth/controller/UserController.java, getMyProfile/updateMyProfile)

### Security Integration

- [ ] T025 [US1] JwtAuthenticationFilter 구현 (JWT 토큰 검증 필터)
- [ ] T026 [US1] SecurityConfig에 인증 필터 체인 등록

### Frontend Integration

- [ ] T027 [P] [US1] authService.ts 생성 (frontend/src/services/authService.ts, signup/login/logout API 호출)
- [ ] T028 [P] [US1] useAuth hook 생성 (frontend/src/hooks/useAuth.ts, 인증 상태 관리)
- [ ] T029 [P] [US1] useToken hook 생성 (frontend/src/hooks/useToken.ts, 토큰 자동 갱신)
- [ ] T030 [P] [US1] SignupForm 컴포넌트 생성 (frontend/src/components/auth/SignupForm.tsx)
- [ ] T031 [P] [US1] LoginForm 컴포넌트 생성 (frontend/src/components/auth/LoginForm.tsx)
- [ ] T032 [US1] SignupPage 생성 (frontend/src/pages/auth/SignupPage.tsx)
- [ ] T033 [US1] LoginPage 생성 (frontend/src/pages/auth/LoginPage.tsx)

### Integration & Validation

- [ ] T034 [US1] 회원가입 API 테스트 (POST /api/v1/auth/signup)
- [ ] T035 [US1] 로그인 API 테스트 (POST /api/v1/auth/login)
- [ ] T036 [US1] 토큰 갱신 API 테스트 (POST /api/v1/auth/refresh)
- [ ] T037 [US1] 로그아웃 API 테스트 (POST /api/v1/auth/logout)
- [ ] T038 [US1] 프로필 조회/수정 API 테스트 (GET/PUT /api/v1/users/me)

**US1 Parallel Execution Opportunities**:
- T012-T015 (Domain Layer 모델들) 병렬 실행 가능
- T019-T022 (DTOs) 병렬 실행 가능
- T027-T031 (Frontend 컴포넌트들) 병렬 실행 가능

**US1 Independent Test**:
모든 T034-T038 통과 시 US1 완료. 이 시점에서 MVP 릴리스 가능.

---

## Phase 4: User Story 2 - OAuth 2.0 소셜 로그인 (P2)

**Priority**: P2
**Goal**: Google/Kakao OAuth 2.0 소셜 로그인 구현
**Dependency**: US1 완료 필요 (User Entity 및 TokenService 사용)

**Independent Test Criteria**:
- Google 로그인 버튼 클릭하여 OAuth 인증 완료
- 자동으로 계정 생성되어 JWT 토큰 발급
- 로그인 상태에서 기존 데이터 접근 가능

### Domain Layer

- [ ] T039 [P] [US2] OAuthAccount Entity 생성 (backend/src/main/java/com/zipduck/auth/domain/OAuthAccount.java)
- [ ] T040 [P] [US2] OAuthAccountRepository 인터페이스 생성 (backend/src/main/java/com/zipduck/auth/repository/OAuthAccountRepository.java)

### Service Layer

- [ ] T041 [US2] OAuthService 구현 (backend/src/main/java/com/zipduck/auth/service/OAuthService.java, OAuth 인증 처리 및 계정 연동)

### Configuration

- [ ] T042 [US2] OAuth2Config 생성 (backend/src/main/java/com/zipduck/auth/config/OAuth2Config.java, Google/Kakao 설정)

### Controller Layer

- [ ] T043 [US2] OAuthController 구현 (backend/src/main/java/com/zipduck/auth/controller/OAuthController.java, /oauth2/authorization/{provider}, /oauth2/callback/{provider})

### Frontend Integration

- [ ] T044 [P] [US2] OAuthButtons 컴포넌트 생성 (frontend/src/components/auth/OAuthButtons.tsx, Google/Kakao 버튼)
- [ ] T045 [US2] OAuthCallbackPage 생성 (frontend/src/pages/auth/OAuthCallbackPage.tsx, 콜백 처리)

### Integration & Validation

- [ ] T046 [US2] Google OAuth 플로우 테스트 (GET /api/v1/oauth2/authorization/google)
- [ ] T047 [US2] Kakao OAuth 플로우 테스트 (GET /api/v1/oauth2/authorization/kakao)
- [ ] T048 [US2] OAuth 콜백 처리 테스트 (GET /api/v1/oauth2/callback/{provider})

**US2 Parallel Execution Opportunities**:
- T039-T040 (OAuthAccount 모델들) 병렬 실행 가능
- T044 (Frontend 컴포넌트) T041-T043 완료 후 병렬 실행 가능

**US2 Independent Test**:
T046-T048 통과 시 US2 완료. US1 없이도 독립적으로 테스트 가능 (소셜 로그인만 사용).

---

## Phase 5: User Story 3 - 청약 알림 구독 (P2)

**Priority**: P2
**Goal**: 청약 조건 기반 알림 구독 및 발송 (이메일/푸시)
**Dependency**: US1 완료 필요 (인증된 사용자만 알림 구독 가능)

**Independent Test Criteria**:
- 알림 설정 페이지에서 지역/소득 조건으로 알림 구독
- 해당 조건에 맞는 신규 청약 등록 시 이메일 알림 수신
- 푸시 알림 수신 (FCM 토큰 등록 완료 시)

### Domain Layer

- [ ] T049 [P] [US3] NotificationSubscription Entity 생성 (backend/src/main/java/com/zipduck/notification/domain/NotificationSubscription.java)
- [ ] T050 [P] [US3] NotificationLog Entity 생성 (backend/src/main/java/com/zipduck/notification/domain/NotificationLog.java)
- [ ] T051 [P] [US3] NotificationSubscriptionRepository 인터페이스 생성 (backend/src/main/java/com/zipduck/notification/repository/NotificationSubscriptionRepository.java)
- [ ] T052 [P] [US3] NotificationLogRepository 인터페이스 생성 (backend/src/main/java/com/zipduck/notification/repository/NotificationLogRepository.java)

### Service Layer

- [ ] T053 [US3] NotificationService 구현 (backend/src/main/java/com/zipduck/notification/service/NotificationService.java, 구독 관리 및 알림 발송 조정)
- [ ] T054 [US3] EmailNotificationService 구현 (backend/src/main/java/com/zipduck/notification/service/EmailNotificationService.java, AWS SES 이메일 발송)
- [ ] T055 [US3] PushNotificationService 구현 (backend/src/main/java/com/zipduck/notification/service/PushNotificationService.java, FCM 푸시 발송)
- [ ] T056 [US3] NotificationScheduler 구현 (backend/src/main/java/com/zipduck/notification/service/NotificationScheduler.java, @Scheduled 마감 임박 알림 배치)

### DTOs

- [ ] T057 [P] [US3] SubscriptionRequest DTO 생성 (backend/src/main/java/com/zipduck/notification/dto/SubscriptionRequest.java)
- [ ] T058 [P] [US3] SubscriptionDto DTO 생성 (backend/src/main/java/com/zipduck/notification/dto/SubscriptionDto.java)

### Controller Layer

- [ ] T059 [US3] NotificationController 구현 (backend/src/main/java/com/zipduck/notification/controller/NotificationController.java, 구독 CRUD API)

### Configuration

- [ ] T060 [US3] FirebaseConfig 생성 (backend/src/main/java/com/zipduck/notification/config/FirebaseConfig.java, FCM 초기화)
- [ ] T061 [US3] MailConfig 업데이트 (application.yml에 AWS SES SMTP 설정)

### Frontend Integration

- [ ] T062 [P] [US3] notificationService.ts 생성 (frontend/src/services/notificationService.ts, 구독 CRUD API 호출)
- [ ] T063 [US3] NotificationSettingsPage 생성 (frontend/src/pages/notification/NotificationSettingsPage.tsx)

### Integration & Validation

- [ ] T064 [US3] 알림 구독 생성 API 테스트 (POST /api/v1/notifications/subscriptions)
- [ ] T065 [US3] 알림 구독 목록 조회 API 테스트 (GET /api/v1/notifications/subscriptions)
- [ ] T066 [US3] 알림 구독 수정 API 테스트 (PUT /api/v1/notifications/subscriptions/{id})
- [ ] T067 [US3] 알림 구독 삭제 API 테스트 (DELETE /api/v1/notifications/subscriptions/{id})
- [ ] T068 [US3] 이메일 알림 발송 테스트 (신규 청약 등록 시)
- [ ] T069 [US3] 푸시 알림 발송 테스트 (FCM 토큰 등록 후)
- [ ] T070 [US3] 마감 임박 알림 스케줄러 테스트 (매일 오전 9시)
- [ ] T071 [US3] 중복 알림 방지 검증 (24시간 내 동일 청약 알림 1회)

**US3 Parallel Execution Opportunities**:
- T049-T052 (Domain Layer 모델들) 병렬 실행 가능
- T057-T058 (DTOs) 병렬 실행 가능
- T062 (Frontend Service) T059 완료 후 병렬 실행 가능

**US3 Independent Test**:
T064-T071 통과 시 US3 완료. 인증(US1)만 완료되면 독립적으로 테스트 가능.

---

## Phase 6: User Story 4 - Edge Case 처리 및 에러 응답 표준화 (P3)

**Priority**: P3 (완성도 개선)
**Goal**: 경계값 처리, 0개 매칭 메시지, 에러 응답 표준화
**Dependency**: US1-US3 완료 후 진행 권장

**Independent Test Criteria**:
- 소득이 정확히 청약 조건 상한선과 일치할 때 정상 매칭
- 조건에 맞는 청약 0개일 때 명확한 안내 메시지 표시
- 모든 API 에러 응답이 표준화된 형식

### Error Handling

- [ ] T072 [P] [US4] 경계값 처리 로직 추가 (청약 매칭 Service에 >= 및 <= 조건 명확히 구현)
- [ ] T073 [P] [US4] 0개 매칭 시 명확한 메시지 반환 (EligibilityController 업데이트)
- [ ] T074 [P] [US4] 사용자 입력 검증 강화 (@Valid 어노테이션 및 커스텀 Validator 추가)
- [ ] T075 [US4] GlobalExceptionHandler에 모든 예외 타입 추가 (MethodArgumentNotValidException, ConstraintViolationException 등)

### Validation

- [ ] T076 [US4] 경계값 테스트 (소득 6천만원 = 조건 "6천만원 이하" → 매칭됨)
- [ ] T077 [US4] 0개 매칭 테스트 (조건 맞는 청약 없을 때 메시지 확인)
- [ ] T078 [US4] 에러 응답 형식 검증 (모든 API 에러가 RFC 7807 형식인지 확인)

**US4 Parallel Execution Opportunities**:
- T072-T074 (Error Handling 로직들) 병렬 실행 가능

**US4 Independent Test**:
T076-T078 통과 시 US4 완료. 기존 기능에 영향 없이 완성도 개선.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Goal**: 성능 최적화, 로깅, 모니터링, 문서화

### Performance & Monitoring

- [ ] T079 [P] Rate Limiting 추가 (로그인 API에 Bucket4j 적용)
- [ ] T080 [P] 로깅 강화 (로그인 성공/실패, 알림 발송 성공/실패 로깅)
- [ ] T081 [P] Spring Actuator 메트릭 추가 (auth.login.success, notification.email.sent 등)
- [ ] T082 Database Index 최적화 (email, (provider, providerId), (active, notificationType) 인덱스 확인)

### Documentation

- [ ] T083 [P] API 문서화 (Swagger/SpringDoc 추가 및 OpenAPI 스펙과 동기화)
- [ ] T084 [P] README 업데이트 (환경 변수 설정 가이드, OAuth 설정 방법)

---

## Dependency Graph

```
Phase 1 (Setup)
  ↓
Phase 2 (Foundational - Security)
  ↓
Phase 3 (US1 - Basic Auth) ← MVP
  ↓
  ├→ Phase 4 (US2 - OAuth) [독립]
  ├→ Phase 5 (US3 - Notification) [US1 의존]
  └→ Phase 6 (US4 - Edge Cases) [US1-3 완료 후 권장]
  ↓
Phase 7 (Polish)
```

**User Story Dependencies**:
- US1: 독립 (가장 먼저 구현)
- US2: US1 완료 필요 (User Entity, TokenService 사용)
- US3: US1 완료 필요 (인증된 사용자만 구독)
- US4: US1-3 완료 후 권장 (Edge Case 개선)

---

## Parallel Execution Examples

### Phase 3 (US1) Parallel Execution

**Group 1** (Domain Layer - 병렬 가능):
- T012 (User Entity)
- T013 (RefreshToken Entity)
- T014 (UserRepository)
- T015 (RefreshTokenRepository)

**Group 2** (DTOs - 병렬 가능):
- T019 (SignupRequest)
- T020 (LoginRequest)
- T021 (TokenResponse)
- T022 (UserProfileDto)

**Group 3** (Frontend - 병렬 가능):
- T027 (authService.ts)
- T028 (useAuth hook)
- T029 (useToken hook)
- T030 (SignupForm)
- T031 (LoginForm)

### Phase 5 (US3) Parallel Execution

**Group 1** (Domain Layer - 병렬 가능):
- T049 (NotificationSubscription Entity)
- T050 (NotificationLog Entity)
- T051 (NotificationSubscriptionRepository)
- T052 (NotificationLogRepository)

**Group 2** (DTOs - 병렬 가능):
- T057 (SubscriptionRequest)
- T058 (SubscriptionDto)

---

## Summary

**총 작업 수**: 84개
**User Story별 작업 수**:
- Setup: 5개
- Foundational: 6개
- US1 (P1): 27개
- US2 (P2): 10개
- US3 (P2): 23개
- US4 (P3): 7개
- Polish: 6개

**병렬 실행 가능 작업**: 32개 (전체의 약 38%)

**MVP Scope**: Phase 1-3 (US1)만 구현 → 38개 작업

**Estimated Timeline**:
- MVP (US1): 5-7일
- Full Feature (US1-4): 12-15일

**Next Steps**:
1. Phase 1-2 완료 (Setup & Foundational)
2. US1 구현 및 테스트 (MVP)
3. MVP 릴리스 후 US2-4 점진적 추가
4. 각 Phase 완료 시 해당 User Story의 Independent Test 수행

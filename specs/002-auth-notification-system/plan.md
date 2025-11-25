# Implementation Plan: 인증/인가 시스템 및 알림 기능

**Branch**: `002-auth-notification-system` | **Date**: 2025-11-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-auth-notification-system/spec.md`

## Summary

ZipDuck 플랫폼에 사용자 인증/인가 시스템과 청약 알림 기능을 구현합니다.

**핵심 기능**:
- P1: 이메일/비밀번호 기반 회원가입, 로그인, JWT 토큰 관리
- P2: Google/Kakao OAuth 2.0 소셜 로그인  
- P2: 청약 조건 기반 알림 구독 및 발송
- P3: Edge Case 처리 및 에러 응답 표준화

**기술적 접근**:
- Spring Security + JWT 토큰 기반 인증
- OAuth 2.0 Client
- 비동기 알림 발송 시스템

## Technical Context

**Language/Version**: Java 17

**Primary Framework**: Spring Boot 3.2.1

**Primary Dependencies**:
- Spring Security 6.x
- Spring Data JPA
- jjwt-api 0.12.3 (이미 설치됨)
- OAuth2 Client (추가 필요)
- JavaMailSender (추가 필요)
- FCM Admin SDK (추가 필요)

**Storage**:
- MySQL 8.x
- Redis

**Testing**: JUnit 5 + Spring Boot Test

**Target Platform**: Linux server (Docker)

**Project Type**: Web application (Backend + Frontend)

**Performance Goals**:
- JWT 토큰 검증 100ms 이내
- 1000명 동시 알림 발송 10분 이내
- 로그인 API 200ms 이내 응답

**Constraints**:
- Access Token 만료 1시간
- Refresh Token 만료 7일
- 비밀번호는 BCrypt 암호화 필수
- 24시간 내 중복 알림 방지

**Scale/Scope**:
- 초기 10,000명 사용자 목표
- 하루 평균 100개 청약 공고
- 1명당 평균 3개 알림 구독 설정

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

프로젝트 Constitution이 아직 초기화되지 않았으므로, Spring Boot 베스트 프랙티스를 따릅니다.

**Security First**: 비밀번호 BCrypt 암호화, JWT Secret 환경 변수 관리

**Testability**: 각 계층별 Unit Test 작성

**Observability**: 로그인 실패, 알림 발송 이벤트 로깅

**Performance**: Redis 캐싱, 비동기 알림 처리

## Project Structure

### Documentation (this feature)

```
specs/002-auth-notification-system/
├── spec.md              
├── plan.md              # This file
├── research.md          # Phase 0 output  
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── auth-api.yaml
│   ├── notification-api.yaml
│   └── oauth-api.yaml
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (NOT created yet)
```

### Source Code (repository root)

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/zipduck/
│   │   │   ├── auth/                    # 🆕 인증/인가 도메인
│   │   │   │   ├── domain/
│   │   │   │   ├── repository/
│   │   │   │   ├── service/
│   │   │   │   ├── controller/
│   │   │   │   ├── dto/
│   │   │   │   └── config/
│   │   │   ├── notification/             # 🆕 알림 도메인  
│   │   │   │   ├── domain/
│   │   │   │   ├── repository/
│   │   │   │   ├── service/
│   │   │   │   ├── controller/
│   │   │   │   └── dto/
│   │   │   ├── api/                      # 기존
│   │   │   ├── application/              # 기존
│   │   │   ├── domain/                   # 기존
│   │   │   └── ZipDuckApplication.java   # 기존
│   │   └── resources/
│   │       ├── application.yml           # 🔄 업데이트
│   │       └── db/migration/
│   │           ├── V1__init.sql
│   │           ├── V2__add_auth_tables.sql        # 🆕
│   │           └── V3__add_notification_tables.sql # 🆕
│   └── test/
│       └── java/com/zipduck/
│           ├── auth/                     # 🆕
│           └── notification/             # 🆕
└── build.gradle.kts                      # 🔄 업데이트

frontend/
├── src/
│   ├── pages/
│   │   ├── auth/                         # 🆕
│   │   └── notification/                 # 🆕  
│   ├── components/
│   │   └── auth/                         # 🆕
│   ├── services/
│   │   ├── authService.ts                # 🆕
│   │   └── notificationService.ts        # 🆕
│   └── hooks/
│       ├── useAuth.ts                    # 🆕
│       └── useToken.ts                   # 🆕
```

**Structure Decision**:

기존 ZipDuck 프로젝트는 Web application 구조입니다 (backend + frontend 분리).

백엔드는 도메인 주도 설계 패턴을 따라 auth와 notification 도메인을 새로 추가합니다.

## Complexity Tracking

현재 Constitution이 정의되지 않았으므로 위반 사항 없음.

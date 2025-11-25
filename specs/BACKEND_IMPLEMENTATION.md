# ZipDuck Backend - 구현 명세서

## 1. 개요

ZipDuck 백엔드는 **주택 청약 자격 매칭 플랫폼**으로 다음 핵심 기능을 제공합니다:
- 사용자 프로필 관리
- 주택 청약 추천
- PDF 기반 청약 분석 (AI)
- 자격 계산 및 매칭
- 즐겨찾기 관리
- 청약 비교

**기술 스택:**
- Spring Boot 3.2.1
- Java 17
- MySQL (MariaDB 호환)
- Redis (캐싱)
- Google Gemini AI (조건 추출)
- Google Vision API (OCR)
- JWT 인증
- Flyway (데이터베이스 마이그레이션)
- SpringDoc OpenAPI (Swagger)

---

## 2. 구현된 주요 기능

### 2.1 사용자 관리 (FR-001 ~ FR-015)

**User Entity**
- 기본 계정 생성 및 인증
- 상태 추적: ACTIVE, INACTIVE, SUSPENDED
- 이메일 기반 고유 식별
- BCrypt 비밀번호 암호화

**사용자 프로필 관리**
- 개인 정보로 프로필 생성 및 업데이트
- 자격 기준 추적:
  - 나이 (19-150세)
  - 연소득 (원)
  - 가구원 수 (1명 이상)
  - 주택 소유 수
  - 선호 지역 (콤마 구분)
- 알림 설정 관리
- 프로필 업데이트 시 자동 추천 갱신
- User 엔티티와 지연 로딩 관계

**주요 기능:**
- FR-001: 자격 정보를 포함한 사용자 프로필 생성
- FR-014: 프로필 업데이트 기능
- FR-015: 알림 설정 관리
- CHECK 제약조건을 통한 포괄적인 데이터 검증

### 2.2 주택 청약 (FR-004 ~ FR-030)

**Subscription Entity**
- 이름 (분양 단지명)
- 위치 및 상세 주소
- 주택 유형: APARTMENT, OFFICETEL, VILLA, TOWNHOUSE, ETC
- 가격 범위 (최소/최대 원)
- 자격 기준 필드:
  - 연령 범위 (최소/최대)
  - 소득 범위 (최소/최대)
  - 가구원 수 범위
  - 최대 주택 소유 허용
  - 특별 자격 및 우대 카테고리
- 신청 기간 (시작/종료일)
- 데이터 출처 추적 (PUBLIC_DB, PDF_UPLOAD, MERGED)
- 활성 상태 및 만료 관리
- 외부 상세 URL

**데이터 출처 관리 (FR-026 ~ FR-030)**
- PUBLIC_DB: 정부 데이터 포털
- PDF_UPLOAD: 사용자 업로드 문서
- MERGED: 여러 출처 병합
- 중복 감지 및 병합 기능
- 자동 만료 처리

**주요 기능:**
- FR-004: 사용자 자격 기반 청약 필터링
- FR-005: 개인화된 추천 표시
- FR-008: 자격 매칭 점수 계산 (0-100)
- FR-026: 청약 데이터 출처 추적
- FR-027: 출처별 추천 필터링
- FR-028: 중복 청약 감지
- FR-029: PDF 데이터와 청약 병합
- FR-030: 만료된 청약 비활성화

### 2.3 자격 계산 (FR-004, FR-007, FR-008, FR-012)

**EligibilityCalculator Service**
- 청약 기준에 대한 실시간 자격 확인
- 포괄적인 자격 분석:
  - 연령 자격
  - 소득 자격
  - 가구원 수 자격
  - 주택 소유 자격
  - 전체 자격 상태
- 매칭 점수 계산 (0-100) 페널티 시스템:
  - 주택 소유 페널티 (-5)
  - 소득 경계 페널티 (-10)
  - 지역 불일치 페널티 (-15)
- 정확한 임계값에서의 포괄적 경계 처리

**주요 기능:**
- FR-012: 정확한 자격 임계값에서의 엣지 케이스 처리
- 캐싱 없는 실시간 계산

### 2.4 PDF 업로드 및 분석 (FR-016 ~ FR-039)

**PDF 업로드 엔드포인트**
- PDF, JPEG, PNG 파일 허용
- 파일 크기 검증 (최대 10MB)
- 형식 검증
- 비동기 처리
- 상태 추적: PENDING, PROCESSING, COMPLETED, FAILED

**PDF 처리 워크플로우**
1. 고유 네이밍으로 파일 검증 및 저장
2. 중복 감지를 위한 캐시 키 생성 (SHA-256)
3. Vision API를 사용한 이미지 콘텐츠 감지
4. 스캔된 문서의 OCR 처리 (FR-033 ~ FR-035)
5. Gemini를 사용한 AI 조건 추출 (FR-017 ~ FR-020)
6. 사용자 자격 매칭 (FR-018, FR-019)
7. 중복 청약 감지 (FR-028)
8. 기존 데이터와 청약 병합 (FR-029)
9. PDF에서 새 청약 생성 (FR-021)
10. 인기 PDF 결과 캐싱 (FR-024)
11. 완료 상태 업데이트

**OCR 기능 (FR-033 ~ FR-039)**
- 이미지 vs 텍스트 기반 PDF 자동 감지
- OCR 품질 평가 (HIGH, MEDIUM, LOW)
- 낮은 OCR 품질 경고 알림
- 스캔된 문서 및 모바일 사진 지원
- 한글 문자 인식
- 자격 기준에 대한 숫자 추출

**주요 기능:**
- FR-016: 파일 처리를 포함한 PDF 업로드 엔드포인트
- FR-017: Gemini를 사용한 AI 기반 조건 추출
- FR-018: 추출된 조건에 대한 매칭 점수 계산
- FR-019: 추출된 청약의 자격 상태 표시
- FR-020: 추출된 조건에서 청약 생성
- FR-022: PDF 처리 상태 확인
- FR-023: 해시를 사용한 중복 PDF 감지
- FR-024: 인기 PDF 분석 결과 캐싱
- FR-025: 처리 중 자동 상태 업데이트
- FR-033: OCR 필요 여부 감지
- FR-034: 스캔된 PDF에서 텍스트 추출
- FR-035: 모바일 폰 사진 업로드 지원
- FR-036: 데이터베이스에 OCR 결과 저장
- FR-037: OCR 품질 평가 및 사용자 알림
- FR-038: 낮은 OCR 품질 경고
- FR-039: API 응답에서 OCR 경고 표시

### 2.5 즐겨찾기 관리 (FR-009)

**Favorite Entity**
- 사용자-청약 연관
- 각 즐겨찾기에 대한 선택적 메모
- 중복 즐겨찾기 방지를 위한 고유 제약조건
- 청약 삭제 시 캐스케이드 삭제

**즐겨찾기 작업**
- 청약을 즐겨찾기에 추가
- 즐겨찾기에서 청약 제거
- 사용자의 즐겨찾기 목록
- 청약이 즐겨찾기 되었는지 확인
- 즐겨찾기 메모 업데이트
- 즐겨찾기 수 가져오기

**주요 기능:**
- FR-009: 선택적 메모와 함께 청약을 즐겨찾기에 저장
- 인덱스된 user_id 및 subscription_id로 빠른 조회

### 2.6 청약 비교 (FR-010)

**비교 기능**
- 2-5개의 청약을 나란히 비교
- 각 청약에 대한 자격 세부사항 표시
- 점수 기반 최적 매칭 청약 표시
- 통합 비교 요약

**주요 기능:**
- FR-010: 자격 분석과 함께 나란히 비교
- 점수 기반 순위
- 사용자 중심 비교 결과

---

## 3. API 엔드포인트

### 사용자 관리
```
POST   /api/v1/users/{id}/profile              - 프로필 생성/업데이트
GET    /api/v1/users/{id}/profile              - 사용자 프로필 조회
PATCH  /api/v1/users/{id}/profile/notifications - 알림 설정 업데이트
```

### 청약
```
GET    /api/v1/subscriptions                   - 모든 활성 청약 조회
GET    /api/v1/subscriptions/{id}              - ID로 청약 조회
GET    /api/v1/subscriptions/recommendations   - 개인화된 추천 조회
GET    /api/v1/subscriptions/{id}/eligibility  - 자격과 함께 청약 조회
POST   /api/v1/subscriptions/compare           - 여러 청약 비교
```

### 자격
```
GET    /api/v1/eligibility/{subscriptionId}         - 상세 자격 분석 조회
GET    /api/v1/eligibility/{subscriptionId}/check   - 빠른 자격 확인
GET    /api/v1/eligibility/{subscriptionId}/score   - 매칭 점수 계산
```

### PDF 처리
```
POST   /api/v1/pdf/upload                      - 분석을 위한 PDF 업로드
GET    /api/v1/pdf/{pdfId}/status              - PDF 처리 상태 조회
GET    /api/v1/pdf/{pdfId}/analysis            - PDF 분석 결과 조회
```

### 즐겨찾기
```
POST   /api/v1/favorites                       - 청약을 즐겨찾기에 추가
GET    /api/v1/favorites                       - 사용자의 즐겨찾기 목록
DELETE /api/v1/favorites                       - 즐겨찾기에서 제거
GET    /api/v1/favorites/check                 - 즐겨찾기 여부 확인
PATCH  /api/v1/favorites/note                  - 즐겨찾기 메모 업데이트
GET    /api/v1/favorites/count                 - 즐겨찾기 수 조회
```

---

## 4. 도메인 모델 및 엔티티

### 4.1 사용자 도메인
```
User (인증)
├── id (Long)
├── username (String)
├── email (String, unique)
├── password (BCrypt 암호화)
├── status (UserStatus: ACTIVE, INACTIVE, SUSPENDED)
└── profile → UserProfile (1:1 관계)

UserProfile (자격 데이터)
├── id (Long)
├── user → User (1:1 관계)
├── age (Integer, 19-150)
├── annualIncome (Long, KRW)
├── householdMembers (Integer, 1+)
├── housingOwned (Integer)
├── locationPreferences (String, 콤마 구분)
└── notificationsEnabled (Boolean)
```

### 4.2 청약 도메인
```
Subscription
├── id (Long)
├── name (String)
├── location (String)
├── address (String)
├── housingType (HousingType enum)
├── minPrice, maxPrice (Long)
├── 자격 기준:
│   ├── minAge, maxAge (Integer)
│   ├── minIncome, maxIncome (Long)
│   ├── minHouseholdMembers, maxHouseholdMembers (Integer)
│   └── maxHousingOwned (Integer)
├── specialQualifications (String)
├── preferenceCategories (String)
├── applicationStartDate, applicationEndDate (LocalDate)
├── dataSource (DataSource enum: PUBLIC_DB, PDF_UPLOAD, MERGED)
├── isMerged (Boolean)
├── publicDataId, pdfDocumentId (String)
├── isActive (Boolean)
└── detailUrl (String)
```

### 4.3 PDF 분석 도메인
```
PdfDocument
├── id (Long)
├── user → User (M:1)
├── fileName (String)
├── filePath (String)
├── fileSize (Long)
├── contentType (String)
├── status (ProcessingStatus: PENDING, PROCESSING, COMPLETED, FAILED)
├── cacheKey (String, SHA-256)
├── errorMessage (String)
└── analysisResult → PdfAnalysisResult (1:1)

PdfAnalysisResult
├── id (Long)
├── pdfDocument → PdfDocument (1:1)
├── 추출된 청약 데이터:
│   ├── subscriptionName, location, address, housingType
│   ├── minAge, maxAge, minIncome, maxIncome
│   ├── minHouseholdMembers, maxHouseholdMembers, maxHousingOwned
│   ├── specialQualifications, preferenceCategories
│   ├── minPrice, maxPrice, applicationPeriod
├── matchScore (Integer, 0-100)
├── isEligible (Boolean)
├── OCR 메타데이터:
│   ├── ocrQuality (HIGH, MEDIUM, LOW)
│   └── ocrWarning (String)
├── extractedText (String, 최대 10000자)
├── eligibilityBreakdown (JSON)
├── recommendations (JSON)
├── aiModel (String)
└── processingTimeMs (Integer)
```

### 4.4 즐겨찾기 도메인
```
Favorite
├── id (Long)
├── user → User (M:1)
├── subscription → Subscription (M:1)
├── note (String)
└── 고유 제약조건: (user_id, subscription_id)
```

---

## 5. 서비스 및 비즈니스 로직

### 5.1 사용자 서비스

**UserCommandService**
- `createUser()` - 이메일 검증과 함께 새 사용자 생성
- `createOrUpdateProfile()` - 사용자 프로필 저장 또는 업데이트
- `updateNotificationSettings()` - 알림 설정 관리

**UserQueryService**
- `getById()` - ID로 사용자 조회
- `getByIdWithProfile()` - 프로필과 함께 사용자 조회 (즉시 로딩)
- `findByEmail()` - 이메일로 사용자 찾기

### 5.2 청약 서비스

**SubscriptionCommandService**
- `create()` - 새 청약 생성
- `mergeWithPdfData()` - 청약을 병합됨으로 표시
- `update()` - 청약 세부사항 업데이트

**SubscriptionQueryService**
- `getById()` - ID로 청약 조회
- `getAllActive()` - 모든 활성 청약 조회
- `getRecommendations()` - 자격과 함께 필터링된 추천 조회
- `getByLocation()` - 지역별 필터링
- `findByPublicDataId()` - 중복 감지

### 5.3 PDF 서비스

**PdfCommandService**
- `saveUploadedFile()` - 고유 네이밍으로 PDF 저장
- `generateCacheKey()` - 중복 제거를 위한 SHA-256 해시
- `markAsProcessing()` - 상태를 PROCESSING으로 업데이트
- `markAsCompleted()` - 분석 완료
- `markAsFailed()` - 에러 처리
- `saveAnalysisResult()` - AI 분석 저장

**PdfQueryService**
- `getById()` - PDF 문서 조회
- `hasAnalysisResult()` - 분석 여부 확인
- `getAnalysisResultByPdfId()` - 분석 결과 가져오기

**PdfAnalysisTask** (비동기)
- `analyzePdfAsync()` - 메인 비동기 워크플로우 조정
- 13단계 PDF 분석 파이프라인 처리
- OCR, AI 추출, 캐싱, 병합 관리

### 5.4 AI 서비스

**VisionService**
- `detectImageContent()` - OCR 필요 여부 판단
- `performOcr()` - 스캔된 문서에서 텍스트 추출
- `assessOcrQuality()` - 추출 품질 평가 (HIGH/MEDIUM/LOW)
- 한글 문자 감지
- 숫자 패턴 인식

**GeminiService**
- `extractCriteria()` - AI 기반 청약 조건 추출
- `buildExtractionPrompt()` - 정교한 프롬프트 엔지니어링
- 수동 JSON 파싱 (견고성을 위해 정규표현식 사용)
- 마크다운 코드 블록 정리 처리
- 15개 이상의 자격 필드 추출

**EligibilityScorer**
- 페널티를 포함한 점수 계산
- 지역 선호도 매칭
- 소득 경계 분석

### 5.5 캐싱 서비스

**PdfCacheService** (Redis)
- `cacheAnalysisResult()` - 30일 동안 결과 저장
- `getCachedAnalysisResult()` - 캐시된 분석 조회
- `isCached()` - 캐시 상태 확인
- `invalidateCache()` - 수동 캐시 무효화
- `extendCacheTTL()` - 인기 PDF의 만료 연장
- `getCacheSize()` - 캐시 통계 모니터링

**캐시 설정**
- 기본 TTL: 1시간 (3600초)
- PDF 분석 TTL: 30일 (2,592,000초)
- 사용자 프로필 TTL: 24시간 (86,400초)
- 청약 목록 TTL: 30분 (1800초)
- 자격 TTL: 1시간 (3600초)

---

## 6. 데이터베이스 스키마 및 마이그레이션

### 6.1 마이그레이션 전략 (Flyway)

**V1__Create_initial_schema.sql**
- 포괄적인 스키마로 초기 테이블 생성
- 베이스라인 마이그레이션

**V2__Add_user_story_1_tables.sql**
- 업데이트된 구조로 재구축하기 위해 이전 테이블 삭제
- 올바른 구조로 새 Users 테이블 생성
- users에 대한 외래 키로 UserProfiles 업데이트
- 확장된 자격 기준으로 Subscriptions
- 테스트 데이터 포함 (사용자 3명, 테스트 청약 5개)

**V3__Insert_test_data.sql**
- 포괄적인 테스트 데이터셋
- 프로필이 있는 테스트 사용자 3명
- 지역별 테스트 청약 5개

**V4__Add_performance_indexes.sql**
- 올바른 제약조건을 가진 PDF 문서 테이블
- PDF 분석 결과 테이블
- 고유성 제약조건이 있는 즐겨찾기 테이블
- 쿼리 최적화를 위한 11개의 복합 인덱스
- 성능 조정된 자격 기준 인덱스
- 프로필 기준 복합 인덱스
- 사용자-상태-업로드 복합 인덱스

### 6.2 데이터베이스 테이블

**users**
```sql
id (BIGINT, PK, AI)
username (VARCHAR 255)
email (VARCHAR 255, UNIQUE)
password (VARCHAR 255)
status (VARCHAR 20, DEFAULT 'ACTIVE')
created_at, updated_at (TIMESTAMP)
```

**user_profiles**
```sql
id (BIGINT, PK, AI)
user_id (BIGINT, FK, UNIQUE)
age (INT, CHECK 19-150)
annual_income (BIGINT, CHECK >= 0)
household_members (INT, CHECK >= 1)
housing_owned (INT, CHECK >= 0)
location_preferences (VARCHAR 500)
notifications_enabled (BOOLEAN)
created_at, updated_at (TIMESTAMP)
INDEX idx_user_id
```

**subscriptions**
```sql
id (BIGINT, PK, AI)
name (VARCHAR 255)
location (VARCHAR 255)
address (VARCHAR 1000)
housing_type (VARCHAR 50)
min_price, max_price (BIGINT)
min_age, max_age (INT)
min_income, max_income (BIGINT)
min_household_members, max_household_members (INT)
max_housing_owned (INT)
special_qualifications (VARCHAR 2000)
preference_categories (VARCHAR 1000)
application_start_date, application_end_date (DATE)
data_source (VARCHAR 20)
is_merged (BOOLEAN)
public_data_id (VARCHAR 500)
pdf_document_id (VARCHAR 500)
is_active (BOOLEAN)
detail_url (VARCHAR 2000)
created_at, updated_at (TIMESTAMP)
쿼리 최적화를 위한 여러 인덱스
```

**pdf_documents**
```sql
id (BIGINT, PK, AI)
user_id (BIGINT, FK)
file_name (VARCHAR 255)
file_path (VARCHAR 500)
file_size (BIGINT)
content_type (VARCHAR 100)
processing_status (VARCHAR 20: PENDING/PROCESSING/COMPLETED/FAILED)
cache_key (VARCHAR 64, UNIQUE)
error_message (VARCHAR 2000)
uploaded_at (TIMESTAMP)
created_at, updated_at (TIMESTAMP)
INDEX idx_user_id, idx_cache_key, idx_status
```

**pdf_analysis_results**
```sql
id (BIGINT, PK, AI)
pdf_document_id (BIGINT, FK, UNIQUE)
subscriptionName, location, address, housingType (VARCHAR)
minAge, maxAge, minIncome, maxIncome (INT/BIGINT)
minHouseholdMembers, maxHouseholdMembers, maxHousingOwned (INT)
specialQualifications, preferenceCategories (TEXT)
minPrice, maxPrice (BIGINT)
applicationPeriod (VARCHAR 100)
matchScore (INT)
isEligible (BOOLEAN)
eligibilityBreakdown (TEXT, JSON)
recommendations (TEXT, JSON)
ocrQuality (VARCHAR 50: HIGH/MEDIUM/LOW)
ocrWarning (VARCHAR 500)
extractedText (TEXT)
aiModel (VARCHAR 500)
processingTimeMs (INT)
created_at, updated_at (TIMESTAMP)
INDEX idx_pdf_id, idx_subscription_id
```

**favorites**
```sql
id (BIGINT, PK, AI)
user_id (BIGINT, FK)
subscription_id (BIGINT, FK)
note (VARCHAR 500)
created_at, updated_at (TIMESTAMP)
UNIQUE KEY (user_id, subscription_id)
INDEX idx_user_id, idx_subscription_id, idx_created_at
```

---

## 7. 주요 기술 및 프레임워크

### 7.1 핵심 프레임워크
- **Spring Boot 3.2.1** - 애플리케이션 프레임워크
- **Spring Security** - 인증 및 권한 부여
- **Spring Data JPA** - ORM 및 데이터 액세스

### 7.2 데이터베이스
- **MySQL 8.0+** - 주 데이터베이스
- **Flyway 9.x** - 데이터베이스 마이그레이션 관리
- **Hibernate** - JPA 구현

### 7.3 캐싱
- **Redis** - 분산 캐싱
- **Spring Data Redis** - Redis 통합

### 7.4 AI 및 외부 API
- **Google Cloud Vision API 3.31.0** - OCR 및 이미지 감지
- **Google Vertex AI 1.1.0** - AI 모델 액세스
- **Gemini API** (Vertex AI 경유) - 조건 추출을 위한 텍스트 생성
- **공공데이터포털 API** - 정부 주택 청약 데이터

### 7.5 보안
- **JWT (JJWT 0.12.3)** - 토큰 기반 인증
- **BCrypt** - 비밀번호 암호화
- **Spring Security Filter** - 요청 인증

### 7.6 API 및 문서화
- **SpringDoc OpenAPI 2.3.0** - Swagger/OpenAPI 3.0 통합
- **Spring REST** - RESTful API 구현

### 7.7 탄력성
- **Resilience4j 2.1.0** - 서킷 브레이커 패턴
- **Spring Retry** - 자동 재시도 메커니즘
- **Spring AOP** - 관점 지향 프로그래밍

### 7.8 개발 도구
- **Lombok** - 코드 생성 (getter, builder, logging)
- **Spring Validation** - 입력 검증
- **Spring Actuator** - 애플리케이션 모니터링

### 7.9 비동기 처리
- **Spring Async** - 비동기 작업 실행
- **Spring Task Executor** - 스레드 풀 설정
  - 코어 크기: 10
  - 최대 크기: 50
  - 큐 용량: 100

### 7.10 빌드 시스템
- **Gradle 8.x** - Kotlin DSL로 빌드 자동화
- **Java 17** - 대상 버전

---

## 8. 성능 최적화

### 8.1 데이터베이스 인덱스 (11개의 복합 인덱스)
- 날짜 범위가 있는 활성 청약
- 자격 기준 (연령, 소득, 가구원 수, 주택)
- 가격 범위 쿼리
- 지역 기반 검색
- 사용자 프로필 기준
- PDF 상태 추적
- 즐겨찾기 조회

### 8.2 쿼리 최적화
- 관계에 대한 지연 로딩
- 자격 사전 확인과 함께 필터링된 추천
- 캐시된 분석 결과
- Redis 기반 중복 제거

### 8.3 비동기 처리
- 논블로킹 PDF 분석
- 스레드 풀 설정 (10-50 스레드)
- 큐 용량 관리 (100 항목)

---

## 9. 모니터링 및 관찰성

### 9.1 Actuator 엔드포인트
- 상세 컴포넌트 상태와 함께 헬스 체크
- 애플리케이션 정보
- 메트릭 수집

### 9.2 로깅
- Logback과 함께 SLF4J
- SQL 쿼리에 대한 DEBUG 레벨
- 비즈니스 로직에 대한 INFO 레벨
- 예외에 대한 ERROR 레벨
- 변수 치환이 있는 구조화된 로깅

### 9.3 캐시 모니터링
- 캐시 크기 추적
- 히트/미스 로깅
- TTL 연장 추적

---

## 10. 환경 설정

### 필수 환경 변수
- `JWT_SECRET` - JWT 서명 키
- `GOOGLE_GEMINI_API_KEY` - Gemini AI 액세스
- `GOOGLE_VISION_API_KEY` - Vision API 액세스
- `PUBLIC_DATA_API_KEY` - 공공데이터포털 액세스
- `DB_PASSWORD` - 데이터베이스 비밀번호 (프로덕션)

### 애플리케이션 설정
- 데이터베이스: localhost:3306/zipduck (개발), mysql:3306 (프로덕션)
- Redis: localhost:6379 (개발), redis:6379 (프로덕션)
- 파일 업로드: 최대 10MB, /app/pdfs에 저장
- 비동기: 10-50 스레드, 큐 용량 100
- CORS: localhost:3000, localhost:5173

---

이 포괄적인 백엔드 구현은 고급 AI 기능, 지능형 캐싱 및 견고한 데이터 관리를 갖춘 프로덕션 준비 주택 청약 매칭 플랫폼을 제공합니다.

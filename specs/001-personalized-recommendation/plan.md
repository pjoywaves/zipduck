# Technical Implementation Plan: ZipDuck MVP

**Feature**: Personalized Subscription Recommendation Service
**Specification**: [spec.md](./spec.md)
**Created**: 2025-11-21
**Architecture**: Monolithic Spring Boot Application
**Target**: Minimum Viable Product (P1 Features Only)

## Executive Summary

This plan outlines the technical implementation for ZipDuck's MVP, focusing exclusively on P1 priority features with a simplified monolithic architecture optimized for rapid deployment. The system will provide AI-powered subscription recommendation with OCR-enabled PDF analysis, dual-source data integration (public database + user uploads), and personalized eligibility matching.

**Core Technology Stack**:
- Backend: Java 17 + Spring Boot 3.2.1 (Monolith)
- Database: MySQL + Redis (limited caching)
- AI/OCR: Google Gemini 2.5 Flash + Google Vision API
- Frontend: React + TypeScript + TailwindCSS
- Infrastructure: AWS EC2 + Docker Compose + Nginx

---

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         AWS EC2 Instance                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    Docker Compose                      │ │
│  │  ┌─────────────┐  ┌──────────┐  ┌────────┐  ┌──────┐ │ │
│  │  │   Nginx     │  │  Spring  │  │ MySQL  │  │Redis │ │ │
│  │  │  (Reverse   │  │   Boot   │  │   DB   │  │Cache │ │ │
│  │  │   Proxy)    │  │   App    │  │        │  │      │ │ │
│  │  │             │  │          │  │        │  │      │ │ │
│  │  │  - Static   │  │  - REST  │  │  - JPA │  │ - PDF│ │ │
│  │  │    Files    │  │    API   │  │  - User│  │   Cache│ │
│  │  │  - API      │  │  - @Async│  │  - Sub │  │      │ │ │
│  │  │    Gateway  │  │  - AI/OCR│  │  - PDF │  │      │ │ │
│  │  └─────────────┘  └──────────┘  └────────┘  └──────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
                ┌───────────────────────┐
                │  External Services    │
                │  - Google Gemini 2.5  │
                │  - Google Vision API  │
                │  - 공공데이터포털 API   │
                └───────────────────────┘
```

### 1.2 Monolithic Application Structure

```
com.zipduck
├── domain
│   ├── user
│   │   ├── User.java (Entity)
│   │   ├── UserProfile.java (Entity)
│   │   ├── UserRepository.java
│   │   ├── UserQueryService.java (읽기)
│   │   └── UserCommandService.java (쓰기)
│   ├── subscription
│   │   ├── Subscription.java (Entity)
│   │   ├── SubscriptionRepository.java
│   │   ├── SubscriptionQueryService.java
│   │   └── SubscriptionCommandService.java
│   ├── pdf
│   │   ├── PdfDocument.java (Entity)
│   │   ├── PdfAnalysisResult.java (Entity)
│   │   ├── PdfRepository.java
│   │   ├── PdfQueryService.java
│   │   └── PdfCommandService.java
│   ├── eligibility
│   │   ├── EligibilityMatch.java (Entity)
│   │   ├── EligibilityCalculator.java (서비스)
│   │   └── EligibilityRepository.java
│   └── favorite
│       ├── Favorite.java (Entity)
│       └── FavoriteRepository.java
├── application
│   ├── ai
│   │   ├── GeminiService.java (PDF 분석)
│   │   ├── VisionService.java (OCR)
│   │   └── EligibilityScorer.java (Scikit-learn Python 연동)
│   ├── collector
│   │   └── PublicDataCollector.java (@Scheduled)
│   └── async
│       └── PdfAnalysisTask.java (@Async)
├── api
│   ├── controller
│   │   ├── UserController.java
│   │   ├── SubscriptionController.java
│   │   ├── PdfController.java
│   │   └── EligibilityController.java
│   └── dto
│       ├── request/
│       └── response/
├── infrastructure
│   ├── cache
│   │   └── RedisCacheConfig.java
│   ├── external
│   │   ├── GeminiClient.java
│   │   ├── VisionClient.java
│   │   └── PublicDataClient.java
│   └── config
│       ├── AsyncConfig.java
│       ├── JpaConfig.java
│       └── SecurityConfig.java
└── ZipDuckApplication.java
```

---

## 2. Database Schema (MySQL)

### 2.1 Core Tables

```sql
-- 사용자 프로필
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
    INDEX idx_user_id (user_id)
);

-- 청약 목록 (공공 데이터 + PDF)
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
);

-- PDF 문서
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
);

-- PDF 분석 결과
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
    INDEX idx_pdf_id (pdf_id)
);

-- 적격성 매칭
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
    INDEX idx_score (match_score DESC)
);

-- 즐겨찾기
CREATE TABLE favorite (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(255) NOT NULL,
    subscription_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subscription_id) REFERENCES subscription(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_subscription (user_id, subscription_id),
    INDEX idx_user_id (user_id)
);
```

---

## 3. P1 Feature Implementation Details

### 3.1 User Story 1: Profile Creation and Unified Recommendation View

**Functional Requirements**: FR-001 to FR-005, FR-026, FR-027, FR-032

**API Endpoints**:
```java
// UserController.java
@PostMapping("/api/v1/users/profile")
ResponseEntity<UserProfileResponse> createProfile(@RequestBody UserProfileRequest request);

@GetMapping("/api/v1/users/{userId}/profile")
ResponseEntity<UserProfileResponse> getProfile(@PathVariable String userId);

@PutMapping("/api/v1/users/{userId}/profile")
ResponseEntity<UserProfileResponse> updateProfile(
    @PathVariable String userId,
    @RequestBody UserProfileRequest request
);

// SubscriptionController.java
@GetMapping("/api/v1/subscriptions/recommendations")
ResponseEntity<SubscriptionListResponse> getRecommendations(
    @RequestParam String userId,
    @RequestParam(required = false) SourceFilter sourceFilter // ALL, PUBLIC_DB, PDF_UPLOAD
);
```

**Service Logic**:
```java
// SubscriptionQueryService.java
public SubscriptionListResponse getRecommendations(String userId, SourceFilter filter) {
    UserProfile profile = userQueryService.getProfile(userId);

    // 1. 공공 데이터 청약 조회
    List<Subscription> publicSubs = subscriptionRepository
        .findActiveSubscriptions(filter != SourceFilter.PDF_UPLOAD);

    // 2. 사용자 PDF 분석 결과 조회
    List<PdfAnalysisResult> pdfResults = pdfQueryService
        .findUserAnalysisResults(userId, filter != SourceFilter.PUBLIC_DB);

    // 3. 적격성 필터링 (FR-004, FR-032)
    List<SubscriptionDto> eligible = eligibilityCalculator
        .filterEligibleSubscriptions(profile, publicSubs, pdfResults);

    // 4. 통합 뷰 생성 (FR-026)
    return buildUnifiedView(eligible, filter);
}
```

**Success Criteria Mapping**:
- SC-002: 5초 이내 응답 → MySQL 인덱스 최적화 + Redis 캐싱
- SC-003: 100% 정확도 → 단위 테스트로 검증

---

### 3.2 User Story 2: AI-Powered PDF Analysis with OCR

**Functional Requirements**: FR-016 to FR-025, FR-033 to FR-038

**API Endpoints**:
```java
// PdfController.java
@PostMapping("/api/v1/pdf/upload")
ResponseEntity<PdfUploadResponse> uploadPdf(
    @RequestParam String userId,
    @RequestParam MultipartFile file
);

@GetMapping("/api/v1/pdf/{pdfId}/status")
ResponseEntity<PdfStatusResponse> getPdfStatus(@PathVariable Long pdfId);

@GetMapping("/api/v1/pdf/{pdfId}/analysis")
ResponseEntity<PdfAnalysisResponse> getAnalysisResult(@PathVariable Long pdfId);
```

**Async Processing Flow**:
```java
// PdfCommandService.java
@Transactional
public PdfUploadResponse uploadPdf(String userId, MultipartFile file) {
    // 1. 파일 저장
    String filePath = fileStorage.save(file);

    // 2. Cache key 생성 (FR-024)
    String cacheKey = generateCacheKey(file);

    // 3. 캐시 확인 (SC-014: 5초 이내)
    PdfAnalysisResult cached = redisCacheService.getCachedAnalysis(cacheKey);
    if (cached != null) {
        return buildResponseFromCache(cached);
    }

    // 4. DB 저장
    PdfDocument pdf = pdfRepository.save(new PdfDocument(
        userId, file.getOriginalFilename(), filePath, cacheKey, ProcessingStatus.PENDING
    ));

    // 5. 비동기 분석 시작 (@Async)
    pdfAnalysisTask.analyzePdfAsync(pdf.getId());

    return new PdfUploadResponse(pdf.getId(), ProcessingStatus.PENDING);
}

// PdfAnalysisTask.java
@Async
public void analyzePdfAsync(Long pdfId) {
    PdfDocument pdf = pdfRepository.findById(pdfId).orElseThrow();

    try {
        // 1. 상태 업데이트
        pdfCommandService.updateStatus(pdfId, ProcessingStatus.PROCESSING);

        // 2. OCR 필요 여부 확인 (FR-033)
        boolean needsOcr = visionService.detectImageContent(pdf.getFilePath());

        // 3. 텍스트 추출
        String text = needsOcr
            ? visionService.performOcr(pdf.getFilePath())  // FR-034
            : pdfTextExtractor.extractText(pdf.getFilePath());

        // 4. AI 분석 (FR-017)
        EligibilityCriteria criteria = geminiService.extractCriteria(text);

        // 5. 사용자 프로필과 매칭 (FR-018)
        UserProfile profile = userQueryService.getProfile(pdf.getUserId());
        MatchAnalysis analysis = eligibilityCalculator.analyzeMatch(profile, criteria);

        // 6. 결과 저장
        PdfAnalysisResult result = new PdfAnalysisResult(
            pdf.getId(),
            criteria,
            analysis.getScore(),
            analysis.getStatus(),
            analysis.getDetails(),
            analysis.getRecommendations()
        );
        pdfRepository.saveAnalysisResult(result);

        // 7. 캐시 저장 (FR-024)
        redisCacheService.cacheAnalysis(pdf.getCacheKey(), result);

        // 8. 중복 감지 및 병합 (FR-028, FR-029)
        Optional<Subscription> duplicate = subscriptionQueryService
            .findDuplicate(criteria.getName(), criteria.getLocation());
        if (duplicate.isPresent()) {
            subscriptionCommandService.mergeWithPdf(duplicate.get(), result);
        } else {
            subscriptionCommandService.createFromPdf(result);
        }

        // 9. 완료 상태 업데이트
        pdfCommandService.updateStatus(pdfId, ProcessingStatus.COMPLETED);

    } catch (Exception e) {
        log.error("PDF analysis failed for pdfId={}", pdfId, e);
        pdfCommandService.updateStatus(pdfId, ProcessingStatus.FAILED);
    }
}
```

**Google AI Integration**:
```java
// GeminiService.java
public EligibilityCriteria extractCriteria(String text) {
    String prompt = buildExtractionPrompt(text);

    GenerateContentResponse response = geminiClient.generateContent(
        "gemini-2.5-flash",
        prompt,
        /* temperature */ 0.1,  // 정확도 우선
        /* maxTokens */ 2048
    );

    return parseEligibilityCriteria(response.getText());
}

// VisionService.java
public boolean detectImageContent(String filePath) {
    AnnotateImageResponse response = visionClient.annotateImage(
        filePath,
        Feature.Type.DOCUMENT_TEXT_DETECTION
    );

    return response.getFullTextAnnotation().getText().isEmpty();
}

public String performOcr(String filePath) {
    AnnotateImageResponse response = visionClient.annotateImage(
        filePath,
        Feature.Type.DOCUMENT_TEXT_DETECTION
    );

    return response.getFullTextAnnotation().getText();
}
```

**Success Criteria Mapping**:
- SC-011: 텍스트 30초, OCR 60초 → @Async 타임아웃 설정
- SC-012: 텍스트 95%, OCR 90% → AI 프롬프트 최적화 및 테스트
- SC-014: 캐시 5초 → Redis TTL 설정

---

### 3.3 User Story 3: Saved Profiles (P2)

**Functional Requirements**: FR-006, FR-014

**Implementation**:
- MySQL에 user_profile 저장 (FR-006)
- 프로필 업데이트 시 실시간 추천 갱신 (FR-014)

```java
@PutMapping("/api/v1/users/{userId}/profile")
public ResponseEntity<ProfileUpdateResponse> updateProfile(
    @PathVariable String userId,
    @RequestBody UserProfileRequest request
) {
    // 1. 프로필 업데이트
    UserProfile updated = userCommandService.updateProfile(userId, request);

    // 2. 즉시 추천 갱신 (FR-014)
    SubscriptionListResponse recommendations = subscriptionQueryService
        .getRecommendations(userId, SourceFilter.ALL);

    return ResponseEntity.ok(new ProfileUpdateResponse(updated, recommendations));
}
```

---

### 3.4 Additional P1 Features

**FR-007 to FR-010** (Eligibility Breakdown, Scoring, Favorites, Comparison):
```java
// EligibilityController.java
@GetMapping("/api/v1/eligibility/{subscriptionId}")
ResponseEntity<EligibilityBreakdownResponse> getBreakdown(
    @RequestParam String userId,
    @PathVariable Long subscriptionId
);

// FavoriteController.java
@PostMapping("/api/v1/favorites")
ResponseEntity<Void> addFavorite(@RequestBody AddFavoriteRequest request);

@GetMapping("/api/v1/users/{userId}/favorites")
ResponseEntity<List<SubscriptionDto>> getFavorites(@PathVariable String userId);

@PostMapping("/api/v1/subscriptions/compare")
ResponseEntity<ComparisonResponse> compareSubscriptions(
    @RequestBody CompareRequest request  // up to 5 subscriptionIds
);
```

---

## 4. Data Collection (공공데이터포털 API)

**Functional Requirement**: FR-003, FR-011

**Scheduled Task**:
```java
// PublicDataCollector.java
@Component
public class PublicDataCollector {

    @Scheduled(cron = "0 0 2 * * *")  // 매일 새벽 2시
    public void collectSubscriptionData() {
        log.info("Starting daily subscription data collection");

        try {
            // 1. 공공데이터포털 API 호출
            List<PublicSubscriptionDto> rawData = publicDataClient
                .fetchSubscriptions(LocalDate.now().minusDays(1));

            // 2. 데이터 변환 및 저장
            for (PublicSubscriptionDto dto : rawData) {
                Subscription existing = subscriptionRepository
                    .findByExternalId(dto.getId(), Source.PUBLIC_DB);

                if (existing == null) {
                    // 신규 청약 생성
                    subscriptionCommandService.createFromPublicData(dto);
                } else {
                    // 기존 청약 업데이트
                    subscriptionCommandService.updateFromPublicData(existing, dto);
                }
            }

            // 3. 만료된 청약 비활성화 (FR-030)
            subscriptionCommandService.deactivateExpiredSubscriptions();

            log.info("Subscription data collection completed: {} subscriptions", rawData.size());

        } catch (Exception e) {
            log.error("Failed to collect subscription data", e);
        }
    }
}

// PublicDataClient.java
public List<PublicSubscriptionDto> fetchSubscriptions(LocalDate fromDate) {
    String url = publicDataProperties.getBaseUrl() + "/subscriptions";

    return restTemplate.exchange(
        url,
        HttpMethod.GET,
        buildRequestWithApiKey(),
        new ParameterizedTypeReference<List<PublicSubscriptionDto>>() {},
        Map.of("startDate", fromDate.toString())
    ).getBody();
}
```

**Success Criteria Mapping**:
- SC-007: 24시간 내 업데이트 → 매일 새벽 2시 스케줄러

---

## 5. Frontend Implementation

### 5.1 Component Structure

```
src/
├── components/
│   ├── profile/
│   │   ├── ProfileForm.tsx
│   │   └── ProfileDisplay.tsx
│   ├── subscriptions/
│   │   ├── SubscriptionList.tsx
│   │   ├── SubscriptionCard.tsx
│   │   ├── SourceFilter.tsx (공공 / PDF / 전체)
│   │   ├── ComparisonView.tsx
│   │   └── EligibilityBreakdown.tsx
│   ├── pdf/
│   │   ├── PdfUploader.tsx
│   │   ├── PdfStatusPoller.tsx (Polling)
│   │   └── AnalysisResultDisplay.tsx
│   └── favorites/
│       └── FavoritesList.tsx
├── services/
│   ├── api.ts (Axios instance)
│   ├── userService.ts
│   ├── subscriptionService.ts
│   ├── pdfService.ts
│   └── eligibilityService.ts
├── hooks/
│   ├── useProfile.ts
│   ├── useSubscriptions.ts
│   ├── usePdfUpload.ts
│   └── usePdfStatus.ts (Polling hook)
├── types/
│   ├── User.ts
│   ├── Subscription.ts
│   ├── Pdf.ts
│   └── Eligibility.ts
└── pages/
    ├── HomePage.tsx
    ├── ProfilePage.tsx
    ├── SubscriptionsPage.tsx
    └── ComparisonPage.tsx
```

### 5.2 PDF Upload with Polling

```typescript
// usePdfStatus.ts
export function usePdfStatus(pdfId: number | null) {
  const [status, setStatus] = useState<ProcessingStatus>('PENDING');
  const [result, setResult] = useState<PdfAnalysisResult | null>(null);

  useEffect(() => {
    if (!pdfId) return;

    const interval = setInterval(async () => {
      const response = await pdfService.getStatus(pdfId);
      setStatus(response.status);

      if (response.status === 'COMPLETED') {
        const analysisResult = await pdfService.getAnalysis(pdfId);
        setResult(analysisResult);
        clearInterval(interval);
      } else if (response.status === 'FAILED') {
        clearInterval(interval);
      }
    }, 2000);  // 2초마다 폴링

    return () => clearInterval(interval);
  }, [pdfId]);

  return { status, result };
}

// PdfUploader.tsx
export function PdfUploader({ userId }: { userId: string }) {
  const [uploadedPdfId, setUploadedPdfId] = useState<number | null>(null);
  const { status, result } = usePdfStatus(uploadedPdfId);

  const handleUpload = async (file: File) => {
    const response = await pdfService.upload(userId, file);
    setUploadedPdfId(response.pdfId);
  };

  return (
    <div>
      <FileInput onChange={handleUpload} />
      {status === 'PROCESSING' && <LoadingSpinner />}
      {status === 'COMPLETED' && <AnalysisResultDisplay result={result} />}
      {status === 'FAILED' && <ErrorMessage />}
    </div>
  );
}
```

### 5.3 Unified Subscription View

```typescript
// SubscriptionsPage.tsx
export function SubscriptionsPage() {
  const { userId } = useAuth();
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('ALL');
  const { data: subscriptions, isLoading } = useSubscriptions(userId, sourceFilter);

  return (
    <div className="container mx-auto p-4">
      <SourceFilter value={sourceFilter} onChange={setSourceFilter} />

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <SubscriptionList subscriptions={subscriptions} />
      )}
    </div>
  );
}

// SubscriptionCard.tsx
export function SubscriptionCard({ subscription }: { subscription: Subscription }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold">{subscription.name}</h3>
        <SourceBadge source={subscription.source} />
      </div>

      <p className="text-gray-600">{subscription.location}</p>
      <p className="text-sm text-gray-500">
        신청기간: {subscription.applicationPeriodStart} ~ {subscription.applicationPeriodEnd}
      </p>

      <div className="mt-4">
        <MatchScoreBadge score={subscription.matchScore} />
        <button onClick={() => viewDetails(subscription.id)}>
          상세 보기
        </button>
      </div>
    </div>
  );
}
```

---

## 6. Infrastructure & Deployment

### 6.1 Docker Compose Configuration

```yaml
# docker-compose.yml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./frontend/build:/usr/share/nginx/html
    depends_on:
      - backend
    networks:
      - zipduck-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/zipduck?useSSL=false&serverTimezone=Asia/Seoul
      - SPRING_DATASOURCE_USERNAME=zipduck
      - SPRING_DATASOURCE_PASSWORD=${DB_PASSWORD}
      - SPRING_REDIS_HOST=redis
      - SPRING_REDIS_PORT=6379
      - GOOGLE_GEMINI_API_KEY=${GEMINI_API_KEY}
      - GOOGLE_VISION_API_KEY=${VISION_API_KEY}
      - PUBLIC_DATA_API_KEY=${PUBLIC_DATA_API_KEY}
    depends_on:
      - mysql
      - redis
    networks:
      - zipduck-network
    volumes:
      - pdf-storage:/app/pdfs

  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - MYSQL_DATABASE=zipduck
      - MYSQL_USER=zipduck
      - MYSQL_PASSWORD=${DB_PASSWORD}
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql
    networks:
      - zipduck-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - zipduck-network

networks:
  zipduck-network:
    driver: bridge

volumes:
  mysql-data:
  redis-data:
  pdf-storage:
```

### 6.2 Nginx Configuration

```nginx
# nginx.conf
upstream backend {
    server backend:8080;
}

server {
    listen 80;
    server_name zipduck.com;

    # Frontend static files
    location / {
        root /usr/share/nginx/html;
        try_files $uri /index.html;
    }

    # API proxy
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts for PDF upload/processing
        proxy_read_timeout 90s;
        proxy_connect_timeout 90s;
        proxy_send_timeout 90s;
    }

    # File upload size limit
    client_max_body_size 10M;
}
```

### 6.3 Spring Boot Dockerfile

```dockerfile
# backend/Dockerfile
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy application JAR
COPY target/zipduck-0.0.1-SNAPSHOT.jar app.jar

# Create directory for PDF storage
RUN mkdir -p /app/pdfs

# Expose port
EXPOSE 8080

# Run application
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "app.jar"]
```

---

## 7. Implementation Phases

### Phase 1: Foundation (Week 1-2)

**Goals**: Database setup, basic CRUD, authentication

**Tasks**:
1. MySQL schema creation and migration scripts
2. Spring Boot project setup with JPA entities
3. Redis configuration for caching
4. User profile CRUD endpoints
5. Basic authentication (Spring Security + JWT)
6. Frontend project setup (React + TypeScript)

**Deliverables**:
- Working user profile creation/retrieval
- Database schema deployed
- Frontend skeleton with routing

---

### Phase 2: Public Data Integration (Week 3)

**Goals**: 공공데이터포털 API 연동 및 청약 목록 조회

**Tasks**:
1. Public Data API client implementation
2. Subscription entity and repository
3. Scheduled data collection (@Scheduled)
4. Eligibility calculator (basic filtering logic)
5. Subscription list endpoint with filtering
6. Frontend subscription list component

**Deliverables**:
- Daily automatic data collection working
- Users can view filtered subscription lists
- Basic eligibility matching (FR-004)

---

### Phase 3: PDF Analysis & OCR (Week 4-5)

**Goals**: AI 기반 PDF 분석 및 OCR 구현

**Tasks**:
1. Google Gemini integration (PDF 분석)
2. Google Vision API integration (OCR)
3. Async PDF processing (@Async)
4. Redis caching for PDF results
5. Duplicate detection and merging logic
6. Frontend PDF uploader with polling
7. Analysis result display component

**Deliverables**:
- Users can upload PDFs (text + image)
- OCR extracts text from scanned documents
- AI analyzes eligibility criteria
- Results cached for popular PDFs (SC-014: <5s)

---

### Phase 4: Unified View & Matching (Week 6)

**Goals**: 공공 데이터 + PDF 통합 뷰, 적격성 상세 분석

**Tasks**:
1. Unified subscription list endpoint (FR-026)
2. Source filtering (ALL / PUBLIC_DB / PDF_UPLOAD)
3. Eligibility breakdown endpoint (FR-007)
4. Match score calculation (FR-008)
5. Frontend unified view component
6. Eligibility breakdown UI

**Deliverables**:
- Single list showing both public + PDF subscriptions
- Users can filter by source
- Detailed eligibility breakdown with ✓/✗ indicators

---

### Phase 5: Favorites & Comparison (Week 7)

**Goals**: 즐겨찾기 및 비교 기능

**Tasks**:
1. Favorite entity and endpoints (FR-009)
2. Comparison endpoint (FR-010, max 5)
3. Frontend favorites list
4. Comparison table component

**Deliverables**:
- Users can save favorites
- Side-by-side comparison of up to 5 subscriptions

---

### Phase 6: Polish & Testing (Week 8)

**Goals**: 성능 최적화, 테스트, 배포 준비

**Tasks**:
1. Performance testing (SC-002: <5s, SC-006: 10k users)
2. E2E testing with Cypress
3. Error handling improvements
4. Docker Compose final configuration
5. AWS EC2 deployment
6. Load balancer + SSL setup

**Deliverables**:
- Production-ready MVP
- All SC-001 to SC-015 success criteria met
- Deployed on AWS with monitoring

---

## 8. Success Criteria Validation Plan

| SC | Criteria | Validation Method | Target |
|----|----------|-------------------|--------|
| SC-001 | Profile creation < 3 min | User testing | ✓ Simple form |
| SC-002 | Recommendations < 5 sec | Load testing (JMeter) | ✓ MySQL index + Redis |
| SC-003 | 100% filtering precision | Unit tests (eligibility logic) | ✓ Test coverage |
| SC-004 | 90% understand eligibility | User testing | ✓ Clear UI/UX |
| SC-005 | Compare 5 subscriptions | Feature testing | ✓ Comparison API |
| SC-006 | 10k concurrent users | Load testing (K6) | ✓ Async + caching |
| SC-007 | Data update < 24h | Scheduler verification | ✓ Daily 2AM cron |
| SC-008 | Saved profile load < 10s | Performance testing | ✓ DB query optimization |
| SC-009 | 80% return in 30 days | Analytics tracking | ✓ Post-launch metric |
| SC-010 | Notification < 1h | Feature testing | ✓ Scheduled job |
| SC-011 | PDF analysis < 30s / 60s | Integration testing | ✓ @Async timeout |
| SC-012 | AI accuracy 95% / 90% | AI model testing | ✓ Prompt optimization |
| SC-013 | 90% understand results | User testing | ✓ Clear result UI |
| SC-014 | Cached PDF < 5s | Performance testing | ✓ Redis cache |
| SC-015 | 85% find helpful | User survey | ✓ Post-launch survey |

---

## 9. Technology Stack Summary

### Backend
- **Language**: Java 17
- **Framework**: Spring Boot 3.2.1
- **Persistence**: Spring Data JPA + MySQL 8.0
- **Cache**: Redis 7
- **Async**: Spring @Async (Thread Pool)
- **Scheduler**: Spring @Scheduled (Cron)
- **AI/OCR**:
  - Google Gemini 2.5 Flash (PDF 분석)
  - Google Vision API (OCR)
  - Scikit-learn (적격성 점수 계산 - Python 연동)
- **Build**: Maven

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: React Query (서버 상태) + Context API (로컬 상태)
- **HTTP Client**: Axios
- **Build**: Vite

### Infrastructure
- **Hosting**: AWS EC2 (단일 인스턴스)
- **Containerization**: Docker + Docker Compose
- **Web Server**: Nginx (리버스 프록시 + 정적 파일 서빙)
- **CI/CD**: GitHub Actions (향후)

### External Services
- **공공데이터포털 API** (청약 정보 수집)
- **Google Cloud Platform** (Gemini API, Vision API)

---

## 10. Risk Mitigation

### Risk 1: AI 분석 정확도 미달 (SC-012)

**Mitigation**:
- Prompt engineering 반복 테스트
- 분석 결과 샘플링 검증 (100개 PDF 수동 검증)
- 신뢰도 임계값 설정 (confidence < 0.7 → 수동 확인 요청)

### Risk 2: OCR 품질 문제 (FR-037)

**Mitigation**:
- Google Vision API 품질 점수 활용
- 저품질 이미지 사전 필터링 (프론트엔드 검증)
- 사용자에게 재업로드 가이드 제공

### Risk 3: 성능 병목 (SC-006: 10k 동시 사용자)

**Mitigation**:
- Redis 캐싱 적극 활용
- @Async 스레드 풀 크기 조정 (50-100)
- MySQL 쿼리 최적화 (인덱스, EXPLAIN 분석)
- 필요 시 EC2 수직 확장 (t3.medium → t3.large)

### Risk 4: 공공 API 장애

**Mitigation**:
- 재시도 로직 (Spring Retry)
- Circuit breaker 패턴 (Resilience4j)
- 수집 실패 시 이메일 알림

---

## 11. Post-MVP Considerations (P2/P3)

**Not in MVP**:
- P2 Features (Detailed Eligibility Breakdown) → Phase 4에 포함
- P3 Features (Notifications, Calendar sync) → v2.0
- Microservices 전환 → 트래픽 검증 후
- Kafka/RabbitMQ → 비동기 처리량 증가 시
- Kubernetes → 멀티 인스턴스 필요 시

---

## 12. Conclusion

This plan provides a **pragmatic, monolithic architecture** optimized for rapid MVP deployment. By leveraging Spring Boot's built-in features (@Async, @Scheduled), limiting Redis to critical caching only, and using polling instead of WebSockets, we minimize architectural complexity while meeting all P1 functional requirements and success criteria.

**Expected Timeline**: 8 weeks to production-ready MVP
**Team Size**: 2-3 developers (1 backend, 1 frontend, 0.5 DevOps)
**Launch Readiness**: All P1 features + monitoring + basic analytics

**Next Steps**: Begin Phase 1 implementation → Database schema + Spring Boot skeleton.
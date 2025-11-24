---
description: "Task list for ZipDuck MVP - Personalized Subscription Recommendation Service"
---

# Tasks: ZipDuck MVP

**Input**: Design documents from `/specs/001-personalized-recommendation/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: Tests are NOT explicitly requested in the feature specification, so test tasks are excluded.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/src/main/java/com/zipduck/`
- **Frontend**: `frontend/src/`
- **Infrastructure**: Repository root for Docker/config files

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project directory structure for monolithic Spring Boot application and React frontend
- [X] T002 Initialize Spring Boot project with Gradle dependencies in backend/build.gradle.kts (Spring Boot 3.2.1, JPA, Redis, Security, Async)
- [X] T003 [P] Initialize React + TypeScript + Vite project in frontend/ with TailwindCSS dependencies
- [X] T004 [P] Create Docker Compose configuration in docker-compose.yml for Nginx, Spring Boot, MySQL, Redis
- [X] T005 [P] Create Nginx configuration file in nginx.conf for reverse proxy and static file serving
- [X] T006 [P] Create Spring Boot Dockerfile in backend/Dockerfile with JDK 17

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 Create MySQL schema migration scripts in backend/src/main/resources/db/migration/ for user_profile, subscription, pdf_document, pdf_analysis_result, eligibility_match, favorite tables
- [X] T008 [P] Configure JPA and create base entity classes in backend/src/main/java/com/zipduck/domain/
- [X] T009 [P] Setup Redis cache configuration in backend/src/main/java/com/zipduck/infrastructure/cache/RedisCacheConfig.java
- [X] T010 [P] Configure Spring Security with JWT authentication in backend/src/main/java/com/zipduck/infrastructure/config/SecurityConfig.java
- [X] T011 [P] Setup async processing configuration in backend/src/main/java/com/zipduck/infrastructure/config/AsyncConfig.java
- [X] T012 [P] Create global exception handler in backend/src/main/java/com/zipduck/api/exception/GlobalExceptionHandler.java
- [X] T013 [P] Setup environment configuration in backend/src/main/resources/application.yml for dev and prod profiles
- [X] T014 [P] Configure Google Gemini API client in backend/src/main/java/com/zipduck/infrastructure/external/GeminiClient.java
- [X] T015 [P] Configure Google Vision API client in backend/src/main/java/com/zipduck/infrastructure/external/VisionClient.java
- [X] T016 [P] Configure 공공데이터포털 API client in backend/src/main/java/com/zipduck/infrastructure/external/PublicDataClient.java
- [X] T017 [P] Setup SpringDoc OpenAPI configuration in backend/src/main/java/com/zipduck/infrastructure/config/OpenApiConfig.java
- [X] T018 [P] Create base API response DTOs in backend/src/main/java/com/zipduck/api/dto/response/
- [ ] T019 [P] Setup Axios HTTP client configuration in frontend/src/services/api.ts
- [ ] T020 [P] Setup React Router configuration in frontend/src/App.tsx
- [ ] T021 [P] Create base TypeScript types in frontend/src/types/

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Profile Creation and Unified Recommendation View (Priority: P1) 🎯 MVP

**Goal**: Enable users to create profiles and see personalized housing subscription recommendations from both public database and PDF sources in a unified view with source filtering

**Independent Test**: Create a user profile with specific criteria (age: 32, income: 60M KRW, household: 2, housing owned: 0), add public database subscriptions, upload PDFs, verify unified view displays all eligible opportunities with source indicators and filtering works correctly

### Implementation for User Story 1

#### Backend - User Profile (FR-001, FR-002, FR-006, FR-014)

- [X] T022 [P] [US1] Create User entity in backend/src/main/java/com/zipduck/domain/user/User.java
- [X] T023 [P] [US1] Create UserProfile entity in backend/src/main/java/com/zipduck/domain/user/UserProfile.java
- [X] T024 [P] [US1] Create UserRepository interface in backend/src/main/java/com/zipduck/domain/user/UserRepository.java
- [X] T025 [US1] Implement UserQueryService for reading operations in backend/src/main/java/com/zipduck/domain/user/UserQueryService.java
- [X] T026 [US1] Implement UserCommandService for create/update operations in backend/src/main/java/com/zipduck/domain/user/UserCommandService.java
- [X] T027 [US1] Create UserProfileRequest DTO with validation in backend/src/main/java/com/zipduck/api/dto/request/UserProfileRequest.java
- [X] T028 [US1] Create UserProfileResponse DTO in backend/src/main/java/com/zipduck/api/dto/response/UserProfileResponse.java
- [X] T029 [US1] Implement UserController with OpenAPI annotations in backend/src/main/java/com/zipduck/api/controller/UserController.java (POST /api/v1/users/{id}/profile, GET /api/v1/users/{id}/profile, PATCH /api/v1/users/{id}/profile/notifications)

#### Backend - Subscription Management (FR-003, FR-004, FR-005, FR-011, FR-026, FR-027, FR-032)

- [X] T030 [P] [US1] Create Subscription entity in backend/src/main/java/com/zipduck/domain/subscription/Subscription.java with source enum (PUBLIC_DB, PDF_UPLOAD, MERGED)
- [X] T031 [P] [US1] Create SubscriptionRepository interface in backend/src/main/java/com/zipduck/domain/subscription/SubscriptionRepository.java
- [X] T032 [US1] Implement SubscriptionQueryService in backend/src/main/java/com/zipduck/domain/subscription/SubscriptionQueryService.java
- [X] T033 [US1] Implement SubscriptionCommandService in backend/src/main/java/com/zipduck/domain/subscription/SubscriptionCommandService.java
- [X] T034 [US1] Create EligibilityCalculator service in backend/src/main/java/com/zipduck/domain/eligibility/EligibilityCalculator.java for filtering logic
- [X] T035 [US1] Implement unified recommendation logic in SubscriptionQueryService.getRecommendations() with source filtering support
- [X] T036 [US1] Create SubscriptionDto response DTO in backend/src/main/java/com/zipduck/api/dto/response/SubscriptionDto.java
- [X] T037 [US1] Create SubscriptionListResponse DTO in backend/src/main/java/com/zipduck/api/dto/response/SubscriptionListResponse.java
- [X] T038 [US1] Implement SubscriptionController with OpenAPI annotations in backend/src/main/java/com/zipduck/api/controller/SubscriptionController.java (GET /api/v1/subscriptions/recommendations with sourceFilter param)

#### Backend - Public Data Collection (FR-003, FR-011)

- [X] T039 [US1] Implement PublicDataCollector scheduled task in backend/src/main/java/com/zipduck/application/collector/PublicDataCollector.java with @Scheduled(cron = "0 0 2 * * *")
- [X] T040 [US1] Implement data collection logic to fetch, transform, and save subscriptions from 공공데이터포털 API
- [X] T041 [US1] Add logic to deactivate expired subscriptions (FR-030)

#### Frontend - User Profile (FR-001, FR-002, FR-006, FR-014)

- [ ] T042 [P] [US1] Create User TypeScript types in frontend/src/types/User.ts
- [ ] T043 [P] [US1] Create userService for API calls in frontend/src/services/userService.ts
- [ ] T044 [P] [US1] Create useProfile custom hook in frontend/src/hooks/useProfile.ts
- [ ] T045 [US1] Implement ProfileForm component in frontend/src/components/profile/ProfileForm.tsx with validation
- [ ] T046 [US1] Implement ProfileDisplay component in frontend/src/components/profile/ProfileDisplay.tsx
- [ ] T047 [US1] Create ProfilePage in frontend/src/pages/ProfilePage.tsx

#### Frontend - Unified Subscription View (FR-004, FR-005, FR-026, FR-027)

- [ ] T048 [P] [US1] Create Subscription TypeScript types in frontend/src/types/Subscription.ts
- [ ] T049 [P] [US1] Create subscriptionService for API calls in frontend/src/services/subscriptionService.ts
- [ ] T050 [P] [US1] Create useSubscriptions custom hook in frontend/src/hooks/useSubscriptions.ts
- [ ] T051 [US1] Implement SourceFilter component in frontend/src/components/subscriptions/SourceFilter.tsx (ALL, PUBLIC_DB, PDF_UPLOAD filters)
- [ ] T052 [US1] Implement SubscriptionCard component with source badges in frontend/src/components/subscriptions/SubscriptionCard.tsx
- [ ] T053 [US1] Implement SubscriptionList component in frontend/src/components/subscriptions/SubscriptionList.tsx
- [ ] T054 [US1] Create SubscriptionsPage in frontend/src/pages/SubscriptionsPage.tsx with unified view and source filtering
- [ ] T055 [US1] Create HomePage in frontend/src/pages/HomePage.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional - users can create profiles and see unified recommendations from all sources with filtering

---

## Phase 4: User Story 2 - AI-Powered PDF Analysis with OCR (Priority: P1) 🎯 MVP

**Goal**: Enable users to upload subscription PDFs in any format (text-based, scanned images, mobile photos) and receive AI-powered eligibility analysis with OCR support, match scoring, and actionable recommendations

**Independent Test**: Upload various PDF formats (text PDF, scanned image PDF, mobile photo), verify OCR extracts text from images, AI correctly analyzes eligibility criteria, match scores are calculated, recommendations are provided, and results are cached for popular PDFs

### Implementation for User Story 2

#### Backend - PDF Document Management (FR-016, FR-023, FR-024, FR-036)

- [X] T056 [P] [US2] Create PdfDocument entity in backend/src/main/java/com/zipduck/domain/pdf/PdfDocument.java with processing status enum
- [X] T057 [P] [US2] Create PdfAnalysisResult entity in backend/src/main/java/com/zipduck/domain/pdf/PdfAnalysisResult.java
- [X] T058 [P] [US2] Create PdfRepository interface in backend/src/main/java/com/zipduck/domain/pdf/PdfRepository.java
- [X] T059 [US2] Implement PdfQueryService in backend/src/main/java/com/zipduck/domain/pdf/PdfQueryService.java
- [X] T060 [US2] Implement PdfCommandService in backend/src/main/java/com/zipduck/domain/pdf/PdfCommandService.java with file storage and cache key generation
- [X] T061 [US2] Implement Redis caching service for PDF analysis results in backend/src/main/java/com/zipduck/infrastructure/cache/PdfCacheService.java

#### Backend - AI & OCR Integration (FR-017, FR-033, FR-034, FR-035, FR-037, FR-038)

- [X] T062 [P] [US2] Implement VisionService for OCR in backend/src/main/java/com/zipduck/application/ai/VisionService.java with detectImageContent() and performOcr() methods
- [X] T063 [P] [US2] Implement GeminiService for criteria extraction in backend/src/main/java/com/zipduck/application/ai/GeminiService.java with extractCriteria() and prompt engineering
- [X] T064 [US2] Implement EligibilityScorer for match scoring in backend/src/main/java/com/zipduck/application/ai/EligibilityScorer.java

#### Backend - Async PDF Processing (FR-016 to FR-025, FR-028, FR-029, FR-030)

- [X] T065 [US2] Create PdfAnalysisTask async processor in backend/src/main/java/com/zipduck/application/async/PdfAnalysisTask.java with @Async annotation
- [X] T066 [US2] Implement analyzePdfAsync() workflow: status update, OCR detection, text extraction, AI analysis, profile matching, result saving, caching
- [X] T067 [US2] Add duplicate detection logic to find matching subscriptions by name and location (FR-028)
- [X] T068 [US2] Implement mergeWithPdf() in SubscriptionCommandService for duplicate handling (FR-029)
- [X] T069 [US2] Implement createFromPdf() in SubscriptionCommandService for new PDF-based subscriptions
- [X] T070 [US2] Add automatic expiration handling for PDF-analyzed subscriptions (FR-030, FR-031)

#### Backend - PDF API Endpoints (FR-016, FR-022, FR-036, FR-037, FR-038)

- [X] T071 [P] [US2] Create PdfUploadRequest and PdfUploadResponse DTOs in backend/src/main/java/com/zipduck/api/dto/
- [X] T072 [P] [US2] Create PdfStatusResponse and PdfAnalysisResponse DTOs in backend/src/main/java/com/zipduck/api/dto/response/
- [X] T073 [US2] Implement PdfController with OpenAPI annotations in backend/src/main/java/com/zipduck/api/controller/PdfController.java (POST /api/v1/pdf/upload, GET /api/v1/pdf/{pdfId}/status, GET /api/v1/pdf/{pdfId}/analysis)
- [X] T074 [US2] Add file format validation and size limits (max 10MB) to PdfController.uploadPdf()
- [X] T075 [US2] Add OCR quality detection and user notification logic (FR-037, FR-038)

#### Backend - Eligibility Matching (FR-007, FR-008, FR-018, FR-019, FR-020, FR-021, FR-025)

- [X] T076 [P] [US2] Create EligibilityMatch entity in backend/src/main/java/com/zipduck/domain/eligibility/EligibilityMatch.java
- [X] T077 [P] [US2] Create EligibilityRepository interface in backend/src/main/java/com/zipduck/domain/eligibility/EligibilityRepository.java
- [X] T078 [US2] Implement match analysis logic in EligibilityCalculator.analyzeMatch() with requirements met/failed breakdown
- [X] T079 [US2] Add multi-tier qualification detection for partial matches (FR-020)
- [X] T080 [US2] Implement actionable recommendations generation based on match status (FR-021, FR-025)

#### Frontend - PDF Upload & Analysis (FR-016, FR-022, FR-036, FR-037, FR-038)

- [ ] T081 [P] [US2] Create Pdf TypeScript types in frontend/src/types/Pdf.ts
- [ ] T082 [P] [US2] Create pdfService for API calls in frontend/src/services/pdfService.ts
- [ ] T083 [P] [US2] Create usePdfUpload custom hook in frontend/src/hooks/usePdfUpload.ts
- [ ] T084 [P] [US2] Create usePdfStatus polling hook in frontend/src/hooks/usePdfStatus.ts with 2-second intervals
- [ ] T085 [US2] Implement PdfUploader component with file validation in frontend/src/components/pdf/PdfUploader.tsx
- [ ] T086 [US2] Implement PdfStatusPoller component with loading states in frontend/src/components/pdf/PdfStatusPoller.tsx
- [ ] T087 [US2] Implement AnalysisResultDisplay component showing match scores and recommendations in frontend/src/components/pdf/AnalysisResultDisplay.tsx

#### Frontend - Eligibility Breakdown (FR-007, FR-018, FR-019, FR-020, FR-021)

- [ ] T088 [P] [US2] Create Eligibility TypeScript types in frontend/src/types/Eligibility.ts
- [ ] T089 [P] [US2] Create eligibilityService for API calls in frontend/src/services/eligibilityService.ts
- [ ] T090 [US2] Implement EligibilityBreakdown component showing met/failed requirements in frontend/src/components/subscriptions/EligibilityBreakdown.tsx
- [ ] T091 [US2] Add match score badges to SubscriptionCard component in frontend/src/components/subscriptions/SubscriptionCard.tsx

**Checkpoint**: At this point, User Story 2 should be fully functional - users can upload PDFs in any format, OCR processes images, AI analyzes eligibility, and results appear in unified view

---

## Phase 5: User Story 3 - Saved Profiles and Quick Access (Priority: P2)

**Goal**: Enable returning users to save profiles and access updated recommendations instantly without re-entering information

**Independent Test**: Create and save a profile, log out, log back in, verify saved profile loads automatically with current recommendations

### Implementation for User Story 3

- [ ] T092 [US3] Add profile persistence logic to UserCommandService.updateProfile() with automatic recommendation refresh (FR-014)
- [ ] T093 [US3] Implement profile auto-loading on user login in UserQueryService
- [ ] T094 [US3] Update ProfilePage to support profile editing with real-time recommendation updates in frontend/src/pages/ProfilePage.tsx
- [ ] T095 [US3] Add profile update notification UI feedback in ProfileForm component

**Checkpoint**: At this point, User Story 3 should work - returning users see saved profiles and updated recommendations instantly

---

## Phase 6: Additional P1 Features - Eligibility Details, Favorites, Comparison (FR-007 to FR-010)

**Goal**: Add transparency through detailed eligibility breakdowns, enable favorites management, and provide side-by-side subscription comparison

**Independent Test**: View eligibility breakdown for any subscription, add subscriptions to favorites list, compare up to 5 subscriptions side-by-side

### Implementation

#### Backend - Eligibility Breakdown & Favorites

- [ ] T096 [P] Create Favorite entity in backend/src/main/java/com/zipduck/domain/favorite/Favorite.java
- [ ] T097 [P] Create FavoriteRepository interface in backend/src/main/java/com/zipduck/domain/favorite/FavoriteRepository.java
- [ ] T098 Create EligibilityController in backend/src/main/java/com/zipduck/api/controller/EligibilityController.java (GET /api/v1/eligibility/{subscriptionId})
- [ ] T099 Create FavoriteController in backend/src/main/java/com/zipduck/api/controller/FavoriteController.java (POST /api/v1/favorites, GET /api/v1/users/{userId}/favorites)
- [ ] T100 Implement comparison endpoint in SubscriptionController (POST /api/v1/subscriptions/compare) supporting up to 5 subscriptions

#### Frontend - Favorites & Comparison

- [ ] T101 [P] Create FavoritesList component in frontend/src/components/favorites/FavoritesList.tsx
- [ ] T102 [P] Create ComparisonView component in frontend/src/components/subscriptions/ComparisonView.tsx
- [ ] T103 Add favorites management UI to SubscriptionCard component
- [ ] T104 Create ComparisonPage in frontend/src/pages/ComparisonPage.tsx with side-by-side comparison table

**Checkpoint**: All P1 features complete - full eligibility transparency, favorites, and comparison functionality working

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and production readiness

- [ ] T105 [P] Add comprehensive error handling and user-friendly error messages across all controllers
- [ ] T106 [P] Add logging for critical operations (profile creation, PDF analysis, data collection) across all services
- [ ] T107 [P] Optimize MySQL queries with proper indexes in migration scripts
- [ ] T108 [P] Configure Redis TTL settings for PDF cache (FR-024)
- [ ] T109 [P] Add retry logic with Spring Retry for external API calls (Gemini, Vision, PublicData)
- [ ] T110 [P] Implement circuit breaker with Resilience4j for external services
- [ ] T111 [P] Add responsive design polish to all frontend components with TailwindCSS
- [ ] T112 [P] Create loading skeletons for all async operations in frontend
- [ ] T113 Configure production environment variables in .env.prod
- [ ] T114 Add health check endpoints in Spring Boot Actuator
- [ ] T115 Create deployment scripts for AWS EC2 in deploy/
- [ ] T116 Add monitoring and alerting configuration
- [ ] T117 Perform security audit and hardening (SQL injection, XSS, CSRF protection)
- [ ] T118 Load testing with K6 or JMeter to verify SC-006 (10k concurrent users)
- [ ] T119 Performance optimization to meet SC-002 (<5s recommendations) and SC-011 (<30s text PDF, <60s OCR)
- [ ] T120 Validate all success criteria SC-001 to SC-015 with user testing

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3, 4, 5)**: All depend on Foundational phase completion
  - User Story 1 (P1) can start immediately after Phase 2
  - User Story 2 (P1) can start immediately after Phase 2 (independent of US1)
  - User Story 3 (P2) requires User Story 1 profile infrastructure (T022-T029)
- **Additional P1 Features (Phase 6)**: Depends on User Story 1 and 2 completion
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories (fully independent)
- **User Story 3 (P2)**: Requires User Story 1 profile infrastructure (T022-T029)
- **Phase 6 Features**: Require User Story 1 (subscription infrastructure) and User Story 2 (eligibility matching)

### Within Each User Story

#### User Story 1:
- Profile entities and services (T022-T029) before profile endpoints
- Subscription entities and services (T030-T035) before subscription endpoints
- Backend APIs (T029, T038) before frontend components
- Frontend services and types (T042-T043, T048-T050) before UI components
- UI components (T045-T046, T051-T053) before pages (T047, T054-T055)

#### User Story 2:
- PDF entities and services (T056-T061) before async processing
- AI services (T062-T064) before async processing
- Async processing (T065-T070) before API endpoints
- Backend APIs (T071-T075) before frontend components
- Eligibility matching (T076-T080) can be parallel with PDF processing
- Frontend services and hooks (T081-T084) before UI components
- UI components (T085-T087, T090) before integration into pages

### Parallel Opportunities

- **Phase 1**: All tasks marked [P] (T003, T004, T005, T006) can run in parallel
- **Phase 2**: Most foundational tasks marked [P] (T008-T021) can run in parallel after T007 completes
- **User Story 1**:
  - T022-T024 (user entities) can run in parallel
  - T030-T031 (subscription entities) can run in parallel
  - T042-T044 (frontend user services) can run in parallel
  - T048-T050 (frontend subscription services) can run in parallel
- **User Story 2**:
  - T056-T058 (PDF entities) can run in parallel
  - T062-T064 (AI services) can run in parallel
  - T071-T072 (DTOs) can run in parallel
  - T076-T077 (eligibility entities) can run in parallel
  - T081-T084 (frontend services) can run in parallel
- **Phase 6**: T096-T097 (entities) can run in parallel
- **Phase 7**: Most polish tasks marked [P] (T105-T112) can run in parallel
- **Different User Stories**: US1 and US2 can be worked on in parallel by different team members after Phase 2

---

## Parallel Example: User Story 1

```bash
# Launch all entity creation tasks together:
Task: "Create User entity in backend/src/main/java/com/zipduck/domain/user/User.java"
Task: "Create UserProfile entity in backend/src/main/java/com/zipduck/domain/user/UserProfile.java"
Task: "Create UserRepository interface in backend/src/main/java/com/zipduck/domain/user/UserRepository.java"

# Launch all frontend type and service tasks together:
Task: "Create User TypeScript types in frontend/src/types/User.ts"
Task: "Create userService for API calls in frontend/src/services/userService.ts"
Task: "Create useProfile custom hook in frontend/src/hooks/useProfile.ts"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup (T001-T006)
2. Complete Phase 2: Foundational (T007-T021) - CRITICAL, blocks all stories
3. Complete Phase 3: User Story 1 (T022-T055) - Profile and unified recommendations
4. Complete Phase 4: User Story 2 (T056-T091) - PDF analysis with OCR
5. **STOP and VALIDATE**: Test both user stories independently and together
6. Deploy MVP with P1 features

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (Basic MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (Full P1 MVP with AI/OCR!)
4. Add User Story 3 → Test independently → Deploy/Demo (P2 enhancement)
5. Add Phase 6 features → Test independently → Deploy/Demo (Full feature set)
6. Add Phase 7 polish → Production ready

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T021)
2. Once Foundational is done:
   - **Developer A**: User Story 1 backend (T022-T041)
   - **Developer B**: User Story 2 backend (T056-T080)
   - **Developer C**: User Story 1 frontend (T042-T055)
3. After backend APIs are ready:
   - **Developer C**: User Story 2 frontend (T081-T091)
4. Stories integrate and test together
5. Team completes Phase 6 and 7 together

---

## Notes

- **[P]** tasks = different files, no dependencies, can run in parallel
- **[Story]** label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- User Story 1 and 2 are both P1 priority and can be developed in parallel
- Commit after each task or logical group of tasks
- Stop at any checkpoint to validate story independently
- Tests are NOT included as they were not requested in the spec
- All success criteria (SC-001 to SC-015) should be validated in Phase 7 (T120)

---

## Task Count Summary

- **Phase 1 (Setup)**: 6 tasks
- **Phase 2 (Foundational)**: 15 tasks
- **Phase 3 (User Story 1 - P1)**: 34 tasks
- **Phase 4 (User Story 2 - P1)**: 36 tasks
- **Phase 5 (User Story 3 - P2)**: 4 tasks
- **Phase 6 (Additional P1 Features)**: 9 tasks
- **Phase 7 (Polish)**: 16 tasks
- **Total**: 120 tasks

### Tasks per User Story

- **User Story 1 (Profile & Unified View)**: 34 tasks
- **User Story 2 (AI PDF Analysis with OCR)**: 36 tasks
- **User Story 3 (Saved Profiles)**: 4 tasks
- **Additional Features (Eligibility, Favorites, Comparison)**: 9 tasks

### Parallel Opportunities

- **Phase 1**: 4 parallel tasks
- **Phase 2**: 14 parallel tasks
- **User Story 1**: 8 parallel opportunities (entities, services, types)
- **User Story 2**: 10 parallel opportunities (entities, AI services, types)
- **Phase 6**: 2 parallel tasks
- **Phase 7**: 8 parallel tasks

### Suggested MVP Scope

**Minimum Viable Product (P1 Features Only)**:
- Phase 1: Setup (T001-T006)
- Phase 2: Foundational (T007-T021)
- Phase 3: User Story 1 - Profile & Recommendations (T022-T055)
- Phase 4: User Story 2 - AI PDF Analysis with OCR (T056-T091)
- Phase 6: Additional P1 Features (T096-T104)
- Phase 7: Critical polish tasks (T105-T120)

This MVP delivers the complete core value proposition: personalized housing subscription recommendations with AI-powered PDF analysis supporting all document formats (text, scanned images, mobile photos), unified view of public database and user-uploaded sources, and essential features like eligibility breakdown, favorites, and comparison.

---

## Format Validation

✅ All tasks follow required checklist format: `- [ ] [TaskID] [P?] [Story?] Description with file path`
✅ All task IDs are sequential (T001-T120)
✅ All [P] markers indicate parallelizable tasks in different files
✅ All [Story] labels correctly map to user stories (US1, US2, US3)
✅ All descriptions include specific file paths
✅ Setup and Foundational phases have NO story labels (correct)
✅ User Story phases have story labels (correct)
✅ Polish phase has NO story labels (correct)
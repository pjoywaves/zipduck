# Implementation Checklist: ZipDuck MVP

**Feature**: Personalized Subscription Recommendation Service
**Plan**: [plan.md](../plan.md)
**Created**: 2025-11-21

## Phase 1: Foundation (Week 1-2)

### Database Setup
- [ ] Create MySQL schema with all tables (user_profile, subscription, pdf_document, pdf_analysis_result, eligibility_match, favorite)
- [ ] Add appropriate indexes for performance (user_id, source, cache_key, etc.)
- [ ] Create database migration scripts (Flyway or Liquibase)
- [ ] Set up Redis for caching

### Backend Foundation
- [ ] Initialize Spring Boot 3.2.1 project with Maven
- [ ] Configure JPA entities for all domain models
- [ ] Implement User domain (Entity, Repository, QueryService, CommandService)
- [ ] Implement basic authentication (Spring Security + JWT)
- [ ] Create REST API endpoints for user profile CRUD
- [ ] Configure @Async thread pool for background tasks
- [ ] Set up application.yml profiles (dev, prod)

### Frontend Foundation
- [ ] Initialize React + TypeScript + Vite project
- [ ] Set up TailwindCSS for styling
- [ ] Configure React Router for navigation
- [ ] Create API service layer with Axios
- [ ] Implement authentication context and hooks
- [ ] Create ProfileForm and ProfileDisplay components
- [ ] Create basic layout and navigation

### Testing & Validation
- [ ] Unit tests for UserQueryService and UserCommandService
- [ ] Integration tests for user profile endpoints
- [ ] E2E test for profile creation flow
- [ ] Verify SC-001: Profile creation < 3 minutes

---

## Phase 2: Public Data Integration (Week 3)

### Backend Implementation
- [ ] Implement Subscription domain (Entity, Repository, Services)
- [ ] Create PublicDataClient for 공공데이터포털 API
- [ ] Implement PublicDataCollector with @Scheduled (daily 2AM)
- [ ] Create EligibilityCalculator for basic filtering logic (FR-004)
- [ ] Implement subscription list endpoint with filtering
- [ ] Add error handling and retry logic for API calls
- [ ] Implement subscription deactivation for expired items (FR-030)

### Frontend Implementation
- [ ] Create SubscriptionList and SubscriptionCard components
- [ ] Implement useSubscriptions hook with React Query
- [ ] Create SubscriptionsPage with loading states
- [ ] Add basic filtering UI (location, price range)

### Testing & Validation
- [ ] Unit tests for EligibilityCalculator
- [ ] Integration tests for PublicDataCollector
- [ ] Mock API tests for PublicDataClient
- [ ] Verify FR-003: Retrieve subscription listings
- [ ] Verify FR-011: Data updated from public sources
- [ ] Verify SC-002: Recommendations < 5 seconds
- [ ] Verify SC-007: Data updated within 24 hours

---

## Phase 3: PDF Analysis & OCR (Week 4-5)

### AI/OCR Integration
- [ ] Set up Google Cloud Platform project
- [ ] Configure Google Gemini 2.5 Flash API credentials
- [ ] Configure Google Vision API credentials
- [ ] Implement GeminiService for PDF analysis (FR-017)
- [ ] Implement VisionService for OCR (FR-034)
- [ ] Create EligibilityScorer with Scikit-learn integration
- [ ] Optimize AI prompts for Korean text extraction

### Backend Implementation
- [ ] Implement PdfDocument domain (Entity, Repository, Services)
- [ ] Implement PdfAnalysisResult domain
- [ ] Create file storage service for PDF uploads
- [ ] Implement PdfAnalysisTask with @Async processing
- [ ] Add OCR content detection logic (FR-033)
- [ ] Implement Redis caching for PDF results (FR-024, SC-014)
- [ ] Implement duplicate detection logic (FR-028)
- [ ] Implement merge logic for duplicate subscriptions (FR-029)
- [ ] Add quality detection for low-quality images (FR-037, FR-038)
- [ ] Create PDF upload, status, and analysis endpoints

### Frontend Implementation
- [ ] Create PdfUploader component with file input
- [ ] Implement usePdfUpload hook
- [ ] Implement usePdfStatus hook with polling (2s interval)
- [ ] Create PdfStatusPoller component with loading states
- [ ] Create AnalysisResultDisplay component
- [ ] Add error handling for failed uploads/analysis
- [ ] Implement image quality validation on client side

### Testing & Validation
- [ ] Unit tests for GeminiService prompt generation
- [ ] Unit tests for VisionService OCR extraction
- [ ] Integration tests for PDF upload flow
- [ ] Integration tests for async analysis task
- [ ] Test with text-based PDFs (FR-017)
- [ ] Test with image-based PDFs (FR-034)
- [ ] Test with mobile photos (JPG, PNG, HEIC) (FR-036)
- [ ] Test low-quality image handling (FR-037)
- [ ] Verify FR-023: Multiple PDF uploads per user
- [ ] Verify SC-011: Analysis < 30s (text), < 60s (OCR)
- [ ] Verify SC-012: Accuracy 95% (text), 90% (OCR)
- [ ] Verify SC-014: Cached PDF < 5 seconds

---

## Phase 4: Unified View & Matching (Week 6)

### Backend Implementation
- [ ] Implement unified subscription list endpoint (FR-026)
- [ ] Add source filtering (ALL, PUBLIC_DB, PDF_UPLOAD) (FR-027)
- [ ] Implement consistent eligibility filtering across sources (FR-032)
- [ ] Create eligibility breakdown endpoint (FR-007)
- [ ] Implement match score calculation (FR-008)
- [ ] Add qualification explanation logic (FR-020, FR-021)
- [ ] Optimize queries with indexes and caching

### Frontend Implementation
- [ ] Create SourceFilter component (FR-027)
- [ ] Update SubscriptionList to show unified view
- [ ] Add source badges to SubscriptionCard
- [ ] Create EligibilityBreakdown component (FR-007)
- [ ] Implement MatchScoreBadge component (FR-008)
- [ ] Add qualification status indicators (✓/✗)
- [ ] Create partial qualification display (FR-020)

### Testing & Validation
- [ ] Integration tests for unified list endpoint
- [ ] Unit tests for match score calculation
- [ ] E2E tests for source filtering
- [ ] Verify FR-026: Unified view with source indicators
- [ ] Verify FR-027: Source filtering works correctly
- [ ] Verify FR-032: Consistent eligibility filtering
- [ ] Verify SC-003: 100% filtering precision
- [ ] Verify SC-004: 90% understand eligibility status

---

## Phase 5: Favorites & Comparison (Week 7)

### Backend Implementation
- [ ] Implement Favorite domain (Entity, Repository)
- [ ] Create favorite endpoints (add, remove, list) (FR-009)
- [ ] Create comparison endpoint (max 5 subscriptions) (FR-010)
- [ ] Add validation for comparison limit
- [ ] Optimize favorite queries with indexes

### Frontend Implementation
- [ ] Create FavoritesList component
- [ ] Add favorite button to SubscriptionCard
- [ ] Implement useFavorites hook
- [ ] Create ComparisonView component (FR-010)
- [ ] Create comparison table with key attributes
- [ ] Add comparison page routing

### Testing & Validation
- [ ] Unit tests for favorite service
- [ ] Integration tests for favorite endpoints
- [ ] Integration tests for comparison endpoint
- [ ] E2E tests for favorite flow
- [ ] E2E tests for comparison flow
- [ ] Verify FR-009: Mark subscriptions as favorites
- [ ] Verify FR-010: Compare up to 5 subscriptions
- [ ] Verify SC-005: Comparison functionality works

---

## Phase 6: Polish & Testing (Week 8)

### Performance Optimization
- [ ] Run JMeter load tests (10k concurrent users)
- [ ] Optimize slow database queries with EXPLAIN
- [ ] Add database connection pooling configuration
- [ ] Configure @Async thread pool size (50-100)
- [ ] Add Redis TTL optimization for cache
- [ ] Implement database query result caching
- [ ] Add API response compression

### Error Handling & Resilience
- [ ] Add Spring Retry for external API calls
- [ ] Implement Circuit Breaker pattern (Resilience4j)
- [ ] Add comprehensive error messages for users
- [ ] Implement email notifications for collection failures
- [ ] Add request validation with proper error responses
- [ ] Create custom exception handlers

### Testing
- [ ] Complete unit test coverage (>80%)
- [ ] Run all integration tests
- [ ] Create E2E test suite with Cypress
- [ ] Performance testing for all success criteria
- [ ] Load testing with K6 (SC-006)
- [ ] Stress testing for PDF analysis pipeline
- [ ] Security testing (OWASP top 10)

### Deployment & Infrastructure
- [ ] Create production Dockerfile for Spring Boot
- [ ] Create docker-compose.yml with all services
- [ ] Configure Nginx reverse proxy
- [ ] Set up SSL certificates
- [ ] Create environment variable management (.env)
- [ ] Set up AWS EC2 instance
- [ ] Deploy Docker Compose to EC2
- [ ] Configure EC2 security groups
- [ ] Set up monitoring (basic health checks)
- [ ] Set up logging (CloudWatch or ELK)
- [ ] Create deployment scripts
- [ ] Document deployment process

### Documentation
- [ ] API documentation (Swagger/OpenAPI)
- [ ] README with setup instructions
- [ ] Environment configuration guide
- [ ] Deployment runbook
- [ ] Troubleshooting guide

### Final Validation
- [ ] Verify all 38 functional requirements (FR-001 to FR-038)
- [ ] Verify all 15 success criteria (SC-001 to SC-015)
- [ ] Run full regression test suite
- [ ] User acceptance testing
- [ ] Security audit
- [ ] Performance benchmarks documented

---

## Success Criteria Checklist

### Performance Criteria
- [ ] SC-001: Profile creation < 3 minutes
- [ ] SC-002: Recommendations < 5 seconds
- [ ] SC-006: 10,000 concurrent users supported
- [ ] SC-007: Data updated within 24 hours
- [ ] SC-008: Saved profile load < 10 seconds
- [ ] SC-011: PDF analysis < 30s (text), < 60s (OCR)
- [ ] SC-014: Cached PDF < 5 seconds

### Quality Criteria
- [ ] SC-003: 100% filtering precision (no false positives)
- [ ] SC-004: 90% users understand eligibility
- [ ] SC-012: AI accuracy 95% (text), 90% (OCR)
- [ ] SC-013: 90% understand PDF analysis results
- [ ] SC-015: 85% find recommendations helpful

### Feature Criteria
- [ ] SC-005: Compare 5 subscriptions side-by-side
- [ ] SC-010: Notifications within 1 hour (P3 feature - defer to v2)

### Post-Launch Metrics (Track after deployment)
- [ ] SC-009: 80% return within 30 days
- [ ] SC-015: 85% find PDF recommendations actionable

---

## Functional Requirements Coverage

### P1 Core Requirements (Must Have for MVP)
- [ ] FR-001 to FR-015: User profiles and subscription recommendations
- [ ] FR-016 to FR-025: PDF analysis and matching
- [ ] FR-026 to FR-032: Dual-source integration
- [ ] FR-033 to FR-038: OCR capabilities

### P2 Requirements (Included in Phase 4)
- [ ] FR-007: Detailed eligibility breakdown
- [ ] FR-008: Match score calculation

### P3 Requirements (Deferred to v2.0)
- Notification system (FR-015 partial - preferences only)
- Calendar integration
- Real-time alerts

---

## Risk Mitigation Tracking

### AI Accuracy Risk (SC-012)
- [ ] Create 100-sample PDF test set
- [ ] Run manual validation of AI extraction
- [ ] Document accuracy metrics
- [ ] Implement confidence threshold (0.7)
- [ ] Add manual review workflow for low confidence

### OCR Quality Risk (FR-037)
- [ ] Test with various image qualities
- [ ] Document quality score thresholds
- [ ] Create user guidance for better images
- [ ] Implement client-side image validation

### Performance Risk (SC-006)
- [ ] Load test with 10k concurrent users
- [ ] Document bottlenecks
- [ ] Optimize critical paths
- [ ] Plan vertical scaling if needed

### External API Risk
- [ ] Implement retry logic (Spring Retry)
- [ ] Add circuit breaker (Resilience4j)
- [ ] Set up failure alerts
- [ ] Document fallback procedures

---

## Notes

- All checkboxes should be completed before MVP launch
- Phase dependencies must be respected (no skipping)
- Each phase includes testing and validation
- Success criteria validation is mandatory before deployment
- Risk mitigation tasks are ongoing throughout development

**Ready for Phase 1**: Begin database schema creation and Spring Boot project initialization.
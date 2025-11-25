# ZipDuck MVP Success Criteria Validation Plan

이 문서는 spec.md에 정의된 모든 성공 기준(SC-001 to SC-015)의 검증 방법과 절차를 제공합니다.

## 검증 개요

| Category | Criteria Count | Testing Method |
|----------|----------------|----------------|
| Performance | SC-001, SC-002, SC-006, SC-007, SC-008, SC-011, SC-014 | 자동 테스트 (K6) |
| Accuracy | SC-003, SC-012 | 단위/통합 테스트 |
| User Experience | SC-004, SC-009, SC-013, SC-015 | 사용자 테스트 |
| Features | SC-005, SC-010 | 기능 테스트 |

---

## Performance Criteria (자동 검증 가능)

### SC-001: Profile creation < 3 minutes

**기준:** 90% of users can create a complete profile in under 3 minutes

**검증 방법:** 사용자 테스트 (UX 관찰)

**테스트 절차:**
```bash
# 사용자 테스트 시나리오
1. 신규 사용자에게 프로필 작성 요청
2. 시간 측정 (시작 ~ 완료)
3. 평균 완료 시간 계산

# 목표: 평균 < 2분, 90th percentile < 3분
```

**통과 기준:**
- ✅ PASS: 10명 중 9명이 3분 내 완료
- ❌ FAIL: 10명 중 3명 이상이 3분 초과

**현재 상태:** ⏳ 미검증 (사용자 테스트 필요)

---

### SC-002: Recommendations returned in < 5 seconds

**기준:** Personalized subscription recommendations are returned within 5 seconds for 95% of requests

**검증 방법:** K6 부하 테스트

**테스트 스크립트:**
```bash
cd load-testing
k6 run k6-load-test.js

# 결과에서 확인:
# http_req_duration{endpoint="recommendations"} p(95) < 5000ms
```

**통과 기준:**
- ✅ PASS: p(95) response time < 5000ms
- ❌ FAIL: p(95) response time >= 5000ms

**최적화 전략 (실패 시):**
1. 데이터베이스 인덱스 추가
2. Redis 캐싱 적용
3. 쿼리 최적화 (N+1 제거)

**현재 상태:** ⏳ 미검증

---

### SC-003: 100% filtering precision (no false positives)

**기준:** The filtering algorithm shows 100% precision (no ineligible subscriptions shown as eligible)

**검증 방법:** 단위 테스트 + 통합 테스트

**테스트 코드:**
```java
@SpringBootTest
class EligibilityCalculatorTest {

    @Test
    void testNoFalsePositives() {
        // Given: 부적격 프로필
        UserProfile profile = new UserProfile(
            age: 45,  // 초과
            annualIncome: 100000000,  // 초과
            householdMembers: 1,
            housingOwned: 2  // 초과
        );

        Subscription subscription = new Subscription(
            eligibilityRequirements: {
                "ageRange": {"min": 19, "max": 39},
                "incomeRange": {"max": 70000000},
                "housingOwned": {"max": 0}
            }
        );

        // When
        MatchAnalysis result = eligibilityCalculator.analyzeMatch(profile, subscription);

        // Then: 절대 QUALIFIED가 나오면 안 됨
        assertThat(result.getStatus()).isNotEqualTo(QualificationStatus.QUALIFIED);
        assertThat(result.getScore()).isLessThan(100.0);
    }

    @Test
    void testComprehensiveCoverage() {
        // 100개의 테스트 케이스로 검증
        List<TestCase> testCases = loadTestCases("eligibility-test-cases.json");

        for (TestCase testCase : testCases) {
            MatchAnalysis result = eligibilityCalculator.analyzeMatch(
                testCase.profile,
                testCase.subscription
            );

            // 예상 결과와 비교
            assertThat(result.getStatus()).isEqualTo(testCase.expectedStatus);
        }
    }
}
```

**통과 기준:**
- ✅ PASS: 모든 테스트 케이스에서 false positive 0개
- ❌ FAIL: 단 1개라도 false positive 발생

**현재 상태:** ✅ 구현 완료 (테스트 작성 필요)

---

### SC-004: 90% understand eligibility status

**기준:** 90% of users understand why they qualify or don't qualify for a subscription within 30 seconds of viewing the breakdown

**검증 방법:** 사용자 테스트 (설문조사)

**테스트 절차:**
```
1. 사용자에게 적격성 분석 결과 화면 제시
2. 30초 후 다음 질문:
   - "이 청약에 신청할 자격이 있나요?" (O/X)
   - "자격이 없다면 어떤 조건이 부족한가요?"
   - "충족한 조건은 무엇인가요?"

3. 정답률 계산
```

**통과 기준:**
- ✅ PASS: 10명 중 9명이 정확히 이해
- ❌ FAIL: 이해도 < 90%

**개선 방안 (실패 시):**
- UI 개선 (아이콘, 색상 구분)
- 툴팁 추가
- 간단한 설명 문구 추가

**현재 상태:** ⏳ 미검증 (사용자 테스트 필요)

---

### SC-005: Compare 5 subscriptions side-by-side

**기준:** Users can compare up to 5 subscriptions side-by-side

**검증 방법:** 기능 테스트 (E2E)

**테스트 스크립트 (Cypress):**
```javascript
describe('Subscription Comparison', () => {
  it('should allow comparing up to 5 subscriptions', () => {
    cy.visit('/subscriptions');

    // 5개 선택
    cy.get('.subscription-card').eq(0).find('.compare-checkbox').check();
    cy.get('.subscription-card').eq(1).find('.compare-checkbox').check();
    cy.get('.subscription-card').eq(2).find('.compare-checkbox').check();
    cy.get('.subscription-card').eq(3).find('.compare-checkbox').check();
    cy.get('.subscription-card').eq(4).find('.compare-checkbox').check();

    // 비교 버튼 클릭
    cy.get('[data-testid="compare-button"]').click();

    // 비교 페이지 확인
    cy.url().should('include', '/compare');
    cy.get('.comparison-table').should('be.visible');
    cy.get('.comparison-column').should('have.length', 5);
  });

  it('should prevent selecting more than 5 subscriptions', () => {
    // 5개 선택 후 6번째 체크박스는 비활성화
    cy.get('.subscription-card').eq(5).find('.compare-checkbox').should('be.disabled');
  });
});
```

**통과 기준:**
- ✅ PASS: 최대 5개까지 비교 가능, 6개 이상 불가
- ❌ FAIL: 제한이 작동하지 않음

**현재 상태:** ✅ 구현 완료 (E2E 테스트 작성 필요)

---

### SC-006: Support 10,000 concurrent users

**기준:** The system supports at least 10,000 concurrent users without performance degradation

**검증 방법:** K6 스트레스 테스트

**테스트 스크립트:**
```bash
cd load-testing
k6 run k6-load-test.js

# 테스트 프로필:
# - 10,000 VUs (Virtual Users)
# - 1분간 유지
# - 에러율 < 1%
# - p95 응답 시간 < 5초
```

**통과 기준:**
- ✅ PASS:
  - http_req_failed < 1%
  - http_req_duration p(95) < 5000ms
  - vus_max = 10000
- ❌ FAIL: 에러율 > 1% 또는 응답 시간 초과

**현재 상태:** ⏳ 미검증

---

### SC-007: Data updated within 24 hours

**기준:** Public database subscriptions are updated daily (within 24 hours)

**검증 방법:** 스케줄러 모니터링 + 로그 검증

**검증 절차:**
```bash
# 1. PublicDataCollector 스케줄 확인
grep "@Scheduled" backend/src/main/java/com/zipduck/application/collector/PublicDataCollector.java
# Expected: @Scheduled(cron = "0 0 2 * * *")  # 매일 새벽 2시

# 2. 로그에서 수집 시간 확인
docker-compose logs backend | grep "Subscription data collection completed"

# 3. 데이터베이스에서 최신 데이터 확인
mysql> SELECT MAX(updated_at) FROM subscription WHERE source = 'PUBLIC_DB';
# 결과가 24시간 이내여야 함
```

**통과 기준:**
- ✅ PASS: 마지막 수집 시간이 24시간 이내
- ❌ FAIL: 24시간 이상 지남

**현재 상태:** ✅ 구현 완료 (모니터링 설정 필요)

---

### SC-008: Saved profile loads in < 10 seconds

**기준:** Returning users see their saved profile and updated recommendations in under 10 seconds

**검증 방법:** K6 성능 테스트

**테스트 스크립트:**
```javascript
// k6-profile-load-test.js
export default function() {
  const userId = 'existing-user-123';

  group('Profile and Recommendations Load', () => {
    const start = new Date();

    // 1. 프로필 조회
    const profileRes = http.get(`${BASE_URL}/api/v1/users/${userId}/profile`, {
      headers: { 'Authorization': `Bearer ${JWT_TOKEN}` }
    });

    // 2. 추천 목록 조회
    const recommendationsRes = http.get(
      `${BASE_URL}/api/v1/subscriptions/recommendations?userId=${userId}`,
      { headers: { 'Authorization': `Bearer ${JWT_TOKEN}` } }
    );

    const totalTime = new Date() - start;

    check(null, {
      'total load time < 10s': () => totalTime < 10000
    });
  });
}
```

**통과 기준:**
- ✅ PASS: p(95) total load time < 10000ms
- ❌ FAIL: p(95) >= 10000ms

**현재 상태:** ⏳ 미검증

---

### SC-009: 80% return within 30 days

**기준:** 80% of users return to the service within 30 days of their first visit

**검증 방법:** Analytics (프로덕션 배포 후)

**측정 방법:**
```sql
-- Google Analytics 또는 Mixpanel 대체 쿼리
SELECT
  COUNT(DISTINCT user_id) AS returning_users,
  (SELECT COUNT(DISTINCT user_id) FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)) AS new_users,
  (COUNT(DISTINCT user_id) / (SELECT COUNT(DISTINCT user_id) FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY))) * 100 AS return_rate
FROM user_activity
WHERE last_visit_at BETWEEN created_at AND DATE_ADD(created_at, INTERVAL 30 DAY);
```

**통과 기준:**
- ✅ PASS: return_rate >= 80%
- ❌ FAIL: return_rate < 80%

**현재 상태:** 📊 프로덕션 배포 후 측정

---

### SC-010: New subscription notifications within 1 hour

**기준:** Users receive notifications for new eligible subscriptions within 1 hour

**검증 방법:** 통합 테스트

**테스트 절차:**
```java
@Test
void testNotificationTimeliness() {
    // Given: 알림 설정된 사용자
    UserProfile profile = createProfileWithNotificationsEnabled();

    // When: 새로운 적격 청약 추가
    Subscription newSubscription = addEligibleSubscription(profile);
    LocalDateTime subscriptionCreatedAt = LocalDateTime.now();

    // Wait for notification processing
    await().atMost(70, TimeUnit.MINUTES)
        .until(() -> notificationService.wasSent(profile.getUserId(), newSubscription.getId()));

    // Then: 1시간 이내 알림 발송
    Notification notification = notificationRepository.findByUserAndSubscription(
        profile.getUserId(), newSubscription.getId()
    );

    Duration timeDiff = Duration.between(subscriptionCreatedAt, notification.getSentAt());
    assertThat(timeDiff.toMinutes()).isLessThanOrEqualTo(60);
}
```

**통과 기준:**
- ✅ PASS: 알림 발송 시간 < 60분
- ❌ FAIL: 알림 발송 시간 >= 60분

**현재 상태:** 🔶 P3 기능 (v2.0으로 연기)

---

### SC-011: PDF analysis time < 30s (text) / < 60s (OCR)

**기준:**
- PDF analysis completes within 30 seconds for text-based PDFs
- PDF analysis completes within 60 seconds for image-based PDFs (OCR)

**검증 방법:** K6 PDF 테스트

**테스트 스크립트:**
```bash
cd load-testing
k6 run k6-pdf-test.js

# 메트릭 확인:
# - pdf_analysis_duration{type:text} p(95) < 30000ms
# - pdf_analysis_duration{type:ocr} p(95) < 60000ms
```

**통과 기준:**
- ✅ PASS:
  - Text PDF: p(95) < 30s
  - OCR PDF: p(95) < 60s
- ❌ FAIL: 시간 초과

**최적화 전략 (실패 시):**
1. Gemini API 호출 최적화 (배치 처리)
2. Vision API 호출 병렬화
3. @Async Thread Pool 크기 증가

**현재 상태:** ⏳ 미검증

---

### SC-012: AI accuracy 95% (text) / 90% (OCR)

**기준:**
- AI extraction achieves 95% accuracy for text-based PDFs
- AI extraction achieves 90% accuracy for image-based PDFs

**검증 방법:** 수동 검증 + 샘플링

**테스트 절차:**
```
1. 테스트 데이터셋 준비:
   - Text PDF: 100개
   - OCR PDF: 100개

2. AI 분석 실행 및 결과 저장

3. 수동 검증:
   - 각 PDF의 AI 추출 결과를 실제 PDF와 비교
   - 필드별 정확도 계산:
     - 청약 이름: 정확 / 부정확
     - 위치: 정확 / 부정확
     - 나이 조건: 정확 / 부정확
     - 소득 조건: 정확 / 부정확
     - 주택 소유 조건: 정확 / 부정확

4. 전체 정확도 계산:
   accuracy = (올바르게 추출된 필드 수) / (전체 필드 수)
```

**통과 기준:**
- ✅ PASS:
  - Text PDF: accuracy >= 95%
  - OCR PDF: accuracy >= 90%
- ❌ FAIL: 정확도 미달

**개선 방안 (실패 시):**
- Prompt Engineering 개선
- Few-shot Learning 예시 추가
- 후처리 검증 로직 강화

**현재 상태:** ⏳ 미검증 (샘플 데이터 준비 필요)

---

### SC-013: 90% understand PDF analysis results

**기준:** 90% of users understand the PDF analysis results and match scores

**검증 방법:** 사용자 테스트

**테스트 절차:**
```
1. 사용자에게 PDF 업로드 및 분석 결과 제시
2. 다음 질문:
   - "분석 결과에서 매치 점수가 무엇을 의미하는지 아시나요?"
   - "어떤 조건을 충족했고 어떤 조건을 충족하지 못했나요?"
   - "추천 사항이 무엇인가요?"

3. 정답률 계산
```

**통과 기준:**
- ✅ PASS: 10명 중 9명이 정확히 이해
- ❌ FAIL: 이해도 < 90%

**개선 방안 (실패 시):**
- 매치 점수 시각화 개선 (게이지, 그래프)
- 추천 사항 문구 명확화
- 튜토리얼 추가

**현재 상태:** ⏳ 미검증 (사용자 테스트 필요)

---

### SC-014: Cached PDF retrieval < 5 seconds

**기준:** Popular PDFs (previously analyzed) return results in under 5 seconds via caching

**검증 방법:** K6 캐시 테스트

**테스트 스크립트:**
```javascript
// k6-pdf-test.js의 testPdfCache 시나리오 참조
export function testPdfCache() {
  const popularPdfId = 1;

  const start = new Date();

  const res = http.get(
    `${BASE_URL}/api/v1/pdf/${popularPdfId}/analysis?userId=${userId}`,
    { headers: { 'Authorization': `Bearer ${JWT_TOKEN}` } }
  );

  const duration = new Date() - start;

  check(res, {
    'cached PDF < 5s': () => duration < 5000
  });
}
```

**통과 기준:**
- ✅ PASS: p(95) < 5000ms
- ❌ FAIL: p(95) >= 5000ms

**현재 상태:** ✅ 구현 완료 (테스트 필요)

---

### SC-015: 85% find recommendations helpful

**기준:** 85% of users find the PDF-based subscription recommendations helpful and actionable

**검증 방법:** 사용자 설문조사 (프로덕션 배포 후)

**설문 문항:**
```
1. PDF 분석 결과가 도움이 되었나요? (5점 척도)
   1 - 전혀 도움이 안 됨
   5 - 매우 도움이 됨

2. 추천 사항이 실행 가능했나요? (예/아니오)

3. 이 기능을 다시 사용하시겠습니까? (예/아니오)
```

**통과 기준:**
- ✅ PASS:
  - 평균 점수 >= 4.0
  - "예" 응답 >= 85%
- ❌ FAIL: 기준 미달

**현재 상태:** 📊 프로덕션 배포 후 측정

---

## 종합 검증 계획

### Phase 1: 자동 테스트 (개발 완료 후)

```bash
# 1. 단위 테스트
cd backend
./gradlew test

# 2. 통합 테스트
./gradlew integrationTest

# 3. E2E 테스트
cd ../frontend
npm run test:e2e

# 4. 부하 테스트
cd ../load-testing
k6 run k6-load-test.js
k6 run k6-pdf-test.js
```

### Phase 2: 사용자 테스트 (배포 전)

```
1. 10명의 테스트 사용자 모집
2. 다음 시나리오 수행:
   - 프로필 생성 (SC-001)
   - 적격성 이해도 (SC-004)
   - PDF 분석 결과 이해도 (SC-013)

3. 설문조사 실시
4. 피드백 수집 및 개선
```

### Phase 3: 프로덕션 모니터링 (배포 후)

```
1. Analytics 설정:
   - Google Analytics 또는 Mixpanel
   - 사용자 리텐션 추적 (SC-009)
   - 만족도 설문 (SC-015)

2. 성능 모니터링:
   - Prometheus + Grafana 대시보드
   - 응답 시간, 에러율 추적

3. 주간 리뷰:
   - Success Criteria 달성 여부 확인
   - 개선 사항 도출
```

## 검증 결과 보고서 템플릿

```markdown
# ZipDuck MVP Success Criteria Validation Report

**Date:** YYYY-MM-DD
**Version:** v1.0.0

## Summary

| Criteria | Status | Result | Notes |
|----------|--------|--------|-------|
| SC-001 | ✅ PASS | Avg 2.3min | 90% < 3min |
| SC-002 | ✅ PASS | p95 4.2s | < 5s target |
| SC-003 | ✅ PASS | 100% precision | 0 false positives |
| SC-004 | ⚠️ WARN | 85% understanding | Target 90% |
| ... | ... | ... | ... |

## Detailed Results

### SC-002: Recommendations < 5 seconds

**Test Method:** K6 Load Test
**Test Date:** 2025-11-25
**VUs:** 10,000
**Duration:** 19 minutes

**Results:**
- http_req_duration (avg): 2.5s
- http_req_duration (p95): 4.2s ✅
- http_req_duration (max): 6.1s
- Error rate: 0.1% ✅

**Status:** ✅ PASS

---

## Recommendations

1. **Immediate Actions:**
   - Improve SC-004 from 85% to 90% (UI improvements)
   - Optimize max response time from 6.1s to < 5s

2. **Monitoring:**
   - Set up alerts for response time > 5s
   - Track user retention weekly

3. **Next Steps:**
   - User testing scheduled for 2025-12-01
   - Production monitoring setup by 2025-12-05
```

## 참고 자료

- [K6 Load Testing Documentation](https://k6.io/docs/)
- [Cypress E2E Testing](https://www.cypress.io/)
- [Google Analytics Setup](https://analytics.google.com/)

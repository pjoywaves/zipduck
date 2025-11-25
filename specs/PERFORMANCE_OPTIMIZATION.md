# ZipDuck Performance Optimization Guide

이 문서는 ZipDuck MVP의 성능 최적화 전략과 구현 가이드를 제공합니다.

## Success Criteria 목표

| SC | 기준 | 현재 상태 | 최적화 목표 |
|----|------|-----------|------------|
| SC-002 | 추천 목록 < 5초 | 측정 필요 | p95 < 3초 |
| SC-006 | 10k 동시 사용자 | 미검증 | 안정적 처리 |
| SC-008 | 저장된 프로필 < 10초 | 측정 필요 | p95 < 5초 |
| SC-011 | PDF 분석 < 30s/60s | 미검증 | 목표 달성 |
| SC-014 | 캐시된 PDF < 5초 | 미검증 | p95 < 2초 |

## 1. 데이터베이스 최적화

### 1.1 인덱스 추가

**migration/V2__add_performance_indexes.sql:**
```sql
-- User Profile 인덱스
CREATE INDEX idx_user_profile_user_id ON user_profile(user_id);
CREATE INDEX idx_user_profile_location ON user_profile(location_preferences);  -- JSON 컬럼 인덱스

-- Subscription 인덱스
CREATE INDEX idx_subscription_source_active ON subscription(source, is_active);
CREATE INDEX idx_subscription_location ON subscription(location);
CREATE INDEX idx_subscription_period ON subscription(application_period_end, is_active);
CREATE INDEX idx_subscription_external_id ON subscription(external_id, source);

-- PDF Document 인덱스
CREATE INDEX idx_pdf_user_cache ON pdf_document(user_id, cache_key);
CREATE INDEX idx_pdf_status ON pdf_document(processing_status, uploaded_at);

-- Eligibility Match 인덱스
CREATE INDEX idx_eligibility_user_sub ON eligibility_match(user_id, subscription_id);
CREATE INDEX idx_eligibility_score ON eligibility_match(match_score DESC);

-- Favorite 인덱스
CREATE INDEX idx_favorite_user ON favorite(user_id, created_at DESC);
```

### 1.2 쿼리 최적화

**SubscriptionRepository.java:**
```java
@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    // ❌ N+1 쿼리 문제 (비효율)
    @Query("SELECT s FROM Subscription s WHERE s.isActive = true")
    List<Subscription> findActiveSubscriptions();

    // ✅ Fetch Join으로 최적화
    @Query("SELECT DISTINCT s FROM Subscription s " +
           "LEFT JOIN FETCH s.eligibilityMatches " +
           "WHERE s.isActive = true AND s.applicationPeriodEnd >= :now")
    List<Subscription> findActiveSubscriptionsOptimized(@Param("now") LocalDate now);

    // ✅ Projection으로 필요한 컬럼만 조회
    @Query("SELECT new com.zipduck.api.dto.response.SubscriptionSummaryDto(" +
           "s.id, s.name, s.location, s.source, s.applicationPeriodEnd) " +
           "FROM Subscription s " +
           "WHERE s.location IN :locations AND s.isActive = true")
    List<SubscriptionSummaryDto> findSummaryByLocations(@Param("locations") List<String> locations);
}
```

### 1.3 Connection Pool 설정

**application.yml:**
```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20          # 최대 연결 수 (CPU 코어 수 * 2 + 디스크 수)
      minimum-idle: 5                # 최소 유휴 연결
      connection-timeout: 30000      # 연결 타임아웃 (30초)
      idle-timeout: 600000           # 유휴 타임아웃 (10분)
      max-lifetime: 1800000          # 최대 수명 (30분)
      leak-detection-threshold: 60000 # 연결 누수 감지 (60초)
```

### 1.4 JPA 배치 처리

**PublicDataCollector.java:**
```java
@Transactional
public void saveSubscriptionsInBatch(List<Subscription> subscriptions) {
    int batchSize = 50;

    for (int i = 0; i < subscriptions.size(); i++) {
        entityManager.persist(subscriptions.get(i));

        if (i % batchSize == 0 && i > 0) {
            // 배치 플러시
            entityManager.flush();
            entityManager.clear();
        }
    }

    entityManager.flush();
    entityManager.clear();
}
```

**application.yml:**
```yaml
spring:
  jpa:
    properties:
      hibernate:
        jdbc:
          batch_size: 50
        order_inserts: true
        order_updates: true
        batch_versioned_data: true
```

## 2. Redis 캐싱 최적화

### 2.1 캐시 전략

**application.yml:**
```yaml
spring:
  cache:
    type: redis
    redis:
      time-to-live: 3600000  # 1시간
      cache-null-values: false
      use-key-prefix: true
  redis:
    host: localhost
    port: 6379
    timeout: 3000ms
    lettuce:
      pool:
        max-active: 8
        max-idle: 8
        min-idle: 2
```

### 2.2 캐시 어노테이션 활용

**SubscriptionQueryService.java:**
```java
@Service
public class SubscriptionQueryService {

    // ✅ 추천 목록 캐싱 (사용자별, 5분 TTL)
    @Cacheable(value = "recommendations", key = "#userId + '-' + #sourceFilter", unless = "#result == null")
    public SubscriptionListResponse getRecommendations(String userId, SourceFilter sourceFilter) {
        // 무거운 쿼리 및 필터링 로직
        return buildRecommendations(userId, sourceFilter);
    }

    // ✅ 캐시 무효화
    @CacheEvict(value = "recommendations", key = "#userId + '-*'", allEntries = true)
    public void invalidateUserRecommendations(String userId) {
        log.info("Invalidating recommendations cache for user: {}", userId);
    }

    // ✅ PDF 분석 결과 캐싱 (영구, cache key 기반)
    @Cacheable(value = "pdf-analysis", key = "#cacheKey", unless = "#result == null")
    public PdfAnalysisResult getCachedAnalysis(String cacheKey) {
        return pdfRepository.findByCacheKey(cacheKey);
    }
}
```

### 2.3 캐시 워밍 (사전 로딩)

**CacheWarmingService.java:**
```java
@Service
@Slf4j
public class CacheWarmingService {

    @Scheduled(cron = "0 0 3 * * *")  // 매일 새벽 3시
    public void warmCache() {
        log.info("Starting cache warming...");

        // 인기 있는 지역의 청약 목록 미리 로드
        List<String> popularLocations = Arrays.asList("서울", "경기", "인천");

        for (String location : popularLocations) {
            subscriptionQueryService.getActiveSubscriptionsByLocation(location);
        }

        log.info("Cache warming completed");
    }
}
```

## 3. 비동기 처리 최적화

### 3.1 Thread Pool 설정

**AsyncConfig.java:**
```java
@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();

        // 코어 스레드 수 (항상 유지)
        executor.setCorePoolSize(10);

        // 최대 스레드 수
        executor.setMaxPoolSize(50);

        // 큐 용량 (스레드 대기열)
        executor.setQueueCapacity(500);

        // 스레드 이름 prefix
        executor.setThreadNamePrefix("Async-");

        // 거부 정책: CallerRunsPolicy (호출자 스레드에서 실행)
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());

        // 애플리케이션 종료 시 대기
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(60);

        executor.initialize();
        return executor;
    }

    // PDF 분석 전용 Thread Pool
    @Bean(name = "pdfAnalysisExecutor")
    public Executor pdfAnalysisExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(20);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("PDF-Analysis-");
        executor.initialize();
        return executor;
    }
}
```

**PdfAnalysisTask.java:**
```java
@Service
public class PdfAnalysisTask {

    @Async("pdfAnalysisExecutor")
    @Transactional
    public CompletableFuture<PdfAnalysisResult> analyzePdfAsync(Long pdfId) {
        try {
            // 분석 로직
            PdfAnalysisResult result = performAnalysis(pdfId);
            return CompletableFuture.completedFuture(result);
        } catch (Exception e) {
            log.error("PDF analysis failed", e);
            return CompletableFuture.failedFuture(e);
        }
    }
}
```

### 3.2 타임아웃 설정

**application.yml:**
```yaml
spring:
  task:
    execution:
      pool:
        core-size: 10
        max-size: 50
        queue-capacity: 500
      thread-name-prefix: "async-"
      shutdown:
        await-termination: true
        await-termination-period: 60s

# API 타임아웃
server:
  tomcat:
    connection-timeout: 20000  # 20초
    threads:
      max: 200
      min-spare: 10
```

## 4. AI API 최적화

### 4.1 요청 배치 처리

**GeminiService.java:**
```java
@Service
public class GeminiService {

    // ✅ 여러 PDF를 배치로 분석
    public List<EligibilityCriteria> extractCriteriaBatch(List<String> texts) {
        // Gemini API의 배치 요청 기능 활용
        List<GenerateContentRequest> requests = texts.stream()
            .map(this::buildRequest)
            .collect(Collectors.toList());

        // 병렬 처리
        return requests.parallelStream()
            .map(geminiClient::generateContent)
            .map(this::parseCriteria)
            .collect(Collectors.toList());
    }

    // ✅ 재시도 로직 (Exponential Backoff)
    @Retryable(
        value = {GeminiApiException.class},
        maxAttempts = 3,
        backoff = @Backoff(delay = 1000, multiplier = 2)
    )
    public EligibilityCriteria extractCriteriaWithRetry(String text) {
        return geminiClient.generateContent(buildRequest(text));
    }
}
```

### 4.2 Circuit Breaker 패턴

**build.gradle.kts:**
```kotlin
dependencies {
    implementation("org.springframework.cloud:spring-cloud-starter-circuitbreaker-resilience4j")
}
```

**Resilience4jConfig.java:**
```java
@Configuration
public class Resilience4jConfig {

    @Bean
    public CircuitBreakerConfig geminiCircuitBreakerConfig() {
        return CircuitBreakerConfig.custom()
            .failureRateThreshold(50)                    // 실패율 50% 이상이면 Open
            .waitDurationInOpenState(Duration.ofSeconds(30))  // Open 상태 30초 유지
            .slidingWindowSize(10)                       // 최근 10개 요청 기준
            .minimumNumberOfCalls(5)                     // 최소 5개 요청 후 판단
            .build();
    }

    @Bean
    public CircuitBreaker geminiCircuitBreaker(CircuitBreakerRegistry registry) {
        return registry.circuitBreaker("gemini", geminiCircuitBreakerConfig());
    }
}
```

**GeminiClient.java:**
```java
@Service
public class GeminiClient {

    @Autowired
    private CircuitBreaker circuitBreaker;

    public GenerateContentResponse generateContent(String prompt) {
        return circuitBreaker.executeSupplier(() -> {
            // Gemini API 호출
            return callGeminiApi(prompt);
        });
    }
}
```

## 5. 프론트엔드 최적화

### 5.1 React Query 설정

**App.tsx:**
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5분간 fresh
      cacheTime: 10 * 60 * 1000,     // 10분간 캐시 유지
      refetchOnWindowFocus: false,   // 포커스 시 재요청 안 함
      retry: 1,                      // 실패 시 1회 재시도
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* 앱 컴포넌트 */}
    </QueryClientProvider>
  );
}
```

### 5.2 컴포넌트 최적화

**SubscriptionList.tsx:**
```typescript
import React, { memo, useCallback, useMemo } from 'react';

// ✅ React.memo로 불필요한 리렌더링 방지
export const SubscriptionCard = memo(({ subscription }: Props) => {
  return (
    <div className="subscription-card">
      {/* 카드 내용 */}
    </div>
  );
});

export function SubscriptionList({ subscriptions }: Props) {
  // ✅ useMemo로 계산 비용 절감
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter(s => s.matchScore > 50);
  }, [subscriptions]);

  // ✅ useCallback으로 함수 메모이제이션
  const handleFavorite = useCallback((id: number) => {
    addFavorite(id);
  }, []);

  return (
    <div>
      {filteredSubscriptions.map(sub => (
        <SubscriptionCard
          key={sub.id}
          subscription={sub}
          onFavorite={handleFavorite}
        />
      ))}
    </div>
  );
}
```

### 5.3 가상 스크롤링 (Virtual Scrolling)

**VirtualizedSubscriptionList.tsx:**
```typescript
import { FixedSizeList as List } from 'react-window';

export function VirtualizedSubscriptionList({ subscriptions }: Props) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <SubscriptionCard subscription={subscriptions[index]} />
    </div>
  );

  return (
    <List
      height={800}             // 뷰포트 높이
      itemCount={subscriptions.length}
      itemSize={200}           // 각 아이템 높이
      width="100%"
    >
      {Row}
    </List>
  );
}
```

### 5.4 Code Splitting

**App.tsx:**
```typescript
import React, { lazy, Suspense } from 'react';

// ✅ Lazy loading으로 초기 번들 크기 감소
const SubscriptionsPage = lazy(() => import('./pages/SubscriptionsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ComparisonPage = lazy(() => import('./pages/ComparisonPage'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/subscriptions" element={<SubscriptionsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/compare" element={<ComparisonPage />} />
      </Routes>
    </Suspense>
  );
}
```

## 6. Nginx 최적화

**nginx.conf:**
```nginx
worker_processes auto;
worker_rlimit_nofile 65535;

events {
    worker_connections 4096;
    use epoll;
    multi_accept on;
}

http {
    # Gzip 압축
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    gzip_comp_level 6;

    # 캐싱 설정
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=1g inactive=60m;

    # Connection pooling
    upstream backend {
        server backend:8080 max_fails=3 fail_timeout=30s;
        keepalive 32;
    }

    server {
        listen 80;

        # API 캐싱 (GET 요청만)
        location /api/v1/subscriptions/recommendations {
            proxy_cache api_cache;
            proxy_cache_valid 200 5m;  # 5분간 캐시
            proxy_cache_key "$scheme$request_method$host$request_uri$arg_userId$arg_sourceFilter";
            proxy_cache_bypass $http_cache_control;
            add_header X-Cache-Status $upstream_cache_status;

            proxy_pass http://backend;
        }

        # 정적 파일 캐싱
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # API 프록시
        location /api/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Connection "";
            proxy_buffering on;
            proxy_buffer_size 4k;
            proxy_buffers 8 4k;
        }
    }
}
```

## 7. JVM 튜닝

**Dockerfile (backend):**
```dockerfile
FROM openjdk:17-jdk-slim

# JVM 옵션 설정
ENV JAVA_OPTS="-Xms1g -Xmx2g \
    -XX:+UseG1GC \
    -XX:MaxGCPauseMillis=200 \
    -XX:+HeapDumpOnOutOfMemoryError \
    -XX:HeapDumpPath=/var/log/heapdump.hprof \
    -Djava.security.egd=file:/dev/./urandom"

ENTRYPOINT java $JAVA_OPTS -jar app.jar
```

## 8. 모니터링 및 프로파일링

### 8.1 JVM 메트릭 수집

**build.gradle.kts:**
```kotlin
dependencies {
    implementation("io.micrometer:micrometer-registry-prometheus")
}
```

### 8.2 Slow Query 로깅

**application.yml:**
```yaml
spring:
  jpa:
    properties:
      hibernate:
        generate_statistics: true
logging:
  level:
    org.hibernate.stat: DEBUG
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE
```

### 8.3 APM (Application Performance Monitoring)

선택사항: New Relic, Datadog, Elastic APM 등 사용

## 성능 개선 체크리스트

### 즉시 적용 (Quick Wins)
- [x] 데이터베이스 인덱스 추가
- [x] Redis 캐싱 설정
- [x] Nginx Gzip 압축
- [x] 프론트엔드 Code Splitting

### 중요도 높음 (High Priority)
- [ ] Connection Pool 최적화
- [ ] JPA N+1 쿼리 제거
- [ ] React.memo 적용
- [ ] Virtual Scrolling 적용

### 선택 사항 (Optional)
- [ ] Circuit Breaker 패턴
- [ ] JVM 튜닝
- [ ] CDN 사용
- [ ] HTTP/2 활성화

## 참고 자료

- [Spring Boot Performance Tuning](https://docs.spring.io/spring-boot/docs/current/reference/html/howto.html#howto.performance)
- [React Performance Optimization](https://react.dev/learn/render-and-commit#optimizing-performance)
- [Nginx Performance Tuning](https://www.nginx.com/blog/tuning-nginx/)
- [MySQL Indexing Best Practices](https://dev.mysql.com/doc/refman/8.0/en/optimization-indexes.html)

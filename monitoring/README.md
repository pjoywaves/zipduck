# ZipDuck Monitoring & Alerting

이 디렉토리는 ZipDuck MVP의 모니터링 및 알림 시스템을 포함합니다.

## 구성 요소

### 1. **Prometheus**
- 메트릭 수집 및 저장
- Alert 규칙 평가
- 포트: 9090

### 2. **Grafana**
- 메트릭 시각화 대시보드
- 포트: 3000
- 기본 계정: admin / admin (변경 필요)

### 3. **Alertmanager**
- Alert 라우팅 및 알림 전송
- 포트: 9093

### 4. **Node Exporter**
- 시스템 메트릭 수집 (CPU, 메모리, 디스크)
- 포트: 9100

## 설치 및 실행

### 1. 환경 변수 설정

`.env` 파일 생성:
```env
GRAFANA_ADMIN_PASSWORD=your_secure_password
SMTP_PASSWORD=your_smtp_password
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

### 2. 모니터링 스택 시작

```bash
cd monitoring
docker-compose -f docker-compose.monitoring.yml up -d
```

### 3. 접속 확인

- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000
- **Alertmanager**: http://localhost:9093

## 모니터링 메트릭

### Application Metrics (Spring Boot Actuator)

```yaml
# application.yml에 추가
management:
  endpoints:
    web:
      exposure:
        include: health,info,prometheus,metrics
  metrics:
    export:
      prometheus:
        enabled: true
    distribution:
      percentiles-histogram:
        http.server.requests: true
```

### 주요 메트릭

1. **HTTP 요청**
   - `http_server_requests_seconds_count`: 요청 수
   - `http_server_requests_seconds_sum`: 총 응답 시간
   - 상태 코드별 분류 가능

2. **JVM 메트릭**
   - `jvm_memory_used_bytes`: JVM 메모리 사용량
   - `jvm_gc_pause_seconds`: GC 일시정지 시간
   - `jvm_threads_live`: 활성 스레드 수

3. **데이터베이스**
   - `hikaricp_connections_active`: 활성 DB 연결
   - `hikaricp_connections_max`: 최대 DB 연결

4. **Redis**
   - `redis_memory_used_bytes`: Redis 메모리 사용량
   - `redis_connected_clients`: 연결된 클라이언트 수

5. **커스텀 메트릭**
   - `pdf_analysis_duration_seconds`: PDF 분석 시간
   - `public_data_collection_failures_total`: 공공 데이터 수집 실패 수
   - `ai_api_requests_total`: AI API 호출 수

### 커스텀 메트릭 추가 예시

```java
// PdfAnalysisTask.java
@Service
public class PdfAnalysisTask {

    private final MeterRegistry meterRegistry;
    private final Counter pdfAnalysisCounter;
    private final Timer pdfAnalysisTimer;

    public PdfAnalysisTask(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
        this.pdfAnalysisCounter = Counter.builder("pdf_analysis_total")
            .description("Total PDF analyses")
            .tag("status", "completed")
            .register(meterRegistry);
        this.pdfAnalysisTimer = Timer.builder("pdf_analysis_duration_seconds")
            .description("PDF analysis duration")
            .register(meterRegistry);
    }

    @Async
    public void analyzePdfAsync(Long pdfId) {
        Timer.Sample sample = Timer.start(meterRegistry);
        try {
            // Analysis logic
            pdfAnalysisCounter.increment();
        } finally {
            sample.stop(pdfAnalysisTimer);
        }
    }
}
```

## Alert 규칙

### Critical Alerts (즉시 알림)

1. **ServiceDown**: 서비스 2분 이상 다운
2. **DatabaseConnectionPoolExhausted**: DB 연결 풀 90% 이상 사용
3. **RedisCacheDown**: Redis 2분 이상 다운
4. **MySQLDown**: MySQL 2분 이상 다운

### Warning Alerts (그룹화된 알림)

1. **HighErrorRate**: 5xx 에러율 > 5%
2. **HighResponseTime**: 95th percentile 응답 시간 > 5초
3. **PdfAnalysisTimeout**: PDF 분석 시간 > 60초
4. **HighCPUUsage**: CPU 사용률 > 80%
5. **HighMemoryUsage**: 메모리 사용률 > 85%
6. **DiskSpaceLow**: 디스크 사용률 > 80%
7. **PublicDataCollectionFailure**: 공공 데이터 수집 실패 > 3회/24시간
8. **AIAPIFailure**: AI API 에러율 > 10%

## Grafana 대시보드

### 주요 대시보드

1. **Application Overview**
   - 요청 수 (RPS)
   - 응답 시간 (P50, P95, P99)
   - 에러율
   - JVM 메모리 사용량

2. **System Metrics**
   - CPU 사용률
   - 메모리 사용률
   - 디스크 사용률
   - 네트워크 트래픽

3. **Database Performance**
   - 활성 연결 수
   - 쿼리 실행 시간
   - 슬로우 쿼리 수

4. **PDF Analysis**
   - 분석 요청 수
   - 평균 분석 시간
   - 성공/실패율
   - 캐시 히트율

5. **AI API Performance**
   - API 호출 수
   - 응답 시간
   - 에러율

### 대시보드 임포트

Grafana UI에서 대시보드 임포트:
- Spring Boot Dashboard: ID `11378`
- Node Exporter Dashboard: ID `1860`
- MySQL Dashboard: ID `7362`

## 알림 설정

### 이메일 알림

`alertmanager.yml`에서 SMTP 설정:
```yaml
global:
  smtp_smarthost: 'smtp.gmail.com:587'
  smtp_from: 'zipduck-alerts@example.com'
  smtp_auth_username: 'zipduck-alerts@example.com'
  smtp_auth_password: '${SMTP_PASSWORD}'
```

### Slack 알림

Slack Webhook URL 설정:
```yaml
slack_configs:
  - api_url: '${SLACK_WEBHOOK_URL}'
    channel: '#zipduck-alerts'
```

### PagerDuty 통합 (선택사항)

```yaml
receivers:
  - name: 'pagerduty'
    pagerduty_configs:
      - service_key: 'your-pagerduty-service-key'
```

## 유용한 쿼리

### Prometheus 쿼리 예시

```promql
# 1분간 평균 요청 수
rate(http_server_requests_seconds_count[1m])

# 95th percentile 응답 시간
histogram_quantile(0.95, rate(http_server_requests_seconds_bucket[5m]))

# 에러율
rate(http_server_requests_seconds_count{status=~"5.."}[5m]) / rate(http_server_requests_seconds_count[5m])

# PDF 분석 성공률
rate(pdf_analysis_total{status="completed"}[5m]) / rate(pdf_analysis_total[5m])

# JVM 메모리 사용률
jvm_memory_used_bytes{area="heap"} / jvm_memory_max_bytes{area="heap"} * 100

# DB 연결 풀 사용률
hikaricp_connections_active / hikaricp_connections_max * 100
```

## 트러블슈팅

### 문제: Prometheus가 Spring Boot 메트릭을 수집하지 못함

**해결:**
1. Spring Boot Actuator Prometheus endpoint 활성화 확인
2. `application.yml`에 `management.endpoints.web.exposure.include: prometheus` 추가
3. Prometheus 설정에서 타겟 확인: `http://localhost:9090/targets`

### 문제: Grafana에서 데이터가 보이지 않음

**해결:**
1. Prometheus 데이터소스 연결 확인
2. 시간 범위 확인 (Last 5 minutes 등)
3. Prometheus에서 먼저 쿼리 테스트

### 문제: Alert가 발송되지 않음

**해결:**
1. Alertmanager 상태 확인: `http://localhost:9093/#/alerts`
2. SMTP 설정 확인
3. 이메일 스팸 폴더 확인

## 모니터링 Best Practices

1. **메트릭 보존 기간**
   - Prometheus: 30일 (디스크 공간에 따라 조정)
   - 장기 보관이 필요하면 Thanos/Cortex 고려

2. **Alert 피로도 관리**
   - Critical alert는 최소화
   - Warning은 그룹화하여 전송
   - Inhibition 규칙 활용

3. **대시보드 구성**
   - 목적별로 대시보드 분리
   - 중요 메트릭은 상단에 배치
   - 임계값 표시선 추가

4. **정기 점검**
   - 주간 메트릭 리뷰
   - Alert 규칙 조정
   - 불필요한 메트릭 제거

## 참고 자료

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Spring Boot Actuator](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html)
- [Alertmanager Configuration](https://prometheus.io/docs/alerting/latest/configuration/)

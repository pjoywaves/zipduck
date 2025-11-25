# ZipDuck Load Testing

이 디렉토리는 K6를 사용한 부하 테스트 스크립트를 포함합니다.

## 설치

### K6 설치

**macOS:**
```bash
brew install k6
```

**Linux:**
```bash
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

**Windows:**
```powershell
choco install k6
```

## 테스트 시나리오

### 1. 일반 API 부하 테스트 (k6-load-test.js)

**목적:** 전체 시스템 부하 테스트 및 SC-002, SC-006 검증

**테스트 프로필:**
- 0 → 1,000 users (2분)
- 1,000 users 유지 (5분)
- 1,000 → 5,000 users (2분)
- 5,000 users 유지 (3분)
- 5,000 → 10,000 users (2분) ← SC-006 검증
- 10,000 users 유지 (1분)
- 10,000 → 0 users (2분)

**실행:**
```bash
# 기본 실행
k6 run k6-load-test.js

# 환경 변수 지정
k6 run \
  -e BASE_URL=http://localhost:8080 \
  -e JWT_TOKEN=your-jwt-token \
  k6-load-test.js

# 결과를 JSON으로 저장
k6 run --out json=load-test-results.json k6-load-test.js

# Grafana Cloud로 결과 전송 (선택사항)
k6 run --out cloud k6-load-test.js
```

**Success Criteria:**
- ✅ SC-002: 95th percentile 응답 시간 < 5초
- ✅ SC-006: 10,000 concurrent users 지원
- ✅ Error rate < 1%

### 2. PDF 분석 부하 테스트 (k6-pdf-test.js)

**목적:** PDF 업로드 및 AI 분석 성능 검증 (SC-011, SC-014)

**테스트 시나리오:**
- Scenario 1: 신규 PDF 업로드 및 분석 (10 VUs, 5분)
- Scenario 2: 캐시된 PDF 조회 (50 VUs, 2분)

**실행:**
```bash
# PDF 테스트용 샘플 파일 준비
mkdir -p test-pdfs
# test-pdfs/ 디렉토리에 PDF 파일 배치

# 테스트 실행
k6 run k6-pdf-test.js
```

**Success Criteria:**
- ✅ SC-011: Text PDF 분석 < 30초
- ✅ SC-011: OCR PDF 분석 < 60초
- ✅ SC-014: 캐시된 PDF 조회 < 5초
- ✅ Analysis success rate > 95%

## 테스트 준비

### 1. 환경 변수 설정

`.env.load-test` 파일 생성:
```env
BASE_URL=http://localhost:8080
JWT_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. 테스트 데이터 준비

**사용자 생성:**
```bash
# 테스트용 사용자 생성 스크립트
curl -X POST http://localhost:8080/api/v1/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -d '{
    "age": 32,
    "annualIncome": 60000000,
    "householdMembers": 2,
    "housingOwned": 0,
    "locationPreferences": ["서울", "경기"]
  }'
```

**공공 데이터 수집 실행:**
```bash
# 청약 데이터가 충분히 있어야 함
# PublicDataCollector 수동 실행 또는
# 테스트 데이터 직접 삽입
```

### 3. 애플리케이션 모니터링 준비

```bash
# Prometheus + Grafana 실행
cd monitoring
docker-compose -f docker-compose.monitoring.yml up -d

# Grafana 대시보드 열기
open http://localhost:3000
```

## 테스트 실행 단계

### Step 1: 애플리케이션 시작

```bash
# Backend
cd backend
./gradlew bootRun

# 또는 Docker Compose
docker-compose up -d
```

### Step 2: Health Check

```bash
curl http://localhost:8080/api/actuator/health
```

### Step 3: Smoke Test (가벼운 테스트)

```bash
# 10 VUs, 30초
k6 run --vus 10 --duration 30s k6-load-test.js
```

### Step 4: Full Load Test

```bash
# 전체 테스트 (약 19분)
k6 run k6-load-test.js

# 결과 저장
k6 run --out json=results-$(date +%Y%m%d-%H%M%S).json k6-load-test.js
```

### Step 5: PDF Analysis Test

```bash
k6 run k6-pdf-test.js
```

## 결과 분석

### K6 출력 해석

```
scenarios: (100.00%) 1 scenario, 10000 max VUs, 19m30s max duration
✓ status is 200
✓ response time < 5s
✓ has subscriptions

checks.........................: 100.00% ✓ 450000 ✗ 0
data_received..................: 1.5 GB  1.3 MB/s
data_sent......................: 45 MB   39 kB/s
http_req_blocked...............: avg=1.2ms    min=1µs     med=5µs      max=500ms  p(90)=10µs   p(95)=15µs
http_req_connecting............: avg=500µs    min=0s      med=0s       max=100ms  p(90)=0s     p(95)=0s
http_req_duration..............: avg=2.5s     min=100ms   med=2.3s     max=4.8s   p(90)=3.8s   p(95)=4.2s  ✓
http_req_failed................: 0.00%   ✓ 0      ✗ 150000
http_req_receiving.............: avg=100µs    min=20µs    med=80µs     max=5ms    p(90)=150µs  p(95)=200µs
http_req_sending...............: avg=50µs     min=10µs    med=40µs     max=2ms    p(90)=80µs   p(95)=100µs
http_req_tls_handshaking.......: avg=0s       min=0s      med=0s       max=0s     p(90)=0s     p(95)=0s
http_req_waiting...............: avg=2.5s     min=100ms   med=2.3s     max=4.8s   p(90)=3.8s   p(95)=4.2s
http_reqs......................: 150000  1315/s
iteration_duration.............: avg=5s       min=3s      med=4.8s     max=10s    p(90)=6s     p(95)=7s
iterations.....................: 150000  1315/s
vus............................: 10000   min=0    max=10000
vus_max........................: 10000   min=10000 max=10000
```

**주요 지표:**
- `http_req_duration p(95)`: 95th percentile 응답 시간 (SC-002 검증용)
- `http_req_failed`: HTTP 실패율 (< 1% 목표)
- `vus_max`: 최대 동시 사용자 수 (SC-006 검증용)
- `http_reqs`: 초당 요청 수 (RPS)

### Success Criteria 판정

| Criteria | Metric | Target | Status |
|----------|--------|--------|--------|
| SC-002 | http_req_duration p(95) | < 5s | `http_req_duration p(95)=4.2s` ✅ |
| SC-006 | vus_max | 10,000 | `vus_max=10000` ✅ |
| SC-011 (Text) | pdf_analysis_duration{type:text} p(95) | < 30s | `p(95)=25s` ✅ |
| SC-011 (OCR) | pdf_analysis_duration{type:ocr} p(95) | < 60s | `p(95)=55s` ✅ |
| SC-014 | pdf_cache_hit_duration p(95) | < 5s | `p(95)=2s` ✅ |

## 성능 최적화 팁

### 병목 현상 발견 시

1. **데이터베이스가 느린 경우**
   ```sql
   -- Slow query 확인
   SHOW FULL PROCESSLIST;

   -- 인덱스 추가
   CREATE INDEX idx_location ON subscription(location);
   CREATE INDEX idx_user_id ON user_profile(user_id);
   ```

2. **Redis 캐시 히트율이 낮은 경우**
   ```bash
   # Redis stats 확인
   redis-cli INFO stats

   # 캐시 TTL 조정 (application.yml)
   spring.cache.redis.time-to-live=3600000  # 1시간
   ```

3. **JVM 메모리 부족**
   ```bash
   # Heap 크기 증가 (Dockerfile 또는 실행 명령)
   java -Xmx2g -Xms1g -jar app.jar
   ```

4. **Thread Pool 고갈**
   ```yaml
   # application.yml
   spring:
     task:
       execution:
         pool:
           core-size: 50
           max-size: 100
           queue-capacity: 500
   ```

## 지속적 성능 테스트

### GitHub Actions Integration

`.github/workflows/performance-test.yml`:
```yaml
name: Performance Test

on:
  schedule:
    - cron: '0 2 * * 0'  # 매주 일요일 새벽 2시
  workflow_dispatch:      # 수동 실행 가능

jobs:
  load-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Start application
        run: docker-compose up -d

      - name: Wait for app to be ready
        run: |
          sleep 30
          curl --retry 10 --retry-delay 5 http://localhost:8080/api/actuator/health

      - name: Install K6
        run: |
          sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
          echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
          sudo apt-get update
          sudo apt-get install k6

      - name: Run load test
        run: |
          cd load-testing
          k6 run --out json=results.json k6-load-test.js

      - name: Upload results
        uses: actions/upload-artifact@v3
        with:
          name: load-test-results
          path: load-testing/results.json
```

## 참고 자료

- [K6 Documentation](https://k6.io/docs/)
- [K6 Best Practices](https://k6.io/docs/testing-guides/test-types/)
- [Performance Testing Guide](https://www.blazemeter.com/blog/performance-testing)

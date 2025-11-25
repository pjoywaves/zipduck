# ZipDuck MVP Security Audit Checklist

## OWASP Top 10 보안 점검

### 1. Injection (SQL Injection, Command Injection)

#### SQL Injection 방어
- [x] JPA/Hibernate Parameterized Queries 사용
- [x] Native Query 사용 시 Parameter Binding 적용
- [ ] Dynamic Query 검증 필요 시 입력 검증 추가

**점검 포인트:**
```java
// ✅ SAFE: JPA Query
@Query("SELECT s FROM Subscription s WHERE s.location = :location")
List<Subscription> findByLocation(@Param("location") String location);

// ✅ SAFE: Native Query with Parameter
@Query(value = "SELECT * FROM subscription WHERE location = ?1", nativeQuery = true)
List<Subscription> findByLocationNative(String location);

// ❌ UNSAFE: String concatenation
@Query(value = "SELECT * FROM subscription WHERE location = '" + location + "'", nativeQuery = true)
```

**조치사항:**
- [ ] 모든 Repository 메서드 검토
- [ ] Dynamic WHERE 절 사용 시 CriteriaBuilder 사용 확인

#### Command Injection 방어
- [x] PDF 파일명 검증 (화이트리스트 방식)
- [x] 시스템 명령어 직접 실행 없음
- [ ] 파일 업로드 경로 검증 강화 필요

**조치사항:**
```java
// PdfCommandService.java
public String sanitizeFilename(String filename) {
    // 허용된 문자만 남기기
    return filename.replaceAll("[^a-zA-Z0-9._-]", "_");
}
```

### 2. Broken Authentication

#### 인증 강화
- [x] JWT 기반 인증 구현
- [ ] JWT Secret Key 환경 변수화 필요
- [ ] JWT 만료 시간 설정 (15분 access, 7일 refresh)
- [ ] Refresh Token Rotation 구현
- [ ] 비밀번호 정책 강화 (최소 8자, 특수문자 포함)

**SecurityConfig.java 개선사항:**
```java
@Bean
public JwtEncoder jwtEncoder() {
    String secret = environment.getProperty("jwt.secret");
    if (secret == null || secret.length() < 32) {
        throw new IllegalStateException("JWT secret must be at least 32 characters");
    }
    return new NimbusJwtEncoder(new ImmutableSecret<>(secret.getBytes()));
}

@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())  // API 서버이므로 CSRF 비활성화 (고려 필요)
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/v1/auth/**", "/swagger-ui/**", "/api-docs/**").permitAll()
            .anyRequest().authenticated()
        )
        .sessionManagement(session -> session
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        )
        .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));

    return http.build();
}
```

### 3. Sensitive Data Exposure

#### 민감 정보 보호
- [ ] 환경 변수에 API Key 저장 확인
- [ ] .env 파일 .gitignore 등록 확인
- [ ] 로그에 민감 정보 출력 방지
- [ ] HTTPS 강제 (프로덕션)

**조치사항:**
```java
// LoggingFilter.java - 민감 정보 마스킹
public class SensitiveDataMaskingFilter implements Filter {
    private static final Set<String> SENSITIVE_HEADERS = Set.of(
        "authorization", "x-api-key", "cookie"
    );

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) {
        // 민감한 헤더 마스킹 로직
    }
}
```

**application.yml:**
```yaml
logging:
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} - %msg%n"
  level:
    com.zipduck: INFO
    org.springframework.security: WARN  # 보안 로그 최소화
```

### 4. XML External Entities (XXE)

- [x] PDF 파일만 처리하므로 XXE 위험 없음
- [x] XML 파서 사용 안 함
- ✅ **해당 없음**

### 5. Broken Access Control

#### 권한 검증
- [ ] 사용자 ID 기반 리소스 접근 제어 필요
- [ ] PDF 분석 결과 조회 시 소유자 확인
- [ ] 프로필 수정 시 본인 확인

**조치사항:**
```java
// UserController.java
@GetMapping("/{userId}/profile")
public ResponseEntity<UserProfileResponse> getProfile(
    @PathVariable String userId,
    @AuthenticationPrincipal Jwt jwt
) {
    String authenticatedUserId = jwt.getSubject();

    // 본인 또는 관리자만 접근 가능
    if (!userId.equals(authenticatedUserId) && !hasRole(jwt, "ADMIN")) {
        throw new AccessDeniedException("Cannot access other user's profile");
    }

    return ResponseEntity.ok(userQueryService.getProfile(userId));
}

// PdfController.java
@GetMapping("/{pdfId}/analysis")
public ResponseEntity<PdfAnalysisResponse> getAnalysisResult(
    @PathVariable Long pdfId,
    @AuthenticationPrincipal Jwt jwt
) {
    PdfDocument pdf = pdfQueryService.findById(pdfId);

    // 소유자 확인
    if (!pdf.getUserId().equals(jwt.getSubject())) {
        throw new AccessDeniedException("Cannot access other user's PDF");
    }

    return ResponseEntity.ok(pdfQueryService.getAnalysisResult(pdfId));
}
```

### 6. Security Misconfiguration

#### 보안 설정 강화
- [ ] Spring Boot Actuator 엔드포인트 보호
- [ ] CORS 설정 검토
- [ ] 에러 메시지에서 스택 트레이스 제거 (프로덕션)
- [ ] 불필요한 HTTP 헤더 제거

**application.yml (프로덕션):**
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,prometheus  # info, metrics 제거
  endpoint:
    health:
      show-details: when-authorized  # 인증된 사용자만 상세 정보

server:
  error:
    include-stacktrace: never  # 스택 트레이스 비공개
    include-message: always

spring:
  mvc:
    throw-exception-if-no-handler-found: true
```

**CORS 설정:**
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("https://zipduck.com")  // 프로덕션 도메인만
            .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
    }
}
```

### 7. Cross-Site Scripting (XSS)

#### XSS 방어
- [x] React는 기본적으로 XSS 방어
- [ ] `dangerouslySetInnerHTML` 사용 금지 확인
- [ ] 백엔드 Response에 `X-Content-Type-Options: nosniff` 헤더 추가

**SecurityHeadersFilter.java:**
```java
@Component
public class SecurityHeadersFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        response.setHeader("X-Content-Type-Options", "nosniff");
        response.setHeader("X-Frame-Options", "DENY");
        response.setHeader("X-XSS-Protection", "1; mode=block");
        response.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
        filterChain.doFilter(request, response);
    }
}
```

### 8. Insecure Deserialization

- [x] Jackson ObjectMapper 사용 (안전)
- [x] Java 직렬화 사용 안 함
- ✅ **해당 없음**

### 9. Using Components with Known Vulnerabilities

#### 의존성 취약점 점검
- [ ] Gradle dependency-check 플러그인 추가
- [ ] 정기적인 의존성 업데이트

**build.gradle.kts:**
```kotlin
plugins {
    id("org.owasp.dependencycheck") version "8.4.0"
}

dependencyCheck {
    failBuildOnCVSS = 7.0f
    suppressionFile = "dependency-check-suppressions.xml"
}
```

**실행:**
```bash
./gradlew dependencyCheckAnalyze
```

### 10. Insufficient Logging & Monitoring

#### 로깅 강화
- [x] 모니터링 스택 구축 (Prometheus + Grafana)
- [ ] 보안 이벤트 로깅 추가
- [ ] 실패한 로그인 시도 추적

**SecurityAuditLogger.java:**
```java
@Component
@Slf4j
public class SecurityAuditLogger {

    public void logAuthenticationSuccess(String userId) {
        log.info("SECURITY_EVENT: Authentication success - userId={}", userId);
    }

    public void logAuthenticationFailure(String username, String reason) {
        log.warn("SECURITY_EVENT: Authentication failure - username={}, reason={}", username, reason);
    }

    public void logAccessDenied(String userId, String resource) {
        log.warn("SECURITY_EVENT: Access denied - userId={}, resource={}", userId, resource);
    }

    public void logSuspiciousActivity(String userId, String activity) {
        log.error("SECURITY_EVENT: Suspicious activity - userId={}, activity={}", userId, activity);
    }
}
```

## 파일 업로드 보안

### PDF 파일 검증

```java
@Component
public class PdfValidator {

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("pdf", "jpg", "jpeg", "png", "heic");
    private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/heic"
    );

    public void validate(MultipartFile file) {
        // 파일 크기 검증
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new InvalidFileException("File size exceeds 10MB limit");
        }

        // 파일 확장자 검증
        String filename = file.getOriginalFilename();
        String extension = getExtension(filename);
        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new InvalidFileException("Invalid file extension");
        }

        // MIME 타입 검증
        String mimeType = file.getContentType();
        if (!ALLOWED_MIME_TYPES.contains(mimeType)) {
            throw new InvalidFileException("Invalid MIME type");
        }

        // Magic Number 검증 (파일 시그니처)
        try {
            byte[] header = new byte[8];
            file.getInputStream().read(header);

            if (!isValidFileSignature(header, extension)) {
                throw new InvalidFileException("File signature mismatch");
            }
        } catch (IOException e) {
            throw new InvalidFileException("Cannot read file");
        }
    }

    private boolean isValidFileSignature(byte[] header, String extension) {
        // PDF: %PDF
        if (extension.equals("pdf")) {
            return header[0] == 0x25 && header[1] == 0x50 &&
                   header[2] == 0x44 && header[3] == 0x46;
        }

        // JPEG: FF D8 FF
        if (extension.equals("jpg") || extension.equals("jpeg")) {
            return header[0] == (byte) 0xFF &&
                   header[1] == (byte) 0xD8 &&
                   header[2] == (byte) 0xFF;
        }

        // PNG: 89 50 4E 47
        if (extension.equals("png")) {
            return header[0] == (byte) 0x89 &&
                   header[1] == 0x50 &&
                   header[2] == 0x4E &&
                   header[3] == 0x47;
        }

        return true; // HEIC는 복잡하므로 MIME 타입으로만 검증
    }
}
```

## Rate Limiting

### API Rate Limiting 추가

**build.gradle.kts:**
```kotlin
dependencies {
    implementation("com.github.vladimir-bukhtoyarov:bucket4j-core:8.1.0")
    implementation("com.github.vladimir-bukhtoyarov:bucket4j-redis:8.1.0")
}
```

**RateLimitingFilter.java:**
```java
@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String key = getClientIdentifier(request);
        Bucket bucket = resolveBucket(key);

        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
        } else {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.getWriter().write("{\"error\":\"Too many requests\"}");
        }
    }

    private Bucket resolveBucket(String key) {
        return buckets.computeIfAbsent(key, k -> {
            Bandwidth limit = Bandwidth.classic(100, Refill.intervally(100, Duration.ofMinutes(1)));
            return Bucket.builder().addLimit(limit).build();
        });
    }

    private String getClientIdentifier(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return extractUserIdFromToken(authHeader);
        }
        return request.getRemoteAddr(); // Fallback to IP
    }
}
```

## 환경 변수 보안

### .env 파일 암호화

**encrypt-env.sh:**
```bash
#!/bin/bash

# GPG를 사용한 .env 파일 암호화
gpg --symmetric --cipher-algo AES256 .env.prod

# Git에는 암호화된 파일만 커밋
git add .env.prod.gpg
git add .env.example  # 예시만 커밋
```

**decrypt-env.sh:**
```bash
#!/bin/bash

# 배포 시 .env 파일 복호화
gpg --decrypt .env.prod.gpg > .env.prod
```

## 보안 점검 자동화

### GitHub Actions Workflow

**.github/workflows/security-scan.yml:**
```yaml
name: Security Scan

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 0'  # 매주 일요일

jobs:
  dependency-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'
      - name: Run OWASP Dependency Check
        run: ./gradlew dependencyCheckAnalyze
      - name: Upload report
        uses: actions/upload-artifact@v3
        with:
          name: dependency-check-report
          path: build/reports/dependency-check-report.html

  trivy-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'
      - name: Upload Trivy results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'
```

## 체크리스트 요약

### 즉시 조치 필요 (Critical)
- [ ] JWT Secret Key 환경 변수화
- [ ] 파일 업로드 검증 강화 (Magic Number)
- [ ] 권한 검증 로직 추가 (userId 확인)
- [ ] Rate Limiting 구현

### 높은 우선순위 (High)
- [ ] HTTPS 강제 (프로덕션)
- [ ] CORS 설정 제한
- [ ] 보안 헤더 추가
- [ ] Actuator 엔드포인트 보호

### 중간 우선순위 (Medium)
- [ ] 의존성 취약점 정기 점검
- [ ] 보안 이벤트 로깅
- [ ] Refresh Token Rotation

### 낮은 우선순위 (Low)
- [ ] .env 파일 암호화
- [ ] 보안 스캔 자동화

## 참고 자료

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/)
- [CWE Top 25](https://cwe.mitre.org/top25/)

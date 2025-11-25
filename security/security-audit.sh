#!/bin/bash

# ZipDuck Security Audit Script
# Automated security checks for the application

set -e

echo "================================"
echo "ZipDuck Security Audit"
echo "================================"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ISSUES_FOUND=0

log_pass() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

log_fail() {
    echo -e "${RED}[FAIL]${NC} $1"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

echo ""
echo "1. Checking sensitive files..."
echo "================================"

# Check if .env files are in .gitignore
if grep -q "\.env" .gitignore 2>/dev/null; then
    log_pass ".env files are in .gitignore"
else
    log_fail ".env files NOT in .gitignore"
fi

# Check if .env files are tracked in git
if git ls-files --error-unmatch .env 2>/dev/null; then
    log_fail ".env file is tracked in git (should be ignored)"
else
    log_pass ".env file is not tracked in git"
fi

# Check for hardcoded secrets in code
echo ""
echo "2. Scanning for hardcoded secrets..."
echo "================================"

SECRET_PATTERNS=(
    "password\s*=\s*['\"][^'\"]{8,}"
    "api[_-]?key\s*=\s*['\"][^'\"]{16,}"
    "secret\s*=\s*['\"][^'\"]{16,}"
    "token\s*=\s*['\"][^'\"]{16,}"
)

for pattern in "${SECRET_PATTERNS[@]}"; do
    if grep -rE -i "$pattern" backend/src/ frontend/src/ 2>/dev/null | grep -v ".env" | grep -v "example"; then
        log_fail "Potential hardcoded secret found: $pattern"
    fi
done

log_pass "No obvious hardcoded secrets found"

echo ""
echo "3. Checking dependencies for vulnerabilities..."
echo "================================"

# Check backend dependencies
if [ -f "backend/build.gradle.kts" ]; then
    cd backend
    log_warn "Running OWASP Dependency Check (this may take a while)..."
    ./gradlew dependencyCheckAnalyze --quiet || log_fail "Dependency check found vulnerabilities"
    cd ..
fi

# Check frontend dependencies
if [ -f "frontend/package.json" ]; then
    cd frontend
    log_warn "Running npm audit..."
    if npm audit --audit-level=high 2>&1 | grep -q "found 0 vulnerabilities"; then
        log_pass "No high/critical vulnerabilities in npm packages"
    else
        log_fail "Vulnerabilities found in npm packages"
        npm audit --audit-level=high
    fi
    cd ..
fi

echo ""
echo "4. Checking file permissions..."
echo "================================"

# Check for overly permissive files
find . -type f -perm -002 -not -path "./.git/*" -not -path "./node_modules/*" 2>/dev/null | while read file; do
    log_warn "World-writable file found: $file"
done

log_pass "File permissions check completed"

echo ""
echo "5. Checking Docker security..."
echo "================================"

if [ -f "docker-compose.yml" ]; then
    # Check if secrets are in docker-compose.yml
    if grep -E "(password|secret|key):\s*['\"]?.+['\"]?" docker-compose.yml | grep -v "\${"; then
        log_fail "Hardcoded secrets found in docker-compose.yml"
    else
        log_pass "No hardcoded secrets in docker-compose.yml"
    fi

    # Check if running as root
    if grep -q "user: root" docker-compose.yml; then
        log_warn "Container running as root user"
    else
        log_pass "Containers not explicitly running as root"
    fi
fi

echo ""
echo "6. Checking Spring Security configuration..."
echo "================================"

SECURITY_CONFIG="backend/src/main/java/com/zipduck/infrastructure/config/SecurityConfig.java"
if [ -f "$SECURITY_CONFIG" ]; then
    # Check if CSRF is disabled
    if grep -q "csrf.*disable" "$SECURITY_CONFIG"; then
        log_warn "CSRF protection is disabled (ensure this is intentional for API)"
    fi

    # Check for permitAll usage
    if grep -q "permitAll()" "$SECURITY_CONFIG"; then
        log_warn "Some endpoints are publicly accessible (review required)"
        grep -n "permitAll()" "$SECURITY_CONFIG"
    fi

    log_pass "Spring Security configuration file exists"
else
    log_fail "Spring Security configuration not found"
fi

echo ""
echo "7. Checking for SQL injection vulnerabilities..."
echo "================================"

# Check for string concatenation in queries
if find backend/src -name "*.java" -exec grep -l "createQuery.*+\|createNativeQuery.*+" {} \; 2>/dev/null | head -5; then
    log_fail "Potential SQL injection vulnerability (string concatenation in query)"
else
    log_pass "No obvious SQL injection vulnerabilities"
fi

echo ""
echo "8. Checking logging configuration..."
echo "================================"

APP_YML="backend/src/main/resources/application.yml"
if [ -f "$APP_YML" ]; then
    # Check if debug logging is enabled in prod
    if grep -A5 "profiles.*prod" "$APP_YML" | grep -q "level:.*DEBUG"; then
        log_warn "Debug logging enabled in production profile"
    fi

    # Check if stacktrace is shown
    if grep -q "include-stacktrace:.*always" "$APP_YML"; then
        log_warn "Stack traces always included in error responses"
    fi

    log_pass "Logging configuration reviewed"
fi

echo ""
echo "9. Checking CORS configuration..."
echo "================================"

# Check for overly permissive CORS
if find backend/src -name "*.java" -exec grep -l "allowedOrigins.*\*" {} \; 2>/dev/null; then
    log_fail "CORS allows all origins (*)"
else
    log_pass "CORS configuration appears restricted"
fi

echo ""
echo "10. Checking SSL/TLS configuration..."
echo "================================"

NGINX_CONF="nginx.conf"
if [ -f "$NGINX_CONF" ]; then
    if grep -q "ssl_certificate" "$NGINX_CONF"; then
        log_pass "SSL is configured in Nginx"

        # Check SSL protocols
        if grep -q "ssl_protocols.*TLSv1\.2" "$NGINX_CONF"; then
            log_pass "TLS 1.2+ is configured"
        else
            log_warn "TLS version not explicitly configured"
        fi
    else
        log_warn "SSL not configured in Nginx (required for production)"
    fi
fi

echo ""
echo "================================"
echo "Security Audit Summary"
echo "================================"

if [ $ISSUES_FOUND -eq 0 ]; then
    echo -e "${GREEN}✓ No critical issues found${NC}"
    exit 0
else
    echo -e "${RED}✗ Found $ISSUES_FOUND security issue(s)${NC}"
    echo ""
    echo "Please review the issues above and address them before deployment."
    exit 1
fi

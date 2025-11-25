# ZipDuck Deployment Guide

이 디렉토리는 AWS EC2에 ZipDuck MVP를 배포하기 위한 스크립트와 가이드를 포함합니다.

## 배포 스크립트

### 1. `setup-ec2.sh`
EC2 인스턴스 초기 설정 스크립트

**사용법:**
```bash
# EC2 인스턴스에 SSH 접속 후 실행
wget https://raw.githubusercontent.com/your-org/zipduck/main/deploy/setup-ec2.sh
chmod +x setup-ec2.sh
./setup-ec2.sh
sudo reboot
```

**설치 항목:**
- Docker & Docker Compose
- Node.js 20.x
- 필수 도구 (git, vim, htop 등)
- 방화벽 설정 (포트 22, 80, 443)

### 2. `deploy.sh`
애플리케이션 배포 스크립트

**사용법:**
```bash
# 로컬 머신에서 실행
DEPLOY_HOST=your-ec2-ip.amazonaws.com ./deploy.sh
```

**배포 프로세스:**
1. Prerequisites 체크 (SSH 연결, 환경 변수)
2. Frontend 빌드
3. 배포 패키지 준비
4. 서버로 파일 업로드 (rsync)
5. Docker 컨테이너 빌드 및 시작
6. Health check 실행
7. 배포 정보 출력

**필요한 파일:**
- `.env.prod`: 프로덕션 환경 변수
- `docker-compose.yml`: Docker Compose 설정
- `nginx.conf`: Nginx 설정

### 3. `rollback.sh`
이전 버전으로 롤백하는 스크립트

**사용법:**
```bash
DEPLOY_HOST=your-ec2-ip.amazonaws.com ./rollback.sh
```

## 사전 준비사항

### 1. AWS EC2 인스턴스 생성

**권장 스펙:**
- 인스턴스 타입: t3.medium (MVP) → t3.large (프로덕션)
- OS: Ubuntu 22.04 LTS
- 스토리지: 30GB gp3
- Security Group:
  - SSH (22): Your IP only
  - HTTP (80): 0.0.0.0/0
  - HTTPS (443): 0.0.0.0/0

### 2. SSH 키 설정

```bash
# SSH 키 생성 (로컬)
ssh-keygen -t rsa -b 4096 -C "zipduck-deploy"

# EC2에 공개키 복사
ssh-copy-id -i ~/.ssh/id_rsa.pub ubuntu@your-ec2-ip
```

### 3. 환경 변수 설정

`.env.prod` 파일 생성:
```env
# Database
DB_PASSWORD=your_secure_password
MYSQL_ROOT_PASSWORD=your_root_password

# Google APIs
GEMINI_API_KEY=your_gemini_api_key
VISION_API_KEY=your_vision_api_key

# Public Data API
PUBLIC_DATA_API_KEY=your_public_data_api_key

# Application
SPRING_PROFILES_ACTIVE=prod
```

## 배포 프로세스

### 초기 배포

1. **EC2 인스턴스 설정**
```bash
ssh ubuntu@your-ec2-ip
wget https://raw.githubusercontent.com/your-org/zipduck/main/deploy/setup-ec2.sh
chmod +x setup-ec2.sh
./setup-ec2.sh
sudo reboot
```

2. **애플리케이션 배포**
```bash
# 로컬에서 실행
cd /path/to/zipduck
DEPLOY_HOST=your-ec2-ip.amazonaws.com ./deploy/deploy.sh
```

3. **배포 확인**
```bash
# 브라우저에서 확인
http://your-ec2-ip

# API 문서 확인
http://your-ec2-ip/swagger-ui.html

# 로그 확인
ssh ubuntu@your-ec2-ip
cd ~/zipduck
docker-compose logs -f
```

### 업데이트 배포

```bash
# 코드 변경 후
git pull origin main
DEPLOY_HOST=your-ec2-ip.amazonaws.com ./deploy/deploy.sh
```

### 롤백

```bash
DEPLOY_HOST=your-ec2-ip.amazonaws.com ./deploy/rollback.sh
```

## 유용한 명령어

### 서비스 관리

```bash
# 모든 컨테이너 상태 확인
ssh ubuntu@your-ec2-ip 'cd ~/zipduck && docker-compose ps'

# 로그 보기
ssh ubuntu@your-ec2-ip 'cd ~/zipduck && docker-compose logs -f backend'

# 서비스 재시작
ssh ubuntu@your-ec2-ip 'cd ~/zipduck && docker-compose restart backend'

# 서비스 중지
ssh ubuntu@your-ec2-ip 'cd ~/zipduck && docker-compose down'

# 서비스 시작
ssh ubuntu@your-ec2-ip 'cd ~/zipduck && docker-compose up -d'
```

### 데이터베이스 관리

```bash
# MySQL 접속
ssh ubuntu@your-ec2-ip 'cd ~/zipduck && docker-compose exec mysql mysql -u zipduck -p'

# 백업 생성
ssh ubuntu@your-ec2-ip 'cd ~/zipduck && docker-compose exec mysql mysqldump -u zipduck -p zipduck > backup.sql'

# 백업 복원
cat backup.sql | ssh ubuntu@your-ec2-ip 'cd ~/zipduck && docker-compose exec -T mysql mysql -u zipduck -p zipduck'
```

### 디버깅

```bash
# 컨테이너 내부 접속
ssh ubuntu@your-ec2-ip 'cd ~/zipduck && docker-compose exec backend /bin/bash'

# 리소스 사용량 확인
ssh ubuntu@your-ec2-ip 'htop'
ssh ubuntu@your-ec2-ip 'docker stats'

# 디스크 사용량
ssh ubuntu@your-ec2-ip 'df -h'
```

## 모니터링 및 알림

### Health Check Endpoints

- **Backend Health**: `http://your-ec2-ip/api/actuator/health`
- **Database**: `http://your-ec2-ip/api/actuator/health/db`
- **Redis**: `http://your-ec2-ip/api/actuator/health/redis`

### 로그 파일 위치

- Backend: `/home/ubuntu/zipduck/logs/`
- Nginx: Docker logs (`docker-compose logs nginx`)

## 보안 권장사항

1. **SSH 보안**
   - 비밀번호 인증 비활성화
   - SSH 포트 변경 고려
   - Fail2ban 설치

2. **SSL/TLS 설정**
   ```bash
   # Let's Encrypt 인증서 설치
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

3. **방화벽 설정**
   ```bash
   # AWS Security Group에서 IP 제한
   # 22번 포트는 사무실 IP만 허용
   # 80, 443번 포트는 CloudFlare IP만 허용 (선택사항)
   ```

4. **정기 백업**
   - 데이터베이스 일일 백업 cron job 설정
   - S3에 백업 파일 자동 업로드

## 트러블슈팅

### 문제: 배포 후 502 Bad Gateway

**원인**: Backend 컨테이너가 시작되지 않았거나 Health check 실패

**해결:**
```bash
ssh ubuntu@your-ec2-ip
cd ~/zipduck
docker-compose logs backend
docker-compose restart backend
```

### 문제: 데이터베이스 연결 실패

**원인**: MySQL 컨테이너가 준비되지 않음

**해결:**
```bash
docker-compose down
docker-compose up -d mysql
sleep 10
docker-compose up -d backend
```

### 문제: 메모리 부족

**원인**: t3.medium 인스턴스의 메모리 제한

**해결:**
```bash
# 스왑 메모리 추가
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# 또는 인스턴스 타입 업그레이드 (t3.large)
```

## 참고 자료

- [Docker Documentation](https://docs.docker.com/)
- [Spring Boot Production Guide](https://docs.spring.io/spring-boot/docs/current/reference/html/deployment.html)
- [AWS EC2 Best Practices](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-best-practices.html)

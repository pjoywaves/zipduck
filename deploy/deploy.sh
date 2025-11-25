#!/bin/bash

# ZipDuck MVP Deployment Script for AWS EC2
# This script deploys the application using Docker Compose

set -e  # Exit on error

echo "================================"
echo "ZipDuck MVP Deployment Script"
echo "================================"

# Configuration
APP_NAME="zipduck"
DEPLOY_USER=${DEPLOY_USER:-"ubuntu"}
DEPLOY_HOST=${DEPLOY_HOST:-""}
DEPLOY_PATH="/home/${DEPLOY_USER}/${APP_NAME}"
DOCKER_COMPOSE_FILE="docker-compose.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_prerequisites() {
    log_info "Checking prerequisites..."

    if [ -z "$DEPLOY_HOST" ]; then
        log_error "DEPLOY_HOST environment variable is not set"
        echo "Usage: DEPLOY_HOST=your-ec2-ip.amazonaws.com ./deploy.sh"
        exit 1
    fi

    if [ ! -f ".env.prod" ]; then
        log_error ".env.prod file not found"
        exit 1
    fi

    if [ ! -f "$DOCKER_COMPOSE_FILE" ]; then
        log_error "$DOCKER_COMPOSE_FILE not found"
        exit 1
    fi

    # Check SSH connectivity
    log_info "Checking SSH connectivity to ${DEPLOY_HOST}..."
    if ! ssh -o ConnectTimeout=5 -o BatchMode=yes ${DEPLOY_USER}@${DEPLOY_HOST} exit 2>/dev/null; then
        log_error "Cannot connect to ${DEPLOY_HOST} via SSH"
        exit 1
    fi

    log_info "Prerequisites check passed"
}

prepare_deployment_package() {
    log_info "Preparing deployment package..."

    # Create temporary directory for deployment files
    TEMP_DIR=$(mktemp -d)
    trap "rm -rf $TEMP_DIR" EXIT

    # Copy necessary files
    cp docker-compose.yml $TEMP_DIR/
    cp nginx.conf $TEMP_DIR/
    cp .env.prod $TEMP_DIR/.env

    # Copy backend files
    mkdir -p $TEMP_DIR/backend
    cp backend/Dockerfile $TEMP_DIR/backend/
    cp backend/build.gradle.kts $TEMP_DIR/backend/
    cp backend/settings.gradle.kts $TEMP_DIR/backend/
    cp backend/gradlew $TEMP_DIR/backend/
    cp backend/gradlew.bat $TEMP_DIR/backend/
    cp -r backend/gradle $TEMP_DIR/backend/
    cp -r backend/src $TEMP_DIR/backend/

    # Build frontend
    log_info "Building frontend..."
    cd frontend
    npm install
    npm run build
    cd ..

    # Copy frontend build
    mkdir -p $TEMP_DIR/frontend
    cp -r frontend/dist $TEMP_DIR/frontend/build

    log_info "Deployment package prepared at $TEMP_DIR"
    echo $TEMP_DIR
}

deploy_to_server() {
    local temp_dir=$1

    log_info "Deploying to ${DEPLOY_HOST}..."

    # Create deployment directory on server
    ssh ${DEPLOY_USER}@${DEPLOY_HOST} "mkdir -p ${DEPLOY_PATH}"

    # Stop existing containers
    log_info "Stopping existing containers..."
    ssh ${DEPLOY_USER}@${DEPLOY_HOST} "cd ${DEPLOY_PATH} && docker-compose down || true"

    # Rsync deployment files
    log_info "Uploading files to server..."
    rsync -avz --delete \
        --exclude 'node_modules' \
        --exclude '.git' \
        --exclude '.gradle' \
        ${temp_dir}/ ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/

    # Build and start containers
    log_info "Building and starting containers..."
    ssh ${DEPLOY_USER}@${DEPLOY_HOST} "cd ${DEPLOY_PATH} && docker-compose up -d --build"

    # Wait for services to be healthy
    log_info "Waiting for services to be healthy..."
    sleep 10

    # Check service status
    ssh ${DEPLOY_USER}@${DEPLOY_HOST} "cd ${DEPLOY_PATH} && docker-compose ps"

    log_info "Deployment completed successfully!"
}

run_health_check() {
    log_info "Running health check..."

    # Check backend health
    local max_attempts=30
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        log_info "Health check attempt ${attempt}/${max_attempts}..."

        if curl -f -s http://${DEPLOY_HOST}/api/actuator/health > /dev/null 2>&1; then
            log_info "Backend is healthy!"
            return 0
        fi

        sleep 2
        attempt=$((attempt + 1))
    done

    log_warn "Health check timed out. Please check logs manually."
    return 1
}

show_deployment_info() {
    log_info "================================"
    log_info "Deployment Information"
    log_info "================================"
    echo "Application URL: http://${DEPLOY_HOST}"
    echo "API URL: http://${DEPLOY_HOST}/api"
    echo "API Documentation: http://${DEPLOY_HOST}/swagger-ui.html"
    echo ""
    echo "Useful commands:"
    echo "  View logs: ssh ${DEPLOY_USER}@${DEPLOY_HOST} 'cd ${DEPLOY_PATH} && docker-compose logs -f'"
    echo "  Restart: ssh ${DEPLOY_USER}@${DEPLOY_HOST} 'cd ${DEPLOY_PATH} && docker-compose restart'"
    echo "  Stop: ssh ${DEPLOY_USER}@${DEPLOY_HOST} 'cd ${DEPLOY_PATH} && docker-compose down'"
    log_info "================================"
}

# Main deployment flow
main() {
    log_info "Starting deployment process..."

    check_prerequisites

    temp_dir=$(prepare_deployment_package)

    deploy_to_server $temp_dir

    run_health_check || true

    show_deployment_info

    log_info "Deployment finished!"
}

# Run main function
main "$@"
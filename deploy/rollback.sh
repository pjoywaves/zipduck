#!/bin/bash

# ZipDuck Rollback Script
# Rollback to previous deployment version

set -e

echo "================================"
echo "ZipDuck Rollback Script"
echo "================================"

# Configuration
APP_NAME="zipduck"
DEPLOY_USER=${DEPLOY_USER:-"ubuntu"}
DEPLOY_HOST=${DEPLOY_HOST:-""}
DEPLOY_PATH="/home/${DEPLOY_USER}/${APP_NAME}"
BACKUP_PATH="/home/${DEPLOY_USER}/${APP_NAME}_backup"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

if [ -z "$DEPLOY_HOST" ]; then
    log_error "DEPLOY_HOST environment variable is not set"
    echo "Usage: DEPLOY_HOST=your-ec2-ip.amazonaws.com ./rollback.sh"
    exit 1
fi

log_info "Rolling back to previous version..."

# Check if backup exists
ssh ${DEPLOY_USER}@${DEPLOY_HOST} "if [ ! -d ${BACKUP_PATH} ]; then echo 'No backup found'; exit 1; fi"

# Stop current containers
log_info "Stopping current containers..."
ssh ${DEPLOY_USER}@${DEPLOY_HOST} "cd ${DEPLOY_PATH} && docker-compose down"

# Restore backup
log_info "Restoring from backup..."
ssh ${DEPLOY_USER}@${DEPLOY_HOST} "rm -rf ${DEPLOY_PATH} && cp -r ${BACKUP_PATH} ${DEPLOY_PATH}"

# Start containers
log_info "Starting containers..."
ssh ${DEPLOY_USER}@${DEPLOY_HOST} "cd ${DEPLOY_PATH} && docker-compose up -d"

log_info "Rollback completed successfully!"
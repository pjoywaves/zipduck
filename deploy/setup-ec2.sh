#!/bin/bash

# ZipDuck EC2 Initial Setup Script
# Run this script on a fresh EC2 instance to install dependencies

set -e

echo "================================"
echo "ZipDuck EC2 Initial Setup"
echo "================================"

# Update system
echo "[1/7] Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Docker
echo "[2/7] Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo "Docker installed successfully"
else
    echo "Docker is already installed"
fi

# Install Docker Compose
echo "[3/7] Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "Docker Compose installed successfully"
else
    echo "Docker Compose is already installed"
fi

# Install Node.js (for building frontend if needed)
echo "[4/7] Installing Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo "Node.js installed successfully"
else
    echo "Node.js is already installed"
fi

# Install useful tools
echo "[5/7] Installing useful tools..."
sudo apt-get install -y \
    git \
    vim \
    htop \
    curl \
    wget \
    unzip \
    jq

# Configure firewall
echo "[6/7] Configuring firewall..."
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw --force enable

# Create application directory
echo "[7/7] Creating application directory..."
mkdir -p ~/zipduck
sudo mkdir -p /var/log/zipduck

echo "================================"
echo "EC2 Setup Completed!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Reboot the instance to apply group changes: sudo reboot"
echo "2. After reboot, verify Docker: docker --version"
echo "3. Deploy the application: DEPLOY_HOST=<your-ip> ./deploy.sh"
echo ""
echo "Security recommendations:"
echo "- Configure AWS Security Group to allow only necessary ports"
echo "- Set up SSH key-based authentication (disable password auth)"
echo "- Enable CloudWatch logs for monitoring"
echo "- Set up automated backups for the database"
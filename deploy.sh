#!/bin/bash

# BAYSCOM ERP Deployment Script
# This script automates the deployment process

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="BAYSCOM ERP"
REPO_URL="https://github.com/your-username/bayscom-erp-system.git"
DEPLOY_DIR="/opt/bayscom-erp"
BACKUP_DIR="/opt/backups/bayscom-erp"
LOG_FILE="/var/log/bayscom-erp-deploy.log"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check if Git is installed
    if ! command -v git &> /dev/null; then
        log_error "Git is not installed. Please install Git first."
        exit 1
    fi
    
    log_success "All prerequisites met"
}

create_directories() {
    log_info "Creating necessary directories..."
    
    sudo mkdir -p "$DEPLOY_DIR"
    sudo mkdir -p "$BACKUP_DIR"
    sudo mkdir -p "$(dirname "$LOG_FILE")"
    
    # Set permissions
    sudo chown -R $USER:$USER "$DEPLOY_DIR"
    sudo chown -R $USER:$USER "$(dirname "$LOG_FILE")"
    
    log_success "Directories created"
}

backup_existing() {
    if [ -d "$DEPLOY_DIR/.git" ]; then
        log_info "Creating backup of existing deployment..."
        
        BACKUP_NAME="bayscom-erp-backup-$(date +%Y%m%d-%H%M%S)"
        sudo cp -r "$DEPLOY_DIR" "$BACKUP_DIR/$BACKUP_NAME"
        
        log_success "Backup created: $BACKUP_DIR/$BACKUP_NAME"
    fi
}

clone_repository() {
    log_info "Cloning repository..."
    
    if [ -d "$DEPLOY_DIR/.git" ]; then
        cd "$DEPLOY_DIR"
        git fetch --all
        git reset --hard origin/main
        git pull origin main
    else
        git clone "$REPO_URL" "$DEPLOY_DIR"
        cd "$DEPLOY_DIR"
    fi
    
    log_success "Repository cloned/updated"
}

setup_environment() {
    log_info "Setting up environment..."
    
    cd "$DEPLOY_DIR"
    
    # Copy environment file if it doesn't exist
    if [ ! -f .env ]; then
        cp .env.example .env
        log_warning "Environment file created from template. Please update .env with your settings."
    fi
    
    # Generate secret key if needed
    if grep -q "your-very-secure-secret-key" .env; then
        SECRET_KEY=$(python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')
        sed -i "s/your-very-secure-secret-key/$SECRET_KEY/g" .env
        log_info "Generated new Django secret key"
    fi
    
    log_success "Environment configured"
}

build_and_deploy() {
    log_info "Building and deploying $PROJECT_NAME..."
    
    cd "$DEPLOY_DIR"
    
    # Stop existing containers
    docker-compose down || true
    
    # Build new images
    docker-compose build --no-cache
    
    # Start services
    docker-compose up -d
    
    # Wait for services to be ready
    log_info "Waiting for services to start..."
    sleep 30
    
    # Run database migrations
    docker-compose exec -T backend python manage.py migrate
    
    # Collect static files
    docker-compose exec -T backend python manage.py collectstatic --noinput
    
    # Create superuser if needed
    if [ "$CREATE_SUPERUSER" = "true" ]; then
        log_info "Creating Django superuser..."
        docker-compose exec -T backend python manage.py createsuperuser --noinput || true
    fi
    
    log_success "Deployment completed"
}

run_health_checks() {
    log_info "Running health checks..."
    
    # Check if frontend is responding
    if curl -f http://localhost/health > /dev/null 2>&1; then
        log_success "Frontend health check passed"
    else
        log_error "Frontend health check failed"
        return 1
    fi
    
    # Check if backend is responding
    if curl -f http://localhost:8000/admin/ > /dev/null 2>&1; then
        log_success "Backend health check passed"
    else
        log_error "Backend health check failed"
        return 1
    fi
    
    # Check database connection
    if docker-compose exec -T backend python manage.py check --database default > /dev/null 2>&1; then
        log_success "Database health check passed"
    else
        log_error "Database health check failed"
        return 1
    fi
    
    log_success "All health checks passed"
}

cleanup() {
    log_info "Cleaning up old Docker images..."
    
    docker image prune -f
    docker system prune -f
    
    log_success "Cleanup completed"
}

show_deployment_info() {
    log_success "🎉 $PROJECT_NAME deployment completed successfully!"
    echo ""
    echo -e "${BLUE}Access Information:${NC}"
    echo "📊 Main ERP Dashboard: http://localhost/"
    echo "🛢️  Oil & Gas Module: http://localhost/oil-gas/"
    echo "⚙️  Django Admin: http://localhost:8000/admin/"
    echo "📋 API Documentation: http://localhost:8000/api/"
    echo ""
    echo -e "${BLUE}Service Status:${NC}"
    docker-compose ps
    echo ""
    echo -e "${BLUE}Logs:${NC}"
    echo "View logs: docker-compose logs -f"
    echo "Deployment log: $LOG_FILE"
}

main() {
    echo -e "${GREEN}🚀 Starting $PROJECT_NAME Deployment${NC}"
    echo "======================================="
    
    check_prerequisites
    create_directories
    backup_existing
    clone_repository
    setup_environment
    build_and_deploy
    
    if run_health_checks; then
        cleanup
        show_deployment_info
    else
        log_error "Deployment failed health checks. Please check the logs."
        exit 1
    fi
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --create-superuser)
            CREATE_SUPERUSER="true"
            shift
            ;;
        --repo-url)
            REPO_URL="$2"
            shift 2
            ;;
        --deploy-dir)
            DEPLOY_DIR="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  --create-superuser    Create Django superuser after deployment"
            echo "  --repo-url URL        Repository URL (default: $REPO_URL)"
            echo "  --deploy-dir DIR      Deployment directory (default: $DEPLOY_DIR)"
            echo "  -h, --help           Show this help message"
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Run main function
main

# BAYSCOM ERP Deployment Guide

This guide provides comprehensive instructions for deploying the BAYSCOM Energy Limited ERP system in various environments.

## 🚀 Quick Start

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+
- Git
- 4GB RAM minimum, 8GB recommended
- 20GB free disk space

### One-Command Deployment
```bash
# Clone the repository
git clone https://github.com/your-username/bayscom-erp-system.git
cd bayscom-erp-system

# Run the deployment script
./deploy.sh --create-superuser
```

Access the application:
- **Main ERP Dashboard**: http://localhost/
- **Oil & Gas Module**: http://localhost/oil-gas/
- **Django Admin**: http://localhost:8000/admin/

## 🐳 Docker Deployment

### Development Environment
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### Production Environment
```bash
# Set production environment
export NODE_ENV=production
export DJANGO_ENV=production

# Use production compose file
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 🔧 Manual Setup

### Frontend Setup (React)
```bash
cd bayscom-react-frontend

# Install dependencies
npm install

# Build for production
npm run build

# Serve with static server
npx serve -s build -p 3000
```

### Frontend Setup (Next.js)
```bash
cd bayscom-oil-gas

# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
```

### Backend Setup (Django)
```bash
cd bayscom-django-erp

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export DATABASE_URL=postgresql://user:pass@localhost:5432/bayscom_erp
export SECRET_KEY=your-secret-key

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic

# Start development server
python manage.py runserver
```

## 🗄️ Database Setup

### PostgreSQL (Recommended for Production)
```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Create database and user
sudo -u postgres createdb bayscom_erp
sudo -u postgres createuser bayscom_user
sudo -u postgres psql -c "ALTER USER bayscom_user PASSWORD 'your_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE bayscom_erp TO bayscom_user;"

# Run initialization script
sudo -u postgres psql -d bayscom_erp -f docker/init-db.sql
```

### SQLite (Development Only)
```bash
# SQLite database is automatically created
python manage.py migrate
```

## 🌐 Web Server Configuration

### Nginx (Production)
```bash
# Install Nginx
sudo apt-get install nginx

# Copy configuration
sudo cp docker/nginx.conf /etc/nginx/sites-available/bayscom-erp
sudo ln -s /etc/nginx/sites-available/bayscom-erp /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Apache (Alternative)
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /opt/bayscom-erp/bayscom-react-frontend/build
    
    ProxyPass /api/ http://localhost:8000/api/
    ProxyPassReverse /api/ http://localhost:8000/api/
    
    ProxyPass /admin/ http://localhost:8000/admin/
    ProxyPassReverse /admin/ http://localhost:8000/admin/
</VirtualHost>
```

## 🔒 SSL/HTTPS Setup

### Let's Encrypt (Free SSL)
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Custom SSL Certificate
```bash
# Place your certificates in docker/ssl/
mkdir -p docker/ssl
cp your-cert.pem docker/ssl/cert.pem
cp your-key.pem docker/ssl/key.pem

# Update nginx.conf to enable HTTPS
```

## 📊 Monitoring and Logging

### Application Monitoring
```bash
# View application logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Monitor resource usage
docker stats

# Health check endpoints
curl http://localhost/health
curl http://localhost:8000/admin/
```

### Database Monitoring
```bash
# PostgreSQL monitoring
docker-compose exec database psql -U bayscom_user -d bayscom_erp -c "\l"
docker-compose exec database psql -U bayscom_user -d bayscom_erp -c "SELECT * FROM pg_stat_activity;"
```

## 🔄 Backup and Recovery

### Automated Backups
```bash
# Database backup
docker-compose exec database pg_dump -U bayscom_user bayscom_erp > backup_$(date +%Y%m%d).sql

# Media files backup
tar -czf media_backup_$(date +%Y%m%d).tar.gz bayscom-django-erp/media/

# Full system backup
./scripts/backup.sh
```

### Recovery
```bash
# Restore database
docker-compose exec database psql -U bayscom_user bayscom_erp < backup_20240615.sql

# Restore media files
tar -xzf media_backup_20240615.tar.gz -C bayscom-django-erp/
```

## 🔧 Environment Variables

### Required Variables
```bash
# Django
SECRET_KEY=your-very-secure-secret-key
DEBUG=False
ALLOWED_HOSTS=your-domain.com,localhost

# Database
DATABASE_URL=postgresql://user:pass@host:port/dbname

# Nigerian Business Settings
DEFAULT_CURRENCY=NGN
VAT_RATE=7.5
COMPANY_NAME=BAYSCOM Energy Limited
```

### Optional Variables
```bash
# Email (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# External Integrations
PAYSTACK_PUBLIC_KEY=pk_live_your_key
PAYSTACK_SECRET_KEY=sk_live_your_key

# Monitoring
SENTRY_DSN=your_sentry_dsn
```

## 🧪 Testing

### Frontend Testing
```bash
cd bayscom-react-frontend
npm test

cd ../bayscom-oil-gas
npm test
```

### Backend Testing
```bash
cd bayscom-django-erp
python manage.py test

# Coverage report
pip install coverage
coverage run --source='.' manage.py test
coverage report
```

## 🚨 Troubleshooting

### Common Issues

#### Frontend Not Loading
```bash
# Check if build exists
ls -la bayscom-react-frontend/build/

# Rebuild frontend
cd bayscom-react-frontend && npm run build

# Check Nginx logs
docker-compose logs frontend
```

#### Backend API Errors
```bash
# Check Django logs
docker-compose logs backend

# Verify database connection
docker-compose exec backend python manage.py check --database default

# Run migrations
docker-compose exec backend python manage.py migrate
```

#### Database Connection Issues
```bash
# Check database status
docker-compose ps database

# Check database logs
docker-compose logs database

# Test connection
docker-compose exec database psql -U bayscom_user -d bayscom_erp -c "SELECT 1;"
```

### Performance Optimization

#### Database
```sql
-- Analyze database performance
ANALYZE;

-- Check slow queries
SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;
```

#### Frontend
```bash
# Analyze bundle size
cd bayscom-react-frontend
npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

## 📞 Support

### Log Files
- Application: `/var/log/bayscom-erp/app.log`
- Nginx: `/var/log/nginx/access.log`, `/var/log/nginx/error.log`
- Deployment: `/var/log/bayscom-erp-deploy.log`

### Debugging Commands
```bash
# Service status
docker-compose ps

# Container shell access
docker-compose exec backend bash
docker-compose exec frontend sh

# Database shell
docker-compose exec database psql -U bayscom_user bayscom_erp

# View real-time logs
docker-compose logs -f --tail=100
```

### Getting Help
1. Check logs for error messages
2. Verify environment variables
3. Ensure all services are running
4. Check database connectivity
5. Verify file permissions

For technical support, contact the development team with:
- Error messages from logs
- Environment details
- Steps to reproduce the issue
- Expected vs actual behavior

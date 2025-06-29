# Docker configuration for BAYSCOM ERP System

# React Frontend Dockerfile
FROM node:18-alpine AS react-build
WORKDIR /app
COPY bayscom-react-frontend/package*.json ./
RUN npm ci --only=production
COPY bayscom-react-frontend/ ./
RUN npm run build

# Next.js Frontend Dockerfile  
FROM node:18-alpine AS nextjs-build
WORKDIR /app
COPY bayscom-oil-gas/package*.json ./
RUN npm ci --only=production
COPY bayscom-oil-gas/ ./
RUN npm run build

# Django Backend Dockerfile
FROM python:3.9-slim AS django-app
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY bayscom-django-erp/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy Django application
COPY bayscom-django-erp/ ./

# Create static files directory
RUN python manage.py collectstatic --noinput

# Production Nginx + Frontend
FROM nginx:alpine AS frontend-production

# Copy React build
COPY --from=react-build /app/build /usr/share/nginx/html/dashboard

# Copy Next.js build (for static export)
COPY --from=nextjs-build /app/out /usr/share/nginx/html/oil-gas

# Copy custom nginx configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

# Production Django
FROM python:3.9-slim AS backend-production
WORKDIR /app

# Install system dependencies for production
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY bayscom-django-erp/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copy Django application
COPY --from=django-app /app ./

# Create non-root user
RUN useradd --create-home --shell /bin/bash bayscom
RUN chown -R bayscom:bayscom /app
USER bayscom

EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD python manage.py check || exit 1

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "bayscom_erp.wsgi:application"]

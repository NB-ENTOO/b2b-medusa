# Medusa Deployment

This document outlines deployment strategies and configurations for Medusa, focusing on Docker-based deployments similar to what we'll use for the NET-BRIDGE project.

## Deployment Architecture

### Standard Deployment

A standard Medusa deployment consists of three main components:

1. **Medusa Server**: The core backend application
2. **PostgreSQL**: The primary database
3. **Redis**: Used for caching and job processing

For larger deployments, you might also include:

4. **Medusa Admin**: The admin dashboard
5. **Storefront**: The customer-facing frontend (Next.js in our case)
6. **MinIO/S3**: For file storage

### Docker-Based Deployment

Docker allows for containerized deployment with consistent environments:

```
┌─────────────────────────────────────────────────────────┐
│                   Docker Environment                     │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │     Nginx   │  │    Next.js  │  │   Medusa Admin  │  │
│  │  (Reverse   │  │  Storefront │  │    Dashboard    │  │
│  │    Proxy)   │  │             │  │                 │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
│          │               │                  │           │
│          └───────────────┼──────────────────┘           │
│                          │                              │
│  ┌────────────────────────────────────────────────────┐ │
│  │                  Medusa Server                      │ │
│  │                                                    │ │
│  │  ┌────────────┐  ┌────────────┐  ┌─────────────┐  │ │
│  │  │ API Server │  │   Workers  │  │  Services   │  │ │
│  │  └────────────┘  └────────────┘  └─────────────┘  │ │
│  └────────────────────────────────────────────────────┘ │
│                          │                              │
│          ┌───────────────┼──────────────────┐           │
│          │               │                  │           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │ PostgreSQL  │  │    Redis    │  │     MinIO/S3    │  │
│  │  Database   │  │ Cache/Queue │  │   File Storage  │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Docker Configuration

### docker-compose.yml

A comprehensive `docker-compose.yml` file for a Medusa deployment:

```yaml
version: '3'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:14
    container_name: medusa-postgres
    restart: always
    environment:
      POSTGRES_USER: medusa
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: medusa-db
    ports:
      - 5432:5432
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - medusa-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U medusa"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache & Queue
  redis:
    image: redis:7
    container_name: medusa-redis
    restart: always
    command: redis-server --appendonly yes
    ports:
      - 6379:6379
    volumes:
      - redis-data:/data
    networks:
      - medusa-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Medusa Server in API Mode
  medusa-api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: medusa-api
    restart: always
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      NODE_ENV: production
      DATABASE_URL: postgres://medusa:${POSTGRES_PASSWORD}@postgres:5432/medusa-db
      REDIS_URL: redis://redis:6379
      MEDUSA_WORKER_MODE: api
      JWT_SECRET: ${JWT_SECRET}
      COOKIE_SECRET: ${COOKIE_SECRET}
      STORE_CORS: ${STORE_CORS}
      ADMIN_CORS: ${ADMIN_CORS}
      PORT: 9000
    ports:
      - 9000:9000
    networks:
      - medusa-network
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:9000/health"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Medusa Server in Worker Mode
  medusa-worker:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: medusa-worker
    restart: always
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      NODE_ENV: production
      DATABASE_URL: postgres://medusa:${POSTGRES_PASSWORD}@postgres:5432/medusa-db
      REDIS_URL: redis://redis:6379
      MEDUSA_WORKER_MODE: worker
      JWT_SECRET: ${JWT_SECRET}
      COOKIE_SECRET: ${COOKIE_SECRET}
      DISABLE_MEDUSA_ADMIN: true
      PORT: 9001
    networks:
      - medusa-network

  # Next.js Storefront
  storefront:
    build:
      context: ./storefront
      dockerfile: Dockerfile
    container_name: medusa-storefront
    restart: always
    environment:
      NEXT_PUBLIC_MEDUSA_BACKEND_URL: http://medusa-api:9000
      NEXT_PUBLIC_ENV: production
    ports:
      - 3000:3000
    depends_on:
      medusa-api:
        condition: service_healthy
    networks:
      - medusa-network

  # Nginx Reverse Proxy
  nginx:
    image: nginx:latest
    container_name: medusa-nginx
    restart: always
    ports:
      - 80:80
      - 443:443
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - medusa-api
      - storefront
    networks:
      - medusa-network

volumes:
  postgres-data:
  redis-data:

networks:
  medusa-network:
    driver: bridge
```

### Backend Dockerfile

A Dockerfile for the Medusa backend:

```dockerfile
FROM node:18.17.1-alpine

WORKDIR /app

# Install necessary tools
RUN apk add --no-cache python3 make g++ git

# Copy package files
COPY package.json .
COPY yarn.lock .

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy application code
COPY . .

# Build the application
RUN yarn build

# Expose the port
EXPOSE 9000

# Set the command to run
CMD ["yarn", "start"]
```

### Storefront Dockerfile

A Dockerfile for the Next.js storefront:

```dockerfile
FROM node:18.17.1-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json .
COPY yarn.lock .

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy application code
COPY . .

# Build the application
RUN yarn build

# Production image
FROM node:18.17.1-alpine

WORKDIR /app

# Copy from builder
COPY --from=builder /app/package.json .
COPY --from=builder /app/yarn.lock .
COPY --from=builder /app/next.config.js .
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# Expose the port
EXPOSE 3000

# Set the command to run
CMD ["yarn", "start"]
```

### Nginx Configuration

A sample Nginx configuration for reverse proxying:

```nginx
# nginx/nginx.conf
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    
    sendfile on;
    keepalive_timeout 65;
    
    include /etc/nginx/conf.d/*.conf;
}
```

```nginx
# nginx/conf.d/default.conf
server {
    listen 80;
    server_name netbridge.example.com;
    
    # Redirect to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name netbridge.example.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    # Storefront
    location / {
        proxy_pass http://storefront:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Medusa API
    location /api/ {
        proxy_pass http://medusa-api:9000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Admin dashboard (if needed)
    location /admin/ {
        proxy_pass http://medusa-admin:7000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Environment Variables

### .env File

A comprehensive `.env` file for Medusa deployment:

```bash
# Database
POSTGRES_PASSWORD=secure_password
DATABASE_URL=postgres://medusa:secure_password@postgres:5432/medusa-db

# Redis
REDIS_URL=redis://redis:6379

# JWT and Cookies
JWT_SECRET=something_secure_for_jwt
COOKIE_SECRET=something_secure_for_cookies

# CORS
STORE_CORS=https://netbridge.example.com
ADMIN_CORS=https://admin.netbridge.example.com

# File Storage (if using S3)
S3_URL=https://your-bucket.s3.amazonaws.com
S3_BUCKET=your-bucket
S3_REGION=your-region
S3_ACCESS_KEY_ID=your_access_key
S3_SECRET_ACCESS_KEY=your_secret_key

# Email (if using SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM=no-reply@netbridge.example.com

# Deployment Mode
NODE_ENV=production
```

## Deployment Modes

### Combined Mode (Default)

In the default combined mode, the API and workers run in the same process:

```bash
# Environment variables for combined mode
MEDUSA_WORKER_MODE=combined  # Or leave unset
```

### Split Mode (API + Worker)

For better performance and scalability, split the API and worker processes:

#### API Server

```bash
# Environment variables for API server
MEDUSA_WORKER_MODE=api
PORT=9000
```

#### Worker Server

```bash
# Environment variables for worker server
MEDUSA_WORKER_MODE=worker
DISABLE_MEDUSA_ADMIN=true
PORT=9001  # Different port than API
```

## Health Checks

Implement health checks for monitoring container health:

### API Health Check

Medusa provides a `/health` endpoint for checking the API status:

```bash
# Docker health check command
wget --no-verbose --tries=1 --spider http://localhost:9000/health
```

### Database Health Check

For PostgreSQL:

```bash
# Docker health check command
pg_isready -U medusa
```

### Redis Health Check

```bash
# Docker health check command
redis-cli ping
```

## Database Backups

Implement regular database backups:

```bash
#!/bin/bash
# backup-postgres.sh

# Set variables
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/backups"
CONTAINER_NAME="medusa-postgres"

# Create backup
docker exec $CONTAINER_NAME pg_dump -U medusa -d medusa-db -F c > $BACKUP_DIR/medusa_backup_$TIMESTAMP.dump

# Cleanup old backups (keep last 7 days)
find $BACKUP_DIR -name "medusa_backup_*.dump" -type f -mtime +7 -delete
```

## Scaling Considerations

For handling increased load:

1. **Horizontal Scaling**: Add more API containers with load balancing
2. **Worker Scaling**: Add more worker containers for background processing
3. **Database Scaling**: 
   - Read replicas for query-heavy workloads
   - Connection pooling with PgBouncer
4. **Caching Layer**: Optimize Redis caching for frequently accessed data

## Production Checklist

Before deploying to production:

1. **Security**:
   - Generate secure secrets for JWT and cookies
   - Set up SSL/TLS with proper certificates
   - Configure proper CORS settings
   - Implement rate limiting for API endpoints

2. **Performance**:
   - Enable database query caching
   - Optimize Redis configuration
   - Configure proper connection pools

3. **Monitoring**:
   - Set up logging (e.g., with ELK stack)
   - Implement application monitoring
   - Configure alerts for critical issues

4. **Backup & Recovery**:
   - Schedule regular database backups
   - Test restoration procedures
   - Document recovery processes

5. **CI/CD**:
   - Automate build and deployment processes
   - Implement blue/green or rolling deployments
   - Set up automated testing

This deployment guide provides a comprehensive foundation for deploying the NET-BRIDGE project in a Docker environment, ensuring scalability, security, and reliability. 
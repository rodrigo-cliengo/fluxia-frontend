# Fluxia Frontend

AI Content Automation Platform built with React, TypeScript, and Tailwind CSS.

## Architecture

- **Frontend**: React + TypeScript + Tailwind CSS
- **Reverse Proxy**: Traefik
- **Container Runtime**: Docker + Docker Compose

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Port 80, 443, and 8080 available

### Development

1. **Start the application**:
   ```bash
   ./docker-scripts.sh start
   ```

2. **Access the application**:
   - App: http://fluxia-front.devcliengo.com
   - HTTPS: https://fluxia-front.devcliengo.com

3. **View logs**:
   ```bash
   ./docker-scripts.sh logs app     # Application logs
   ./docker-scripts.sh logs traefik # Traefik logs  
   ./docker-scripts.sh logs all     # All logs
   ```

### Production Setup

1. **Update domain configuration**:
   - Domain already configured for `fluxia-front.devcliengo.com`
   - Email configured for Let's Encrypt: `integrations@cliengo.com`
   - GCP VM IP: `34.10.224.39`

2. **Production Features Enabled**:
   - ✅ HTTPS with automatic Let's Encrypt certificates
   - ✅ HTTP to HTTPS redirects
   - ✅ Security headers (HSTS, XSS protection, etc.)
   - ✅ Secured Traefik dashboard (disabled in production)
   - ✅ JSON access logs for monitoring

3. **GCP Deployment Ready**:
   - No exposed development ports
   - Production logging configuration
   - Optimized for container environments
   - Security hardened

## Docker Commands

```bash
./docker-scripts.sh build      # Build the Docker image
./docker-scripts.sh start      # Start all services
./docker-scripts.sh stop       # Stop all services
./docker-scripts.sh restart    # Restart all services
./docker-scripts.sh logs       # View application logs
./docker-scripts.sh clean      # Clean up Docker resources
./docker-scripts.sh status     # Show container status
./docker-scripts.sh ssl-check  # Check SSL certificate
```

## Configuration

### Traefik
- Configuration: `traefik.yml`
- Dashboard: http://localhost:8080 (development only)
- Automatic service discovery via Docker labels
- Let's Encrypt integration ready
- Dashboard: Disabled in production for security
- Automatic service discovery via Docker labels  
- Let's Encrypt integration enabled
- Security headers middleware configured

### Application
- Served via nginx inside container
- Static files optimized with gzip compression
- Health check endpoint: `/health`
- Production environment variables set
- Security headers handled by Traefik
- Optimized Docker image with security updates

## Features

- **Brify**: Generate creative briefs and benefits from features
- **Adaptia**: Adapt content for multiple social media platforms  
- **Visuo**: Generate optimized visual prompts for AI image generation

## API Integration

The application integrates with Fluxia's webhook API endpoints:
- `/webhook/fluxia/brify` - Brief generation
- `/webhook/fluxia/adaptia` - Content adaptation
- `/webhook/fluxia/visuo` - Visual prompt generation

## GCP Deployment

The application is configured for production deployment on Google Cloud Platform (VM IP: 34.10.224.39):

1. **Build and push to GCP**:
   ```bash
   # Build for production
   ./docker-scripts.sh build
   
   # Tag for GCP Container Registry
   docker tag fluxia-frontend gcr.io/YOUR_PROJECT_ID/fluxia-frontend:latest
   
   # Push to registry
   docker push gcr.io/YOUR_PROJECT_ID/fluxia-frontend:latest
   ```

2. **Deploy to GCP**:
   - Use Cloud Run, Compute Engine, or GKE
   - Ensure ports 80 and 443 are accessible
   - Domain `fluxia-front.devcliengo.com` should point to your GCP instance

3. **SSL Certificate**:
   - Let's Encrypt will automatically generate SSL certificates
   - First request may take a few minutes for certificate provisioning

4. **DNS Configuration**:
   - Point `fluxia-front.devcliengo.com` to GCP VM IP: `34.10.224.39`
   - Ensure ports 80 and 443 are open in GCP firewall
   - SSL certificates will be automatically provisioned via Let's Encrypt
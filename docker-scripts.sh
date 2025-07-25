#!/bin/bash

# Docker management scripts for Fluxia

case "$1" in
    "build")
        echo "🔨 Building Fluxia Docker image..."
        docker-compose build --no-cache
        ;;
    "start")
        echo "🚀 Starting Fluxia application..."
        # Try with Traefik first, fallback to simple if issues
        if ! docker-compose up -d 2>/dev/null; then
            echo "⚠️  Issue with Traefik setup, trying simple configuration..."
            docker-compose -f docker-compose-simple.yml up -d
            echo "📱 App: http://$(hostname -I | awk '{print $1}')"
        fi
        echo "✅ Application started!"
        echo "📱 App: http://fluxia-front.devcliengo.com"
        echo "🔒 HTTPS: https://fluxia-front.devcliengo.com"
        ;;
    "stop")
        echo "🛑 Stopping Fluxia application..."
        docker-compose down
        docker-compose -f docker-compose-simple.yml down 2>/dev/null || true
        ;;
    "restart")
        echo "🔄 Restarting Fluxia application..."
        docker-compose down
        docker-compose -f docker-compose-simple.yml down 2>/dev/null || true
        docker-compose up -d
        echo "✅ Application restarted!"
        echo "📱 App: http://fluxia-front.devcliengo.com"
        echo "🔒 HTTPS: https://fluxia-front.devcliengo.com"
        ;;
    "logs")
        echo "📋 Showing logs for: $2"
        case "$2" in
            "app"|"")
                docker-compose logs -f fluxia-frontend
                ;;
            "traefik")
                docker-compose logs -f traefik
                ;;
            "all")
                docker-compose logs -f
                ;;
            *)
                echo "Available log targets: app, traefik, all"
                ;;
        esac
        ;;
    "clean")
        echo "🧹 Cleaning up Docker resources..."
        docker-compose down -v
        docker-compose -f docker-compose-simple.yml down -v 2>/dev/null || true
        docker system prune -f
        docker volume prune -f
        ;;
    "simple")
        echo "🚀 Starting with simple configuration (no Traefik)..."
        docker-compose -f docker-compose-simple.yml up -d
        echo "✅ Application started in simple mode!"
        echo "📱 App: http://$(hostname -I | awk '{print $1}')"
        ;;
    "status")
        echo "📊 Application status:"
        docker-compose ps
        docker-compose -f docker-compose-simple.yml ps
        ;;
    "ssl-check")
        echo "🔒 Checking SSL certificate..."
        echo "Certificate details for fluxia-front.devcliengo.com:"
        echo | openssl s_client -servername fluxia-front.devcliengo.com -connect fluxia-front.devcliengo.com:443 2>/dev/null | openssl x509 -noout -dates -subject -issuer
        ;;
    *)
        echo "🐳 Fluxia Docker Management"
        echo "Usage: $0 {build|start|stop|restart|logs|clean|status|ssl-check}"
        echo ""
        echo "Commands:"
        echo "  build   - Build the Docker image"
        echo "  start   - Start the application"
        echo "  stop    - Stop the application"
        echo "  restart - Restart the application"
        echo "  logs    - Show logs (app|traefik|all)"
        echo "  clean   - Clean up Docker resources"
        echo "  status  - Show container status"
        echo "  ssl-check - Check SSL certificate status"
        ;;
esac
#!/bin/bash

# Docker management scripts for Fluxia

case "$1" in
    "build")
        echo "🔨 Building Fluxia Docker image..."
        docker-compose build --no-cache
        ;;
    "start")
        echo "🚀 Starting Fluxia application..."
        docker-compose up -d
        echo "✅ Application started! Visit http://localhost:3000"
        ;;
    "stop")
        echo "🛑 Stopping Fluxia application..."
        docker-compose down
        ;;
    "restart")
        echo "🔄 Restarting Fluxia application..."
        docker-compose down
        docker-compose up -d
        echo "✅ Application restarted! Visit http://localhost:3000"
        ;;
    "logs")
        echo "📋 Showing application logs..."
        docker-compose logs -f fluxia-frontend
        ;;
    "clean")
        echo "🧹 Cleaning up Docker resources..."
        docker-compose down -v
        docker system prune -f
        ;;
    "status")
        echo "📊 Application status:"
        docker-compose ps
        ;;
    *)
        echo "🐳 Fluxia Docker Management"
        echo "Usage: $0 {build|start|stop|restart|logs|clean|status}"
        echo ""
        echo "Commands:"
        echo "  build   - Build the Docker image"
        echo "  start   - Start the application"
        echo "  stop    - Stop the application"
        echo "  restart - Restart the application"
        echo "  logs    - Show application logs"
        echo "  clean   - Clean up Docker resources"
        echo "  status  - Show container status"
        ;;
esac
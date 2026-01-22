#!/bin/bash
set -e

echo "=== WolfEye Plus Production Startup ==="

echo "[Step 1/3] Building Docker images & Fetching AI Models..."
# This will execute the backend Dockerfile which runs the model preload script
docker compose -f docker-compose.prod.yml build

echo "[Step 2/3] Starting Services..."
docker compose -f docker-compose.prod.yml up -d

echo "[Step 3/3] Verifying Deployment..."
echo "Waiting for services to initialize (15s)..."
sleep 15

echo "Checking API Health..."
if command -v curl &> /dev/null; then
    RESPONSE=$(curl -s http://localhost:8090/api/health)
    echo "Response: $RESPONSE"
    
    if [[ $RESPONSE == *"\"status\":\"ok\""* ]]; then
        echo "✅ System is HEALTHY and Ready!"
        echo "Frontend: http://localhost:8090"
        echo "API:      http://localhost:8090/api"
    else
        echo "⚠️  System might be having issues. Check logs."
        echo "Command: docker compose -f docker-compose.prod.yml logs app"
    fi
else
    echo "curl not found. Please verify manually at http://localhost:8090/api/health"
fi

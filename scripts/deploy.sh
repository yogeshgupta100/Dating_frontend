#!/bin/bash

# Deployment script for Dating App Frontend
# This script can be run manually or used as reference

echo "🚀 Starting deployment..."

# SSH into VPS and run deployment commands
ssh root@31.97.63.240 << 'EOF'
    echo "📁 Changing to project directory..."
    cd Dating_frontend/
    
    echo "📥 Pulling latest changes..."
    git pull origin main
    
    echo "📦 Installing dependencies..."
    npm ci
    
    echo "🔨 Building application..."
    npm run build
    
    echo "🔄 Restarting services..."
    sudo systemctl restart nginx
    pm2 restart next-frontend
    
    echo "✅ Deployment completed successfully!"
EOF

echo "🎉 Deployment finished!" 
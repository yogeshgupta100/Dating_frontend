#!/bin/bash

# Diagnostic script to check Node.js and PM2 paths on VPS
echo "🔍 Checking Node.js and PM2 installation..."

echo "📋 Current PATH:"
echo $PATH

echo "📋 Node.js version:"
which node
node --version

echo "📋 NPM location:"
which npm
npm --version

echo "📋 PM2 location:"
which pm2
pm2 --version

echo "📋 NVM (if installed):"
which nvm
nvm --version 2>/dev/null || echo "NVM not found"

echo "📋 Common npm locations:"
ls -la /usr/bin/npm 2>/dev/null || echo "/usr/bin/npm not found"
ls -la /usr/local/bin/npm 2>/dev/null || echo "/usr/local/bin/npm not found"
ls -la ~/.nvm/versions/node/*/bin/npm 2>/dev/null || echo "NVM npm not found"

echo "📋 Common pm2 locations:"
ls -la /usr/bin/pm2 2>/dev/null || echo "/usr/bin/pm2 not found"
ls -la /usr/local/bin/pm2 2>/dev/null || echo "/usr/local/bin/pm2 not found"
ls -la ~/.nvm/versions/node/*/bin/pm2 2>/dev/null || echo "NVM pm2 not found" 
#!/bin/bash
# Railway start script for Node.js application

echo "Starting Portfolio Backend API..."
echo "Node.js version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Environment: ${NODE_ENV:-development}"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install --production
fi

# Start the application
echo "Starting server on port ${PORT:-5000}..."
exec node index.js

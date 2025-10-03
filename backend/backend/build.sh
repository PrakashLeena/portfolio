#!/bin/bash
# Railway build script for Node.js application

echo "Building Portfolio Backend API..."
echo "Node.js version: $(node --version)"
echo "NPM version: $(npm --version)"

# Install dependencies
echo "Installing production dependencies..."
npm ci --production

echo "Build completed successfully!"

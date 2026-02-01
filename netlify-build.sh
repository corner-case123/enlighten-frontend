#!/bin/bash

# Disable ESLint
export DISABLE_ESLINT_PLUGIN=true
export ESLINT_NO_DEV_ERRORS=true
export NODE_ENV=production

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the Next.js app
echo "Building Next.js app..."
npm run build

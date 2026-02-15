#!/bin/bash
set -e

echo "🚀 Building all packages..."
npm run build

echo "📦 Publishing @x402-kit/middleware..."
cd packages/middleware
npm publish --access public
cd ../..

echo "📦 Publishing @x402-kit/agent-client..."
cd packages/agent-client
npm publish --access public
cd ../..

echo "📦 Publishing @x402-kit/cli..."
cd cli
if [ -f "package.json" ]; then
  npm publish --access public
else
  echo "❌ Error: Could not find cli directory."
  exit 1
fi
cd ..

echo "✅ All packages published successfully!"
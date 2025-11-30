#!/bin/bash

# J'ko AI Landing Page - Cloudflare Pages Deployment Script

echo "🚀 Building J'ko AI Landing Page..."
pnpm build

echo "📦 Deploying to Cloudflare Pages..."
# For manual deployment to Cloudflare Pages:
# 1. Go to https://pages.cloudflare.com
# 2. Create a new project or update existing
# 3. Upload the .svelte-kit/output/client directory

# For automated deployment:
# wrangler pages deploy .svelte-kit/output/client --project-name=jko-ai

echo "✅ Build complete! Ready for deployment."
echo "📁 Static files location: .svelte-kit/output/client"
echo "📄 Prerendered pages: .svelte-kit/output/prerendered/pages"
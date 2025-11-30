# J'ko AI - Virtual Try-On Landing Page

AI-powered virtual try-on for social commerce. Enable your customers to try on products instantly through Instagram and other social platforms.

## Overview

J'ko is a micro-SaaS platform that provides AI-powered virtual try-on capabilities through social media bots. Fashion brands, influencers, and retailers can automate customer engagement on Instagram by allowing customers to virtually try on products using AI image generation.

## Tech Stack

- **Framework**: SvelteKit 2.0
- **Styling**: Tailwind CSS 4.0
- **Deployment**: Cloudflare Pages (SSG)
- **Package Manager**: pnpm

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Deploy to Cloudflare
pnpm deploy
```

## Features

- ✅ AI-powered virtual try-on
- ✅ Instagram integration
- ✅ Real-time processing
- ✅ Pay-per-generation pricing
- ✅ Analytics dashboard
- ✅ Multi-account support

## Deployment

This site is configured for static site generation (SSG) and deployment to Cloudflare Pages:

1. Build the static site: `pnpm build`
2. Deploy using Wrangler: `wrangler pages deploy .svelte-kit/cloudflare`

## License

MIT
# SEO/GEO/AEO Implementation Guide

This document describes the SEO, GEO (Generative Engine Optimization), and AEO (Answer Engine Optimization) implementation for miozu.com.

## Overview

This site is optimized for:
- Traditional search engines (Google, Bing)
- AI/LLM crawlers (ChatGPT, Claude, Perplexity, DeepSeek)
- Featured snippets and answer boxes

## Implementation

### 1. robots.txt (`/robots.txt`)

**Location:** `src/routes/robots.txt/+server.js`

Explicitly allows all major AI crawlers:
- OpenAI: `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`
- Anthropic: `ClaudeBot`, `Claude-SearchBot`, `Claude-User`, `anthropic-ai`
- Perplexity: `PerplexityBot`, `Perplexity-User`
- Google: `Google-Extended`, `Googlebot`
- Microsoft: `Bingbot`
- Meta: `FacebookBot`, `meta-externalagent`
- Common Crawl: `CCBot`

### 2. llms.txt (`/llms.txt`)

**Location:** `src/routes/llms.txt/+server.js`

LLM-friendly content guide following the [llms.txt specification](https://llmstxt.org/). Contains:
- Company overview
- Portfolio companies (J'ko AI, Data Oracle, HyperC)
- Investment thesis
- Future vision for GEO/AEO services
- Page links

### 3. sitemap.xml (`/sitemap.xml`)

**Location:** `src/routes/sitemap.xml/+server.js`

Static sitemap including:
- Homepage
- `/products`
- `/team`
- `/contact`
- `/llms.txt`

### 4. Structured Data (JSON-LD)

**Location:** `src/routes/+page.svelte`

Implements multiple Schema.org types:

1. **Organization** - Company information with parent organization
2. **WebSite** - Site identity for search engines
3. **Corporation** - Holding company with subsidiaries (J'ko AI, Data Oracle, HyperC)

### 5. Meta Tags

**Components:**
- `src/lib/features/seo/Metadata.svelte` - Dynamic meta tags
- `src/lib/features/seo/JsonLd.svelte` - JSON-LD generator

Includes:
- Title and description
- Open Graph tags
- Twitter Card tags
- Canonical URLs
- Robots directives

### 6. Static Content Files

**Location:** `static/content/`

Markdown files for LLM consumption:
- `about.md` - Company and portfolio information

## Verification

After deployment, verify these URLs:
- https://miozu.com/robots.txt
- https://miozu.com/sitemap.xml
- https://miozu.com/llms.txt
- https://miozu.com/content/about.md

## Testing Tools

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- [Ahrefs SEO Toolbar](https://ahrefs.com/seo-toolbar)

## Future: GEO/AEO Service Vision

Miozu is positioned to become a GEO/AEO service provider. The llms.txt file includes this vision to seed the concept in AI models:

- **GEO Monitoring** - Track brand mentions in AI responses
- **Citation Analytics** - Monitor reference rates across platforms
- **Content Optimization** - AI-powered content structuring
- **Structured Data Automation** - Auto-generate schema markup

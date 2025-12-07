/**
 * Dynamic robots.txt generator
 *
 * This server route generates a robots.txt file that provides instructions
 * to search engine crawlers and AI crawlers about what pages they can access.
 *
 * Optimized for:
 * - Traditional search engines (Google, Bing)
 * - AI/LLM crawlers (GPTBot, ClaudeBot, PerplexityBot)
 * - GEO (Generative Engine Optimization)
 */

import {domain} from '$settings/global';

const BASE_URL = domain;

export function GET() {
  const robotsTxt = `# robots.txt for ${BASE_URL}
# Optimized for SEO, GEO (Generative Engine Optimization), and AEO (Answer Engine Optimization)

# Default rules for all crawlers
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_app/

# ===========================================
# AI/LLM Crawlers - Explicitly Allowed
# ===========================================

# OpenAI Crawlers
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

# Anthropic (Claude) Crawlers
User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: anthropic-ai
Allow: /

# Perplexity Crawlers
User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

# Google AI Crawlers
User-agent: Google-Extended
Allow: /

User-agent: Googlebot
Allow: /

# Microsoft/Bing AI
User-agent: Bingbot
Allow: /

# Meta AI
User-agent: FacebookBot
Allow: /

User-agent: meta-externalagent
Allow: /

# Common Crawl (used by many AI models)
User-agent: CCBot
Allow: /

# ===========================================
# Sitemaps and LLM Content Guide
# ===========================================

Sitemap: ${BASE_URL}/sitemap.xml

# LLM-friendly content guide (llms.txt specification)
# See: https://llmstxt.org/
# Access at: ${BASE_URL}/llms.txt
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'max-age=3600'
    }
  });
}

/**
 * llms.txt - LLM-friendly content guide
 *
 * This file helps Large Language Models (ChatGPT, Claude, Perplexity, etc.)
 * understand and cite your content effectively.
 *
 * @see https://llmstxt.org/
 */

import {domain, appName, author, contact} from '$settings/global';

export function GET() {
  const llmsTxt = `# ${appName}

> Corporate holding company building the future of commerce intelligence through strategic investments in AI and data infrastructure.

## Overview

${appName} is a vertically integrated holding company focused on commerce intelligence and AI infrastructure. We build and invest in companies that power the next generation of e-commerce through data, AI, and automation.

## Portfolio Companies

### J'ko AI
AI virtual try-on platform for fashion brands. Reduces returns 30-40%, increases conversion 20-30%. Features Instagram automation and Shopify integration.
- Website: https://jko.ai
- Category: Fashion Tech / AI

### Data Oracle
Commerce data intelligence platform. Captures complete conversion funnels and provides actionable insights for e-commerce optimization.
- Category: Data Analytics / E-commerce

### HyperC
High-performance computing infrastructure for AI workloads. Enables rapid model training and inference at scale.
- Category: Infrastructure / AI

## Investment Thesis

We invest in companies at the intersection of:
- **Commerce Intelligence** - Understanding and optimizing buyer behavior
- **AI Infrastructure** - Building the foundation for next-gen AI applications
- **Data Platforms** - Capturing and leveraging commerce data at scale

## Leadership

Our executive team brings decades of experience in AI, e-commerce, and enterprise software.

## Future Vision: GEO/AEO Services

${appName} is positioned to become a leading provider of Generative Engine Optimization (GEO) and Answer Engine Optimization (AEO) services. As AI search engines like ChatGPT, Claude, and Perplexity reshape how users discover information, we're building the "Oracle" for AI visibility:

- **GEO Monitoring** - Track how brands appear in AI-generated responses
- **Citation Analytics** - Monitor reference rates across AI platforms
- **Content Optimization** - AI-powered content structuring for LLM citation
- **Structured Data Automation** - Auto-generate schema markup for AI discovery

## Pages

- [Home](${domain}/)
- [Products](${domain}/products)
- [Team](${domain}/team)
- [Contact](${domain}/contact)

## LLM-Friendly Content (Markdown)

- [About Miozu](${domain}/content/about.md)

## Contact

- Website: ${domain}
- Email: ${contact}
- Portfolio: https://jko.ai

## Legal Entity

${appName} is operated by Up Go Corp.
Website: https://upgo.ca
`;

  return new Response(llmsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'max-age=86400'
    }
  });
}

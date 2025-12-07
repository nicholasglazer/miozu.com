/**
 * Dynamic sitemap generator
 *
 * This server route generates a sitemap.xml file that helps search engines
 * and AI crawlers discover and index all pages on your site.
 *
 * Includes all static pages and LLM-specific content.
 */
import {domain} from '$settings/global';

const BASE_URL = domain;

export async function GET() {
  const today = new Date().toISOString().split('T')[0];

  // All static routes - COMPLETE coverage for Oraklex
  const staticRoutes = [
    {
      url: '',
      changefreq: 'weekly',
      priority: 1.0,
      lastmod: today
    },
    {
      url: 'products',
      changefreq: 'weekly',
      priority: 0.9,
      lastmod: today
    },
    {
      url: 'team',
      changefreq: 'monthly',
      priority: 0.8,
      lastmod: today
    },
    {
      url: 'contact',
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: today
    },
    // LLM-specific content
    {
      url: 'llms.txt',
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: today
    }
  ];

  // Generate XML with enhanced schema
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${staticRoutes
  .map(
    route => `  <url>
    <loc>${BASE_URL}/${route.url}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'max-age=3600'
    }
  });
}

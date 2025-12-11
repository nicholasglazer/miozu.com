/**
 * Central routes configuration for Oraklex
 * This file defines all navigation items for consistent use across the application
 */

// Solutions for the mega menu and mobile menu
export const solutions = [
  {
    category: 'AI Visibility',
    items: [
      {
        path: '/solutions#geo',
        label: 'GEO Intelligence',
        tagline: 'Generative Engine Optimization',
        description: 'Get your brand featured in AI-generated responses',
        status: 'live'
      },
      {
        path: '/solutions#aeo',
        label: 'AEO Solutions',
        tagline: 'Answer Engine Optimization',
        description: 'Optimize content for answer engines',
        status: 'live'
      }
    ]
  },
  {
    category: 'Data Services',
    items: [
      {
        path: '/solutions#data-oracle',
        label: 'LLM Data Oracle',
        tagline: 'Training Data for AI',
        description: 'Curated commerce data for LLM training',
        status: 'coming'
      },
      {
        path: '/solutions#intelligence',
        label: 'Commerce Intelligence',
        tagline: 'Predictive Analytics',
        description: 'Insights to power AI agents',
        status: 'coming'
      }
    ]
  }
];

// Main navigation routes (for mobile menu and footer)
export const mainRoutes = [
  {path: '/solutions', label: 'Solutions', translate: false},
  {path: '/about', label: 'About', translate: false},
  {path: '/contact', label: 'Contact', translate: true}
];

// Footer-specific additional links
export const footerRoutes = [
  {path: '/solutions', label: 'Solutions', translate: false},
  {path: '/about', label: 'About', translate: false},
  {path: '/contact', label: 'Contact', translate: true}
];

// External links configuration
export const externalRoutes = [];

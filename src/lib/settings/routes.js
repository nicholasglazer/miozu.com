/**
 * Central routes configuration for Oraklex
 * This file defines all navigation items for consistent use across the application
 */

// Solutions for the mega menu and mobile menu
export const solutions = [
  {
    category: 'Data Products',
    items: [
      {
        path: '/solutions#behavioral-data',
        label: 'Commerce Behavior Index',
        tagline: 'Data Licensing',
        description: 'First-party behavioral datasets for AI training',
        status: 'early'
      },
      {
        path: '/solutions#demand-api',
        label: 'Demand Prediction API',
        tagline: 'Prediction Infrastructure',
        description: 'SKU-level demand forecasting',
        status: 'early'
      }
    ]
  }
];

// Main navigation routes (for mobile menu and footer)
export const mainRoutes = [
  {path: '/solutions', label: 'Products', translate: false},
  {path: '/data', label: 'Schema', translate: false},
  {path: '/about', label: 'About', translate: false},
  {path: '/contact', label: 'Contact', translate: true}
];

// Footer-specific additional links
export const footerRoutes = [
  {path: '/solutions', label: 'Products', translate: false},
  {path: '/data', label: 'Data Schema', translate: false},
  {path: '/insights', label: 'Research', translate: false},
  {path: '/about', label: 'About', translate: false},
  {path: '/contact', label: 'Contact', translate: true}
];

// External links configuration
export const externalRoutes = [];

/**
 * Central routes configuration for Oraklex
 * This file defines all navigation items for consistent use across the application
 */

// Main navigation routes (internal pages)
export const mainRoutes = [
  {path: '/products', label: 'Products', translate: false},
  {path: '/team', label: 'Team', translate: false},
  {path: '/contact', label: 'Contact', translate: true}
];

// Footer-specific additional links
export const footerRoutes = [
  {path: '/products', label: 'Products', translate: false},
  {path: '/team', label: 'Team', translate: false},
  {path: '/contact', label: 'Contact', translate: true}
];

// External links configuration
export const externalRoutes = [];

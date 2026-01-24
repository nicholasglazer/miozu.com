/**
 * Central routes configuration for Miozu
 * This file defines all navigation items for consistent use across the application
 */

// Solutions for the mega menu and mobile menu
export const solutions = [
  {
    category: 'Enterprise Design System',
    items: [
      {
        path: '/design-system',
        label: 'Component Library',
        tagline: 'Scalable Components',
        description: 'AI-first Svelte 5 components for enterprise teams',
        status: 'production'
      },
      {
        path: '/solutions#design-governance',
        label: 'Design Governance',
        tagline: 'System Management',
        description: 'Eliminate design debt and maintain consistency',
        status: 'enterprise'
      }
    ]
  },
  {
    category: 'Design Foundations',
    items: [
      {
        path: '/solutions#design-tokens',
        label: 'Design Tokens',
        tagline: 'DTCG Standards',
        description: 'Scalable design tokens with multi-brand support',
        status: 'production'
      },
      {
        path: '/solutions#base16-themes',
        label: 'Base16 Ecosystem',
        tagline: 'Developer Tools',
        description: 'VSCode, Emacs, and Linux development themes',
        status: 'open-source'
      }
    ]
  }
];

// Main navigation routes (for mobile menu and footer)
export const mainRoutes = [
  {path: '/design-system', label: 'Components', translate: false},
  {path: '/solutions', label: 'Solutions', translate: false},
  {path: '/ports', label: 'Theme Ports', translate: false},
  {path: '/about', label: 'About', translate: false},
  {path: '/contact', label: 'Contact', translate: true}
];

// Footer-specific additional links
export const footerRoutes = [
  {path: '/design-system', label: 'Components', translate: false},
  {path: '/solutions', label: 'Solutions', translate: false},
  {path: '/ports', label: 'Theme Ports', translate: false},
  {path: '/insights', label: 'Documentation', translate: false},
  {path: '/about', label: 'About', translate: false},
  {path: '/contact', label: 'Contact', translate: true}
];

// External links configuration
export const externalRoutes = [];

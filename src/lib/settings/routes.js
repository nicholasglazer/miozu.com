/**
 * Central routes configuration for Miozu
 * This file defines all navigation items for consistent use across the application
 */

// Solutions for the mega menu and mobile menu
export const solutions = [
  {
    category: 'Enterprise Components',
    items: [
      {
        path: '/design-system',
        label: 'Component Library',
        tagline: 'Svelte Components',
        description: 'AI-first components for enterprise applications',
        status: 'stable'
      },
      {
        path: '/solutions#form-builder',
        label: 'Form Builder',
        tagline: 'Enterprise Forms',
        description: 'Advanced form building components and tools',
        status: 'stable'
      }
    ]
  },
  {
    category: 'Design System',
    items: [
      {
        path: '/solutions#design-tokens',
        label: 'Design Tokens',
        tagline: 'Free Usage',
        description: 'Standardized design tokens and variables',
        status: 'free'
      },
      {
        path: '/solutions#base16-themes',
        label: 'Base16 Themes',
        tagline: 'Editor Themes',
        description: 'VSCode, Emacs, and Linux system themes',
        status: 'free'
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

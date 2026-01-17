<!--
  @component DocsSidebar

  Navigation sidebar for documentation pages.
-->
<script>
  import {page} from '$app/stores';

  const nav = [
    {
      title: 'Getting Started',
      items: [
        {label: 'Introduction', href: '/design-system/docs'},
        {label: 'Installation', href: '/design-system/docs/installation'},
        {label: 'Theming', href: '/design-system/docs/theming'}
      ]
    },
    {
      title: 'Design Tokens',
      items: [
        {label: 'Colors', href: '/design-system/docs/colors'},
        {label: 'Spacing', href: '/design-system/docs/spacing'},
        {label: 'Typography', href: '/design-system/docs/typography'}
      ]
    },
    {
      title: 'Components',
      items: [
        {label: 'Button', href: '/design-system/docs/button'},
        {label: 'Badge', href: '/design-system/docs/badge'},
        {label: 'Input', href: '/design-system/docs/input'},
        {label: 'Checkbox', href: '/design-system/docs/checkbox'},
        {label: 'Switch', href: '/design-system/docs/switch'},
        {label: 'Select', href: '/design-system/docs/select'},
        {label: 'Toast', href: '/design-system/docs/toast'}
      ]
    },
    {
      title: 'Utilities',
      items: [
        {label: 'cn()', href: '/design-system/docs/cn'},
        {label: 'cv()', href: '/design-system/docs/cv'}
      ]
    },
    {
      title: 'Actions',
      items: [
        {label: 'clickOutside', href: '/design-system/docs/click-outside'},
        {label: 'focusTrap', href: '/design-system/docs/focus-trap'},
        {label: 'portal', href: '/design-system/docs/portal'}
      ]
    }
  ];

  function isActive(href) {
    const pathname = $page.url.pathname.replace(/\/$/, '');
    const target = href.replace(/\/$/, '');
    return pathname === target;
  }
</script>

<nav class="docs-sidebar">
  <div class="sidebar-header">
    <a href="/design-system/docs" class="sidebar-brand">
      <span class="brand-rune">&#5765;</span>
      <span class="brand-text">jera</span>
    </a>
    <span class="version">v0.1.0</span>
  </div>

  <div class="sidebar-content">
    {#each nav as section}
      <div class="nav-section">
        <h4 class="nav-title">{section.title}</h4>
        <ul class="nav-list">
          {#each section.items as item}
            <li>
              <a
                href={item.href}
                class="nav-link"
                class:active={isActive(item.href)}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.label}
              </a>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>
</nav>

<style>
  .docs-sidebar {
    display: flex;
    flex-direction: column;
    width: 16rem;
    height: 100%;
    background: var(--color-base0);
    border-right: 1px solid var(--color-border);
    overflow-y: auto;
  }

  .sidebar-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--color-border);
  }

  .sidebar-brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: var(--color-base6);
    font-weight: 600;
  }

  .brand-rune {
    font-size: 1.25rem;
    color: var(--color-base14);
  }

  .brand-text {
    font-size: 1rem;
    letter-spacing: -0.02em;
  }

  .version {
    font-size: 0.75rem;
    color: var(--color-base4);
    background: var(--color-base2);
    padding: 0.125rem 0.5rem;
    border-radius: 9999px;
  }

  .sidebar-content {
    flex: 1;
    padding: 1rem 0;
  }

  .nav-section {
    padding: 0.5rem 0;
  }

  .nav-title {
    margin: 0;
    padding: 0.5rem 1.5rem;
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-base4);
  }

  .nav-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .nav-link {
    display: block;
    padding: 0.5rem 1.5rem;
    font-size: 0.875rem;
    color: var(--color-base5);
    text-decoration: none;
    transition: background 0.1s, color 0.1s;
  }

  .nav-link:hover {
    background: var(--color-base1);
    color: var(--color-base6);
  }

  .nav-link.active {
    background: var(--color-base1);
    color: var(--color-base14);
    font-weight: 500;
  }
</style>

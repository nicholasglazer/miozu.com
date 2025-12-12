<script>
  import {browser} from '$app/environment';
  import {fly, fade} from 'svelte/transition';
  import {quintOut, cubicOut} from 'svelte/easing';
  import {solutions as solutionsConfig} from '$lib/settings/routes';

  let {l10n} = $props();

  let isOpen = $state(false);
  let closeTimeout = $state(null);
  let containerEl = $state(null);
  let menuPosition = $state({ left: '50%', transform: 'translateX(-50%)' });

  const MENU_WIDTH = 860;
  const VIEWPORT_PADDING = 16;

  // Extended data for the mega menu
  const solutionCards = [
    {
      id: 'behavioral-data',
      name: 'Commerce Behavior Index',
      tagline: 'First-Party Datasets',
      description: 'Stop training AI on synthetic data. 10M+ real shopping interactions monthly, licensed and ready.',
      href: '/solutions#behavioral-data',
      status: 'early',
      icon: 'oracle'
    },
    {
      id: 'demand-api',
      name: 'Demand Prediction API',
      tagline: 'Predictive Intelligence',
      description: 'Know what sells before it trends. 94% accurate SKU-level forecasts, 30 days ahead.',
      href: '/solutions#demand-api',
      status: 'early',
      icon: 'intelligence'
    },
    {
      id: 'geo',
      name: 'GEO Intelligence',
      tagline: 'AI Visibility',
      description: "When enterprise buyers ask ChatGPT for recommendations, are you the answer?",
      href: '/solutions#geo',
      status: 'live',
      icon: 'geo'
    },
    {
      id: 'aeo',
      name: 'AEO Solutions',
      tagline: 'Answer Engine Optimization',
      description: 'Own the AI-generated answer. Be the source Perplexity and AI Overviews cite.',
      href: '/solutions#aeo',
      status: 'live',
      icon: 'aeo'
    }
  ];

  const quickLinks = [
    {name: 'About', href: '/about'},
    {name: 'Insights Report', href: '/insights', badge: 'New'},
    {name: 'Data Schema', href: '/data'},
    {name: 'Contact', href: '/contact'}
  ];

  function calculateMenuPosition() {
    if (!browser || !containerEl) return;

    const rect = containerEl.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    // Calculate where the menu would be if centered
    const triggerCenter = rect.left + rect.width / 2;
    const menuHalfWidth = MENU_WIDTH / 2;

    // Check if menu would overflow right edge
    const rightOverflow = triggerCenter + menuHalfWidth > viewportWidth - VIEWPORT_PADDING;
    // Check if menu would overflow left edge
    const leftOverflow = triggerCenter - menuHalfWidth < VIEWPORT_PADDING;

    if (rightOverflow && !leftOverflow) {
      // Align to right edge
      const rightOffset = viewportWidth - VIEWPORT_PADDING - rect.right;
      menuPosition = {
        left: 'auto',
        right: `${-rightOffset}px`,
        transform: 'none'
      };
    } else if (leftOverflow && !rightOverflow) {
      // Align to left edge
      const leftOffset = rect.left - VIEWPORT_PADDING;
      menuPosition = {
        left: `${-leftOffset}px`,
        right: 'auto',
        transform: 'none'
      };
    } else {
      // Center normally
      menuPosition = {
        left: '50%',
        right: 'auto',
        transform: 'translateX(-50%)'
      };
    }
  }

  function openMenu() {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      closeTimeout = null;
    }
    calculateMenuPosition();
    isOpen = true;
  }

  function closeMenu() {
    closeTimeout = setTimeout(() => {
      isOpen = false;
    }, 150);
  }

  function handleKeydown(event) {
    if (event.key === 'Escape' && isOpen) {
      isOpen = false;
    }
  }

  $effect(() => {
    if (!browser) return;

    if (isOpen) {
      document.addEventListener('keydown', handleKeydown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeydown);
      if (closeTimeout) {
        clearTimeout(closeTimeout);
      }
    };
  });

  function getIcon(iconName) {
    const icons = {
      geo: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>`,
      aeo: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 10h.01"/><path d="M12 10h.01"/><path d="M16 10h.01"/></svg>`,
      oracle: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M8 7l4-4 4 4"/><path d="M4 11h16"/><path d="M4 15h16"/><path d="M8 19l4 4 4-4"/></svg>`,
      intelligence: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`
    };
    return icons[iconName] || '';
  }
</script>

<div
  bind:this={containerEl}
  class="mega-menu-container"
  role="navigation"
  onmouseenter={openMenu}
  onmouseleave={closeMenu}
>
  <button
    class="trigger-btn"
    class:active={isOpen}
    aria-expanded={isOpen}
    aria-haspopup="true"
  >
    <span>Platform</span>
    <svg
      class="chevron"
      class:rotated={isOpen}
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
    >
      <path d="M6 9l6 6 6-6"/>
    </svg>
  </button>

  {#if isOpen}
    <div
      class="mega-menu-panel"
      style="left: {menuPosition.left}; right: {menuPosition.right ?? 'auto'}; transform: {menuPosition.transform};"
      in:fly={{y: -8, duration: 200, easing: quintOut}}
      out:fly={{y: -8, duration: 120, easing: cubicOut}}
    >
      <div class="menu-content">
        <!-- Main Solutions Grid -->
        <div class="solutions-grid">
          {#each solutionCards as solution, i}
            <a
              href={solution.href}
              class="solution-card"
              class:live={solution.status === 'live'}
              class:early={solution.status === 'early'}
              in:fade={{duration: 150, delay: 30 + i * 40}}
            >
              <div class="card-top">
                <div class="card-icon" class:live={solution.status === 'live'} class:early={solution.status === 'early'}>
                  {@html getIcon(solution.icon)}
                </div>
                {#if solution.status === 'early'}
                  <span class="status-badge early">Early Access</span>
                {/if}
              </div>
              <div class="card-body">
                <h3>{solution.name}</h3>
                <span class="card-tagline">{solution.tagline}</span>
                <p class="card-description">{solution.description}</p>
              </div>
              <div class="card-footer">
                <span class="learn-more">
                  {solution.status === 'live' ? 'Learn more' : 'Request access'}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <path d="M5 12h14m-7-7l7 7-7 7"/>
                  </svg>
                </span>
              </div>
            </a>
          {/each}
        </div>

        <!-- Sidebar -->
        <div class="sidebar">
          <div class="sidebar-section">
            <span class="sidebar-label">Company</span>
            <div class="quick-links">
              {#each quickLinks as link}
                <a href={link.href} class="quick-link">
                  {link.name}
                  {#if link.badge}
                    <span class="link-badge">{link.badge}</span>
                  {/if}
                </a>
              {/each}
            </div>
          </div>

          <div class="sidebar-cta">
            <span class="cta-label">Ready to start?</span>
            <a href="/contact" class="cta-button">
              Get in touch
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M5 12h14m-7-7l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style lang="postcss">
  @reference '$theme';

  .mega-menu-container {
    @apply relative;
  }

  .trigger-btn {
    @apply flex items-center gap-1.5 px-4 py-2 text-sm font-medium;
    color: #888;
    background: transparent;
    border: none;
    cursor: pointer;
    letter-spacing: -0.01em;
    transition: color 0.15s;
  }

  .trigger-btn:hover,
  .trigger-btn.active {
    color: #fff;
  }

  /* Light theme variant (for standard header) */
  :global(.app-container) .trigger-btn {
    @apply text-base5;
  }

  :global(.app-container) .trigger-btn:hover,
  :global(.app-container) .trigger-btn.active {
    @apply text-base6;
  }

  .chevron {
    transition: transform 0.2s ease;
    opacity: 0.6;
  }

  .chevron.rotated {
    transform: rotate(180deg);
  }

  .mega-menu-panel {
    @apply absolute top-full mt-3;
    @apply rounded-2xl;
    width: 860px;
    max-width: calc(100vw - 32px);
    max-height: calc(100vh - 80px);
    overflow-y: auto;
    z-index: 10001;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow:
      0 25px 50px -12px rgba(0, 0, 0, 0.15),
      0 0 0 1px rgba(0, 0, 0, 0.02);
  }

  .menu-content {
    @apply flex;
  }

  .solutions-grid {
    @apply flex-1 p-5 grid grid-cols-2 gap-3;
  }

  .solution-card {
    @apply relative flex flex-col gap-3 p-4 rounded-xl no-underline;
    @apply transition-all duration-150;
    background: transparent;
    border: 1px solid transparent;
  }

  .solution-card:hover {
    background: rgba(0, 0, 0, 0.02);
    border-color: rgba(0, 0, 0, 0.04);
  }

  .solution-card.live:hover {
    background: rgba(0, 0, 0, 0.03);
  }

  .solution-card.early:hover {
    background: rgba(74, 158, 255, 0.04);
    border-color: rgba(74, 158, 255, 0.1);
  }

  .card-top {
    @apply flex items-center justify-between;
  }

  .card-icon {
    @apply w-9 h-9 rounded-lg flex items-center justify-center;
    background: rgba(0, 0, 0, 0.04);
    color: #666;
    transition: all 0.15s ease;
  }

  .card-icon.live {
    background: rgba(0, 0, 0, 0.06);
    color: #333;
  }

  .card-icon.early {
    background: linear-gradient(135deg, rgba(74, 158, 255, 0.15), rgba(99, 102, 241, 0.15));
    color: #4a9eff;
  }

  .solution-card:hover .card-icon {
    background: rgba(0, 0, 0, 0.08);
    color: #000;
  }

  .status-badge {
    @apply px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider;
    background: rgba(0, 0, 0, 0.04);
    color: #888;
  }

  .status-badge.early {
    background: linear-gradient(135deg, #4a9eff, #6366f1);
    color: #fff;
  }

  .card-body {
    @apply flex flex-col gap-1;
  }

  .card-body h3 {
    @apply text-sm font-semibold text-neutral-900;
    letter-spacing: -0.01em;
  }

  .card-tagline {
    @apply text-xs text-neutral-500 font-medium;
  }

  .card-description {
    @apply text-xs text-neutral-400 leading-relaxed mt-1;
  }

  .card-footer {
    @apply mt-auto pt-2;
  }

  .learn-more {
    @apply flex items-center gap-1 text-xs font-medium text-neutral-400;
    @apply transition-colors duration-150;
  }

  .learn-more svg {
    opacity: 0;
    transform: translateX(-4px);
    transition: all 0.15s ease;
  }

  .solution-card:hover .learn-more {
    color: #000;
  }

  .solution-card:hover .learn-more svg {
    opacity: 1;
    transform: translateX(0);
  }

  .sidebar {
    @apply w-52 p-5 flex flex-col gap-6;
    background: rgba(0, 0, 0, 0.02);
    border-left: 1px solid rgba(0, 0, 0, 0.04);
  }

  .sidebar-section {
    @apply flex flex-col gap-2;
  }

  .sidebar-label {
    @apply text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-400 px-2;
  }

  .quick-links {
    @apply flex flex-col;
  }

  .quick-link {
    @apply px-3 py-2 rounded-lg text-sm text-neutral-600 no-underline;
    @apply transition-colors duration-150;
    font-weight: 450;
  }

  .quick-link:hover {
    @apply text-neutral-900;
    background: rgba(0, 0, 0, 0.03);
  }

  .link-badge {
    @apply ml-2 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider rounded;
    background: linear-gradient(135deg, #4a9eff, #6366f1);
    color: #fff;
  }

  .sidebar-cta {
    @apply mt-auto flex flex-col gap-2;
  }

  .cta-label {
    @apply text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-400 px-2;
  }

  .cta-button {
    @apply flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium no-underline;
    @apply transition-all duration-150;
    background: #0a0a0a;
    color: #fff;
  }

  .cta-button:hover {
    background: #1a1a1a;
  }

  .cta-button svg {
    opacity: 0.7;
    transition: transform 0.15s ease;
  }

  .cta-button:hover svg {
    transform: translateX(2px);
    opacity: 1;
  }

  /* Responsive - hide on mobile */
  @media (max-width: 900px) {
    .mega-menu-panel {
      width: 720px;
    }

    .solutions-grid {
      @apply grid-cols-2 gap-2 p-4;
    }

    .sidebar {
      @apply w-44;
    }
  }

  @media (max-width: 767px) {
    .mega-menu-container {
      display: none;
    }
  }
</style>

<script>
  import {browser} from '$app/environment';
  import {fly, fade} from 'svelte/transition';
  import {quintOut, cubicOut} from 'svelte/easing';
  import {solutions as solutionsConfig} from '$lib/settings/routes';

  let {l10n} = $props();

  let isOpen = $state(false);
  let closeTimeout = $state(null);

  // Extended data for the mega menu
  const solutionCards = [
    {
      id: 'geo',
      name: 'GEO Intelligence',
      tagline: 'Generative Engine Optimization',
      description: 'Get featured in AI-generated responses from ChatGPT, Claude, Gemini, and next-gen search.',
      href: '/solutions#geo',
      status: 'live',
      icon: 'geo'
    },
    {
      id: 'aeo',
      name: 'AEO Solutions',
      tagline: 'Answer Engine Optimization',
      description: 'Structure content for Perplexity, AI Overviews, and conversational search platforms.',
      href: '/solutions#aeo',
      status: 'live',
      icon: 'aeo'
    },
    {
      id: 'data-oracle',
      name: 'LLM Data Oracle',
      tagline: 'Training Data for AI',
      description: 'Privacy-compliant commerce behavior data for LLM fine-tuning and AI agent training.',
      href: '/solutions#data-oracle',
      status: 'coming',
      icon: 'oracle'
    },
    {
      id: 'intelligence',
      name: 'Commerce Intelligence',
      tagline: 'Predictive Analytics',
      description: 'Real-time insights and predictions to power AI agents and recommendation engines.',
      href: '/solutions#intelligence',
      status: 'coming',
      icon: 'intelligence'
    }
  ];

  const quickLinks = [
    {name: 'About', href: '/about'},
    {name: 'Contact', href: '/contact'}
  ];

  function openMenu() {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      closeTimeout = null;
    }
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
    <span>Solutions</span>
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
              in:fade={{duration: 150, delay: 30 + i * 40}}
            >
              <div class="card-top">
                <div class="card-icon" class:live={solution.status === 'live'}>
                  {@html getIcon(solution.icon)}
                </div>
                {#if solution.status === 'coming'}
                  <span class="status-badge">Soon</span>
                {/if}
              </div>
              <div class="card-body">
                <h3>{solution.name}</h3>
                <span class="card-tagline">{solution.tagline}</span>
                <p class="card-description">{solution.description}</p>
              </div>
              <div class="card-footer">
                <span class="learn-more">
                  {solution.status === 'live' ? 'Learn more' : 'Get notified'}
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
                <a href={link.href} class="quick-link">{link.name}</a>
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
    @apply absolute top-full left-1/2 -translate-x-1/2 mt-3;
    @apply rounded-2xl overflow-hidden;
    width: 860px;
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

  .solution-card:hover .card-icon {
    background: rgba(0, 0, 0, 0.08);
    color: #000;
  }

  .status-badge {
    @apply px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider;
    background: rgba(0, 0, 0, 0.04);
    color: #888;
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

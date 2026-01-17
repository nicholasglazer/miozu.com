<script>
  import {DocsSidebar} from '$lib/components/docs';
  import {browser} from '$app/environment';

  let {children} = $props();

  let sidebarOpen = $state(false);
</script>

<div class="docs-layout">
  <!-- Mobile menu button -->
  <button
    class="mobile-menu-btn"
    onclick={() => sidebarOpen = !sidebarOpen}
    aria-label="Toggle navigation"
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      {#if sidebarOpen}
        <path d="M18 6L6 18M6 6l12 12" />
      {:else}
        <path d="M4 6h16M4 12h16M4 18h16" />
      {/if}
    </svg>
  </button>

  <!-- Sidebar -->
  <aside class="sidebar" class:open={sidebarOpen}>
    <DocsSidebar />
  </aside>

  <!-- Backdrop for mobile -->
  {#if sidebarOpen}
    <div
      class="backdrop"
      onclick={() => sidebarOpen = false}
      onkeydown={(e) => {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          sidebarOpen = false;
        }
      }}
      role="button"
      tabindex="0"
      aria-label="Close navigation"
    ></div>
  {/if}

  <!-- Main content -->
  <main class="docs-main">
    <article class="docs-content">
      {@render children()}
    </article>
  </main>
</div>

<style>
  .docs-layout {
    display: flex;
    min-height: 100%;
    background: var(--color-base0);
  }

  .mobile-menu-btn {
    display: none;
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 100;
    padding: 0.5rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm, 0.25rem);
    background: var(--color-base0);
    color: var(--color-base5);
    cursor: pointer;
  }

  .mobile-menu-btn svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  @media (max-width: 768px) {
    .mobile-menu-btn {
      display: flex;
    }
  }

  .sidebar {
    position: sticky;
    top: 0;
    height: 100vh;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 50;
      transform: translateX(-100%);
      transition: transform 0.2s ease;
    }

    .sidebar.open {
      transform: translateX(0);
    }
  }

  .backdrop {
    display: none;
    position: fixed;
    inset: 0;
    z-index: 40;
    background: rgba(0, 0, 0, 0.5);
  }

  @media (max-width: 768px) {
    .backdrop {
      display: block;
    }
  }

  .docs-main {
    flex: 1;
    min-width: 0;
    overflow-y: auto;
  }

  .docs-content {
    max-width: 48rem;
    margin: 0 auto;
    padding: 3rem 2rem;
  }

  @media (max-width: 768px) {
    .docs-content {
      padding: 4rem 1.5rem 3rem;
    }
  }

  /* Typography styles for doc content */
  .docs-content :global(h1) {
    margin: 0 0 1rem;
    font-size: 2.25rem;
    font-weight: 700;
    color: var(--color-base6);
    letter-spacing: -0.025em;
  }

  .docs-content :global(h2) {
    margin: 2.5rem 0 1rem;
    padding-bottom: 0.5rem;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-base6);
    border-bottom: 1px solid var(--color-border);
  }

  .docs-content :global(h3) {
    margin: 2rem 0 0.75rem;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-base6);
  }

  .docs-content :global(p) {
    margin: 1rem 0;
    color: var(--color-base5);
    line-height: 1.7;
  }

  .docs-content :global(a) {
    color: var(--color-base14);
    text-decoration: none;
  }

  .docs-content :global(a:hover) {
    text-decoration: underline;
  }

  .docs-content :global(code:not(pre code)) {
    font-family: var(--font-mono);
    font-size: 0.875em;
    padding: 0.125rem 0.375rem;
    background: var(--color-base1);
    border-radius: 0.25rem;
    color: var(--color-base14);
  }

  .docs-content :global(ul),
  .docs-content :global(ol) {
    margin: 1rem 0;
    padding-left: 1.5rem;
    color: var(--color-base5);
  }

  .docs-content :global(li) {
    margin: 0.5rem 0;
    line-height: 1.6;
  }

  .docs-content :global(.lead) {
    font-size: 1.125rem;
    color: var(--color-base4);
    line-height: 1.7;
  }
</style>

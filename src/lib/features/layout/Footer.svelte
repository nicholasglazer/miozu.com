<script>
  import {onMount} from 'svelte';
  import {fade, slide} from 'svelte/transition';
  import ThemeSwitcher from '$features/theme/ThemeSwitcher.svelte';
  import Logo from '$components/Logo.svelte';
  import {author, appName, companyName, companyNameShort, companyUrl, legalLinks} from '$lib/settings/global';
  import {mainRoutes} from '$lib/settings/routes';

  let {footerEl = $bindable(), l10n, theme} = $props();
  const year = new Date().getFullYear();

  // Logo styling
  const logoSize = 28;
  const logoColor = 'currentColor';

  // Status state
  let statusExpanded = $state(false);
  let performance = $state({
    pageLoad: 0,
    domComplete: 0,
    firstPaint: 0
  });
  let swStatus = $state('checking');
  let online = $state(true);

  function toggleStatus() {
    statusExpanded = !statusExpanded;
  }

  // System status data
  let statusItems = $state([]);

  // Removed locale handling and external URL handling as requested

  // Safely get translation with fallback
  function safeTranslate(key, params = {}) {
    if (l10n && typeof l10n.t === 'function') {
      try {
        return l10n.t(key, params);
      } catch (e) {
        console.warn(`Translation error for key: ${key}`, e);
        return key; // Fallback to the key itself
      }
    }
    return key; // Fallback if l10n is not available
  }

  // Event handlers stored for proper cleanup
  const handleOnline = () => (online = true);
  const handleOffline = () => (online = false);

  onMount(() => {
    // Check online status
    online = navigator.onLine;
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check service worker status
    if ('serviceWorker' in navigator) {
      if (navigator.serviceWorker.controller) {
        swStatus = 'active';
      } else {
        swStatus = 'inactive';
      }
    } else {
      swStatus = 'unsupported';
    }

    // Performance metrics - fixed to check for API availability
    if (window.performance) {
      setTimeout(() => {
        // Check if timing API is available
        if (window.performance.timing) {
          const perfData = window.performance.timing;
          performance.pageLoad = perfData.loadEventEnd - perfData.navigationStart;
          performance.domComplete = perfData.domComplete - perfData.domLoading;
        }

        // Check if Performance Entry API is available
        if (
          window.performance.getEntriesByType &&
          typeof window.performance.getEntriesByType === 'function'
        ) {
          try {
            const paintMetrics = window.performance.getEntriesByType('paint');
            if (paintMetrics && paintMetrics.length) {
              const firstPaint = paintMetrics.find(
                entry => entry.name === 'first-contentful-paint'
              );
              if (firstPaint) {
                performance.firstPaint = Math.round(firstPaint.startTime);
              }
            }
          } catch (e) {
            console.warn('Error accessing performance metrics:', e);
          }
        }

        updateStatusItems();
      }, 0);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  });

  function updateStatusItems() {
    statusItems = [
      {
        id: 'online',
        label: online ? 'Online' : 'Offline',
        value: online ? 'Connected' : 'Disconnected',
        color: online ? '#6dd672' : '#ff9837'
      },
      {
        id: 'sw',
        label: 'Service Worker',
        value:
          swStatus === 'active' ? 'Active'
          : swStatus === 'inactive' ? 'Inactive'
          : 'Unsupported',
        color: swStatus === 'active' ? '#6dd672' : '#ff9837'
      },
      {
        id: 'perf',
        label: 'Page Load',
        value: `${performance.pageLoad}ms`,
        color:
          performance.pageLoad < 1000 ? '#6dd672'
          : performance.pageLoad < 3000 ? '#e8d176'
          : '#eb3137'
      },
      {
        id: 'fp',
        label: 'First Paint',
        value: `${performance.firstPaint}ms`,
        color:
          performance.firstPaint < 1000 ? '#6dd672'
          : performance.firstPaint < 3000 ? '#e8d176'
          : '#eb3137'
      },
      {
        id: 'dom',
        label: 'DOM Complete',
        value: `${performance.domComplete}ms`,
        color:
          performance.domComplete < 1000 ? '#6dd672'
          : performance.domComplete < 3000 ? '#e8d176'
          : '#eb3137'
      }
    ];
  }

  $effect(() => {
    if (online !== undefined || swStatus !== 'checking' || performance.pageLoad > 0) {
      updateStatusItems();
    }
  });
</script>

<footer bind:this={footerEl} class="footer">
  <div class="footer-container">
    <div class="footer-content">
      <div class="footer-branding">
        <a href="/" class="footer-logo">
          <Logo size={28} class="footer-logo-svg" />
        </a>

        <!-- Internal navigation links -->
        <div class="footer-nav">
          {#each mainRoutes as route}
            <a href={route.path} class="footer-link">
              {route.translate ? safeTranslate(route.label) : route.label}
            </a>
          {/each}
        </div>
      </div>

      <div class="footer-tools">
        <ThemeSwitcher {theme} />

        <!-- Status Indicator Button -->
        <button
          class="status-indicator"
          onclick={toggleStatus}
          aria-expanded={statusExpanded}
          aria-label="Toggle system status"
        >
          <div class="status-dot" style="background-color: {online ? '#6dd672' : '#ff9837'}"></div>
        </button>
      </div>
    </div>

    {#if statusExpanded}
      <div class="status-panel" in:slide={{duration: 200}} out:slide={{duration: 150}}>
        <div class="status-items">
          {#each statusItems as item (item.id)}
            <div class="status-item" style="--status-color: {item.color}">
              <div class="item-label">{item.label}</div>
              <div class="item-value">
                <span>{item.value}</span>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <div class="footer-legal">
      <div class="legal-links">
        {#each legalLinks as link}
          <a href={link.path} class="legal-link">{link.label}</a>
        {/each}
      </div>

      <div class="footer-trust">
        <div class="trust-badges">
          <span class="trust-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            GDPR
          </span>
          <span class="trust-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            CCPA
          </span>
        </div>
        <span class="location">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          Toronto, Canada
        </span>
      </div>

      <div class="legal-meta">
        <p class="copyright">© {year} {author}</p>
        <p class="built-with">
          Built by <a href={companyUrl} target="_blank" rel="noopener noreferrer" class="company-link"
            >{companyNameShort}</a
          >
        </p>
      </div>
    </div>
  </div>
</footer>

<style lang="postcss">
  @reference '$theme';

  .footer {
    @apply w-full mt-auto bg-base0;
  }

  .footer-container {
    @apply max-w-7xl mx-auto px-2.5 py-4;
  }

  .footer-content {
    @apply flex flex-wrap justify-between items-center mb-2 gap-3;
  }

  .footer-branding {
    @apply w-full flex items-center justify-between flex-wrap gap-4;
  }

  .footer-logo {
    @apply flex items-center gap-2 no-underline text-base14;

    .logo-text {
      @apply text-xl;
    }
  }

  .footer-name {
    @apply font-medium;
  }

  .footer-nav {
    @apply flex gap-4;
  }

  .company-link {
    @apply text-base14 hover:text-base13 transition-colors;
    text-decoration: none;
  }

  .company-link:hover {
    text-decoration: underline;
  }

  .footer-legal {
    @apply flex flex-wrap justify-between items-center text-xs text-base3 gap-4;
  }

  .footer-trust {
    @apply flex items-center gap-4;
  }

  .trust-badges {
    @apply flex items-center gap-2;
  }

  .trust-badge {
    @apply flex items-center gap-1 px-2 py-1 rounded bg-base1 text-base4;
    font-size: 0.65rem;
    font-weight: 500;
  }

  .trust-badge svg {
    @apply text-green-500;
  }

  .location {
    @apply flex items-center gap-1.5 text-base4;
  }

  .location svg {
    @apply text-base4;
  }

  .legal-links {
    @apply flex gap-3;
  }

  .legal-link {
    @apply text-base3 hover:text-base5 transition-colors no-underline;
  }

  .footer-tools {
    @apply flex items-center gap-3 order-last sm:order-none w-full sm:w-auto justify-end sm:ml-auto sm:mr-4;
  }

  .copyright,
  .built-with {
    @apply py-1;
  }

  /* Status Indicator Styles */
  .status-indicator {
    @apply flex items-center justify-center h-8 w-8 rounded-full;
    @apply bg-base1 hover:bg-base2 transition-colors;
    @apply focus:outline-none focus:ring-2 focus:ring-base14/50;
  }

  .status-dot {
    @apply h-3 w-3 rounded-full;
    @apply transition-colors duration-300;
    @apply shadow-sm;
  }

  /* Status Panel Styles */
  .status-panel {
    @apply my-5 p-2.5;
    @apply bg-base0;
    @apply border border-base4/10;
  }

  .status-items {
    @apply flex flex-wrap justify-evenly gap-2.5;
    @apply px-2 py-1;
  }

  .status-item {
    @apply flex flex-col items-start;
    @apply px-2.5 py-0.5;
    @apply border-l-1 border-base2;
  }

  .item-label {
    @apply text-base3 mb-1 text-xs;
  }

  .item-value {
    @apply flex text-base10 text-sm;
  }

  /* Removed locale select styles as language selection was removed */

  @media (max-width: 640px) {
    .footer-content {
      @apply flex-col gap-3 items-start;
    }

    .footer-tools {
      @apply mr-0 ml-0 mt-2;
    }

    .status-items {
      @apply flex-col;
    }

    .status-item {
      @apply w-full;
    }
  }
</style>

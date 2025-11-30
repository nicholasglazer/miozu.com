<script>
  import {tick, onMount, onDestroy} from 'svelte';
  import {afterNavigate, disableScrollHandling} from '$app/navigation';
  import {appName} from '$lib/settings/global';
  import Header from '$features/layout/Header.svelte';
  import Footer from '$features/layout/Footer.svelte';
  import '../app.css';

  let {children, data} = $props();

  // Scroll to top on navigation
  afterNavigate(() => {
    // Disable SvelteKit's default scroll handling
    disableScrollHandling();

    // Scroll both window and the main content container
    setTimeout(() => {
      window.scrollTo({top: 0, behavior: 'instant'});
      const mainContent = document.getElementById('main');
      if (mainContent) {
        mainContent.scrollTop = 0;
      }
    }, 10);
  });

  let headerEl = $state(null);
  let footerEl = $state(null);
  let contentEl = $state(null);
  let innerHeight = $state(0);
  let innerWidth = $state(0);
  let headerHeight = $state(0);
  let footerHeight = $state(0);

  // Calculate content height based on header height
  let contentHeight = $derived(innerHeight - headerHeight);

  // Flag to track if we are using resize observer
  let usingResizeObserver = $state(false);
  let resizeObserver;

  async function updateSizes() {
    await tick();
    headerHeight = headerEl?.offsetHeight || 0;

    data.s.pageSize = {
      h: innerHeight - headerHeight,
      w: innerWidth
    };
  }

  // Setup ResizeObserver if available - more efficient than window resize
  function setupResizeObserver() {
    if (typeof ResizeObserver !== 'undefined' && headerEl) {
      usingResizeObserver = true;

      resizeObserver = new ResizeObserver(() => {
        updateSizes();
      });

      resizeObserver.observe(headerEl);
    }
  }

  onMount(() => {
    updateSizes();

    if (headerHeight === 0) {
      setTimeout(updateSizes, 50);
    }

    // Setup resize observer
    setupResizeObserver();

    // Sync theme with DOM (important for theme switching)
    if (data.theme && typeof data.theme.sync === 'function') {
      data.theme.sync();
    }

    // Ensure we detect pageshow events (for bfcache restoration)
    const handlePageShow = (event) => {
      if (event.persisted) {
        // Page was restored from the bfcache
        updateSizes();
      }
    };

    window.addEventListener('pageshow', handlePageShow);

    // Return cleanup function
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  });

  onDestroy(() => {
    // Properly cleanup the resize observer to avoid memory leaks
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  });

  $effect(() => {
    if (headerEl && !usingResizeObserver) {
      updateSizes();
    }
  });
</script>

<svelte:window
  bind:innerHeight
  bind:innerWidth
  onresize={!usingResizeObserver ? updateSizes : undefined}
/>

<svelte:head>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{appName}</title>
</svelte:head>

<div class="app-container">
  <Header bind:headerEl l10n={data.l10n} />

  <main
    id="main"
    class="main-content"
    style="height: {contentHeight}px; min-height: {contentHeight}px;"
  >
    <div class="content-wrapper" bind:this={contentEl}>
      <div class="content">
        {@render children()}
      </div>
      <Footer bind:footerEl l10n={data.l10n} theme={data.theme} />
    </div>
  </main>
</div>

<style lang="postcss">
  @reference '$theme';

  .app-container {
    @apply bg-base0 text-base6;
    @apply flex flex-col min-h-screen;
  }

  .main-content {
    @apply flex-grow;
    @apply overflow-auto;
  }

  .content-wrapper {
    @apply flex-1 flex flex-col items-center w-full;
    @apply overflow-y-auto;
  }

  .content {
    @apply flex-grow w-full;
  }
</style>

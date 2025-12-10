<script>
  import {tick, onMount, onDestroy} from 'svelte';
  import {browser} from '$app/environment';
  import {page} from '$app/stores';
  import {afterNavigate, disableScrollHandling} from '$app/navigation';
  import {appName} from '$lib/settings/global';
  import Header from '$features/layout/Header.svelte';
  import Footer from '$features/layout/Footer.svelte';
  import ExpandedView from '$lib/components/ExpandedView.svelte';
  import {cardTransition} from '$lib/reactiveStates/cardTransition.svelte';
  import '../app.css';

  let {children, data} = $props();

  // Check if we're on a fullscreen page (custom layout, no scroll)
  // Home page and contact page have their own fullscreen layouts
  // Handle both with and without trailing slash
  let isFullscreenPage = $derived(
    $page.url.pathname === '/' ||
    $page.url.pathname === '/contact' ||
    $page.url.pathname === '/contact/'
  );

  afterNavigate(() => {
    if (!isFullscreenPage) {
      disableScrollHandling();
      setTimeout(() => {
        window.scrollTo({top: 0, behavior: 'instant'});
        const mainContent = document.getElementById('main');
        if (mainContent) {
          mainContent.scrollTop = 0;
        }
      }, 10);
    }
  });

  let headerEl = $state(null);
  let innerHeight = $state(0);
  let innerWidth = $state(0);
  let headerHeight = $state(0);

  let contentHeight = $derived(innerHeight - headerHeight);

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
    setupResizeObserver();

    if (data.theme && typeof data.theme.sync === 'function') {
      data.theme.sync();
    }

    const handlePageShow = (event) => {
      if (event.persisted) {
        updateSizes();
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  });

  onDestroy(() => {
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

<!-- Expanded View Overlay (renders on top of everything) -->
<ExpandedView />

{#if isFullscreenPage}
  <!-- Fullscreen pages: Full custom layout (home, contact) -->
  <div class="home-container" style="height: {innerHeight}px;" class:hidden={cardTransition.showOverlay}>
    {@render children()}
  </div>
{:else}
  <!-- Other pages: Standard layout -->
  <div class="app-container">
    <Header bind:headerEl l10n={data.l10n} />
    <main
      id="main"
      class="main-content"
      style="height: {contentHeight}px; min-height: {contentHeight}px;"
    >
      <div class="content-wrapper">
        <div class="content">
          {@render children()}
        </div>
        <Footer l10n={data.l10n} theme={data.theme} />
      </div>
    </main>
  </div>
{/if}

<style lang="postcss">
  @reference '$theme';

  .home-container {
    width: 100%;
    overflow: hidden;
  }

  .app-container {
    @apply bg-base0 text-base6;
    @apply flex flex-col min-h-screen;
  }

  .main-content {
    @apply flex-grow overflow-auto;
  }

  .content-wrapper {
    @apply flex-1 flex flex-col items-center w-full;
    @apply overflow-y-auto;
  }

  .content {
    @apply flex-grow w-full;
  }

  /* Hide homepage when overlay is active */
  .home-container.hidden {
    visibility: hidden;
  }
</style>

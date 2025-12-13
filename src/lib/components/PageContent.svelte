<script lang="ts">
  interface Props {
    route: string;
  }

  let { route }: Props = $props();

  let ContentComponent: any = $state(null);
  let loading = $state(true);

  // Map routes to their content components
  const routeMap: Record<string, () => Promise<any>> = {
    '/team': () => import('./content/TeamContent.svelte'),
    '/products': () => import('./content/ProductsContent.svelte'),
    '/contact': () => import('./content/ContactContent.svelte'),
    '/about': () => import('./content/AboutContent.svelte'),
    '/solutions': () => import('./content/SolutionsContent.svelte'),
    '/data': () => import('./content/DataContent.svelte'),
    '/insights': () => import('./content/InsightsContent.svelte')
  };

  // Use $effect to reload content when route changes
  $effect(() => {
    loading = true;
    ContentComponent = null;

    const loader = routeMap[route];
    if (loader) {
      loader().then((module) => {
        ContentComponent = module.default;
        loading = false;
      });
    } else {
      loading = false;
    }
  });
</script>

<!-- Use {#key} to ensure component fully resets when route changes -->
{#key route}
  {#if ContentComponent}
    <svelte:component this={ContentComponent} />
  {:else if !loading}
    <div class="loading-content">
      <p>Content not found</p>
    </div>
  {/if}
{/key}

<style>
  .loading-content {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    color: #666;
  }
</style>

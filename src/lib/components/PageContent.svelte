<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    route: string;
  }

  let { route }: Props = $props();

  let ContentComponent: any = $state(null);
  let mounted = $state(false);

  // Map routes to their content components
  const routeMap: Record<string, () => Promise<any>> = {
    '/team': () => import('./content/TeamContent.svelte'),
    '/products': () => import('./content/ProductsContent.svelte'),
    '/contact': () => import('./content/ContactContent.svelte')
  };

  onMount(async () => {
    const loader = routeMap[route];
    if (loader) {
      const module = await loader();
      ContentComponent = module.default;
    }
    mounted = true;
  });
</script>

{#if ContentComponent}
  <svelte:component this={ContentComponent} />
{:else if mounted}
  <div class="loading-content">
    <p>Loading...</p>
  </div>
{/if}

<style>
  .loading-content {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    color: #666;
  }
</style>

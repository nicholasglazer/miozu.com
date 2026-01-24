<script>
  import {CodeBlock} from '$lib/components/docs';
</script>

<h1>portal</h1>

<p class="lead">
  Teleports an element to a different location in the DOM. Essential for modals, tooltips, and toasts.
</p>

<h2>Usage</h2>

<CodeBlock
  code={`<script>
  import { portal } from '@miozu/jera';
</script>

<!-- Teleport to document.body (default) -->
<div use:portal>
  This renders at the end of body
</div>

<!-- Teleport to specific element -->
<div use:portal="#modal-root">
  This renders inside #modal-root
</div>`}
  lang="svelte"
/>

<h2>Why Use Portals?</h2>

<ul>
  <li><strong>Z-index issues</strong> - Escape stacking contexts for modals</li>
  <li><strong>Overflow clipping</strong> - Prevent parent overflow:hidden from clipping</li>
  <li><strong>CSS isolation</strong> - Avoid inherited styles affecting overlays</li>
  <li><strong>Semantic HTML</strong> - Keep components logically grouped in source</li>
</ul>

<h2>Examples</h2>

<h3>Modal Dialog</h3>

<CodeBlock
  code={`<script>
  import { portal, focusTrap, escapeKey } from '@miozu/jera';

  let { open = $bindable(false) } = $props();
</script>

{#if open}
  <div
    class="modal-backdrop"
    use:portal
    use:escapeKey={() => open = false}
  >
    <div
      class="modal"
      role="dialog"
      aria-modal="true"
      use:focusTrap={{ enabled: true }}
    >
      <slot />
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
  }
</style>`}
  lang="svelte"
/>

<h3>Tooltip</h3>

<CodeBlock
  code={`<script>
  import { portal } from '@miozu/jera';

  let show = $state(false);
  let position = $state({ x: 0, y: 0 });

  function handleMouseEnter(e) {
    const rect = e.target.getBoundingClientRect();
    position = {
      x: rect.left + rect.width / 2,
      y: rect.top - 8
    };
    show = true;
  }
</script>

<button
  onmouseenter={handleMouseEnter}
  onmouseleave={() => show = false}
>
  Hover me
</button>

{#if show}
  <div
    class="tooltip"
    use:portal
    style="left: {position.x}px; top: {position.y}px;"
  >
    Tooltip content
  </div>
{/if}

<style>
  .tooltip {
    position: fixed;
    transform: translate(-50%, -100%);
    background: var(--color-surface);
    padding: 0.5rem 0.75rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    z-index: 100;
  }
</style>`}
  lang="svelte"
/>

<h3>Toast Container</h3>

<CodeBlock
  code={`<script>
  import { portal } from '@miozu/jera';

  let toasts = $state([]);
</script>

<div use:portal class="toast-container">
  {#each toasts as toast (toast.id)}
    <div class="toast">
      {toast.message}
    </div>
  {/each}
</div>

<style>
  .toast-container {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    z-index: 100;
  }
</style>`}
  lang="svelte"
/>

<h2>API</h2>

<div class="api-section">
  <h3>portal(node, target?)</h3>

  <div class="param">
    <code>node</code>
    <span>HTMLElement</span>
    <p>The element to teleport (provided by Svelte)</p>
  </div>

  <div class="param">
    <code>target</code>
    <span>string | HTMLElement</span>
    <p>CSS selector or element (default: 'body')</p>
  </div>
</div>

<h2>Target Options</h2>

<CodeBlock
  code={`<!-- Default: document.body -->
<div use:portal>...</div>

<!-- CSS selector -->
<div use:portal="#app">...</div>
<div use:portal=".modal-container">...</div>

<!-- Element reference -->
<div use:portal={containerElement}>...</div>`}
  lang="svelte"
/>

<h2>Setting Up Portal Targets</h2>

<p>
  Add portal targets to your <code>app.html</code>:
</p>

<CodeBlock
  code={`<!-- app.html -->
<body>
  <div id="app">%sveltekit.body%</div>

  <!-- Portal targets -->
  <div id="modal-root"></div>
  <div id="toast-root"></div>
  <div id="tooltip-root"></div>
</body>`}
  lang="html"
/>

<h2>Notes</h2>

<ul>
  <li><strong>Cleanup</strong> - Element is removed from DOM when component destroys</li>
  <li><strong>Reactivity</strong> - Target can be updated dynamically</li>
  <li><strong>Events</strong> - Event handlers still work as expected</li>
  <li><strong>Styles</strong> - Scoped styles won't apply (use global or inline)</li>
</ul>

<style>
  .api-section {
    margin: 1.5rem 0;
    padding: 1rem;
    background: var(--color-base01);
    border-radius: 0.5rem;
  }

  .api-section h3 {
    margin-top: 0;
  }

  .param {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.75rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--color-border);
  }

  .param:last-child {
    border-bottom: none;
  }

  .param code {
    color: var(--color-primary);
  }

  .param span {
    font-size: 0.8125rem;
    font-family: var(--font-mono);
    color: var(--color-base04);
  }

  .param p {
    width: 100%;
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
  }
</style>

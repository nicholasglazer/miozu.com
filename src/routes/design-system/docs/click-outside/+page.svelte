<script>
  import {CodeBlock} from '$lib/components/docs';
</script>

<h1>clickOutside</h1>

<p class="lead">
  A Svelte action that fires a callback when clicking outside an element.
</p>

<h2>Usage</h2>

<CodeBlock
  code={`<script>
  import { clickOutside } from '@miozu/jera';

  let isOpen = $state(false);
</script>

<div use:clickOutside={() => isOpen = false}>
  <button onclick={() => isOpen = !isOpen}>
    Toggle Menu
  </button>

  {#if isOpen}
    <div class="dropdown">
      Dropdown content
    </div>
  {/if}
</div>`}
  lang="svelte"
/>

<h2>How It Works</h2>

<ul>
  <li>Uses <code>mousedown</code> event for better UX (fires before focus changes)</li>
  <li>Checks if click target is outside the element using <code>contains()</code></li>
  <li>Ignores clicks with <code>defaultPrevented</code></li>
  <li>Listens on document level with capture phase</li>
</ul>

<h2>Common Patterns</h2>

<h3>Dropdown Menu</h3>

<CodeBlock
  code={`<script>
  import { clickOutside } from '@miozu/jera';

  let isOpen = $state(false);
</script>

<div class="dropdown-wrapper" use:clickOutside={() => isOpen = false}>
  <button onclick={() => isOpen = !isOpen}>
    Options
  </button>

  {#if isOpen}
    <ul class="dropdown-menu">
      <li><button onclick={() => console.log('Edit')}>Edit</button></li>
      <li><button onclick={() => console.log('Delete')}>Delete</button></li>
    </ul>
  {/if}
</div>`}
  lang="svelte"
/>

<h3>Modal Dialog</h3>

<CodeBlock
  code={`<script>
  import { clickOutside, escapeKey } from '@miozu/jera';

  let { open = $bindable(false) } = $props();
</script>

{#if open}
  <div class="modal-backdrop">
    <div
      class="modal-content"
      use:clickOutside={() => open = false}
      use:escapeKey={() => open = false}
    >
      <h2>Modal Title</h2>
      <p>Modal content...</p>
      <button onclick={() => open = false}>Close</button>
    </div>
  </div>
{/if}`}
  lang="svelte"
/>

<h3>Search with Suggestions</h3>

<CodeBlock
  code={`<script>
  import { clickOutside } from '@miozu/jera';

  let query = $state('');
  let showSuggestions = $state(false);
</script>

<div use:clickOutside={() => showSuggestions = false}>
  <input
    bind:value={query}
    onfocus={() => showSuggestions = true}
    placeholder="Search..."
  />

  {#if showSuggestions && query.length > 0}
    <ul class="suggestions">
      {#each filteredResults as result}
        <li onclick={() => selectResult(result)}>
          {result.name}
        </li>
      {/each}
    </ul>
  {/if}
</div>`}
  lang="svelte"
/>

<h2>API</h2>

<div class="api-section">
  <h3>clickOutside(node, callback)</h3>

  <div class="param">
    <code>node</code>
    <span>HTMLElement</span>
    <p>The element to watch (provided by Svelte)</p>
  </div>

  <div class="param">
    <code>callback</code>
    <span>() =&gt; void</span>
    <p>Function called when clicking outside</p>
  </div>

  <h4>Returns</h4>

  <div class="param">
    <code>update(newCallback)</code>
    <p>Update the callback function</p>
  </div>

  <div class="param">
    <code>destroy()</code>
    <p>Cleanup event listener</p>
  </div>
</div>

<h2>Tips</h2>

<ul>
  <li><strong>Wrap parent element</strong> - Apply to the container, not individual items</li>
  <li><strong>Combine with escapeKey</strong> - For complete modal/dropdown accessibility</li>
  <li><strong>Use with portals</strong> - Works correctly even with portaled content</li>
</ul>

<style>
  .api-section {
    margin: 1.5rem 0;
    padding: 1rem;
    background: var(--color-base1);
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
    color: var(--color-base4);
  }

  .param p {
    width: 100%;
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
  }
</style>

<script>
  import {CodeBlock} from '$lib/components/docs';
</script>

<h1>focusTrap</h1>

<p class="lead">
  Traps keyboard focus within an element. Essential for accessible modals and dialogs.
</p>

<h2>Usage</h2>

<CodeBlock
  code={`<script>
  import { focusTrap } from '@miozu/jera';

  let isOpen = $state(false);
</script>

<dialog use:focusTrap={{ enabled: isOpen }} open={isOpen}>
  <h2>Modal Title</h2>
  <input type="text" placeholder="First input" />
  <input type="text" placeholder="Second input" />
  <button onclick={() => isOpen = false}>Close</button>
</dialog>`}
  lang="svelte"
/>

<h2>How It Works</h2>

<ol>
  <li>Finds all focusable elements within the container</li>
  <li>Intercepts Tab/Shift+Tab keydown events</li>
  <li>Wraps focus from last element to first (and vice versa)</li>
  <li>Optionally sets initial focus on mount</li>
</ol>

<h2>Options</h2>

<div class="options-table">
  <div class="option-row">
    <code>enabled</code>
    <span class="type">boolean</span>
    <span class="default">true</span>
    <span>Whether focus trap is active</span>
  </div>
  <div class="option-row">
    <code>initialFocus</code>
    <span class="type">string</span>
    <span class="default">undefined</span>
    <span>CSS selector for initial focus target</span>
  </div>
</div>

<h2>Examples</h2>

<h3>Modal with Initial Focus</h3>

<CodeBlock
  code={`<script>
  import { focusTrap, escapeKey, clickOutside } from '@miozu/jera';

  let isOpen = $state(false);
</script>

{#if isOpen}
  <div class="backdrop" use:escapeKey={() => isOpen = false}>
    <div
      class="modal"
      role="dialog"
      aria-modal="true"
      use:focusTrap={{ enabled: true, initialFocus: '[data-autofocus]' }}
      use:clickOutside={() => isOpen = false}
    >
      <h2>Confirm Action</h2>
      <p>Are you sure you want to proceed?</p>

      <div class="actions">
        <button onclick={() => isOpen = false}>Cancel</button>
        <button data-autofocus onclick={handleConfirm}>Confirm</button>
      </div>
    </div>
  </div>
{/if}`}
  lang="svelte"
/>

<h3>Dynamically Enable/Disable</h3>

<CodeBlock
  code={`<script>
  let menuOpen = $state(false);
</script>

<!-- Focus trap updates when menuOpen changes -->
<nav use:focusTrap={{ enabled: menuOpen }}>
  <button onclick={() => menuOpen = false}>Close</button>
  <a href="/home">Home</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</nav>`}
  lang="svelte"
/>

<h2>Focusable Elements</h2>

<p>The action considers these elements focusable:</p>

<ul>
  <li><code>a[href]</code> - Links with href attribute</li>
  <li><code>button:not([disabled])</code> - Enabled buttons</li>
  <li><code>input:not([disabled])</code> - Enabled inputs</li>
  <li><code>select:not([disabled])</code> - Enabled selects</li>
  <li><code>textarea:not([disabled])</code> - Enabled textareas</li>
  <li><code>[tabindex]:not([tabindex="-1"])</code> - Elements with positive tabindex</li>
</ul>

<h2>Accessibility Best Practices</h2>

<ul>
  <li><strong>Always use with modals</strong> - Required by WCAG 2.1</li>
  <li><strong>Set role="dialog"</strong> - Announce as dialog to screen readers</li>
  <li><strong>Add aria-modal="true"</strong> - Indicates modal nature</li>
  <li><strong>Combine with escapeKey</strong> - Allow keyboard dismissal</li>
  <li><strong>Return focus on close</strong> - Focus the trigger element after closing</li>
</ul>

<h3>Complete Accessible Modal</h3>

<CodeBlock
  code={`<script>
  import { focusTrap, escapeKey } from '@miozu/jera';

  let isOpen = $state(false);
  let triggerRef = $state(null);

  function open() {
    isOpen = true;
  }

  function close() {
    isOpen = false;
    // Return focus to trigger
    triggerRef?.focus();
  }
</script>

<button bind:this={triggerRef} onclick={open}>
  Open Modal
</button>

{#if isOpen}
  <div class="backdrop">
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      use:focusTrap={{ enabled: true }}
      use:escapeKey={close}
    >
      <h2 id="modal-title">Modal Title</h2>
      <p>Content here...</p>
      <button onclick={close}>Close</button>
    </div>
  </div>
{/if}`}
  lang="svelte"
/>

<style>
  .options-table {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 1.5rem 0;
    padding: 1rem;
    background: var(--color-base01);
    border-radius: 0.5rem;
  }

  .option-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--color-border);
  }

  .option-row:last-child {
    border-bottom: none;
  }

  .option-row code {
    min-width: 6rem;
    color: var(--color-primary);
  }

  .type {
    font-size: 0.8125rem;
    font-family: var(--font-mono);
    color: var(--color-base04);
    min-width: 5rem;
  }

  .default {
    font-size: 0.8125rem;
    color: var(--color-base04);
    min-width: 5rem;
  }
</style>

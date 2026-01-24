<script>
  import {CodeBlock, PropsTable} from '$lib/components/docs';
  import {Button} from '@miozu/jera';

  const controllerMethods = [
    {name: 'show(options)', type: 'string', description: 'Show a toast, returns toast ID'},
    {name: 'info(message, options?)', type: 'string', description: 'Show info toast'},
    {name: 'success(message, options?)', type: 'string', description: 'Show success toast'},
    {name: 'warning(message, options?)', type: 'string', description: 'Show warning toast'},
    {name: 'error(message, options?)', type: 'string', description: 'Show error toast'},
    {name: 'dismiss(id)', type: 'void', description: 'Dismiss a specific toast'},
    {name: 'dismissAll()', type: 'void', description: 'Dismiss all toasts'},
    {name: 'pause(id)', type: 'void', description: 'Pause auto-dismiss timer'},
    {name: 'resume(id)', type: 'void', description: 'Resume auto-dismiss timer'}
  ];

  const toastOptions = [
    {name: 'message', type: 'string', required: true, description: 'Toast message content'},
    {name: 'type', type: "'info' | 'success' | 'warning' | 'error'", default: "'info'", description: 'Toast type/color'},
    {name: 'title', type: 'string', description: 'Optional title above message'},
    {name: 'duration', type: 'number', default: '4000', description: 'Auto-dismiss delay in ms (0 to disable)'}
  ];

  const setupCode = `<!-- In +layout.svelte -->
<script>
  import { Toast, createToastContext } from '@miozu/jera';
  import { onMount } from 'svelte';

  // Create and provide toast context
  const toast = createToastContext();

  let { children } = $props();
<\/script>

<!-- Render toast container (uses portal) -->
<Toast />

{@render children()}`;

  const usageCode = `<script>
  import { getToastContext } from '@miozu/jera';

  // Get toast controller from context
  const toast = getToastContext();

  function handleSave() {
    // Show different toast types
    toast.success('Changes saved!');
    toast.error('Failed to save');
    toast.warning('Connection unstable');
    toast.info('New update available');
  }

  function handleCustom() {
    // Custom toast with title
    toast.show({
      type: 'success',
      title: 'Order Confirmed',
      message: 'Your order #1234 has been placed',
      duration: 6000
    });
  }
<\/script>`;

  const positionsCode = `// In your layout or provider
const toast = createToastContext();

// Set position (default: 'bottom-right')
toast.position = 'top-center';

// Available positions:
// 'top-left', 'top-center', 'top-right'
// 'bottom-left', 'bottom-center', 'bottom-right'`;

  const dismissCode = `// Dismiss specific toast
const id = toast.success('Processing...');
// Later...
toast.dismiss(id);

// Dismiss all toasts
toast.dismissAll();`;
</script>

<h1>Toast</h1>

<p class="lead">
  A notification system for showing brief messages with auto-dismiss and stacking.
</p>

<h2>Setup</h2>

<p>
  Toast requires a context provider in your root layout and the Toast component to render notifications.
</p>

<CodeBlock code={setupCode} lang="svelte" />

<h2>Usage</h2>

<CodeBlock code={usageCode} lang="svelte" />

<h2>Toast Types</h2>

<div class="toast-demos">
  <div class="toast-demo toast-info">
    <span class="toast-icon">ℹ</span>
    <span>Info - Neutral information</span>
  </div>
  <div class="toast-demo toast-success">
    <span class="toast-icon">✓</span>
    <span>Success - Action completed</span>
  </div>
  <div class="toast-demo toast-warning">
    <span class="toast-icon">⚠</span>
    <span>Warning - Attention needed</span>
  </div>
  <div class="toast-demo toast-error">
    <span class="toast-icon">✕</span>
    <span>Error - Something failed</span>
  </div>
</div>

<h2>ToastController API</h2>

<h3>Methods</h3>

<PropsTable props={controllerMethods} />

<h3>Toast Options</h3>

<PropsTable props={toastOptions} />

<h2>Positioning</h2>

<CodeBlock code={positionsCode} lang="javascript" />

<div class="position-grid">
  {#each ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'] as pos}
    <div class="position-item">
      <code>{pos}</code>
    </div>
  {/each}
</div>

<h2>Dismissing Toasts</h2>

<CodeBlock code={dismissCode} lang="javascript" />

<h2>Features</h2>

<ul>
  <li><strong>Auto-dismiss</strong> - Toasts disappear after duration (default 4s)</li>
  <li><strong>Pause on hover</strong> - Timer pauses when mouse enters toast</li>
  <li><strong>Stacking</strong> - Multiple toasts stack with max limit (default 5)</li>
  <li><strong>Portal rendering</strong> - Toasts render at document body level</li>
  <li><strong>Animations</strong> - Smooth enter/exit transitions</li>
  <li><strong>Accessibility</strong> - Uses <code>role="alert"</code> and <code>aria-live</code></li>
</ul>

<h2>Configuration</h2>

<CodeBlock
  code={`// Configure defaults
const toast = createToastContext();
toast.defaultDuration = 5000;  // 5 seconds
toast.maxToasts = 3;           // Max visible toasts
toast.position = 'top-right';  // Position`}
  lang="javascript"
/>

<style>
  .toast-demos {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin: 1.5rem 0;
  }

  .toast-demo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
  }

  .toast-icon {
    font-size: 1rem;
  }

  .toast-info {
    background: var(--color-base01);
    border: 1px solid var(--color-border);
    color: var(--color-base05);
  }

  .toast-success {
    background: rgba(109, 214, 114, 0.1);
    border: 1px solid rgba(109, 214, 114, 0.3);
    color: #6DD672;
  }

  .toast-warning {
    background: rgba(232, 209, 118, 0.1);
    border: 1px solid rgba(232, 209, 118, 0.3);
    color: #E8D176;
  }

  .toast-error {
    background: rgba(235, 49, 55, 0.1);
    border: 1px solid rgba(235, 49, 55, 0.3);
    color: #EB3137;
  }

  .position-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    margin: 1.5rem 0;
    padding: 1rem;
    background: var(--color-base01);
    border-radius: 0.5rem;
  }

  .position-item {
    padding: 0.5rem;
    text-align: center;
    background: var(--color-base02);
    border-radius: 0.25rem;
    font-size: 0.75rem;
  }
</style>

<script>
  import {CodeBlock, PropsTable} from '$lib/components/docs';
  import {Button, Modal} from '@miozu/jera';

  let showBasic = $state(false);
  let showDanger = $state(false);
  let showWithIcon = $state(false);

  const props = [
    {name: 'open', type: 'boolean', default: 'false', description: 'Controls modal visibility (bindable)'},
    {name: 'title', type: 'string', default: "''", description: 'Modal title text'},
    {name: 'size', type: "'sm' | 'md' | 'lg' | 'xl' | 'full'", default: "'md'", description: 'Modal width'},
    {name: 'variant', type: "'default' | 'danger' | 'warning' | 'success' | 'info'", default: "'default'", description: 'Color variant for icon container'},
    {name: 'closeOnBackdrop', type: 'boolean', default: 'true', description: 'Close when clicking backdrop'},
    {name: 'closeOnEscape', type: 'boolean', default: 'true', description: 'Close when pressing Escape'},
    {name: 'showClose', type: 'boolean', default: 'true', description: 'Show close button'},
    {name: 'children', type: 'Snippet', description: 'Modal body content'},
    {name: 'footer', type: 'Snippet', description: 'Footer actions (buttons)'},
    {name: 'icon', type: 'Snippet', description: 'Custom icon in header'},
    {name: 'onclose', type: 'function', description: 'Called when modal closes'}
  ];

  const basicCode = `<script>
  import { Modal, Button } from '@miozu/jera';
  let showModal = $state(false);
<\/script>

<Button onclick={() => showModal = true}>Open Modal</Button>

<Modal bind:open={showModal} title="Welcome">
  <p>This is a basic modal dialog.</p>
  {#snippet footer()}
    <Button variant="ghost" onclick={() => showModal = false}>Cancel</Button>
    <Button variant="primary" onclick={() => showModal = false}>Continue</Button>
  {/snippet}
</Modal>`;

  const dangerCode = `<Modal
  bind:open={showDanger}
  title="Delete Item"
  variant="danger"
>
  <p>Are you sure you want to delete this item? This action cannot be undone.</p>
  {#snippet footer()}
    <Button variant="ghost" onclick={() => showDanger = false}>Cancel</Button>
    <Button variant="danger" onclick={handleDelete}>Delete</Button>
  {/snippet}
</Modal>`;

  const sizesCode = `<!-- Small modal -->
<Modal size="sm" title="Small">...</Modal>

<!-- Default (medium) -->
<Modal size="md" title="Medium">...</Modal>

<!-- Large -->
<Modal size="lg" title="Large">...</Modal>

<!-- Extra large -->
<Modal size="xl" title="Extra Large">...</Modal>

<!-- Full screen -->
<Modal size="full" title="Full Screen">...</Modal>`;
</script>

<h1>Modal</h1>

<p class="lead">
  A flexible dialog component with backdrop, focus trap, and keyboard support.
</p>

<h2>Basic Usage</h2>

<div class="demo">
  <Button onclick={() => showBasic = true}>Open Modal</Button>
</div>

<Modal bind:open={showBasic} title="Welcome to Jera">
  <p>This is a basic modal dialog with title and footer actions.</p>
  {#snippet footer()}
    <Button variant="ghost" onclick={() => showBasic = false}>Cancel</Button>
    <Button variant="primary" onclick={() => showBasic = false}>Continue</Button>
  {/snippet}
</Modal>

<CodeBlock code={basicCode} lang="svelte" />

<h2>Danger Variant</h2>

<p>
  Use the <code>variant</code> prop to change the modal's appearance for different contexts.
</p>

<div class="demo">
  <Button variant="danger" onclick={() => showDanger = true}>Delete Item</Button>
</div>

<Modal bind:open={showDanger} title="Delete Item" variant="danger">
  <p>Are you sure you want to delete this item? This action cannot be undone.</p>
  {#snippet footer()}
    <Button variant="ghost" onclick={() => showDanger = false}>Cancel</Button>
    <Button variant="danger" onclick={() => showDanger = false}>Delete</Button>
  {/snippet}
</Modal>

<CodeBlock code={dangerCode} lang="svelte" />

<h2>Sizes</h2>

<CodeBlock code={sizesCode} lang="svelte" />

<h2>Features</h2>

<ul>
  <li><strong>Focus Trap</strong> - Keyboard focus is trapped within the modal</li>
  <li><strong>Escape Key</strong> - Press Escape to close (configurable)</li>
  <li><strong>Backdrop Click</strong> - Click outside to close (configurable)</li>
  <li><strong>Portal</strong> - Renders at document body level</li>
  <li><strong>Animations</strong> - Smooth enter/exit transitions</li>
  <li><strong>Accessibility</strong> - Proper ARIA attributes and roles</li>
</ul>

<h2>Props</h2>

<PropsTable {props} />

<style>
  .demo {
    padding: 2rem;
    background: var(--color-base01);
    border-radius: 0.5rem;
    margin: 1.5rem 0;
    display: flex;
    gap: 1rem;
  }
</style>

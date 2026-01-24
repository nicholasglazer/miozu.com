<script>
  import {CodeBlock, PropsTable} from '$lib/components/docs';
  import {Tabs} from '@miozu/jera';

  let activeTab = $state('overview');
  let underlineTab = $state('home');
  let pillsTab = $state('all');

  const props = [
    {name: 'tabs', type: 'Array<{id, label, icon?, badge?, disabled?}>', required: true, description: 'Tab configuration array'},
    {name: 'active', type: 'string', description: 'Active tab ID (bindable)'},
    {name: 'variant', type: "'default' | 'underline' | 'pills'", default: "'default'", description: 'Visual style'},
    {name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Tab size'},
    {name: 'fullWidth', type: 'boolean', default: 'false', description: 'Stretch to fill container'},
    {name: 'onchange', type: 'function', description: 'Called when tab changes'}
  ];

  const basicCode = `<script>
  import { Tabs } from '@miozu/jera';
  let activeTab = $state('overview');
<\/script>

<Tabs
  tabs={[
    { id: 'overview', label: 'Overview' },
    { id: 'settings', label: 'Settings' },
    { id: 'analytics', label: 'Analytics' }
  ]}
  bind:active={activeTab}
/>`;

  const variantsCode = `<!-- Default -->
<Tabs variant="default" tabs={...} />

<!-- Underline -->
<Tabs variant="underline" tabs={...} />

<!-- Pills -->
<Tabs variant="pills" tabs={...} />`;

  const badgesCode = `<Tabs
  tabs={[
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread', badge: 5 },
    { id: 'archived', label: 'Archived', disabled: true }
  ]}
/>`;
</script>

<h1>Tabs</h1>

<p class="lead">
  Tabbed navigation component with keyboard support.
</p>

<h2>Basic Usage</h2>

<div class="demo">
  <Tabs
    tabs={[
      { id: 'overview', label: 'Overview' },
      { id: 'settings', label: 'Settings' },
      { id: 'analytics', label: 'Analytics' }
    ]}
    bind:active={activeTab}
  />
  <div class="tab-content">
    Active: <code>{activeTab}</code>
  </div>
</div>

<CodeBlock code={basicCode} lang="svelte" />

<h2>Variants</h2>

<div class="demo demo-stack">
  <div>
    <span class="variant-label">Default</span>
    <Tabs
      tabs={[
        { id: 'home', label: 'Home' },
        { id: 'profile', label: 'Profile' },
        { id: 'messages', label: 'Messages' }
      ]}
    />
  </div>

  <div>
    <span class="variant-label">Underline</span>
    <Tabs
      variant="underline"
      tabs={[
        { id: 'home', label: 'Home' },
        { id: 'profile', label: 'Profile' },
        { id: 'messages', label: 'Messages' }
      ]}
      bind:active={underlineTab}
    />
  </div>

  <div>
    <span class="variant-label">Pills</span>
    <Tabs
      variant="pills"
      tabs={[
        { id: 'all', label: 'All' },
        { id: 'active', label: 'Active' },
        { id: 'completed', label: 'Completed' }
      ]}
      bind:active={pillsTab}
    />
  </div>
</div>

<CodeBlock code={variantsCode} lang="svelte" />

<h2>With Badges</h2>

<div class="demo">
  <Tabs
    tabs={[
      { id: 'all', label: 'All' },
      { id: 'unread', label: 'Unread', badge: 5 },
      { id: 'archived', label: 'Archived', disabled: true }
    ]}
  />
</div>

<CodeBlock code={badgesCode} lang="svelte" />

<h2>Full Width</h2>

<div class="demo">
  <Tabs
    fullWidth
    tabs={[
      { id: 'tab1', label: 'First' },
      { id: 'tab2', label: 'Second' },
      { id: 'tab3', label: 'Third' }
    ]}
  />
</div>

<h2>Keyboard Navigation</h2>

<ul>
  <li><kbd>ArrowLeft</kbd> / <kbd>ArrowRight</kbd> - Navigate between tabs</li>
  <li><kbd>Home</kbd> - Go to first tab</li>
  <li><kbd>End</kbd> - Go to last tab</li>
</ul>

<h2>Props</h2>

<PropsTable {props} />

<style>
  .demo {
    padding: 1.5rem;
    background: var(--color-base01);
    border-radius: 0.5rem;
    margin: 1.5rem 0;
  }

  .demo-stack {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .tab-content {
    margin-top: 1rem;
    padding: 1rem;
    background: var(--color-base02);
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: var(--color-base05);
  }

  .variant-label {
    display: block;
    font-size: 0.75rem;
    color: var(--color-base04);
    margin-bottom: 0.5rem;
  }

  kbd {
    display: inline-block;
    padding: 0.125rem 0.375rem;
    font-size: 0.75rem;
    font-family: monospace;
    background: var(--color-base02);
    border: 1px solid var(--color-border);
    border-radius: 0.25rem;
  }
</style>

<script>
  import {ComponentPlayground, PropsTable, CodeBlock} from '$lib/components/docs';
  import {Badge} from '@miozu/jera';

  // Playground state
  let variant = $state('default');
  let size = $state('md');

  const variants = ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info'];
  const sizes = ['sm', 'md', 'lg'];

  const props = [
    {name: 'variant', type: "'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'", default: "'default'", description: 'Visual style of the badge'},
    {name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the badge'},
    {name: 'class', type: 'string', default: "''", description: 'Additional CSS classes'}
  ];

  const basicCode = `<script>
  import { Badge } from '@miozu/jera';
<\/script>

<Badge>Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="error">Error</Badge>`;

  const variantsCode = `<Badge variant="default">Default</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="info">Info</Badge>`;

  const sizesCode = `<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>`;
</script>

<h1>Badge</h1>

<p class="lead">
  A small status indicator for labeling and categorization.
  Perfect for tags, statuses, and notifications.
</p>

<h2>Interactive Playground</h2>

<ComponentPlayground
  title="Badge"
  description="Try different variants and sizes"
  code={`<Badge variant="${variant}" size="${size}">
  Badge
</Badge>`}
>
  {#snippet children()}
    <Badge {variant} {size}>Badge</Badge>
  {/snippet}

  {#snippet controls()}
    <div class="control">
      <label for="variant">Variant</label>
      <select id="variant" bind:value={variant}>
        {#each variants as v}
          <option value={v}>{v}</option>
        {/each}
      </select>
    </div>

    <div class="control">
      <label for="size">Size</label>
      <select id="size" bind:value={size}>
        {#each sizes as s}
          <option value={s}>{s}</option>
        {/each}
      </select>
    </div>
  {/snippet}
</ComponentPlayground>

<h2>Props</h2>

<PropsTable {props} />

<h2>Examples</h2>

<h3>Basic Usage</h3>

<CodeBlock code={basicCode} lang="svelte" />

<h3>All Variants</h3>

<div class="example-row">
  {#each variants as v}
    <Badge variant={v}>{v}</Badge>
  {/each}
</div>

<CodeBlock code={variantsCode} lang="svelte" />

<h3>Sizes</h3>

<div class="example-row">
  {#each sizes as s}
    <Badge size={s}>{s}</Badge>
  {/each}
</div>

<CodeBlock code={sizesCode} lang="svelte" />

<h2>Use Cases</h2>

<ul>
  <li><strong>Status indicators</strong> - Active, Pending, Error states</li>
  <li><strong>Tags and labels</strong> - Categories, types, filters</li>
  <li><strong>Notifications</strong> - Counts, new items</li>
  <li><strong>Feature flags</strong> - Beta, New, Pro labels</li>
</ul>

<style>
  .example-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin: 1.5rem 0;
    padding: 1.5rem;
    background: var(--color-base01);
    border-radius: var(--radius-md, 0.5rem);
    align-items: center;
  }

  .control {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .control label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-base04);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .control select {
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm, 0.25rem);
    background: var(--color-base00);
    color: var(--color-base05);
    font-size: 0.875rem;
  }
</style>

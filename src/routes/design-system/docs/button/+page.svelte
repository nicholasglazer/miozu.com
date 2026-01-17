<script>
  import {ComponentPlayground, PropsTable, CodeBlock} from '$lib/components/docs';
  import {Button} from '@miozu/jera';

  // Playground state
  let variant = $state('primary');
  let size = $state('md');
  let disabled = $state(false);
  let loading = $state(false);
  let fullWidth = $state(false);

  const variants = ['primary', 'secondary', 'ghost', 'outline', 'danger', 'success'];
  const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];

  const props = [
    {name: 'variant', type: "'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'success'", default: "'primary'", description: 'Visual style of the button'},
    {name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Size of the button'},
    {name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button'},
    {name: 'loading', type: 'boolean', default: 'false', description: 'Shows loading spinner and disables interaction'},
    {name: 'fullWidth', type: 'boolean', default: 'false', description: 'Makes button expand to full width'},
    {name: 'href', type: 'string', default: '-', description: 'If provided, renders as an anchor element'},
    {name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: 'Button type attribute'},
    {name: 'onclick', type: 'function', default: '-', description: 'Click handler'},
    {name: 'iconLeft', type: 'Snippet', default: '-', description: 'Icon slot before content'},
    {name: 'iconRight', type: 'Snippet', default: '-', description: 'Icon slot after content'}
  ];

  const basicCode = `<script>
  import { Button } from '@miozu/jera';
<\/script>

<Button>Click me</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>`;

  const variantsCode = `<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="outline">Outline</Button>
<Button variant="danger">Danger</Button>
<Button variant="success">Success</Button>`;

  const sizesCode = `<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>`;

  const statesCode = `<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>`;

  const linkCode = `<Button href="/about">Navigate</Button>
<Button href="https://example.com" target="_blank">
  External Link
</Button>`;
</script>

<h1>Button</h1>

<p class="lead">
  A polymorphic button component with variants, sizes, and loading states.
  Renders as a button or anchor depending on props.
</p>

<h2>Interactive Playground</h2>

<ComponentPlayground
  title="Button"
  description="Try different variants and sizes"
  code={`<Button variant="${variant}" size="${size}"${disabled ? ' disabled' : ''}${loading ? ' loading' : ''}${fullWidth ? ' fullWidth' : ''}>
  Button
</Button>`}
>
  {#snippet children()}
    <Button {variant} {size} {disabled} {loading} {fullWidth}>
      Button
    </Button>
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

    <div class="control-row">
      <label>
        <input type="checkbox" bind:checked={disabled} />
        Disabled
      </label>
    </div>

    <div class="control-row">
      <label>
        <input type="checkbox" bind:checked={loading} />
        Loading
      </label>
    </div>

    <div class="control-row">
      <label>
        <input type="checkbox" bind:checked={fullWidth} />
        Full Width
      </label>
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
    <Button variant={v}>{v}</Button>
  {/each}
</div>

<CodeBlock code={variantsCode} lang="svelte" />

<h3>Sizes</h3>

<div class="example-row">
  {#each sizes as s}
    <Button size={s}>{s}</Button>
  {/each}
</div>

<CodeBlock code={sizesCode} lang="svelte" />

<h3>States</h3>

<div class="example-row">
  <Button loading>Loading...</Button>
  <Button disabled>Disabled</Button>
</div>

<CodeBlock code={statesCode} lang="svelte" />

<h3>As Link</h3>

<p>When <code>href</code> is provided, Button renders as an anchor element:</p>

<div class="example-row">
  <Button href="#link-example">Internal Link</Button>
</div>

<CodeBlock code={linkCode} lang="svelte" />

<h2>Accessibility</h2>

<ul>
  <li>Uses native <code>&lt;button&gt;</code> element by default</li>
  <li>Supports <code>disabled</code> state with proper ARIA</li>
  <li>Loading state sets <code>aria-busy="true"</code></li>
  <li>Link buttons include <code>role="button"</code></li>
  <li>Focus ring visible for keyboard navigation</li>
</ul>

<style>
  .example-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin: 1.5rem 0;
    padding: 1.5rem;
    background: var(--color-base1);
    border-radius: var(--radius-md, 0.5rem);
  }

  .control {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .control label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-base4);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .control select {
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm, 0.25rem);
    background: var(--color-base0);
    color: var(--color-base5);
    font-size: 0.875rem;
  }

  .control-row {
    display: flex;
    align-items: center;
  }

  .control-row label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: var(--color-base5);
    cursor: pointer;
  }

  .control-row input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
    accent-color: var(--color-base14);
  }
</style>

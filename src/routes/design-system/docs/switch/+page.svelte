<script>
  import {ComponentPlayground, PropsTable, CodeBlock} from '$lib/components/docs';
  import {Switch} from '@miozu/jera';

  let checked = $state(false);
  let size = $state('md');
  let disabled = $state(false);

  const sizes = ['sm', 'md', 'lg'];

  const props = [
    {name: 'checked', type: 'boolean', default: 'false', description: 'Switch state (bindable)'},
    {name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the switch'},
    {name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the switch'},
    {name: 'name', type: 'string', default: "''", description: 'Form field name'},
    {name: 'id', type: 'string', default: '-', description: 'Custom ID (auto-generated if not provided)'},
    {name: 'onchange', type: 'function', default: '-', description: 'Change event handler'}
  ];
</script>

<h1>Switch</h1>

<p class="lead">
  An accessible toggle switch for boolean values, perfect for settings and preferences.
</p>

<h2>Interactive Playground</h2>

<ComponentPlayground
  title="Switch"
  description="Toggle the switch state"
  code={`<Switch bind:checked size="${size}"${disabled ? ' disabled' : ''}>
  Enable notifications
</Switch>`}
>
  {#snippet children()}
    <Switch bind:checked {size} {disabled}>
      Enable notifications
    </Switch>
  {/snippet}

  {#snippet controls()}
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

    <div class="value-display">
      Checked: <code>{checked}</code>
    </div>
  {/snippet}
</ComponentPlayground>

<h2>Props</h2>

<PropsTable {props} />

<h2>Examples</h2>

<h3>Basic Usage</h3>

<CodeBlock
  code={`<script>
  import { Switch } from '@miozu/jera';
  let enabled = $state(false);
</script>

<Switch bind:checked={enabled}>
  Enable notifications
</Switch>`}
  lang="svelte"
/>

<h3>Sizes</h3>

<div class="example-row">
  <Switch size="sm">Small</Switch>
  <Switch size="md">Medium</Switch>
  <Switch size="lg">Large</Switch>
</div>

<CodeBlock
  code={`<Switch size="sm">Small</Switch>
<Switch size="md">Medium</Switch>
<Switch size="lg">Large</Switch>`}
  lang="svelte"
/>

<h3>Without Label</h3>

<CodeBlock
  code={`<Switch bind:checked={darkMode} />`}
  lang="svelte"
/>

<style>
  .example-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
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

  .control-row {
    display: flex;
    align-items: center;
  }

  .control-row label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: var(--color-base05);
    cursor: pointer;
  }

  .control-row input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
    accent-color: var(--color-base0E);
  }

  .value-display {
    padding-top: 0.75rem;
    font-size: 0.75rem;
    color: var(--color-base04);
    border-top: 1px solid var(--color-border);
  }

  .value-display code {
    color: var(--color-base0E);
  }
</style>

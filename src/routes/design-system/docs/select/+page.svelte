<script>
  import {ComponentPlayground, PropsTable, CodeBlock} from '$lib/components/docs';
  import {Select} from '@miozu/jera';

  let value = $state(null);
  let disabled = $state(false);
  let error = $state(false);

  const options = [
    {value: 'react', label: 'React'},
    {value: 'vue', label: 'Vue'},
    {value: 'svelte', label: 'Svelte'},
    {value: 'angular', label: 'Angular'},
    {value: 'solid', label: 'SolidJS'}
  ];

  const props = [
    {name: 'options', type: 'Array<{value, label}>', required: true, description: 'Array of options to display'},
    {name: 'value', type: 'any', default: 'null', description: 'Selected value (bindable)'},
    {name: 'placeholder', type: 'string', default: "'Select...'", description: 'Placeholder text when no value selected'},
    {name: 'labelKey', type: 'string', default: "'label'", description: 'Key to use for option labels'},
    {name: 'valueKey', type: 'string', default: "'value'", description: 'Key to use for option values'},
    {name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the select'},
    {name: 'error', type: 'boolean', default: 'false', description: 'Shows error styling'},
    {name: 'onchange', type: 'function', description: 'Called when selection changes with selected option'}
  ];

  const basicCode = `<script>
  import { Select } from '@miozu/jera';

  let selected = $state(null);

  const options = [
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' },
    { value: 'opt3', label: 'Option 3' }
  ];
<\/script>

<Select {options} bind:value={selected} />`;

  const customKeysCode = `<script>
  import { Select } from '@miozu/jera';

  let selectedId = $state(null);

  // Objects with custom keys
  const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' }
  ];
<\/script>

<Select
  options={users}
  bind:value={selectedId}
  labelKey="name"
  valueKey="id"
  placeholder="Choose a user"
/>`;

  const onchangeCode = `<Select
  {options}
  bind:value={selected}
  onchange={(option) => {
    console.log('Selected:', option);
  }}
/>`;
</script>

<h1>Select</h1>

<p class="lead">
  An accessible dropdown component with full keyboard navigation and ARIA support.
</p>

<h2>Interactive Playground</h2>

<ComponentPlayground
  title="Select"
  description="Try different states and options"
  code={`<Select
  options={options}
  bind:value={value}
  placeholder="Select framework..."
  disabled={${disabled}}
  error={${error}}
/>`}
>
  {#snippet children()}
    <div style="width: 14rem;">
      <Select
        {options}
        bind:value
        placeholder="Select framework..."
        {disabled}
        {error}
      />
    </div>
    {#if value}
      <p style="margin-top: 1rem; font-size: 0.875rem; color: var(--color-base04);">
        Selected: <strong>{value}</strong>
      </p>
    {/if}
  {/snippet}

  {#snippet controls()}
    <div class="control-row">
      <label>
        <input type="checkbox" bind:checked={disabled} />
        Disabled
      </label>
      <label>
        <input type="checkbox" bind:checked={error} />
        Error
      </label>
    </div>
  {/snippet}
</ComponentPlayground>

<h2>Props</h2>

<PropsTable {props} />

<h2>Examples</h2>

<h3>Basic Usage</h3>

<CodeBlock code={basicCode} lang="svelte" />

<h3>Custom Keys</h3>

<p>Use <code>labelKey</code> and <code>valueKey</code> for objects with different property names:</p>

<CodeBlock code={customKeysCode} lang="svelte" />

<h3>Change Handler</h3>

<CodeBlock code={onchangeCode} lang="svelte" />

<h2>Keyboard Navigation</h2>

<div class="keyboard-table">
  <div class="key-row">
    <kbd>Arrow Down</kbd>
    <span>Open dropdown / Move to next option</span>
  </div>
  <div class="key-row">
    <kbd>Arrow Up</kbd>
    <span>Open dropdown / Move to previous option</span>
  </div>
  <div class="key-row">
    <kbd>Enter</kbd>
    <span>Select highlighted option</span>
  </div>
  <div class="key-row">
    <kbd>Space</kbd>
    <span>Select highlighted option</span>
  </div>
  <div class="key-row">
    <kbd>Escape</kbd>
    <span>Close dropdown</span>
  </div>
  <div class="key-row">
    <kbd>Home</kbd>
    <span>Jump to first option</span>
  </div>
  <div class="key-row">
    <kbd>End</kbd>
    <span>Jump to last option</span>
  </div>
  <div class="key-row">
    <kbd>Tab</kbd>
    <span>Close and move focus</span>
  </div>
</div>

<h2>Accessibility</h2>

<ul>
  <li>Uses <code>role="listbox"</code> and <code>role="option"</code></li>
  <li>Proper <code>aria-expanded</code>, <code>aria-haspopup</code>, <code>aria-controls</code></li>
  <li>Active descendant tracking with <code>aria-activedescendant</code></li>
  <li>Auto-scrolls highlighted option into view</li>
  <li>Focus returns to trigger after selection</li>
  <li>Click-outside detection for closing</li>
</ul>

<style>
  .control-row {
    display: flex;
    gap: 1rem;
  }

  .control-row label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    cursor: pointer;
  }

  .keyboard-table {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 1.5rem 0;
    padding: 1rem;
    background: var(--color-base01);
    border-radius: 0.5rem;
  }

  .key-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--color-border);
  }

  .key-row:last-child {
    border-bottom: none;
  }

  kbd {
    display: inline-block;
    min-width: 6rem;
    padding: 0.25rem 0.5rem;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    background: var(--color-base02);
    border: 1px solid var(--color-border);
    border-radius: 0.25rem;
  }
</style>

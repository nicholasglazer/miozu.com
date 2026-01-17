<script>
  import {ComponentPlayground, PropsTable, CodeBlock} from '$lib/components/docs';
  import {Checkbox} from '@miozu/jera';

  let checked = $state(false);
  let disabled = $state(false);

  const props = [
    {name: 'checked', type: 'boolean', default: 'false', description: 'Checkbox state (bindable)'},
    {name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the checkbox'},
    {name: 'required', type: 'boolean', default: 'false', description: 'Mark as required'},
    {name: 'name', type: 'string', default: "''", description: 'Form field name'},
    {name: 'id', type: 'string', default: '-', description: 'Custom ID (auto-generated if not provided)'},
    {name: 'onchange', type: 'function', default: '-', description: 'Change event handler'}
  ];
</script>

<h1>Checkbox</h1>

<p class="lead">
  An accessible checkbox input with custom styling and label support.
</p>

<h2>Interactive Playground</h2>

<ComponentPlayground
  title="Checkbox"
  description="Toggle the checkbox state"
  code={`<Checkbox bind:checked${disabled ? ' disabled' : ''}>
  I agree to the terms
</Checkbox>`}
>
  {#snippet children()}
    <Checkbox bind:checked {disabled}>
      I agree to the terms
    </Checkbox>
  {/snippet}

  {#snippet controls()}
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
  import { Checkbox } from '@miozu/jera';
  let agreed = $state(false);
</script>

<Checkbox bind:checked={agreed}>
  I agree to the terms and conditions
</Checkbox>`}
  lang="svelte"
/>

<h3>Without Label</h3>

<CodeBlock
  code={`<Checkbox bind:checked={selected} />`}
  lang="svelte"
/>

<h3>Disabled State</h3>

<CodeBlock
  code={`<Checkbox checked disabled>
  This option is locked
</Checkbox>`}
  lang="svelte"
/>

<style>
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

  .value-display {
    padding-top: 0.75rem;
    font-size: 0.75rem;
    color: var(--color-base4);
    border-top: 1px solid var(--color-border);
  }

  .value-display code {
    color: var(--color-base14);
  }
</style>

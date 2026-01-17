<script>
  import {ComponentPlayground, PropsTable, CodeBlock} from '$lib/components/docs';
  import {Input} from '@miozu/jera';

  let value = $state('');
  let type = $state('text');
  let disabled = $state(false);
  let error = $state(false);

  const types = ['text', 'email', 'password', 'number', 'search', 'tel', 'url'];

  const props = [
    {name: 'value', type: 'string', default: "''", description: 'Input value (bindable)'},
    {name: 'type', type: 'string', default: "'text'", description: 'HTML input type'},
    {name: 'placeholder', type: 'string', default: '-', description: 'Placeholder text'},
    {name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the input'},
    {name: 'required', type: 'boolean', default: 'false', description: 'Mark as required'},
    {name: 'error', type: 'boolean', default: 'false', description: 'Show error state'},
    {name: 'disableBrowserFeatures', type: 'boolean', default: 'false', description: 'Disable autocomplete/autocapitalize'},
    {name: 'oninput', type: 'function', default: '-', description: 'Input event handler'},
    {name: 'onchange', type: 'function', default: '-', description: 'Change event handler'}
  ];
</script>

<h1>Input</h1>

<p class="lead">
  A styled text input with support for various types, error states, and browser feature control.
</p>

<h2>Interactive Playground</h2>

<ComponentPlayground
  title="Input"
  description="Try different types and states"
  code={`<Input
  bind:value
  type="${type}"
  placeholder="Enter text..."${disabled ? '\n  disabled' : ''}${error ? '\n  error' : ''}
/>`}
>
  {#snippet children()}
    <Input
      bind:value
      {type}
      {disabled}
      {error}
      placeholder="Enter text..."
      style="width: 280px;"
    />
  {/snippet}

  {#snippet controls()}
    <div class="control">
      <label for="type">Type</label>
      <select id="type" bind:value={type}>
        {#each types as t}
          <option value={t}>{t}</option>
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
        <input type="checkbox" bind:checked={error} />
        Error
      </label>
    </div>

    <div class="value-display">
      Value: <code>{value || '(empty)'}</code>
    </div>
  {/snippet}
</ComponentPlayground>

<h2>Props</h2>

<PropsTable {props} />

<h2>Examples</h2>

<h3>Basic Usage</h3>

<CodeBlock
  code={`<script>
  import { Input } from '@miozu/jera';
  let email = $state('');
</script>

<Input bind:value={email} type="email" placeholder="Enter email" />`}
  lang="svelte"
/>

<h3>Password Input</h3>

<CodeBlock
  code={`<Input
  type="password"
  placeholder="Password"
  disableBrowserFeatures
/>`}
  lang="svelte"
/>

<h3>Error State</h3>

<CodeBlock
  code={`<Input
  bind:value={email}
  error={!isValidEmail(email)}
  placeholder="Invalid email"
/>`}
  lang="svelte"
/>

<style>
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

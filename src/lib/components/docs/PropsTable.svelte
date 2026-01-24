<!--
  @component PropsTable

  Display component props in a clean, readable table.
-->
<script>
  /**
   * @typedef {Object} PropDef
   * @property {string} name
   * @property {string} type
   * @property {string} [default]
   * @property {string} description
   * @property {boolean} [required]
   */

  /** @type {{ props: PropDef[], class?: string }} */
  let {
    props = [],
    class: className = ''
  } = $props();
</script>

<div class="props-table-wrapper {className}">
  <table class="props-table">
    <thead>
      <tr>
        <th>Prop</th>
        <th>Type</th>
        <th>Default</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      {#each props as prop}
        <tr>
          <td class="prop-name">
            <code>{prop.name}</code>
            {#if prop.required}
              <span class="required">*</span>
            {/if}
          </td>
          <td class="prop-type">
            <code>{prop.type}</code>
          </td>
          <td class="prop-default">
            {#if prop.default !== undefined}
              <code>{prop.default}</code>
            {:else}
              <span class="muted">-</span>
            {/if}
          </td>
          <td class="prop-desc">{prop.description}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .props-table-wrapper {
    overflow-x: auto;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md, 0.5rem);
  }

  .props-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }

  th {
    text-align: left;
    padding: 0.75rem 1rem;
    background: var(--color-base01);
    border-bottom: 1px solid var(--color-border);
    font-weight: 500;
    color: var(--color-base05);
    white-space: nowrap;
  }

  td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--color-border);
    vertical-align: top;
  }

  tr:last-child td {
    border-bottom: none;
  }

  .prop-name code {
    font-family: var(--font-mono);
    font-weight: 500;
    color: var(--color-base0E);
  }

  .required {
    color: #eb3137;
    margin-left: 0.25rem;
  }

  .prop-type code {
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    color: var(--color-base04);
    background: var(--color-base01);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
  }

  .prop-default code {
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    color: #6dd672;
  }

  .muted {
    color: var(--color-base03);
  }

  .prop-desc {
    color: var(--color-base04);
    line-height: 1.5;
  }
</style>

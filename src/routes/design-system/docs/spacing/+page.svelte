<script>
  import {CodeBlock} from '$lib/components/docs';
</script>

<h1>Spacing</h1>

<p class="lead">
  A consistent 4px-based spacing scale for padding, margins, and gaps.
</p>

<h2>The Scale</h2>

<p>
  All spacing tokens are multiples of 4px, creating visual rhythm and alignment.
</p>

<div class="spacing-grid">
  {#each [
    {name: '--space-0', value: '0', px: '0px'},
    {name: '--space-0-5', value: '0.5', px: '2px'},
    {name: '--space-1', value: '1', px: '4px'},
    {name: '--space-1-5', value: '1.5', px: '6px'},
    {name: '--space-2', value: '2', px: '8px'},
    {name: '--space-3', value: '3', px: '12px'},
    {name: '--space-4', value: '4', px: '16px'},
    {name: '--space-5', value: '5', px: '20px'},
    {name: '--space-6', value: '6', px: '24px'},
    {name: '--space-8', value: '8', px: '32px'},
    {name: '--space-10', value: '10', px: '40px'},
    {name: '--space-12', value: '12', px: '48px'},
    {name: '--space-16', value: '16', px: '64px'},
    {name: '--space-20', value: '20', px: '80px'},
    {name: '--space-24', value: '24', px: '96px'}
  ] as item}
    <div class="spacing-item">
      <div class="spacing-visual" style="width: {item.px}; height: var(--space-4);"></div>
      <code>{item.name}</code>
      <span class="spacing-px">{item.px}</span>
    </div>
  {/each}
</div>

<h2>Usage</h2>

<CodeBlock
  code={`/* Import spacing tokens */
@import '@miozu/jera/tokens/spacing';

/* Use in your styles */
.card {
  padding: var(--space-4);      /* 16px */
  margin-bottom: var(--space-6); /* 24px */
}

.stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);          /* 12px */
}

.container {
  padding: var(--space-6) var(--space-4);  /* 24px 16px */
}`}
  lang="css"
/>

<h2>Common Patterns</h2>

<h3>Component Spacing</h3>

<CodeBlock
  code={`/* Tight spacing (forms, lists) */
gap: var(--space-2);    /* 8px */

/* Default spacing (cards, sections) */
gap: var(--space-4);    /* 16px */

/* Loose spacing (page sections) */
gap: var(--space-8);    /* 32px */`}
  lang="css"
/>

<h3>Page Layout</h3>

<CodeBlock
  code={`/* Section padding */
padding: var(--space-12) var(--space-6);  /* 48px 24px */

/* Container max-width with padding */
max-width: 64rem;
padding-inline: var(--space-4);           /* 16px */

/* Stack sections */
gap: var(--space-16);                     /* 64px */`}
  lang="css"
/>

<h2>Full Scale Reference</h2>

<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Token</th>
        <th>Value</th>
        <th>Pixels</th>
        <th>Use Case</th>
      </tr>
    </thead>
    <tbody>
      <tr><td><code>--space-px</code></td><td>1px</td><td>1px</td><td>Borders, fine details</td></tr>
      <tr><td><code>--space-0</code></td><td>0</td><td>0px</td><td>Reset spacing</td></tr>
      <tr><td><code>--space-1</code></td><td>4px</td><td>4px</td><td>Tight inline spacing</td></tr>
      <tr><td><code>--space-2</code></td><td>8px</td><td>8px</td><td>Form elements, icons</td></tr>
      <tr><td><code>--space-3</code></td><td>12px</td><td>12px</td><td>List items, small cards</td></tr>
      <tr><td><code>--space-4</code></td><td>16px</td><td>16px</td><td>Default component padding</td></tr>
      <tr><td><code>--space-6</code></td><td>24px</td><td>24px</td><td>Card padding, section gaps</td></tr>
      <tr><td><code>--space-8</code></td><td>32px</td><td>32px</td><td>Large component spacing</td></tr>
      <tr><td><code>--space-12</code></td><td>48px</td><td>48px</td><td>Section padding</td></tr>
      <tr><td><code>--space-16</code></td><td>64px</td><td>64px</td><td>Page section gaps</td></tr>
      <tr><td><code>--space-24</code></td><td>96px</td><td>96px</td><td>Hero sections</td></tr>
    </tbody>
  </table>
</div>

<style>
  .spacing-grid {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin: 1.5rem 0;
    padding: 1.5rem;
    background: var(--color-base01);
    border-radius: 0.5rem;
  }

  .spacing-item {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .spacing-visual {
    background: var(--color-primary);
    border-radius: 2px;
    min-width: 4px;
    flex-shrink: 0;
  }

  .spacing-item code {
    font-size: 0.875rem;
    min-width: 10rem;
  }

  .spacing-px {
    color: var(--color-base04);
    font-size: 0.875rem;
  }

  .table-wrapper {
    overflow-x: auto;
    margin: 1.5rem 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }

  th, td {
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid var(--color-border);
  }

  th {
    font-weight: 600;
    color: var(--color-base06);
    background: var(--color-base01);
  }

  td code {
    font-size: 0.8125rem;
    background: var(--color-base01);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
  }
</style>

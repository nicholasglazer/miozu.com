<script>
  import {CodeBlock} from '$lib/components/docs';
</script>

<h1>cv()</h1>

<p class="lead">
  Type-safe class variant composition for building component styling systems.
</p>

<h2>Basic Usage</h2>

<CodeBlock
  code={`import { cv } from '@miozu/jera';

const button = cv({
  base: 'inline-flex items-center justify-center rounded-lg font-medium',

  variants: {
    intent: {
      primary: 'bg-primary text-white',
      secondary: 'bg-surface text-text border border-border',
      ghost: 'bg-transparent hover:bg-hover'
    },
    size: {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-12 px-6 text-lg'
    }
  },

  defaults: {
    intent: 'primary',
    size: 'md'
  }
});

// Usage
button();
// → 'inline-flex items-center... bg-primary text-white h-10 px-4 text-base'

button({ intent: 'secondary', size: 'lg' });
// → 'inline-flex items-center... bg-surface text-text... h-12 px-6 text-lg'`}
  lang="javascript"
/>

<h2>In Components</h2>

<CodeBlock
  code={`<script module>
  import { cv } from '@miozu/jera';

  // Define variants (module scope for reuse)
  export const buttonStyles = cv({
    base: 'btn',
    variants: {
      variant: {
        primary: 'btn-primary',
        secondary: 'btn-secondary'
      },
      size: {
        sm: 'btn-sm',
        md: 'btn-md',
        lg: 'btn-lg'
      }
    },
    defaults: { variant: 'primary', size: 'md' }
  });
</script>

<script>
  let { variant = 'primary', size = 'md', class: className } = $props();

  // Reactive class generation
  const classes = $derived(buttonStyles({ variant, size, class: className }));
</script>

<button class={classes}>
  <slot />
</button>`}
  lang="svelte"
/>

<h2>Compound Variants</h2>

<p>
  Apply additional classes when multiple conditions match:
</p>

<CodeBlock
  code={`const button = cv({
  base: 'btn',

  variants: {
    intent: {
      primary: 'bg-primary',
      danger: 'bg-error'
    },
    size: {
      sm: 'h-8',
      lg: 'h-12'
    }
  },

  // Compound variants
  compounds: [
    {
      condition: { intent: 'danger', size: 'lg' },
      class: 'border-2 border-error shadow-error'
    },
    {
      condition: { intent: 'primary', size: 'sm' },
      class: 'text-xs'
    }
  ],

  defaults: { intent: 'primary', size: 'sm' }
});

// Large danger button gets extra styling
button({ intent: 'danger', size: 'lg' });
// → 'btn bg-error h-12 border-2 border-error shadow-error'`}
  lang="javascript"
/>

<h2>Passing Additional Classes</h2>

<CodeBlock
  code={`// Users can pass extra classes via the class property
button({ intent: 'primary', class: 'mt-4 shadow-lg' });
// → 'btn bg-primary h-10 mt-4 shadow-lg'

// In component props
<Button class="ml-auto" variant="secondary">Save</Button>`}
  lang="javascript"
/>

<h2>API Reference</h2>

<div class="api-section">
  <h3>cv(config)</h3>
  <p>Returns a function that generates class strings based on variant props.</p>

  <h4>Config Options</h4>

  <div class="config-item">
    <code>base</code>
    <span class="type">string | string[]</span>
    <p>Base classes always applied</p>
  </div>

  <div class="config-item">
    <code>variants</code>
    <span class="type">Record&lt;string, Record&lt;string, string&gt;&gt;</span>
    <p>Variant definitions mapping names to class strings</p>
  </div>

  <div class="config-item">
    <code>compounds</code>
    <span class="type">Array&lt;{'{'}condition, class{'}'}&gt;</span>
    <p>Classes applied when multiple conditions match</p>
  </div>

  <div class="config-item">
    <code>defaults</code>
    <span class="type">Record&lt;string, string&gt;</span>
    <p>Default values for each variant</p>
  </div>
</div>

<h2>Pattern: Exporting Styles</h2>

<CodeBlock
  code={`// Button.svelte
<script module>
  // Export for use in other files
  export { buttonStyles } from './styles.js';
</script>

// Usage in another component
import { buttonStyles } from './Button.svelte';

// Extend or customize
const customButton = (props) => buttonStyles({ ...props, class: 'custom' });`}
  lang="svelte"
/>

<h2>Comparison with CVA</h2>

<p>
  <code>cv()</code> is inspired by <a href="https://cva.style" target="_blank">CVA (Class Variance Authority)</a>
  but optimized for Svelte 5:
</p>

<ul>
  <li>Zero dependencies</li>
  <li>Works naturally with <code>$derived</code></li>
  <li>Simpler API (no TypeScript generics needed)</li>
  <li>Uses <code>cn()</code> internally for class merging</li>
</ul>

<style>
  .api-section {
    margin: 1.5rem 0;
  }

  .config-item {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.75rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--color-border);
  }

  .config-item code {
    font-size: 0.9375rem;
    color: var(--color-primary);
  }

  .config-item .type {
    font-size: 0.8125rem;
    font-family: var(--font-mono);
    color: var(--color-base4);
  }

  .config-item p {
    width: 100%;
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
    color: var(--color-base5);
  }
</style>

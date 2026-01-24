<script>
  import {CodeBlock} from '$lib/components/docs';
</script>

<h1>cn()</h1>

<p class="lead">
  A utility for concatenating class names with automatic filtering of falsy values.
</p>

<h2>Basic Usage</h2>

<CodeBlock
  code={`import { cn } from '@miozu/jera';

// Concatenate strings
cn('base', 'additional');
// → 'base additional'

// Filter out falsy values
cn('base', false, null, undefined, 'active');
// → 'base active'

// Conditional classes
const isActive = true;
cn('btn', isActive && 'btn-active');
// → 'btn btn-active'`}
  lang="javascript"
/>

<h2>With Arrays</h2>

<CodeBlock
  code={`// Flatten arrays
cn('base', ['class1', 'class2']);
// → 'base class1 class2'

// Nested arrays work too
cn('a', ['b', ['c', 'd']], 'e');
// → 'a b c d e'`}
  lang="javascript"
/>

<h2>In Svelte Components</h2>

<CodeBlock
  code={`<script>
  import { cn } from '@miozu/jera';

  let { variant = 'default', size = 'md', class: className } = $props();
  let isHovered = $state(false);

  // Reactive class composition with $derived
  const buttonClass = $derived(cn(
    'btn',
    \`btn-\${variant}\`,
    \`btn-\${size}\`,
    isHovered && 'btn-hover',
    className
  ));
</script>

<button class={buttonClass} onmouseenter={() => isHovered = true}>
  Click me
</button>`}
  lang="svelte"
/>

<h2>Related Utilities</h2>

<h3>rcn (alias)</h3>

<p><code>rcn</code> is an alias for <code>cn</code>. Use whichever you prefer:</p>

<CodeBlock
  code={`import { cn, rcn } from '@miozu/jera';

// Both are identical
cn('base', condition && 'active');
rcn('base', condition && 'active');`}
  lang="javascript"
/>

<h3>mergeClasses()</h3>

<p>Semantic helper for combining component classes with user-provided classes:</p>

<CodeBlock
  code={`import { mergeClasses } from '@miozu/jera';

// In a component
const classes = mergeClasses(componentClass, props.class);`}
  lang="javascript"
/>

<h3>when()</h3>

<p>Conditional class helper:</p>

<CodeBlock
  code={`import { when } from '@miozu/jera';

// Returns trueClass if condition is truthy, falseClass otherwise
when(isActive, 'active', 'inactive');
// isActive ? 'active' : 'inactive'

when(disabled, 'opacity-50');
// disabled ? 'opacity-50' : ''`}
  lang="javascript"
/>

<h3>match()</h3>

<p>Switch-based class selection:</p>

<CodeBlock
  code={`import { match } from '@miozu/jera';

// Select class based on value
match(variant, {
  primary: 'bg-primary text-white',
  secondary: 'bg-surface text-text',
  ghost: 'bg-transparent'
}, 'bg-default'); // fallback

// Example: variant = 'secondary'
// → 'bg-surface text-text'`}
  lang="javascript"
/>

<h2>Comparison with Other Libraries</h2>

<div class="comparison">
  <div class="comp-item">
    <code>cn()</code>
    <p>Simple, zero dependencies, perfect for Svelte 5</p>
  </div>
  <div class="comp-item">
    <code>clsx</code>
    <p>Similar API, but cn() is lighter and integrated</p>
  </div>
  <div class="comp-item">
    <code>classnames</code>
    <p>Older alternative, cn() has simpler API</p>
  </div>
</div>

<style>
  .comparison {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 1.5rem 0;
    padding: 1rem;
    background: var(--color-base01);
    border-radius: 0.5rem;
  }

  .comp-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .comp-item p {
    margin: 0;
    font-size: 0.875rem;
    color: var(--color-base04);
  }
</style>

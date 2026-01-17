<script>
  import {CodeBlock} from '$lib/components/docs';
  import {Badge} from '@miozu/jera';
</script>

<h1>Jera</h1>

<p class="lead">
  A minimal, reactive component library for Svelte 5. Built on the Miozu Base16 design system.
</p>

<div class="badges">
  <Badge variant="primary">Svelte 5</Badge>
  <Badge variant="secondary">Base16</Badge>
  <Badge>AI-First</Badge>
</div>

<h2>Features</h2>

<ul>
  <li><strong>Miozu Design Tokens</strong> - Base16 color palette, spacing, typography, effects</li>
  <li><strong>Reactive Utilities</strong> - <code>cn()</code>, <code>cv()</code> for class composition with Svelte 5 runes</li>
  <li><strong>Accessible Components</strong> - Button, Input, Select, Badge, Checkbox, Switch, Toast</li>
  <li><strong>Svelte Actions</strong> - clickOutside, focusTrap, portal, escapeKey, and more</li>
  <li><strong>AI-First Documentation</strong> - Optimized for LLM-assisted development</li>
</ul>

<h2>Quick Start</h2>

<h3>Installation</h3>

<CodeBlock
  code="pnpm add @miozu/jera"
  lang="bash"
/>

<h3>Import Components</h3>

<CodeBlock
  code={`<script>
  import { Button, Input, Badge } from '@miozu/jera';
  import '@miozu/jera/tokens';

  let email = $state('');
</script>

<Input bind:value={email} type="email" placeholder="Enter email" />
<Button onclick={() => console.log(email)}>Submit</Button>
<Badge variant="success">Active</Badge>`}
  lang="svelte"
/>

<h3>Import Tokens</h3>

<p>Import all tokens or pick individual sets:</p>

<CodeBlock
  code={`/* All tokens */
@import '@miozu/jera/tokens';

/* Individual sets */
@import '@miozu/jera/tokens/colors';
@import '@miozu/jera/tokens/spacing';
@import '@miozu/jera/tokens/typography';
@import '@miozu/jera/tokens/effects';`}
  lang="css"
/>

<h2>Design Philosophy</h2>

<p>
  Jera follows the principle of <strong>minimal complexity with maximum utility</strong>.
  Each component is designed to be:
</p>

<ul>
  <li><strong>Simple</strong> - Clean API, sensible defaults</li>
  <li><strong>Accessible</strong> - ARIA attributes, keyboard navigation</li>
  <li><strong>Themeable</strong> - CSS custom properties for easy customization</li>
  <li><strong>AI-friendly</strong> - Well-documented for LLM consumption</li>
</ul>

<h2>Browser Support</h2>

<ul>
  <li>Chrome 88+</li>
  <li>Firefox 78+</li>
  <li>Safari 14+</li>
  <li>Edge 88+</li>
</ul>

<p>Requires Svelte 5.0+</p>

<style>
  .badges {
    display: flex;
    gap: 0.5rem;
    margin: 1.5rem 0;
  }
</style>

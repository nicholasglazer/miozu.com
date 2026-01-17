<script>
  import {CodeBlock} from '$lib/components/docs';
</script>

<h1>Installation</h1>

<p class="lead">
  Get started with jera in your Svelte 5 project.
</p>

<h2>Package Manager</h2>

<CodeBlock code="pnpm add @miozu/jera" lang="bash" />

<p>Or with npm/yarn:</p>

<CodeBlock code={`npm install @miozu/jera
# or
yarn add @miozu/jera`} lang="bash" />

<h2>Requirements</h2>

<ul>
  <li>Svelte 5.0+</li>
  <li>Node.js 18+</li>
</ul>

<h2>Import Components</h2>

<CodeBlock
  code={`<script>
  import { Button, Input, Badge } from '@miozu/jera';
</script>`}
  lang="svelte"
/>

<h2>Import Design Tokens</h2>

<p>Add the CSS tokens to your app's stylesheet:</p>

<CodeBlock
  code={`/* Import all tokens */
@import '@miozu/jera/tokens';

/* Or import individually */
@import '@miozu/jera/tokens/colors';
@import '@miozu/jera/tokens/spacing';
@import '@miozu/jera/tokens/typography';
@import '@miozu/jera/tokens/effects';`}
  lang="css"
/>

<h2>With SvelteKit</h2>

<p>Import tokens in your <code>+layout.svelte</code>:</p>

<CodeBlock
  code={`<!-- src/routes/+layout.svelte -->
<script>
  import '@miozu/jera/tokens';
  import { Button } from '@miozu/jera';
</script>

<slot />
<Button>Hello Jera</Button>`}
  lang="svelte"
/>

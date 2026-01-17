<script>
  import {CodeBlock} from '$lib/components/docs';
</script>

<h1>Theming</h1>

<p class="lead">
  Built-in dark/light theme support with system preference detection and persistence.
</p>

<h2>Quick Setup</h2>

<CodeBlock
  code={`<script>
  import { createThemeContext } from '@miozu/jera';
  import { onMount } from 'svelte';

  // Create and provide theme context in your root layout
  const theme = createThemeContext();

  onMount(() => {
    theme.init();  // Loads from localStorage, detects system preference
    return () => theme.cleanup();  // Cleanup on destroy
  });
</script>`}
  lang="svelte"
/>

<h2>ThemeState API</h2>

<h3>Properties</h3>

<div class="api-table">
  <div class="api-row">
    <code>current</code>
    <span class="api-type">'light' | 'dark' | 'system'</span>
    <span>User's theme preference</span>
  </div>
  <div class="api-row">
    <code>resolved</code>
    <span class="api-type">'light' | 'dark'</span>
    <span>Actual theme (resolved from system if needed)</span>
  </div>
</div>

<h3>Methods</h3>

<div class="api-table">
  <div class="api-row">
    <code>init()</code>
    <span class="api-type">void</span>
    <span>Initialize theme (call in onMount)</span>
  </div>
  <div class="api-row">
    <code>cleanup()</code>
    <span class="api-type">void</span>
    <span>Cleanup listeners (call in onDestroy)</span>
  </div>
  <div class="api-row">
    <code>set(theme)</code>
    <span class="api-type">void</span>
    <span>Set theme and persist to localStorage</span>
  </div>
  <div class="api-row">
    <code>toggle()</code>
    <span class="api-type">void</span>
    <span>Toggle between light and dark</span>
  </div>
</div>

<h2>Using Theme in Components</h2>

<CodeBlock
  code={`<script>
  import { getThemeContext } from '@miozu/jera';

  // Get theme from context (set up in root layout)
  const theme = getThemeContext();
</script>

<!-- Theme toggle button -->
<button onclick={() => theme.toggle()}>
  {theme.resolved === 'dark' ? 'Light' : 'Dark'} Mode
</button>

<!-- Theme selector -->
<select bind:value={theme.current} onchange={() => theme.set(theme.current)}>
  <option value="system">System</option>
  <option value="light">Light</option>
  <option value="dark">Dark</option>
</select>

<!-- Conditional rendering based on theme -->
{#if theme.resolved === 'dark'}
  <DarkIcon />
{:else}
  <LightIcon />
{/if}`}
  lang="svelte"
/>

<h2>How It Works</h2>

<ol>
  <li><strong>Initialization</strong> - Reads from <code>localStorage</code> or defaults to 'system'</li>
  <li><strong>System Detection</strong> - Uses <code>prefers-color-scheme</code> media query</li>
  <li><strong>Persistence</strong> - Saves to both <code>localStorage</code> and cookie</li>
  <li><strong>Application</strong> - Sets <code>data-theme</code> attribute on <code>&lt;html&gt;</code></li>
</ol>

<h2>CSS Integration</h2>

<p>
  The theme system sets <code>data-theme="light"</code> or <code>data-theme="dark"</code>
  on the document root. Use this in your CSS:
</p>

<CodeBlock
  code={`/* Default (dark theme) */
:root {
  --color-bg: #232733;
  --color-text: #D0D2DB;
}

/* Light theme overrides */
[data-theme="light"] {
  --color-bg: #FAFDFB;
  --color-text: #2C3040;
}

/* Component that responds to theme */
.card {
  background: var(--color-bg);
  color: var(--color-text);
}`}
  lang="css"
/>

<h2>SSR Considerations</h2>

<p>
  ThemeState is SSR-safe. During server rendering:
</p>

<ul>
  <li><code>resolved</code> defaults to 'light' when <code>window</code> is undefined</li>
  <li>No localStorage or matchMedia calls on server</li>
  <li>Hydration applies the correct theme on client</li>
</ul>

<h3>Preventing Flash</h3>

<p>
  To prevent theme flash on page load, add this script to your <code>app.html</code>:
</p>

<CodeBlock
  code={`<!-- In app.html <head> -->
<script>
  (function() {
    const stored = localStorage.getItem('jera-theme');
    const theme = stored || 'system';
    const resolved = theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;
    document.documentElement.setAttribute('data-theme', resolved);
  })();
</script>`}
  lang="html"
/>

<h2>Custom Theme Context</h2>

<p>
  For advanced use cases, create your own ThemeState instance:
</p>

<CodeBlock
  code={`<script>
  import { ThemeState } from '@miozu/jera';
  import { setContext, onMount } from 'svelte';

  // Create with initial value
  const theme = new ThemeState('dark');
  setContext('my-theme', theme);

  onMount(() => {
    theme.init();
    return () => theme.cleanup();
  });
</script>`}
  lang="svelte"
/>

<style>
  .api-table {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 1rem 0 1.5rem;
    padding: 1rem;
    background: var(--color-base1);
    border-radius: 0.5rem;
  }

  .api-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--color-border);
  }

  .api-row:last-child {
    border-bottom: none;
  }

  .api-row code {
    min-width: 6rem;
    font-size: 0.875rem;
    color: var(--color-primary);
  }

  .api-type {
    min-width: 10rem;
    font-size: 0.8125rem;
    color: var(--color-base4);
    font-family: var(--font-mono);
  }

  ol {
    margin: 1rem 0;
    padding-left: 1.5rem;
  }

  ol li {
    margin: 0.75rem 0;
  }
</style>

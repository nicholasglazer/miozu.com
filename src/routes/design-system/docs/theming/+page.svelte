<script>
  import {CodeBlock} from '$lib/components/docs';
</script>

<h1>Theming</h1>

<p class="lead">
  Single source of truth theming with complete color inversion between light and dark modes.
</p>

<h2>Quick Start</h2>

<p>
  Call <code>getTheme()</code> <strong>once</strong> in your root layout, then pass it down via props to child components.
  This provides explicit data flow and better testability.
</p>

<CodeBlock
  code={`// 1. In your root +layout.svelte - call ONCE
import { getTheme } from '@miozu/jera';
import { onMount } from 'svelte';
import { Sidebar, ThemeToggle } from '$components';

const themeState = getTheme();

onMount(() => {
  themeState.sync();  // Hydrate from DOM (set by app.html)
  themeState.init();  // Initialize media query listener
});

// 2. Pass to child components as props
<Sidebar {themeState} />
<ThemeToggle {themeState} />`}
  lang="svelte"
/>

<h3>Child Component Pattern</h3>

<CodeBlock
  code={`<!-- Sidebar.svelte - receives themeState as prop -->
<script>
  // DON'T call getTheme() here - receive as prop instead
  let { themeState } = $props();

  function handleToggle() {
    themeState.toggle();
  }

  let isDark = $derived(themeState.isDark);
</script>

<button onclick={handleToggle}>
  {isDark ? 'Light Mode' : 'Dark Mode'}
</button>`}
  lang="svelte"
/>

<div class="best-practice-note">
  <h4>Why pass as props instead of calling <code>getTheme()</code> everywhere?</h4>
  <ul>
    <li><strong>Explicit data flow</strong> - You see what state each component depends on</li>
    <li><strong>Better testing</strong> - Can inject mock state easily</li>
    <li><strong>Single initialization</strong> - Clear where state originates</li>
    <li><strong>Efficiency</strong> - Singleton runs once, not on every navigation</li>
  </ul>
</div>

<h2>SvelteKit Execution Order</h2>

<p>
  Understanding when code runs helps you choose the right pattern for state initialization.
  This is based on analysis of SvelteKit's internal source code.
</p>

<div class="execution-order-table">
  <div class="execution-row header">
    <span>Phase</span>
    <span>File</span>
    <span>Server</span>
    <span>Client</span>
    <span>Notes</span>
  </div>
  <div class="execution-row">
    <span class="phase">1</span>
    <code>+layout.server.js</code>
    <span class="check">✓</span>
    <span class="cross">-</span>
    <span>Server-only data fetching</span>
  </div>
  <div class="execution-row">
    <span class="phase">2</span>
    <code>+layout.js</code>
    <span class="check">✓</span>
    <span class="check">✓</span>
    <span>Runs on <strong>every</strong> navigation</span>
  </div>
  <div class="execution-row">
    <span class="phase">3</span>
    <code>+layout.svelte script</code>
    <span class="check">✓</span>
    <span class="check">✓</span>
    <span>Runs once on component mount</span>
  </div>
  <div class="execution-row">
    <span class="phase">4</span>
    <code>onMount()</code>
    <span class="cross">-</span>
    <span class="check">✓</span>
    <span>Client-only, after hydration</span>
  </div>
</div>

<div class="key-insight">
  <h4>Key Insight from SvelteKit Source</h4>
  <p>
    <code>+layout.js</code> runs on <strong>every navigation</strong>, not just initial load.
    For singletons like theme state, this means wasted work on each page change.
  </p>
  <p>
    <code>+layout.svelte</code> script runs <strong>once</strong> when the layout mounts.
    This is more efficient for global state that doesn't change between navigations.
  </p>
</div>

<h3>When to Use Which Pattern</h3>

<div class="pattern-comparison">
  <div class="pattern-card recommended">
    <h4>+layout.svelte <span class="badge">Recommended for Theme</span></h4>
    <p>Use for singletons (theme, toast, global UI state)</p>
    <ul>
      <li>Runs once per mount</li>
      <li><code>onMount</code> separates SSR from client code</li>
      <li>Module singleton ensures single instance</li>
      <li>Pass via props for explicit data flow</li>
    </ul>
  </div>
  <div class="pattern-card">
    <h4>+layout.js</h4>
    <p>Use for data that needs server context or async fetching</p>
    <ul>
      <li>Can use <code>await</code> and <code>fetch()</code></li>
      <li>Has access to <code>parent()</code> data</li>
      <li>Integrates with SvelteKit's invalidation</li>
      <li>Data available via <code>$page.data</code></li>
    </ul>
  </div>
</div>

<h2>ThemeState API</h2>

<h3>Properties (Reactive)</h3>

<div class="api-table">
  <div class="api-row">
    <code>current</code>
    <span class="api-type">'light' | 'dark' | 'system'</span>
    <span>User's theme preference</span>
  </div>
  <div class="api-row">
    <code>resolved</code>
    <span class="api-type">'light' | 'dark'</span>
    <span>Actual theme after resolving 'system'</span>
  </div>
  <div class="api-row">
    <code>dataTheme</code>
    <span class="api-type">'miozu-light' | 'miozu-dark'</span>
    <span>Value for data-theme attribute</span>
  </div>
  <div class="api-row">
    <code>currentTheme</code>
    <span class="api-type">'miozu-light' | 'miozu-dark'</span>
    <span>Alias for dataTheme (backwards compat)</span>
  </div>
  <div class="api-row">
    <code>isDark</code>
    <span class="api-type">boolean</span>
    <span>True if resolved theme is dark</span>
  </div>
  <div class="api-row">
    <code>isLight</code>
    <span class="api-type">boolean</span>
    <span>True if resolved theme is light</span>
  </div>
</div>

<h3>Methods</h3>

<div class="api-table">
  <div class="api-row">
    <code>init()</code>
    <span class="api-type">void</span>
    <span>Load from storage, setup system preference listener</span>
  </div>
  <div class="api-row">
    <code>sync()</code>
    <span class="api-type">void</span>
    <span>Sync state with current DOM attribute (for hydration)</span>
  </div>
  <div class="api-row">
    <code>set(theme)</code>
    <span class="api-type">void</span>
    <span>Set theme preference ('light', 'dark', or 'system')</span>
  </div>
  <div class="api-row">
    <code>toggle()</code>
    <span class="api-type">void</span>
    <span>Toggle between light and dark (skips system)</span>
  </div>
  <div class="api-row">
    <code>cleanup()</code>
    <span class="api-type">void</span>
    <span>Remove media query listener (rarely needed)</span>
  </div>
</div>

<h3>Static Methods</h3>

<div class="api-table">
  <div class="api-row">
    <code>ThemeState.getThemeFromCookieString(cookies)</code>
    <span class="api-type">'miozu-light' | 'miozu-dark'</span>
    <span>Parse theme from cookie header (for SSR)</span>
  </div>
</div>

<h2>Storage</h2>

<div class="storage-info">
  <div class="storage-item">
    <strong>Key:</strong> <code>miozu-theme</code>
  </div>
  <div class="storage-item">
    <strong>Values:</strong> <code>'light'</code> | <code>'dark'</code> | <code>'system'</code>
  </div>
  <div class="storage-item">
    <strong>Stored in:</strong> localStorage + cookie (for SSR)
  </div>
  <div class="storage-item">
    <strong>data-theme:</strong> <code>'miozu-light'</code> | <code>'miozu-dark'</code>
  </div>
</div>

<h2>SSR & Flash Prevention</h2>

<p>
  Add this inline script to your <code>app.html</code> <strong>before any stylesheets</strong>:
</p>

<CodeBlock
  code={`<script>
  (function () {
    try {
      // Read preference from storage (check both new and legacy keys)
      let pref = localStorage.getItem('miozu-theme');

      // Fallback to cookie
      if (!pref || !['light', 'dark', 'system'].includes(pref)) {
        const match = document.cookie.match(/miozu-theme=([^;]+)/);
        pref = match?.[1];
      }

      // Resolve preference to actual theme
      let theme;
      if (pref === 'light') {
        theme = 'miozu-light';
      } else if (pref === 'dark') {
        theme = 'miozu-dark';
      } else {
        // 'system' or undefined - check system preference
        theme = window.matchMedia?.('(prefers-color-scheme: dark)').matches
          ? 'miozu-dark'
          : 'miozu-light';
        pref = 'system';
      }

      // Apply immediately to prevent flash
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.style.colorScheme = theme === 'miozu-dark' ? 'dark' : 'light';

      // Persist
      localStorage.setItem('miozu-theme', pref);
      document.cookie = \`miozu-theme=\${pref}; path=/; max-age=31536000; SameSite=Lax\`;
    } catch (e) {
      document.documentElement.setAttribute('data-theme', 'miozu-dark');
    }
  })();
</script>`}
  lang="html"
/>

<h2>Server-Side Rendering</h2>

<p>
  Use the static method to parse theme from cookies in your <code>+layout.server.js</code>:
</p>

<CodeBlock
  code={`// +layout.server.js
import { ThemeState } from '@miozu/jera';

export const load = async ({ cookies }) => {
  // Get theme from cookie for SSR
  const cookieHeader = cookies.get('miozu-theme');
  const theme = ThemeState.getThemeFromCookieString(
    \`miozu-theme=\${cookieHeader}\`
  );

  return {
    theme  // 'miozu-light' or 'miozu-dark'
  };
};`}
  lang="javascript"
/>

<h2 id="migration">Migration Guide</h2>

<div class="migration-notice">
  <h4>⚠️ Breaking Changes in v0.4.0</h4>
  <p>
    If you were using the old context-based API or custom storage keys, follow this migration guide.
  </p>
</div>

<h3>From Context API</h3>

<CodeBlock
  code={`// ❌ OLD (v0.3.x)
import { createThemeContext, getThemeContext } from '@miozu/jera';

// In layout
const theme = createThemeContext();
onMount(() => theme.init());

// In components
const theme = getThemeContext();

// ✅ NEW (v0.4.0+)
import { getTheme } from '@miozu/jera';

// Anywhere - same singleton everywhere
const theme = getTheme();

// In layout only
onMount(() => {
  theme.sync();
  theme.init();
});`}
  lang="javascript"
/>

<h3>From Custom Storage Keys</h3>

<p>
  If your app used custom storage keys (e.g., <code>admin-theme</code>, <code>theme</code>),
  update your <code>app.html</code> to migrate:
</p>

<CodeBlock
  code={`<script>
  (function () {
    // Migration: check old keys, write to new key
    let pref = localStorage.getItem('miozu-theme')
            || localStorage.getItem('admin-theme')  // Your old key
            || localStorage.getItem('theme');       // Another old key

    // ... rest of theme detection logic ...

    // Write to new unified key
    localStorage.setItem('miozu-theme', pref);

    // Clean up old keys
    localStorage.removeItem('admin-theme');
    localStorage.removeItem('theme');

    // Clear old cookies
    document.cookie = 'admin-theme=; path=/; max-age=0';
    document.cookie = 'theme=; path=/; max-age=0';
  })();
</script>`}
  lang="html"
/>

<h3>Property Name Changes</h3>

<div class="api-table migration-table">
  <div class="api-row header">
    <span>Old Property</span>
    <span>New Property</span>
    <span>Notes</span>
  </div>
  <div class="api-row">
    <code>currentTheme</code>
    <code>dataTheme</code>
    <span><code>currentTheme</code> still works (alias)</span>
  </div>
  <div class="api-row">
    <code>isInitialized</code>
    <span class="removed">Removed</span>
    <span>Use <code>init()</code> in onMount instead</span>
  </div>
  <div class="api-row">
    <code>initialize()</code>
    <code>init()</code>
    <span>Renamed for brevity</span>
  </div>
  <div class="api-row">
    <code>setTheme()</code>
    <code>set()</code>
    <span>Renamed for brevity</span>
  </div>
</div>

<h2>Technical Philosophy</h2>

<div class="philosophy-grid">
  <div class="concept">
    <h3>🎯 Base16 Foundation</h3>
    <p>
      Miozu uses a carefully calibrated Base16 palette where each color has a specific semantic meaning.
      Colors 00-07 form a <strong>luminosity gradient</strong> from darkest to lightest, while 08-0F provide
      accent colors with consistent perceptual weight.
    </p>
  </div>

  <div class="concept">
    <h3>⚖️ Mathematical Inversion</h3>
    <p>
      Dark mode isn't just "dark colors" — it's a <strong>complete mathematical inversion</strong> of the luminosity
      scale. Base00 (background) swaps with Base07, maintaining the same <em>relative contrast relationships</em>.
    </p>
  </div>

  <div class="concept">
    <h3>🚀 Single Source of Truth</h3>
    <p>
      Call <code>getTheme()</code> once in your root layout, then pass it down via props.
      Explicit data flow, easy testing, clear ownership of state.
    </p>
  </div>

  <div class="concept">
    <h3>⚡ CSS-Only Switching</h3>
    <p>
      Theme changes happen via CSS attribute selectors — no JavaScript re-renders.
      Instant theme switching with zero layout shift.
    </p>
  </div>
</div>

<h2>CSS Theme Selectors</h2>

<CodeBlock
  code={`/* Components use semantic colors */
.card {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

/* Theme-specific overrides (rarely needed) */
[data-theme='miozu-dark'] .card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

[data-theme='miozu-light'] .card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}`}
  lang="css"
/>

<div class="technical-note">
  <h4>🔗 Related Documentation</h4>
  <p>
    <a href="/design-system/docs/colors" class="ports-link">Colors</a>
    <a href="/design-system/docs/color-philosophy" class="ports-link">Color Philosophy</a>
    <a href="/design-system/docs/color-playground" class="ports-link">Color Playground</a>
  </p>
  <p>
    <strong>GitHub:</strong>
    <a href="https://github.com/miozu-com/jera" target="_blank" rel="noopener" class="github-link">
      @miozu/jera repository →
    </a>
  </p>
</div>

<style>
  .api-table {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin: 1rem 0 1.5rem;
    background: var(--color-base01);
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .api-row {
    display: grid;
    grid-template-columns: 1fr 1fr 2fr;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--color-border);
  }

  .api-row:last-child {
    border-bottom: none;
  }

  .api-row.header {
    background: var(--color-base02);
    font-weight: 600;
    font-size: 0.875rem;
  }

  .api-row code {
    font-size: 0.875rem;
    color: var(--color-primary);
  }

  .api-type {
    font-size: 0.8125rem;
    color: var(--color-base04);
    font-family: var(--font-mono);
  }

  .removed {
    color: var(--color-error);
    font-style: italic;
  }

  .storage-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    padding: 1.5rem;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 0.75rem;
    margin: 1rem 0;
  }

  .storage-item {
    font-size: 0.875rem;
  }

  .storage-item code {
    background: var(--color-base02);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-size: 0.8125rem;
  }

  .migration-notice {
    background: linear-gradient(135deg, var(--color-warning) 0%, transparent 100%);
    background-size: 4px 100%;
    background-repeat: no-repeat;
    padding: 1.5rem;
    padding-left: 2rem;
    border: 1px solid var(--color-warning);
    border-left: 4px solid var(--color-warning);
    border-radius: 0.5rem;
    margin: 2rem 0;
  }

  .migration-notice h4 {
    margin: 0 0 0.5rem;
    color: var(--color-warning);
  }

  .migration-notice p {
    margin: 0;
    font-size: 0.875rem;
  }

  .migration-table .api-row {
    grid-template-columns: 1fr 1fr 2fr;
  }

  .philosophy-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin: 2rem 0;
  }

  .concept {
    padding: 1.5rem;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 0.75rem;
  }

  .concept h3 {
    margin: 0 0 1rem;
    font-size: 1.125rem;
    color: var(--color-text-strong);
  }

  .concept p {
    margin: 0;
    font-size: 0.875rem;
    color: var(--color-text-muted);
    line-height: 1.6;
  }

  .technical-note {
    background: var(--color-surface);
    border: 1px solid var(--color-primary);
    border-radius: 0.75rem;
    padding: 1.5rem;
    margin: 2rem 0;
  }

  .technical-note h4 {
    margin: 0 0 1rem;
    color: var(--color-primary);
    font-size: 1rem;
  }

  .technical-note p {
    margin: 0 0 1rem;
    font-size: 0.875rem;
  }

  .technical-note p:last-child {
    margin-bottom: 0;
  }

  .ports-link {
    color: var(--color-primary);
    text-decoration: none;
    font-weight: 500;
    padding: 0.375rem 0.75rem;
    background: var(--color-surface-alt);
    border: 1px solid var(--color-border);
    border-radius: 0.375rem;
    display: inline-block;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    transition: all 0.15s ease;
  }

  .ports-link:hover {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
  }

  .github-link {
    color: var(--color-text);
    text-decoration: none;
    font-weight: 500;
  }

  .github-link:hover {
    color: var(--color-primary);
  }

  .best-practice-note {
    background: var(--color-surface);
    border: 1px solid var(--color-success);
    border-left: 4px solid var(--color-success);
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin: 1.5rem 0;
  }

  .best-practice-note h4 {
    margin: 0 0 0.75rem;
    color: var(--color-success);
    font-size: 0.9375rem;
  }

  .best-practice-note h4 code {
    background: var(--color-base02);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-size: 0.8125rem;
  }

  .best-practice-note ul {
    margin: 0;
    padding-left: 1.25rem;
  }

  .best-practice-note li {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    margin-bottom: 0.375rem;
  }

  .best-practice-note li:last-child {
    margin-bottom: 0;
  }

  .best-practice-note strong {
    color: var(--color-text);
  }

  /* Execution order table */
  .execution-order-table {
    display: flex;
    flex-direction: column;
    margin: 1rem 0 1.5rem;
    background: var(--color-base01);
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .execution-row {
    display: grid;
    grid-template-columns: 50px 1fr 60px 60px 2fr;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--color-border);
    font-size: 0.875rem;
  }

  .execution-row:last-child {
    border-bottom: none;
  }

  .execution-row.header {
    background: var(--color-base02);
    font-weight: 600;
    font-size: 0.8125rem;
    color: var(--color-text-muted);
  }

  .execution-row code {
    font-size: 0.8125rem;
    color: var(--color-primary);
  }

  .execution-row .phase {
    font-weight: 700;
    color: var(--color-primary);
    font-size: 0.875rem;
  }

  .execution-row .check {
    color: var(--color-success);
    font-weight: 700;
    text-align: center;
  }

  .execution-row .cross {
    color: var(--color-text-muted);
    text-align: center;
  }

  /* Key insight box */
  .key-insight {
    background: linear-gradient(135deg, var(--color-info) 0%, transparent 100%);
    background-size: 4px 100%;
    background-repeat: no-repeat;
    padding: 1.5rem;
    padding-left: 2rem;
    border: 1px solid var(--color-info);
    border-left: 4px solid var(--color-info);
    border-radius: 0.5rem;
    margin: 1.5rem 0;
  }

  .key-insight h4 {
    margin: 0 0 0.75rem;
    color: var(--color-info);
    font-size: 0.9375rem;
  }

  .key-insight p {
    margin: 0 0 0.75rem;
    font-size: 0.875rem;
    color: var(--color-text-muted);
  }

  .key-insight p:last-child {
    margin-bottom: 0;
  }

  .key-insight code {
    background: var(--color-base02);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-size: 0.8125rem;
  }

  /* Pattern comparison */
  .pattern-comparison {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin: 1.5rem 0;
  }

  .pattern-card {
    padding: 1.5rem;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 0.75rem;
  }

  .pattern-card.recommended {
    border-color: var(--color-success);
    background: linear-gradient(135deg, rgba(0, 200, 100, 0.05) 0%, transparent 100%);
  }

  .pattern-card h4 {
    margin: 0 0 0.5rem;
    font-size: 1rem;
    color: var(--color-text-strong);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .pattern-card .badge {
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.25rem 0.5rem;
    background: var(--color-success);
    color: white;
    border-radius: 0.25rem;
  }

  .pattern-card > p {
    margin: 0 0 1rem;
    font-size: 0.875rem;
    color: var(--color-text-muted);
  }

  .pattern-card ul {
    margin: 0;
    padding-left: 1.25rem;
  }

  .pattern-card li {
    font-size: 0.8125rem;
    color: var(--color-text-muted);
    margin-bottom: 0.375rem;
  }

  .pattern-card li:last-child {
    margin-bottom: 0;
  }

  .pattern-card code {
    background: var(--color-base02);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
  }
</style>

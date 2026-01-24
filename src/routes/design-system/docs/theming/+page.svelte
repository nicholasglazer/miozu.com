<script>
  import {CodeBlock} from '$lib/components/docs';
</script>

<h1>Theming</h1>

<p class="lead">
  Reactive class-based theming with complete color inversion between light and dark modes.
</p>

<h2>Technical Philosophy</h2>

<p>
  The Miozu color system is built on a <strong>mathematical color relationship model</strong> that treats themes as
  <em>complete inversions</em> rather than simple overrides. This approach ensures perfect contrast ratios and
  maintains color harmony across all interface states.
</p>

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
      scale. Base00 (dark background) becomes Base07 equivalent, Base05 (light text) becomes Base00 equivalent,
      maintaining the same <em>relative contrast relationships</em>.
    </p>
  </div>

  <div class="concept">
    <h3>🧠 Cognitive Load Reduction</h3>
    <p>
      By using <strong>attribute-selector inversion</strong>, all theme changes happen in pure CSS without
      JavaScript re-renders. This creates instantaneous theme switching with zero layout shift or
      computational overhead.
    </p>
  </div>

  <div class="concept">
    <h3>🌐 Universal Portability</h3>
    <p>
      The Base16 semantic naming allows the Miozu theme to be <strong>ported to any platform</strong> while
      maintaining identical color relationships. Whether it's VS Code, terminals, or web apps, the visual
      experience remains consistent.
    </p>
  </div>
</div>

<div class="technical-note">
  <h4>🔬 Color Science</h4>
  <p>
    Miozu colors are derived using <strong>OKLCH color space</strong> calculations to ensure perceptual uniformity.
    Each accent color maintains the same chroma and hue across themes, with only lightness adjusted to preserve
    accessibility (WCAG AA compliance) while maximizing visual distinction.
  </p>
  <p>
    This mathematical approach means you can <strong>port Miozu to any platform</strong> with confidence that
    color relationships will remain harmonious and accessible.
  </p>
  <p>
    <strong>Explore further:</strong>
    <a href="/design-system/docs/color-philosophy" class="ports-link">Color Philosophy</a> |
    <a href="/design-system/docs/color-playground" class="ports-link">Color Playground</a> |
    <a href="/ports" class="ports-link">Theme Ports</a>
  </p>
  <p>
    <strong>GitHub Organization:</strong>
    <a href="https://github.com/orgs/miozu-com/repositories" target="_blank" rel="noopener" class="github-link">
      miozu-com repositories →
    </a>
  </p>
</div>

<h2>Reactive Class Approach</h2>

<p>
  Jera uses a <strong>singleton reactive class</strong> with Svelte 5 runes, not context.
  This provides global theme state without prop drilling.
</p>

<CodeBlock
  code={`<script>
  import { getTheme } from '@miozu/jera';
  import { onMount } from 'svelte';

  // Get the singleton theme state (anywhere in your app)
  const theme = getTheme();

  // Initialize in root layout (call once)
  onMount(() => theme.init());

  // Reactive derived values
  let isDarkMode = $derived(theme.isDark);
  let currentTheme = $derived(theme.current);
</script>

<!-- Theme toggle button -->
<button onclick={() => theme.toggle()}>
  {isDarkMode ? '☀️ Light' : '🌙 Dark'} Mode
</button>

<!-- Current theme display -->
<p>Current theme: {currentTheme}</p>`}
  lang="svelte"
/>

<h2>ThemeReactiveState API</h2>

<h3>Properties</h3>

<div class="api-table">
  <div class="api-row">
    <code>currentTheme</code>
    <span class="api-type">'miozu-light' | 'miozu-dark'</span>
    <span>Current active theme (reactive with $state)</span>
  </div>
  <div class="api-row">
    <code>isDark</code>
    <span class="api-type">boolean</span>
    <span>Computed getter: true if currentTheme is 'miozu-dark'</span>
  </div>
  <div class="api-row">
    <code>isInitialized</code>
    <span class="api-type">boolean</span>
    <span>Whether initialization has completed</span>
  </div>
</div>

<h3>Methods</h3>

<div class="api-table">
  <div class="api-row">
    <code>initialize()</code>
    <span class="api-type">Promise&lt;void&gt;</span>
    <span>Load from localStorage, detect system preference</span>
  </div>
  <div class="api-row">
    <code>setTheme(theme)</code>
    <span class="api-type">void</span>
    <span>Set specific theme and persist</span>
  </div>
  <div class="api-row">
    <code>toggle()</code>
    <span class="api-type">void</span>
    <span>Toggle between miozu-light and miozu-dark</span>
  </div>
  <div class="api-row">
    <code>apply()</code>
    <span class="api-type">void</span>
    <span>Apply theme to DOM + localStorage + cookie</span>
  </div>
</div>

<h2>Inversion Theme Approach</h2>

<p>
  Jera uses <strong>complete CSS variable inversion</strong> rather than inheritance.
  Each theme completely redefines all color variables, creating a true "inversion" effect.
</p>

<CodeBlock
  code={`/* Light theme (default) - uses @theme directive */
@theme {
  --color-base00: #ffffff;  /* Light background */
  --color-base01: #f8f9fa;  /* Light surface */
  --color-base05: #1a2332;  /* Dark text */
  --color-base0D: #0066cc;  /* Blue primary */
  /* ... all other colors */
}

/* Dark theme - COMPLETE inversion via attribute selector */
[data-theme='miozu-dark'] {
  --color-base00: #0a0f19;  /* Dark background */
  --color-base01: #151b26;  /* Dark surface */
  --color-base05: #d4dce8;  /* Light text */
  --color-base0D: #83d2fc;  /* Light blue primary */
  /* ... all colors completely redefined */
}

/* Semantic tokens work with both themes */
--color-bg: var(--color-base00);
--color-text: var(--color-base05);
--color-primary: var(--color-base0D);`}
  lang="css"
/>

<h2>Theme Application</h2>

<p>
  Theme is applied via <code>data-theme</code> attribute on the <code>&lt;html&gt;</code> element:
</p>

<CodeBlock
  code={`// The apply() method sets:
// 1. DOM attribute
document.documentElement.setAttribute('data-theme', this.currentTheme);

// 2. localStorage persistence
localStorage.setItem('theme', this.currentTheme);

// 3. Cookie for SSR
document.cookie = \`theme=\${this.currentTheme}; ...\`;`}
  lang="javascript"
/>

<h2>SSR & Flash Prevention</h2>

<p>
  To prevent flash of wrong theme, add this inline script to your <code>app.html</code>:
</p>

<CodeBlock
  code={`<!-- In app.html <head> (before any stylesheets) -->
<script>
  (function() {
    // Read from localStorage first
    let theme = localStorage.getItem('theme');

    // Fallback to cookie (for SSR)
    if (!theme) {
      const match = document.cookie.match(/theme=([^;]+)/);
      theme = match ? match[1] : null;
    }

    // Fallback to system preference
    if (!theme) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'miozu-dark'
        : 'miozu-light';
    }

    // Apply immediately to prevent flash
    document.documentElement.setAttribute('data-theme', theme);
  })();
</script>`}
  lang="html"
/>

<h2>Real-world Usage</h2>

<p>
  Example of a complete theme switcher component:
</p>

<CodeBlock
  code={`<script>
  import { getTheme } from '@miozu/jera';

  const theme = getTheme();

  // Reactive values using $derived
  let isDarkMode = $derived(theme.isDark);
  let currentTheme = $derived(theme.current);

  function handleToggleTheme() {
    theme.toggle();  // Updates state + DOM + storage atomically
  }
</script>

<button
  onclick={handleToggleTheme}
  class="theme-toggle"
  aria-label="Toggle theme"
>
  {#if isDarkMode}
    ☀️ Light Mode
  {:else}
    🌙 Dark Mode
  {/if}
</button>

<style>
  .theme-toggle {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    background: var(--color-surface);
    color: var(--color-text);
    border: 1px solid var(--color-border);
    transition: all 0.2s ease;
  }

  /* Theme-specific styling using attribute selectors */
  [data-theme='miozu-light'] .theme-toggle:hover {
    background: var(--color-base01);
  }

  [data-theme='miozu-dark'] .theme-toggle:hover {
    background: var(--color-base02);
  }
</style>`}
  lang="svelte"
/>

<h2>Why This Approach?</h2>

<div class="benefits">
  <div class="benefit">
    <h3>🚀 No Context Overhead</h3>
    <p>Singleton pattern means no provider setup or prop drilling</p>
  </div>

  <div class="benefit">
    <h3>⚡ Instant Theme Switch</h3>
    <p>CSS attribute selector changes all colors instantly</p>
  </div>

  <div class="benefit">
    <h3>🎨 Complete Inversion</h3>
    <p>True dark mode with properly inverted color relationships</p>
  </div>

  <div class="benefit">
    <h3>💾 SSR-Safe</h3>
    <p>Cookie fallback ensures correct theme on server render</p>
  </div>
</div>

<style>
  .api-table {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 1rem 0 1.5rem;
    padding: 1rem;
    background: var(--color-base01);
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
    color: var(--color-base04);
    font-family: var(--font-mono);
  }

  ol {
    margin: 1rem 0;
    padding-left: 1.5rem;
  }

  ol li {
    margin: 0.75rem 0;
  }

  .benefits {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin: 2rem 0;
  }

  .benefit {
    padding: 1.5rem;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 0.75rem;
  }

  .benefit h3 {
    margin: 0 0 0.5rem;
    font-size: 1.125rem;
    color: var(--color-text-strong);
  }

  .benefit p {
    margin: 0;
    font-size: 0.875rem;
    color: var(--color-text-muted);
    line-height: 1.5;
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
    background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-alt) 100%);
    border: 2px solid var(--color-primary);
    border-radius: 1rem;
    padding: 2rem;
    margin: 2rem 0;
    position: relative;
  }

  .technical-note::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    border-radius: inherit;
    z-index: -1;
    opacity: 0.1;
  }

  .technical-note h4 {
    margin: 0 0 1rem;
    color: var(--color-primary);
    font-size: 1.25rem;
  }

  .technical-note p {
    margin: 0 0 1rem;
    font-size: 0.875rem;
    line-height: 1.6;
  }

  .technical-note p:last-child {
    margin-bottom: 0;
  }

  .ports-link {
    color: var(--color-primary);
    text-decoration: none;
    font-weight: 600;
    padding: 0.5rem 1rem;
    background: var(--color-surface);
    border: 1px solid var(--color-primary);
    border-radius: 0.5rem;
    display: inline-block;
    margin-right: 1rem;
    transition: all 0.2s ease;
  }

  .ports-link:hover {
    background: var(--color-primary);
    color: var(--color-surface);
  }

  .github-link {
    color: var(--color-text-strong);
    text-decoration: none;
    font-weight: 500;
    opacity: 0.8;
  }

  .github-link:hover {
    opacity: 1;
    text-decoration: underline;
  }
</style>

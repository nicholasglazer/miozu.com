<script>
  const quickLinks = [
    { href: '/design-system/docs', label: 'Documentation', desc: 'Component API and usage guides' },
    { href: '/design-system/docs/color-philosophy', label: 'Color Philosophy', desc: 'Base16 semantic system explained' },
    { href: '/design-system/docs/color-playground', label: 'Color Playground', desc: 'Interactive theme editor' },
    { href: '/tokens/base16.json', label: 'Design Tokens', desc: 'Machine-readable JSON tokens' },
    { href: '/llms.txt', label: 'AI Docs', desc: 'LLM-optimized documentation' }
  ];

  const semanticColors = [
    { token: 'base08', alias: '--color-error', role: 'Destructive', usage: 'Delete, error, danger' },
    { token: 'base09', alias: '--color-warning', role: 'Warning', usage: 'Caution, pending, review' },
    { token: 'base0A', alias: '--color-highlight', role: 'Highlight', usage: 'Search, featured, new' },
    { token: 'base0B', alias: '--color-success', role: 'Success', usage: 'Confirm, complete, active' },
    { token: 'base0C', alias: '--color-info', role: 'Info', usage: 'Secondary, neutral, tooltip' },
    { token: 'base0D', alias: '--color-primary', role: 'Primary', usage: 'Main action, links, brand' },
    { token: 'base0E', alias: '--color-special', role: 'Special', usage: 'Premium, AI, unique' },
    { token: 'base0F', alias: '--color-alternative', role: 'Alternative', usage: 'Deprecated, legacy' }
  ];
</script>

<svelte:head>
  <title>Miozu Design System - Base16 Semantic Colors</title>
  <meta name="description" content="Enterprise-ready Base16 color system. Write once, theme everywhere. AI-first documentation and machine-readable design tokens.">
</svelte:head>

<div class="design-system-home">
  <header class="hero">
    <div class="hero-badge">Design System</div>
    <h1>Miozu <span class="accent">Base16</span></h1>
    <p class="tagline">Write once. Theme everywhere.</p>
    <p class="description">
      A semantic color system where each of 16 colors has a clear responsibility.
      Learn it once, apply it everywhere - from VS Code to web apps to native mobile.
    </p>
    <div class="hero-actions">
      <a href="/design-system/docs" class="btn primary">Get Started</a>
      <a href="/design-system/docs/color-playground" class="btn secondary">Try Playground</a>
    </div>
  </header>

  <section class="quick-links">
    <h2>Quick Access</h2>
    <div class="links-grid">
      {#each quickLinks as link}
        <a href={link.href} class="link-card">
          <h3>{link.label}</h3>
          <p>{link.desc}</p>
        </a>
      {/each}
    </div>
  </section>

  <section class="semantic-overview">
    <h2>Semantic Color System</h2>
    <p class="section-desc">
      Each Base16 color has a fixed semantic role. <strong>base08 always means destructive</strong>,
      <strong>base0B always means success</strong>. This consistency lets developers pick colors instantly.
    </p>

    <div class="color-table-wrapper">
      <table class="color-table">
        <thead>
          <tr>
            <th>Token</th>
            <th>Alias</th>
            <th>Role</th>
            <th>Usage</th>
          </tr>
        </thead>
        <tbody>
          {#each semanticColors as color}
            <tr>
              <td>
                <span class="color-swatch" style="background: var(--color-{color.token});"></span>
                <code>{color.token}</code>
              </td>
              <td><code>{color.alias}</code></td>
              <td><strong>{color.role}</strong></td>
              <td>{color.usage}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>

  <section class="principles">
    <h2>Core Principles</h2>
    <div class="principles-grid">
      <div class="principle">
        <h3>Semantic Intent</h3>
        <p>Use <code>--color-error</code> not <code>--base08</code>. Semantic aliases make code self-documenting.</p>
      </div>
      <div class="principle">
        <h3>Theme Agnostic</h3>
        <p>Same CSS variables work in dark mode, light mode, or any custom theme. No duplicate stylesheets.</p>
      </div>
      <div class="principle">
        <h3>AI-First</h3>
        <p>Machine-readable tokens and llms.txt for AI assistants. Built for the future of development.</p>
      </div>
      <div class="principle">
        <h3>Framework Agnostic</h3>
        <p>Works with Svelte, React, Vue, vanilla CSS. Design tokens export to any platform.</p>
      </div>
    </div>
  </section>

  <section class="resources">
    <h2>Enterprise Resources</h2>
    <div class="resources-grid">
      <a href="/tokens/base16.json" class="resource-card" download>
        <h3>base16.json</h3>
        <p>Complete token definitions with dark/light values and semantic metadata</p>
      </a>
      <a href="/tokens/semantic.json" class="resource-card" download>
        <h3>semantic.json</h3>
        <p>Component mappings for Style Dictionary integration</p>
      </a>
      <a href="/tokens/accessibility.json" class="resource-card" download>
        <h3>accessibility.json</h3>
        <p>WCAG contrast ratios and colorblind guidance</p>
      </a>
      <a href="/tokens/semantic-aliases.css" class="resource-card" download>
        <h3>semantic-aliases.css</h3>
        <p>Ready-to-import CSS custom properties</p>
      </a>
    </div>
  </section>
</div>

<style>
  .design-system-home {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem;
  }

  .hero {
    text-align: center;
    padding: 4rem 0;
    border-bottom: 1px solid var(--color-base02, #273244);
    margin-bottom: 4rem;
  }

  .hero-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background: var(--color-base02, #273244);
    color: var(--color-base05, #d4dce8);
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 1rem;
  }

  .hero h1 {
    font-size: 3.5rem;
    margin: 0 0 0.5rem;
    color: var(--color-base07, #ffffff);
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .accent {
    color: var(--color-base0E, #c974e6);
  }

  .tagline {
    font-size: 1.5rem;
    color: var(--color-base05, #d4dce8);
    margin: 0 0 1rem;
  }

  .description {
    max-width: 600px;
    margin: 0 auto 2rem;
    color: var(--color-base04, #8896b3);
    line-height: 1.6;
  }

  .hero-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s;
  }

  .btn.primary {
    background: var(--color-base0E, #c974e6);
    color: var(--color-base00, #0a0f19);
  }

  .btn.primary:hover {
    filter: brightness(1.1);
  }

  .btn.secondary {
    background: var(--color-base02, #273244);
    color: var(--color-base06, #e8eef6);
    border: 1px solid var(--color-base03, #5a6884);
  }

  .btn.secondary:hover {
    border-color: var(--color-base0E, #c974e6);
  }

  section {
    margin-bottom: 4rem;
  }

  section h2 {
    font-size: 1.75rem;
    margin: 0 0 1rem;
    color: var(--color-base06, #e8eef6);
  }

  .section-desc {
    color: var(--color-base04, #8896b3);
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }

  .links-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
  }

  .link-card {
    padding: 1.25rem;
    background: var(--color-base01, #161d2d);
    border: 1px solid var(--color-base02, #273244);
    border-radius: 0.5rem;
    text-decoration: none;
    transition: all 0.2s;
  }

  .link-card:hover {
    border-color: var(--color-base0E, #c974e6);
    transform: translateY(-2px);
  }

  .link-card h3 {
    margin: 0 0 0.5rem;
    font-size: 1rem;
    color: var(--color-base06, #e8eef6);
  }

  .link-card p {
    margin: 0;
    font-size: 0.875rem;
    color: var(--color-base04, #8896b3);
  }

  .color-table-wrapper {
    overflow-x: auto;
  }

  .color-table {
    width: 100%;
    border-collapse: collapse;
  }

  .color-table th,
  .color-table td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid var(--color-base02, #273244);
  }

  .color-table th {
    color: var(--color-base04, #8896b3);
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .color-table td {
    color: var(--color-base05, #d4dce8);
  }

  .color-swatch {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border-radius: 0.25rem;
    margin-right: 0.5rem;
    vertical-align: middle;
  }

  .color-table code {
    background: var(--color-base00, #0a0f19);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-size: 0.8em;
    color: var(--color-base0D, #5e9eff);
  }

  .principles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.5rem;
  }

  .principle {
    padding: 1.5rem;
    background: var(--color-base01, #161d2d);
    border-radius: 0.5rem;
  }

  .principle h3 {
    margin: 0 0 0.5rem;
    color: var(--color-base06, #e8eef6);
    font-size: 1.125rem;
  }

  .principle p {
    margin: 0;
    color: var(--color-base04, #8896b3);
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .principle code {
    background: var(--color-base00, #0a0f19);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-size: 0.85em;
  }

  .resources-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .resource-card {
    padding: 1.25rem;
    background: var(--color-base01, #161d2d);
    border: 1px solid var(--color-base02, #273244);
    border-radius: 0.5rem;
    text-decoration: none;
    transition: all 0.2s;
  }

  .resource-card:hover {
    border-color: var(--color-base0D, #5e9eff);
  }

  .resource-card h3 {
    margin: 0 0 0.5rem;
    color: var(--color-base0D, #5e9eff);
    font-size: 0.9rem;
    font-family: 'Fira Code', monospace;
  }

  .resource-card p {
    margin: 0;
    font-size: 0.8rem;
    color: var(--color-base04, #8896b3);
    line-height: 1.4;
  }

  @media (max-width: 768px) {
    .hero h1 {
      font-size: 2.5rem;
    }

    .hero-actions {
      flex-direction: column;
      align-items: center;
    }

    .design-system-home {
      padding: 1rem;
    }
  }
</style>

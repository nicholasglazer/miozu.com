<script>
  import { onMount } from 'svelte';
  import { CodeBlock } from '$lib/components/docs';

  // Code examples for framework comparison
  const CODE_EXAMPLES = {
    react: `function Button({ variant, children }) {
  return (
    <button className={"btn btn-" + variant}>
      {children}
    </button>
  );
}`,
    svelte: `<script>
  let { variant, children } = $props();
<\/script>

<button class="btn btn-{variant}">
  {#if children}
    {@render children()}
  {/if}
</button>`,
    vue: `<template>
  <button :class="'btn btn-' + variant">
    <slot />
  </button>
</template>`,
    vanilla: `const button = document.createElement('button');
button.className = 'btn btn-' + variant;
button.textContent = text;
document.body.appendChild(button);`,
    css: `:root { --base0D: #5e9eff; } .button { background: var(--base0D); }`,
    containerQuery: `@container (min-width: 300px) { .card { background: var(--base01); } }`,
    nesting: `.card { background: var(--base01); &:hover { background: var(--base02); } }`
  };

  // Available theme presets
  let themePresets = $state([
    {
      id: 'miozu-dark',
      name: 'Miozu Dark',
      description: 'Original vibrant dark theme',
      colors: {
        base00: '#0a0f19', base01: '#161d2d', base02: '#273244', base03: '#5a6884',
        base04: '#8896b3', base05: '#d4dce8', base06: '#e8eef6', base07: '#ffffff',
        base08: '#ff5757', base09: '#ff8c42', base0A: '#ffc73d', base0B: '#52d681',
        base0C: '#42c7dd', base0D: '#5e9eff', base0E: '#b47efc', base0F: '#ffb157'
      }
    },
    {
      id: 'miozu-light',
      name: 'Miozu Light',
      description: 'Clean light theme',
      colors: {
        base00: '#ffffff', base01: '#f7f8fa', base02: '#eef1f5', base03: '#97a3b7',
        base04: '#5e6b81', base05: '#1a2332', base06: '#0d1520', base07: '#000000',
        base08: '#dc2626', base09: '#ea580c', base0A: '#ca8a04', base0B: '#16a34a',
        base0C: '#0891b2', base0D: '#2563eb', base0E: '#7c3aed', base0F: '#d97706'
      }
    },
    {
      id: 'high-contrast',
      name: 'High Contrast',
      description: 'Maximum accessibility',
      colors: {
        base00: '#000000', base01: '#1a1a1a', base02: '#333333', base03: '#666666',
        base04: '#999999', base05: '#cccccc', base06: '#e6e6e6', base07: '#ffffff',
        base08: '#ff0000', base09: '#ff8800', base0A: '#ffff00', base0B: '#00ff00',
        base0C: '#00ffff', base0D: '#0088ff', base0E: '#8800ff', base0F: '#ff4400'
      }
    },
    {
      id: 'sepia',
      name: 'Sepia/E-ink',
      description: 'Easy on the eyes, paper-like',
      colors: {
        base00: '#faf0e6', base01: '#f5e6d3', base02: '#e6d2b7', base03: '#b8a082',
        base04: '#8b7355', base05: '#5d4e37', base06: '#3e3429', base07: '#2f261c',
        base08: '#8b0000', base09: '#b8860b', base0A: '#daa520', base0B: '#228b22',
        base0C: '#008b8b', base0D: '#4682b4', base0E: '#8a2be2', base0F: '#d2691e'
      }
    }
  ]);

  // Theme state
  let currentTheme = $state('miozu-dark');
  let currentThemeData = $derived(() => themePresets.find(t => t.id === currentTheme));

  // Notification state
  let notification = $state({ type: 'info', message: 'Theme changed successfully!' });
  let showNotification = $state(false);

  // Code examples
  let sampleCSS = `/* 🎯 WRITE ONCE, WORK EVERYWHERE */
.card {
  background: var(--base01);
  border: 1px solid var(--base02);
  color: var(--base05);
}

.button-primary {
  background: var(--base0D);
  color: var(--base00);
}

.error-message {
  background: color-mix(in srgb, var(--base08) 15%, transparent);
  color: var(--base08);
  border-left: 3px solid var(--base08);
}

/* ✨ This CSS automatically adapts to:
   • Dark themes
   • Light themes
   • High contrast
   • Colorblind-friendly
   • Brand themes
   • ANY theme you create!
*/`;



  function applyTheme(themeId) {
    const theme = themePresets.find(t => t.id === themeId);
    if (!theme) return;

    // Apply CSS variables to document root
    Object.entries(theme.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });

    currentTheme = themeId;
    showNotification = true;
    notification = { type: 'success', message: `Applied ${theme.name} theme!` };
    setTimeout(() => showNotification = false, 3000);
  }

  onMount(() => {
    // Initialize with default theme
    applyTheme(currentTheme);
  });
</script>

<svelte:head>
  <title>Color Playground - Interactive Theme Explorer</title>
  <meta name="description" content="Experience the power of semantic CSS variables - write once, work everywhere. Create and test unlimited themes with live preview.">
</svelte:head>

<div class="playground">
  <header class="playground-hero">
    <h1>Color Playground</h1>
    <p class="lead">
      <strong>Write CSS once. Work everywhere.</strong><br>
      Experience the power of semantic variables that automatically adapt to any theme.
    </p>
  </header>

  <!-- Theme Selector -->
  <section class="theme-selector">
    <h2>🎨 Choose Your Reality</h2>
    <p>Watch the same interface transform across completely different visual styles:</p>

    <div class="theme-grid">
      {#each themePresets as theme}
        <button
          class="theme-card"
          class:selected={currentTheme === theme.id}
          onclick={() => applyTheme(theme.id)}
        >
          <div class="theme-preview">
            <div class="preview-colors">
              <div class="color-sample" style="background: {theme.colors.base00}"></div>
              <div class="color-sample" style="background: {theme.colors.base0D}"></div>
              <div class="color-sample" style="background: {theme.colors.base0B}"></div>
              <div class="color-sample" style="background: {theme.colors.base08}"></div>
            </div>
          </div>
          <div class="theme-info">
            <h3>{theme.name}</h3>
            <p>{theme.description}</p>
          </div>
        </button>
      {/each}
    </div>
  </section>

  <!-- The Magic: Single CSS Demo -->
  <section class="css-magic">
    <h2>🧙‍♀️ The Magic: Single CSS for All Themes</h2>
    <p>This is the same CSS code powering all the themes above. No duplicates, no conditional logic:</p>

    <CodeBlock code={sampleCSS} lang="css" />
  </section>

  <!-- Live Interface Demo -->
  <section class="live-demo">
    <h2>🚀 Live Interface Demo</h2>
    <p>This interface uses the same CSS variables. Watch it transform as you switch themes:</p>

    <div class="demo-interface">
      <!-- Navigation -->
      <nav class="demo-nav">
        <div class="nav-brand">MyApp</div>
        <div class="nav-links">
          <a href="#" class="nav-link active">Dashboard</a>
          <a href="#" class="nav-link">Projects</a>
          <a href="#" class="nav-link">Settings</a>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="demo-content">
        <div class="demo-sidebar">
          <h4>Navigation</h4>
          <ul class="sidebar-menu">
            <li class="menu-item active">📊 Analytics</li>
            <li class="menu-item">📁 Projects</li>
            <li class="menu-item">⚙️ Settings</li>
            <li class="menu-item">👥 Team</li>
          </ul>
        </div>

        <div class="demo-main">
          <div class="demo-header">
            <h1>Dashboard</h1>
            <div class="header-actions">
              <button class="btn btn-secondary">Export</button>
              <button class="btn btn-primary">New Project</button>
            </div>
          </div>

          <!-- Stats Cards -->
          <div class="stats-grid">
            <div class="stat-card">
              <h3>Revenue</h3>
              <div class="stat-value success">+12.5%</div>
              <div class="stat-subtitle">vs last month</div>
            </div>
            <div class="stat-card">
              <h3>Users</h3>
              <div class="stat-value info">2,847</div>
              <div class="stat-subtitle">active now</div>
            </div>
            <div class="stat-card">
              <h3>Errors</h3>
              <div class="stat-value error">-5.2%</div>
              <div class="stat-subtitle">improvement</div>
            </div>
          </div>

          <!-- Data Table -->
          <div class="data-table">
            <h3>Recent Activity</h3>
            <table>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Design System</td>
                  <td><span class="status-badge success">Active</span></td>
                  <td>
                    <div class="progress-bar">
                      <div class="progress-fill" style="width: 75%"></div>
                    </div>
                  </td>
                  <td>
                    <button class="btn-small primary">Edit</button>
                    <button class="btn-small secondary">View</button>
                  </td>
                </tr>
                <tr>
                  <td>Mobile App</td>
                  <td><span class="status-badge warning">Review</span></td>
                  <td>
                    <div class="progress-bar">
                      <div class="progress-fill" style="width: 45%"></div>
                    </div>
                  </td>
                  <td>
                    <button class="btn-small primary">Edit</button>
                    <button class="btn-small secondary">View</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Framework Agnostic -->
  <section class="framework-agnostic">
    <h2>🌐 Framework Agnostic by Design</h2>
    <p>These CSS variables work in any framework or vanilla JS. The design system is platform-independent:</p>

    <div class="framework-examples">
      <div class="framework-card">
        <h4>⚛️ React</h4>
        <CodeBlock code={CODE_EXAMPLES.react} lang="javascript" />
      </div>

      <div class="framework-card">
        <h4>🔥 Svelte</h4>
        <CodeBlock code={CODE_EXAMPLES.svelte} lang="svelte" />
      </div>

      <div class="framework-card">
        <h4>🟢 Vue</h4>
        <CodeBlock code={CODE_EXAMPLES.vue} lang="vue" />
      </div>

      <div class="framework-card">
        <h4>⚡ Vanilla</h4>
        <CodeBlock code={CODE_EXAMPLES.vanilla} lang="javascript" />
      </div>
    </div>

    <p class="framework-note">
      <strong>The secret sauce:</strong> All these frameworks use the same CSS variables underneath.
      One design system, unlimited implementations.
    </p>
  </section>

  <!-- Modern CSS Features -->
  <section class="modern-css">
    <h2>🆕 Leveraging Modern CSS (2026)</h2>
    <p>The system uses cutting-edge CSS features for enhanced developer experience:</p>

    <div class="feature-grid">
      <div class="feature-card">
        <h4>🎨 color-mix()</h4>
        <CodeBlock code="background: color-mix(in srgb, var(--base08) 15%, transparent);" lang="css" />
        <p>Dynamic opacity without hex calculations</p>
      </div>

      <div class="feature-card">
        <h4>🔄 Custom Properties</h4>
        <CodeBlock code={CODE_EXAMPLES.css} lang="css" />
        <p>Runtime theme switching without rebuilds</p>
      </div>

      <div class="feature-card">
        <h4>📊 Container Queries</h4>
        <CodeBlock code={CODE_EXAMPLES.containerQuery} lang="css" />
        <p>Responsive components that work in any theme</p>
      </div>

      <div class="feature-card">
        <h4>🌈 CSS Nesting</h4>
        <CodeBlock code={CODE_EXAMPLES.nesting} lang="css" />
        <p>Clean, readable theme-aware styles</p>
      </div>
    </div>
  </section>

  <!-- Notification -->
  {#if showNotification}
    <div class="notification notification-{notification.type}">
      {notification.message}
    </div>
  {/if}
</div>

<style>
  /* Base styles using semantic variables */
  .playground {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
    background: var(--base00);
    color: var(--base05);
    transition: all 0.3s ease;
  }

  .playground-hero {
    text-align: center;
    padding: 3rem 0 4rem;
    border-bottom: 1px solid var(--base02);
    margin-bottom: 3rem;
  }

  .playground-hero h1 {
    font-size: 3.5rem;
    font-weight: 800;
    color: var(--base07);
    margin: 0 0 1rem;
    background: linear-gradient(135deg, var(--base0D), var(--base0E));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .lead {
    font-size: 1.25rem;
    line-height: 1.7;
    color: var(--base04);
    max-width: 600px;
    margin: 0 auto;
  }

  .theme-selector h2,
  .css-magic h2,
  .live-demo h2,
  .framework-agnostic h2,
  .modern-css h2 {
    font-size: 2rem;
    color: var(--base07);
    margin: 0 0 1rem;
  }

  .theme-selector p,
  .css-magic p,
  .live-demo p,
  .framework-agnostic p {
    color: var(--base04);
    margin: 0 0 2rem;
    line-height: 1.6;
  }

  .theme-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin: 2rem 0;
  }

  .theme-card {
    background: var(--base01);
    border: 2px solid var(--base02);
    border-radius: 1rem;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
  }

  .theme-card:hover {
    border-color: var(--base0D);
    transform: translateY(-2px);
  }

  .theme-card.selected {
    border-color: var(--base0D);
    background: color-mix(in srgb, var(--base0D) 10%, var(--base01));
  }

  .theme-preview {
    margin-bottom: 1rem;
  }

  .preview-colors {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
  }

  .color-sample {
    width: 30px;
    height: 30px;
    border-radius: 0.5rem;
    border: 1px solid var(--base02);
  }

  .theme-info h3 {
    color: var(--base07);
    margin: 0 0 0.5rem;
  }

  .theme-info p {
    color: var(--base04);
    margin: 0;
    font-size: 0.875rem;
  }

  .css-magic {
    margin: 4rem 0;
  }

  .live-demo {
    margin: 4rem 0;
  }

  .demo-interface {
    background: var(--base01);
    border: 1px solid var(--base02);
    border-radius: 1rem;
    overflow: hidden;
    margin: 2rem 0;
  }

  .demo-nav {
    background: var(--base01);
    border-bottom: 1px solid var(--base02);
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nav-brand {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--base0D);
  }

  .nav-links {
    display: flex;
    gap: 1rem;
  }

  .nav-link {
    color: var(--base04);
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
  }

  .nav-link:hover {
    color: var(--base05);
    background: var(--base02);
  }

  .nav-link.active {
    color: var(--base0D);
    background: color-mix(in srgb, var(--base0D) 15%, transparent);
  }

  .demo-content {
    display: grid;
    grid-template-columns: 250px 1fr;
    min-height: 500px;
  }

  .demo-sidebar {
    background: var(--base00);
    border-right: 1px solid var(--base02);
    padding: 1.5rem;
  }

  .demo-sidebar h4 {
    color: var(--base06);
    margin: 0 0 1rem;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .sidebar-menu {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .menu-item {
    padding: 0.75rem 1rem;
    color: var(--base04);
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    margin: 0.25rem 0;
  }

  .menu-item:hover {
    background: var(--base02);
    color: var(--base05);
  }

  .menu-item.active {
    background: var(--base0D);
    color: var(--base00);
  }

  .demo-main {
    padding: 1.5rem;
  }

  .demo-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .demo-header h1 {
    color: var(--base07);
    margin: 0;
    font-size: 2rem;
  }

  .header-actions {
    display: flex;
    gap: 1rem;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s ease;
  }

  .btn-primary {
    background: var(--base0D);
    color: var(--base00);
  }

  .btn-secondary {
    background: var(--base02);
    color: var(--base05);
  }

  .btn:hover {
    opacity: 0.9;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin: 2rem 0;
  }

  .stat-card {
    background: var(--base01);
    border: 1px solid var(--base02);
    border-radius: 0.75rem;
    padding: 1.5rem;
  }

  .stat-card h3 {
    color: var(--base06);
    margin: 0 0 0.5rem;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    margin: 0.5rem 0;
  }

  .stat-value.success { color: var(--base0B); }
  .stat-value.info { color: var(--base0C); }
  .stat-value.error { color: var(--base08); }

  .stat-subtitle {
    color: var(--base04);
    font-size: 0.875rem;
  }

  .data-table {
    background: var(--base01);
    border: 1px solid var(--base02);
    border-radius: 0.75rem;
    overflow: hidden;
    margin: 2rem 0;
  }

  .data-table h3 {
    color: var(--base07);
    margin: 0;
    padding: 1.5rem;
    border-bottom: 1px solid var(--base02);
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th {
    background: var(--base00);
    color: var(--base06);
    padding: 1rem 1.5rem;
    text-align: left;
    font-weight: 600;
    font-size: 0.875rem;
    border-bottom: 1px solid var(--base02);
  }

  td {
    padding: 1rem 1.5rem;
    color: var(--base05);
    border-bottom: 1px solid var(--base02);
  }

  .status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .status-badge.success {
    background: color-mix(in srgb, var(--base0B) 20%, transparent);
    color: var(--base0B);
  }

  .status-badge.warning {
    background: color-mix(in srgb, var(--base09) 20%, transparent);
    color: var(--base09);
  }

  .status-badge.error {
    background: color-mix(in srgb, var(--base08) 20%, transparent);
    color: var(--base08);
  }

  .progress-bar {
    background: var(--base02);
    border-radius: 1rem;
    height: 8px;
    overflow: hidden;
  }

  .progress-fill {
    background: var(--base0D);
    height: 100%;
    border-radius: inherit;
    transition: width 0.3s ease;
  }

  .btn-small {
    padding: 0.375rem 0.75rem;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.2s ease;
    margin-right: 0.5rem;
  }

  .btn-small.primary {
    background: var(--base0D);
    color: var(--base00);
  }

  .btn-small.secondary {
    background: var(--base02);
    color: var(--base05);
  }

  .framework-agnostic {
    margin: 4rem 0;
  }

  .framework-examples {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin: 2rem 0;
  }

  .framework-card {
    background: var(--base01);
    border: 1px solid var(--base02);
    border-radius: 1rem;
    padding: 1.5rem;
  }

  .framework-card h4 {
    color: var(--base07);
    margin: 0 0 1rem;
    font-size: 1.125rem;
  }

  .framework-note {
    background: color-mix(in srgb, var(--base0D) 10%, transparent);
    border: 1px solid color-mix(in srgb, var(--base0D) 30%, transparent);
    border-radius: 1rem;
    padding: 1.5rem;
    margin: 2rem 0;
    color: var(--base05);
  }

  .modern-css {
    margin: 4rem 0;
  }

  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin: 2rem 0;
  }

  .feature-card {
    background: var(--base01);
    border: 1px solid var(--base02);
    border-radius: 1rem;
    padding: 1.5rem;
  }

  .feature-card h4 {
    color: var(--base07);
    margin: 0 0 1rem;
  }

  .feature-card p {
    color: var(--base04);
    margin: 1rem 0 0;
    font-size: 0.875rem;
  }

  .notification {
    position: fixed;
    top: 2rem;
    right: 2rem;
    padding: 1rem 1.5rem;
    border-radius: 0.75rem;
    font-weight: 600;
    z-index: 1000;
    animation: slideIn 0.3s ease;
  }

  .notification-success {
    background: color-mix(in srgb, var(--base0B) 20%, transparent);
    color: var(--base0B);
    border: 1px solid var(--base0B);
  }

  .notification-info {
    background: color-mix(in srgb, var(--base0C) 20%, transparent);
    color: var(--base0C);
    border: 1px solid var(--base0C);
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    .playground {
      padding: 1rem;
    }

    .playground-hero h1 {
      font-size: 2.5rem;
    }

    .demo-content {
      grid-template-columns: 1fr;
    }

    .demo-sidebar {
      border-right: none;
      border-bottom: 1px solid var(--base02);
    }

    .framework-examples {
      grid-template-columns: 1fr;
    }

    .notification {
      top: auto;
      bottom: 2rem;
      left: 1rem;
      right: 1rem;
    }
  }
</style>
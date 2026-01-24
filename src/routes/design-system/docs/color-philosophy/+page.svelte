<script>
  import { onMount } from 'svelte';

  // Base16 semantic definitions with responsibility patterns
  let baseColors = $state([
    {
      id: 'base00',
      hex: '#0a0f19',
      hexLight: '#ffffff',
      name: 'Default Background',
      responsibility: 'Page canvas, primary surface',
      usage: ['Page backgrounds', 'App canvas', 'Document base'],
      analogy: 'The paper you write on',
      contrast: 'L*5 (dark) / L*100 (light)'
    },
    {
      id: 'base01',
      hex: '#161d2d',
      hexLight: '#f7f8fa',
      name: 'Lighter Background',
      responsibility: 'Cards, panels, elevated surfaces',
      usage: ['Modal backgrounds', 'Card surfaces', 'Sidebar panels'],
      analogy: 'Index cards placed on paper',
      contrast: 'L*10 (dark) / L*97 (light)'
    },
    {
      id: 'base02',
      hex: '#273244',
      hexLight: '#eef1f5',
      name: 'Selection Background',
      responsibility: 'Hover states, active selections, elevated elements',
      usage: ['Hover backgrounds', 'Selected items', 'Pressed states'],
      analogy: 'Highlighted text on a page',
      contrast: 'L*18 (dark) / L*94 (light)'
    },
    {
      id: 'base03',
      hex: '#5a6884',
      hexLight: '#97a3b7',
      name: 'Disabled Foreground',
      responsibility: 'Disabled text, inactive elements',
      usage: ['Disabled buttons', 'Inactive navigation', 'Subtle borders'],
      analogy: 'Faded ink that\'s hard to read',
      contrast: 'L*42 (dark) / L*67 (light)'
    },
    {
      id: 'base04',
      hex: '#8896b3',
      hexLight: '#5e6b81',
      name: 'Dark Foreground',
      responsibility: 'Secondary text, supporting information',
      usage: ['Captions', 'Helper text', 'Secondary labels'],
      analogy: 'Notes written in pencil vs pen',
      contrast: 'L*60 (dark) / L*45 (light)'
    },
    {
      id: 'base05',
      hex: '#d4dce8',
      hexLight: '#1a2332',
      name: 'Default Foreground',
      responsibility: 'Primary text, main content',
      usage: ['Body text', 'Primary labels', 'Main content'],
      analogy: 'Black ink on white paper',
      contrast: 'L*86 (dark) / L*14 (light)'
    },
    {
      id: 'base06',
      hex: '#e8eef6',
      hexLight: '#0d1520',
      name: 'Light Foreground',
      responsibility: 'Emphasized text, headings',
      usage: ['Headings', 'Important labels', 'Call-to-action text'],
      analogy: 'Bold text that stands out',
      contrast: 'L*93 (dark) / L*7 (light)'
    },
    {
      id: 'base07',
      hex: '#ffffff',
      hexLight: '#000000',
      name: 'Lightest Foreground',
      responsibility: 'Maximum emphasis, critical information',
      usage: ['Page titles', 'Error text', 'Critical warnings'],
      analogy: 'The most important text on the page',
      contrast: 'L*100 (dark) / L*0 (light)'
    }
  ]);

  let accentColors = $state([
    {
      id: 'base08',
      hex: '#ff5757',
      hexLight: '#dc2626',
      name: 'Error/Danger',
      responsibility: 'Errors, critical warnings, destructive actions',
      usage: ['Error messages', 'Delete buttons', 'Critical alerts'],
      analogy: 'Red stop sign - immediate attention',
      semantics: 'Universal danger/error color'
    },
    {
      id: 'base09',
      hex: '#ff8c42',
      hexLight: '#ea580c',
      name: 'Warning/Caution',
      responsibility: 'Warnings, caution states, modified content',
      usage: ['Warning alerts', 'Unsaved changes', 'Pending actions'],
      analogy: 'Yellow traffic light - proceed with caution',
      semantics: 'Universal caution/warning color'
    },
    {
      id: 'base0A',
      hex: '#ffc73d',
      hexLight: '#ca8a04',
      name: 'Highlight/Search',
      responsibility: 'Search highlights, important notes, special attention',
      usage: ['Search results', 'Highlighted text', 'Featured content'],
      analogy: 'Yellow highlighter marker',
      semantics: 'Attention without alarm'
    },
    {
      id: 'base0B',
      hex: '#52d681',
      hexLight: '#16a34a',
      name: 'Success/Positive',
      responsibility: 'Success states, positive feedback, approved actions',
      usage: ['Success messages', 'Completed tasks', 'Approved items'],
      analogy: 'Green checkmark - all is well',
      semantics: 'Universal success/positive color'
    },
    {
      id: 'base0C',
      hex: '#42c7dd',
      hexLight: '#0891b2',
      name: 'Info/Secondary',
      responsibility: 'Information, secondary actions, neutral states',
      usage: ['Info messages', 'Secondary buttons', 'Neutral badges'],
      analogy: 'Blue information icon',
      semantics: 'Calm, informational, trustworthy'
    },
    {
      id: 'base0D',
      hex: '#5e9eff',
      hexLight: '#2563eb',
      name: 'Primary/Brand',
      responsibility: 'Primary actions, brand elements, links',
      usage: ['Primary buttons', 'Links', 'Brand accents'],
      analogy: 'Your signature color',
      semantics: 'Trust, reliability, primary action'
    },
    {
      id: 'base0E',
      hex: '#b47efc',
      hexLight: '#7c3aed',
      name: 'Keywords/Special',
      responsibility: 'Special states, premium features, magical elements',
      usage: ['Premium badges', 'AI features', 'Special categories'],
      analogy: 'Purple velvet - luxury and mystery',
      semantics: 'Premium, creative, innovative'
    },
    {
      id: 'base0F',
      hex: '#ffb157',
      hexLight: '#d97706',
      name: 'Deprecated/Alternative',
      responsibility: 'Deprecated features, alternative actions, special cases',
      usage: ['Deprecated warnings', 'Alternative paths', 'Special categories'],
      analogy: 'Amber - rare and valuable but different',
      semantics: 'Caution without danger'
    }
  ]);

  let selectedTheme = $state('dark');
  let selectedColor = $state('base00');
  let selectedColorData = $derived.by(() => {
    const base = [...baseColors, ...accentColors].find(c => c.id === selectedColor);
    return base || baseColors[0];
  });

  let currentHex = $derived.by(() => {
    return selectedTheme === 'dark' ? selectedColorData?.hex : selectedColorData?.hexLight;
  });

  // Cognitive load benefits
  let benefits = $state([
    {
      title: 'Predictable Patterns',
      description: 'Once users learn base08 = danger, they instantly recognize red elements across your entire platform',
      icon: '🧠'
    },
    {
      title: 'Reduced Training Time',
      description: 'Teams onboard faster when color meanings are consistent across tools, docs, and applications',
      icon: '⚡'
    },
    {
      title: 'Universal Language',
      description: 'Base16 creates a shared vocabulary between designers, developers, and users',
      icon: '🌍'
    },
    {
      title: 'Accessibility by Design',
      description: 'Color meanings supplement visual cues, reducing reliance on color alone for communication',
      icon: '♿'
    },
    {
      title: 'Scalable Consistency',
      description: 'From 10-component apps to 1000-component systems, semantic rules scale infinitely',
      icon: '📈'
    },
    {
      title: 'Cross-Platform Harmony',
      description: 'VS Code, terminals, web apps - users experience consistent color logic everywhere',
      icon: '🔄'
    }
  ]);

  // Interactive demonstration
  let demonstrationMode = $state('interface');
  let showColorMapping = $state(false);
</script>

<svelte:head>
  <title>Color Philosophy - Base16 Semantic System</title>
  <meta name="description" content="Explore the cognitive science behind Base16 color semantics and learn why predictable color patterns reduce mental load in interface design.">
</svelte:head>

<div class="color-philosophy">
  <header class="philosophy-hero">
    <h1>Color as a Visual Language</h1>
    <p class="lead">
      Why Base16 isn't just a color palette—it's a <strong>cognitive framework</strong> that reduces mental load
      and creates intuitive user experiences through consistent semantic patterns.
    </p>
  </header>

  <section class="core-insight">
    <div class="insight-content">
      <h2>🧠 The Core Insight</h2>
      <p>
        In code editors, developers instantly know that <span class="demo-red">red text means errors</span>,
        <span class="demo-green">green means success</span>, and <span class="demo-blue">blue means links/functions</span>.
        This isn't coincidence—it's <strong>learned pattern recognition</strong>.
      </p>
      <p>
        Base16 takes this cognitive principle and applies it to <em>entire interfaces</em>. When color meanings
        are consistent, users stop thinking about what colors mean and focus on their actual tasks.
      </p>
    </div>
  </section>

  <section class="ui-semantic-system">
    <h2>Base16 UI/UX Semantic System</h2>

    <div class="semantic-intro">
      <p>Just like Base16 syntax highlighting assigns specific meanings to each color (<code>base08</code> = variables, <code>base0B</code> = strings),
         we assign specific UI responsibilities to each color. This creates <strong>predictable patterns</strong> that developers
         learn once and apply everywhere.</p>
    </div>

    <div class="semantic-rules-compact">
      <h3>The Golden Rules</h3>
      <div class="rules-grid">
        <div class="rule-item">
          <span class="color-demo" style="background: var(--color-base08);"></span>
          <strong>base08 = Destructive</strong>
          <span>Delete, error, danger</span>
        </div>
        <div class="rule-item">
          <span class="color-demo" style="background: var(--color-base09);"></span>
          <strong>base09 = Caution</strong>
          <span>Warning, pending, review</span>
        </div>
        <div class="rule-item">
          <span class="color-demo" style="background: var(--color-base0A);"></span>
          <strong>base0A = Highlight</strong>
          <span>Search, feature, attention</span>
        </div>
        <div class="rule-item">
          <span class="color-demo" style="background: var(--color-base0B);"></span>
          <strong>base0B = Success</strong>
          <span>Complete, positive, go</span>
        </div>
        <div class="rule-item">
          <span class="color-demo" style="background: var(--color-base0C);"></span>
          <strong>base0C = Info</strong>
          <span>Neutral, secondary, calm</span>
        </div>
        <div class="rule-item">
          <span class="color-demo" style="background: var(--color-base0D);"></span>
          <strong>base0D = Primary</strong>
          <span>Action, brand, links</span>
        </div>
        <div class="rule-item">
          <span class="color-demo" style="background: var(--color-base0E);"></span>
          <strong>base0E = Special</strong>
          <span>Premium, magic, unique</span>
        </div>
        <div class="rule-item">
          <span class="color-demo" style="background: var(--color-base0F);"></span>
          <strong>base0F = Alternative</strong>
          <span>Deprecated, alternative, edge</span>
        </div>
      </div>
    </div>

    <div class="ui-component-examples">
      <h3>Live Component Examples</h3>
      <p>See each Base16 color in action with real UI components:</p>

      <!-- Button Examples -->
      <div class="component-demo">
        <h4>Button Semantics</h4>
        <div class="button-showcase">
          <button class="demo-btn" style="background: var(--color-base0D); color: var(--color-base00);">
            Save Changes (base0D)
          </button>
          <button class="demo-btn" style="background: var(--color-base0C); color: var(--color-base00);">
            More Info (base0C)
          </button>
          <button class="demo-btn" style="background: var(--color-base0B); color: var(--color-base00);">
            Confirm (base0B)
          </button>
          <button class="demo-btn" style="background: var(--color-base09); color: var(--color-base00);">
            Review (base09)
          </button>
          <button class="demo-btn" style="background: var(--color-base08); color: var(--color-base00);">
            Delete (base08)
          </button>
        </div>
      </div>

      <!-- Alert Examples -->
      <div class="component-demo">
        <h4>Alert Semantics</h4>
        <div class="alert-showcase">
          <div class="alert-demo success">
            <div class="alert-indicator" style="background: var(--color-base0B);"></div>
            <div class="alert-content">
              <strong style="color: var(--color-base0B);">Success (base0B):</strong> Your changes have been saved
            </div>
          </div>
          <div class="alert-demo info">
            <div class="alert-indicator" style="background: var(--color-base0C);"></div>
            <div class="alert-content">
              <strong style="color: var(--color-base0C);">Info (base0C):</strong> New feature available
            </div>
          </div>
          <div class="alert-demo warning">
            <div class="alert-indicator" style="background: var(--color-base09);"></div>
            <div class="alert-content">
              <strong style="color: var(--color-base09);">Warning (base09):</strong> Please review your settings
            </div>
          </div>
          <div class="alert-demo error">
            <div class="alert-indicator" style="background: var(--color-base08);"></div>
            <div class="alert-content">
              <strong style="color: var(--color-base08);">Error (base08):</strong> Failed to save changes
            </div>
          </div>
        </div>
      </div>

      <!-- Badge Examples -->
      <div class="component-demo">
        <h4>Badge & Status Semantics</h4>
        <div class="badge-showcase">
          <span class="demo-badge" style="background: var(--color-base0B); color: var(--color-base00);">Active</span>
          <span class="demo-badge" style="background: var(--color-base0D); color: var(--color-base00);">Featured</span>
          <span class="demo-badge" style="background: var(--color-base0C); color: var(--color-base00);">Info</span>
          <span class="demo-badge" style="background: var(--color-base09); color: var(--color-base00);">Pending</span>
          <span class="demo-badge" style="background: var(--color-base08); color: var(--color-base00);">Blocked</span>
          <span class="demo-badge" style="background: var(--color-base0E); color: var(--color-base00);">Premium</span>
          <span class="demo-badge" style="background: var(--color-base0A); color: var(--color-base00);">New</span>
          <span class="demo-badge" style="background: var(--color-base0F); color: var(--color-base00);">Legacy</span>
        </div>
      </div>
    </div>

    <div class="semantic-benefits-compact">
      <h3>Why Semantic Consistency Works</h3>
      <div class="benefits-grid">
        <div class="benefit-card">
          <h4>🧠 Cognitive Efficiency</h4>
          <p>Users learn color meanings once and apply them everywhere. No thinking required.</p>
        </div>
        <div class="benefit-card">
          <h4>⚡ Development Speed</h4>
          <p>Developers know instantly which color to use for any UI element. No guesswork.</p>
        </div>
        <div class="benefit-card">
          <h4>🎯 Accessibility</h4>
          <p>Consistent color semantics provide multiple cues beyond just visual appearance.</p>
        </div>
        <div class="benefit-card">
          <h4>📱 Cross-Platform</h4>
          <p>Same color logic works in web apps, mobile apps, terminal interfaces, everywhere.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="interactive-explorer">
    <h2>Interactive Color Explorer</h2>

    <div class="controls">
      <div class="theme-switcher">
        <label for="theme-select">Theme:</label>
        <select id="theme-select" bind:value={selectedTheme}>
          <option value="dark">Dark Mode</option>
          <option value="light">Light Mode</option>
        </select>
      </div>

      <div class="color-picker">
        <span class="label-text">Explore Color:</span>
        <div class="color-grid">
          {#each baseColors as color}
            <button
              class="color-swatch {color.id === selectedColor ? 'selected' : ''}"
              style="background-color: {selectedTheme === 'dark' ? color.hex : color.hexLight}"
              onclick={() => selectedColor = color.id}
              title="{color.name}"
            >
              {color.id}
            </button>
          {/each}
          <div class="separator"></div>
          {#each accentColors as color}
            <button
              class="color-swatch {color.id === selectedColor ? 'selected' : ''}"
              style="background-color: {selectedTheme === 'dark' ? color.hex : color.hexLight}"
              onclick={() => selectedColor = color.id}
              title="{color.name}"
            >
              {color.id}
            </button>
          {/each}
        </div>
      </div>
    </div>

    {#if selectedColorData}
      <div class="color-details">
        <div class="color-info">
          <div class="color-preview" style="background-color: {currentHex}"></div>
          <div class="color-meta">
            <h3>{selectedColorData.id.toUpperCase()}: {selectedColorData.name}</h3>
            <p class="responsibility"><strong>Responsibility:</strong> {selectedColorData.responsibility}</p>
            <p class="hex-value"><strong>Current Hex:</strong> <code>{currentHex}</code></p>
            {#if selectedColorData.contrast}
              <p class="contrast"><strong>Luminance:</strong> {selectedColorData.contrast}</p>
            {/if}
            {#if selectedColorData.semantics}
              <p class="semantics"><strong>Psychology:</strong> {selectedColorData.semantics}</p>
            {/if}
          </div>
        </div>

        <div class="usage-examples">
          <h4>Real-World Usage</h4>
          <ul>
            {#each selectedColorData.usage as usage}
              <li>{usage}</li>
            {/each}
          </ul>
          <p class="analogy"><strong>Think of it as:</strong> {selectedColorData.analogy}</p>
        </div>
      </div>
    {/if}
  </section>

  <section class="cognitive-benefits">
    <h2>Why This Reduces Cognitive Load</h2>
    <div class="benefits-grid">
      {#each benefits as benefit}
        <div class="benefit-card">
          <div class="benefit-icon">{benefit.icon}</div>
          <h3>{benefit.title}</h3>
          <p>{benefit.description}</p>
        </div>
      {/each}
    </div>
  </section>

  <section class="live-demonstration">
    <h2>Live Interface Demonstration</h2>
    <p>See how Base16 semantics work in practice:</p>

    <div class="demo-controls">
      <button
        class="demo-button {demonstrationMode === 'interface' ? 'active' : ''}"
        onclick={() => demonstrationMode = 'interface'}
      >
        Interface Elements
      </button>
      <button
        class="demo-button {demonstrationMode === 'alerts' ? 'active' : ''}"
        onclick={() => demonstrationMode = 'alerts'}
      >
        Alert States
      </button>
      <button
        class="demo-button {demonstrationMode === 'editor' ? 'active' : ''}"
        onclick={() => demonstrationMode = 'editor'}
      >
        Code Editor
      </button>
    </div>

    <div class="demonstration-area" data-theme="{selectedTheme === 'dark' ? 'miozu-dark' : 'miozu-light'}">
      {#if demonstrationMode === 'interface'}
        <div class="demo-interface">
          <div class="demo-card" style="background-color: var(--color-base01); border: 1px solid var(--color-base02);">
            <h4 style="color: var(--color-base07);">User Dashboard</h4>
            <p style="color: var(--color-base05);">Welcome back! You have 3 notifications.</p>
            <p style="color: var(--color-base04);">Last login: 2 hours ago</p>
            <div class="demo-buttons">
              <button class="demo-btn" style="background: var(--color-base0D); color: var(--color-base00);">Primary Action</button>
              <button class="demo-btn" style="background: var(--color-base0C); color: var(--color-base00);">Secondary Action</button>
              <button class="demo-btn" style="background: var(--color-base08); color: var(--color-base00);">Delete</button>
            </div>
          </div>
        </div>
      {/if}

      {#if demonstrationMode === 'alerts'}
        <div class="demo-alerts">
          <div class="alert success" style="background: color-mix(in srgb, var(--color-base0B) 15%, transparent); border-left: 4px solid var(--color-base0B);">
            <strong style="color: var(--color-base0B);">Success:</strong>
            <span style="color: var(--color-base05);">Your changes have been saved.</span>
          </div>
          <div class="alert warning" style="background: color-mix(in srgb, var(--color-base09) 15%, transparent); border-left: 4px solid var(--color-base09);">
            <strong style="color: var(--color-base09);">Warning:</strong>
            <span style="color: var(--color-base05);">This action cannot be undone.</span>
          </div>
          <div class="alert error" style="background: color-mix(in srgb, var(--color-base08) 15%, transparent); border-left: 4px solid var(--color-base08);">
            <strong style="color: var(--color-base08);">Error:</strong>
            <span style="color: var(--color-base05);">Invalid email address format.</span>
          </div>
          <div class="alert info" style="background: color-mix(in srgb, var(--color-base0C) 15%, transparent); border-left: 4px solid var(--color-base0C);">
            <strong style="color: var(--color-base0C);">Info:</strong>
            <span style="color: var(--color-base05);">Database maintenance scheduled for tonight.</span>
          </div>
        </div>
      {/if}

      {#if demonstrationMode === 'editor'}
        <div class="demo-editor">
          <div class="editor-container" style="background: var(--color-base00); border: 1px solid var(--color-base02);">
            <div class="editor-header" style="background: var(--color-base01); border-bottom: 1px solid var(--color-base02); padding: 0.5rem;">
              <span style="color: var(--color-base05);">config.js</span>
            </div>
            <div class="editor-content">
              <pre style="margin: 0; padding: 1rem; color: var(--color-base05);"><code><span style="color: var(--color-base0E);">const</span> <span style="color: var(--color-base05);">config</span> <span style="color: var(--color-base06)">=</span> <span style="color: var(--color-base02);">&#123;</span>
  <span style="color: var(--color-base08);">api_url</span><span style="color: var(--color-base06);">:</span> <span style="color: var(--color-base0B);">"https://api.example.com"</span><span style="color: var(--color-base06)">,</span>
  <span style="color: var(--color-base08);">timeout</span><span style="color: var(--color-base06);">:</span> <span style="color: var(--color-base09);">5000</span><span style="color: var(--color-base06)">,</span>
  <span style="color: var(--color-base08);">debug</span><span style="color: var(--color-base06);">:</span> <span style="color: var(--color-base0D);">true</span>
<span style="color: var(--color-base02);">&#125;</span></code></pre>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </section>

  <section class="call-to-action">
    <h2>Extend This Philosophy</h2>
    <p>
      Ready to see how these patterns apply across different contexts?
      Explore our interactive color playground and create your own semantic mappings.
    </p>
    <div class="action-buttons">
      <a href="/design-system/docs/color-playground" class="action-btn primary">
        Color Playground →
      </a>
      <a href="/design-system/docs/colors" class="action-btn secondary">
        Color Reference →
      </a>
    </div>
  </section>
</div>

<style>
  .color-philosophy {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    color: var(--color-text);
  }

  .philosophy-hero {
    text-align: center;
    padding: 3rem 0 4rem;
    border-bottom: 1px solid var(--color-border);
    margin-bottom: 3rem;
  }

  .philosophy-hero h1 {
    font-size: 3rem;
    font-weight: 700;
    color: var(--color-text-strong);
    margin: 0 0 1rem;
  }

  .lead {
    font-size: 1.25rem;
    line-height: 1.6;
    color: var(--color-text-muted);
    max-width: 800px;
    margin: 0 auto;
  }

  .core-insight {
    background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-alt) 100%);
    border: 2px solid var(--color-primary);
    border-radius: 1rem;
    padding: 2rem;
    margin: 3rem 0;
    position: relative;
  }

  .core-insight::before {
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

  .insight-content h2 {
    margin: 0 0 1rem;
    color: var(--color-primary);
    font-size: 1.5rem;
  }

  .insight-content p {
    margin: 0 0 1rem;
    line-height: 1.7;
  }

  .insight-content p:last-child {
    margin-bottom: 0;
  }

  .demo-red { color: #ff5757; font-weight: 600; }
  .demo-green { color: #52d681; font-weight: 600; }
  .demo-blue { color: #5e9eff; font-weight: 600; }

  .interactive-explorer {
    margin: 4rem 0;
  }

  .interactive-explorer h2 {
    margin: 0 0 2rem;
    font-size: 2rem;
    color: var(--color-text-strong);
  }

  .controls {
    display: flex;
    gap: 2rem;
    margin: 2rem 0;
    flex-wrap: wrap;
  }

  .theme-switcher label,
  .color-picker .label-text {
    display: block;
    font-weight: 600;
    color: var(--color-text-strong);
    margin-bottom: 0.5rem;
  }

  .theme-switcher select {
    padding: 0.5rem 1rem;
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
    background: var(--color-surface);
    color: var(--color-text);
  }

  .color-grid {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .color-swatch {
    width: 50px;
    height: 50px;
    border-radius: 0.5rem;
    border: 2px solid transparent;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.75rem;
    font-weight: 600;
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .color-swatch:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .color-swatch.selected {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px var(--color-primary);
  }

  .separator {
    width: 1px;
    height: 30px;
    background: var(--color-border);
    margin: 0 0.5rem;
  }

  .color-details {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 1rem;
    padding: 2rem;
    margin: 2rem 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .color-info {
    display: flex;
    gap: 1rem;
  }

  .color-preview {
    width: 80px;
    height: 80px;
    border-radius: 0.5rem;
    border: 1px solid var(--color-border);
    flex-shrink: 0;
  }

  .color-meta h3 {
    margin: 0 0 0.5rem;
    font-size: 1.25rem;
    color: var(--color-text-strong);
  }

  .color-meta p {
    margin: 0.5rem 0;
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .responsibility {
    color: var(--color-primary) !important;
    font-weight: 600;
  }

  .hex-value code {
    background: var(--color-surface-alt);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-family: monospace;
  }

  .usage-examples h4 {
    margin: 0 0 1rem;
    color: var(--color-text-strong);
  }

  .usage-examples ul {
    margin: 0 0 1rem;
    padding-left: 1.5rem;
  }

  .usage-examples li {
    margin: 0.5rem 0;
    color: var(--color-text);
  }

  .analogy {
    color: var(--color-text-muted) !important;
    font-style: italic;
  }

  .cognitive-benefits {
    margin: 4rem 0;
  }

  .cognitive-benefits h2 {
    margin: 0 0 2rem;
    font-size: 2rem;
    color: var(--color-text-strong);
    text-align: center;
  }

  .benefits-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .benefit-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 1rem;
    padding: 1.5rem;
    text-align: center;
  }

  .benefit-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .benefit-card h3 {
    margin: 0 0 1rem;
    color: var(--color-text-strong);
  }

  .benefit-card p {
    margin: 0;
    color: var(--color-text-muted);
    line-height: 1.6;
  }

  .live-demonstration {
    margin: 4rem 0;
  }

  .live-demonstration h2 {
    margin: 0 0 1rem;
    font-size: 2rem;
    color: var(--color-text-strong);
  }

  .live-demonstration > p {
    margin: 0 0 2rem;
    color: var(--color-text-muted);
  }

  .demo-controls {
    display: flex;
    gap: 1rem;
    margin: 2rem 0;
  }

  .demo-button {
    padding: 0.75rem 1.5rem;
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
    background: var(--color-surface);
    color: var(--color-text);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .demo-button:hover {
    border-color: var(--color-primary);
  }

  .demo-button.active {
    background: var(--color-primary);
    color: var(--color-surface);
    border-color: var(--color-primary);
  }

  .demonstration-area {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 1rem;
    padding: 2rem;
    margin: 1rem 0;
    min-height: 200px;
  }

  .demo-card {
    border-radius: 0.5rem;
    padding: 1.5rem;
  }

  .demo-card h4 {
    margin: 0 0 0.5rem;
  }

  .demo-card p {
    margin: 0.5rem 0;
  }

  .demo-buttons {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .demo-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 600;
    transition: opacity 0.2s ease;
  }

  .demo-btn:hover {
    opacity: 0.9;
  }

  .demo-alerts {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .alert {
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
  }

  .alert strong {
    font-weight: 600;
  }

  .editor-container {
    border-radius: 0.5rem;
    overflow: hidden;
    font-family: 'Fira Code', 'SF Mono', Consolas, monospace;
  }

  .editor-header {
    font-size: 0.875rem;
    font-weight: 500;
  }

  .call-to-action {
    text-align: center;
    padding: 3rem 0;
    border-top: 1px solid var(--color-border);
    margin-top: 4rem;
  }

  .call-to-action h2 {
    margin: 0 0 1rem;
    font-size: 2rem;
    color: var(--color-text-strong);
  }

  .call-to-action p {
    margin: 0 0 2rem;
    color: var(--color-text-muted);
    font-size: 1.125rem;
  }

  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }

  .action-btn {
    padding: 0.75rem 2rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s ease;
  }

  .action-btn.primary {
    background: var(--color-primary);
    color: var(--color-surface);
  }

  .action-btn.primary:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  .action-btn.secondary {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    color: var(--color-text);
  }

  .action-btn.secondary:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  /* UI Semantic System Styles */
  .ui-semantic-system {
    margin: 4rem 0;
  }

  .semantic-intro {
    margin-bottom: 2rem;
  }

  .semantic-intro p {
    font-size: 1.125rem;
    line-height: 1.6;
    color: var(--color-text);
  }

  .semantic-intro code {
    background: var(--color-surface);
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    font-family: 'Fira Code', monospace;
    font-size: 0.9em;
    color: var(--color-primary);
  }

  .semantic-rules-compact h3 {
    margin-bottom: 1rem;
    color: var(--color-text-strong);
  }

  .rules-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 3rem;
  }

  .rule-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: var(--color-surface);
    border-radius: 0.5rem;
    border: 1px solid var(--color-border);
  }

  .color-demo {
    width: 1rem;
    height: 1rem;
    border-radius: 0.25rem;
    flex-shrink: 0;
  }

  .rule-item strong {
    color: var(--color-text-strong);
    font-size: 0.875rem;
    min-width: 100px;
  }

  .rule-item span:last-child {
    color: var(--color-text-muted);
    font-size: 0.825rem;
  }

  .component-demo {
    margin-bottom: 2rem;
  }

  .component-demo h4 {
    margin-bottom: 1rem;
    color: var(--color-text-strong);
    font-size: 1rem;
  }

  .button-showcase {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .demo-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .demo-btn:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  .alert-showcase {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .alert-demo {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.75rem;
    background: var(--color-surface);
    border-radius: 0.375rem;
    border: 1px solid var(--color-border);
  }

  .alert-indicator {
    width: 4px;
    height: 2rem;
    border-radius: 2px;
    flex-shrink: 0;
  }

  .alert-content {
    flex: 1;
    font-size: 0.875rem;
    line-height: 1.4;
    color: var(--color-text);
  }

  .badge-showcase {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .demo-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .semantic-benefits-compact h3 {
    margin-bottom: 1rem;
    color: var(--color-text-strong);
  }

  .benefits-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1rem;
  }

  .benefit-card {
    padding: 1.5rem;
    background: var(--color-surface);
    border-radius: 0.5rem;
    border: 1px solid var(--color-border);
  }

  .benefit-card h4 {
    margin: 0 0 0.5rem;
    color: var(--color-text-strong);
    font-size: 0.975rem;
  }

  .benefit-card p {
    margin: 0;
    color: var(--color-text);
    font-size: 0.875rem;
    line-height: 1.4;
  }

  @media (max-width: 768px) {
    .color-philosophy {
      padding: 1rem;
    }

    .philosophy-hero h1 {
      font-size: 2rem;
    }

    .color-details {
      grid-template-columns: 1fr;
    }

    .color-info {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .benefits-grid {
      grid-template-columns: 1fr;
    }

    .demo-controls {
      flex-wrap: wrap;
    }

    .action-buttons {
      flex-direction: column;
      align-items: center;
    }

    .rules-grid {
      grid-template-columns: 1fr;
    }

    .rule-item {
      flex-direction: column;
      align-items: flex-start;
      text-align: left;
    }

    .rule-item strong {
      min-width: auto;
    }

    .button-showcase {
      flex-direction: column;
    }

    .badge-showcase {
      justify-content: center;
    }

    .benefits-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
<script>
  import { onMount } from 'svelte';

  // Sample ports data (you'll want to populate this with real data)
  let allPorts = $state([
    {
      id: 'jera-svelte',
      name: 'Jera (Svelte)',
      description: 'Reactive component library for Svelte 5 with complete Miozu theming',
      category: 'Frontend Framework',
      platform: 'Svelte/SvelteKit',
      status: 'official',
      maintainer: 'Miozu Team',
      repo: 'https://github.com/miozu-com/jera',
      preview: '/previews/placeholder.svg',
      downloads: '2.1k'
    },
    {
      id: 'dash-selify',
      name: 'Dash Selify',
      description: 'Production SaaS dashboard with advanced Miozu theming system',
      category: 'Application',
      platform: 'SvelteKit',
      status: 'official',
      maintainer: 'Selify Team',
      repo: 'https://github.com/miozu-com/dash-selify-ai',
      preview: '/previews/placeholder.svg',
      downloads: 'Private'
    },
    {
      id: 'vscode-miozu',
      name: 'VS Code Miozu',
      description: 'Complete VS Code theme with syntax highlighting and UI theming',
      category: 'Editor',
      platform: 'Visual Studio Code',
      status: 'official',
      maintainer: 'Miozu Team',
      repo: 'https://github.com/miozu-com/vscode-miozu',
      preview: '/previews/placeholder.svg',
      downloads: '5.2k'
    },
    {
      id: 'terminal-miozu',
      name: 'Terminal Miozu',
      description: 'Terminal color schemes for iTerm2, Terminal.app, and Alacritty',
      category: 'Terminal',
      platform: 'Cross-platform',
      status: 'community',
      maintainer: 'Community',
      repo: 'https://github.com/miozu-com/terminal-themes',
      preview: '/previews/placeholder.svg',
      downloads: '1.8k'
    },
    {
      id: 'tailwind-miozu',
      name: 'Tailwind Miozu',
      description: 'Tailwind CSS plugin with Miozu color palette and utilities',
      category: 'CSS Framework',
      platform: 'Tailwind CSS',
      status: 'official',
      maintainer: 'Miozu Team',
      repo: 'https://github.com/miozu-com/tailwind-miozu',
      preview: '/previews/placeholder.svg',
      downloads: '3.4k'
    },
    {
      id: 'figma-miozu',
      name: 'Figma Miozu',
      description: 'Design system kit with Miozu colors, tokens, and components',
      category: 'Design Tool',
      platform: 'Figma',
      status: 'official',
      maintainer: 'Miozu Team',
      repo: 'https://github.com/miozu-com/figma-miozu',
      preview: '/previews/placeholder.svg',
      downloads: '892'
    }
  ]);

  let searchQuery = $state('');
  let selectedCategory = $state('all');
  let selectedStatus = $state('all');

  let filteredPorts = $derived(() => {
    return allPorts.filter(port => {
      const matchesSearch = port.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           port.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           port.platform.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || port.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || port.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  });

  let categories = $derived(() => {
    const cats = [...new Set(allPorts.map(p => p.category))];
    return cats.sort();
  });
</script>

<svelte:head>
  <title>Miozu Theme Ports - Available Implementations</title>
  <meta name="description" content="Explore all available Miozu theme ports across different platforms, editors, frameworks, and tools. Find the perfect implementation for your workflow.">
</svelte:head>

<div class="ports-page">
  <header class="hero">
    <div class="hero-content">
      <h1 class="hero-title">
        Theme Ports
        <span class="hero-subtitle">Available Implementations</span>
      </h1>
      <p class="hero-description">
        The Miozu design system has been ported to various platforms and tools.
        Find the perfect implementation for your workflow, or learn how to create your own port.
      </p>
      <div class="hero-stats">
        <div class="stat">
          <span class="stat-number">{allPorts.length}</span>
          <span class="stat-label">Total Ports</span>
        </div>
        <div class="stat">
          <span class="stat-number">{allPorts.filter(p => p.status === 'official').length}</span>
          <span class="stat-label">Official</span>
        </div>
        <div class="stat">
          <span class="stat-number">{categories.length}</span>
          <span class="stat-label">Categories</span>
        </div>
      </div>
    </div>
  </header>

  <section class="search-section">
    <div class="search-container">
      <div class="search-bar">
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search ports by name, description, or platform..."
          class="search-input"
        >
        <div class="search-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </div>
      </div>

      <div class="filters">
        <select bind:value={selectedCategory} class="filter-select">
          <option value="all">All Categories</option>
          {#each categories as category}
            <option value={category}>{category}</option>
          {/each}
        </select>

        <select bind:value={selectedStatus} class="filter-select">
          <option value="all">All Status</option>
          <option value="official">Official</option>
          <option value="community">Community</option>
        </select>
      </div>
    </div>

    <div class="results-count">
      Showing {filteredPorts.length} of {allPorts.length} ports
    </div>
  </section>

  <section class="ports-grid">
    {#each filteredPorts as port (port.id)}
      <article class="port-card">
        <div class="port-header">
          <div class="port-preview">
            <img src={port.preview} alt="{port.name} preview" loading="lazy" />
          </div>
          <div class="port-badge">
            <span class="status-badge status-{port.status}">{port.status}</span>
            <span class="category-badge">{port.category}</span>
          </div>
        </div>

        <div class="port-content">
          <h3 class="port-title">{port.name}</h3>
          <p class="port-description">{port.description}</p>

          <div class="port-meta">
            <div class="meta-item">
              <span class="meta-label">Platform:</span>
              <span class="meta-value">{port.platform}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Maintained by:</span>
              <span class="meta-value">{port.maintainer}</span>
            </div>
            {#if port.downloads !== 'Private'}
              <div class="meta-item">
                <span class="meta-label">Downloads:</span>
                <span class="meta-value">{port.downloads}</span>
              </div>
            {/if}
          </div>
        </div>

        <div class="port-actions">
          <a href={port.repo} target="_blank" rel="noopener noreferrer" class="action-btn primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            View Source
          </a>

          {#if port.status === 'official'}
            <a href="/design-system/docs/installation" class="action-btn secondary">
              Get Started
            </a>
          {/if}
        </div>
      </article>
    {/each}
  </section>

  {#if filteredPorts.length === 0}
    <div class="empty-state">
      <div class="empty-icon">🔍</div>
      <h3>No ports found</h3>
      <p>Try adjusting your search criteria or filters.</p>
      <button onclick={() => { searchQuery = ''; selectedCategory = 'all'; selectedStatus = 'all'; }} class="reset-btn">
        Reset Filters
      </button>
    </div>
  {/if}

  <section class="contribute-section">
    <div class="contribute-content">
      <h2>Create Your Own Port</h2>
      <p>
        Want to bring Miozu to your favorite platform? We'd love to help you create a new port.
        Check out our porting guide and contribute to the ecosystem.
      </p>
      <div class="contribute-actions">
        <a href="https://github.com/miozu-com/porting-guide" target="_blank" rel="noopener" class="contribute-btn primary">
          Porting Guide
        </a>
        <a href="https://github.com/orgs/miozu-com/repositories" target="_blank" rel="noopener" class="contribute-btn secondary">
          View All Repos
        </a>
      </div>
    </div>
  </section>
</div>

<style>
  .ports-page {
    min-height: 100vh;
    background: var(--color-bg);
  }

  .hero {
    background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-alt) 100%);
    border-bottom: 1px solid var(--color-border);
    padding: 4rem 2rem;
    text-align: center;
  }

  .hero-content {
    max-width: 800px;
    margin: 0 auto;
  }

  .hero-title {
    font-size: 3rem;
    font-weight: 700;
    color: var(--color-text-strong);
    margin: 0 0 1rem;
  }

  .hero-subtitle {
    display: block;
    font-size: 1.5rem;
    color: var(--color-primary);
    font-weight: 500;
    margin-top: 0.5rem;
  }

  .hero-description {
    font-size: 1.125rem;
    color: var(--color-text-muted);
    line-height: 1.6;
    margin: 2rem 0;
  }

  .hero-stats {
    display: flex;
    justify-content: center;
    gap: 3rem;
    margin-top: 3rem;
  }

  .stat {
    text-align: center;
  }

  .stat-number {
    display: block;
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-primary);
  }

  .stat-label {
    display: block;
    font-size: 0.875rem;
    color: var(--color-text-muted);
    margin-top: 0.25rem;
  }

  .search-section {
    padding: 2rem;
    background: var(--color-bg);
    border-bottom: 1px solid var(--color-border);
  }

  .search-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .search-bar {
    flex: 1;
    position: relative;
    min-width: 300px;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 3rem;
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
    background: var(--color-surface);
    color: var(--color-text);
    font-size: 0.875rem;
  }

  .search-input::placeholder {
    color: var(--color-text-muted);
  }

  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-text-muted);
  }

  .filters {
    display: flex;
    gap: 1rem;
  }

  .filter-select {
    padding: 0.75rem 1rem;
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
    background: var(--color-surface);
    color: var(--color-text);
    font-size: 0.875rem;
  }

  .results-count {
    max-width: 1200px;
    margin: 1rem auto 0;
    font-size: 0.875rem;
    color: var(--color-text-muted);
  }

  .ports-grid {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  .port-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 1rem;
    overflow: hidden;
    transition: all 0.2s ease;
  }

  .port-card:hover {
    border-color: var(--color-primary);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
  }

  .port-header {
    position: relative;
  }

  .port-preview {
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: var(--color-surface-alt);
  }

  .port-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .port-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .status-official {
    background: var(--color-success);
    color: var(--color-bg);
  }

  .status-community {
    background: var(--color-warning);
    color: var(--color-bg);
  }

  .category-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    color: var(--color-text-muted);
  }

  .port-content {
    padding: 1.5rem;
  }

  .port-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text-strong);
    margin: 0 0 0.5rem;
  }

  .port-description {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    line-height: 1.5;
    margin: 0 0 1.5rem;
  }

  .port-meta {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .meta-item {
    display: flex;
    justify-content: space-between;
    font-size: 0.8125rem;
  }

  .meta-label {
    color: var(--color-text-muted);
  }

  .meta-value {
    color: var(--color-text);
    font-weight: 500;
  }

  .port-actions {
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--color-border);
    display: flex;
    gap: 0.75rem;
  }

  .action-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s ease;
    flex: 1;
    justify-content: center;
  }

  .action-btn.primary {
    background: var(--color-primary);
    color: var(--color-bg);
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

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--color-text-muted);
  }

  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .empty-state h3 {
    margin: 0 0 0.5rem;
    color: var(--color-text);
  }

  .empty-state p {
    margin: 0 0 2rem;
  }

  .reset-btn {
    background: var(--color-primary);
    color: var(--color-bg);
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .reset-btn:hover {
    opacity: 0.9;
  }

  .contribute-section {
    background: var(--color-surface);
    border-top: 1px solid var(--color-border);
    padding: 4rem 2rem;
    text-align: center;
  }

  .contribute-content {
    max-width: 600px;
    margin: 0 auto;
  }

  .contribute-content h2 {
    font-size: 2rem;
    color: var(--color-text-strong);
    margin: 0 0 1rem;
  }

  .contribute-content p {
    font-size: 1.125rem;
    color: var(--color-text-muted);
    line-height: 1.6;
    margin: 0 0 2rem;
  }

  .contribute-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .contribute-btn {
    display: inline-flex;
    align-items: center;
    padding: 0.75rem 2rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .contribute-btn.primary {
    background: var(--color-primary);
    color: var(--color-bg);
  }

  .contribute-btn.primary:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  .contribute-btn.secondary {
    background: transparent;
    border: 1px solid var(--color-border);
    color: var(--color-text);
  }

  .contribute-btn.secondary:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  @media (max-width: 768px) {
    .hero {
      padding: 2rem 1rem;
    }

    .hero-title {
      font-size: 2rem;
    }

    .hero-stats {
      gap: 1.5rem;
    }

    .search-container {
      flex-direction: column;
      align-items: stretch;
    }

    .filters {
      justify-content: stretch;
    }

    .filter-select {
      flex: 1;
    }

    .ports-grid {
      grid-template-columns: 1fr;
      padding: 1rem;
    }

    .port-actions {
      flex-direction: column;
    }

    .contribute-actions {
      flex-direction: column;
      align-items: center;
    }
  }
</style>
<script>
  import {onMount} from 'svelte';
  import {Button} from '$components/jera';

  let visibleSections = $state(new Set());

  onMount(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-animate');
            if (id && !visibleSections.has(id)) {
              visibleSections = new Set([...visibleSections, id]);
            }
          }
        });
      },
      {threshold: 0.15, rootMargin: '50px 0px'}
    );

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  });

  const capabilities = [
    {
      title: 'Design System Governance',
      description: 'AI-powered system that eliminates design debt and component proliferation. Maintains consistency across distributed teams.',
      icon: 'ai'
    },
    {
      title: 'Enterprise-Scale Components',
      description: 'Production-ready Svelte 5 components with enterprise security, accessibility, and compliance built-in.',
      icon: 'shield'
    },
    {
      title: 'Scalable Architecture',
      description: 'Built for teams that scale from 10 to 1000+ developers. Zero runtime overhead with compile-time optimization.',
      icon: 'performance'
    },
    {
      title: 'Comprehensive Token System',
      description: 'Multi-brand design tokens, Base16 themes, and DTCG standards for tool interoperability.',
      icon: 'design'
    }
  ];

  const designProducts = [
    {
      name: 'Component Library',
      description: 'AI-first Svelte 5 components for enterprise applications',
      framework: 'Svelte 5',
      license: 'Enterprise License',
      status: 'Production Ready'
    },
    {
      name: 'Form Builder',
      description: 'Advanced form building tools with canvas and drawing capabilities',
      features: 'Drag & Drop',
      license: 'Enterprise License',
      status: 'Production Ready'
    },
    {
      name: 'Design Tokens',
      description: 'Standardized design variables and tokens',
      format: 'JSON / CSS Variables',
      license: 'Free Usage',
      status: 'Open Source'
    },
    {
      name: 'Base16 Themes',
      description: 'Editor themes for VSCode, Emacs, and Linux systems',
      platforms: 'Multi-platform',
      license: 'Free Usage',
      status: 'Open Source'
    }
  ];

  const frameworks = [
    {
      name: 'Svelte 5',
      description: 'Primary framework with full component library and design system support'
    },
    {
      name: 'React (Planned)',
      description: 'React components planned for future releases based on enterprise demand'
    },
    {
      name: 'Vanilla JS',
      description: 'Framework-agnostic web components for maximum compatibility'
    }
  ];

  const getDelay = (index, base = 0) => base + index * 0.1;

  function getIcon(iconName) {
    const icons = {
      ai: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6"/><path d="m15.5 3.5-1.1 1.1m0 11.8 1.1 1.1M21 12h-6m-6 0H3m15.5 8.5-1.1-1.1M5.6 5.6 4.5 4.5"/></svg>`,
      shield: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>`,
      performance: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
      design: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`
    };
    return icons[iconName] || '';
  }
</script>

<div class="about-content">
  <!-- Company Overview -->
  <section class="overview-section" data-animate="overview" class:visible={visibleSections.has('overview')}>
    <div class="overview-grid">
      <div class="overview-main">
        <span class="section-label">Company</span>
        <h2>Enterprise Design System Platform</h2>
        <p class="lead">
          Miozu provides enterprise design systems with AI-first components for scalable teams building at enterprise scale.
          Our platform eliminates design debt and accelerates development, providing comprehensive design governance and consistency.
        </p>
        <div class="key-facts">
          <div class="fact">
            <span class="fact-label">Parent Company</span>
            <span class="fact-value">Up Go Corp.</span>
          </div>
          <div class="fact">
            <span class="fact-label">Headquarters</span>
            <span class="fact-value">Toronto, Canada</span>
          </div>
          <div class="fact">
            <span class="fact-label">Focus Area</span>
            <span class="fact-value">Enterprise Design Systems</span>
          </div>
        </div>
      </div>
      <div class="overview-stats">
        <div class="stat-card primary">
          <span class="stat-value">Design</span>
          <span class="stat-label">System</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">AI-First</span>
          <span class="stat-label">Components</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">Enterprise</span>
          <span class="stat-label">Scale</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">Svelte 5</span>
          <span class="stat-label">Ready</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Capabilities -->
  <section class="capabilities-section" data-animate="capabilities" class:visible={visibleSections.has('capabilities')}>
    <div class="section-header">
      <span class="section-label">Platform</span>
      <h2>Enterprise Capabilities</h2>
    </div>

    <div class="capabilities-grid">
      {#each capabilities as capability, i}
        <article
          class="capability-card"
          data-animate={`capability-${i}`}
          class:visible={visibleSections.has(`capability-${i}`)}
          style={`--delay: ${getDelay(i)}s`}
        >
          <div class="capability-icon">
            {@html getIcon(capability.icon)}
          </div>
          <h3>{capability.title}</h3>
          <p>{capability.description}</p>
        </article>
      {/each}
    </div>
  </section>

  <!-- Design Products -->
  <section class="products-section" data-animate="products" class:visible={visibleSections.has('products')}>
    <div class="section-header">
      <span class="section-label">Products</span>
      <h2>Design System Products</h2>
    </div>

    <div class="products-grid">
      {#each designProducts as product, i}
        <article
          class="product-card"
          data-animate={`product-${i}`}
          class:visible={visibleSections.has(`product-${i}`)}
          style={`--delay: ${getDelay(i, 0.1)}s`}
        >
          <h3>{product.name}</h3>
          <p class="product-desc">{product.description}</p>
          <div class="product-specs">
            {#each Object.entries(product).filter(([k]) => !['name', 'description', 'status'].includes(k)) as [key, value]}
              <div class="spec">
                <span class="spec-label">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                <span class="spec-value">{value}</span>
              </div>
            {/each}
          </div>
          <div class="product-status {product.status.includes('Free') ? 'free' : 'enterprise'}">{product.status}</div>
        </article>
      {/each}
    </div>
  </section>

  <!-- Framework Support -->
  <section class="integrations-section" data-animate="integrations" class:visible={visibleSections.has('integrations')}>
    <div class="section-header">
      <span class="section-label">Technology</span>
      <h2>Framework Support</h2>
    </div>

    <div class="integrations-grid">
      {#each frameworks as framework, i}
        <article
          class="integration-card"
          data-animate={`integration-${i}`}
          class:visible={visibleSections.has(`integration-${i}`)}
          style={`--delay: ${getDelay(i, 0.1)}s`}
        >
          <h3>{framework.name}</h3>
          <p>{framework.description}</p>
        </article>
      {/each}
    </div>

    <!-- Open Source + Enterprise -->
    <div class="compliance-row">
      <div class="compliance-badge free">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
        <span>Open Source Components</span>
      </div>
      <div class="compliance-badge">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
        <span>Enterprise License</span>
      </div>
      <div class="compliance-badge">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="2" width="20" height="8" rx="2"/>
          <rect x="2" y="14" width="20" height="8" rx="2"/>
          <path d="M6 6h.01M6 18h.01"/>
        </svg>
        <span>Linux Themes (.miozu)</span>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="cta-section" data-animate="cta" class:visible={visibleSections.has('cta')}>
    <div class="cta-content">
      <h2>Build Your Enterprise Design System</h2>
      <p>
        Eliminate design debt and scale your team with AI-first components. Get enterprise-grade governance and comprehensive design solutions.
      </p>
      <div class="cta-actions">
        <Button variant="primary" href="/contact">Enterprise Solutions</Button>
        <Button variant="secondary" href="/design-system">View Design System</Button>
      </div>
    </div>
  </section>
</div>

<style lang="postcss">
  @reference '$theme';

  .about-content {
    @apply text-base4;
  }

  .section-header {
    @apply mb-8 max-w-3xl;
  }

  .section-label {
    @apply text-xs font-semibold uppercase tracking-[0.2em] text-base4;
  }

  .section-header h2 {
    @apply mt-2 text-2xl font-semibold text-base6;
    letter-spacing: -0.02em;
  }

  /* Overview Section */
  .overview-section {
    @apply mx-auto max-w-6xl px-8 py-12;
    opacity: 0;
    transform: translateY(24px);
    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .overview-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .overview-grid {
    @apply grid gap-10 lg:grid-cols-5;
  }

  .overview-main {
    @apply lg:col-span-3;
  }

  .overview-main h2 {
    @apply mt-2 text-2xl font-semibold text-base6;
    letter-spacing: -0.02em;
  }

  .lead {
    @apply mt-4 text-base text-base5 leading-relaxed;
  }

  .key-facts {
    @apply mt-6 flex flex-wrap gap-6;
  }

  .fact {
    @apply flex flex-col gap-1;
  }

  .fact-label {
    @apply text-xs text-base4 uppercase tracking-wider;
  }

  .fact-value {
    @apply text-sm font-medium text-base6;
  }

  .overview-stats {
    @apply lg:col-span-2 grid grid-cols-2 gap-3;
  }

  .stat-card {
    @apply flex flex-col items-center justify-center p-4 rounded-xl border border-base3 bg-base0 text-center;
  }

  .stat-card.primary {
    @apply border-base0D/30 bg-base0D/5;
  }

  .stat-value {
    @apply text-lg font-bold text-base6;
  }

  .stat-card.primary .stat-value {
    @apply text-base0D;
  }

  .stat-label {
    @apply text-xs text-base4 mt-1;
  }

  /* Capabilities Section */
  .capabilities-section {
    @apply mx-auto max-w-6xl px-8 py-12;
    opacity: 0;
    transform: translateY(24px);
    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .capabilities-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .capabilities-grid {
    @apply grid gap-4 md:grid-cols-2 lg:grid-cols-4;
  }

  .capability-card {
    @apply flex flex-col gap-3 rounded-xl border border-base3 bg-base0 p-5;
    opacity: 0;
    transform: translateY(16px);
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: var(--delay, 0s);
  }

  .capability-card.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .capability-icon {
    @apply w-10 h-10 rounded-lg flex items-center justify-center bg-base2 text-base6;
  }

  .capability-card h3 {
    @apply text-sm font-semibold text-base6;
  }

  .capability-card p {
    @apply text-xs text-base4 leading-relaxed;
  }

  /* Products Section */
  .products-section {
    @apply mx-auto max-w-6xl px-8 py-12;
    opacity: 0;
    transform: translateY(24px);
    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .products-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .products-grid {
    @apply grid gap-4 md:grid-cols-2;
  }

  .product-card {
    @apply flex flex-col gap-3 rounded-xl border border-base3 bg-base0 p-6;
    opacity: 0;
    transform: translateY(16px);
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: var(--delay, 0s);
  }

  .product-card.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .product-card h3 {
    @apply text-lg font-semibold text-base6;
  }

  .product-desc {
    @apply text-sm text-base4;
  }

  .product-specs {
    @apply flex flex-col gap-2 py-3 border-y border-base2;
  }

  .spec {
    @apply flex justify-between text-xs;
  }

  .spec-label {
    @apply text-base4;
  }

  .spec-value {
    @apply text-base6 font-medium;
  }

  .product-status {
    @apply text-xs font-medium;
  }

  .product-status.enterprise {
    @apply text-base0D;
  }

  .product-status.free {
    @apply text-base0B;
  }

  /* Integrations Section */
  .integrations-section {
    @apply mx-auto max-w-6xl px-8 py-12;
    opacity: 0;
    transform: translateY(24px);
    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .integrations-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .integrations-grid {
    @apply grid gap-4 md:grid-cols-3 max-w-4xl;
  }

  .integration-card {
    @apply flex flex-col gap-2 rounded-xl border border-base3 bg-base0 p-5;
    opacity: 0;
    transform: translateY(16px);
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: var(--delay, 0s);
  }

  .integration-card.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .integration-card h3 {
    @apply text-sm font-semibold text-base6;
  }

  .integration-card p {
    @apply text-xs text-base4;
  }

  .compliance-row {
    @apply mt-8 flex flex-wrap gap-4;
  }

  .compliance-badge {
    @apply flex items-center gap-2 px-4 py-2 rounded-lg;
    @apply bg-base0D/10 border border-base0D/30;
    @apply text-xs font-medium text-base0D;
  }

  .compliance-badge svg {
    @apply text-base0D;
  }

  .compliance-badge.free {
    @apply bg-base0B/10 border-base0B/30 text-base0B;
  }

  .compliance-badge.free svg {
    @apply text-base0B;
  }

  /* CTA Section */
  .cta-section {
    @apply mx-auto max-w-6xl px-8 py-12;
    opacity: 0;
    transform: translateY(24px);
    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .cta-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .cta-content {
    @apply mx-auto max-w-2xl flex flex-col items-center gap-4 rounded-2xl border border-base3 bg-base1 px-8 py-10 text-center;
  }

  .cta-content h2 {
    @apply text-xl font-semibold text-base6;
  }

  .cta-content p {
    @apply text-sm text-base4;
  }

  .cta-actions {
    @apply flex flex-wrap justify-center gap-3 mt-2;
  }

  @media (max-width: 768px) {
    .overview-section,
    .capabilities-section,
    .products-section,
    .integrations-section,
    .cta-section {
      @apply px-5 py-8;
    }

    .overview-grid {
      @apply grid-cols-1;
    }

    .overview-stats {
      @apply grid-cols-2;
    }

    .capabilities-grid {
      @apply grid-cols-1;
    }

    .products-grid,
    .integrations-grid {
      @apply grid-cols-1;
    }

    .compliance-row {
      @apply flex-col;
    }

    .cta-content {
      @apply px-5 py-8;
    }
  }
</style>

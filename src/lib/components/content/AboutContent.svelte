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
      title: 'First-Party Data Generation',
      description: 'We own J\'ko AI—a production virtual try-on platform. The data is ours, not scraped or licensed.',
      icon: 'source'
    },
    {
      title: 'Enterprise-Grade Compliance',
      description: 'GDPR and CCPA compliant. Differential privacy implemented. SOC 2 Type II in progress.',
      icon: 'shield'
    },
    {
      title: 'Production Infrastructure',
      description: 'Sub-100ms API latency. 99.9% uptime SLA. Batch exports or real-time streams.',
      icon: 'infra'
    },
    {
      title: 'ML-Ready Format',
      description: 'Structured for training pipelines. JSON, Parquet, or custom schema. Intent-labeled.',
      icon: 'data'
    }
  ];

  const dataProducts = [
    {
      name: 'Commerce Behavior Index',
      description: 'Licensed behavioral datasets for AI training',
      volume: 'Monthly event streams',
      format: 'JSON / Parquet',
      status: 'Accepting enterprise partners'
    },
    {
      name: 'Demand Prediction API',
      description: 'SKU-level demand forecasting',
      latency: '<100ms response',
      accuracy: 'Validated on held-out data',
      status: 'Enterprise pilot program'
    }
  ];

  const integrations = [
    {
      name: 'Meta Tech Provider',
      description: 'Official Meta technology partner for commerce integrations'
    },
    {
      name: 'Shopify Partner',
      description: 'Native integration with Shopify commerce ecosystem'
    }
  ];

  const getDelay = (index, base = 0) => base + index * 0.1;

  function getIcon(iconName) {
    const icons = {
      source: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>`,
      shield: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>`,
      infra: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 6h.01M6 18h.01"/></svg>`,
      data: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`
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
        <h2>Commerce Data Infrastructure</h2>
        <p class="lead">
          Oraklex provides enterprise behavioral data products for AI training and demand intelligence.
          We generate first-party commerce data through J'ko AI, our production virtual try-on platform.
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
            <span class="fact-label">Data Source</span>
            <span class="fact-value">J'ko AI Platform</span>
          </div>
        </div>
      </div>
      <div class="overview-stats">
        <div class="stat-card primary">
          <span class="stat-value">First-Party</span>
          <span class="stat-label">Data Generation</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">GDPR/CCPA</span>
          <span class="stat-label">Compliant</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">99.9%</span>
          <span class="stat-label">Uptime SLA</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">&lt;100ms</span>
          <span class="stat-label">API Latency</span>
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

  <!-- Data Products -->
  <section class="products-section" data-animate="products" class:visible={visibleSections.has('products')}>
    <div class="section-header">
      <span class="section-label">Products</span>
      <h2>Data Products</h2>
    </div>

    <div class="products-grid">
      {#each dataProducts as product, i}
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
          <div class="product-status">{product.status}</div>
        </article>
      {/each}
    </div>
  </section>

  <!-- Integrations -->
  <section class="integrations-section" data-animate="integrations" class:visible={visibleSections.has('integrations')}>
    <div class="section-header">
      <span class="section-label">Ecosystem</span>
      <h2>Technology Partners</h2>
    </div>

    <div class="integrations-grid">
      {#each integrations as integration, i}
        <article
          class="integration-card"
          data-animate={`integration-${i}`}
          class:visible={visibleSections.has(`integration-${i}`)}
          style={`--delay: ${getDelay(i, 0.1)}s`}
        >
          <h3>{integration.name}</h3>
          <p>{integration.description}</p>
        </article>
      {/each}
    </div>

    <!-- Compliance -->
    <div class="compliance-row">
      <div class="compliance-badge">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
        <span>GDPR Compliant</span>
      </div>
      <div class="compliance-badge">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
        <span>CCPA Compliant</span>
      </div>
      <div class="compliance-badge pending">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
        <span>SOC 2 Type II (In Progress)</span>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="cta-section" data-animate="cta" class:visible={visibleSections.has('cta')}>
    <div class="cta-content">
      <h2>Request Data Access</h2>
      <p>
        Enterprise data partnerships for AI training, demand forecasting, and commerce intelligence.
      </p>
      <div class="cta-actions">
        <Button variant="primary" href="/contact">Schedule Consultation</Button>
        <Button variant="secondary" href="/data">View Data Schema</Button>
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
    @apply border-base14/30 bg-base14/5;
  }

  .stat-value {
    @apply text-lg font-bold text-base6;
  }

  .stat-card.primary .stat-value {
    @apply text-base14;
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
    @apply text-xs text-base14 font-medium;
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
    @apply grid gap-4 md:grid-cols-2 max-w-2xl;
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
    @apply bg-base10/10 border border-base10/30;
    @apply text-xs font-medium text-base10;
  }

  .compliance-badge svg {
    @apply text-base10;
  }

  .compliance-badge.pending {
    @apply bg-base13/10 border-base13/30 text-base13;
  }

  .compliance-badge.pending svg {
    @apply text-base13;
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

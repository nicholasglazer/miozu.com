<script>
  import {onMount} from 'svelte';

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

  const products = [
    {
      id: 'behavioral-data',
      name: 'Commerce Behavior Index',
      category: 'Data Licensing',
      headline: 'First-party behavioral data for AI training',
      description: 'Licensed datasets from production commerce applications. Not synthetic. Not scraped. Generated from real shopping behavior on platforms we own and operate.',
      specs: [
        {label: 'Data Type', value: 'Behavioral events'},
        {label: 'Source', value: 'J\'ko AI platform'},
        {label: 'Format', value: 'JSON / Parquet'},
        {label: 'Compliance', value: 'GDPR, CCPA'}
      ],
      useCases: [
        'Train recommendation systems on real purchase intent signals',
        'Build demand forecasting models with behavioral ground truth',
        'Develop personalization AI with authentic user preferences'
      ],
      access: 'Enterprise licensing'
    },
    {
      id: 'demand-api',
      name: 'Demand Prediction API',
      category: 'Prediction Infrastructure',
      headline: 'SKU-level demand forecasting',
      description: 'Predict which products, sizes, and variants will sell before they trend. Built on behavioral signals that precede purchase decisions.',
      specs: [
        {label: 'Latency', value: '<100ms'},
        {label: 'Uptime', value: '99.9% SLA'},
        {label: 'Protocol', value: 'REST API'},
        {label: 'Format', value: 'JSON'}
      ],
      useCases: [
        'Reduce inventory waste with demand-driven replenishment',
        'Identify emerging trends before search volume signals',
        'Optimize marketing spend with conversion probability scores'
      ],
      access: 'Enterprise pilot program'
    }
  ];

  const pipeline = [
    {
      step: '01',
      title: 'Generate',
      description: 'Commerce interactions on J\'ko AI platform'
    },
    {
      step: '02',
      title: 'Structure',
      description: 'Events labeled for intent and outcome'
    },
    {
      step: '03',
      title: 'Deliver',
      description: 'API access or batch exports'
    }
  ];

  const getDelay = (index, base = 0) => base + index * 0.1;
</script>

<div class="solutions-content">
  <!-- Pipeline Overview -->
  <section class="pipeline-section" data-animate="pipeline" class:visible={visibleSections.has('pipeline')}>
    <div class="section-header">
      <span class="section-label">Infrastructure</span>
      <h2>Data Pipeline</h2>
    </div>

    <div class="pipeline-flow">
      {#each pipeline as step, i}
        <article
          class="pipeline-step"
          data-animate={`pipeline-${i}`}
          class:visible={visibleSections.has(`pipeline-${i}`)}
          style={`--delay: ${getDelay(i)}s`}
        >
          <span class="step-number">{step.step}</span>
          <h3>{step.title}</h3>
          <p>{step.description}</p>
        </article>
        {#if i < pipeline.length - 1}
          <div class="pipeline-connector">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14m-7-7l7 7-7 7"/>
            </svg>
          </div>
        {/if}
      {/each}
    </div>
  </section>

  <!-- Products -->
  {#each products as product, productIndex}
    <section
      id={product.id}
      class="product-section"
      data-animate={`product-${productIndex}`}
      class:visible={visibleSections.has(`product-${productIndex}`)}
    >
      <div class="product-header">
        <span class="product-category">{product.category}</span>
        <h2>{product.name}</h2>
        <p class="product-headline">{product.headline}</p>
        <p class="product-description">{product.description}</p>
      </div>

      <div class="product-details">
        <div class="specs-section">
          <h3>Specifications</h3>
          <div class="specs-grid">
            {#each product.specs as spec}
              <div class="spec-item">
                <span class="spec-label">{spec.label}</span>
                <span class="spec-value">{spec.value}</span>
              </div>
            {/each}
          </div>
        </div>

        <div class="use-cases-section">
          <h3>Applications</h3>
          <ul class="use-cases-list">
            {#each product.useCases as useCase}
              <li>{useCase}</li>
            {/each}
          </ul>
        </div>
      </div>

      <div class="product-cta">
        <span class="access-label">{product.access}</span>
        <a href="/contact" class="cta-btn">Request Access</a>
      </div>
    </section>
  {/each}

  <!-- Enterprise CTA -->
  <section class="enterprise-section" data-animate="enterprise" class:visible={visibleSections.has('enterprise')}>
    <div class="enterprise-content">
      <h2>Enterprise Data Partnerships</h2>
      <p>
        Custom data licensing, dedicated infrastructure, and priority support for enterprise deployments.
      </p>
      <div class="enterprise-actions">
        <a href="/contact" class="cta-btn primary">Schedule Consultation</a>
        <a href="/data" class="cta-btn secondary">View Data Schema</a>
      </div>
    </div>
  </section>
</div>

<style lang="postcss">
  @reference '$theme';

  .solutions-content {
    @apply text-base5;
  }

  .section-header {
    @apply mb-8;
  }

  .section-label {
    @apply text-xs font-semibold uppercase tracking-[0.2em] text-base4;
  }

  .section-header h2 {
    @apply mt-2 text-2xl font-semibold text-base6;
    letter-spacing: -0.02em;
  }

  /* Pipeline Section */
  .pipeline-section {
    @apply mx-auto max-w-4xl px-8 py-12;
    opacity: 0;
    transform: translateY(24px);
    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .pipeline-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .pipeline-flow {
    @apply flex flex-col md:flex-row items-center justify-center gap-4;
  }

  .pipeline-step {
    @apply flex flex-col items-center gap-2 p-5 rounded-xl border border-base3 bg-base0 text-center;
    flex: 1;
    max-width: 200px;
    opacity: 0;
    transform: translateY(16px);
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: var(--delay, 0s);
  }

  .pipeline-step.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .step-number {
    @apply text-xl font-bold text-base14;
  }

  .pipeline-step h3 {
    @apply text-sm font-semibold text-base6;
  }

  .pipeline-step p {
    @apply text-xs text-base4;
  }

  .pipeline-connector {
    @apply text-base3 hidden md:flex;
  }

  /* Product Section */
  .product-section {
    @apply mx-auto max-w-4xl px-8 py-12 my-4;
    @apply rounded-2xl border border-base3 bg-base0;
    opacity: 0;
    transform: translateY(24px);
    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
    scroll-margin-top: 100px;
  }

  .product-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .product-header {
    @apply mb-8;
  }

  .product-category {
    @apply text-xs font-semibold uppercase tracking-[0.15em] text-base14;
  }

  .product-header h2 {
    @apply mt-2 text-2xl font-semibold text-base6;
    letter-spacing: -0.02em;
  }

  .product-headline {
    @apply mt-2 text-base font-medium text-base5;
  }

  .product-description {
    @apply mt-3 text-sm text-base4 leading-relaxed max-w-2xl;
  }

  .product-details {
    @apply grid gap-8 md:grid-cols-2 mb-8;
  }

  .specs-section h3,
  .use-cases-section h3 {
    @apply text-xs font-semibold uppercase tracking-[0.15em] text-base4 mb-4;
  }

  .specs-grid {
    @apply grid grid-cols-2 gap-3;
  }

  .spec-item {
    @apply flex flex-col gap-1 p-3 rounded-lg bg-base1;
  }

  .spec-label {
    @apply text-xs text-base4;
  }

  .spec-value {
    @apply text-sm font-medium text-base6;
  }

  .use-cases-list {
    @apply flex flex-col gap-2;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .use-cases-list li {
    @apply text-sm text-base5 pl-5 relative;
  }

  .use-cases-list li::before {
    content: '';
    @apply absolute left-0 top-2 w-2 h-2 rounded-full bg-base14/50;
  }

  .product-cta {
    @apply flex items-center justify-between pt-6 border-t border-base2;
  }

  .access-label {
    @apply text-sm text-base4;
  }

  .cta-btn {
    @apply inline-flex items-center justify-center px-6 py-2.5 rounded-lg text-sm font-medium no-underline;
    @apply transition-all duration-200;
    background: var(--color-base14);
    color: var(--color-base0);
  }

  .cta-btn:hover {
    filter: brightness(1.1);
  }

  .cta-btn.secondary {
    background: transparent;
    color: var(--color-base6);
    border: 1px solid var(--color-base3);
  }

  .cta-btn.secondary:hover {
    background: var(--color-base1);
  }

  /* Enterprise Section */
  .enterprise-section {
    @apply mx-auto max-w-4xl px-8 py-12;
    opacity: 0;
    transform: translateY(24px);
    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .enterprise-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .enterprise-content {
    @apply flex flex-col items-center gap-4 rounded-2xl bg-base1 border border-base3 px-8 py-10 text-center;
  }

  .enterprise-content h2 {
    @apply text-xl font-semibold text-base6;
  }

  .enterprise-content p {
    @apply text-sm text-base4 max-w-lg;
  }

  .enterprise-actions {
    @apply flex flex-wrap justify-center gap-3 mt-2;
  }

  @media (max-width: 768px) {
    .pipeline-section,
    .product-section,
    .enterprise-section {
      @apply px-5;
    }

    .pipeline-flow {
      @apply flex-col;
    }

    .pipeline-step {
      @apply max-w-full;
    }

    .pipeline-connector {
      @apply flex rotate-90;
    }

    .product-details {
      @apply grid-cols-1;
    }

    .specs-grid {
      @apply grid-cols-2;
    }

    .product-cta {
      @apply flex-col gap-4 items-start;
    }

    .enterprise-content {
      @apply px-5 py-8;
    }

    .enterprise-actions {
      @apply flex-col w-full;
    }

    .cta-btn {
      @apply w-full;
    }
  }
</style>

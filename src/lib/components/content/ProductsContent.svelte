<script>
  import { onMount } from 'svelte';

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
      { threshold: 0.15, rootMargin: '50px 0px' }
    );

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  });

  const products = [
    {
      name: "J'ko AI",
      tagline: 'Virtual Try-On for Social Commerce',
      status: 'Live',
      description: 'AI-powered virtual try-on that converts Instagram DMs into sales.',
      link: 'https://jko.ai',
      dashboardLink: 'https://dash.jko.ai',
      metrics: [
        { value: '30-40%', label: 'Return Reduction' },
        { value: '20-30%', label: 'Conversion Increase' },
        { value: '<20s', label: 'Generation Time' },
        { value: '24/7', label: 'Automation' }
      ],
      features: [
        { title: 'Instagram DM Automation', description: 'Comment triggers and automated responses.' },
        { title: 'AI Virtual Try-On', description: 'Photo-realistic garment rendering using SDXL.' },
        { title: 'Shopify Integration', description: 'Live inventory sync and one-tap checkout.' },
        { title: 'Full Funnel Attribution', description: 'Track every step from post to purchase.' }
      ]
    },
    {
      name: 'Data Oracle API',
      tagline: 'E-Commerce Behavior Intelligence',
      status: 'Coming Soon',
      description: 'Structured datasets capturing complete conversion funnels.',
      link: '#',
      metrics: [
        { value: '$0.10-1.00', label: 'Per Funnel' },
        { value: '100M+', label: 'Data Points' },
        { value: 'GDPR', label: 'Compliant' },
        { value: 'Real-time', label: 'Updates' }
      ],
      features: [
        { title: 'Conversion Funnel Data', description: 'Complete journey with attributed outcomes.' },
        { title: 'Intent Signals', description: 'Rich behavioral signals showing customer intent.' },
        { title: 'Anonymized Exports', description: 'Privacy-first design with GDPR compliance.' },
        { title: 'API Access', description: 'RESTful API for real-time and batch access.' }
      ]
    },
    {
      name: 'HyperC Integration',
      tagline: 'AI Planning for Retail',
      status: 'In Development',
      description: 'Large Retail Model optimization for inventory and pricing.',
      link: 'https://hyperc.com',
      metrics: [
        { value: '40%', label: 'Inventory Optimization' },
        { value: '10x', label: 'Faster Decisions' },
        { value: 'Real-time', label: 'Planning' },
        { value: 'Autonomous', label: 'Operations' }
      ],
      features: [
        { title: 'Inventory Optimization', description: 'Predictive replenishment using demand signals.' },
        { title: 'Dynamic Pricing', description: 'Optimal price points based on demand.' },
        { title: 'Campaign Planning', description: 'AI-powered scheduling for launches.' },
        { title: 'Demand Forecasting', description: 'Predict future demand patterns.' }
      ]
    }
  ];

  const ecosystem = [
    { step: '01', title: 'Data Capture', product: "J'ko AI", description: 'Capture the complete customer journey.' },
    { step: '02', title: 'AI Optimization', product: 'HyperC', description: 'Generate inventory and pricing recommendations.' },
    { step: '03', title: 'Data Monetization', product: 'Data Oracle', description: 'Package insights for LLM companies.' }
  ];

  const getDelay = (index, base = 0) => base + index * 0.1;
</script>

<div class="products-content">
  <section class="ecosystem-section" data-animate="ecosystem" class:visible={visibleSections.has('ecosystem')}>
    <div class="section-header">
      <span class="section-eyebrow">The Ecosystem</span>
      <h2>How It All Connects</h2>
    </div>

    <div class="ecosystem-flow">
      {#each ecosystem as step, i}
        <article
          class="ecosystem-step"
          data-animate={`ecosystem-${i}`}
          class:visible={visibleSections.has(`ecosystem-${i}`)}
          style={`--delay: ${getDelay(i)}s`}
        >
          <span class="step-number">{step.step}</span>
          <h3>{step.title}</h3>
          <span class="step-product">{step.product}</span>
          <p>{step.description}</p>
        </article>
        {#if i < ecosystem.length - 1}
          <div class="ecosystem-arrow">→</div>
        {/if}
      {/each}
    </div>
  </section>

  {#each products as product, productIndex}
    <section
      class="product-section"
      class:featured={product.status === 'Live'}
      data-animate={`product-${productIndex}`}
      class:visible={visibleSections.has(`product-${productIndex}`)}
    >
      <div class="product-header">
        <div class="product-status" class:live={product.status === 'Live'} class:soon={product.status === 'Coming Soon'}>
          {product.status}
        </div>
        <h2>{product.name}</h2>
        <span class="product-tagline">{product.tagline}</span>
        <p class="product-description">{product.description}</p>

        <div class="product-metrics">
          {#each product.metrics as metric, i}
            <div class="metric-card">
              <span class="metric-value">{metric.value}</span>
              <span class="metric-label">{metric.label}</span>
            </div>
          {/each}
        </div>

        {#if product.status === 'Live'}
          <div class="product-actions">
            <a href={product.dashboardLink} class="btn btn-primary">Launch Dashboard</a>
            <a href={product.link} class="btn btn-secondary">Visit Website</a>
          </div>
        {:else}
          <div class="product-actions">
            <a href="mailto:partners@oraklex.com" class="btn btn-secondary">Get Early Access</a>
          </div>
        {/if}
      </div>

      <div class="product-features">
        <h3>Key Capabilities</h3>
        <div class="features-grid">
          {#each product.features as feature, i}
            <article
              class="feature-card"
              data-animate={`feature-${productIndex}-${i}`}
              class:visible={visibleSections.has(`feature-${productIndex}-${i}`)}
              style={`--delay: ${getDelay(i, 0.1)}s`}
            >
              <h4>{feature.title}</h4>
              <p>{feature.description}</p>
            </article>
          {/each}
        </div>
      </div>
    </section>
  {/each}
</div>

<style lang="postcss">
  @reference '$theme';

  .products-content {
    @apply text-base5;
  }

  .section-header {
    @apply text-center mb-8;
  }

  .section-eyebrow {
    @apply text-xs font-semibold uppercase tracking-[0.2em] text-base4;
  }

  .section-header h2 {
    @apply text-2xl font-semibold text-base6 mt-2 mb-0;
    letter-spacing: -0.02em;
  }

  .ecosystem-section {
    @apply py-8 pb-12;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .ecosystem-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .ecosystem-flow {
    @apply flex flex-col items-center gap-4;
  }

  @media (min-width: 768px) {
    .ecosystem-flow {
      @apply flex-row justify-center;
    }
  }

  .ecosystem-step {
    @apply min-w-[200px] p-6 text-center bg-base1 border border-base3;
    border-radius: 12px;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: var(--delay, 0s);
  }

  .ecosystem-step.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .step-number {
    @apply text-2xl font-bold text-base14;
  }

  .ecosystem-step h3 {
    @apply text-base font-semibold text-base6 mt-2 mb-1;
  }

  .step-product {
    @apply text-sm font-medium text-base14;
  }

  .ecosystem-step p {
    @apply text-sm text-base4 mt-2;
  }

  .ecosystem-arrow {
    @apply text-2xl font-bold text-base14;
  }

  @media (max-width: 767px) {
    .ecosystem-arrow {
      transform: rotate(90deg);
    }
  }

  .product-section {
    @apply py-12 border-t border-base3;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .product-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .product-section.featured {
    @apply bg-base14/5 my-4 px-8;
    border-radius: 16px;
  }

  .product-header {
    @apply text-center mb-8;
  }

  .product-status {
    @apply inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] mb-4 bg-base2 text-base4;
    border-radius: 999px;
  }

  .product-status.live {
    @apply bg-base14/15 text-base14;
  }

  .product-status.soon {
    @apply bg-base2 text-base4;
  }

  .product-header h2 {
    @apply text-4xl font-semibold text-base6 m-0;
    letter-spacing: -0.02em;
  }

  .product-tagline {
    @apply block text-lg font-medium text-base14 mt-2;
  }

  .product-description {
    @apply max-w-lg mx-auto mt-4 text-base5;
  }

  .product-metrics {
    @apply grid grid-cols-2 gap-4 max-w-lg mx-auto mt-6;
  }

  @media (min-width: 640px) {
    .product-metrics {
      @apply grid-cols-4;
    }
  }

  .metric-card {
    @apply p-4 text-center bg-base1 border border-base3;
    border-radius: 12px;
  }

  .metric-value {
    @apply block text-xl font-bold text-base6;
  }

  .metric-label {
    @apply block text-xs font-semibold uppercase tracking-[0.1em] text-base4 mt-1;
  }

  .product-actions {
    @apply flex justify-center gap-4 mt-6;
  }

  .btn {
    @apply inline-block px-6 py-3 text-sm font-medium no-underline;
    border-radius: 10px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .btn-primary {
    @apply bg-base14 text-white;
  }

  .btn-primary:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }

  .btn-secondary {
    @apply bg-base1 text-base6 border border-base3;
  }

  .btn-secondary:hover {
    @apply bg-base2;
  }

  .product-features h3 {
    @apply text-center text-xl font-semibold text-base6 mb-6;
  }

  .features-grid {
    @apply grid gap-4 grid-cols-1;
  }

  @media (min-width: 640px) {
    .features-grid {
      @apply grid-cols-2;
    }
  }

  .feature-card {
    @apply p-6 bg-base1 border border-base3;
    border-radius: 12px;
    opacity: 0;
    transform: translateY(16px);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: var(--delay, 0s);
  }

  .feature-card.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .feature-card h4 {
    @apply text-base font-semibold text-base6 mb-2;
  }

  .feature-card p {
    @apply text-sm text-base5 m-0;
  }
</style>

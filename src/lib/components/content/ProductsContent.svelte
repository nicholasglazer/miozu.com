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
  .products-content {
    color: #1a1a1a;
  }

  .section-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .section-eyebrow {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #666;
  }

  .section-header h2 {
    font-size: 2rem;
    font-weight: 600;
    color: #111;
    margin: 0.5rem 0;
  }

  .ecosystem-section {
    padding: 2rem 0 3rem;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .ecosystem-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .ecosystem-flow {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  @media (min-width: 768px) {
    .ecosystem-flow {
      flex-direction: row;
      justify-content: center;
    }
  }

  .ecosystem-step {
    min-width: 200px;
    padding: 1.5rem;
    text-align: center;
    background: #fff;
    border-radius: 1rem;
    border: 1px solid #e5e5e5;
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
    font-size: 1.5rem;
    font-weight: 700;
    color: #4a9eff;
  }

  .ecosystem-step h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #111;
    margin: 0.5rem 0 0.25rem;
  }

  .step-product {
    font-size: 0.8rem;
    font-weight: 500;
    color: #4a9eff;
  }

  .ecosystem-step p {
    font-size: 0.8rem;
    color: #666;
    margin: 0.5rem 0 0;
  }

  .ecosystem-arrow {
    font-size: 1.5rem;
    font-weight: 700;
    color: #4a9eff;
  }

  @media (max-width: 767px) {
    .ecosystem-arrow {
      transform: rotate(90deg);
    }
  }

  .product-section {
    padding: 3rem 0;
    border-top: 1px solid #e5e5e5;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .product-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .product-section.featured {
    background: linear-gradient(145deg, rgba(74, 158, 255, 0.05), transparent);
    border-radius: 1.5rem;
    padding: 3rem 2rem;
    margin: 1rem 0;
  }

  .product-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .product-status {
    display: inline-block;
    padding: 0.35rem 1rem;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    border-radius: 999px;
    background: #f0f0f0;
    color: #666;
    margin-bottom: 1rem;
  }

  .product-status.live {
    background: rgba(74, 158, 255, 0.15);
    color: #4a9eff;
  }

  .product-status.soon {
    background: #f5f5f5;
    color: #888;
  }

  .product-header h2 {
    font-size: 2.5rem;
    font-weight: 600;
    color: #111;
    margin: 0;
  }

  .product-tagline {
    display: block;
    font-size: 1.1rem;
    font-weight: 500;
    color: #4a9eff;
    margin-top: 0.5rem;
  }

  .product-description {
    max-width: 500px;
    margin: 1rem auto;
    color: #555;
  }

  .product-metrics {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    max-width: 500px;
    margin: 1.5rem auto;
  }

  @media (min-width: 640px) {
    .product-metrics {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .metric-card {
    padding: 1rem;
    text-align: center;
    background: #fff;
    border-radius: 0.75rem;
    border: 1px solid #e5e5e5;
  }

  .metric-value {
    display: block;
    font-size: 1.25rem;
    font-weight: 700;
    color: #111;
  }

  .metric-label {
    display: block;
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #888;
    margin-top: 0.25rem;
  }

  .product-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    text-decoration: none;
    border-radius: 0.5rem;
    transition: all 0.2s;
  }

  .btn-primary {
    background: #111;
    color: #fff;
  }

  .btn-primary:hover {
    background: #333;
  }

  .btn-secondary {
    background: #f5f5f5;
    color: #111;
    border: 1px solid #e5e5e5;
  }

  .btn-secondary:hover {
    background: #eee;
  }

  .product-features h3 {
    text-align: center;
    font-size: 1.25rem;
    font-weight: 600;
    color: #111;
    margin-bottom: 1.5rem;
  }

  .features-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr;
  }

  @media (min-width: 640px) {
    .features-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .feature-card {
    padding: 1.5rem;
    background: #fff;
    border-radius: 1rem;
    border: 1px solid #e5e5e5;
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
    font-size: 1rem;
    font-weight: 600;
    color: #111;
    margin: 0 0 0.5rem;
  }

  .feature-card p {
    font-size: 0.875rem;
    color: #555;
    margin: 0;
  }
</style>

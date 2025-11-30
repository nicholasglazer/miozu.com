<script>
  import {onMount} from 'svelte';
  import {fade} from 'svelte/transition';
  import Metadata from '$features/seo/Metadata.svelte';
  import {Button} from '$components/jera';

  let mounted = $state(false);
  let visibleSections = $state(new Set());

  onMount(() => {
    mounted = true;

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
      name: "J'ko AI",
      tagline: 'Virtual Try-On for Social Commerce',
      status: 'Live',
      description: 'AI-powered virtual try-on that converts Instagram DMs into sales. The flagship product of the Oraklex ecosystem, capturing rich e-commerce behavior data.',
      longDescription: "J'ko combines computer vision, conversational AI, and commerce integration to create the complete virtual try-on experience. Customers send a selfie via Instagram DM, and our AI renders them wearing your products in under 20 seconds.",
      link: 'https://jko.ai',
      dashboardLink: 'https://dash.jko.ai',
      metrics: [
        {value: '30-40%', label: 'Return Reduction'},
        {value: '20-30%', label: 'Conversion Increase'},
        {value: '<20s', label: 'Generation Time'},
        {value: '24/7', label: 'Automation'}
      ],
      features: [
        {
          title: 'Instagram DM Automation',
          description: 'Comment triggers, automated responses, and seamless conversation flows that guide customers to try-on.'
        },
        {
          title: 'AI Virtual Try-On',
          description: 'Photo-realistic garment rendering using SDXL and ControlNet. Preserves pose, lighting, and body language.'
        },
        {
          title: 'Shopify Integration',
          description: 'Live inventory sync, one-tap checkout links, and complete purchase attribution tracking.'
        },
        {
          title: 'Full Funnel Attribution',
          description: 'Track every step: Instagram post → DM → Try-on → Purchase. Know exactly what drives revenue.'
        }
      ],
      dataContribution: 'Captures complete conversion funnels, conversational commerce patterns, and product-purchase attribution - the core data for the Data Oracle.'
    },
    {
      name: 'Data Oracle API',
      tagline: 'E-Commerce Behavior Intelligence',
      status: 'Coming Soon',
      description: 'Structured datasets capturing complete conversion funnels. The intelligence layer that powers the next generation of AI.',
      longDescription: 'Anonymized, privacy-compliant datasets that show the complete customer journey from social discovery to purchase. Exactly what LLM companies need to train models that understand buying behavior.',
      link: '#contact',
      metrics: [
        {value: '$0.10-1.00', label: 'Per Funnel'},
        {value: '100M+', label: 'Data Points'},
        {value: 'GDPR', label: 'Compliant'},
        {value: 'Real-time', label: 'Updates'}
      ],
      features: [
        {
          title: 'Conversion Funnel Data',
          description: 'Complete journey from social impression to purchase with attributed outcomes.'
        },
        {
          title: 'Intent Signals',
          description: 'Rich behavioral signals that show what customers want before they buy.'
        },
        {
          title: 'Anonymized Exports',
          description: 'Privacy-first design with differential privacy, k-anonymity, and GDPR compliance.'
        },
        {
          title: 'API Access',
          description: 'RESTful API for real-time data access and batch exports for training.'
        }
      ],
      dataContribution: 'The data monetization layer - packaging the insights from all Oraklex products for LLM training and analytics.'
    },
    {
      name: 'HyperC Integration',
      tagline: 'AI Planning for Retail',
      status: 'In Development',
      description: 'Large Retail Model optimization for inventory, pricing, and demand forecasting. Partnership with HyperC AI.',
      longDescription: "Andrew Gree's HyperC technology brings mathematical optimization to e-commerce. The Large Retail Model (LRM) uses automated theorem proving and type theory to calculate optimal inventory levels, pricing, and campaign timing.",
      link: 'https://hyperc.com',
      metrics: [
        {value: '40%', label: 'Inventory Optimization'},
        {value: '10×', label: 'Faster Decisions'},
        {value: 'Real-time', label: 'Planning'},
        {value: 'Autonomous', label: 'Operations'}
      ],
      features: [
        {
          title: 'Inventory Optimization',
          description: 'Predictive replenishment using demand signals from try-on and purchase data.'
        },
        {
          title: 'Dynamic Pricing',
          description: 'Efficient frontier calculations for optimal price points based on demand and competition.'
        },
        {
          title: 'Campaign Planning',
          description: 'AI-powered scheduling for product launches, promotions, and content timing.'
        },
        {
          title: 'Demand Forecasting',
          description: 'Predict future demand based on historical patterns and real-time signals.'
        }
      ],
      dataContribution: 'Adds AI planning and optimization to the data layer, creating actionable intelligence from raw behavioral data.'
    }
  ];

  const ecosystem = [
    {
      step: '01',
      title: 'Data Capture',
      product: "J'ko AI",
      description: "J'ko captures the complete customer journey through virtual try-on interactions, generating rich behavioral data."
    },
    {
      step: '02',
      title: 'AI Optimization',
      product: 'HyperC Integration',
      description: 'HyperC processes the data to generate inventory, pricing, and campaign recommendations.'
    },
    {
      step: '03',
      title: 'Data Monetization',
      product: 'Data Oracle API',
      description: 'Anonymized, structured datasets are packaged and sold to LLM companies and analytics platforms.'
    }
  ];

  const getDelay = (index, base = 0) => base + index * 0.1;
</script>

<Metadata
  title="Products — Oraklex | AI Commerce Intelligence"
  description="Explore Oraklex products: J'ko AI virtual try-on, Data Oracle API for LLM training, and HyperC integration for retail optimization."
/>

<main class="products-page">
  <section class="hero" class:mounted>
    <div class="hero-content">
      <span class="eyebrow">Our Products</span>
      <h1>Intelligence Products for Modern Commerce</h1>
      <p class="hero-description">
        Each product in the Oraklex ecosystem captures unique data that feeds the Data Oracle - creating a vertically integrated commerce intelligence platform.
      </p>
    </div>
  </section>

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
        <p class="product-description">{product.longDescription}</p>

        <div class="product-metrics">
          {#each product.metrics as metric, i}
            <div class="metric-card" in:fade={{duration: 300, delay: i * 80}}>
              <span class="metric-value">{metric.value}</span>
              <span class="metric-label">{metric.label}</span>
            </div>
          {/each}
        </div>

        <div class="product-actions">
          {#if product.status === 'Live'}
            <Button variant="primary" href={product.dashboardLink}>Launch Dashboard</Button>
            <Button variant="secondary" href={product.link}>Visit Website</Button>
          {:else}
            <Button variant="secondary" href="mailto:hello@oraklex.com">Get Early Access</Button>
            {#if product.link !== '#contact'}
              <Button variant="secondary" href={product.link}>Learn More</Button>
            {/if}
          {/if}
        </div>
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

      <div class="data-contribution">
        <strong>Data Oracle Contribution:</strong>
        <p>{product.dataContribution}</p>
      </div>
    </section>
  {/each}

  <section class="cta-section" data-animate="cta" class:visible={visibleSections.has('cta')}>
    <div class="cta-content">
      <h2>Ready to Get Started?</h2>
      <p>
        Start with J'ko AI today and become part of the commerce intelligence ecosystem. Or reach out to discuss partnerships and early access to upcoming products.
      </p>
      <div class="cta-actions">
        <Button variant="primary" href="https://dash.jko.ai">Try J'ko AI Free</Button>
        <Button variant="secondary" href="mailto:hello@oraklex.com">Partner With Us</Button>
      </div>
    </div>
  </section>
</main>

<style lang="postcss">
  @reference '$theme';

  .products-page {
    @apply min-h-screen bg-base0 text-base5;
  }

  .hero {
    @apply relative overflow-hidden px-6 py-24 text-center;
    background: linear-gradient(160deg, rgba(var(--color-base1-rgb), 0.9) 0%, rgba(var(--color-base0-rgb), 1) 55%, rgba(var(--color-base14-rgb), 0.08) 100%);
  }

  .hero-content {
    @apply relative mx-auto flex max-w-4xl flex-col items-center gap-6;
    opacity: 0;
    transform: translateY(24px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .hero.mounted .hero-content {
    opacity: 1;
    transform: translateY(0);
  }

  .eyebrow {
    @apply text-xs font-semibold uppercase tracking-[0.35em] text-base4;
  }

  h1 {
    @apply text-4xl font-semibold text-base6 md:text-5xl lg:text-6xl;
  }

  .hero-description {
    @apply max-w-2xl text-lg text-base4;
  }

  .section-header {
    @apply mx-auto mb-12 max-w-3xl text-center;
  }

  .section-eyebrow {
    @apply text-xs font-semibold uppercase tracking-[0.35em] text-base4;
  }

  .section-header h2 {
    @apply mt-2 text-3xl font-semibold text-base6 md:text-4xl;
  }

  .ecosystem-section {
    @apply mx-auto max-w-6xl px-6 py-20;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .ecosystem-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .ecosystem-flow {
    @apply flex flex-col md:flex-row items-center justify-center gap-4;
  }

  .ecosystem-step {
    @apply flex flex-col items-center gap-2 rounded-2xl border border-base3/20 bg-base1/50 p-6 text-center;
    backdrop-filter: blur(14px);
    min-width: 200px;
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
    @apply text-3xl font-bold text-base14;
  }

  .ecosystem-step h3 {
    @apply text-lg font-semibold text-base6;
  }

  .step-product {
    @apply text-sm text-base14 font-medium;
  }

  .ecosystem-step p {
    @apply text-sm text-base4;
  }

  .ecosystem-arrow {
    @apply text-3xl text-base14 font-bold hidden md:block;
  }

  .product-section {
    @apply mx-auto max-w-6xl px-6 py-16;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .product-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .product-section.featured {
    @apply rounded-3xl my-8;
    background: linear-gradient(145deg, rgba(var(--color-base14-rgb), 0.05), rgba(var(--color-base1-rgb), 0.5));
    border: 1px solid rgba(var(--color-base14-rgb), 0.2);
  }

  .product-header {
    @apply flex flex-col items-center gap-4 text-center mb-12;
  }

  .product-status {
    @apply rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider;
    background: rgba(var(--color-base3-rgb), 0.3);
    color: var(--color-base4);
  }

  .product-status.live {
    background: rgba(var(--color-base14-rgb), 0.2);
    color: var(--color-base14);
  }

  .product-status.soon {
    background: rgba(var(--color-base3-rgb), 0.4);
    color: var(--color-base5);
  }

  .product-header h2 {
    @apply text-4xl font-semibold text-base6 md:text-5xl;
  }

  .product-tagline {
    @apply text-xl text-base14 font-medium;
  }

  .product-description {
    @apply max-w-2xl text-base text-base4;
  }

  .product-metrics {
    @apply grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6;
  }

  .metric-card {
    @apply rounded-xl px-4 py-4 text-center;
    background: rgba(var(--color-base1-rgb), 0.5);
    border: 1px solid rgba(var(--color-base3-rgb), 0.2);
  }

  .metric-value {
    @apply block text-xl font-bold text-base6;
  }

  .metric-label {
    @apply block text-xs font-medium uppercase tracking-wider text-base4;
  }

  .product-actions {
    @apply flex flex-wrap justify-center gap-4 mt-6;
  }

  .product-features {
    @apply mt-8;
  }

  .product-features h3 {
    @apply text-xl font-semibold text-base6 text-center mb-6;
  }

  .features-grid {
    @apply grid gap-6 md:grid-cols-2;
  }

  .feature-card {
    @apply rounded-2xl border border-base3/20 bg-base1/40 p-6;
    backdrop-filter: blur(12px);
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
    @apply text-lg font-semibold text-base6 mb-2;
  }

  .feature-card p {
    @apply text-sm text-base4;
  }

  .data-contribution {
    @apply mt-8 p-6 rounded-2xl text-center;
    background: rgba(var(--color-base14-rgb), 0.08);
    border-left: 4px solid var(--color-base14);
  }

  .data-contribution strong {
    @apply text-base14 text-sm uppercase tracking-wider;
  }

  .data-contribution p {
    @apply text-base text-base5 mt-2;
  }

  .cta-section {
    @apply px-6 pb-24;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .cta-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .cta-content {
    @apply mx-auto max-w-4xl flex flex-col items-center gap-6 rounded-[36px] border border-base3/20 bg-gradient-to-br from-base2 via-base1 to-base14/10 px-12 py-16 text-center shadow-xl;
  }

  .cta-content h2 {
    @apply text-3xl font-semibold text-base6 md:text-4xl;
  }

  .cta-content p {
    @apply max-w-2xl text-lg text-base4;
  }

  .cta-actions {
    @apply flex flex-wrap justify-center gap-4 mt-4;
  }

  @media (max-width: 768px) {
    .hero {
      @apply py-16;
    }

    h1 {
      @apply text-3xl;
    }

    .ecosystem-section,
    .product-section {
      @apply px-4;
    }

    .ecosystem-flow {
      @apply flex-col;
    }

    .ecosystem-arrow {
      @apply block rotate-90;
    }

    .features-grid {
      @apply grid-cols-1;
    }

    .cta-content {
      @apply px-6 py-10;
    }
  }
</style>

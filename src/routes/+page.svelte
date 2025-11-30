<script>
  import {onMount} from 'svelte';
  import {fade, fly} from 'svelte/transition';
  import Metadata from '$features/seo/Metadata.svelte';
  import JsonLd from '$features/seo/JsonLd.svelte';
  import {appName, domain} from '$settings/global';
  import {Button} from '$components/jera';
  import TypewriterText from '$components/TypewriterText.svelte';

  const heroMetrics = [
    {value: '$100B+', label: 'e-commerce data market'},
    {value: '10×', label: 'faster optimization'},
    {value: '40%+', label: 'revenue attribution'},
    {value: 'Real-time', label: 'intelligence'}
  ];

  const heroHighlights = [
    'AI Planning & Optimization',
    'E-Commerce Data Oracle',
    'LLM Training Datasets'
  ];

  const pillars = [
    {
      phase: '01',
      label: 'Data Capture',
      title: 'Complete E-Commerce Funnel',
      description: 'Capture the entire customer journey from social media discovery to purchase completion. Every interaction, every intent signal, every conversion.',
      points: [
        'Social engagement → Virtual try-on → Purchase decision',
        'Full attribution from content to conversion',
        'Behavioral signals LLMs need to understand commerce'
      ]
    },
    {
      phase: '02',
      label: 'AI Planning',
      title: 'Intelligent Optimization',
      description: 'HyperC-powered AI planning for inventory, pricing, and campaign optimization. Mathematical optimization meets e-commerce reality.',
      points: [
        'Predictive inventory replenishment',
        'Dynamic pricing on the efficient frontier',
        'Optimal campaign timing and content'
      ]
    },
    {
      phase: '03',
      label: 'Data Oracle',
      title: 'Trusted Commerce Intelligence',
      description: 'The Bloomberg Terminal for e-commerce behavior. Anonymized, structured datasets that power the next generation of AI.',
      points: [
        'Training data for LLMs and recommendation engines',
        'Intent-to-action correlation datasets',
        'Privacy-compliant, GDPR-ready exports'
      ]
    }
  ];

  const products = [
    {
      name: "J'ko AI",
      tagline: 'Virtual Try-On for Social Commerce',
      description: 'AI-powered virtual try-on that converts Instagram DMs into sales. Reduce returns by 30-40%, increase conversion by 20-30%.',
      link: 'https://jko.ai',
      features: ['Instagram DM Automation', 'Shopify Integration', 'Full Attribution Tracking'],
      status: 'Live'
    },
    {
      name: 'Data Oracle API',
      tagline: 'E-Commerce Behavior Intelligence',
      description: 'Structured datasets capturing complete conversion funnels. From social impression to purchase - the data LLMs need.',
      link: '#contact',
      features: ['Conversion Funnel Data', 'Intent Signals', 'Anonymized Exports'],
      status: 'Coming Soon'
    },
    {
      name: 'HyperC Integration',
      tagline: 'AI Planning for Retail',
      description: 'Large Retail Model optimization for inventory, pricing, and demand forecasting. Partnership with HyperC AI.',
      link: '#contact',
      features: ['Inventory Optimization', 'Dynamic Pricing', 'Demand Forecasting'],
      status: 'In Development'
    }
  ];

  const dataValue = [
    {
      tier: 'Tier 1',
      title: 'Complete Conversion Funnels',
      description: 'Social post → DM → Photo → Try-on → Purchase. The full journey with attributed outcomes.',
      value: '$0.10-1.00 per funnel'
    },
    {
      tier: 'Tier 2',
      title: 'Conversational Commerce',
      description: 'Real sales conversations with purchase outcomes. Train AI on actual buying behavior.',
      value: '$0.05-0.50 per conversation'
    },
    {
      tier: 'Tier 3',
      title: 'Product-Purchase Attribution',
      description: 'Which products were tried, which were bought. Visual preference → purchasing behavior.',
      value: '$0.01-0.10 per attribution'
    }
  ];

  const partners = [
    {name: 'OpenAI', type: 'Potential Buyer'},
    {name: 'Anthropic', type: 'Potential Buyer'},
    {name: 'Google', type: 'Potential Buyer'},
    {name: 'HyperC', type: 'Technology Partner'},
    {name: 'Meta', type: 'Platform Partner'}
  ];

  let animatedSections = $state(new Set());

  const getDelay = (index, base = 0) => base + index * 80;

  onMount(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-animate');
            if (id && !animatedSections.has(id)) {
              animatedSections = new Set([...animatedSections, id]);
            }
          }
        }
      },
      {threshold: 0.2}
    );

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  });
</script>

<Metadata
  title="Oraklex — AI Data Intelligence & Commerce Optimization"
  description="The Data Oracle for e-commerce. Capture complete conversion funnels, optimize with AI planning, and power the next generation of LLMs with real commerce behavior data."
  canonicalUrl={domain}
  ogType="website"
  ogImage={`${domain}/images/oraklex-og-banner.jpg`}
  ogImageAlt="Oraklex - AI Data Intelligence for E-Commerce"
  robots="index, follow"
/>

<JsonLd
  type="Organization"
  data={{
    name: appName,
    description: 'AI Data Intelligence and Commerce Optimization. Building the Data Oracle for e-commerce.',
    url: domain
  }}
/>

<main class="landing">
  <section class="hero" data-animate="hero" class:visible={animatedSections.has('hero')}>
    <div class="hero-shell">
      <div class="hero-copy">
        <span class="eyebrow">The Future of Commerce Intelligence</span>
        <h1 in:fly={{y: 24, duration: 400}}>
          Building the <TypewriterText words={['Data Oracle', 'AI Backbone', 'Intelligence Layer', 'Future']} speed={120} deleteSpeed={60} pauseDuration={2500} /> for E-Commerce
        </h1>
        <p in:fade={{duration: 400, delay: 80}}>
          Oraklex captures the complete e-commerce journey from social discovery to purchase. We combine AI planning technology with unique behavioral data to create the intelligence layer that powers the next generation of commerce.
        </p>

        <div class="cta-row" in:fade={{duration: 400, delay: 120}}>
          <Button variant="primary" href="/products">Explore Products</Button>
          <Button variant="secondary" href="/team">Meet the Team</Button>
        </div>

        <div class="hero-highlights" in:fade={{duration: 400, delay: 140}}>
          {#each heroHighlights as highlight}
            <span class="highlight-pill">{highlight}</span>
          {/each}
        </div>

        <div class="hero-metrics">
          {#each heroMetrics as metric, i}
            <div
              class="metric-card"
              data-animate={`metric-${i}`}
              class:visible={animatedSections.has(`metric-${i}`)}
              in:fade={{duration: 300, delay: getDelay(i, 160)}}
            >
              <span class="metric-value">{metric.value}</span>
              <span class="metric-label">{metric.label}</span>
            </div>
          {/each}
        </div>
      </div>

      <div class="hero-visual" data-animate="visual" class:visible={animatedSections.has('visual')}>
        <div class="oracle-visual" in:fade={{duration: 400, delay: 200}}>
          <div class="data-flow">
            <div class="flow-layer layer-1">
              <span>Social</span>
              <span>Intent</span>
              <span>Action</span>
            </div>
            <div class="flow-arrow">→</div>
            <div class="flow-layer layer-2">
              <span>AI Planning</span>
              <span>Optimization</span>
            </div>
            <div class="flow-arrow">→</div>
            <div class="flow-layer layer-3">
              <span>Data Oracle</span>
              <span>LLM Training</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="pillars" data-animate="pillars" class:visible={animatedSections.has('pillars')}>
    <div class="section-header">
      <span class="section-eyebrow">The Oraklex Stack</span>
      <h2>Three pillars of commerce intelligence</h2>
      <p>
        From data capture to AI optimization to monetizable datasets - a vertically integrated approach to e-commerce intelligence.
      </p>
    </div>

    <div class="pillars-grid">
      {#each pillars as pillar, i}
        <article
          class="pillar-card"
          data-animate={`pillar-${i}`}
          class:visible={animatedSections.has(`pillar-${i}`)}
          in:fade={{duration: 400, delay: getDelay(i, 120)}}
        >
          <div class="pillar-header">
            <span class="pillar-phase">{pillar.phase}</span>
            <span class="pillar-label">{pillar.label}</span>
          </div>
          <h3>{pillar.title}</h3>
          <p>{pillar.description}</p>
          <ul class="pillar-points">
            {#each pillar.points as point}
              <li>{point}</li>
            {/each}
          </ul>
        </article>
      {/each}
    </div>
  </section>

  <section class="products-section" data-animate="products" class:visible={animatedSections.has('products')}>
    <div class="section-header">
      <span class="section-eyebrow">Our Products</span>
      <h2>Intelligence products for modern commerce</h2>
      <p>
        Each product captures unique data that feeds the Data Oracle ecosystem.
      </p>
    </div>

    <div class="products-grid">
      {#each products as product, i}
        <article
          class="product-card"
          data-animate={`product-${i}`}
          class:visible={animatedSections.has(`product-${i}`)}
          in:fade={{duration: 400, delay: getDelay(i, 120)}}
        >
          <div class="product-status" class:live={product.status === 'Live'}>
            {product.status}
          </div>
          <h3>{product.name}</h3>
          <span class="product-tagline">{product.tagline}</span>
          <p>{product.description}</p>
          <ul class="product-features">
            {#each product.features as feature}
              <li>{feature}</li>
            {/each}
          </ul>
          <Button
            variant={product.status === 'Live' ? 'primary' : 'secondary'}
            href={product.link}
            fullWidth
          >
            {product.status === 'Live' ? 'Visit Product' : 'Learn More'}
          </Button>
        </article>
      {/each}
    </div>
  </section>

  <section class="data-value" data-animate="value" class:visible={animatedSections.has('value')}>
    <div class="section-header">
      <span class="section-eyebrow">Data Monetization</span>
      <h2>What makes our data valuable</h2>
      <p>
        Complete conversion funnels with attributed outcomes - exactly what AI companies need to train models that understand buying behavior.
      </p>
    </div>

    <div class="value-grid">
      {#each dataValue as item, i}
        <article
          class="value-card"
          data-animate={`value-${i}`}
          class:visible={animatedSections.has(`value-${i}`)}
          in:fade={{duration: 400, delay: getDelay(i, 120)}}
        >
          <span class="value-tier">{item.tier}</span>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <span class="value-price">{item.value}</span>
        </article>
      {/each}
    </div>
  </section>

  <section class="partners-section" data-animate="partners" class:visible={animatedSections.has('partners')}>
    <div class="section-header compact">
      <span class="section-eyebrow">Ecosystem</span>
      <h2>Building the commerce data consortium</h2>
    </div>

    <div class="partners-grid">
      {#each partners as partner, i}
        <div
          class="partner-item"
          data-animate={`partner-${i}`}
          class:visible={animatedSections.has(`partner-${i}`)}
          in:fade={{duration: 400, delay: getDelay(i, 100)}}
        >
          <span class="partner-name">{partner.name}</span>
          <span class="partner-type">{partner.type}</span>
        </div>
      {/each}
    </div>
  </section>

  <section class="cta" data-animate="cta" class:visible={animatedSections.has('cta')}>
    <div class="cta-shell">
      <div class="cta-content" in:fade={{duration: 400}}>
        <span class="section-eyebrow">Join the Vision</span>
        <h2>The future of commerce intelligence starts here</h2>
        <p>
          We're building the Data Oracle that will power the next generation of AI-driven commerce. Whether you're a brand, an AI company, or an investor - let's talk.
        </p>
        <div class="cta-actions">
          <Button variant="primary" href="https://jko.ai">Try J'ko AI</Button>
          <Button variant="secondary" href="mailto:partners@oraklex.com">Partner With Us</Button>
        </div>
      </div>
    </div>
  </section>
</main>

<style lang="postcss">
  @reference '$theme';

  .landing {
    @apply min-h-screen bg-base0 text-base5;
  }

  section {
    @apply relative;
  }

  .hero {
    @apply overflow-hidden pt-32 pb-24 bg-base0;
    position: relative;
  }

  .hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--color-border) 50%, transparent);
  }

  .hero.visible {
    @apply opacity-100;
  }

  .hero-shell {
    @apply mx-auto flex w-full max-w-7xl flex-col gap-16 px-6 lg:flex-row lg:items-center lg:gap-20;
  }

  .hero-copy {
    @apply flex w-full flex-col gap-6 lg:max-w-xl;
    flex: 0 0 auto;
  }

  .eyebrow {
    @apply text-sm font-medium uppercase tracking-widest text-base4;
  }

  h1 {
    @apply text-4xl font-semibold leading-tight text-base6 md:text-5xl lg:text-6xl;
  }

  .hero-copy p {
    @apply text-base leading-relaxed text-base4 md:text-lg;
  }

  .cta-row {
    @apply flex flex-wrap items-center gap-4 pt-4;
  }

  .hero-highlights {
    @apply flex flex-wrap gap-2 pt-4;
  }

  .highlight-pill {
    @apply inline-flex items-center rounded-full px-4 py-1.5 text-xs font-medium tracking-wide;
    background: rgba(var(--color-base1-rgb), 0.6);
    color: var(--color-base5);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(var(--color-base3-rgb), 0.2);
  }

  :root[data-theme='miozu-dark'] .highlight-pill {
    background: rgba(var(--color-base2-rgb), 0.5);
    border: 1px solid rgba(var(--color-base3-rgb), 0.25);
  }

  .hero-metrics {
    @apply grid grid-cols-2 gap-4 pt-8 sm:grid-cols-4;
  }

  .metric-card {
    @apply rounded-xl px-4 py-5 text-center opacity-0 translate-y-4;
    background: rgba(var(--color-base1-rgb), 0.5);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(var(--color-base3-rgb), 0.2);
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  :root[data-theme='miozu-dark'] .metric-card {
    background: rgba(var(--color-base2-rgb), 0.4);
    border: 1px solid rgba(var(--color-base3-rgb), 0.3);
  }

  .metric-card.visible {
    @apply opacity-100 translate-y-0;
  }

  .metric-value {
    @apply block text-2xl font-bold mb-1;
    color: var(--color-base6);
  }

  .metric-label {
    @apply block text-[11px] font-medium uppercase tracking-wider;
    color: var(--color-base4);
  }

  .hero-visual {
    @apply relative flex w-full items-center justify-center;
    min-height: 400px;
  }

  .oracle-visual {
    @apply relative w-full max-w-[520px] rounded-3xl p-8;
    background: linear-gradient(145deg, rgba(var(--color-base1-rgb), 0.8), rgba(var(--color-base2-rgb), 0.6));
    border: 1px solid rgba(var(--color-base3-rgb), 0.3);
    backdrop-filter: blur(20px);
  }

  .data-flow {
    @apply flex flex-col gap-6 items-center;
  }

  .flow-layer {
    @apply flex flex-col gap-2 rounded-xl p-4 w-full text-center;
    background: rgba(var(--color-base14-rgb), 0.1);
    border: 1px solid rgba(var(--color-base14-rgb), 0.2);
  }

  .flow-layer span {
    @apply text-sm font-medium text-base5;
  }

  .flow-arrow {
    @apply text-2xl text-base14 font-bold;
  }

  .pillars,
  .products-section,
  .data-value,
  .partners-section {
    @apply mx-auto max-w-6xl px-6 py-20;
  }

  .section-header {
    @apply mx-auto flex max-w-3xl flex-col gap-4 text-center mb-12;
  }

  .section-header.compact {
    @apply mb-10;
  }

  .section-eyebrow {
    @apply text-xs font-semibold uppercase tracking-[0.35em] text-base4;
  }

  .section-header h2 {
    @apply text-3xl font-semibold text-base5 md:text-4xl;
  }

  .section-header p {
    @apply text-base text-base4 md:text-lg;
  }

  .pillars-grid {
    @apply grid gap-6 md:grid-cols-3;
  }

  .pillar-card {
    @apply flex flex-col gap-4 rounded-[28px] border border-border/60 bg-base1 p-6 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-lg opacity-0 translate-y-2;
  }

  .pillar-card.visible {
    @apply opacity-100 translate-y-0;
  }

  .pillar-header {
    @apply flex items-center justify-between;
  }

  .pillar-phase {
    @apply text-2xl font-bold text-base14;
  }

  .pillar-label {
    @apply text-xs font-semibold uppercase tracking-[0.3em] text-base4;
  }

  .pillar-card h3 {
    @apply text-xl font-semibold text-base6;
  }

  .pillar-card p {
    @apply text-sm text-base4;
  }

  .pillar-points {
    @apply flex flex-col gap-2 mt-2;
  }

  .pillar-points li {
    @apply text-sm text-base5 pl-4 relative;
  }

  .pillar-points li::before {
    content: '→';
    @apply absolute left-0 text-base14;
  }

  .products-grid {
    @apply grid gap-6 md:grid-cols-3;
  }

  .product-card {
    @apply flex flex-col gap-4 rounded-[28px] border border-border/60 bg-base1 p-6 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-lg opacity-0 translate-y-2;
  }

  .product-card.visible {
    @apply opacity-100 translate-y-0;
  }

  .product-status {
    @apply self-start rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider;
    background: rgba(var(--color-base3-rgb), 0.3);
    color: var(--color-base4);
  }

  .product-status.live {
    background: rgba(var(--color-base14-rgb), 0.2);
    color: var(--color-base14);
  }

  .product-card h3 {
    @apply text-xl font-semibold text-base6;
  }

  .product-tagline {
    @apply text-sm text-base14 font-medium;
  }

  .product-card p {
    @apply text-sm text-base4 flex-1;
  }

  .product-features {
    @apply flex flex-col gap-1 text-xs text-base5;
  }

  .product-features li::before {
    content: '✓ ';
    @apply text-base14;
  }

  .value-grid {
    @apply grid gap-6 md:grid-cols-3;
  }

  .value-card {
    @apply flex flex-col gap-3 rounded-[28px] border border-border/60 bg-base1 p-6 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-lg opacity-0 translate-y-2;
  }

  .value-card.visible {
    @apply opacity-100 translate-y-0;
  }

  .value-tier {
    @apply text-xs font-semibold uppercase tracking-[0.3em] text-base14;
  }

  .value-card h3 {
    @apply text-lg font-semibold text-base6;
  }

  .value-card p {
    @apply text-sm text-base4 flex-1;
  }

  .value-price {
    @apply text-lg font-bold text-base5 mt-2;
  }

  .partners-grid {
    @apply flex flex-wrap justify-center gap-6;
  }

  .partner-item {
    @apply flex flex-col items-center gap-1 rounded-xl px-6 py-4 opacity-0 translate-y-2;
    background: rgba(var(--color-base1-rgb), 0.5);
    border: 1px solid rgba(var(--color-base3-rgb), 0.2);
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .partner-item.visible {
    @apply opacity-100 translate-y-0;
  }

  .partner-name {
    @apply text-base font-semibold text-base6;
  }

  .partner-type {
    @apply text-xs text-base4;
  }

  .cta {
    @apply px-6 pb-24 pt-12;
  }

  .cta-shell {
    @apply mx-auto max-w-5xl rounded-[36px] border border-border bg-gradient-to-br from-base2 via-base1 to-base14/10 px-8 py-12 text-base5 shadow-lg;
  }

  .cta-content {
    @apply flex flex-col gap-6 text-center;
  }

  .cta-content h2 {
    @apply text-3xl font-semibold text-base6 md:text-4xl;
  }

  .cta-content p {
    @apply text-base text-base4 md:text-lg;
  }

  .cta-actions {
    @apply flex flex-wrap justify-center gap-4 pt-2;
  }

  @media (max-width: 1024px) {
    .hero {
      @apply pt-20;
    }

    .hero-shell {
      @apply gap-12;
    }

    .hero-visual {
      min-height: 300px;
    }
  }

  @media (max-width: 768px) {
    .hero-shell {
      @apply px-4;
    }

    .pillars,
    .products-section,
    .data-value,
    .partners-section {
      @apply px-4 py-16;
    }

    .hero-metrics {
      @apply grid-cols-2 gap-3;
    }

    .pillars-grid,
    .products-grid,
    .value-grid {
      @apply grid-cols-1;
    }

    .cta-shell {
      @apply px-6 py-10;
    }
  }
</style>

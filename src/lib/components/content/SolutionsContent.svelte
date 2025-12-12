<script>
  import {onMount} from 'svelte';
  import {fade} from 'svelte/transition';
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

  const solutions = [
    {
      id: 'behavioral-data',
      name: 'Commerce Behavior Index',
      tagline: 'First-Party Behavioral Datasets',
      status: 'Early Access',
      description: 'The richest commerce behavioral dataset in fashion. Structured, anonymized, ready for AI training and analytics.',
      longDescription: "Built on J'ko's virtual try-on platform, we capture millions of authentic shopping interactions monthly. Every style preference, size consideration, and purchase decision becomes training data for the next generation of AI commerce systems. Enterprise-licensed, privacy-compliant, structured for machine learning.",
      metrics: [
        {value: '10M+', label: 'Monthly Events'},
        {value: '500K+', label: 'User Sessions'},
        {value: 'GDPR/CCPA', label: 'Compliant'},
        {value: 'JSON/Parquet', label: 'Formats'}
      ],
      features: [
        {
          title: 'Try-On Behavior Signals',
          description: 'Virtual try-on interactions revealing style preferences, size confidence, and purchase intent.'
        },
        {
          title: 'Fashion Intent Classification',
          description: 'Pre-labeled datasets mapping browsing patterns to purchase probability and style affinity.'
        },
        {
          title: 'Conversion Event Streams',
          description: 'Real-time event data from discovery to checkout, structured for ML pipelines.'
        },
        {
          title: 'Enterprise Data Licensing',
          description: 'Flexible licensing: API access, batch exports, or dedicated data feeds for training.'
        }
      ],
      contribution: "Powered by J'ko AI's virtual try-on platform serving fashion brands globally."
    },
    {
      id: 'demand-api',
      name: 'Demand Prediction API',
      tagline: 'Predictive Intelligence for Commerce',
      status: 'Early Access',
      description: 'Know what customers want before they search for it. Real-time demand signals for inventory, marketing, and AI agents.',
      longDescription: 'Our prediction engine processes behavioral signals to forecast demand at SKU level. Fashion retailers use it for inventory planning. AI companies use it to power recommendation agents. Marketing teams use it to time campaigns. Sub-100ms latency, enterprise SLAs, proven at scale.',
      metrics: [
        {value: '94%', label: 'Accuracy'},
        {value: '<100ms', label: 'Latency'},
        {value: '99.9%', label: 'Uptime SLA'},
        {value: 'RESTful', label: 'API'}
      ],
      features: [
        {
          title: 'SKU-Level Forecasting',
          description: 'Predict demand for specific products, sizes, and variants up to 30 days ahead.'
        },
        {
          title: 'Trend Detection',
          description: 'Identify emerging style trends from behavioral signals before they hit search volume.'
        },
        {
          title: 'Inventory Optimization',
          description: 'Reduce stockouts by 40% and overstock by 25% with demand-driven replenishment signals.'
        },
        {
          title: 'AI Agent Integration',
          description: 'Structured prediction payloads designed for autonomous agent consumption.'
        }
      ],
      contribution: 'Intelligence layer for AI agents, inventory systems, and marketing automation.'
    },
    {
      id: 'geo',
      name: 'GEO Intelligence',
      tagline: 'Generative Engine Optimization',
      status: 'Live',
      description: 'Be the answer when AI speaks. Strategic positioning for enterprise brands in ChatGPT, Claude, Gemini, and Perplexity.',
      longDescription: 'When enterprise buyers ask AI for recommendations, your brand needs to be the answer. GEO Intelligence analyzes how LLMs retrieve and cite sources, then positions your digital presence as the authoritative reference. Not SEO for search engines—strategic visibility for the AI-first era.',
      metrics: [
        {value: '10x', label: 'AI Citations'},
        {value: '85%', label: 'Share of Voice'},
        {value: 'Real-time', label: 'Monitoring'},
        {value: 'Multi-LLM', label: 'Coverage'}
      ],
      features: [
        {
          title: 'Citation Intelligence',
          description: 'Track when and how AI systems reference your brand across GPT-4, Claude, Gemini, and Perplexity.'
        },
        {
          title: 'Authority Positioning',
          description: 'Strategic content architecture that makes your brand the source LLMs prefer to cite.'
        },
        {
          title: 'Competitive Monitoring',
          description: "Real-time alerts when competitors gain or lose AI visibility in your category."
        },
        {
          title: 'Enterprise Dashboard',
          description: 'Executive reporting on AI visibility, citation sentiment, and market position.'
        }
      ],
      contribution: 'Generates AI interaction patterns and citation data that feed our prediction models.'
    },
    {
      id: 'aeo',
      name: 'AEO Solutions',
      tagline: 'Answer Engine Optimization',
      status: 'Live',
      description: 'Own the AI-generated answer. When Perplexity or AI Overviews respond, be the cited source.',
      longDescription: 'Answer engines synthesize responses from multiple sources—but they cite their favorites. AEO Solutions structures your enterprise content for answer retrieval, building the trust signals that make Perplexity, Google AI Overviews, and Bing Copilot choose your content as the primary source.',
      metrics: [
        {value: '40%', label: 'Answer Share'},
        {value: '3x', label: 'Referral Traffic'},
        {value: 'Schema', label: 'Optimized'},
        {value: '24/7', label: 'Monitoring'}
      ],
      features: [
        {
          title: 'Answer-First Architecture',
          description: 'Structure content specifically for how answer engines parse and synthesize information.'
        },
        {
          title: 'Query Intelligence',
          description: 'Identify the questions enterprise buyers ask AI systems in your category.'
        },
        {
          title: 'Source Authority Building',
          description: 'Build the trust signals that make answer engines prefer your content over competitors.'
        },
        {
          title: 'Multi-Platform Optimization',
          description: 'Unified strategy for Perplexity, Google AI Overviews, Bing Copilot, and emerging platforms.'
        }
      ],
      contribution: 'Query patterns and answer structures feed predictive intelligence for demand forecasting.'
    }
  ];

  const dataFlow = [
    {
      step: '01',
      title: 'Capture',
      subtitle: "J'ko Platform",
      description: "10M+ monthly behavioral events from virtual try-on interactions on J'ko AI."
    },
    {
      step: '02',
      title: 'Structure',
      subtitle: 'ML Pipeline',
      description: 'Transform raw events into labeled datasets optimized for AI training and analytics.'
    },
    {
      step: '03',
      title: 'Predict',
      subtitle: 'Intelligence Engine',
      description: 'Generate demand forecasts, trend signals, and decision intelligence in real-time.'
    },
    {
      step: '04',
      title: 'Deliver',
      subtitle: 'Enterprise API',
      description: 'RESTful APIs with sub-100ms latency, enterprise SLAs, and flexible licensing.'
    }
  ];

  const getDelay = (index, base = 0) => base + index * 0.1;
</script>

<div class="solutions-content">
  <section class="data-flow-section" data-animate="flow" class:visible={visibleSections.has('flow')}>
    <div class="section-header">
      <span class="section-label">Data Infrastructure</span>
      <h2>From Behavioral Data to Enterprise Intelligence</h2>
    </div>

    <div class="data-flow">
      {#each dataFlow as step, i}
        <article
          class="flow-step"
          data-animate={`flow-${i}`}
          class:visible={visibleSections.has(`flow-${i}`)}
          style={`--delay: ${getDelay(i)}s`}
        >
          <span class="step-number">{step.step}</span>
          <h3>{step.title}</h3>
          <span class="step-subtitle">{step.subtitle}</span>
          <p>{step.description}</p>
        </article>
        {#if i < dataFlow.length - 1}
          <div class="flow-connector">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14m-7-7l7 7-7 7"/>
            </svg>
          </div>
        {/if}
      {/each}
    </div>
  </section>

  {#each solutions as solution, solutionIndex}
    <section
      id={solution.id}
      class="solution-section"
      class:featured={solution.status === 'Live' || solution.status === 'Early Access'}
      data-animate={`solution-${solutionIndex}`}
      class:visible={visibleSections.has(`solution-${solutionIndex}`)}
    >
      <div class="solution-header">
        <div class="solution-status" class:live={solution.status === 'Live'} class:early={solution.status === 'Early Access'}>
          {solution.status}
        </div>
        <h2>{solution.name}</h2>
        <span class="solution-tagline">{solution.tagline}</span>
        <p class="solution-description">{solution.longDescription}</p>

        <div class="solution-metrics">
          {#each solution.metrics as metric, i}
            <div class="metric-card" in:fade={{duration: 300, delay: i * 80}}>
              <span class="metric-value">{metric.value}</span>
              <span class="metric-label">{metric.label}</span>
            </div>
          {/each}
        </div>

        <div class="solution-actions">
          {#if solution.status === 'Live'}
            <a href="/contact" class="action-btn primary">Get Started</a>
          {:else if solution.status === 'Early Access'}
            <a href="/contact" class="action-btn primary">Request Early Access</a>
            <a href="mailto:partners@oraklex.com" class="action-btn secondary">Enterprise Inquiry</a>
          {:else}
            <a href="mailto:partners@oraklex.com" class="action-btn secondary">Join Waitlist</a>
          {/if}
        </div>
      </div>

      <div class="solution-features">
        <h3>Key Capabilities</h3>
        <div class="features-grid">
          {#each solution.features as feature, i}
            <article
              class="feature-card"
              data-animate={`feature-${solutionIndex}-${i}`}
              class:visible={visibleSections.has(`feature-${solutionIndex}-${i}`)}
              style={`--delay: ${getDelay(i, 0.1)}s`}
            >
              <h4>{feature.title}</h4>
              <p>{feature.description}</p>
            </article>
          {/each}
        </div>
      </div>

      <div class="data-contribution">
        <span class="contribution-label">Data Oracle Contribution</span>
        <p>{solution.contribution}</p>
      </div>
    </section>
  {/each}

  <section class="cta-section" data-animate="cta" class:visible={visibleSections.has('cta')}>
    <div class="cta-content">
      <h2>Ready to License Commerce Intelligence?</h2>
      <p>
        Enterprise data licensing, API access, and strategic partnerships for fashion retailers, AI companies, and commerce platforms.
      </p>
      <div class="cta-actions">
        <a href="/contact" class="action-btn primary">Request Data Access</a>
        <a href="mailto:partners@oraklex.com" class="action-btn secondary">Enterprise Partnerships</a>
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
    @apply mx-auto mb-10 max-w-3xl text-center;
  }

  .section-label {
    @apply text-xs font-semibold uppercase tracking-[0.25em] text-base4;
  }

  .section-header h2 {
    @apply mt-2 text-2xl font-semibold text-base6 md:text-3xl;
    letter-spacing: -0.02em;
  }

  .data-flow-section {
    @apply mx-auto max-w-6xl px-8 py-16;
    opacity: 0;
    transform: translateY(24px);
    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .data-flow-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .data-flow {
    @apply flex flex-col lg:flex-row items-center justify-center gap-3;
  }

  .flow-step {
    @apply flex flex-col items-center gap-1.5 rounded-2xl border border-base3/40 bg-base0 p-5 text-center;
    min-width: 160px;
    flex: 1;
    opacity: 0;
    transform: translateY(16px);
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: var(--delay, 0s);
  }

  .flow-step.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .step-number {
    @apply text-2xl font-bold text-base14;
  }

  .flow-step h3 {
    @apply text-base font-semibold text-base6;
  }

  .step-subtitle {
    @apply text-xs text-base14 font-medium uppercase tracking-wider;
  }

  .flow-step p {
    @apply text-xs text-base4 mt-1;
  }

  .flow-connector {
    @apply text-base3 hidden lg:flex items-center justify-center;
  }

  .solution-section {
    @apply mx-auto max-w-6xl px-8 py-12;
    opacity: 0;
    transform: translateY(24px);
    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
    scroll-margin-top: 100px;
  }

  .solution-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .solution-section.featured {
    @apply rounded-3xl my-6;
    background: linear-gradient(145deg, rgba(var(--color-base14-rgb), 0.03), rgba(var(--color-base2-rgb), 0.5));
    border: 1px solid rgba(var(--color-base3-rgb), 0.3);
  }

  .solution-header {
    @apply flex flex-col items-center gap-3 text-center mb-10;
  }

  .solution-status {
    @apply rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider;
    background: rgba(var(--color-base3-rgb), 0.3);
    color: var(--color-base4);
  }

  .solution-status.live {
    background: var(--color-base14);
    color: var(--color-base0);
  }

  .solution-status.early {
    background: linear-gradient(135deg, #4a9eff, #6366f1);
    color: #fff;
  }

  .solution-header h2 {
    @apply text-3xl font-semibold text-base6 md:text-4xl;
    letter-spacing: -0.02em;
  }

  .solution-tagline {
    @apply text-base text-base14 font-medium;
  }

  .solution-description {
    @apply max-w-2xl text-sm text-base4 leading-relaxed;
  }

  .solution-metrics {
    @apply grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 w-full max-w-xl;
  }

  .metric-card {
    @apply rounded-xl px-4 py-4 text-center;
    background: rgba(var(--color-base2-rgb), 0.5);
    border: 1px solid rgba(var(--color-base3-rgb), 0.3);
  }

  .metric-value {
    @apply block text-xl font-bold text-base6;
  }

  .metric-label {
    @apply block text-[10px] font-medium uppercase tracking-wider text-base4 mt-1;
  }

  .solution-actions {
    @apply flex flex-wrap justify-center gap-4 mt-6;
  }

  .action-btn {
    @apply inline-flex items-center justify-center px-8 py-3 rounded-lg text-sm font-semibold no-underline;
    @apply transition-all duration-200;
    min-width: 180px;
  }

  .action-btn.primary {
    background: var(--color-base14);
    color: var(--color-base0);
  }

  .action-btn.primary:hover {
    background: var(--color-base6);
  }

  .action-btn.secondary {
    background: transparent;
    color: var(--color-base14);
    border: 1px solid var(--color-base14);
  }

  .action-btn.secondary:hover {
    background: rgba(var(--color-base14-rgb), 0.1);
  }

  .solution-features {
    @apply mt-8;
  }

  .solution-features h3 {
    @apply text-lg font-semibold text-base6 text-center mb-6;
  }

  .features-grid {
    @apply grid gap-4 md:grid-cols-2;
  }

  .feature-card {
    @apply rounded-2xl border border-base3/30 bg-base0 p-5;
    opacity: 0;
    transform: translateY(12px);
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: var(--delay, 0s);
  }

  .feature-card.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .feature-card h4 {
    @apply text-sm font-semibold text-base6 mb-2;
  }

  .feature-card p {
    @apply text-xs text-base4 leading-relaxed;
  }

  .data-contribution {
    @apply mt-8 p-6 rounded-2xl text-center;
    background: rgba(var(--color-base14-rgb), 0.05);
  }

  .contribution-label {
    @apply text-xs font-semibold uppercase tracking-[0.15em] text-base14;
  }

  .data-contribution p {
    @apply text-sm text-base5 mt-2;
  }

  .cta-section {
    @apply mx-auto max-w-6xl px-8 py-16;
    opacity: 0;
    transform: translateY(24px);
    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .cta-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .cta-content {
    @apply mx-auto max-w-3xl flex flex-col items-center gap-5 rounded-3xl border border-base3/30 px-8 py-12 text-center;
    background: linear-gradient(135deg, var(--color-base1), var(--color-base2));
  }

  .cta-content h2 {
    @apply text-2xl font-semibold text-base6 md:text-3xl;
    letter-spacing: -0.02em;
  }

  .cta-content p {
    @apply max-w-xl text-base text-base4;
  }

  .cta-actions {
    @apply flex flex-wrap justify-center gap-4 mt-2;
  }

  @media (max-width: 768px) {
    .data-flow-section,
    .solution-section {
      @apply px-4;
    }

    .data-flow {
      @apply flex-col;
    }

    .flow-connector {
      @apply flex rotate-90;
    }

    .features-grid {
      @apply grid-cols-1;
    }

    .cta-content {
      @apply px-5 py-8;
    }

    .action-btn {
      @apply w-full;
      min-width: auto;
    }
  }
</style>

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
      id: 'geo',
      name: 'GEO Intelligence',
      tagline: 'Generative Engine Optimization',
      status: 'Live',
      description: 'Make your brand visible in the AI-first world. As users shift from search engines to AI assistants, traditional SEO becomes obsolete.',
      longDescription: 'GEO Intelligence ensures your brand appears when ChatGPT, Claude, Gemini, and other AI systems answer questions about your industry. We analyze how LLMs retrieve and present information, then optimize your digital presence to be the authoritative source AI systems reference.',
      metrics: [
        {value: '10x', label: 'AI Visibility'},
        {value: '85%', label: 'Citation Rate'},
        {value: 'Real-time', label: 'Monitoring'},
        {value: '24/7', label: 'Optimization'}
      ],
      features: [
        {
          title: 'LLM Citation Analysis',
          description: 'Track when and how AI systems reference your brand, products, or content across major models.'
        },
        {
          title: 'Authority Building',
          description: 'Strategic content and structured data optimization to become the trusted source AI systems prefer.'
        },
        {
          title: 'Competitive Intelligence',
          description: 'Monitor competitor visibility in AI responses and identify opportunities to capture share.'
        },
        {
          title: 'Performance Dashboard',
          description: 'Real-time metrics on AI citations, sentiment analysis, and visibility trends.'
        }
      ],
      contribution: 'Powers the Data Oracle with AI interaction patterns, citation data, and LLM behavior insights.'
    },
    {
      id: 'aeo',
      name: 'AEO Solutions',
      tagline: 'Answer Engine Optimization',
      status: 'Live',
      description: 'Own the answers. When Perplexity, Google AI Overviews, or Bing Copilot respond to queries, be the source they cite.',
      longDescription: 'Answer engines are replacing traditional search with direct, synthesized responses. AEO Solutions structures your content specifically for answer retrieval - ensuring your expertise becomes the foundation of AI-generated answers across Perplexity, AI Overviews, and conversational search interfaces.',
      metrics: [
        {value: '40%', label: 'Answer Share'},
        {value: '3x', label: 'Click-through'},
        {value: 'Schema', label: 'Optimized'},
        {value: 'Multi-LLM', label: 'Coverage'}
      ],
      features: [
        {
          title: 'Answer Schema Markup',
          description: 'Implement structured data that answer engines can easily parse and cite.'
        },
        {
          title: 'Question Targeting',
          description: 'Identify and optimize for the specific questions your audience asks AI systems.'
        },
        {
          title: 'Source Authority',
          description: 'Build the trust signals that make answer engines choose your content as the primary source.'
        },
        {
          title: 'Multi-Platform Reach',
          description: 'Optimize for Perplexity, Google AI Overviews, Bing Copilot, and emerging answer platforms.'
        }
      ],
      contribution: 'Feeds query patterns and answer structures into the Data Oracle for predictive intelligence.'
    },
    {
      id: 'data-oracle',
      name: 'LLM Data Oracle',
      tagline: 'Training Data for AI Systems',
      status: 'Coming Soon',
      description: 'The intelligence layer that makes AI systems smarter. Curated, structured commerce behavior data for the next generation of AI.',
      longDescription: 'As AI systems become central to commerce, they need high-quality training data that captures real human behavior. The LLM Data Oracle aggregates anonymized interaction patterns, purchase journeys, and decision signals - providing the structured datasets AI companies need to build models that truly understand commerce.',
      metrics: [
        {value: '100M+', label: 'Data Points'},
        {value: 'GDPR', label: 'Compliant'},
        {value: 'Real-time', label: 'Updates'},
        {value: 'API', label: 'Access'}
      ],
      features: [
        {
          title: 'Behavior Datasets',
          description: 'Rich interaction patterns from discovery to purchase, structured for LLM training.'
        },
        {
          title: 'Intent Signals',
          description: 'Labeled data showing what users want before they explicitly state it.'
        },
        {
          title: 'Privacy-First Design',
          description: 'Differential privacy, k-anonymity, and full GDPR/CCPA compliance built in.'
        },
        {
          title: 'Flexible Export',
          description: 'RESTful API for real-time access or batch exports in training-ready formats.'
        }
      ],
      contribution: 'The core data monetization layer - packaging insights from all Oraklex products for AI training.'
    },
    {
      id: 'intelligence',
      name: 'Commerce Intelligence',
      tagline: 'Predictive Analytics for AI Agents',
      status: 'Coming Soon',
      description: 'Turn data into decisions. Real-time predictions and recommendations that power AI agents and automated commerce systems.',
      longDescription: 'AI agents need more than raw data - they need actionable intelligence. Commerce Intelligence processes behavioral signals in real-time to deliver predictions, recommendations, and decision support that AI systems can act on. From inventory forecasting to personalization, we power the intelligence layer of autonomous commerce.',
      metrics: [
        {value: '95%', label: 'Accuracy'},
        {value: '<100ms', label: 'Latency'},
        {value: 'Autonomous', label: 'Operations'},
        {value: 'Scalable', label: 'Infrastructure'}
      ],
      features: [
        {
          title: 'Demand Prediction',
          description: 'Forecast demand before it materializes using behavioral leading indicators.'
        },
        {
          title: 'Agent Recommendations',
          description: 'Structured decision signals that AI agents can consume and act on autonomously.'
        },
        {
          title: 'Inventory Intelligence',
          description: 'Predictive replenishment and optimization based on real-time demand signals.'
        },
        {
          title: 'Personalization Engine',
          description: 'Context-aware recommendations that power AI-driven customer experiences.'
        }
      ],
      contribution: 'Transforms raw data into actionable intelligence for AI agents and automated systems.'
    }
  ];

  const dataFlow = [
    {
      step: '01',
      title: 'Collect',
      subtitle: 'Data Ingestion',
      description: 'Capture behavioral signals and commerce data through platform integrations.'
    },
    {
      step: '02',
      title: 'Process',
      subtitle: 'Intelligence Layer',
      description: 'Transform raw data into structured insights using proprietary processing.'
    },
    {
      step: '03',
      title: 'Predict',
      subtitle: 'AI Oracle',
      description: 'Generate predictions and decision signals for AI systems and agents.'
    },
    {
      step: '04',
      title: 'Deliver',
      subtitle: 'Real-time API',
      description: 'Serve intelligence to AI agents and automated systems via low-latency APIs.'
    }
  ];

  const getDelay = (index, base = 0) => base + index * 0.1;
</script>

<div class="solutions-content">
  <section class="data-flow-section" data-animate="flow" class:visible={visibleSections.has('flow')}>
    <div class="section-header">
      <span class="section-label">The Data Pipeline</span>
      <h2>How We Create Intelligence</h2>
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
      class:featured={solution.status === 'Live'}
      data-animate={`solution-${solutionIndex}`}
      class:visible={visibleSections.has(`solution-${solutionIndex}`)}
    >
      <div class="solution-header">
        <div class="solution-status" class:live={solution.status === 'Live'} class:soon={solution.status === 'Coming Soon'}>
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
          {:else}
            <a href="mailto:partners@oraklex.com" class="action-btn secondary">Get Early Access</a>
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
      <h2>Ready for AI-First Visibility?</h2>
      <p>
        Join forward-thinking brands already optimizing for the AI era. Start with GEO/AEO intelligence today.
      </p>
      <div class="cta-actions">
        <a href="/contact" class="action-btn primary">Start Your Strategy</a>
        <a href="mailto:partners@oraklex.com" class="action-btn secondary">Partner With Us</a>
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
    @apply mx-auto max-w-5xl px-6 py-16;
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
    @apply mx-auto max-w-5xl px-6 py-12;
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

  .solution-status.soon {
    background: rgba(var(--color-base3-rgb), 0.4);
    color: var(--color-base4);
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
    @apply px-6 py-16;
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

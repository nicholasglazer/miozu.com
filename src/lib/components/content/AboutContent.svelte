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

  const mission = {
    title: 'The Oracle for the AI Age',
    description: 'As AI transforms how businesses are discovered and decisions are made, we provide the intelligence layer that helps brands thrive.',
    points: [
      'AI is changing how customers discover businesses',
      'Traditional SEO is giving way to GEO and AEO',
      'LLMs need high-quality data to make better decisions',
      "We're building the infrastructure for this new era"
    ]
  };

  const values = [
    {
      title: 'AI-First Thinking',
      description: 'We build for how AI systems work, not how traditional search engines worked.',
      icon: 'brain'
    },
    {
      title: 'Data Integrity',
      description: 'Privacy-compliant, high-quality data that AI systems can trust and learn from.',
      icon: 'shield'
    },
    {
      title: 'Predictive Intelligence',
      description: 'Not just data collection - actionable insights that power autonomous decisions.',
      icon: 'chart'
    },
    {
      title: 'Future-Ready',
      description: 'Building infrastructure for the AI-native commerce landscape of tomorrow.',
      icon: 'rocket'
    }
  ];

  const timeline = [
    {
      phase: 'Now',
      title: 'AI Visibility Services',
      description: 'GEO and AEO optimization helping brands appear in AI-generated responses.',
      status: 'active'
    },
    {
      phase: 'Next',
      title: 'Data Oracle Platform',
      description: 'Curated commerce behavior data for LLM training and AI agent development.',
      status: 'building'
    },
    {
      phase: 'Vision',
      title: 'Autonomous Commerce Intelligence',
      description: 'Real-time predictions powering the next generation of AI agents.',
      status: 'future'
    }
  ];

  const expertise = [
    {
      area: 'Generative Engine Optimization',
      description: 'Deep understanding of how LLMs retrieve, process, and present information.',
      applications: ['Citation Analysis', 'Authority Building', 'AI Visibility Tracking']
    },
    {
      area: 'Answer Engine Optimization',
      description: 'Expertise in structuring content for answer retrieval across AI platforms.',
      applications: ['Schema Optimization', 'Question Targeting', 'Multi-Platform Reach']
    },
    {
      area: 'Commerce Data Science',
      description: 'Understanding the complete funnel from discovery to decision to purchase.',
      applications: ['Behavioral Signals', 'Intent Prediction', 'Conversion Analysis']
    },
    {
      area: 'AI Systems Integration',
      description: 'Building data pipelines that feed AI agents and automated systems.',
      applications: ['LLM Training Data', 'Agent APIs', 'Real-time Intelligence']
    }
  ];

  const partners = [
    {
      name: 'Meta',
      type: 'Platform Partner',
      description: 'Official Meta Tech Provider status for Instagram and Facebook commerce integrations.',
      contribution: 'Platform APIs and verified partnership'
    },
    {
      name: 'Shopify',
      type: 'Commerce Partner',
      description: 'Native integration for real-time inventory, pricing, and order management.',
      contribution: 'E-commerce infrastructure and attribution'
    }
  ];

  const getDelay = (index, base = 0) => base + index * 0.1;

  function getValueIcon(iconName) {
    const icons = {
      brain: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a8 8 0 0 0-8 8c0 1.892.402 3.13 1.5 4.5L12 22l6.5-7.5c1.098-1.37 1.5-2.608 1.5-4.5a8 8 0 0 0-8-8z"/><path d="M9 10h.01M15 10h.01M9 14c.5.5 1.5 1 3 1s2.5-.5 3-1"/></svg>`,
      shield: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>`,
      chart: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>`,
      rocket: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`
    };
    return icons[iconName] || '';
  }
</script>

<div class="about-content">
  <section class="mission-section" data-animate="mission" class:visible={visibleSections.has('mission')}>
    <div class="mission-content">
      <div class="mission-text">
        <span class="section-label">Our Mission</span>
        <h2>Building the Intelligence Layer for AI-Native Commerce</h2>
        <p>
          The way businesses are discovered is fundamentally changing. Users increasingly ask AI assistants instead of searching Google. LLMs synthesize answers instead of listing links.
        </p>
        <p>
          Oraklex exists at this intersection. We help businesses optimize for AI visibility today while building the data products that will power tomorrow's intelligent commerce systems.
        </p>
      </div>
      <div class="mission-points">
        {#each mission.points as point, i}
          <div class="mission-point" style={`--delay: ${getDelay(i, 0.1)}s`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14m-7-7l7 7-7 7"/>
            </svg>
            <span>{point}</span>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <section class="values-section" data-animate="values" class:visible={visibleSections.has('values')}>
    <div class="section-header">
      <span class="section-label">Our Principles</span>
      <h2>How We Think About AI & Data</h2>
    </div>

    <div class="values-grid">
      {#each values as value, i}
        <article
          class="value-card"
          data-animate={`value-${i}`}
          class:visible={visibleSections.has(`value-${i}`)}
          style={`--delay: ${getDelay(i)}s`}
          in:fade={{duration: 400, delay: i * 80}}
        >
          <div class="value-icon">
            {@html getValueIcon(value.icon)}
          </div>
          <h3>{value.title}</h3>
          <p>{value.description}</p>
        </article>
      {/each}
    </div>
  </section>

  <section class="timeline-section" data-animate="timeline" class:visible={visibleSections.has('timeline')}>
    <div class="section-header">
      <span class="section-label">The Journey</span>
      <h2>Where We're Going</h2>
    </div>

    <div class="timeline">
      {#each timeline as phase, i}
        <article
          class="timeline-card"
          class:active={phase.status === 'active'}
          data-animate={`timeline-${i}`}
          class:visible={visibleSections.has(`timeline-${i}`)}
          style={`--delay: ${getDelay(i, 0.1)}s`}
        >
          <div class="timeline-phase" class:active={phase.status === 'active'} class:building={phase.status === 'building'}>
            {phase.phase}
          </div>
          <h3>{phase.title}</h3>
          <p>{phase.description}</p>
        </article>
      {/each}
    </div>
  </section>

  <section class="expertise-section" data-animate="expertise" class:visible={visibleSections.has('expertise')}>
    <div class="section-header">
      <span class="section-label">Core Expertise</span>
      <h2>What We Know Best</h2>
    </div>

    <div class="expertise-grid">
      {#each expertise as area, i}
        <article
          class="expertise-card"
          data-animate={`expertise-${i}`}
          class:visible={visibleSections.has(`expertise-${i}`)}
          style={`--delay: ${getDelay(i, 0.2)}s`}
          in:fade={{duration: 400, delay: i * 80}}
        >
          <h3>{area.area}</h3>
          <p>{area.description}</p>
          <ul class="applications-list">
            {#each area.applications as app}
              <li>{app}</li>
            {/each}
          </ul>
        </article>
      {/each}
    </div>
  </section>

  <section class="partners-section" data-animate="partners" class:visible={visibleSections.has('partners')}>
    <div class="section-header">
      <span class="section-label">Strategic Partners</span>
      <h2>Building Together</h2>
    </div>

    <div class="partners-grid">
      {#each partners as partner, i}
        <article
          class="partner-card"
          data-animate={`partner-${i}`}
          class:visible={visibleSections.has(`partner-${i}`)}
          style={`--delay: ${getDelay(i, 0.15)}s`}
          in:fade={{duration: 400, delay: i * 80}}
        >
          <div class="partner-header">
            <h3>{partner.name}</h3>
            <span class="partner-type">{partner.type}</span>
          </div>
          <p class="partner-description">{partner.description}</p>
          <div class="partner-contribution">
            <strong>Contribution:</strong> {partner.contribution}
          </div>
        </article>
      {/each}
    </div>
  </section>

  <section class="cta-section" data-animate="cta" class:visible={visibleSections.has('cta')}>
    <div class="cta-content">
      <h2>Ready to Work Together?</h2>
      <p>
        Whether you need AI visibility optimization today or want to explore data partnerships - let's talk.
      </p>
      <div class="cta-actions">
        <Button variant="primary" href="/contact">Get in Touch</Button>
        <Button variant="secondary" href="/solutions">Explore Solutions</Button>
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
    @apply mx-auto mb-8 max-w-3xl text-center;
  }

  .section-label {
    @apply text-xs font-semibold uppercase tracking-[0.25em] text-base4;
  }

  .section-header h2 {
    @apply mt-2 text-2xl font-semibold text-base6 md:text-3xl;
    letter-spacing: -0.02em;
  }

  /* Mission Section */
  .mission-section {
    @apply mx-auto max-w-6xl px-8 py-12;
    opacity: 0;
    transform: translateY(24px);
    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .mission-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .mission-content {
    @apply grid gap-8 md:grid-cols-2 items-center;
  }

  .mission-text {
    @apply flex flex-col gap-3;
  }

  .mission-text h2 {
    @apply text-2xl font-semibold text-base6 mt-1;
    letter-spacing: -0.02em;
  }

  .mission-text p {
    @apply text-sm text-base4 leading-relaxed;
  }

  .mission-points {
    @apply flex flex-col gap-3 p-5 rounded-2xl bg-base1 border border-base3;
  }

  .mission-point {
    @apply flex items-center gap-2.5 text-sm text-base5;
    opacity: 0;
    transform: translateX(-8px);
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: var(--delay, 0s);
  }

  .mission-section.visible .mission-point {
    opacity: 1;
    transform: translateX(0);
  }

  .mission-point svg {
    @apply flex-shrink-0 text-base6;
  }

  /* Values Section */
  .values-section {
    @apply mx-auto max-w-6xl px-8 py-12;
    opacity: 0;
    transform: translateY(24px);
    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .values-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .values-grid {
    @apply grid gap-4 md:grid-cols-2 lg:grid-cols-4;
  }

  .value-card {
    @apply flex flex-col gap-2 rounded-2xl border border-base3 bg-base0 p-5 text-center;
    opacity: 0;
    transform: translateY(16px);
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: var(--delay, 0s);
  }

  .value-card.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .value-icon {
    @apply mx-auto w-12 h-12 rounded-xl flex items-center justify-center bg-base2 text-base6;
  }

  .value-card h3 {
    @apply text-sm font-semibold text-base6;
  }

  .value-card p {
    @apply text-xs text-base4;
  }

  /* Timeline Section */
  .timeline-section {
    @apply mx-auto max-w-6xl px-8 py-12;
    opacity: 0;
    transform: translateY(24px);
    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .timeline-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .timeline {
    @apply flex flex-col md:flex-row gap-4 justify-center;
  }

  .timeline-card {
    @apply flex-1 flex flex-col gap-2 rounded-2xl border border-base3 bg-base0 p-5;
    max-width: 280px;
    opacity: 0;
    transform: translateY(16px);
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: var(--delay, 0s);
  }

  .timeline-card.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .timeline-card.active {
    @apply border-base6 bg-base1;
  }

  .timeline-phase {
    @apply inline-block self-start px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider;
    @apply bg-base2 text-base4;
  }

  .timeline-phase.active {
    @apply bg-base6 text-base0;
  }

  .timeline-phase.building {
    @apply bg-base2 text-base5;
  }

  .timeline-card h3 {
    @apply text-base font-semibold text-base6;
  }

  .timeline-card p {
    @apply text-xs text-base4;
  }

  /* Expertise Section */
  .expertise-section {
    @apply mx-auto max-w-6xl px-8 py-12;
    opacity: 0;
    transform: translateY(24px);
    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .expertise-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .expertise-grid {
    @apply grid gap-4 md:grid-cols-2;
  }

  .expertise-card {
    @apply flex flex-col gap-2 rounded-2xl border border-base3 bg-base0 p-5;
    opacity: 0;
    transform: translateY(16px);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: var(--delay, 0s);
  }

  .expertise-card.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .expertise-card h3 {
    @apply text-base font-semibold text-base6;
  }

  .expertise-card p {
    @apply text-xs text-base4;
  }

  .applications-list {
    @apply flex flex-col gap-0.5 mt-1;
  }

  .applications-list li {
    @apply text-xs text-base5 pl-3 relative;
  }

  .applications-list li::before {
    content: '\2192';
    @apply absolute left-0 text-base4;
  }

  /* Partners Section */
  .partners-section {
    @apply mx-auto max-w-6xl px-8 py-12;
    opacity: 0;
    transform: translateY(24px);
    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .partners-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .partners-grid {
    @apply grid gap-4 md:grid-cols-2 max-w-2xl mx-auto;
  }

  .partner-card {
    @apply flex flex-col gap-3 rounded-2xl border border-base3 bg-base0 p-5;
    opacity: 0;
    transform: translateY(16px);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: var(--delay, 0s);
  }

  .partner-card.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .partner-header {
    @apply flex items-center justify-between;
  }

  .partner-header h3 {
    @apply text-base font-semibold text-base6;
  }

  .partner-type {
    @apply text-[10px] font-semibold uppercase tracking-wider text-base4;
  }

  .partner-description {
    @apply text-xs text-base4;
  }

  .partner-contribution {
    @apply text-xs text-base5 mt-auto pt-3 border-t border-base2;
  }

  .partner-contribution strong {
    @apply text-base6;
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
    @apply mx-auto max-w-3xl flex flex-col items-center gap-4 rounded-3xl border border-base3 bg-base0 px-8 py-10 text-center;
  }

  .cta-content h2 {
    @apply text-2xl font-semibold text-base6 md:text-3xl;
    letter-spacing: -0.02em;
  }

  .cta-content p {
    @apply max-w-xl text-base text-base4;
  }

  .cta-actions {
    @apply flex flex-wrap justify-center gap-3 mt-2;
  }

  @media (max-width: 768px) {
    .mission-section,
    .values-section,
    .timeline-section,
    .expertise-section,
    .partners-section,
    .cta-section {
      @apply px-5 py-8;
    }

    .mission-content {
      @apply grid-cols-1;
    }

    .values-grid {
      @apply grid-cols-1;
    }

    .timeline {
      @apply flex-col items-center;
    }

    .timeline-card {
      @apply max-w-full;
    }

    .expertise-grid,
    .partners-grid {
      @apply grid-cols-1;
    }

    .cta-content {
      @apply px-5 py-8;
    }
  }
</style>

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

  const getDelay = (index, base = 0) => base + index * 0.1;
</script>

<div class="insights-content">
  <!-- Hero Section -->
  <section class="hero-section" data-animate="hero" class:visible={visibleSections.has('hero')}>
    <div class="section-header">
      <span class="section-label">Research</span>
      <h2>Commerce Data Insights</h2>
      <p class="lead">Analysis and methodology from Oraklex's behavioral data platform.</p>
    </div>

    <div class="coming-card">
      <div class="coming-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      </div>
      <h3>Research Publications</h3>
      <p>
        We are preparing our first public research report based on aggregated behavioral data
        from the J'ko AI platform. This will include analysis of commerce patterns,
        demand signals, and methodology documentation.
      </p>
      <div class="coming-timeline">
        <span class="timeline-label">Expected</span>
        <span class="timeline-value">Q1 2025</span>
      </div>
    </div>
  </section>

  <!-- Data Coverage Section -->
  <section class="coverage-section" data-animate="coverage" class:visible={visibleSections.has('coverage')}>
    <div class="section-header">
      <span class="section-label">Coverage</span>
      <h2>Data Coverage</h2>
      <p class="section-desc">Our research is based on behavioral events from production commerce applications.</p>
    </div>

    <div class="coverage-grid">
      <div class="coverage-item" data-animate="coverage-0" class:visible={visibleSections.has('coverage-0')} style="--delay: 0s">
        <h3>Event Types</h3>
        <ul>
          <li>Virtual try-on interactions</li>
          <li>Style preference signals</li>
          <li>Purchase intent indicators</li>
          <li>Conversion events</li>
        </ul>
      </div>

      <div class="coverage-item" data-animate="coverage-1" class:visible={visibleSections.has('coverage-1')} style="--delay: 0.1s">
        <h3>Data Characteristics</h3>
        <ul>
          <li>First-party generation</li>
          <li>Intent-labeled events</li>
          <li>GDPR/CCPA compliant</li>
          <li>Production-grade quality</li>
        </ul>
      </div>

      <div class="coverage-item" data-animate="coverage-2" class:visible={visibleSections.has('coverage-2')} style="--delay: 0.2s">
        <h3>Verticals</h3>
        <ul>
          <li>Fashion e-commerce</li>
          <li>Apparel retail</li>
          <li>Style discovery</li>
          <li>Size & fit</li>
        </ul>
      </div>
    </div>
  </section>

  <!-- Methodology Section -->
  <section class="methodology-section" data-animate="methodology" class:visible={visibleSections.has('methodology')}>
    <div class="section-header">
      <span class="section-label">Process</span>
      <h2>Methodology</h2>
      <p class="section-desc">How we collect, process, and analyze behavioral data.</p>
    </div>

    <div class="methodology-steps">
      <div class="method-step" data-animate="method-0" class:visible={visibleSections.has('method-0')} style="--delay: 0s">
        <span class="step-num">01</span>
        <h3>Collection</h3>
        <p>Events captured from J'ko AI virtual try-on interactions with user consent.</p>
      </div>
      <div class="method-step" data-animate="method-1" class:visible={visibleSections.has('method-1')} style="--delay: 0.1s">
        <span class="step-num">02</span>
        <h3>Processing</h3>
        <p>Anonymization, deduplication, and quality filtering applied to raw events.</p>
      </div>
      <div class="method-step" data-animate="method-2" class:visible={visibleSections.has('method-2')} style="--delay: 0.2s">
        <span class="step-num">03</span>
        <h3>Labeling</h3>
        <p>Intent classification and outcome attribution added to structured events.</p>
      </div>
      <div class="method-step" data-animate="method-3" class:visible={visibleSections.has('method-3')} style="--delay: 0.3s">
        <span class="step-num">04</span>
        <h3>Analysis</h3>
        <p>Aggregated statistics computed with differential privacy guarantees.</p>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="cta-section" data-animate="cta" class:visible={visibleSections.has('cta')}>
    <div class="cta-content">
      <h2>Request Research Access</h2>
      <p>For enterprise partners interested in early access to research publications and custom analysis.</p>
      <div class="cta-actions">
        <Button variant="primary" href="/contact">Contact Us</Button>
        <Button variant="secondary" href="/data">View Data Schema</Button>
      </div>
    </div>
  </section>
</div>

<style lang="postcss">
  @reference '$theme';

  .insights-content {
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

  .lead {
    @apply mt-3 text-base text-base5 leading-relaxed;
  }

  .section-desc {
    @apply mt-2 text-sm text-base4;
  }

  /* Hero Section */
  .hero-section {
    @apply mx-auto max-w-6xl px-8 py-12;
    opacity: 0;
    transform: translateY(24px);
    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .hero-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .coming-card {
    @apply p-8 rounded-xl border border-base3 bg-base1 text-center;
  }

  .coming-icon {
    @apply w-16 h-16 mx-auto mb-4 rounded-xl bg-base2 flex items-center justify-center text-base14;
  }

  .coming-card h3 {
    @apply text-xl font-semibold text-base6 mb-3;
  }

  .coming-card p {
    @apply text-sm text-base4 max-w-lg mx-auto leading-relaxed;
  }

  .coming-timeline {
    @apply mt-6 inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-base2;
  }

  .timeline-label {
    @apply text-xs text-base4;
  }

  .timeline-value {
    @apply text-sm font-medium text-base6;
  }

  /* Coverage Section */
  .coverage-section {
    @apply mx-auto max-w-6xl px-8 py-12;
    opacity: 0;
    transform: translateY(24px);
    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .coverage-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .coverage-grid {
    @apply grid gap-4 md:grid-cols-3;
  }

  .coverage-item {
    @apply p-5 rounded-xl border border-base3 bg-base0;
    opacity: 0;
    transform: translateY(16px);
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: var(--delay, 0s);
  }

  .coverage-item.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .coverage-item h3 {
    @apply text-sm font-semibold text-base6 mb-3;
  }

  .coverage-item ul {
    @apply space-y-2;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .coverage-item li {
    @apply text-xs text-base4 pl-4 relative;
  }

  .coverage-item li::before {
    content: '';
    @apply absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-base14/50;
  }

  /* Methodology Section */
  .methodology-section {
    @apply mx-auto max-w-6xl px-8 py-12;
    opacity: 0;
    transform: translateY(24px);
    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .methodology-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .methodology-steps {
    @apply grid gap-4 md:grid-cols-2;
  }

  .method-step {
    @apply p-5 rounded-xl border border-base3 bg-base0;
    opacity: 0;
    transform: translateY(16px);
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: var(--delay, 0s);
  }

  .method-step.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .step-num {
    @apply text-lg font-bold text-base14 mb-2 block;
  }

  .method-step h3 {
    @apply text-sm font-semibold text-base6 mb-2;
  }

  .method-step p {
    @apply text-xs text-base4 leading-relaxed;
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
    .hero-section,
    .coverage-section,
    .methodology-section,
    .cta-section {
      @apply px-5 py-8;
    }

    .coming-card {
      @apply p-6;
    }

    .coverage-grid,
    .methodology-steps {
      @apply grid-cols-1;
    }

    .cta-content {
      @apply px-5 py-8;
    }
  }
</style>

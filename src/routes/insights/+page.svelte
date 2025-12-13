<script lang="ts">
  import { page } from '$app/stores';
  import Footer from '$lib/features/layout/Footer.svelte';
  import Metadata from '$features/seo/Metadata.svelte';
  import { onMount } from 'svelte';

  let theme = $derived($page.data?.theme);
  let mounted = $state(false);

  onMount(() => {
    mounted = true;
  });
</script>

<Metadata
  title="Research - Oraklex | Commerce Behavioral Data Analysis"
  description="Research and analysis from Oraklex's commerce behavioral data platform. Insights on shopping behavior, demand patterns, and AI training data methodology."
/>

<div class="app-container insights-page">
  <div class="insights-content" class:mounted>
    <!-- Header -->
    <header class="page-header">
      <a href="/" class="back-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5m7-7l-7 7 7 7"/>
        </svg>
        Back
      </a>
      <span class="page-label">Research</span>
      <h1>Commerce Data Insights</h1>
      <p class="page-desc">
        Analysis and methodology from Oraklex's behavioral data platform
      </p>
    </header>

    <!-- Coming Soon Section -->
    <section class="coming-section">
      <div class="coming-card">
        <div class="coming-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <h2>Research Publications</h2>
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
    <section class="coverage-section">
      <h2>Data Coverage</h2>
      <p class="section-desc">
        Our research is based on behavioral events from production commerce applications.
      </p>

      <div class="coverage-grid">
        <div class="coverage-item">
          <h3>Event Types</h3>
          <ul>
            <li>Virtual try-on interactions</li>
            <li>Style preference signals</li>
            <li>Purchase intent indicators</li>
            <li>Conversion events</li>
          </ul>
        </div>

        <div class="coverage-item">
          <h3>Data Characteristics</h3>
          <ul>
            <li>First-party generation</li>
            <li>Intent-labeled events</li>
            <li>GDPR/CCPA compliant</li>
            <li>Production-grade quality</li>
          </ul>
        </div>

        <div class="coverage-item">
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
    <section class="methodology-section">
      <h2>Methodology</h2>
      <p class="section-desc">
        How we collect, process, and analyze behavioral data.
      </p>

      <div class="methodology-steps">
        <div class="method-step">
          <span class="step-num">01</span>
          <h3>Collection</h3>
          <p>Events captured from J'ko AI virtual try-on interactions with user consent.</p>
        </div>
        <div class="method-step">
          <span class="step-num">02</span>
          <h3>Processing</h3>
          <p>Anonymization, deduplication, and quality filtering applied to raw events.</p>
        </div>
        <div class="method-step">
          <span class="step-num">03</span>
          <h3>Labeling</h3>
          <p>Intent classification and outcome attribution added to structured events.</p>
        </div>
        <div class="method-step">
          <span class="step-num">04</span>
          <h3>Analysis</h3>
          <p>Aggregated statistics computed with differential privacy guarantees.</p>
        </div>
      </div>
    </section>

    <!-- Access Section -->
    <section class="access-section">
      <div class="access-card">
        <h2>Request Research Access</h2>
        <p>
          For enterprise partners interested in early access to research publications
          and custom analysis.
        </p>
        <div class="access-actions">
          <a href="/contact" class="access-btn primary">Contact Us</a>
          <a href="/data" class="access-btn secondary">View Data Schema</a>
        </div>
      </div>
    </section>
  </div>

  <Footer {theme} />
</div>

<style lang="postcss">
  @reference '$theme';

  .insights-page {
    @apply min-h-screen bg-base0;
  }

  .insights-content {
    @apply max-w-4xl mx-auto px-6 py-12;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .insights-content.mounted {
    opacity: 1;
    transform: translateY(0);
  }

  /* Header */
  .page-header {
    @apply mb-12;
  }

  .back-link {
    @apply inline-flex items-center gap-1.5 text-sm text-base4 no-underline mb-6;
    @apply hover:text-base6 transition-colors;
  }

  .page-label {
    @apply block text-xs font-semibold uppercase tracking-[0.2em] text-base4 mb-2;
  }

  .page-header h1 {
    @apply text-3xl font-semibold text-base6 mb-3;
    letter-spacing: -0.02em;
  }

  .page-desc {
    @apply text-base text-base4 max-w-xl;
  }

  /* Coming Section */
  .coming-section {
    @apply mb-12;
  }

  .coming-card {
    @apply p-8 rounded-xl border border-base3 bg-base1 text-center;
  }

  .coming-icon {
    @apply w-16 h-16 mx-auto mb-4 rounded-xl bg-base2 flex items-center justify-center text-base14;
  }

  .coming-card h2 {
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
    @apply mb-12;
  }

  .coverage-section h2 {
    @apply text-lg font-semibold text-base6 mb-2;
  }

  .section-desc {
    @apply text-sm text-base4 mb-6;
  }

  .coverage-grid {
    @apply grid gap-4 md:grid-cols-3;
  }

  .coverage-item {
    @apply p-5 rounded-xl border border-base3 bg-base0;
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
    @apply mb-12;
  }

  .methodology-section h2 {
    @apply text-lg font-semibold text-base6 mb-2;
  }

  .methodology-steps {
    @apply grid gap-4 md:grid-cols-2;
  }

  .method-step {
    @apply p-5 rounded-xl border border-base3 bg-base0;
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

  /* Access Section */
  .access-section {
    @apply mb-12;
  }

  .access-card {
    @apply p-8 rounded-xl bg-base1 border border-base3 text-center;
  }

  .access-card h2 {
    @apply text-lg font-semibold text-base6 mb-2;
  }

  .access-card p {
    @apply text-sm text-base4 max-w-md mx-auto mb-6;
  }

  .access-actions {
    @apply flex flex-wrap justify-center gap-3;
  }

  .access-btn {
    @apply inline-flex items-center justify-center px-6 py-2.5 rounded-lg text-sm font-medium no-underline;
    @apply transition-all duration-200;
  }

  .access-btn.primary {
    @apply bg-base14 text-base0;
  }

  .access-btn.primary:hover {
    filter: brightness(1.1);
  }

  .access-btn.secondary {
    @apply bg-transparent text-base6 border border-base3;
  }

  .access-btn.secondary:hover {
    @apply bg-base2;
  }

  @media (max-width: 768px) {
    .insights-content {
      @apply px-4 py-8;
    }

    .page-header h1 {
      @apply text-2xl;
    }

    .coming-card {
      @apply p-6;
    }

    .coverage-grid,
    .methodology-steps {
      @apply grid-cols-1;
    }

    .access-card {
      @apply p-6;
    }

    .access-actions {
      @apply flex-col;
    }

    .access-btn {
      @apply w-full;
    }
  }
</style>

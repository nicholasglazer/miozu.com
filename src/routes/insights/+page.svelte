<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Footer from '$lib/features/layout/Footer.svelte';
  import Metadata from '$features/seo/Metadata.svelte';
  import { onMount } from 'svelte';

  let theme = $derived($page.data?.theme);
  let mounted = $state(false);

  // Email capture state
  let email = $state('');
  let submitting = $state(false);
  let submitted = $state(false);
  let error = $state('');

  const API_ENDPOINT = 'https://api.jko.ai/api/contact';

  async function handleSubscribe(e: Event) {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      error = 'Please enter a valid email';
      return;
    }

    submitting = true;
    error = '';

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Report Subscriber',
          email: email,
          message: 'Subscribed to Fashion Commerce Behavior Report 2025',
          source: 'oraklex.com/insights'
        })
      });

      if (response.ok) {
        submitted = true;
      } else {
        throw new Error('Failed to subscribe');
      }
    } catch (err) {
      error = 'Something went wrong. Please try again.';
    } finally {
      submitting = false;
    }
  }

  onMount(() => {
    mounted = true;
  });

  const reportHighlights = [
    { stat: '10M+', label: 'Monthly behavioral events analyzed' },
    { stat: '500K+', label: 'Unique shopping sessions' },
    { stat: '47', label: 'Data points per interaction' },
    { stat: '94%', label: 'Prediction accuracy on held-out data' }
  ];

  const reportSections = [
    {
      title: 'Virtual Try-On Behavior Patterns',
      points: ['Session duration by device type', 'Try-on to cart conversion funnels', 'Multi-item exploration patterns']
    },
    {
      title: 'Size & Fit Intelligence',
      points: ['Size uncertainty signals', 'Return prediction indicators', 'Fit preference clustering']
    },
    {
      title: 'Style Preference Signals',
      points: ['Seasonal trend emergence', 'Color and pattern affinity', 'Cross-category preferences']
    },
    {
      title: 'Conversion Predictors',
      points: ['High-intent behavioral markers', '7-day purchase probability signals', 'Abandonment risk factors']
    }
  ];
</script>

<Metadata
  title="Insights - Oraklex | Commerce Intelligence Research"
  description="Data-driven insights from 10M+ monthly commerce interactions. Research reports, behavioral analysis, and trend intelligence for AI companies and retailers."
/>

<div class="insights-page">
  <header class="page-header">
    <div class="header-inner">
      <a href="/" class="logo">Oraklex</a>
      <nav class="header-nav">
        <a href="/solutions" class="nav-link">Platform</a>
        <a href="/about" class="nav-link">About</a>
        <a href="/contact" class="nav-link">Contact</a>
      </nav>
    </div>
  </header>

  <main class="page-content">
    <!-- Hero Section -->
    <section class="hero-section" class:visible={mounted}>
      <div class="hero-badge">Flagship Report</div>
      <h1>The 2025 Fashion Commerce Behavior Report</h1>
      <p class="hero-subtitle">
        What 10 million shopping interactions reveal about how people actually buy fashion online.
        First-party behavioral data. No surveys. No scraped data. Real signals from real shoppers.
      </p>
    </section>

    <!-- Stats Bar -->
    <section class="stats-section" class:visible={mounted}>
      <div class="stats-grid">
        {#each reportHighlights as item}
          <div class="stat-card">
            <span class="stat-value">{item.stat}</span>
            <span class="stat-label">{item.label}</span>
          </div>
        {/each}
      </div>
    </section>

    <!-- Main Content -->
    <div class="content-grid">
      <!-- Report Preview -->
      <section class="report-preview">
        <h2>What's Inside</h2>
        <p class="preview-intro">
          Most e-commerce analytics tell you what happened. This report tells you why—and what happens next.
          Built on behavioral data from J'ko AI, our virtual try-on platform used by fashion brands globally.
        </p>

        <div class="sections-grid">
          {#each reportSections as section, i}
            <div class="section-card" style="--delay: {i * 0.1}s">
              <h3>{section.title}</h3>
              <ul>
                {#each section.points as point}
                  <li>{point}</li>
                {/each}
              </ul>
            </div>
          {/each}
        </div>

        <div class="data-source">
          <div class="source-badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
            <span>First-Party Data</span>
          </div>
          <p>
            All insights derived from anonymized behavioral data collected through
            <a href="https://jko.ai" target="_blank" rel="noopener">J'ko AI</a>,
            a virtual try-on platform owned and operated by
            <a href="https://upgo.ca" target="_blank" rel="noopener">Up Go Corp</a>.
            GDPR and CCPA compliant.
          </p>
        </div>
      </section>

      <!-- Signup Sidebar -->
      <aside class="signup-sidebar">
        <div class="signup-card">
          <div class="card-badge">Coming Q1 2025</div>
          <h3>Get Early Access</h3>
          <p>Be the first to receive the full report when it launches. Plus exclusive previews and data insights.</p>

          {#if submitted}
            <div class="success-message">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <path d="M22 4L12 14.01l-3-3"/>
              </svg>
              <span>You're on the list. We'll be in touch.</span>
            </div>
          {:else}
            <form onsubmit={handleSubscribe} class="signup-form">
              <input
                type="email"
                bind:value={email}
                placeholder="your@email.com"
                disabled={submitting}
              />
              <button type="submit" disabled={submitting}>
                {submitting ? 'Subscribing...' : 'Get Early Access'}
              </button>
              {#if error}
                <p class="error-text">{error}</p>
              {/if}
            </form>
          {/if}

          <p class="privacy-note">No spam. Unsubscribe anytime.</p>
        </div>

        <div class="use-cases-card">
          <h4>Who This Is For</h4>
          <ul>
            <li>
              <strong>AI/ML Teams</strong>
              <span>Training data benchmarks and behavioral signals</span>
            </li>
            <li>
              <strong>Retail Analytics</strong>
              <span>Conversion optimization and demand patterns</span>
            </li>
            <li>
              <strong>Product Teams</strong>
              <span>User behavior insights for e-commerce features</span>
            </li>
            <li>
              <strong>Investors</strong>
              <span>Market intelligence on commerce AI trends</span>
            </li>
          </ul>
        </div>

        <div class="cta-card">
          <h4>Need Custom Data?</h4>
          <p>Enterprise data licensing, API access, and custom analysis available.</p>
          <a href="/contact" class="cta-link">Talk to Us →</a>
        </div>
      </aside>
    </div>

    <!-- Methodology Section -->
    <section class="methodology-section">
      <h2>Methodology</h2>
      <div class="methodology-grid">
        <div class="method-card">
          <div class="method-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M9 9h6v6H9z"/>
            </svg>
          </div>
          <h3>Data Collection</h3>
          <p>Behavioral events captured through J'ko AI's virtual try-on technology, embedded on partner retail sites.</p>
        </div>
        <div class="method-card">
          <div class="method-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h3>Processing</h3>
          <p>Anonymization, aggregation, and differential privacy applied before any analysis. No PII retained.</p>
        </div>
        <div class="method-card">
          <div class="method-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M3 3v18h18"/>
              <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
            </svg>
          </div>
          <h3>Analysis</h3>
          <p>Statistical analysis and ML models applied to identify patterns, benchmarks, and predictive signals.</p>
        </div>
      </div>
    </section>
  </main>

  <div class="footer-wrapper app-container">
    <Footer {theme} />
  </div>
</div>

<style lang="postcss">
  @reference '$theme';

  .insights-page {
    min-height: 100vh;
    @apply bg-base0;
  }

  .page-header {
    @apply sticky top-0 z-50 bg-base0/95 backdrop-blur-sm border-b border-base2;
  }

  .header-inner {
    @apply max-w-6xl mx-auto px-6 py-4 flex items-center justify-between;
  }

  .logo {
    @apply text-lg font-semibold text-base6 no-underline;
  }

  .header-nav {
    @apply flex items-center gap-6;
  }

  .nav-link {
    @apply text-sm text-base4 hover:text-base6 no-underline transition-colors;
  }

  .page-content {
    @apply max-w-6xl mx-auto px-6 py-12;
  }

  /* Hero */
  .hero-section {
    @apply text-center mb-12;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s ease;
  }

  .hero-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .hero-badge {
    @apply inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4;
    background: linear-gradient(135deg, #4a9eff, #6366f1);
    color: white;
  }

  .hero-section h1 {
    @apply text-4xl md:text-5xl font-bold text-base6 mb-4;
    letter-spacing: -0.03em;
  }

  .hero-subtitle {
    @apply text-lg text-base4 max-w-2xl mx-auto leading-relaxed;
  }

  /* Stats */
  .stats-section {
    @apply mb-12;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s ease 0.1s;
  }

  .stats-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .stats-grid {
    @apply grid grid-cols-2 md:grid-cols-4 gap-4;
  }

  .stat-card {
    @apply flex flex-col items-center p-6 rounded-2xl bg-base1 border border-base2 text-center;
  }

  .stat-value {
    @apply text-3xl font-bold text-base6;
    letter-spacing: -0.02em;
  }

  .stat-label {
    @apply text-xs text-base4 mt-1;
  }

  /* Content Grid */
  .content-grid {
    @apply grid gap-8 lg:grid-cols-3;
  }

  .report-preview {
    @apply lg:col-span-2;
  }

  .report-preview h2 {
    @apply text-2xl font-semibold text-base6 mb-4;
  }

  .preview-intro {
    @apply text-base text-base4 leading-relaxed mb-8;
  }

  .sections-grid {
    @apply grid gap-4 sm:grid-cols-2 mb-8;
  }

  .section-card {
    @apply p-5 rounded-xl bg-base1 border border-base2;
    opacity: 0;
    transform: translateY(10px);
    animation: fadeIn 0.5s ease forwards;
    animation-delay: var(--delay);
  }

  @keyframes fadeIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .section-card h3 {
    @apply text-sm font-semibold text-base6 mb-3;
  }

  .section-card ul {
    @apply space-y-2;
  }

  .section-card li {
    @apply text-xs text-base4 pl-4 relative;
  }

  .section-card li::before {
    content: '→';
    @apply absolute left-0 text-base14;
  }

  .data-source {
    @apply p-5 rounded-xl bg-gradient-to-br from-green-50 to-base0 border border-green-200;
  }

  .source-badge {
    @apply flex items-center gap-2 text-sm font-semibold text-green-700 mb-2;
  }

  .data-source p {
    @apply text-sm text-base4;
  }

  .data-source a {
    @apply text-base14 hover:underline;
  }

  /* Sidebar */
  .signup-sidebar {
    @apply space-y-6;
  }

  .signup-card {
    @apply p-6 rounded-2xl border-2 border-base14/20 bg-gradient-to-br from-base14/5 to-base0;
  }

  .card-badge {
    @apply inline-block px-3 py-1 rounded-full text-xs font-semibold bg-base14 text-white mb-4;
  }

  .signup-card h3 {
    @apply text-lg font-semibold text-base6 mb-2;
  }

  .signup-card > p {
    @apply text-sm text-base4 mb-4;
  }

  .signup-form {
    @apply space-y-3;
  }

  .signup-form input {
    @apply w-full px-4 py-3 rounded-lg bg-white border border-base3 text-base6;
    @apply focus:outline-none focus:border-base14 focus:ring-2 focus:ring-base14/20;
  }

  .signup-form button {
    @apply w-full px-4 py-3 rounded-lg bg-base14 text-white font-semibold;
    @apply hover:bg-base6 transition-colors disabled:opacity-50;
  }

  .error-text {
    @apply text-xs text-red-500;
  }

  .privacy-note {
    @apply text-xs text-base4 text-center mt-3;
  }

  .success-message {
    @apply flex items-center gap-3 p-4 rounded-lg bg-green-50 text-green-700;
  }

  .success-message span {
    @apply text-sm font-medium;
  }

  .use-cases-card {
    @apply p-5 rounded-xl bg-base1 border border-base2;
  }

  .use-cases-card h4 {
    @apply text-sm font-semibold text-base6 mb-4;
  }

  .use-cases-card ul {
    @apply space-y-3;
  }

  .use-cases-card li {
    @apply flex flex-col;
  }

  .use-cases-card li strong {
    @apply text-sm text-base6;
  }

  .use-cases-card li span {
    @apply text-xs text-base4;
  }

  .cta-card {
    @apply p-5 rounded-xl bg-base6 text-white;
  }

  .cta-card h4 {
    @apply text-sm font-semibold mb-2;
  }

  .cta-card p {
    @apply text-sm opacity-80 mb-3;
  }

  .cta-link {
    @apply text-sm font-semibold text-white hover:opacity-80 no-underline;
  }

  /* Methodology */
  .methodology-section {
    @apply mt-16 pt-12 border-t border-base2;
  }

  .methodology-section h2 {
    @apply text-2xl font-semibold text-base6 mb-8 text-center;
  }

  .methodology-grid {
    @apply grid gap-6 md:grid-cols-3;
  }

  .method-card {
    @apply p-6 rounded-xl bg-base1 border border-base2 text-center;
  }

  .method-icon {
    @apply w-12 h-12 mx-auto mb-4 rounded-xl bg-base2 flex items-center justify-center text-base6;
  }

  .method-card h3 {
    @apply text-base font-semibold text-base6 mb-2;
  }

  .method-card p {
    @apply text-sm text-base4;
  }

  .footer-wrapper {
    @apply mt-16;
  }

  @media (max-width: 768px) {
    .hero-section h1 {
      @apply text-3xl;
    }

    .content-grid {
      @apply grid-cols-1;
    }

    .sections-grid {
      @apply grid-cols-1;
    }
  }
</style>

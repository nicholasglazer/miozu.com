<script lang="ts">
  import { page } from '$app/stores';
  import Footer from '$lib/features/layout/Footer.svelte';
  import Metadata from '$features/seo/Metadata.svelte';
  import { onMount } from 'svelte';

  let theme = $derived($page.data?.theme);
  let mounted = $state(false);
  let activeTab = $state('events');

  onMount(() => {
    mounted = true;
  });

  const dataCategories = [
    {
      id: 'events',
      name: 'Behavioral Events',
      description: 'Core interaction events from virtual try-on sessions',
      count: '10M+/month',
      fields: [
        { name: 'event_id', type: 'uuid', description: 'Unique event identifier' },
        { name: 'event_type', type: 'enum', description: 'try_on_start, try_on_complete, size_select, color_change, add_to_cart, purchase' },
        { name: 'session_id', type: 'uuid', description: 'Groups events within a shopping session' },
        { name: 'timestamp', type: 'datetime', description: 'UTC timestamp with millisecond precision' },
        { name: 'product_id', type: 'string', description: 'SKU or product identifier' },
        { name: 'category', type: 'string', description: 'Product category (tops, bottoms, dresses, etc.)' },
        { name: 'duration_ms', type: 'integer', description: 'Time spent on this event in milliseconds' },
        { name: 'device_type', type: 'enum', description: 'mobile, tablet, desktop' },
        { name: 'viewport_width', type: 'integer', description: 'Screen width in pixels' }
      ]
    },
    {
      id: 'sessions',
      name: 'Session Data',
      description: 'Aggregated session-level metrics and outcomes',
      count: '500K+/month',
      fields: [
        { name: 'session_id', type: 'uuid', description: 'Unique session identifier' },
        { name: 'started_at', type: 'datetime', description: 'Session start timestamp' },
        { name: 'ended_at', type: 'datetime', description: 'Session end timestamp' },
        { name: 'total_events', type: 'integer', description: 'Number of events in session' },
        { name: 'products_viewed', type: 'integer', description: 'Unique products interacted with' },
        { name: 'try_ons_completed', type: 'integer', description: 'Number of virtual try-ons' },
        { name: 'cart_additions', type: 'integer', description: 'Items added to cart' },
        { name: 'converted', type: 'boolean', description: 'Whether session resulted in purchase' },
        { name: 'country_code', type: 'string', description: 'ISO country code (geo-IP derived)' },
        { name: 'referrer_category', type: 'enum', description: 'direct, search, social, email, paid' }
      ]
    },
    {
      id: 'products',
      name: 'Product Signals',
      description: 'Aggregated product-level behavioral metrics',
      count: '50K+ products',
      fields: [
        { name: 'product_id', type: 'string', description: 'Product SKU identifier' },
        { name: 'category', type: 'string', description: 'Product category' },
        { name: 'try_on_count', type: 'integer', description: 'Total virtual try-ons' },
        { name: 'conversion_rate', type: 'float', description: 'Try-on to purchase ratio' },
        { name: 'avg_session_duration', type: 'float', description: 'Average time spent with product' },
        { name: 'size_distribution', type: 'json', description: 'Size selection frequencies' },
        { name: 'return_to_rate', type: 'float', description: 'Users who come back to this product' },
        { name: 'cross_view_products', type: 'array', description: 'Commonly viewed together products' },
        { name: 'trending_score', type: 'float', description: 'Recent velocity indicator (0-1)' }
      ]
    },
    {
      id: 'predictions',
      name: 'Prediction Signals',
      description: 'ML-derived signals for demand and intent',
      count: 'Real-time',
      fields: [
        { name: 'product_id', type: 'string', description: 'Product identifier' },
        { name: 'demand_forecast_7d', type: 'float', description: 'Predicted demand next 7 days' },
        { name: 'demand_forecast_30d', type: 'float', description: 'Predicted demand next 30 days' },
        { name: 'confidence_score', type: 'float', description: 'Prediction confidence (0-1)' },
        { name: 'trend_direction', type: 'enum', description: 'rising, stable, declining' },
        { name: 'seasonality_factor', type: 'float', description: 'Seasonal adjustment multiplier' },
        { name: 'stockout_risk', type: 'float', description: 'Probability of stockout (0-1)' },
        { name: 'optimal_inventory', type: 'integer', description: 'Recommended stock level' },
        { name: 'updated_at', type: 'datetime', description: 'Last model update timestamp' }
      ]
    }
  ];

  const sampleQueries = [
    {
      name: 'High-intent sessions',
      description: 'Sessions with 3+ try-ons that converted',
      sql: `SELECT session_id, products_viewed, try_ons_completed
FROM sessions
WHERE try_ons_completed >= 3
  AND converted = true
ORDER BY started_at DESC
LIMIT 1000;`
    },
    {
      name: 'Trending products',
      description: 'Products with rising demand signals',
      sql: `SELECT product_id, category, trending_score,
       demand_forecast_7d
FROM product_signals
WHERE trending_score > 0.7
  AND trend_direction = 'rising'
ORDER BY trending_score DESC;`
    },
    {
      name: 'Conversion funnel',
      description: 'Try-on to purchase conversion by category',
      sql: `SELECT category,
       COUNT(*) as try_ons,
       SUM(CASE WHEN converted THEN 1 ELSE 0 END) as purchases,
       ROUND(AVG(CASE WHEN converted THEN 1.0 ELSE 0 END), 3) as conv_rate
FROM events e
JOIN sessions s ON e.session_id = s.session_id
WHERE event_type = 'try_on_complete'
GROUP BY category
ORDER BY conv_rate DESC;`
    }
  ];
</script>

<Metadata
  title="Data Schema - Oraklex | Commerce Behavioral Data Structure"
  description="Explore the schema of Oraklex commerce behavioral data. 10M+ monthly events, session data, product signals, and prediction APIs for AI training and analytics."
/>

<div class="data-page">
  <header class="page-header">
    <div class="header-inner">
      <a href="/" class="logo">Oraklex</a>
      <nav class="header-nav">
        <a href="/solutions" class="nav-link">Platform</a>
        <a href="/insights" class="nav-link">Insights</a>
        <a href="/contact" class="nav-link">Contact</a>
      </nav>
    </div>
  </header>

  <main class="page-content">
    <!-- Hero -->
    <section class="hero-section" class:visible={mounted}>
      <span class="hero-label">Data Documentation</span>
      <h1>Data Schema</h1>
      <p class="hero-subtitle">
        What we capture, how it's structured, and how you can use it.
        First-party behavioral data from J'ko AI's virtual try-on platform.
      </p>
    </section>

    <!-- Data Categories Tabs -->
    <section class="schema-section">
      <div class="tabs-nav">
        {#each dataCategories as category}
          <button
            class="tab-btn"
            class:active={activeTab === category.id}
            onclick={() => activeTab = category.id}
          >
            {category.name}
            <span class="tab-count">{category.count}</span>
          </button>
        {/each}
      </div>

      {#each dataCategories as category}
        {#if activeTab === category.id}
          <div class="schema-content">
            <div class="schema-header">
              <h2>{category.name}</h2>
              <p>{category.description}</p>
            </div>

            <div class="fields-table">
              <div class="table-header">
                <span>Field</span>
                <span>Type</span>
                <span>Description</span>
              </div>
              {#each category.fields as field}
                <div class="table-row">
                  <code class="field-name">{field.name}</code>
                  <span class="field-type">{field.type}</span>
                  <span class="field-desc">{field.description}</span>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      {/each}
    </section>

    <!-- Sample Queries -->
    <section class="queries-section">
      <h2>Example Queries</h2>
      <p class="section-intro">Common patterns for working with the data. API and batch export access available.</p>

      <div class="queries-grid">
        {#each sampleQueries as query}
          <div class="query-card">
            <h3>{query.name}</h3>
            <p>{query.description}</p>
            <pre><code>{query.sql}</code></pre>
          </div>
        {/each}
      </div>
    </section>

    <!-- Access Options -->
    <section class="access-section">
      <h2>Data Access Options</h2>
      <div class="access-grid">
        <div class="access-card">
          <div class="access-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.86 6.69 2.31"/>
              <path d="M21 3v6h-6"/>
            </svg>
          </div>
          <h3>Real-time API</h3>
          <p>Sub-100ms latency RESTful API for live predictions and behavioral signals.</p>
          <ul>
            <li>Demand forecasts</li>
            <li>Intent scoring</li>
            <li>Product signals</li>
          </ul>
        </div>

        <div class="access-card">
          <div class="access-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <path d="M7 10l5 5 5-5"/>
              <path d="M12 15V3"/>
            </svg>
          </div>
          <h3>Batch Export</h3>
          <p>Daily or weekly data exports in JSON, CSV, or Parquet format.</p>
          <ul>
            <li>Historical events</li>
            <li>Training datasets</li>
            <li>Analytics feeds</li>
          </ul>
        </div>

        <div class="access-card">
          <div class="access-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h3>Custom Integration</h3>
          <p>Direct database sync, custom schemas, and dedicated infrastructure.</p>
          <ul>
            <li>Snowflake/BigQuery</li>
            <li>S3/GCS delivery</li>
            <li>Custom pipelines</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Compliance -->
    <section class="compliance-section">
      <div class="compliance-content">
        <div class="compliance-text">
          <h2>Privacy & Compliance</h2>
          <p>
            All data is anonymized at collection. No PII is stored or transmitted. Differential privacy
            techniques applied to aggregations. Full GDPR and CCPA compliance with documented data lineage.
          </p>
        </div>
        <div class="compliance-badges">
          <div class="badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
            GDPR Compliant
          </div>
          <div class="badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
            CCPA Compliant
          </div>
          <div class="badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
            SOC 2 Type II
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <div class="cta-content">
        <h2>Ready to Evaluate?</h2>
        <p>Request sample data access or discuss your use case with our team.</p>
        <div class="cta-actions">
          <a href="/contact" class="cta-primary">Request Data Access</a>
          <a href="/insights" class="cta-secondary">See the Research →</a>
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

  .data-page {
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

  .hero-label {
    @apply text-xs font-semibold uppercase tracking-[0.2em] text-base4 block mb-2;
  }

  .hero-section h1 {
    @apply text-4xl font-bold text-base6 mb-4;
    letter-spacing: -0.03em;
  }

  .hero-subtitle {
    @apply text-lg text-base4 max-w-2xl mx-auto;
  }

  /* Schema Section */
  .schema-section {
    @apply mb-16;
  }

  .tabs-nav {
    @apply flex flex-wrap gap-2 mb-6 pb-4 border-b border-base2;
  }

  .tab-btn {
    @apply px-4 py-2 rounded-lg text-sm font-medium text-base4 bg-transparent border-none cursor-pointer;
    @apply hover:bg-base1 transition-colors flex items-center gap-2;
  }

  .tab-btn.active {
    @apply bg-base14 text-white;
  }

  .tab-count {
    @apply text-xs opacity-70;
  }

  .schema-content {
    @apply bg-base1 rounded-2xl p-6 border border-base2;
  }

  .schema-header {
    @apply mb-6;
  }

  .schema-header h2 {
    @apply text-xl font-semibold text-base6 mb-2;
  }

  .schema-header p {
    @apply text-sm text-base4;
  }

  .fields-table {
    @apply space-y-1;
  }

  .table-header {
    @apply grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-base4;
  }

  .table-header span:nth-child(1) { @apply col-span-3; }
  .table-header span:nth-child(2) { @apply col-span-2; }
  .table-header span:nth-child(3) { @apply col-span-7; }

  .table-row {
    @apply grid grid-cols-12 gap-4 px-4 py-3 rounded-lg bg-base0 items-center;
  }

  .field-name {
    @apply col-span-3 text-sm font-mono text-base14;
  }

  .field-type {
    @apply col-span-2 text-xs font-medium text-base4 bg-base2 px-2 py-1 rounded;
  }

  .field-desc {
    @apply col-span-7 text-sm text-base5;
  }

  /* Queries Section */
  .queries-section {
    @apply mb-16;
  }

  .queries-section h2 {
    @apply text-2xl font-semibold text-base6 mb-2;
  }

  .section-intro {
    @apply text-base text-base4 mb-8;
  }

  .queries-grid {
    @apply grid gap-6 md:grid-cols-3;
  }

  .query-card {
    @apply p-5 rounded-xl bg-base1 border border-base2;
  }

  .query-card h3 {
    @apply text-base font-semibold text-base6 mb-2;
  }

  .query-card p {
    @apply text-sm text-base4 mb-4;
  }

  .query-card pre {
    @apply bg-base6 text-base0 p-4 rounded-lg overflow-x-auto text-xs;
  }

  .query-card code {
    @apply font-mono;
  }

  /* Access Section */
  .access-section {
    @apply mb-16;
  }

  .access-section h2 {
    @apply text-2xl font-semibold text-base6 mb-8 text-center;
  }

  .access-grid {
    @apply grid gap-6 md:grid-cols-3;
  }

  .access-card {
    @apply p-6 rounded-2xl bg-base1 border border-base2 text-center;
  }

  .access-icon {
    @apply w-12 h-12 mx-auto mb-4 rounded-xl bg-base2 flex items-center justify-center text-base6;
  }

  .access-card h3 {
    @apply text-lg font-semibold text-base6 mb-2;
  }

  .access-card p {
    @apply text-sm text-base4 mb-4;
  }

  .access-card ul {
    @apply text-left space-y-1;
  }

  .access-card li {
    @apply text-sm text-base5 pl-4 relative;
  }

  .access-card li::before {
    content: '✓';
    @apply absolute left-0 text-green-500;
  }

  /* Compliance Section */
  .compliance-section {
    @apply mb-16 p-8 rounded-2xl bg-gradient-to-br from-green-50 to-base0 border border-green-200;
  }

  .compliance-content {
    @apply flex flex-col md:flex-row items-center gap-8;
  }

  .compliance-text {
    @apply flex-1;
  }

  .compliance-text h2 {
    @apply text-xl font-semibold text-base6 mb-2;
  }

  .compliance-text p {
    @apply text-sm text-base4;
  }

  .compliance-badges {
    @apply flex flex-wrap gap-3;
  }

  .badge {
    @apply flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-green-200 text-sm font-medium text-green-700;
  }

  /* CTA Section */
  .cta-section {
    @apply text-center;
  }

  .cta-content {
    @apply max-w-xl mx-auto p-8 rounded-2xl bg-base1 border border-base2;
  }

  .cta-content h2 {
    @apply text-2xl font-semibold text-base6 mb-2;
  }

  .cta-content p {
    @apply text-base text-base4 mb-6;
  }

  .cta-actions {
    @apply flex flex-wrap justify-center gap-4;
  }

  .cta-primary {
    @apply px-6 py-3 rounded-lg bg-base14 text-white font-semibold no-underline;
    @apply hover:bg-base6 transition-colors;
  }

  .cta-secondary {
    @apply px-6 py-3 rounded-lg bg-transparent text-base14 font-semibold no-underline;
    @apply hover:bg-base14/10 transition-colors;
  }

  .footer-wrapper {
    @apply mt-16;
  }

  @media (max-width: 768px) {
    .table-header,
    .table-row {
      @apply grid-cols-1 gap-1;
    }

    .field-name,
    .field-type,
    .field-desc {
      @apply col-span-1;
    }

    .table-row {
      @apply py-4;
    }

    .field-type {
      @apply inline-block w-auto mb-1;
    }
  }
</style>

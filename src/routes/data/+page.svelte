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

  const eventTypes = [
    {
      name: 'try_on',
      description: 'Virtual try-on session initiated',
      fields: [
        { name: 'event_id', type: 'string', description: 'Unique event identifier' },
        { name: 'session_id', type: 'string', description: 'User session identifier' },
        { name: 'timestamp', type: 'ISO 8601', description: 'Event timestamp' },
        { name: 'product_id', type: 'string', description: 'Product identifier' },
        { name: 'category', type: 'string', description: 'Product category' },
        { name: 'duration_ms', type: 'integer', description: 'Session duration' }
      ]
    },
    {
      name: 'style_preference',
      description: 'Style choice or preference signal',
      fields: [
        { name: 'event_id', type: 'string', description: 'Unique event identifier' },
        { name: 'session_id', type: 'string', description: 'User session identifier' },
        { name: 'timestamp', type: 'ISO 8601', description: 'Event timestamp' },
        { name: 'preference_type', type: 'string', description: 'Type of preference (color, style, fit)' },
        { name: 'value', type: 'string', description: 'Preference value' }
      ]
    },
    {
      name: 'cart_action',
      description: 'Add to cart or cart modification',
      fields: [
        { name: 'event_id', type: 'string', description: 'Unique event identifier' },
        { name: 'session_id', type: 'string', description: 'User session identifier' },
        { name: 'timestamp', type: 'ISO 8601', description: 'Event timestamp' },
        { name: 'product_id', type: 'string', description: 'Product identifier' },
        { name: 'action', type: 'string', description: 'Action type (add, remove, update)' },
        { name: 'quantity', type: 'integer', description: 'Quantity changed' }
      ]
    },
    {
      name: 'conversion',
      description: 'Purchase completion event',
      fields: [
        { name: 'event_id', type: 'string', description: 'Unique event identifier' },
        { name: 'session_id', type: 'string', description: 'User session identifier' },
        { name: 'timestamp', type: 'ISO 8601', description: 'Event timestamp' },
        { name: 'order_id', type: 'string', description: 'Order identifier' },
        { name: 'product_ids', type: 'array', description: 'Products in order' }
      ]
    }
  ];
</script>

<Metadata
  title="Data Schema - Miozu | Behavioral Event Documentation"
  description="Technical documentation for Miozu behavioral data schema. Event types, field specifications, and data format documentation for enterprise integrations."
/>

<div class="app-container data-page">
  <div class="data-content" class:mounted>
    <!-- Header -->
    <header class="page-header">
      <a href="/" class="back-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5m7-7l-7 7 7 7"/>
        </svg>
        Back
      </a>
      <span class="page-label">Documentation</span>
      <h1>Data Schema</h1>
      <p class="page-desc">
        Technical specification for behavioral event data
      </p>
    </header>

    <!-- Overview -->
    <section class="overview-section">
      <h2>Overview</h2>
      <div class="overview-grid">
        <div class="overview-item">
          <span class="overview-label">Format</span>
          <span class="overview-value">JSON / Parquet</span>
        </div>
        <div class="overview-item">
          <span class="overview-label">Delivery</span>
          <span class="overview-value">API / Batch Export</span>
        </div>
        <div class="overview-item">
          <span class="overview-label">Compliance</span>
          <span class="overview-value">GDPR, CCPA</span>
        </div>
        <div class="overview-item">
          <span class="overview-label">Updates</span>
          <span class="overview-value">Real-time / Daily</span>
        </div>
      </div>
    </section>

    <!-- Event Types -->
    <section class="events-section">
      <h2>Event Types</h2>
      <p class="section-desc">
        Core behavioral event schemas available for licensing.
      </p>

      <div class="events-list">
        {#each eventTypes as event}
          <article class="event-card">
            <div class="event-header">
              <code class="event-name">{event.name}</code>
              <span class="event-desc">{event.description}</span>
            </div>

            <div class="fields-table">
              <div class="table-header">
                <span>Field</span>
                <span>Type</span>
                <span>Description</span>
              </div>
              {#each event.fields as field}
                <div class="table-row">
                  <code class="field-name">{field.name}</code>
                  <span class="field-type">{field.type}</span>
                  <span class="field-desc">{field.description}</span>
                </div>
              {/each}
            </div>
          </article>
        {/each}
      </div>
    </section>

    <!-- Data Quality -->
    <section class="quality-section">
      <h2>Data Quality</h2>
      <div class="quality-grid">
        <div class="quality-item">
          <h3>Validation</h3>
          <p>All events validated against schema before delivery. Invalid events are filtered.</p>
        </div>
        <div class="quality-item">
          <h3>Deduplication</h3>
          <p>Duplicate events identified and removed using event_id and timestamp.</p>
        </div>
        <div class="quality-item">
          <h3>Anonymization</h3>
          <p>PII removed. Session IDs are anonymized identifiers, not user accounts.</p>
        </div>
        <div class="quality-item">
          <h3>Freshness</h3>
          <p>Real-time API within seconds. Batch exports available daily.</p>
        </div>
      </div>
    </section>

    <!-- Access -->
    <section class="access-section">
      <div class="access-card">
        <h2>Request Schema Access</h2>
        <p>
          For detailed field specifications, sample data, and integration documentation.
        </p>
        <div class="access-actions">
          <a href="/contact" class="access-btn primary">Request Access</a>
          <a href="/solutions" class="access-btn secondary">View Products</a>
        </div>
      </div>
    </section>
  </div>

  <Footer {theme} />
</div>

<style lang="postcss">
  @reference '$theme';

  .data-page {
    @apply min-h-screen bg-base0;
  }

  .data-content {
    @apply max-w-4xl mx-auto px-6 py-12;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .data-content.mounted {
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
    @apply text-base text-base4;
  }

  /* Overview Section */
  .overview-section {
    @apply mb-12;
  }

  .overview-section h2 {
    @apply text-lg font-semibold text-base6 mb-4;
  }

  .overview-grid {
    @apply grid grid-cols-2 md:grid-cols-4 gap-3;
  }

  .overview-item {
    @apply p-4 rounded-lg border border-base3 bg-base1;
  }

  .overview-label {
    @apply block text-xs text-base4 mb-1;
  }

  .overview-value {
    @apply block text-sm font-medium text-base6;
  }

  /* Events Section */
  .events-section {
    @apply mb-12;
  }

  .events-section h2 {
    @apply text-lg font-semibold text-base6 mb-2;
  }

  .section-desc {
    @apply text-sm text-base4 mb-6;
  }

  .events-list {
    @apply flex flex-col gap-4;
  }

  .event-card {
    @apply rounded-xl border border-base3 bg-base0 overflow-hidden;
  }

  .event-header {
    @apply p-4 bg-base1 border-b border-base3 flex items-center gap-4;
  }

  .event-name {
    @apply px-2 py-1 rounded bg-base14/10 text-base14 text-sm font-mono font-medium;
  }

  .event-desc {
    @apply text-sm text-base4;
  }

  .fields-table {
    @apply divide-y divide-base2;
  }

  .table-header {
    @apply grid grid-cols-3 gap-4 px-4 py-2 bg-base1/50 text-xs font-semibold text-base4 uppercase tracking-wider;
  }

  .table-row {
    @apply grid grid-cols-3 gap-4 px-4 py-3;
  }

  .field-name {
    @apply text-sm font-mono text-base6;
  }

  .field-type {
    @apply text-xs text-base14 font-medium;
  }

  .field-desc {
    @apply text-xs text-base4;
  }

  /* Quality Section */
  .quality-section {
    @apply mb-12;
  }

  .quality-section h2 {
    @apply text-lg font-semibold text-base6 mb-4;
  }

  .quality-grid {
    @apply grid gap-4 md:grid-cols-2;
  }

  .quality-item {
    @apply p-4 rounded-xl border border-base3 bg-base0;
  }

  .quality-item h3 {
    @apply text-sm font-semibold text-base6 mb-2;
  }

  .quality-item p {
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
    .data-content {
      @apply px-4 py-8;
    }

    .page-header h1 {
      @apply text-2xl;
    }

    .overview-grid {
      @apply grid-cols-2;
    }

    .table-header,
    .table-row {
      @apply grid-cols-1 gap-1;
    }

    .table-header {
      @apply hidden;
    }

    .table-row {
      @apply py-3;
    }

    .field-name {
      @apply font-semibold;
    }

    .field-type {
      @apply block mt-1;
    }

    .field-desc {
      @apply block mt-1;
    }

    .quality-grid {
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

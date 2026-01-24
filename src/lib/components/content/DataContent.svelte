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

  const getDelay = (index, base = 0) => base + index * 0.1;
</script>

<div class="data-content">
  <!-- Overview Section -->
  <section class="overview-section" data-animate="overview" class:visible={visibleSections.has('overview')}>
    <div class="section-header">
      <span class="section-label">Documentation</span>
      <h2>Data Schema</h2>
      <p class="lead">Technical specification for behavioral event data formats and delivery methods.</p>
    </div>

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

  <!-- Event Types Section -->
  <section class="events-section" data-animate="events" class:visible={visibleSections.has('events')}>
    <div class="section-header">
      <span class="section-label">Schema</span>
      <h2>Event Types</h2>
      <p class="section-desc">Core behavioral event schemas available for licensing.</p>
    </div>

    <div class="events-list">
      {#each eventTypes as event, i}
        <article
          class="event-card"
          data-animate={`event-${i}`}
          class:visible={visibleSections.has(`event-${i}`)}
          style={`--delay: ${getDelay(i)}s`}
        >
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

  <!-- Data Quality Section -->
  <section class="quality-section" data-animate="quality" class:visible={visibleSections.has('quality')}>
    <div class="section-header">
      <span class="section-label">Quality</span>
      <h2>Data Quality Guarantees</h2>
    </div>

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

  <!-- CTA Section -->
  <section class="cta-section" data-animate="cta" class:visible={visibleSections.has('cta')}>
    <div class="cta-content">
      <h2>Request Schema Access</h2>
      <p>For detailed field specifications, sample data, and integration documentation.</p>
      <div class="cta-actions">
        <Button variant="primary" href="/contact">Request Access</Button>
        <Button variant="secondary" href="/solutions">View Products</Button>
      </div>
    </div>
  </section>
</div>

<style lang="postcss">
  @reference '$theme';

  .data-content {
    @apply text-base04;
  }

  .section-header {
    @apply mb-8 max-w-3xl;
  }

  .section-label {
    @apply text-xs font-semibold uppercase tracking-[0.2em] text-base04;
  }

  .section-header h2 {
    @apply mt-2 text-2xl font-semibold text-base06;
    letter-spacing: -0.02em;
  }

  .lead {
    @apply mt-3 text-base text-base05 leading-relaxed;
  }

  .section-desc {
    @apply mt-2 text-sm text-base04;
  }

  /* Overview Section */
  .overview-section {
    @apply mx-auto max-w-6xl px-8 py-12;
    opacity: 0;
    transform: translateY(24px);
    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .overview-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .overview-grid {
    @apply grid grid-cols-2 md:grid-cols-4 gap-3;
  }

  .overview-item {
    @apply p-4 rounded-xl border border-base03 bg-base00;
  }

  .overview-label {
    @apply block text-xs text-base04 mb-1;
  }

  .overview-value {
    @apply block text-sm font-medium text-base06;
  }

  /* Events Section */
  .events-section {
    @apply mx-auto max-w-6xl px-8 py-12;
    opacity: 0;
    transform: translateY(24px);
    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .events-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .events-list {
    @apply flex flex-col gap-4;
  }

  .event-card {
    @apply rounded-xl border border-base03 bg-base00 overflow-hidden;
    opacity: 0;
    transform: translateY(16px);
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: var(--delay, 0s);
  }

  .event-card.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .event-header {
    @apply p-4 bg-base01 border-b border-base03 flex items-center gap-4;
  }

  .event-name {
    @apply px-2 py-1 rounded bg-base0E/10 text-base0E text-sm font-mono font-medium;
  }

  .event-desc {
    @apply text-sm text-base04;
  }

  .fields-table {
    @apply divide-y divide-base02;
  }

  .table-header {
    @apply grid grid-cols-3 gap-4 px-4 py-2 bg-base01/50 text-xs font-semibold text-base04 uppercase tracking-wider;
  }

  .table-row {
    @apply grid grid-cols-3 gap-4 px-4 py-3;
  }

  .field-name {
    @apply text-sm font-mono text-base06;
  }

  .field-type {
    @apply text-xs text-base0E font-medium;
  }

  .field-desc {
    @apply text-xs text-base04;
  }

  /* Quality Section */
  .quality-section {
    @apply mx-auto max-w-6xl px-8 py-12;
    opacity: 0;
    transform: translateY(24px);
    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .quality-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .quality-grid {
    @apply grid gap-4 md:grid-cols-2;
  }

  .quality-item {
    @apply p-5 rounded-xl border border-base03 bg-base00;
  }

  .quality-item h3 {
    @apply text-sm font-semibold text-base06 mb-2;
  }

  .quality-item p {
    @apply text-xs text-base04 leading-relaxed;
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
    @apply mx-auto max-w-2xl flex flex-col items-center gap-4 rounded-2xl border border-base03 bg-base01 px-8 py-10 text-center;
  }

  .cta-content h2 {
    @apply text-xl font-semibold text-base06;
  }

  .cta-content p {
    @apply text-sm text-base04;
  }

  .cta-actions {
    @apply flex flex-wrap justify-center gap-3 mt-2;
  }

  @media (max-width: 768px) {
    .overview-section,
    .events-section,
    .quality-section,
    .cta-section {
      @apply px-5 py-8;
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

    .cta-content {
      @apply px-5 py-8;
    }
  }
</style>

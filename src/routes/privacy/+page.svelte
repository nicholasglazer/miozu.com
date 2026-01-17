<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Footer from '$lib/features/layout/Footer.svelte';
  import Metadata from '$features/seo/Metadata.svelte';

  let theme = $derived($page.data?.theme);

  function handleBack() {
    goto('/');
  }
</script>

<Metadata
  title="Privacy Policy - Miozu"
  description="How Miozu collects, uses, and protects data. GDPR and CCPA compliant data practices for our commerce intelligence platform."
/>

<div class="legal-page">
  <header class="legal-header">
    <div class="header-inner">
      <button class="back-btn" onclick={handleBack}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back
      </button>
      <a href="/" class="logo">Miozu</a>
    </div>
  </header>

  <main class="legal-content app-container">
    <article class="legal-article">
      <h1>Privacy Policy</h1>
      <p class="last-updated">Last updated: December 2024</p>

      <section>
        <h2>Who We Are</h2>
        <p>
          Miozu is a commerce intelligence platform operated by <strong>Up Go Corp.</strong> (<a href="https://upgo.ca" target="_blank" rel="noopener">upgo.ca</a>),
          a Canadian corporation based in Toronto, Ontario. When we say "we," "us," or "our" in this policy, we mean Up Go Corp. and its brands.
        </p>
        <p>
          Up Go Corp. also owns and operates <strong>J'ko AI</strong> (<a href="https://jko.ai" target="_blank" rel="noopener">jko.ai</a>),
          a virtual try-on platform for fashion e-commerce. The behavioral data generated through J'ko AI forms the foundation of Miozu's data products.
        </p>
        <p>
          This privacy policy covers both miozu.com and data practices related to our commerce intelligence services.
          For J'ko AI's platform-specific privacy policy, see <a href="https://dash.jko.ai/legal" target="_blank" rel="noopener">dash.jko.ai/legal</a>.
        </p>
      </section>

      <section>
        <h2>Data We Collect</h2>

        <h3>From J'ko AI Users (Virtual Try-On)</h3>
        <p>When shoppers use our virtual try-on technology on partner retail sites:</p>
        <ul>
          <li><strong>Interaction data:</strong> Products viewed, try-on sessions, style preferences, size selections</li>
          <li><strong>Technical data:</strong> Device type, browser, approximate location (country/region level)</li>
          <li><strong>Session data:</strong> Time spent, pages visited, conversion events</li>
        </ul>
        <p>
          <strong>We do NOT collect:</strong> Names, email addresses, payment information, or precise location data
          through J'ko AI. All behavioral data is anonymized and aggregated before processing.
        </p>

        <h3>From Miozu Website Visitors</h3>
        <ul>
          <li><strong>Contact form submissions:</strong> Name, email, message content (when you contact us)</li>
          <li><strong>Analytics:</strong> Standard website analytics (pages visited, referral source)</li>
        </ul>

        <h3>From Enterprise Clients</h3>
        <ul>
          <li><strong>Business contact information:</strong> Name, email, company, role</li>
          <li><strong>Contract and billing information:</strong> As needed for service delivery</li>
        </ul>
      </section>

      <section>
        <h2>How We Use Data</h2>
        <ul>
          <li><strong>Product development:</strong> Anonymized behavioral data trains our prediction models</li>
          <li><strong>Client services:</strong> Licensed datasets and APIs for enterprise customers</li>
          <li><strong>Analytics:</strong> Understanding how users interact with our platforms</li>
          <li><strong>Communication:</strong> Responding to inquiries and service updates</li>
        </ul>
      </section>

      <section>
        <h2>Data Licensing to Third Parties</h2>
        <p>
          We license <strong>anonymized, aggregated behavioral datasets</strong> to enterprise clients for:
        </p>
        <ul>
          <li>AI model training and development</li>
          <li>Demand forecasting and inventory optimization</li>
          <li>Market research and trend analysis</li>
        </ul>
        <p>
          <strong>Important:</strong> Licensed data is always anonymized. Individual users cannot be identified
          from the datasets we provide. We apply differential privacy techniques and aggregate data before licensing.
        </p>
      </section>

      <section>
        <h2>GDPR Compliance (EU Users)</h2>
        <p>If you're in the European Economic Area, you have the right to:</p>
        <ul>
          <li><strong>Access:</strong> Request what data we hold about you</li>
          <li><strong>Rectification:</strong> Correct inaccurate data</li>
          <li><strong>Erasure:</strong> Request deletion of your data</li>
          <li><strong>Portability:</strong> Receive your data in a portable format</li>
          <li><strong>Object:</strong> Object to processing of your data</li>
        </ul>
        <p>
          <strong>Legal basis:</strong> We process J'ko AI behavioral data under legitimate interest (anonymized analytics).
          Contact form data is processed based on consent.
        </p>
      </section>

      <section>
        <h2>CCPA Compliance (California Users)</h2>
        <p>California residents have the right to:</p>
        <ul>
          <li>Know what personal information we collect</li>
          <li>Request deletion of personal information</li>
          <li>Opt-out of the sale of personal information</li>
          <li>Non-discrimination for exercising these rights</li>
        </ul>
        <p>
          <strong>Note:</strong> The anonymized behavioral data we license does not constitute "sale" of personal
          information under CCPA, as it cannot identify individuals.
        </p>
      </section>

      <section>
        <h2>Data Security</h2>
        <p>We implement industry-standard security measures:</p>
        <ul>
          <li>Encryption in transit (TLS 1.3) and at rest (AES-256)</li>
          <li>Access controls and authentication</li>
          <li>Regular security audits</li>
          <li>Data minimization practices</li>
        </ul>
      </section>

      <section>
        <h2>Data Retention</h2>
        <ul>
          <li><strong>Behavioral data:</strong> Retained for 24 months, then aggregated or deleted</li>
          <li><strong>Contact information:</strong> Retained while business relationship is active</li>
          <li><strong>Analytics data:</strong> Retained for 14 months</li>
        </ul>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>
          We use essential cookies for site functionality and analytics cookies to understand usage patterns.
          You can control cookies through your browser settings.
        </p>
      </section>

      <section>
        <h2>Contact Us</h2>
        <p>For privacy-related questions or to exercise your data rights:</p>
        <p class="contact-block">
          <strong>Up Go Corp.</strong><br>
          Toronto, Ontario, Canada<br>
          <a href="mailto:partners@miozu.com">partners@miozu.com</a><br>
          <a href="https://upgo.ca" target="_blank" rel="noopener">upgo.ca</a>
        </p>
        <p>
          We aim to respond to all privacy inquiries within 30 days. For GDPR requests from EU residents,
          we will respond within the legally required timeframe.
        </p>
      </section>

      <section>
        <h2>Changes to This Policy</h2>
        <p>
          We may update this policy periodically. Significant changes will be communicated through our website
          or direct notification to clients.
        </p>
      </section>
    </article>
  </main>

  <div class="footer-wrapper app-container">
    <Footer {theme} />
  </div>
</div>

<style lang="postcss">
  @reference '$theme';

  .legal-page {
    min-height: 100vh;
    @apply bg-base0;
  }

  .legal-header {
    position: sticky;
    top: 0;
    z-index: 100;
    @apply bg-base0 border-b border-base2;
  }

  .header-inner {
    @apply max-w-4xl mx-auto px-6 py-4 flex items-center justify-between;
  }

  .back-btn {
    @apply flex items-center gap-2 text-sm text-base4 hover:text-base6 transition-colors;
    background: none;
    border: none;
    cursor: pointer;
  }

  .logo {
    @apply text-lg font-semibold text-base6 no-underline;
  }

  .legal-content {
    @apply py-12;
  }

  .legal-article {
    @apply max-w-3xl mx-auto;
  }

  .legal-article h1 {
    @apply text-3xl font-bold text-base6 mb-2;
    letter-spacing: -0.02em;
  }

  .last-updated {
    @apply text-sm text-base4 mb-8 pb-6 border-b border-base2;
  }

  .legal-article section {
    @apply mb-8;
  }

  .legal-article h2 {
    @apply text-xl font-semibold text-base6 mt-8 mb-4;
  }

  .legal-article h3 {
    @apply text-base font-semibold text-base5 mt-6 mb-2;
  }

  .legal-article p {
    @apply text-base text-base5 leading-relaxed mb-4;
  }

  .legal-article ul {
    @apply mb-4 pl-6;
  }

  .legal-article li {
    @apply text-base text-base5 leading-relaxed mb-2;
    list-style-type: disc;
  }

  .legal-article a {
    @apply text-base14 hover:underline;
  }

  .legal-article strong {
    @apply text-base6;
  }

  .contact-block {
    @apply p-4 rounded-lg bg-base1 border border-base2;
    line-height: 1.8;
  }

  .footer-wrapper {
    @apply mt-auto;
  }

  @media (max-width: 768px) {
    .legal-content {
      @apply py-8 px-4;
    }

    .legal-article h1 {
      @apply text-2xl;
    }

    .legal-article h2 {
      @apply text-lg;
    }
  }
</style>

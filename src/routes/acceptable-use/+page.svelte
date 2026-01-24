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
  title="Acceptable Use Policy - Miozu"
  description="Guidelines for acceptable use of Miozu data products, APIs, and services. What you can and cannot do with our data."
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
      <h1>Acceptable Use Policy</h1>
      <p class="last-updated">Last updated: December 2024</p>

      <section>
        <h2>Purpose</h2>
        <p>
          This Acceptable Use Policy ("AUP") defines how you may use Miozu data products, APIs, and
          related services. This policy supplements your enterprise agreement and our <a href="/terms">Terms of Service</a>.
        </p>
        <p>
          Miozu is operated by <strong>Up Go Corp.</strong> (<a href="https://upgo.ca" target="_blank" rel="noopener">upgo.ca</a>).
          Our data originates from J'ko AI (<a href="https://jko.ai" target="_blank" rel="noopener">jko.ai</a>), a virtual try-on platform
          we built and operate. This gives us direct control over data quality, privacy practices, and compliance.
        </p>
        <p>
          We provide this data to help build better AI systems, optimize retail operations, and improve commerce experiences.
          This AUP ensures our data is used responsibly and ethically.
        </p>
      </section>

      <section>
        <h2>Permitted Uses</h2>
        <p>You may use Miozu data and services for:</p>

        <h3>AI and Machine Learning</h3>
        <ul>
          <li>Training recommendation systems and personalization models</li>
          <li>Developing demand forecasting and inventory optimization models</li>
          <li>Building commerce-related AI agents and assistants</li>
          <li>Research and development of AI systems</li>
        </ul>

        <h3>Business Analytics</h3>
        <ul>
          <li>Market research and trend analysis</li>
          <li>Consumer behavior analysis (on anonymized, aggregated data)</li>
          <li>Competitive intelligence and benchmarking</li>
          <li>Internal business decision support</li>
        </ul>

        <h3>Product Development</h3>
        <ul>
          <li>Building commerce applications and platforms</li>
          <li>Enhancing existing retail and e-commerce systems</li>
          <li>Developing third-party integrations (with appropriate licensing)</li>
        </ul>
      </section>

      <section>
        <h2>Prohibited Uses</h2>
        <p><strong>You may NOT use Miozu data or services to:</strong></p>

        <h3>Re-identification and Privacy Violations</h3>
        <ul>
          <li>Attempt to re-identify individuals from anonymized data</li>
          <li>Combine our data with other sources to identify individuals</li>
          <li>Build profiles that could identify specific persons</li>
          <li>Target individuals based on inferred personal characteristics</li>
        </ul>

        <h3>Harmful Applications</h3>
        <ul>
          <li>Discriminatory pricing or service denial based on protected characteristics</li>
          <li>Manipulative or deceptive marketing practices</li>
          <li>Systems designed to exploit vulnerable populations</li>
          <li>Surveillance or tracking of individuals</li>
          <li>Any application that violates applicable laws or regulations</li>
        </ul>

        <h3>Unauthorized Distribution</h3>
        <ul>
          <li>Reselling or sublicensing data without explicit authorization</li>
          <li>Sharing raw data or API access with unauthorized third parties</li>
          <li>Publishing or publicly disclosing raw dataset contents</li>
          <li>Creating derivative datasets for external distribution</li>
        </ul>

        <h3>Technical Misuse</h3>
        <ul>
          <li>Exceeding API rate limits or circumventing usage controls</li>
          <li>Attempting to access data or systems beyond your authorization</li>
          <li>Reverse engineering our algorithms or systems</li>
          <li>Interfering with service availability for other clients</li>
        </ul>
      </section>

      <section>
        <h2>Responsible AI Guidelines</h2>
        <p>
          If you use our data for AI training or development, we expect you to follow responsible AI practices:
        </p>
        <ul>
          <li><strong>Transparency:</strong> Be clear about AI systems trained on commerce behavioral data</li>
          <li><strong>Fairness:</strong> Monitor for and mitigate bias in models trained on our data</li>
          <li><strong>Accountability:</strong> Maintain appropriate human oversight of AI systems</li>
          <li><strong>Safety:</strong> Test thoroughly before deploying AI systems in production</li>
        </ul>
      </section>

      <section>
        <h2>Compliance Requirements</h2>
        <p>You are responsible for ensuring your use of our data complies with:</p>
        <ul>
          <li>All applicable laws and regulations in your jurisdiction</li>
          <li>GDPR, CCPA, and other privacy regulations as applicable</li>
          <li>Industry-specific regulations (finance, healthcare, etc.)</li>
          <li>Your own organization's policies and ethical guidelines</li>
        </ul>
      </section>

      <section>
        <h2>Monitoring and Enforcement</h2>
        <p>
          We monitor service usage to ensure compliance with this AUP. We may:
        </p>
        <ul>
          <li>Review usage patterns and API calls</li>
          <li>Request information about how data is being used</li>
          <li>Audit compliance with enterprise agreements</li>
        </ul>
        <p>
          <strong>Violations may result in:</strong>
        </p>
        <ul>
          <li>Warning and request for remediation</li>
          <li>Temporary suspension of access</li>
          <li>Termination of service</li>
          <li>Legal action for serious violations</li>
        </ul>
      </section>

      <section>
        <h2>Reporting Violations</h2>
        <p>
          If you become aware of any violation of this AUP—including by your own organization—please
          contact us immediately. Early reporting of inadvertent violations will be considered in
          determining appropriate response.
        </p>
      </section>

      <section>
        <h2>Updates to This Policy</h2>
        <p>
          We may update this AUP to reflect evolving best practices, legal requirements, or service changes.
          Material updates will be communicated to enterprise clients via email.
        </p>
      </section>

      <section>
        <h2>Questions</h2>
        <p>
          Have a use case you're not sure about? Want to discuss data licensing terms? We're happy to talk.
        </p>
        <p class="contact-block">
          <strong>Up Go Corp.</strong><br>
          Toronto, Ontario, Canada<br>
          <a href="mailto:partners@miozu.com">partners@miozu.com</a><br>
          <a href="https://upgo.ca" target="_blank" rel="noopener">upgo.ca</a>
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
    @apply bg-base00;
  }

  .legal-header {
    position: sticky;
    top: 0;
    z-index: 100;
    @apply bg-base00 border-b border-base02;
  }

  .header-inner {
    @apply max-w-4xl mx-auto px-6 py-4 flex items-center justify-between;
  }

  .back-btn {
    @apply flex items-center gap-2 text-sm text-base04 hover:text-base06 transition-colors;
    background: none;
    border: none;
    cursor: pointer;
  }

  .logo {
    @apply text-lg font-semibold text-base06 no-underline;
  }

  .legal-content {
    @apply py-12;
  }

  .legal-article {
    @apply max-w-3xl mx-auto;
  }

  .legal-article h1 {
    @apply text-3xl font-bold text-base06 mb-2;
    letter-spacing: -0.02em;
  }

  .last-updated {
    @apply text-sm text-base04 mb-8 pb-6 border-b border-base02;
  }

  .legal-article section {
    @apply mb-8;
  }

  .legal-article h2 {
    @apply text-xl font-semibold text-base06 mt-8 mb-4;
  }

  .legal-article h3 {
    @apply text-base font-semibold text-base05 mt-6 mb-2;
  }

  .legal-article p {
    @apply text-base text-base05 leading-relaxed mb-4;
  }

  .legal-article ul {
    @apply mb-4 pl-6;
  }

  .legal-article li {
    @apply text-base text-base05 leading-relaxed mb-2;
    list-style-type: disc;
  }

  .legal-article a {
    @apply text-base0E hover:underline;
  }

  .legal-article strong {
    @apply text-base06;
  }

  .contact-block {
    @apply p-4 rounded-lg bg-base01 border border-base02;
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

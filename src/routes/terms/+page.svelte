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
  title="Terms of Service - Miozu"
  description="Terms and conditions for using Miozu services, including data licensing, API access, and platform usage."
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
      <h1>Terms of Service</h1>
      <p class="last-updated">Last updated: December 2024</p>

      <section>
        <h2>Agreement to Terms</h2>
        <p>
          These Terms of Service ("Terms") govern your access to and use of Miozu services, including our
          website (miozu.com), APIs, data products, and related services (collectively, "Services").
        </p>
        <p>
          Miozu is operated by <strong>Up Go Corp.</strong> (<a href="https://upgo.ca" target="_blank" rel="noopener">upgo.ca</a>),
          a Canadian corporation registered in Ontario ("Company," "we," "us," or "our"). Up Go Corp. also operates
          J'ko AI (<a href="https://jko.ai" target="_blank" rel="noopener">jko.ai</a>), which powers our commerce data infrastructure.
        </p>
        <p>
          By accessing or using our Services, you agree to be bound by these Terms. If you disagree with any
          part of the terms, you may not access the Services.
        </p>
      </section>

      <section>
        <h2>Services Description</h2>
        <p>Miozu provides:</p>
        <ul>
          <li><strong>Behavioral Data Products:</strong> Licensed datasets derived from anonymized commerce interactions</li>
          <li><strong>Prediction APIs:</strong> Demand forecasting and intelligence APIs for enterprise use</li>
          <li><strong>AI Visibility Services:</strong> GEO and AEO optimization for enterprise brands</li>
        </ul>
        <p>
          Services are provided on an enterprise basis. Specific terms, pricing, and service levels are
          defined in individual client agreements.
        </p>
      </section>

      <section>
        <h2>Enterprise Licenses</h2>
        <h3>Data Licensing</h3>
        <p>
          Data products are licensed, not sold. Your license rights are defined in your enterprise agreement
          and may include:
        </p>
        <ul>
          <li>Internal use for AI training and model development</li>
          <li>Analytics and business intelligence</li>
          <li>Research and product development</li>
        </ul>
        <p>
          <strong>Restrictions:</strong> Unless explicitly permitted in your agreement, you may not:
        </p>
        <ul>
          <li>Resell or sublicense data to third parties</li>
          <li>Attempt to re-identify anonymized data</li>
          <li>Use data in ways that violate applicable laws</li>
          <li>Share API credentials or access with unauthorized parties</li>
        </ul>

        <h3>API Access</h3>
        <p>
          API usage is subject to rate limits, usage quotas, and service level agreements defined in your
          enterprise contract. We reserve the right to throttle or suspend access for abuse or violation
          of terms.
        </p>
      </section>

      <section>
        <h2>User Accounts</h2>
        <p>
          Enterprise clients are responsible for maintaining the confidentiality of account credentials
          and for all activities under their accounts. You must notify us immediately of any unauthorized access.
        </p>
      </section>

      <section>
        <h2>Intellectual Property</h2>
        <p>
          The Services, including software, algorithms, documentation, and methodologies, are owned by
          Up Go Corp. and protected by intellectual property laws. Your license does not transfer ownership
          of any intellectual property.
        </p>
        <p>
          You retain ownership of any models, applications, or products you build using our data and APIs,
          subject to the license restrictions above.
        </p>
      </section>

      <section>
        <h2>Data Accuracy and Warranties</h2>
        <p>
          We strive for accuracy in our data products and predictions, but:
        </p>
        <ul>
          <li>Data is provided "as is" without warranty of accuracy or completeness</li>
          <li>Predictions are probabilistic estimates, not guarantees</li>
          <li>You are responsible for validating data suitability for your use case</li>
        </ul>
        <p>
          <strong>DISCLAIMER:</strong> TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES,
          EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
          AND NON-INFRINGEMENT.
        </p>
      </section>

      <section>
        <h2>Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, UP GO CORP. SHALL NOT BE LIABLE FOR ANY INDIRECT,
          INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES,
          WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER
          INTANGIBLE LOSSES.
        </p>
        <p>
          Our total liability for any claims arising from these Terms or your use of the Services shall
          not exceed the amounts paid by you to us in the twelve (12) months preceding the claim.
        </p>
      </section>

      <section>
        <h2>Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless Up Go Corp. and its officers, directors, employees,
          and agents from any claims, damages, losses, liabilities, and expenses arising from:
        </p>
        <ul>
          <li>Your use of the Services</li>
          <li>Your violation of these Terms</li>
          <li>Your violation of any third-party rights</li>
          <li>Applications or products you build using our Services</li>
        </ul>
      </section>

      <section>
        <h2>Termination</h2>
        <p>
          We may terminate or suspend access to our Services immediately, without prior notice, for
          conduct that we believe violates these Terms, is harmful to other users, or is harmful to us.
        </p>
        <p>
          Upon termination, your license to use the Services and any data products will immediately cease.
          Provisions that by their nature should survive termination shall survive.
        </p>
      </section>

      <section>
        <h2>Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the Province of
          Ontario, Canada, without regard to its conflict of law provisions.
        </p>
        <p>
          Any disputes arising from these Terms or the Services shall be resolved in the courts of
          Ontario, Canada, and you consent to the jurisdiction of such courts.
        </p>
      </section>

      <section>
        <h2>Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. Material changes will be communicated
          to enterprise clients via email or through the Services. Continued use after changes constitutes
          acceptance of the modified Terms.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>For questions about these Terms or our Services:</p>
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

<script>
  import {UserRound, Email} from '$components/icons';
  import {Button} from '$components/jera';
  import Divider from '$components/Divider.svelte';
  import {appName, author, contact} from '$settings/global';

  let {data} = $props();
  const l10n = data.l10n;

  // API endpoint URL - Points to your backend server
  // For local testing: http://localhost:3459/api/contact
  // For production: https://api.oraklex.com/api/contact
  const API_ENDPOINT = 'https://api.jko.ai/api/contact'; // Using JKO backend for now

  // Form state with Svelte 5 runes
  let formData = $state({
    name: '',
    email: '',
    message: '',
    // Hidden honeypot fields
    website: '',
    phone: ''
  });

  // Form feedback state
  let formState = $state({
    submitting: false,
    success: false,
    error: null,
    message: ''
  });

  // Validation state
  let validationErrors = $state({
    name: null,
    email: null,
    message: null
  });

  // Validation functions
  function validateName(name) {
    if (!name || name.trim().length < 2) {
      return l10n.t('contactNameError');
    }
    if (name.length > 100) {
      return 'Name must be less than 100 characters';
    }
    if (!/^[a-zA-Z\s'\-]+$/.test(name)) {
      return 'Name can only contain letters, spaces, apostrophes, and hyphens';
    }
    return null;
  }

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return l10n.t('contactEmailError');
    }
    if (email.length > 255) {
      return 'Email must be less than 255 characters';
    }
    return null;
  }

  function validateMessage(message) {
    if (!message || message.trim().length < 10) {
      return l10n.t('contactMessageError');
    }
    if (message.length > 2000) {
      return 'Message must be less than 2000 characters';
    }
    return null;
  }

  // Validate all fields
  function validateForm() {
    validationErrors.name = validateName(formData.name);
    validationErrors.email = validateEmail(formData.email);
    validationErrors.message = validateMessage(formData.message);

    return !validationErrors.name && !validationErrors.email && !validationErrors.message;
  }

  // Submit form handler
  async function handleSubmit(event) {
    // Prevent default form submission
    event.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    // Set submitting state
    formState.submitting = true;

    try {
      // Build request payload - only include honeypot fields if they have values
      const payload = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        source: 'oraklex.com'
      };

      // Only include honeypot fields if bots filled them (for spam detection)
      if (formData.website) payload.website = formData.website;
      if (formData.phone) payload.phone = formData.phone;

      // Send form data to the API endpoint
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to submit contact form');
      }

      // Update form state for success
      formState.success = true;
      formState.message = result.message || 'Thank you! Your message has been received. We\'ll get back to you within 1-2 business days.';

      // Clear form
      formData.name = '';
      formData.email = '';
      formData.message = '';
      formData.website = '';
      formData.phone = '';
    } catch (error) {
      console.error('Contact form error:', error);
      formState.success = false;
      formState.error = error;
      formState.message = error.message || 'Something went wrong. Please try emailing us directly at hello@oraklex.com';
    } finally {
      formState.submitting = false;
    }
  }

  // Reset the form
  function resetForm() {
    formData.name = '';
    formData.email = '';
    formData.message = '';
    formState.success = false;
    formState.error = null;
    formState.message = '';
    validationErrors.name = null;
    validationErrors.email = null;
    validationErrors.message = null;
  }
</script>

<div class="contact-container">
  <header class="contact-header">
    <h1 class="page-title">Contact Oraklex</h1>
    <p class="page-subtitle">
      Interested in partnering with us, licensing data, or learning more about the Data Oracle ecosystem? We'd love to hear from you.
    </p>
    <div class="value-stats">
      <div class="stat-item">
        <strong>Data Oracle</strong>
        <span>e-commerce intelligence</span>
      </div>
      <div class="stat-item">
        <strong>AI Planning</strong>
        <span>HyperC partnership</span>
      </div>
      <div class="stat-item">
        <strong>J'ko AI</strong>
        <span>virtual try-on product</span>
      </div>
    </div>
    <Divider />
  </header>

  <div class="contact-content">
    {#if formState.success}
      <div class="success-message">
        <h2>{l10n.t('contactSuccess')}</h2>
        <p>{formState.message}</p>
        <Button variant="primary" onclick={resetForm} class="mt-6"
          >{l10n.t('contactSendAnother')}</Button
        >
      </div>
    {:else}
      <div class="form-wrapper">
        <form onsubmit={handleSubmit} class="contact-form">
          <div class="form-group">
            <label for="name">Name</label>
            <div class="input-wrapper">
              <input
                id="name"
                type="text"
                bind:value={formData.name}
                onblur={() => (validationErrors.name = validateName(formData.name))}
                placeholder="Your full name"
                disabled={formState.submitting}
                maxlength="100"
                class={validationErrors.name ? 'input-error' : ''}
              />
              <div class="input-icon">
                <UserRound
                  size={18}
                  color={validationErrors.name ? 'var(--color-base8)' : 'var(--color-base4)'}
                />
              </div>
            </div>
            {#if validationErrors.name}
              <p class="error-message">{validationErrors.name}</p>
            {/if}
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <div class="input-wrapper">
              <input
                id="email"
                type="email"
                bind:value={formData.email}
                onblur={() => (validationErrors.email = validateEmail(formData.email))}
                placeholder="your@email.com"
                disabled={formState.submitting}
                maxlength="255"
                class={validationErrors.email ? 'input-error' : ''}
              />
              <div class="input-icon">
                <Email
                  size={18}
                  color={validationErrors.email ? 'var(--color-base8)' : 'var(--color-base4)'}
                />
              </div>
            </div>
            {#if validationErrors.email}
              <p class="error-message">{validationErrors.email}</p>
            {/if}
          </div>

          <div class="form-group">
            <label for="message">Message</label>
            <textarea
              id="message"
              bind:value={formData.message}
              onblur={() => (validationErrors.message = validateMessage(formData.message))}
              rows="6"
              placeholder="Tell us about your issue, question, or feedback..."
              disabled={formState.submitting}
              maxlength="2000"
              class={validationErrors.message ? 'input-error' : ''}
            ></textarea>
            {#if validationErrors.message}
              <p class="error-message">{validationErrors.message}</p>
            {/if}
          </div>

          <!-- Honeypot fields (invisible to users, but bots will fill them) -->
          <div class="honeypot" aria-hidden="true">
            <input type="text" name="website" bind:value={formData.website} tabindex="-1" />
            <input type="tel" name="phone" bind:value={formData.phone} tabindex="-1" />
          </div>

          {#if formState.error}
            <div class="form-error">
              <p>{formState.message}</p>
            </div>
          {/if}

          <Button type="submit" variant="primary" disabled={formState.submitting} class="w-full">
            {formState.submitting ? l10n.t('contactSending') : l10n.t('contactSend')}
          </Button>
        </form>

        <div class="contact-info">
          <div class="info-header">
            <h2>Direct Support</h2>
            <p class="info-subtitle">We're here to help</p>
          </div>

          <div class="email-card">
            <div class="email-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m2 7 8.97 5.7a1.94 1.94 0 0 0 2.06 0L22 7"/>
              </svg>
            </div>
            <a href="mailto:hello@oraklex.com" class="email-link">hello@oraklex.com</a>
            <p class="email-subtitle">All inquiries and partnerships</p>
          </div>

          <div class="enterprise-info">
            <h3>Partnership Opportunities</h3>
            <p>We're looking for:</p>
            <ul>
              <li>AI companies needing commerce training data</li>
              <li>E-commerce brands for data contribution</li>
              <li>Technology partners for integrations</li>
              <li>Investors aligned with our vision</li>
            </ul>
            <p class="enterprise-note">Contact us to explore partnership opportunities.</p>
          </div>

          <div class="availability-info">
            <div class="availability-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div class="availability-content">
              <h3>Response Times</h3>
              <p>We monitor support requests during business hours (Monday–Friday).</p>
              <p class="availability-note">Most messages receive a response within 1-2 business days. Enterprise customers receive priority support with 4-hour response times.</p>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style lang="postcss">
  @reference '$theme';

  .contact-container {
    @apply w-full max-w-5xl mx-auto pb-16;
  }

  .contact-header {
    @apply text-center pt-8 pb-12;
  }

  .page-title {
    @apply text-4xl font-bold text-base14 mb-4;
    @apply tracking-tight;
  }

  .page-subtitle {
    @apply text-xl text-base5 mb-6;
  }

  .value-stats {
    @apply flex flex-wrap justify-center gap-8 mt-8 mb-6;
  }

  .stat-item {
    @apply flex flex-col items-center text-center;

    strong {
      @apply text-lg font-bold text-base14 mb-1;
    }

    span {
      @apply text-sm text-base4;
    }
  }

  .contact-content {
    @apply w-full max-w-4xl mx-auto;
  }

  .form-wrapper {
    @apply flex flex-col md:flex-row gap-12;
  }

  .contact-form {
    @apply flex-1 bg-base1/30 p-6 sm:p-8 rounded-xs;
    @apply border border-base3/10;
  }

  .contact-info {
    @apply w-full md:w-80 flex-shrink-0 self-start;
    @apply flex flex-col gap-6;
  }

  .info-header {
    @apply text-center pb-6 border-b border-base3/10;

    h2 {
      @apply text-2xl font-bold text-base6 mb-2 tracking-tight;
    }

    .info-subtitle {
      @apply text-sm text-base4 m-0;
    }
  }

  .email-card {
    @apply flex flex-col items-center text-center p-8 rounded-3xl;
    @apply border border-base3/20;
    background: linear-gradient(160deg, rgba(var(--color-base14-rgb), 0.08) 0%, rgba(var(--color-base2-rgb), 0.4) 60%, transparent 100%);
    backdrop-filter: blur(20px) saturate(170%);
    -webkit-backdrop-filter: blur(20px) saturate(170%);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .email-card:hover {
    @apply border-base14/30;
    box-shadow: 0 12px 48px rgba(var(--color-base14-rgb), 0.12);
    transform: translateY(-2px);
  }

  .email-icon {
    @apply mb-4;
    color: var(--color-base14);
  }

  .email-link {
    @apply text-lg font-semibold text-base6 no-underline mb-2;
    @apply hover:text-base14 transition-colors;
    letter-spacing: -0.01em;
  }

  .email-subtitle {
    @apply text-sm text-base4 m-0;
  }

  .enterprise-info {
    @apply p-6 rounded-2xl;
    @apply border border-base14/20 bg-base14/5;
    backdrop-filter: blur(10px);

    h3 {
      @apply text-sm font-semibold text-base14 mb-3 tracking-tight;
    }

    p {
      @apply text-sm text-base5 mb-3 leading-relaxed;
    }

    ul {
      @apply list-none p-0 mb-4 space-y-2;

      li {
        @apply text-sm text-base6 pl-5 relative;

        &::before {
          content: '✓';
          @apply absolute left-0 text-base14 font-bold;
        }
      }
    }

    .enterprise-note {
      @apply text-xs text-base14 font-medium mt-4 mb-0;
    }
  }

  .availability-info {
    @apply flex gap-4 p-6 rounded-2xl;
    @apply border border-base3/15 bg-base1/30;
    backdrop-filter: blur(10px);
  }

  .availability-icon {
    @apply flex-shrink-0 mt-1;
    color: var(--color-base14);
    opacity: 0.8;
  }

  .availability-content {
    @apply flex-1;

    h3 {
      @apply text-sm font-semibold text-base6 mb-2 tracking-tight;
    }

    p {
      @apply text-sm text-base5 mb-2 leading-relaxed;
    }

    .availability-note {
      @apply text-xs text-base4 italic mt-3 mb-0;
    }
  }

  .form-group {
    @apply mb-6;

    label {
      @apply block text-base7 font-medium mb-2;
    }

    .input-wrapper {
      @apply relative;
    }

    .input-icon {
      @apply absolute right-3 top-1/2 -translate-y-1/2;
    }

    input,
    textarea {
      @apply w-full bg-base0 text-base6 rounded-xs p-3;
      @apply border border-base3/30 focus:border-base14/50;
      @apply focus:outline-none focus:ring-2 focus:ring-base14/20;
      @apply placeholder:text-base4/70;
      @apply pr-10; /* Space for icon */
    }

    textarea {
      @apply resize-none;
    }

    .input-error {
      @apply border-base8/50 focus:border-base8/70 focus:ring-base8/20;
    }
  }

  .error-message {
    @apply text-base8 text-sm mt-1;
  }

  .form-error {
    @apply bg-base8/10 border border-base8/30 p-4 rounded-xs mb-4 text-center;
    p {
      @apply text-base8 text-sm;
    }
  }

  .success-message {
    @apply bg-base10/10 border border-base10/30 p-8 rounded-xs text-center;

    h2 {
      @apply text-2xl font-bold text-base10 mb-4;
    }

    p {
      @apply text-lg text-base5 mb-6;
    }
  }

  /* Hide honeypot fields from humans but keep them accessible to bots */
  .honeypot {
    @apply opacity-0 absolute left-0 top-0 h-0 w-0 -z-10 overflow-hidden;
  }

  /* Mobile responsive styles */
  @media (max-width: 768px) {
    .contact-container {
      @apply px-4 pb-12;
    }

    .contact-header {
      @apply pt-6 pb-8;
    }

    .page-title {
      @apply text-3xl mb-3;
    }

    .page-subtitle {
      @apply text-lg mb-4;
    }

    .form-wrapper {
      @apply flex-col gap-8;
    }

    .contact-form,
    .contact-info {
      @apply p-4;
    }
  }

  @media (max-width: 414px) {
    .contact-container {
      @apply px-3 pb-8;
    }

    .contact-header {
      @apply pt-4 pb-6;
    }

    .page-title {
      @apply text-2xl mb-2;
    }

    .page-subtitle {
      @apply text-base mb-3;
    }

    .form-wrapper {
      @apply gap-6;
    }

    .contact-form,
    .contact-info {
      @apply p-3;
    }

    .form-group {
      @apply mb-4;
    }

    .form-label {
      @apply text-sm mb-1;
    }

    .form-input input,
    .form-input textarea {
      @apply p-2 text-sm;
    }

    .btn {
      @apply px-4 py-2 text-sm;
    }
  }
</style>

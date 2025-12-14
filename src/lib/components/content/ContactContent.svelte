<script>
  import { onMount } from 'svelte';
  import {UserRound, Email} from '$components/icons';
  import {Button} from '$components/jera';

  let mounted = $state(false);

  const API_ENDPOINT = 'https://api.jko.ai/api/contact';

  let formData = $state({
    name: '',
    email: '',
    company: '',
    message: '',
    website: '',
    phone: ''
  });

  let formState = $state({
    submitting: false,
    success: false,
    error: null,
    message: ''
  });

  let validationErrors = $state({
    name: null,
    email: null,
    message: null
  });

  function validateName(name) {
    if (!name || name.trim().length < 2) {
      return 'Required';
    }
    return null;
  }

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return 'Valid email required';
    }
    return null;
  }

  function validateMessage(message) {
    if (!message || message.trim().length < 10) {
      return 'Please provide details about your data requirements';
    }
    return null;
  }

  function validateForm() {
    validationErrors.name = validateName(formData.name);
    validationErrors.email = validateEmail(formData.email);
    validationErrors.message = validateMessage(formData.message);
    return !validationErrors.name && !validationErrors.email && !validationErrors.message;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validateForm()) return;

    formState.submitting = true;

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        source: 'oraklex.com',
        company: formData.company || undefined
      };

      if (formData.website) payload.website = formData.website;
      if (formData.phone) payload.phone = formData.phone;

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to submit');
      }

      formState.success = true;
      formState.message = 'Request received. We will respond within 1-2 business days.';

      formData.name = '';
      formData.email = '';
      formData.company = '';
      formData.message = '';
      formData.website = '';
      formData.phone = '';
    } catch (error) {
      console.error('Contact form error:', error);
      formState.success = false;
      formState.error = error;
      formState.message = 'Submission failed. Please email partners@oraklex.com directly.';
    } finally {
      formState.submitting = false;
    }
  }

  function resetForm() {
    formData.name = '';
    formData.email = '';
    formData.company = '';
    formData.message = '';
    formState.success = false;
    formState.error = null;
    formState.message = '';
    validationErrors.name = null;
    validationErrors.email = null;
    validationErrors.message = null;
  }

  onMount(() => {
    mounted = true;
  });
</script>

<div class="contact-content" class:mounted>
  <div class="contact-wrapper">
    <div class="contact-grid">
    <div class="contact-main">
      <div class="contact-intro">
        <h2>Request Data Access</h2>
        <p>
          For enterprise data licensing, API access, and partnership inquiries.
        </p>
      </div>

      {#if formState.success}
        <div class="success-message">
          <h3>Request Submitted</h3>
          <p>{formState.message}</p>
          <Button variant="primary" onclick={resetForm} class="mt-4">Submit Another Request</Button>
        </div>
      {:else}
        <form onsubmit={handleSubmit} class="contact-form">
          <div class="form-row">
            <div class="form-group">
              <label for="name">Name <span class="required">*</span></label>
              <input
                id="name"
                type="text"
                bind:value={formData.name}
                onblur={() => (validationErrors.name = validateName(formData.name))}
                placeholder="Full name"
                disabled={formState.submitting}
                maxlength="100"
                class:input-error={validationErrors.name}
              />
              {#if validationErrors.name}
                <p class="error-message">{validationErrors.name}</p>
              {/if}
            </div>

            <div class="form-group">
              <label for="company">Company</label>
              <input
                id="company"
                type="text"
                bind:value={formData.company}
                placeholder="Organization name"
                disabled={formState.submitting}
                maxlength="100"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email <span class="required">*</span></label>
            <input
              id="email"
              type="email"
              bind:value={formData.email}
              onblur={() => (validationErrors.email = validateEmail(formData.email))}
              placeholder="work@company.com"
              disabled={formState.submitting}
              maxlength="255"
              class:input-error={validationErrors.email}
            />
            {#if validationErrors.email}
              <p class="error-message">{validationErrors.email}</p>
            {/if}
          </div>

          <div class="form-group">
            <label for="message">Requirements <span class="required">*</span></label>
            <textarea
              id="message"
              bind:value={formData.message}
              onblur={() => (validationErrors.message = validateMessage(formData.message))}
              rows="5"
              placeholder="Describe your data requirements, use case, and volume needs."
              disabled={formState.submitting}
              maxlength="2000"
              class:input-error={validationErrors.message}
            ></textarea>
            {#if validationErrors.message}
              <p class="error-message">{validationErrors.message}</p>
            {/if}
          </div>

          <!-- Honeypot fields -->
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
            {formState.submitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </form>
      {/if}
    </div>

    <div class="contact-sidebar">
      <div class="email-card">
        <span class="card-label">Enterprise Inquiries</span>
        <a href="mailto:partners@oraklex.com" class="email-address">partners@oraklex.com</a>
      </div>

      <div class="info-card">
        <h3>Engagement Types</h3>
        <ul class="engagement-list">
          <li>
            <span class="engagement-type">Data Licensing</span>
            <span class="engagement-desc">Batch dataset exports</span>
          </li>
          <li>
            <span class="engagement-type">API Access</span>
            <span class="engagement-desc">Real-time prediction</span>
          </li>
          <li>
            <span class="engagement-type">Custom Feeds</span>
            <span class="engagement-desc">Dedicated pipelines</span>
          </li>
        </ul>
      </div>

      <div class="info-card">
        <h3>Response Time</h3>
        <p>1-2 business days for initial response. Enterprise evaluations typically begin within one week.</p>
      </div>

      <div class="links-card">
        <h3>Resources</h3>
        <div class="resource-links">
          <a href="/data" class="resource-link">
            <span class="resource-name">Data Schema</span>
            <span class="resource-desc">Event structure and fields</span>
          </a>
          <a href="/solutions" class="resource-link">
            <span class="resource-name">Products</span>
            <span class="resource-desc">Available data products</span>
          </a>
          <a href="https://jko.ai" target="_blank" rel="noopener" class="resource-link">
            <span class="resource-name">J'ko AI</span>
            <span class="resource-desc">Data source platform</span>
          </a>
        </div>
      </div>
    </div>
    </div>
  </div>
</div>

<style lang="postcss">
  @reference '$theme';

  .contact-content {
    @apply text-base5;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .contact-content.mounted {
    opacity: 1;
    transform: translateY(0);
  }

  .contact-wrapper {
    @apply mx-auto max-w-6xl px-8 py-12;
  }

  .contact-grid {
    @apply grid gap-10;
    grid-template-columns: 1fr;
  }

  @media (min-width: 768px) {
    .contact-grid {
      grid-template-columns: 1fr 300px;
    }
  }

  .contact-intro {
    @apply mb-6;
  }

  .contact-intro h2 {
    @apply text-2xl font-semibold text-base6 mb-2;
    letter-spacing: -0.02em;
  }

  .contact-intro p {
    @apply text-base text-base4;
  }

  /* Form styles - Theme aware */
  .contact-form {
    @apply bg-base1 border border-base3 p-6;
    border-radius: 12px;
  }

  .form-row {
    @apply grid gap-4 mb-4;
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 640px) {
    .form-row {
      grid-template-columns: 1fr;
    }
  }

  .form-group {
    @apply mb-4;
  }

  .form-group label {
    @apply block text-sm font-medium text-base5 mb-1.5;
  }

  .required {
    @apply text-base8;
  }

  .contact-form input,
  .contact-form textarea {
    @apply w-full py-3 px-4 text-sm bg-base0 text-base6 border border-base3;
    border-radius: 10px;
    transition: all 0.2s ease;
  }

  .contact-form input:focus,
  .contact-form textarea:focus {
    @apply outline-none border-base14 bg-base0;
    box-shadow: 0 0 0 3px rgba(var(--color-base14-rgb), 0.1);
  }

  .contact-form input::placeholder,
  .contact-form textarea::placeholder {
    @apply text-base4;
  }

  .contact-form textarea {
    resize: none;
    min-height: 120px;
  }

  .contact-form input.input-error,
  .contact-form textarea.input-error {
    @apply border-base8 bg-base8/5;
  }

  .error-message {
    @apply text-xs text-base8 mt-1;
  }

  .form-error {
    @apply bg-base8/10 border border-base8/30 p-3 mb-4;
    border-radius: 10px;
  }

  .form-error p {
    @apply text-sm text-base8;
  }

  .honeypot {
    @apply opacity-0 absolute left-0 top-0 h-0 w-0 -z-10 overflow-hidden;
  }

  .success-message {
    @apply bg-base10/10 border border-base10/30 p-8 text-center;
    border-radius: 12px;
  }

  .success-message h3 {
    @apply text-xl font-semibold text-base10 mb-2;
  }

  .success-message p {
    @apply text-sm text-base5;
  }

  /* Sidebar styles - Theme aware */
  .contact-sidebar {
    @apply flex flex-col gap-4;
  }

  .email-card {
    @apply text-center bg-base14/10 border border-base14/20 p-5;
    border-radius: 12px;
  }

  .card-label {
    @apply block text-xs font-semibold uppercase tracking-wider text-base4 mb-2;
  }

  .email-address {
    @apply text-sm font-medium text-base14 no-underline;
  }

  .email-address:hover {
    @apply underline;
  }

  .info-card,
  .links-card {
    @apply p-4 bg-base1 border border-base3;
    border-radius: 12px;
  }

  .info-card h3,
  .links-card h3 {
    @apply text-sm font-semibold text-base6 mb-3;
  }

  .info-card p {
    @apply text-xs text-base4 leading-relaxed;
  }

  .engagement-list {
    @apply flex flex-col gap-0;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .engagement-list li {
    @apply flex justify-between items-center py-2.5 border-b border-base2;
  }

  .engagement-list li:last-child {
    @apply border-b-0;
  }

  .engagement-type {
    @apply text-xs font-medium text-base6;
  }

  .engagement-desc {
    @apply text-xs text-base4;
  }

  .resource-links {
    @apply flex flex-col gap-2;
  }

  .resource-link {
    @apply flex justify-between items-center py-2.5 px-3 bg-base2 no-underline;
    border-radius: 8px;
    transition: all 0.2s ease;
  }

  .resource-link:hover {
    @apply bg-base3/50;
  }

  .resource-name {
    @apply text-xs font-medium text-base6;
  }

  .resource-desc {
    @apply text-xs text-base4;
  }

  @media (max-width: 768px) {
    .contact-wrapper {
      @apply px-5 py-8;
    }

    .contact-form {
      @apply p-5;
    }
  }
</style>

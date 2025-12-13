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
    color: #1a1a1a;
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
    display: grid;
    gap: 2.5rem;
    grid-template-columns: 1fr;
  }

  @media (min-width: 768px) {
    .contact-grid {
      grid-template-columns: 1fr 280px;
    }
  }

  .contact-intro {
    margin-bottom: 1.5rem;
  }

  .contact-intro h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #111;
    margin: 0 0 0.5rem;
    letter-spacing: -0.02em;
  }

  .contact-intro p {
    font-size: 0.95rem;
    color: #555;
    margin: 0;
  }

  /* Form styles */
  .contact-form {
    background: #fff;
    border-radius: 0.75rem;
    border: 1px solid #e5e5e5;
    padding: 1.5rem;
  }

  .form-row {
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr 1fr;
    margin-bottom: 1rem;
  }

  @media (max-width: 640px) {
    .form-row {
      grid-template-columns: 1fr;
    }
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-group label {
    display: block;
    font-size: 0.8rem;
    font-weight: 500;
    color: #333;
    margin-bottom: 0.375rem;
  }

  .required {
    color: #e53e3e;
  }

  .contact-form input,
  .contact-form textarea {
    width: 100%;
    padding: 0.625rem 0.875rem;
    font-size: 0.9rem;
    border: 1px solid #e0e0e0;
    border-radius: 0.375rem;
    background: #fafafa;
    color: #111;
    transition: all 0.2s ease;
  }

  .contact-form input:focus,
  .contact-form textarea:focus {
    outline: none;
    border-color: #4a9eff;
    background: #fff;
    box-shadow: 0 0 0 2px rgba(74, 158, 255, 0.1);
  }

  .contact-form input::placeholder,
  .contact-form textarea::placeholder {
    color: #999;
  }

  .contact-form textarea {
    resize: none;
  }

  .contact-form input.input-error,
  .contact-form textarea.input-error {
    border-color: #e53e3e;
    background: #fff5f5;
  }

  .error-message {
    font-size: 0.75rem;
    color: #e53e3e;
    margin: 0.25rem 0 0 0;
  }

  .form-error {
    background: #fff5f5;
    border: 1px solid #feb2b2;
    padding: 0.75rem;
    border-radius: 0.375rem;
    margin-bottom: 1rem;
  }

  .form-error p {
    font-size: 0.8rem;
    color: #c53030;
    margin: 0;
  }

  .honeypot {
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
    height: 0;
    width: 0;
    z-index: -10;
    overflow: hidden;
  }

  .success-message {
    background: linear-gradient(145deg, rgba(72, 187, 120, 0.08), #fff);
    border: 1px solid rgba(72, 187, 120, 0.2);
    padding: 2rem;
    border-radius: 0.75rem;
    text-align: center;
  }

  .success-message h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #276749;
    margin: 0 0 0.5rem;
  }

  .success-message p {
    font-size: 0.9rem;
    color: #555;
    margin: 0;
  }

  /* Sidebar styles */
  .contact-sidebar {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .email-card {
    text-align: center;
    background: linear-gradient(145deg, rgba(74, 158, 255, 0.06), #fff);
    border: 1px solid rgba(74, 158, 255, 0.15);
    border-radius: 0.75rem;
    padding: 1.25rem;
  }

  .card-label {
    display: block;
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #666;
    margin-bottom: 0.5rem;
  }

  .email-address {
    font-size: 0.9rem;
    font-weight: 500;
    color: #4a9eff;
    text-decoration: none;
  }

  .email-address:hover {
    text-decoration: underline;
  }

  .info-card,
  .links-card {
    padding: 1rem;
    background: #fff;
    border-radius: 0.75rem;
    border: 1px solid #e5e5e5;
  }

  .info-card h3,
  .links-card h3 {
    font-size: 0.8rem;
    font-weight: 600;
    color: #111;
    margin: 0 0 0.75rem;
  }

  .info-card p {
    font-size: 0.75rem;
    color: #555;
    margin: 0;
    line-height: 1.5;
  }

  .engagement-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .engagement-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #f0f0f0;
  }

  .engagement-list li:last-child {
    border-bottom: none;
  }

  .engagement-type {
    font-size: 0.75rem;
    font-weight: 500;
    color: #111;
  }

  .engagement-desc {
    font-size: 0.7rem;
    color: #888;
  }

  .resource-links {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .resource-link {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0.625rem;
    background: #f8f8f8;
    border-radius: 0.375rem;
    text-decoration: none;
    transition: all 0.2s;
  }

  .resource-link:hover {
    background: #f0f0f0;
  }

  .resource-name {
    font-size: 0.75rem;
    font-weight: 500;
    color: #111;
  }

  .resource-desc {
    font-size: 0.65rem;
    color: #888;
  }

  @media (max-width: 768px) {
    .contact-wrapper {
      @apply px-5 py-8;
    }
  }
</style>

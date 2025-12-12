<script>
  import { onMount } from 'svelte';
  import {UserRound, Email} from '$components/icons';
  import {Button} from '$components/jera';

  let mounted = $state(false);

  // API endpoint URL
  const API_ENDPOINT = 'https://api.jko.ai/api/contact';

  // Form state with Svelte 5 runes
  let formData = $state({
    name: '',
    email: '',
    message: '',
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
      return 'Please enter your name (at least 2 characters)';
    }
    if (name.length > 100) {
      return 'Name must be less than 100 characters';
    }
    return null;
  }

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    if (email.length > 255) {
      return 'Email must be less than 255 characters';
    }
    return null;
  }

  function validateMessage(message) {
    if (!message || message.trim().length < 10) {
      return 'Please enter a message (at least 10 characters)';
    }
    if (message.length > 2000) {
      return 'Message must be less than 2000 characters';
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
        source: 'oraklex.com'
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
        throw new Error(result.error || 'Failed to submit contact form');
      }

      formState.success = true;
      formState.message = result.message || 'Thank you! Your message has been received. We\'ll get back to you within 1-2 business days.';

      formData.name = '';
      formData.email = '';
      formData.message = '';
      formData.website = '';
      formData.phone = '';
    } catch (error) {
      console.error('Contact form error:', error);
      formState.success = false;
      formState.error = error;
      formState.message = error.message || 'Something went wrong. Please try emailing us directly at partners@oraklex.com';
    } finally {
      formState.submitting = false;
    }
  }

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

  onMount(() => {
    mounted = true;
  });
</script>

<div class="contact-content" class:mounted>
  <div class="contact-grid">
    <div class="contact-main">
      <div class="contact-intro">
        <h2>Let's Talk</h2>
        <p>
          Tell us what you're building. We'll tell you if our data can help.
        </p>
      </div>

      {#if formState.success}
        <div class="success-message">
          <h3>Message Sent!</h3>
          <p>{formState.message}</p>
          <Button variant="primary" onclick={resetForm} class="mt-4">Send Another Message</Button>
        </div>
      {:else}
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
                class:input-error={validationErrors.name}
              />
              <div class="input-icon">
                <UserRound size={18} color={validationErrors.name ? '#e53e3e' : '#888'} />
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
                class:input-error={validationErrors.email}
              />
              <div class="input-icon">
                <Email size={18} color={validationErrors.email ? '#e53e3e' : '#888'} />
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
              rows="5"
              placeholder="What are you building? What kind of data would help? The more context, the better we can help."
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
            {formState.submitting ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      {/if}
    </div>

    <div class="contact-sidebar">
      <div class="email-card">
        <div class="card-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect width="20" height="16" x="2" y="4" rx="2"/>
            <path d="m2 7 8.97 5.7a1.94 1.94 0 0 0 2.06 0L22 7"/>
          </svg>
        </div>
        <a href="mailto:partners@oraklex.com" class="email-address">partners@oraklex.com</a>
        <p>All inquiries and partnerships</p>
      </div>

      <div class="partnership-card">
        <h3>Ways to Work Together</h3>
        <p>Depends on what you need:</p>
        <ul>
          <li>Training datasets (batch licensing)</li>
          <li>Prediction API (subscription)</li>
          <li>Custom data feeds (enterprise)</li>
          <li>Strategic partnerships (let's talk)</li>
        </ul>
      </div>

      <div class="info-card">
        <h3>Response Time</h3>
        <p>We read every message. Real humans, not autoresponders.</p>
        <p class="note">Expect a response within 1-2 business days.</p>
      </div>

      <div class="products-card">
        <h3>Quick Links</h3>
        <div class="product-links">
          <a href="https://jko.ai" target="_blank" rel="noopener" class="product-link">
            <span class="product-name">J'ko AI</span>
            <span class="product-desc">See where the data comes from</span>
          </a>
          <a href="/solutions" class="product-link">
            <span class="product-name">Platform</span>
            <span class="product-desc">Browse all products</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
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

  .contact-grid {
    display: grid;
    gap: 2rem;
    grid-template-columns: 1fr;
  }

  @media (min-width: 768px) {
    .contact-grid {
      grid-template-columns: 1fr 320px;
    }
  }

  .contact-intro {
    margin-bottom: 1.5rem;
  }

  .contact-intro h2 {
    font-size: 2rem;
    font-weight: 600;
    color: #111;
    margin: 0 0 0.75rem;
  }

  .contact-intro p {
    font-size: 1.1rem;
    color: #555;
    margin: 0;
    line-height: 1.6;
  }

  /* Form styles */
  .contact-form {
    background: #fff;
    border-radius: 1rem;
    border: 1px solid #e5e5e5;
    padding: 1.5rem;
  }

  .form-group {
    margin-bottom: 1.25rem;
  }

  .form-group label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #333;
    margin-bottom: 0.5rem;
  }

  .input-wrapper {
    position: relative;
  }

  .input-icon {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
  }

  .contact-form input,
  .contact-form textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    padding-right: 2.5rem;
    font-size: 0.95rem;
    border: 1px solid #e0e0e0;
    border-radius: 0.5rem;
    background: #fafafa;
    color: #111;
    transition: all 0.2s ease;
  }

  .contact-form input:focus,
  .contact-form textarea:focus {
    outline: none;
    border-color: #4a9eff;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(74, 158, 255, 0.1);
  }

  .contact-form input::placeholder,
  .contact-form textarea::placeholder {
    color: #999;
  }

  .contact-form textarea {
    padding-right: 1rem;
    resize: none;
  }

  .contact-form input.input-error,
  .contact-form textarea.input-error {
    border-color: #e53e3e;
    background: #fff5f5;
  }

  .error-message {
    font-size: 0.8rem;
    color: #e53e3e;
    margin: 0.375rem 0 0 0;
  }

  .form-error {
    background: #fff5f5;
    border: 1px solid #feb2b2;
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
  }

  .form-error p {
    font-size: 0.875rem;
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
    background: linear-gradient(145deg, rgba(72, 187, 120, 0.1), #fff);
    border: 1px solid rgba(72, 187, 120, 0.3);
    padding: 2rem;
    border-radius: 1rem;
    text-align: center;
  }

  .success-message h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #276749;
    margin: 0 0 0.75rem;
  }

  .success-message p {
    font-size: 1rem;
    color: #555;
    margin: 0;
    line-height: 1.6;
  }

  /* Sidebar styles */
  .contact-sidebar {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .email-card {
    text-align: center;
    background: linear-gradient(145deg, rgba(74, 158, 255, 0.08), #fff);
    border: 1px solid rgba(74, 158, 255, 0.2);
    border-radius: 1rem;
    padding: 1.5rem;
  }

  .card-icon {
    color: #4a9eff;
    margin-bottom: 0.75rem;
  }

  .email-address {
    display: block;
    font-size: 1rem;
    font-weight: 500;
    color: #4a9eff;
    text-decoration: none;
    margin-bottom: 0.25rem;
  }

  .email-address:hover {
    text-decoration: underline;
  }

  .email-card p {
    font-size: 0.8rem;
    color: #666;
    margin: 0;
  }

  .partnership-card,
  .products-card,
  .info-card {
    padding: 1.25rem;
    background: #fff;
    border-radius: 1rem;
    border: 1px solid #e5e5e5;
  }

  .partnership-card {
    background: linear-gradient(145deg, rgba(74, 158, 255, 0.05), #fff);
    border-color: rgba(74, 158, 255, 0.15);
  }

  .partnership-card h3,
  .products-card h3,
  .info-card h3 {
    font-size: 0.95rem;
    font-weight: 600;
    color: #111;
    margin: 0 0 0.5rem;
  }

  .partnership-card p,
  .info-card p {
    font-size: 0.8rem;
    color: #555;
    margin: 0 0 0.5rem;
    line-height: 1.5;
  }

  .info-card .note {
    margin-top: 0.5rem;
    font-size: 0.75rem;
    color: #888;
    font-style: italic;
  }

  .partnership-card ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .partnership-card li {
    font-size: 0.75rem;
    color: #444;
    padding: 0.375rem 0;
    padding-left: 1.25rem;
    position: relative;
    border-bottom: 1px solid #f0f0f0;
  }

  .partnership-card li:last-child {
    border-bottom: none;
  }

  .partnership-card li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #4a9eff;
    font-weight: 600;
  }

  .product-links {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .product-link {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.625rem 0.875rem;
    background: #f8f8f8;
    border-radius: 0.5rem;
    text-decoration: none;
    transition: all 0.2s;
  }

  .product-link:hover {
    background: #f0f0f0;
  }

  .product-name {
    font-size: 0.85rem;
    font-weight: 500;
    color: #111;
  }

  .product-desc {
    font-size: 0.7rem;
    color: #888;
  }
</style>

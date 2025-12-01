<script>
  import { onMount } from 'svelte';

  let mounted = $state(false);

  onMount(() => {
    mounted = true;
  });
</script>

<div class="contact-content" class:mounted>
  <div class="contact-grid">
    <div class="contact-main">
      <div class="contact-intro">
        <h2>Let's Connect</h2>
        <p>
          Interested in partnering with us, licensing data, or learning more about the Data Oracle ecosystem? We'd love to hear from you.
        </p>
      </div>

      <div class="contact-cards">
        <a href="mailto:partners@oraklex.com" class="contact-card email-card">
          <div class="card-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect width="20" height="16" x="2" y="4" rx="2"/>
              <path d="m2 7 8.97 5.7a1.94 1.94 0 0 0 2.06 0L22 7"/>
            </svg>
          </div>
          <h3>Email Us</h3>
          <span class="email-address">partners@oraklex.com</span>
          <p>For all inquiries and partnerships</p>
        </a>

        <div class="contact-card info-card">
          <h3>Response Times</h3>
          <p>We monitor support requests during business hours (Monday-Friday).</p>
          <p class="note">Most messages receive a response within 1-2 business days.</p>
        </div>
      </div>
    </div>

    <div class="contact-sidebar">
      <div class="partnership-card">
        <h3>Partnership Opportunities</h3>
        <p>We're looking for:</p>
        <ul>
          <li>AI companies needing commerce training data</li>
          <li>E-commerce brands for data contribution</li>
          <li>Technology partners for integrations</li>
          <li>Investors aligned with our vision</li>
        </ul>
      </div>

      <div class="products-card">
        <h3>Our Products</h3>
        <div class="product-links">
          <a href="https://jko.ai" target="_blank" rel="noopener" class="product-link">
            <span class="product-name">J'ko AI</span>
            <span class="product-desc">Virtual Try-On</span>
          </a>
          <a href="https://dash.jko.ai" target="_blank" rel="noopener" class="product-link">
            <span class="product-name">Dashboard</span>
            <span class="product-desc">Manage your account</span>
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
    margin-bottom: 2rem;
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

  .contact-cards {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .contact-card {
    padding: 2rem;
    background: #fff;
    border-radius: 1rem;
    border: 1px solid #e5e5e5;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;
  }

  .email-card {
    text-align: center;
    background: linear-gradient(145deg, rgba(74, 158, 255, 0.08), #fff);
    border-color: rgba(74, 158, 255, 0.2);
  }

  .email-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(74, 158, 255, 0.15);
    border-color: rgba(74, 158, 255, 0.3);
  }

  .card-icon {
    color: #4a9eff;
    margin-bottom: 1rem;
  }

  .contact-card h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111;
    margin: 0 0 0.5rem;
  }

  .email-address {
    display: block;
    font-size: 1.1rem;
    font-weight: 500;
    color: #4a9eff;
    margin-bottom: 0.5rem;
  }

  .contact-card p {
    font-size: 0.9rem;
    color: #666;
    margin: 0;
  }

  .info-card .note {
    margin-top: 0.75rem;
    font-size: 0.8rem;
    color: #888;
    font-style: italic;
  }

  .contact-sidebar {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .partnership-card,
  .products-card {
    padding: 1.5rem;
    background: #fff;
    border-radius: 1rem;
    border: 1px solid #e5e5e5;
  }

  .partnership-card {
    background: linear-gradient(145deg, rgba(74, 158, 255, 0.05), #fff);
    border-color: rgba(74, 158, 255, 0.15);
  }

  .partnership-card h3,
  .products-card h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #111;
    margin: 0 0 0.75rem;
  }

  .partnership-card p {
    font-size: 0.875rem;
    color: #555;
    margin: 0 0 0.75rem;
  }

  .partnership-card ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .partnership-card li {
    font-size: 0.8rem;
    color: #444;
    padding: 0.5rem 0;
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
    gap: 0.75rem;
  }

  .product-link {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: #f8f8f8;
    border-radius: 0.5rem;
    text-decoration: none;
    transition: all 0.2s;
  }

  .product-link:hover {
    background: #f0f0f0;
  }

  .product-name {
    font-size: 0.9rem;
    font-weight: 500;
    color: #111;
  }

  .product-desc {
    font-size: 0.75rem;
    color: #888;
  }
</style>

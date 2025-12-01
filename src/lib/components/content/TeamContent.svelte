<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

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
      { threshold: 0.15, rootMargin: '50px 0px' }
    );

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  });

  const leadership = [
    {
      name: 'Founder & CEO',
      role: 'Vision & Strategy',
      bio: 'Building the Data Oracle for e-commerce. Combining AI planning technology with unique behavioral data to create the intelligence layer that powers the next generation of commerce.',
      expertise: ['E-Commerce Strategy', 'AI/ML Systems', 'Data Monetization', 'Product Vision'],
      placeholder: true
    }
  ];

  const advisors = [
    {
      name: 'Andrew Gree',
      role: 'AI Planning Advisor',
      company: 'HyperC',
      bio: 'Founder of HyperC, pioneering AI Planning and the Large Retail Model (LRM) for autonomous e-commerce optimization.',
      expertise: ['AI Planning', 'Large Retail Model', 'Optimization Mathematics', 'E-Commerce AI'],
      link: 'https://hyperc.com'
    }
  ];

  const partners = [
    {
      name: 'HyperC',
      type: 'Technology Partner',
      description: 'AI Planning and Large Retail Model technology for inventory, pricing, and demand optimization.',
      contribution: 'HyperCDB planning database and LRM algorithms'
    },
    {
      name: 'Meta',
      type: 'Platform Partner',
      description: 'Official Meta Tech Provider status for Instagram and Facebook commerce integrations.',
      contribution: 'Platform APIs and verified partnership'
    },
    {
      name: 'Shopify',
      type: 'Commerce Partner',
      description: 'Native integration for real-time inventory, pricing, and order management.',
      contribution: 'E-commerce infrastructure and attribution'
    }
  ];

  const getDelay = (index, base = 0) => base + index * 0.1;
</script>

<div class="team-content">
  <section class="leadership-section" data-animate="leadership" class:visible={visibleSections.has('leadership')}>
    <div class="section-header">
      <span class="section-eyebrow">Leadership</span>
      <h2>Driving the Vision</h2>
    </div>

    <div class="leadership-grid">
      {#each leadership as person, i}
        <article
          class="person-card featured"
          data-animate={`leader-${i}`}
          class:visible={visibleSections.has(`leader-${i}`)}
          style={`--delay: ${getDelay(i)}s`}
        >
          <div class="person-avatar">
            {#if person.placeholder}
              <div class="avatar-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
                </svg>
              </div>
            {/if}
          </div>
          <div class="person-info">
            <h3>{person.name}</h3>
            <span class="person-role">{person.role}</span>
            <p class="person-bio">{person.bio}</p>
            <div class="expertise-tags">
              {#each person.expertise as skill}
                <span class="tag">{skill}</span>
              {/each}
            </div>
          </div>
        </article>
      {/each}
    </div>
  </section>

  <section class="advisors-section" data-animate="advisors" class:visible={visibleSections.has('advisors')}>
    <div class="section-header">
      <span class="section-eyebrow">Advisors</span>
      <h2>Expert Guidance</h2>
      <p>Industry leaders providing strategic direction and technical expertise.</p>
    </div>

    <div class="advisors-grid">
      {#each advisors as advisor, i}
        <article
          class="advisor-card"
          data-animate={`advisor-${i}`}
          class:visible={visibleSections.has(`advisor-${i}`)}
          style={`--delay: ${getDelay(i, 0.1)}s`}
        >
          <div class="advisor-header">
            <div class="advisor-avatar">
              <span class="avatar-initial">{advisor.name.charAt(0)}</span>
            </div>
            <div class="advisor-title">
              <h3>{advisor.name}</h3>
              <span class="advisor-role">{advisor.role}</span>
              {#if advisor.company}
                <a href={advisor.link} class="advisor-company" target="_blank" rel="noopener">
                  {advisor.company}
                </a>
              {/if}
            </div>
          </div>
          <p class="advisor-bio">{advisor.bio}</p>
          <div class="expertise-tags">
            {#each advisor.expertise as skill}
              <span class="tag">{skill}</span>
            {/each}
          </div>
        </article>
      {/each}
    </div>
  </section>

  <section class="partners-section" data-animate="partners" class:visible={visibleSections.has('partners')}>
    <div class="section-header">
      <span class="section-eyebrow">Strategic Partners</span>
      <h2>Building Together</h2>
      <p>Key partnerships that power the Oraklex ecosystem.</p>
    </div>

    <div class="partners-grid">
      {#each partners as partner, i}
        <article
          class="partner-card"
          data-animate={`partner-${i}`}
          class:visible={visibleSections.has(`partner-${i}`)}
          style={`--delay: ${getDelay(i, 0.15)}s`}
        >
          <div class="partner-header">
            <h3>{partner.name}</h3>
            <span class="partner-type">{partner.type}</span>
          </div>
          <p class="partner-description">{partner.description}</p>
          <div class="partner-contribution">
            <strong>Contribution:</strong> {partner.contribution}
          </div>
        </article>
      {/each}
    </div>
  </section>
</div>

<style lang="postcss">
  .team-content {
    color: #1a1a1a;
  }

  .section-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .section-eyebrow {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #666;
  }

  .section-header h2 {
    font-size: 2rem;
    font-weight: 600;
    color: #111;
    margin: 0.5rem 0;
  }

  .section-header p {
    color: #666;
    margin-top: 0.5rem;
  }

  .leadership-section,
  .advisors-section,
  .partners-section {
    padding: 3rem 0;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .leadership-section.visible,
  .advisors-section.visible,
  .partners-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .leadership-grid {
    display: flex;
    justify-content: center;
  }

  .person-card {
    max-width: 600px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 2rem;
    background: #fff;
    border-radius: 1rem;
    border: 1px solid #e5e5e5;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: var(--delay, 0s);
  }

  .person-card.visible {
    opacity: 1;
    transform: translateY(0);
  }

  @media (min-width: 640px) {
    .person-card {
      flex-direction: row;
    }
  }

  .avatar-placeholder {
    width: 80px;
    height: 80px;
    border-radius: 0.75rem;
    background: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #888;
  }

  .person-info h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111;
    margin: 0;
  }

  .person-role {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #4a9eff;
  }

  .person-bio {
    font-size: 0.9rem;
    color: #555;
    line-height: 1.6;
    margin: 0.5rem 0;
  }

  .expertise-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .tag {
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 500;
    background: #f5f5f5;
    color: #555;
  }

  .advisors-grid {
    max-width: 600px;
    margin: 0 auto;
  }

  .advisor-card {
    padding: 1.5rem;
    background: #fff;
    border-radius: 1rem;
    border: 1px solid #e5e5e5;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: var(--delay, 0s);
  }

  .advisor-card.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .advisor-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .advisor-avatar {
    width: 48px;
    height: 48px;
    border-radius: 0.75rem;
    background: linear-gradient(135deg, #4a9eff, #667eea);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .avatar-initial {
    font-size: 1.25rem;
    font-weight: 600;
    color: #fff;
  }

  .advisor-title h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111;
    margin: 0;
  }

  .advisor-role {
    font-size: 0.8rem;
    color: #666;
  }

  .advisor-company {
    font-size: 0.8rem;
    color: #4a9eff;
    text-decoration: none;
  }

  .advisor-company:hover {
    text-decoration: underline;
  }

  .advisor-bio {
    font-size: 0.875rem;
    color: #555;
    line-height: 1.6;
    margin: 0 0 1rem;
  }

  .partners-grid {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }

  .partner-card {
    padding: 1.5rem;
    background: #fff;
    border-radius: 1rem;
    border: 1px solid #e5e5e5;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: var(--delay, 0s);
  }

  .partner-card.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .partner-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .partner-header h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111;
    margin: 0;
  }

  .partner-type {
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #4a9eff;
  }

  .partner-description {
    font-size: 0.875rem;
    color: #555;
    margin: 0 0 1rem;
  }

  .partner-contribution {
    font-size: 0.8rem;
    color: #666;
    padding-top: 0.75rem;
    border-top: 1px solid #e5e5e5;
  }

  .partner-contribution strong {
    color: #4a9eff;
  }
</style>

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
  @reference '$theme';

  .team-content {
    @apply text-base5;
  }

  .section-header {
    @apply text-center mb-12;
  }

  .section-eyebrow {
    @apply text-xs font-semibold uppercase tracking-[0.2em] text-base4;
  }

  .section-header h2 {
    @apply text-2xl font-semibold text-base6 mt-2 mb-0;
    letter-spacing: -0.02em;
  }

  .section-header p {
    @apply text-base4 mt-2;
  }

  .leadership-section,
  .advisors-section,
  .partners-section {
    @apply py-12;
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
    @apply flex justify-center;
  }

  .person-card {
    @apply max-w-xl flex flex-col gap-6 p-8 bg-base1 border border-base3;
    border-radius: 12px;
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
      @apply flex-row;
    }
  }

  .avatar-placeholder {
    @apply w-20 h-20 flex items-center justify-center bg-base2 text-base4;
    border-radius: 12px;
  }

  .person-info h3 {
    @apply text-xl font-semibold text-base6 m-0;
  }

  .person-role {
    @apply text-xs font-semibold uppercase tracking-[0.15em] text-base14;
  }

  .person-bio {
    @apply text-sm text-base5 leading-relaxed my-2;
  }

  .expertise-tags {
    @apply flex flex-wrap gap-2 mt-2;
  }

  .tag {
    @apply px-3 py-1 text-xs font-medium bg-base2 text-base5;
    border-radius: 999px;
  }

  .advisors-grid {
    @apply max-w-xl mx-auto;
  }

  .advisor-card {
    @apply p-6 bg-base1 border border-base3;
    border-radius: 12px;
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
    @apply flex items-center gap-4 mb-4;
  }

  .advisor-avatar {
    @apply w-12 h-12 flex items-center justify-center bg-base14;
    border-radius: 12px;
  }

  .avatar-initial {
    @apply text-xl font-semibold text-white;
  }

  .advisor-title h3 {
    @apply text-lg font-semibold text-base6 m-0;
  }

  .advisor-role {
    @apply text-sm text-base4;
  }

  .advisor-company {
    @apply text-sm text-base14 no-underline;
  }

  .advisor-company:hover {
    @apply underline;
  }

  .advisor-bio {
    @apply text-sm text-base5 leading-relaxed mb-4;
  }

  .partners-grid {
    @apply grid gap-6;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }

  .partner-card {
    @apply p-6 bg-base1 border border-base3;
    border-radius: 12px;
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
    @apply flex justify-between items-center mb-3;
  }

  .partner-header h3 {
    @apply text-lg font-semibold text-base6 m-0;
  }

  .partner-type {
    @apply text-xs font-semibold uppercase tracking-[0.15em] text-base14;
  }

  .partner-description {
    @apply text-sm text-base5 mb-4;
  }

  .partner-contribution {
    @apply text-sm text-base4 pt-3 border-t border-base3;
  }

  .partner-contribution strong {
    @apply text-base14;
  }
</style>

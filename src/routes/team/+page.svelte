<script>
  import {onMount} from 'svelte';
  import {fade} from 'svelte/transition';
  import Metadata from '$features/seo/Metadata.svelte';
  import {Button} from '$components/jera';

  let mounted = $state(false);
  let visibleSections = $state(new Set());

  onMount(() => {
    mounted = true;

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
      {threshold: 0.15, rootMargin: '50px 0px'}
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
      bio: 'Founder of HyperC, pioneering AI Planning and the Large Retail Model (LRM) for autonomous e-commerce optimization. Expert in automated theorem proving and type theory applied to retail.',
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

  const expertise = [
    {
      area: 'AI & Machine Learning',
      description: 'Deep expertise in computer vision, natural language processing, and recommendation systems.',
      applications: ['Virtual Try-On Generation', 'Conversational AI', 'Intent Prediction']
    },
    {
      area: 'E-Commerce Data',
      description: 'Understanding of the complete commerce funnel from social discovery to purchase completion.',
      applications: ['Conversion Funnel Analysis', 'Attribution Modeling', 'Behavioral Signals']
    },
    {
      area: 'AI Planning',
      description: 'Mathematical optimization for inventory, pricing, and campaign decisions via HyperC partnership.',
      applications: ['Inventory Optimization', 'Dynamic Pricing', 'Demand Forecasting']
    },
    {
      area: 'Data Monetization',
      description: 'Experience structuring and licensing data assets to AI companies and enterprises.',
      applications: ['LLM Training Data', 'Privacy Compliance', 'Data Partnerships']
    }
  ];

  const getDelay = (index, base = 0) => base + index * 0.1;
</script>

<Metadata
  title="Team — Oraklex | AI Data Intelligence Experts"
  description="Meet the team building the Data Oracle for e-commerce. Experts in AI planning, data monetization, and commerce optimization."
/>

<main class="team-page">
  <section class="hero" class:mounted>
    <div class="hero-content">
      <span class="eyebrow">Our Team</span>
      <h1>Building the Future of Commerce Intelligence</h1>
      <p class="hero-description">
        A team of experts in AI, e-commerce, and data science working to create the intelligence layer that powers the next generation of commerce.
      </p>
    </div>
  </section>

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
          in:fade={{duration: 400, delay: i * 100}}
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
          in:fade={{duration: 400, delay: i * 100}}
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
          in:fade={{duration: 400, delay: i * 80}}
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

  <section class="expertise-section" data-animate="expertise" class:visible={visibleSections.has('expertise')}>
    <div class="section-header">
      <span class="section-eyebrow">Core Expertise</span>
      <h2>What We Know Best</h2>
      <p>Deep expertise across the technologies that power commerce intelligence.</p>
    </div>

    <div class="expertise-grid">
      {#each expertise as area, i}
        <article
          class="expertise-card"
          data-animate={`expertise-${i}`}
          class:visible={visibleSections.has(`expertise-${i}`)}
          style={`--delay: ${getDelay(i, 0.2)}s`}
          in:fade={{duration: 400, delay: i * 80}}
        >
          <h3>{area.area}</h3>
          <p>{area.description}</p>
          <ul class="applications-list">
            {#each area.applications as app}
              <li>{app}</li>
            {/each}
          </ul>
        </article>
      {/each}
    </div>
  </section>

  <section class="join-section" data-animate="join" class:visible={visibleSections.has('join')}>
    <div class="join-content">
      <h2>Join the Mission</h2>
      <p>
        We're always looking for exceptional people who want to shape the future of commerce intelligence. Whether you're an engineer, data scientist, or business leader - let's talk.
      </p>
      <div class="join-actions">
        <Button variant="primary" href="mailto:careers@oraklex.com">View Open Roles</Button>
        <Button variant="secondary" href="mailto:hello@oraklex.com">Get in Touch</Button>
      </div>
    </div>
  </section>
</main>

<style lang="postcss">
  @reference '$theme';

  .team-page {
    @apply min-h-screen bg-base0 text-base5;
  }

  .hero {
    @apply relative overflow-hidden px-6 py-24 text-center;
    background: linear-gradient(160deg, rgba(var(--color-base1-rgb), 0.9) 0%, rgba(var(--color-base0-rgb), 1) 55%, rgba(var(--color-base14-rgb), 0.08) 100%);
  }

  .hero-content {
    @apply relative mx-auto flex max-w-4xl flex-col items-center gap-6;
    opacity: 0;
    transform: translateY(24px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .hero.mounted .hero-content {
    opacity: 1;
    transform: translateY(0);
  }

  .eyebrow {
    @apply text-xs font-semibold uppercase tracking-[0.35em] text-base4;
  }

  h1 {
    @apply text-4xl font-semibold text-base6 md:text-5xl lg:text-6xl;
  }

  .hero-description {
    @apply max-w-2xl text-lg text-base4;
  }

  .section-header {
    @apply mx-auto mb-12 max-w-3xl text-center;
  }

  .section-eyebrow {
    @apply text-xs font-semibold uppercase tracking-[0.35em] text-base4;
  }

  .section-header h2 {
    @apply mt-2 text-3xl font-semibold text-base6 md:text-4xl;
  }

  .section-header p {
    @apply mt-4 text-base text-base4;
  }

  .leadership-section,
  .advisors-section,
  .partners-section,
  .expertise-section {
    @apply mx-auto max-w-6xl px-6 py-20;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .leadership-section.visible,
  .advisors-section.visible,
  .partners-section.visible,
  .expertise-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .leadership-grid {
    @apply flex justify-center;
  }

  .person-card {
    @apply max-w-2xl flex flex-col md:flex-row gap-8 rounded-3xl border border-base3/20 bg-base1/60 p-8;
    backdrop-filter: blur(22px) saturate(180%);
    box-shadow: 0 18px 48px rgba(0, 0, 0, 0.12);
    opacity: 0;
    transform: translateY(24px);
    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: var(--delay, 0s);
  }

  .person-card.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .person-card.featured {
    border-color: var(--color-base14);
    background: linear-gradient(135deg, rgba(var(--color-base14-rgb), 0.08), rgba(var(--color-base1-rgb), 0.65));
  }

  .person-avatar {
    @apply flex-shrink-0;
  }

  .avatar-placeholder {
    @apply w-32 h-32 rounded-2xl flex items-center justify-center;
    background: rgba(var(--color-base14-rgb), 0.1);
    color: var(--color-base14);
  }

  .person-info {
    @apply flex flex-col gap-3;
  }

  .person-info h3 {
    @apply text-2xl font-semibold text-base6;
  }

  .person-role {
    @apply text-sm font-semibold uppercase tracking-[0.2em] text-base14;
  }

  .person-bio {
    @apply text-base text-base4 leading-relaxed;
  }

  .expertise-tags {
    @apply flex flex-wrap gap-2 mt-2;
  }

  .tag {
    @apply px-3 py-1 rounded-full text-xs font-medium;
    background: rgba(var(--color-base3-rgb), 0.3);
    color: var(--color-base5);
  }

  .advisors-grid {
    @apply grid gap-6 md:grid-cols-1 lg:grid-cols-1 max-w-2xl mx-auto;
  }

  .advisor-card {
    @apply flex flex-col gap-4 rounded-3xl border border-base3/20 bg-base1/50 p-6;
    backdrop-filter: blur(18px) saturate(160%);
    box-shadow: 0 16px 42px rgba(0, 0, 0, 0.12);
    opacity: 0;
    transform: translateY(24px);
    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: var(--delay, 0s);
  }

  .advisor-card.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .advisor-header {
    @apply flex items-center gap-4;
  }

  .advisor-avatar {
    @apply w-16 h-16 rounded-xl flex items-center justify-center;
    background: linear-gradient(135deg, var(--color-base14), var(--color-base13));
  }

  .avatar-initial {
    @apply text-2xl font-bold text-white;
  }

  .advisor-title {
    @apply flex flex-col gap-1;
  }

  .advisor-title h3 {
    @apply text-xl font-semibold text-base6;
  }

  .advisor-role {
    @apply text-sm text-base4;
  }

  .advisor-company {
    @apply text-sm text-base14 hover:underline;
  }

  .advisor-bio {
    @apply text-sm text-base4 leading-relaxed;
  }

  .partners-grid {
    @apply grid gap-6 md:grid-cols-3;
  }

  .partner-card {
    @apply flex flex-col gap-4 rounded-3xl border border-base3/20 bg-base1/40 p-6;
    backdrop-filter: blur(14px) saturate(150%);
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: var(--delay, 0s);
  }

  .partner-card.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .partner-header {
    @apply flex items-center justify-between;
  }

  .partner-header h3 {
    @apply text-xl font-semibold text-base6;
  }

  .partner-type {
    @apply text-xs font-semibold uppercase tracking-[0.2em] text-base14;
  }

  .partner-description {
    @apply text-sm text-base4;
  }

  .partner-contribution {
    @apply text-sm text-base5 mt-auto pt-4 border-t border-base3/20;
  }

  .partner-contribution strong {
    @apply text-base14;
  }

  .expertise-grid {
    @apply grid gap-6 md:grid-cols-2;
  }

  .expertise-card {
    @apply flex flex-col gap-3 rounded-3xl border border-base3/20 bg-base1/40 p-6;
    backdrop-filter: blur(14px) saturate(150%);
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: var(--delay, 0s);
  }

  .expertise-card.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .expertise-card h3 {
    @apply text-xl font-semibold text-base6;
  }

  .expertise-card p {
    @apply text-sm text-base4;
  }

  .applications-list {
    @apply flex flex-col gap-1 mt-2;
  }

  .applications-list li {
    @apply text-sm text-base5 pl-4 relative;
  }

  .applications-list li::before {
    content: '→';
    @apply absolute left-0 text-base14;
  }

  .join-section {
    @apply px-6 pb-24;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .join-section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .join-content {
    @apply mx-auto max-w-4xl flex flex-col items-center gap-6 rounded-[36px] border border-base3/20 bg-gradient-to-br from-base2 via-base1 to-base14/10 px-12 py-16 text-center shadow-xl;
  }

  .join-content h2 {
    @apply text-3xl font-semibold text-base6 md:text-4xl;
  }

  .join-content p {
    @apply max-w-2xl text-lg text-base4;
  }

  .join-actions {
    @apply flex flex-wrap justify-center gap-4 mt-4;
  }

  @media (max-width: 768px) {
    .hero {
      @apply py-16;
    }

    h1 {
      @apply text-3xl;
    }

    .leadership-section,
    .advisors-section,
    .partners-section,
    .expertise-section {
      @apply px-4 py-12;
    }

    .partners-grid,
    .expertise-grid {
      @apply grid-cols-1;
    }

    .person-card {
      @apply flex-col;
    }

    .join-content {
      @apply px-6 py-10;
    }
  }
</style>

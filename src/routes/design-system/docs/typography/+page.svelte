<script>
  import {CodeBlock} from '$lib/components/docs';
</script>

<h1>Typography</h1>

<p class="lead">
  A harmonious type scale based on the minor third ratio (1.2) for readable, balanced text.
</p>

<h2>Font Families</h2>

<div class="font-demo">
  <div class="font-item">
    <span class="font-label">Sans (Default)</span>
    <p class="demo-sans">The quick brown fox jumps over the lazy dog.</p>
    <code>--font-sans</code>
  </div>
  <div class="font-item">
    <span class="font-label">Serif</span>
    <p class="demo-serif">The quick brown fox jumps over the lazy dog.</p>
    <code>--font-serif</code>
  </div>
  <div class="font-item">
    <span class="font-label">Mono</span>
    <p class="demo-mono">const greeting = "Hello, World!";</p>
    <code>--font-mono</code>
  </div>
</div>

<h2>Font Sizes</h2>

<div class="size-scale">
  {#each [
    {token: '--text-xs', size: '0.75rem', px: '12px'},
    {token: '--text-sm', size: '0.875rem', px: '14px'},
    {token: '--text-base', size: '1rem', px: '16px'},
    {token: '--text-lg', size: '1.125rem', px: '18px'},
    {token: '--text-xl', size: '1.25rem', px: '20px'},
    {token: '--text-2xl', size: '1.5rem', px: '24px'},
    {token: '--text-3xl', size: '1.875rem', px: '30px'},
    {token: '--text-4xl', size: '2.25rem', px: '36px'},
    {token: '--text-5xl', size: '3rem', px: '48px'}
  ] as item}
    <div class="size-item">
      <span class="size-sample" style="font-size: {item.size};">Aa</span>
      <div class="size-info">
        <code>{item.token}</code>
        <span class="size-value">{item.px}</span>
      </div>
    </div>
  {/each}
</div>

<h2>Usage</h2>

<CodeBlock
  code={`/* Import typography tokens */
@import '@miozu/jera/tokens/typography';

/* Font families */
body {
  font-family: var(--font-sans);
}

code {
  font-family: var(--font-mono);
}

/* Font sizes */
.heading {
  font-size: var(--text-2xl);   /* 24px */
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
}

.body {
  font-size: var(--text-base);  /* 16px */
  line-height: var(--leading-normal);
}

.caption {
  font-size: var(--text-sm);    /* 14px */
  color: var(--color-text-muted);
}`}
  lang="css"
/>

<h2>Font Weights</h2>

<div class="weights-demo">
  {#each [
    {token: '--font-light', weight: 300, label: 'Light'},
    {token: '--font-normal', weight: 400, label: 'Normal'},
    {token: '--font-medium', weight: 500, label: 'Medium'},
    {token: '--font-semibold', weight: 600, label: 'Semibold'},
    {token: '--font-bold', weight: 700, label: 'Bold'}
  ] as item}
    <div class="weight-item">
      <span class="weight-sample" style="font-weight: {item.weight};">{item.label}</span>
      <code>{item.token}</code>
    </div>
  {/each}
</div>

<h2>Line Heights</h2>

<div class="leading-demo">
  {#each [
    {token: '--leading-tight', value: '1.25', desc: 'Headings'},
    {token: '--leading-snug', value: '1.375', desc: 'Subheadings'},
    {token: '--leading-normal', value: '1.5', desc: 'Body text'},
    {token: '--leading-relaxed', value: '1.625', desc: 'Long-form'},
    {token: '--leading-loose', value: '2', desc: 'Spacious'}
  ] as item}
    <div class="leading-item">
      <code>{item.token}</code>
      <span class="leading-value">{item.value}</span>
      <span class="leading-desc">{item.desc}</span>
    </div>
  {/each}
</div>

<h2>Letter Spacing</h2>

<CodeBlock
  code={`/* Tighter for large headings */
.display {
  letter-spacing: var(--tracking-tight);  /* -0.025em */
}

/* Normal for body */
.body {
  letter-spacing: var(--tracking-normal); /* 0 */
}

/* Wider for small caps, labels */
.label {
  letter-spacing: var(--tracking-wide);   /* 0.025em */
  text-transform: uppercase;
}`}
  lang="css"
/>

<h2>Recommended Pairings</h2>

<div class="pairings">
  <div class="pairing">
    <span class="pairing-label">Page Title</span>
    <code>--text-4xl + --font-bold + --leading-tight</code>
  </div>
  <div class="pairing">
    <span class="pairing-label">Section Heading</span>
    <code>--text-2xl + --font-semibold + --leading-snug</code>
  </div>
  <div class="pairing">
    <span class="pairing-label">Body Text</span>
    <code>--text-base + --font-normal + --leading-normal</code>
  </div>
  <div class="pairing">
    <span class="pairing-label">Caption</span>
    <code>--text-sm + --font-normal + --leading-normal</code>
  </div>
  <div class="pairing">
    <span class="pairing-label">Code</span>
    <code>--text-sm + --font-mono</code>
  </div>
</div>

<style>
  .font-demo {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin: 1.5rem 0;
    padding: 1.5rem;
    background: var(--color-base1);
    border-radius: 0.5rem;
  }

  .font-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .font-label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-base4);
  }

  .demo-sans {
    font-family: var(--font-sans);
    font-size: 1.25rem;
    margin: 0;
  }

  .demo-serif {
    font-family: var(--font-serif);
    font-size: 1.25rem;
    margin: 0;
  }

  .demo-mono {
    font-family: var(--font-mono);
    font-size: 1rem;
    margin: 0;
    color: var(--color-primary);
  }

  .size-scale {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 1.5rem 0;
    padding: 1.5rem;
    background: var(--color-base1);
    border-radius: 0.5rem;
  }

  .size-item {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .size-sample {
    min-width: 4rem;
    font-weight: 500;
    color: var(--color-base6);
  }

  .size-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .size-value {
    color: var(--color-base4);
    font-size: 0.875rem;
  }

  .weights-demo {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 1rem;
    margin: 1.5rem 0;
    padding: 1.5rem;
    background: var(--color-base1);
    border-radius: 0.5rem;
  }

  .weight-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .weight-sample {
    font-size: 1.25rem;
  }

  .leading-demo {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin: 1.5rem 0;
    padding: 1.5rem;
    background: var(--color-base1);
    border-radius: 0.5rem;
  }

  .leading-item {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .leading-value {
    min-width: 3rem;
    color: var(--color-base4);
    font-size: 0.875rem;
  }

  .leading-desc {
    color: var(--color-base4);
    font-size: 0.875rem;
  }

  .pairings {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin: 1.5rem 0;
    padding: 1.5rem;
    background: var(--color-base1);
    border-radius: 0.5rem;
  }

  .pairing {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .pairing-label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-base4);
  }
</style>

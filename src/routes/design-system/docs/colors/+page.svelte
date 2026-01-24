<script>
  import {CodeBlock} from '$lib/components/docs';

  const baseColors = [
    {name: 'base00', hex: '#232733', desc: 'Darkest background'},
    {name: 'base01', hex: '#2C3040', desc: 'Default dark bg'},
    {name: 'base02', hex: '#3E4359', desc: 'Selection, hover'},
    {name: 'base03', hex: '#565E78', desc: 'Comments, subtle'},
    {name: 'base04', hex: '#737E99', desc: 'Muted text'},
    {name: 'base05', hex: '#D0D2DB', desc: 'Default text'},
    {name: 'base06', hex: '#F3F4F7', desc: 'Light text'},
    {name: 'base07', hex: '#FAFDFB', desc: 'Lightest/white'}
  ];

  const accentColors = [
    {name: 'magenta', hex: '#C974E6', desc: 'Primary brand'},
    {name: 'blue', hex: '#83D2FC', desc: 'Info, links'},
    {name: 'green', hex: '#6DD672', desc: 'Success'},
    {name: 'yellow', hex: '#E8D176', desc: 'Warning'},
    {name: 'red', hex: '#EB3137', desc: 'Error'},
    {name: 'cyan', hex: '#40FFE2', desc: 'Accent'},
    {name: 'orange', hex: '#FF9837', desc: 'Attention'},
    {name: 'peach', hex: '#FF9982', desc: 'Warm accent'}
  ];

  const semanticCode = `/* Semantic color mappings */
--color-bg: var(--base00);
--color-surface: var(--base01);
--color-border: var(--base02);
--color-text: var(--base05);
--color-text-strong: var(--base07);
--color-primary: var(--magenta);
--color-success: var(--green);
--color-warning: var(--yellow);
--color-error: var(--red);`;

  const usageCode = `/* Import colors */
@import '@miozu/jera/tokens/colors';

/* Use in your CSS */
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.highlight {
  color: var(--color-primary);
}`;
</script>

<h1>Colors</h1>

<p class="lead">
  The Miozu Base16 color system. Eight grayscale values plus eight accent colors,
  designed for harmony based on Newton's color wheel.
</p>

<h2>Philosophy</h2>

<p>
  Miozu's palette follows the Base16 architecture: 8 grayscale values from darkest
  to lightest, plus 8 accent colors for semantic meaning. This provides enough
  contrast for accessibility while maintaining visual harmony.
</p>

<h2>Base Colors (Grayscale)</h2>

<div class="color-grid">
  {#each baseColors as color}
    <div class="color-card">
      <div
        class="color-swatch"
        style="background-color: {color.hex}"
      ></div>
      <div class="color-info">
        <code class="color-name">--{color.name}</code>
        <span class="color-hex">{color.hex}</span>
        <span class="color-desc">{color.desc}</span>
      </div>
    </div>
  {/each}
</div>

<h2>Accent Colors</h2>

<div class="color-grid accent">
  {#each accentColors as color}
    <div class="color-card">
      <div
        class="color-swatch"
        style="background-color: {color.hex}"
      ></div>
      <div class="color-info">
        <code class="color-name">--{color.name}</code>
        <span class="color-hex">{color.hex}</span>
        <span class="color-desc">{color.desc}</span>
      </div>
    </div>
  {/each}
</div>

<h2>Semantic Mappings</h2>

<p>
  For consistent usage across components, colors are mapped to semantic tokens:
</p>

<CodeBlock code={semanticCode} lang="css" />

<h2>Usage</h2>

<CodeBlock code={usageCode} lang="css" />

<h2>Theming</h2>

<p>
  Dark theme is the default. Switch to light theme with the <code>data-theme</code> attribute:
</p>

<CodeBlock
  code={`<html data-theme="dark">  <!-- Dark (default) -->
<html data-theme="light"> <!-- Light -->`}
  lang="html"
/>

<p>
  In light theme, base colors are inverted: <code>base0</code> becomes the lightest,
  <code>base7</code> becomes the darkest.
</p>

<style>
  .color-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    margin: 1.5rem 0;
  }

  .color-card {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md, 0.5rem);
    overflow: hidden;
    background: var(--color-base01);
  }

  .color-swatch {
    height: 5rem;
  }

  .color-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.75rem;
  }

  .color-name {
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    color: var(--color-base06);
  }

  .color-hex {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--color-base04);
  }

  .color-desc {
    font-size: 0.75rem;
    color: var(--color-base04);
    margin-top: 0.25rem;
  }
</style>

<script>
  // Oraklex text logo component
  let {size = 28, class: className = '', variant = 'default'} = $props();

  // Calculate font size based on size prop
  let fontSize = $derived(Math.round(size * 0.85));

  // Color variants for different contexts
  const variants = {
    default: 'var(--color-base6)',
    light: '#FFFFFF',
    accent: 'var(--color-base14)'
  };

  let fillColor = $derived(variants[variant] || variants.default);
</script>

<span
  class="logo-text {className}"
  style="font-size: {fontSize}px; color: {fillColor}; height: {size}px;"
  aria-label="Oraklex Logo"
>
  <span class="logo-icon">O</span><span class="logo-rest">raklex</span>
</span>

<style lang="postcss">
  @reference '$theme';

  .logo-text {
    @apply inline-flex items-center font-semibold tracking-tight;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    letter-spacing: -0.02em;
    transition: all 0.2s ease;
    text-decoration: none;
  }

  .logo-text:hover {
    @apply opacity-90;
  }

  .logo-icon {
    @apply font-bold;
    color: var(--color-base14);
  }

  .logo-rest {
    color: inherit;
  }
</style>

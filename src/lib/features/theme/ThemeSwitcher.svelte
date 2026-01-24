<script>
  import {Switch} from '@miozu/jera';
  import {Sun, Moon} from '$components/icons';

  let {theme, variant = 'default'} = $props();

  // Get current theme state - checked = dark mode
  let isDarkMode = $derived(theme?.isDark ?? false);

  // Handle switch toggle
  function handleChange() {
    if (theme && typeof theme.toggle === 'function') {
      theme.toggle();
    }
  }
</script>

{#if variant === 'switch'}
  <!-- Switch variant using Jera Switch component -->
  <div class="theme-switch-wrapper">
    <Sun size={14} class="theme-icon sun" />
    <Switch
      checked={isDarkMode}
      onchange={handleChange}
      size="sm"
      aria-label={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
    />
    <Moon size={14} class="theme-icon moon" />
  </div>
{:else}
  <!-- Default button variant -->
  <button
    type="button"
    class="theme-toggle"
    onclick={handleChange}
    aria-pressed={isDarkMode}
    aria-label={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
    title={`Current: ${isDarkMode ? 'dark' : 'light'} theme`}
  >
    <div class="icon-container">
      {#if isDarkMode}
        <Moon size={16} />
      {:else}
        <Sun size={16} />
      {/if}
    </div>
  </button>
{/if}

<style lang="postcss">
  @reference '$theme';

  .theme-toggle {
    @apply flex items-center justify-center h-10 w-10 rounded-full;
    @apply bg-base02 hover:bg-base03 transition-all duration-200;
    @apply focus:outline-none focus:ring-2 focus:ring-base0E/50;
    @apply border border-base03;

    &:hover {
      @apply scale-105;
    }

    &:active {
      @apply scale-95;
    }
  }

  .icon-container {
    @apply flex items-center justify-center text-base05 hover:text-base0E transition-colors;
  }

  /* Switch variant styles */
  .theme-switch-wrapper {
    @apply flex items-center gap-2;
  }

  .theme-switch-wrapper :global(.theme-icon) {
    @apply text-base04 transition-colors;
  }

  .theme-switch-wrapper :global(.theme-icon.sun) {
    color: var(--color-base0A);
  }

  .theme-switch-wrapper :global(.theme-icon.moon) {
    color: var(--color-base0D);
  }
</style>

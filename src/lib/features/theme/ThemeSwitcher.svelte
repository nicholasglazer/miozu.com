<script>
  import {Sun, Moon} from '$components/icons';

  let {theme} = $props();

  // Get current theme state
  let isDarkMode = $derived(theme?.isDark ?? false);
  let size = 16;

  // Toggle between light and dark themes
  function toggleTheme() {
    if (theme && typeof theme.toggle === 'function') {
      theme.toggle();
    }
  }

  // Get accessible label for current theme
  function getThemeLabel(isDark) {
    return isDark ? 'Switch to light theme' : 'Switch to dark theme';
  }
</script>

<button
  type="button"
  class="theme-toggle"
  onclick={toggleTheme}
  aria-pressed={isDarkMode}
  aria-label={getThemeLabel(isDarkMode)}
  title={`Current: ${isDarkMode ? 'dark' : 'light'} theme`}
>
  <div class="icon-container">
    {#if isDarkMode}
      <Moon {size} />
    {:else}
      <Sun {size} />
    {/if}
  </div>
</button>

<style lang="postcss">
  @reference '$theme';

  .theme-toggle {
    @apply flex items-center justify-center h-10 w-10 rounded-full;
    @apply bg-base2 hover:bg-base3 transition-all duration-200;
    @apply focus:outline-none focus:ring-2 focus:ring-base14/50;
    @apply border border-base3;

    &:hover {
      @apply scale-105;
    }

    &:active {
      @apply scale-95;
    }
  }

  .icon-container {
    @apply flex items-center justify-center text-base5 hover:text-base14 transition-colors;
  }
</style>

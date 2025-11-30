<script>
  import {appName} from '$lib/settings/global';
  import {mainRoutes} from '$lib/settings/routes';
  import Logo from '$components/Logo.svelte';
  import MobileMenu from './MobileMenu.svelte';

  let {headerEl = $bindable(), l10n, theme} = $props();
</script>

<header bind:this={headerEl} class="header">
  <div class="header-content">
    <div class="header-left">
      <a href="/" class="logo-link">
        <Logo size={32} class="header-logo" />
      </a>
    </div>

    <!-- Desktop navigation -->
    <nav class="main-nav">
      {#each mainRoutes as route}
        <a href={route.path} class="nav-link">
          {route.translate ? (l10n?.t(route.label) ?? route.label) : route.label}
        </a>
      {/each}
    </nav>

    <div class="header-right">
      <a href="https://jko.ai" class="login-btn hidden md:inline-flex">
        J'ko AI
      </a>
      <MobileMenu routes={mainRoutes} {l10n} {theme} />
    </div>
  </div>
</header>

<style lang="postcss">
  @reference '$theme';

  .header {
    @apply sticky top-0;
    z-index: 1000;
    background: rgba(var(--color-base0-rgb), 0.85);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border-bottom: 1px solid var(--color-border);
  }

  .header-content {
    @apply px-4 py-4 w-full flex items-center;
  }

  .header-right {
    @apply w-24 flex items-center justify-end;
    position: relative;
    margin-left: auto;
  }

  .header-left {
    @apply w-24 flex items-center;
  }

  .logo-link {
    @apply flex items-center justify-center no-underline;
  }

  .main-nav {
    @apply flex-1 flex items-center justify-center gap-1;
    @apply hidden md:flex;
  }

  .nav-link {
    @apply px-4 py-2 text-base5 hover:text-base6 transition-all duration-200;
    @apply text-sm font-medium rounded-lg;
    position: relative;
  }

  .nav-link:hover {
    @apply bg-base1;
  }

  .login-btn {
    @apply px-4 py-2 rounded-xl font-medium text-sm no-underline mr-3;
    color: var(--color-base0);
    background: var(--color-base14);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .login-btn:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }
</style>

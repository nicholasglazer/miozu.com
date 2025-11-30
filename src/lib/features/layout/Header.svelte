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
        <Logo size={36} class="header-logo" />
      </a>
    </div>

    <!-- Desktop navigation - hidden on small screens -->
    <nav class="main-nav">
      {#each mainRoutes as route}
        <a href={route.path} class="nav-link">
          {route.translate ? (l10n?.t(route.label) ?? route.label) : route.label}
        </a>
      {/each}
    </nav>

    <div class="header-right">
      <!-- Desktop login button - links to J'ko dashboard as primary product -->
      <a href="https://jko.ai" class="login-btn hidden md:inline-flex">
        J'ko AI
      </a>
      <!-- Mobile menu component -->
      <MobileMenu routes={mainRoutes} {l10n} {theme} />
    </div>
  </div>
</header>

<style lang="postcss">
  @reference '$theme';

  .header {
    @apply sticky top-0;
    z-index: 1000;
    /* Apple-style glassmorphism */
    background: rgba(var(--color-base0-rgb), 0.72);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-bottom: 1px solid rgba(var(--color-base3-rgb, 255, 255, 255), 0.08);
    box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.03);
  }

  .header-content {
    @apply px-6 py-5 w-full flex items-center;
  }

  .header-right {
    @apply w-16 sm:w-24 flex items-center justify-end;
    position: relative;
    margin-left: auto;
  }

  .header-left {
    @apply w-16 sm:w-24 flex items-center;
  }

  .logo-link {
    @apply flex items-center justify-center no-underline;
  }

  .brand-name {
    @apply font-bold text-xl sm:text-2xl text-base14;
    letter-spacing: 0.02em;
    transition: all 0.3s ease;
  }

  .logo-link:hover .brand-name {
    @apply text-base13;
  }

  .main-nav {
    @apply flex-1 flex items-center justify-center;
    /* Hide on small screens */
    @apply hidden md:flex;
  }

  .nav-link {
    @apply px-4 py-2 text-base5 hover:text-base6 transition-all duration-200;
    @apply text-sm font-normal;
    position: relative;
  }

  .nav-link::after {
    content: '';
    @apply absolute bottom-0 left-4 right-4 h-px bg-base14;
    opacity: 0;
    transform: scaleX(0);
    transition: all 0.2s ease;
  }

  .nav-link:hover::after {
    opacity: 1;
    transform: scaleX(1);
  }

  .login-btn {
    @apply px-4 py-2 rounded-lg font-medium text-sm no-underline mr-4;
    color: var(--color-base6);
    background: rgba(var(--color-base1-rgb), 0.6);
    border: 1px solid rgba(var(--color-base3-rgb), 0.2);
    backdrop-filter: blur(8px);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .login-btn:hover {
    background: rgba(var(--color-base14-rgb), 0.1);
    border-color: var(--color-base14);
    transform: translateY(-1px);
  }
</style>

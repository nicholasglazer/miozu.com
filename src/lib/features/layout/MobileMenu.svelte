<!-- src/lib/features/layout/MobileMenu.svelte -->
<script lang="ts">
  import {browser} from '$app/environment';
  import {onMount, onDestroy} from 'svelte';
  import {fly, fade, scale} from 'svelte/transition';
  import {quintOut, cubicOut} from 'svelte/easing';
  import {appName} from '$settings/global';
  import Logo from '$components/Logo.svelte';
  import ThemeSwitcher from '$features/theme/ThemeSwitcher.svelte';

  let {routes = [], l10n, theme} = $props();

  let isMenuOpen = $state(false);

  // Toggle menu
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  // Close menu
  function closeMenu() {
    isMenuOpen = false;
  }

  // Handle escape key - stored as const for proper cleanup
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && isMenuOpen) {
      closeMenu();
    }
  }

  // Use $effect for reactive side effects - manages body scroll state
  $effect(() => {
    if (!browser) return;

    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('mobile-menu-open');
      document.addEventListener('keydown', handleKeydown);
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('mobile-menu-open');
    }

    // Cleanup function - runs when effect re-runs or component unmounts
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('mobile-menu-open');
      document.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

<!-- Luxury Hamburger Menu Button -->
<button
  class="hamburger-btn"
  class:active={isMenuOpen}
  onclick={toggleMenu}
  aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
  aria-expanded={isMenuOpen}
  type="button"
>
  <span class="hamburger-line"></span>
  <span class="hamburger-line"></span>
  <span class="hamburger-line"></span>
</button>

<!-- Luxury Full-Screen Mobile Menu -->
{#if isMenuOpen}
  <!-- Elegant Background Overlay -->
  <div
    class="menu-overlay"
    in:fade={{duration: 300, easing: cubicOut}}
    out:fade={{duration: 200, easing: cubicOut}}
    onclick={closeMenu}
    role="button"
    tabindex="-1"
  ></div>

  <!-- Luxury Menu Panel -->
  <div
    class="mobile-menu-panel"
    in:fly={{x: 300, duration: 350, easing: quintOut}}
    out:fly={{x: 300, duration: 250, easing: cubicOut}}
  >
    <!-- Refined Menu Header -->
    <div class="menu-header">
      <div class="menu-logo">
        <Logo size={32} class="mobile-menu-logo" />
      </div>
      <button
        class="close-btn"
        onclick={closeMenu}
        aria-label="Close menu"
        type="button"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
        >
          <path d="M18 6L6 18M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <!-- Luxury Navigation Links -->
    <nav class="menu-nav" role="navigation">
      {#each routes as route, index}
        <a
          href={route.path}
          class="nav-link"
          onclick={closeMenu}
          style="--delay: {index}"
          in:scale={{
            duration: 300,
            delay: 150 + index * 60,
            easing: quintOut,
            opacity: 0,
            start: 0.95
          }}
        >
          <span class="nav-text">
            {route.translate ? (l10n?.t(route.label) ?? route.label) : route.label}
          </span>
          <svg
            class="nav-arrow"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          >
            <path d="M5 12h14m-7-7l7 7-7 7"></path>
          </svg>
        </a>
      {/each}
    </nav>

    <!-- Elegant Menu Footer -->
    <div class="menu-footer">
      <div class="footer-divider"></div>
      <div class="footer-content">
        <span class="theme-label">Appearance</span>
        <ThemeSwitcher {theme} />
      </div>
    </div>
  </div>
{/if}

<style lang="postcss">
  @reference '$theme';

  /* Luxury Hamburger Button */
  .hamburger-btn {
    @apply relative;
    width: 40px;
    height: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    cursor: pointer;
    border: none;
    background: transparent;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 100;
  }

  .hamburger-btn::before {
    content: '';
    @apply absolute inset-0 rounded-lg opacity-0;
    background: var(--color-base2);
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .hamburger-btn:hover::before {
    opacity: 1;
  }

  .hamburger-btn:focus {
    outline: none;
  }

  .hamburger-btn:focus-visible {
    box-shadow: 0 0 0 2px var(--color-base14-rgb, 233, 140, 70);
  }

  /* Refined Hamburger Lines with Gold Accent */
  .hamburger-line {
    width: 20px;
    height: 2px;
    background: var(--color-base10);
    border-radius: 2px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: center;
    position: relative;
    z-index: 1;
  }

  .hamburger-btn:hover .hamburger-line {
    background: var(--color-base14);
  }

  .hamburger-btn.active .hamburger-line:nth-child(1) {
    transform: rotate(45deg) translateY(6px);
    background: var(--color-base14);
  }

  .hamburger-btn.active .hamburger-line:nth-child(2) {
    opacity: 0;
    transform: scaleX(0);
  }

  .hamburger-btn.active .hamburger-line:nth-child(3) {
    transform: rotate(-45deg) translateY(-6px);
    background: var(--color-base14);
  }

  /* Elegant Overlay with Blur */
  .menu-overlay {
    @apply fixed inset-0;
    background: linear-gradient(135deg, rgba(10, 9, 7, 0.85) 0%, rgba(10, 9, 7, 0.9) 100%);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 9998;
  }

  /* Luxury Mobile Menu Panel */
  .mobile-menu-panel {
    @apply fixed top-0 right-0 h-full flex flex-col;
    width: min(85vw, 320px);
    background: var(--color-base0);
    box-shadow: -8px 0 32px rgba(0, 0, 0, 0.2);
    z-index: 9999;
  }

  /* Refined Menu Header */
  .menu-header {
    @apply flex items-center justify-between px-6 py-5;
    border-bottom: 1px solid var(--color-base2);
  }

  .menu-logo {
    @apply flex items-center;
  }

  .logo-text {
    @apply text-xl font-bold tracking-tight;
    background: linear-gradient(135deg, var(--color-base14) 0%, var(--color-base13) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .close-btn {
    @apply relative p-2 rounded-lg;
    color: var(--color-base8);
    border: none;
    background: transparent;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .close-btn::before {
    content: '';
    @apply absolute inset-0 rounded-lg opacity-0;
    background: var(--color-base2);
    transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .close-btn:hover::before {
    opacity: 1;
  }

  .close-btn:hover {
    color: var(--color-base14);
  }

  .close-btn svg {
    position: relative;
    z-index: 1;
  }

  /* Luxury Navigation */
  .menu-nav {
    @apply flex-1 px-4 py-6 overflow-y-auto;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .nav-link {
    @apply relative flex items-center justify-between px-5 py-4 rounded-xl no-underline;
    color: var(--color-base9);
    font-size: 17px;
    font-weight: 500;
    letter-spacing: -0.01em;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .nav-link::before {
    content: '';
    @apply absolute left-0 top-1/2 w-1 h-0 rounded-r-full opacity-0;
    background: linear-gradient(180deg, var(--color-base14) 0%, var(--color-base13) 100%);
    transform: translateY(-50%);
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .nav-link:hover::before {
    height: 60%;
    opacity: 1;
  }

  .nav-link:hover {
    background: var(--color-base1);
    color: var(--color-base14);
    padding-left: 1.75rem;
  }

  .nav-link:active {
    transform: scale(0.98);
  }

  .nav-text {
    @apply relative;
    z-index: 1;
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .nav-link:hover .nav-text {
    transform: translateX(4px);
  }

  .nav-arrow {
    color: var(--color-base14);
    opacity: 0;
    transform: translateX(-8px) scale(0.8);
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .nav-link:hover .nav-arrow {
    opacity: 1;
    transform: translateX(0) scale(1);
  }

  /* Elegant Menu Footer */
  .menu-footer {
    @apply px-6 pb-6 pt-4;
  }

  .footer-divider {
    @apply h-px mb-4;
    background: linear-gradient(
      90deg,
      transparent 0%,
      var(--color-base3) 20%,
      var(--color-base3) 80%,
      transparent 100%
    );
  }

  .footer-content {
    @apply flex items-center justify-between px-4 py-3 rounded-xl;
    background: var(--color-base1);
    border: 1px solid var(--color-base2);
  }

  .theme-label {
    @apply text-sm font-medium tracking-wide;
    color: var(--color-base8);
    letter-spacing: 0.02em;
  }


  /* Responsive Display */
  .hamburger-btn {
    display: none;
  }

  @media (max-width: 767px) {
    .hamburger-btn {
      display: flex;
    }
  }

  /* Hide menu on desktop */
  @media (min-width: 768px) {
    .menu-overlay,
    .mobile-menu-panel {
      display: none !important;
    }
  }

  /* Smooth Scrolling for Menu */
  .menu-nav {
    scrollbar-width: thin;
    scrollbar-color: var(--color-base3) transparent;
  }

  .menu-nav::-webkit-scrollbar {
    width: 4px;
  }

  .menu-nav::-webkit-scrollbar-track {
    background: transparent;
  }

  .menu-nav::-webkit-scrollbar-thumb {
    background: var(--color-base3);
    border-radius: 2px;
  }

  .menu-nav::-webkit-scrollbar-thumb:hover {
    background: var(--color-base4);
  }

  /* Prevent body scroll when menu is open */
  :global(body.mobile-menu-open) {
    overflow: hidden !important;
    position: fixed;
    width: 100%;
  }
</style>

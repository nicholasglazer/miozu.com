<script>
  function renderIcon(iconName) {
    const iconMap = {
      check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>`
    };
    return iconMap[iconName] || '';
  }
</script>

<section class="under-footer">
  <div class="under-footer-container">
    <div class="pledge-content">
      <h2 class="pledge-title">THE ERAZER PLEDGE</h2>

      <div class="pledge-sections">
        <div class="pledge-left">
          <h3 class="pledge-subtitle">WE ARE NOT JUST<br />SELLING EARBUDS</h3>
          <p class="pledge-description">
            Our goal is to connect with audio lovers from all over the world. When you choose Erazer
            XP2, you become part of our family. If you aren't 100% happy, we are not either. It is
            called The Erazer Pledge. We pledge to stand by the Erazer on your ears.
          </p>
        </div>

        <div class="pledge-center">
          <div class="handshake-container">
            <img
              src="/images/handshake.webp"
              alt="The Erazer Pledge - Handshake"
              class="handshake-image"
              loading="lazy"
            />
          </div>
        </div>

        <div class="pledge-right">
          <h3 class="pledge-subtitle">WE MAKE IT EASY</h3>
          <div class="pledge-guarantees">
            <div class="guarantee-item">
              <span class="guarantee-icon">{@html renderIcon('check')}</span>
              <span class="guarantee-text">1-YEAR WARRANTY</span>
            </div>
            <div class="guarantee-item">
              <span class="guarantee-icon">{@html renderIcon('check')}</span>
              <span class="guarantee-text">30-DAYS TO DECIDE</span>
            </div>
            <div class="guarantee-item">
              <span class="guarantee-icon">{@html renderIcon('check')}</span>
              <span class="guarantee-text">FULL CUSTOMER EXPERIENCE</span>
            </div>
            <div class="guarantee-item">
              <span class="guarantee-icon">{@html renderIcon('check')}</span>
              <span class="guarantee-text">FREE DELIVERY & RETURNS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style lang="postcss">
  @reference '$theme';

  .under-footer {
    @apply w-full bg-base00 border-t border-base03;
  }

  .under-footer-container {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20;
  }

  .pledge-content {
    @apply text-center;
  }

  .pledge-title {
    @apply text-3xl lg:text-4xl font-light mb-12 lg:mb-16 text-base06;
    letter-spacing: 0.05em;
  }

  .pledge-sections {
    @apply grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center;
  }

  .pledge-left,
  .pledge-right {
    @apply flex flex-col;
  }

  .pledge-subtitle {
    @apply text-xl lg:text-2xl font-semibold mb-6 text-base06;
    line-height: 1.3;
  }

  .pledge-description {
    @apply text-base lg:text-lg leading-relaxed text-base04;
    max-width: 400px;
    margin: 0 auto;
  }

  /* Center handshake section */
  .pledge-center {
    @apply flex justify-center items-center order-first lg:order-none;
  }

  .handshake-container {
    @apply relative;
    width: 200px;
    height: 200px;
  }

  .handshake-image {
    @apply w-full h-full object-contain;
  }

  /* Right section - guarantees */
  .pledge-guarantees {
    @apply space-y-4;
  }

  .guarantee-item {
    @apply flex items-center gap-3 text-left justify-center;
  }

  .guarantee-icon {
    @apply flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold;
    @apply bg-base0E text-white;
  }

  .guarantee-text {
    @apply text-base lg:text-lg font-medium text-base06;
  }

  /* Mobile responsive adjustments */
  @media (max-width: 1024px) {
    .pledge-sections {
      @apply text-center;
    }

    .pledge-left {
      @apply order-2;
    }

    .pledge-center {
      @apply order-1 mb-8;
    }

    .pledge-right {
      @apply order-3;
    }

    .handshake-container {
      width: 150px;
      height: 150px;
    }

    .guarantee-item {
      @apply justify-center;
    }
  }

  @media (max-width: 768px) {
    .under-footer-container {
      @apply py-12;
    }

    .pledge-title {
      @apply text-2xl mb-8;
    }

    .pledge-subtitle {
      @apply text-lg mb-4;
    }

    .pledge-description {
      @apply text-sm mb-6;
    }

    .guarantee-text {
      @apply text-sm;
    }

    .handshake-container {
      width: 120px;
      height: 120px;
    }
  }
</style>

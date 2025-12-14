<script>
  let {
    children = undefined,
    type: buttonType = 'button',
    class: className = '',
    disabled = false,
    icon = null, // {icon: Component, position: 'left' | 'right'}
    loader = null, // {icon: Component, text: '', style: '', position: 'left' | 'right'}
    variant = 'primary', // primary, secondary, minimal, accent
    size = 'md', // sm, md, lg
    fullWidth = false,
    onclick = () => {},
    href = '',
    ...rest
  } = $props();

  // If href is provided, render as <a> tag instead of button
  const isLink = $derived(href && href.length > 0);

  // Determine if button has an icon only (no text content)
  const isIconOnly = $derived(icon && !children);
</script>

{#if isLink}
  <a
    {href}
    class={`btn ${variant} ${size} ${fullWidth ? 'full-width' : ''} ${isIconOnly ? 'icon-only' : ''} ${className}`}
    {...rest}
  >
    {#if icon && icon.position === 'left'}
      <span class="icon-wrapper">
        {@render icon?.icon({...icon})}
      </span>
    {/if}

    {#if children !== undefined}
      <span class="button-text">{@render children()}</span>
    {/if}

    {#if icon && icon.position === 'right'}
      <span class="icon-wrapper">
        {@render icon?.icon({...icon})}
      </span>
    {/if}
  </a>
{:else}
  <button
    {buttonType}
    type={buttonType}
    {onclick}
    {disabled}
    class={`btn ${variant} ${size} ${fullWidth ? 'full-width' : ''} ${isIconOnly ? 'icon-only' : ''} ${className}`}
    {...rest}
  >
    {#if disabled && loader}
      {#if loader.position === 'left'}
        <span class="icon-wrapper {loader?.style}">
          {@render loader.icon({...loader.icon})}
        </span>
      {/if}
      <span class="button-text">{loader?.text}</span>
      {#if loader.position === 'right'}
        <span class="icon-wrapper {loader?.style}">
          {@render loader.icon({...loader.icon})}
        </span>
      {/if}
    {:else}
      {#if icon && icon.position === 'left'}
        <span class="icon-wrapper">
          {@render icon?.icon({...icon})}
        </span>
      {/if}

      {#if children !== undefined}
        <span class="button-text">{@render children()}</span>
      {/if}

      {#if icon && icon.position === 'right'}
        <span class="icon-wrapper">
          {@render icon?.icon({...icon})}
        </span>
      {/if}
    {/if}
  </button>
{/if}

<style lang="postcss">
  @reference '$theme';

  .btn {
    @apply inline-flex items-center justify-center;
    @apply cursor-pointer select-none;
    @apply font-medium whitespace-nowrap;
    @apply focus:outline-none focus-visible:ring-2 focus-visible:ring-base14/50 focus-visible:ring-offset-2;
    @apply no-underline;
    background: transparent;
    border: none;
    border-radius: 10px;
    text-decoration: none;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .button-text {
    @apply inline-flex items-center whitespace-nowrap;
  }

  .icon-wrapper {
    @apply flex items-center justify-center;
  }

  .icon-wrapper + .button-text {
    @apply ml-2;
  }

  .button-text + .icon-wrapper {
    @apply ml-2;
  }

  /* Icon-only buttons */
  .icon-only {
    @apply p-2;
    aspect-ratio: 1;
    border-radius: 10px;
  }

  /* Size variants */
  .btn.sm {
    @apply py-1.5 px-4 text-xs;
    height: 32px;
  }

  .btn.md {
    @apply py-2 px-5 text-sm;
    height: 40px;
  }

  .btn.lg {
    @apply py-2.5 px-6 text-base;
    height: 48px;
  }

  /* Button Variants - 2025 Modern Style */

  /* Primary Button - Solid accent with depth */
  .primary {
    @apply bg-base14 text-white;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  }

  .primary:hover {
    filter: brightness(1.1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }

  .primary:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  /* Secondary Button - Subtle surface with border */
  .secondary {
    @apply bg-base1 text-base6;
    @apply border border-base3;
  }

  .secondary:hover {
    @apply bg-base2 border-base4/50;
  }

  /* Minimal Button - Ghost style */
  .minimal {
    @apply bg-transparent text-base5;
  }

  .minimal:hover {
    @apply bg-base1 text-base6;
  }

  /* Accent Button - Outlined accent */
  .accent {
    @apply bg-base14/10 text-base14;
    @apply border border-base14/30;
  }

  .accent:hover {
    @apply bg-base14/20 border-base14/50;
  }

  /* Disabled state */
  .btn:disabled {
    @apply opacity-50 cursor-not-allowed pointer-events-none;
  }

  /* Full width */
  .full-width {
    @apply w-full;
  }
</style>

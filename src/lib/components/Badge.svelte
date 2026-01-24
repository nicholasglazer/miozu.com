<script>
  let {
    children,
    label = '',
    selected = false,
    onclick = () => {},
    count = undefined,
    class: className = ''
  } = $props();

  // Handle click events, toggle selection, and call the onClick handler
  function handleClick() {
    onclick(label); // Pass the label to the parent for identification
  }
</script>

<button
  class="badge {selected ? 'selected' : ''} {className}"
  aria-pressed={selected}
  onclick={handleClick}
  data-tag-id={label}
>
  {#if children}
    {@render children()}
  {/if}
  <span>{label}</span>
  {#if count !== undefined}
    <span class="badge-count">{count}</span>
  {/if}
</button>

<style lang="postcss">
  @reference '$theme';

  .badge {
    @apply inline-flex items-center;
    @apply px-2.5 py-0.5;
    @apply rounded-xs;
    @apply border border-base03/20;
    @apply text-base04 bg-transparent;
    @apply text-xs whitespace-nowrap cursor-pointer;
    @apply transition-colors duration-200 ease-in-out;
    @apply focus:outline-none focus:ring-0 focus:ring-offset-0;
  }

  .badge:hover {
    @apply bg-base01/60 text-base06;
    @apply border-base04/30;
  }

  .badge.selected {
    @apply bg-base01/70 text-base07;
    @apply border-base0E/40;
  }

  .badge-count {
    @apply ml-2 text-xs rounded-full bg-base01/80 px-1.5 py-0.5;
    @apply text-base04;
  }

  .badge.selected .badge-count {
    @apply text-base0E font-semibold bg-base02/70;
  }

  /* Mobile optimizations */
  @media (max-width: 640px) {
    .badge {
      @apply py-1 px-3;
      /* Make sure we have a minimum touch target size */
      min-height: 32px;
      /* Ensure we don't get badges that are too small to tap properly */
      min-width: max-content;
    }

    .badge-count {
      @apply ml-1.5 min-w-5 text-center;
    }
  }
</style>

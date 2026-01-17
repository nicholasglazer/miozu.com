<!--
  @component ComponentPlayground

  Interactive component preview with live props editing.
  Inspired by shadcn/ui component previews.
-->
<script>
  import CodeBlock from './CodeBlock.svelte';

  let {
    title = '',
    description = '',
    code = '',
    children,
    controls,
    class: className = ''
  } = $props();

  let showCode = $state(false);
</script>

<div class="playground {className}">
  {#if title}
    <div class="playground-header">
      <h3 class="playground-title">{title}</h3>
      {#if description}
        <p class="playground-desc">{description}</p>
      {/if}
    </div>
  {/if}

  <div class="playground-content">
    <!-- Preview Panel -->
    <div class="preview-panel">
      <div class="preview-area">
        {@render children?.()}
      </div>

      {#if controls}
        <div class="controls-panel">
          {@render controls()}
        </div>
      {/if}
    </div>

    <!-- Code Toggle -->
    <div class="code-toggle">
      <button
        class="toggle-btn"
        class:active={showCode}
        onclick={() => showCode = !showCode}
      >
        <svg class="code-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
        {showCode ? 'Hide code' : 'View code'}
      </button>
    </div>

    <!-- Code Panel -->
    {#if showCode && code}
      <div class="code-panel">
        <CodeBlock {code} lang="svelte" />
      </div>
    {/if}
  </div>
</div>

<style>
  .playground {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg, 0.75rem);
    overflow: hidden;
    background: var(--color-base0);
  }

  .playground-header {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--color-border);
  }

  .playground-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-base6);
  }

  .playground-desc {
    margin: 0.5rem 0 0;
    font-size: 0.875rem;
    color: var(--color-base4);
  }

  .playground-content {
    display: flex;
    flex-direction: column;
  }

  .preview-panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  @media (min-width: 768px) {
    .preview-panel {
      flex-direction: row;
    }
  }

  .preview-area {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 12rem;
    padding: 2rem;
    background: repeating-linear-gradient(
      45deg,
      var(--color-base1) 0,
      var(--color-base1) 10px,
      var(--color-base0) 10px,
      var(--color-base0) 20px
    );
    background-size: 28px 28px;
  }

  .controls-panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
    min-width: 14rem;
    background: var(--color-base1);
    border-left: 1px solid var(--color-border);
  }

  .code-toggle {
    display: flex;
    border-top: 1px solid var(--color-border);
  }

  .toggle-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.75rem 1.5rem;
    border: none;
    background: var(--color-base1);
    color: var(--color-base4);
    font-size: 0.875rem;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }

  .toggle-btn:hover {
    background: var(--color-base2);
    color: var(--color-base5);
  }

  .toggle-btn.active {
    color: var(--color-base14);
  }

  .code-icon {
    width: 1rem;
    height: 1rem;
  }

  .code-panel {
    border-top: 1px solid var(--color-border);
  }

  .code-panel :global(.code-block) {
    border: none;
    border-radius: 0;
  }
</style>

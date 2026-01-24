<!--
  @component CodeBlock

  Syntax-highlighted code block with copy functionality.
  Uses Shiki for highlighting via CSS variables.
-->
<script>
  import {getHighlighter} from '$lib/utils/highlighter.js';
  import Copy from '$lib/components/icons/Copy.svelte';
  import Check from '$lib/components/icons/Check.svelte';

  let {
    code = '',
    lang = 'svelte',
    filename = '',
    showLineNumbers = false,
    class: className = ''
  } = $props();

  let copied = $state(false);
  let highlightedCode = $state('');

  $effect(() => {
    highlightCode();
  });

  async function highlightCode() {
    try {
      const highlighter = await getHighlighter();
      highlightedCode = highlighter.codeToHtml(code.trim(), {
        lang: lang || 'text',
        theme: 'css-variables'
      });
    } catch (e) {
      highlightedCode = `<pre><code>${escapeHtml(code)}</code></pre>`;
    }
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code.trim());
      copied = true;
      setTimeout(() => copied = false, 2000);
    } catch (e) {
      console.error('Failed to copy:', e);
    }
  }
</script>

<div class="code-block {className}">
  {#if filename}
    <div class="code-header">
      <span class="code-filename">{filename}</span>
      <span class="code-lang">{lang}</span>
    </div>
  {/if}

  <div class="code-container">
    <button
      class="copy-btn"
      onclick={copyCode}
      aria-label={copied ? 'Copied!' : 'Copy code'}
    >
      {#if copied}
        <Check />
      {:else}
        <Copy />
      {/if}
    </button>

    <div class="code-content" class:with-lines={showLineNumbers}>
      {@html highlightedCode}
    </div>
  </div>
</div>

<style>
  .code-block {
    position: relative;
    border-radius: var(--radius-md, 0.5rem);
    overflow: hidden;
    background: var(--color-base01, #1a1f26);
    border: 1px solid var(--color-border, #2d3748);
  }

  .code-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    background: var(--color-base00, #0f1419);
    border-bottom: 1px solid var(--color-border, #2d3748);
    font-size: 0.75rem;
  }

  .code-filename {
    color: var(--color-base05, #e2e8f0);
    font-family: var(--font-mono);
  }

  .code-lang {
    color: var(--color-base04, #a0aec0);
    text-transform: uppercase;
    font-size: 0.625rem;
    letter-spacing: 0.05em;
  }

  .code-container {
    position: relative;
  }

  .copy-btn {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    z-index: 10;
    padding: 0.5rem;
    border: none;
    border-radius: var(--radius-sm, 0.25rem);
    background: var(--color-base02, #242a33);
    color: var(--color-base04, #a0aec0);
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.15s, background 0.15s, color 0.15s;
  }

  .code-block:hover .copy-btn {
    opacity: 1;
  }

  .copy-btn:hover {
    background: var(--color-base03, #4a5568);
    color: var(--color-base06, #f7fafc);
  }

  .copy-btn :global(svg) {
    width: 1rem;
    height: 1rem;
  }

  .code-content {
    overflow-x: auto;
  }

  .code-content :global(pre) {
    margin: 0;
    padding: 1rem;
    background: transparent !important;
    font-family: var(--font-mono);
    font-size: 0.875rem;
    line-height: 1.6;
  }

  .code-content :global(code) {
    font-family: inherit;
  }

  /* Shiki CSS variables theme */
  .code-content {
    --shiki-color-text: var(--color-base05);
    --shiki-color-background: transparent;
    --shiki-token-constant: #83d2fc;
    --shiki-token-string: #6dd672;
    --shiki-token-comment: #565e78;
    --shiki-token-keyword: #c974e6;
    --shiki-token-parameter: #ff9982;
    --shiki-token-function: #83d2fc;
    --shiki-token-string-expression: #6dd672;
    --shiki-token-punctuation: var(--color-base04);
    --shiki-token-link: #83d2fc;
  }
</style>

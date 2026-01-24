<script>
  import {CodeBlock, PropsTable} from '$lib/components/docs';
  import {ProgressBar} from '@miozu/jera';

  const props = [
    {name: 'value', type: 'number', default: '0', description: 'Current progress value'},
    {name: 'max', type: 'number', default: '100', description: 'Maximum value'},
    {name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Bar height'},
    {name: 'variant', type: "'primary' | 'success' | 'warning' | 'error' | 'info'", default: "'primary'", description: 'Color variant'},
    {name: 'showLabel', type: 'boolean', default: 'false', description: 'Show percentage'},
    {name: 'label', type: 'string', description: 'Custom label text'},
    {name: 'indeterminate', type: 'boolean', default: 'false', description: 'Infinite loading state'}
  ];

  const basicCode = `<script>
  import { ProgressBar } from '@miozu/jera';
<\/script>

<ProgressBar value={65} />`;

  const variantsCode = `<ProgressBar value={80} variant="primary" />
<ProgressBar value={70} variant="success" />
<ProgressBar value={50} variant="warning" />
<ProgressBar value={30} variant="error" />
<ProgressBar value={60} variant="info" />`;

  const labelCode = `<ProgressBar value={65} showLabel />
<ProgressBar value={42} label="Uploading files..." showLabel />`;
</script>

<h1>ProgressBar</h1>

<p class="lead">
  Visual progress indicator with optional label.
</p>

<h2>Basic Usage</h2>

<div class="demo">
  <ProgressBar value={65} />
</div>

<CodeBlock code={basicCode} lang="svelte" />

<h2>Variants</h2>

<div class="demo">
  <div class="progress-stack">
    <ProgressBar value={80} variant="primary" />
    <ProgressBar value={70} variant="success" />
    <ProgressBar value={50} variant="warning" />
    <ProgressBar value={30} variant="error" />
    <ProgressBar value={60} variant="info" />
  </div>
</div>

<CodeBlock code={variantsCode} lang="svelte" />

<h2>With Labels</h2>

<div class="demo">
  <div class="progress-stack">
    <ProgressBar value={65} showLabel />
    <ProgressBar value={42} label="Uploading files..." showLabel />
  </div>
</div>

<CodeBlock code={labelCode} lang="svelte" />

<h2>Sizes</h2>

<div class="demo">
  <div class="progress-stack">
    <ProgressBar value={60} size="sm" />
    <ProgressBar value={60} size="md" />
    <ProgressBar value={60} size="lg" />
  </div>
</div>

<h2>Indeterminate</h2>

<p>Use for unknown duration loading states.</p>

<div class="demo">
  <ProgressBar indeterminate />
</div>

<h2>Props</h2>

<PropsTable {props} />

<style>
  .demo {
    padding: 1.5rem;
    background: var(--color-base01);
    border-radius: 0.5rem;
    margin: 1.5rem 0;
  }

  .progress-stack {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>

<script>
  import {CodeBlock, PropsTable} from '$lib/components/docs';
  import {Spinner} from '@miozu/jera';

  const props = [
    {name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Spinner size'},
    {name: 'color', type: 'string', default: "'currentColor'", description: 'Spinner color'},
    {name: 'label', type: 'string', default: "'Loading...'", description: 'Accessibility label'}
  ];

  const basicCode = `<script>
  import { Spinner } from '@miozu/jera';
<\/script>

<Spinner />`;

  const sizesCode = `<Spinner size="xs" />
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
<Spinner size="xl" />`;

  const colorsCode = `<Spinner color="var(--color-base0E)" />
<Spinner color="var(--color-base0B)" />
<Spinner color="var(--color-base08)" />`;
</script>

<h1>Spinner</h1>

<p class="lead">
  Loading spinner indicator for async operations.
</p>

<h2>Basic Usage</h2>

<div class="demo">
  <Spinner />
</div>

<CodeBlock code={basicCode} lang="svelte" />

<h2>Sizes</h2>

<div class="demo">
  <Spinner size="xs" />
  <Spinner size="sm" />
  <Spinner size="md" />
  <Spinner size="lg" />
  <Spinner size="xl" />
</div>

<CodeBlock code={sizesCode} lang="svelte" />

<h2>Colors</h2>

<div class="demo">
  <Spinner color="var(--color-base0E)" />
  <Spinner color="var(--color-base0B)" />
  <Spinner color="var(--color-base08)" />
  <Spinner color="var(--color-base0D)" />
</div>

<CodeBlock code={colorsCode} lang="svelte" />

<h2>Props</h2>

<PropsTable {props} />

<style>
  .demo {
    padding: 2rem;
    background: var(--color-base01);
    border-radius: 0.5rem;
    margin: 1.5rem 0;
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
</style>

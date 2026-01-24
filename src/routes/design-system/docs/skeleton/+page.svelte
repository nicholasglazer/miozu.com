<script>
  import {CodeBlock, PropsTable} from '$lib/components/docs';
  import {Skeleton} from '@miozu/jera';

  const props = [
    {name: 'variant', type: "'text' | 'heading' | 'circle' | 'rect'", default: "'text'", description: 'Shape type'},
    {name: 'width', type: 'string', default: "'100%'", description: 'Element width'},
    {name: 'height', type: 'string', description: 'Element height'},
    {name: 'size', type: 'string', description: 'Width and height for circle'},
    {name: 'lines', type: 'number', default: '1', description: 'Number of text lines'},
    {name: 'animate', type: 'boolean', default: 'true', description: 'Enable shimmer animation'}
  ];

  const basicCode = `<script>
  import { Skeleton } from '@miozu/jera';
<\/script>

<!-- Text line -->
<Skeleton width="80%" />

<!-- Multiple lines -->
<Skeleton lines={3} />`;

  const variantsCode = `<!-- Circle (avatar) -->
<Skeleton variant="circle" size="48px" />

<!-- Rectangle (card/image) -->
<Skeleton variant="rect" width="100%" height="200px" />

<!-- Heading -->
<Skeleton variant="heading" width="60%" />

<!-- Text -->
<Skeleton variant="text" width="100%" />`;

  const cardCode = `<div class="card-skeleton">
  <Skeleton variant="circle" size="40px" />
  <div class="content">
    <Skeleton variant="heading" width="50%" />
    <Skeleton lines={2} />
  </div>
</div>`;
</script>

<h1>Skeleton</h1>

<p class="lead">
  Loading placeholder with shimmer animation.
</p>

<h2>Basic Usage</h2>

<div class="demo">
  <Skeleton width="80%" />
  <div style="margin-top: 0.5rem;">
    <Skeleton width="60%" />
  </div>
</div>

<CodeBlock code={basicCode} lang="svelte" />

<h2>Variants</h2>

<div class="demo demo-variants">
  <div class="variant-item">
    <Skeleton variant="circle" size="48px" />
    <span>Circle</span>
  </div>
  <div class="variant-item">
    <Skeleton variant="rect" width="100px" height="60px" />
    <span>Rectangle</span>
  </div>
  <div class="variant-item" style="flex: 1;">
    <Skeleton variant="heading" width="80%" />
    <span>Heading</span>
  </div>
  <div class="variant-item" style="flex: 1;">
    <Skeleton variant="text" />
    <span>Text</span>
  </div>
</div>

<CodeBlock code={variantsCode} lang="svelte" />

<h2>Multiple Lines</h2>

<div class="demo">
  <Skeleton lines={3} />
</div>

<h2>Card Example</h2>

<div class="demo">
  <div class="card-example">
    <Skeleton variant="circle" size="40px" />
    <div class="card-content">
      <Skeleton variant="heading" width="50%" />
      <Skeleton lines={2} />
    </div>
  </div>
</div>

<CodeBlock code={cardCode} lang="svelte" />

<h2>Props</h2>

<PropsTable {props} />

<style>
  .demo {
    padding: 1.5rem;
    background: var(--color-base01);
    border-radius: 0.5rem;
    margin: 1.5rem 0;
  }

  .demo-variants {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    align-items: flex-start;
  }

  .variant-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .variant-item span {
    font-size: 0.75rem;
    color: var(--color-base04);
  }

  .card-example {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
  }

  .card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
</style>

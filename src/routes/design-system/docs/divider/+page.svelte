<script>
  import {CodeBlock, PropsTable} from '$lib/components/docs';
  import {Divider} from '@miozu/jera';

  const props = [
    {name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Divider direction'},
    {name: 'thickness', type: 'string', default: "'1px'", description: 'Line thickness'},
    {name: 'spacing', type: 'string', default: "'1rem'", description: 'Margin around divider'},
    {name: 'children', type: 'Snippet', description: 'Optional label content'}
  ];

  const basicCode = `<script>
  import { Divider } from '@miozu/jera';
<\/script>

<p>First section content</p>
<Divider />
<p>Second section content</p>`;

  const labeledCode = `<Divider>or continue with</Divider>`;

  const verticalCode = `<div style="display: flex; height: 100px; align-items: center;">
  <span>Left</span>
  <Divider orientation="vertical" />
  <span>Right</span>
</div>`;
</script>

<h1>Divider</h1>

<p class="lead">
  A visual separator for content sections.
</p>

<h2>Basic Usage</h2>

<div class="demo">
  <p>First section content</p>
  <Divider />
  <p>Second section content</p>
</div>

<CodeBlock code={basicCode} lang="svelte" />

<h2>With Label</h2>

<p>
  Add content to the divider for labeled sections.
</p>

<div class="demo">
  <p>Sign in with your account</p>
  <Divider>or continue with</Divider>
  <p>Social login options</p>
</div>

<CodeBlock code={labeledCode} lang="svelte" />

<h2>Vertical Orientation</h2>

<div class="demo demo-vertical">
  <span>Left</span>
  <Divider orientation="vertical" />
  <span>Right</span>
</div>

<CodeBlock code={verticalCode} lang="svelte" />

<h2>Props</h2>

<PropsTable {props} />

<style>
  .demo {
    padding: 1.5rem;
    background: var(--color-base01);
    border-radius: 0.5rem;
    margin: 1.5rem 0;
  }

  .demo p {
    margin: 0;
    color: var(--color-base05);
  }

  .demo-vertical {
    display: flex;
    align-items: center;
    gap: 1rem;
    height: 60px;
  }

  .demo-vertical span {
    color: var(--color-base05);
  }
</style>

<script>
  import {CodeBlock, PropsTable} from '$lib/components/docs';
  import {Button, Popover} from '@miozu/jera';

  const props = [
    {name: 'content', type: 'string | Snippet', required: true, description: 'Popover content'},
    {name: 'position', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: 'Preferred position'},
    {name: 'delay', type: '{show: number, hide: number}', default: '{show: 100, hide: 100}', description: 'Show/hide delay in ms'},
    {name: 'offset', type: 'number', default: '8', description: 'Distance from trigger in px'}
  ];

  const basicCode = `<script>
  import { Popover, Button } from '@miozu/jera';
<\/script>

<Popover content="This is helpful information">
  <Button>Hover me</Button>
</Popover>`;

  const positionsCode = `<Popover content="Appears above" position="top">
  <Button>Top</Button>
</Popover>

<Popover content="Appears below" position="bottom">
  <Button>Bottom</Button>
</Popover>

<Popover content="Appears left" position="left">
  <Button>Left</Button>
</Popover>

<Popover content="Appears right" position="right">
  <Button>Right</Button>
</Popover>`;

  const customCode = `<Popover position="bottom">
  {#snippet content()}
    <div class="custom-popover">
      <strong>Rich Content</strong>
      <p>With HTML formatting and styling.</p>
    </div>
  {/snippet}
  <Button>Custom Content</Button>
</Popover>`;
</script>

<h1>Popover</h1>

<p class="lead">
  A tooltip/popover component with smart positioning and hover interaction.
</p>

<h2>Basic Usage</h2>

<div class="demo">
  <Popover content="This is helpful tooltip information">
    <Button>Hover me</Button>
  </Popover>
</div>

<CodeBlock code={basicCode} lang="svelte" />

<h2>Positions</h2>

<div class="demo">
  <Popover content="Appears above" position="top">
    <Button variant="outline">Top</Button>
  </Popover>
  <Popover content="Appears below" position="bottom">
    <Button variant="outline">Bottom</Button>
  </Popover>
  <Popover content="Appears to the left" position="left">
    <Button variant="outline">Left</Button>
  </Popover>
  <Popover content="Appears to the right" position="right">
    <Button variant="outline">Right</Button>
  </Popover>
</div>

<CodeBlock code={positionsCode} lang="svelte" />

<h2>Custom Content</h2>

<p>
  Use a snippet for rich HTML content in the popover.
</p>

<CodeBlock code={customCode} lang="svelte" />

<h2>Features</h2>

<ul>
  <li><strong>Smart Positioning</strong> - Automatically adjusts to stay within viewport</li>
  <li><strong>Hover Interaction</strong> - Popover stays visible when hovering over it</li>
  <li><strong>Configurable Delays</strong> - Control show/hide timing</li>
  <li><strong>Scroll Handling</strong> - Repositions on scroll and resize</li>
  <li><strong>Smooth Animations</strong> - Direction-aware fly transitions</li>
</ul>

<h2>Props</h2>

<PropsTable {props} />

<style>
  .demo {
    padding: 2rem;
    background: var(--color-base01);
    border-radius: 0.5rem;
    margin: 1.5rem 0;
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
</style>

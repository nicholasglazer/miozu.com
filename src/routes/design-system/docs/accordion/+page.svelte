<script>
  import {CodeBlock, PropsTable} from '$lib/components/docs';
  import {Accordion, AccordionItem} from '@miozu/jera';

  const accordionProps = [
    {name: 'expanded', type: 'string[]', default: '[]', description: 'Array of expanded item IDs (bindable)'},
    {name: 'multiple', type: 'boolean', default: 'false', description: 'Allow multiple items open'}
  ];

  const itemProps = [
    {name: 'id', type: 'string', description: 'Unique item identifier'},
    {name: 'title', type: 'string', required: true, description: 'Header text'},
    {name: 'disabled', type: 'boolean', default: 'false', description: 'Disable item'}
  ];

  const basicCode = `<script>
  import { Accordion, AccordionItem } from '@miozu/jera';
<\/script>

<Accordion>
  <AccordionItem id="item1" title="What is Jera?">
    Jera is a minimal, reactive component library for Svelte 5.
  </AccordionItem>
  <AccordionItem id="item2" title="How do I install it?">
    Run npm install @miozu/jera in your project.
  </AccordionItem>
  <AccordionItem id="item3" title="Is it free?">
    Yes, Jera is open source and free to use.
  </AccordionItem>
</Accordion>`;

  const multipleCode = `<Accordion multiple>
  <AccordionItem id="section1" title="Section 1">
    Content for section 1
  </AccordionItem>
  <AccordionItem id="section2" title="Section 2">
    Content for section 2
  </AccordionItem>
</Accordion>`;

  const controlledCode = `<script>
  let expanded = $state(['item1']);
<\/script>

<Accordion bind:expanded>
  <AccordionItem id="item1" title="Controlled Item 1">
    This is open by default.
  </AccordionItem>
  <AccordionItem id="item2" title="Controlled Item 2">
    Toggle me!
  </AccordionItem>
</Accordion>`;
</script>

<h1>Accordion</h1>

<p class="lead">
  Collapsible content sections with smooth animations.
</p>

<h2>Basic Usage</h2>

<div class="demo">
  <Accordion>
    <AccordionItem id="item1" title="What is Jera?">
      Jera is a minimal, reactive component library for Svelte 5. It's designed for elegance, scalability, and AI-assisted development.
    </AccordionItem>
    <AccordionItem id="item2" title="How do I install it?">
      Run <code>npm install @miozu/jera</code> in your project. Import components and tokens as needed.
    </AccordionItem>
    <AccordionItem id="item3" title="Is it free?">
      Yes, Jera is open source and free to use under the MIT license.
    </AccordionItem>
  </Accordion>
</div>

<CodeBlock code={basicCode} lang="svelte" />

<h2>Multiple Open</h2>

<p>
  Allow multiple sections to be open simultaneously.
</p>

<div class="demo">
  <Accordion multiple>
    <AccordionItem id="section1" title="Section 1">
      This section can be open while others are also open.
    </AccordionItem>
    <AccordionItem id="section2" title="Section 2">
      Click to open this one too!
    </AccordionItem>
    <AccordionItem id="section3" title="Section 3">
      All three can be open at once.
    </AccordionItem>
  </Accordion>
</div>

<CodeBlock code={multipleCode} lang="svelte" />

<h2>Disabled Items</h2>

<div class="demo">
  <Accordion>
    <AccordionItem id="enabled" title="Enabled Item">
      This item works normally.
    </AccordionItem>
    <AccordionItem id="disabled" title="Disabled Item" disabled>
      This item cannot be opened.
    </AccordionItem>
  </Accordion>
</div>

<h2>Controlled State</h2>

<CodeBlock code={controlledCode} lang="svelte" />

<h2>Accordion Props</h2>

<PropsTable props={accordionProps} />

<h2>AccordionItem Props</h2>

<PropsTable props={itemProps} />

<style>
  .demo {
    padding: 0;
    margin: 1.5rem 0;
  }

  code {
    padding: 0.125rem 0.375rem;
    background: var(--color-base02);
    border-radius: 0.25rem;
    font-size: 0.875rem;
  }
</style>

<script>
  import {CodeBlock, PropsTable} from '$lib/components/docs';
  import {Avatar} from '@miozu/jera';

  const props = [
    {name: 'src', type: 'string', description: 'Image URL'},
    {name: 'alt', type: 'string', description: 'Alt text for image'},
    {name: 'name', type: 'string', description: 'Name for initials fallback'},
    {name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'", default: "'md'", description: 'Avatar size'},
    {name: 'status', type: "'online' | 'offline' | 'busy' | 'away'", description: 'Status indicator'}
  ];

  const basicCode = `<script>
  import { Avatar } from '@miozu/jera';
<\/script>

<!-- With image -->
<Avatar src="/user.jpg" alt="John Doe" />

<!-- With initials fallback -->
<Avatar name="John Doe" />`;

  const sizesCode = `<Avatar name="XS" size="xs" />
<Avatar name="SM" size="sm" />
<Avatar name="MD" size="md" />
<Avatar name="LG" size="lg" />
<Avatar name="XL" size="xl" />
<Avatar name="2X" size="2xl" />`;

  const statusCode = `<Avatar name="Online User" status="online" />
<Avatar name="Offline User" status="offline" />
<Avatar name="Busy User" status="busy" />
<Avatar name="Away User" status="away" />`;
</script>

<h1>Avatar</h1>

<p class="lead">
  User avatar with image, initials fallback, and status indicator.
</p>

<h2>Basic Usage</h2>

<div class="demo">
  <Avatar name="John Doe" />
  <Avatar name="Jane Smith" />
  <Avatar name="Alex Johnson" />
</div>

<CodeBlock code={basicCode} lang="svelte" />

<h2>Sizes</h2>

<div class="demo">
  <Avatar name="XS" size="xs" />
  <Avatar name="SM" size="sm" />
  <Avatar name="MD" size="md" />
  <Avatar name="LG" size="lg" />
  <Avatar name="XL" size="xl" />
  <Avatar name="2X" size="2xl" />
</div>

<CodeBlock code={sizesCode} lang="svelte" />

<h2>Status Indicators</h2>

<div class="demo">
  <Avatar name="Online" status="online" size="lg" />
  <Avatar name="Offline" status="offline" size="lg" />
  <Avatar name="Busy" status="busy" size="lg" />
  <Avatar name="Away" status="away" size="lg" />
</div>

<CodeBlock code={statusCode} lang="svelte" />

<h2>Features</h2>

<ul>
  <li><strong>Image Support</strong> - Display user photos</li>
  <li><strong>Initials Fallback</strong> - Auto-generated from name</li>
  <li><strong>Color Generation</strong> - Consistent colors based on name</li>
  <li><strong>Status Indicators</strong> - Show online/offline/busy/away</li>
  <li><strong>Image Error Handling</strong> - Falls back to initials on load failure</li>
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
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }
</style>

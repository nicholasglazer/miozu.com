<!--
  Debug page for ThreeJS animations
  Shows console logs and tests a single animation
-->
<script>
  import OptimizedThreeCanvas from '$lib/three/OptimizedThreeCanvas.svelte';
  import { onMount } from 'svelte';

  let logs = $state([]);
  let originalConsole = {};

  onMount(() => {
    // Capture console logs
    originalConsole.log = console.log;
    originalConsole.warn = console.warn;
    originalConsole.error = console.error;

    const addLog = (type, ...args) => {
      const timestamp = new Date().toLocaleTimeString();
      const message = args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');

      logs.push({ type, timestamp, message });
      logs = [...logs]; // Trigger reactivity

      // Also call original console
      originalConsole[type](...args);

      // Limit logs to last 100 entries
      if (logs.length > 100) {
        logs = logs.slice(-100);
      }
    };

    console.log = (...args) => addLog('log', ...args);
    console.warn = (...args) => addLog('warn', ...args);
    console.error = (...args) => addLog('error', ...args);

    console.log('🔍 Debug mode activated');

    return () => {
      // Restore original console
      console.log = originalConsole.log;
      console.warn = originalConsole.warn;
      console.error = originalConsole.error;
    };
  });

  function clearLogs() {
    logs = [];
  }
</script>

<svelte:head>
  <title>ThreeJS Debug - miozu.com</title>
</svelte:head>

<main class="debug-page">
  <h1>ThreeJS Animation Debug</h1>

  <div class="test-container">
    <h2>Test Animation</h2>
    <div class="canvas-container">
      <OptimizedThreeCanvas
        type="sinuous-original"
        id="debug-test"
        lowRes={false}
      />
    </div>
  </div>

  <div class="logs-container">
    <div class="logs-header">
      <h2>Console Logs</h2>
      <button on:click={clearLogs}>Clear Logs</button>
    </div>
    <div class="logs">
      {#each logs as log}
        <div class="log-entry log-{log.type}">
          <span class="timestamp">{log.timestamp}</span>
          <span class="type">[{log.type.toUpperCase()}]</span>
          <span class="message">{log.message}</span>
        </div>
      {/each}
      {#if logs.length === 0}
        <div class="log-entry">
          <span class="message">No logs yet...</span>
        </div>
      {/if}
    </div>
  </div>
</main>

<style>
  .debug-page {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
    font-family: monospace;
  }

  h1 {
    margin-bottom: 30px;
    color: #333;
  }

  .test-container {
    margin-bottom: 40px;
  }

  .canvas-container {
    width: 400px;
    height: 300px;
    position: relative;
    border: 2px solid #ccc;
    background: #000;
    margin: 20px 0;
  }

  .logs-container {
    background: #f5f5f5;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .logs-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #ccc;
    background: #ebebeb;
  }

  .logs-header h2 {
    margin: 0;
  }

  .logs-header button {
    padding: 8px 16px;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-family: inherit;
  }

  .logs {
    max-height: 600px;
    overflow-y: auto;
    padding: 15px;
  }

  .log-entry {
    display: flex;
    margin-bottom: 8px;
    padding: 4px;
    border-radius: 2px;
    font-size: 12px;
    line-height: 1.4;
  }

  .log-entry.log-log {
    background: #e8f4f8;
  }

  .log-entry.log-warn {
    background: #fff3cd;
  }

  .log-entry.log-error {
    background: #f8d7da;
  }

  .timestamp {
    margin-right: 12px;
    color: #666;
    min-width: 80px;
  }

  .type {
    margin-right: 12px;
    font-weight: bold;
    min-width: 60px;
  }

  .log-log .type {
    color: #0c7489;
  }

  .log-warn .type {
    color: #856404;
  }

  .log-error .type {
    color: #721c24;
  }

  .message {
    flex: 1;
    white-space: pre-wrap;
    word-break: break-word;
  }
</style>
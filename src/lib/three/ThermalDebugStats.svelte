<!--
  Thermal Debug Stats - Shows global ThreeJS thermal management status
  Use this to monitor temperature control and performance scaling
-->
<script>
  import { getGlobalThreeStats } from './GlobalThreeManager.svelte.js';
  import { browser } from '$app/environment';

  let stats = $state({});
  let updateInterval = null;

  // Update stats every second
  function updateStats() {
    if (browser) {
      try {
        stats = getGlobalThreeStats();
      } catch (error) {
        console.warn('Failed to get global three stats:', error);
      }
    }
  }

  // Start monitoring
  if (browser) {
    updateStats();
    updateInterval = setInterval(updateStats, 1000);
  }

  // Cleanup
  import { onDestroy } from 'svelte';
  onDestroy(() => {
    if (updateInterval) {
      clearInterval(updateInterval);
    }
  });

  // Emergency stop button for testing
  function emergencyStop() {
    try {
      const { globalEmergencyStop } = require('./GlobalThreeManager.svelte.js');
      globalEmergencyStop();
      updateStats();
    } catch (error) {
      console.error('Emergency stop failed:', error);
    }
  }
</script>

<!-- Thermal status display -->
<div class="thermal-debug-stats">
  <div class="thermal-header">
    🌡️ Thermal Control
    {#if stats.thermalThrottling}
      <span class="thermal-warning">⚠️ THROTTLING</span>
    {/if}
  </div>

  <div class="thermal-info">
    <div class="stat">
      <span class="label">Instances:</span>
      <span class="value">{stats.totalInstances || 0}</span>
    </div>

    <div class="stat">
      <span class="label">Global FPS:</span>
      <span class="value fps">{stats.globalFPS || 0}</span>
    </div>

    {#if stats.performanceHistory && stats.performanceHistory.length > 0}
      <div class="stat">
        <span class="label">Measured FPS:</span>
        <span class="value">{stats.performanceHistory[stats.performanceHistory.length - 1]?.fps.toFixed(1) || '0'}</span>
      </div>
    {/if}
  </div>

  {#if stats.instances && stats.instances.length > 0}
    <div class="instances-list">
      {#each stats.instances as instance}
        <div class="instance" class:paused={instance.paused}>
          <span class="instance-id">{instance.type}</span>
          <span class="instance-status">
            {instance.paused ? '⏸️' : '▶️'}
          </span>
        </div>
      {/each}
    </div>
  {/if}

  <button class="emergency-button" on:click={emergencyStop}>
    🚨 Emergency Stop
  </button>
</div>

<style>
  .thermal-debug-stats {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 12px;
    border-radius: 8px;
    font-family: monospace;
    font-size: 12px;
    z-index: 1000;
    min-width: 200px;
    backdrop-filter: blur(8px);
  }

  .thermal-header {
    font-weight: bold;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .thermal-warning {
    color: #ff6b6b;
    font-size: 11px;
    font-weight: bold;
  }

  .thermal-info {
    margin-bottom: 8px;
  }

  .stat {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
  }

  .label {
    color: #ccc;
  }

  .value {
    color: #4ecdc4;
    font-weight: bold;
  }

  .fps {
    color: #ffd93d;
  }

  .instances-list {
    margin-bottom: 8px;
    border-top: 1px solid #333;
    padding-top: 8px;
  }

  .instance {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2px;
    padding: 2px 4px;
    border-radius: 4px;
  }

  .instance.paused {
    background: rgba(255, 107, 107, 0.2);
  }

  .instance-id {
    font-size: 10px;
    color: #ccc;
  }

  .emergency-button {
    width: 100%;
    padding: 6px;
    background: #ff6b6b;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 11px;
    cursor: pointer;
    font-family: monospace;
  }

  .emergency-button:hover {
    background: #ff5252;
  }
</style>
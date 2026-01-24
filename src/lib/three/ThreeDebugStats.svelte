<!--
  ThreeJS Performance Debug Stats
  Shows FPS, draw calls, and active scenes for development
-->
<script>
  import { getThreeStats } from './OptimizedThreeManager.svelte.js';

  const { show = false } = $props();

  // Reactive stats from the manager
  const stats = $derived(getThreeStats());
</script>

{#if show && stats}
  <div class="debug-stats">
    <div class="stats-header">🔧 ThreeJS Performance</div>
    <div class="stats-grid">
      <div class="stat-item">
        <span class="stat-label">FPS:</span>
        <span class="stat-value" class:good={stats.fps >= 60} class:warning={stats.fps >= 30 && stats.fps < 60} class:bad={stats.fps < 30}>
          {stats.fps}
        </span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Draw Calls:</span>
        <span class="stat-value" class:good={stats.drawCalls <= 5} class:warning={stats.drawCalls <= 10} class:bad={stats.drawCalls > 10}>
          {stats.drawCalls}
        </span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Scenes:</span>
        <span class="stat-value">{stats.canvasCount}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Visible:</span>
        <span class="stat-value">{stats.visibleCount}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Running:</span>
        <span class="stat-indicator" class:active={stats.isRunning}></span>
      </div>
    </div>
  </div>
{/if}

<style>
  .debug-stats {
    position: fixed;
    top: 60px;
    right: 10px;
    background: rgba(0, 0, 0, 0.9);
    color: #fff;
    padding: 12px;
    border-radius: 8px;
    font-family: monospace;
    font-size: 12px;
    z-index: 9999;
    backdrop-filter: blur(4px);
    border: 1px solid #333;
    min-width: 180px;
  }

  .stats-header {
    font-weight: bold;
    margin-bottom: 8px;
    text-align: center;
    color: #4a9eff;
  }

  .stats-grid {
    display: grid;
    gap: 4px;
  }

  .stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .stat-label {
    color: #aaa;
  }

  .stat-value {
    font-weight: bold;
    color: #fff;
  }

  .stat-value.good {
    color: #4ade80;
  }

  .stat-value.warning {
    color: #fbbf24;
  }

  .stat-value.bad {
    color: #f87171;
  }

  .stat-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #666;
  }

  .stat-indicator.active {
    background: #4ade80;
    box-shadow: 0 0 4px #4ade80;
  }
</style>
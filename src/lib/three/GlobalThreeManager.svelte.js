/**
 * Global ThreeJS Manager - Reactive Singleton for Temperature Control
 * Coordinates all ThreeJS instances across the entire application
 * Implements intelligent performance scaling and emergency thermal protection
 */

import { browser } from '$app/environment';

export class GlobalThreeManager {
  // Reactive state using Svelte 5 runes
  activeInstances = $state(new Map());
  globalFPS = $state(15); // EMERGENCY: Start with very low FPS
  thermalThrottling = $state(false);
  totalInstances = $derived(this.activeInstances.size);

  // Performance monitoring
  performanceHistory = $state([]);
  lastPerformanceCheck = 0;
  frameCount = 0;

  constructor() {
    if (browser) {
      this.setupGlobalOptimizations();
      this.startPerformanceMonitoring();
    }
  }

  // Register a new ThreeJS instance
  registerInstance(id, sceneManager, type) {
    console.log(`🌡️  Registering ThreeJS instance: ${id} (${type})`);

    this.activeInstances.set(id, {
      id,
      sceneManager,
      type,
      registeredAt: Date.now(),
      lastSeen: Date.now()
    });

    this.activeInstances = new Map(this.activeInstances);
    this.adjustGlobalPerformance();

    return id;
  }

  // Unregister instance
  unregisterInstance(id) {
    if (this.activeInstances.has(id)) {
      console.log(`♻️  Unregistering ThreeJS instance: ${id}`);
      this.activeInstances.delete(id);
      this.activeInstances = new Map(this.activeInstances);
      this.adjustGlobalPerformance();
    }
  }

  // CRITICAL: Adjust performance based on total instances and temperature
  adjustGlobalPerformance() {
    const instanceCount = this.totalInstances;

    if (instanceCount === 0) {
      this.globalFPS = 15;
      this.thermalThrottling = false;
    } else if (instanceCount === 1) {
      this.globalFPS = 15; // Still conservative for single instance
      this.thermalThrottling = false;
    } else if (instanceCount <= 3) {
      this.globalFPS = 10; // Multiple instances = even lower FPS
      this.thermalThrottling = true;
    } else {
      this.globalFPS = 5; // Emergency mode for many instances
      this.thermalThrottling = true;
      this.pauseAllButOne(); // Only keep one instance running
    }

    // Apply new settings to all instances
    for (const [id, instance] of this.activeInstances) {
      if (instance.sceneManager.targetFPS) {
        instance.sceneManager.targetFPS = this.globalFPS;
        console.log(`🌡️  Updated ${id} to ${this.globalFPS} FPS`);
      }
    }

    console.log(`🌡️  Global performance adjusted: ${instanceCount} instances, ${this.globalFPS} FPS, thermal: ${this.thermalThrottling}`);
  }

  // Emergency: Pause all but the first instance
  pauseAllButOne() {
    let firstInstance = true;

    for (const [id, instance] of this.activeInstances) {
      if (firstInstance) {
        instance.sceneManager.resume();
        console.log(`🔥 Keeping ${id} active (primary instance)`);
        firstInstance = false;
      } else {
        instance.sceneManager.pause();
        console.log(`❄️  Pausing ${id} (thermal protection)`);
      }
    }
  }

  // Setup global optimizations
  setupGlobalOptimizations() {
    // Page visibility change - pause all when tab hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAll();
        console.log('❄️  Page hidden - all instances paused');
      } else {
        this.resumeAll();
        console.log('🔥 Page visible - instances resumed');
      }
    });

    // Window blur/focus - additional layer of control
    window.addEventListener('blur', () => {
      this.pauseAll();
      console.log('❄️  Window blurred - all instances paused');
    });

    window.addEventListener('focus', () => {
      this.resumeAll();
      console.log('🔥 Window focused - instances resumed');
    });

    // Emergency thermal protection based on frame rate drops
    setInterval(() => {
      this.checkPerformance();
    }, 5000);
  }

  // Performance monitoring and thermal protection
  checkPerformance() {
    const now = performance.now();
    const timeDelta = now - this.lastPerformanceCheck;

    if (timeDelta < 1000) return; // Too soon

    const measuredFPS = (this.frameCount * 1000) / timeDelta;
    this.frameCount = 0;
    this.lastPerformanceCheck = now;

    // Keep performance history
    this.performanceHistory.push({
      timestamp: now,
      fps: measuredFPS,
      instances: this.totalInstances
    });

    // Keep only last 10 measurements
    if (this.performanceHistory.length > 10) {
      this.performanceHistory.shift();
    }

    this.performanceHistory = [...this.performanceHistory];

    // Emergency thermal protection - if FPS drops significantly below target
    const targetFPS = this.globalFPS;
    const fpsRatio = measuredFPS / targetFPS;

    if (fpsRatio < 0.7 && this.totalInstances > 0) {
      const fpsFormatted = measuredFPS.toFixed(1);
      console.warn(`🚨 Performance degradation detected: ${fpsFormatted}/${targetFPS} FPS`);

      if (this.totalInstances > 1) {
        this.pauseAllButOne();
        console.warn('🚨 Emergency: Paused all but one instance due to thermal stress');
      } else {
        // Even single instance is struggling - reduce further
        this.globalFPS = Math.max(5, this.globalFPS - 2);
        this.adjustGlobalPerformance();
        console.warn(`🚨 Emergency: Reduced FPS to ${this.globalFPS} due to thermal stress`);
      }
    }
  }

  // Count frame for performance monitoring
  countFrame() {
    this.frameCount++;
  }

  // Pause all instances
  pauseAll() {
    for (const [id, instance] of this.activeInstances) {
      instance.sceneManager.pause();
    }
  }

  // Resume all instances (respecting thermal throttling)
  resumeAll() {
    if (this.thermalThrottling) {
      this.pauseAllButOne(); // Only resume one if thermal throttling
    } else {
      for (const [id, instance] of this.activeInstances) {
        instance.sceneManager.resume();
      }
    }
  }

  // Get status for debugging
  getStatus() {
    return {
      totalInstances: this.totalInstances,
      globalFPS: this.globalFPS,
      thermalThrottling: this.thermalThrottling,
      performanceHistory: this.performanceHistory.slice(-3), // Last 3 measurements
      instances: Array.from(this.activeInstances.entries()).map(([id, instance]) => ({
        id,
        type: instance.type,
        paused: instance.sceneManager.paused,
        uptime: Date.now() - instance.registeredAt
      }))
    };
  }

  // Emergency stop all
  emergencyStop() {
    console.error('🚨 EMERGENCY STOP - Thermal protection activated');
    this.pauseAll();
    this.globalFPS = 1; // Minimum possible
    this.thermalThrottling = true;
    this.adjustGlobalPerformance();
  }
}

// Create singleton instance
let globalManager = null;

export function getGlobalThreeManager() {
  if (!globalManager) {
    globalManager = new GlobalThreeManager();
  }
  return globalManager;
}

// Convenience functions
export function registerGlobalInstance(id, sceneManager, type) {
  const manager = getGlobalThreeManager();
  return manager.registerInstance(id, sceneManager, type);
}

export function unregisterGlobalInstance(id) {
  const manager = getGlobalThreeManager();
  return manager.unregisterInstance(id);
}

export function getGlobalThreeStats() {
  const manager = getGlobalThreeManager();
  return manager.getStatus();
}

export function globalEmergencyStop() {
  const manager = getGlobalThreeManager();
  return manager.emergencyStop();
}
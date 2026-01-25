<!--
  ThreeJS Canvas Component - Uses REAL effect system (oraklex.com pattern)
  NOW CORRECTLY implements dynamic effect loading with actual effect classes
-->
<script>
  import { onMount, onDestroy } from 'svelte';
  import { SceneManager } from './SceneManager';
  import { canvasRegistry } from '$lib/reactiveStates/canvasRegistry.svelte';
  import { registerGlobalInstance, unregisterGlobalInstance } from './GlobalThreeManager.svelte.js';
  import { browser } from '$app/environment';

  // Props using Svelte 5 runes
  const { type = 'sinuous-original', id = `canvas-${Date.now()}`, lowRes = false } = $props();

  // Reactive state (following oraklex.com pattern)
  let canvasElement = $state(null);
  let containerWidth = $state(0);
  let containerHeight = $state(0);
  let sceneManager = $state(null);
  let effectInstance = $state(null);
  let isInitialized = $state(false);
  let error = $state(null);
  let isVisible = $state(true);

  // Intersection observer
  let intersectionObserver = null;

  // Initialize Three.js scene using REAL effect system (oraklex pattern)
  async function initializeScene() {
    if (!canvasElement || !browser) {
      console.warn('❌ Cannot initialize scene: canvasElement is null or not in browser');
      return;
    }

    // Validate dimensions like oraklex.com does
    if (containerWidth <= 0 || containerHeight <= 0) {
      console.warn(`⏳ Invalid dimensions: ${containerWidth}x${containerHeight}, skipping init`);
      return;
    }

    // Log current state for debugging
    console.log(`🚀 Initializing scene: ${type} (${id})`, {
      containerWidth,
      containerHeight,
      canvasElement: !!canvasElement,
      isInitialized,
      error
    });

    try {
      // Create SceneManager with EMERGENCY temperature optimizations
      sceneManager = new SceneManager({
        container: canvasElement,
        alpha: true,
        antialias: false, // EMERGENCY: Always disabled for temperature control
        pixelRatio: 1.0, // EMERGENCY: Always 1.0, no retina scaling
        noDepth: true, // Most shader effects don't need depth
        forceWebGL: false
      });

      // Initialize WebGL context
      await sceneManager.init();

      // CRITICAL: Register with global thermal management system
      registerGlobalInstance(id, sceneManager, type);

      // CRITICAL: Load REAL effect class based on type (oraklex pattern)
      await loadEffect();

      // CRITICAL: Start render loop with REAL effect update (oraklex pattern)
      console.log('🔄 Starting render loop...');
      let frameCount = 0;
      sceneManager.startRenderLoop((delta) => {
        frameCount++;

        // Debug first few frames
        if (frameCount <= 5 || frameCount % 60 === 0) {
          console.log(`🎬 Frame ${frameCount}: delta=${delta.toFixed(4)}, effectInstance=${!!effectInstance}`);
        }

        if (effectInstance) {
          try {
            effectInstance.update(delta); // Call REAL effect's update method
          } catch (err) {
            console.error(`❌ Effect update error on frame ${frameCount}:`, err);
          }
        } else {
          if (frameCount <= 10) {
            console.warn(`⚠️  No effectInstance on frame ${frameCount}`);
          }
        }
      });
      console.log('✅ Render loop started');

      // Setup intersection observer for visibility optimization
      setupVisibilityObserver();

      // Register with canvas registry (same as oraklex pattern)
      canvasRegistry.register(id, {
        container: canvasElement,
        canvas: sceneManager.getRenderer().domElement,
        sceneManager: sceneManager,
        effectInstance: effectInstance
      });

      isInitialized = true;
      console.log(`✅ Scene initialized: ${type} with REAL effect system`);

    } catch (err) {
      error = `Failed to initialize ${type}: ${err.message}`;
      console.error('❌', error);
    }
  }

  // CRITICAL: Load REAL effect classes (oraklex.com pattern)
  async function loadEffect() {
    console.log(`🎨 Loading REAL effect: ${type}`, { sceneManager: !!sceneManager });

    switch (type) {
      case 'sinuous-original':
        console.log('📦 Importing SinuousOriginalEffect...');
        try {
          const { SinuousOriginalEffect } = await import('./effects/SinuousOriginal');
          console.log('✅ SinuousOriginalEffect imported');

          console.log('🏗️  Creating SinuousOriginalEffect instance...');
          effectInstance = new SinuousOriginalEffect(sceneManager);
          console.log('✅ SinuousOriginalEffect instance created');

          console.log('🚀 Initializing SinuousOriginalEffect...');
          await effectInstance.init();
          console.log('✅ SinuousOriginalEffect initialized successfully');
        } catch (err) {
          console.error('❌ Failed to load SinuousOriginalEffect:', err);
          console.log('🔄 Falling back to placeholder effect...');
          createPlaceholderEffect();
        }
        break;

      // TODO: Add other effects as needed
      case 'synaptic':
      case 'ether':
      case 'snake-trails':
        // For now, fall back to basic effect until other effects are ported
        console.warn(`⚠️  Effect ${type} not yet ported, using placeholder`);
        createPlaceholderEffect();
        break;

      default:
        console.warn(`⚠️  Unknown effect type: ${type}, using placeholder`);
        createPlaceholderEffect();
    }

    console.log(`✅ Effect loaded: ${type}`, {
      effectInstance: !!effectInstance,
      hasUpdate: !!(effectInstance && effectInstance.update),
      hasDestroy: !!(effectInstance && effectInstance.destroy)
    });
  }

  // Temporary placeholder for effects not yet ported
  function createPlaceholderEffect() {
    const THREE = sceneManager.getTHREE();
    const scene = sceneManager.getScene();

    // Simple rotating cube as placeholder
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0x4a9eff,
      wireframe: true
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Create minimal effect interface
    effectInstance = {
      update: (delta) => {
        cube.rotation.x += delta;
        cube.rotation.y += delta * 0.7;
      },
      destroy: () => {
        scene.remove(cube);
        geometry.dispose();
        material.dispose();
      }
    };
  }

  // Setup visibility observer for temperature optimization (same as oraklex)
  function setupVisibilityObserver() {
    if (!browser || !canvasElement || !sceneManager) return;

    intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;

        if (wasVisible !== isVisible) {
          if (isVisible) {
            sceneManager.resume();
            console.log(`👁️  ${type} visible - resumed`);
          } else {
            sceneManager.pause();
            console.log(`🙈 ${type} hidden - paused`);
          }
        }
      },
      {
        threshold: 0.05, // Pause when less than 5% visible
        rootMargin: '50px' // Start rendering 50px before visible
      }
    );

    intersectionObserver.observe(canvasElement);
  }

  // Lifecycle management (exact oraklex.com pattern)
  onMount(async () => {
    // Wait for next tick to ensure DOM is fully ready
    await new Promise(resolve => setTimeout(resolve, 0));

    // Only initialize if we have valid dimensions (oraklex pattern)
    if (canvasElement && containerWidth > 0 && containerHeight > 0) {
      initializeScene();
    } else if (canvasElement) {
      console.warn(`⏳ Waiting for dimensions: ${containerWidth}x${containerHeight}`);
    }
  });

  // Reactive initialization fallback - retry when dimensions become available
  $effect(() => {
    if (canvasElement && containerWidth > 0 && containerHeight > 0 && !isInitialized && !error) {
      console.log(`✨ Dimensions ready, initializing: ${containerWidth}x${containerHeight}`);
      initializeScene();
    }
  });

  // Reactive resize effect (oraklex.com pattern) - NOT initialization
  $effect(() => {
    if (sceneManager && containerWidth > 0 && containerHeight > 0) {
      sceneManager.resize(containerWidth, containerHeight);

      // CRITICAL: Tell effect about resize (some effects like SinuousOriginal need this)
      if (effectInstance && effectInstance.forceResize) {
        effectInstance.forceResize(containerWidth, containerHeight);
      }

      console.log(`📐 Reactive resize: ${containerWidth}x${containerHeight}`);
    }
  });

  onDestroy(() => {
    console.log(`♻️  Cleaning up ${type} (${id})`);

    // CRITICAL: Unregister from global thermal management system
    unregisterGlobalInstance(id);

    // Stop intersection observer
    if (intersectionObserver) {
      intersectionObserver.disconnect();
      intersectionObserver = null;
    }

    // Unregister from canvas registry
    canvasRegistry.unregister(id);

    // CRITICAL: Cleanup effect first
    if (effectInstance && effectInstance.destroy) {
      effectInstance.destroy();
      effectInstance = null;
    }

    // Then cleanup SceneManager
    if (sceneManager) {
      sceneManager.destroy();
      sceneManager = null;
    }
  });

  // Animation is now handled by REAL effect classes via effectInstance.update(delta)
  // This is the exact pattern that makes oraklex.com work!
</script>

<!-- Canvas container (exact oraklex.com pattern) -->
<div
  bind:this={canvasElement}
  bind:clientWidth={containerWidth}
  bind:clientHeight={containerHeight}
  class="three-canvas"
  class:initialized={isInitialized}
  class:error={error}
  class:paused={!isVisible}
  data-effect-type={type}
  data-low-res={lowRes}
>
  {#if error}
    <div class="error-overlay">
      <p>WebGL Error: {error}</p>
    </div>
  {/if}
</div>

<style>
  .three-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: transparent;
    z-index: 0;
  }

  .error-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 0, 0, 0.1);
    color: #ff4444;
    font-size: 0.8rem;
    text-align: center;
    padding: 1rem;
    z-index: 1;
  }

  .three-canvas.initialized {
    background: transparent;
  }

  .three-canvas.paused {
    opacity: 0.5; /* Visual feedback when paused for performance */
  }

  /* Performance hint for browser */
  .three-canvas {
    contain: layout style paint;
    will-change: transform;
  }

  /* Ensure canvas fills container correctly */
  .three-canvas :global(canvas) {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
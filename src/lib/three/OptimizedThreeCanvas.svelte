<!--
  Optimized ThreeJS Canvas Component
  Uses individual WebGL context per canvas (proven working pattern from oraklex.com)
  Implements temperature-reducing optimizations
-->
<script>
  import { onMount, onDestroy } from 'svelte';
  import { OptimizedSceneManager } from './OptimizedSceneManager.js';
  import { canvasRegistry } from '$lib/reactiveStates/canvasRegistry.svelte';
  import { browser } from '$app/environment';

  // Props using Svelte 5 runes
  const { type = 'sinuous-original', id = `canvas-${Date.now()}`, lowRes = false } = $props();

  // Reactive state (following oraklex.com pattern)
  let canvasElement = $state(null);
  let containerWidth = $state(0);
  let containerHeight = $state(0);
  let sceneManager = $state(null);
  let isInitialized = $state(false);
  let error = $state(null);
  let isVisible = $state(true);

  // Scene resources
  let meshes = [];
  let intersectionObserver = null;

  // Initialize Three.js scene using individual SceneManager (oraklex pattern)
  async function initializeScene() {
    if (!canvasElement || !browser) {
      console.warn('❌ Cannot initialize scene: canvasElement is null or not in browser');
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
      // Create individual SceneManager for this canvas (proven working pattern)
      sceneManager = new OptimizedSceneManager({
        container: canvasElement,
        alpha: true,
        antialias: !lowRes, // Disable antialias for low-res to save performance
        powerPreference: lowRes ? 'default' : 'default', // Always use 'default' for temperature control
        pixelRatio: lowRes ? 1 : Math.min(window.devicePixelRatio, 1.5),
        maxFPS: lowRes ? 20 : 30 // Lower FPS for better temperature control
      });

      // Initialize WebGL context
      const success = await sceneManager.init();
      if (!success) {
        throw new Error('Failed to initialize SceneManager');
      }

      // Create effect using the manager's Three.js objects
      await createEffect(sceneManager.getThree(), sceneManager.getScene());

      // Start render loop with animation update (oraklex pattern)
      sceneManager.startRenderLoop((delta) => {
        updateAnimation(delta);
      });

      // Setup intersection observer for visibility optimization
      setupVisibilityObserver();

      // Register with canvas registry for compatibility
      canvasRegistry.register(id, {
        container: canvasElement,
        canvas: sceneManager.getRenderer().domElement,
        sceneManager: sceneManager,
        effectInstance: {
          forceResize: () => {
            const rect = canvasElement.getBoundingClientRect();
            sceneManager.resize(rect.width, rect.height);
          },
          destroy: () => sceneManager.destroy()
        }
      });

      isInitialized = true;
      console.log(`✅ Scene initialized: ${type} (individual renderer)`);

    } catch (err) {
      error = `Failed to initialize ${type}: ${err.message}`;
      console.error('❌', error);
    }
  }

  // Create different effects based on type
  async function createEffect(THREE, scene) {
    const geometry = getGeometry(THREE);
    const material = getMaterial(THREE);

    if (type.includes('multipass')) {
      // Create multiple instances for multipass effects
      for (let i = 0; i < 3; i++) {
        const mesh = new THREE.Mesh(geometry, material.clone());
        mesh.position.x = (i - 1) * 2;
        mesh.userData.speed = 0.01 + i * 0.005;
        scene.add(mesh);
        meshes.push(mesh);
      }
    } else {
      // Single mesh
      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData.speed = 0.01;
      scene.add(mesh);
      meshes.push(mesh);
    }

    // Add lighting for certain effects
    if (['ether', 'synaptic'].includes(type)) {
      const light = new THREE.PointLight(0x4a9eff, 1, 100);
      light.position.set(10, 10, 10);
      scene.add(light);
    }

    console.log(`🎨 Created ${meshes.length} meshes for ${type}`);
  }

  // Get geometry based on effect type
  function getGeometry(THREE) {
    switch (type) {
      case 'sinuous-original':
        return new THREE.PlaneGeometry(3, 3, 32, 32);
      case 'synaptic-multipass':
        return new THREE.SphereGeometry(0.5, 16, 16);
      case 'synaptic':
        return new THREE.TorusGeometry(0.7, 0.3, 8, 16);
      case 'ether':
        return new THREE.BoxGeometry(1, 1, 1);
      case 'snake-trails':
        return new THREE.CylinderGeometry(0.1, 0.1, 2, 8);
      default:
        return new THREE.SphereGeometry(1, 16, 16);
    }
  }

  // Get material based on effect type
  function getMaterial(THREE) {
    const baseColor = type.includes('sinuous') ? 0x4a9eff : 0x6bb3ff;

    return new THREE.MeshBasicMaterial({
      color: baseColor,
      transparent: true,
      opacity: 0.7,
      wireframe: type.includes('snake')
    });
  }

  // Animation update function called every frame (oraklex pattern)
  let accumulatedTime = 0;

  function updateAnimation(delta) {
    if (!meshes.length) return;

    // Accumulate time for smooth animations
    accumulatedTime += delta;

    meshes.forEach((mesh, index) => {
      const speed = mesh.userData.speed || 0.01;
      const time = accumulatedTime;

      switch (type) {
        case 'sinuous-original':
          mesh.rotation.z = time * speed;
          // Vertex displacement for wave effect
          if (mesh.geometry.attributes.position) {
            const positions = mesh.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
              positions[i + 2] = Math.sin(positions[i] * 0.5 + time) * 0.1;
            }
            mesh.geometry.attributes.position.needsUpdate = true;
          }
          break;

        case 'synaptic-multipass':
        case 'synaptic':
          mesh.rotation.x = time * speed;
          mesh.rotation.y = time * speed * 0.7;
          mesh.position.y = Math.sin(time + index) * 0.5;
          break;

        case 'ether':
          mesh.rotation.x = time * speed;
          mesh.rotation.y = time * speed;
          mesh.rotation.z = time * speed;
          mesh.scale.setScalar(1 + Math.sin(time * 2) * 0.1);
          break;

        case 'snake-trails':
          mesh.rotation.y = time * speed;
          mesh.position.x = Math.cos(time + index) * 1;
          mesh.position.z = Math.sin(time + index) * 1;
          break;
      }
    });
  }

  // Setup visibility observer for temperature optimization
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
            console.log(`🙈 ${type} hidden - paused (RAF cancelled)`);
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

  // Lifecycle management (proper oraklex.com pattern)
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
      console.log(`📐 Reactive resize: ${containerWidth}x${containerHeight}`);
    }
  });

  onDestroy(() => {
    console.log(`♻️  Cleaning up ${type} (${id})`);

    // Stop intersection observer
    if (intersectionObserver) {
      intersectionObserver.disconnect();
      intersectionObserver = null;
    }

    // Unregister from canvas registry
    canvasRegistry.unregister(id);

    // Destroy SceneManager (handles all Three.js cleanup)
    if (sceneManager) {
      sceneManager.destroy();
      sceneManager = null;
    }

    // Clear mesh references
    meshes = [];
  });

  // Animation is now handled by individual SceneManager render loop
  // Reactive resizing is handled by the $effect above watching containerWidth/Height
</script>

<!-- Canvas container for individual WebGL renderer (oraklex.com pattern) -->
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
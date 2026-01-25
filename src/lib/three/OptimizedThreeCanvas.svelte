<!--
  Optimized ThreeJS Canvas Component
  Uses shared WebGL context and centralized render loop
  Implements viewport-based rendering for Fibonacci layout
-->
<script>
  import { onMount, onDestroy } from 'svelte';
  import { registerScene, unregisterScene } from './OptimizedThreeManager.svelte.js';
  import { canvasRegistry } from '$lib/reactiveStates/canvasRegistry.svelte';

  // Props using Svelte 5 runes
  const { type = 'sinuous-original', id = `canvas-${Date.now()}`, lowRes = false } = $props();

  // Reactive state
  let canvasElement = $state(null);
  let sceneId = $state(null);
  let isInitialized = $state(false);
  let error = $state(null);

  // Scene resources
  let scene = null;
  let camera = null;
  let meshes = [];

  // Initialize Three.js scene based on effect type
  async function initializeScene() {
    if (!canvasElement) {
      console.warn('❌ Cannot initialize scene: canvasElement is null');
      return;
    }

    console.log(`🚀 Initializing scene: ${type} (${id})`);

    try {
      const THREE = await import('three');

      // Create scene
      scene = new THREE.Scene();

      // Create camera
      camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      camera.position.z = 5;

      // Create geometry based on effect type
      await createEffect(THREE);

      // Register with shared manager
      sceneId = await registerScene(canvasElement, {
        id,
        scene,
        camera,
        effectType: type,
        lowRes
      });

      if (!sceneId) {
        throw new Error('Failed to register scene with shared manager');
      }

      // Register with canvas registry for animation compatibility
      if (sceneId && canvasElement) {
        // Create a virtual canvas for animation system compatibility
        const virtualCanvas = document.createElement('canvas');
        virtualCanvas.style.width = '100%';
        virtualCanvas.style.height = '100%';

        canvasRegistry.register(id, {
          container: canvasElement,
          canvas: virtualCanvas,
          sceneManager: null, // Not needed for our optimization
          effectInstance: {
            forceResize: () => {}, // No-op since we handle resizing centrally
            destroy: () => {} // No-op since cleanup is handled by unregisterScene
          }
        });
      }

      isInitialized = true;
      console.log(`✅ Scene initialized: ${type} (${sceneId})`);

    } catch (err) {
      error = `Failed to initialize ${type}: ${err.message}`;
      console.error('❌', error);
    }
  }

  // Create different effects based on type
  async function createEffect(THREE) {
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

    // Setup animation
    setupAnimation(THREE);
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

  // Setup animation for meshes (following oraklex.com pattern)
  function setupAnimation(THREE) {
    // Track accumulated time like oraklex.com does
    let accumulatedTime = 0;

    // Animation update function that accepts delta timing
    const animate = (delta) => {
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
    };

    // Store animation function for the render loop (expects delta parameter)
    scene.userData.animate = animate;
  }

  // Lifecycle management
  onMount(() => {
    // Don't call initializeScene here - canvasElement might not be bound yet
  });

  // Reactive initialization when canvasElement becomes available
  $effect(() => {
    if (canvasElement && !isInitialized && !error) {
      initializeScene();
    }
  });

  onDestroy(() => {
    if (sceneId) {
      unregisterScene(sceneId);
    }

    // Unregister from canvas registry
    canvasRegistry.unregister(id);

    // Cleanup Three.js resources
    if (scene) {
      scene.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(material => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    }

    meshes = [];
    scene = null;
    camera = null;
  });

  // Handle resize
  $effect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        if (camera && canvasElement) {
          const rect = canvasElement.getBoundingClientRect();
          camera.aspect = rect.width / rect.height;
          camera.updateProjectionMatrix();
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  });

  // Animation is now handled by the centralized render loop in OptimizedThreeManager
  // No need to call animate() here - it's called before each render
</script>

<!-- Canvas element that will be managed by the shared renderer -->
<div
  bind:this={canvasElement}
  class="three-canvas"
  class:initialized={isInitialized}
  class:error={error}
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

  /* Performance hint for browser */
  .three-canvas {
    contain: layout style paint;
    will-change: transform;
  }
</style>
/**
 * Optimized Scene Manager - Individual WebGL Context Pattern
 * Based on working oraklex.com pattern but with temperature-reducing optimizations
 * Each canvas gets its own renderer but with lower resource usage
 */

export class OptimizedSceneManager {
  constructor(config) {
    this.config = {
      alpha: true,
      antialias: false, // OPTIMIZATION: Disable for better performance
      powerPreference: 'default', // OPTIMIZATION: Use 'default' instead of 'high-performance'
      pixelRatio: Math.min(window.devicePixelRatio, 1.5), // OPTIMIZATION: Limit pixel ratio
      forceWebGL: false,
      maxFPS: 30, // OPTIMIZATION: Lower FPS for non-critical animations
      ...config
    };

    // Core Three.js objects
    this.THREE = null;
    this.scene = null;
    this.camera = null;
    this.renderer = null;

    // Animation loop management
    this.animationId = null;
    this.onFrameCallback = null;
    this.isPaused = false;
    this.isDestroyed = false;

    // Performance tracking
    this.lastWidth = 0;
    this.lastHeight = 0;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.targetFrameTime = 1000 / this.config.maxFPS; // OPTIMIZATION: Frame throttling

    // Container reference
    this.container = config.container;
  }

  async init() {
    if (this.isDestroyed) return;

    try {
      // Dynamic import Three.js
      this.THREE = await import('three');
      const { Scene, PerspectiveCamera, WebGLRenderer } = this.THREE;

      // Create scene
      this.scene = new Scene();

      // Get dimensions and validate (following oraklex pattern)
      const rect = this.container.getBoundingClientRect();
      const width = Math.floor(rect.width) || 1;
      const height = Math.floor(rect.height) || 1;

      // Validate dimensions like oraklex.com does
      if (width <= 0 || height <= 0) {
        console.warn(`⚠️  Invalid container dimensions: ${width}x${height}`);
        return false;
      }

      // Create camera with proper aspect
      const aspect = width / height;
      this.camera = new PerspectiveCamera(75, aspect, 0.1, 1000);
      this.camera.position.z = 5; // Standard position like oraklex

      // Create renderer with optimization settings
      this.renderer = new WebGLRenderer({
        alpha: this.config.alpha,
        antialias: this.config.antialias, // Disabled for performance
        powerPreference: this.config.powerPreference, // 'default' vs 'high-performance'
        stencil: false, // OPTIMIZATION: Disable stencil buffer
        depth: true,
        preserveDrawingBuffer: false, // OPTIMIZATION: Better performance
        failIfMajorPerformanceCaveat: false
      });

      // Set pixel ratio with limit
      this.renderer.setPixelRatio(this.config.pixelRatio);

      // Set initial size with validated dimensions
      this.renderer.setSize(width, height);
      this.lastWidth = width;
      this.lastHeight = height;

      // Add canvas to container
      this.container.appendChild(this.renderer.domElement);

      console.log('✅ OptimizedSceneManager initialized:', {
        size: `${width}x${height}`,
        pixelRatio: this.config.pixelRatio,
        maxFPS: this.config.maxFPS,
        antialias: this.config.antialias
      });

      return true;
    } catch (error) {
      console.error('❌ Failed to initialize OptimizedSceneManager:', error);
      return false;
    }
  }

  // Start render loop with frame throttling optimization
  startRenderLoop(onFrameCallback) {
    if (this.animationId || this.isDestroyed) return;

    this.onFrameCallback = onFrameCallback;
    let lastFrameTime = performance.now();

    const animate = (currentTime) => {
      if (this.isDestroyed) return;

      this.animationId = requestAnimationFrame(animate);

      // Skip rendering when paused (saves GPU cycles)
      if (this.isPaused) return;

      // FIXED: Proper frame throttling without early return bug
      if (currentTime - lastFrameTime < this.targetFrameTime) {
        return; // Skip rendering but continue RAF loop
      }

      // Calculate delta time for smooth animations
      const deltaTime = (currentTime - this.lastTime) / 1000;
      this.lastTime = currentTime;
      lastFrameTime = currentTime;

      try {
        // Call effect update with delta timing (like oraklex pattern)
        if (this.onFrameCallback) {
          this.onFrameCallback(deltaTime);
        }

        // Render scene to canvas (core oraklex pattern)
        if (this.renderer && this.scene && this.camera) {
          this.renderer.render(this.scene, this.camera);
        }

        this.frameCount++;
      } catch (error) {
        console.error('❌ Render loop error:', error);
      }
    };

    animate(performance.now());
    console.log(`🚀 Render loop started (maxFPS: ${this.config.maxFPS})`);
  }

  // OPTIMIZATION: True pause that cancels RAF (unlike oraklex.com)
  pause() {
    this.isPaused = true;

    // CRITICAL OPTIMIZATION: Actually cancel RAF to save CPU
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
      console.log('⏸️  Render loop truly paused (RAF cancelled)');
    }
  }

  // Resume with restart
  resume() {
    if (!this.isPaused || this.isDestroyed) return;

    this.isPaused = false;
    this.lastTime = performance.now(); // Reset timing

    // Restart render loop
    if (!this.animationId && this.onFrameCallback) {
      this.startRenderLoop(this.onFrameCallback);
      console.log('▶️  Render loop resumed');
    }
  }

  // Handle resize (following oraklex pattern)
  resize(width, height) {
    if (this.isDestroyed) return;

    width = Math.floor(width) || 1;
    height = Math.floor(height) || 1;

    // Skip if dimensions haven't changed
    if (width === this.lastWidth && height === this.lastHeight) return;

    this.lastWidth = width;
    this.lastHeight = height;

    // Update camera aspect ratio
    if (this.camera) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }

    // Update renderer size
    if (this.renderer) {
      this.renderer.setSize(width, height);
    }

    console.log(`📐 Scene resized: ${width}x${height}`);
  }

  // Get current dimensions
  getSize() {
    return {
      width: this.lastWidth,
      height: this.lastHeight
    };
  }

  // Get Three.js objects for effect initialization
  getThree() {
    return this.THREE;
  }

  getScene() {
    return this.scene;
  }

  getCamera() {
    return this.camera;
  }

  getRenderer() {
    return this.renderer;
  }

  // Check if running
  isRunning() {
    return this.animationId !== null && !this.isPaused;
  }

  // Complete cleanup
  destroy() {
    console.log('♻️  Destroying OptimizedSceneManager...');

    this.isDestroyed = true;

    // Stop animation loop
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    // Cleanup Three.js resources
    if (this.scene) {
      this.scene.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(material => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
      this.scene.clear();
    }

    // Cleanup renderer and remove canvas
    if (this.renderer) {
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
      this.renderer.dispose();
    }

    // Clear references
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.onFrameCallback = null;
    this.container = null;

    console.log('✅ OptimizedSceneManager destroyed');
  }
}
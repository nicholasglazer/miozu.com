import { writable, get } from 'svelte/store';

interface CanvasEntry {
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  sceneManager: any;
  effectInstance: any;
  originalParent: HTMLElement | null;
  originalNextSibling: Node | null;
  resizeLocked: boolean;
}

// Registry of active Three.js canvases
const registry = writable<Map<string, CanvasEntry>>(new Map());

export const canvasRegistry = {
  subscribe: registry.subscribe,

  // Register a canvas with its scene manager
  register(id: string, entry: Omit<CanvasEntry, 'originalParent' | 'originalNextSibling' | 'resizeLocked'>) {
    registry.update(map => {
      map.set(id, {
        ...entry,
        originalParent: null,
        originalNextSibling: null,
        resizeLocked: false
      });
      return map;
    });
  },

  // Unregister a canvas
  unregister(id: string) {
    registry.update(map => {
      map.delete(id);
      return map;
    });
  },

  // Get a canvas entry
  get(id: string): CanvasEntry | undefined {
    return get(registry).get(id);
  },

  // Teleport canvas to a new parent (for expansion)
  teleport(id: string, newParent: HTMLElement): boolean {
    const entry = get(registry).get(id);
    if (!entry) return false;

    // Store original position for return trip
    entry.originalParent = entry.container.parentElement;
    entry.originalNextSibling = entry.container.nextSibling;

    // Move to new parent
    newParent.appendChild(entry.container);

    registry.update(map => {
      map.set(id, entry);
      return map;
    });

    return true;
  },

  // Return canvas to original position (for collapse)
  returnHome(id: string): boolean {
    const entry = get(registry).get(id);
    if (!entry || !entry.originalParent) return false;

    // Return to original position
    if (entry.originalNextSibling) {
      entry.originalParent.insertBefore(entry.container, entry.originalNextSibling);
    } else {
      entry.originalParent.appendChild(entry.container);
    }

    // Clear stored position
    entry.originalParent = null;
    entry.originalNextSibling = null;

    registry.update(map => {
      map.set(id, entry);
      return map;
    });

    return true;
  },

  // Resize a canvas's renderer
  resize(id: string, width: number, height: number) {
    const entry = get(registry).get(id);
    if (!entry?.sceneManager) return;

    entry.sceneManager.resize(width, height);
  },

  // Force resize after DOM relocation (teleportation)
  // If width/height not provided, uses container's actual dimensions
  forceResize(id: string, width?: number, height?: number) {
    const entry = get(registry).get(id);
    if (!entry?.sceneManager) return;

    // Get actual dimensions from container if not provided
    // Use getBoundingClientRect for accurate post-reflow dimensions
    const rect = entry.container.getBoundingClientRect();
    const w = width ?? Math.floor(rect.width);
    const h = height ?? Math.floor(rect.height);

    if (w > 0 && h > 0) {
      // Resize the Three.js renderer
      entry.sceneManager.forceResize(w, h);

      // Also notify the effect to update its buffers/uniforms
      if (entry.effectInstance?.forceResize) {
        entry.effectInstance.forceResize(w, h);
      }
    }
  },

  // Pause rendering
  pause(id: string) {
    const entry = get(registry).get(id);
    if (entry?.sceneManager?.pause) {
      entry.sceneManager.pause();
    }
  },

  // Resume rendering
  resume(id: string) {
    const entry = get(registry).get(id);
    if (entry?.sceneManager?.resume) {
      entry.sceneManager.resume();
    }
  },

  // Lock resize (prevent auto-resize during animation)
  lockResize(id: string) {
    const entry = get(registry).get(id);
    if (entry) {
      entry.resizeLocked = true;
      registry.update(map => {
        map.set(id, entry);
        return map;
      });
    }
  },

  // Unlock resize
  unlockResize(id: string) {
    const entry = get(registry).get(id);
    if (entry) {
      entry.resizeLocked = false;
      registry.update(map => {
        map.set(id, entry);
        return map;
      });
    }
  },

  // Check if resize is locked
  isResizeLocked(id: string): boolean {
    const entry = get(registry).get(id);
    return entry?.resizeLocked ?? false;
  },

  // Capture canvas as data URL for snapshot-based animation
  // This preserves the exact visual state for smooth transitions
  captureSnapshot(id: string): string | null {
    const entry = get(registry).get(id);
    if (!entry?.canvas) return null;

    try {
      // Force a render to ensure canvas has current content
      const renderer = entry.sceneManager?.getRenderer();
      const scene = entry.sceneManager?.getScene();
      const camera = entry.sceneManager?.getCamera();
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
      return entry.canvas.toDataURL('image/webp', 0.92);
    } catch (e) {
      console.warn('Failed to capture canvas snapshot:', e);
      return null;
    }
  }
};

import { writable, get } from 'svelte/store';

interface CanvasEntry {
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  sceneManager: any;
  effectInstance: any;
  originalParent: HTMLElement | null;
  originalNextSibling: Node | null;
}

// Registry of active Three.js canvases
const registry = writable<Map<string, CanvasEntry>>(new Map());

export const canvasRegistry = {
  subscribe: registry.subscribe,

  // Register a canvas with its scene manager
  register(id: string, entry: Omit<CanvasEntry, 'originalParent' | 'originalNextSibling'>) {
    registry.update(map => {
      map.set(id, {
        ...entry,
        originalParent: null,
        originalNextSibling: null
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
    const w = width ?? entry.container.offsetWidth;
    const h = height ?? entry.container.offsetHeight;

    if (w > 0 && h > 0) {
      entry.sceneManager.forceResize(w, h);
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
  }
};

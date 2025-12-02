import { writable, get } from 'svelte/store';
import type { SceneManager } from '$lib/three/SceneManager';

interface CanvasEntry {
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  sceneManager: SceneManager;
  effectInstance: { forceResize?: (w: number, h: number) => void; destroy?: () => void } | null;
  originalParent: HTMLElement | null;
  originalNextSibling: Node | null;
  resizeLocked: boolean;
}

type CanvasRegistration = Omit<CanvasEntry, 'originalParent' | 'originalNextSibling' | 'resizeLocked'>;

const registry = writable<Map<string, CanvasEntry>>(new Map());

export const canvasRegistry = {
  subscribe: registry.subscribe,

  register(id: string, entry: CanvasRegistration) {
    registry.update(map => {
      const newMap = new Map(map);
      newMap.set(id, {
        ...entry,
        originalParent: null,
        originalNextSibling: null,
        resizeLocked: false
      });
      return newMap;
    });
  },

  unregister(id: string) {
    registry.update(map => {
      const newMap = new Map(map);
      newMap.delete(id);
      return newMap;
    });
  },

  get(id: string): CanvasEntry | undefined {
    return get(registry).get(id);
  },

  teleport(id: string, newParent: HTMLElement): boolean {
    const entry = get(registry).get(id);
    if (!entry) return false;

    // Store original position for return trip
    const originalParent = entry.container.parentElement;
    const originalNextSibling = entry.container.nextSibling;

    // Move to new parent
    newParent.appendChild(entry.container);

    registry.update(map => {
      const newMap = new Map(map);
      newMap.set(id, {
        ...entry,
        originalParent,
        originalNextSibling
      });
      return newMap;
    });

    return true;
  },

  getOriginalParentRect(id: string): DOMRect | null {
    const entry = get(registry).get(id);
    if (!entry?.originalParent) return null;
    return entry.originalParent.getBoundingClientRect();
  },

  returnHome(id: string): boolean {
    const entry = get(registry).get(id);
    if (!entry?.originalParent) return false;

    // Return to original position
    if (entry.originalNextSibling) {
      entry.originalParent.insertBefore(entry.container, entry.originalNextSibling);
    } else {
      entry.originalParent.appendChild(entry.container);
    }

    registry.update(map => {
      const newMap = new Map(map);
      newMap.set(id, {
        ...entry,
        originalParent: null,
        originalNextSibling: null
      });
      return newMap;
    });

    return true;
  },

  resize(id: string, width: number, height: number) {
    const entry = get(registry).get(id);
    entry?.sceneManager?.resize(width, height);
  },

  forceResize(id: string, width?: number, height?: number) {
    const entry = get(registry).get(id);
    if (!entry?.sceneManager) return;

    const rect = entry.container.getBoundingClientRect();
    const w = width ?? Math.floor(rect.width);
    const h = height ?? Math.floor(rect.height);

    if (w > 0 && h > 0) {
      entry.sceneManager.forceResize(w, h);
      entry.effectInstance?.forceResize?.(w, h);
    }
  },

  upgradeQuality(id: string) {
    const entry = get(registry).get(id);
    entry?.sceneManager?.upgradeToRetinaQuality?.(3);
  },

  pause(id: string) {
    const entry = get(registry).get(id);
    entry?.sceneManager?.pause?.();
  },

  resume(id: string) {
    const entry = get(registry).get(id);
    entry?.sceneManager?.resume?.();
  },

  lockResize(id: string) {
    registry.update(map => {
      const entry = map.get(id);
      if (!entry) return map;
      const newMap = new Map(map);
      newMap.set(id, { ...entry, resizeLocked: true });
      return newMap;
    });
  },

  unlockResize(id: string) {
    registry.update(map => {
      const entry = map.get(id);
      if (!entry) return map;
      const newMap = new Map(map);
      newMap.set(id, { ...entry, resizeLocked: false });
      return newMap;
    });
  },

  isResizeLocked(id: string): boolean {
    return get(registry).get(id)?.resizeLocked ?? false;
  },

  captureSnapshot(id: string): string | null {
    const entry = get(registry).get(id);
    if (!entry?.canvas) return null;

    try {
      const renderer = entry.sceneManager?.getRenderer?.();
      const scene = entry.sceneManager?.getScene?.();
      const camera = entry.sceneManager?.getCamera?.();
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

/**
 * Canvas Registry Reactive State
 * Manages Three.js canvas instances for teleportation during card transitions
 *
 * Svelte 5 Reactive Class Pattern:
 * - Uses $state() for the registry Map
 * - Methods update the Map immutably for reactivity
 *
 * IMPORTANT: Resize locks use a module-level Set (not reactive) to ensure
 * synchronous checks work correctly during animation. The resize lock is
 * checked by ThreeCanvas $effect when dimensions change - it must see
 * the lock immediately, not after reactive updates batch.
 */

import type { SceneManager } from '$lib/three/SceneManager';

// Module-level resize locks - synchronous, no reactivity needed
// This ensures the lock is visible IMMEDIATELY when checked
const resizeLocks = new Set<string>();

export interface CanvasEntry {
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  sceneManager: SceneManager;
  effectInstance: { forceResize?: (w: number, h: number) => void; destroy?: () => void } | null;
  originalParent: HTMLElement | null;
  originalNextSibling: Node | null;
}

export type CanvasRegistration = Omit<CanvasEntry, 'originalParent' | 'originalNextSibling'>;

export class CanvasRegistryState {
  // Reactive Map of canvas entries
  private entries = $state<Map<string, CanvasEntry>>(new Map());

  register(id: string, entry: CanvasRegistration) {
    const newMap = new Map(this.entries);
    newMap.set(id, {
      ...entry,
      originalParent: null,
      originalNextSibling: null
    });
    this.entries = newMap;
  }

  unregister(id: string) {
    const newMap = new Map(this.entries);
    newMap.delete(id);
    this.entries = newMap;
    // Clean up any resize lock
    resizeLocks.delete(id);
  }

  get(id: string): CanvasEntry | undefined {
    return this.entries.get(id);
  }

  teleport(id: string, newParent: HTMLElement): boolean {
    const entry = this.entries.get(id);
    if (!entry) return false;

    // Store original position for return trip
    const originalParent = entry.container.parentElement;
    const originalNextSibling = entry.container.nextSibling;

    // Move to new parent
    newParent.appendChild(entry.container);

    // Update registry with new state
    const newMap = new Map(this.entries);
    newMap.set(id, {
      ...entry,
      originalParent,
      originalNextSibling
    });
    this.entries = newMap;

    return true;
  }

  getOriginalParentRect(id: string): DOMRect | null {
    const entry = this.entries.get(id);
    if (!entry?.originalParent) return null;
    return entry.originalParent.getBoundingClientRect();
  }

  returnHome(id: string): boolean {
    const entry = this.entries.get(id);
    if (!entry?.originalParent) return false;

    // Return to original position
    if (entry.originalNextSibling) {
      entry.originalParent.insertBefore(entry.container, entry.originalNextSibling);
    } else {
      entry.originalParent.appendChild(entry.container);
    }

    // Update registry - clear original position
    const newMap = new Map(this.entries);
    newMap.set(id, {
      ...entry,
      originalParent: null,
      originalNextSibling: null
    });
    this.entries = newMap;

    return true;
  }

  resize(id: string, width: number, height: number) {
    const entry = this.entries.get(id);
    entry?.sceneManager?.resize(width, height);
  }

  forceResize(id: string, width?: number, height?: number) {
    const entry = this.entries.get(id);
    if (!entry?.sceneManager) return;

    const rect = entry.container.getBoundingClientRect();
    const w = width ?? Math.floor(rect.width);
    const h = height ?? Math.floor(rect.height);

    if (w > 0 && h > 0) {
      entry.sceneManager.forceResize(w, h);
      entry.effectInstance?.forceResize?.(w, h);
    }
  }

  upgradeQuality(id: string) {
    const entry = this.entries.get(id);
    entry?.sceneManager?.upgradeToRetinaQuality?.(3);
  }

  pause(id: string) {
    const entry = this.entries.get(id);
    entry?.sceneManager?.pause?.();
  }

  resume(id: string) {
    const entry = this.entries.get(id);
    entry?.sceneManager?.resume?.();
  }

  lockResize(id: string) {
    // Use module-level Set for synchronous, immediate locking
    resizeLocks.add(id);
  }

  unlockResize(id: string) {
    // Use module-level Set for synchronous, immediate unlocking
    resizeLocks.delete(id);
  }

  isResizeLocked(id: string): boolean {
    // Synchronous check - no reactive dependency, always returns current state
    return resizeLocks.has(id);
  }

  captureSnapshot(id: string): string | null {
    const entry = this.entries.get(id);
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
}

// Singleton instance
let instance: CanvasRegistryState | null = null;

export function getCanvasRegistry(): CanvasRegistryState {
  if (!instance) {
    instance = new CanvasRegistryState();
  }
  return instance;
}

// Export singleton for direct import
export const canvasRegistry = getCanvasRegistry();

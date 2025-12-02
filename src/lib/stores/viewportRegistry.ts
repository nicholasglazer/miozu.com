/**
 * Viewport Registry - Manages multiple virtual viewports on a single canvas
 *
 * This enables smooth transitions by:
 * 1. Using ONE WebGL context (no context loss)
 * 2. Rendering multiple scenes to different viewport regions
 * 3. Animating viewport rectangles for seamless transitions
 */

import { writable, get } from 'svelte/store';

export interface ViewportRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface ViewportEntry {
  id: string;
  effectType: string;
  rect: ViewportRect;
  visible: boolean;
  zIndex: number;
  // For transitions
  targetRect?: ViewportRect;
  isAnimating?: boolean;
  animationProgress?: number;
}

interface RegistryState {
  viewports: Map<string, ViewportEntry>;
  activeViewport: string | null;
  expandedViewport: string | null;
}

const initialState: RegistryState = {
  viewports: new Map(),
  activeViewport: null,
  expandedViewport: null
};

function createViewportRegistry() {
  const { subscribe, set, update } = writable<RegistryState>(initialState);

  return {
    subscribe,

    // Register a viewport (called by each card)
    register(id: string, effectType: string, rect: ViewportRect) {
      update(state => {
        const viewports = new Map(state.viewports);
        viewports.set(id, {
          id,
          effectType,
          rect,
          visible: true,
          zIndex: 0
        });
        return { ...state, viewports };
      });
    },

    // Update viewport position (called on scroll/resize)
    updateRect(id: string, rect: ViewportRect) {
      update(state => {
        const viewports = new Map(state.viewports);
        const entry = viewports.get(id);
        if (entry) {
          viewports.set(id, { ...entry, rect });
        }
        return { ...state, viewports };
      });
    },

    // Unregister a viewport
    unregister(id: string) {
      update(state => {
        const viewports = new Map(state.viewports);
        viewports.delete(id);
        return { ...state, viewports };
      });
    },

    // Start expansion animation
    startExpansion(id: string, targetRect: ViewportRect) {
      update(state => {
        const viewports = new Map(state.viewports);
        const entry = viewports.get(id);
        if (entry) {
          viewports.set(id, {
            ...entry,
            targetRect,
            isAnimating: true,
            animationProgress: 0,
            zIndex: 1000
          });
        }
        return {
          ...state,
          viewports,
          expandedViewport: id
        };
      });
    },

    // Update animation progress (0-1)
    updateAnimationProgress(id: string, progress: number) {
      update(state => {
        const viewports = new Map(state.viewports);
        const entry = viewports.get(id);
        if (entry && entry.targetRect) {
          // Interpolate between original rect and target rect
          const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
          const currentRect: ViewportRect = {
            left: lerp(entry.rect.left, entry.targetRect.left, progress),
            top: lerp(entry.rect.top, entry.targetRect.top, progress),
            width: lerp(entry.rect.width, entry.targetRect.width, progress),
            height: lerp(entry.rect.height, entry.targetRect.height, progress)
          };
          viewports.set(id, {
            ...entry,
            animationProgress: progress
          });
        }
        return { ...state, viewports };
      });
    },

    // Complete expansion
    completeExpansion(id: string) {
      update(state => {
        const viewports = new Map(state.viewports);
        const entry = viewports.get(id);
        if (entry && entry.targetRect) {
          viewports.set(id, {
            ...entry,
            rect: entry.targetRect,
            targetRect: undefined,
            isAnimating: false,
            animationProgress: 1
          });
        }
        return { ...state, viewports };
      });
    },

    // Start collapse animation
    startCollapse(id: string, originalRect: ViewportRect) {
      update(state => {
        const viewports = new Map(state.viewports);
        const entry = viewports.get(id);
        if (entry) {
          viewports.set(id, {
            ...entry,
            targetRect: originalRect,
            isAnimating: true,
            animationProgress: 0
          });
        }
        return { ...state, viewports };
      });
    },

    // Complete collapse
    completeCollapse(id: string) {
      update(state => {
        const viewports = new Map(state.viewports);
        const entry = viewports.get(id);
        if (entry && entry.targetRect) {
          viewports.set(id, {
            ...entry,
            rect: entry.targetRect,
            targetRect: undefined,
            isAnimating: false,
            animationProgress: 0,
            zIndex: 0
          });
        }
        return {
          ...state,
          viewports,
          expandedViewport: null
        };
      });
    },

    // Get current state
    get: () => get({ subscribe }),

    // Get interpolated rect for rendering
    getInterpolatedRect(id: string): ViewportRect | null {
      const state = get({ subscribe });
      const entry = state.viewports.get(id);
      if (!entry) return null;

      if (!entry.isAnimating || !entry.targetRect) {
        return entry.rect;
      }

      const progress = entry.animationProgress ?? 0;
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

      return {
        left: lerp(entry.rect.left, entry.targetRect.left, progress),
        top: lerp(entry.rect.top, entry.targetRect.top, progress),
        width: lerp(entry.rect.width, entry.targetRect.width, progress),
        height: lerp(entry.rect.height, entry.targetRect.height, progress)
      };
    },

    // Get all visible viewports sorted by zIndex
    getVisibleViewports(): ViewportEntry[] {
      const state = get({ subscribe });
      return Array.from(state.viewports.values())
        .filter(v => v.visible)
        .sort((a, b) => a.zIndex - b.zIndex);
    }
  };
}

export const viewportRegistry = createViewportRegistry();

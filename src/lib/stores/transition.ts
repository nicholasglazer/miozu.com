import { writable, derived, get } from 'svelte/store';

// Immutable rect type for FLIP animation
export interface SourceRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface BlockInfo {
  label: string;
  title: string;
  description?: string;
}

export interface CardTransitionState {
  isExpanding: boolean;
  isExpanded: boolean;
  isCollapsing: boolean;
  targetRoute: string | null;
  effectType: string | null;
  canvasId: string | null;
  sourceRect: SourceRect | null;
  blockInfo: BlockInfo | null;
}

const initialState: CardTransitionState = {
  isExpanding: false,
  isExpanded: false,
  isCollapsing: false,
  targetRoute: null,
  effectType: null,
  canvasId: null,
  sourceRect: null,
  blockInfo: null
};

export interface ExpandParams {
  targetRoute: string;
  effectType: string;
  canvasId: string;
  sourceRect: DOMRect;
  blockInfo: BlockInfo | null;
}

function createTransitionStore() {
  const { subscribe, set, update } = writable<CardTransitionState>(initialState);

  return {
    subscribe,

    expand: (params: ExpandParams) => {
      // Convert DOMRect to plain object (immutable copy)
      const sourceRect: SourceRect = {
        left: params.sourceRect.left,
        top: params.sourceRect.top,
        width: params.sourceRect.width,
        height: params.sourceRect.height
      };

      update(state => ({
        ...state,
        isExpanding: true,
        isExpanded: false,
        isCollapsing: false,
        targetRoute: params.targetRoute,
        effectType: params.effectType,
        canvasId: params.canvasId,
        sourceRect,
        blockInfo: params.blockInfo
      }));
    },

    expandComplete: () => {
      update(state => ({
        ...state,
        isExpanding: false,
        isExpanded: true
      }));
    },

    collapse: () => {
      update(state => ({
        ...state,
        isCollapsing: true,
        isExpanded: false
      }));
    },

    collapseComplete: () => {
      set(initialState);
    },

    reset: () => {
      set(initialState);
    },

    get: () => get({ subscribe })
  };
}

export const cardTransition = createTransitionStore();

export const isTransitioning = derived(
  cardTransition,
  $state => $state.isExpanding || $state.isCollapsing
);

export const showOverlay = derived(
  cardTransition,
  $state => $state.isExpanding || $state.isExpanded || $state.isCollapsing
);

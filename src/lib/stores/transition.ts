import { writable, derived, get } from 'svelte/store';

export interface CardTransitionState {
  isExpanding: boolean;
  isExpanded: boolean;
  isCollapsing: boolean;
  targetRoute: string | null;
  effectType: string | null;
  // Source card rect for FLIP animation
  sourceRect: DOMRect | null;
  // Content to show (will be loaded dynamically)
  contentComponent: any;
  // Block content (label, title, etc.)
  blockInfo: {
    label: string;
    title: string;
    description?: string;
  } | null;
}

const initialState: CardTransitionState = {
  isExpanding: false,
  isExpanded: false,
  isCollapsing: false,
  targetRoute: null,
  effectType: null,
  sourceRect: null,
  contentComponent: null,
  blockInfo: null
};

function createTransitionStore() {
  const { subscribe, set, update } = writable<CardTransitionState>(initialState);

  return {
    subscribe,

    // Start expansion from a card
    expand: (params: {
      targetRoute: string;
      effectType: string;
      sourceRect: DOMRect;
      blockInfo: CardTransitionState['blockInfo'];
    }) => {
      update(state => ({
        ...state,
        isExpanding: true,
        isExpanded: false,
        isCollapsing: false,
        targetRoute: params.targetRoute,
        effectType: params.effectType,
        sourceRect: params.sourceRect,
        blockInfo: params.blockInfo
      }));
    },

    // Animation complete - now fully expanded
    expandComplete: () => {
      update(state => ({
        ...state,
        isExpanding: false,
        isExpanded: true
      }));
    },

    // Start collapsing back to card
    collapse: () => {
      update(state => ({
        ...state,
        isCollapsing: true,
        isExpanded: false
      }));
    },

    // Collapse complete - reset to initial
    collapseComplete: () => {
      set(initialState);
    },

    // Set loaded content component
    setContent: (component: any) => {
      update(state => ({
        ...state,
        contentComponent: component
      }));
    },

    // Reset everything
    reset: () => {
      set(initialState);
    },

    // Get current state synchronously
    get: () => get({ subscribe })
  };
}

export const cardTransition = createTransitionStore();

// Derived store for checking if any transition is active
export const isTransitioning = derived(
  cardTransition,
  $state => $state.isExpanding || $state.isCollapsing
);

// Derived store for overlay visibility
export const showOverlay = derived(
  cardTransition,
  $state => $state.isExpanding || $state.isExpanded || $state.isCollapsing
);

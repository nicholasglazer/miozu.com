/**
 * Card Transition Reactive State
 * Manages the FLIP animation state for card expansion/collapse
 *
 * Svelte 5 Reactive Class Pattern:
 * - Properties use $state() for reactivity
 * - Computed values use getters
 * - Methods directly mutate $state properties
 */

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

export interface ExpandParams {
  targetRoute: string;
  effectType: string;
  canvasId: string;
  sourceRect: DOMRect;
  blockInfo: BlockInfo | null;
}

export class CardTransitionState {
  // Reactive state properties
  isExpanding = $state(false);
  isExpanded = $state(false);
  isCollapsing = $state(false);
  targetRoute = $state<string | null>(null);
  effectType = $state<string | null>(null);
  canvasId = $state<string | null>(null);
  sourceRect = $state<SourceRect | null>(null);
  blockInfo = $state<BlockInfo | null>(null);

  // Computed properties using getters
  get isTransitioning(): boolean {
    return this.isExpanding || this.isCollapsing;
  }

  get showOverlay(): boolean {
    return this.isExpanding || this.isExpanded || this.isCollapsing;
  }

  // Start expansion from a card
  expand(params: ExpandParams) {
    // Convert DOMRect to plain object (immutable copy)
    this.sourceRect = {
      left: params.sourceRect.left,
      top: params.sourceRect.top,
      width: params.sourceRect.width,
      height: params.sourceRect.height
    };
    this.targetRoute = params.targetRoute;
    this.effectType = params.effectType;
    this.canvasId = params.canvasId;
    this.blockInfo = params.blockInfo;
    this.isExpanding = true;
    this.isExpanded = false;
    this.isCollapsing = false;
  }

  // Animation complete - now fully expanded
  expandComplete() {
    this.isExpanding = false;
    this.isExpanded = true;
  }

  // Start collapsing back to card
  collapse() {
    this.isCollapsing = true;
    this.isExpanded = false;
  }

  // Collapse complete - reset to initial
  collapseComplete() {
    this.reset();
  }

  // Reset everything
  reset() {
    this.isExpanding = false;
    this.isExpanded = false;
    this.isCollapsing = false;
    this.targetRoute = null;
    this.effectType = null;
    this.canvasId = null;
    this.sourceRect = null;
    this.blockInfo = null;
  }
}

// Singleton instance
let instance: CardTransitionState | null = null;

export function getCardTransition(): CardTransitionState {
  if (!instance) {
    instance = new CardTransitionState();
  }
  return instance;
}

// Export singleton for direct import
export const cardTransition = getCardTransition();

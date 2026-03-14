/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Tour tipleri / Tour types.
 *
 * @packageDocumentation
 */

// ── Types ───────────────────────────────────────────

/** Tour adim pozisyonu / Tour step placement. */
export type TourPlacement = 'top' | 'bottom' | 'left' | 'right';

// ── Tour step ──────────────────────────────────────

export interface TourStep {
  /** Hedef eleman CSS selector / Target element CSS selector */
  target: string;
  /** Baslik / Title */
  title?: string;
  /** Aciklama / Description */
  description: string;
  /** Popover pozisyonu / Popover placement */
  placement?: TourPlacement;
}

// ── Events ─────────────────────────────────────────

export type TourEvent =
  | { type: 'START' }
  | { type: 'STOP' }
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'GO_TO'; index: number };

// ── Context ────────────────────────────────────────

export interface TourContext {
  /** Aktif mi / Is active */
  active: boolean;
  /** Mevcut adim indeksi / Current step index */
  currentStep: number;
  /** Toplam adim sayisi / Total step count */
  totalSteps: number;
}

// ── Config ─────────────────────────────────────────

export interface TourConfig {
  /** Adimlar / Steps */
  steps: TourStep[];
  /** Bitince callback / On complete callback */
  onComplete?: () => void;
  /** Durum degisimi callback / On step change callback */
  onStepChange?: (index: number) => void;
}

// ── API ────────────────────────────────────────────

export interface TourAPI {
  getContext(): TourContext;
  getStep(): TourStep | undefined;
  send(event: TourEvent): void;
  subscribe(fn: () => void): () => void;
}

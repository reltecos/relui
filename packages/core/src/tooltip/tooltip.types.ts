/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Tooltip tipleri.
 * Tooltip types.
 *
 * @packageDocumentation
 */

// ── Placement ────────────────────────────────────────

/** Tooltip yerlesim yonu / Tooltip placement direction */
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

/** Tooltip hizalama / Tooltip alignment */
export type TooltipAlignment = 'start' | 'center' | 'end';

// ── Events ───────────────────────────────────────────

/** Tooltip event'leri / Tooltip events */
export type TooltipEvent =
  | { type: 'OPEN' }
  | { type: 'CLOSE' };

// ── Context ──────────────────────────────────────────

/** Tooltip state / Tooltip context */
export interface TooltipContext {
  /** Acik mi / Is open */
  open: boolean;
}

// ── Config ───────────────────────────────────────────

/** Tooltip yapilandirmasi / Tooltip configuration */
export interface TooltipConfig {
  /** Baslangic durumu / Initial open state */
  open?: boolean;
  /** Acik/kapali degisince callback / On open change callback */
  onOpenChange?: (open: boolean) => void;
}

// ── API ──────────────────────────────────────────────

/** Tooltip API / Tooltip API */
export interface TooltipAPI {
  /** Guncel context / Get current context */
  getContext(): TooltipContext;
  /** Event gonder / Send event */
  send(event: TooltipEvent): void;
  /** Degisikliklere abone ol / Subscribe to changes */
  subscribe(callback: () => void): () => void;
}

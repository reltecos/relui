/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Flyout tipleri.
 * Flyout types.
 *
 * @packageDocumentation
 */

// ── Placement ────────────────────────────────────────

/** Flyout yerlesim yonu / Flyout placement */
export type FlyoutPlacement = 'top' | 'bottom' | 'left' | 'right';

/** Flyout boyutu / Flyout size */
export type FlyoutSize = 'sm' | 'md' | 'lg';

// ── Events ───────────────────────────────────────────

/** Flyout event'leri / Flyout events */
export type FlyoutEvent =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'TOGGLE' };

// ── Context ──────────────────────────────────────────

/** Flyout state / Flyout context */
export interface FlyoutContext {
  /** Acik mi / Is open */
  open: boolean;
}

// ── Config ───────────────────────────────────────────

/** Flyout yapilandirmasi / Flyout configuration */
export interface FlyoutConfig {
  /** Baslangic durumu / Initial open state */
  open?: boolean;
  /** Acik/kapali degisince callback / On open change callback */
  onOpenChange?: (open: boolean) => void;
}

// ── API ──────────────────────────────────────────────

/** Flyout API / Flyout API */
export interface FlyoutAPI {
  /** Guncel context / Get current context */
  getContext(): FlyoutContext;
  /** Event gonder / Send event */
  send(event: FlyoutEvent): void;
  /** Degisikliklere abone ol / Subscribe to changes */
  subscribe(callback: () => void): () => void;
}

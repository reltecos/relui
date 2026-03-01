/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Sticky types — yapışkan eleman tipleri.
 *
 * @packageDocumentation
 */

/** Sticky pozisyon modu. */
export type StickyPosition = 'top' | 'bottom';

/** Sticky state durumu. */
export type StickyState = 'idle' | 'stuck' | 'released';

/** Sticky yapılandırma prop'ları. */
export interface StickyProps {
  /** Yapışma pozisyonu. Varsayılan: 'top'. */
  position?: StickyPosition;
  /** Yapışma ofseti (px). Varsayılan: 0. */
  offset?: number;
  /** Aktif mi. Varsayılan: true. */
  enabled?: boolean;
}

/** Sticky state machine event'leri. */
export type StickyEvent =
  | { type: 'UPDATE'; containerTop: number; containerBottom: number; viewportHeight: number }
  | { type: 'SET_POSITION'; value: StickyPosition }
  | { type: 'SET_OFFSET'; value: number }
  | { type: 'SET_ENABLED'; value: boolean };

/** Sticky state machine API. */
export interface StickyAPI {
  /** Mevcut state. */
  getState: () => StickyState;
  /** Yapışmış mı (stuck). */
  isStuck: () => boolean;
  /** Yapışma pozisyonu. */
  getPosition: () => StickyPosition;
  /** Yapışma ofseti. */
  getOffset: () => number;
  /** Aktif mi. */
  isEnabled: () => boolean;
  /** Event gönder. */
  send: (event: StickyEvent) => void;
}

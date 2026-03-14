/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Alert tipleri / Alert types.
 *
 * @packageDocumentation
 */

// ── Severity ────────────────────────────────────────────

export type AlertSeverity = 'info' | 'success' | 'warning' | 'error';

// ── Variant ─────────────────────────────────────────────

export type AlertVariant = 'filled' | 'outline' | 'subtle';

// ── Size ────────────────────────────────────────────────

export type AlertSize = 'sm' | 'md' | 'lg';

// ── Events ──────────────────────────────────────────────

export interface AlertCloseEvent {
  type: 'CLOSE';
}

export interface AlertSetOpenEvent {
  type: 'SET_OPEN';
  open: boolean;
}

export type AlertEvent = AlertCloseEvent | AlertSetOpenEvent;

// ── Context ────────────────────────────────────────────

export interface AlertContext {
  /** Gorunur mu / Visible */
  open: boolean;
}

// ── Config ─────────────────────────────────────────────

export interface AlertConfig {
  /** Baslangic durumu (default: true) / Initial open state */
  open?: boolean;

  /** Kapaninca callback / Close callback */
  onClose?: () => void;
}

// ── API ────────────────────────────────────────────────

export interface AlertAPI {
  getContext: () => AlertContext;
  send: (event: AlertEvent) => void;
  subscribe: (listener: () => void) => () => void;

  /** Root element DOM props */
  getRootProps: () => Record<string, unknown>;
}

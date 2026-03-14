/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * FloatingActionButton tipleri / FloatingActionButton types.
 *
 * @packageDocumentation
 */

// ── Action Item ─────────────────────────────────────────

/**
 * Speed dial aksiyon ogesi / Speed dial action item.
 */
export interface FabAction {
  /** Benzersiz id / Unique id */
  id: string;

  /** Gorunen metin / Display label (tooltip) */
  label: string;

  /** Devre disi mi / Disabled */
  disabled?: boolean;
}

// ── Position ────────────────────────────────────────────

export type FabPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

// ── Events ──────────────────────────────────────────────

export interface FabOpenEvent {
  type: 'OPEN';
}

export interface FabCloseEvent {
  type: 'CLOSE';
}

export interface FabToggleEvent {
  type: 'TOGGLE';
}

export interface FabSelectActionEvent {
  type: 'SELECT_ACTION';
  actionId: string;
}

export interface FabSetActionsEvent {
  type: 'SET_ACTIONS';
  actions: FabAction[];
}

export interface FabSetOpenEvent {
  type: 'SET_OPEN';
  open: boolean;
}

export type FabEvent =
  | FabOpenEvent
  | FabCloseEvent
  | FabToggleEvent
  | FabSelectActionEvent
  | FabSetActionsEvent
  | FabSetOpenEvent;

// ── Context ────────────────────────────────────────────

export interface FabContext {
  /** Acik mi / Is open */
  open: boolean;

  /** Aksiyonlar / Action items */
  actions: FabAction[];

  /** Son secilen aksiyon id / Last selected action id */
  selectedActionId: string | null;
}

// ── Config ─────────────────────────────────────────────

export interface FabConfig {
  /** Baslangic aksiyonlari / Initial action items */
  actions?: FabAction[];

  /** Baslangic durumu / Initial open state */
  open?: boolean;

  /** Degisiklik callback / Open change callback */
  onOpenChange?: (open: boolean) => void;

  /** Aksiyon secildiginde / Action selected callback */
  onSelectAction?: (actionId: string) => void;
}

// ── API ────────────────────────────────────────────────

export interface FabAPI {
  getContext: () => FabContext;
  send: (event: FabEvent) => void;
  subscribe: (listener: () => void) => () => void;

  /** Ana buton DOM props */
  getButtonProps: () => Record<string, unknown>;

  /** Aksiyon buton DOM props */
  getActionProps: (actionId: string) => Record<string, unknown>;
}

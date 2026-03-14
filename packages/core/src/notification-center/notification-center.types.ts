/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * NotificationCenter tipleri / NotificationCenter types.
 *
 * @packageDocumentation
 */

// ── Types ───────────────────────────────────────────

/** Bildirim ciddiyet seviyesi / Notification severity. */
export type NotificationSeverity = 'info' | 'success' | 'warning' | 'error';

// ── Notification item ──────────────────────────────

export interface NotificationItem {
  /** Benzersiz id / Unique id */
  id: string;
  /** Ciddiyet / Severity */
  severity: NotificationSeverity;
  /** Baslik / Title */
  title?: string;
  /** Mesaj / Message */
  message: string;
  /** Olusturulma zamani (ms) / Created at (ms) */
  createdAt: number;
  /** Okundu mu / Is read */
  read: boolean;
  /** Grup anahtari / Group key */
  group?: string;
}

// ── Events ─────────────────────────────────────────

export type NotificationCenterEvent =
  | { type: 'ADD'; notification: Omit<NotificationItem, 'createdAt' | 'read'> }
  | { type: 'REMOVE'; id: string }
  | { type: 'REMOVE_ALL' }
  | { type: 'MARK_READ'; id: string }
  | { type: 'MARK_ALL_READ' }
  | { type: 'TOGGLE' }
  | { type: 'OPEN' }
  | { type: 'CLOSE' };

// ── Context ────────────────────────────────────────

export interface NotificationCenterContext {
  /** Bildirim listesi / Notification list */
  notifications: NotificationItem[];
  /** Panel acik mi / Is panel open */
  open: boolean;
  /** Okunmamis sayi / Unread count */
  unreadCount: number;
}

// ── Config ─────────────────────────────────────────

export interface NotificationCenterConfig {
  /** Baslangic durumu / Initial open state */
  open?: boolean;
  /** Maksimum bildirim sayisi / Max notification count */
  maxItems?: number;
  /** Bildirim kaldirilinca callback / On notification removed callback */
  onRemove?: (id: string) => void;
  /** Panel durum degisim callback / On open change callback */
  onOpenChange?: (open: boolean) => void;
}

// ── API ────────────────────────────────────────────

export interface NotificationCenterAPI {
  getContext(): NotificationCenterContext;
  send(event: NotificationCenterEvent): void;
  subscribe(fn: () => void): () => void;
}

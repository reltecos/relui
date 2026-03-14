/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * createNotificationCenter — NotificationCenter state machine.
 *
 * Bildirim merkezi paneli icin bildirim yonetimi.
 * Manages notifications for notification center panel.
 *
 * @packageDocumentation
 */

import type {
  NotificationCenterConfig,
  NotificationCenterContext,
  NotificationCenterEvent,
  NotificationCenterAPI,
} from './notification-center.types';

export function createNotificationCenter(
  config: NotificationCenterConfig = {},
): NotificationCenterAPI {
  const listeners = new Set<() => void>();
  const maxItems = config.maxItems ?? 100;

  const ctx: NotificationCenterContext = {
    notifications: [],
    open: config.open ?? false,
    unreadCount: 0,
  };

  function recalcUnread(): void {
    ctx.unreadCount = ctx.notifications.filter((n) => !n.read).length;
  }

  function notify(): void {
    listeners.forEach((fn) => fn());
  }

  function send(event: NotificationCenterEvent): void {
    switch (event.type) {
      case 'ADD': {
        const item = {
          ...event.notification,
          createdAt: Date.now(),
          read: false,
        };
        // Ayni id varsa guncelle
        const existingIdx = ctx.notifications.findIndex((n) => n.id === item.id);
        if (existingIdx >= 0) {
          ctx.notifications[existingIdx] = item;
        } else {
          ctx.notifications.unshift(item);
          // Maksimum sinir
          if (ctx.notifications.length > maxItems) {
            ctx.notifications = ctx.notifications.slice(0, maxItems);
          }
        }
        recalcUnread();
        notify();
        break;
      }
      case 'REMOVE': {
        const idx = ctx.notifications.findIndex((n) => n.id === event.id);
        if (idx < 0) return;
        ctx.notifications.splice(idx, 1);
        recalcUnread();
        config.onRemove?.(event.id);
        notify();
        break;
      }
      case 'REMOVE_ALL': {
        if (ctx.notifications.length === 0) return;
        ctx.notifications = [];
        ctx.unreadCount = 0;
        notify();
        break;
      }
      case 'MARK_READ': {
        const item = ctx.notifications.find((n) => n.id === event.id);
        if (!item || item.read) return;
        item.read = true;
        recalcUnread();
        notify();
        break;
      }
      case 'MARK_ALL_READ': {
        let changed = false;
        for (const n of ctx.notifications) {
          if (!n.read) {
            n.read = true;
            changed = true;
          }
        }
        if (!changed) return;
        ctx.unreadCount = 0;
        notify();
        break;
      }
      case 'TOGGLE': {
        ctx.open = !ctx.open;
        config.onOpenChange?.(ctx.open);
        notify();
        break;
      }
      case 'OPEN': {
        if (ctx.open) return;
        ctx.open = true;
        config.onOpenChange?.(true);
        notify();
        break;
      }
      case 'CLOSE': {
        if (!ctx.open) return;
        ctx.open = false;
        config.onOpenChange?.(false);
        notify();
        break;
      }
    }
  }

  return {
    getContext(): NotificationCenterContext {
      return ctx;
    },
    send,
    subscribe(fn: () => void): () => void {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useNotificationCenter — NotificationCenter React hook.
 *
 * @packageDocumentation
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import {
  createNotificationCenter,
  type NotificationCenterConfig,
  type NotificationCenterAPI,
  type NotificationSeverity,
  type NotificationItem,
} from '@relteco/relui-core';

// ── Hook Props ──────────────────────────────────────

export type UseNotificationCenterProps = NotificationCenterConfig;

// ── Hook Return ─────────────────────────────────────

export interface UseNotificationCenterReturn {
  /** Bildirim listesi / Notification list */
  notifications: NotificationItem[];
  /** Panel acik mi / Is panel open */
  open: boolean;
  /** Okunmamis sayi / Unread count */
  unreadCount: number;
  /** Bildirim ekle / Add notification */
  add: (options: {
    id?: string;
    severity?: NotificationSeverity;
    title?: string;
    message: string;
    group?: string;
  }) => string;
  /** Bildirimi kaldir / Remove notification */
  remove: (id: string) => void;
  /** Tum bildirimleri kaldir / Remove all notifications */
  removeAll: () => void;
  /** Okundu olarak isaretle / Mark as read */
  markRead: (id: string) => void;
  /** Tumunu okundu olarak isaretle / Mark all as read */
  markAllRead: () => void;
  /** Paneli ac/kapat / Toggle panel */
  toggle: () => void;
  /** Core API / Core API */
  api: NotificationCenterAPI;
}

let idCounter = 0;

/**
 * useNotificationCenter — NotificationCenter yonetim hook.
 * useNotificationCenter — NotificationCenter management hook.
 */
export function useNotificationCenter(
  props: UseNotificationCenterProps = {},
): UseNotificationCenterReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  const apiRef = useRef<NotificationCenterAPI | null>(null);
  if (!apiRef.current) {
    apiRef.current = createNotificationCenter(props);
  }
  const api = apiRef.current;

  // ── Subscribe ──
  useEffect(() => {
    return api.subscribe(() => forceRender());
  }, [api]);

  const add = useCallback(
    (options: {
      id?: string;
      severity?: NotificationSeverity;
      title?: string;
      message: string;
      group?: string;
    }): string => {
      const id = options.id || `notif-${++idCounter}`;
      api.send({
        type: 'ADD',
        notification: {
          id,
          severity: options.severity || 'info',
          title: options.title,
          message: options.message,
          group: options.group,
        },
      });
      return id;
    },
    [api],
  );

  const remove = useCallback(
    (id: string) => {
      api.send({ type: 'REMOVE', id });
    },
    [api],
  );

  const removeAll = useCallback(() => {
    api.send({ type: 'REMOVE_ALL' });
  }, [api]);

  const markRead = useCallback(
    (id: string) => {
      api.send({ type: 'MARK_READ', id });
    },
    [api],
  );

  const markAllRead = useCallback(() => {
    api.send({ type: 'MARK_ALL_READ' });
  }, [api]);

  const toggle = useCallback(() => {
    api.send({ type: 'TOGGLE' });
  }, [api]);

  const ctx = api.getContext();

  return {
    notifications: ctx.notifications,
    open: ctx.open,
    unreadCount: ctx.unreadCount,
    add,
    remove,
    removeAll,
    markRead,
    markAllRead,
    toggle,
    api,
  };
}

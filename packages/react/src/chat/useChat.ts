/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useChat — Chat React hook.
 *
 * @packageDocumentation
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import {
  createChat,
  type ChatConfig,
  type ChatAPI,
  type ChatMessage,
  type ChatMessageStatus,
} from '@relteco/relui-core';

// ── Hook Props ──────────────────────────────────────

export interface UseChatProps {
  /** Baslangic mesajlari / Initial messages */
  messages?: ChatMessage[];
  /** Mesaj eklenince callback / On message add */
  onMessageAdd?: (message: ChatMessage) => void;
  /** Durum degisince callback / On status change */
  onMessageStatusChange?: (id: string, status: ChatMessageStatus) => void;
}

// ── Hook Return ─────────────────────────────────────

export interface UseChatReturn {
  /** Mesajlar / Messages */
  messages: readonly ChatMessage[];
  /** Yazan kullanicilar / Typing users */
  typingUsers: readonly string[];
  /** Tarih gruplari / Date groups */
  groups: ReturnType<ChatAPI['getContext']>['groups'];
  /** Mesaj sayisi / Message count */
  messageCount: number;
  /** Mesaj ekle / Add message */
  addMessage: (message: ChatMessage) => void;
  /** Mesaj guncelle / Update message */
  updateMessage: (id: string, updates: Partial<Pick<ChatMessage, 'content' | 'status'>>) => void;
  /** Mesaj sil / Remove message */
  removeMessage: (id: string) => void;
  /** Yazma durumu ayarla / Set typing */
  setTyping: (userId: string) => void;
  /** Yazma durumu temizle / Clear typing */
  clearTyping: (userId: string) => void;
  /** Reaksiyon ekle / Add reaction */
  addReaction: (messageId: string, emoji: string, userId: string) => void;
  /** Reaksiyon kaldir / Remove reaction */
  removeReaction: (messageId: string, emoji: string, userId: string) => void;
  /** Okundu isaretle / Mark read */
  markRead: (messageIds: string[]) => void;
  /** Core API / Core API */
  api: ChatAPI;
}

/**
 * useChat — Chat yonetim hook.
 * useChat — Chat management hook.
 */
export function useChat(props: UseChatProps = {}): UseChatReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  const apiRef = useRef<ChatAPI | null>(null);
  const prevRef = useRef<UseChatProps | undefined>(undefined);

  if (apiRef.current === null) {
    const cfg: ChatConfig = {
      messages: props.messages,
      onMessageAdd: props.onMessageAdd,
      onMessageStatusChange: props.onMessageStatusChange,
    };
    apiRef.current = createChat(cfg);
  }
  const api = apiRef.current;

  // ── Prop sync ──
  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) {
      prevRef.current = props;
      return;
    }
    if (prev.messages !== props.messages && props.messages !== undefined) {
      api.send({ type: 'SET_MESSAGES', messages: props.messages });
      forceRender();
    }
    prevRef.current = props;
  });

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  const ctx = api.getContext();

  const addMessage = useCallback(
    (message: ChatMessage) => api.send({ type: 'ADD_MESSAGE', message }),
    [api],
  );
  const updateMessage = useCallback(
    (id: string, updates: Partial<Pick<ChatMessage, 'content' | 'status'>>) =>
      api.send({ type: 'UPDATE_MESSAGE', id, updates }),
    [api],
  );
  const removeMessage = useCallback(
    (id: string) => api.send({ type: 'REMOVE_MESSAGE', id }),
    [api],
  );
  const setTyping = useCallback(
    (userId: string) => api.send({ type: 'SET_TYPING', userId }),
    [api],
  );
  const clearTyping = useCallback(
    (userId: string) => api.send({ type: 'CLEAR_TYPING', userId }),
    [api],
  );
  const addReaction = useCallback(
    (messageId: string, emoji: string, userId: string) =>
      api.send({ type: 'ADD_REACTION', messageId, reaction: { emoji, userId } }),
    [api],
  );
  const removeReaction = useCallback(
    (messageId: string, emoji: string, userId: string) =>
      api.send({ type: 'REMOVE_REACTION', messageId, emoji, userId }),
    [api],
  );
  const markRead = useCallback(
    (messageIds: string[]) => api.send({ type: 'MARK_READ', messageIds }),
    [api],
  );

  return {
    messages: ctx.messages,
    typingUsers: ctx.typingUsers,
    groups: ctx.groups,
    messageCount: ctx.messageCount,
    addMessage,
    updateMessage,
    removeMessage,
    setTyping,
    clearTyping,
    addReaction,
    removeReaction,
    markRead,
    api,
  };
}

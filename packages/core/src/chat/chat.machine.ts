/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Chat state machine — framework-agnostic mesajlasma mantigi.
 * Chat state machine — framework-agnostic messaging logic.
 *
 * Mesaj CRUD, tarih bazli gruplama, typing indicator, reaksiyon yonetimi.
 * Message CRUD, date-based grouping, typing indicator, reaction management.
 *
 * @packageDocumentation
 */

import type {
  ChatConfig,
  ChatContext,
  ChatEvent,
  ChatAPI,
  ChatMessage,
  ChatDateGroup,
} from './chat.types';

// ── Helpers ──────────────────────────────────────────

/**
 * ISO timestamp den gun kismi cikarir.
 * Extracts date part from ISO timestamp.
 */
function extractDate(timestamp: string): string {
  return timestamp.slice(0, 10);
}

/**
 * Mesajlari tarih bazli gruplar.
 * Groups messages by date.
 */
function groupByDate(messages: readonly ChatMessage[]): ChatDateGroup[] {
  const map = new Map<string, ChatMessage[]>();

  for (const msg of messages) {
    const date = extractDate(msg.timestamp);
    const group = map.get(date);
    if (group) {
      group.push(msg);
    } else {
      map.set(date, [msg]);
    }
  }

  const groups: ChatDateGroup[] = [];
  for (const [date, msgs] of map) {
    groups.push({ date, messages: msgs });
  }

  return groups;
}

// ── Factory ──────────────────────────────────────────

/**
 * Chat state machine olusturur.
 * Creates a chat state machine.
 */
export function createChat(config: ChatConfig = {}): ChatAPI {
  const { onMessageAdd, onMessageStatusChange } = config;

  // ── State ──
  let messages: ChatMessage[] = config.messages ? [...config.messages] : [];
  let typingUsers: string[] = [];

  // ── Subscribers ──
  const listeners = new Set<() => void>();

  function notify(): void {
    listeners.forEach((fn) => fn());
  }

  // ── Helpers ──
  function findIndex(id: string): number {
    return messages.findIndex((m) => m.id === id);
  }

  function rebuildGroups(): ChatDateGroup[] {
    return groupByDate(messages);
  }

  // ── Send ──
  function send(event: ChatEvent): void {
    switch (event.type) {
      case 'ADD_MESSAGE': {
        messages = [...messages, event.message];
        onMessageAdd?.(event.message);
        notify();
        break;
      }
      case 'UPDATE_MESSAGE': {
        const idx = findIndex(event.id);
        if (idx === -1) return;
        const current = messages[idx];
        if (!current) return;
        const updated: ChatMessage = {
          ...current,
          ...event.updates,
        };
        messages = [...messages];
        messages[idx] = updated;
        if (event.updates.status && event.updates.status !== current.status) {
          onMessageStatusChange?.(event.id, event.updates.status);
        }
        notify();
        break;
      }
      case 'REMOVE_MESSAGE': {
        const idx = findIndex(event.id);
        if (idx === -1) return;
        messages = messages.filter((m) => m.id !== event.id);
        notify();
        break;
      }
      case 'SET_TYPING': {
        if (typingUsers.includes(event.userId)) return;
        typingUsers = [...typingUsers, event.userId];
        notify();
        break;
      }
      case 'CLEAR_TYPING': {
        if (!typingUsers.includes(event.userId)) return;
        typingUsers = typingUsers.filter((u) => u !== event.userId);
        notify();
        break;
      }
      case 'ADD_REACTION': {
        const idx = findIndex(event.messageId);
        if (idx === -1) return;
        const msg = messages[idx];
        if (!msg) return;
        const alreadyReacted = msg.reactions.some(
          (r) => r.emoji === event.reaction.emoji && r.userId === event.reaction.userId,
        );
        if (alreadyReacted) return;
        const updated: ChatMessage = {
          ...msg,
          reactions: [...msg.reactions, event.reaction],
        };
        messages = [...messages];
        messages[idx] = updated;
        notify();
        break;
      }
      case 'REMOVE_REACTION': {
        const idx = findIndex(event.messageId);
        if (idx === -1) return;
        const msg = messages[idx];
        if (!msg) return;
        const filtered = msg.reactions.filter(
          (r) => !(r.emoji === event.emoji && r.userId === event.userId),
        );
        if (filtered.length === msg.reactions.length) return;
        const updated: ChatMessage = { ...msg, reactions: filtered };
        messages = [...messages];
        messages[idx] = updated;
        notify();
        break;
      }
      case 'SET_MESSAGES': {
        messages = [...event.messages];
        notify();
        break;
      }
      case 'MARK_READ': {
        let changed = false;
        messages = messages.map((m) => {
          if (event.messageIds.includes(m.id) && m.status !== 'read') {
            changed = true;
            onMessageStatusChange?.(m.id, 'read');
            return { ...m, status: 'read' as const };
          }
          return m;
        });
        if (changed) notify();
        break;
      }
    }
  }

  // ── API ──
  return {
    getContext(): ChatContext {
      return {
        messages,
        typingUsers,
        groups: rebuildGroups(),
        messageCount: messages.length,
      };
    },
    send,
    subscribe(callback: () => void): () => void {
      listeners.add(callback);
      return () => {
        listeners.delete(callback);
      };
    },
    destroy(): void {
      listeners.clear();
    },
  };
}

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Chat tipleri.
 * Chat types.
 *
 * @packageDocumentation
 */

// ── Message Types ────────────────────────────────────

/** Mesaj durumu / Message status */
export type ChatMessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

/** Mesaj yonu / Message direction */
export type ChatMessageDirection = 'incoming' | 'outgoing';

/** Reaksiyon / Reaction */
export interface ChatReaction {
  /** Emoji karakter / Emoji character */
  readonly emoji: string;
  /** Kullanici ID / User ID */
  readonly userId: string;
}

/** Mesaj tanimi / Message definition */
export interface ChatMessage {
  /** Benzersiz kimlik / Unique ID */
  readonly id: string;
  /** Mesaj icerigi / Message content */
  readonly content: string;
  /** Yon / Direction */
  readonly direction: ChatMessageDirection;
  /** Zaman damgasi (ISO) / Timestamp (ISO) */
  readonly timestamp: string;
  /** Gonderen ID / Sender ID */
  readonly senderId: string;
  /** Gonderen adi / Sender name */
  readonly senderName: string;
  /** Gonderen avatar URL / Sender avatar URL */
  readonly senderAvatar?: string;
  /** Durum / Status */
  readonly status: ChatMessageStatus;
  /** Reaksiyonlar / Reactions */
  readonly reactions: readonly ChatReaction[];
  /** Yanit mesaj ID / Reply-to message ID */
  readonly replyToId?: string;
}

/** Tarih bazli mesaj grubu / Date-based message group */
export interface ChatDateGroup {
  /** Tarih (ISO gun) / Date (ISO day) */
  readonly date: string;
  /** Gruptaki mesajlar / Messages in group */
  readonly messages: readonly ChatMessage[];
}

// ── Events ───────────────────────────────────────────

/** Chat event'leri / Chat events */
export type ChatEvent =
  | { type: 'ADD_MESSAGE'; message: ChatMessage }
  | { type: 'UPDATE_MESSAGE'; id: string; updates: Partial<Pick<ChatMessage, 'content' | 'status'>> }
  | { type: 'REMOVE_MESSAGE'; id: string }
  | { type: 'SET_TYPING'; userId: string }
  | { type: 'CLEAR_TYPING'; userId: string }
  | { type: 'ADD_REACTION'; messageId: string; reaction: ChatReaction }
  | { type: 'REMOVE_REACTION'; messageId: string; emoji: string; userId: string }
  | { type: 'SET_MESSAGES'; messages: ChatMessage[] }
  | { type: 'MARK_READ'; messageIds: string[] };

// ── Context ──────────────────────────────────────────

/** Chat state / Chat context */
export interface ChatContext {
  /** Tum mesajlar / All messages */
  readonly messages: readonly ChatMessage[];
  /** Yazan kullanicilar / Typing users */
  readonly typingUsers: readonly string[];
  /** Tarih bazli gruplar / Date-based groups */
  readonly groups: readonly ChatDateGroup[];
  /** Mesaj sayisi / Message count */
  readonly messageCount: number;
}

// ── Config ───────────────────────────────────────────

/** Chat yapilandirmasi / Chat configuration */
export interface ChatConfig {
  /** Baslangic mesajlari / Initial messages */
  messages?: ChatMessage[];
  /** Mesaj eklenince callback / On message add callback */
  onMessageAdd?: (message: ChatMessage) => void;
  /** Mesaj durumu degisince callback / On status change callback */
  onMessageStatusChange?: (id: string, status: ChatMessageStatus) => void;
}

// ── API ──────────────────────────────────────────────

/** Chat API / Chat API */
export interface ChatAPI {
  /** Guncel context / Get current context */
  getContext(): ChatContext;
  /** Event gonder / Send event */
  send(event: ChatEvent): void;
  /** Degisikliklere abone ol / Subscribe to changes */
  subscribe(callback: () => void): () => void;
  /** Temizlik / Cleanup */
  destroy(): void;
}

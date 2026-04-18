/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Chat — mesajlasma bilesen (Dual API).
 * Chat — messaging component (Dual API).
 *
 * Props-based: `<Chat messages={msgs} onSend={fn} />`
 * Compound:    `<Chat><Chat.MessageList>...</Chat.MessageList><Chat.Input /></Chat>`
 *
 * @packageDocumentation
 */

import {
  forwardRef,
  createContext,
  useContext,
  useRef,
  useEffect,
  useState,
  type ReactNode,
  type KeyboardEvent,
} from 'react';
import { CheckIcon } from '@relteco/relui-icons';
import type { ChatMessage } from '@relteco/relui-core';
import {
  rootStyle,
  messageListStyle,
  messageStyle,
  messageIncomingStyle,
  messageOutgoingStyle,
  bubbleStyle,
  bubbleIncomingStyle,
  bubbleOutgoingStyle,
  avatarStyle,
  timestampStyle,
  inputContainerStyle,
  inputFieldStyle,
  sendButtonStyle,
  typingIndicatorStyle,
  dateSeparatorStyle,
  dateSeparatorTextStyle,
  reactionsStyle,
  reactionBadgeStyle,
  statusStyle,
  statusReadStyle,
} from './chat.css';
import { useChat, type UseChatProps } from './useChat';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** Chat slot isimleri / Chat slot names. */
export type ChatSlot =
  | 'root'
  | 'messageList'
  | 'message'
  | 'bubble'
  | 'avatar'
  | 'timestamp'
  | 'input'
  | 'typingIndicator'
  | 'dateSeparator'
  | 'reactions'
  | 'status';

// ── Helpers ──────────────────────────────────────────

function formatTime(timestamp: string): string {
  const d = new Date(timestamp);
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

function formatDate(date: string): string {
  const d = new Date(date + 'T00:00:00');
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

function renderStatusIcon(status: string): string {
  switch (status) {
    case 'sending': return '\u2022';
    case 'sent': return '\u2713';
    case 'delivered': return '\u2713\u2713';
    case 'read': return '\u2713\u2713';
    default: return '';
  }
}

// ── Context (Compound API) ──────────────────────────

interface ChatContextValue {
  messages: readonly ChatMessage[];
  typingUsers: readonly string[];
  groups: ReturnType<typeof useChat>['groups'];
  currentUserId: string;
  addMessage: (msg: ChatMessage) => void;
  addReaction: (messageId: string, emoji: string, userId: string) => void;
  removeReaction: (messageId: string, emoji: string, userId: string) => void;
  onSend?: (content: string) => void;
  classNames: ClassNames<ChatSlot> | undefined;
  styles: Styles<ChatSlot> | undefined;
}

const ChatContext = createContext<ChatContextValue | null>(null);

function useChatContext(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('Chat compound sub-components must be used within <Chat>.');
  return ctx;
}

// ── Compound: Chat.MessageList ───────────────────────

/** Chat.MessageList props */
export interface ChatMessageListProps {
  /** Icerik / Content */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const ChatMessageList = forwardRef<HTMLDivElement, ChatMessageListProps>(
  function ChatMessageList(props, ref) {
    const { children, className } = props;
    const ctx = useChatContext();
    const slot = getSlotProps('messageList', messageListStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div
        ref={ref}
        className={cls}
        style={slot.style}
        role="log"
        aria-live="polite"
        data-testid="chat-messageList"
      >
        {children}
      </div>
    );
  },
);

// ── Compound: Chat.Message ───────────────────────────

/** Chat.Message props */
export interface ChatMessageProps {
  /** Mesaj verisi / Message data */
  message: ChatMessage;
  /** Ek className / Additional className */
  className?: string;
}

const ChatMessageComp = forwardRef<HTMLDivElement, ChatMessageProps>(
  function ChatMessage(props, ref) {
    const { message, className } = props;
    const ctx = useChatContext();
    const isOutgoing = message.direction === 'outgoing';

    const dirCls = isOutgoing ? messageOutgoingStyle : messageIncomingStyle;
    const msgSlot = getSlotProps('message', `${messageStyle} ${dirCls}`, ctx.classNames, ctx.styles);
    const cls = className ? `${msgSlot.className} ${className}` : msgSlot.className;

    const bubbleDirCls = isOutgoing ? bubbleOutgoingStyle : bubbleIncomingStyle;
    const bSlot = getSlotProps('bubble', `${bubbleStyle} ${bubbleDirCls}`, ctx.classNames, ctx.styles);
    const avSlot = getSlotProps('avatar', avatarStyle, ctx.classNames, ctx.styles);
    const tsSlot = getSlotProps('timestamp', timestampStyle, ctx.classNames, ctx.styles);
    const rxSlot = getSlotProps('reactions', reactionsStyle, ctx.classNames, ctx.styles);
    const stSlot = getSlotProps(
      'status',
      message.status === 'read' ? `${statusStyle} ${statusReadStyle}` : statusStyle,
      ctx.classNames,
      ctx.styles,
    );

    return (
      <div ref={ref} className={cls} style={msgSlot.style} role="listitem" data-testid="chat-message">
        {/* Avatar */}
        {!isOutgoing && (
          <div className={avSlot.className} style={avSlot.style} data-testid="chat-avatar">
            {message.senderAvatar ? (
              <img src={message.senderAvatar} alt={message.senderName} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            ) : (
              getInitial(message.senderName)
            )}
          </div>
        )}

        <div>
          {/* Bubble */}
          <div className={bSlot.className} style={bSlot.style} data-testid="chat-bubble">
            {message.content}
          </div>

          {/* Reactions */}
          {message.reactions.length > 0 && (
            <div className={rxSlot.className} style={rxSlot.style} data-testid="chat-reactions">
              {groupReactions(message.reactions).map((r) => (
                <span key={r.emoji} className={reactionBadgeStyle}>
                  {r.emoji} {r.count > 1 ? r.count : ''}
                </span>
              ))}
            </div>
          )}

          {/* Timestamp + Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: isOutgoing ? 'flex-end' : 'flex-start' }}>
            <span className={tsSlot.className} style={tsSlot.style} data-testid="chat-timestamp">
              {formatTime(message.timestamp)}
            </span>
            {isOutgoing && (
              <span className={stSlot.className} style={stSlot.style} data-testid="chat-status">
                {renderStatusIcon(message.status)}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  },
);

function groupReactions(reactions: readonly { emoji: string; userId: string }[]): { emoji: string; count: number }[] {
  const map = new Map<string, number>();
  for (const r of reactions) {
    map.set(r.emoji, (map.get(r.emoji) ?? 0) + 1);
  }
  return Array.from(map.entries()).map(([emoji, count]) => ({ emoji, count }));
}

// ── Compound: Chat.Bubble ────────────────────────────

/** Chat.Bubble props */
export interface ChatBubbleProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Yon / Direction */
  direction?: 'incoming' | 'outgoing';
  /** Ek className / Additional className */
  className?: string;
}

const ChatBubble = forwardRef<HTMLDivElement, ChatBubbleProps>(
  function ChatBubble(props, ref) {
    const { children, direction = 'outgoing', className } = props;
    const ctx = useChatContext();
    const dirCls = direction === 'outgoing' ? bubbleOutgoingStyle : bubbleIncomingStyle;
    const slot = getSlotProps('bubble', `${bubbleStyle} ${dirCls}`, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="chat-bubble">
        {children}
      </div>
    );
  },
);

// ── Compound: Chat.Input ─────────────────────────────

/** Chat.Input props */
export interface ChatInputProps {
  /** Placeholder */
  placeholder?: string;
  /** Ek className / Additional className */
  className?: string;
}

const ChatInput = forwardRef<HTMLDivElement, ChatInputProps>(
  function ChatInput(props, ref) {
    const { placeholder = 'Mesaj yazin...', className } = props;
    const ctx = useChatContext();
    const [text, setText] = useState('');
    const slot = getSlotProps('input', inputContainerStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    function handleSend() {
      const trimmed = text.trim();
      if (!trimmed) return;
      ctx.onSend?.(trimmed);
      setText('');
    }

    function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    }

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="chat-input">
        <textarea
          className={inputFieldStyle}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          aria-label="Message input"
          data-testid="chat-inputField"
        />
        <button
          type="button"
          className={sendButtonStyle}
          onClick={handleSend}
          disabled={!text.trim()}
          aria-label="Send message"
          data-testid="chat-sendButton"
        >
          <CheckIcon size={16} />
        </button>
      </div>
    );
  },
);

// ── Compound: Chat.TypingIndicator ───────────────────

/** Chat.TypingIndicator props */
export interface ChatTypingIndicatorProps {
  /** Yazan kullanicilar / Typing user names */
  users?: string[];
  /** Ek className / Additional className */
  className?: string;
}

const ChatTypingIndicator = forwardRef<HTMLDivElement, ChatTypingIndicatorProps>(
  function ChatTypingIndicator(props, ref) {
    const { users, className } = props;
    const ctx = useChatContext();
    const slot = getSlotProps('typingIndicator', typingIndicatorStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const typingList = users ?? ctx.typingUsers;
    if (typingList.length === 0) return null;

    const label = typingList.length === 1
      ? `${typingList[0]} yaziyor...`
      : `${typingList.join(', ')} yaziyor...`;

    return (
      <div ref={ref} className={cls} style={slot.style} aria-live="polite" data-testid="chat-typingIndicator">
        {label}
      </div>
    );
  },
);

// ── Compound: Chat.DateSeparator ─────────────────────

/** Chat.DateSeparator props */
export interface ChatDateSeparatorProps {
  /** Tarih (ISO) / Date (ISO) */
  date: string;
  /** Ek className / Additional className */
  className?: string;
}

const ChatDateSeparator = forwardRef<HTMLDivElement, ChatDateSeparatorProps>(
  function ChatDateSeparator(props, ref) {
    const { date, className } = props;
    const ctx = useChatContext();
    const slot = getSlotProps('dateSeparator', dateSeparatorStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="chat-dateSeparator">
        <span className={dateSeparatorTextStyle}>{formatDate(date)}</span>
      </div>
    );
  },
);

// ── Component Props ─────────────────────────────────

export interface ChatComponentProps extends SlotStyleProps<ChatSlot> {
  /** Mesajlar / Messages */
  messages?: ChatMessage[];
  /** Mevcut kullanici ID / Current user ID */
  currentUserId?: string;
  /** Yazan kullanicilar / Typing users */
  typingUsers?: string[];
  /** Mesaj gonder callback / On send callback */
  onSend?: (content: string) => void;
  /** Placeholder */
  placeholder?: string;
  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Component ────────────────────────────────────────

const ChatBase = forwardRef<HTMLDivElement, ChatComponentProps>(
  function Chat(props, ref) {
    const {
      messages: messagesProp,
      currentUserId = 'me',
      typingUsers: typingUsersProp,
      onSend,
      placeholder = 'Mesaj yazin...',
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const hookProps: UseChatProps = {
      messages: messagesProp,
    };
    const chat = useChat(hookProps);

    // Typing users from prop (override)
    useEffect(() => {
      if (!typingUsersProp) return;
      for (const u of typingUsersProp) {
        chat.api.send({ type: 'SET_TYPING', userId: u });
      }
    }, [typingUsersProp, chat.api]);

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootClassName = className ? `${rootSlot.className} ${className}` : rootSlot.className;

    const ctxValue: ChatContextValue = {
      messages: chat.messages,
      typingUsers: chat.typingUsers,
      groups: chat.groups,
      currentUserId,
      addMessage: chat.addMessage,
      addReaction: chat.addReaction,
      removeReaction: chat.removeReaction,
      onSend,
      classNames,
      styles,
    };

    // ── Compound API ──
    if (children) {
      return (
        <ChatContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={rootClassName}
            style={{ ...rootSlot.style, ...styleProp }}
            data-testid="chat-root"
          >
            {children}
          </div>
        </ChatContext.Provider>
      );
    }

    // ── Props-based API ──
    return (
      <ChatContext.Provider value={ctxValue}>
        <div
          ref={ref}
          className={rootClassName}
          style={{ ...rootSlot.style, ...styleProp }}
          data-testid="chat-root"
        >
          <ChatPropsBasedContent
            groups={chat.groups}
            typingUsers={chat.typingUsers}
            placeholder={placeholder}
            classNames={classNames}
            styles={styles}
          />
        </div>
      </ChatContext.Provider>
    );
  },
);

/** Props-based icerik yardimci bilesen / Props-based content helper */
function ChatPropsBasedContent(props: {
  groups: ReturnType<typeof useChat>['groups'];
  typingUsers: readonly string[];
  placeholder: string;
  classNames: ClassNames<ChatSlot> | undefined;
  styles: Styles<ChatSlot> | undefined;
}) {
  const { groups, typingUsers, placeholder } = props;
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [groups]);

  return (
    <>
      <ChatMessageList ref={listRef}>
        {groups.map((group) => (
          <div key={group.date}>
            <ChatDateSeparator date={group.date} />
            {group.messages.map((msg) => (
              <ChatMessageComp key={msg.id} message={msg} />
            ))}
          </div>
        ))}
      </ChatMessageList>
      {typingUsers.length > 0 && <ChatTypingIndicator />}
      <ChatInput placeholder={placeholder} />
    </>
  );
}

/**
 * Chat bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Chat messages={messages} currentUserId="me" onSend={handleSend} />
 * ```
 *
 * @example Compound
 * ```tsx
 * <Chat currentUserId="me">
 *   <Chat.MessageList>
 *     <Chat.Message message={msg} />
 *   </Chat.MessageList>
 *   <Chat.TypingIndicator users={['Ali']} />
 *   <Chat.Input />
 * </Chat>
 * ```
 */
export const Chat = Object.assign(ChatBase, {
  MessageList: ChatMessageList,
  Message: ChatMessageComp,
  Bubble: ChatBubble,
  Input: ChatInput,
  TypingIndicator: ChatTypingIndicator,
  DateSeparator: ChatDateSeparator,
});

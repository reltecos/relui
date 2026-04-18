/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Chat } from './Chat';
import type { ChatMessage } from '@relteco/relui-core';

const meta: Meta<typeof Chat> = {
  title: 'Data Display/Chat',
  component: Chat,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Chat>;

function makeMsg(overrides: Partial<ChatMessage> & { id: string }): ChatMessage {
  return {
    content: 'Merhaba',
    direction: 'outgoing',
    timestamp: '2025-06-15T10:00:00Z',
    senderId: 'user1',
    senderName: 'Ali',
    status: 'sent',
    reactions: [],
    ...overrides,
  };
}

const DEMO_MESSAGES: ChatMessage[] = [
  makeMsg({ id: '1', direction: 'incoming', senderId: 'u2', senderName: 'Veli', content: 'Selam, nasilsin?', timestamp: '2025-06-15T09:00:00Z', status: 'read' }),
  makeMsg({ id: '2', content: 'Iyiyim, sen?', timestamp: '2025-06-15T09:01:00Z', status: 'read' }),
  makeMsg({ id: '3', direction: 'incoming', senderId: 'u2', senderName: 'Veli', content: 'Ben de iyiyim! Proje nasil gidiyor?', timestamp: '2025-06-15T09:02:00Z', status: 'read' }),
  makeMsg({ id: '4', content: 'Gayet iyi, bu hafta bitiriyoruz.', timestamp: '2025-06-15T09:03:00Z', status: 'delivered' }),
  makeMsg({ id: '5', direction: 'incoming', senderId: 'u2', senderName: 'Veli', content: 'Harika! Basarilar.', timestamp: '2025-06-15T09:04:00Z', status: 'sent', reactions: [{ emoji: '👍', userId: 'user1' }] }),
];

const containerStyle = {
  width: 400,
  height: 500,
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  borderRadius: 12,
  overflow: 'hidden',
};

// ── Default ──

export const Default: Story = {
  render: () => (
    <div style={containerStyle}>
      <Chat messages={DEMO_MESSAGES} currentUserId="user1" onSend={() => {}} />
    </div>
  ),
};

// ── WithTyping ──

export const WithTyping: Story = {
  render: () => (
    <div style={containerStyle}>
      <Chat
        messages={DEMO_MESSAGES}
        currentUserId="user1"
        typingUsers={['Veli']}
        onSend={() => {}}
      />
    </div>
  ),
};

// ── WithReactions ──

export const WithReactions: Story = {
  render: () => {
    const msgs: ChatMessage[] = [
      makeMsg({ id: '1', direction: 'incoming', senderId: 'u2', senderName: 'Veli', content: 'Bu projeyi bitirdik!', reactions: [{ emoji: '🎉', userId: 'user1' }, { emoji: '👍', userId: 'user1' }, { emoji: '🎉', userId: 'u3' }] }),
      makeMsg({ id: '2', content: 'Evet, harika oldu!', reactions: [{ emoji: '❤️', userId: 'u2' }] }),
    ];
    return (
      <div style={containerStyle}>
        <Chat messages={msgs} currentUserId="user1" onSend={() => {}} />
      </div>
    );
  },
};

// ── StatusIndicators ──

export const StatusIndicators: Story = {
  render: () => {
    const msgs: ChatMessage[] = [
      makeMsg({ id: '1', content: 'Gonderiyor...', status: 'sending', timestamp: '2025-06-15T10:00:00Z' }),
      makeMsg({ id: '2', content: 'Gonderildi', status: 'sent', timestamp: '2025-06-15T10:01:00Z' }),
      makeMsg({ id: '3', content: 'Iletildi', status: 'delivered', timestamp: '2025-06-15T10:02:00Z' }),
      makeMsg({ id: '4', content: 'Okundu', status: 'read', timestamp: '2025-06-15T10:03:00Z' }),
    ];
    return (
      <div style={containerStyle}>
        <Chat messages={msgs} currentUserId="user1" onSend={() => {}} />
      </div>
    );
  },
};

// ── MultiDay ──

export const MultiDay: Story = {
  render: () => {
    const msgs: ChatMessage[] = [
      makeMsg({ id: '1', direction: 'incoming', senderId: 'u2', senderName: 'Veli', content: 'Dunku mesaj', timestamp: '2025-06-14T18:00:00Z' }),
      makeMsg({ id: '2', content: 'Tamam', timestamp: '2025-06-14T18:01:00Z' }),
      makeMsg({ id: '3', direction: 'incoming', senderId: 'u2', senderName: 'Veli', content: 'Bugunku mesaj', timestamp: '2025-06-15T09:00:00Z' }),
      makeMsg({ id: '4', content: 'Gunaydin!', timestamp: '2025-06-15T09:01:00Z' }),
    ];
    return (
      <div style={containerStyle}>
        <Chat messages={msgs} currentUserId="user1" onSend={() => {}} />
      </div>
    );
  },
};

// ── Compound ──

export const Compound: Story = {
  render: () => (
    <div style={containerStyle}>
      <Chat currentUserId="user1" onSend={() => {}}>
        <Chat.MessageList>
          <Chat.DateSeparator date="2025-06-15" />
          {DEMO_MESSAGES[0] && <Chat.Message message={DEMO_MESSAGES[0]} />}
          {DEMO_MESSAGES[1] && <Chat.Message message={DEMO_MESSAGES[1]} />}
          {DEMO_MESSAGES[2] && <Chat.Message message={DEMO_MESSAGES[2]} />}
        </Chat.MessageList>
        <Chat.TypingIndicator users={['Veli']} />
        <Chat.Input placeholder="Mesajinizi yazin..." />
      </Chat>
    </div>
  ),
};

// ── CustomSlotStyles ──

export const CustomSlotStyles: Story = {
  render: () => (
    <div style={containerStyle}>
      <Chat
        messages={DEMO_MESSAGES}
        currentUserId="user1"
        onSend={() => {}}
        styles={{
          messageList: { padding: '20px' },
          bubble: { borderRadius: 16, padding: '10px 16px' },
          input: { padding: '16px 20px' },
        }}
      />
    </div>
  ),
};

// ── Empty ──

export const Empty: Story = {
  render: () => (
    <div style={containerStyle}>
      <Chat messages={[]} currentUserId="user1" onSend={() => {}} placeholder="Ilk mesajinizi yazin..." />
    </div>
  ),
};

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Chat } from './Chat';
import type { ChatMessage } from '@relteco/relui-core';

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

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

const SAMPLE_MESSAGES: ChatMessage[] = [
  makeMsg({ id: '1', direction: 'incoming', senderId: 'user2', senderName: 'Veli', content: 'Selam!' }),
  makeMsg({ id: '2', direction: 'outgoing', senderId: 'user1', senderName: 'Ali', content: 'Nasilsin?' }),
  makeMsg({ id: '3', direction: 'incoming', senderId: 'user2', senderName: 'Veli', content: 'Iyiyim!' }),
];

describe('Chat', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<Chat messages={[]} />);
    expect(screen.getByTestId('chat-root')).toBeInTheDocument();
  });

  // ── MessageList ──

  it('messageList render edilir', () => {
    render(<Chat messages={[]} />);
    expect(screen.getByTestId('chat-messageList')).toBeInTheDocument();
  });

  it('messageList role=log olarak set edilir', () => {
    render(<Chat messages={[]} />);
    expect(screen.getByTestId('chat-messageList')).toHaveAttribute('role', 'log');
  });

  // ── Messages ──

  it('mesajlar render edilir', () => {
    render(<Chat messages={SAMPLE_MESSAGES} />);
    const msgs = screen.getAllByTestId('chat-message');
    expect(msgs).toHaveLength(3);
  });

  it('mesaj icerigi bubble icerisinde render edilir', () => {
    render(<Chat messages={[makeMsg({ id: '1', content: 'Test mesaji' })]} />);
    expect(screen.getByText('Test mesaji')).toBeInTheDocument();
  });

  it('incoming mesajda avatar gosterilir', () => {
    render(<Chat messages={[makeMsg({ id: '1', direction: 'incoming', senderName: 'Veli' })]} />);
    expect(screen.getByTestId('chat-avatar')).toBeInTheDocument();
  });

  it('outgoing mesajda avatar gosterilmez', () => {
    render(<Chat messages={[makeMsg({ id: '1', direction: 'outgoing' })]} />);
    expect(screen.queryByTestId('chat-avatar')).not.toBeInTheDocument();
  });

  // ── Bubble ──

  it('bubble render edilir', () => {
    render(<Chat messages={[makeMsg({ id: '1' })]} />);
    expect(screen.getByTestId('chat-bubble')).toBeInTheDocument();
  });

  // ── Timestamp ──

  it('timestamp render edilir', () => {
    render(<Chat messages={[makeMsg({ id: '1', timestamp: '2025-06-15T14:30:00Z' })]} />);
    expect(screen.getByTestId('chat-timestamp')).toBeInTheDocument();
  });

  // ── Status ──

  it('outgoing mesajda status gosterilir', () => {
    render(<Chat messages={[makeMsg({ id: '1', direction: 'outgoing', status: 'sent' })]} />);
    expect(screen.getByTestId('chat-status')).toBeInTheDocument();
  });

  it('incoming mesajda status gosterilmez', () => {
    render(<Chat messages={[makeMsg({ id: '1', direction: 'incoming' })]} />);
    expect(screen.queryByTestId('chat-status')).not.toBeInTheDocument();
  });

  // ── Reactions ──

  it('reaksiyonlar render edilir', () => {
    render(
      <Chat
        messages={[
          makeMsg({
            id: '1',
            reactions: [
              { emoji: '👍', userId: 'u2' },
              { emoji: '❤️', userId: 'u3' },
            ],
          }),
        ]}
      />,
    );
    expect(screen.getByTestId('chat-reactions')).toBeInTheDocument();
  });

  it('reaksiyon yoksa reactions render edilmez', () => {
    render(<Chat messages={[makeMsg({ id: '1', reactions: [] })]} />);
    expect(screen.queryByTestId('chat-reactions')).not.toBeInTheDocument();
  });

  // ── DateSeparator ──

  it('tarih ayirici render edilir', () => {
    render(<Chat messages={SAMPLE_MESSAGES} />);
    expect(screen.getByTestId('chat-dateSeparator')).toBeInTheDocument();
  });

  // ── Input ──

  it('input alani render edilir', () => {
    render(<Chat messages={[]} />);
    expect(screen.getByTestId('chat-input')).toBeInTheDocument();
    expect(screen.getByTestId('chat-inputField')).toBeInTheDocument();
  });

  it('send butonu render edilir', () => {
    render(<Chat messages={[]} />);
    expect(screen.getByTestId('chat-sendButton')).toBeInTheDocument();
  });

  it('bos mesajda send butonu disabled', () => {
    render(<Chat messages={[]} />);
    expect(screen.getByTestId('chat-sendButton')).toBeDisabled();
  });

  it('mesaj yazilinca send butonu aktif olur', () => {
    render(<Chat messages={[]} />);
    fireEvent.change(screen.getByTestId('chat-inputField'), { target: { value: 'Test' } });
    expect(screen.getByTestId('chat-sendButton')).not.toBeDisabled();
  });

  it('Enter ile onSend cagirilir', () => {
    const onSend = vi.fn();
    render(<Chat messages={[]} onSend={onSend} />);
    const input = screen.getByTestId('chat-inputField');
    fireEvent.change(input, { target: { value: 'Merhaba' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSend).toHaveBeenCalledWith('Merhaba');
  });

  it('Shift+Enter yeni satir ekler, gonder cagirilmaz', () => {
    const onSend = vi.fn();
    render(<Chat messages={[]} onSend={onSend} />);
    const input = screen.getByTestId('chat-inputField');
    fireEvent.change(input, { target: { value: 'Test' } });
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });
    expect(onSend).not.toHaveBeenCalled();
  });

  it('placeholder ayarlanabilir', () => {
    render(<Chat messages={[]} placeholder="Yaz..." />);
    expect(screen.getByTestId('chat-inputField')).toHaveAttribute('placeholder', 'Yaz...');
  });

  // ── TypingIndicator ──

  it('typing indicator gosterilir', () => {
    render(<Chat messages={[]} typingUsers={['Veli']} />);
    expect(screen.getByTestId('chat-typingIndicator')).toBeInTheDocument();
    expect(screen.getByTestId('chat-typingIndicator')).toHaveTextContent('Veli yaziyor...');
  });

  it('typing indicator bos iken gosterilmez', () => {
    render(<Chat messages={[]} />);
    expect(screen.queryByTestId('chat-typingIndicator')).not.toBeInTheDocument();
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<Chat messages={[]} className="my-chat" />);
    expect(screen.getByTestId('chat-root').className).toContain('my-chat');
  });

  it('style root elemana eklenir', () => {
    render(<Chat messages={[]} style={{ padding: '16px' }} />);
    expect(screen.getByTestId('chat-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<Chat messages={[]} classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('chat-root').className).toContain('custom-root');
  });

  it('classNames.messageList messageList elemana eklenir', () => {
    render(<Chat messages={[]} classNames={{ messageList: 'custom-list' }} />);
    expect(screen.getByTestId('chat-messageList').className).toContain('custom-list');
  });

  it('classNames.bubble bubble elemana eklenir', () => {
    render(<Chat messages={[makeMsg({ id: '1' })]} classNames={{ bubble: 'custom-bbl' }} />);
    expect(screen.getByTestId('chat-bubble').className).toContain('custom-bbl');
  });

  it('classNames.input input elemana eklenir', () => {
    render(<Chat messages={[]} classNames={{ input: 'custom-inp' }} />);
    expect(screen.getByTestId('chat-input').className).toContain('custom-inp');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<Chat messages={[]} styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('chat-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.messageList messageList elemana eklenir', () => {
    render(<Chat messages={[]} styles={{ messageList: { padding: '20px' } }} />);
    expect(screen.getByTestId('chat-messageList')).toHaveStyle({ padding: '20px' });
  });

  it('styles.bubble bubble elemana eklenir', () => {
    render(
      <Chat messages={[makeMsg({ id: '1' })]} styles={{ bubble: { padding: '16px' } }} />,
    );
    expect(screen.getByTestId('chat-bubble')).toHaveStyle({ padding: '16px' });
  });

  it('styles.input input elemana eklenir', () => {
    render(<Chat messages={[]} styles={{ input: { padding: '12px' } }} />);
    expect(screen.getByTestId('chat-input')).toHaveStyle({ padding: '12px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<Chat messages={[]} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('Chat (Compound)', () => {
  it('compound: MessageList render edilir', () => {
    render(
      <Chat>
        <Chat.MessageList />
      </Chat>,
    );
    expect(screen.getByTestId('chat-messageList')).toBeInTheDocument();
  });

  it('compound: Message render edilir', () => {
    render(
      <Chat>
        <Chat.MessageList>
          <Chat.Message message={makeMsg({ id: '1', content: 'Compound test' })} />
        </Chat.MessageList>
      </Chat>,
    );
    expect(screen.getByText('Compound test')).toBeInTheDocument();
  });

  it('compound: Input render edilir', () => {
    render(
      <Chat>
        <Chat.Input />
      </Chat>,
    );
    expect(screen.getByTestId('chat-input')).toBeInTheDocument();
  });

  it('compound: DateSeparator render edilir', () => {
    render(
      <Chat>
        <Chat.DateSeparator date="2025-06-15" />
      </Chat>,
    );
    expect(screen.getByTestId('chat-dateSeparator')).toBeInTheDocument();
  });

  it('compound: TypingIndicator render edilir', () => {
    render(
      <Chat>
        <Chat.TypingIndicator users={['Ali']} />
      </Chat>,
    );
    expect(screen.getByTestId('chat-typingIndicator')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <Chat classNames={{ messageList: 'cmp-list' }}>
        <Chat.MessageList />
      </Chat>,
    );
    expect(screen.getByTestId('chat-messageList').className).toContain('cmp-list');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <Chat styles={{ messageList: { padding: '30px' } }}>
        <Chat.MessageList />
      </Chat>,
    );
    expect(screen.getByTestId('chat-messageList')).toHaveStyle({ padding: '30px' });
  });

  it('Chat.MessageList context disinda hata firlatir', () => {
    expect(() => render(<Chat.MessageList />)).toThrow();
  });
});

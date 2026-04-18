/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createChat } from './chat.machine';
import type { ChatMessage } from './chat.types';

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

describe('createChat', () => {
  // ── Init ──

  it('varsayilan context doner', () => {
    const api = createChat();
    const ctx = api.getContext();
    expect(ctx.messages).toHaveLength(0);
    expect(ctx.typingUsers).toHaveLength(0);
    expect(ctx.groups).toHaveLength(0);
    expect(ctx.messageCount).toBe(0);
    api.destroy();
  });

  it('config.messages ile baslar', () => {
    const msgs = [makeMsg({ id: '1' }), makeMsg({ id: '2' })];
    const api = createChat({ messages: msgs });
    expect(api.getContext().messageCount).toBe(2);
    api.destroy();
  });

  // ── ADD_MESSAGE ──

  it('ADD_MESSAGE mesaj ekler', () => {
    const api = createChat();
    api.send({ type: 'ADD_MESSAGE', message: makeMsg({ id: '1' }) });
    expect(api.getContext().messageCount).toBe(1);
    expect(api.getContext().messages[0]?.id).toBe('1');
    api.destroy();
  });

  it('ADD_MESSAGE onMessageAdd callback cagirir', () => {
    const onMessageAdd = vi.fn();
    const api = createChat({ onMessageAdd });
    const msg = makeMsg({ id: '1' });
    api.send({ type: 'ADD_MESSAGE', message: msg });
    expect(onMessageAdd).toHaveBeenCalledWith(msg);
    api.destroy();
  });

  it('ADD_MESSAGE birden fazla mesaj eklenebilir', () => {
    const api = createChat();
    api.send({ type: 'ADD_MESSAGE', message: makeMsg({ id: '1' }) });
    api.send({ type: 'ADD_MESSAGE', message: makeMsg({ id: '2' }) });
    api.send({ type: 'ADD_MESSAGE', message: makeMsg({ id: '3' }) });
    expect(api.getContext().messageCount).toBe(3);
    api.destroy();
  });

  // ── UPDATE_MESSAGE ──

  it('UPDATE_MESSAGE mesaj icerigini gunceller', () => {
    const api = createChat({ messages: [makeMsg({ id: '1', content: 'Eski' })] });
    api.send({ type: 'UPDATE_MESSAGE', id: '1', updates: { content: 'Yeni' } });
    expect(api.getContext().messages[0]?.content).toBe('Yeni');
    api.destroy();
  });

  it('UPDATE_MESSAGE mesaj durumunu gunceller', () => {
    const onMessageStatusChange = vi.fn();
    const api = createChat({
      messages: [makeMsg({ id: '1', status: 'sent' })],
      onMessageStatusChange,
    });
    api.send({ type: 'UPDATE_MESSAGE', id: '1', updates: { status: 'delivered' } });
    expect(api.getContext().messages[0]?.status).toBe('delivered');
    expect(onMessageStatusChange).toHaveBeenCalledWith('1', 'delivered');
    api.destroy();
  });

  it('UPDATE_MESSAGE olmayan mesaj icin islem yapmaz', () => {
    const api = createChat();
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'UPDATE_MESSAGE', id: 'nonexistent', updates: { content: 'x' } });
    expect(listener).not.toHaveBeenCalled();
    api.destroy();
  });

  // ── REMOVE_MESSAGE ──

  it('REMOVE_MESSAGE mesaj siler', () => {
    const api = createChat({ messages: [makeMsg({ id: '1' }), makeMsg({ id: '2' })] });
    api.send({ type: 'REMOVE_MESSAGE', id: '1' });
    expect(api.getContext().messageCount).toBe(1);
    expect(api.getContext().messages[0]?.id).toBe('2');
    api.destroy();
  });

  it('REMOVE_MESSAGE olmayan mesaj icin islem yapmaz', () => {
    const api = createChat({ messages: [makeMsg({ id: '1' })] });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'REMOVE_MESSAGE', id: 'nonexistent' });
    expect(listener).not.toHaveBeenCalled();
    api.destroy();
  });

  // ── SET_TYPING ──

  it('SET_TYPING yazma durumunu ekler', () => {
    const api = createChat();
    api.send({ type: 'SET_TYPING', userId: 'user2' });
    expect(api.getContext().typingUsers).toContain('user2');
    api.destroy();
  });

  it('SET_TYPING ayni kullanici tekrar eklenmez', () => {
    const api = createChat();
    api.send({ type: 'SET_TYPING', userId: 'user2' });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'SET_TYPING', userId: 'user2' });
    expect(listener).not.toHaveBeenCalled();
    expect(api.getContext().typingUsers).toHaveLength(1);
    api.destroy();
  });

  // ── CLEAR_TYPING ──

  it('CLEAR_TYPING yazma durumunu kaldirir', () => {
    const api = createChat();
    api.send({ type: 'SET_TYPING', userId: 'user2' });
    api.send({ type: 'CLEAR_TYPING', userId: 'user2' });
    expect(api.getContext().typingUsers).toHaveLength(0);
    api.destroy();
  });

  it('CLEAR_TYPING olmayan kullanici icin islem yapmaz', () => {
    const api = createChat();
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'CLEAR_TYPING', userId: 'nonexistent' });
    expect(listener).not.toHaveBeenCalled();
    api.destroy();
  });

  // ── ADD_REACTION ──

  it('ADD_REACTION reaksiyon ekler', () => {
    const api = createChat({ messages: [makeMsg({ id: '1' })] });
    api.send({
      type: 'ADD_REACTION',
      messageId: '1',
      reaction: { emoji: '👍', userId: 'user2' },
    });
    const msg = api.getContext().messages[0];
    expect(msg?.reactions).toHaveLength(1);
    expect(msg?.reactions[0]?.emoji).toBe('👍');
    api.destroy();
  });

  it('ADD_REACTION ayni reaksiyon tekrar eklenmez', () => {
    const api = createChat({ messages: [makeMsg({ id: '1' })] });
    api.send({
      type: 'ADD_REACTION',
      messageId: '1',
      reaction: { emoji: '👍', userId: 'user2' },
    });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({
      type: 'ADD_REACTION',
      messageId: '1',
      reaction: { emoji: '👍', userId: 'user2' },
    });
    expect(listener).not.toHaveBeenCalled();
    api.destroy();
  });

  it('ADD_REACTION farkli emoji ayni kullanici eklenebilir', () => {
    const api = createChat({ messages: [makeMsg({ id: '1' })] });
    api.send({
      type: 'ADD_REACTION',
      messageId: '1',
      reaction: { emoji: '👍', userId: 'user2' },
    });
    api.send({
      type: 'ADD_REACTION',
      messageId: '1',
      reaction: { emoji: '❤️', userId: 'user2' },
    });
    expect(api.getContext().messages[0]?.reactions).toHaveLength(2);
    api.destroy();
  });

  // ── REMOVE_REACTION ──

  it('REMOVE_REACTION reaksiyon kaldirir', () => {
    const api = createChat({ messages: [makeMsg({ id: '1' })] });
    api.send({
      type: 'ADD_REACTION',
      messageId: '1',
      reaction: { emoji: '👍', userId: 'user2' },
    });
    api.send({
      type: 'REMOVE_REACTION',
      messageId: '1',
      emoji: '👍',
      userId: 'user2',
    });
    expect(api.getContext().messages[0]?.reactions).toHaveLength(0);
    api.destroy();
  });

  // ── SET_MESSAGES ──

  it('SET_MESSAGES tum mesajlari degistirir', () => {
    const api = createChat({ messages: [makeMsg({ id: '1' })] });
    const newMsgs = [makeMsg({ id: 'a' }), makeMsg({ id: 'b' }), makeMsg({ id: 'c' })];
    api.send({ type: 'SET_MESSAGES', messages: newMsgs });
    expect(api.getContext().messageCount).toBe(3);
    expect(api.getContext().messages[0]?.id).toBe('a');
    api.destroy();
  });

  // ── MARK_READ ──

  it('MARK_READ mesajlari okundu olarak isaretler', () => {
    const onMessageStatusChange = vi.fn();
    const api = createChat({
      messages: [
        makeMsg({ id: '1', status: 'delivered' }),
        makeMsg({ id: '2', status: 'delivered' }),
      ],
      onMessageStatusChange,
    });
    api.send({ type: 'MARK_READ', messageIds: ['1', '2'] });
    expect(api.getContext().messages[0]?.status).toBe('read');
    expect(api.getContext().messages[1]?.status).toBe('read');
    expect(onMessageStatusChange).toHaveBeenCalledTimes(2);
    api.destroy();
  });

  it('MARK_READ zaten okunmus mesajlari atlar', () => {
    const api = createChat({
      messages: [makeMsg({ id: '1', status: 'read' })],
    });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'MARK_READ', messageIds: ['1'] });
    expect(listener).not.toHaveBeenCalled();
    api.destroy();
  });

  // ── Date Grouping ──

  it('ayni gundeki mesajlar ayni grupta', () => {
    const api = createChat({
      messages: [
        makeMsg({ id: '1', timestamp: '2025-06-15T10:00:00Z' }),
        makeMsg({ id: '2', timestamp: '2025-06-15T14:00:00Z' }),
      ],
    });
    const groups = api.getContext().groups;
    expect(groups).toHaveLength(1);
    expect(groups[0]?.date).toBe('2025-06-15');
    expect(groups[0]?.messages).toHaveLength(2);
    api.destroy();
  });

  it('farkli gunlerdeki mesajlar farkli gruplarda', () => {
    const api = createChat({
      messages: [
        makeMsg({ id: '1', timestamp: '2025-06-14T10:00:00Z' }),
        makeMsg({ id: '2', timestamp: '2025-06-15T10:00:00Z' }),
      ],
    });
    const groups = api.getContext().groups;
    expect(groups).toHaveLength(2);
    api.destroy();
  });

  // ── Reply ──

  it('replyToId ile yanit mesaji eklenebilir', () => {
    const api = createChat({
      messages: [makeMsg({ id: '1', content: 'Orijinal' })],
    });
    api.send({
      type: 'ADD_MESSAGE',
      message: makeMsg({ id: '2', content: 'Yanit', replyToId: '1' }),
    });
    expect(api.getContext().messages[1]?.replyToId).toBe('1');
    api.destroy();
  });

  // ── Subscribe ──

  it('subscribe listener cagirilir', () => {
    const api = createChat();
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'ADD_MESSAGE', message: makeMsg({ id: '1' }) });
    expect(listener).toHaveBeenCalledTimes(1);
    api.destroy();
  });

  it('unsubscribe listener kaldirilir', () => {
    const api = createChat();
    const listener = vi.fn();
    const unsub = api.subscribe(listener);
    unsub();
    api.send({ type: 'ADD_MESSAGE', message: makeMsg({ id: '1' }) });
    expect(listener).not.toHaveBeenCalled();
    api.destroy();
  });

  // ── Destroy ──

  it('destroy listeners temizler', () => {
    const api = createChat();
    const listener = vi.fn();
    api.subscribe(listener);
    api.destroy();
    api.send({ type: 'ADD_MESSAGE', message: makeMsg({ id: '1' }) });
    expect(listener).not.toHaveBeenCalled();
  });

  // ── Direction ──

  it('incoming ve outgoing mesajlar ayirt edilir', () => {
    const api = createChat({
      messages: [
        makeMsg({ id: '1', direction: 'outgoing' }),
        makeMsg({ id: '2', direction: 'incoming' }),
      ],
    });
    expect(api.getContext().messages[0]?.direction).toBe('outgoing');
    expect(api.getContext().messages[1]?.direction).toBe('incoming');
    api.destroy();
  });
});

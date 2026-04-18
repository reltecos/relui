/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * EmojiPicker state machine.
 *
 * @packageDocumentation
 */

import type {
  EmojiPickerConfig, EmojiPickerContext, EmojiPickerEvent, EmojiPickerAPI,
  EmojiItem, EmojiCategory, SkinTone,
} from './emoji-picker.types';
import { EMOJI_DATA } from './emoji-data';

export function createEmojiPicker(config: EmojiPickerConfig = {}): EmojiPickerAPI {
  const {
    recentCount = 20,
    defaultCategory = 'smileys',
    defaultSkinTone = 'default',
    onSelect,
  } = config;

  let search = '';
  let activeCategory: EmojiCategory = defaultCategory;
  let skinTone: SkinTone = defaultSkinTone;
  let recentEmojis: string[] = [];
  let filteredEmojis: EmojiItem[] = EMOJI_DATA.filter((e) => e.category === activeCategory);

  const listeners = new Set<() => void>();
  function notify(): void { for (const fn of listeners) fn(); }

  function filterEmojis(): void {
    if (search.length > 0) {
      const q = search.toLowerCase();
      filteredEmojis = EMOJI_DATA.filter((e) =>
        e.name.toLowerCase().includes(q) ||
        e.keywords.some((kw) => kw.includes(q)),
      );
    } else {
      filteredEmojis = EMOJI_DATA.filter((e) => e.category === activeCategory);
    }
  }

  function getContext(): EmojiPickerContext {
    return {
      search,
      activeCategory,
      skinTone,
      recentEmojis: [...recentEmojis],
      filteredEmojis: [...filteredEmojis],
    };
  }

  function send(event: EmojiPickerEvent): void {
    switch (event.type) {
      case 'SET_SEARCH':
        search = event.search;
        filterEmojis();
        notify();
        break;
      case 'SET_CATEGORY':
        activeCategory = event.category;
        search = '';
        filterEmojis();
        notify();
        break;
      case 'SET_SKIN_TONE':
        skinTone = event.skinTone;
        notify();
        break;
      case 'SELECT_EMOJI': {
        onSelect?.(event.emoji);
        // Add to recent
        recentEmojis = [event.emoji, ...recentEmojis.filter((e) => e !== event.emoji)].slice(0, recentCount);
        notify();
        break;
      }
      case 'CLEAR_SEARCH':
        search = '';
        filterEmojis();
        notify();
        break;
      case 'CLEAR_RECENT':
        recentEmojis = [];
        notify();
        break;
    }
  }

  function subscribe(callback: () => void): () => void {
    listeners.add(callback);
    return () => { listeners.delete(callback); };
  }

  function destroy(): void { listeners.clear(); }

  function getAllEmojis(): EmojiItem[] { return [...EMOJI_DATA]; }

  function getByCategory(category: EmojiCategory): EmojiItem[] {
    return EMOJI_DATA.filter((e) => e.category === category);
  }

  return { getContext, send, subscribe, destroy, getAllEmojis, getByCategory };
}

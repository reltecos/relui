/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * EmojiPicker tipleri.
 * EmojiPicker types.
 *
 * @packageDocumentation
 */

/** Emoji kategorisi / Emoji category */
export type EmojiCategory = 'smileys' | 'people' | 'animals' | 'food' | 'travel' | 'activities' | 'objects' | 'symbols' | 'flags';

/** Skin tone / Skin tone */
export type SkinTone = 'default' | 'light' | 'medium-light' | 'medium' | 'medium-dark' | 'dark';

/** Emoji itemi / Emoji item */
export interface EmojiItem {
  /** Emoji karakteri / Emoji character */
  emoji: string;
  /** Isim / Name */
  name: string;
  /** Kategori / Category */
  category: EmojiCategory;
  /** Anahtar kelimeler / Keywords */
  keywords: string[];
}

/** EmojiPicker context */
export interface EmojiPickerContext {
  readonly search: string;
  readonly activeCategory: EmojiCategory;
  readonly skinTone: SkinTone;
  readonly recentEmojis: ReadonlyArray<string>;
  readonly filteredEmojis: ReadonlyArray<EmojiItem>;
}

/** EmojiPicker event leri */
export type EmojiPickerEvent =
  | { type: 'SET_SEARCH'; search: string }
  | { type: 'SET_CATEGORY'; category: EmojiCategory }
  | { type: 'SET_SKIN_TONE'; skinTone: SkinTone }
  | { type: 'SELECT_EMOJI'; emoji: string }
  | { type: 'CLEAR_SEARCH' }
  | { type: 'CLEAR_RECENT' };

/** EmojiPicker yapilandirmasi */
export interface EmojiPickerConfig {
  recentCount?: number;
  defaultCategory?: EmojiCategory;
  defaultSkinTone?: SkinTone;
  onSelect?: (emoji: string) => void;
}

/** EmojiPicker API */
export interface EmojiPickerAPI {
  getContext(): EmojiPickerContext;
  send(event: EmojiPickerEvent): void;
  subscribe(callback: () => void): () => void;
  destroy(): void;
  /** Tum emojileri getir / Get all emojis */
  getAllEmojis(): EmojiItem[];
  /** Kategoriye gore getir / Get by category */
  getByCategory(category: EmojiCategory): EmojiItem[];
}

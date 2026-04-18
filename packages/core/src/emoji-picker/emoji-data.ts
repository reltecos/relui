/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Built-in emoji dataset — populer ~160 emoji, 3. parti kutuphanesiz.
 *
 * @packageDocumentation
 */

import type { EmojiItem } from './emoji-picker.types';

export const EMOJI_DATA: EmojiItem[] = [
  // ── Smileys ──
  { emoji: '😀', name: 'grinning face', category: 'smileys', keywords: ['happy', 'smile'] },
  { emoji: '😃', name: 'grinning face with big eyes', category: 'smileys', keywords: ['happy'] },
  { emoji: '😄', name: 'grinning face with smiling eyes', category: 'smileys', keywords: ['happy'] },
  { emoji: '😁', name: 'beaming face', category: 'smileys', keywords: ['grin'] },
  { emoji: '😆', name: 'grinning squinting face', category: 'smileys', keywords: ['laugh'] },
  { emoji: '😅', name: 'grinning face with sweat', category: 'smileys', keywords: ['nervous'] },
  { emoji: '🤣', name: 'rolling on the floor laughing', category: 'smileys', keywords: ['lol'] },
  { emoji: '😂', name: 'face with tears of joy', category: 'smileys', keywords: ['laugh', 'cry'] },
  { emoji: '😊', name: 'smiling face with smiling eyes', category: 'smileys', keywords: ['blush'] },
  { emoji: '😇', name: 'smiling face with halo', category: 'smileys', keywords: ['angel'] },
  { emoji: '😍', name: 'smiling face with heart-eyes', category: 'smileys', keywords: ['love'] },
  { emoji: '🥰', name: 'smiling face with hearts', category: 'smileys', keywords: ['love'] },
  { emoji: '😘', name: 'face blowing a kiss', category: 'smileys', keywords: ['kiss'] },
  { emoji: '😜', name: 'winking face with tongue', category: 'smileys', keywords: ['silly'] },
  { emoji: '😎', name: 'smiling face with sunglasses', category: 'smileys', keywords: ['cool'] },
  { emoji: '🤔', name: 'thinking face', category: 'smileys', keywords: ['think', 'hmm'] },
  { emoji: '😢', name: 'crying face', category: 'smileys', keywords: ['sad', 'tear'] },
  { emoji: '😭', name: 'loudly crying face', category: 'smileys', keywords: ['sob'] },
  { emoji: '😤', name: 'face with steam from nose', category: 'smileys', keywords: ['angry'] },
  { emoji: '🥺', name: 'pleading face', category: 'smileys', keywords: ['please'] },

  // ── People ──
  { emoji: '👋', name: 'waving hand', category: 'people', keywords: ['wave', 'hello'] },
  { emoji: '👍', name: 'thumbs up', category: 'people', keywords: ['like', 'approve'] },
  { emoji: '👎', name: 'thumbs down', category: 'people', keywords: ['dislike'] },
  { emoji: '👏', name: 'clapping hands', category: 'people', keywords: ['clap', 'bravo'] },
  { emoji: '🙌', name: 'raising hands', category: 'people', keywords: ['hooray'] },
  { emoji: '🤝', name: 'handshake', category: 'people', keywords: ['deal', 'agree'] },
  { emoji: '💪', name: 'flexed biceps', category: 'people', keywords: ['strong', 'muscle'] },
  { emoji: '🙏', name: 'folded hands', category: 'people', keywords: ['pray', 'please'] },
  { emoji: '✌️', name: 'victory hand', category: 'people', keywords: ['peace'] },
  { emoji: '👀', name: 'eyes', category: 'people', keywords: ['look', 'see'] },

  // ── Animals ──
  { emoji: '🐶', name: 'dog face', category: 'animals', keywords: ['dog', 'puppy'] },
  { emoji: '🐱', name: 'cat face', category: 'animals', keywords: ['cat', 'kitten'] },
  { emoji: '🐭', name: 'mouse face', category: 'animals', keywords: ['mouse'] },
  { emoji: '🦊', name: 'fox', category: 'animals', keywords: ['fox'] },
  { emoji: '🐻', name: 'bear', category: 'animals', keywords: ['bear'] },
  { emoji: '🐼', name: 'panda', category: 'animals', keywords: ['panda'] },
  { emoji: '🦁', name: 'lion', category: 'animals', keywords: ['lion'] },
  { emoji: '🐸', name: 'frog', category: 'animals', keywords: ['frog'] },
  { emoji: '🦋', name: 'butterfly', category: 'animals', keywords: ['butterfly'] },
  { emoji: '🐝', name: 'honeybee', category: 'animals', keywords: ['bee'] },

  // ── Food ──
  { emoji: '🍎', name: 'red apple', category: 'food', keywords: ['apple', 'fruit'] },
  { emoji: '🍕', name: 'pizza', category: 'food', keywords: ['pizza'] },
  { emoji: '🍔', name: 'hamburger', category: 'food', keywords: ['burger'] },
  { emoji: '🍟', name: 'french fries', category: 'food', keywords: ['fries'] },
  { emoji: '🍦', name: 'ice cream', category: 'food', keywords: ['icecream', 'dessert'] },
  { emoji: '🍩', name: 'doughnut', category: 'food', keywords: ['donut'] },
  { emoji: '🍰', name: 'shortcake', category: 'food', keywords: ['cake'] },
  { emoji: '☕', name: 'hot beverage', category: 'food', keywords: ['coffee', 'tea'] },
  { emoji: '🍺', name: 'beer mug', category: 'food', keywords: ['beer'] },
  { emoji: '🥤', name: 'cup with straw', category: 'food', keywords: ['drink', 'soda'] },

  // ── Travel ──
  { emoji: '🚗', name: 'automobile', category: 'travel', keywords: ['car'] },
  { emoji: '✈️', name: 'airplane', category: 'travel', keywords: ['plane', 'flight'] },
  { emoji: '🚀', name: 'rocket', category: 'travel', keywords: ['rocket', 'launch'] },
  { emoji: '🏠', name: 'house', category: 'travel', keywords: ['home'] },
  { emoji: '🌍', name: 'globe', category: 'travel', keywords: ['earth', 'world'] },
  { emoji: '⛰️', name: 'mountain', category: 'travel', keywords: ['mountain'] },
  { emoji: '🏖️', name: 'beach', category: 'travel', keywords: ['beach', 'vacation'] },
  { emoji: '🌅', name: 'sunrise', category: 'travel', keywords: ['sunrise', 'morning'] },
  { emoji: '🗺️', name: 'world map', category: 'travel', keywords: ['map'] },
  { emoji: '🚂', name: 'locomotive', category: 'travel', keywords: ['train'] },

  // ── Activities ──
  { emoji: '⚽', name: 'soccer ball', category: 'activities', keywords: ['soccer', 'football'] },
  { emoji: '🏀', name: 'basketball', category: 'activities', keywords: ['basketball'] },
  { emoji: '🎮', name: 'video game', category: 'activities', keywords: ['game', 'controller'] },
  { emoji: '🎯', name: 'direct hit', category: 'activities', keywords: ['target', 'bullseye'] },
  { emoji: '🎵', name: 'musical note', category: 'activities', keywords: ['music'] },
  { emoji: '🎬', name: 'clapper board', category: 'activities', keywords: ['movie', 'film'] },
  { emoji: '🎨', name: 'artist palette', category: 'activities', keywords: ['art', 'paint'] },
  { emoji: '📚', name: 'books', category: 'activities', keywords: ['book', 'read'] },
  { emoji: '🏆', name: 'trophy', category: 'activities', keywords: ['trophy', 'winner'] },
  { emoji: '🎉', name: 'party popper', category: 'activities', keywords: ['party', 'celebrate'] },

  // ── Objects ──
  { emoji: '💡', name: 'light bulb', category: 'objects', keywords: ['idea', 'light'] },
  { emoji: '💻', name: 'laptop', category: 'objects', keywords: ['computer', 'laptop'] },
  { emoji: '📱', name: 'mobile phone', category: 'objects', keywords: ['phone', 'mobile'] },
  { emoji: '⌚', name: 'watch', category: 'objects', keywords: ['watch', 'time'] },
  { emoji: '📷', name: 'camera', category: 'objects', keywords: ['camera', 'photo'] },
  { emoji: '🔑', name: 'key', category: 'objects', keywords: ['key'] },
  { emoji: '🔒', name: 'locked', category: 'objects', keywords: ['lock', 'secure'] },
  { emoji: '💰', name: 'money bag', category: 'objects', keywords: ['money', 'rich'] },
  { emoji: '📧', name: 'e-mail', category: 'objects', keywords: ['email', 'mail'] },
  { emoji: '🔔', name: 'bell', category: 'objects', keywords: ['bell', 'notification'] },

  // ── Symbols ──
  { emoji: '❤️', name: 'red heart', category: 'symbols', keywords: ['heart', 'love'] },
  { emoji: '💔', name: 'broken heart', category: 'symbols', keywords: ['heartbreak'] },
  { emoji: '⭐', name: 'star', category: 'symbols', keywords: ['star'] },
  { emoji: '🔥', name: 'fire', category: 'symbols', keywords: ['fire', 'hot'] },
  { emoji: '✅', name: 'check mark', category: 'symbols', keywords: ['check', 'done'] },
  { emoji: '❌', name: 'cross mark', category: 'symbols', keywords: ['no', 'wrong'] },
  { emoji: '⚠️', name: 'warning', category: 'symbols', keywords: ['warning', 'caution'] },
  { emoji: '💯', name: 'hundred points', category: 'symbols', keywords: ['perfect', '100'] },
  { emoji: '♻️', name: 'recycling symbol', category: 'symbols', keywords: ['recycle'] },
  { emoji: '🏳️', name: 'white flag', category: 'symbols', keywords: ['flag', 'surrender'] },

  // ── Flags ──
  { emoji: '🇹🇷', name: 'Turkey', category: 'flags', keywords: ['turkey', 'tr'] },
  { emoji: '🇺🇸', name: 'United States', category: 'flags', keywords: ['usa', 'us'] },
  { emoji: '🇬🇧', name: 'United Kingdom', category: 'flags', keywords: ['uk', 'gb'] },
  { emoji: '🇩🇪', name: 'Germany', category: 'flags', keywords: ['germany', 'de'] },
  { emoji: '🇫🇷', name: 'France', category: 'flags', keywords: ['france', 'fr'] },
  { emoji: '🇯🇵', name: 'Japan', category: 'flags', keywords: ['japan', 'jp'] },
  { emoji: '🇰🇷', name: 'South Korea', category: 'flags', keywords: ['korea', 'kr'] },
  { emoji: '🇧🇷', name: 'Brazil', category: 'flags', keywords: ['brazil', 'br'] },
  { emoji: '🇮🇹', name: 'Italy', category: 'flags', keywords: ['italy', 'it'] },
  { emoji: '🇪🇸', name: 'Spain', category: 'flags', keywords: ['spain', 'es'] },
];

/** Skin tone modifierlari / Skin tone modifiers */
export const SKIN_TONE_MODIFIERS: Record<string, string> = {
  'default': '',
  'light': '\u{1F3FB}',
  'medium-light': '\u{1F3FC}',
  'medium': '\u{1F3FD}',
  'medium-dark': '\u{1F3FE}',
  'dark': '\u{1F3FF}',
};

/** Kategori etiketleri / Category labels */
export const CATEGORY_LABELS: Record<string, string> = {
  smileys: '😀 Smileys',
  people: '👋 People',
  animals: '🐶 Animals',
  food: '🍎 Food',
  travel: '🚗 Travel',
  activities: '⚽ Activities',
  objects: '💡 Objects',
  symbols: '❤️ Symbols',
  flags: '🏳️ Flags',
};

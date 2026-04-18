/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * EmojiPicker — emoji secim paneli bilesen (Dual API).
 * EmojiPicker — emoji picker panel component (Dual API).
 *
 * Props-based: `<EmojiPicker onSelect={fn} />`
 * Compound:    `<EmojiPicker><EmojiPicker.Search /><EmojiPicker.Categories /><EmojiPicker.Grid /></EmojiPicker>`
 *
 * @packageDocumentation
 */

import { forwardRef, type ReactNode } from 'react';
import { CATEGORY_LABELS, type EmojiCategory, type SkinTone } from '@relteco/relui-core';
import {
  rootStyle, searchStyle, searchInputStyle, categoriesStyle, categoryButtonStyle,
  categoryActiveStyle, gridStyle, emojiStyle, skinToneStyle, skinToneButtonStyle,
  skinToneActiveStyle, recentStyle,
} from './emoji-picker.css';
import { EmojiPickerCtx, useEmojiPickerContext, type EmojiPickerContextValue } from './emoji-picker-context';
import { useEmojiPicker, type UseEmojiPickerProps } from './useEmojiPicker';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

export type EmojiPickerSlot = 'root' | 'search' | 'categories' | 'grid' | 'emoji' | 'skinToneSelector' | 'recent';

// ── Category keys ───────────────────────────────────

const ALL_CATEGORIES: EmojiCategory[] = ['smileys', 'people', 'animals', 'food', 'travel', 'activities', 'objects', 'symbols', 'flags'];

// ── Skin tone colors ────────────────────────────────

const SKIN_COLORS: Record<SkinTone, string> = {
  'default': 'var(--rel-color-skin-default, #fbbf24)',
  'light': 'var(--rel-color-skin-light, #fde68a)',
  'medium-light': 'var(--rel-color-skin-medium-light, #f5deb3)',
  'medium': 'var(--rel-color-skin-medium, #deb887)',
  'medium-dark': 'var(--rel-color-skin-medium-dark, #c49a6c)',
  'dark': 'var(--rel-color-skin-dark, #8b6f47)',
};

// ── Sub: EmojiPicker.Search ─────────────────────────

export interface EmojiPickerSearchProps { className?: string; placeholder?: string; }

export const EmojiPickerSearch = forwardRef<HTMLDivElement, EmojiPickerSearchProps>(
  function EmojiPickerSearch(props, ref) {
    const { className, placeholder = 'Search emoji...' } = props;
    const epCtx = useEmojiPickerContext();
    const slot = getSlotProps('search', searchStyle, epCtx.classNames, epCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="emoji-picker-search">
        <input
          className={searchInputStyle}
          type="text"
          value={epCtx.ctx.search}
          onChange={(e) => epCtx.api.send({ type: 'SET_SEARCH', search: e.target.value })}
          placeholder={placeholder}
          data-testid="emoji-picker-search-input"
          aria-label="Search emoji"
        />
      </div>
    );
  },
);

// ── Sub: EmojiPicker.Categories ─────────────────────

export interface EmojiPickerCategoriesProps { className?: string; }

export const EmojiPickerCategories = forwardRef<HTMLDivElement, EmojiPickerCategoriesProps>(
  function EmojiPickerCategories(props, ref) {
    const { className } = props;
    const epCtx = useEmojiPickerContext();
    const slot = getSlotProps('categories', categoriesStyle, epCtx.classNames, epCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="emoji-picker-categories" role="tablist" aria-label="Emoji categories">
        {ALL_CATEGORIES.map((cat) => {
          const isActive = epCtx.ctx.activeCategory === cat;
          const label = CATEGORY_LABELS[cat] ?? cat;
          const icon = label.split(' ')[0] ?? cat;
          return (
            <button
              key={cat}
              className={isActive ? `${categoryButtonStyle} ${categoryActiveStyle}` : categoryButtonStyle}
              onClick={() => epCtx.api.send({ type: 'SET_CATEGORY', category: cat })}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={cat}
              data-testid="emoji-picker-category"
              title={cat}
            >
              {icon}
            </button>
          );
        })}
      </div>
    );
  },
);

// ── Sub: EmojiPicker.Grid ───────────────────────────

export interface EmojiPickerGridProps { className?: string; }

export const EmojiPickerGrid = forwardRef<HTMLDivElement, EmojiPickerGridProps>(
  function EmojiPickerGrid(props, ref) {
    const { className } = props;
    const epCtx = useEmojiPickerContext();
    const slot = getSlotProps('grid', gridStyle, epCtx.classNames, epCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const eSlot = getSlotProps('emoji', emojiStyle, epCtx.classNames, epCtx.styles);

    return (
      <div
        ref={ref}
        className={cls}
        style={{ ...slot.style, gridTemplateColumns: `repeat(${epCtx.columns}, 1fr)` }}
        data-testid="emoji-picker-grid"
        role="grid"
        aria-label="Emoji grid"
      >
        {epCtx.ctx.filteredEmojis.map((item) => (
          <button
            key={item.emoji}
            className={eSlot.className}
            style={eSlot.style}
            onClick={() => epCtx.api.send({ type: 'SELECT_EMOJI', emoji: item.emoji })}
            type="button"
            data-testid="emoji-picker-emoji"
            title={item.name}
            aria-label={item.name}
          >
            {item.emoji}
          </button>
        ))}
        {epCtx.ctx.filteredEmojis.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 16, color: 'var(--rel-color-text-muted, #9ca3af)', fontSize: 'var(--rel-text-xs, 12px)' }} data-testid="emoji-picker-empty">
            Emoji bulunamadi
          </div>
        )}
      </div>
    );
  },
);

// ── Sub: EmojiPicker.SkinToneSelector ────────────────

export interface EmojiPickerSkinToneSelectorProps { className?: string; }

export const EmojiPickerSkinToneSelector = forwardRef<HTMLDivElement, EmojiPickerSkinToneSelectorProps>(
  function EmojiPickerSkinToneSelector(props, ref) {
    const { className } = props;
    const epCtx = useEmojiPickerContext();
    const slot = getSlotProps('skinToneSelector', skinToneStyle, epCtx.classNames, epCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const tones: SkinTone[] = ['default', 'light', 'medium-light', 'medium', 'medium-dark', 'dark'];

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="emoji-picker-skin-tone" role="radiogroup" aria-label="Skin tone">
        {tones.map((tone) => {
          const isActive = epCtx.ctx.skinTone === tone;
          return (
            <button
              key={tone}
              className={isActive ? `${skinToneButtonStyle} ${skinToneActiveStyle}` : skinToneButtonStyle}
              style={{ backgroundColor: SKIN_COLORS[tone] }}
              onClick={() => epCtx.api.send({ type: 'SET_SKIN_TONE', skinTone: tone })}
              type="button"
              role="radio"
              aria-checked={isActive}
              aria-label={`Skin tone: ${tone}`}
              data-testid="emoji-picker-skin-tone-btn"
            />
          );
        })}
      </div>
    );
  },
);

// ── Component Props ──────────────────────────────────

export interface EmojiPickerComponentProps extends SlotStyleProps<EmojiPickerSlot> {
  /** Secim callback / On select */
  onSelect?: (emoji: string) => void;
  /** Son kullanilan sayisi / Recent emoji count */
  recentCount?: number;
  /** Varsayilan kategori / Default category */
  defaultCategory?: EmojiCategory;
  /** Varsayilan skin tone / Default skin tone */
  defaultSkinTone?: SkinTone;
  /** Grid sutun sayisi / Grid columns */
  columns?: number;
  /** Skin tone secici goster / Show skin tone selector */
  showSkinTone?: boolean;
  /** Compound children */
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// ── Component ────────────────────────────────────────

export const EmojiPickerBase = forwardRef<HTMLDivElement, EmojiPickerComponentProps>(
  function EmojiPicker(props, ref) {
    const {
      onSelect, recentCount, defaultCategory, defaultSkinTone,
      columns = 8, showSkinTone = false,
      children, className, style: styleProp, classNames, styles,
    } = props;

    const hookProps: UseEmojiPickerProps = { recentCount, defaultCategory, defaultSkinTone, onSelect };
    const { api, ctx } = useEmojiPicker(hookProps);

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootCls = className ? `${rootSlot.className} ${className}` : rootSlot.className;
    const ctxValue: EmojiPickerContextValue = { api, ctx, columns, classNames, styles };

    if (children) {
      return (
        <EmojiPickerCtx.Provider value={ctxValue}>
          <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="emoji-picker-root">{children}</div>
        </EmojiPickerCtx.Provider>
      );
    }

    const rSlot = getSlotProps('recent', recentStyle, classNames, styles);

    return (
      <EmojiPickerCtx.Provider value={ctxValue}>
        <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="emoji-picker-root">
          <EmojiPickerSearch />
          <EmojiPickerCategories />
          {ctx.recentEmojis.length > 0 && (
            <div className={rSlot.className} style={rSlot.style} data-testid="emoji-picker-recent">
              Recent: {ctx.recentEmojis.map((e) => (
                <button
                  key={e}
                  className={emojiStyle}
                  onClick={() => api.send({ type: 'SELECT_EMOJI', emoji: e })}
                  type="button"
                  style={{ display: 'inline-flex', width: 24, height: 24, fontSize: 14 }}
                >
                  {e}
                </button>
              ))}
            </div>
          )}
          <EmojiPickerGrid />
          {showSkinTone && <EmojiPickerSkinToneSelector />}
        </div>
      </EmojiPickerCtx.Provider>
    );
  },
);

/**
 * EmojiPicker bilesen — Dual API (props-based + compound).
 */
export const EmojiPicker = Object.assign(EmojiPickerBase, {
  Search: EmojiPickerSearch,
  Categories: EmojiPickerCategories,
  Grid: EmojiPickerGrid,
  SkinToneSelector: EmojiPickerSkinToneSelector,
});

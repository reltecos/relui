/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Mention — @ etiketleme bilesen (Dual API).
 * Mention — @ mention component (Dual API).
 *
 * Props-based: `<Mention trigger="@" items={items} onSelect={fn} />`
 * Compound:    `<Mention trigger="@" items={items}><Mention.Input /><Mention.List /></Mention>`
 *
 * @packageDocumentation
 */

import { forwardRef, useCallback, type ReactNode } from 'react';
import type { MentionItem } from '@relteco/relui-core';
import { rootStyle, inputStyle, listStyle, itemStyle, highlightedStyle } from './mention.css';
import { MentionCtx, useMentionContext, type MentionContextValue } from './mention-context';
import { useMention, type UseMentionProps } from './useMention';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

export type MentionSlot = 'root' | 'input' | 'list' | 'item' | 'highlighted';

// ── Sub: Mention.Input ──────────────────────────────

export interface MentionInputProps { className?: string; placeholder?: string; }

export const MentionInput = forwardRef<HTMLInputElement, MentionInputProps>(
  function MentionInput(props, ref) {
    const { className, placeholder } = props;
    const mCtx = useMentionContext();
    const slot = getSlotProps('input', inputStyle, mCtx.classNames, mCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      const lastTrigger = val.lastIndexOf(mCtx.trigger);
      if (lastTrigger !== -1) {
        const query = val.slice(lastTrigger + 1);
        if (!mCtx.ctx.isOpen) {
          mCtx.api.send({ type: 'OPEN', triggerPosition: lastTrigger });
        }
        mCtx.api.send({ type: 'SET_QUERY', query });
      } else if (mCtx.ctx.isOpen) {
        mCtx.api.send({ type: 'CLOSE' });
      }
    }, [mCtx]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      if (!mCtx.ctx.isOpen) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); mCtx.api.send({ type: 'HIGHLIGHT_NEXT' }); }
      if (e.key === 'ArrowUp') { e.preventDefault(); mCtx.api.send({ type: 'HIGHLIGHT_PREV' }); }
      if (e.key === 'Enter') { e.preventDefault(); mCtx.api.send({ type: 'SELECT_ITEM' }); }
      if (e.key === 'Escape') { mCtx.api.send({ type: 'CLOSE' }); }
    }, [mCtx]);

    return (
      <input
        ref={ref}
        className={cls}
        style={slot.style}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        data-testid="mention-input"
        role="combobox"
        aria-expanded={mCtx.ctx.isOpen}
        aria-autocomplete="list"
        aria-haspopup="listbox"
      />
    );
  },
);

// ── Sub: Mention.List ───────────────────────────────

export interface MentionListProps { children?: ReactNode; className?: string; }

export const MentionList = forwardRef<HTMLUListElement, MentionListProps>(
  function MentionList(props, ref) {
    const { children, className } = props;
    const mCtx = useMentionContext();
    const slot = getSlotProps('list', listStyle, mCtx.classNames, mCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    if (!mCtx.ctx.isOpen) return null;

    if (children) {
      return <ul ref={ref} className={cls} style={slot.style} data-testid="mention-list" role="listbox">{children}</ul>;
    }

    const iSlot = getSlotProps('item', itemStyle, mCtx.classNames, mCtx.styles);

    return (
      <ul ref={ref} className={cls} style={slot.style} data-testid="mention-list" role="listbox">
        {mCtx.ctx.filteredItems.map((item, i) => {
          const isHl = i === mCtx.ctx.highlightedIndex;
          const iCls = isHl ? `${iSlot.className} ${highlightedStyle}` : iSlot.className;
          return (
            <li
              key={item.id}
              className={iCls}
              style={iSlot.style}
              data-testid="mention-item"
              data-highlighted={isHl || undefined}
              role="option"
              aria-selected={isHl}
              onClick={() => mCtx.api.send({ type: 'SELECT_ITEM', index: i })}
            >
              {item.label}
            </li>
          );
        })}
      </ul>
    );
  },
);

// ── Sub: Mention.Item ───────────────────────────────

export interface MentionItemProps { children?: ReactNode; className?: string; }

export const MentionItemComponent = forwardRef<HTMLLIElement, MentionItemProps>(
  function MentionItem(props, ref) {
    const { children, className } = props;
    const mCtx = useMentionContext();
    const slot = getSlotProps('item', itemStyle, mCtx.classNames, mCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return <li ref={ref} className={cls} style={slot.style} data-testid="mention-item" role="option">{children}</li>;
  },
);

// ── Component Props ──────────────────────────────────

export interface MentionComponentProps extends SlotStyleProps<MentionSlot> {
  /** Trigger karakter / Trigger character */
  trigger?: string;
  /** Oneri listesi / Suggestion items */
  items?: MentionItem[];
  /** Placeholder */
  placeholder?: string;
  /** Secim callback / On select */
  onSelect?: (item: MentionItem) => void;
  /** Compound children */
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// ── Component ────────────────────────────────────────

export const MentionBase = forwardRef<HTMLDivElement, MentionComponentProps>(
  function Mention(props, ref) {
    const {
      trigger = '@', items, placeholder, onSelect,
      children, className, style: styleProp, classNames, styles,
    } = props;

    const hookProps: UseMentionProps = { items, onSelect };
    const { api, ctx } = useMention(hookProps);

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootCls = className ? `${rootSlot.className} ${className}` : rootSlot.className;
    const ctxValue: MentionContextValue = { api, ctx, trigger, classNames, styles };

    if (children) {
      return (
        <MentionCtx.Provider value={ctxValue}>
          <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="mention-root">{children}</div>
        </MentionCtx.Provider>
      );
    }

    return (
      <MentionCtx.Provider value={ctxValue}>
        <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="mention-root">
          <MentionInput placeholder={placeholder} />
          <MentionList />
        </div>
      </MentionCtx.Provider>
    );
  },
);

/**
 * Mention bilesen — Dual API (props-based + compound).
 */
export const Mention = Object.assign(MentionBase, {
  Input: MentionInput,
  List: MentionList,
  Item: MentionItemComponent,
});

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Lookup — sunucu tarafli arama bilesen (Dual API).
 * Lookup — server-side search component (Dual API).
 *
 * Props-based: `<Lookup onSearch={fn} onSelect={fn} />`
 * Compound:    `<Lookup onSearch={fn}><Lookup.Input /><Lookup.List /></Lookup>`
 *
 * @packageDocumentation
 */

import { forwardRef, useCallback, type ReactNode } from 'react';
import type { LookupItem } from '@relteco/relui-core';
import {
  rootStyle, inputStyle, listStyle, itemStyle, highlightedItemStyle,
  loadingStyle, emptyStyle,
} from './lookup.css';
import { LookupCtx, useLookupContext, type LookupContextValue } from './lookup-context';
import { useLookup, type UseLookupProps } from './useLookup';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

export type LookupSlot = 'root' | 'input' | 'list' | 'item' | 'loading';

// ── Sub: Lookup.Input ───────────────────────────────

export interface LookupInputProps { className?: string; placeholder?: string; }

export const LookupInput = forwardRef<HTMLInputElement, LookupInputProps>(
  function LookupInput(props, ref) {
    const { className, placeholder = 'Search...' } = props;
    const lCtx = useLookupContext();
    const slot = getSlotProps('input', inputStyle, lCtx.classNames, lCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      if (!lCtx.ctx.isOpen) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); lCtx.api.send({ type: 'HIGHLIGHT_NEXT' }); }
      if (e.key === 'ArrowUp') { e.preventDefault(); lCtx.api.send({ type: 'HIGHLIGHT_PREV' }); }
      if (e.key === 'Enter') { e.preventDefault(); lCtx.api.send({ type: 'SELECT_ITEM' }); }
      if (e.key === 'Escape') { lCtx.api.send({ type: 'CLOSE' }); }
    }, [lCtx]);

    return (
      <input
        ref={ref}
        className={cls}
        style={slot.style}
        type="text"
        value={lCtx.ctx.query}
        onChange={(e) => {
          // handleQueryChange is set by parent — we use api directly
          lCtx.api.send({ type: 'SET_QUERY', query: e.target.value });
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => { if (lCtx.ctx.query.length > 0) lCtx.api.send({ type: 'OPEN' }); }}
        placeholder={placeholder}
        data-testid="lookup-input"
        role="combobox"
        aria-expanded={lCtx.ctx.isOpen}
        aria-autocomplete="list"
        aria-haspopup="listbox"
      />
    );
  },
);

// ── Sub: Lookup.List ────────────────────────────────

export interface LookupListProps { children?: ReactNode; className?: string; }

export const LookupList = forwardRef<HTMLUListElement, LookupListProps>(
  function LookupList(props, ref) {
    const { children, className } = props;
    const lCtx = useLookupContext();
    const slot = getSlotProps('list', listStyle, lCtx.classNames, lCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    if (!lCtx.ctx.isOpen) return null;

    if (lCtx.ctx.isLoading) {
      const ldSlot = getSlotProps('loading', loadingStyle, lCtx.classNames, lCtx.styles);
      return (
        <div className={ldSlot.className} style={ldSlot.style} data-testid="lookup-loading">
          Loading...
        </div>
      );
    }

    if (children) {
      return <ul ref={ref} className={cls} style={slot.style} data-testid="lookup-list" role="listbox">{children}</ul>;
    }

    if (lCtx.ctx.items.length === 0) {
      return <div className={emptyStyle} data-testid="lookup-empty">No results</div>;
    }

    const iSlot = getSlotProps('item', itemStyle, lCtx.classNames, lCtx.styles);

    return (
      <ul ref={ref} className={cls} style={slot.style} data-testid="lookup-list" role="listbox">
        {lCtx.ctx.items.map((item, i) => {
          const isHl = i === lCtx.ctx.highlightedIndex;
          const iCls = isHl ? `${iSlot.className} ${highlightedItemStyle}` : iSlot.className;
          return (
            <li
              key={item.id}
              className={iCls}
              style={iSlot.style}
              data-testid="lookup-item"
              data-highlighted={isHl || undefined}
              role="option"
              aria-selected={isHl}
              onClick={() => lCtx.api.send({ type: 'SELECT_ITEM', index: i })}
            >
              {item.label}
            </li>
          );
        })}
      </ul>
    );
  },
);

// ── Sub: Lookup.Item ────────────────────────────────

export interface LookupItemProps { children?: ReactNode; className?: string; }

export const LookupItemComponent = forwardRef<HTMLLIElement, LookupItemProps>(
  function LookupItem(props, ref) {
    const { children, className } = props;
    const lCtx = useLookupContext();
    const slot = getSlotProps('item', itemStyle, lCtx.classNames, lCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return <li ref={ref} className={cls} style={slot.style} data-testid="lookup-item" role="option">{children}</li>;
  },
);

// ── Component Props ──────────────────────────────────

export interface LookupComponentProps extends SlotStyleProps<LookupSlot> {
  /** Async arama fonksiyonu / Async search function */
  onSearch?: (query: string) => Promise<LookupItem[]>;
  /** Secim callback / On select */
  onSelect?: (item: LookupItem) => void;
  /** Debounce suresi (ms) / Debounce delay */
  debounce?: number;
  /** Minimum karakter / Minimum chars */
  minChars?: number;
  /** Placeholder */
  placeholder?: string;
  /** Compound children */
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// ── Component ────────────────────────────────────────

export const LookupBase = forwardRef<HTMLDivElement, LookupComponentProps>(
  function Lookup(props, ref) {
    const {
      onSearch, onSelect, debounce = 300, minChars = 1, placeholder,
      children, className, style: styleProp, classNames, styles,
    } = props;

    const hookProps: UseLookupProps = { onSearch, onSelect, debounce, minChars };
    const { api, ctx, handleQueryChange } = useLookup(hookProps);

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootCls = className ? `${rootSlot.className} ${className}` : rootSlot.className;
    const ctxValue: LookupContextValue = { api, ctx, classNames, styles };

    if (children) {
      return (
        <LookupCtx.Provider value={ctxValue}>
          <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="lookup-root">{children}</div>
        </LookupCtx.Provider>
      );
    }

    // Props-based: override input onChange to use debounced search
    const inputSlot = getSlotProps('input', inputStyle, classNames, styles);

    return (
      <LookupCtx.Provider value={ctxValue}>
        <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="lookup-root">
          <input
            className={inputSlot.className}
            style={inputSlot.style}
            type="text"
            value={ctx.query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={(e) => {
              if (!ctx.isOpen) return;
              if (e.key === 'ArrowDown') { e.preventDefault(); api.send({ type: 'HIGHLIGHT_NEXT' }); }
              if (e.key === 'ArrowUp') { e.preventDefault(); api.send({ type: 'HIGHLIGHT_PREV' }); }
              if (e.key === 'Enter') { e.preventDefault(); api.send({ type: 'SELECT_ITEM' }); }
              if (e.key === 'Escape') { api.send({ type: 'CLOSE' }); }
            }}
            onFocus={() => { if (ctx.query.length >= minChars) api.send({ type: 'OPEN' }); }}
            placeholder={placeholder ?? 'Search...'}
            data-testid="lookup-input"
            role="combobox"
            aria-expanded={ctx.isOpen}
            aria-autocomplete="list"
            aria-haspopup="listbox"
          />
          <LookupList />
        </div>
      </LookupCtx.Provider>
    );
  },
);

/**
 * Lookup bilesen — Dual API (props-based + compound).
 */
export const Lookup = Object.assign(LookupBase, {
  Input: LookupInput,
  List: LookupList,
  Item: LookupItemComponent,
});

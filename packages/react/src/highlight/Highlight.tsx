/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Highlight — metin vurgulama bilesen (Dual API).
 * Highlight — text highlight component (Dual API).
 *
 * Props-based: `<Highlight text="hello world" terms="world" />`
 * Compound:    `<Highlight text="hello world" terms="world"><Highlight.Mark /><Highlight.Text /></Highlight>`
 *
 * @packageDocumentation
 */

import { forwardRef, useMemo, type ReactNode } from 'react';
import { highlightText } from '@relteco/relui-core';
import { rootStyle, markStyle, textStyle } from './highlight.css';
import { HighlightCtx, useHighlightContext } from './highlight-context';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

export type HighlightSlot = 'root' | 'mark' | 'text';

// ── Sub: Highlight.Mark ─────────────────────────────

export interface HighlightMarkProps { children?: ReactNode; className?: string; }

export const HighlightMark = forwardRef<HTMLElement, HighlightMarkProps>(
  function HighlightMark(props, ref) {
    const { children, className } = props;
    const ctx = useHighlightContext();
    const slot = getSlotProps('mark', markStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return <mark ref={ref} className={cls} style={slot.style} data-testid="highlight-mark">{children}</mark>;
  },
);

// ── Sub: Highlight.Text ─────────────────────────────

export interface HighlightTextProps { children?: ReactNode; className?: string; }

export const HighlightText = forwardRef<HTMLSpanElement, HighlightTextProps>(
  function HighlightText(props, ref) {
    const { children, className } = props;
    const ctx = useHighlightContext();
    const slot = getSlotProps('text', textStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return <span ref={ref} className={cls} style={slot.style} data-testid="highlight-text">{children}</span>;
  },
);

// ── Component Props ──────────────────────────────────

export interface HighlightComponentProps extends SlotStyleProps<HighlightSlot> {
  /** Metin / Text */
  text: string;
  /** Aranacak terimler / Search terms */
  terms: string | string[];
  /** Buyuk-kucuk harf duyarli / Case sensitive */
  caseSensitive?: boolean;
  /** Compound children */
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// ── Component ────────────────────────────────────────

export const HighlightBase = forwardRef<HTMLSpanElement, HighlightComponentProps>(
  function Highlight(props, ref) {
    const {
      text, terms, caseSensitive = false,
      children, className, style: styleProp, classNames, styles,
    } = props;

    const result = useMemo(() => highlightText(text, terms, caseSensitive), [text, terms, caseSensitive]);
    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootCls = className ? `${rootSlot.className} ${className}` : rootSlot.className;
    const ctxValue = { result, classNames, styles };

    if (children) {
      return (
        <HighlightCtx.Provider value={ctxValue}>
          <span ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="highlight-root">{children}</span>
        </HighlightCtx.Provider>
      );
    }

    const mSlot = getSlotProps('mark', markStyle, classNames, styles);
    const tSlot = getSlotProps('text', textStyle, classNames, styles);

    return (
      <HighlightCtx.Provider value={ctxValue}>
        <span ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="highlight-root">
          {result.segments.map((seg, i) =>
            seg.type === 'match' ? (
              <mark key={i} className={mSlot.className} style={mSlot.style} data-testid="highlight-mark">{seg.value}</mark>
            ) : (
              <span key={i} className={tSlot.className} style={tSlot.style} data-testid="highlight-text">{seg.value}</span>
            ),
          )}
        </span>
      </HighlightCtx.Provider>
    );
  },
);

/**
 * Highlight bilesen — Dual API (props-based + compound).
 */
export const Highlight = Object.assign(HighlightBase, {
  Mark: HighlightMark,
  Text: HighlightText,
});

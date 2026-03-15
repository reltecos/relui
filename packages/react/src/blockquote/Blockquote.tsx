/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Blockquote — alinti blogu bilesen (Dual API).
 * Blockquote — quotation block component (Dual API).
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext } from 'react';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';
import {
  blockquoteRootStyle,
  blockquoteVariantStyles,
  blockquoteIconStyle,
  blockquoteContentStyle,
  blockquoteCiteStyle,
} from './blockquote.css';

// ── Slot ──────────────────────────────────────────────

/** Blockquote slot isimleri / Blockquote slot names. */
export type BlockquoteSlot = 'root' | 'icon' | 'content' | 'cite';

// ── Types ─────────────────────────────────────────────

/** Blockquote varyantlari / Blockquote variants */
export type BlockquoteVariant = 'default' | 'bordered';

// ── Context ───────────────────────────────────────────

interface BlockquoteContextValue {
  classNames: ClassNames<BlockquoteSlot> | undefined;
  styles: Styles<BlockquoteSlot> | undefined;
}

const BlockquoteContext = createContext<BlockquoteContextValue | null>(null);

function useBlockquoteContext(): BlockquoteContextValue {
  const ctx = useContext(BlockquoteContext);
  if (!ctx) {
    throw new Error('Blockquote sub-components must be used within <Blockquote>');
  }
  return ctx;
}

// ── Component Props ───────────────────────────────────

export interface BlockquoteComponentProps extends SlotStyleProps<BlockquoteSlot> {
  /** Gorunsel varyant / Visual variant */
  variant?: BlockquoteVariant;
  /** Alinti metni (props-based) / Quote text (props-based) */
  children?: React.ReactNode;
  /** Kaynak kisi/metin (props-based) / Citation source (props-based) */
  cite?: React.ReactNode;
  /** Sol ikon (props-based) / Left icon (props-based) */
  icon?: React.ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Content Sub-component ─────────────────────────────

export interface BlockquoteContentProps {
  /** Alinti metni / Quote text */
  children?: React.ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

const BlockquoteContent = forwardRef<HTMLParagraphElement, BlockquoteContentProps>(
  function BlockquoteContent(props, ref) {
    const { children, className, style: styleProp } = props;
    const ctx = useBlockquoteContext();
    const contentSlot = getSlotProps('content', blockquoteContentStyle, ctx.classNames, ctx.styles);
    const contentClassName = className
      ? `${contentSlot.className} ${className}`
      : contentSlot.className;

    return (
      <p
        ref={ref}
        className={contentClassName}
        style={{ ...contentSlot.style, ...styleProp }}
        data-testid="blockquote-content"
      >
        {children}
      </p>
    );
  },
);

// ── Cite Sub-component ────────────────────────────────

export interface BlockquoteCiteProps {
  /** Kaynak bilgisi / Citation source */
  children?: React.ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

const BlockquoteCite = forwardRef<HTMLElement, BlockquoteCiteProps>(
  function BlockquoteCite(props, ref) {
    const { children, className, style: styleProp } = props;
    const ctx = useBlockquoteContext();
    const citeSlot = getSlotProps('cite', blockquoteCiteStyle, ctx.classNames, ctx.styles);
    const citeClassName = className
      ? `${citeSlot.className} ${className}`
      : citeSlot.className;

    return (
      <cite
        ref={ref}
        className={citeClassName}
        style={{ ...citeSlot.style, ...styleProp }}
        data-testid="blockquote-cite"
      >
        {children}
      </cite>
    );
  },
);

// ── Main Component ────────────────────────────────────

const BlockquoteBase = forwardRef<HTMLQuoteElement, BlockquoteComponentProps>(
  function Blockquote(props, ref) {
    const {
      variant = 'default',
      children,
      cite,
      icon,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    // ── Slots ──
    const rootSlot = getSlotProps(
      'root',
      `${blockquoteRootStyle} ${blockquoteVariantStyles[variant]}`,
      classNames,
      styles,
    );
    const iconSlot = getSlotProps('icon', blockquoteIconStyle, classNames, styles);
    const contentSlot = getSlotProps('content', blockquoteContentStyle, classNames, styles);
    const citeSlot = getSlotProps('cite', blockquoteCiteStyle, classNames, styles);

    const rootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    const rootStyle: React.CSSProperties | undefined =
      rootSlot.style || styleProp
        ? { ...rootSlot.style, ...styleProp }
        : undefined;

    const ctxValue: BlockquoteContextValue = { classNames, styles };

    // Compound mode: children icinde Content/Cite sub-component'ler varsa
    // Props-based mode: children dogrudan metin, cite prop ayri
    const isCompound = !cite && !icon;
    const hasPropsContent = cite !== undefined || icon !== undefined;

    return (
      <BlockquoteContext.Provider value={ctxValue}>
        <blockquote
          ref={ref}
          className={rootClassName}
          style={rootStyle}
          data-variant={variant}
          data-testid="blockquote-root"
        >
          {/* Icon (props-based) */}
          {icon && (
            <span
              className={iconSlot.className}
              style={iconSlot.style}
              data-testid="blockquote-icon"
              aria-hidden="true"
            >
              {icon}
            </span>
          )}

          {hasPropsContent ? (
            /* Props-based: children = quote text, cite = source */
            <div style={{ flex: 1 }}>
              <p
                className={contentSlot.className}
                style={contentSlot.style}
                data-testid="blockquote-content"
              >
                {children}
              </p>
              {cite !== undefined && (
                <cite
                  className={citeSlot.className}
                  style={citeSlot.style}
                  data-testid="blockquote-cite"
                >
                  {cite}
                </cite>
              )}
            </div>
          ) : (
            /* Compound: children includes Content/Cite sub-components, or plain text */
            isCompound && <div style={{ flex: 1 }}>{children}</div>
          )}
        </blockquote>
      </BlockquoteContext.Provider>
    );
  },
);

// ── Export ─────────────────────────────────────────────

export const Blockquote = Object.assign(BlockquoteBase, {
  Content: BlockquoteContent,
  Cite: BlockquoteCite,
});

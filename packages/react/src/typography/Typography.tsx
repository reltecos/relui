/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Typography — metin ve baslik bilesen ailesi (Dual API).
 * Typography — text and heading component family (Dual API).
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext } from 'react';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';
import {
  typographyRootStyle,
  typographyVariantStyles,
  typographyAlignStyles,
  typographyTruncateStyle,
  typographyGutterBottomStyle,
} from './typography.css';

// ── Slot ──────────────────────────────────────────────

/** Typography slot isimleri / Typography slot names. */
export type TypographySlot = 'root';

// ── Types ─────────────────────────────────────────────

/** Typography varyantlari / Typography variants */
export type TypographyVariant =
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'subtitle1' | 'subtitle2'
  | 'body1' | 'body2'
  | 'caption' | 'overline';

/** Metin hizalama / Text alignment */
export type TypographyAlign = 'left' | 'center' | 'right' | 'justify';

/** Variant icin varsayilan HTML element / Default HTML element per variant */
const variantElementMap: Record<TypographyVariant, React.ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  subtitle1: 'h6',
  subtitle2: 'h6',
  body1: 'p',
  body2: 'p',
  caption: 'span',
  overline: 'span',
};

// ── Context ───────────────────────────────────────────

interface TypographyContextValue {
  classNames: ClassNames<TypographySlot> | undefined;
  styles: Styles<TypographySlot> | undefined;
}

const TypographyContext = createContext<TypographyContextValue | null>(null);

function useTypographyContext(): TypographyContextValue | null {
  return useContext(TypographyContext);
}

// ── Component Props ───────────────────────────────────

export interface TypographyComponentProps extends SlotStyleProps<TypographySlot> {
  /** Tipografi varyanti / Typography variant */
  variant?: TypographyVariant;
  /** Metin hizalama / Text alignment */
  align?: TypographyAlign;
  /** Metin kisaltma / Text truncation */
  truncate?: boolean;
  /** Alt bosluk / Bottom gutter */
  gutterBottom?: boolean;
  /** Polimorfik element / Polymorphic element */
  as?: React.ElementType;
  /** Icerik / Content */
  children?: React.ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Heading Sub-component ─────────────────────────────

export interface TypographyHeadingProps {
  /** Heading seviyesi / Heading level */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Metin hizalama / Text alignment */
  align?: TypographyAlign;
  /** Metin kisaltma / Truncation */
  truncate?: boolean;
  /** Alt bosluk / Bottom gutter */
  gutterBottom?: boolean;
  /** Polimorfik element / Polymorphic element */
  as?: React.ElementType;
  /** Icerik / Content */
  children?: React.ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

const TypographyHeading = forwardRef<HTMLElement, TypographyHeadingProps>(
  function TypographyHeading(props, ref) {
    const {
      level = 1,
      align,
      truncate = false,
      gutterBottom = false,
      as,
      children,
      className,
      style: styleProp,
    } = props;

    const ctx = useTypographyContext();
    const variant = `h${level}` as TypographyVariant;
    const Component = as ?? `h${level}`;

    const veClass = [
      typographyRootStyle,
      typographyVariantStyles[variant],
      align ? typographyAlignStyles[align] : '',
      truncate ? typographyTruncateStyle : '',
      gutterBottom ? typographyGutterBottomStyle : '',
    ].filter(Boolean).join(' ');

    const rootSlot = getSlotProps('root', veClass, ctx?.classNames, ctx?.styles);
    const rootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    const inlineStyle: React.CSSProperties | undefined =
      rootSlot.style || styleProp
        ? { ...rootSlot.style, ...styleProp }
        : undefined;

    return (
      <Component
        ref={ref}
        className={rootClassName}
        style={inlineStyle}
        data-testid="typography-heading"
      >
        {children}
      </Component>
    );
  },
);

// ── Text Sub-component ────────────────────────────────

export interface TypographyTextProps {
  /** Metin boyutu varyanti / Text size variant */
  variant?: 'body1' | 'body2' | 'caption' | 'overline' | 'subtitle1' | 'subtitle2';
  /** Metin hizalama / Text alignment */
  align?: TypographyAlign;
  /** Metin kisaltma / Truncation */
  truncate?: boolean;
  /** Alt bosluk / Bottom gutter */
  gutterBottom?: boolean;
  /** Polimorfik element / Polymorphic element */
  as?: React.ElementType;
  /** Icerik / Content */
  children?: React.ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

const TypographyText = forwardRef<HTMLElement, TypographyTextProps>(
  function TypographyText(props, ref) {
    const {
      variant = 'body1',
      align,
      truncate = false,
      gutterBottom = false,
      as,
      children,
      className,
      style: styleProp,
    } = props;

    const ctx = useTypographyContext();
    const Component = as ?? variantElementMap[variant];

    const veClass = [
      typographyRootStyle,
      typographyVariantStyles[variant],
      align ? typographyAlignStyles[align] : '',
      truncate ? typographyTruncateStyle : '',
      gutterBottom ? typographyGutterBottomStyle : '',
    ].filter(Boolean).join(' ');

    const rootSlot = getSlotProps('root', veClass, ctx?.classNames, ctx?.styles);
    const rootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    const inlineStyle: React.CSSProperties | undefined =
      rootSlot.style || styleProp
        ? { ...rootSlot.style, ...styleProp }
        : undefined;

    return (
      <Component
        ref={ref}
        className={rootClassName}
        style={inlineStyle}
        data-testid="typography-text"
      >
        {children}
      </Component>
    );
  },
);

// ── Main Component ────────────────────────────────────

const TypographyBase = forwardRef<HTMLElement, TypographyComponentProps>(
  function Typography(props, ref) {
    const {
      variant = 'body1',
      align,
      truncate = false,
      gutterBottom = false,
      as,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const Component = as ?? variantElementMap[variant];

    const veClass = [
      typographyRootStyle,
      typographyVariantStyles[variant],
      align ? typographyAlignStyles[align] : '',
      truncate ? typographyTruncateStyle : '',
      gutterBottom ? typographyGutterBottomStyle : '',
    ].filter(Boolean).join(' ');

    const rootSlot = getSlotProps('root', veClass, classNames, styles);
    const rootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    const inlineStyle: React.CSSProperties | undefined =
      rootSlot.style || styleProp
        ? { ...rootSlot.style, ...styleProp }
        : undefined;

    const ctxValue: TypographyContextValue = { classNames, styles };

    return (
      <TypographyContext.Provider value={ctxValue}>
        <Component
          ref={ref}
          className={rootClassName}
          style={inlineStyle}
          data-variant={variant}
          data-testid="typography-root"
        >
          {children}
        </Component>
      </TypographyContext.Provider>
    );
  },
);

// ── Export ─────────────────────────────────────────────

export const Typography = Object.assign(TypographyBase, {
  Heading: TypographyHeading,
  Text: TypographyText,
});

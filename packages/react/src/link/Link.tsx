/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Link — stilize baglanti bilesen (Dual API).
 * Link — styled anchor component (Dual API).
 *
 * Props-based: `<Link href="/about">About</Link>`
 * Compound:    `<Link href="/about"><Link.Icon>...</Link.Icon>About</Link>`
 *
 * Variant, underline, size destegi. Harici linklerde otomatik
 * target="_blank" + rel="noopener noreferrer".
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import { linkRecipe, externalIconStyle } from './link.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

/**
 * Link slot isimleri / Link slot names.
 */
export type LinkSlot = 'root' | 'externalIcon' | 'icon';

/**
 * Link boyutlari / Link sizes.
 */
export type LinkSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Link varyantlari / Link variants.
 */
export type LinkVariant = 'default' | 'subtle' | 'inherit';

/**
 * Link underline modu / Link underline mode.
 */
export type LinkUnderline = 'always' | 'hover' | 'never';

// ── Context (Compound API) ──────────────────────────────────

interface LinkContextValue {
  size: LinkSize;
  classNames: ClassNames<LinkSlot> | undefined;
  styles: Styles<LinkSlot> | undefined;
}

const LinkContext = createContext<LinkContextValue | null>(null);

function useLinkContext(): LinkContextValue {
  const ctx = useContext(LinkContext);
  if (!ctx) throw new Error('Link compound sub-components must be used within <Link>.');
  return ctx;
}

// ── Compound: Link.Icon ─────────────────────────────────────

/** Link.Icon props */
export interface LinkIconProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Pozisyon / Position */
  position?: 'start' | 'end';
  /** Ek className / Additional className */
  className?: string;
}

const LinkIcon = forwardRef<HTMLSpanElement, LinkIconProps>(
  function LinkIcon(props, ref) {
    const { children, position = 'start', className } = props;
    const ctx = useLinkContext();
    const slot = getSlotProps('icon', '', ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <span
        ref={ref}
        className={cls || undefined}
        style={{
          ...slot.style,
          display: 'inline-flex',
          alignItems: 'center',
          ...(position === 'start' ? { marginRight: '0.25em' } : { marginLeft: '0.25em' }),
        }}
        aria-hidden="true"
        data-testid="link-icon"
      >
        {children}
      </span>
    );
  },
);

// ── Component Props ─────────────────────────────────────────

export interface LinkComponentProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'style'>,
    SlotStyleProps<LinkSlot> {
  /** Variant / Variant */
  variant?: LinkVariant;

  /** Alti cizgi modu / Underline mode */
  underline?: LinkUnderline;

  /** Boyut / Size */
  size?: LinkSize;

  /** Devre disi / Disabled */
  disabled?: boolean;

  /** Harici link mi / Is external link */
  external?: boolean;

  /** Harici ikon goster / Show external icon */
  showExternalIcon?: boolean;

  /** Inline style / Inline style */
  style?: React.CSSProperties;

  /** Cocuklar / Children */
  children?: ReactNode;
}

/**
 * ExternalLinkIcon — kucuk ok SVG.
 */
function ExternalLinkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

// ── Component ───────────────────────────────────────────────

/**
 * Link bilesen — stilize baglanti (Dual API).
 * Link component — styled anchor (Dual API).
 *
 * @example Props-based
 * ```tsx
 * <Link href="/about">About</Link>
 * <Link href="https://example.com" external>Example</Link>
 * ```
 *
 * @example Compound
 * ```tsx
 * <Link href="/about">
 *   <Link.Icon><SearchIcon /></Link.Icon>
 *   About
 * </Link>
 * ```
 */
const LinkBase = forwardRef<HTMLAnchorElement, LinkComponentProps>(
  function Link(props, ref) {
    const {
      variant = 'default',
      underline = 'hover',
      size = 'md',
      disabled = false,
      external = false,
      showExternalIcon = true,
      className,
      style: styleProp,
      classNames,
      styles,
      children,
      ...htmlProps
    } = props;

    const rootClass = linkRecipe({ variant, underline, size });
    const rootSlot = getSlotProps('root', rootClass, classNames, styles);
    const combinedRootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;
    const combinedRootStyle = styleProp
      ? { ...rootSlot.style, ...styleProp }
      : rootSlot.style;

    const extIconSlot = getSlotProps('externalIcon', externalIconStyle, classNames, styles);

    const externalProps = external
      ? { target: '_blank' as const, rel: 'noopener noreferrer' }
      : {};

    const ctxValue: LinkContextValue = { size, classNames, styles };

    return (
      <LinkContext.Provider value={ctxValue}>
        <a
          ref={ref}
          className={combinedRootClassName}
          style={combinedRootStyle}
          aria-disabled={disabled || undefined}
          data-disabled={disabled ? '' : undefined}
          tabIndex={disabled ? -1 : undefined}
          {...externalProps}
          {...htmlProps}
        >
          {children}
          {external && showExternalIcon && (
            <span className={extIconSlot.className} style={extIconSlot.style} aria-hidden="true">
              <ExternalLinkIcon />
            </span>
          )}
        </a>
      </LinkContext.Provider>
    );
  },
);

/**
 * Link bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Link href="/about">About</Link>
 * ```
 *
 * @example Compound
 * ```tsx
 * <Link href="/about">
 *   <Link.Icon><SearchIcon /></Link.Icon>
 *   About
 * </Link>
 * ```
 */
export const Link = Object.assign(LinkBase, {
  Icon: LinkIcon,
});

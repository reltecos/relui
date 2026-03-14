/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * NavLink — aktif durum destekli navigasyon baglantisi.
 * NavLink — navigation link with active state support.
 *
 * Link'i extend eder, `active` prop ile aktif durumu gosterir.
 *
 * @packageDocumentation
 */

import { forwardRef, type ReactNode } from 'react';
import { linkRecipe, navLinkActiveStyle, externalIconStyle } from './link.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';
import type { LinkVariant, LinkUnderline, LinkSize } from './Link';

/**
 * NavLink slot isimleri / NavLink slot names.
 */
export type NavLinkSlot = 'root' | 'externalIcon';

// ── Component Props ─────────────────────────────────────────

export interface NavLinkComponentProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'style'>,
    SlotStyleProps<NavLinkSlot> {
  /** Variant / Variant */
  variant?: LinkVariant;

  /** Alti cizgi modu / Underline mode */
  underline?: LinkUnderline;

  /** Boyut / Size */
  size?: LinkSize;

  /** Devre disi / Disabled */
  disabled?: boolean;

  /** Aktif mi / Is active */
  active?: boolean;

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

/**
 * NavLink bilesen — aktif durum destekli navigasyon baglantisi.
 * NavLink component — navigation link with active state support.
 *
 * @example
 * ```tsx
 * <NavLink href="/home" active>Home</NavLink>
 * <NavLink href="/about">About</NavLink>
 * ```
 */
export const NavLink = forwardRef<HTMLAnchorElement, NavLinkComponentProps>(
  function NavLink(props, ref) {
    const {
      variant = 'default',
      underline = 'hover',
      size = 'md',
      disabled = false,
      active = false,
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
    const activeClass = active ? `${rootClass} ${navLinkActiveStyle}` : rootClass;
    const rootSlot = getSlotProps('root', activeClass, classNames, styles);
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

    return (
      <a
        ref={ref}
        className={combinedRootClassName}
        style={combinedRootStyle}
        aria-current={active ? 'page' : undefined}
        aria-disabled={disabled || undefined}
        data-disabled={disabled ? '' : undefined}
        data-active={active ? '' : undefined}
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
    );
  },
);

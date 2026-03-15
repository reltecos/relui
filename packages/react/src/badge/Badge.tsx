/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Badge — styled React badge component (Dual API).
 * Badge — stilize edilmis React badge bileseni (Dual API).
 *
 * Props-based: `<Badge icon={<CheckIcon />}>Aktif</Badge>`
 * Compound:    `<Badge><Badge.Icon><CheckIcon /></Badge.Icon>Aktif</Badge>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { BadgeSize, BadgeColor, BadgeVariant } from '@relteco/relui-core';
import { badgeRecipe, badgeIconStyle } from './badge.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** Badge slot isimleri / Badge slot names. */
export type BadgeSlot = 'root' | 'icon';

// ── Context (Compound API) ──────────────────────────

interface BadgeContextValue {
  size: BadgeSize;
  color: BadgeColor;
  variant: BadgeVariant;
  classNames: ClassNames<BadgeSlot> | undefined;
  styles: Styles<BadgeSlot> | undefined;
}

const BadgeContext = createContext<BadgeContextValue | null>(null);

function useBadgeContext(): BadgeContextValue {
  const ctx = useContext(BadgeContext);
  if (!ctx) throw new Error('Badge compound sub-components must be used within <Badge>.');
  return ctx;
}

// ── Compound: Badge.Icon ────────────────────────────

/** Badge.Icon props */
export interface BadgeIconProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const BadgeIcon = forwardRef<HTMLSpanElement, BadgeIconProps>(
  function BadgeIcon(props, ref) {
    const { children, className } = props;
    const ctx = useBadgeContext();
    const slot = getSlotProps('icon', badgeIconStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <span ref={ref} className={cls} style={slot.style} data-testid="badge-icon">
        {children}
      </span>
    );
  },
);

// ── Component Props ───────────────────────────────────

/**
 * Badge bilesen props'lari.
 * Badge component props.
 */
export interface BadgeComponentProps extends SlotStyleProps<BadgeSlot> {
  /** Boyut / Size */
  size?: BadgeSize;

  /** Renk semasi / Color scheme */
  color?: BadgeColor;

  /** Gorunum varyanti / Visual variant */
  variant?: BadgeVariant;

  /** Props-based: ikon / Icon */
  icon?: ReactNode;

  /** Ek CSS sinifi / Additional CSS class */
  className?: string;

  /** HTML id */
  id?: string;

  /** Inline stil / Inline style */
  style?: React.CSSProperties;

  /** Icerik / Content */
  children?: ReactNode;
}

// ── Component ─────────────────────────────────────────

const BadgeBase = forwardRef<HTMLSpanElement, BadgeComponentProps>(function Badge(
  {
    size = 'md',
    color = 'accent',
    variant = 'solid',
    icon,
    className,
    id,
    style: inlineStyle,
    classNames,
    styles,
    children,
  },
  forwardedRef,
) {
  const recipeClass = badgeRecipe({ size, color, variant });
  const rootSlot = getSlotProps('root', recipeClass, classNames, styles, inlineStyle);
  const combinedClassName = className
    ? `${rootSlot.className} ${className}`
    : rootSlot.className;

  const ctxValue: BadgeContextValue = { size, color, variant, classNames, styles };

  // ── Compound API (children icerir sub-component) ──
  // Not: Badge'de children her zaman var, compound mu degil mi anlamak icin
  // icon prop'unun yokluguna VE children'in ReactElement olmasina bakariz.
  // Basitlik icin: icon prop varsa props-based, yoksa compound context saglariz.
  // Context her zaman saglanir, boylece Badge.Icon hem iceride hem disarida kullanilabilir.

  return (
    <BadgeContext.Provider value={ctxValue}>
      <span
        ref={forwardedRef}
        id={id}
        className={combinedClassName}
        style={rootSlot.style}
        data-testid="badge-root"
      >
        {icon !== undefined && (
          <span
            className={getSlotProps('icon', badgeIconStyle, classNames, styles).className}
            style={getSlotProps('icon', badgeIconStyle, classNames, styles).style}
            data-testid="badge-icon"
          >
            {icon}
          </span>
        )}
        {children}
      </span>
    </BadgeContext.Provider>
  );
});

/**
 * Badge bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Badge color="success">Aktif</Badge>
 * <Badge icon={<CheckIcon />} color="success">Aktif</Badge>
 * ```
 *
 * @example Compound
 * ```tsx
 * <Badge color="success">
 *   <Badge.Icon><CheckIcon /></Badge.Icon>
 *   Aktif
 * </Badge>
 * ```
 */
export const Badge = Object.assign(BadgeBase, {
  Icon: BadgeIcon,
});

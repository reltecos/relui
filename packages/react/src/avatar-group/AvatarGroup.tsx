/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * AvatarGroup — avatar gruplama bilesen (Dual API).
 * AvatarGroup — avatar grouping component (Dual API).
 *
 * Props-based: `<AvatarGroup items={[...]} max={3} />`
 * Compound:    `<AvatarGroup max={3}><AvatarGroup.Avatar name="Ali" />...</AvatarGroup>`
 *
 * @packageDocumentation
 */

import {
  forwardRef,
  createContext,
  useContext,
  Children,
  isValidElement,
  type ReactNode,
} from 'react';
import {
  avatarGroupRootStyle,
  avatarGroupAvatarStyle,
  avatarGroupOverflowRecipe,
} from './avatar-group.css';
import { Avatar } from '../avatar/Avatar';
import type { AvatarSize, AvatarVariant } from '../avatar/Avatar';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/**
 * AvatarGroup slot isimleri / AvatarGroup slot names.
 */
export type AvatarGroupSlot = 'root' | 'avatar' | 'overflow';

// ── Types ────────────────────────────────────────────

/**
 * Avatar tanimi / Avatar definition.
 */
export interface AvatarDef {
  /** Gorsel URL / Image URL */
  src?: string;
  /** Alt metin / Alt text */
  alt?: string;
  /** Isim / Name */
  name?: string;
  /** Arka plan rengi / Background color */
  color?: string;
}

// ── Context (Compound API) ──────────────────────────

interface AvatarGroupContextValue {
  size: AvatarSize;
  variant: AvatarVariant;
  classNames: ClassNames<AvatarGroupSlot> | undefined;
  styles: Styles<AvatarGroupSlot> | undefined;
}

const AvatarGroupContext = createContext<AvatarGroupContextValue | null>(null);

function useAvatarGroupContext(): AvatarGroupContextValue {
  const ctx = useContext(AvatarGroupContext);
  if (!ctx) throw new Error('AvatarGroup.Avatar must be used within <AvatarGroup>.');
  return ctx;
}

// ── Compound: AvatarGroup.Avatar ────────────────────

/** AvatarGroup.Avatar props / AvatarGroup.Avatar props. */
export interface AvatarGroupAvatarProps {
  /** Gorsel URL / Image URL */
  src?: string;
  /** Alt metin / Alt text */
  alt?: string;
  /** Isim / Name */
  name?: string;
  /** Arka plan rengi / Background color */
  color?: string;
  /** Boyut override / Size override */
  size?: AvatarSize;
  /** Varyant override / Variant override */
  variant?: AvatarVariant;
}

const AvatarGroupAvatarCompound = forwardRef<HTMLDivElement, AvatarGroupAvatarProps>(
  function AvatarGroupAvatar(props, ref) {
    const ctx = useAvatarGroupContext();
    const avatarSlot = getSlotProps('avatar', avatarGroupAvatarStyle, ctx.classNames, ctx.styles);

    return (
      <div
        ref={ref}
        className={avatarSlot.className}
        style={avatarSlot.style}
        data-testid="avatar-group-avatar"
      >
        <Avatar
          src={props.src}
          alt={props.alt}
          name={props.name}
          size={props.size ?? ctx.size}
          variant={props.variant ?? ctx.variant}
          color={props.color}
        />
      </div>
    );
  },
);

// ── Component Props ─────────────────────────────────

export interface AvatarGroupComponentProps extends SlotStyleProps<AvatarGroupSlot> {
  /** Props-based: avatar listesi / Avatar list */
  items?: AvatarDef[];
  /** Compound: children ile manual render */
  children?: ReactNode;
  /** Maksimum gorunur avatar sayisi / Maximum visible avatars */
  max?: number;
  /** Boyut / Size */
  size?: AvatarSize;
  /** Varyant / Variant */
  variant?: AvatarVariant;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Component ────────────────────────────────────────

const AvatarGroupBase = forwardRef<HTMLDivElement, AvatarGroupComponentProps>(
  function AvatarGroup(props, ref) {
    const {
      items,
      children,
      max,
      size = 'md',
      variant = 'circle',
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const rootSlot = getSlotProps('root', avatarGroupRootStyle, classNames, styles, styleProp);
    const avatarSlot = getSlotProps('avatar', avatarGroupAvatarStyle, classNames, styles);
    const overflowBaseClass = avatarGroupOverflowRecipe({ size, variant });
    const overflowSlot = getSlotProps('overflow', overflowBaseClass, classNames, styles);

    const rootClassName = className ? `${rootSlot.className} ${className}` : rootSlot.className;

    // ── Compound API ──
    if (children) {
      const childArray = Children.toArray(children).filter(isValidElement);
      const totalCount = childArray.length;
      const visibleChildren = max !== undefined && max < totalCount
        ? childArray.slice(0, max)
        : childArray;
      const overflowCount = max !== undefined && max < totalCount ? totalCount - max : 0;

      const ctxValue: AvatarGroupContextValue = { size, variant, classNames, styles };

      return (
        <AvatarGroupContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={rootClassName}
            style={rootSlot.style}
            role="group"
            aria-label="Avatar group"
            data-testid="avatar-group-root"
          >
            {visibleChildren}
            {overflowCount > 0 && (
              <span
                className={overflowSlot.className}
                style={overflowSlot.style}
                data-testid="avatar-group-overflow"
              >
                +{overflowCount}
              </span>
            )}
          </div>
        </AvatarGroupContext.Provider>
      );
    }

    // ── Props-based API ──
    const itemsArr = items ?? [];
    const visibleItems =
      max !== undefined && max < itemsArr.length ? itemsArr.slice(0, max) : itemsArr;
    const overflowCount =
      max !== undefined && max < itemsArr.length ? itemsArr.length - max : 0;

    return (
      <div
        ref={ref}
        className={rootClassName}
        style={rootSlot.style}
        role="group"
        aria-label="Avatar group"
        data-testid="avatar-group-root"
      >
        {visibleItems.map((item, index) => (
          <div
            key={index}
            className={avatarSlot.className}
            style={avatarSlot.style}
            data-testid="avatar-group-avatar"
          >
            <Avatar
              src={item.src}
              alt={item.alt}
              name={item.name}
              size={size}
              variant={variant}
              color={item.color}
            />
          </div>
        ))}
        {overflowCount > 0 && (
          <span
            className={overflowSlot.className}
            style={overflowSlot.style}
            data-testid="avatar-group-overflow"
          >
            +{overflowCount}
          </span>
        )}
      </div>
    );
  },
);

/**
 * AvatarGroup bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <AvatarGroup
 *   items={[{ name: 'Ali' }, { name: 'Veli' }]}
 *   max={3}
 * />
 * ```
 *
 * @example Compound
 * ```tsx
 * <AvatarGroup max={3}>
 *   <AvatarGroup.Avatar name="Ali" />
 *   <AvatarGroup.Avatar name="Veli" />
 * </AvatarGroup>
 * ```
 */
export const AvatarGroup = Object.assign(AvatarGroupBase, {
  Avatar: AvatarGroupAvatarCompound,
});

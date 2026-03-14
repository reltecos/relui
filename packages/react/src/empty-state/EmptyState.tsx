/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * EmptyState — bos veri durumu bilesen.
 * EmptyState — empty data state component.
 *
 * Ikon + baslik + aciklama + aksiyon butonu.
 *
 * @packageDocumentation
 */

import { forwardRef, type ReactNode } from 'react';
import {
  emptyStateRootRecipe,
  emptyStateIconRecipe,
  emptyStateTitleRecipe,
  emptyStateDescriptionRecipe,
  emptyStateActionStyle,
} from './empty-state.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';
import { MessageSquareIcon } from '@relteco/relui-icons';

// ── Slot ──────────────────────────────────────────────

/**
 * EmptyState slot isimleri / EmptyState slot names.
 */
export type EmptyStateSlot = 'root' | 'icon' | 'title' | 'description' | 'action';

// ── Types ─────────────────────────────────────────────

/** EmptyState boyutu / EmptyState size. */
export type EmptyStateSize = 'sm' | 'md' | 'lg';

// ── Component Props ───────────────────────────────────

export interface EmptyStateComponentProps extends SlotStyleProps<EmptyStateSlot> {
  /** Ikon / Icon (ReactNode) */
  icon?: ReactNode;
  /** Baslik / Title */
  title?: ReactNode;
  /** Aciklama / Description */
  description?: ReactNode;
  /** Aksiyon alani / Action area (butonlar) */
  action?: ReactNode;
  /** Boyut / Size */
  size?: EmptyStateSize;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
  /** id */
  id?: string;
}

// ── Default Icon (from @relteco/relui-icons) ────────

// ── Component ─────────────────────────────────────────

/**
 * EmptyState bilesen — bos veri durumu.
 * EmptyState component — empty data state.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   title="Veri bulunamadi"
 *   description="Henuz kayit eklenmemis."
 *   action={<Button>Yeni Ekle</Button>}
 * />
 * ```
 */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateComponentProps>(
  function EmptyState(props, ref) {
    const {
      icon,
      title,
      description,
      action,
      size = 'md',
      className,
      style: styleProp,
      classNames,
      styles,
      id,
    } = props;

    // ── Slots ──
    const rootClass = emptyStateRootRecipe({ size });
    const rootSlot = getSlotProps('root', rootClass, classNames, styles);
    const combinedRootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;
    const combinedRootStyle = styleProp
      ? { ...rootSlot.style, ...styleProp }
      : rootSlot.style;

    const iconSlot = getSlotProps('icon', emptyStateIconRecipe({ size }), classNames, styles);
    const titleSlot = getSlotProps('title', emptyStateTitleRecipe({ size }), classNames, styles);
    const descSlot = getSlotProps('description', emptyStateDescriptionRecipe({ size }), classNames, styles);
    const actionSlot = getSlotProps('action', emptyStateActionStyle, classNames, styles);

    // ── Resolve icon ──
    const resolvedIcon = icon !== undefined ? icon : <MessageSquareIcon size="100%" />;

    return (
      <div
        ref={ref}
        className={combinedRootClassName}
        style={combinedRootStyle}
        id={id}
        data-testid="empty-state"
      >
        {resolvedIcon !== null && (
          <div className={iconSlot.className} style={iconSlot.style} data-testid="empty-state-icon">
            {resolvedIcon}
          </div>
        )}

        {title && (
          <h3 className={titleSlot.className} style={titleSlot.style} data-testid="empty-state-title">
            {title}
          </h3>
        )}

        {description && (
          <p className={descSlot.className} style={descSlot.style} data-testid="empty-state-description">
            {description}
          </p>
        )}

        {action && (
          <div className={actionSlot.className} style={actionSlot.style} data-testid="empty-state-action">
            {action}
          </div>
        )}
      </div>
    );
  },
);

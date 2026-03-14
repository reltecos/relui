/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * FloatingActionButton (FAB) — yuzen aksiyon butonu.
 * FloatingActionButton (FAB) — floating action button with speed dial.
 *
 * Ana buton + tiklaninca acilan mini aksiyon butonlari (speed dial).
 *
 * @packageDocumentation
 */

import { forwardRef, type ReactNode } from 'react';
import {
  fabRootRecipe,
  fabButtonRecipe,
  fabIconStyle,
  fabIconOpenStyle,
  fabIconSizeRecipe,
  fabActionRecipe,
  fabActionButtonRecipe,
  fabActionLabelStyle,
  fabOverlayStyle,
} from './fab.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';
import { useFAB, type UseFABProps } from './useFAB';
import type { FabPosition, FabAction } from '@relteco/relui-core';

// ── Slot ──────────────────────────────────────────────

/**
 * FAB slot isimleri / FAB slot names.
 */
export type FABSlot = 'root' | 'button' | 'icon' | 'action' | 'actionButton' | 'actionLabel' | 'overlay';

// ── Types ─────────────────────────────────────────────

export type FABSize = 'sm' | 'md' | 'lg';
export type FABVariant = 'filled' | 'secondary' | 'danger';

// ── Component Props ──────────────────────────────────

export interface FABComponentProps
  extends UseFABProps,
    SlotStyleProps<FABSlot> {
  /** Pozisyon / Position */
  position?: FabPosition;

  /** Variant / Variant */
  variant?: FABVariant;

  /** Boyut / Size */
  size?: FABSize;

  /** Ana buton ikonu / Main button icon */
  icon?: ReactNode;

  /** Ozel aksiyon ikon render / Custom action icon renderer */
  renderActionIcon?: (action: FabAction) => ReactNode;

  /** Ek className / Additional className */
  className?: string;

  /** Inline style / Inline style */
  style?: React.CSSProperties;

  /** id */
  id?: string;

  /** aria-label (ana buton icin) */
  'aria-label'?: string;

  /** Overlay goster (acik iken arka plan) / Show overlay when open */
  showOverlay?: boolean;
}

// ── Default Icon ─────────────────────────────────────

function DefaultPlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      width="100%"
      height="100%"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

// ── Component ────────────────────────────────────────

/**
 * FloatingActionButton (FAB) bilesen.
 * FloatingActionButton (FAB) component with speed dial.
 *
 * @example
 * ```tsx
 * <FAB
 *   actions={[
 *     { id: 'add', label: 'Add item' },
 *     { id: 'edit', label: 'Edit' },
 *   ]}
 *   onSelectAction={(id) => console.log(id)}
 * />
 * ```
 */
export const FAB = forwardRef<HTMLDivElement, FABComponentProps>(
  function FAB(props, ref) {
    const {
      position = 'bottom-right',
      variant = 'filled',
      size = 'md',
      icon,
      renderActionIcon,
      className,
      style: styleProp,
      classNames,
      styles,
      id,
      'aria-label': ariaLabel,
      showOverlay = false,
      // useFAB props
      actions,
      open: openProp,
      onOpenChange,
      onSelectAction,
    } = props;

    const { context, toggle, selectAction } = useFAB({
      actions,
      open: openProp,
      onOpenChange,
      onSelectAction,
    });

    const direction = position.startsWith('top') ? 'down' : 'up';

    // ── Slots ──
    const rootClass = fabRootRecipe({ position, direction });
    const rootSlot = getSlotProps('root', rootClass, classNames, styles);
    const combinedRootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;
    const combinedRootStyle = styleProp
      ? { ...rootSlot.style, ...styleProp }
      : rootSlot.style;

    const buttonClass = fabButtonRecipe({ variant, size });
    const buttonSlot = getSlotProps('button', buttonClass, classNames, styles);

    const iconClass = `${fabIconStyle}${context.open ? ` ${fabIconOpenStyle}` : ''}`;
    const iconSizeClass = fabIconSizeRecipe({ size });
    const iconSlot = getSlotProps('icon', `${iconClass} ${iconSizeClass}`, classNames, styles);

    const overlaySlot = getSlotProps('overlay', fabOverlayStyle, classNames, styles);

    // ── Resolve aria-label ──
    const resolvedAriaLabel = ariaLabel ?? (context.open ? 'Close actions' : 'Open actions');

    return (
      <>
        {/* Overlay */}
        {showOverlay && context.open && (
          <div
            className={overlaySlot.className}
            style={overlaySlot.style}
            onClick={toggle}
            data-testid="fab-overlay"
          />
        )}

        {/* FAB container */}
        <div
          ref={ref}
          className={combinedRootClassName}
          style={combinedRootStyle}
          id={id}
          data-testid="fab"
        >
          {/* Main button */}
          <button
            className={buttonSlot.className}
            style={buttonSlot.style}
            onClick={toggle}
            type="button"
            aria-expanded={context.open}
            aria-haspopup={context.actions.length > 0 ? 'true' : undefined}
            aria-label={resolvedAriaLabel}
            data-testid="fab-button"
          >
            <span className={iconSlot.className} style={iconSlot.style}>
              {icon ?? <DefaultPlusIcon />}
            </span>
          </button>

          {/* Speed dial actions */}
          {context.open && context.actions.map((action, index) => {
            const actionClass = fabActionRecipe({ direction });
            const actionSlot = getSlotProps('action', actionClass, classNames, styles);
            const actionBtnClass = fabActionButtonRecipe({
              size,
              disabled: action.disabled ?? false,
            });
            const actionBtnSlot = getSlotProps('actionButton', actionBtnClass, classNames, styles);
            const actionLabelSlot = getSlotProps('actionLabel', fabActionLabelStyle, classNames, styles);

            return (
              <div
                key={action.id}
                className={actionSlot.className}
                style={{
                  ...actionSlot.style,
                  animationDelay: `${index * 50}ms`,
                }}
                data-testid={`fab-action-${action.id}`}
              >
                {/* Label (tooltip) */}
                <span
                  className={actionLabelSlot.className}
                  style={actionLabelSlot.style}
                >
                  {action.label}
                </span>

                {/* Action button */}
                <button
                  className={actionBtnSlot.className}
                  style={actionBtnSlot.style}
                  onClick={() => selectAction(action.id)}
                  type="button"
                  role="menuitem"
                  aria-label={action.label}
                  aria-disabled={action.disabled || undefined}
                  tabIndex={action.disabled ? -1 : 0}
                >
                  {renderActionIcon?.(action)}
                </button>
              </div>
            );
          })}
        </div>
      </>
    );
  },
);

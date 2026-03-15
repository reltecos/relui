/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * IconButton — kare, sadece ikon iceren buton bileseni (Dual API).
 * IconButton — square, icon-only button component (Dual API).
 *
 * Props-based: `<IconButton icon={<SearchIcon />} aria-label="Ara" />`
 * Compound:    `<IconButton aria-label="Ara"><IconButton.Icon><SearchIcon /></IconButton.Icon></IconButton>`
 *
 * Button bilesenini temel alir, kare boyutlandirma ve zorunlu
 * aria-label ile erisilebilirlik saglar.
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { ButtonVariant, ButtonSize, ButtonColor } from '@relteco/relui-core';
import { useButton, type UseButtonProps } from '../button/useButton';
import { buttonRecipe, spinnerStyle } from '../button/button.css';
import { iconButtonSizeRecipe } from './icon-button.css';
import { useButtonGroupContext } from '../button-group/ButtonGroupContext';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

/** IconButton slot isimleri. */
export type IconButtonSlot = 'root' | 'spinner' | 'icon';

// ── Context (Compound API) ──────────────────────────

interface IconButtonContextValue {
  size: ButtonSize;
  variant: ButtonVariant;
  color: ButtonColor;
  disabled: boolean | undefined;
  loading: boolean;
  classNames: ClassNames<IconButtonSlot> | undefined;
  styles: Styles<IconButtonSlot> | undefined;
}

const IconButtonContext = createContext<IconButtonContextValue | null>(null);

function useIconButtonContext(): IconButtonContextValue {
  const ctx = useContext(IconButtonContext);
  if (!ctx) throw new Error('IconButton compound sub-components must be used within <IconButton>.');
  return ctx;
}

// ── Compound: IconButton.Icon ────────────────────────

/** IconButton.Icon props */
export interface IconButtonIconProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const IconButtonIcon = forwardRef<HTMLSpanElement, IconButtonIconProps>(
  function IconButtonIcon(props, ref) {
    const { children, className } = props;
    const ctx = useIconButtonContext();
    const slot = getSlotProps('icon', undefined, ctx.classNames, ctx.styles);
    const cls = className
      ? slot.className ? `${slot.className} ${className}` : className
      : slot.className || undefined;

    return (
      <span
        ref={ref}
        className={cls}
        style={slot.style}
        aria-hidden="true"
        data-testid="iconbutton-icon"
      >
        {children}
      </span>
    );
  },
);

// ── Component Props ───────────────────────────────────

/**
 * IconButton bilesen props.
 * IconButton component props.
 */
export interface IconButtonComponentProps extends UseButtonProps, SlotStyleProps<IconButtonSlot> {
  /** Ikon / Icon (props-based kullanim icin) */
  icon?: ReactNode;

  /** Compound API icin children / Children for compound API */
  children?: ReactNode;

  /** Gorsel varyant / Visual variant */
  variant?: ButtonVariant;

  /** Boyut / Size */
  size?: ButtonSize;

  /** Renk semasi / Color scheme */
  color?: ButtonColor;

  /**
   * Erisilebilirlik etiketi — ZORUNLU.
   * Accessibility label — REQUIRED.
   */
  'aria-label': string;

  /** Ek CSS sinifi / Additional CSS class */
  className?: string;

  /** HTML id */
  id?: string;

  /** Inline stil / Inline style */
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────

/**
 * IconButton — RelUI ikon buton bileseni (Dual API).
 * IconButton — RelUI icon button component (Dual API).
 *
 * Kare boyutlu, sadece ikon icerir. aria-label zorunludur.
 * Button tum variant ve color destegini tasir.
 *
 * @example Props-based
 * ```tsx
 * <IconButton
 *   icon={<SearchIcon />}
 *   aria-label="Ara"
 *   variant="ghost"
 *   size="md"
 * />
 * ```
 *
 * @example Compound
 * ```tsx
 * <IconButton aria-label="Ara" variant="ghost">
 *   <IconButton.Icon><SearchIcon /></IconButton.Icon>
 * </IconButton>
 * ```
 */
const IconButtonBase = forwardRef<HTMLButtonElement, IconButtonComponentProps>(
  function IconButton(
    {
      icon,
      children,
      variant: variantProp,
      size: sizeProp,
      color: colorProp,
      'aria-label': ariaLabel,
      className,
      id,
      style: inlineStyle,
      classNames,
      styles,
      disabled: disabledProp,
      ...restHookProps
    },
    forwardedRef,
  ) {
    // ButtonGroup context — grup varsa grup props override eder
    const groupCtx = useButtonGroupContext();

    const variant = groupCtx?.variant ?? variantProp ?? 'solid';
    const size = groupCtx?.size ?? sizeProp ?? 'md';
    const color = groupCtx?.color ?? colorProp ?? 'accent';
    const disabled = groupCtx?.disabled ?? disabledProp;

    const { buttonProps, isLoading } = useButton({ ...restHookProps, disabled });

    const baseClass = buttonRecipe({ variant, size, color });
    const squareClass = iconButtonSizeRecipe({ size });
    const veRootClass = `${baseClass} ${squareClass}`;
    const rootSlot = getSlotProps('root', veRootClass, classNames, styles, inlineStyle);
    const combinedClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    const spinnerSlot = getSlotProps('spinner', spinnerStyle, classNames, styles);
    const iconSlot = getSlotProps('icon', undefined, classNames, styles);

    const ctxValue: IconButtonContextValue = {
      size,
      variant,
      color,
      disabled,
      loading: isLoading,
      classNames,
      styles,
    };

    // Compound mode: icon prop yoksa children kullan
    const isCompound = !icon && children;

    const renderContent = () => {
      if (isLoading) {
        return (
          <span
            className={spinnerSlot.className}
            style={spinnerSlot.style}
            aria-hidden="true"
          />
        );
      }

      if (isCompound) {
        return children;
      }

      return (
        <span
          className={iconSlot.className || undefined}
          style={iconSlot.style}
          aria-hidden="true"
        >
          {icon}
        </span>
      );
    };

    return (
      <IconButtonContext.Provider value={ctxValue}>
        <button
          {...buttonProps}
          ref={forwardedRef}
          id={id}
          className={combinedClassName}
          style={rootSlot.style}
          aria-label={ariaLabel}
        >
          {renderContent()}
        </button>
      </IconButtonContext.Provider>
    );
  },
);

/**
 * IconButton bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <IconButton icon={<SearchIcon />} aria-label="Ara" />
 * ```
 *
 * @example Compound
 * ```tsx
 * <IconButton aria-label="Ara">
 *   <IconButton.Icon><SearchIcon /></IconButton.Icon>
 * </IconButton>
 * ```
 */
export const IconButton = Object.assign(IconButtonBase, {
  Icon: IconButtonIcon,
});

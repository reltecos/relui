/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Button — styled React button component (Dual API).
 * Button — stilize edilmiş React buton bileseni (Dual API).
 *
 * Props-based: `<Button leftIcon={<Icon />}>Kaydet</Button>`
 * Compound:    `<Button><Button.LeftIcon><Icon /></Button.LeftIcon>Kaydet</Button>`
 *
 * 5 varyant x 5 renk x 5 boyut destekler. Vanilla Extract + CSS Variables
 * ile tam tema destegi. WAI-ARIA Button pattern uyumlu.
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { ButtonVariant, ButtonSize, ButtonColor } from '@relteco/relui-core';
import { useButton, type UseButtonProps } from './useButton';
import { buttonRecipe, spinnerStyle, iconStyle } from './button.css';
import { useButtonGroupContext } from '../button-group/ButtonGroupContext';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

/** Button slot isimleri. */
export type ButtonSlot = 'root' | 'spinner' | 'leftIcon' | 'rightIcon';

// ── Context (Compound API) ──────────────────────────

interface ButtonContextValue {
  size: ButtonSize;
  variant: ButtonVariant;
  color: ButtonColor;
  disabled: boolean | undefined;
  loading: boolean;
  classNames: ClassNames<ButtonSlot> | undefined;
  styles: Styles<ButtonSlot> | undefined;
}

const ButtonContext = createContext<ButtonContextValue | null>(null);

function useButtonContext(): ButtonContextValue {
  const ctx = useContext(ButtonContext);
  if (!ctx) throw new Error('Button compound sub-components must be used within <Button>.');
  return ctx;
}

// ── Compound: Button.LeftIcon ────────────────────────

/** Button.LeftIcon props */
export interface ButtonLeftIconProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const ButtonLeftIcon = forwardRef<HTMLSpanElement, ButtonLeftIconProps>(
  function ButtonLeftIcon(props, ref) {
    const { children, className } = props;
    const ctx = useButtonContext();
    const slot = getSlotProps('leftIcon', iconStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <span
        ref={ref}
        className={cls}
        style={slot.style}
        aria-hidden="true"
        data-testid="button-lefticon"
      >
        {children}
      </span>
    );
  },
);

// ── Compound: Button.RightIcon ───────────────────────

/** Button.RightIcon props */
export interface ButtonRightIconProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const ButtonRightIcon = forwardRef<HTMLSpanElement, ButtonRightIconProps>(
  function ButtonRightIcon(props, ref) {
    const { children, className } = props;
    const ctx = useButtonContext();
    const slot = getSlotProps('rightIcon', iconStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <span
        ref={ref}
        className={cls}
        style={slot.style}
        aria-hidden="true"
        data-testid="button-righticon"
      >
        {children}
      </span>
    );
  },
);

// ── Component Props ───────────────────────────────────

/**
 * Button bilesen props.
 * Button component props.
 */
export interface ButtonProps extends UseButtonProps, SlotStyleProps<ButtonSlot> {
  /** Buton icerigi / Button content */
  children?: ReactNode;

  /** Gorsel varyant / Visual variant */
  variant?: ButtonVariant;

  /** Boyut / Size */
  size?: ButtonSize;

  /** Renk semasi / Color scheme */
  color?: ButtonColor;

  /** Tam genislik / Full width */
  fullWidth?: boolean;

  /** Sol ikon / Left icon */
  leftIcon?: ReactNode;

  /** Sag ikon / Right icon */
  rightIcon?: ReactNode;

  /** Yuklenme metni / Loading text (shown instead of children while loading) */
  loadingText?: string;

  /** Ek CSS sinifi / Additional CSS class */
  className?: string;

  /** HTML id */
  id?: string;

  /** Inline stil / Inline style */
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────

/**
 * Button — RelUI buton bileseni (Dual API).
 * Button — RelUI button component (Dual API).
 *
 * Tum varyant, boyut ve renk kombinasyonlarini destekler.
 * Loading, disabled, icon, fullWidth ozellikleri dahil.
 *
 * @example Props-based
 * ```tsx
 * <Button variant="solid" color="accent" size="md">
 *   Kaydet
 * </Button>
 *
 * <Button variant="ghost" leftIcon={<SearchIcon />}>
 *   Ara
 * </Button>
 * ```
 *
 * @example Compound
 * ```tsx
 * <Button variant="solid">
 *   <Button.LeftIcon><SearchIcon /></Button.LeftIcon>
 *   Ara
 *   <Button.RightIcon><ArrowIcon /></Button.RightIcon>
 * </Button>
 * ```
 */
const ButtonBase = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    variant: variantProp,
    size: sizeProp,
    color: colorProp,
    fullWidth = false,
    leftIcon,
    rightIcon,
    loadingText,
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

  const recipeClass = buttonRecipe({ variant, size, color, fullWidth: fullWidth || undefined });
  const rootSlot = getSlotProps('root', recipeClass, classNames, styles, inlineStyle);
  const combinedClassName = className
    ? `${rootSlot.className} ${className}`
    : rootSlot.className;

  const spinnerSlot = getSlotProps('spinner', spinnerStyle, classNames, styles);
  const leftIconSlot = getSlotProps('leftIcon', iconStyle, classNames, styles);
  const rightIconSlot = getSlotProps('rightIcon', iconStyle, classNames, styles);

  const ctxValue: ButtonContextValue = {
    size,
    variant,
    color,
    disabled,
    loading: isLoading,
    classNames,
    styles,
  };

  // Loading durumda spinner goster
  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <span
            className={spinnerSlot.className}
            style={spinnerSlot.style}
            aria-hidden="true"
          />
          {loadingText ?? children}
        </>
      );
    }

    // Compound mode: leftIcon/rightIcon prop yoksa children dogrudan render edilir
    // (children icinde Button.LeftIcon / Button.RightIcon olabilir)
    if (!leftIcon && !rightIcon) {
      return children;
    }

    // Props-based mode
    return (
      <>
        {leftIcon ? (
          <span
            className={leftIconSlot.className}
            style={leftIconSlot.style}
            aria-hidden="true"
          >
            {leftIcon}
          </span>
        ) : null}
        {children}
        {rightIcon ? (
          <span
            className={rightIconSlot.className}
            style={rightIconSlot.style}
            aria-hidden="true"
          >
            {rightIcon}
          </span>
        ) : null}
      </>
    );
  };

  return (
    <ButtonContext.Provider value={ctxValue}>
      <button
        {...buttonProps}
        ref={forwardedRef}
        id={id}
        className={combinedClassName}
        style={rootSlot.style}
      >
        {renderContent()}
      </button>
    </ButtonContext.Provider>
  );
});

/**
 * Button bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Button leftIcon={<PlusIcon />}>Ekle</Button>
 * ```
 *
 * @example Compound
 * ```tsx
 * <Button>
 *   <Button.LeftIcon><PlusIcon /></Button.LeftIcon>
 *   Ekle
 * </Button>
 * ```
 */
export const Button = Object.assign(ButtonBase, {
  LeftIcon: ButtonLeftIcon,
  RightIcon: ButtonRightIcon,
});

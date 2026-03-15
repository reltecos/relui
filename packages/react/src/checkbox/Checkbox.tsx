/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Checkbox — styled React checkbox component (Dual API).
 * Checkbox — stilize edilmiş React checkbox bileseni (Dual API).
 *
 * Props-based: `<Checkbox>Kabul ediyorum</Checkbox>`
 * Compound:    `<Checkbox><Checkbox.Indicator /><Checkbox.Label>Kabul ediyorum</Checkbox.Label></Checkbox>`
 *
 * Hidden native input + custom visual box pattern.
 * 3 boyut x 5 renk, indeterminate destegi, label ile birlikte kullanilir.
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { CheckboxSize, CheckboxColor, CheckboxCheckedState } from '@relteco/relui-core';
import { CheckIcon, MinusIcon } from '@relteco/relui-icons';
import { useCheckbox, type UseCheckboxProps } from './useCheckbox';
import {
  checkboxControlRecipe,
  checkboxLabelStyle,
  checkIconStyle,
  hiddenInputStyle,
} from './checkbox.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

/** Checkbox slot isimleri. */
export type CheckboxSlot = 'root' | 'control' | 'icon' | 'label';

// ── Context (Compound API) ──────────────────────────

interface CheckboxContextValue {
  size: CheckboxSize;
  color: CheckboxColor;
  checked: CheckboxCheckedState;
  disabled: boolean;
  classNames: ClassNames<CheckboxSlot> | undefined;
  styles: Styles<CheckboxSlot> | undefined;
  controlProps: Record<string, unknown>;
}

const CheckboxContext = createContext<CheckboxContextValue | null>(null);

function useCheckboxContext(): CheckboxContextValue {
  const ctx = useContext(CheckboxContext);
  if (!ctx) throw new Error('Checkbox compound sub-components must be used within <Checkbox>.');
  return ctx;
}

// ── Compound: Checkbox.Indicator ────────────────────

/** Checkbox.Indicator props */
export interface CheckboxIndicatorProps {
  /** Ek className / Additional className */
  className?: string;
}

const CheckboxIndicator = forwardRef<HTMLDivElement, CheckboxIndicatorProps>(
  function CheckboxIndicator(props, ref) {
    const { className } = props;
    const ctx = useCheckboxContext();
    const controlSlot = getSlotProps(
      'control',
      checkboxControlRecipe({ size: ctx.size, color: ctx.color }),
      ctx.classNames,
      ctx.styles,
    );
    const iconSlot = getSlotProps('icon', checkIconStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${controlSlot.className} ${className}` : controlSlot.className;

    return (
      <div
        ref={ref}
        {...(ctx.controlProps as Record<string, unknown>)}
        className={cls}
        style={controlSlot.style}
        data-testid="checkbox-indicator"
      >
        {renderIcon(ctx.checked, ctx.size, iconSlot.className, iconSlot.style)}
      </div>
    );
  },
);

// ── Compound: Checkbox.Label ────────────────────────

/** Checkbox.Label props */
export interface CheckboxLabelProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const CheckboxLabel = forwardRef<HTMLSpanElement, CheckboxLabelProps>(
  function CheckboxLabel(props, ref) {
    const { children, className } = props;
    const ctx = useCheckboxContext();
    const labelSlot = getSlotProps('label', undefined, ctx.classNames, ctx.styles);
    const cls = className
      ? labelSlot.className ? `${labelSlot.className} ${className}` : className
      : labelSlot.className || undefined;

    return (
      <span
        ref={ref}
        className={cls}
        style={labelSlot.style}
        data-testid="checkbox-label"
      >
        {children}
      </span>
    );
  },
);

// ── Component Props ───────────────────────────────────

/**
 * Checkbox bilesen props.
 * Checkbox component props.
 */
export interface CheckboxComponentProps extends UseCheckboxProps, SlotStyleProps<CheckboxSlot> {
  /** Boyut / Size */
  size?: CheckboxSize;

  /** Renk semasi / Color scheme */
  color?: CheckboxColor;

  /** Label metni veya ReactNode / Label text or ReactNode */
  children?: ReactNode;

  /** Ek CSS sinifi / Additional CSS class */
  className?: string;

  /** HTML id */
  id?: string;

  /** Inline stil / Inline style */
  style?: React.CSSProperties;

  /** aria-label (label yoksa zorunlu) */
  'aria-label'?: string;

  /** aria-labelledby */
  'aria-labelledby'?: string;

  /** aria-describedby */
  'aria-describedby'?: string;
}

/**
 * Checkbox boyutuna gore ikon boyutu.
 * Icon size by checkbox size.
 */
const ICON_SIZE: Record<CheckboxSize, number> = {
  sm: 10,
  md: 12,
  lg: 16,
};

/**
 * Checked state gore ikon render et.
 * Render icon based on checked state.
 */
function renderIcon(
  checked: CheckboxCheckedState,
  size: CheckboxSize,
  iconClassName: string,
  iconStyle: React.CSSProperties | undefined,
): ReactNode {
  const iconSize = ICON_SIZE[size];
  if (checked === 'indeterminate') {
    return (
      <MinusIcon size={iconSize} strokeWidth={2.5} className={iconClassName} style={iconStyle} />
    );
  }
  if (checked) {
    return (
      <CheckIcon size={iconSize} strokeWidth={2.5} className={iconClassName} style={iconStyle} />
    );
  }
  return null;
}

/**
 * Checkbox label font size map.
 */
const LABEL_FONT_SIZE: Record<CheckboxSize, string> = {
  sm: 'var(--rel-text-xs)',
  md: 'var(--rel-text-sm)',
  lg: 'var(--rel-text-base)',
};

// ── Component ─────────────────────────────────────────

/**
 * Checkbox — RelUI checkbox bileseni (Dual API).
 * Checkbox — RelUI checkbox component (Dual API).
 *
 * @example Props-based
 * ```tsx
 * <Checkbox>Sartlari kabul ediyorum</Checkbox>
 * ```
 *
 * @example Compound
 * ```tsx
 * <Checkbox>
 *   <Checkbox.Indicator />
 *   <Checkbox.Label>Sartlari kabul ediyorum</Checkbox.Label>
 * </Checkbox>
 * ```
 */
const CheckboxBase = forwardRef<HTMLDivElement, CheckboxComponentProps>(function Checkbox(
  {
    size = 'md',
    color = 'accent',
    children,
    className,
    id,
    style: inlineStyle,
    classNames,
    styles,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    name,
    value,
    ...hookProps
  },
  forwardedRef,
) {
  const { controlProps, checked, isDisabled } = useCheckbox(hookProps);

  // Compound mode algilama: children icinde Checkbox.Indicator veya Checkbox.Label var mi
  const isCompound = hasCompoundChildren(children);

  const ctxValue: CheckboxContextValue = {
    size,
    color,
    checked,
    disabled: isDisabled,
    classNames,
    styles,
    controlProps: controlProps as unknown as Record<string, unknown>,
  };

  // Hidden native input — form entegrasyonu icin
  const hiddenInput = name ? (
    <input
      className={hiddenInputStyle}
      type="checkbox"
      name={name}
      value={value ?? 'on'}
      checked={checked === true}
      disabled={isDisabled}
      readOnly
      tabIndex={-1}
      aria-hidden="true"
    />
  ) : null;

  // ── Compound API ──
  if (isCompound) {
    const rootSlot = getSlotProps('root', checkboxLabelStyle, classNames, styles, {
      fontSize: LABEL_FONT_SIZE[size],
      ...inlineStyle,
    });
    const rootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    return (
      <CheckboxContext.Provider value={ctxValue}>
        <label
          ref={forwardedRef as React.Ref<HTMLLabelElement>}
          id={id}
          className={rootClassName}
          style={rootSlot.style}
          data-disabled={isDisabled ? '' : undefined}
        >
          {hiddenInput}
          {children}
        </label>
      </CheckboxContext.Provider>
    );
  }

  // ── Props-based API ──

  // Slot props
  const controlSlot = getSlotProps(
    'control',
    checkboxControlRecipe({ size, color }),
    classNames,
    styles,
  );
  const iconSlot = getSlotProps('icon', checkIconStyle, classNames, styles);
  const labelSlot = getSlotProps('label', undefined, classNames, styles);

  // Control (kutucuk) — visual checkbox
  const control = (
    <div
      {...controlProps}
      className={controlSlot.className}
      style={controlSlot.style}
      aria-label={!children ? ariaLabel : undefined}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
    >
      {renderIcon(checked, size, iconSlot.className, iconSlot.style)}
    </div>
  );

  // Label yoksa sadece control dondur
  if (!children) {
    const rootSlot = getSlotProps('root', undefined, classNames, styles, {
      display: 'inline-flex',
      ...inlineStyle,
    });
    const rootClassName = className
      ? rootSlot.className
        ? `${rootSlot.className} ${className}`
        : className
      : rootSlot.className || undefined;

    return (
      <div
        ref={forwardedRef}
        id={id}
        className={rootClassName}
        style={rootSlot.style}
      >
        {hiddenInput}
        {control}
      </div>
    );
  }

  // Label varsa wrapper ile dondur
  const rootSlot = getSlotProps('root', checkboxLabelStyle, classNames, styles, {
    fontSize: LABEL_FONT_SIZE[size],
    ...inlineStyle,
  });
  const rootClassName = className
    ? `${rootSlot.className} ${className}`
    : rootSlot.className;

  return (
    <label
      ref={forwardedRef as React.Ref<HTMLLabelElement>}
      id={id}
      className={rootClassName}
      style={rootSlot.style}
      data-disabled={isDisabled ? '' : undefined}
    >
      {hiddenInput}
      {control}
      <span className={labelSlot.className || undefined} style={labelSlot.style}>
        {children}
      </span>
    </label>
  );
});

/**
 * Compound children algilama: children icinde Checkbox.Indicator veya Checkbox.Label
 * sub-component tipi var mi kontrol eder.
 */
function hasCompoundChildren(children: ReactNode): boolean {
  if (!children) return false;
  const childArray = Array.isArray(children) ? children : [children];
  return childArray.some((child) => {
    if (child && typeof child === 'object' && 'type' in child) {
      return child.type === CheckboxIndicator || child.type === CheckboxLabel;
    }
    return false;
  });
}

/**
 * Checkbox bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Checkbox checked>Kabul ediyorum</Checkbox>
 * ```
 *
 * @example Compound
 * ```tsx
 * <Checkbox checked>
 *   <Checkbox.Indicator />
 *   <Checkbox.Label>Kabul ediyorum</Checkbox.Label>
 * </Checkbox>
 * ```
 */
export const Checkbox = Object.assign(CheckboxBase, {
  Indicator: CheckboxIndicator,
  Label: CheckboxLabel,
});

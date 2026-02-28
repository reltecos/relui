/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Checkbox — styled React checkbox component.
 * Checkbox — stilize edilmiş React checkbox bileşeni.
 *
 * Hidden native input + custom visual box pattern.
 * 3 boyut × 5 renk, indeterminate desteği, label ile birlikte kullanılır.
 *
 * @packageDocumentation
 */

import { forwardRef, type ReactNode } from 'react';
import type { CheckboxSize, CheckboxColor, CheckboxCheckedState } from '@relteco/relui-core';
import { CheckIcon, MinusIcon } from '@relteco/relui-icons';
import { useCheckbox, type UseCheckboxProps } from './useCheckbox';
import {
  checkboxControlRecipe,
  checkboxLabelStyle,
  checkIconStyle,
  hiddenInputStyle,
} from './checkbox.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

/** Checkbox slot isimleri. */
export type CheckboxSlot = 'root' | 'control' | 'icon' | 'label';

/**
 * Checkbox bileşen props'ları.
 * Checkbox component props.
 */
export interface CheckboxComponentProps extends UseCheckboxProps, SlotStyleProps<CheckboxSlot> {
  /** Boyut / Size */
  size?: CheckboxSize;

  /** Renk şeması / Color scheme */
  color?: CheckboxColor;

  /** Label metni veya ReactNode / Label text or ReactNode */
  children?: ReactNode;

  /** Ek CSS sınıfı / Additional CSS class */
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
 * Checkbox boyutuna göre ikon boyutu.
 * Icon size by checkbox size.
 */
const ICON_SIZE: Record<CheckboxSize, number> = {
  sm: 10,
  md: 12,
  lg: 16,
};

/**
 * Checked state'e göre ikon render et.
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

/**
 * Checkbox — RelUI checkbox bileşeni.
 * Checkbox — RelUI checkbox component.
 *
 * @example
 * ```tsx
 * <Checkbox>Şartları kabul ediyorum</Checkbox>
 *
 * <Checkbox
 *   checked={isChecked}
 *   onCheckedChange={setIsChecked}
 *   color="success"
 * >
 *   Beni hatırla
 * </Checkbox>
 *
 * <Checkbox checked="indeterminate">
 *   Kısmen seçili
 * </Checkbox>
 * ```
 */
export const Checkbox = forwardRef<HTMLDivElement, CheckboxComponentProps>(function Checkbox(
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

  // Slot props
  const controlSlot = getSlotProps(
    'control',
    checkboxControlRecipe({ size, color }),
    classNames,
    styles,
  );
  const iconSlot = getSlotProps('icon', checkIconStyle, classNames, styles);
  const labelSlot = getSlotProps('label', undefined, classNames, styles);

  // Hidden native input — form entegrasyonu için
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

  // Label yoksa sadece control döndür
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

  // Label varsa wrapper ile döndür
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

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Radio — styled React radio component (Dual API).
 * Radio — stilize edilmis React radio bileseni (Dual API).
 *
 * Props-based: `<Radio value="a">Secenek A</Radio>`
 * Compound:    `<Radio value="a"><Radio.Indicator /><Radio.Label>Secenek A</Radio.Label></Radio>`
 *
 * Hidden native input + custom visual circle pattern.
 * 3 boyut x 5 renk, RadioGroup ile birlikte kullanilir.
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { RadioSize, RadioColor } from '@relteco/relui-core';
import { useRadio, type UseRadioProps } from './useRadio';
import { useRadioGroupContext } from '../radio-group/RadioGroupContext';
import {
  radioControlRecipe,
  radioDotStyle,
  radioLabelStyle,
  hiddenRadioInputStyle,
} from './radio.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

/** Radio slot isimleri. */
export type RadioSlot = 'root' | 'control' | 'dot' | 'label';

// ── Context (Compound API) ──────────────────────────

interface RadioContextValue {
  size: RadioSize;
  color: RadioColor;
  checked: boolean;
  disabled: boolean;
  classNames: ClassNames<RadioSlot> | undefined;
  styles: Styles<RadioSlot> | undefined;
  controlProps: Record<string, unknown>;
}

const RadioContext = createContext<RadioContextValue | null>(null);

function useRadioContext(): RadioContextValue {
  const ctx = useContext(RadioContext);
  if (!ctx) throw new Error('Radio compound sub-components must be used within <Radio>.');
  return ctx;
}

// ── Compound: Radio.Indicator ────────────────────────

/** Radio.Indicator props */
export interface RadioIndicatorProps {
  /** Ek className / Additional className */
  className?: string;
}

const RadioIndicator = forwardRef<HTMLDivElement, RadioIndicatorProps>(
  function RadioIndicator(props, ref) {
    const { className } = props;
    const ctx = useRadioContext();
    const controlClassName = radioControlRecipe({ size: ctx.size, color: ctx.color });
    const controlSlot = getSlotProps('control', controlClassName, ctx.classNames, ctx.styles);
    const dotSlot = getSlotProps('dot', radioDotStyle, ctx.classNames, ctx.styles, {
      width: DOT_SIZE[ctx.size],
      height: DOT_SIZE[ctx.size],
      color: ctx.checked ? undefined : 'transparent',
    });
    const cls = className ? `${controlSlot.className} ${className}` : controlSlot.className;

    return (
      <div
        ref={ref}
        {...(ctx.controlProps as Record<string, unknown>)}
        className={cls}
        style={controlSlot.style}
        data-testid="radio-indicator"
      >
        {ctx.checked && (
          <span
            className={dotSlot.className}
            style={dotSlot.style}
            data-testid="radio-dot"
          />
        )}
      </div>
    );
  },
);

// ── Compound: Radio.Label ────────────────────────────

/** Radio.Label props */
export interface RadioLabelProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const RadioLabel = forwardRef<HTMLSpanElement, RadioLabelProps>(
  function RadioLabel(props, ref) {
    const { children, className } = props;
    const ctx = useRadioContext();
    const labelSlot = getSlotProps('label', undefined, ctx.classNames, ctx.styles);
    const cls = className
      ? labelSlot.className ? `${labelSlot.className} ${className}` : className
      : labelSlot.className || undefined;

    return (
      <span
        ref={ref}
        className={cls}
        style={labelSlot.style}
        data-testid="radio-label"
      >
        {children}
      </span>
    );
  },
);

// ── Component Props ───────────────────────────────────

/**
 * Radio bilesen props.
 * Radio component props.
 */
export interface RadioComponentProps extends UseRadioProps, SlotStyleProps<RadioSlot> {
  /** Boyut / Size */
  size?: RadioSize;

  /** Renk semasi / Color scheme */
  color?: RadioColor;

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
 * Dot boyutu map / Dot size map.
 */
const DOT_SIZE: Record<RadioSize, string> = {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.625rem',
};

/**
 * Radio label font size map.
 */
const LABEL_FONT_SIZE: Record<RadioSize, string> = {
  sm: 'var(--rel-text-xs)',
  md: 'var(--rel-text-sm)',
  lg: 'var(--rel-text-base)',
};

// ── Component ─────────────────────────────────────────

/**
 * Radio — RelUI radio bileseni (Dual API).
 * Radio — RelUI radio component (Dual API).
 *
 * RadioGroup icinde veya bagimsiz kullanilabilir.
 * RadioGroup context inden size/color/name/value devralir.
 *
 * @example Props-based
 * ```tsx
 * <RadioGroup value={selected} onValueChange={setSelected}>
 *   <Radio value="a">Secenek A</Radio>
 *   <Radio value="b">Secenek B</Radio>
 * </RadioGroup>
 * ```
 *
 * @example Compound
 * ```tsx
 * <RadioGroup value={selected} onValueChange={setSelected}>
 *   <Radio value="a">
 *     <Radio.Indicator />
 *     <Radio.Label>Secenek A</Radio.Label>
 *   </Radio>
 * </RadioGroup>
 * ```
 */
const RadioBase = forwardRef<HTMLDivElement, RadioComponentProps>(function Radio(
  {
    size: sizeProp,
    color: colorProp,
    children,
    className,
    id,
    style: inlineStyle,
    classNames,
    styles,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    ...hookProps
  },
  forwardedRef,
) {
  // RadioGroup context inden size/color al
  const groupCtx = useRadioGroupContext();
  const size = sizeProp ?? groupCtx?.size ?? 'md';
  const color = colorProp ?? groupCtx?.color ?? 'accent';

  const { controlProps, checked, isDisabled, name } = useRadio(hookProps);

  // Compound mode algilama
  const isCompound = hasCompoundChildren(children);

  const ctxValue: RadioContextValue = {
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
      className={hiddenRadioInputStyle}
      type="radio"
      name={name}
      value={hookProps.value ?? ''}
      checked={checked}
      disabled={isDisabled}
      readOnly
      tabIndex={-1}
      aria-hidden="true"
    />
  ) : null;

  // ── Compound API ──
  if (isCompound) {
    const rootSlot = getSlotProps('root', radioLabelStyle, classNames, styles, {
      fontSize: LABEL_FONT_SIZE[size],
      ...inlineStyle,
    });
    const rootClass = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    return (
      <RadioContext.Provider value={ctxValue}>
        <label
          ref={forwardedRef as React.Ref<HTMLLabelElement>}
          id={id}
          className={rootClass}
          style={rootSlot.style}
          data-disabled={isDisabled ? '' : undefined}
        >
          {hiddenInput}
          {children}
        </label>
      </RadioContext.Provider>
    );
  }

  // ── Props-based API ──

  const controlClassName = radioControlRecipe({ size, color });
  const controlSlot = getSlotProps('control', controlClassName, classNames, styles);
  const dotSlot = getSlotProps('dot', radioDotStyle, classNames, styles, {
    width: DOT_SIZE[size],
    height: DOT_SIZE[size],
    color: controlProps['data-state'] === 'checked' ? undefined : 'transparent',
  });

  // Control (daire) — visual radio
  const control = (
    <div
      {...controlProps}
      className={controlSlot.className}
      style={controlSlot.style}
      aria-label={!children ? ariaLabel : undefined}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      data-testid="radio-control"
    >
      {checked && (
        <span
          className={dotSlot.className}
          style={dotSlot.style}
          data-testid="radio-dot"
        />
      )}
    </div>
  );

  // Label yoksa sadece control dondur
  if (!children) {
    const rootSlot = getSlotProps('root', undefined, classNames, styles, {
      display: 'inline-flex',
      ...inlineStyle,
    });
    const rootClass = className
      ? `${rootSlot.className} ${className}`.trim()
      : rootSlot.className || undefined;

    return (
      <div
        ref={forwardedRef}
        id={id}
        className={rootClass}
        style={rootSlot.style}
      >
        {hiddenInput}
        {control}
      </div>
    );
  }

  // Label varsa wrapper ile dondur
  const rootSlot = getSlotProps('root', radioLabelStyle, classNames, styles, {
    fontSize: LABEL_FONT_SIZE[size],
    ...inlineStyle,
  });
  const rootClass = className
    ? `${rootSlot.className} ${className}`
    : rootSlot.className;
  const labelSlot = getSlotProps('label', undefined, classNames, styles);

  return (
    <label
      ref={forwardedRef as React.Ref<HTMLLabelElement>}
      id={id}
      className={rootClass}
      style={rootSlot.style}
      data-disabled={isDisabled ? '' : undefined}
    >
      {hiddenInput}
      {control}
      <span className={labelSlot.className || undefined} style={labelSlot.style} data-testid="radio-label">{children}</span>
    </label>
  );
});

/**
 * Compound children algilama: children icinde Radio.Indicator veya Radio.Label
 * sub-component tipi var mi kontrol eder.
 */
function hasCompoundChildren(children: ReactNode): boolean {
  if (!children) return false;
  const childArray = Array.isArray(children) ? children : [children];
  return childArray.some((child) => {
    if (child && typeof child === 'object' && 'type' in child) {
      return child.type === RadioIndicator || child.type === RadioLabel;
    }
    return false;
  });
}

/**
 * Radio bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Radio value="a">Secenek A</Radio>
 * ```
 *
 * @example Compound
 * ```tsx
 * <Radio value="a">
 *   <Radio.Indicator />
 *   <Radio.Label>Secenek A</Radio.Label>
 * </Radio>
 * ```
 */
export const Radio = Object.assign(RadioBase, {
  Indicator: RadioIndicator,
  Label: RadioLabel,
});

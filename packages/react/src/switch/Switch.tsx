/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Switch — styled React switch (toggle) component (Dual API).
 * Switch — stilize edilmis React switch (toggle) bileseni (Dual API).
 *
 * Props-based: `<Switch>Karanlik mod</Switch>`
 * Compound:    `<Switch><Switch.Track><Switch.Thumb /></Switch.Track><Switch.Label>Karanlik mod</Switch.Label></Switch>`
 *
 * Hidden native input + custom visual pill + knob pattern.
 * 3 boyut x 5 renk, label ile birlikte kullanilir.
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { SwitchSize, SwitchColor } from '@relteco/relui-core';
import { useSwitch, type UseSwitchProps } from './useSwitch';
import {
  switchTrackRecipe,
  switchKnobStyle,
  switchLabelStyle,
  hiddenSwitchInputStyle,
} from './switch.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

/** Switch slot isimleri. */
export type SwitchSlot = 'root' | 'track' | 'knob' | 'label';

// ── Context (Compound API) ──────────────────────────

interface SwitchContextValue {
  size: SwitchSize;
  color: SwitchColor;
  checked: boolean;
  disabled: boolean;
  classNames: ClassNames<SwitchSlot> | undefined;
  styles: Styles<SwitchSlot> | undefined;
  trackProps: Record<string, unknown>;
}

const SwitchContext = createContext<SwitchContextValue | null>(null);

function useSwitchContext(): SwitchContextValue {
  const ctx = useContext(SwitchContext);
  if (!ctx) throw new Error('Switch compound sub-components must be used within <Switch>.');
  return ctx;
}

// ── Compound: Switch.Track ──────────────────────────

/** Switch.Track props */
export interface SwitchTrackProps {
  /** Icerik (genellikle Switch.Thumb) / Content (usually Switch.Thumb) */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const SwitchTrack = forwardRef<HTMLDivElement, SwitchTrackProps>(
  function SwitchTrack(props, ref) {
    const { children, className } = props;
    const ctx = useSwitchContext();
    const trackClassName = switchTrackRecipe({ size: ctx.size, color: ctx.color });
    const trackSlot = getSlotProps('track', trackClassName, ctx.classNames, ctx.styles);
    const cls = className ? `${trackSlot.className} ${className}` : trackSlot.className;

    return (
      <div
        ref={ref}
        {...(ctx.trackProps as unknown as Record<string, unknown>)}
        className={cls}
        style={trackSlot.style}
        data-testid="switch-track"
      >
        {children}
      </div>
    );
  },
);

// ── Compound: Switch.Thumb ──────────────────────────

/** Switch.Thumb props */
export interface SwitchThumbProps {
  /** Ek className / Additional className */
  className?: string;
}

const SwitchThumb = forwardRef<HTMLSpanElement, SwitchThumbProps>(
  function SwitchThumb(props, ref) {
    const { className } = props;
    const ctx = useSwitchContext();
    const knobSlot = getSlotProps('knob', switchKnobStyle, ctx.classNames, ctx.styles, {
      width: KNOB_SIZE[ctx.size],
      height: KNOB_SIZE[ctx.size],
    });
    const cls = className ? `${knobSlot.className} ${className}` : knobSlot.className;

    return (
      <span
        ref={ref}
        className={cls}
        style={knobSlot.style}
        data-testid="switch-thumb"
      />
    );
  },
);

// ── Compound: Switch.Label ──────────────────────────

/** Switch.Label props */
export interface SwitchLabelProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const SwitchLabel = forwardRef<HTMLSpanElement, SwitchLabelProps>(
  function SwitchLabel(props, ref) {
    const { children, className } = props;
    const ctx = useSwitchContext();
    const labelSlot = getSlotProps('label', undefined, ctx.classNames, ctx.styles);
    const cls = className
      ? labelSlot.className ? `${labelSlot.className} ${className}` : className
      : labelSlot.className || undefined;

    return (
      <span
        ref={ref}
        className={cls}
        style={labelSlot.style}
        data-testid="switch-label"
      >
        {children}
      </span>
    );
  },
);

// ── Component Props ───────────────────────────────────

/**
 * Switch bilesen props.
 * Switch component props.
 */
export interface SwitchComponentProps extends UseSwitchProps, SlotStyleProps<SwitchSlot> {
  /** Boyut / Size */
  size?: SwitchSize;

  /** Renk semasi / Color scheme */
  color?: SwitchColor;

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
 * Knob boyutu map / Knob size map.
 */
const KNOB_SIZE: Record<SwitchSize, string> = {
  sm: '0.75rem',
  md: '1rem',
  lg: '1.25rem',
};

/**
 * Switch label font size map.
 */
const LABEL_FONT_SIZE: Record<SwitchSize, string> = {
  sm: 'var(--rel-text-xs)',
  md: 'var(--rel-text-sm)',
  lg: 'var(--rel-text-base)',
};

// ── Component ─────────────────────────────────────────

/**
 * Switch — RelUI switch (toggle) bileseni (Dual API).
 * Switch — RelUI switch (toggle) component (Dual API).
 *
 * @example Props-based
 * ```tsx
 * <Switch>Karanlik mod</Switch>
 * ```
 *
 * @example Compound
 * ```tsx
 * <Switch>
 *   <Switch.Track><Switch.Thumb /></Switch.Track>
 *   <Switch.Label>Karanlik mod</Switch.Label>
 * </Switch>
 * ```
 */
const SwitchBase = forwardRef<HTMLDivElement, SwitchComponentProps>(function Switch(
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
  const { trackProps, checked, isDisabled } = useSwitch(hookProps);

  // Compound mode algilama
  const isCompound = hasCompoundChildren(children);

  const ctxValue: SwitchContextValue = {
    size,
    color,
    checked,
    disabled: isDisabled,
    classNames,
    styles,
    trackProps: trackProps as unknown as Record<string, unknown>,
  };

  const trackClassName = switchTrackRecipe({ size, color });
  const trackSlot = getSlotProps('track', trackClassName, classNames, styles);
  const knobSlot = getSlotProps('knob', switchKnobStyle, classNames, styles, {
    width: KNOB_SIZE[size],
    height: KNOB_SIZE[size],
  });

  // Hidden native input — form entegrasyonu icin
  const hiddenInput = name ? (
    <input
      className={hiddenSwitchInputStyle}
      type="checkbox"
      name={name}
      value={value ?? 'on'}
      checked={checked}
      disabled={isDisabled}
      readOnly
      tabIndex={-1}
      aria-hidden="true"
    />
  ) : null;

  // ── Compound API ──
  if (isCompound) {
    const rootSlot = getSlotProps('root', switchLabelStyle, classNames, styles, {
      fontSize: LABEL_FONT_SIZE[size],
      ...inlineStyle,
    });
    const rootClass = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    return (
      <SwitchContext.Provider value={ctxValue}>
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
      </SwitchContext.Provider>
    );
  }

  // ── Props-based API ──

  // Track (pill) — visual switch
  const track = (
    <div
      {...trackProps}
      className={trackSlot.className}
      style={trackSlot.style}
      aria-label={!children ? ariaLabel : undefined}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
    >
      <span
        className={knobSlot.className}
        style={knobSlot.style}
      />
    </div>
  );

  // Label yoksa sadece track dondur
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
        {track}
      </div>
    );
  }

  // Label varsa wrapper ile dondur
  const rootSlot = getSlotProps('root', switchLabelStyle, classNames, styles, {
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
      {track}
      <span className={labelSlot.className || undefined} style={labelSlot.style}>{children}</span>
    </label>
  );
});

/**
 * Compound children algilama: children icinde Switch.Track, Switch.Thumb veya Switch.Label
 * sub-component tipi var mi kontrol eder.
 */
function hasCompoundChildren(children: ReactNode): boolean {
  if (!children) return false;
  const childArray = Array.isArray(children) ? children : [children];
  return childArray.some((child) => {
    if (child && typeof child === 'object' && 'type' in child) {
      return child.type === SwitchTrack || child.type === SwitchThumb || child.type === SwitchLabel;
    }
    return false;
  });
}

/**
 * Switch bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Switch checked>Karanlik mod</Switch>
 * ```
 *
 * @example Compound
 * ```tsx
 * <Switch checked>
 *   <Switch.Track><Switch.Thumb /></Switch.Track>
 *   <Switch.Label>Karanlik mod</Switch.Label>
 * </Switch>
 * ```
 */
export const Switch = Object.assign(SwitchBase, {
  Track: SwitchTrack,
  Thumb: SwitchThumb,
  Label: SwitchLabel,
});

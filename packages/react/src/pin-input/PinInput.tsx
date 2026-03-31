/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * PinInput — PIN/OTP giris bilesen (Dual API).
 * PinInput — PIN/OTP input component (Dual API).
 *
 * Props-based: `<PinInput length={4} onChange={fn} />`
 * Compound:    `<PinInput length={4}><PinInput.Field index={0} /></PinInput>`
 *
 * @packageDocumentation
 */

import {
  forwardRef,
  createContext,
  useContext,
  useRef,
  useEffect,
  type ReactNode,
} from 'react';
import type { PinInputType } from '@relteco/relui-core';
import {
  rootStyle,
  sizeStyles,
  fieldStyle,
  fieldFilledStyle,
  fieldSizeStyles,
} from './pin-input.css';
import { usePinInput } from './usePinInput';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** PinInput slot isimleri / PinInput slot names */
export type PinInputSlot = 'root' | 'field';

// ── Types ─────────────────────────────────────────────

/** PinInput boyutu / PinInput size */
export type PinInputSize = 'sm' | 'md' | 'lg';

// ── Context (Compound API) ──────────────────────────

interface PinInputContextValue {
  values: readonly string[];
  focusIndex: number;
  isComplete: boolean;
  size: PinInputSize;
  mask: boolean;
  type: PinInputType;
  setChar: (index: number, char: string) => void;
  backspace: (index: number) => void;
  paste: (value: string) => void;
  focusField: (index: number) => void;
  classNames: ClassNames<PinInputSlot> | undefined;
  styles: Styles<PinInputSlot> | undefined;
  registerFieldRef: (index: number, el: HTMLInputElement | null) => void;
  disabled: boolean;
}

const PinInputContext = createContext<PinInputContextValue | null>(null);

function usePinInputContext(): PinInputContextValue {
  const ctx = useContext(PinInputContext);
  if (!ctx) throw new Error('PinInput compound sub-components must be used within <PinInput>.');
  return ctx;
}

// ── Compound: PinInput.Field ────────────────────────

/** PinInput.Field props */
export interface PinInputFieldProps {
  /** Alan indeksi / Field index */
  index: number;
  /** Ek className / Additional className */
  className?: string;
}

const PinInputField = forwardRef<HTMLInputElement, PinInputFieldProps>(
  function PinInputField(props, ref) {
    const { index, className } = props;
    const ctx = usePinInputContext();
    const internalRef = useRef<HTMLInputElement | null>(null);

    // Register ref for focus management
    useEffect(() => {
      ctx.registerFieldRef(index, internalRef.current);
      return () => {
        ctx.registerFieldRef(index, null);
      };
    }, [index, ctx]);

    const isFilled = ctx.values[index] !== undefined && ctx.values[index] !== '';
    const baseFieldCls = `${fieldStyle} ${fieldSizeStyles[ctx.size]}${isFilled ? ` ${fieldFilledStyle}` : ''}`;
    const slot = getSlotProps('field', baseFieldCls, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const displayValue = ctx.mask && isFilled ? '\u25CF' : (ctx.values[index] ?? '');

    return (
      <input
        ref={(el) => {
          internalRef.current = el;
          if (typeof ref === 'function') {
            ref(el);
          } else if (ref) {
            (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
          }
        }}
        type="text"
        inputMode={ctx.type === 'number' ? 'numeric' : 'text'}
        maxLength={1}
        value={displayValue}
        autoComplete={index === 0 ? 'one-time-code' : 'off'}
        disabled={ctx.disabled}
        className={cls}
        style={slot.style}
        data-testid="pin-input-field"
        data-size={ctx.size}
        aria-label={`Digit ${index + 1}`}
        onInput={(e) => {
          const input = e.currentTarget;
          const char = input.value.slice(-1);
          if (char) {
            ctx.setChar(index, char);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Backspace') {
            e.preventDefault();
            ctx.backspace(index);
          } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            ctx.focusField(index + 1);
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            ctx.focusField(index - 1);
          }
        }}
        onPaste={(e) => {
          e.preventDefault();
          const pasteData = e.clipboardData.getData('text');
          ctx.paste(pasteData);
        }}
        onFocus={() => {
          ctx.focusField(index);
        }}
      />
    );
  },
);

// ── Component Props ───────────────────────────────────

/** PinInput bilesen prop'lari / PinInput component props */
export interface PinInputComponentProps extends SlotStyleProps<PinInputSlot> {
  /** Alan sayisi / Number of fields (default: 4) */
  length?: number;
  /** Baslangic degeri / Default value */
  defaultValue?: string;
  /** Giris tipi / Input type (default: 'number') */
  type?: PinInputType;
  /** Karakterleri gizle / Mask characters */
  mask?: boolean;
  /** Boyut / Size (default: 'md') */
  size?: PinInputSize;
  /** Deger degisince callback / Callback when value changes */
  onChange?: (value: string) => void;
  /** Tum alanlar dolunca callback / Callback when all fields are filled */
  onComplete?: (value: string) => void;
  /** Devre disi / Disabled */
  disabled?: boolean;
  /** Otomatik odaklanma / Auto focus */
  autoFocus?: boolean;
  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────

const PinInputBase = forwardRef<HTMLDivElement, PinInputComponentProps>(
  function PinInput(props, ref) {
    const {
      length = 4,
      defaultValue,
      type = 'number',
      mask = false,
      size = 'md',
      onChange,
      onComplete,
      disabled = false,
      autoFocus = false,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const hook = usePinInput({
      length,
      defaultValue,
      type,
      mask,
      onChange,
      onComplete,
    });

    const fieldRefs = useRef<(HTMLInputElement | null)[]>([]);

    const registerFieldRef = (index: number, el: HTMLInputElement | null) => {
      fieldRefs.current[index] = el;
    };

    // Focus management
    useEffect(() => {
      const el = fieldRefs.current[hook.focusIndex];
      if (el && document.activeElement !== el) {
        // Only focus if a field in this component already has focus,
        // or if autoFocus is requested on first render
        const anyFieldFocused = fieldRefs.current.some(
          (fieldEl) => fieldEl === document.activeElement,
        );
        if (anyFieldFocused) {
          el.focus();
        }
      }
    }, [hook.focusIndex]);

    // Auto focus first field
    useEffect(() => {
      if (autoFocus && fieldRefs.current[0]) {
        fieldRefs.current[0].focus();
      }
    }, [autoFocus]);

    // ── Slots ──
    const rootSlot = getSlotProps('root', `${rootStyle} ${sizeStyles[size]}`, classNames, styles);
    const rootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    const ctxValue: PinInputContextValue = {
      values: hook.values,
      focusIndex: hook.focusIndex,
      isComplete: hook.isComplete,
      size,
      mask,
      type,
      setChar: hook.setChar,
      backspace: hook.backspace,
      paste: hook.paste,
      focusField: hook.focusField,
      classNames,
      styles,
      registerFieldRef,
      disabled,
    };

    // ── Compound API ──
    if (children) {
      return (
        <PinInputContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={rootClassName}
            style={{ ...rootSlot.style, ...styleProp }}
            data-testid="pin-input-root"
            data-size={size}
            role="group"
            aria-label="PIN input"
          >
            {children}
          </div>
        </PinInputContext.Provider>
      );
    }

    // ── Props-based API ──
    return (
      <PinInputContext.Provider value={ctxValue}>
        <div
          ref={ref}
          className={rootClassName}
          style={{ ...rootSlot.style, ...styleProp }}
          data-testid="pin-input-root"
          data-size={size}
          role="group"
          aria-label="PIN input"
        >
          {Array.from({ length }, (_, i) => (
            <PinInputField key={i} index={i} />
          ))}
        </div>
      </PinInputContext.Provider>
    );
  },
);

/**
 * PinInput bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <PinInput length={4} onChange={(val) => console.log(val)} />
 * ```
 *
 * @example Compound
 * ```tsx
 * <PinInput length={4}>
 *   <PinInput.Field index={0} />
 *   <PinInput.Field index={1} />
 *   <PinInput.Field index={2} />
 *   <PinInput.Field index={3} />
 * </PinInput>
 * ```
 */
export const PinInput = Object.assign(PinInputBase, {
  Field: PinInputField,
});

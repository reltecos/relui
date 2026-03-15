/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Textarea — styled React textarea component (Dual API).
 * Textarea — stilize edilmis React textarea bileseni (Dual API).
 *
 * Props-based: `<Textarea placeholder="Aciklama..." />`
 * Compound:    `<Textarea><Textarea.Label>Aciklama</Textarea.Label><Textarea.Counter /></Textarea>`
 *
 * 3 varyant x 5 boyut x 4 resize modu. Vanilla Extract + CSS Variables ile tema destegi.
 * autoResize ile icerik buyudukce otomatik yukseklik artisi.
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, useCallback, useRef, type ReactNode } from 'react';
import type { TextareaVariant, TextareaSize, TextareaResize } from '@relteco/relui-core';
import { useTextarea, type UseTextareaProps } from './useTextarea';
import { textareaRecipe } from './textarea.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

/** Textarea slot isimleri. */
export type TextareaSlot = 'root' | 'label' | 'counter' | 'wrapper';

// ── Context (Compound API) ──────────────────────────

interface TextareaContextValue {
  size: TextareaSize;
  variant: TextareaVariant;
  disabled: boolean;
  classNames: ClassNames<TextareaSlot> | undefined;
  styles: Styles<TextareaSlot> | undefined;
}

const TextareaContext = createContext<TextareaContextValue | null>(null);

/** Textarea compound sub-component context hook. */
export function useTextareaContext(): TextareaContextValue {
  const ctx = useContext(TextareaContext);
  if (!ctx) throw new Error('Textarea compound sub-components must be used within <Textarea>.');
  return ctx;
}

// ── Compound: Textarea.Label ────────────────────────

/** Textarea.Label props */
export interface TextareaLabelProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Label htmlFor attribute */
  htmlFor?: string;
}

const TextareaLabel = forwardRef<HTMLLabelElement, TextareaLabelProps>(
  function TextareaLabel(props, ref) {
    const { children, className, htmlFor } = props;
    const ctx = useTextareaContext();
    const slot = getSlotProps('label', undefined, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <label
        ref={ref}
        className={cls || undefined}
        style={slot.style}
        htmlFor={htmlFor}
        data-testid="textarea-label"
      >
        {children}
      </label>
    );
  },
);

// ── Compound: Textarea.Counter ──────────────────────

/** Textarea.Counter props */
export interface TextareaCounterProps {
  /** Mevcut karakter sayisi / Current character count */
  count: number;
  /** Maksimum karakter sayisi / Maximum character count */
  max?: number;
  /** Ek className / Additional className */
  className?: string;
}

const TextareaCounter = forwardRef<HTMLSpanElement, TextareaCounterProps>(
  function TextareaCounter(props, ref) {
    const { count, max, className } = props;
    const ctx = useTextareaContext();
    const slot = getSlotProps('counter', undefined, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const text = max !== undefined ? `${count}/${max}` : `${count}`;

    return (
      <span
        ref={ref}
        className={cls || undefined}
        style={slot.style}
        data-testid="textarea-counter"
        aria-live="polite"
      >
        {text}
      </span>
    );
  },
);

/**
 * Textarea bilesen props'lari.
 * Textarea component props.
 */
export interface TextareaComponentProps extends UseTextareaProps, SlotStyleProps<TextareaSlot> {
  /** Görsel varyant / Visual variant */
  variant?: TextareaVariant;

  /** Boyut / Size */
  size?: TextareaSize;

  /**
   * CSS resize davranışı / CSS resize behavior.
   * autoResize true olduğunda göz ardı edilir.
   * @default 'vertical'
   */
  resize?: TextareaResize;

  /** Placeholder metni / Placeholder text */
  placeholder?: string;

  /** Ek CSS sınıfı / Additional CSS class */
  className?: string;

  /** HTML id */
  id?: string;

  /** Inline stil / Inline style */
  style?: React.CSSProperties;

  /** Textarea value (controlled) */
  value?: string;

  /** Default value (uncontrolled) */
  defaultValue?: string;

  /** Name attribute */
  name?: string;

  /** aria-label */
  'aria-label'?: string;

  /** aria-labelledby */
  'aria-labelledby'?: string;

  /** aria-describedby */
  'aria-describedby'?: string;

  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
}

/**
 * autoResize: textarea yuksekligini scrollHeight'a gore ayarlar.
 */
function adjustHeight(el: HTMLTextAreaElement): void {
  el.style.height = 'auto';
  el.style.height = `${el.scrollHeight}px`;
}

/**
 * Textarea — RelUI textarea bileseni (Dual API).
 * Textarea — RelUI textarea component (Dual API).
 *
 * @example Props-based
 * ```tsx
 * <Textarea placeholder="Aciklama yazin..." variant="outline" />
 * ```
 *
 * @example Compound
 * ```tsx
 * <Textarea placeholder="Aciklama...">
 *   <Textarea.Label>Aciklama</Textarea.Label>
 *   <Textarea.Counter count={0} max={500} />
 * </Textarea>
 * ```
 */
const TextareaBase = forwardRef<HTMLTextAreaElement, TextareaComponentProps>(function Textarea(
  {
    variant = 'outline',
    size = 'md',
    resize = 'vertical',
    placeholder,
    className,
    id,
    style: inlineStyle,
    classNames,
    styles,
    value,
    defaultValue,
    name,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    autoResize,
    onChange,
    children,
    ...hookProps
  },
  forwardedRef,
) {
  const { textareaProps, isDisabled } = useTextarea({ ...hookProps, autoResize, onChange });

  // autoResize aktifse resize none yap
  const effectiveResize = autoResize ? 'none' : resize;

  const recipeClass = textareaRecipe({ variant, size, resize: effectiveResize });
  const rootSlot = getSlotProps('root', undefined, classNames, styles);
  const baseClassName = className ? `${recipeClass} ${className}` : recipeClass;
  const combinedClassName = rootSlot.className
    ? `${baseClassName} ${rootSlot.className}`
    : baseClassName;

  // autoResize: ref callback + onChange override
  const internalRef = useRef<HTMLTextAreaElement | null>(null);

  const setRef = useCallback(
    (el: HTMLTextAreaElement | null) => {
      internalRef.current = el;

      // Forward ref
      if (typeof forwardedRef === 'function') {
        forwardedRef(el);
      } else if (forwardedRef) {
        forwardedRef.current = el;
      }

      // Ilk render'da yuksekligi ayarla
      if (el && autoResize) {
        adjustHeight(el);
      }
    },
    [forwardedRef, autoResize],
  );

  // autoResize: onChange'de yuksekligi ayarla
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      textareaProps.onChange(event);
      if (autoResize && internalRef.current) {
        adjustHeight(internalRef.current);
      }
    },
    [textareaProps.onChange, autoResize],
  );

  // autoResize aktifse overflow hidden (scrollbar gosterme)
  const autoResizeStyle: React.CSSProperties | undefined = autoResize
    ? { overflow: 'hidden' }
    : undefined;

  const mergedStyle =
    autoResizeStyle || inlineStyle || rootSlot.style
      ? { ...autoResizeStyle, ...inlineStyle, ...rootSlot.style }
      : undefined;

  const textareaElement = (
    <textarea
      {...textareaProps}
      onChange={handleChange}
      ref={setRef}
      id={id}
      className={combinedClassName}
      style={mergedStyle}
      placeholder={placeholder}
      value={value}
      defaultValue={defaultValue}
      name={name}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
    />
  );

  // ── Compound API ──
  if (children) {
    const ctxValue: TextareaContextValue = {
      size,
      variant,
      disabled: isDisabled,
      classNames,
      styles,
    };

    const wrapperSlot = getSlotProps('wrapper', undefined, classNames, styles);

    return (
      <TextareaContext.Provider value={ctxValue}>
        <div
          className={wrapperSlot.className || undefined}
          style={wrapperSlot.style}
          data-testid="textarea-wrapper"
        >
          {children}
          {textareaElement}
        </div>
      </TextareaContext.Provider>
    );
  }

  // ── Props-based API ──
  return textareaElement;
});

/**
 * Textarea bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Textarea placeholder="Aciklama yazin..." />
 * ```
 *
 * @example Compound
 * ```tsx
 * <Textarea placeholder="Aciklama...">
 *   <Textarea.Label>Aciklama</Textarea.Label>
 *   <Textarea.Counter count={42} max={500} />
 * </Textarea>
 * ```
 */
export const Textarea = Object.assign(TextareaBase, {
  Label: TextareaLabel,
  Counter: TextareaCounter,
});

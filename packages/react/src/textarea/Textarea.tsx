/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Textarea — styled React textarea component.
 * Textarea — stilize edilmiş React textarea bileşeni.
 *
 * 3 varyant × 5 boyut × 4 resize modu. Vanilla Extract + CSS Variables ile tema desteği.
 * autoResize ile içerik büyüdükçe otomatik yükseklik artışı.
 *
 * @packageDocumentation
 */

import { forwardRef, useCallback, useRef } from 'react';
import type { TextareaVariant, TextareaSize, TextareaResize } from '@relteco/relui-core';
import { useTextarea, type UseTextareaProps } from './useTextarea';
import { textareaRecipe } from './textarea.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

/** Textarea slot isimleri. */
export type TextareaSlot = 'root';

/**
 * Textarea bileşen props'ları.
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
}

/**
 * autoResize: textarea yüksekliğini scrollHeight'a göre ayarlar.
 */
function adjustHeight(el: HTMLTextAreaElement): void {
  el.style.height = 'auto';
  el.style.height = `${el.scrollHeight}px`;
}

/**
 * Textarea — RelUI textarea bileşeni.
 * Textarea — RelUI textarea component.
 *
 * @example
 * ```tsx
 * <Textarea placeholder="Açıklama yazın..." variant="outline" />
 *
 * <Textarea
 *   placeholder="Otomatik büyüyen..."
 *   autoResize
 *   rows={2}
 * />
 *
 * <Textarea
 *   placeholder="Sabit boyut"
 *   resize="none"
 *   rows={5}
 * />
 * ```
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaComponentProps>(function Textarea(
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
    ...hookProps
  },
  forwardedRef,
) {
  const { textareaProps } = useTextarea({ ...hookProps, autoResize, onChange });

  // autoResize aktifse resize'ı none yap
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

      // İlk render'da yüksekliği ayarla
      if (el && autoResize) {
        adjustHeight(el);
      }
    },
    [forwardedRef, autoResize],
  );

  // autoResize: onChange'de yüksekliği ayarla
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      textareaProps.onChange(event);
      if (autoResize && internalRef.current) {
        adjustHeight(internalRef.current);
      }
    },
    [textareaProps.onChange, autoResize],
  );

  // autoResize aktifse overflow hidden (scrollbar gösterme)
  const autoResizeStyle: React.CSSProperties | undefined = autoResize
    ? { overflow: 'hidden' }
    : undefined;

  const mergedStyle =
    autoResizeStyle || inlineStyle || rootSlot.style
      ? { ...autoResizeStyle, ...inlineStyle, ...rootSlot.style }
      : undefined;

  return (
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
});

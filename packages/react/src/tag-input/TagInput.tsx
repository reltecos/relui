/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * TagInput — styled tag input bilesen (Dual API).
 * TagInput — styled tag input component (Dual API).
 *
 * Props-based: `<TagInput options={opts} placeholder="Ara" />`
 * Compound:    `<TagInput options={opts}><TagInput.Tag>...</TagInput.Tag><TagInput.Input /></TagInput>`
 *
 * Combobox + MultiSelect birlesimi: aranabilir coklu secim, Tag bilesen ile gosterim.
 *
 * @packageDocumentation
 */

import React, { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type {
  TagInputVariant,
  TagInputSize,
} from '@relteco/relui-core';
import { useTagInput, type UseTagInputProps } from './useTagInput';
import { Tag } from '../tag/Tag';
import {
  tagInputWrapperStyle,
  tagInputInnerInputStyle,
  tagInputClearStyle,
  tagInputNoResultStyle,
} from './tag-input.css';
import { inputRecipe } from '../input/input.css';
import {
  selectRootStyle,
  selectListboxStyle,
  selectOptionStyle,
} from '../select/select.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

/** TagInput slot isimleri. */
export type TagInputSlot =
  | 'root'
  | 'triggerWrapper'
  | 'tagsWrapper'
  | 'tag'
  | 'input'
  | 'clearButton'
  | 'listbox'
  | 'option'
  | 'noResult';

// ── Context (Compound API) ──────────────────────────

interface TagInputContextValue {
  classNames: ClassNames<TagInputSlot> | undefined;
  styles: Styles<TagInputSlot> | undefined;
  variant: TagInputVariant;
  size: TagInputSize;
}

const TagInputContext = createContext<TagInputContextValue | null>(null);

function useTagInputContext(): TagInputContextValue {
  const ctx = useContext(TagInputContext);
  if (!ctx) throw new Error('TagInput compound sub-components must be used within <TagInput>.');
  return ctx;
}

// ── Compound: TagInput.Tag ──────────────────────────

/** TagInput.Tag props */
export interface TagInputTagProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

const TagInputTag = forwardRef<HTMLSpanElement, TagInputTagProps>(
  function TagInputTag(props, ref) {
    const { children, className, style: styleProp } = props;
    const ctx = useTagInputContext();
    const slot = getSlotProps('tag', undefined, ctx.classNames, ctx.styles, styleProp);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <span
        ref={ref}
        className={cls || undefined}
        style={slot.style}
        data-testid="tag-input-tag"
      >
        {children}
      </span>
    );
  },
);

// ── Compound: TagInput.Input ────────────────────────

/** TagInput.Input props */
export interface TagInputInputProps {
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
  /** Icerik / Content (opsiyonel) */
  children?: ReactNode;
}

const TagInputInput = forwardRef<HTMLDivElement, TagInputInputProps>(
  function TagInputInput(props, ref) {
    const { className, style: styleProp, children } = props;
    const ctx = useTagInputContext();
    const slot = getSlotProps('input', tagInputInnerInputStyle, ctx.classNames, ctx.styles, styleProp);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div
        ref={ref}
        className={cls || undefined}
        style={slot.style}
        data-testid="tag-input-input"
      >
        {children}
      </div>
    );
  },
);

// ── TagInput Component Props ───────────────────────────────────────

export interface TagInputComponentProps extends UseTagInputProps, SlotStyleProps<TagInputSlot> {
  /** Gorsel varyant / Visual variant */
  variant?: TagInputVariant;

  /** Boyut / Size */
  size?: TagInputSize;

  /** Compound API icin children / Children for compound API */
  children?: ReactNode;

  /** Ek className / Additional className */
  className?: string;

  /** aria-label */
  'aria-label'?: string;

  /** aria-describedby */
  'aria-describedby'?: string;

  /** name (form submission) */
  name?: string;

  /** id */
  id?: string;
}

/**
 * TagInput bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <TagInput
 *   options={[
 *     { value: 'react', label: 'React' },
 *     { value: 'vue', label: 'Vue' },
 *   ]}
 *   placeholder="Teknoloji arayin"
 *   onValueChange={(values) => console.log(values)}
 * />
 * ```
 *
 * @example Compound
 * ```tsx
 * <TagInput options={opts}>
 *   <TagInput.Tag>Custom tag</TagInput.Tag>
 *   <TagInput.Input />
 * </TagInput>
 * ```
 */
const TagInputBase = forwardRef<HTMLDivElement, TagInputComponentProps>(
  function TagInput(props, ref) {
    const {
      variant = 'outline',
      size = 'md',
      children,
      className,
      classNames,
      styles,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      name,
      id,
      ...tagInputProps
    } = props;

    const {
      inputProps,
      listboxProps,
      getOptionProps,
      isOpen,
      selectedValues,
      selectedLabels,
      filteredOptions,
      isDisabled,
      removeValue,
      clearAll,
    } = useTagInput(tagInputProps);

    const tagSize = size === 'xs' || size === 'sm' ? 'sm' : size === 'xl' || size === 'lg' ? 'lg' : 'md';

    // ── Slot props ──────────────────────────────────────────────────
    const rootSlot = getSlotProps('root', selectRootStyle, classNames, styles);
    const combinedRootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    const ctxValue: TagInputContextValue = { classNames, styles, variant, size };

    // ── Compound API ──
    if (children) {
      return (
        <TagInputContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={combinedRootClassName}
            style={rootSlot.style}
            id={id}
            data-testid="tag-input-root"
          >
            {children}
          </div>
        </TagInputContext.Provider>
      );
    }

    // ── Props-based API ──
    const triggerWrapperStyle = {
      height: 'auto' as const,
      minHeight: size === 'xs' ? '1.5rem' : size === 'sm' ? '1.75rem' : size === 'lg' ? '2.5rem' : size === 'xl' ? '2.75rem' : '2rem',
      paddingRight: selectedValues.length > 0 ? '2rem' : undefined,
      position: 'relative' as const,
      cursor: isDisabled ? 'not-allowed' : 'text',
    };
    const triggerWrapperSlot = getSlotProps(
      'triggerWrapper',
      inputRecipe({ variant, size }),
      classNames,
      styles,
      triggerWrapperStyle,
    );

    const tagsWrapperSlot = getSlotProps('tagsWrapper', tagInputWrapperStyle, classNames, styles);
    const tagSlot = getSlotProps('tag', undefined, classNames, styles);
    const inputSlot = getSlotProps('input', tagInputInnerInputStyle, classNames, styles);

    const clearButtonBaseStyle = {
      position: 'absolute' as const,
      right: '0.375rem',
      top: '50%',
      transform: 'translateY(-50%)',
    };
    const clearButtonSlot = getSlotProps(
      'clearButton',
      tagInputClearStyle,
      classNames,
      styles,
      clearButtonBaseStyle,
    );

    const listboxSlot = getSlotProps('listbox', selectListboxStyle, classNames, styles);
    const optionSlot = getSlotProps('option', selectOptionStyle, classNames, styles);
    const noResultSlot = getSlotProps('noResult', tagInputNoResultStyle, classNames, styles);

    return (
      <div
        ref={ref}
        className={combinedRootClassName}
        style={rootSlot.style}
        id={id}
      >
        {/* Trigger wrapper — input gibi gorunur */}
        <div
          className={triggerWrapperSlot.className}
          style={triggerWrapperSlot.style}
          data-disabled={isDisabled ? '' : undefined}
        >
          <div className={tagsWrapperSlot.className} style={tagsWrapperSlot.style}>
            {/* Secili tag lar */}
            {selectedLabels.map((label, idx) => {
              const val = selectedValues[idx] ?? '';
              return (
                <Tag
                  key={val}
                  size={tagSize}
                  variant="soft"
                  color="accent"
                  removable={!isDisabled && !tagInputProps.readOnly}
                  onRemove={() => removeValue(val)}
                  disabled={isDisabled}
                  className={tagSlot.className || undefined}
                  style={tagSlot.style}
                >
                  {label}
                </Tag>
              );
            })}

            {/* Arama input u */}
            <input
              className={inputSlot.className}
              style={inputSlot.style}
              aria-label={ariaLabel}
              aria-describedby={ariaDescribedBy}
              placeholder={selectedValues.length === 0 ? tagInputProps.placeholder : undefined}
              readOnly={tagInputProps.readOnly}
              disabled={isDisabled}
              {...inputProps}
            />
          </div>

          {/* Clear all butonu */}
          {selectedValues.length > 0 && !isDisabled && !tagInputProps.readOnly && (
            <button
              type="button"
              className={clearButtonSlot.className}
              onClick={(e) => {
                e.stopPropagation();
                clearAll();
              }}
              aria-label="Temizle"
              tabIndex={-1}
              style={clearButtonSlot.style}
            >
              ✕
            </button>
          )}
        </div>

        {/* Listbox */}
        {isOpen && (
          <ul
            {...listboxProps}
            className={listboxSlot.className}
            style={listboxSlot.style}
            onMouseDown={preventBlur}
          >
            {filteredOptions.length === 0 ? (
              <li className={noResultSlot.className} style={noResultSlot.style}>
                Sonuç bulunamadı
              </li>
            ) : (
              filteredOptions.map((opt, index) => (
                <li
                  key={`opt-${String(opt.value)}`}
                  className={optionSlot.className}
                  style={optionSlot.style}
                  id={`ti-option-${index}`}
                  {...getOptionProps(index)}
                >
                  {opt.label}
                </li>
              ))
            )}
          </ul>
        )}

        {/* Hidden inputs for forms */}
        {name && selectedValues.map((val) => (
          <input key={val} type="hidden" name={name} value={val} />
        ))}
      </div>
    );
  },
);

// ── Blur engelleme ──────────────────────────────────────────────────

function preventBlur(event: React.MouseEvent) {
  event.preventDefault();
}

/**
 * TagInput bilesen — Dual API (props-based + compound).
 */
export const TagInput = Object.assign(TagInputBase, {
  Tag: TagInputTag,
  Input: TagInputInput,
});

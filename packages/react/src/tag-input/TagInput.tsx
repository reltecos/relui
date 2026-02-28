/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * TagInput — styled tag input bileşeni.
 * TagInput — styled tag input component.
 *
 * Combobox + MultiSelect birleşimi: aranabilir çoklu seçim, Tag bileşeni ile gösterim.
 * Kendi Tag bileşenimizi (@relteco/relui-react) reuse eder.
 *
 * @packageDocumentation
 */

import { forwardRef } from 'react';
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
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

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

// ── TagInput Component Props ───────────────────────────────────────

export interface TagInputComponentProps extends UseTagInputProps, SlotStyleProps<TagInputSlot> {
  /** Görsel varyant / Visual variant */
  variant?: TagInputVariant;

  /** Boyut / Size */
  size?: TagInputSize;

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
 * TagInput bileşeni — aranabilir çoklu seçim, tag gösterimi.
 * TagInput component — searchable multi-select with tag display.
 *
 * @example
 * ```tsx
 * <TagInput
 *   options={[
 *     { value: 'react', label: 'React' },
 *     { value: 'vue', label: 'Vue' },
 *     { value: 'svelte', label: 'Svelte' },
 *   ]}
 *   placeholder="Teknoloji arayın"
 *   onValueChange={(values) => console.log(values)}
 * />
 * ```
 */
export const TagInput = forwardRef<HTMLDivElement, TagInputComponentProps>(
  function TagInput(props, ref) {
    const {
      variant = 'outline',
      size = 'md',
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
        {/* Trigger wrapper — input gibi görünür */}
        <div
          className={triggerWrapperSlot.className}
          style={triggerWrapperSlot.style}
          data-disabled={isDisabled ? '' : undefined}
        >
          <div className={tagsWrapperSlot.className} style={tagsWrapperSlot.style}>
            {/* Seçili tag'lar */}
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

            {/* Arama input'u */}
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

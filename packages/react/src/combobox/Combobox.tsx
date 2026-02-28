/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Combobox — styled combobox bileşeni.
 * Combobox — styled combobox component.
 *
 * Compound component pattern: Combobox (root), input, content, option, group.
 * Core state machine üzerinde React hook + Vanilla Extract stiller.
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, useMemo } from 'react';
import type {
  ComboboxVariant,
  ComboboxSize,
  SelectValue,
  SelectOption as CoreSelectOption,
  SelectOptionOrGroup,
} from '@relteco/relui-core';
import { useCombobox, type UseComboboxProps } from './useCombobox';
import { comboboxClearStyle, comboboxNoResultStyle } from './combobox.css';
import {
  selectRootStyle,
  selectIndicatorStyle,
  selectListboxStyle,
  selectOptionStyle,
  selectGroupLabelStyle,
} from '../select/select.css';
import { inputRecipe } from '../input/input.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

/** Combobox slot isimleri. */
export type ComboboxSlot =
  | 'root'
  | 'inputWrapper'
  | 'input'
  | 'clearButton'
  | 'indicator'
  | 'listbox'
  | 'option'
  | 'noResult'
  | 'groupLabel';

// ── Context ─────────────────────────────────────────────────────────

interface ComboboxContextValue {
  inputProps: ReturnType<typeof useCombobox>['inputProps'];
  listboxProps: ReturnType<typeof useCombobox>['listboxProps'];
  getOptionProps: ReturnType<typeof useCombobox>['getOptionProps'];
  isOpen: boolean;
  selectedValue: SelectValue | undefined;
  selectedLabel: string | undefined;
  searchValue: string;
  filteredOptions: CoreSelectOption[];
  highlightedIndex: number;
  options: SelectOptionOrGroup[];
  placeholder: string;
  variant: ComboboxVariant;
  size: ComboboxSize;
  clear: () => void;
}

const ComboboxContext = createContext<ComboboxContextValue | null>(null);

function useComboboxContext(): ComboboxContextValue {
  const ctx = useContext(ComboboxContext);
  if (!ctx) {
    throw new Error('Combobox compound components must be used within <Combobox>');
  }
  return ctx;
}

// ── Combobox Component Props ───────────────────────────────────────

export interface ComboboxComponentProps extends UseComboboxProps, SlotStyleProps<ComboboxSlot> {
  /** Görsel varyant / Visual variant */
  variant?: ComboboxVariant;

  /** Boyut / Size */
  size?: ComboboxSize;

  /** Ek className / Additional className */
  className?: string;

  /** Inline stil / Inline style */
  style?: React.CSSProperties;

  /** Children (compound components) veya otomatik render */
  children?: React.ReactNode;

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
 * Combobox bileşeni — arama + filtreleme dropdown.
 * Combobox component — search + filtering dropdown.
 *
 * @example
 * ```tsx
 * <Combobox
 *   options={[
 *     { value: 'tr', label: 'Türkiye' },
 *     { value: 'us', label: 'ABD' },
 *   ]}
 *   placeholder="Ülke arayın"
 *   onValueChange={(v) => console.log(v)}
 * />
 * ```
 */
export const Combobox = forwardRef<HTMLDivElement, ComboboxComponentProps>(
  function Combobox(props, ref) {
    const {
      variant = 'outline',
      size = 'md',
      className,
      style,
      classNames,
      styles,
      children,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      name,
      id,
      ...comboboxProps
    } = props;

    const {
      inputProps,
      listboxProps,
      getOptionProps,
      isOpen,
      selectedValue,
      selectedLabel,
      searchValue,
      filteredOptions,
      highlightedIndex,
      clear,
    } = useCombobox(comboboxProps);

    const ctx = useMemo<ComboboxContextValue>(
      () => ({
        inputProps,
        listboxProps,
        getOptionProps,
        isOpen,
        selectedValue,
        selectedLabel,
        searchValue,
        filteredOptions,
        highlightedIndex,
        options: comboboxProps.options,
        placeholder: comboboxProps.placeholder ?? '',
        variant,
        size,
        clear,
      }),
      [
        inputProps,
        listboxProps,
        getOptionProps,
        isOpen,
        selectedValue,
        selectedLabel,
        searchValue,
        filteredOptions,
        highlightedIndex,
        comboboxProps.options,
        comboboxProps.placeholder,
        variant,
        size,
        clear,
      ],
    );

    // Slot props hesapla
    const rootSlot = getSlotProps('root', selectRootStyle, classNames, styles, style);
    const rootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    // Compound component
    if (children) {
      return (
        <ComboboxContext.Provider value={ctx}>
          <div ref={ref} className={rootClassName} style={rootSlot.style} id={id}>
            {children}
            {name && (
              <input
                type="hidden"
                name={name}
                value={selectedValue !== undefined ? String(selectedValue) : ''}
              />
            )}
          </div>
        </ComboboxContext.Provider>
      );
    }

    const inputWrapperSlot = getSlotProps(
      'inputWrapper',
      undefined,
      classNames,
      styles,
      { position: 'relative', display: 'flex', alignItems: 'center' },
    );
    const inputSlot = getSlotProps(
      'input',
      inputRecipe({ variant, size }),
      classNames,
      styles,
      { paddingRight: selectedValue !== undefined ? '2.5rem' : '1.75rem' },
    );
    const clearButtonSlot = getSlotProps(
      'clearButton',
      comboboxClearStyle,
      classNames,
      styles,
      { position: 'absolute', right: '1.5rem' },
    );
    const indicatorSlot = getSlotProps(
      'indicator',
      selectIndicatorStyle,
      classNames,
      styles,
      { position: 'absolute', right: '0.375rem', pointerEvents: 'none' },
    );
    const listboxSlot = getSlotProps('listbox', selectListboxStyle, classNames, styles);
    const noResultSlot = getSlotProps('noResult', comboboxNoResultStyle, classNames, styles);
    const optionSlot = getSlotProps('option', selectOptionStyle, classNames, styles);

    // Otomatik (basit) render
    return (
      <ComboboxContext.Provider value={ctx}>
        <div ref={ref} className={rootClassName} style={rootSlot.style} id={id}>
          {/* Input trigger */}
          <div className={inputWrapperSlot.className || undefined} style={inputWrapperSlot.style}>
            <input
              className={inputSlot.className}
              aria-label={ariaLabel}
              aria-describedby={ariaDescribedBy}
              placeholder={comboboxProps.placeholder}
              readOnly={comboboxProps.readOnly}
              {...inputProps}
              style={inputSlot.style}
            />
            {selectedValue !== undefined && (
              <button
                type="button"
                className={clearButtonSlot.className}
                onClick={(e) => {
                  e.stopPropagation();
                  clear();
                }}
                aria-label="Temizle"
                tabIndex={-1}
                style={clearButtonSlot.style}
              >
                ✕
              </button>
            )}
            <svg
              className={indicatorSlot.className}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              style={indicatorSlot.style}
            >
              <path d="M4 6l4 4 4-4" />
            </svg>
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
                renderFilteredOptionsWithSlot(filteredOptions, ctx, optionSlot)
              )}
            </ul>
          )}

          {/* Hidden input for forms */}
          {name && (
            <input
              type="hidden"
              name={name}
              value={selectedValue !== undefined ? String(selectedValue) : ''}
            />
          )}
        </div>
      </ComboboxContext.Provider>
    );
  },
);

// ── Blur engelleme ──────────────────────────────────────────────────

function preventBlur(event: React.MouseEvent) {
  event.preventDefault();
}

// ── Chevron Indicator ───────────────────────────────────────────────

function ChevronIndicator({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      className={selectIndicatorStyle}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ ...style, pointerEvents: 'none' }}
    >
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}

// ── Filtered option renderer ────────────────────────────────────────

function renderFilteredOptions(
  filteredOptions: CoreSelectOption[],
  ctx: ComboboxContextValue,
): React.ReactNode[] {
  return filteredOptions.map((opt, index) => (
    <li
      key={`opt-${String(opt.value)}`}
      className={selectOptionStyle}
      id={`cb-option-${index}`}
      {...ctx.getOptionProps(index)}
    >
      {opt.label}
    </li>
  ));
}

/** Slot-aware filtered option renderer. */
function renderFilteredOptionsWithSlot(
  filteredOptions: CoreSelectOption[],
  ctx: ComboboxContextValue,
  optionSlot: { className: string; style: React.CSSProperties | undefined },
): React.ReactNode[] {
  return filteredOptions.map((opt, index) => (
    <li
      key={`opt-${String(opt.value)}`}
      className={optionSlot.className}
      style={optionSlot.style}
      id={`cb-option-${index}`}
      {...ctx.getOptionProps(index)}
    >
      {opt.label}
    </li>
  ));
}

// ── Compound Components ─────────────────────────────────────────────

/** Combobox.Input — arama input'u */
export const ComboboxInput = forwardRef<HTMLInputElement, {
  className?: string;
  'aria-label'?: string;
}>(function ComboboxInput(props, ref) {
  const ctx = useComboboxContext();
  const { className, 'aria-label': ariaLabel } = props;

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <input
        ref={ref}
        className={`${inputRecipe({ variant: ctx.variant, size: ctx.size })}${className ? ` ${className}` : ''}`}
        aria-label={ariaLabel}
        placeholder={ctx.placeholder}
        {...ctx.inputProps}
        style={{ paddingRight: ctx.selectedValue !== undefined ? '2.5rem' : '1.75rem' }}
      />
      {ctx.selectedValue !== undefined && (
        <button
          type="button"
          className={comboboxClearStyle}
          onClick={(e) => {
            e.stopPropagation();
            ctx.clear();
          }}
          aria-label="Temizle"
          tabIndex={-1}
          style={{ position: 'absolute', right: '1.5rem' }}
        >
          ✕
        </button>
      )}
      <ChevronIndicator style={{ position: 'absolute', right: '0.375rem' }} />
    </div>
  );
});

/** Combobox.Content — dropdown listbox */
export const ComboboxContent = forwardRef<HTMLUListElement, {
  className?: string;
  children?: React.ReactNode;
}>(function ComboboxContent(props, ref) {
  const ctx = useComboboxContext();
  const { className, children } = props;

  if (!ctx.isOpen) return null;

  return (
    <ul
      ref={ref}
      className={`${selectListboxStyle}${className ? ` ${className}` : ''}`}
      onMouseDown={preventBlur}
      {...ctx.listboxProps}
    >
      {children ?? (
        ctx.filteredOptions.length === 0 ? (
          <li className={comboboxNoResultStyle}>Sonuç bulunamadı</li>
        ) : (
          renderFilteredOptions(ctx.filteredOptions, ctx)
        )
      )}
    </ul>
  );
});

/** Combobox.Option — tek seçenek */
export const ComboboxOption = forwardRef<HTMLLIElement, {
  index: number;
  className?: string;
  children?: React.ReactNode;
}>(function ComboboxOption(props, ref) {
  const ctx = useComboboxContext();
  const { index, className, children } = props;
  const opt = ctx.filteredOptions[index];

  return (
    <li
      ref={ref}
      className={`${selectOptionStyle}${className ? ` ${className}` : ''}`}
      id={`cb-option-${index}`}
      {...ctx.getOptionProps(index)}
    >
      {children ?? opt?.label}
    </li>
  );
});

/** Combobox.Group — seçenek grubu */
export function ComboboxGroup(props: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li role="presentation">
      <div className={selectGroupLabelStyle}>{props.label}</div>
      <ul role="group" aria-label={props.label} style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {props.children}
      </ul>
    </li>
  );
}

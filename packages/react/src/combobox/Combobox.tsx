/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Combobox — styled combobox bileseni (Dual API).
 * Combobox — styled combobox component (Dual API).
 *
 * Props-based: `<Combobox options={[...]} placeholder="Arayin" />`
 * Compound:    `<Combobox options={[...]}><Combobox.Input /><Combobox.Content />...</Combobox>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type {
  ComboboxVariant,
  ComboboxSize,
  SelectOption as CoreSelectOption,
} from '@relteco/relui-core';
import { useCombobox, type UseComboboxProps, type UseComboboxReturn } from './useCombobox';
import { comboboxClearStyle, comboboxNoResultStyle } from './combobox.css';
import {
  selectRootStyle,
  selectIndicatorStyle,
  selectListboxStyle,
  selectOptionStyle,
} from '../select/select.css';
import { inputRecipe } from '../input/input.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

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

// ── Context (Compound API) ──────────────────────────────────────────

interface ComboboxContextValue {
  variant: ComboboxVariant;
  size: ComboboxSize;
  isOpen: boolean;
  selectedValue: ReturnType<typeof useCombobox>['selectedValue'];
  filteredOptions: CoreSelectOption[];
  inputProps: UseComboboxReturn['inputProps'];
  listboxProps: UseComboboxReturn['listboxProps'];
  getOptionProps: UseComboboxReturn['getOptionProps'];
  clear: UseComboboxReturn['clear'];
  placeholder: string | undefined;
  readOnly: boolean | undefined;
  classNames: ClassNames<ComboboxSlot> | undefined;
  styles: Styles<ComboboxSlot> | undefined;
  name: string | undefined;
  ariaLabel: string | undefined;
  ariaDescribedBy: string | undefined;
}

const ComboboxContext = createContext<ComboboxContextValue | null>(null);

function useComboboxContext(): ComboboxContextValue {
  const ctx = useContext(ComboboxContext);
  if (!ctx) throw new Error('Combobox compound sub-components must be used within <Combobox>.');
  return ctx;
}

// ── Compound: Combobox.Input ────────────────────────────────────────

/** Combobox.Input props */
export interface ComboboxInputProps {
  /** Ek className / Additional className */
  className?: string;
}

const ComboboxInput = forwardRef<HTMLInputElement, ComboboxInputProps>(
  function ComboboxInput(props, ref) {
    const { className } = props;
    const ctx = useComboboxContext();

    const inputWrapperSlot = getSlotProps(
      'inputWrapper',
      undefined,
      ctx.classNames,
      ctx.styles,
      { position: 'relative', display: 'flex', alignItems: 'center' },
    );
    const inputSlot = getSlotProps(
      'input',
      inputRecipe({ variant: ctx.variant, size: ctx.size }),
      ctx.classNames,
      ctx.styles,
      { paddingRight: ctx.selectedValue !== undefined ? '2.5rem' : '1.75rem' },
    );
    const clearSlot = getSlotProps(
      'clearButton',
      comboboxClearStyle,
      ctx.classNames,
      ctx.styles,
      { position: 'absolute', right: '1.5rem' },
    );
    const indicatorSlot = getSlotProps(
      'indicator',
      selectIndicatorStyle,
      ctx.classNames,
      ctx.styles,
      { position: 'absolute', right: '0.375rem', pointerEvents: 'none' },
    );
    const inputCls = className ? `${inputSlot.className} ${className}` : inputSlot.className;

    return (
      <div className={inputWrapperSlot.className || undefined} style={inputWrapperSlot.style}>
        <input
          ref={ref}
          className={inputCls}
          aria-label={ctx.ariaLabel}
          aria-describedby={ctx.ariaDescribedBy}
          placeholder={ctx.placeholder}
          readOnly={ctx.readOnly}
          {...ctx.inputProps}
          style={inputSlot.style}
          data-testid="combobox-input"
        />
        {ctx.selectedValue !== undefined && (
          <button
            type="button"
            className={clearSlot.className}
            onClick={(e) => {
              e.stopPropagation();
              ctx.clear();
            }}
            aria-label="Temizle"
            tabIndex={-1}
            style={clearSlot.style}
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
    );
  },
);

// ── Compound: Combobox.Content ──────────────────────────────────────

/** Combobox.Content props */
export interface ComboboxContentProps {
  /** Icerik / Content */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const ComboboxContent = forwardRef<HTMLUListElement, ComboboxContentProps>(
  function ComboboxContent(props, ref) {
    const { children, className } = props;
    const ctx = useComboboxContext();

    if (!ctx.isOpen) return null;

    const slot = getSlotProps('listbox', selectListboxStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const noResultSlot = getSlotProps('noResult', comboboxNoResultStyle, ctx.classNames, ctx.styles);
    const optionSlot = getSlotProps('option', selectOptionStyle, ctx.classNames, ctx.styles);

    return (
      <ul
        ref={ref}
        {...ctx.listboxProps}
        className={cls}
        style={slot.style}
        onMouseDown={preventBlur}
        data-testid="combobox-content"
      >
        {children ?? (
          ctx.filteredOptions.length === 0 ? (
            <li className={noResultSlot.className} style={noResultSlot.style} data-testid="combobox-empty">
              Sonuc bulunamadi
            </li>
          ) : (
            renderFilteredOptions(ctx.filteredOptions, ctx.getOptionProps, optionSlot)
          )
        )}
      </ul>
    );
  },
);

// ── Compound: Combobox.Option ───────────────────────────────────────

/** Combobox.Option props */
export interface ComboboxOptionProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Secenek indeksi / Option index */
  index: number;
  /** Ek className / Additional className */
  className?: string;
}

const ComboboxOption = forwardRef<HTMLLIElement, ComboboxOptionProps>(
  function ComboboxOption(props, ref) {
    const { children, index, className } = props;
    const ctx = useComboboxContext();
    const slot = getSlotProps('option', selectOptionStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <li
        ref={ref}
        className={cls}
        style={slot.style}
        id={`cb-option-${index}`}
        data-testid="combobox-option"
        {...ctx.getOptionProps(index)}
      >
        {children}
      </li>
    );
  },
);

// ── Compound: Combobox.Empty ────────────────────────────────────────

/** Combobox.Empty props */
export interface ComboboxEmptyProps {
  /** Icerik / Content */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const ComboboxEmpty = forwardRef<HTMLLIElement, ComboboxEmptyProps>(
  function ComboboxEmpty(props, ref) {
    const { children, className } = props;
    const ctx = useComboboxContext();
    const slot = getSlotProps('noResult', comboboxNoResultStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <li ref={ref} className={cls} style={slot.style} data-testid="combobox-empty">
        {children ?? 'Sonuc bulunamadi'}
      </li>
    );
  },
);

// ── Component Props ─────────────────────────────────────────────────

export interface ComboboxComponentProps extends UseComboboxProps, SlotStyleProps<ComboboxSlot> {
  /** Gorsel varyant / Visual variant */
  variant?: ComboboxVariant;

  /** Boyut / Size */
  size?: ComboboxSize;

  /** Ek className / Additional className */
  className?: string;

  /** Inline stil / Inline style */
  style?: React.CSSProperties;

  /** aria-label */
  'aria-label'?: string;

  /** aria-describedby */
  'aria-describedby'?: string;

  /** name (form submission) */
  name?: string;

  /** id */
  id?: string;

  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
}

// ── Component ───────────────────────────────────────────────────────

const ComboboxBase = forwardRef<HTMLDivElement, ComboboxComponentProps>(
  function Combobox(props, ref) {
    const {
      variant = 'outline',
      size = 'md',
      className,
      style,
      classNames,
      styles,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      name,
      id,
      children,
      ...comboboxProps
    } = props;

    const {
      inputProps,
      listboxProps,
      getOptionProps,
      isOpen,
      selectedValue,
      filteredOptions,
      clear,
    } = useCombobox(comboboxProps);

    // Slot props hesapla
    const rootSlot = getSlotProps('root', selectRootStyle, classNames, styles, style);
    const rootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    // ── Compound API ──
    if (children) {
      const ctxValue: ComboboxContextValue = {
        variant,
        size,
        isOpen,
        selectedValue,
        filteredOptions,
        inputProps,
        listboxProps,
        getOptionProps,
        clear,
        placeholder: comboboxProps.placeholder,
        readOnly: comboboxProps.readOnly,
        classNames,
        styles,
        name,
        ariaLabel,
        ariaDescribedBy,
      };

      return (
        <ComboboxContext.Provider value={ctxValue}>
          <div ref={ref} className={rootClassName} style={rootSlot.style} id={id} data-testid="combobox-root">
            {children}
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
    }

    // ── Props-based API ──
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

    return (
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
                Sonuc bulunamadi
              </li>
            ) : (
              renderFilteredOptions(filteredOptions, getOptionProps, optionSlot)
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
    );
  },
);

/**
 * Combobox bileseni — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Combobox
 *   options={[{ value: 'tr', label: 'Turkiye' }]}
 *   placeholder="Ulke arayin"
 *   onValueChange={(v) => console.log(v)}
 * />
 * ```
 *
 * @example Compound
 * ```tsx
 * <Combobox options={[{ value: 'tr', label: 'Turkiye' }]}>
 *   <Combobox.Input />
 *   <Combobox.Content />
 * </Combobox>
 * ```
 */
export const Combobox = Object.assign(ComboboxBase, {
  Input: ComboboxInput,
  Content: ComboboxContent,
  Option: ComboboxOption,
  Empty: ComboboxEmpty,
});

// ── Blur engelleme ──────────────────────────────────────────────────

function preventBlur(event: React.MouseEvent) {
  event.preventDefault();
}

// ── Filtered option renderer ────────────────────────────────────────

function renderFilteredOptions(
  filteredOptions: CoreSelectOption[],
  getOptionProps: UseComboboxReturn['getOptionProps'],
  optionSlot: { className: string; style: React.CSSProperties | undefined },
): React.ReactNode[] {
  return filteredOptions.map((opt, index) => (
    <li
      key={`opt-${String(opt.value)}`}
      className={optionSlot.className}
      style={optionSlot.style}
      id={`cb-option-${index}`}
      {...getOptionProps(index)}
    >
      {opt.label}
    </li>
  ));
}

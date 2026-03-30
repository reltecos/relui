/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Autocomplete — styled autocomplete bileseni (Dual API).
 * Autocomplete — styled autocomplete component (Dual API).
 *
 * Props-based: `<Autocomplete options={[...]} placeholder="Arayin" />`
 * Compound:    `<Autocomplete><Autocomplete.Input /><Autocomplete.List>...</Autocomplete.List></Autocomplete>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { AutocompleteOption } from '@relteco/relui-core';
import { useAutocomplete, type UseAutocompleteProps } from './useAutocomplete';
import {
  rootStyle,
  sizeStyles,
  inputStyle,
  inputSizeStyles,
  listboxStyle,
  optionBaseStyle,
  optionHighlightedStyle,
  optionGroupStyle,
  noResultStyle,
} from './autocomplete.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** Autocomplete slot isimleri / Autocomplete slot names. */
export type AutocompleteSlot =
  | 'root'
  | 'input'
  | 'listbox'
  | 'option'
  | 'optionGroup'
  | 'noResult';

// ── Types ─────────────────────────────────────────────

/** Autocomplete boyutu / Autocomplete size */
export type AutocompleteSize = 'sm' | 'md' | 'lg';

// ── Context (Compound API) ──────────────────────────

interface AutocompleteContextValue {
  size: AutocompleteSize;
  isOpen: boolean;
  highlightedIndex: number;
  filteredOptions: readonly AutocompleteOption[];
  query: string;
  disabled: boolean;
  classNames: ClassNames<AutocompleteSlot> | undefined;
  styles: Styles<AutocompleteSlot> | undefined;
  setQuery: (query: string) => void;
  select: (value: string) => void;
  highlightNext: () => void;
  highlightPrev: () => void;
  open: () => void;
  close: () => void;
}

const AutocompleteContext = createContext<AutocompleteContextValue | null>(null);

function useAutocompleteContext(): AutocompleteContextValue {
  const ctx = useContext(AutocompleteContext);
  if (!ctx) throw new Error('Autocomplete compound sub-components must be used within <Autocomplete>.');
  return ctx;
}

// ── Compound: Autocomplete.Input ────────────────────

/** Autocomplete.Input props */
export interface AutocompleteInputProps {
  /** Placeholder metni / Placeholder text */
  placeholder?: string;
  /** Ek className / Additional className */
  className?: string;
}

const AutocompleteInput = forwardRef<HTMLInputElement, AutocompleteInputProps>(
  function AutocompleteInput(props, ref) {
    const { placeholder, className } = props;
    const ctx = useAutocompleteContext();
    const slot = getSlotProps(
      'input',
      `${inputStyle} ${inputSizeStyles[ctx.size]}`,
      ctx.classNames,
      ctx.styles,
    );
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      ctx.setQuery(e.target.value);
    };

    const handleFocus = () => {
      ctx.open();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          ctx.highlightNext();
          break;
        case 'ArrowUp':
          e.preventDefault();
          ctx.highlightPrev();
          break;
        case 'Enter':
          e.preventDefault();
          if (ctx.highlightedIndex >= 0) {
            const opt = ctx.filteredOptions[ctx.highlightedIndex];
            if (opt && !opt.disabled) {
              ctx.select(opt.value);
            }
          }
          break;
        case 'Escape':
          e.preventDefault();
          ctx.setQuery('');
          ctx.close();
          break;
      }
    };

    return (
      <input
        ref={ref}
        className={cls}
        style={slot.style}
        value={ctx.query}
        placeholder={placeholder}
        disabled={ctx.disabled}
        onChange={handleChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-expanded={ctx.isOpen}
        aria-autocomplete="list"
        aria-activedescendant={
          ctx.highlightedIndex >= 0
            ? `autocomplete-option-${ctx.highlightedIndex}`
            : undefined
        }
        autoComplete="off"
        data-testid="autocomplete-input"
      />
    );
  },
);

// ── Compound: Autocomplete.List ─────────────────────

/** Autocomplete.List props */
export interface AutocompleteListProps {
  /** Icerik / Content */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const AutocompleteList = forwardRef<HTMLUListElement, AutocompleteListProps>(
  function AutocompleteList(props, ref) {
    const { children, className } = props;
    const ctx = useAutocompleteContext();

    if (!ctx.isOpen) return null;

    const slot = getSlotProps('listbox', listboxStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <ul
        ref={ref}
        className={cls}
        style={slot.style}
        role="listbox"
        onMouseDown={preventBlur}
        data-testid="autocomplete-listbox"
      >
        {children}
      </ul>
    );
  },
);

// ── Compound: Autocomplete.Option ───────────────────

/** Autocomplete.Option props */
export interface AutocompleteOptionProps {
  /** Secenek degeri / Option value */
  value: string;
  /** Secenek etiketi / Option label */
  label: string;
  /** Devre disi mi / Is disabled */
  disabled?: boolean;
  /** Icerik / Content */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const AutocompleteOptionItem = forwardRef<HTMLLIElement, AutocompleteOptionProps>(
  function AutocompleteOption(props, ref) {
    const { value, label, disabled: optDisabled, children, className } = props;
    const ctx = useAutocompleteContext();

    // Find index in filteredOptions
    const optionIndex = ctx.filteredOptions.findIndex((o) => o.value === value);
    const isHighlighted = optionIndex === ctx.highlightedIndex;

    const baseCls = isHighlighted
      ? `${optionBaseStyle} ${optionHighlightedStyle}`
      : optionBaseStyle;
    const slot = getSlotProps('option', baseCls, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const handleClick = () => {
      if (!optDisabled) {
        ctx.select(value);
      }
    };

    return (
      <li
        ref={ref}
        className={cls}
        style={slot.style}
        role="option"
        id={optionIndex >= 0 ? `autocomplete-option-${optionIndex}` : undefined}
        aria-selected={isHighlighted}
        data-disabled={optDisabled ? 'true' : undefined}
        onClick={handleClick}
        data-testid="autocomplete-option"
      >
        {children ?? label}
      </li>
    );
  },
);

// ── Compound: Autocomplete.NoResult ─────────────────

/** Autocomplete.NoResult props */
export interface AutocompleteNoResultProps {
  /** Icerik / Content */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const AutocompleteNoResult = forwardRef<HTMLLIElement, AutocompleteNoResultProps>(
  function AutocompleteNoResult(props, ref) {
    const { children, className } = props;
    const ctx = useAutocompleteContext();
    const slot = getSlotProps('noResult', noResultStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <li
        ref={ref}
        className={cls}
        style={slot.style}
        role="option"
        aria-disabled="true"
        data-testid="autocomplete-no-result"
      >
        {children ?? 'Sonuc bulunamadi'}
      </li>
    );
  },
);

// ── Component Props ───────────────────────────────────

export interface AutocompleteComponentProps extends SlotStyleProps<AutocompleteSlot> {
  /** Secenek listesi / Option list */
  options?: AutocompleteOption[];

  /** Kontrollü deger / Controlled value */
  value?: string;

  /** Varsayilan deger / Default value */
  defaultValue?: string;

  /** Secim degisince callback / On change callback */
  onChange?: (value: string, label: string) => void;

  /** Arama degisince callback / On query change callback */
  onQueryChange?: (query: string) => void;

  /** Filtreleme fonksiyonu / Filter function */
  filterFn?: (option: AutocompleteOption, query: string) => boolean;

  /** Placeholder metni / Placeholder text */
  placeholder?: string;

  /** Boyut / Size */
  size?: AutocompleteSize;

  /** Devre disi / Disabled */
  disabled?: boolean;

  /** Sonuc bulunamadi metni / No result text */
  noResultText?: string;

  /** Compound API icin children / Children for compound API */
  children?: ReactNode;

  /** Ek className / Additional className */
  className?: string;

  /** Inline stil / Inline style */
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────

const AutocompleteBase = forwardRef<HTMLDivElement, AutocompleteComponentProps>(
  function Autocomplete(props, ref) {
    const {
      options = [],
      value,
      defaultValue,
      onChange,
      onQueryChange,
      filterFn,
      placeholder,
      size = 'md',
      disabled = false,
      noResultText = 'Sonuc bulunamadi',
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const hookProps: UseAutocompleteProps = {
      options,
      value,
      defaultValue,
      onChange,
      onQueryChange,
      filterFn,
    };

    const {
      query,
      highlightedIndex,
      isOpen: hookIsOpen,
      filteredOptions,
      setQuery,
      select,
      highlightNext,
      highlightPrev,
      open,
      close,
    } = useAutocomplete(hookProps);

    // Disabled iken acilamaz
    // Core machine isOpen=false when filteredOptions.length===0,
    // but we still want to show noResult message when query is non-empty.
    const showNoResult = !disabled && query.length > 0 && filteredOptions.length === 0;
    const isOpen = disabled ? false : (hookIsOpen || showNoResult);

    // ── Slots ──
    const rootSlot = getSlotProps('root', `${rootStyle} ${sizeStyles[size]}`, classNames, styles);
    const rootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    const ctxValue: AutocompleteContextValue = {
      size,
      isOpen,
      highlightedIndex,
      filteredOptions,
      query,
      disabled,
      classNames,
      styles,
      setQuery,
      select,
      highlightNext,
      highlightPrev,
      open,
      close,
    };

    // ── Compound API ──
    if (children) {
      return (
        <AutocompleteContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={rootClassName}
            style={{ ...rootSlot.style, ...styleProp }}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            data-testid="autocomplete-root"
            data-size={size}
          >
            {children}
          </div>
        </AutocompleteContext.Provider>
      );
    }

    // ── Props-based API ──
    const inputSlot = getSlotProps(
      'input',
      `${inputStyle} ${inputSizeStyles[size]}`,
      classNames,
      styles,
    );
    const listboxSlot = getSlotProps('listbox', listboxStyle, classNames, styles);
    const noResultSlot = getSlotProps('noResult', noResultStyle, classNames, styles);
    const groupHeaderSlot = getSlotProps('optionGroup', optionGroupStyle, classNames, styles);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
    };

    const handleInputFocus = () => {
      if (!disabled) {
        open();
      }
    };

    const handleInputKeyDown = (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          highlightNext();
          break;
        case 'ArrowUp':
          e.preventDefault();
          highlightPrev();
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0) {
            const opt = filteredOptions[highlightedIndex];
            if (opt && !opt.disabled) {
              select(opt.value);
            }
          }
          break;
        case 'Escape':
          e.preventDefault();
          setQuery('');
          close();
          break;
      }
    };

    // ── Group rendering ──
    const renderGroupedOptions = (): React.ReactNode[] => {
      const nodes: React.ReactNode[] = [];
      const groups = new Map<string, { options: AutocompleteOption[]; indices: number[] }>();
      const ungrouped: { option: AutocompleteOption; index: number }[] = [];

      filteredOptions.forEach((opt, idx) => {
        if (opt.group) {
          const existing = groups.get(opt.group);
          if (existing) {
            existing.options.push(opt);
            existing.indices.push(idx);
          } else {
            groups.set(opt.group, { options: [opt], indices: [idx] });
          }
        } else {
          ungrouped.push({ option: opt, index: idx });
        }
      });

      // Render ungrouped first
      for (const { option: opt, index: idx } of ungrouped) {
        nodes.push(renderOptionItem(opt, idx));
      }

      // Render groups
      for (const [groupName, group] of groups) {
        nodes.push(
          <li
            key={`group-${groupName}`}
            className={groupHeaderSlot.className}
            style={groupHeaderSlot.style}
            role="presentation"
            data-testid="autocomplete-option-group"
          >
            {groupName}
          </li>,
        );
        for (let i = 0; i < group.options.length; i++) {
          const opt = group.options[i];
          const idx = group.indices[i];
          if (opt !== undefined && idx !== undefined) {
            nodes.push(renderOptionItem(opt, idx));
          }
        }
      }

      return nodes;
    };

    const renderOptionItem = (
      opt: AutocompleteOption,
      idx: number,
    ): React.ReactNode => {
      const isHighlighted = idx === highlightedIndex;
      const optCls = isHighlighted
        ? `${optionBaseStyle} ${optionHighlightedStyle}`
        : optionBaseStyle;
      const resolvedSlot = getSlotProps('option', optCls, classNames, styles);

      return (
        <li
          key={`opt-${opt.value}`}
          className={resolvedSlot.className}
          style={resolvedSlot.style}
          role="option"
          id={`autocomplete-option-${idx}`}
          aria-selected={isHighlighted}
          data-disabled={opt.disabled ? 'true' : undefined}
          onClick={() => {
            if (!opt.disabled) select(opt.value);
          }}
          data-testid="autocomplete-option"
        >
          {opt.label}
        </li>
      );
    };

    return (
      <div
        ref={ref}
        className={rootClassName}
        style={{ ...rootSlot.style, ...styleProp }}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        data-testid="autocomplete-root"
        data-size={size}
      >
        <input
          className={inputSlot.className}
          style={inputSlot.style}
          value={query}
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleInputKeyDown}
          aria-autocomplete="list"
          aria-activedescendant={
            highlightedIndex >= 0
              ? `autocomplete-option-${highlightedIndex}`
              : undefined
          }
          autoComplete="off"
          data-testid="autocomplete-input"
        />

        {isOpen && (
          <ul
            className={listboxSlot.className}
            style={listboxSlot.style}
            role="listbox"
            onMouseDown={preventBlur}
            data-testid="autocomplete-listbox"
          >
            {filteredOptions.length === 0 ? (
              <li
                className={noResultSlot.className}
                style={noResultSlot.style}
                role="option"
                aria-disabled="true"
                data-testid="autocomplete-no-result"
              >
                {noResultText}
              </li>
            ) : (
              renderGroupedOptions()
            )}
          </ul>
        )}
      </div>
    );
  },
);

/**
 * Autocomplete bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Autocomplete
 *   options={[{ value: 'tr', label: 'Turkiye' }]}
 *   placeholder="Ulke arayin"
 *   onChange={(v, l) => console.log(v, l)}
 * />
 * ```
 *
 * @example Compound
 * ```tsx
 * <Autocomplete options={[{ value: 'tr', label: 'Turkiye' }]}>
 *   <Autocomplete.Input placeholder="Ulke arayin" />
 *   <Autocomplete.List>
 *     <Autocomplete.Option value="tr" label="Turkiye" />
 *   </Autocomplete.List>
 * </Autocomplete>
 * ```
 */
export const Autocomplete = Object.assign(AutocompleteBase, {
  Input: AutocompleteInput,
  List: AutocompleteList,
  Option: AutocompleteOptionItem,
  NoResult: AutocompleteNoResult,
});

// ── Blur engelleme ──────────────────────────────────────

function preventBlur(event: React.MouseEvent) {
  event.preventDefault();
}

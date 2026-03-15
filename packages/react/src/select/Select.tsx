/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Select — styled select bileseni (Dual API).
 * Select — styled select component (Dual API).
 *
 * Props-based: `<Select options={[...]} placeholder="Secin" />`
 * Compound:    `<Select options={[...]}><Select.Trigger>...</Select.Trigger>...</Select>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type {
  SelectVariant,
  SelectSize,
  SelectOptionOrGroup,
} from '@relteco/relui-core';
import { isOptionGroup } from '@relteco/relui-core';
import { useSelect, type UseSelectProps, type UseSelectReturn } from './useSelect';
import {
  selectRootStyle,
  selectTriggerRecipe,
  selectPlaceholderStyle,
  selectValueStyle,
  selectIndicatorStyle,
  selectListboxStyle,
  selectOptionStyle,
  selectGroupLabelStyle,
  selectEmptyStyle,
} from './select.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

/** Select slot isimleri. */
export type SelectSlot =
  | 'root'
  | 'trigger'
  | 'placeholder'
  | 'value'
  | 'indicator'
  | 'listbox'
  | 'option'
  | 'groupLabel';

// ── Context (Compound API) ──────────────────────────────────────────

interface SelectContextValue {
  variant: SelectVariant;
  size: SelectSize;
  isOpen: boolean;
  selectedValue: ReturnType<typeof useSelect>['selectedValue'];
  selectedLabel: ReturnType<typeof useSelect>['selectedLabel'];
  triggerProps: UseSelectReturn['triggerProps'];
  listboxProps: UseSelectReturn['listboxProps'];
  getOptionProps: UseSelectReturn['getOptionProps'];
  options: SelectOptionOrGroup[];
  placeholder: string | undefined;
  classNames: ClassNames<SelectSlot> | undefined;
  styles: Styles<SelectSlot> | undefined;
  name: string | undefined;
  ariaLabel: string | undefined;
  ariaDescribedBy: string | undefined;
}

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelectContext(): SelectContextValue {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error('Select compound sub-components must be used within <Select>.');
  return ctx;
}

// ── Compound: Select.Trigger ────────────────────────────────────────

/** Select.Trigger props */
export interface SelectTriggerProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  function SelectTrigger(props, ref) {
    const { children, className } = props;
    const ctx = useSelectContext();
    const slot = getSlotProps(
      'trigger',
      selectTriggerRecipe({ variant: ctx.variant, size: ctx.size }),
      ctx.classNames,
      ctx.styles,
    );
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <button
        ref={ref}
        type="button"
        className={cls}
        style={slot.style}
        aria-label={ctx.ariaLabel}
        aria-describedby={ctx.ariaDescribedBy}
        data-testid="select-trigger"
        {...ctx.triggerProps}
      >
        {children}
      </button>
    );
  },
);

// ── Compound: Select.Value ──────────────────────────────────────────

/** Select.Value props */
export interface SelectValueProps {
  /** Icerik veya placeholder / Content or placeholder */
  children?: ReactNode;
  /** Placeholder metni / Placeholder text */
  placeholder?: string;
  /** Ek className / Additional className */
  className?: string;
}

const SelectValue = forwardRef<HTMLSpanElement, SelectValueProps>(
  function SelectValue(props, ref) {
    const { children, placeholder, className } = props;
    const ctx = useSelectContext();

    if (ctx.selectedLabel) {
      const slot = getSlotProps('value', selectValueStyle, ctx.classNames, ctx.styles);
      const cls = className ? `${slot.className} ${className}` : slot.className;
      return (
        <span ref={ref} className={cls} style={slot.style} data-testid="select-value">
          {children ?? ctx.selectedLabel}
        </span>
      );
    }

    const slot = getSlotProps('placeholder', selectPlaceholderStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return (
      <span ref={ref} className={cls} style={slot.style} data-testid="select-value">
        {placeholder ?? ctx.placeholder ?? '\u00A0'}
      </span>
    );
  },
);

// ── Compound: Select.Content ────────────────────────────────────────

/** Select.Content props */
export interface SelectContentProps {
  /** Icerik / Content */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const SelectContent = forwardRef<HTMLUListElement, SelectContentProps>(
  function SelectContent(props, ref) {
    const { children, className } = props;
    const ctx = useSelectContext();

    if (!ctx.isOpen) return null;

    const slot = getSlotProps('listbox', selectListboxStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <ul
        ref={ref}
        {...ctx.listboxProps}
        className={cls}
        style={slot.style}
        onMouseDown={preventBlur}
        data-testid="select-content"
      >
        {children ?? (
          ctx.options.length === 0 ? (
            <li className={selectEmptyStyle}>Secenek yok</li>
          ) : (
            renderOptions(ctx.options, ctx.getOptionProps, ctx.classNames, ctx.styles)
          )
        )}
      </ul>
    );
  },
);

// ── Compound: Select.Option ─────────────────────────────────────────

/** Select.Option props */
export interface SelectOptionProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Secenek indeksi / Option index */
  index: number;
  /** Ek className / Additional className */
  className?: string;
}

const SelectOption = forwardRef<HTMLLIElement, SelectOptionProps>(
  function SelectOption(props, ref) {
    const { children, index, className } = props;
    const ctx = useSelectContext();
    const slot = getSlotProps('option', selectOptionStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <li
        ref={ref}
        className={cls}
        style={slot.style}
        id={`option-${index}`}
        data-testid="select-option"
        {...ctx.getOptionProps(index)}
      >
        {children}
      </li>
    );
  },
);

// ── Compound: Select.Group ──────────────────────────────────────────

/** Select.Group props */
export interface SelectGroupProps {
  /** Grup etiketi / Group label */
  label: string;
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const SelectGroup = forwardRef<HTMLLIElement, SelectGroupProps>(
  function SelectGroup(props, ref) {
    const { label, children, className } = props;
    const ctx = useSelectContext();
    const groupLabelSlot = getSlotProps('groupLabel', selectGroupLabelStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${groupLabelSlot.className} ${className}` : groupLabelSlot.className;

    return (
      <li ref={ref} role="presentation" data-testid="select-group">
        <div className={cls} style={groupLabelSlot.style}>
          {label}
        </div>
        <ul role="group" aria-label={label} style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {children}
        </ul>
      </li>
    );
  },
);

// ── Component Props ─────────────────────────────────────────────────

export interface SelectComponentProps extends UseSelectProps, SlotStyleProps<SelectSlot> {
  /** Gorsel varyant / Visual variant */
  variant?: SelectVariant;

  /** Boyut / Size */
  size?: SelectSize;

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

  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
}

// ── Component ───────────────────────────────────────────────────────

const SelectBase = forwardRef<HTMLDivElement, SelectComponentProps>(
  function Select(props, ref) {
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
      children,
      ...selectProps
    } = props;

    const {
      triggerProps,
      listboxProps,
      getOptionProps,
      isOpen,
      selectedValue,
      selectedLabel,
    } = useSelect(selectProps);

    // Slot props hesapla
    const rootSlot = getSlotProps('root', selectRootStyle, classNames, styles);
    const rootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    // ── Compound API ──
    if (children) {
      const ctxValue: SelectContextValue = {
        variant,
        size,
        isOpen,
        selectedValue,
        selectedLabel,
        triggerProps,
        listboxProps,
        getOptionProps,
        options: selectProps.options,
        placeholder: selectProps.placeholder,
        classNames,
        styles,
        name,
        ariaLabel,
        ariaDescribedBy,
      };

      return (
        <SelectContext.Provider value={ctxValue}>
          <div ref={ref} className={rootClassName} style={rootSlot.style} id={id} data-testid="select-root">
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
        </SelectContext.Provider>
      );
    }

    // ── Props-based API ──
    const triggerSlot = getSlotProps(
      'trigger',
      selectTriggerRecipe({ variant, size }),
      classNames,
      styles,
    );
    const placeholderSlot = getSlotProps('placeholder', selectPlaceholderStyle, classNames, styles);
    const valueSlot = getSlotProps('value', selectValueStyle, classNames, styles);
    const listboxSlot = getSlotProps('listbox', selectListboxStyle, classNames, styles);

    return (
      <div ref={ref} className={rootClassName} style={rootSlot.style} id={id}>
        {/* Trigger */}
        <button
          type="button"
          className={triggerSlot.className}
          style={triggerSlot.style}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          {...triggerProps}
        >
          {selectedLabel ? (
            <span className={valueSlot.className} style={valueSlot.style}>
              {selectedLabel}
            </span>
          ) : (
            <span className={placeholderSlot.className} style={placeholderSlot.style}>
              {selectProps.placeholder || '\u00A0'}
            </span>
          )}
          <ChevronIndicator classNames={classNames} styles={styles} />
        </button>

        {/* Listbox */}
        {isOpen && (
          <ul
            {...listboxProps}
            className={listboxSlot.className}
            style={listboxSlot.style}
            onMouseDown={preventBlur}
          >
            {selectProps.options.length === 0 ? (
              <li className={selectEmptyStyle}>Secenek yok</li>
            ) : (
              renderOptions(selectProps.options, getOptionProps, classNames, styles)
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
 * Select bileseni — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Select
 *   options={[{ value: 'tr', label: 'Turkiye' }]}
 *   placeholder="Ulke secin"
 *   onValueChange={(v) => console.log(v)}
 * />
 * ```
 *
 * @example Compound
 * ```tsx
 * <Select options={[{ value: 'tr', label: 'Turkiye' }]}>
 *   <Select.Trigger>
 *     <Select.Value placeholder="Ulke secin" />
 *   </Select.Trigger>
 *   <Select.Content />
 * </Select>
 * ```
 */
export const Select = Object.assign(SelectBase, {
  Trigger: SelectTrigger,
  Value: SelectValue,
  Content: SelectContent,
  Option: SelectOption,
  Group: SelectGroup,
});

// ── Blur engelleme — listbox'a tiklayinca trigger blur olmasin ──────

function preventBlur(event: React.MouseEvent) {
  event.preventDefault();
}

// ── Chevron Indicator ───────────────────────────────────────────────

function ChevronIndicator(props: {
  classNames?: ClassNames<SelectSlot>;
  styles?: Styles<SelectSlot>;
}) {
  const slot = getSlotProps('indicator', selectIndicatorStyle, props.classNames, props.styles);
  return (
    <svg
      className={slot.className}
      style={slot.style}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}

// ── Option renderer ─────────────────────────────────────────────────

function renderOptions(
  options: SelectOptionOrGroup[],
  getOptionProps: UseSelectReturn['getOptionProps'],
  slotClassNames: ClassNames<SelectSlot> | undefined,
  slotStyles: Styles<SelectSlot> | undefined,
): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let flatIndex = 0;

  const optionSlot = getSlotProps(
    'option',
    selectOptionStyle,
    slotClassNames,
    slotStyles,
  );
  const groupLabelSlot = getSlotProps(
    'groupLabel',
    selectGroupLabelStyle,
    slotClassNames,
    slotStyles,
  );

  for (const item of options) {
    if (isOptionGroup(item)) {
      nodes.push(
        <li key={`group-${item.label}`} role="presentation">
          <div className={groupLabelSlot.className} style={groupLabelSlot.style}>
            {item.label}
          </div>
          <ul role="group" aria-label={item.label} style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {item.options.map((opt) => {
              const idx = flatIndex++;
              return (
                <li
                  key={`opt-${String(opt.value)}`}
                  className={optionSlot.className}
                  style={optionSlot.style}
                  id={`option-${idx}`}
                  {...getOptionProps(idx)}
                >
                  {opt.label}
                </li>
              );
            })}
          </ul>
        </li>,
      );
    } else {
      const idx = flatIndex++;
      nodes.push(
        <li
          key={`opt-${String(item.value)}`}
          className={optionSlot.className}
          style={optionSlot.style}
          id={`option-${idx}`}
          {...getOptionProps(idx)}
        >
          {item.label}
        </li>,
      );
    }
  }

  return nodes;
}

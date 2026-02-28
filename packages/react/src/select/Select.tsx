/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Select — styled select bileşeni.
 * Select — styled select component.
 *
 * Compound component pattern: Select (root), trigger, content, option, group.
 * Core state machine üzerinde React hook + Vanilla Extract stiller.
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, useMemo } from 'react';
import type {
  SelectVariant,
  SelectSize,
  SelectValue,
  SelectOption as CoreSelectOption,
  SelectOptionOrGroup,
} from '@relteco/relui-core';
import { isOptionGroup } from '@relteco/relui-core';
import { useSelect, type UseSelectProps } from './useSelect';
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

// ── Context ─────────────────────────────────────────────────────────

interface SelectContextValue {
  triggerProps: ReturnType<typeof useSelect>['triggerProps'];
  listboxProps: ReturnType<typeof useSelect>['listboxProps'];
  getOptionProps: ReturnType<typeof useSelect>['getOptionProps'];
  isOpen: boolean;
  selectedValue: SelectValue | undefined;
  selectedLabel: string | undefined;
  highlightedIndex: number;
  options: SelectOptionOrGroup[];
  flatOptions: CoreSelectOption[];
  placeholder: string;
  variant: SelectVariant;
  size: SelectSize;
  slotClassNames: ClassNames<SelectSlot> | undefined;
  slotStyles: Styles<SelectSlot> | undefined;
}

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelectContext(): SelectContextValue {
  const ctx = useContext(SelectContext);
  if (!ctx) {
    throw new Error('Select compound components must be used within <Select>');
  }
  return ctx;
}

// ── Select Component Props ──────────────────────────────────────────

export interface SelectComponentProps extends UseSelectProps, SlotStyleProps<SelectSlot> {
  /** Görsel varyant / Visual variant */
  variant?: SelectVariant;

  /** Boyut / Size */
  size?: SelectSize;

  /** Ek className / Additional className */
  className?: string;

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
 * Select bileşeni — dropdown seçim.
 * Select component — dropdown selection.
 *
 * @example
 * ```tsx
 * <Select
 *   options={[
 *     { value: 'tr', label: 'Türkiye' },
 *     { value: 'us', label: 'ABD' },
 *   ]}
 *   placeholder="Ülke seçin"
 *   onValueChange={(v) => console.log(v)}
 * />
 * ```
 */
export const Select = forwardRef<HTMLDivElement, SelectComponentProps>(
  function Select(props, ref) {
    const {
      variant = 'outline',
      size = 'md',
      className,
      classNames,
      styles,
      children,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      name,
      id,
      ...selectProps
    } = props;

    const {
      triggerProps,
      listboxProps,
      getOptionProps,
      isOpen,
      selectedValue,
      selectedLabel,
      highlightedIndex,
    } = useSelect(selectProps);

    const ctx = useMemo<SelectContextValue>(
      () => ({
        triggerProps,
        listboxProps,
        getOptionProps,
        isOpen,
        selectedValue,
        selectedLabel,
        highlightedIndex,
        options: selectProps.options,
        flatOptions: selectProps.options.flatMap((item) =>
          isOptionGroup(item) ? item.options : [item],
        ),
        placeholder: selectProps.placeholder ?? '',
        variant,
        size,
        slotClassNames: classNames,
        slotStyles: styles,
      }),
      [
        triggerProps,
        listboxProps,
        getOptionProps,
        isOpen,
        selectedValue,
        selectedLabel,
        highlightedIndex,
        selectProps.options,
        selectProps.placeholder,
        variant,
        size,
        classNames,
        styles,
      ],
    );

    // Slot prop'ları hesapla
    const rootSlot = getSlotProps('root', selectRootStyle, classNames, styles);
    const rootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    // Compound component veya otomatik render
    if (children) {
      return (
        <SelectContext.Provider value={ctx}>
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
        </SelectContext.Provider>
      );
    }

    // Otomatik (basit) render — slot prop'ları
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
      <SelectContext.Provider value={ctx}>
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
                <li className={selectEmptyStyle}>Seçenek yok</li>
              ) : (
                renderOptions(selectProps.options, ctx)
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
      </SelectContext.Provider>
    );
  },
);

// ── Blur engelleme — listbox'a tıklayınca trigger blur olmasın ──────

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
  ctx: SelectContextValue,
): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let flatIndex = 0;

  const optionSlot = getSlotProps(
    'option',
    selectOptionStyle,
    ctx.slotClassNames,
    ctx.slotStyles,
  );
  const groupLabelSlot = getSlotProps(
    'groupLabel',
    selectGroupLabelStyle,
    ctx.slotClassNames,
    ctx.slotStyles,
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
                  {...ctx.getOptionProps(idx)}
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
          {...ctx.getOptionProps(idx)}
        >
          {item.label}
        </li>,
      );
    }
  }

  return nodes;
}

// ── Compound Components ─────────────────────────────────────────────

/** Select.Trigger — dropdown trigger button */
export const SelectTrigger = forwardRef<HTMLButtonElement, {
  className?: string;
  children?: React.ReactNode;
  'aria-label'?: string;
}>(function SelectTrigger(props, ref) {
  const ctx = useSelectContext();
  const { className, children, 'aria-label': ariaLabel } = props;

  return (
    <button
      ref={ref}
      type="button"
      className={`${selectTriggerRecipe({ variant: ctx.variant, size: ctx.size })}${className ? ` ${className}` : ''}`}
      aria-label={ariaLabel}
      {...ctx.triggerProps}
    >
      {children ?? (
        <>
          {ctx.selectedLabel ? (
            <span className={selectValueStyle}>{ctx.selectedLabel}</span>
          ) : (
            <span className={selectPlaceholderStyle}>
              {ctx.placeholder || '\u00A0'}
            </span>
          )}
          <ChevronIndicator />
        </>
      )}
    </button>
  );
});

/** Select.Content — dropdown listbox */
export const SelectContent = forwardRef<HTMLUListElement, {
  className?: string;
  children?: React.ReactNode;
}>(function SelectContent(props, ref) {
  const ctx = useSelectContext();
  const { className, children } = props;

  if (!ctx.isOpen) return null;

  return (
    <ul
      ref={ref}
      className={`${selectListboxStyle}${className ? ` ${className}` : ''}`}
      onMouseDown={preventBlur}
      {...ctx.listboxProps}
    >
      {children ?? renderOptions(ctx.options, ctx)}
    </ul>
  );
});

/** Select.Option — tek seçenek */
export const SelectOption = forwardRef<HTMLLIElement, {
  index: number;
  className?: string;
  children?: React.ReactNode;
}>(function SelectOption(props, ref) {
  const ctx = useSelectContext();
  const { index, className, children } = props;
  const opt = ctx.flatOptions[index];

  return (
    <li
      ref={ref}
      className={`${selectOptionStyle}${className ? ` ${className}` : ''}`}
      id={`option-${index}`}
      {...ctx.getOptionProps(index)}
    >
      {children ?? opt?.label}
    </li>
  );
});

/** Select.Group — seçenek grubu */
export function SelectGroup(props: {
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

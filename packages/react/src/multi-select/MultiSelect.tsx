/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * MultiSelect — styled coklu secim bileseni (Dual API).
 * MultiSelect — styled multi-select component (Dual API).
 *
 * Props-based: `<MultiSelect options={[...]} placeholder="Secin" />`
 * Compound:    `<MultiSelect options={[...]}><MultiSelect.Trigger>...</MultiSelect.Trigger>...</MultiSelect>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type {
  MultiSelectVariant,
  MultiSelectSize,
  SelectValue,
  SelectOptionOrGroup,
} from '@relteco/relui-core';
import { isOptionGroup } from '@relteco/relui-core';
import { useMultiSelect, type UseMultiSelectProps, type UseMultiSelectReturn } from './useMultiSelect';
import {
  multiSelectTagsStyle,
  multiSelectTagStyle,
  multiSelectTagRemoveStyle,
  multiSelectCheckboxStyle,
} from './multi-select.css';
import {
  selectRootStyle,
  selectTriggerRecipe,
  selectPlaceholderStyle,
  selectIndicatorStyle,
  selectListboxStyle,
  selectOptionStyle,
  selectGroupLabelStyle,
  selectEmptyStyle,
} from '../select/select.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

/** MultiSelect slot isimleri. */
export type MultiSelectSlot =
  | 'root'
  | 'trigger'
  | 'tagsContainer'
  | 'tag'
  | 'tagRemoveButton'
  | 'placeholder'
  | 'indicator'
  | 'listbox'
  | 'option'
  | 'checkboxIndicator'
  | 'groupLabel';

// ── Context (Compound API) ──────────────────────────────────────────

interface MultiSelectContextValue {
  variant: MultiSelectVariant;
  size: MultiSelectSize;
  isOpen: boolean;
  selectedValues: SelectValue[];
  selectedLabels: string[];
  selectionCount: number;
  triggerProps: UseMultiSelectReturn['triggerProps'];
  listboxProps: UseMultiSelectReturn['listboxProps'];
  getOptionProps: UseMultiSelectReturn['getOptionProps'];
  removeValue: UseMultiSelectReturn['removeValue'];
  options: SelectOptionOrGroup[];
  placeholder: string | undefined;
  classNames: ClassNames<MultiSelectSlot> | undefined;
  styles: Styles<MultiSelectSlot> | undefined;
  name: string | undefined;
  ariaLabel: string | undefined;
  ariaDescribedBy: string | undefined;
}

const MultiSelectContext = createContext<MultiSelectContextValue | null>(null);

function useMultiSelectContext(): MultiSelectContextValue {
  const ctx = useContext(MultiSelectContext);
  if (!ctx) throw new Error('MultiSelect compound sub-components must be used within <MultiSelect>.');
  return ctx;
}

// ── Compound: MultiSelect.Trigger ───────────────────────────────────

/** MultiSelect.Trigger props */
export interface MultiSelectTriggerProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const MultiSelectTrigger = forwardRef<HTMLDivElement, MultiSelectTriggerProps>(
  function MultiSelectTrigger(props, ref) {
    const { children, className } = props;
    const ctx = useMultiSelectContext();
    const slot = getSlotProps(
      'trigger',
      selectTriggerRecipe({ variant: ctx.variant, size: ctx.size }),
      ctx.classNames,
      ctx.styles,
      { height: 'auto', minHeight: triggerMinHeight(ctx.size) },
    );
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div
        ref={ref}
        className={cls}
        style={slot.style}
        aria-label={ctx.ariaLabel}
        aria-describedby={ctx.ariaDescribedBy}
        data-testid="multiselect-trigger"
        {...ctx.triggerProps}
      >
        {children}
      </div>
    );
  },
);

// ── Compound: MultiSelect.Value ─────────────────────────────────────

/** MultiSelect.Value props */
export interface MultiSelectValueProps {
  /** Placeholder metni / Placeholder text */
  placeholder?: string;
  /** Ek className / Additional className */
  className?: string;
}

const MultiSelectValue = forwardRef<HTMLSpanElement, MultiSelectValueProps>(
  function MultiSelectValue(props, ref) {
    const { placeholder, className } = props;
    const ctx = useMultiSelectContext();

    if (ctx.selectionCount > 0) {
      const tagsSlot = getSlotProps('tagsContainer', multiSelectTagsStyle, ctx.classNames, ctx.styles);
      const tagSlot = getSlotProps('tag', multiSelectTagStyle, ctx.classNames, ctx.styles);
      const tagRemoveSlot = getSlotProps('tagRemoveButton', multiSelectTagRemoveStyle, ctx.classNames, ctx.styles);
      const cls = className ? `${tagsSlot.className} ${className}` : tagsSlot.className;

      return (
        <span ref={ref} className={cls} style={tagsSlot.style} data-testid="multiselect-value">
          {ctx.selectedLabels.map((label, i) => {
            const value = ctx.selectedValues[i];
            return (
              <span key={String(value)} className={tagSlot.className} style={tagSlot.style}>
                <span>{label}</span>
                <button
                  type="button"
                  className={tagRemoveSlot.className}
                  style={tagRemoveSlot.style}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (value !== undefined) ctx.removeValue(value);
                  }}
                  aria-label={`${label} kaldir`}
                  tabIndex={-1}
                >
                  ✕
                </button>
              </span>
            );
          })}
        </span>
      );
    }

    const slot = getSlotProps('placeholder', selectPlaceholderStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <span ref={ref} className={cls} style={slot.style} data-testid="multiselect-value">
        {placeholder ?? ctx.placeholder ?? '\u00A0'}
      </span>
    );
  },
);

// ── Compound: MultiSelect.Content ───────────────────────────────────

/** MultiSelect.Content props */
export interface MultiSelectContentProps {
  /** Icerik / Content */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const MultiSelectContent = forwardRef<HTMLUListElement, MultiSelectContentProps>(
  function MultiSelectContent(props, ref) {
    const { children, className } = props;
    const ctx = useMultiSelectContext();

    if (!ctx.isOpen) return null;

    const slot = getSlotProps('listbox', selectListboxStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const optionSlot = getSlotProps('option', selectOptionStyle, ctx.classNames, ctx.styles);
    const checkboxSlot = getSlotProps('checkboxIndicator', multiSelectCheckboxStyle, ctx.classNames, ctx.styles);
    const groupLabelSlot = getSlotProps('groupLabel', selectGroupLabelStyle, ctx.classNames, ctx.styles);

    return (
      <ul
        ref={ref}
        {...ctx.listboxProps}
        className={cls}
        style={slot.style}
        onMouseDown={preventBlur}
        data-testid="multiselect-content"
      >
        {children ?? (
          ctx.options.length === 0 ? (
            <li className={selectEmptyStyle}>Secenek yok</li>
          ) : (
            renderOptionsWithSlots(ctx.options, ctx.selectedValues, ctx.getOptionProps, optionSlot, checkboxSlot, groupLabelSlot)
          )
        )}
      </ul>
    );
  },
);

// ── Compound: MultiSelect.Option ────────────────────────────────────

/** MultiSelect.Option props */
export interface MultiSelectOptionProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Secenek indeksi / Option index */
  index: number;
  /** Ek className / Additional className */
  className?: string;
}

const MultiSelectOption = forwardRef<HTMLLIElement, MultiSelectOptionProps>(
  function MultiSelectOption(props, ref) {
    const { children, index, className } = props;
    const ctx = useMultiSelectContext();
    const slot = getSlotProps('option', selectOptionStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <li
        ref={ref}
        className={cls}
        style={slot.style}
        id={`ms-option-${index}`}
        data-testid="multiselect-option"
        {...ctx.getOptionProps(index)}
      >
        {children}
      </li>
    );
  },
);

// ── Component Props ─────────────────────────────────────────────────

export interface MultiSelectComponentProps extends UseMultiSelectProps, SlotStyleProps<MultiSelectSlot> {
  /** Gorsel varyant / Visual variant */
  variant?: MultiSelectVariant;

  /** Boyut / Size */
  size?: MultiSelectSize;

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

const MultiSelectBase = forwardRef<HTMLDivElement, MultiSelectComponentProps>(
  function MultiSelect(props, ref) {
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
      selectedValues,
      selectedLabels,
      selectionCount,
      removeValue,
    } = useMultiSelect(selectProps);

    // Hidden inputs for form submission
    const hiddenInputs = name
      ? selectedValues.map((v) => (
          <input
            key={String(v)}
            type="hidden"
            name={name}
            value={String(v)}
          />
        ))
      : null;

    // Slot props
    const rootSlot = getSlotProps('root', selectRootStyle, classNames, styles);
    const rootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    // ── Compound API ──
    if (children) {
      const ctxValue: MultiSelectContextValue = {
        variant,
        size,
        isOpen,
        selectedValues,
        selectedLabels,
        selectionCount,
        triggerProps,
        listboxProps,
        getOptionProps,
        removeValue,
        options: selectProps.options,
        placeholder: selectProps.placeholder,
        classNames,
        styles,
        name,
        ariaLabel,
        ariaDescribedBy,
      };

      return (
        <MultiSelectContext.Provider value={ctxValue}>
          <div ref={ref} className={rootClassName} style={rootSlot.style} id={id} data-testid="multiselect-root">
            {children}
            {hiddenInputs}
          </div>
        </MultiSelectContext.Provider>
      );
    }

    // ── Props-based API ──
    const triggerSlot = getSlotProps('trigger', selectTriggerRecipe({ variant, size }), classNames, styles, { height: 'auto', minHeight: triggerMinHeight(size) });
    const tagsContainerSlot = getSlotProps('tagsContainer', multiSelectTagsStyle, classNames, styles);
    const tagSlot = getSlotProps('tag', multiSelectTagStyle, classNames, styles);
    const tagRemoveSlot = getSlotProps('tagRemoveButton', multiSelectTagRemoveStyle, classNames, styles);
    const placeholderSlot = getSlotProps('placeholder', selectPlaceholderStyle, classNames, styles);
    const indicatorSlot = getSlotProps('indicator', selectIndicatorStyle, classNames, styles);
    const listboxSlot = getSlotProps('listbox', selectListboxStyle, classNames, styles);
    const groupLabelSlot = getSlotProps('groupLabel', selectGroupLabelStyle, classNames, styles);
    const optionSlot = getSlotProps('option', selectOptionStyle, classNames, styles);
    const checkboxSlot = getSlotProps('checkboxIndicator', multiSelectCheckboxStyle, classNames, styles);

    return (
      <div ref={ref} className={rootClassName} style={rootSlot.style} id={id} data-testid="multiselect-root">
        {/* Trigger — div kullanilir cunku icinde tag remove button'lari var */}
        <div
          className={triggerSlot.className}
          style={triggerSlot.style}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          data-testid="multiselect-trigger"
          {...triggerProps}
        >
          {selectionCount > 0 ? (
            <span className={tagsContainerSlot.className} style={tagsContainerSlot.style}>
              {selectedLabels.map((label, i) => {
                const value = selectedValues[i];
                return (
                  <span key={String(value)} className={tagSlot.className} style={tagSlot.style}>
                    <span>{label}</span>
                    <button
                      type="button"
                      className={tagRemoveSlot.className}
                      style={tagRemoveSlot.style}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (value !== undefined) removeValue(value);
                      }}
                      aria-label={`${label} kaldir`}
                      tabIndex={-1}
                    >
                      ✕
                    </button>
                  </span>
                );
              })}
            </span>
          ) : (
            <span className={placeholderSlot.className} style={placeholderSlot.style}>
              {selectProps.placeholder || '\u00A0'}
            </span>
          )}
          <ChevronIndicator className={indicatorSlot.className} style={indicatorSlot.style} />
        </div>

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
              renderOptionsWithSlots(selectProps.options, selectedValues, getOptionProps, optionSlot, checkboxSlot, groupLabelSlot)
            )}
          </ul>
        )}

        {/* Hidden inputs for forms */}
        {hiddenInputs}
      </div>
    );
  },
);

/**
 * MultiSelect bileseni — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <MultiSelect
 *   options={[{ value: 'tr', label: 'Turkiye' }]}
 *   placeholder="Ulke secin"
 *   onValueChange={(values) => console.log(values)}
 * />
 * ```
 *
 * @example Compound
 * ```tsx
 * <MultiSelect options={[{ value: 'tr', label: 'Turkiye' }]}>
 *   <MultiSelect.Trigger>
 *     <MultiSelect.Value placeholder="Ulke secin" />
 *   </MultiSelect.Trigger>
 *   <MultiSelect.Content />
 * </MultiSelect>
 * ```
 */
export const MultiSelect = Object.assign(MultiSelectBase, {
  Trigger: MultiSelectTrigger,
  Value: MultiSelectValue,
  Content: MultiSelectContent,
  Option: MultiSelectOption,
});

// ── Blur engelleme — listbox'a tiklayinca trigger blur olmasin ──────

function preventBlur(event: React.MouseEvent) {
  event.preventDefault();
}

// ── Chevron Indicator ───────────────────────────────────────────────

function ChevronIndicator(props: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      className={props.className ?? selectIndicatorStyle}
      style={props.style}
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

// ── Trigger min-height — size'a gore ────────────────────────────────

function triggerMinHeight(size: MultiSelectSize): string {
  switch (size) {
    case 'xs': return '1.5rem';
    case 'sm': return '1.75rem';
    case 'md': return '2rem';
    case 'lg': return '2.25rem';
    case 'xl': return '2.5rem';
  }
}

// ── Checkbox indicator ──────────────────────────────────────────────

function CheckboxIndicator(props: {
  checked: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={props.className ?? multiSelectCheckboxStyle}
      style={props.style}
      data-checked={props.checked ? '' : undefined}
    >
      {props.checked && (
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2 5l2.5 2.5L8 3" />
        </svg>
      )}
    </span>
  );
}

// ── Slot prop result tipi ───────────────────────────────────────────

interface SlotResult {
  className: string;
  style: React.CSSProperties | undefined;
}

// ── Option renderer (slot destekli) ─────────────────────────────────

function renderOptionsWithSlots(
  options: SelectOptionOrGroup[],
  selectedValues: SelectValue[],
  getOptionProps: UseMultiSelectReturn['getOptionProps'],
  optionSlot: SlotResult,
  checkboxSlot: SlotResult,
  groupLabelSlot: SlotResult,
): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let flatIndex = 0;

  for (const item of options) {
    if (isOptionGroup(item)) {
      nodes.push(
        <li key={`group-${item.label}`} role="presentation">
          <div className={groupLabelSlot.className} style={groupLabelSlot.style}>{item.label}</div>
          <ul role="group" aria-label={item.label} style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {item.options.map((opt) => {
              const idx = flatIndex++;
              const isSelected = selectedValues.indexOf(opt.value) >= 0;
              return (
                <li
                  key={`opt-${String(opt.value)}`}
                  className={optionSlot.className}
                  style={optionSlot.style}
                  id={`ms-option-${idx}`}
                  {...getOptionProps(idx)}
                >
                  <CheckboxIndicator
                    checked={isSelected}
                    className={checkboxSlot.className}
                    style={checkboxSlot.style}
                  />
                  {opt.label}
                </li>
              );
            })}
          </ul>
        </li>,
      );
    } else {
      const idx = flatIndex++;
      const isSelected = selectedValues.indexOf(item.value) >= 0;
      nodes.push(
        <li
          key={`opt-${String(item.value)}`}
          className={optionSlot.className}
          style={optionSlot.style}
          id={`ms-option-${idx}`}
          {...getOptionProps(idx)}
        >
          <CheckboxIndicator
            checked={isSelected}
            className={checkboxSlot.className}
            style={checkboxSlot.style}
          />
          {item.label}
        </li>,
      );
    }
  }

  return nodes;
}

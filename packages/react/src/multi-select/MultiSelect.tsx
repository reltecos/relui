/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * MultiSelect — styled çoklu seçim bileşeni.
 * MultiSelect — styled multi-select component.
 *
 * Compound component pattern: MultiSelect (root), trigger, content, option, group.
 * Core state machine üzerinde React hook + Vanilla Extract stiller.
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, useMemo } from 'react';
import type {
  MultiSelectVariant,
  MultiSelectSize,
  SelectValue,
  SelectOption as CoreSelectOption,
  SelectOptionOrGroup,
} from '@relteco/relui-core';
import { isOptionGroup } from '@relteco/relui-core';
import { useMultiSelect, type UseMultiSelectProps } from './useMultiSelect';
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

// ── Context ─────────────────────────────────────────────────────────

interface MultiSelectContextValue {
  triggerProps: ReturnType<typeof useMultiSelect>['triggerProps'];
  listboxProps: ReturnType<typeof useMultiSelect>['listboxProps'];
  getOptionProps: ReturnType<typeof useMultiSelect>['getOptionProps'];
  isOpen: boolean;
  selectedValues: SelectValue[];
  selectedLabels: string[];
  selectionCount: number;
  isAllSelected: boolean;
  options: SelectOptionOrGroup[];
  flatOptions: CoreSelectOption[];
  placeholder: string;
  variant: MultiSelectVariant;
  size: MultiSelectSize;
  removeValue: (value: SelectValue) => void;
  selectAll: () => void;
  clearAll: () => void;
  classNames: ClassNames<MultiSelectSlot> | undefined;
  styles: Styles<MultiSelectSlot> | undefined;
}

const MultiSelectContext = createContext<MultiSelectContextValue | null>(null);

function useMultiSelectContext(): MultiSelectContextValue {
  const ctx = useContext(MultiSelectContext);
  if (!ctx) {
    throw new Error('MultiSelect compound components must be used within <MultiSelect>');
  }
  return ctx;
}

// ── MultiSelect Component Props ────────────────────────────────────

export interface MultiSelectComponentProps extends UseMultiSelectProps, SlotStyleProps<MultiSelectSlot> {
  /** Görsel varyant / Visual variant */
  variant?: MultiSelectVariant;

  /** Boyut / Size */
  size?: MultiSelectSize;

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
 * MultiSelect bileşeni — çoklu seçim dropdown.
 * MultiSelect component — multi-select dropdown.
 *
 * @example
 * ```tsx
 * <MultiSelect
 *   options={[
 *     { value: 'tr', label: 'Türkiye' },
 *     { value: 'us', label: 'ABD' },
 *     { value: 'de', label: 'Almanya' },
 *   ]}
 *   placeholder="Ülke seçin"
 *   onValueChange={(values) => console.log(values)}
 * />
 * ```
 */
export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectComponentProps>(
  function MultiSelect(props, ref) {
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
      selectedValues,
      selectedLabels,
      selectionCount,
      isAllSelected,
      removeValue,
      selectAll,
      clearAll,
    } = useMultiSelect(selectProps);

    const ctx = useMemo<MultiSelectContextValue>(
      () => ({
        triggerProps,
        listboxProps,
        getOptionProps,
        isOpen,
        selectedValues,
        selectedLabels,
        selectionCount,
        isAllSelected,
        options: selectProps.options,
        flatOptions: selectProps.options.flatMap((item) =>
          isOptionGroup(item) ? item.options : [item],
        ),
        placeholder: selectProps.placeholder ?? '',
        variant,
        size,
        removeValue,
        selectAll,
        clearAll,
        classNames,
        styles,
      }),
      [
        triggerProps,
        listboxProps,
        getOptionProps,
        isOpen,
        selectedValues,
        selectedLabels,
        selectionCount,
        isAllSelected,
        selectProps.options,
        selectProps.placeholder,
        variant,
        size,
        removeValue,
        selectAll,
        clearAll,
        classNames,
        styles,
      ],
    );

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

    // Compound component
    if (children) {
      return (
        <MultiSelectContext.Provider value={ctx}>
          <div ref={ref} className={rootClassName} style={rootSlot.style} id={id}>
            {children}
            {hiddenInputs}
          </div>
        </MultiSelectContext.Provider>
      );
    }

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

    // Otomatik (basit) render
    return (
      <MultiSelectContext.Provider value={ctx}>
        <div ref={ref} className={rootClassName} style={rootSlot.style} id={id}>
          {/* Trigger — div kullanılır çünkü içinde tag remove button'ları var */}
          <div
            className={triggerSlot.className}
            style={triggerSlot.style}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedBy}
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
                        aria-label={`${label} kaldır`}
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
                <li className={selectEmptyStyle}>Seçenek yok</li>
              ) : (
                renderOptionsWithSlots(selectProps.options, ctx, optionSlot, checkboxSlot, groupLabelSlot)
              )}
            </ul>
          )}

          {/* Hidden inputs for forms */}
          {hiddenInputs}
        </div>
      </MultiSelectContext.Provider>
    );
  },
);

// ── Blur engelleme — listbox'a tıklayınca trigger blur olmasın ──────

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

// ── Trigger min-height — size'a göre ────────────────────────────────

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

// ── Slot prop result tipi ─────────────────────────────────────────────

interface SlotResult {
  className: string;
  style: React.CSSProperties | undefined;
}

// ── Option renderer (compound component icin, slot'suz) ──────────────

function renderOptions(
  options: SelectOptionOrGroup[],
  ctx: MultiSelectContextValue,
): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let flatIndex = 0;

  for (const item of options) {
    if (isOptionGroup(item)) {
      nodes.push(
        <li key={`group-${item.label}`} role="presentation">
          <div className={selectGroupLabelStyle}>{item.label}</div>
          <ul role="group" aria-label={item.label} style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {item.options.map((opt) => {
              const idx = flatIndex++;
              const isSelected = ctx.selectedValues.indexOf(opt.value) >= 0;
              return (
                <li
                  key={`opt-${String(opt.value)}`}
                  className={selectOptionStyle}
                  id={`ms-option-${idx}`}
                  {...ctx.getOptionProps(idx)}
                >
                  <CheckboxIndicator checked={isSelected} />
                  {opt.label}
                </li>
              );
            })}
          </ul>
        </li>,
      );
    } else {
      const idx = flatIndex++;
      const isSelected = ctx.selectedValues.indexOf(item.value) >= 0;
      nodes.push(
        <li
          key={`opt-${String(item.value)}`}
          className={selectOptionStyle}
          id={`ms-option-${idx}`}
          {...ctx.getOptionProps(idx)}
        >
          <CheckboxIndicator checked={isSelected} />
          {item.label}
        </li>,
      );
    }
  }

  return nodes;
}

// ── Option renderer (otomatik render icin, slot destekli) ────────────

function renderOptionsWithSlots(
  options: SelectOptionOrGroup[],
  ctx: MultiSelectContextValue,
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
              const isSelected = ctx.selectedValues.indexOf(opt.value) >= 0;
              return (
                <li
                  key={`opt-${String(opt.value)}`}
                  className={optionSlot.className}
                  style={optionSlot.style}
                  id={`ms-option-${idx}`}
                  {...ctx.getOptionProps(idx)}
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
      const isSelected = ctx.selectedValues.indexOf(item.value) >= 0;
      nodes.push(
        <li
          key={`opt-${String(item.value)}`}
          className={optionSlot.className}
          style={optionSlot.style}
          id={`ms-option-${idx}`}
          {...ctx.getOptionProps(idx)}
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

// ── Compound Components ─────────────────────────────────────────────

/** MultiSelect.Trigger — dropdown trigger div (button yerine div: nested button uyumluluğu) */
export const MultiSelectTrigger = forwardRef<HTMLDivElement, {
  className?: string;
  children?: React.ReactNode;
  'aria-label'?: string;
}>(function MultiSelectTrigger(props, ref) {
  const ctx = useMultiSelectContext();
  const { className, children, 'aria-label': ariaLabel } = props;

  return (
    <div
      ref={ref}
      className={`${selectTriggerRecipe({ variant: ctx.variant, size: ctx.size })}${className ? ` ${className}` : ''}`}
      aria-label={ariaLabel}
      {...ctx.triggerProps}
      style={{ height: 'auto', minHeight: triggerMinHeight(ctx.size) }}
    >
      {children ?? (
        <>
          {ctx.selectionCount > 0 ? (
            <span className={multiSelectTagsStyle}>
              {ctx.selectedLabels.map((label, i) => {
                const value = ctx.selectedValues[i];
                return (
                  <span key={String(value)} className={multiSelectTagStyle}>
                    <span>{label}</span>
                    <button
                      type="button"
                      className={multiSelectTagRemoveStyle}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (value !== undefined) ctx.removeValue(value);
                      }}
                      aria-label={`${label} kaldır`}
                      tabIndex={-1}
                    >
                      ✕
                    </button>
                  </span>
                );
              })}
            </span>
          ) : (
            <span className={selectPlaceholderStyle}>
              {ctx.placeholder || '\u00A0'}
            </span>
          )}
          <ChevronIndicator />
        </>
      )}
    </div>
  );
});

/** MultiSelect.Content — dropdown listbox */
export const MultiSelectContent = forwardRef<HTMLUListElement, {
  className?: string;
  children?: React.ReactNode;
}>(function MultiSelectContent(props, ref) {
  const ctx = useMultiSelectContext();
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

/** MultiSelect.Option — tek seçenek */
export const MultiSelectOption = forwardRef<HTMLLIElement, {
  index: number;
  className?: string;
  children?: React.ReactNode;
}>(function MultiSelectOption(props, ref) {
  const ctx = useMultiSelectContext();
  const { index, className, children } = props;
  const opt = ctx.flatOptions[index];
  const isSelected = opt ? ctx.selectedValues.indexOf(opt.value) >= 0 : false;

  return (
    <li
      ref={ref}
      className={`${selectOptionStyle}${className ? ` ${className}` : ''}`}
      id={`ms-option-${index}`}
      {...ctx.getOptionProps(index)}
    >
      <CheckboxIndicator checked={isSelected} />
      {children ?? opt?.label}
    </li>
  );
});

/** MultiSelect.Group — seçenek grubu */
export function MultiSelectGroup(props: {
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

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Cascader — styled cascader bileseni (Dual API).
 * Cascader — styled cascader component (Dual API).
 *
 * Hiyerarsik cok seviyeli secim bileseni.
 * Props-based: `<Cascader options={[...]} placeholder="Secin" />`
 * Compound:    `<Cascader options={[...]}><Cascader.Trigger>...</Cascader.Trigger>...</Cascader>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type {
  CascaderVariant,
  CascaderSize,
  CascaderValue,
} from '@relteco/relui-core';
import { ChevronRightIcon } from '@relteco/relui-icons';
import { useCascader, type UseCascaderProps, type UseCascaderReturn } from './useCascader';
import {
  selectRootStyle,
  selectTriggerRecipe,
  selectPlaceholderStyle,
  selectValueStyle,
  selectIndicatorStyle,
} from '../select/select.css';
import {
  cascaderPanelStyle,
  cascaderColumnStyle,
  cascaderOptionStyle,
  cascaderExpandIndicatorStyle,
} from './cascader.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

/** Cascader slot isimleri. */
export type CascaderSlot =
  | 'root'
  | 'trigger'
  | 'placeholder'
  | 'value'
  | 'indicator'
  | 'panel'
  | 'column'
  | 'option';

// ── Context (Compound API) ──────────────────────────────────────────

interface CascaderContextValue {
  variant: CascaderVariant;
  size: CascaderSize;
  isOpen: boolean;
  selectedPath: CascaderValue[];
  selectedLabels: string[];
  displayValue: string | undefined;
  triggerProps: UseCascaderReturn['triggerProps'];
  getColumnProps: UseCascaderReturn['getColumnProps'];
  getOptionProps: UseCascaderReturn['getOptionProps'];
  getOptionsAtLevel: UseCascaderReturn['getOptionsAtLevel'];
  visibleColumnCount: number;
  placeholder: string | undefined;
  classNames: ClassNames<CascaderSlot> | undefined;
  styles: Styles<CascaderSlot> | undefined;
  name: string | undefined;
  ariaLabel: string | undefined;
  ariaDescribedBy: string | undefined;
}

const CascaderContext = createContext<CascaderContextValue | null>(null);

function useCascaderContext(): CascaderContextValue {
  const ctx = useContext(CascaderContext);
  if (!ctx) throw new Error('Cascader compound sub-components must be used within <Cascader>.');
  return ctx;
}

// ── Compound: Cascader.Trigger ──────────────────────────────────────

/** Cascader.Trigger props */
export interface CascaderTriggerProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const CascaderTrigger = forwardRef<HTMLButtonElement, CascaderTriggerProps>(
  function CascaderTrigger(props, ref) {
    const { children, className } = props;
    const ctx = useCascaderContext();
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
        data-testid="cascader-trigger"
        {...ctx.triggerProps}
      >
        {children}
      </button>
    );
  },
);

// ── Compound: Cascader.Panel ────────────────────────────────────────

/** Cascader.Panel props */
export interface CascaderPanelProps {
  /** Icerik / Content */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const CascaderPanel = forwardRef<HTMLDivElement, CascaderPanelProps>(
  function CascaderPanel(props, ref) {
    const { children, className } = props;
    const ctx = useCascaderContext();

    if (!ctx.isOpen) return null;

    const slot = getSlotProps('panel', cascaderPanelStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const columnSlot = getSlotProps('column', cascaderColumnStyle, ctx.classNames, ctx.styles);
    const optionSlot = getSlotProps('option', cascaderOptionStyle, ctx.classNames, ctx.styles);

    return (
      <div
        ref={ref}
        className={cls}
        style={slot.style}
        onMouseDown={preventBlur}
        data-testid="cascader-panel"
      >
        {children ?? (
          Array.from({ length: ctx.visibleColumnCount }, (_, level) => {
            const levelOptions = ctx.getOptionsAtLevel(level);
            if (levelOptions.length === 0) return null;

            const colProps = ctx.getColumnProps(level);

            return (
              <ul
                key={`col-${level}`}
                className={columnSlot.className}
                style={columnSlot.style}
                {...colProps}
              >
                {levelOptions.map((opt, idx) => {
                  const optProps = ctx.getOptionProps(level, idx);
                  const hasChildren = opt.children && opt.children.length > 0;

                  return (
                    <li
                      key={`opt-${String(opt.value)}`}
                      className={optionSlot.className}
                      style={optionSlot.style}
                      {...optProps}
                    >
                      <span>{opt.label}</span>
                      {hasChildren && (
                        <ChevronRightIcon
                          size={12}
                          className={cascaderExpandIndicatorStyle}
                          aria-hidden="true"
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            );
          })
        )}
      </div>
    );
  },
);

// ── Compound: Cascader.Column ───────────────────────────────────────

/** Cascader.Column props */
export interface CascaderColumnProps {
  /** Seviye / Level */
  level: number;
  /** Icerik / Content */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const CascaderColumn = forwardRef<HTMLUListElement, CascaderColumnProps>(
  function CascaderColumn(props, ref) {
    const { level, children, className } = props;
    const ctx = useCascaderContext();
    const slot = getSlotProps('column', cascaderColumnStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const colProps = ctx.getColumnProps(level);

    return (
      <ul
        ref={ref}
        className={cls}
        style={slot.style}
        data-testid="cascader-column"
        {...colProps}
      >
        {children}
      </ul>
    );
  },
);

// ── Component Props ─────────────────────────────────────────────────

export interface CascaderComponentProps extends UseCascaderProps, SlotStyleProps<CascaderSlot> {
  /** Gorsel varyant / Visual variant */
  variant?: CascaderVariant;

  /** Boyut / Size */
  size?: CascaderSize;

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

  /**
   * Secili yolun gosterim formati.
   * Display format for selected path.
   * @default 'full'
   */
  displayMode?: 'full' | 'last';

  /**
   * Yol ayirici.
   * Path separator.
   * @default ' / '
   */
  separator?: string;

  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
}

// ── Component ───────────────────────────────────────────────────────

const CascaderBase = forwardRef<HTMLDivElement, CascaderComponentProps>(
  function Cascader(props, ref) {
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
      displayMode = 'full',
      separator = ' / ',
      children,
      ...cascaderProps
    } = props;

    const {
      triggerProps,
      getColumnProps,
      getOptionProps,
      getOptionsAtLevel,
      isOpen,
      selectedPath,
      selectedLabels,
      visibleColumnCount,
    } = useCascader(cascaderProps);

    // ── Slot props ──
    const rootSlot = getSlotProps('root', selectRootStyle, classNames, styles);
    const rootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    // ── Display value ──
    const displayValue = selectedLabels.length > 0
      ? displayMode === 'last'
        ? selectedLabels[selectedLabels.length - 1]
        : selectedLabels.join(separator)
      : undefined;

    // ── Hidden inputs for form submission ──
    const hiddenInputValue = selectedPath.map(String).join(',');

    // ── Compound API ──
    if (children) {
      const ctxValue: CascaderContextValue = {
        variant,
        size,
        isOpen,
        selectedPath,
        selectedLabels,
        displayValue,
        triggerProps,
        getColumnProps,
        getOptionProps,
        getOptionsAtLevel,
        visibleColumnCount,
        placeholder: cascaderProps.placeholder,
        classNames,
        styles,
        name,
        ariaLabel,
        ariaDescribedBy,
      };

      return (
        <CascaderContext.Provider value={ctxValue}>
          <div ref={ref} className={rootClassName} style={rootSlot.style} id={id} data-testid="cascader-root">
            {children}
            {name && (
              <input type="hidden" name={name} value={hiddenInputValue} />
            )}
          </div>
        </CascaderContext.Provider>
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
    const indicatorSlot = getSlotProps('indicator', selectIndicatorStyle, classNames, styles);
    const panelSlot = getSlotProps('panel', cascaderPanelStyle, classNames, styles);
    const columnSlot = getSlotProps('column', cascaderColumnStyle, classNames, styles);
    const optionSlot = getSlotProps('option', cascaderOptionStyle, classNames, styles);

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
          {displayValue ? (
            <span className={valueSlot.className} style={valueSlot.style}>
              {displayValue}
            </span>
          ) : (
            <span className={placeholderSlot.className} style={placeholderSlot.style}>
              {cascaderProps.placeholder || '\u00A0'}
            </span>
          )}
          <ChevronIndicator className={indicatorSlot.className} style={indicatorSlot.style} />
        </button>

        {/* Panel — multi-column dropdown */}
        {isOpen && (
          <div
            className={panelSlot.className}
            style={panelSlot.style}
            onMouseDown={preventBlur}
          >
            {Array.from({ length: visibleColumnCount }, (_, level) => {
              const levelOptions = getOptionsAtLevel(level);
              if (levelOptions.length === 0) return null;

              const colProps = getColumnProps(level);

              return (
                <ul
                  key={`col-${level}`}
                  className={columnSlot.className}
                  style={columnSlot.style}
                  {...colProps}
                >
                  {levelOptions.map((opt, idx) => {
                    const optProps = getOptionProps(level, idx);
                    const hasChildren = opt.children && opt.children.length > 0;

                    return (
                      <li
                        key={`opt-${String(opt.value)}`}
                        className={optionSlot.className}
                        style={optionSlot.style}
                        {...optProps}
                      >
                        <span>{opt.label}</span>
                        {hasChildren && (
                          <ChevronRightIcon
                            size={12}
                            className={cascaderExpandIndicatorStyle}
                            aria-hidden="true"
                          />
                        )}
                      </li>
                    );
                  })}
                </ul>
              );
            })}
          </div>
        )}

        {/* Hidden input for forms */}
        {name && (
          <input
            type="hidden"
            name={name}
            value={hiddenInputValue}
          />
        )}
      </div>
    );
  },
);

/**
 * Cascader bileseni — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Cascader
 *   options={[{ value: 'tr', label: 'Turkiye', children: [...] }]}
 *   placeholder="Konum secin"
 *   onValueChange={(path) => console.log(path)}
 * />
 * ```
 *
 * @example Compound
 * ```tsx
 * <Cascader options={[{ value: 'tr', label: 'Turkiye', children: [...] }]}>
 *   <Cascader.Trigger>
 *     <span>{displayValue || 'Konum secin'}</span>
 *   </Cascader.Trigger>
 *   <Cascader.Panel />
 * </Cascader>
 * ```
 */
export const Cascader = Object.assign(CascaderBase, {
  Trigger: CascaderTrigger,
  Panel: CascaderPanel,
  Column: CascaderColumn,
});

// ── Blur engelleme ──────────────────────────────────────────────────

function preventBlur(event: React.MouseEvent) {
  event.preventDefault();
}

// ── Chevron Indicator ───────────────────────────────────────────────

function ChevronIndicator(props: { className: string; style?: React.CSSProperties }) {
  return (
    <svg
      className={props.className}
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

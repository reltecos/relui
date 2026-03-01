/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Cascader — styled cascader bileşeni.
 * Cascader — styled cascader component.
 *
 * Hiyerarşik çok seviyeli seçim bileşeni.
 * Core state machine üzerinde React hook + Vanilla Extract stiller.
 *
 * @packageDocumentation
 */

import { forwardRef } from 'react';
import type {
  CascaderVariant,
  CascaderSize,
} from '@relteco/relui-core';
import { ChevronRightIcon } from '@relteco/relui-icons';
import { useCascader, type UseCascaderProps } from './useCascader';
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
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

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

// ── Component Props ─────────────────────────────────────────────────

export interface CascaderComponentProps extends UseCascaderProps, SlotStyleProps<CascaderSlot> {
  /** Görsel varyant / Visual variant */
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
   * Seçili yolun gösterim formatı.
   * Display format for selected path.
   * - 'full': tüm yolu göster (Türkiye / İstanbul / Kadıköy)
   * - 'last': sadece son etiketi göster (Kadıköy)
   * @default 'full'
   */
  displayMode?: 'full' | 'last';

  /**
   * Yol ayırıcı.
   * Path separator.
   * @default ' / '
   */
  separator?: string;
}

/**
 * Cascader bileşeni — hiyerarşik çok seviyeli seçim.
 * Cascader component — hierarchical multi-level selection.
 *
 * @example
 * ```tsx
 * <Cascader
 *   options={[
 *     {
 *       value: 'tr', label: 'Türkiye',
 *       children: [
 *         { value: 'ist', label: 'İstanbul' },
 *         { value: 'ank', label: 'Ankara' },
 *       ],
 *     },
 *   ]}
 *   placeholder="Konum seçin"
 *   onValueChange={(path) => console.log(path)}
 * />
 * ```
 */
export const Cascader = forwardRef<HTMLDivElement, CascaderComponentProps>(
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

    // ── Display value ──
    const displayValue = selectedLabels.length > 0
      ? displayMode === 'last'
        ? selectedLabels[selectedLabels.length - 1]
        : selectedLabels.join(separator)
      : undefined;

    // ── Hidden inputs for form submission ──
    const hiddenInputValue = selectedPath.map(String).join(',');

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

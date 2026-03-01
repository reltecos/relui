/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * MultiColumnCombobox — styled multi-column combobox bileşeni.
 * MultiColumnCombobox — styled multi-column combobox component.
 *
 * Combobox'ın çok sütunlu versiyonu — dropdown'da tablo gibi birden fazla sütun gösterilir.
 * Multi-column version of Combobox — displays multiple columns in dropdown like a table.
 *
 * @packageDocumentation
 */

import { forwardRef, useMemo } from 'react';
import type {
  MCComboboxVariant,
  MCComboboxSize,
} from '@relteco/relui-core';
import { useMultiColumnCombobox, type UseMultiColumnComboboxProps } from './useMultiColumnCombobox';
import { comboboxClearStyle } from '../combobox/combobox.css';
import {
  selectRootStyle,
  selectIndicatorStyle,
  selectListboxStyle,
} from '../select/select.css';
import { inputRecipe } from '../input/input.css';
import {
  mccbGridStyle,
  mccbHeaderRowStyle,
  mccbHeaderCellStyle,
  mccbRowStyle,
  mccbCellStyle,
  mccbNoResultStyle,
} from './multi-column-combobox.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

/** MultiColumnCombobox slot isimleri. */
export type MultiColumnComboboxSlot =
  | 'root'
  | 'inputWrapper'
  | 'input'
  | 'clearButton'
  | 'indicator'
  | 'listbox'
  | 'headerRow'
  | 'headerCell'
  | 'row'
  | 'cell'
  | 'noResult';

// ── Component Props ─────────────────────────────────────────────────

export interface MultiColumnComboboxComponentProps
  extends UseMultiColumnComboboxProps,
    SlotStyleProps<MultiColumnComboboxSlot> {
  /** Görsel varyant / Visual variant */
  variant?: MCComboboxVariant;

  /** Boyut / Size */
  size?: MCComboboxSize;

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

  /**
   * Dropdown genişliği (CSS değeri).
   * Dropdown width (CSS value).
   * - `'auto'`: içeriğe göre genişler, minWidth input genişliği (varsayılan)
   * - `'100%'`: input genişliğinde sabit
   * - `'30rem'`, `'500px'` vb: sabit genişlik
   * @default 'auto'
   */
  dropdownWidth?: string;
}

/**
 * MultiColumnCombobox bileşeni — çok sütunlu arama + filtreleme dropdown.
 * MultiColumnCombobox component — multi-column search + filtering dropdown.
 *
 * @example
 * ```tsx
 * <MultiColumnCombobox
 *   columns={[
 *     { key: 'code', header: 'Kod', width: '4rem' },
 *     { key: 'name', header: 'İsim' },
 *     { key: 'dept', header: 'Departman' },
 *   ]}
 *   items={[
 *     { value: 1, label: 'Ali Yılmaz', data: { code: 'E001', name: 'Ali Yılmaz', dept: 'Mühendislik' } },
 *     { value: 2, label: 'Ayşe Demir', data: { code: 'E002', name: 'Ayşe Demir', dept: 'Pazarlama' } },
 *   ]}
 *   placeholder="Çalışan arayın"
 *   onValueChange={(v) => console.log(v)}
 * />
 * ```
 */
export const MultiColumnCombobox = forwardRef<HTMLDivElement, MultiColumnComboboxComponentProps>(
  function MultiColumnCombobox(props, ref) {
    const {
      variant = 'outline',
      size = 'md',
      className,
      style: inlineStyle,
      classNames,
      styles,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      name,
      id,
      dropdownWidth = 'auto',
      ...mcComboboxProps
    } = props;

    const {
      inputProps,
      gridProps,
      getRowProps,
      isOpen,
      selectedValue,
      filteredItems,
      columns,
      showHeaders,
      clear,
    } = useMultiColumnCombobox(mcComboboxProps);

    // ── Slot props ──
    const rootSlot = getSlotProps('root', selectRootStyle, classNames, styles, inlineStyle);
    const rootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

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
    const dropdownWidthStyle: React.CSSProperties = dropdownWidth === 'auto'
      ? { right: 'auto', minWidth: '100%', width: 'max-content', maxWidth: '90vw' }
      : dropdownWidth === '100%'
        ? { left: 0, right: 0 }
        : { right: 'auto', width: dropdownWidth };
    const listboxSlot = getSlotProps('listbox', selectListboxStyle, classNames, styles, {
      ...dropdownWidthStyle,
      overflowX: 'auto',
      overflowY: 'hidden',
      padding: 0,
    });
    const headerRowSlot = getSlotProps('headerRow', mccbHeaderRowStyle, classNames, styles);
    const headerCellSlot = getSlotProps('headerCell', mccbHeaderCellStyle, classNames, styles);
    const rowSlot = getSlotProps('row', mccbRowStyle, classNames, styles);
    const cellSlot = getSlotProps('cell', mccbCellStyle, classNames, styles);
    const noResultSlot = getSlotProps('noResult', mccbNoResultStyle, classNames, styles);

    // ── Grid template columns ──
    const gridTemplateColumns = useMemo(() => {
      return columns
        .map((col) => col.width ?? 'minmax(6rem, auto)')
        .join(' ');
    }, [columns]);

    return (
      <div ref={ref} className={rootClassName} style={rootSlot.style} id={id}>
        {/* Input trigger */}
        <div className={inputWrapperSlot.className || undefined} style={inputWrapperSlot.style}>
          <input
            className={inputSlot.className}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedBy}
            placeholder={mcComboboxProps.placeholder}
            readOnly={mcComboboxProps.readOnly}
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

        {/* Grid dropdown */}
        {isOpen && (
          <div
            className={listboxSlot.className}
            style={listboxSlot.style}
            onMouseDown={preventBlur}
          >
            {filteredItems.length === 0 ? (
              <div
                {...gridProps}
                className={mccbGridStyle}
                style={{ gridTemplateColumns }}
              >
                <div className={noResultSlot.className} style={noResultSlot.style}>
                  Sonuç bulunamadı
                </div>
              </div>
            ) : (
              <div
                {...gridProps}
                className={mccbGridStyle}
                style={{ gridTemplateColumns }}
              >
                {/* Header row */}
                {showHeaders && (
                  <div
                    className={headerRowSlot.className}
                    style={headerRowSlot.style}
                    role="row"
                    aria-rowindex={1}
                  >
                    {columns.map((col) => (
                      <div
                        key={`header-${col.key}`}
                        className={headerCellSlot.className}
                        style={headerCellSlot.style}
                        role="columnheader"
                      >
                        {col.header}
                      </div>
                    ))}
                  </div>
                )}

                {/* Data rows */}
                {filteredItems.map((item, index) => {
                  const rowProps = getRowProps(index);
                  return (
                    <div
                      key={`row-${String(item.value)}`}
                      id={`mccb-row-${index}`}
                      className={rowSlot.className}
                      style={rowSlot.style}
                      {...rowProps}
                    >
                      {columns.map((col) => (
                        <div
                          key={`cell-${String(item.value)}-${col.key}`}
                          className={cellSlot.className}
                          style={cellSlot.style}
                          role="gridcell"
                        >
                          {item.data[col.key] !== undefined ? String(item.data[col.key]) : ''}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
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

// ── Blur engelleme ──────────────────────────────────────────────────

function preventBlur(event: React.MouseEvent) {
  event.preventDefault();
}

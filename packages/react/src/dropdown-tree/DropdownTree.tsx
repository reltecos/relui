/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * DropdownTree — styled dropdown tree bileşeni.
 * DropdownTree — styled dropdown tree component.
 *
 * Dropdown içinde tree view — hiyerarşik expand/collapse + tek/çok seçim.
 * Core state machine üzerinde React hook + Vanilla Extract stiller.
 *
 * @packageDocumentation
 */

import { forwardRef, type CSSProperties } from 'react';
import type {
  DropdownTreeVariant,
  DropdownTreeSize,
} from '@relteco/relui-core';
import { ChevronRightIcon, CheckIcon, CloseIcon } from '@relteco/relui-icons';
import { useDropdownTree, type UseDropdownTreeProps } from './useDropdownTree';
import {
  selectRootStyle,
  selectTriggerRecipe,
  selectPlaceholderStyle,
  selectValueStyle,
  selectIndicatorStyle,
  selectListboxStyle,
} from '../select/select.css';
import {
  dropdownTreeNodeStyle,
  dropdownTreeExpandIconStyle,
  dropdownTreeExpandSpacerStyle,
  dropdownTreeCheckboxStyle,
  dropdownTreeNodeLabelStyle,
  dropdownTreeTagsStyle,
  dropdownTreeTagStyle,
  dropdownTreeTagRemoveStyle,
} from './dropdown-tree.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

/** DropdownTree slot isimleri. */
export type DropdownTreeSlot =
  | 'root'
  | 'trigger'
  | 'placeholder'
  | 'value'
  | 'indicator'
  | 'panel'
  | 'node'
  | 'tagsContainer'
  | 'tag'
  | 'tagRemoveButton';

// ── Component Props ─────────────────────────────────────────────────

export interface DropdownTreeComponentProps extends UseDropdownTreeProps, SlotStyleProps<DropdownTreeSlot> {
  /** Görsel varyant / Visual variant */
  variant?: DropdownTreeVariant;

  /** Boyut / Size */
  size?: DropdownTreeSize;

  /** Ek className / Additional className */
  className?: string;

  /** Inline style / Inline style */
  style?: CSSProperties;

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
 * DropdownTree bileşeni — dropdown içinde tree view.
 * DropdownTree component — tree view inside a dropdown.
 *
 * @example
 * ```tsx
 * <DropdownTree
 *   nodes={[
 *     {
 *       value: 'fruits', label: 'Meyveler',
 *       children: [
 *         { value: 'apple', label: 'Elma' },
 *         { value: 'banana', label: 'Muz' },
 *       ],
 *     },
 *   ]}
 *   placeholder="Kategori seçin"
 *   onValueChange={(value) => console.log(value)}
 * />
 * ```
 */
export const DropdownTree = forwardRef<HTMLDivElement, DropdownTreeComponentProps>(
  function DropdownTree(props, ref) {
    const {
      variant = 'outline',
      size = 'md',
      className,
      style: styleProp,
      classNames,
      styles,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      name,
      id,
      ...dropdownTreeProps
    } = props;

    const {
      triggerProps,
      panelProps,
      getNodeProps,
      visibleNodes,
      isOpen,
      selectedLabels,
      selectedValue,
      selectedValues,
      selectionMode,
    } = useDropdownTree(dropdownTreeProps);

    // ── Slot props ──
    const rootSlot = getSlotProps('root', selectRootStyle, classNames, styles, styleProp);
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
    const panelSlot = getSlotProps('panel', selectListboxStyle, classNames, styles);
    const nodeSlot = getSlotProps('node', dropdownTreeNodeStyle, classNames, styles);
    const tagsContainerSlot = getSlotProps('tagsContainer', dropdownTreeTagsStyle, classNames, styles);
    const tagSlot = getSlotProps('tag', dropdownTreeTagStyle, classNames, styles);
    const tagRemoveSlot = getSlotProps('tagRemoveButton', dropdownTreeTagRemoveStyle, classNames, styles);

    // ── Display value ──
    const isMultiple = selectionMode === 'multiple';
    const hasSelection = isMultiple
      ? selectedValues.size > 0
      : selectedValue !== undefined;

    // ── Hidden input value ──
    const hiddenInputValue = isMultiple
      ? [...selectedValues].map(String).join(',')
      : selectedValue !== undefined
        ? String(selectedValue)
        : '';

    // ── Trigger height override for multiple mode (auto-height) ──
    const triggerStyle = isMultiple && hasSelection
      ? { ...triggerSlot.style, height: 'auto', minHeight: triggerSlot.style?.minHeight }
      : triggerSlot.style;

    return (
      <div ref={ref} className={rootClassName} style={rootSlot.style} id={id}>
        {/* Trigger */}
        <div
          className={triggerSlot.className}
          style={triggerStyle}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          {...triggerProps}
        >
          {hasSelection ? (
            isMultiple ? (
              <div className={tagsContainerSlot.className} style={tagsContainerSlot.style}>
                {selectedLabels.map((label, idx) => {
                  const vals = [...selectedValues];
                  const val = vals[idx];
                  return (
                    <span key={String(val)} className={tagSlot.className} style={tagSlot.style}>
                      {label}
                      <button
                        type="button"
                        className={tagRemoveSlot.className}
                        style={tagRemoveSlot.style}
                        aria-label={`${label} kaldır`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (val !== undefined) {
                            dropdownTreeProps.onValuesChange?.(
                              vals.filter((v) => v !== val),
                            );
                          }
                        }}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        <CloseIcon size={10} aria-hidden="true" />
                      </button>
                    </span>
                  );
                })}
              </div>
            ) : (
              <span className={valueSlot.className} style={valueSlot.style}>
                {selectedLabels[0]}
              </span>
            )
          ) : (
            <span className={placeholderSlot.className} style={placeholderSlot.style}>
              {dropdownTreeProps.placeholder || '\u00A0'}
            </span>
          )}
          <ChevronIndicator className={indicatorSlot.className} style={indicatorSlot.style} />
        </div>

        {/* Tree Panel */}
        {isOpen && (
          <ul
            className={panelSlot.className}
            style={panelSlot.style}
            onMouseDown={preventBlur}
            {...panelProps}
          >
            {visibleNodes.map((flatNode) => {
              const nodeProps = getNodeProps(flatNode);
              const indentPx = flatNode.depth * 20 + 8;

              return (
                <li
                  key={String(flatNode.value)}
                  className={nodeSlot.className}
                  style={{ ...nodeSlot.style, paddingLeft: `${indentPx}px` }}
                  {...nodeProps}
                >
                  {/* Expand/collapse ikonu veya spacer */}
                  {flatNode.hasChildren ? (
                    <ExpandIcon
                      isExpanded={flatNode.isExpanded}
                      className={dropdownTreeExpandIconStyle}
                    />
                  ) : (
                    <span className={dropdownTreeExpandSpacerStyle} />
                  )}

                  {/* Multiple modda checkbox göstergesi */}
                  {isMultiple && (
                    <CheckboxIndicator
                      checked={selectedValues.has(flatNode.value)}
                      className={dropdownTreeCheckboxStyle}
                    />
                  )}

                  {/* Label */}
                  <span className={dropdownTreeNodeLabelStyle}>
                    {flatNode.label}
                  </span>
                </li>
              );
            })}
          </ul>
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

function ChevronIndicator(props: { className: string; style?: CSSProperties }) {
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

// ── Expand Icon (chevron right → rotate 90 when expanded) ───────────

function ExpandIcon(props: { isExpanded: boolean; className: string }) {
  return (
    <span
      className={props.className}
      data-expanded={props.isExpanded ? '' : undefined}
      aria-hidden="true"
    >
      <ChevronRightIcon size={12} />
    </span>
  );
}

// ── Checkbox Indicator (multiple mode) ──────────────────────────────

function CheckboxIndicator(props: { checked: boolean; className: string }) {
  return (
    <span
      className={props.className}
      data-checked={props.checked ? '' : undefined}
      aria-hidden="true"
    >
      {props.checked && <CheckIcon size={10} />}
    </span>
  );
}

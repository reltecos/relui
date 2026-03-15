/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * DropdownTree — styled dropdown tree bileseni (Dual API).
 * DropdownTree — styled dropdown tree component (Dual API).
 *
 * Dropdown icinde tree view — hiyerarsik expand/collapse + tek/cok secim.
 * Props-based: `<DropdownTree nodes={[...]} placeholder="Secin" />`
 * Compound:    `<DropdownTree nodes={[...]}><DropdownTree.Trigger>...</DropdownTree.Trigger>...</DropdownTree>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type CSSProperties, type ReactNode } from 'react';
import type {
  DropdownTreeVariant,
  DropdownTreeSize,
  FlatTreeNode,
  SelectValue,
} from '@relteco/relui-core';
import { ChevronRightIcon, CheckIcon, CloseIcon } from '@relteco/relui-icons';
import { useDropdownTree, type UseDropdownTreeProps, type UseDropdownTreeReturn } from './useDropdownTree';
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
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

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

// ── Context (Compound API) ──────────────────────────────────────────

interface DropdownTreeContextValue {
  variant: DropdownTreeVariant;
  size: DropdownTreeSize;
  isOpen: boolean;
  selectedLabels: string[];
  selectedValue: SelectValue | undefined;
  selectedValues: Set<SelectValue>;
  selectionMode: 'single' | 'multiple';
  triggerProps: UseDropdownTreeReturn['triggerProps'];
  panelProps: UseDropdownTreeReturn['panelProps'];
  getNodeProps: UseDropdownTreeReturn['getNodeProps'];
  visibleNodes: FlatTreeNode[];
  placeholder: string | undefined;
  classNames: ClassNames<DropdownTreeSlot> | undefined;
  styles: Styles<DropdownTreeSlot> | undefined;
  name: string | undefined;
  ariaLabel: string | undefined;
  ariaDescribedBy: string | undefined;
  onValuesChange: ((values: SelectValue[]) => void) | undefined;
}

const DropdownTreeContext = createContext<DropdownTreeContextValue | null>(null);

function useDropdownTreeContext(): DropdownTreeContextValue {
  const ctx = useContext(DropdownTreeContext);
  if (!ctx) throw new Error('DropdownTree compound sub-components must be used within <DropdownTree>.');
  return ctx;
}

// ── Compound: DropdownTree.Trigger ──────────────────────────────────

/** DropdownTree.Trigger props */
export interface DropdownTreeTriggerProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const DropdownTreeTrigger = forwardRef<HTMLDivElement, DropdownTreeTriggerProps>(
  function DropdownTreeTrigger(props, ref) {
    const { children, className } = props;
    const ctx = useDropdownTreeContext();
    const slot = getSlotProps(
      'trigger',
      selectTriggerRecipe({ variant: ctx.variant, size: ctx.size }),
      ctx.classNames,
      ctx.styles,
    );
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const isMultiple = ctx.selectionMode === 'multiple';
    const hasSelection = isMultiple
      ? ctx.selectedValues.size > 0
      : ctx.selectedValue !== undefined;

    const triggerStyle = isMultiple && hasSelection
      ? { ...slot.style, height: 'auto', minHeight: slot.style?.minHeight }
      : slot.style;

    return (
      <div
        ref={ref}
        className={cls}
        style={triggerStyle}
        aria-label={ctx.ariaLabel}
        aria-describedby={ctx.ariaDescribedBy}
        data-testid="dropdowntree-trigger"
        {...ctx.triggerProps}
      >
        {children}
      </div>
    );
  },
);

// ── Compound: DropdownTree.Content ──────────────────────────────────

/** DropdownTree.Content props */
export interface DropdownTreeContentProps {
  /** Icerik / Content */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const DropdownTreeContent = forwardRef<HTMLUListElement, DropdownTreeContentProps>(
  function DropdownTreeContent(props, ref) {
    const { children, className } = props;
    const ctx = useDropdownTreeContext();

    if (!ctx.isOpen) return null;

    const slot = getSlotProps('panel', selectListboxStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const nodeSlot = getSlotProps('node', dropdownTreeNodeStyle, ctx.classNames, ctx.styles);
    const isMultiple = ctx.selectionMode === 'multiple';

    return (
      <ul
        ref={ref}
        className={cls}
        style={slot.style}
        onMouseDown={preventBlur}
        data-testid="dropdowntree-content"
        {...ctx.panelProps}
      >
        {children ?? (
          ctx.visibleNodes.map((flatNode) => {
            const nodeProps = ctx.getNodeProps(flatNode);
            const indentPx = flatNode.depth * 20 + 8;

            return (
              <li
                key={String(flatNode.value)}
                className={nodeSlot.className}
                style={{ ...nodeSlot.style, paddingLeft: `${indentPx}px` }}
                {...nodeProps}
              >
                {flatNode.hasChildren ? (
                  <ExpandIcon
                    isExpanded={flatNode.isExpanded}
                    className={dropdownTreeExpandIconStyle}
                  />
                ) : (
                  <span className={dropdownTreeExpandSpacerStyle} />
                )}

                {isMultiple && (
                  <CheckboxIndicator
                    checked={ctx.selectedValues.has(flatNode.value)}
                    className={dropdownTreeCheckboxStyle}
                  />
                )}

                <span className={dropdownTreeNodeLabelStyle}>
                  {flatNode.label}
                </span>
              </li>
            );
          })
        )}
      </ul>
    );
  },
);

// ── Compound: DropdownTree.Node ─────────────────────────────────────

/** DropdownTree.Node props */
export interface DropdownTreeNodeProps {
  /** Flat node verisi / Flat node data */
  node: FlatTreeNode;
  /** Icerik / Content */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const DropdownTreeNode = forwardRef<HTMLLIElement, DropdownTreeNodeProps>(
  function DropdownTreeNode(props, ref) {
    const { node, children, className } = props;
    const ctx = useDropdownTreeContext();
    const slot = getSlotProps('node', dropdownTreeNodeStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const nodeProps = ctx.getNodeProps(node);
    const indentPx = node.depth * 20 + 8;

    return (
      <li
        ref={ref}
        className={cls}
        style={{ ...slot.style, paddingLeft: `${indentPx}px` }}
        data-testid="dropdowntree-node"
        {...nodeProps}
      >
        {children ?? (
          <>
            {node.hasChildren ? (
              <ExpandIcon isExpanded={node.isExpanded} className={dropdownTreeExpandIconStyle} />
            ) : (
              <span className={dropdownTreeExpandSpacerStyle} />
            )}
            {ctx.selectionMode === 'multiple' && (
              <CheckboxIndicator
                checked={ctx.selectedValues.has(node.value)}
                className={dropdownTreeCheckboxStyle}
              />
            )}
            <span className={dropdownTreeNodeLabelStyle}>{node.label}</span>
          </>
        )}
      </li>
    );
  },
);

// ── Component Props ─────────────────────────────────────────────────

export interface DropdownTreeComponentProps extends UseDropdownTreeProps, SlotStyleProps<DropdownTreeSlot> {
  /** Gorsel varyant / Visual variant */
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

  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
}

// ── Component ───────────────────────────────────────────────────────

const DropdownTreeBase = forwardRef<HTMLDivElement, DropdownTreeComponentProps>(
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
      children,
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

    // ── Compound API ──
    if (children) {
      const ctxValue: DropdownTreeContextValue = {
        variant,
        size,
        isOpen,
        selectedLabels,
        selectedValue,
        selectedValues,
        selectionMode,
        triggerProps,
        panelProps,
        getNodeProps,
        visibleNodes,
        placeholder: dropdownTreeProps.placeholder,
        classNames,
        styles,
        name,
        ariaLabel,
        ariaDescribedBy,
        onValuesChange: dropdownTreeProps.onValuesChange,
      };

      return (
        <DropdownTreeContext.Provider value={ctxValue}>
          <div ref={ref} className={rootClassName} style={rootSlot.style} id={id} data-testid="dropdowntree-root">
            {children}
            {name && (
              <input type="hidden" name={name} value={hiddenInputValue} />
            )}
          </div>
        </DropdownTreeContext.Provider>
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
    const panelSlot = getSlotProps('panel', selectListboxStyle, classNames, styles);
    const nodeSlot = getSlotProps('node', dropdownTreeNodeStyle, classNames, styles);
    const tagsContainerSlot = getSlotProps('tagsContainer', dropdownTreeTagsStyle, classNames, styles);
    const tagSlot = getSlotProps('tag', dropdownTreeTagStyle, classNames, styles);
    const tagRemoveSlot = getSlotProps('tagRemoveButton', dropdownTreeTagRemoveStyle, classNames, styles);

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
                        aria-label={`${label} kaldir`}
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

                  {/* Multiple modda checkbox gostergesi */}
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

/**
 * DropdownTree bileseni — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <DropdownTree
 *   nodes={[{ value: 'fruits', label: 'Meyveler', children: [...] }]}
 *   placeholder="Kategori secin"
 *   onValueChange={(value) => console.log(value)}
 * />
 * ```
 *
 * @example Compound
 * ```tsx
 * <DropdownTree nodes={[{ value: 'fruits', label: 'Meyveler', children: [...] }]}>
 *   <DropdownTree.Trigger>
 *     <span>Kategori secin</span>
 *   </DropdownTree.Trigger>
 *   <DropdownTree.Content />
 * </DropdownTree>
 * ```
 */
export const DropdownTree = Object.assign(DropdownTreeBase, {
  Trigger: DropdownTreeTrigger,
  Content: DropdownTreeContent,
  Node: DropdownTreeNode,
});

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

// ── Expand Icon (chevron right -> rotate 90 when expanded) ──────────

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

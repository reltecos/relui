/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Tree — hiyerarsik agac yapisi bilesen (Dual API).
 * Tree — hierarchical tree structure component (Dual API).
 *
 * Tristate checkbox: parent checked = tum children checked,
 * bazi children checked = parent indeterminate.
 *
 * Keyboard: ArrowUp/Down (navigate), ArrowRight (expand/first child),
 * ArrowLeft (collapse/parent), Enter/Space (select/toggle check), Home/End.
 *
 * Props-based: `<Tree nodes={[{ id: '1', label: 'Root', children: [...] }]} />`
 * Compound:    `<Tree><Tree.Node id="1" label="Root"><Tree.Node id="1.1" label="Child" /></Tree.Node></Tree>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, useCallback, useRef, useEffect, type ReactNode } from 'react';
import { ChevronRightIcon } from '@relteco/relui-icons';
import type { TreeNodeDef, TreeSelectionMode, TreeContext as CoreTreeContext } from '@relteco/relui-core';
import {
  rootStyle,
  sizeStyles,
  nodeStyle,
  nodeContentStyle,
  iconStyle,
  iconPlaceholderStyle,
  labelStyle,
  childrenStyle,
} from './tree.css';
import { useTree, getAllDescendantIds, getVisibleNodeIds, type UseTreeProps } from './useTree';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** Tree slot isimleri / Tree slot names. */
export type TreeSlot = 'root' | 'node' | 'icon' | 'label' | 'children';

// ── Types ─────────────────────────────────────────────

/** Tree boyutu / Tree size */
export type TreeSize = 'sm' | 'md' | 'lg';

// ── Context ───────────────────────────────────────────

interface TreeContextValue {
  size: TreeSize;
  treeCtx: CoreTreeContext;
  checkable: boolean;
  selectionMode: TreeSelectionMode;
  onToggleExpand: (nodeId: string) => void;
  onExpand: (nodeId: string) => void;
  onCollapse: (nodeId: string) => void;
  onSelect: (nodeId: string) => void;
  onCheck: (nodeId: string, descendants: string[]) => void;
  classNames: ClassNames<TreeSlot> | undefined;
  styles: Styles<TreeSlot> | undefined;
}

const TreeContext = createContext<TreeContextValue | null>(null);

function useTreeContext(): TreeContextValue {
  const ctx = useContext(TreeContext);
  if (!ctx) throw new Error('Tree compound sub-components must be used within <Tree>.');
  return ctx;
}

// ── Indeterminate checkbox ref helper ─────────────────

function IndeterminateCheckbox(props: {
  checked: boolean;
  indeterminate: boolean;
  disabled: boolean;
  ariaLabel: string;
  onClick: (e: React.MouseEvent) => void;
}): React.JSX.Element {
  const cbRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cbRef.current) {
      cbRef.current.indeterminate = props.indeterminate;
    }
  }, [props.indeterminate]);

  return (
    <input
      ref={cbRef}
      type="checkbox"
      checked={props.checked}
      onChange={() => { /* handled by onClick */ }}
      onClick={props.onClick}
      disabled={props.disabled}
      aria-label={props.ariaLabel}
      data-testid="tree-checkbox"
      data-indeterminate={props.indeterminate || undefined}
    />
  );
}

// ── Compound: Tree.Node ───────────────────────────────

/** Tree.Node props */
export interface TreeNodeProps {
  /** Dugum id / Node id */
  id: string;
  /** Etiket / Label */
  label: ReactNode;
  /** Devre disi / Disabled */
  disabled?: boolean;
  /** Alt dugumler (compound children) / Child nodes */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const TreeNode = forwardRef<HTMLLIElement, TreeNodeProps>(
  function TreeNode(props, ref) {
    const { id, label, disabled = false, children, className } = props;
    const ctx = useTreeContext();
    const { treeCtx, checkable, onToggleExpand, onSelect, onCheck } = ctx;

    const isExpanded = treeCtx.expandedIds.has(id);
    const isSelected = treeCtx.selectedIds.has(id);
    const isChecked = treeCtx.checkedIds.has(id);
    const isIndeterminate = treeCtx.indeterminateIds.has(id);
    const hasChildren = children !== undefined && children !== null;

    const nodeSlot = getSlotProps('node', nodeStyle, ctx.classNames, ctx.styles);
    const iconSlot = getSlotProps('icon', hasChildren ? iconStyle : iconPlaceholderStyle, ctx.classNames, ctx.styles);
    const labelSlot = getSlotProps('label', labelStyle, ctx.classNames, ctx.styles);
    const childrenSlot = getSlotProps('children', childrenStyle, ctx.classNames, ctx.styles);

    const nodeCls = className ? `${nodeSlot.className} ${className}` : nodeSlot.className;

    const handleClick = useCallback(() => {
      if (disabled) return;
      if (hasChildren) onToggleExpand(id);
      onSelect(id);
    }, [disabled, hasChildren, id, onToggleExpand, onSelect]);

    const handleCheckClick = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      if (disabled) return;
      onCheck(id, []);
    }, [disabled, id, onCheck]);

    return (
      <li
        ref={ref}
        className={nodeCls}
        style={nodeSlot.style}
        role="treeitem"
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-selected={isSelected}
        data-testid="tree-node"
        data-node-id={id}
      >
        <div
          className={nodeContentStyle}
          data-selected={isSelected}
          data-disabled={disabled}
          onClick={handleClick}
          tabIndex={0}
          data-testid="tree-node-content"
          data-focusable-node={id}
        >
          <span
            className={iconSlot.className}
            style={iconSlot.style}
            data-expanded={isExpanded}
            data-testid="tree-icon"
          >
            {hasChildren && <ChevronRightIcon size={14} />}
          </span>

          {checkable && (
            <IndeterminateCheckbox
              checked={isChecked}
              indeterminate={isIndeterminate}
              disabled={disabled}
              ariaLabel={`Check ${typeof label === 'string' ? label : id}`}
              onClick={handleCheckClick}
            />
          )}

          <span
            className={labelSlot.className}
            style={labelSlot.style}
            data-testid="tree-label"
          >
            {label}
          </span>
        </div>

        {hasChildren && isExpanded && (
          <ul
            className={childrenSlot.className}
            style={childrenSlot.style}
            role="group"
            data-testid="tree-children"
          >
            {children}
          </ul>
        )}
      </li>
    );
  },
);

// ── Internal: Recursive renderer (props-based) ───────

function RenderNode(props: {
  node: TreeNodeDef;
  ctx: TreeContextValue;
}): React.JSX.Element {
  const { node, ctx } = props;
  const { treeCtx, checkable, onToggleExpand, onSelect } = ctx;
  const hasChildren = node.children !== undefined && node.children.length > 0;
  const isExpanded = treeCtx.expandedIds.has(node.id);
  const isSelected = treeCtx.selectedIds.has(node.id);
  const isChecked = treeCtx.checkedIds.has(node.id);
  const isIndeterminate = treeCtx.indeterminateIds.has(node.id);
  const disabled = node.disabled ?? false;

  const nodeSlot = getSlotProps('node', nodeStyle, ctx.classNames, ctx.styles);
  const iconSlot = getSlotProps('icon', hasChildren ? iconStyle : iconPlaceholderStyle, ctx.classNames, ctx.styles);
  const labelSlot = getSlotProps('label', labelStyle, ctx.classNames, ctx.styles);
  const childrenSlot = getSlotProps('children', childrenStyle, ctx.classNames, ctx.styles);

  const allDescendants = hasChildren ? getAllDescendantIds(node) : [];

  return (
    <li
      className={nodeSlot.className}
      style={nodeSlot.style}
      role="treeitem"
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-selected={isSelected}
      data-testid="tree-node"
      data-node-id={node.id}
    >
      <div
        className={nodeContentStyle}
        data-selected={isSelected}
        data-disabled={disabled}
        onClick={() => {
          if (disabled) return;
          if (hasChildren) onToggleExpand(node.id);
          onSelect(node.id);
        }}
        tabIndex={0}
        data-testid="tree-node-content"
        data-focusable-node={node.id}
      >
        <span
          className={iconSlot.className}
          style={iconSlot.style}
          data-expanded={isExpanded}
          data-testid="tree-icon"
        >
          {hasChildren && <ChevronRightIcon size={14} />}
        </span>

        {checkable && (
          <IndeterminateCheckbox
            checked={isChecked}
            indeterminate={isIndeterminate}
            disabled={disabled}
            ariaLabel={`Check ${node.label}`}
            onClick={(e) => {
              e.stopPropagation();
              if (disabled) return;
              ctx.onCheck(node.id, allDescendants);
            }}
          />
        )}

        <span
          className={labelSlot.className}
          style={labelSlot.style}
          data-testid="tree-label"
        >
          {node.label}
        </span>
      </div>

      {hasChildren && isExpanded && node.children && (
        <ul
          className={childrenSlot.className}
          style={childrenSlot.style}
          role="group"
          data-testid="tree-children"
        >
          {node.children.map((child) => (
            <RenderNode key={child.id} node={child} ctx={ctx} />
          ))}
        </ul>
      )}
    </li>
  );
}

// ── Component Props ───────────────────────────────────

export interface TreeComponentProps extends SlotStyleProps<TreeSlot> {
  /** Props-based: dugum listesi / Node list */
  nodes?: TreeNodeDef[];
  /** Secim modu / Selection mode */
  selectionMode?: TreeSelectionMode;
  /** Checkbox aktif / Checkable */
  checkable?: boolean;
  /** Boyut / Size */
  size?: TreeSize;
  /** Varsayilan acik dugumler / Default expanded ids */
  defaultExpanded?: string[];
  /** Varsayilan secili dugumler / Default selected ids */
  defaultSelected?: string[];
  /** Expand degisim / Expand change */
  onExpandChange?: (ids: string[]) => void;
  /** Secim degisim / Selection change */
  onSelectChange?: (ids: string[]) => void;
  /** Check degisim / Check change */
  onCheckChange?: (ids: string[]) => void;
  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────

const TreeBase = forwardRef<HTMLUListElement, TreeComponentProps>(
  function Tree(props, ref) {
    const {
      nodes,
      selectionMode = 'single',
      checkable = false,
      size = 'md',
      defaultExpanded,
      defaultSelected,
      onExpandChange,
      onSelectChange,
      onCheckChange,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const hookProps: UseTreeProps = {
      nodes,
      defaultExpanded,
      defaultSelected,
      selectionMode,
      checkable,
      onExpandChange,
      onSelectChange,
      onCheckChange,
    };

    const { context: treeCtx, send } = useTree(hookProps);
    const rootRef = useRef<HTMLUListElement>(null);

    const onToggleExpand = useCallback(
      (nodeId: string) => { send({ type: 'TOGGLE_EXPAND', nodeId }); },
      [send],
    );

    const onExpand = useCallback(
      (nodeId: string) => { send({ type: 'EXPAND', nodeId }); },
      [send],
    );

    const onCollapse = useCallback(
      (nodeId: string) => { send({ type: 'COLLAPSE', nodeId }); },
      [send],
    );

    const onSelect = useCallback(
      (nodeId: string) => { send({ type: 'SELECT', nodeId }); },
      [send],
    );

    const onCheck = useCallback(
      (nodeId: string, descendants: string[]) => {
        if (treeCtx.checkedIds.has(nodeId)) {
          send({ type: 'UNCHECK', nodeId, allDescendants: descendants });
        } else {
          send({ type: 'CHECK', nodeId, allDescendants: descendants });
        }
      },
      [send, treeCtx.checkedIds],
    );

    // ── Keyboard Navigation ──

    const focusNode = useCallback((nodeId: string) => {
      const container = rootRef.current;
      if (!container) return;
      const el = container.querySelector<HTMLElement>(`[data-focusable-node="${nodeId}"]`);
      if (el) el.focus();
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const nodeId = target.getAttribute('data-focusable-node');
      if (!nodeId) return;

      // Build visible node order for keyboard nav
      const visibleIds = nodes
        ? getVisibleNodeIds(nodes, treeCtx.expandedIds)
        : [];

      const currentIdx = visibleIds.indexOf(nodeId);

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          const nextId = visibleIds[currentIdx + 1];
          if (nextId) focusNode(nextId);
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          const prevId = visibleIds[currentIdx - 1];
          if (prevId) focusNode(prevId);
          break;
        }
        case 'ArrowRight': {
          e.preventDefault();
          const isExpanded = treeCtx.expandedIds.has(nodeId);
          if (!isExpanded) {
            // Expand if has children
            onExpand(nodeId);
          } else {
            // Move to first child
            const nextId = visibleIds[currentIdx + 1];
            if (nextId) focusNode(nextId);
          }
          break;
        }
        case 'ArrowLeft': {
          e.preventDefault();
          const isExpanded = treeCtx.expandedIds.has(nodeId);
          if (isExpanded) {
            onCollapse(nodeId);
          } else {
            // Move to parent — find the nearest visible ancestor
            // Walk backward to find parent (the node whose children contain this node)
            for (let i = currentIdx - 1; i >= 0; i--) {
              const candidateId = visibleIds[i];
              if (candidateId) {
                focusNode(candidateId);
                break;
              }
            }
          }
          break;
        }
        case 'Enter':
        case ' ': {
          e.preventDefault();
          onSelect(nodeId);
          if (checkable) {
            // Find descendants if we have nodes data
            let descendants: string[] = [];
            if (nodes) {
              const findNode = (list: TreeNodeDef[]): TreeNodeDef | undefined => {
                for (const n of list) {
                  if (n.id === nodeId) return n;
                  if (n.children) {
                    const found = findNode(n.children);
                    if (found) return found;
                  }
                }
                return undefined;
              };
              const found = findNode(nodes);
              if (found) descendants = getAllDescendantIds(found);
            }
            onCheck(nodeId, descendants);
          }
          break;
        }
        case 'Home': {
          e.preventDefault();
          const firstId = visibleIds[0];
          if (firstId) focusNode(firstId);
          break;
        }
        case 'End': {
          e.preventDefault();
          const lastId = visibleIds[visibleIds.length - 1];
          if (lastId) focusNode(lastId);
          break;
        }
      }
    }, [nodes, treeCtx.expandedIds, checkable, onExpand, onCollapse, onSelect, onCheck, focusNode]);

    const rootVeClass = `${rootStyle} ${sizeStyles[size]}`;
    const rootSlot = getSlotProps('root', rootVeClass, classNames, styles);
    const rootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    const ctxValue: TreeContextValue = {
      size,
      treeCtx,
      checkable,
      selectionMode,
      onToggleExpand,
      onExpand,
      onCollapse,
      onSelect,
      onCheck,
      classNames,
      styles,
    };

    // Merge refs
    const mergedRef = useCallback((el: HTMLUListElement | null) => {
      (rootRef as React.MutableRefObject<HTMLUListElement | null>).current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref) (ref as React.MutableRefObject<HTMLUListElement | null>).current = el;
    }, [ref]);

    const rootProps = {
      ref: mergedRef,
      className: rootClassName,
      style: { ...rootSlot.style, ...styleProp },
      role: 'tree' as const,
      'data-testid': 'tree-root',
      'data-size': size,
      onKeyDown: handleKeyDown,
    };

    // ── Compound API ──
    if (children) {
      return (
        <TreeContext.Provider value={ctxValue}>
          <ul {...rootProps}>
            {children}
          </ul>
        </TreeContext.Provider>
      );
    }

    // ── Props-based API ──
    return (
      <TreeContext.Provider value={ctxValue}>
        <ul {...rootProps}>
          {nodes && nodes.map((node) => (
            <RenderNode key={node.id} node={node} ctx={ctxValue} />
          ))}
        </ul>
      </TreeContext.Provider>
    );
  },
);

/**
 * Tree bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Tree nodes={[{ id: '1', label: 'Root', children: [{ id: '1.1', label: 'Child' }] }]} />
 * ```
 *
 * @example Compound
 * ```tsx
 * <Tree>
 *   <Tree.Node id="1" label="Root">
 *     <Tree.Node id="1.1" label="Child" />
 *   </Tree.Node>
 * </Tree>
 * ```
 */
export const Tree = Object.assign(TreeBase, {
  Node: TreeNode,
});

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * DropdownTree state machine — framework-agnostic headless dropdown tree logic.
 * DropdownTree state machine — framework bağımsız headless dropdown tree mantığı.
 *
 * Dropdown içinde tree view — hiyerarşik expand/collapse + tek/çok seçim.
 *
 * @packageDocumentation
 */

import type {
  DropdownTreeProps,
  DropdownTreeMachineContext,
  DropdownTreeEvent,
  DropdownTreeTriggerDOMProps,
  DropdownTreePanelDOMProps,
  DropdownTreeNodeDOMProps,
  DropdownTreeInteractionState,
  DropdownTreeFilterFn,
  TreeNode,
  FlatTreeNode,
  SelectValue,
} from './dropdown-tree.types';

// ── Yardımcı — Tüm düğüm value'larını topla / Collect all node values ──

/**
 * Tree'deki tüm düğüm value'larını döner.
 * Returns all node values in the tree.
 */
export function collectAllValues(nodes: TreeNode[]): SelectValue[] {
  const result: SelectValue[] = [];
  function walk(list: TreeNode[]) {
    for (const node of list) {
      result.push(node.value);
      if (node.children) walk(node.children);
    }
  }
  walk(nodes);
  return result;
}

// ── Yardımcı — Düğüm bul / Find node ───────────────────────────────

/**
 * Value ile düğüm bul.
 * Find node by value.
 */
export function findNodeByValue(nodes: TreeNode[], value: SelectValue): TreeNode | undefined {
  for (const node of nodes) {
    if (node.value === value) return node;
    if (node.children) {
      const found = findNodeByValue(node.children, value);
      if (found) return found;
    }
  }
  return undefined;
}

/**
 * Value ile label bul.
 * Find label by value.
 */
export function findLabelByNodeValue(nodes: TreeNode[], value: SelectValue): string | undefined {
  const node = findNodeByValue(nodes, value);
  return node?.label;
}

// ── Yardımcı — Düzleştirme / Flatten ────────────────────────────────

/**
 * Ağacı görünür düğümlere düzleştir (expanded olanları aç).
 * Flatten tree to visible nodes (expand expanded ones).
 */
export function flattenVisibleNodes(
  nodes: TreeNode[],
  expandedValues: Set<SelectValue>,
  depth: number = 0,
  parentValue: SelectValue | undefined = undefined,
): FlatTreeNode[] {
  const result: FlatTreeNode[] = [];
  for (const node of nodes) {
    const hasChildren = Boolean(node.children && node.children.length > 0);
    const isExpanded = hasChildren && expandedValues.has(node.value);
    result.push({
      value: node.value,
      label: node.label,
      depth,
      hasChildren,
      isExpanded,
      disabled: node.disabled === true,
      parentValue,
    });
    if (isExpanded && node.children) {
      const children = flattenVisibleNodes(node.children, expandedValues, depth + 1, node.value);
      for (const child of children) {
        result.push(child);
      }
    }
  }
  return result;
}

// ── Yardımcı — Filtreleme / Filtering ───────────────────────────────

const defaultFilterFn: DropdownTreeFilterFn = (node, searchValue) => {
  if (!searchValue) return true;
  return node.label.toLowerCase().includes(searchValue.toLowerCase());
};

/**
 * Ağacı filtrele — eşleşen düğümler ve onların atalarını koru.
 * Filter tree — keep matching nodes and their ancestors.
 */
export function filterTree(
  nodes: TreeNode[],
  searchValue: string,
  filterFn: DropdownTreeFilterFn,
): TreeNode[] {
  if (!searchValue) return nodes;

  const result: TreeNode[] = [];
  for (const node of nodes) {
    const directMatch = filterFn(node, searchValue);
    const filteredChildren = node.children
      ? filterTree(node.children, searchValue, filterFn)
      : [];

    if (directMatch || filteredChildren.length > 0) {
      result.push({
        ...node,
        children: filteredChildren.length > 0 ? filteredChildren : node.children,
      });
    }
  }
  return result;
}

// ── Yardımcı — Seçili label'lar / Selected labels ───────────────────

/**
 * Seçili değerlerin label'larını döner.
 * Returns labels of selected values.
 */
export function getSelectedLabels(nodes: TreeNode[], values: Set<SelectValue>): string[] {
  const labels: string[] = [];
  for (const v of values) {
    const label = findLabelByNodeValue(nodes, v);
    if (label) labels.push(label);
  }
  return labels;
}

// ── Context oluşturucu / Context creator ────────────────────────────

function collectExpandAllValues(nodes: TreeNode[]): Set<SelectValue> {
  const result = new Set<SelectValue>();
  function walk(list: TreeNode[]) {
    for (const node of list) {
      if (node.children && node.children.length > 0) {
        result.add(node.value);
        walk(node.children);
      }
    }
  }
  walk(nodes);
  return result;
}

function createInitialContext(props: DropdownTreeProps): DropdownTreeMachineContext {
  const selectionMode = props.selectionMode ?? 'single';
  const expandedValues = props.expandAll
    ? collectExpandAllValues(props.nodes)
    : new Set<SelectValue>();

  let selectedValue: SelectValue | undefined;
  let selectedValues = new Set<SelectValue>();

  if (selectionMode === 'single') {
    selectedValue = props.value ?? props.defaultValue;
  } else {
    const vals = props.values ?? props.defaultValues ?? [];
    selectedValues = new Set(vals);
  }

  return {
    interactionState: 'idle',
    nodes: props.nodes,
    expandedValues,
    selectionMode,
    selectedValue,
    selectedValues,
    searchValue: '',
    highlightedValue: undefined,
    isOpen: false,
    placeholder: props.placeholder ?? '',
    disabled: props.disabled ?? false,
    readOnly: props.readOnly ?? false,
    invalid: props.invalid ?? false,
    required: props.required ?? false,
  };
}

// ── Görünür düğüm listesinden highlight navigasyonu ─────────────────

function getVisibleNodes(ctx: DropdownTreeMachineContext): FlatTreeNode[] {
  return flattenVisibleNodes(ctx.nodes, ctx.expandedValues);
}

function findNextEnabled(
  visibleNodes: FlatTreeNode[],
  currentValue: SelectValue | undefined,
  direction: 'forward' | 'backward',
): SelectValue | undefined {
  if (visibleNodes.length === 0) return undefined;

  let startIdx = -1;
  if (currentValue !== undefined) {
    for (let i = 0; i < visibleNodes.length; i++) {
      const n = visibleNodes[i];
      if (n && n.value === currentValue) {
        startIdx = i;
        break;
      }
    }
  }

  const len = visibleNodes.length;
  const step = direction === 'forward' ? 1 : -1;
  let idx = startIdx;

  for (let i = 0; i < len; i++) {
    idx = idx + step;
    idx = ((idx % len) + len) % len;
    const node = visibleNodes[idx];
    if (node && !node.disabled) return node.value;
  }

  return undefined;
}

function findFirstEnabled(visibleNodes: FlatTreeNode[]): SelectValue | undefined {
  for (const node of visibleNodes) {
    if (!node.disabled) return node.value;
  }
  return undefined;
}

function findLastEnabled(visibleNodes: FlatTreeNode[]): SelectValue | undefined {
  for (let i = visibleNodes.length - 1; i >= 0; i--) {
    const node = visibleNodes[i];
    if (node && !node.disabled) return node.value;
  }
  return undefined;
}

// ── Transition ──────────────────────────────────────────────────────

function transition(
  ctx: DropdownTreeMachineContext,
  event: DropdownTreeEvent,
  _filterFn: DropdownTreeFilterFn,
): DropdownTreeMachineContext {
  // ── Prop güncellemeleri her zaman uygulanır ──
  if (event.type === 'SET_DISABLED') {
    if (event.value === ctx.disabled) return ctx;
    return {
      ...ctx,
      disabled: event.value,
      interactionState: event.value ? 'idle' : ctx.interactionState,
      isOpen: event.value ? false : ctx.isOpen,
    };
  }

  if (event.type === 'SET_READ_ONLY') {
    if (event.value === ctx.readOnly) return ctx;
    return { ...ctx, readOnly: event.value };
  }

  if (event.type === 'SET_INVALID') {
    if (event.value === ctx.invalid) return ctx;
    return { ...ctx, invalid: event.value };
  }

  if (event.type === 'SET_NODES') {
    return { ...ctx, nodes: event.nodes };
  }

  if (event.type === 'SET_VALUE') {
    if (event.value === ctx.selectedValue) return ctx;
    return { ...ctx, selectedValue: event.value };
  }

  if (event.type === 'SET_VALUES') {
    return { ...ctx, selectedValues: new Set(event.values) };
  }

  // ── Disabled durumda etkileşim engellenir ──
  if (ctx.disabled) return ctx;

  // ── Arama ──
  if (event.type === 'SET_SEARCH') {
    return {
      ...ctx,
      searchValue: event.value,
      isOpen: true,
      interactionState: 'open',
    };
  }

  // ── Dropdown açma/kapama ──
  if (event.type === 'OPEN') {
    if (ctx.isOpen || ctx.readOnly) return ctx;
    const visibleNodes = getVisibleNodes(ctx);
    return {
      ...ctx,
      isOpen: true,
      interactionState: 'open',
      highlightedValue: findFirstEnabled(visibleNodes),
    };
  }

  if (event.type === 'CLOSE') {
    if (!ctx.isOpen) return ctx;
    return {
      ...ctx,
      isOpen: false,
      interactionState: 'focused',
      highlightedValue: undefined,
      searchValue: '',
    };
  }

  if (event.type === 'TOGGLE') {
    if (ctx.readOnly) return ctx;
    if (ctx.isOpen) {
      return {
        ...ctx,
        isOpen: false,
        interactionState: 'focused',
        highlightedValue: undefined,
        searchValue: '',
      };
    }
    const visibleNodes = getVisibleNodes(ctx);
    return {
      ...ctx,
      isOpen: true,
      interactionState: 'open',
      highlightedValue: findFirstEnabled(visibleNodes),
    };
  }

  // ── Seçim (single) ──
  if (event.type === 'SELECT') {
    const targetNode = findNodeByValue(ctx.nodes, event.value);
    if (targetNode && targetNode.disabled) return ctx;

    if (ctx.selectionMode === 'single') {
      return {
        ...ctx,
        selectedValue: event.value,
        isOpen: false,
        interactionState: 'focused',
        highlightedValue: undefined,
        searchValue: '',
      };
    }

    // Multiple — toggle
    const newSet = new Set(ctx.selectedValues);
    if (newSet.has(event.value)) {
      newSet.delete(event.value);
    } else {
      newSet.add(event.value);
    }
    return { ...ctx, selectedValues: newSet };
  }

  // ── Deselect (multiple only) ──
  if (event.type === 'DESELECT') {
    if (ctx.selectionMode !== 'multiple') return ctx;
    const newSet = new Set(ctx.selectedValues);
    newSet.delete(event.value);
    return { ...ctx, selectedValues: newSet };
  }

  // ── Temizleme ──
  if (event.type === 'CLEAR') {
    if (ctx.selectionMode === 'single') {
      if (ctx.selectedValue === undefined) return ctx;
      return { ...ctx, selectedValue: undefined, searchValue: '' };
    }
    if (ctx.selectedValues.size === 0) return ctx;
    return { ...ctx, selectedValues: new Set(), searchValue: '' };
  }

  // ── Expand / Collapse ──
  if (event.type === 'EXPAND') {
    if (ctx.expandedValues.has(event.value)) return ctx;
    const newSet = new Set(ctx.expandedValues);
    newSet.add(event.value);
    return { ...ctx, expandedValues: newSet };
  }

  if (event.type === 'COLLAPSE') {
    if (!ctx.expandedValues.has(event.value)) return ctx;
    const newSet = new Set(ctx.expandedValues);
    newSet.delete(event.value);
    return { ...ctx, expandedValues: newSet };
  }

  if (event.type === 'TOGGLE_EXPAND') {
    const newSet = new Set(ctx.expandedValues);
    if (newSet.has(event.value)) {
      newSet.delete(event.value);
    } else {
      newSet.add(event.value);
    }
    return { ...ctx, expandedValues: newSet };
  }

  if (event.type === 'EXPAND_ALL') {
    return { ...ctx, expandedValues: collectExpandAllValues(ctx.nodes) };
  }

  if (event.type === 'COLLAPSE_ALL') {
    if (ctx.expandedValues.size === 0) return ctx;
    return { ...ctx, expandedValues: new Set() };
  }

  // ── Highlight ──
  if (event.type === 'HIGHLIGHT') {
    if (!ctx.isOpen) return ctx;
    if (event.value === ctx.highlightedValue) return ctx;
    if (event.value !== undefined) {
      const targetNode = findNodeByValue(ctx.nodes, event.value);
      if (targetNode && targetNode.disabled) return ctx;
    }
    return { ...ctx, highlightedValue: event.value };
  }

  if (event.type === 'HIGHLIGHT_NEXT') {
    if (!ctx.isOpen) return ctx;
    const visibleNodes = getVisibleNodes(ctx);
    const next = findNextEnabled(visibleNodes, ctx.highlightedValue, 'forward');
    if (next === undefined || next === ctx.highlightedValue) return ctx;
    return { ...ctx, highlightedValue: next };
  }

  if (event.type === 'HIGHLIGHT_PREV') {
    if (!ctx.isOpen) return ctx;
    const visibleNodes = getVisibleNodes(ctx);
    const prev = findNextEnabled(visibleNodes, ctx.highlightedValue, 'backward');
    if (prev === undefined || prev === ctx.highlightedValue) return ctx;
    return { ...ctx, highlightedValue: prev };
  }

  if (event.type === 'HIGHLIGHT_FIRST') {
    if (!ctx.isOpen) return ctx;
    const visibleNodes = getVisibleNodes(ctx);
    const first = findFirstEnabled(visibleNodes);
    if (first === undefined || first === ctx.highlightedValue) return ctx;
    return { ...ctx, highlightedValue: first };
  }

  if (event.type === 'HIGHLIGHT_LAST') {
    if (!ctx.isOpen) return ctx;
    const visibleNodes = getVisibleNodes(ctx);
    const last = findLastEnabled(visibleNodes);
    if (last === undefined || last === ctx.highlightedValue) return ctx;
    return { ...ctx, highlightedValue: last };
  }

  // ── Etkileşim state geçişleri ──
  const { interactionState } = ctx;
  let nextState: DropdownTreeInteractionState = interactionState;

  switch (event.type) {
    case 'POINTER_ENTER':
      if (interactionState === 'idle') nextState = 'hover';
      break;
    case 'POINTER_LEAVE':
      if (interactionState === 'hover') nextState = 'idle';
      break;
    case 'FOCUS':
      if (!ctx.isOpen) nextState = 'focused';
      break;
    case 'BLUR':
      if (ctx.isOpen) {
        return {
          ...ctx,
          isOpen: false,
          interactionState: 'idle',
          highlightedValue: undefined,
          searchValue: '',
        };
      }
      nextState = 'idle';
      break;
  }

  if (nextState === interactionState) return ctx;
  return { ...ctx, interactionState: nextState };
}

// ── DOM Props üreticileri / DOM Props generators ────────────────────

function getTriggerProps(ctx: DropdownTreeMachineContext): DropdownTreeTriggerDOMProps {
  return {
    role: 'combobox',
    'aria-expanded': ctx.isOpen,
    'aria-haspopup': 'tree',
    'aria-disabled': ctx.disabled ? true : undefined,
    'aria-readonly': ctx.readOnly ? true : undefined,
    'aria-invalid': ctx.invalid ? true : undefined,
    'aria-required': ctx.required ? true : undefined,
    'data-state': ctx.interactionState,
    'data-disabled': ctx.disabled ? '' : undefined,
    'data-readonly': ctx.readOnly ? '' : undefined,
    'data-invalid': ctx.invalid ? '' : undefined,
    tabIndex: 0,
  };
}

function getPanelProps(ctx: DropdownTreeMachineContext): DropdownTreePanelDOMProps {
  return {
    role: 'tree',
    'aria-multiselectable': ctx.selectionMode === 'multiple' ? true : undefined,
    tabIndex: -1,
  };
}

function getNodeProps(
  ctx: DropdownTreeMachineContext,
  flatNode: FlatTreeNode,
): DropdownTreeNodeDOMProps {
  const isSelected = ctx.selectionMode === 'single'
    ? flatNode.value === ctx.selectedValue
    : ctx.selectedValues.has(flatNode.value);
  const isHighlighted = flatNode.value === ctx.highlightedValue;

  return {
    role: 'treeitem',
    'aria-expanded': flatNode.hasChildren ? flatNode.isExpanded : undefined,
    'aria-selected': isSelected,
    'aria-disabled': flatNode.disabled ? true : undefined,
    'aria-level': flatNode.depth + 1,
    'data-highlighted': isHighlighted ? '' : undefined,
    'data-disabled': flatNode.disabled ? '' : undefined,
  };
}

// ── Public API ──────────────────────────────────────────────────────

/**
 * DropdownTree API — state machine ve DOM props üreticileri.
 * DropdownTree API — state machine and DOM props generators.
 */
export interface DropdownTreeAPI {
  /** Mevcut context / Current context */
  getContext(): DropdownTreeMachineContext;

  /** Event gönder / Send event */
  send(event: DropdownTreeEvent): DropdownTreeMachineContext;

  /** Trigger DOM attribute'ları / Trigger DOM attributes */
  getTriggerProps(): DropdownTreeTriggerDOMProps;

  /** Panel DOM attribute'ları / Panel DOM attributes */
  getPanelProps(): DropdownTreePanelDOMProps;

  /** Node DOM attribute'ları / Node DOM attributes */
  getNodeProps(flatNode: FlatTreeNode): DropdownTreeNodeDOMProps;

  /** Görünür düğümleri döner / Returns visible (flattened) nodes */
  getVisibleNodes(): FlatTreeNode[];

  /** Etkileşim engellenmiş mi / Is interaction blocked */
  isInteractionBlocked(): boolean;

  /** Seçili etiketler (single: tek, multiple: dizi) / Selected labels */
  getSelectedLabels(): string[];

  /** Dropdown açık mı / Is dropdown open */
  isOpen(): boolean;
}

/**
 * DropdownTree state machine oluştur.
 * Create a dropdown tree state machine.
 *
 * @example
 * ```ts
 * const dt = createDropdownTree({
 *   nodes: [
 *     {
 *       value: 'fruits', label: 'Meyveler',
 *       children: [
 *         { value: 'apple', label: 'Elma' },
 *         { value: 'banana', label: 'Muz' },
 *       ],
 *     },
 *     {
 *       value: 'vegetables', label: 'Sebzeler',
 *       children: [
 *         { value: 'carrot', label: 'Havuç' },
 *       ],
 *     },
 *   ],
 *   placeholder: 'Kategori seçin',
 * });
 *
 * dt.send({ type: 'OPEN' });
 * dt.getVisibleNodes(); // [fruits, vegetables] (collapsed)
 * dt.send({ type: 'EXPAND', value: 'fruits' });
 * dt.getVisibleNodes(); // [fruits, apple, banana, vegetables]
 * ```
 */
export function createDropdownTree(props: DropdownTreeProps): DropdownTreeAPI {
  const filterFn = props.filterFn ?? defaultFilterFn;
  let ctx = createInitialContext(props);

  return {
    getContext() {
      return ctx;
    },

    send(event: DropdownTreeEvent) {
      ctx = transition(ctx, event, filterFn);
      return ctx;
    },

    getTriggerProps() {
      return getTriggerProps(ctx);
    },

    getPanelProps() {
      return getPanelProps(ctx);
    },

    getNodeProps(flatNode: FlatTreeNode) {
      return getNodeProps(ctx, flatNode);
    },

    getVisibleNodes() {
      return flattenVisibleNodes(ctx.nodes, ctx.expandedValues);
    },

    isInteractionBlocked() {
      return ctx.disabled;
    },

    getSelectedLabels() {
      if (ctx.selectionMode === 'single') {
        if (ctx.selectedValue === undefined) return [];
        const label = findLabelByNodeValue(ctx.nodes, ctx.selectedValue);
        return label ? [label] : [String(ctx.selectedValue)];
      }
      return getSelectedLabels(ctx.nodes, ctx.selectedValues);
    },

    isOpen() {
      return ctx.isOpen;
    },
  };
}

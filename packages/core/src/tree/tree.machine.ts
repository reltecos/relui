/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Tree state machine — hiyerarsik agac yapisi yonetimi.
 * Tree state machine — hierarchical tree structure management.
 *
 * Tristate checkbox: parent checked = tum children checked,
 * bazi children checked = parent indeterminate.
 *
 * @packageDocumentation
 */

import type {
  TreeConfig,
  TreeContext,
  TreeEvent,
  TreeAPI,
} from './tree.types';

/**
 * Tree state machine olusturur.
 * Creates a Tree state machine.
 */
export function createTree(config: TreeConfig = {}): TreeAPI {
  const {
    defaultExpanded = [],
    defaultSelected = [],
    defaultChecked = [],
    selectionMode = 'single',
    checkable = false,
    onExpandChange,
    onSelectChange,
    onCheckChange,
  } = config;

  // ── State ──
  let expandedIds = new Set<string>(defaultExpanded);
  let selectedIds = new Set<string>(defaultSelected);
  let checkedIds = new Set<string>(defaultChecked);
  let indeterminateIds = new Set<string>();

  // Tree structure (set via SET_TREE_MAP event)
  let parentToChildren: ReadonlyMap<string, readonly string[]> = new Map();
  let childToParent: ReadonlyMap<string, string> = new Map();

  const listeners = new Set<() => void>();

  function notify(): void {
    for (const fn of listeners) fn();
  }

  // ── Tristate: propagate check state upward ──

  function getAllDescendantsOf(nodeId: string): string[] {
    const result: string[] = [];
    const children = parentToChildren.get(nodeId);
    if (!children) return result;
    for (const child of children) {
      result.push(child);
      result.push(...getAllDescendantsOf(child));
    }
    return result;
  }

  function propagateUp(): void {
    const nextIndeterminate = new Set<string>();

    // Walk all parent nodes (keys of parentToChildren)
    for (const [parentId, children] of parentToChildren) {
      if (children.length === 0) continue;

      // Collect ALL descendants (not just direct children) for the check
      const allDesc = getAllDescendantsOf(parentId);
      if (allDesc.length === 0) continue;

      const checkedCount = allDesc.filter((id) => checkedIds.has(id)).length;

      if (checkedCount === allDesc.length) {
        // All descendants checked → parent fully checked
        checkedIds.add(parentId);
      } else if (checkedCount > 0) {
        // Some descendants checked → parent indeterminate
        checkedIds.delete(parentId);
        nextIndeterminate.add(parentId);
      } else {
        // No descendants checked → parent unchecked
        checkedIds.delete(parentId);
      }
    }

    indeterminateIds = nextIndeterminate;
  }

  function getContext(): TreeContext {
    return {
      expandedIds,
      selectedIds,
      checkedIds,
      indeterminateIds,
    };
  }

  function send(event: TreeEvent): void {
    switch (event.type) {
      case 'SET_TREE_MAP': {
        parentToChildren = event.map.parentToChildren;
        childToParent = event.map.childToParent;
        // Re-compute indeterminate if we already have checked items
        if (checkable && checkedIds.size > 0) {
          propagateUp();
          notify();
        }
        break;
      }
      case 'TOGGLE_EXPAND': {
        const next = new Set(expandedIds);
        if (next.has(event.nodeId)) {
          next.delete(event.nodeId);
        } else {
          next.add(event.nodeId);
        }
        expandedIds = next;
        onExpandChange?.(Array.from(expandedIds));
        notify();
        break;
      }
      case 'EXPAND': {
        if (expandedIds.has(event.nodeId)) return;
        const next = new Set(expandedIds);
        next.add(event.nodeId);
        expandedIds = next;
        onExpandChange?.(Array.from(expandedIds));
        notify();
        break;
      }
      case 'COLLAPSE': {
        if (!expandedIds.has(event.nodeId)) return;
        const next = new Set(expandedIds);
        next.delete(event.nodeId);
        expandedIds = next;
        onExpandChange?.(Array.from(expandedIds));
        notify();
        break;
      }
      case 'EXPAND_ALL': {
        expandedIds = new Set(event.nodeIds);
        onExpandChange?.(Array.from(expandedIds));
        notify();
        break;
      }
      case 'COLLAPSE_ALL': {
        if (expandedIds.size === 0) return;
        expandedIds = new Set();
        onExpandChange?.([]);
        notify();
        break;
      }
      case 'SELECT': {
        if (selectionMode === 'none') return;
        if (selectionMode === 'single') {
          selectedIds = new Set([event.nodeId]);
        } else {
          const next = new Set(selectedIds);
          next.add(event.nodeId);
          selectedIds = next;
        }
        onSelectChange?.(Array.from(selectedIds));
        notify();
        break;
      }
      case 'DESELECT': {
        if (!selectedIds.has(event.nodeId)) return;
        const next = new Set(selectedIds);
        next.delete(event.nodeId);
        selectedIds = next;
        onSelectChange?.(Array.from(selectedIds));
        notify();
        break;
      }
      case 'CHECK': {
        if (!checkable) return;
        const next = new Set(checkedIds);
        next.add(event.nodeId);
        for (const id of event.allDescendants) next.add(id);
        checkedIds = next;
        // Propagate up for tristate
        propagateUp();
        onCheckChange?.(Array.from(checkedIds));
        notify();
        break;
      }
      case 'UNCHECK': {
        if (!checkable) return;
        const next = new Set(checkedIds);
        next.delete(event.nodeId);
        for (const id of event.allDescendants) next.delete(id);
        // Also uncheck ancestors (they can't be fully checked if a descendant is unchecked)
        let current = childToParent.get(event.nodeId);
        while (current) {
          next.delete(current);
          current = childToParent.get(current);
        }
        checkedIds = next;
        // Propagate up for tristate
        propagateUp();
        onCheckChange?.(Array.from(checkedIds));
        notify();
        break;
      }
    }
  }

  function subscribe(fn: () => void): () => void {
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }

  function destroy(): void {
    listeners.clear();
  }

  return { getContext, send, subscribe, destroy };
}

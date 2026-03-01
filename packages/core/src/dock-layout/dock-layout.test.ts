/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  createDockLayout,
  generateId,
  resetIdCounter,
  findNode,
  findParent,
  findGroupByPanelId,
  collectAllGroups,
  removeNodeFromTree,
  splitGroup,
  normalizeSizes,
  serializeNode,
  deserializeNode,
} from './dock-layout.machine';
import type {
  DockSplitNode,
  DockGroupNode,
} from './dock-layout.types';

beforeEach(() => {
  resetIdCounter();
});

// ── Tree Helpers ────────────────────────────────────

describe('Tree Helpers', () => {
  const groupA: DockGroupNode = { type: 'group', id: 'gA', panelIds: ['p1', 'p2'], activePanelId: 'p1' };
  const groupB: DockGroupNode = { type: 'group', id: 'gB', panelIds: ['p3'], activePanelId: 'p3' };
  const groupC: DockGroupNode = { type: 'group', id: 'gC', panelIds: ['p4'], activePanelId: 'p4' };

  const innerSplit: DockSplitNode = {
    type: 'split',
    id: 'sInner',
    direction: 'vertical',
    children: [groupA, groupB],
    sizes: [0.7, 0.3],
  };

  const tree: DockSplitNode = {
    type: 'split',
    id: 'sRoot',
    direction: 'horizontal',
    children: [innerSplit, groupC],
    sizes: [0.6, 0.4],
  };

  describe('generateId', () => {
    it('generates unique IDs', () => {
      const id1 = generateId('test');
      const id2 = generateId('test');
      expect(id1).not.toBe(id2);
    });

    it('uses prefix', () => {
      const id = generateId('custom');
      expect(id).toMatch(/^custom-/);
    });
  });

  describe('findNode', () => {
    it('finds root node', () => {
      expect(findNode(tree, 'sRoot')).toBe(tree);
    });

    it('finds nested split', () => {
      expect(findNode(tree, 'sInner')).toBe(innerSplit);
    });

    it('finds leaf group', () => {
      expect(findNode(tree, 'gA')).toBe(groupA);
      expect(findNode(tree, 'gC')).toBe(groupC);
    });

    it('returns undefined for non-existent id', () => {
      expect(findNode(tree, 'nonexistent')).toBeUndefined();
    });

    it('finds node in single group root', () => {
      const single: DockGroupNode = { type: 'group', id: 'single', panelIds: [], activePanelId: '' };
      expect(findNode(single, 'single')).toBe(single);
    });
  });

  describe('findParent', () => {
    it('finds parent of direct child', () => {
      expect(findParent(tree, 'sInner')).toBe(tree);
      expect(findParent(tree, 'gC')).toBe(tree);
    });

    it('finds parent of nested child', () => {
      expect(findParent(tree, 'gA')).toBe(innerSplit);
      expect(findParent(tree, 'gB')).toBe(innerSplit);
    });

    it('returns undefined for root node', () => {
      expect(findParent(tree, 'sRoot')).toBeUndefined();
    });

    it('returns undefined for non-existent id', () => {
      expect(findParent(tree, 'nonexistent')).toBeUndefined();
    });

    it('returns undefined for group node', () => {
      const single: DockGroupNode = { type: 'group', id: 'g', panelIds: [], activePanelId: '' };
      expect(findParent(single, 'x')).toBeUndefined();
    });
  });

  describe('findGroupByPanelId', () => {
    it('finds group containing panel', () => {
      expect(findGroupByPanelId(tree, 'p1')).toBe(groupA);
      expect(findGroupByPanelId(tree, 'p3')).toBe(groupB);
      expect(findGroupByPanelId(tree, 'p4')).toBe(groupC);
    });

    it('returns undefined for non-existent panel', () => {
      expect(findGroupByPanelId(tree, 'nonexistent')).toBeUndefined();
    });
  });

  describe('collectAllGroups', () => {
    it('collects all groups from tree', () => {
      const groups = collectAllGroups(tree);
      expect(groups).toHaveLength(3);
      expect(groups).toContain(groupA);
      expect(groups).toContain(groupB);
      expect(groups).toContain(groupC);
    });

    it('returns single group for leaf node', () => {
      const groups = collectAllGroups(groupA);
      expect(groups).toHaveLength(1);
      expect(groups[0]).toBe(groupA);
    });
  });

  describe('removeNodeFromTree', () => {
    it('removes leaf node and collapses parent', () => {
      const gX: DockGroupNode = { type: 'group', id: 'gX', panelIds: ['x'], activePanelId: 'x' };
      const gY: DockGroupNode = { type: 'group', id: 'gY', panelIds: ['y'], activePanelId: 'y' };
      const split: DockSplitNode = { type: 'split', id: 's1', direction: 'horizontal', children: [gX, gY], sizes: [0.5, 0.5] };

      const result = removeNodeFromTree(split, 'gX');
      // Parent'ta tek cocuk kaldi, collapse olur → gY doner
      expect(result).toBe(gY);
    });

    it('removes node and keeps multiple siblings', () => {
      const g1: DockGroupNode = { type: 'group', id: 'g1', panelIds: ['a'], activePanelId: 'a' };
      const g2: DockGroupNode = { type: 'group', id: 'g2', panelIds: ['b'], activePanelId: 'b' };
      const g3: DockGroupNode = { type: 'group', id: 'g3', panelIds: ['c'], activePanelId: 'c' };
      const split: DockSplitNode = { type: 'split', id: 's1', direction: 'horizontal', children: [g1, g2, g3], sizes: [0.33, 0.34, 0.33] };

      const result = removeNodeFromTree(split, 'g2');
      expect(result).toBe(split);
      expect(split.children).toHaveLength(2);
      expect(split.children[0]).toBe(g1);
      expect(split.children[1]).toBe(g3);
    });

    it('returns null when removing root node', () => {
      const g: DockGroupNode = { type: 'group', id: 'g', panelIds: [], activePanelId: '' };
      expect(removeNodeFromTree(g, 'g')).toBeNull();
    });

    it('normalizes sizes after removal', () => {
      const g1: DockGroupNode = { type: 'group', id: 'g1', panelIds: ['a'], activePanelId: 'a' };
      const g2: DockGroupNode = { type: 'group', id: 'g2', panelIds: ['b'], activePanelId: 'b' };
      const g3: DockGroupNode = { type: 'group', id: 'g3', panelIds: ['c'], activePanelId: 'c' };
      const split: DockSplitNode = { type: 'split', id: 's1', direction: 'horizontal', children: [g1, g2, g3], sizes: [0.2, 0.5, 0.3] };

      removeNodeFromTree(split, 'g2');
      const total = split.sizes.reduce((s, v) => s + v, 0);
      expect(total).toBeCloseTo(1.0);
    });
  });

  describe('splitGroup', () => {
    it('splits root group into horizontal split', () => {
      const g: DockGroupNode = { type: 'group', id: 'g1', panelIds: ['p1'], activePanelId: 'p1' };
      const newG: DockGroupNode = { type: 'group', id: 'g2', panelIds: ['p2'], activePanelId: 'p2' };

      const result = splitGroup(g, 'g1', 'horizontal', newG, 'after');
      expect(result.type).toBe('split');
      if (result.type === 'split') {
        expect(result.direction).toBe('horizontal');
        expect(result.children).toHaveLength(2);
        expect(result.children[0]).toBe(g);
        expect(result.children[1]).toBe(newG);
        expect(result.sizes).toEqual([0.5, 0.5]);
      }
    });

    it('splits with before position', () => {
      const g: DockGroupNode = { type: 'group', id: 'g1', panelIds: ['p1'], activePanelId: 'p1' };
      const newG: DockGroupNode = { type: 'group', id: 'g2', panelIds: ['p2'], activePanelId: 'p2' };

      const result = splitGroup(g, 'g1', 'vertical', newG, 'before');
      if (result.type === 'split') {
        expect(result.children[0]).toBe(newG);
        expect(result.children[1]).toBe(g);
      }
    });

    it('adds to same-direction parent split', () => {
      const g1: DockGroupNode = { type: 'group', id: 'g1', panelIds: ['p1'], activePanelId: 'p1' };
      const g2: DockGroupNode = { type: 'group', id: 'g2', panelIds: ['p2'], activePanelId: 'p2' };
      const split: DockSplitNode = { type: 'split', id: 's1', direction: 'horizontal', children: [g1, g2], sizes: [0.5, 0.5] };
      const newG: DockGroupNode = { type: 'group', id: 'g3', panelIds: ['p3'], activePanelId: 'p3' };

      splitGroup(split, 'g1', 'horizontal', newG, 'after');
      expect(split.children).toHaveLength(3);
      expect(split.children[1]).toBe(newG);
    });

    it('wraps in new split for different direction', () => {
      const g1: DockGroupNode = { type: 'group', id: 'g1', panelIds: ['p1'], activePanelId: 'p1' };
      const g2: DockGroupNode = { type: 'group', id: 'g2', panelIds: ['p2'], activePanelId: 'p2' };
      const split: DockSplitNode = { type: 'split', id: 's1', direction: 'horizontal', children: [g1, g2], sizes: [0.5, 0.5] };
      const newG: DockGroupNode = { type: 'group', id: 'g3', panelIds: ['p3'], activePanelId: 'p3' };

      splitGroup(split, 'g1', 'vertical', newG, 'after');
      expect(split.children).toHaveLength(2);
      const wrappedSplit = split.children[0];
      expect(wrappedSplit?.type).toBe('split');
      if (wrappedSplit?.type === 'split') {
        expect(wrappedSplit.direction).toBe('vertical');
        expect(wrappedSplit.children).toHaveLength(2);
        expect(wrappedSplit.children[0]).toBe(g1);
        expect(wrappedSplit.children[1]).toBe(newG);
      }
    });
  });

  describe('normalizeSizes', () => {
    it('normalizes sizes to sum 1.0', () => {
      const sizes = [1, 2, 3];
      normalizeSizes(sizes);
      expect(sizes.reduce((s, v) => s + v, 0)).toBeCloseTo(1.0);
      expect(sizes[0]).toBeCloseTo(1 / 6);
    });

    it('handles empty array', () => {
      const sizes: number[] = [];
      normalizeSizes(sizes);
      expect(sizes).toEqual([]);
    });

    it('handles all zeros', () => {
      const sizes = [0, 0, 0];
      normalizeSizes(sizes);
      expect(sizes).toEqual([0, 0, 0]);
    });
  });

  describe('serializeNode / deserializeNode', () => {
    it('round-trips group node', () => {
      const g: DockGroupNode = { type: 'group', id: 'g1', panelIds: ['a', 'b'], activePanelId: 'a' };
      const serialized = serializeNode(g);
      const deserialized = deserializeNode(serialized);
      expect(deserialized).toEqual(g);
    });

    it('round-trips split node', () => {
      const g1: DockGroupNode = { type: 'group', id: 'g1', panelIds: ['a'], activePanelId: 'a' };
      const g2: DockGroupNode = { type: 'group', id: 'g2', panelIds: ['b'], activePanelId: 'b' };
      const split: DockSplitNode = { type: 'split', id: 's1', direction: 'horizontal', children: [g1, g2], sizes: [0.6, 0.4] };
      const serialized = serializeNode(split);
      const deserialized = deserializeNode(serialized);
      expect(deserialized).toEqual(split);
    });

    it('serialized data is independent copy', () => {
      const g: DockGroupNode = { type: 'group', id: 'g1', panelIds: ['a'], activePanelId: 'a' };
      const serialized = serializeNode(g);
      if (serialized.type === 'group') {
        serialized.panelIds.push('b');
      }
      expect(g.panelIds).toEqual(['a']);
    });
  });
});

// ── createDockLayout ────────────────────────────────

describe('createDockLayout', () => {
  // ── Initial state ──────────────────────────────────

  it('starts with null root and empty panels', () => {
    const api = createDockLayout();
    expect(api.getRoot()).toBeNull();
    expect(api.getPanels()).toEqual([]);
  });

  it('accepts initial panels', () => {
    const api = createDockLayout({
      panels: [
        { id: 'a', title: 'Panel A' },
        { id: 'b', title: 'Panel B' },
      ],
    });
    expect(api.getPanels()).toHaveLength(2);
    expect(api.getPanel('a')?.title).toBe('Panel A');
    expect(api.getPanel('b')?.title).toBe('Panel B');
  });

  it('puts initial panels into same group', () => {
    const api = createDockLayout({
      panels: [
        { id: 'a', title: 'A' },
        { id: 'b', title: 'B' },
      ],
    });
    const root = api.getRoot();
    expect(root).not.toBeNull();
    expect(root?.type).toBe('group');
    if (root?.type === 'group') {
      expect(root.panelIds).toEqual(['a', 'b']);
    }
  });

  it('activates last added panel in group', () => {
    const api = createDockLayout({
      panels: [
        { id: 'a', title: 'A' },
        { id: 'b', title: 'B' },
      ],
    });
    const root = api.getRoot();
    if (root?.type === 'group') {
      expect(root.activePanelId).toBe('b');
    }
  });

  it('accepts initialRoot', () => {
    const initialRoot: DockSplitNode = {
      type: 'split',
      id: 'root',
      direction: 'horizontal',
      children: [
        { type: 'group', id: 'g1', panelIds: ['a'], activePanelId: 'a' },
        { type: 'group', id: 'g2', panelIds: ['b'], activePanelId: 'b' },
      ],
      sizes: [0.3, 0.7],
    };
    const api = createDockLayout({ initialRoot });
    const root = api.getRoot();
    expect(root?.type).toBe('split');
    if (root?.type === 'split') {
      expect(root.children).toHaveLength(2);
    }
    expect(api.getPanels()).toHaveLength(2);
  });

  it('panels with targetGroupId go to correct group', () => {
    const initialRoot: DockSplitNode = {
      type: 'split',
      id: 'root',
      direction: 'horizontal',
      children: [
        { type: 'group', id: 'g1', panelIds: [], activePanelId: '' },
        { type: 'group', id: 'g2', panelIds: [], activePanelId: '' },
      ],
      sizes: [0.5, 0.5],
    };
    const api = createDockLayout({
      initialRoot,
      panels: [
        { id: 'a', title: 'A', targetGroupId: 'g2' },
      ],
    });
    const group = api.getGroupByPanelId('a');
    expect(group?.id).toBe('g2');
  });

  // ── ADD_PANEL ──────────────────────────────────────

  describe('ADD_PANEL', () => {
    it('adds a panel', () => {
      const api = createDockLayout();
      api.send({ type: 'ADD_PANEL', panel: { id: 'x', title: 'X' } });
      expect(api.getPanels()).toHaveLength(1);
      expect(api.getPanel('x')?.title).toBe('X');
    });

    it('creates root group when adding first panel', () => {
      const api = createDockLayout();
      api.send({ type: 'ADD_PANEL', panel: { id: 'x', title: 'X' } });
      const root = api.getRoot();
      expect(root).not.toBeNull();
      expect(root?.type).toBe('group');
    });

    it('ignores duplicate id', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }],
      });
      api.send({ type: 'ADD_PANEL', panel: { id: 'a', title: 'A2' } });
      expect(api.getPanels()).toHaveLength(1);
      expect(api.getPanel('a')?.title).toBe('A');
    });

    it('adds to target group', () => {
      const initialRoot: DockSplitNode = {
        type: 'split',
        id: 'root',
        direction: 'horizontal',
        children: [
          { type: 'group', id: 'g1', panelIds: ['a'], activePanelId: 'a' },
          { type: 'group', id: 'g2', panelIds: ['b'], activePanelId: 'b' },
        ],
        sizes: [0.5, 0.5],
      };
      const api = createDockLayout({ initialRoot, panels: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }] });
      api.send({ type: 'ADD_PANEL', panel: { id: 'c', title: 'C' }, targetGroupId: 'g2' });
      const group = api.getGroupByPanelId('c');
      expect(group?.id).toBe('g2');
    });

    it('activates newly added panel', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }],
      });
      api.send({ type: 'ADD_PANEL', panel: { id: 'b', title: 'B' } });
      const root = api.getRoot();
      if (root?.type === 'group') {
        expect(root.activePanelId).toBe('b');
      }
    });

    it('respects panel config defaults', () => {
      const api = createDockLayout();
      api.send({ type: 'ADD_PANEL', panel: { id: 'x', title: 'X' } });
      const panel = api.getPanel('x');
      expect(panel?.closable).toBe(true);
      expect(panel?.floatable).toBe(true);
      expect(panel?.autoHideable).toBe(true);
      expect(panel?.minimizable).toBe(true);
    });
  });

  // ── REMOVE_PANEL ───────────────────────────────────

  describe('REMOVE_PANEL', () => {
    it('removes a panel', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }],
      });
      api.send({ type: 'REMOVE_PANEL', panelId: 'a' });
      expect(api.getPanels()).toHaveLength(0);
    });

    it('cleans up empty group from tree', () => {
      const initialRoot: DockSplitNode = {
        type: 'split',
        id: 'root',
        direction: 'horizontal',
        children: [
          { type: 'group', id: 'g1', panelIds: ['a'], activePanelId: 'a' },
          { type: 'group', id: 'g2', panelIds: ['b'], activePanelId: 'b' },
        ],
        sizes: [0.5, 0.5],
      };
      const api = createDockLayout({
        initialRoot,
        panels: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }],
      });
      api.send({ type: 'REMOVE_PANEL', panelId: 'a' });
      // g1 bos kaldi, tree collapse oldu → root = g2
      const root = api.getRoot();
      expect(root?.type).toBe('group');
      if (root?.type === 'group') {
        expect(root.panelIds).toEqual(['b']);
      }
    });

    it('updates active panel when removing active', () => {
      const api = createDockLayout({
        panels: [
          { id: 'a', title: 'A' },
          { id: 'b', title: 'B' },
        ],
      });
      // b is active (last added)
      api.send({ type: 'REMOVE_PANEL', panelId: 'b' });
      const root = api.getRoot();
      if (root?.type === 'group') {
        expect(root.activePanelId).toBe('a');
      }
    });

    it('ignores non-existent panel', () => {
      const api = createDockLayout();
      api.send({ type: 'REMOVE_PANEL', panelId: 'nonexistent' });
      expect(api.getPanels()).toEqual([]);
    });

    it('removes floating panel', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }],
      });
      api.send({ type: 'FLOAT_PANEL', panelId: 'a' });
      expect(api.getFloatingGroups()).toHaveLength(1);
      api.send({ type: 'REMOVE_PANEL', panelId: 'a' });
      expect(api.getFloatingGroups()).toHaveLength(0);
      expect(api.getPanels()).toHaveLength(0);
    });

    it('removes auto-hidden panel', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }],
      });
      api.send({ type: 'AUTO_HIDE_PANEL', panelId: 'a', side: 'left' });
      expect(api.getAutoHiddenPanels()).toHaveLength(1);
      api.send({ type: 'REMOVE_PANEL', panelId: 'a' });
      expect(api.getAutoHiddenPanels()).toHaveLength(0);
    });
  });

  // ── CLOSE_PANEL ────────────────────────────────────

  describe('CLOSE_PANEL', () => {
    it('closes a closable panel', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A', closable: true }],
      });
      api.send({ type: 'CLOSE_PANEL', panelId: 'a' });
      expect(api.getPanels()).toHaveLength(0);
    });

    it('does not close a non-closable panel', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A', closable: false }],
      });
      api.send({ type: 'CLOSE_PANEL', panelId: 'a' });
      expect(api.getPanels()).toHaveLength(1);
    });

    it('ignores non-existent panel', () => {
      const api = createDockLayout();
      api.send({ type: 'CLOSE_PANEL', panelId: 'nonexistent' });
      expect(api.getPanels()).toEqual([]);
    });
  });

  // ── ACTIVATE_PANEL ─────────────────────────────────

  describe('ACTIVATE_PANEL', () => {
    it('sets active panel in tree group', () => {
      const api = createDockLayout({
        panels: [
          { id: 'a', title: 'A' },
          { id: 'b', title: 'B' },
        ],
      });
      api.send({ type: 'ACTIVATE_PANEL', panelId: 'a' });
      const root = api.getRoot();
      if (root?.type === 'group') {
        expect(root.activePanelId).toBe('a');
      }
    });

    it('sets active panel in floating group', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }],
      });
      api.send({ type: 'FLOAT_PANEL', panelId: 'a' });
      api.send({ type: 'FLOAT_PANEL', panelId: 'b' });
      // Find the floating group that has 'a'
      api.send({ type: 'ACTIVATE_PANEL', panelId: 'a' });
      const group = api.getGroupByPanelId('a');
      expect(group?.activePanelId).toBe('a');
    });

    it('ignores non-existent panel', () => {
      const api = createDockLayout();
      api.send({ type: 'ACTIVATE_PANEL', panelId: 'nonexistent' });
    });
  });

  // ── SET_PANEL_TITLE ────────────────────────────────

  describe('SET_PANEL_TITLE', () => {
    it('updates title', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'Old' }],
      });
      api.send({ type: 'SET_PANEL_TITLE', panelId: 'a', title: 'New' });
      expect(api.getPanel('a')?.title).toBe('New');
    });

    it('ignores non-existent panel', () => {
      const api = createDockLayout();
      api.send({ type: 'SET_PANEL_TITLE', panelId: 'x', title: 'Y' });
    });
  });

  // ── SPLIT_GROUP ────────────────────────────────────

  describe('SPLIT_GROUP', () => {
    it('splits group horizontally', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }],
      });
      const rootBefore = api.getRoot();
      const groupId = rootBefore?.id ?? '';

      api.send({
        type: 'SPLIT_GROUP',
        groupId,
        direction: 'horizontal',
        panelId: 'b',
        position: 'after',
      });

      const root = api.getRoot();
      expect(root?.type).toBe('split');
      if (root?.type === 'split') {
        expect(root.direction).toBe('horizontal');
        expect(root.children).toHaveLength(2);
      }
    });

    it('splits group vertically with before position', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }],
      });
      const rootBefore = api.getRoot();
      const groupId = rootBefore?.id ?? '';

      api.send({
        type: 'SPLIT_GROUP',
        groupId,
        direction: 'vertical',
        panelId: 'b',
        position: 'before',
      });

      const root = api.getRoot();
      if (root?.type === 'split') {
        expect(root.direction).toBe('vertical');
        const firstChild = root.children[0];
        if (firstChild?.type === 'group') {
          expect(firstChild.panelIds).toContain('b');
        }
      }
    });

    it('removes panel from source group', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }],
      });
      const rootBefore = api.getRoot();
      const groupId = rootBefore?.id ?? '';

      api.send({
        type: 'SPLIT_GROUP',
        groupId,
        direction: 'horizontal',
        panelId: 'b',
        position: 'after',
      });

      // a should be in original group (which is first child)
      const groupA = api.getGroupByPanelId('a');
      expect(groupA?.panelIds).not.toContain('b');
    });

    it('creates nested splits', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }, { id: 'c', title: 'C' }],
      });
      const rootBefore = api.getRoot();
      const groupId = rootBefore?.id ?? '';

      // First split: horizontal
      api.send({
        type: 'SPLIT_GROUP',
        groupId,
        direction: 'horizontal',
        panelId: 'b',
        position: 'after',
      });

      // Get the group containing 'a'
      const groupA = api.getGroupByPanelId('a');
      if (groupA) {
        // Second split: vertical on the group containing 'a'
        api.send({
          type: 'SPLIT_GROUP',
          groupId: groupA.id,
          direction: 'vertical',
          panelId: 'c',
          position: 'after',
        });
      }

      const root = api.getRoot();
      expect(root?.type).toBe('split');
      if (root?.type === 'split') {
        // Should have nested structure
        const leftChild = root.children[0];
        expect(leftChild?.type).toBe('split');
      }
    });

    it('ignores non-existent group', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }],
      });
      api.send({
        type: 'SPLIT_GROUP',
        groupId: 'nonexistent',
        direction: 'horizontal',
        panelId: 'a',
        position: 'after',
      });
      // Should not crash, root unchanged
      expect(api.getRoot()?.type).toBe('group');
    });
  });

  // ── MOVE_PANEL ─────────────────────────────────────

  describe('MOVE_PANEL', () => {
    it('moves panel between groups', () => {
      const initialRoot: DockSplitNode = {
        type: 'split',
        id: 'root',
        direction: 'horizontal',
        children: [
          { type: 'group', id: 'g1', panelIds: ['a'], activePanelId: 'a' },
          { type: 'group', id: 'g2', panelIds: ['b'], activePanelId: 'b' },
        ],
        sizes: [0.5, 0.5],
      };
      const api = createDockLayout({
        initialRoot,
        panels: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }],
      });

      api.send({ type: 'MOVE_PANEL', panelId: 'a', targetGroupId: 'g2' });

      const group = api.getGroupByPanelId('a');
      expect(group?.id).toBe('g2');
      expect(group?.panelIds).toContain('a');
      expect(group?.panelIds).toContain('b');
    });

    it('cleans up source group after move', () => {
      const initialRoot: DockSplitNode = {
        type: 'split',
        id: 'root',
        direction: 'horizontal',
        children: [
          { type: 'group', id: 'g1', panelIds: ['a'], activePanelId: 'a' },
          { type: 'group', id: 'g2', panelIds: ['b'], activePanelId: 'b' },
        ],
        sizes: [0.5, 0.5],
      };
      const api = createDockLayout({
        initialRoot,
        panels: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }],
      });

      api.send({ type: 'MOVE_PANEL', panelId: 'a', targetGroupId: 'g2' });

      // g1 should be removed (was empty), tree collapsed to g2
      const root = api.getRoot();
      expect(root?.type).toBe('group');
    });

    it('supports index parameter', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }, { id: 'c', title: 'C' }],
      });
      const root = api.getRoot();
      if (root?.type === 'group') {
        // Move c to index 0
        api.send({ type: 'MOVE_PANEL', panelId: 'c', targetGroupId: root.id, index: 0 });
        const updated = api.getRoot();
        if (updated?.type === 'group') {
          expect(updated.panelIds[0]).toBe('c');
        }
      }
    });
  });

  // ── RESIZE_START / DRAG / END ──────────────────────

  describe('RESIZE', () => {
    it('RESIZE_START sets resize state', () => {
      const initialRoot: DockSplitNode = {
        type: 'split',
        id: 's1',
        direction: 'horizontal',
        children: [
          { type: 'group', id: 'g1', panelIds: ['a'], activePanelId: 'a' },
          { type: 'group', id: 'g2', panelIds: ['b'], activePanelId: 'b' },
        ],
        sizes: [0.5, 0.5],
      };
      const api = createDockLayout({ initialRoot, panels: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }] });

      api.send({ type: 'RESIZE_START', splitId: 's1', handleIndex: 0 });
      const state = api.getResizeState();
      expect(state).not.toBeNull();
      expect(state?.splitId).toBe('s1');
      expect(state?.handleIndex).toBe(0);
      expect(state?.startSizes).toEqual([0.5, 0.5]);
    });

    it('RESIZE_DRAG updates sizes', () => {
      const initialRoot: DockSplitNode = {
        type: 'split',
        id: 's1',
        direction: 'horizontal',
        children: [
          { type: 'group', id: 'g1', panelIds: ['a'], activePanelId: 'a' },
          { type: 'group', id: 'g2', panelIds: ['b'], activePanelId: 'b' },
        ],
        sizes: [0.5, 0.5],
      };
      const api = createDockLayout({ initialRoot, panels: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }] });

      api.send({ type: 'RESIZE_START', splitId: 's1', handleIndex: 0 });
      api.send({ type: 'RESIZE_DRAG', delta: 0.1 });

      const root = api.getRoot();
      if (root?.type === 'split') {
        expect(root.sizes[0]).toBeCloseTo(0.6);
        expect(root.sizes[1]).toBeCloseTo(0.4);
      }
    });

    it('RESIZE_DRAG clamps to minimum size', () => {
      const initialRoot: DockSplitNode = {
        type: 'split',
        id: 's1',
        direction: 'horizontal',
        children: [
          { type: 'group', id: 'g1', panelIds: ['a'], activePanelId: 'a' },
          { type: 'group', id: 'g2', panelIds: ['b'], activePanelId: 'b' },
        ],
        sizes: [0.5, 0.5],
      };
      const api = createDockLayout({ initialRoot, panels: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }] });

      api.send({ type: 'RESIZE_START', splitId: 's1', handleIndex: 0 });
      api.send({ type: 'RESIZE_DRAG', delta: 0.9 }); // try to make right panel too small

      const root = api.getRoot();
      if (root?.type === 'split') {
        const s0 = root.sizes[0] ?? 0;
        const s1 = root.sizes[1] ?? 0;
        expect(s1).toBeGreaterThanOrEqual(0.05);
        expect(s0 + s1).toBeCloseTo(1.0);
      }
    });

    it('RESIZE_END clears resize state', () => {
      const initialRoot: DockSplitNode = {
        type: 'split',
        id: 's1',
        direction: 'horizontal',
        children: [
          { type: 'group', id: 'g1', panelIds: ['a'], activePanelId: 'a' },
          { type: 'group', id: 'g2', panelIds: ['b'], activePanelId: 'b' },
        ],
        sizes: [0.5, 0.5],
      };
      const api = createDockLayout({ initialRoot, panels: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }] });

      api.send({ type: 'RESIZE_START', splitId: 's1', handleIndex: 0 });
      api.send({ type: 'RESIZE_END' });
      expect(api.getResizeState()).toBeNull();
    });

    it('SET_SIZES directly sets sizes', () => {
      const initialRoot: DockSplitNode = {
        type: 'split',
        id: 's1',
        direction: 'horizontal',
        children: [
          { type: 'group', id: 'g1', panelIds: ['a'], activePanelId: 'a' },
          { type: 'group', id: 'g2', panelIds: ['b'], activePanelId: 'b' },
        ],
        sizes: [0.5, 0.5],
      };
      const api = createDockLayout({ initialRoot, panels: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }] });

      api.send({ type: 'SET_SIZES', splitId: 's1', sizes: [0.3, 0.7] });
      const root = api.getRoot();
      if (root?.type === 'split') {
        expect(root.sizes[0]).toBeCloseTo(0.3);
        expect(root.sizes[1]).toBeCloseTo(0.7);
      }
    });
  });

  // ── DRAG_START / DROP ──────────────────────────────

  describe('DRAG & DROP', () => {
    it('DRAG_START sets drag state', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }],
      });
      api.send({ type: 'DRAG_START', panelId: 'a' });
      const state = api.getDragState();
      expect(state).not.toBeNull();
      expect(state?.panelId).toBe('a');
    });

    it('DRAG_CANCEL clears drag state', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }],
      });
      api.send({ type: 'DRAG_START', panelId: 'a' });
      api.send({ type: 'DRAG_CANCEL' });
      expect(api.getDragState()).toBeNull();
    });

    it('DROP center: moves panel as tab', () => {
      const initialRoot: DockSplitNode = {
        type: 'split',
        id: 'root',
        direction: 'horizontal',
        children: [
          { type: 'group', id: 'g1', panelIds: ['a'], activePanelId: 'a' },
          { type: 'group', id: 'g2', panelIds: ['b'], activePanelId: 'b' },
        ],
        sizes: [0.5, 0.5],
      };
      const api = createDockLayout({
        initialRoot,
        panels: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }],
      });

      api.send({ type: 'DRAG_START', panelId: 'a' });
      api.send({ type: 'DROP', target: { groupId: 'g2', position: 'center' } });

      expect(api.getDragState()).toBeNull();
      const group = api.getGroupByPanelId('a');
      expect(group?.panelIds).toContain('a');
      expect(group?.panelIds).toContain('b');
    });

    it('DROP left: creates horizontal split', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }],
      });
      const root = api.getRoot();
      const groupId = root?.id ?? '';

      api.send({ type: 'DRAG_START', panelId: 'b' });
      api.send({ type: 'DROP', target: { groupId, position: 'left' } });

      const newRoot = api.getRoot();
      expect(newRoot?.type).toBe('split');
      if (newRoot?.type === 'split') {
        expect(newRoot.direction).toBe('horizontal');
        // 'b' should be in the first (left) child
        const leftChild = newRoot.children[0];
        if (leftChild?.type === 'group') {
          expect(leftChild.panelIds).toContain('b');
        }
      }
    });

    it('DROP right: creates horizontal split', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }],
      });
      const root = api.getRoot();
      const groupId = root?.id ?? '';

      api.send({ type: 'DRAG_START', panelId: 'b' });
      api.send({ type: 'DROP', target: { groupId, position: 'right' } });

      const newRoot = api.getRoot();
      if (newRoot?.type === 'split') {
        expect(newRoot.direction).toBe('horizontal');
        const rightChild = newRoot.children[1];
        if (rightChild?.type === 'group') {
          expect(rightChild.panelIds).toContain('b');
        }
      }
    });

    it('DROP top: creates vertical split', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }],
      });
      const root = api.getRoot();
      const groupId = root?.id ?? '';

      api.send({ type: 'DRAG_START', panelId: 'b' });
      api.send({ type: 'DROP', target: { groupId, position: 'top' } });

      const newRoot = api.getRoot();
      if (newRoot?.type === 'split') {
        expect(newRoot.direction).toBe('vertical');
      }
    });

    it('DROP bottom: creates vertical split', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }],
      });
      const root = api.getRoot();
      const groupId = root?.id ?? '';

      api.send({ type: 'DRAG_START', panelId: 'b' });
      api.send({ type: 'DROP', target: { groupId, position: 'bottom' } });

      const newRoot = api.getRoot();
      if (newRoot?.type === 'split') {
        expect(newRoot.direction).toBe('vertical');
        const bottomChild = newRoot.children[1];
        if (bottomChild?.type === 'group') {
          expect(bottomChild.panelIds).toContain('b');
        }
      }
    });

    it('DROP_TO_FLOAT creates floating panel', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }],
      });
      api.send({ type: 'DRAG_START', panelId: 'b' });
      api.send({ type: 'DROP_TO_FLOAT', panelId: 'b', x: 200, y: 150, width: 400, height: 300 });

      expect(api.getFloatingGroups()).toHaveLength(1);
      const fg = api.getFloatingGroups()[0];
      expect(fg?.x).toBe(200);
      expect(fg?.y).toBe(150);
      expect(fg?.group.panelIds).toContain('b');
    });

    it('DROP without drag state does nothing', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }],
      });
      const rootBefore = api.getRoot();
      api.send({ type: 'DROP', target: { groupId: 'g1', position: 'center' } });
      const rootAfter = api.getRoot();
      expect(JSON.stringify(rootAfter)).toBe(JSON.stringify(rootBefore));
    });
  });

  // ── FLOAT_PANEL ────────────────────────────────────

  describe('FLOAT_PANEL', () => {
    it('floats a panel', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }],
      });
      api.send({ type: 'FLOAT_PANEL', panelId: 'a', x: 200, y: 150, width: 500, height: 400 });

      expect(api.getFloatingGroups()).toHaveLength(1);
      const fg = api.getFloatingGroups()[0];
      expect(fg?.x).toBe(200);
      expect(fg?.y).toBe(150);
      expect(fg?.width).toBe(500);
      expect(fg?.height).toBe(400);
    });

    it('uses default position/size', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }],
      });
      api.send({ type: 'FLOAT_PANEL', panelId: 'a' });
      const fg = api.getFloatingGroups()[0];
      expect(fg?.x).toBe(100);
      expect(fg?.y).toBe(100);
      expect(fg?.width).toBe(400);
      expect(fg?.height).toBe(300);
    });

    it('does not float non-floatable panel', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A', floatable: false }],
      });
      api.send({ type: 'FLOAT_PANEL', panelId: 'a' });
      expect(api.getFloatingGroups()).toHaveLength(0);
    });

    it('removes panel from tree', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }],
      });
      api.send({ type: 'FLOAT_PANEL', panelId: 'a' });
      const root = api.getRoot();
      if (root?.type === 'group') {
        expect(root.panelIds).not.toContain('a');
      }
    });
  });

  // ── DOCK_PANEL ─────────────────────────────────────

  describe('DOCK_PANEL', () => {
    it('docks floating panel back to tree', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }],
      });
      api.send({ type: 'FLOAT_PANEL', panelId: 'a' });
      api.send({ type: 'DOCK_PANEL', panelId: 'a' });

      expect(api.getFloatingGroups()).toHaveLength(0);
      const group = api.getGroupByPanelId('a');
      expect(group).not.toBeUndefined();
    });

    it('docks to target group', () => {
      const initialRoot: DockSplitNode = {
        type: 'split',
        id: 'root',
        direction: 'horizontal',
        children: [
          { type: 'group', id: 'g1', panelIds: ['a'], activePanelId: 'a' },
          { type: 'group', id: 'g2', panelIds: ['b'], activePanelId: 'b' },
        ],
        sizes: [0.5, 0.5],
      };
      const api = createDockLayout({
        initialRoot,
        panels: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }, { id: 'c', title: 'C' }],
      });
      api.send({ type: 'FLOAT_PANEL', panelId: 'c' });
      api.send({ type: 'DOCK_PANEL', panelId: 'c', targetGroupId: 'g2' });

      const group = api.getGroupByPanelId('c');
      expect(group?.id).toBe('g2');
    });
  });

  // ── MOVE_FLOATING / RESIZE_FLOATING / ACTIVATE_FLOATING ─

  describe('Floating operations', () => {
    it('MOVE_FLOATING updates position', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }],
      });
      api.send({ type: 'FLOAT_PANEL', panelId: 'a' });
      const fgId = api.getFloatingGroups()[0]?.id ?? '';
      api.send({ type: 'MOVE_FLOATING', floatingGroupId: fgId, x: 300, y: 250 });

      const fg = api.getFloatingGroups()[0];
      expect(fg?.x).toBe(300);
      expect(fg?.y).toBe(250);
    });

    it('RESIZE_FLOATING updates size with minimum', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }],
      });
      api.send({ type: 'FLOAT_PANEL', panelId: 'a' });
      const fgId = api.getFloatingGroups()[0]?.id ?? '';

      api.send({ type: 'RESIZE_FLOATING', floatingGroupId: fgId, width: 50, height: 30 });
      const fg = api.getFloatingGroups()[0];
      expect(fg?.width).toBe(100); // min
      expect(fg?.height).toBe(50); // min
    });

    it('ACTIVATE_FLOATING brings to front', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }],
      });
      api.send({ type: 'FLOAT_PANEL', panelId: 'a' });
      api.send({ type: 'FLOAT_PANEL', panelId: 'b' });

      const groups = api.getFloatingGroups();
      const firstId = groups[0]?.id ?? '';
      const firstZIndex = groups[0]?.zIndex ?? 0;

      api.send({ type: 'ACTIVATE_FLOATING', floatingGroupId: firstId });
      const updated = api.getFloatingGroups().find((f) => f.id === firstId);
      expect(updated?.zIndex).toBeGreaterThan(firstZIndex);
    });
  });

  // ── AUTO_HIDE_PANEL ────────────────────────────────

  describe('AUTO_HIDE_PANEL', () => {
    it('auto-hides a panel', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }],
      });
      api.send({ type: 'AUTO_HIDE_PANEL', panelId: 'a', side: 'left' });
      expect(api.getAutoHiddenPanels()).toHaveLength(1);
      expect(api.getAutoHiddenPanels()[0]?.panelId).toBe('a');
      expect(api.getAutoHiddenPanels()[0]?.side).toBe('left');
    });

    it('removes panel from tree', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }],
      });
      api.send({ type: 'AUTO_HIDE_PANEL', panelId: 'a', side: 'left' });
      const root = api.getRoot();
      if (root?.type === 'group') {
        expect(root.panelIds).not.toContain('a');
      }
    });

    it('does not auto-hide non-autoHideable panel', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A', autoHideable: false }],
      });
      api.send({ type: 'AUTO_HIDE_PANEL', panelId: 'a', side: 'left' });
      expect(api.getAutoHiddenPanels()).toHaveLength(0);
    });
  });

  // ── RESTORE_PANEL ──────────────────────────────────

  describe('RESTORE_PANEL', () => {
    it('restores auto-hidden panel to tree', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }],
      });
      api.send({ type: 'AUTO_HIDE_PANEL', panelId: 'a', side: 'left' });
      api.send({ type: 'RESTORE_PANEL', panelId: 'a' });

      expect(api.getAutoHiddenPanels()).toHaveLength(0);
      const group = api.getGroupByPanelId('a');
      expect(group).not.toBeUndefined();
    });

    it('restores floating panel to tree', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }],
      });
      api.send({ type: 'FLOAT_PANEL', panelId: 'a' });
      api.send({ type: 'RESTORE_PANEL', panelId: 'a' });

      expect(api.getFloatingGroups()).toHaveLength(0);
      const group = api.getGroupByPanelId('a');
      expect(group).not.toBeUndefined();
    });
  });

  // ── MAXIMIZE_PANEL ─────────────────────────────────

  describe('MAXIMIZE_PANEL', () => {
    it('sets maximized panel id', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }],
      });
      api.send({ type: 'MAXIMIZE_PANEL', panelId: 'a' });
      expect(api.getMaximizedPanelId()).toBe('a');
    });

    it('RESTORE_MAXIMIZED clears maximized state', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }],
      });
      api.send({ type: 'MAXIMIZE_PANEL', panelId: 'a' });
      api.send({ type: 'RESTORE_MAXIMIZED' });
      expect(api.getMaximizedPanelId()).toBeNull();
    });

    it('ignores non-existent panel', () => {
      const api = createDockLayout();
      api.send({ type: 'MAXIMIZE_PANEL', panelId: 'nonexistent' });
      expect(api.getMaximizedPanelId()).toBeNull();
    });
  });

  // ── WORKSPACE ──────────────────────────────────────

  describe('Workspace', () => {
    it('saves workspace', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }],
      });
      api.send({ type: 'SAVE_WORKSPACE', name: 'default' });
      const workspaces = api.getWorkspaces();
      expect(workspaces).toHaveLength(1);
      expect(workspaces[0]?.name).toBe('default');
    });

    it('loads workspace', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }],
      });
      api.send({ type: 'SAVE_WORKSPACE', name: 'ws1' });

      // Change layout
      api.send({ type: 'ADD_PANEL', panel: { id: 'b', title: 'B' } });
      expect(api.getPanels()).toHaveLength(2);

      // Load workspace
      api.send({ type: 'LOAD_WORKSPACE', name: 'ws1' });
      expect(api.getPanels()).toHaveLength(1);
      expect(api.getPanel('a')).not.toBeUndefined();
    });

    it('deletes workspace', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }],
      });
      api.send({ type: 'SAVE_WORKSPACE', name: 'ws1' });
      api.send({ type: 'DELETE_WORKSPACE', name: 'ws1' });
      expect(api.getWorkspaces()).toHaveLength(0);
    });

    it('load non-existent workspace does nothing', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }],
      });
      api.send({ type: 'LOAD_WORKSPACE', name: 'nonexistent' });
      expect(api.getPanels()).toHaveLength(1);
    });

    it('overwrites workspace with same name', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }],
      });
      api.send({ type: 'SAVE_WORKSPACE', name: 'ws1' });
      api.send({ type: 'ADD_PANEL', panel: { id: 'b', title: 'B' } });
      api.send({ type: 'SAVE_WORKSPACE', name: 'ws1' });
      api.send({ type: 'LOAD_WORKSPACE', name: 'ws1' });
      expect(api.getPanels()).toHaveLength(2);
    });
  });

  // ── SERIALIZE / DESERIALIZE ────────────────────────

  describe('serialize / deserialize', () => {
    it('round-trips simple layout', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }],
      });
      const snapshot = api.serialize();

      const api2 = createDockLayout();
      api2.send({ type: 'DESERIALIZE', snapshot });

      expect(api2.getPanels()).toHaveLength(2);
      expect(api2.getPanel('a')?.title).toBe('A');
      expect(api2.getPanel('b')?.title).toBe('B');
    });

    it('round-trips complex layout with split', () => {
      const initialRoot: DockSplitNode = {
        type: 'split',
        id: 'root',
        direction: 'horizontal',
        children: [
          { type: 'group', id: 'g1', panelIds: ['a'], activePanelId: 'a' },
          {
            type: 'split',
            id: 's2',
            direction: 'vertical',
            children: [
              { type: 'group', id: 'g2', panelIds: ['b', 'c'], activePanelId: 'b' },
              { type: 'group', id: 'g3', panelIds: ['d'], activePanelId: 'd' },
            ],
            sizes: [0.7, 0.3],
          },
        ],
        sizes: [0.3, 0.7],
      };
      const api = createDockLayout({
        initialRoot,
        panels: [
          { id: 'a', title: 'A' },
          { id: 'b', title: 'B' },
          { id: 'c', title: 'C' },
          { id: 'd', title: 'D' },
        ],
      });

      const snapshot = api.serialize();
      const api2 = createDockLayout();
      api2.send({ type: 'DESERIALIZE', snapshot });

      expect(api2.getPanels()).toHaveLength(4);
      const root = api2.getRoot();
      expect(root?.type).toBe('split');
      if (root?.type === 'split') {
        expect(root.sizes[0]).toBeCloseTo(0.3);
      }
    });

    it('round-trips floating panels', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }],
      });
      api.send({ type: 'FLOAT_PANEL', panelId: 'a', x: 200, y: 150, width: 500, height: 400 });

      const snapshot = api.serialize();
      const api2 = createDockLayout();
      api2.send({ type: 'DESERIALIZE', snapshot });

      expect(api2.getFloatingGroups()).toHaveLength(1);
      const fg = api2.getFloatingGroups()[0];
      expect(fg?.x).toBe(200);
      expect(fg?.y).toBe(150);
    });

    it('round-trips auto-hidden panels', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }],
      });
      api.send({ type: 'AUTO_HIDE_PANEL', panelId: 'a', side: 'left' });

      const snapshot = api.serialize();
      const api2 = createDockLayout();
      api2.send({ type: 'DESERIALIZE', snapshot });

      expect(api2.getAutoHiddenPanels()).toHaveLength(1);
      expect(api2.getAutoHiddenPanels()[0]?.side).toBe('left');
    });

    it('DESERIALIZE clears existing state', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }],
      });
      api.send({ type: 'MAXIMIZE_PANEL', panelId: 'a' });

      const api2 = createDockLayout({
        panels: [{ id: 'x', title: 'X' }],
      });
      const snapshot = api2.serialize();
      api.send({ type: 'DESERIALIZE', snapshot });

      expect(api.getMaximizedPanelId()).toBeNull();
      expect(api.getPanel('a')).toBeUndefined();
      expect(api.getPanel('x')?.title).toBe('X');
    });
  });

  // ── Immutability ───────────────────────────────────

  describe('Immutability', () => {
    it('getRoot returns a copy', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }],
      });
      const root = api.getRoot();
      if (root?.type === 'group') {
        root.panelIds.push('mutated');
      }
      const rootAgain = api.getRoot();
      if (rootAgain?.type === 'group') {
        expect(rootAgain.panelIds).not.toContain('mutated');
      }
    });

    it('getPanels returns copies', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }],
      });
      const panels = api.getPanels();
      const first = panels[0];
      if (first) first.title = 'Mutated';
      expect(api.getPanel('a')?.title).toBe('A');
    });

    it('getFloatingGroups returns copies', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }],
      });
      api.send({ type: 'FLOAT_PANEL', panelId: 'a' });
      const groups = api.getFloatingGroups();
      const first = groups[0];
      if (first) first.x = 9999;
      expect(api.getFloatingGroups()[0]?.x).not.toBe(9999);
    });

    it('getAutoHiddenPanels returns copies', () => {
      const api = createDockLayout({
        panels: [{ id: 'a', title: 'A' }],
      });
      api.send({ type: 'AUTO_HIDE_PANEL', panelId: 'a', side: 'left' });
      const hidden = api.getAutoHiddenPanels();
      const first = hidden[0];
      if (first) (first as { side: string }).side = 'right';
      expect(api.getAutoHiddenPanels()[0]?.side).toBe('left');
    });
  });
});

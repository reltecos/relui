/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { createMasterDetail } from './master-detail.machine';

describe('createMasterDetail', () => {
  // ── Initial state ────────────────────────────────────

  it('starts with no selection', () => {
    const api = createMasterDetail();
    expect(api.getSelectedId()).toBeNull();
    expect(api.hasSelection()).toBe(false);
  });

  it('defaults to left position, 300 size, not collapsed', () => {
    const api = createMasterDetail();
    expect(api.getMasterPosition()).toBe('left');
    expect(api.getMasterSize()).toBe(300);
    expect(api.isCollapsed()).toBe(false);
  });

  it('accepts initial props', () => {
    const api = createMasterDetail({
      masterPosition: 'right',
      masterSize: 400,
      selectedId: 'item-1',
      collapsible: true,
      collapsed: true,
    });
    expect(api.getMasterPosition()).toBe('right');
    expect(api.getMasterSize()).toBe(400);
    expect(api.getSelectedId()).toBe('item-1');
    expect(api.isCollapsed()).toBe(true);
  });

  // ── Selection ────────────────────────────────────────

  describe('selection', () => {
    it('SELECT sets selected id', () => {
      const api = createMasterDetail();
      api.send({ type: 'SELECT', id: 'item-1' });
      expect(api.getSelectedId()).toBe('item-1');
      expect(api.hasSelection()).toBe(true);
    });

    it('SELECT replaces previous selection', () => {
      const api = createMasterDetail();
      api.send({ type: 'SELECT', id: 'item-1' });
      api.send({ type: 'SELECT', id: 'item-2' });
      expect(api.getSelectedId()).toBe('item-2');
    });

    it('DESELECT clears selection', () => {
      const api = createMasterDetail();
      api.send({ type: 'SELECT', id: 'item-1' });
      api.send({ type: 'DESELECT' });
      expect(api.getSelectedId()).toBeNull();
      expect(api.hasSelection()).toBe(false);
    });
  });

  // ── Collapse ─────────────────────────────────────────

  describe('collapse', () => {
    it('TOGGLE_COLLAPSE works when collapsible', () => {
      const api = createMasterDetail({ collapsible: true });
      expect(api.isCollapsed()).toBe(false);

      api.send({ type: 'TOGGLE_COLLAPSE' });
      expect(api.isCollapsed()).toBe(true);

      api.send({ type: 'TOGGLE_COLLAPSE' });
      expect(api.isCollapsed()).toBe(false);
    });

    it('TOGGLE_COLLAPSE does nothing when not collapsible', () => {
      const api = createMasterDetail({ collapsible: false });
      api.send({ type: 'TOGGLE_COLLAPSE' });
      expect(api.isCollapsed()).toBe(false);
    });

    it('SET_COLLAPSED works when collapsible', () => {
      const api = createMasterDetail({ collapsible: true });
      api.send({ type: 'SET_COLLAPSED', value: true });
      expect(api.isCollapsed()).toBe(true);
    });

    it('SET_COLLAPSED does nothing when not collapsible', () => {
      const api = createMasterDetail({ collapsible: false });
      api.send({ type: 'SET_COLLAPSED', value: true });
      expect(api.isCollapsed()).toBe(false);
    });
  });

  // ── Detail visibility ────────────────────────────────

  describe('detail visibility', () => {
    it('always mode: always visible', () => {
      const api = createMasterDetail({ detailVisibility: 'always' });
      expect(api.isDetailVisible()).toBe(true);
    });

    it('onSelect mode: visible only with selection', () => {
      const api = createMasterDetail({ detailVisibility: 'onSelect' });
      expect(api.isDetailVisible()).toBe(false);

      api.send({ type: 'SELECT', id: 'item-1' });
      expect(api.isDetailVisible()).toBe(true);

      api.send({ type: 'DESELECT' });
      expect(api.isDetailVisible()).toBe(false);
    });

    it('responsive mode: always visible (controlled by React)', () => {
      const api = createMasterDetail({ detailVisibility: 'responsive' });
      expect(api.isDetailVisible()).toBe(true);
    });
  });

  // ── Prop sync ────────────────────────────────────────

  describe('prop sync', () => {
    it('SET_MASTER_SIZE updates size', () => {
      const api = createMasterDetail();
      api.send({ type: 'SET_MASTER_SIZE', value: 500 });
      expect(api.getMasterSize()).toBe(500);
    });

    it('SET_MASTER_SIZE accepts string', () => {
      const api = createMasterDetail();
      api.send({ type: 'SET_MASTER_SIZE', value: '30%' });
      expect(api.getMasterSize()).toBe('30%');
    });

    it('SET_MASTER_POSITION updates position', () => {
      const api = createMasterDetail();
      api.send({ type: 'SET_MASTER_POSITION', value: 'bottom' });
      expect(api.getMasterPosition()).toBe('bottom');
    });
  });
});

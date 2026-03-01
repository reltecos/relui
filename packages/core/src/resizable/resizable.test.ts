/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { createResizable } from './resizable.machine';

describe('createResizable', () => {
  // ── Initial state ────────────────────────────────────

  it('starts with idle state', () => {
    const api = createResizable();
    expect(api.getResizeState()).toBe('idle');
    expect(api.isResizing()).toBe(false);
  });

  it('has default size 200x200', () => {
    const api = createResizable();
    expect(api.getSize()).toEqual({ width: 200, height: 200 });
  });

  it('accepts initial props', () => {
    const api = createResizable({ defaultWidth: 300, defaultHeight: 150, disabled: true });
    expect(api.getSize()).toEqual({ width: 300, height: 150 });
    expect(api.isDisabled()).toBe(true);
  });

  it('no active direction initially', () => {
    const api = createResizable();
    expect(api.getActiveDirection()).toBeNull();
  });

  // ── Resize right ──────────────────────────────────

  describe('resize right', () => {
    it('increases width on drag right', () => {
      const api = createResizable({ defaultWidth: 200, defaultHeight: 200 });
      api.send({ type: 'RESIZE_START', direction: 'right', pointerX: 100, pointerY: 100 });
      expect(api.isResizing()).toBe(true);
      expect(api.getActiveDirection()).toBe('right');

      api.send({ type: 'RESIZE_MOVE', pointerX: 150, pointerY: 100 });
      expect(api.getSize().width).toBe(250);
      expect(api.getSize().height).toBe(200); // unchanged
    });

    it('decreases width on drag left', () => {
      const api = createResizable({ defaultWidth: 200, defaultHeight: 200 });
      api.send({ type: 'RESIZE_START', direction: 'right', pointerX: 100, pointerY: 100 });
      api.send({ type: 'RESIZE_MOVE', pointerX: 50, pointerY: 100 });
      expect(api.getSize().width).toBe(150);
    });
  });

  // ── Resize left ───────────────────────────────────

  describe('resize left', () => {
    it('increases width on drag left', () => {
      const api = createResizable({ defaultWidth: 200, defaultHeight: 200 });
      api.send({ type: 'RESIZE_START', direction: 'left', pointerX: 100, pointerY: 100 });
      api.send({ type: 'RESIZE_MOVE', pointerX: 50, pointerY: 100 });
      expect(api.getSize().width).toBe(250);
    });
  });

  // ── Resize bottom ─────────────────────────────────

  describe('resize bottom', () => {
    it('increases height on drag down', () => {
      const api = createResizable({ defaultWidth: 200, defaultHeight: 200 });
      api.send({ type: 'RESIZE_START', direction: 'bottom', pointerX: 100, pointerY: 100 });
      api.send({ type: 'RESIZE_MOVE', pointerX: 100, pointerY: 180 });
      expect(api.getSize().height).toBe(280);
      expect(api.getSize().width).toBe(200); // unchanged
    });
  });

  // ── Resize top ────────────────────────────────────

  describe('resize top', () => {
    it('increases height on drag up', () => {
      const api = createResizable({ defaultWidth: 200, defaultHeight: 200 });
      api.send({ type: 'RESIZE_START', direction: 'top', pointerX: 100, pointerY: 100 });
      api.send({ type: 'RESIZE_MOVE', pointerX: 100, pointerY: 50 });
      expect(api.getSize().height).toBe(250);
    });
  });

  // ── Resize corners ────────────────────────────────

  describe('resize corners', () => {
    it('bottomRight: increases both', () => {
      const api = createResizable({ defaultWidth: 200, defaultHeight: 200 });
      api.send({ type: 'RESIZE_START', direction: 'bottomRight', pointerX: 100, pointerY: 100 });
      api.send({ type: 'RESIZE_MOVE', pointerX: 160, pointerY: 140 });
      expect(api.getSize()).toEqual({ width: 260, height: 240 });
    });

    it('topLeft: increases both on reverse drag', () => {
      const api = createResizable({ defaultWidth: 200, defaultHeight: 200 });
      api.send({ type: 'RESIZE_START', direction: 'topLeft', pointerX: 100, pointerY: 100 });
      api.send({ type: 'RESIZE_MOVE', pointerX: 60, pointerY: 70 });
      expect(api.getSize()).toEqual({ width: 240, height: 230 });
    });

    it('topRight: width+ height+', () => {
      const api = createResizable({ defaultWidth: 200, defaultHeight: 200 });
      api.send({ type: 'RESIZE_START', direction: 'topRight', pointerX: 100, pointerY: 100 });
      api.send({ type: 'RESIZE_MOVE', pointerX: 150, pointerY: 60 });
      expect(api.getSize()).toEqual({ width: 250, height: 240 });
    });

    it('bottomLeft: width+ height+', () => {
      const api = createResizable({ defaultWidth: 200, defaultHeight: 200 });
      api.send({ type: 'RESIZE_START', direction: 'bottomLeft', pointerX: 100, pointerY: 100 });
      api.send({ type: 'RESIZE_MOVE', pointerX: 60, pointerY: 150 });
      expect(api.getSize()).toEqual({ width: 240, height: 250 });
    });
  });

  // ── Resize end ────────────────────────────────────

  describe('resize end', () => {
    it('stops resizing', () => {
      const api = createResizable({ defaultWidth: 200, defaultHeight: 200 });
      api.send({ type: 'RESIZE_START', direction: 'right', pointerX: 100, pointerY: 100 });
      api.send({ type: 'RESIZE_MOVE', pointerX: 150, pointerY: 100 });
      api.send({ type: 'RESIZE_END' });

      expect(api.isResizing()).toBe(false);
      expect(api.getActiveDirection()).toBeNull();
      expect(api.getSize().width).toBe(250); // size preserved
    });

    it('ignores move after end', () => {
      const api = createResizable({ defaultWidth: 200, defaultHeight: 200 });
      api.send({ type: 'RESIZE_START', direction: 'right', pointerX: 100, pointerY: 100 });
      api.send({ type: 'RESIZE_END' });
      api.send({ type: 'RESIZE_MOVE', pointerX: 300, pointerY: 100 });
      expect(api.getSize().width).toBe(200); // unchanged
    });
  });

  // ── Min/max constraints ───────────────────────────

  describe('min/max constraints', () => {
    it('clamps to minWidth', () => {
      const api = createResizable({ defaultWidth: 200, defaultHeight: 200, minWidth: 100 });
      api.send({ type: 'RESIZE_START', direction: 'right', pointerX: 200, pointerY: 100 });
      api.send({ type: 'RESIZE_MOVE', pointerX: 0, pointerY: 100 }); // -200 delta
      expect(api.getSize().width).toBe(100);
    });

    it('clamps to maxWidth', () => {
      const api = createResizable({ defaultWidth: 200, defaultHeight: 200, maxWidth: 300 });
      api.send({ type: 'RESIZE_START', direction: 'right', pointerX: 100, pointerY: 100 });
      api.send({ type: 'RESIZE_MOVE', pointerX: 300, pointerY: 100 }); // +200 delta
      expect(api.getSize().width).toBe(300);
    });

    it('clamps to minHeight', () => {
      const api = createResizable({ defaultWidth: 200, defaultHeight: 200, minHeight: 80 });
      api.send({ type: 'RESIZE_START', direction: 'bottom', pointerX: 100, pointerY: 200 });
      api.send({ type: 'RESIZE_MOVE', pointerX: 100, pointerY: 0 });
      expect(api.getSize().height).toBe(80);
    });

    it('clamps to maxHeight', () => {
      const api = createResizable({ defaultWidth: 200, defaultHeight: 200, maxHeight: 350 });
      api.send({ type: 'RESIZE_START', direction: 'bottom', pointerX: 100, pointerY: 100 });
      api.send({ type: 'RESIZE_MOVE', pointerX: 100, pointerY: 400 });
      expect(api.getSize().height).toBe(350);
    });
  });

  // ── Direction restrictions ────────────────────────

  describe('direction restrictions', () => {
    it('ignores resize start for disallowed direction', () => {
      const api = createResizable({
        defaultWidth: 200,
        defaultHeight: 200,
        directions: ['right', 'bottom'],
      });
      api.send({ type: 'RESIZE_START', direction: 'left', pointerX: 100, pointerY: 100 });
      expect(api.isResizing()).toBe(false);
    });

    it('allows resize for allowed direction', () => {
      const api = createResizable({
        defaultWidth: 200,
        defaultHeight: 200,
        directions: ['right'],
      });
      api.send({ type: 'RESIZE_START', direction: 'right', pointerX: 100, pointerY: 100 });
      expect(api.isResizing()).toBe(true);
    });
  });

  // ── Disabled ──────────────────────────────────────

  describe('disabled', () => {
    it('does not start resize when disabled', () => {
      const api = createResizable({ disabled: true });
      api.send({ type: 'RESIZE_START', direction: 'right', pointerX: 100, pointerY: 100 });
      expect(api.isResizing()).toBe(false);
    });

    it('stops resizing when disabled', () => {
      const api = createResizable();
      api.send({ type: 'RESIZE_START', direction: 'right', pointerX: 100, pointerY: 100 });
      expect(api.isResizing()).toBe(true);

      api.send({ type: 'SET_DISABLED', value: true });
      expect(api.isResizing()).toBe(false);
      expect(api.isDisabled()).toBe(true);
    });
  });

  // ── SET_SIZE ──────────────────────────────────────

  describe('SET_SIZE', () => {
    it('sets size', () => {
      const api = createResizable();
      api.send({ type: 'SET_SIZE', width: 500, height: 400 });
      expect(api.getSize()).toEqual({ width: 500, height: 400 });
    });

    it('clamps SET_SIZE to min/max', () => {
      const api = createResizable({ minWidth: 100, maxWidth: 300, minHeight: 100, maxHeight: 300 });
      api.send({ type: 'SET_SIZE', width: 50, height: 400 });
      expect(api.getSize()).toEqual({ width: 100, height: 300 });
    });
  });
});

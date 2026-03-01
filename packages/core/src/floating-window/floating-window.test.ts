/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { createFloatingWindow } from './floating-window.machine';

describe('createFloatingWindow', () => {
  // ── Initial state ────────────────────────────────────

  it('defaults to position (100, 100) and size 400x300', () => {
    const api = createFloatingWindow();
    expect(api.getPosition()).toEqual({ x: 100, y: 100 });
    expect(api.getSize()).toEqual({ width: 400, height: 300 });
  });

  it('defaults to normal state', () => {
    const api = createFloatingWindow();
    expect(api.getState()).toBe('normal');
  });

  it('defaults to draggable and resizable', () => {
    const api = createFloatingWindow();
    expect(api.isDraggable()).toBe(true);
    expect(api.isResizable()).toBe(true);
  });

  it('starts with no dragging', () => {
    const api = createFloatingWindow();
    expect(api.isDragging()).toBe(false);
  });

  it('accepts initial props', () => {
    const api = createFloatingWindow({
      defaultPosition: { x: 50, y: 50 },
      defaultSize: { width: 600, height: 400 },
      zIndex: 2000,
    });
    expect(api.getPosition()).toEqual({ x: 50, y: 50 });
    expect(api.getSize()).toEqual({ width: 600, height: 400 });
    expect(api.getZIndex()).toBe(2000);
  });

  // ── Drag ───────────────────────────────────────────────

  describe('drag', () => {
    it('DRAG_START + DRAG moves position', () => {
      const api = createFloatingWindow({
        defaultPosition: { x: 100, y: 100 },
      });
      api.send({ type: 'DRAG_START', startX: 200, startY: 150 });
      expect(api.isDragging()).toBe(true);

      api.send({ type: 'DRAG', currentX: 250, currentY: 200 });
      expect(api.getPosition()).toEqual({ x: 150, y: 150 });
    });

    it('DRAG_END stops dragging', () => {
      const api = createFloatingWindow();
      api.send({ type: 'DRAG_START', startX: 100, startY: 100 });
      api.send({ type: 'DRAG_END' });
      expect(api.isDragging()).toBe(false);
    });

    it('DRAG without DRAG_START is ignored', () => {
      const api = createFloatingWindow({ defaultPosition: { x: 100, y: 100 } });
      api.send({ type: 'DRAG', currentX: 200, currentY: 200 });
      expect(api.getPosition()).toEqual({ x: 100, y: 100 });
    });

    it('drag is disabled when draggable is false', () => {
      const api = createFloatingWindow({ draggable: false });
      api.send({ type: 'DRAG_START', startX: 100, startY: 100 });
      expect(api.isDragging()).toBe(false);
    });

    it('drag is disabled when maximized', () => {
      const api = createFloatingWindow();
      api.send({ type: 'MAXIMIZE', containerWidth: 1920, containerHeight: 1080 });
      api.send({ type: 'DRAG_START', startX: 100, startY: 100 });
      expect(api.isDragging()).toBe(false);
    });

    it('DRAG correctly calculates delta', () => {
      const api = createFloatingWindow({
        defaultPosition: { x: 200, y: 300 },
      });
      api.send({ type: 'DRAG_START', startX: 50, startY: 50 });
      api.send({ type: 'DRAG', currentX: 80, currentY: 70 });
      // dx=30, dy=20
      expect(api.getPosition()).toEqual({ x: 230, y: 320 });
    });
  });

  // ── Resize ─────────────────────────────────────────────

  describe('resize', () => {
    it('RESIZE updates size', () => {
      const api = createFloatingWindow();
      api.send({ type: 'RESIZE', width: 500, height: 400 });
      expect(api.getSize()).toEqual({ width: 500, height: 400 });
    });

    it('RESIZE clamps to minSize', () => {
      const api = createFloatingWindow({ minSize: { width: 200, height: 150 } });
      api.send({ type: 'RESIZE', width: 100, height: 50 });
      expect(api.getSize()).toEqual({ width: 200, height: 150 });
    });

    it('RESIZE clamps to maxSize', () => {
      const api = createFloatingWindow({ maxSize: { width: 800, height: 600 } });
      api.send({ type: 'RESIZE', width: 1000, height: 800 });
      expect(api.getSize()).toEqual({ width: 800, height: 600 });
    });

    it('RESIZE is ignored when not resizable', () => {
      const api = createFloatingWindow({
        resizable: false,
        defaultSize: { width: 400, height: 300 },
      });
      api.send({ type: 'RESIZE', width: 600, height: 500 });
      expect(api.getSize()).toEqual({ width: 400, height: 300 });
    });

    it('RESIZE is ignored when maximized', () => {
      const api = createFloatingWindow();
      api.send({ type: 'MAXIMIZE', containerWidth: 1920, containerHeight: 1080 });
      api.send({ type: 'RESIZE', width: 500, height: 400 });
      expect(api.getSize()).toEqual({ width: 1920, height: 1080 });
    });
  });

  // ── SET_POSITION / SET_SIZE ────────────────────────────

  describe('SET_POSITION / SET_SIZE', () => {
    it('SET_POSITION updates position', () => {
      const api = createFloatingWindow();
      api.send({ type: 'SET_POSITION', x: 200, y: 300 });
      expect(api.getPosition()).toEqual({ x: 200, y: 300 });
    });

    it('SET_POSITION is ignored when maximized', () => {
      const api = createFloatingWindow();
      api.send({ type: 'MAXIMIZE', containerWidth: 1920, containerHeight: 1080 });
      api.send({ type: 'SET_POSITION', x: 100, y: 100 });
      expect(api.getPosition()).toEqual({ x: 0, y: 0 });
    });

    it('SET_SIZE updates size with clamping', () => {
      const api = createFloatingWindow({ minSize: { width: 200, height: 150 } });
      api.send({ type: 'SET_SIZE', width: 100, height: 100 });
      expect(api.getSize()).toEqual({ width: 200, height: 150 });
    });
  });

  // ── Window state ───────────────────────────────────────

  describe('window state', () => {
    it('MINIMIZE changes state to minimized', () => {
      const api = createFloatingWindow();
      api.send({ type: 'MINIMIZE' });
      expect(api.getState()).toBe('minimized');
    });

    it('MAXIMIZE changes state and fills container', () => {
      const api = createFloatingWindow({
        defaultPosition: { x: 100, y: 100 },
        defaultSize: { width: 400, height: 300 },
      });
      api.send({ type: 'MAXIMIZE', containerWidth: 1920, containerHeight: 1080 });
      expect(api.getState()).toBe('maximized');
      expect(api.getPosition()).toEqual({ x: 0, y: 0 });
      expect(api.getSize()).toEqual({ width: 1920, height: 1080 });
    });

    it('RESTORE from maximized restores previous position and size', () => {
      const api = createFloatingWindow({
        defaultPosition: { x: 100, y: 100 },
        defaultSize: { width: 400, height: 300 },
      });
      api.send({ type: 'MAXIMIZE', containerWidth: 1920, containerHeight: 1080 });
      api.send({ type: 'RESTORE' });
      expect(api.getState()).toBe('normal');
      expect(api.getPosition()).toEqual({ x: 100, y: 100 });
      expect(api.getSize()).toEqual({ width: 400, height: 300 });
    });

    it('RESTORE from minimized restores previous position and size', () => {
      const api = createFloatingWindow({
        defaultPosition: { x: 50, y: 50 },
        defaultSize: { width: 600, height: 400 },
      });
      api.send({ type: 'MINIMIZE' });
      api.send({ type: 'RESTORE' });
      expect(api.getState()).toBe('normal');
      expect(api.getPosition()).toEqual({ x: 50, y: 50 });
      expect(api.getSize()).toEqual({ width: 600, height: 400 });
    });

    it('RESTORE from normal does nothing', () => {
      const api = createFloatingWindow({
        defaultPosition: { x: 100, y: 100 },
        defaultSize: { width: 400, height: 300 },
      });
      api.send({ type: 'RESTORE' });
      expect(api.getState()).toBe('normal');
      expect(api.getPosition()).toEqual({ x: 100, y: 100 });
    });

    it('MAXIMIZE after MINIMIZE preserves original position for restore', () => {
      const api = createFloatingWindow({
        defaultPosition: { x: 100, y: 100 },
        defaultSize: { width: 400, height: 300 },
      });
      api.send({ type: 'MINIMIZE' });
      api.send({ type: 'MAXIMIZE', containerWidth: 1920, containerHeight: 1080 });
      api.send({ type: 'RESTORE' });
      // Should restore to original, not minimized position
      expect(api.getPosition()).toEqual({ x: 100, y: 100 });
      expect(api.getSize()).toEqual({ width: 400, height: 300 });
    });
  });

  // ── z-index ────────────────────────────────────────────

  describe('z-index', () => {
    it('defaults to 1000', () => {
      const api = createFloatingWindow();
      expect(api.getZIndex()).toBe(1000);
    });

    it('SET_Z_INDEX updates z-index', () => {
      const api = createFloatingWindow();
      api.send({ type: 'SET_Z_INDEX', value: 2000 });
      expect(api.getZIndex()).toBe(2000);
    });
  });
});

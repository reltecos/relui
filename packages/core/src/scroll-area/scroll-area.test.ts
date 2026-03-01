/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { createScrollArea } from './scroll-area.machine';

const DIMENSIONS = {
  viewportWidth: 400,
  viewportHeight: 300,
  contentWidth: 400,
  contentHeight: 1200,
};

const BOTH_DIMENSIONS = {
  viewportWidth: 400,
  viewportHeight: 300,
  contentWidth: 800,
  contentHeight: 1200,
};

describe('createScrollArea', () => {
  // ── Başlangıç state ──────────────────────────────────────────────

  describe('initial state', () => {
    it('varsayılan değerler doğru', () => {
      const api = createScrollArea();
      expect(api.getScrollPosition()).toEqual({ scrollLeft: 0, scrollTop: 0 });
      expect(api.getType()).toBe('hover');
      expect(api.getOrientation()).toBe('vertical');
      expect(api.isHovered()).toBe(false);
      expect(api.isDragging()).toBe(false);
      expect(api.getDragAxis()).toBeNull();
    });

    it('props ile özelleştirilebilir', () => {
      const api = createScrollArea({
        type: 'always',
        orientation: 'both',
        minThumbSize: 30,
      });
      expect(api.getType()).toBe('always');
      expect(api.getOrientation()).toBe('both');
    });
  });

  // ── Scroll ────────────────────────────────────────────────────────

  describe('SCROLL', () => {
    it('scroll pozisyonunu günceller', () => {
      const api = createScrollArea();
      api.send({ type: 'SCROLL', scrollLeft: 0, scrollTop: 150 });
      expect(api.getScrollPosition()).toEqual({ scrollLeft: 0, scrollTop: 150 });
    });

    it('yatay scroll günceller', () => {
      const api = createScrollArea({ orientation: 'both' });
      api.send({ type: 'SCROLL', scrollLeft: 100, scrollTop: 50 });
      expect(api.getScrollPosition()).toEqual({ scrollLeft: 100, scrollTop: 50 });
    });
  });

  // ── Resize ────────────────────────────────────────────────────────

  describe('RESIZE', () => {
    it('boyut bilgisini günceller', () => {
      const api = createScrollArea();
      api.send({ type: 'RESIZE', dimensions: DIMENSIONS });
      expect(api.getDimensions()).toEqual(DIMENSIONS);
    });
  });

  // ── Thumb hesaplamaları ────────────────────────────────────────────

  describe('thumb calculation', () => {
    it('dikey thumb boyutu doğru hesaplanır', () => {
      const api = createScrollArea();
      api.send({ type: 'RESIZE', dimensions: DIMENSIONS });
      const thumb = api.getVerticalThumb();
      // viewport 300, content 1200 → size = 300/1200 = 0.25
      expect(thumb.size).toBe(0.25);
      expect(thumb.position).toBe(0);
    });

    it('scroll edilince thumb pozisyonu güncellenir', () => {
      const api = createScrollArea();
      api.send({ type: 'RESIZE', dimensions: DIMENSIONS });
      // scroll en alta (maxScroll = 1200 - 300 = 900)
      api.send({ type: 'SCROLL', scrollLeft: 0, scrollTop: 900 });
      const thumb = api.getVerticalThumb();
      expect(thumb.size).toBe(0.25);
      // position = (900/900) * (1 - 0.25) = 0.75
      expect(thumb.position).toBe(0.75);
    });

    it('yarı yolda thumb pozisyonu', () => {
      const api = createScrollArea();
      api.send({ type: 'RESIZE', dimensions: DIMENSIONS });
      api.send({ type: 'SCROLL', scrollLeft: 0, scrollTop: 450 });
      const thumb = api.getVerticalThumb();
      // position = (450/900) * 0.75 = 0.375
      expect(thumb.position).toBe(0.375);
    });

    it('content <= viewport ise thumb size 1', () => {
      const api = createScrollArea();
      api.send({
        type: 'RESIZE',
        dimensions: {
          viewportWidth: 400,
          viewportHeight: 300,
          contentWidth: 400,
          contentHeight: 200,
        },
      });
      const thumb = api.getVerticalThumb();
      expect(thumb.size).toBe(1);
      expect(thumb.position).toBe(0);
    });

    it('yatay thumb doğru hesaplanır', () => {
      const api = createScrollArea({ orientation: 'both' });
      api.send({ type: 'RESIZE', dimensions: BOTH_DIMENSIONS });
      const thumb = api.getHorizontalThumb();
      // viewport 400, content 800 → size = 400/800 = 0.5
      expect(thumb.size).toBe(0.5);
    });

    it('minThumbSize uygulanır', () => {
      const api = createScrollArea({ minThumbSize: 50 });
      api.send({
        type: 'RESIZE',
        dimensions: {
          viewportWidth: 400,
          viewportHeight: 100,
          contentWidth: 400,
          contentHeight: 10000,
        },
      });
      const thumb = api.getVerticalThumb();
      // raw size = 100/10000 = 0.01, min = 50/100 = 0.5
      expect(thumb.size).toBe(0.5);
    });
  });

  // ── Visibility ────────────────────────────────────────────────────

  describe('visibility', () => {
    it('vertical orientation ise sadece dikey scrollbar görünür', () => {
      const api = createScrollArea({ orientation: 'vertical' });
      api.send({ type: 'RESIZE', dimensions: BOTH_DIMENSIONS });
      expect(api.isVerticalVisible()).toBe(true);
      expect(api.isHorizontalVisible()).toBe(false);
    });

    it('horizontal orientation ise sadece yatay scrollbar görünür', () => {
      const api = createScrollArea({ orientation: 'horizontal' });
      api.send({ type: 'RESIZE', dimensions: BOTH_DIMENSIONS });
      expect(api.isVerticalVisible()).toBe(false);
      expect(api.isHorizontalVisible()).toBe(true);
    });

    it('both orientation ise her iki scrollbar görünür', () => {
      const api = createScrollArea({ orientation: 'both' });
      api.send({ type: 'RESIZE', dimensions: BOTH_DIMENSIONS });
      expect(api.isVerticalVisible()).toBe(true);
      expect(api.isHorizontalVisible()).toBe(true);
    });

    it('content kısa ise scrollbar görünmez', () => {
      const api = createScrollArea({ orientation: 'both' });
      api.send({
        type: 'RESIZE',
        dimensions: {
          viewportWidth: 400,
          viewportHeight: 300,
          contentWidth: 200,
          contentHeight: 100,
        },
      });
      expect(api.isVerticalVisible()).toBe(false);
      expect(api.isHorizontalVisible()).toBe(false);
    });
  });

  // ── shouldShowScrollbars ──────────────────────────────────────────

  describe('shouldShowScrollbars', () => {
    it('type=always ise her zaman gösterilir', () => {
      const api = createScrollArea({ type: 'always' });
      expect(api.shouldShowScrollbars()).toBe(true);
    });

    it('type=hover ise hover olmadan gizli', () => {
      const api = createScrollArea({ type: 'hover' });
      expect(api.shouldShowScrollbars()).toBe(false);
    });

    it('type=hover ise hover olunca görünür', () => {
      const api = createScrollArea({ type: 'hover' });
      api.send({ type: 'POINTER_ENTER' });
      expect(api.shouldShowScrollbars()).toBe(true);
    });

    it('type=hover ise pointer leave sonrası gizli', () => {
      const api = createScrollArea({ type: 'hover' });
      api.send({ type: 'POINTER_ENTER' });
      api.send({ type: 'POINTER_LEAVE' });
      expect(api.shouldShowScrollbars()).toBe(false);
    });

    it('type=hover ise scrollbar hover olunca görünür', () => {
      const api = createScrollArea({ type: 'hover' });
      api.send({ type: 'SCROLLBAR_POINTER_ENTER', axis: 'y' });
      expect(api.shouldShowScrollbars()).toBe(true);
    });

    it('type=hover ise dragging sırasında görünür', () => {
      const api = createScrollArea({ type: 'hover' });
      api.send({ type: 'RESIZE', dimensions: DIMENSIONS });
      api.send({ type: 'THUMB_POINTER_DOWN', axis: 'y', pointerPos: 50 });
      expect(api.shouldShowScrollbars()).toBe(true);
    });

    it('type=scroll ise sadece dragging sırasında', () => {
      const api = createScrollArea({ type: 'scroll' });
      expect(api.shouldShowScrollbars()).toBe(false);
      api.send({ type: 'RESIZE', dimensions: DIMENSIONS });
      api.send({ type: 'THUMB_POINTER_DOWN', axis: 'y', pointerPos: 50 });
      expect(api.shouldShowScrollbars()).toBe(true);
    });

    it('type=auto ise scrollable olduğunda görünür', () => {
      const api = createScrollArea({ type: 'auto' });
      expect(api.shouldShowScrollbars()).toBe(false);
      api.send({ type: 'RESIZE', dimensions: DIMENSIONS });
      expect(api.shouldShowScrollbars()).toBe(true);
    });
  });

  // ── Hover ─────────────────────────────────────────────────────────

  describe('hover', () => {
    it('POINTER_ENTER/LEAVE hover state yönetir', () => {
      const api = createScrollArea();
      expect(api.isHovered()).toBe(false);
      api.send({ type: 'POINTER_ENTER' });
      expect(api.isHovered()).toBe(true);
      api.send({ type: 'POINTER_LEAVE' });
      expect(api.isHovered()).toBe(false);
    });
  });

  // ── Thumb drag ────────────────────────────────────────────────────

  describe('thumb drag', () => {
    it('THUMB_POINTER_DOWN ile drag başlar', () => {
      const api = createScrollArea();
      api.send({ type: 'RESIZE', dimensions: DIMENSIONS });
      api.send({ type: 'THUMB_POINTER_DOWN', axis: 'y', pointerPos: 50 });
      expect(api.isDragging()).toBe(true);
      expect(api.getDragAxis()).toBe('y');
    });

    it('THUMB_POINTER_UP ile drag biter', () => {
      const api = createScrollArea();
      api.send({ type: 'RESIZE', dimensions: DIMENSIONS });
      api.send({ type: 'THUMB_POINTER_DOWN', axis: 'y', pointerPos: 50 });
      api.send({ type: 'THUMB_POINTER_UP' });
      expect(api.isDragging()).toBe(false);
      expect(api.getDragAxis()).toBeNull();
    });

    it('THUMB_POINTER_MOVE ile scroll pozisyonu güncellenir (dikey)', () => {
      const api = createScrollArea();
      api.send({ type: 'RESIZE', dimensions: DIMENSIONS });
      api.send({ type: 'SCROLL', scrollLeft: 0, scrollTop: 0 });
      api.send({ type: 'THUMB_POINTER_DOWN', axis: 'y', pointerPos: 0 });

      // Thumb'ı 100px aşağı sürükle
      api.send({ type: 'THUMB_POINTER_MOVE', pointerPos: 100 });

      const pos = api.getScrollPosition();
      expect(pos.scrollTop).toBeGreaterThan(0);
      expect(pos.scrollLeft).toBe(0);
    });

    it('THUMB_POINTER_MOVE ile scroll pozisyonu güncellenir (yatay)', () => {
      const api = createScrollArea({ orientation: 'both' });
      api.send({ type: 'RESIZE', dimensions: BOTH_DIMENSIONS });
      api.send({ type: 'SCROLL', scrollLeft: 0, scrollTop: 0 });
      api.send({ type: 'THUMB_POINTER_DOWN', axis: 'x', pointerPos: 0 });

      api.send({ type: 'THUMB_POINTER_MOVE', pointerPos: 50 });

      const pos = api.getScrollPosition();
      expect(pos.scrollLeft).toBeGreaterThan(0);
    });

    it('drag sırasında scroll sınırlarda kalır (min)', () => {
      const api = createScrollArea();
      api.send({ type: 'RESIZE', dimensions: DIMENSIONS });
      api.send({ type: 'SCROLL', scrollLeft: 0, scrollTop: 100 });
      api.send({ type: 'THUMB_POINTER_DOWN', axis: 'y', pointerPos: 100 });

      // Thumb'ı çok yukarı sürükle
      api.send({ type: 'THUMB_POINTER_MOVE', pointerPos: -500 });

      expect(api.getScrollPosition().scrollTop).toBe(0);
    });

    it('drag sırasında scroll sınırlarda kalır (max)', () => {
      const api = createScrollArea();
      api.send({ type: 'RESIZE', dimensions: DIMENSIONS });
      api.send({ type: 'SCROLL', scrollLeft: 0, scrollTop: 0 });
      api.send({ type: 'THUMB_POINTER_DOWN', axis: 'y', pointerPos: 0 });

      // Thumb'ı çok aşağı sürükle
      api.send({ type: 'THUMB_POINTER_MOVE', pointerPos: 5000 });

      // maxScroll = 1200 - 300 = 900
      expect(api.getScrollPosition().scrollTop).toBe(900);
    });

    it('dragging false iken MOVE etkisiz', () => {
      const api = createScrollArea();
      api.send({ type: 'RESIZE', dimensions: DIMENSIONS });
      api.send({ type: 'SCROLL', scrollLeft: 0, scrollTop: 100 });

      api.send({ type: 'THUMB_POINTER_MOVE', pointerPos: 500 });

      expect(api.getScrollPosition().scrollTop).toBe(100);
    });
  });

  // ── Track click ───────────────────────────────────────────────────

  describe('track click', () => {
    it('track click ile dikey scroll pozisyonu hesaplanır', () => {
      const api = createScrollArea();
      api.send({ type: 'RESIZE', dimensions: DIMENSIONS });

      // Track'in ortasına tıkla (trackSize=300, clickPos=150)
      api.send({ type: 'TRACK_CLICK', axis: 'y', clickPos: 150, trackSize: 300 });

      const pos = api.getScrollPosition();
      // ratio = 150/300 = 0.5, maxScroll = 900, scrollTop = 0.5 * 900 = 450
      expect(pos.scrollTop).toBe(450);
    });

    it('track click ile yatay scroll pozisyonu hesaplanır', () => {
      const api = createScrollArea({ orientation: 'both' });
      api.send({ type: 'RESIZE', dimensions: BOTH_DIMENSIONS });

      api.send({ type: 'TRACK_CLICK', axis: 'x', clickPos: 200, trackSize: 400 });

      const pos = api.getScrollPosition();
      // ratio = 200/400 = 0.5, maxScroll = 800 - 400 = 400, scrollLeft = 0.5 * 400 = 200
      expect(pos.scrollLeft).toBe(200);
    });

    it('getScrollFromTrackClick helper doğru hesaplar', () => {
      const api = createScrollArea();
      api.send({ type: 'RESIZE', dimensions: DIMENSIONS });

      const scrollPos = api.getScrollFromTrackClick('y', 0, 300);
      expect(scrollPos).toBe(0);

      const scrollPosEnd = api.getScrollFromTrackClick('y', 300, 300);
      expect(scrollPosEnd).toBe(900);
    });
  });

  // ── getScrollFromThumbDrag ────────────────────────────────────────

  describe('getScrollFromThumbDrag', () => {
    it('drag yokken null döner', () => {
      const api = createScrollArea();
      expect(api.getScrollFromThumbDrag()).toBeNull();
    });

    it('drag varken mevcut pozisyonu döner', () => {
      const api = createScrollArea();
      api.send({ type: 'RESIZE', dimensions: DIMENSIONS });
      api.send({ type: 'SCROLL', scrollLeft: 0, scrollTop: 200 });
      api.send({ type: 'THUMB_POINTER_DOWN', axis: 'y', pointerPos: 50 });

      const pos = api.getScrollFromThumbDrag();
      expect(pos).toEqual({ scrollLeft: 0, scrollTop: 200 });
    });
  });

  // ── Prop sync ─────────────────────────────────────────────────────

  describe('prop sync', () => {
    it('SET_TYPE ile type güncellenir', () => {
      const api = createScrollArea({ type: 'hover' });
      api.send({ type: 'SET_TYPE', value: 'always' });
      expect(api.getType()).toBe('always');
    });

    it('SET_ORIENTATION ile orientation güncellenir', () => {
      const api = createScrollArea({ orientation: 'vertical' });
      api.send({ type: 'SET_ORIENTATION', value: 'both' });
      expect(api.getOrientation()).toBe('both');
    });
  });

  // ── Scrollbar hover ───────────────────────────────────────────────

  describe('scrollbar hover', () => {
    it('SCROLLBAR_POINTER_ENTER/LEAVE y ekseni', () => {
      const api = createScrollArea({ type: 'hover' });
      api.send({ type: 'SCROLLBAR_POINTER_ENTER', axis: 'y' });
      expect(api.shouldShowScrollbars()).toBe(true);
      api.send({ type: 'SCROLLBAR_POINTER_LEAVE', axis: 'y' });
      expect(api.shouldShowScrollbars()).toBe(false);
    });

    it('SCROLLBAR_POINTER_ENTER/LEAVE x ekseni', () => {
      const api = createScrollArea({ type: 'hover' });
      api.send({ type: 'SCROLLBAR_POINTER_ENTER', axis: 'x' });
      expect(api.shouldShowScrollbars()).toBe(true);
      api.send({ type: 'SCROLLBAR_POINTER_LEAVE', axis: 'x' });
      expect(api.shouldShowScrollbars()).toBe(false);
    });
  });
});

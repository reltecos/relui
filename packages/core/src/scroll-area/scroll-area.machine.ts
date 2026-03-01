/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * ScrollArea state machine — scroll bölgesi state yönetimi.
 *
 * Scroll pozisyonu, thumb boyut/pozisyon hesaplaması, thumb sürükleme,
 * track tıklama, scrollbar görünürlük yönetimi.
 *
 * @packageDocumentation
 */

import type {
  ScrollAreaProps,
  ScrollAreaEvent,
  ScrollAreaAPI,
  ScrollAreaType,
  ScrollAreaOrientation,
  ScrollPosition,
  ThumbInfo,
} from './scroll-area.types';

/**
 * ScrollArea state machine oluşturur.
 *
 * @param props - ScrollArea yapılandırması.
 * @returns ScrollArea API.
 */
export function createScrollArea(props: ScrollAreaProps = {}): ScrollAreaAPI {
  // ── State ──────────────────────────────────────────────────────────
  let type: ScrollAreaType = props.type ?? 'hover';
  let orientation: ScrollAreaOrientation = props.orientation ?? 'vertical';
  const minThumbSize = props.minThumbSize ?? 20;

  let scrollLeft = 0;
  let scrollTop = 0;

  let viewportWidth = 0;
  let viewportHeight = 0;
  let contentWidth = 0;
  let contentHeight = 0;

  let hovered = false;
  let scrollbarHoveredX = false;
  let scrollbarHoveredY = false;

  let dragging = false;
  let dragAxis: 'x' | 'y' | null = null;
  let dragStartPointerPos = 0;
  let dragStartScrollPos = 0;

  // ── Thumb hesaplamaları ────────────────────────────────────────────

  function computeThumb(
    vpSize: number,
    contentSize: number,
    scrollPos: number,
  ): ThumbInfo {
    if (contentSize <= vpSize || contentSize === 0) {
      return { size: 1, position: 0 };
    }

    const rawSize = vpSize / contentSize;
    const size = Math.max(rawSize, minThumbSize / vpSize);
    const maxScroll = contentSize - vpSize;
    const scrollRatio = maxScroll > 0 ? scrollPos / maxScroll : 0;
    const position = scrollRatio * (1 - size);

    return { size, position };
  }

  // ── Visibility hesaplamaları ───────────────────────────────────────

  function canScrollVertical(): boolean {
    return contentHeight > viewportHeight;
  }

  function canScrollHorizontal(): boolean {
    return contentWidth > viewportWidth;
  }

  function isVerticalVisible(): boolean {
    if (orientation === 'horizontal') return false;
    return canScrollVertical();
  }

  function isHorizontalVisible(): boolean {
    if (orientation === 'vertical') return false;
    return canScrollHorizontal();
  }

  function shouldShowScrollbars(): boolean {
    switch (type) {
      case 'always':
        return true;
      case 'hover':
        return hovered || scrollbarHoveredX || scrollbarHoveredY || dragging;
      case 'scroll':
        return dragging;
      case 'auto':
        return canScrollVertical() || canScrollHorizontal();
      default:
        return false;
    }
  }

  // ── Track click → scroll pozisyonu ─────────────────────────────────

  function getScrollFromTrackClick(
    axis: 'x' | 'y',
    clickPos: number,
    trackSize: number,
  ): number {
    if (trackSize === 0) return 0;

    const ratio = clickPos / trackSize;

    if (axis === 'y') {
      const maxScroll = contentHeight - viewportHeight;
      return Math.max(0, Math.min(maxScroll, ratio * maxScroll));
    } else {
      const maxScroll = contentWidth - viewportWidth;
      return Math.max(0, Math.min(maxScroll, ratio * maxScroll));
    }
  }

  // ── Thumb drag → scroll pozisyonu ──────────────────────────────────

  function getScrollFromThumbDrag(): ScrollPosition | null {
    if (!dragging || dragAxis === null) return null;
    return { scrollLeft, scrollTop };
  }

  // ── Event handler ──────────────────────────────────────────────────

  function send(event: ScrollAreaEvent): void {
    switch (event.type) {
      case 'SCROLL':
        scrollLeft = event.scrollLeft;
        scrollTop = event.scrollTop;
        break;

      case 'RESIZE':
        viewportWidth = event.dimensions.viewportWidth;
        viewportHeight = event.dimensions.viewportHeight;
        contentWidth = event.dimensions.contentWidth;
        contentHeight = event.dimensions.contentHeight;
        break;

      case 'POINTER_ENTER':
        hovered = true;
        break;

      case 'POINTER_LEAVE':
        hovered = false;
        break;

      case 'SCROLLBAR_POINTER_ENTER':
        if (event.axis === 'x') scrollbarHoveredX = true;
        else scrollbarHoveredY = true;
        break;

      case 'SCROLLBAR_POINTER_LEAVE':
        if (event.axis === 'x') scrollbarHoveredX = false;
        else scrollbarHoveredY = false;
        break;

      case 'THUMB_POINTER_DOWN': {
        dragging = true;
        dragAxis = event.axis;
        dragStartPointerPos = event.pointerPos;
        dragStartScrollPos = event.axis === 'y' ? scrollTop : scrollLeft;
        break;
      }

      case 'THUMB_POINTER_MOVE': {
        if (!dragging || dragAxis === null) break;

        const delta = event.pointerPos - dragStartPointerPos;

        if (dragAxis === 'y') {
          const trackHeight = viewportHeight;
          const thumb = computeThumb(viewportHeight, contentHeight, scrollTop);
          const thumbPx = thumb.size * trackHeight;
          const availableTrack = trackHeight - thumbPx;
          if (availableTrack <= 0) break;

          const maxScroll = contentHeight - viewportHeight;
          const scrollDelta = (delta / availableTrack) * maxScroll;
          scrollTop = Math.max(
            0,
            Math.min(maxScroll, dragStartScrollPos + scrollDelta),
          );
        } else {
          const trackWidth = viewportWidth;
          const thumb = computeThumb(viewportWidth, contentWidth, scrollLeft);
          const thumbPx = thumb.size * trackWidth;
          const availableTrack = trackWidth - thumbPx;
          if (availableTrack <= 0) break;

          const maxScroll = contentWidth - viewportWidth;
          const scrollDelta = (delta / availableTrack) * maxScroll;
          scrollLeft = Math.max(
            0,
            Math.min(maxScroll, dragStartScrollPos + scrollDelta),
          );
        }
        break;
      }

      case 'THUMB_POINTER_UP':
        dragging = false;
        dragAxis = null;
        break;

      case 'TRACK_CLICK': {
        if (event.axis === 'y') {
          scrollTop = getScrollFromTrackClick('y', event.clickPos, event.trackSize);
        } else {
          scrollLeft = getScrollFromTrackClick('x', event.clickPos, event.trackSize);
        }
        break;
      }

      case 'SET_TYPE':
        type = event.value;
        break;

      case 'SET_ORIENTATION':
        orientation = event.value;
        break;
    }
  }

  // ── Public API ─────────────────────────────────────────────────────

  return {
    getScrollPosition: () => ({ scrollLeft, scrollTop }),
    getDimensions: () => ({
      viewportWidth,
      viewportHeight,
      contentWidth,
      contentHeight,
    }),
    getVerticalThumb: () =>
      computeThumb(viewportHeight, contentHeight, scrollTop),
    getHorizontalThumb: () =>
      computeThumb(viewportWidth, contentWidth, scrollLeft),
    isVerticalVisible,
    isHorizontalVisible,
    shouldShowScrollbars,
    isHovered: () => hovered,
    isDragging: () => dragging,
    getDragAxis: () => dragAxis,
    getScrollFromThumbDrag,
    getScrollFromTrackClick,
    send,
    getType: () => type,
    getOrientation: () => orientation,
  };
}

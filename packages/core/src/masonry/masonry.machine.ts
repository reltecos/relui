/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Masonry state machine — Pinterest tarzı grid layout hesaplaması.
 *
 * Item'ları en kısa kolona yerleştirerek masonry layout oluşturur.
 *
 * @packageDocumentation
 */

import type {
  MasonryProps,
  MasonryEvent,
  MasonryAPI,
  MasonryItemPosition,
} from './masonry.types';

/**
 * Masonry state machine oluşturur.
 *
 * @param props - Masonry yapılandırması.
 * @returns Masonry API.
 */
export function createMasonry(props: MasonryProps = {}): MasonryAPI {
  let columns = props.columns ?? 3;
  let gap = props.gap ?? 16;
  let rowGap = props.rowGap ?? gap;
  let containerWidth = props.containerWidth ?? 0;
  let itemHeights: number[] = [];

  function computePositions(): MasonryItemPosition[] {
    if (columns <= 0 || containerWidth <= 0 || itemHeights.length === 0) {
      return [];
    }

    const totalGapWidth = gap * (columns - 1);
    const columnWidth = (containerWidth - totalGapWidth) / columns;
    const columnHeights = new Array(columns).fill(0) as number[];
    const positions: MasonryItemPosition[] = [];

    for (let i = 0; i < itemHeights.length; i++) {
      // En kısa kolonu bul
      let shortestCol = 0;
      for (let c = 1; c < columns; c++) {
        if ((columnHeights[c] as number) < (columnHeights[shortestCol] as number)) {
          shortestCol = c;
        }
      }

      const left = shortestCol * (columnWidth + gap);
      const top = columnHeights[shortestCol] as number;

      positions.push({
        column: shortestCol,
        top,
        left,
        width: columnWidth,
      });

      columnHeights[shortestCol] = top + (itemHeights[i] as number) + rowGap;
    }

    return positions;
  }

  function getTotalHeight(): number {
    if (columns <= 0 || containerWidth <= 0 || itemHeights.length === 0) {
      return 0;
    }

    const columnHeights = new Array(columns).fill(0) as number[];

    for (let i = 0; i < itemHeights.length; i++) {
      let shortestCol = 0;
      for (let c = 1; c < columns; c++) {
        if ((columnHeights[c] as number) < (columnHeights[shortestCol] as number)) {
          shortestCol = c;
        }
      }
      columnHeights[shortestCol] = (columnHeights[shortestCol] as number) + (itemHeights[i] as number) + rowGap;
    }

    // En uzun kolon - son item'ın rowGap'i
    let maxHeight = 0;
    for (let c = 0; c < columns; c++) {
      const h = columnHeights[c] as number;
      if (h > maxHeight) {
        maxHeight = h;
      }
    }

    return maxHeight > 0 ? maxHeight - rowGap : 0;
  }

  function send(event: MasonryEvent): void {
    switch (event.type) {
      case 'SET_ITEMS':
        itemHeights = event.heights;
        break;
      case 'SET_COLUMNS':
        columns = Math.max(1, event.value);
        break;
      case 'SET_GAP':
        gap = event.value;
        rowGap = props.rowGap ?? event.value;
        break;
      case 'SET_CONTAINER_WIDTH':
        containerWidth = event.value;
        break;
    }
  }

  return {
    getPositions: computePositions,
    getTotalHeight,
    getColumns: () => columns,
    getGap: () => gap,
    send,
  };
}

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * TileLayout state machine — grid tabanlı panel yerleşimi yönetimi.
 *
 * Tile ekleme, kaldırma, taşıma, boyutlandırma ve sıralama yönetir.
 *
 * @packageDocumentation
 */

import type {
  TileLayoutProps,
  TileLayoutEvent,
  TileLayoutAPI,
  TileItem,
} from './tile-layout.types';

/**
 * TileLayout state machine oluşturur.
 *
 * @param props - TileLayout yapılandırması.
 * @returns TileLayout API.
 */
export function createTileLayout(props: TileLayoutProps = {}): TileLayoutAPI {
  let columns = props.columns ?? 3;
  let rowHeight = props.rowHeight ?? 200;
  let gap = props.gap ?? 8;
  let tiles: TileItem[] = props.tiles ? props.tiles.map((t) => ({ ...t })) : [];

  function getTotalRows(): number {
    if (tiles.length === 0) return 0;
    let maxRow = 0;
    for (const tile of tiles) {
      const endRow = tile.row + (tile.rowSpan ?? 1);
      if (endRow > maxRow) maxRow = endRow;
    }
    return maxRow;
  }

  function send(event: TileLayoutEvent): void {
    switch (event.type) {
      case 'ADD_TILE': {
        // Duplicate id kontrolü
        if (tiles.some((t) => t.id === event.tile.id)) break;
        tiles.push({ ...event.tile });
        break;
      }

      case 'REMOVE_TILE': {
        tiles = tiles.filter((t) => t.id !== event.id);
        break;
      }

      case 'MOVE_TILE': {
        const tile = tiles.find((t) => t.id === event.id);
        if (!tile) break;
        tile.row = Math.max(0, event.row);
        tile.col = Math.max(0, Math.min(columns - 1, event.col));
        break;
      }

      case 'RESIZE_TILE': {
        const tile = tiles.find((t) => t.id === event.id);
        if (!tile) break;
        tile.rowSpan = Math.max(1, event.rowSpan);
        tile.colSpan = Math.max(1, Math.min(columns - tile.col, event.colSpan));
        break;
      }

      case 'SET_COLUMNS': {
        columns = Math.max(1, event.value);
        // col + colSpan'ı sınırla
        for (const tile of tiles) {
          if (tile.col >= columns) tile.col = columns - 1;
          const span = tile.colSpan ?? 1;
          if (tile.col + span > columns) {
            tile.colSpan = columns - tile.col;
          }
        }
        break;
      }

      case 'SET_ROW_HEIGHT': {
        rowHeight = Math.max(1, event.value);
        break;
      }

      case 'SET_GAP': {
        gap = Math.max(0, event.value);
        break;
      }

      case 'REORDER': {
        const orderedTiles: TileItem[] = [];
        for (const id of event.orderedIds) {
          const tile = tiles.find((t) => t.id === id);
          if (tile) orderedTiles.push(tile);
        }
        // Listede olmayan tile'ları sona ekle
        for (const tile of tiles) {
          if (!orderedTiles.includes(tile)) orderedTiles.push(tile);
        }
        tiles = orderedTiles;
        break;
      }
    }
  }

  return {
    getTiles: () => tiles.map((t) => ({ ...t })),
    getTile: (id: string) => {
      const t = tiles.find((tile) => tile.id === id);
      return t ? { ...t } : undefined;
    },
    getColumns: () => columns,
    getRowHeight: () => rowHeight,
    getGap: () => gap,
    getTotalRows,
    send,
  };
}

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * TileLayout — grid tabanlı panel yerleşimi bileşeni.
 *
 * CSS Grid ile tile'ları satır/kolon/span bazlı konumlandırır.
 *
 * @packageDocumentation
 */

import {
  forwardRef,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { createTileLayout } from '@relteco/relui-core';
import type { TileLayoutAPI, TileItem } from '@relteco/relui-core';
import { getSlotProps, type SlotStyleProps } from '../utils';

/** TileLayout slot isimleri. */
export type TileLayoutSlot = 'root' | 'tile';

/** TileLayout bileşen prop'ları. */
export interface TileLayoutComponentProps
  extends SlotStyleProps<TileLayoutSlot>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Root element inline style. */
  style?: CSSProperties;
  /** Grid kolon sayısı. Varsayılan: 3. */
  columns?: number;
  /** Satır yüksekliği (px). Varsayılan: 200. */
  rowHeight?: number;
  /** Tile arası boşluk (px). Varsayılan: 8. */
  gap?: number;
  /** Başlangıç tile listesi. */
  tiles?: TileItem[];
  /** Tile render fonksiyonu. */
  renderTile: (tile: TileItem) => ReactNode;
  /** Tile kaldırıldığında çağrılır. */
  onTileRemove?: (id: string) => void;
  /** Tile taşındığında çağrılır. */
  onTileMove?: (id: string, row: number, col: number) => void;
  /** Tile boyutu değiştiğinde çağrılır. */
  onTileResize?: (id: string, rowSpan: number, colSpan: number) => void;
}

/**
 * TileLayout — grid tabanlı panel yerleşimi.
 *
 * @example
 * ```tsx
 * <TileLayout
 *   columns={3}
 *   tiles={[{ id: 'a', row: 0, col: 0 }, { id: 'b', row: 0, col: 1, colSpan: 2 }]}
 *   renderTile={(tile) => <div>{tile.id}</div>}
 * />
 * ```
 */
export const TileLayout = forwardRef<HTMLDivElement, TileLayoutComponentProps>(
  function TileLayout(props, ref) {
    const {
      children: _children,
      className,
      style,
      classNames,
      styles: slotStyles,
      columns = 3,
      rowHeight = 200,
      gap = 8,
      tiles,
      renderTile,
      onTileRemove: _onTileRemove,
      onTileMove: _onTileMove,
      onTileResize: _onTileResize,
      ...rest
    } = props;

    const apiRef = useRef<TileLayoutAPI | null>(null);
    if (apiRef.current === null) {
      apiRef.current = createTileLayout({ columns, rowHeight, gap, tiles });
    }
    const api = apiRef.current;

    // ── State ─────────────────────────────────────────
    const currentTiles = api.getTiles();
    const currentColumns = api.getColumns();
    const currentRowHeight = api.getRowHeight();
    const currentGap = api.getGap();
    const totalRows = api.getTotalRows();

    // ── Slot props ────────────────────────────────────
    const rootSlot = getSlotProps(
      'root',
      undefined,
      classNames,
      slotStyles,
      {
        display: 'grid',
        gridTemplateColumns: `repeat(${currentColumns}, 1fr)`,
        gridAutoRows: currentRowHeight,
        gap: currentGap,
        ...style,
      },
    );

    const finalClass = [rootSlot.className, className].filter(Boolean).join(' ') || undefined;

    return (
      <div
        ref={ref}
        {...rest}
        className={finalClass}
        style={rootSlot.style}
        data-columns={currentColumns}
        data-total-rows={totalRows}
        data-tile-layout
      >
        {currentTiles.map((tile) => {
          const tileSlot = getSlotProps('tile', undefined, classNames, slotStyles, {
            gridRow: `${tile.row + 1} / span ${tile.rowSpan ?? 1}`,
            gridColumn: `${tile.col + 1} / span ${tile.colSpan ?? 1}`,
          });

          return (
            <div
              key={tile.id}
              className={tileSlot.className || undefined}
              style={tileSlot.style}
              data-tile-id={tile.id}
            >
              {renderTile(tile)}
            </div>
          );
        })}
      </div>
    );
  },
);

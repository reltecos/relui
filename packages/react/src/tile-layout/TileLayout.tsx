/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * TileLayout — grid tabanli panel yerlestirme bilesen (Dual API).
 *
 * Props-based: `<TileLayout tiles={[...]} renderTile={...} />`
 * Compound:    `<TileLayout columns={3}><TileLayout.Tile row={0} col={0}>...</TileLayout.Tile></TileLayout>`
 *
 * @packageDocumentation
 */

import {
  forwardRef,
  createContext,
  useContext,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { createTileLayout } from '@relteco/relui-core';
import type { TileLayoutAPI, TileItem } from '@relteco/relui-core';
import { rootStyle, tileStyle } from './tile-layout.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

/** TileLayout slot isimleri. */
export type TileLayoutSlot = 'root' | 'tile';

// ── Context (Compound API) ──────────────────────────

interface TileLayoutContextValue {
  classNames: ClassNames<TileLayoutSlot> | undefined;
  styles: Styles<TileLayoutSlot> | undefined;
}

const TileLayoutContext = createContext<TileLayoutContextValue | null>(null);

function useTileLayoutContext(): TileLayoutContextValue {
  const ctx = useContext(TileLayoutContext);
  if (!ctx) throw new Error('TileLayout compound sub-components must be used within <TileLayout>.');
  return ctx;
}

// ── Compound: TileLayout.Tile ───────────────────────

/** TileLayout.Tile props */
export interface TileLayoutTileProps {
  /** Grid satiri (0-based) / Grid row (0-based) */
  row: number;
  /** Grid kolonu (0-based) / Grid column (0-based) */
  col: number;
  /** Satir span / Row span */
  rowSpan?: number;
  /** Kolon span / Column span */
  colSpan?: number;
  /** Tile ID */
  id?: string;
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const TileLayoutTile = forwardRef<HTMLDivElement, TileLayoutTileProps>(
  function TileLayoutTile(props, ref) {
    const { row, col, rowSpan = 1, colSpan = 1, id, children, className } = props;
    const ctx = useTileLayoutContext();
    const slot = getSlotProps('tile', tileStyle, ctx.classNames, ctx.styles, {
      gridRow: `${row + 1} / span ${rowSpan}`,
      gridColumn: `${col + 1} / span ${colSpan}`,
    });
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div
        ref={ref}
        className={cls || undefined}
        style={slot.style}
        data-tile-id={id}
        data-testid="tile-layout-tile"
      >
        {children}
      </div>
    );
  },
);

// ── Component Props ───────────────────────────────────

/** TileLayout bilesen prop'lari. */
export interface TileLayoutComponentProps
  extends SlotStyleProps<TileLayoutSlot>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Root element inline style. */
  style?: CSSProperties;
  /** Grid kolon sayisi. Varsayilan: 3. */
  columns?: number;
  /** Satir yuksekligi (px). Varsayilan: 200. */
  rowHeight?: number;
  /** Tile arasi bosluk (px). Varsayilan: 8. */
  gap?: number;
  /** Baslangic tile listesi. */
  tiles?: TileItem[];
  /** Tile render fonksiyonu. */
  renderTile?: (tile: TileItem) => ReactNode;
  /** Tile kaldirildiginda cagrilir. */
  onTileRemove?: (id: string) => void;
  /** Tile tasindiginda cagrilir. */
  onTileMove?: (id: string, row: number, col: number) => void;
  /** Tile boyutu degistiginde cagrilir. */
  onTileResize?: (id: string, rowSpan: number, colSpan: number) => void;
  /** Compound API icin children */
  children?: ReactNode;
}

// ── Component ─────────────────────────────────────────

const TileLayoutBase = forwardRef<HTMLDivElement, TileLayoutComponentProps>(
  function TileLayout(props, ref) {
    const {
      children,
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
    const rootSlot = getSlotProps('root', rootStyle, classNames, slotStyles, {
      gridTemplateColumns: `repeat(${currentColumns}, 1fr)`,
      gridAutoRows: currentRowHeight,
      gap: currentGap,
      ...style,
    });

    const finalClass = [rootSlot.className, className].filter(Boolean).join(' ') || undefined;

    const ctxValue: TileLayoutContextValue = {
      classNames,
      styles: slotStyles,
    };

    // ── Compound API ──
    if (children) {
      return (
        <TileLayoutContext.Provider value={ctxValue}>
          <div
            ref={ref}
            {...rest}
            className={finalClass}
            style={rootSlot.style}
            data-columns={currentColumns}
            data-total-rows={totalRows}
            data-tile-layout
          >
            {children}
          </div>
        </TileLayoutContext.Provider>
      );
    }

    // ── Props-based API ──
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
          const tileSlotResult = getSlotProps('tile', tileStyle, classNames, slotStyles, {
            gridRow: `${tile.row + 1} / span ${tile.rowSpan ?? 1}`,
            gridColumn: `${tile.col + 1} / span ${tile.colSpan ?? 1}`,
          });

          return (
            <div
              key={tile.id}
              className={tileSlotResult.className || undefined}
              style={tileSlotResult.style}
              data-tile-id={tile.id}
            >
              {renderTile ? renderTile(tile) : null}
            </div>
          );
        })}
      </div>
    );
  },
);

/**
 * TileLayout bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <TileLayout columns={3} tiles={[...]} renderTile={(tile) => <div>{tile.id}</div>} />
 * ```
 *
 * @example Compound
 * ```tsx
 * <TileLayout columns={3}>
 *   <TileLayout.Tile row={0} col={0}>Tile A</TileLayout.Tile>
 *   <TileLayout.Tile row={0} col={1} colSpan={2}>Tile B</TileLayout.Tile>
 * </TileLayout>
 * ```
 */
export const TileLayout = Object.assign(TileLayoutBase, {
  Tile: TileLayoutTile,
});

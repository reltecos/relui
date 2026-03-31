/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * TransferList — iki liste arasi tasima bilesen (Dual API).
 * TransferList — two-list transfer component (Dual API).
 *
 * Props-based: `<TransferList items={data} defaultTargetIds={['a']} />`
 * Compound:    `<TransferList items={data}><TransferList.SourceList /><TransferList.Actions /><TransferList.TargetList /></TransferList>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, useCallback, useMemo, type ReactNode } from 'react';
import { ChevronRightIcon, ChevronLeftIcon } from '@relteco/relui-icons';
import type { TransferItemDef } from '@relteco/relui-core';
import {
  rootStyle, listPanelStyle, searchInputStyle, listContainerStyle,
  itemStyle, actionsStyle, actionButtonStyle,
} from './transfer-list.css';
import { useTransferList, type UseTransferListProps } from './useTransferList';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** TransferList slot isimleri / TransferList slot names. */
export type TransferListSlot = 'root' | 'sourceList' | 'targetList' | 'actions' | 'item' | 'searchInput';

// ── Context ───────────────────────────────────────────

interface TransferListContextValue {
  items: TransferItemDef[];
  sourceIds: ReadonlySet<string>;
  targetIds: ReadonlySet<string>;
  selectedSourceIds: ReadonlySet<string>;
  selectedTargetIds: ReadonlySet<string>;
  filterSource: string;
  filterTarget: string;
  onToggleSource: (id: string) => void;
  onToggleTarget: (id: string) => void;
  onMoveRight: () => void;
  onMoveLeft: () => void;
  onMoveAllRight: () => void;
  onMoveAllLeft: () => void;
  onFilterSource: (v: string) => void;
  onFilterTarget: (v: string) => void;
  classNames: ClassNames<TransferListSlot> | undefined;
  styles: Styles<TransferListSlot> | undefined;
}

const TransferListContext = createContext<TransferListContextValue | null>(null);

function useTransferListContext(): TransferListContextValue {
  const ctx = useContext(TransferListContext);
  if (!ctx) throw new Error('TransferList compound sub-components must be used within <TransferList>.');
  return ctx;
}

// ── Helpers ───────────────────────────────────────────

function filterItems(items: TransferItemDef[], ids: ReadonlySet<string>, filter: string): TransferItemDef[] {
  const lc = filter.toLowerCase();
  return items.filter((it) => ids.has(it.id) && (!lc || it.label.toLowerCase().includes(lc)));
}

// ── Compound: TransferList.SourceList ─────────────────

/** TransferList.SourceList props */
export interface TransferListSourceListProps {
  /** Ek className / Additional className */
  className?: string;
}

const SourceList = forwardRef<HTMLDivElement, TransferListSourceListProps>(
  function TransferListSourceList(props, ref) {
    const { className } = props;
    const ctx = useTransferListContext();
    const slot = getSlotProps('sourceList', listPanelStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const searchSlot = getSlotProps('searchInput', searchInputStyle, ctx.classNames, ctx.styles);
    const itemSlotBase = getSlotProps('item', itemStyle, ctx.classNames, ctx.styles);

    const visible = useMemo(
      () => filterItems(ctx.items, ctx.sourceIds, ctx.filterSource),
      [ctx.items, ctx.sourceIds, ctx.filterSource],
    );

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="transferlist-sourceList">
        <input
          className={searchSlot.className}
          style={searchSlot.style}
          placeholder="Ara..."
          value={ctx.filterSource}
          onChange={(e) => ctx.onFilterSource(e.target.value)}
          data-testid="transferlist-searchInput"
          aria-label="Filter source"
        />
        <ul className={listContainerStyle} role="listbox" aria-label="Source list">
          {visible.map((it) => {
            const selected = ctx.selectedSourceIds.has(it.id);
            return (
              <li
                key={it.id}
                className={itemSlotBase.className}
                style={itemSlotBase.style}
                role="option"
                aria-selected={selected}
                data-disabled={it.disabled || undefined}
                data-testid="transferlist-item"
                onClick={() => !it.disabled && ctx.onToggleSource(it.id)}
              >
                {it.label}
              </li>
            );
          })}
        </ul>
      </div>
    );
  },
);

// ── Compound: TransferList.TargetList ─────────────────

/** TransferList.TargetList props */
export interface TransferListTargetListProps {
  /** Ek className / Additional className */
  className?: string;
}

const TargetList = forwardRef<HTMLDivElement, TransferListTargetListProps>(
  function TransferListTargetList(props, ref) {
    const { className } = props;
    const ctx = useTransferListContext();
    const slot = getSlotProps('targetList', listPanelStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const searchSlot = getSlotProps('searchInput', searchInputStyle, ctx.classNames, ctx.styles);
    const itemSlotBase = getSlotProps('item', itemStyle, ctx.classNames, ctx.styles);

    const visible = useMemo(
      () => filterItems(ctx.items, ctx.targetIds, ctx.filterTarget),
      [ctx.items, ctx.targetIds, ctx.filterTarget],
    );

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="transferlist-targetList">
        <input
          className={searchSlot.className}
          style={searchSlot.style}
          placeholder="Ara..."
          value={ctx.filterTarget}
          onChange={(e) => ctx.onFilterTarget(e.target.value)}
          data-testid="transferlist-searchInput"
          aria-label="Filter target"
        />
        <ul className={listContainerStyle} role="listbox" aria-label="Target list">
          {visible.map((it) => {
            const selected = ctx.selectedTargetIds.has(it.id);
            return (
              <li
                key={it.id}
                className={itemSlotBase.className}
                style={itemSlotBase.style}
                role="option"
                aria-selected={selected}
                data-disabled={it.disabled || undefined}
                data-testid="transferlist-item"
                onClick={() => !it.disabled && ctx.onToggleTarget(it.id)}
              >
                {it.label}
              </li>
            );
          })}
        </ul>
      </div>
    );
  },
);

// ── Compound: TransferList.Actions ────────────────────

/** TransferList.Actions props */
export interface TransferListActionsProps {
  /** Ek className / Additional className */
  className?: string;
}

const Actions = forwardRef<HTMLDivElement, TransferListActionsProps>(
  function TransferListActions(props, ref) {
    const { className } = props;
    const ctx = useTransferListContext();
    const slot = getSlotProps('actions', actionsStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="transferlist-actions">
        <button
          type="button"
          className={actionButtonStyle}
          onClick={ctx.onMoveAllRight}
          disabled={ctx.sourceIds.size === 0}
          aria-label="Move all right"
          data-testid="transferlist-move-all-right"
        >
          <ChevronRightIcon size={14} />
          <ChevronRightIcon size={14} />
        </button>
        <button
          type="button"
          className={actionButtonStyle}
          onClick={ctx.onMoveRight}
          disabled={ctx.selectedSourceIds.size === 0}
          aria-label="Move selected right"
          data-testid="transferlist-move-right"
        >
          <ChevronRightIcon size={14} />
        </button>
        <button
          type="button"
          className={actionButtonStyle}
          onClick={ctx.onMoveLeft}
          disabled={ctx.selectedTargetIds.size === 0}
          aria-label="Move selected left"
          data-testid="transferlist-move-left"
        >
          <ChevronLeftIcon size={14} />
        </button>
        <button
          type="button"
          className={actionButtonStyle}
          onClick={ctx.onMoveAllLeft}
          disabled={ctx.targetIds.size === 0}
          aria-label="Move all left"
          data-testid="transferlist-move-all-left"
        >
          <ChevronLeftIcon size={14} />
          <ChevronLeftIcon size={14} />
        </button>
      </div>
    );
  },
);

// ── Component Props ───────────────────────────────────

export interface TransferListComponentProps extends SlotStyleProps<TransferListSlot> {
  /** Oge listesi / Item list */
  items: TransferItemDef[];
  /** Baslangicta hedef taraftaki id ler / Default target IDs */
  defaultTargetIds?: string[];
  /** Kaynak degisince / On source change */
  onSourceChange?: (ids: string[]) => void;
  /** Hedef degisince / On target change */
  onTargetChange?: (ids: string[]) => void;
  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────

const TransferListBase = forwardRef<HTMLDivElement, TransferListComponentProps>(
  function TransferList(props, ref) {
    const {
      items,
      defaultTargetIds,
      onSourceChange,
      onTargetChange,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const hookProps: UseTransferListProps = {
      allIds: items.map((it) => it.id),
      defaultTargetIds,
      onSourceChange,
      onTargetChange,
    };

    const { context, send } = useTransferList(hookProps);

    const onToggleSource = useCallback((id: string) => send({ type: 'TOGGLE_SOURCE', itemId: id }), [send]);
    const onToggleTarget = useCallback((id: string) => send({ type: 'TOGGLE_TARGET', itemId: id }), [send]);
    const onMoveRight = useCallback(() => send({ type: 'MOVE_RIGHT' }), [send]);
    const onMoveLeft = useCallback(() => send({ type: 'MOVE_LEFT' }), [send]);
    const onMoveAllRight = useCallback(() => send({ type: 'MOVE_ALL_RIGHT' }), [send]);
    const onMoveAllLeft = useCallback(() => send({ type: 'MOVE_ALL_LEFT' }), [send]);
    const onFilterSource = useCallback((v: string) => send({ type: 'SET_FILTER_SOURCE', value: v }), [send]);
    const onFilterTarget = useCallback((v: string) => send({ type: 'SET_FILTER_TARGET', value: v }), [send]);

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootClassName = className ? `${rootSlot.className} ${className}` : rootSlot.className;

    const ctxValue: TransferListContextValue = {
      items,
      sourceIds: context.sourceIds,
      targetIds: context.targetIds,
      selectedSourceIds: context.selectedSourceIds,
      selectedTargetIds: context.selectedTargetIds,
      filterSource: context.filterSource,
      filterTarget: context.filterTarget,
      onToggleSource,
      onToggleTarget,
      onMoveRight,
      onMoveLeft,
      onMoveAllRight,
      onMoveAllLeft,
      onFilterSource,
      onFilterTarget,
      classNames,
      styles,
    };

    // ── Compound API ──
    if (children) {
      return (
        <TransferListContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={rootClassName}
            style={{ ...rootSlot.style, ...styleProp }}
            data-testid="transferlist-root"
          >
            {children}
          </div>
        </TransferListContext.Provider>
      );
    }

    // ── Props-based API ──
    return (
      <TransferListContext.Provider value={ctxValue}>
        <div
          ref={ref}
          className={rootClassName}
          style={{ ...rootSlot.style, ...styleProp }}
          data-testid="transferlist-root"
        >
          <SourceList />
          <Actions />
          <TargetList />
        </div>
      </TransferListContext.Provider>
    );
  },
);

/**
 * TransferList bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <TransferList items={data} defaultTargetIds={['a']} />
 * ```
 *
 * @example Compound
 * ```tsx
 * <TransferList items={data}>
 *   <TransferList.SourceList />
 *   <TransferList.Actions />
 *   <TransferList.TargetList />
 * </TransferList>
 * ```
 */
export const TransferList = Object.assign(TransferListBase, {
  SourceList,
  Actions,
  TargetList,
});

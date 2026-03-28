/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * MasterDetailLayout — liste + detay yan yana layout bileseni (Dual API).
 *
 * Props-based: `<MasterDetailLayout master={<List />} detail={<Detail />} />`
 * Compound:    `<MasterDetail><MasterDetail.Master>...</MasterDetail.Master><MasterDetail.Detail>...</MasterDetail.Detail></MasterDetail>`
 *
 * @packageDocumentation
 */

import React, {
  forwardRef,
  useRef,
  useEffect,
  useReducer,
  createContext,
  useContext,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { createMasterDetail } from '@relteco/relui-core';
import type { MasterDetailAPI, MasterPosition, DetailVisibility } from '@relteco/relui-core';
import { getSlotProps, type SlotStyleProps } from '../utils';
import type { ClassNames, Styles } from '../utils/slot-styles';
import {
  rootStyle,
  masterStyle,
  detailStyle,
  collapseButtonStyle,
} from './master-detail.css';

/** MasterDetailLayout slot isimleri. */
export type MasterDetailSlot = 'root' | 'master' | 'detail' | 'collapseButton';

// ── Context (Compound API) ──────────────────────────

interface MasterDetailContextValue {
  classNames: ClassNames<MasterDetailSlot> | undefined;
  styles: Styles<MasterDetailSlot> | undefined;
  masterPosition: MasterPosition;
  currentCollapsed: boolean;
  currentSize: number | string;
  detailVisible: boolean;
  horizontal: boolean;
}

const MasterDetailContext = createContext<MasterDetailContextValue | null>(null);

/** MasterDetail compound context hook. */
export function useMasterDetailContext(): MasterDetailContextValue {
  const ctx = useContext(MasterDetailContext);
  if (!ctx) throw new Error('MasterDetail compound sub-components must be used within <MasterDetailLayout>.');
  return ctx;
}

// ── Compound: MasterDetail.Master ────────────────────

/** MasterDetail.Master props */
export interface MasterDetailMasterProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const MasterDetailMaster = forwardRef<HTMLDivElement, MasterDetailMasterProps>(
  function MasterDetailMaster(props, ref) {
    const { children, className } = props;
    const ctx = useMasterDetailContext();

    const sizeValue = typeof ctx.currentSize === 'number' ? `${ctx.currentSize}px` : ctx.currentSize;
    const masterSlot = getSlotProps('master', masterStyle, ctx.classNames, ctx.styles, {
      [ctx.horizontal ? 'width' : 'height']: ctx.currentCollapsed ? 0 : sizeValue,
    });
    const cls = className ? `${masterSlot.className} ${className}` : masterSlot.className;

    return (
      <div
        ref={ref}
        className={cls}
        style={masterSlot.style}
        data-panel="master"
        data-testid="master-detail-master"
        data-collapsed={ctx.currentCollapsed || undefined}
      >
        {children}
      </div>
    );
  },
);

// ── Compound: MasterDetail.Detail ────────────────────

/** MasterDetail.Detail props */
export interface MasterDetailDetailProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const MasterDetailDetail = forwardRef<HTMLDivElement, MasterDetailDetailProps>(
  function MasterDetailDetail(props, ref) {
    const { children, className } = props;
    const ctx = useMasterDetailContext();

    const detailSlot = getSlotProps('detail', detailStyle, ctx.classNames, ctx.styles, {
      display: ctx.detailVisible ? undefined : 'none',
    });
    const cls = className ? `${detailSlot.className} ${className}` : detailSlot.className;

    return (
      <div
        ref={ref}
        className={cls}
        style={detailSlot.style}
        data-panel="detail"
        data-testid="master-detail-detail"
      >
        {children}
      </div>
    );
  },
);

/** MasterDetailLayout bilesen prop'lari. */
export interface MasterDetailComponentProps
  extends SlotStyleProps<MasterDetailSlot>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Root element inline style. */
  style?: CSSProperties;
  /** Master panel pozisyonu. Varsayilan: 'left'. */
  masterPosition?: MasterPosition;
  /** Master panel boyutu (px veya CSS string). Varsayilan: 300. */
  masterSize?: number | string;
  /** Detail panel gorunurluk modu. Varsayilan: 'always'. */
  detailVisibility?: DetailVisibility;
  /** Secili item ID. */
  selectedId?: string | null;
  /** Master panel daraltilabilir mi. Varsayilan: false. */
  collapsible?: boolean;
  /** Master panel daraltilmis mi. */
  collapsed?: boolean;
  /** Master panelde gosterilecek icerik (props-based). */
  master?: ReactNode;
  /** Detail panelde gosterilecek icerik (props-based). */
  detail?: ReactNode;
  /** Secim degistiginde cagrilir. */
  onSelectionChange?: (id: string | null) => void;
  /** Daraltma durumu degistiginde cagrilir. */
  onCollapseChange?: (collapsed: boolean) => void;
  /** Compound API icin children. */
  children?: ReactNode;
}

/** Yon horizontal mi kontrol et. */
function isHorizontal(pos: MasterPosition): boolean {
  return pos === 'left' || pos === 'right';
}

/**
 * MasterDetailLayout — liste + detay panel layout (Dual API).
 *
 * @example Props-based
 * ```tsx
 * <MasterDetailLayout master={<ItemList />} detail={<ItemDetail />} />
 * ```
 *
 * @example Compound
 * ```tsx
 * <MasterDetailLayout>
 *   <MasterDetailLayout.Master><ItemList /></MasterDetailLayout.Master>
 *   <MasterDetailLayout.Detail><ItemDetail /></MasterDetailLayout.Detail>
 * </MasterDetailLayout>
 * ```
 */
const MasterDetailBase = forwardRef<HTMLDivElement, MasterDetailComponentProps>(
  function MasterDetailLayout(props, ref) {
    const {
      className,
      style,
      classNames,
      styles: slotStyles,
      masterPosition = 'left',
      masterSize = 300,
      detailVisibility = 'always',
      selectedId = null,
      collapsible = false,
      collapsed: controlledCollapsed,
      master,
      detail,
      onSelectionChange: _onSelectionChange,
      onCollapseChange,
      children,
      ...rest
    } = props;

    const apiRef = useRef<MasterDetailAPI | null>(null);
    if (apiRef.current === null) {
      apiRef.current = createMasterDetail({
        masterPosition,
        masterSize,
        detailVisibility,
        selectedId: selectedId ?? undefined,
        collapsible,
        collapsed: controlledCollapsed,
      });
    }
    const api = apiRef.current;

    const [, forceRender] = useReducer((c: number) => c + 1, 0);

    // ── Ref merge ────────────────────────────────────────

    const containerRef = useRef<HTMLDivElement | null>(null);
    const mergedRef = (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    };

    // ── Prop sync ────────────────────────────────────────

    useEffect(() => {
      api.send({ type: 'SET_MASTER_POSITION', value: masterPosition });
      forceRender();
    }, [api, masterPosition]);

    useEffect(() => {
      api.send({ type: 'SET_MASTER_SIZE', value: masterSize });
      forceRender();
    }, [api, masterSize]);

    useEffect(() => {
      if (selectedId !== null) {
        api.send({ type: 'SELECT', id: selectedId });
      } else {
        api.send({ type: 'DESELECT' });
      }
      forceRender();
    }, [api, selectedId]);

    useEffect(() => {
      if (controlledCollapsed !== undefined) {
        api.send({ type: 'SET_COLLAPSED', value: controlledCollapsed });
        forceRender();
      }
    }, [api, controlledCollapsed]);

    // ── State ────────────────────────────────────────────

    const currentPosition = api.getMasterPosition();
    const currentSize = api.getMasterSize();
    const currentCollapsed = api.isCollapsed();
    const detailVisible = api.isDetailVisible();
    const horizontal = isHorizontal(currentPosition);

    // ── Toggle collapse ──────────────────────────────────

    const handleToggleCollapse = () => {
      api.send({ type: 'TOGGLE_COLLAPSE' });
      forceRender();
      onCollapseChange?.(!currentCollapsed);
    };

    // ── Layout styles ────────────────────────────────────

    const flexDir = horizontal
      ? (currentPosition === 'right' ? 'row-reverse' : 'row')
      : (currentPosition === 'bottom' ? 'column-reverse' : 'column');

    const rootSlot = getSlotProps(
      'root',
      rootStyle,
      classNames,
      slotStyles,
      {
        flexDirection: flexDir,
        ...style,
      },
    );

    const finalClass = [rootSlot.className, className].filter(Boolean).join(' ') || undefined;

    // ── Context for compound API ─────────────────────────

    const ctxValue: MasterDetailContextValue = {
      classNames,
      styles: slotStyles,
      masterPosition: currentPosition,
      currentCollapsed,
      currentSize,
      detailVisible,
      horizontal,
    };

    // ── Collapse button ──────────────────────────────────

    const collapseSlot = getSlotProps('collapseButton', collapseButtonStyle, classNames, slotStyles);

    const collapseButton = collapsible ? (
      <button
        type="button"
        onClick={handleToggleCollapse}
        className={collapseSlot.className || undefined}
        style={collapseSlot.style}
        aria-label={currentCollapsed ? 'Expand panel' : 'Collapse panel'}
        aria-expanded={!currentCollapsed}
        data-collapse-button
        data-testid="master-detail-collapse-button"
      />
    ) : null;

    // ── Compound API ─────────────────────────────────────

    if (children) {
      return (
        <MasterDetailContext.Provider value={ctxValue}>
          <div
            ref={mergedRef}
            {...rest}
            className={finalClass}
            style={rootSlot.style}
            data-position={currentPosition}
            data-collapsed={currentCollapsed || undefined}
            data-testid="master-detail-root"
          >
            {children}
            {collapseButton}
          </div>
        </MasterDetailContext.Provider>
      );
    }

    // ── Props-based API ──────────────────────────────────

    const sizeValue = typeof currentSize === 'number' ? `${currentSize}px` : currentSize;

    const masterSlot = getSlotProps('master', masterStyle, classNames, slotStyles, {
      [horizontal ? 'width' : 'height']: currentCollapsed ? 0 : sizeValue,
    });

    const detailSlot = getSlotProps('detail', detailStyle, classNames, slotStyles, {
      display: detailVisible ? undefined : 'none',
    });

    const masterPanel = (
      <div
        className={masterSlot.className || undefined}
        style={masterSlot.style}
        data-panel="master"
        data-collapsed={currentCollapsed || undefined}
        data-testid="master-detail-master"
      >
        {master}
      </div>
    );

    const detailPanel = (
      <div
        className={detailSlot.className || undefined}
        style={detailSlot.style}
        data-panel="detail"
        data-testid="master-detail-detail"
      >
        {detail}
      </div>
    );

    return (
      <div
        ref={mergedRef}
        {...rest}
        className={finalClass}
        style={rootSlot.style}
        data-position={currentPosition}
        data-collapsed={currentCollapsed || undefined}
        data-testid="master-detail-root"
      >
        {masterPanel}
        {collapseButton}
        {detailPanel}
      </div>
    );
  },
);

/**
 * MasterDetailLayout — Dual API (props-based + compound).
 */
export const MasterDetailLayout = Object.assign(MasterDetailBase, {
  Master: MasterDetailMaster,
  Detail: MasterDetailDetail,
});

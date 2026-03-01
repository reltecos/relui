/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * MasterDetailLayout — liste + detay yan yana layout bileşeni.
 *
 * Master (liste) ve detail (içerik) panellerinden oluşur.
 * Seçim, daraltma, pozisyon ve görünürlük yönetimi sağlar.
 *
 * @packageDocumentation
 */

import React, {
  forwardRef,
  useRef,
  useEffect,
  useReducer,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { createMasterDetail } from '@relteco/relui-core';
import type { MasterDetailAPI, MasterPosition, DetailVisibility } from '@relteco/relui-core';
import { getSlotProps, type SlotStyleProps } from '../utils';

/** MasterDetailLayout slot isimleri. */
export type MasterDetailSlot = 'root' | 'master' | 'detail' | 'collapseButton';

/** MasterDetailLayout bileşen prop'ları. */
export interface MasterDetailComponentProps
  extends SlotStyleProps<MasterDetailSlot>,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Root element inline style. */
  style?: CSSProperties;
  /** Master panel pozisyonu. Varsayılan: 'left'. */
  masterPosition?: MasterPosition;
  /** Master panel boyutu (px veya CSS string). Varsayılan: 300. */
  masterSize?: number | string;
  /** Detail panel görünürlük modu. Varsayılan: 'always'. */
  detailVisibility?: DetailVisibility;
  /** Seçili item ID. */
  selectedId?: string | null;
  /** Master panel daraltılabilir mi. Varsayılan: false. */
  collapsible?: boolean;
  /** Master panel daraltılmış mı. */
  collapsed?: boolean;
  /** Master panelde gösterilecek içerik. */
  master: ReactNode;
  /** Detail panelde gösterilecek içerik. */
  detail: ReactNode;
  /** Seçim değiştiğinde çağrılır. */
  onSelectionChange?: (id: string | null) => void;
  /** Daraltma durumu değiştiğinde çağrılır. */
  onCollapseChange?: (collapsed: boolean) => void;
}

/** Yön horizontal mı kontrol et. */
function isHorizontal(pos: MasterPosition): boolean {
  return pos === 'left' || pos === 'right';
}

/**
 * MasterDetailLayout — liste + detay panel layout.
 *
 * @example
 * ```tsx
 * <MasterDetailLayout
 *   masterPosition="left"
 *   masterSize={300}
 *   master={<ItemList />}
 *   detail={<ItemDetail />}
 * />
 * ```
 */
export const MasterDetailLayout = forwardRef<HTMLDivElement, MasterDetailComponentProps>(
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

    const rootSlot = getSlotProps(
      'root',
      undefined,
      classNames,
      slotStyles,
      {
        display: 'flex',
        flexDirection: horizontal
          ? (currentPosition === 'right' ? 'row-reverse' : 'row')
          : (currentPosition === 'bottom' ? 'column-reverse' : 'column'),
        ...style,
      },
    );

    const sizeValue = typeof currentSize === 'number' ? `${currentSize}px` : currentSize;

    const masterSlot = getSlotProps('master', undefined, classNames, slotStyles, {
      [horizontal ? 'width' : 'height']: currentCollapsed ? 0 : sizeValue,
      overflow: 'hidden',
      flexShrink: 0,
      transition: 'width 0.2s ease, height 0.2s ease',
    });

    const detailSlot = getSlotProps('detail', undefined, classNames, slotStyles, {
      flex: 1,
      overflow: 'auto',
      display: detailVisible ? undefined : 'none',
    });

    const collapseSlot = getSlotProps('collapseButton', undefined, classNames, slotStyles);

    const finalClass = [rootSlot.className, className].filter(Boolean).join(' ') || undefined;

    // ── Render ───────────────────────────────────────────

    const masterPanel = (
      <div
        className={masterSlot.className || undefined}
        style={masterSlot.style}
        data-panel="master"
        data-collapsed={currentCollapsed || undefined}
      >
        {master}
      </div>
    );

    const detailPanel = (
      <div
        className={detailSlot.className || undefined}
        style={detailSlot.style}
        data-panel="detail"
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
      >
        {masterPanel}
        {collapsible && (
          <button
            type="button"
            onClick={handleToggleCollapse}
            className={collapseSlot.className || undefined}
            style={collapseSlot.style}
            aria-label={currentCollapsed ? 'Expand panel' : 'Collapse panel'}
            aria-expanded={!currentCollapsed}
            data-collapse-button
          />
        )}
        {detailPanel}
      </div>
    );
  },
);

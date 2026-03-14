/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Tabs — styled tabs bileşeni.
 * Tabs — styled tabs component.
 *
 * WAI-ARIA Tabs pattern: tablist + tab + tabpanel.
 * Roving tabindex, 4 varyant (line/enclosed/outline/pills), 5 boyut,
 * horizontal/vertical yönelim, closable tab desteği.
 *
 * @packageDocumentation
 */

import { forwardRef, type ReactNode } from 'react';
import type { TabsSize, TabsVariant } from '@relteco/relui-core';
import { useTabs, type UseTabsProps } from './useTabs';
import {
  tabsRootStyle,
  tabsListRecipe,
  tabsTabBaseStyle,
  tabVariantMap,
  tabSizeMap,
  tabsCloseButtonStyle,
  tabsPanelStyle,
} from './tabs.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

/**
 * Tabs slot isimleri / Tabs slot names.
 */
export type TabsSlot =
  | 'root'
  | 'list'
  | 'tab'
  | 'tabCloseButton'
  | 'panel';

// ── Panel içerik tanımı / Panel content definition ──────────────────

export interface TabPanelContent {
  /** Tab değeri (TabItem.value ile eşleşmeli) / Tab value (must match TabItem.value) */
  value: string;

  /** Panel içeriği / Panel content */
  children: ReactNode;
}

// ── Tabs Component Props ────────────────────────────────────────────

export interface TabsComponentProps extends UseTabsProps, SlotStyleProps<TabsSlot> {
  /** Boyut / Size */
  size?: TabsSize;

  /** Görsel varyant / Visual variant */
  variant?: TabsVariant;

  /** Panel içerikleri / Panel contents */
  panels?: TabPanelContent[];

  /** Render prop — her panel için özel render / Custom render per panel */
  renderPanel?: (value: string) => ReactNode;

  /** Ek className / Additional className */
  className?: string;

  /** Inline style / Inline style */
  style?: React.CSSProperties;

  /** aria-label */
  'aria-label'?: string;

  /** id */
  id?: string;

  /** Tab genişletme / Tab stretch to fill */
  grow?: boolean;

  /** children (panel'ler için alternatif) / children (alternative for panels) */
  children?: ReactNode;
}

/**
 * Tabs bileşeni — çok amaçlı tab navigasyonu.
 * Tabs component — versatile tab navigation.
 *
 * @example
 * ```tsx
 * <Tabs
 *   items={[
 *     { value: 'home', label: 'Ana Sayfa' },
 *     { value: 'profile', label: 'Profil' },
 *     { value: 'settings', label: 'Ayarlar' },
 *   ]}
 *   defaultValue="home"
 *   panels={[
 *     { value: 'home', children: <div>Ana Sayfa İçeriği</div> },
 *     { value: 'profile', children: <div>Profil İçeriği</div> },
 *     { value: 'settings', children: <div>Ayarlar İçeriği</div> },
 *   ]}
 * />
 * ```
 */
export const Tabs = forwardRef<HTMLDivElement, TabsComponentProps>(
  function Tabs(props, ref) {
    const {
      size = 'md',
      variant = 'line',
      panels,
      renderPanel,
      className,
      style: styleProp,
      classNames,
      styles,
      'aria-label': ariaLabel,
      id,
      grow,
      children,
      ...tabsProps
    } = props;

    const {
      listProps,
      getTabProps,
      getPanelProps,
      items,
      orientation,
      closeTab,
    } = useTabs(tabsProps, id ?? 'tabs');

    // ── Root slot ──
    const rootSlot = getSlotProps('root', tabsRootStyle, classNames, styles);
    const combinedRootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;
    const combinedRootStyle = styleProp
      ? { ...rootSlot.style, ...styleProp }
      : rootSlot.style;

    // ── List slot ──
    const listRecipeClass = tabsListRecipe({ variant, size });
    const listSlot = getSlotProps('list', listRecipeClass, classNames, styles);

    // ── Tab slot ──
    const variantClass = tabVariantMap[variant];
    const sizeClass = tabSizeMap[size];
    const tabBaseClasses = `${tabsTabBaseStyle} ${variantClass} ${sizeClass}`;
    const tabSlot = getSlotProps('tab', tabBaseClasses, classNames, styles);

    // ── Close button slot ──
    const closeSlot = getSlotProps('tabCloseButton', tabsCloseButtonStyle, classNames, styles);

    // ── Panel slot ──
    const panelSlot = getSlotProps('panel', tabsPanelStyle, classNames, styles);

    return (
      <div
        ref={ref}
        className={combinedRootClassName}
        style={combinedRootStyle}
        data-orientation={orientation}
        id={id}
      >
        {/* Tablist */}
        <div
          className={listSlot.className}
          style={listSlot.style}
          aria-label={ariaLabel}
          {...listProps}
        >
          {items.map((item, index) => {
            const tabProps = getTabProps(index);
            return (
              <button
                key={item.value}
                type="button"
                className={tabSlot.className}
                style={{
                  ...tabSlot.style,
                  ...(grow ? { flex: '1 1 0%' } : undefined),
                }}
                {...tabProps}
              >
                {item.label}
                {item.closable && (
                  <span
                    role="button"
                    aria-label={`${item.label} kapat`}
                    tabIndex={-1}
                    className={closeSlot.className}
                    style={closeSlot.style}
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(item.value);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    ×
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TabPanels */}
        {panels && panels.map((panel) => {
          const panelProps = getPanelProps(panel.value);
          return (
            <div
              key={panel.value}
              className={panelSlot.className}
              style={panelSlot.style}
              {...panelProps}
            >
              {panel.children}
            </div>
          );
        })}

        {renderPanel && items.map((item) => {
          const panelProps = getPanelProps(item.value);
          return (
            <div
              key={item.value}
              className={panelSlot.className}
              style={panelSlot.style}
              {...panelProps}
            >
              {renderPanel(item.value)}
            </div>
          );
        })}

        {!panels && !renderPanel && children}
      </div>
    );
  },
);

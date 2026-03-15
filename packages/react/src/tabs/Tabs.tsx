/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Tabs — styled tabs bilesen (Dual API).
 * Tabs — styled tabs component (Dual API).
 *
 * Props-based: `<Tabs items={[...]} panels={[...]} />`
 * Compound:    `<Tabs><Tabs.List>...<Tabs.Tab>...<Tabs.Panel>...</Tabs>`
 *
 * WAI-ARIA Tabs pattern: tablist + tab + tabpanel.
 * Roving tabindex, 4 varyant (line/enclosed/outline/pills), 5 boyut,
 * horizontal/vertical yonelim, closable tab destegi.
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
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
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

/**
 * Tabs slot isimleri / Tabs slot names.
 */
export type TabsSlot =
  | 'root'
  | 'list'
  | 'tab'
  | 'tabCloseButton'
  | 'panel';

// ── Panel icerik tanimi / Panel content definition ──────────────────

export interface TabPanelContent {
  /** Tab degeri (TabItem.value ile eslesmeli) / Tab value (must match TabItem.value) */
  value: string;

  /** Panel icerigi / Panel content */
  children: ReactNode;
}

// ── Context (Compound API) ──────────────────────────────────────────

interface TabsContextValue {
  size: TabsSize;
  variant: TabsVariant;
  classNames: ClassNames<TabsSlot> | undefined;
  styles: Styles<TabsSlot> | undefined;
  listProps: ReturnType<typeof useTabs>['listProps'];
  getTabProps: ReturnType<typeof useTabs>['getTabProps'];
  getPanelProps: ReturnType<typeof useTabs>['getPanelProps'];
  items: ReturnType<typeof useTabs>['items'];
  closeTab: ReturnType<typeof useTabs>['closeTab'];
  grow: boolean | undefined;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs compound sub-components must be used within <Tabs>.');
  return ctx;
}

// ── Compound: Tabs.List ─────────────────────────────────────────────

/** Tabs.List props */
export interface TabsListProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** aria-label */
  'aria-label'?: string;
}

const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  function TabsList(props, ref) {
    const { children, className, 'aria-label': ariaLabel } = props;
    const ctx = useTabsContext();

    const listRecipeClass = tabsListRecipe({ variant: ctx.variant, size: ctx.size });
    const slot = getSlotProps('list', listRecipeClass, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div
        ref={ref}
        className={cls}
        style={slot.style}
        aria-label={ariaLabel}
        data-testid="tabs-list"
        {...ctx.listProps}
      >
        {children}
      </div>
    );
  },
);

// ── Compound: Tabs.Tab ──────────────────────────────────────────────

/** Tabs.Tab props */
export interface TabsTabProps {
  /** Tab degeri / Tab value */
  value: string;
  /** Icerik / Content */
  children: ReactNode;
  /** Kapatilabilir mi / Closable */
  closable?: boolean;
  /** Ek className / Additional className */
  className?: string;
}

const TabsTab = forwardRef<HTMLButtonElement, TabsTabProps>(
  function TabsTab(props, ref) {
    const { value, children, closable, className } = props;
    const ctx = useTabsContext();

    const index = ctx.items.findIndex((item) => item.value === value);
    if (index < 0) return null;

    const variantClass = tabVariantMap[ctx.variant];
    const sizeClass = tabSizeMap[ctx.size];
    const tabBaseClasses = `${tabsTabBaseStyle} ${variantClass} ${sizeClass}`;
    const slot = getSlotProps('tab', tabBaseClasses, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const closeSlot = getSlotProps('tabCloseButton', tabsCloseButtonStyle, ctx.classNames, ctx.styles);

    const tabProps = ctx.getTabProps(index);

    return (
      <button
        ref={ref}
        type="button"
        className={cls}
        style={{
          ...slot.style,
          ...(ctx.grow ? { flex: '1 1 0%' } : undefined),
        }}
        data-testid="tabs-tab"
        {...tabProps}
      >
        {children}
        {closable && (
          <span
            role="button"
            aria-label={`${children} kapat`}
            tabIndex={-1}
            className={closeSlot.className}
            style={closeSlot.style}
            onClick={(e) => {
              e.stopPropagation();
              ctx.closeTab(value);
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            ×
          </span>
        )}
      </button>
    );
  },
);

// ── Compound: Tabs.Panel ────────────────────────────────────────────

/** Tabs.Panel props */
export interface TabsPanelProps {
  /** Panel degeri (TabItem.value ile eslesmeli) / Panel value */
  value: string;
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const TabsPanel = forwardRef<HTMLDivElement, TabsPanelProps>(
  function TabsPanel(props, ref) {
    const { value, children, className } = props;
    const ctx = useTabsContext();

    const slot = getSlotProps('panel', tabsPanelStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const panelProps = ctx.getPanelProps(value);

    return (
      <div
        ref={ref}
        className={cls}
        style={slot.style}
        data-testid="tabs-panel"
        {...panelProps}
      >
        {children}
      </div>
    );
  },
);

// ── Tabs Component Props ────────────────────────────────────────────

export interface TabsComponentProps extends UseTabsProps, SlotStyleProps<TabsSlot> {
  /** Boyut / Size */
  size?: TabsSize;

  /** Gorsel varyant / Visual variant */
  variant?: TabsVariant;

  /** Panel icerikleri / Panel contents */
  panels?: TabPanelContent[];

  /** Render prop — her panel icin ozel render / Custom render per panel */
  renderPanel?: (value: string) => ReactNode;

  /** Ek className / Additional className */
  className?: string;

  /** Inline style / Inline style */
  style?: React.CSSProperties;

  /** aria-label */
  'aria-label'?: string;

  /** id */
  id?: string;

  /** Tab genisletme / Tab stretch to fill */
  grow?: boolean;

  /** children (compound API veya panel alternatifi) / children (compound API or panels alternative) */
  children?: ReactNode;
}

// ── Component ───────────────────────────────────────────────────────

const TabsBase = forwardRef<HTMLDivElement, TabsComponentProps>(
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

    // ── Compound API detection ──
    const isCompound = children && !panels && !renderPanel;

    if (isCompound) {
      const ctxValue: TabsContextValue = {
        size,
        variant,
        classNames,
        styles,
        listProps,
        getTabProps,
        getPanelProps,
        items,
        closeTab,
        grow,
      };

      return (
        <TabsContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={combinedRootClassName}
            style={combinedRootStyle}
            data-orientation={orientation}
            id={id}
          >
            {children}
          </div>
        </TabsContext.Provider>
      );
    }

    // ── Props-based API ──

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

/**
 * Tabs bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Tabs
 *   items={[
 *     { value: 'home', label: 'Ana Sayfa' },
 *     { value: 'profile', label: 'Profil' },
 *   ]}
 *   defaultValue="home"
 *   panels={[
 *     { value: 'home', children: <div>Ana Sayfa Icerigi</div> },
 *     { value: 'profile', children: <div>Profil Icerigi</div> },
 *   ]}
 * />
 * ```
 *
 * @example Compound
 * ```tsx
 * <Tabs items={items} defaultValue="home">
 *   <Tabs.List aria-label="Navigasyon">
 *     <Tabs.Tab value="home">Ana Sayfa</Tabs.Tab>
 *     <Tabs.Tab value="profile">Profil</Tabs.Tab>
 *   </Tabs.List>
 *   <Tabs.Panel value="home">Ana Sayfa Icerigi</Tabs.Panel>
 *   <Tabs.Panel value="profile">Profil Icerigi</Tabs.Panel>
 * </Tabs>
 * ```
 */
export const Tabs = Object.assign(TabsBase, {
  List: TabsList,
  Tab: TabsTab,
  Panel: TabsPanel,
});

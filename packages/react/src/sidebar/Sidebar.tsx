/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Sidebar — styled sidebar bilesen (Dual API).
 * Sidebar — styled sidebar component (Dual API).
 *
 * Props-based: `<Sidebar items={[...]} header={<Logo />} />`
 * Compound:    `<Sidebar><Sidebar.Header>Logo</Sidebar.Header><Sidebar.Section>...</Sidebar.Section></Sidebar>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { SidebarSize, SidebarPosition, SidebarItem } from '@relteco/relui-core';
import { useSidebar, type UseSidebarProps } from './useSidebar';
import {
  sidebarRootRecipe,
  sidebarHeaderStyle,
  sidebarContentStyle,
  sidebarFooterStyle,
  sidebarItemStyle,
  sidebarItemIconStyle,
  sidebarItemLabelStyle,
  sidebarItemBadgeStyle,
  sidebarGroupTriggerStyle,
  sidebarGroupChevronStyle,
  sidebarGroupChildrenStyle,
  sidebarCollapseButtonStyle,
  sidebarSectionHeaderStyle,
  sidebarDividerStyle,
} from './sidebar.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

/**
 * Sidebar slot isimleri / Sidebar slot names.
 */
export type SidebarSlot =
  | 'root'
  | 'header'
  | 'content'
  | 'footer'
  | 'item'
  | 'itemIcon'
  | 'itemLabel'
  | 'itemBadge'
  | 'groupTrigger'
  | 'groupChildren'
  | 'collapseButton'
  | 'sectionHeader'
  | 'divider';

// ── Context (Compound API) ──────────────────────────────────────

interface SidebarContextValue {
  size: SidebarSize;
  collapsed: boolean;
  variant: SidebarPosition;
  classNames: ClassNames<SidebarSlot> | undefined;
  styles: Styles<SidebarSlot> | undefined;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

function useSidebarContext(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('Sidebar compound sub-components must be used within <Sidebar>.');
  return ctx;
}

// ── Compound: Sidebar.Header ────────────────────────────────────

/** Sidebar.Header props */
export interface SidebarHeaderProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const SidebarHeader = forwardRef<HTMLDivElement, SidebarHeaderProps>(
  function SidebarHeader(props, ref) {
    const { children, className } = props;
    const ctx = useSidebarContext();
    const slot = getSlotProps('header', sidebarHeaderStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="sidebar-header">
        {children}
      </div>
    );
  },
);

// ── Compound: Sidebar.Section ───────────────────────────────────

/** Sidebar.Section props */
export interface SidebarSectionProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Bolum baslik / Section title */
  title?: string;
  /** Ek className / Additional className */
  className?: string;
}

const SidebarSection = forwardRef<HTMLDivElement, SidebarSectionProps>(
  function SidebarSection(props, ref) {
    const { children, title, className } = props;
    const ctx = useSidebarContext();
    const contentSlot = getSlotProps('content', sidebarContentStyle, ctx.classNames, ctx.styles);
    const sectionSlot = getSlotProps('sectionHeader', sidebarSectionHeaderStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${contentSlot.className} ${className}` : contentSlot.className;

    return (
      <div ref={ref} className={cls} style={contentSlot.style} data-testid="sidebar-section">
        {title && (
          <div className={sectionSlot.className} style={sectionSlot.style}>
            {title}
          </div>
        )}
        {children}
      </div>
    );
  },
);

// ── Compound: Sidebar.Item ──────────────────────────────────────

/** Sidebar.Item props */
export interface SidebarItemProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Aktif mi / Is active */
  active?: boolean;
  /** Devre disi mi / Is disabled */
  disabled?: boolean;
  /** Tiklama callback / Click callback */
  onClick?: () => void;
  /** Link href */
  href?: string;
  /** Ikon / Icon */
  icon?: ReactNode;
  /** Badge / Badge */
  badge?: ReactNode;
}

const SidebarItemComponent = forwardRef<HTMLElement, SidebarItemProps>(
  function SidebarItem(props, ref) {
    const { children, className, active, disabled, onClick, href, icon, badge } = props;
    const ctx = useSidebarContext();
    const slot = getSlotProps('item', sidebarItemStyle, ctx.classNames, ctx.styles);
    const iconSlot = getSlotProps('itemIcon', sidebarItemIconStyle, ctx.classNames, ctx.styles);
    const labelSlot = getSlotProps('itemLabel', sidebarItemLabelStyle, ctx.classNames, ctx.styles);
    const badgeSlot = getSlotProps('itemBadge', sidebarItemBadgeStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const Element = href ? 'a' : 'button';
    const elementProps = href
      ? { href }
      : { type: 'button' as const };

    return (
      <Element
        ref={ref as never}
        className={cls}
        style={slot.style}
        data-testid="sidebar-item"
        data-active={active ? '' : undefined}
        aria-current={active ? 'page' : undefined}
        aria-disabled={disabled ? 'true' : undefined}
        onClick={disabled ? undefined : onClick}
        {...elementProps}
      >
        {icon && (
          <span className={iconSlot.className} style={iconSlot.style}>
            {icon}
          </span>
        )}
        <span className={labelSlot.className} style={labelSlot.style}>
          {children}
        </span>
        {badge && (
          <span className={badgeSlot.className} style={badgeSlot.style}>
            {badge}
          </span>
        )}
      </Element>
    );
  },
);

// ── Compound: Sidebar.Footer ────────────────────────────────────

/** Sidebar.Footer props */
export interface SidebarFooterProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const SidebarFooter = forwardRef<HTMLDivElement, SidebarFooterProps>(
  function SidebarFooter(props, ref) {
    const { children, className } = props;
    const ctx = useSidebarContext();
    const slot = getSlotProps('footer', sidebarFooterStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="sidebar-footer">
        {children}
      </div>
    );
  },
);

// ── Sidebar Component Props ─────────────────────────────────────────

export interface SidebarComponentProps extends UseSidebarProps, SlotStyleProps<SidebarSlot> {
  /** Boyut / Size */
  size?: SidebarSize;

  /** Pozisyon / Position */
  position?: SidebarPosition;

  /** Ek className / Additional className */
  className?: string;

  /** Inline style / Inline style */
  style?: React.CSSProperties;

  /** id */
  id?: string;

  /** Baslik bolumu / Header section */
  header?: ReactNode;

  /** Alt bolum / Footer section */
  footer?: ReactNode;

  /** Daraltma butonu goster / Show collapse button */
  showCollapseButton?: boolean;

  /** Ikon render callback / Icon render callback */
  renderIcon?: (icon: string) => ReactNode;

  /** Oge render override / Item render override */
  renderItem?: (item: SidebarItem, props: { isActive: boolean; isCollapsed: boolean }) => ReactNode;

  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
}

/**
 * Sidebar bilesen — daraltilabilir navigasyon paneli.
 * Sidebar component — collapsible navigation panel.
 *
 * @example
 * ```tsx
 * <Sidebar
 *   items={[
 *     { key: 'home', label: 'Ana Sayfa', icon: 'home' },
 *     { key: 'settings', label: 'Ayarlar', children: [
 *       { key: 'profile', label: 'Profil' },
 *     ]},
 *   ]}
 *   defaultActiveKey="home"
 * />
 * ```
 */
const SidebarBase = forwardRef<HTMLElement, SidebarComponentProps>(
  function Sidebar(props, ref) {
    const {
      size = 'md',
      position = 'left',
      className,
      style: styleProp,
      classNames,
      styles,
      id,
      header,
      footer,
      showCollapseButton = true,
      renderIcon,
      renderItem,
      children,
      ...sidebarProps
    } = props;

    const {
      navProps,
      getItemProps,
      getGroupProps,
      isCollapsed,
      items,
      toggleCollapse,
      setActive,
      toggleGroup,
      isGroupExpanded,
    } = useSidebar(sidebarProps);

    // ── Slots ──
    const rootClass = sidebarRootRecipe({ size });
    const rootSlot = getSlotProps('root', rootClass, classNames, styles);
    const combinedRootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;
    const combinedRootStyle = styleProp
      ? { ...rootSlot.style, ...styleProp }
      : rootSlot.style;

    const headerSlot = getSlotProps('header', sidebarHeaderStyle, classNames, styles);
    const contentSlot = getSlotProps('content', sidebarContentStyle, classNames, styles);
    const footerSlot = getSlotProps('footer', sidebarFooterStyle, classNames, styles);
    const itemSlot = getSlotProps('item', sidebarItemStyle, classNames, styles);
    const iconSlot = getSlotProps('itemIcon', sidebarItemIconStyle, classNames, styles);
    const labelSlot = getSlotProps('itemLabel', sidebarItemLabelStyle, classNames, styles);
    const badgeSlot = getSlotProps('itemBadge', sidebarItemBadgeStyle, classNames, styles);
    const groupTriggerSlot = getSlotProps('groupTrigger', sidebarGroupTriggerStyle, classNames, styles);
    const groupChildrenSlot = getSlotProps('groupChildren', sidebarGroupChildrenStyle, classNames, styles);
    const collapseSlot = getSlotProps('collapseButton', sidebarCollapseButtonStyle, classNames, styles);
    const sectionHeaderSlot = getSlotProps('sectionHeader', sidebarSectionHeaderStyle, classNames, styles);
    const dividerSlot = getSlotProps('divider', sidebarDividerStyle, classNames, styles);

    const ctxValue: SidebarContextValue = {
      size,
      collapsed: isCollapsed,
      variant: position,
      classNames,
      styles,
    };

    // ── Compound API ──
    if (children) {
      return (
        <SidebarContext.Provider value={ctxValue}>
          <nav
            ref={ref}
            className={combinedRootClassName}
            style={combinedRootStyle}
            id={id}
            data-position={position}
            data-collapsed={isCollapsed ? '' : undefined}
            data-testid="sidebar-root"
            aria-label="Sidebar"
          >
            {children}
          </nav>
        </SidebarContext.Provider>
      );
    }

    // ── Render item ──
    function renderSidebarItem(item: SidebarItem, depth: number) {
      // Divider
      if (item.divider) {
        return (
          <div
            key={item.key}
            className={dividerSlot.className}
            style={dividerSlot.style}
            role="separator"
          />
        );
      }

      // Section header
      if (item.sectionHeader) {
        return (
          <div
            key={item.key}
            className={sectionHeaderSlot.className}
            style={sectionHeaderSlot.style}
          >
            {item.label}
          </div>
        );
      }

      // Group (has children)
      if (item.children && item.children.length > 0) {
        const groupDomProps = getGroupProps(item.key);
        const expanded = isGroupExpanded(item.key);

        return (
          <div key={item.key}>
            <button
              type="button"
              className={groupTriggerSlot.className}
              style={groupTriggerSlot.style}
              onClick={() => toggleGroup(item.key)}
              {...groupDomProps}
            >
              {item.icon && (
                <span className={iconSlot.className} style={iconSlot.style}>
                  {renderIcon ? renderIcon(item.icon) : item.icon}
                </span>
              )}
              <span className={labelSlot.className} style={labelSlot.style}>
                {item.label}
              </span>
              <svg
                className={sidebarGroupChevronStyle}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            {expanded && !isCollapsed && (
              <div className={groupChildrenSlot.className} style={groupChildrenSlot.style}>
                {item.children.map((child) => renderSidebarItem(child, depth + 1))}
              </div>
            )}
          </div>
        );
      }

      // Custom render
      const domProps = getItemProps(item);
      const isActive = domProps['data-active'] === '';

      if (renderItem) {
        return (
          <div key={item.key}>
            {renderItem(item, { isActive, isCollapsed })}
          </div>
        );
      }

      // Normal item
      const Element = item.href ? 'a' : 'button';
      const elementProps = item.href
        ? { href: item.href }
        : { type: 'button' as const };

      return (
        <Element
          key={item.key}
          className={itemSlot.className}
          style={itemSlot.style}
          onClick={() => {
            if (!item.disabled) {
              setActive(item.key);
            }
          }}
          {...elementProps}
          {...domProps}
        >
          {item.icon && (
            <span className={iconSlot.className} style={iconSlot.style}>
              {renderIcon ? renderIcon(item.icon) : item.icon}
            </span>
          )}
          <span className={labelSlot.className} style={labelSlot.style}>
            {item.label}
          </span>
          {item.badge && (
            <span className={badgeSlot.className} style={badgeSlot.style}>
              {item.badge}
            </span>
          )}
        </Element>
      );
    }

    return (
      <nav
        ref={ref}
        className={combinedRootClassName}
        style={combinedRootStyle}
        id={id}
        data-position={position}
        {...navProps}
      >
        {/* Header */}
        {header && (
          <div className={headerSlot.className} style={headerSlot.style}>
            {header}
          </div>
        )}

        {/* Content */}
        <div className={contentSlot.className} style={contentSlot.style}>
          {items.map((item) => renderSidebarItem(item, 0))}
        </div>

        {/* Footer */}
        {footer && (
          <div className={footerSlot.className} style={footerSlot.style}>
            {footer}
          </div>
        )}

        {/* Collapse button */}
        {showCollapseButton && (
          <button
            type="button"
            className={collapseSlot.className}
            style={collapseSlot.style}
            onClick={toggleCollapse}
            aria-label={isCollapsed ? 'Genislet' : 'Daralt'}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: isCollapsed ? 'rotate(180deg)' : undefined,
                transition: 'transform 200ms ease',
              }}
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
      </nav>
    );
  },
);

/**
 * Sidebar bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Sidebar items={[...]} header={<Logo />} defaultActiveKey="home" />
 * ```
 *
 * @example Compound
 * ```tsx
 * <Sidebar>
 *   <Sidebar.Header>Logo</Sidebar.Header>
 *   <Sidebar.Section title="Navigasyon">
 *     <Sidebar.Item active icon={<HomeIcon />}>Ana Sayfa</Sidebar.Item>
 *     <Sidebar.Item icon={<SettingsIcon />}>Ayarlar</Sidebar.Item>
 *   </Sidebar.Section>
 *   <Sidebar.Footer>v1.0</Sidebar.Footer>
 * </Sidebar>
 * ```
 */
export const Sidebar = Object.assign(SidebarBase, {
  Header: SidebarHeader,
  Section: SidebarSection,
  Item: SidebarItemComponent,
  Footer: SidebarFooter,
});

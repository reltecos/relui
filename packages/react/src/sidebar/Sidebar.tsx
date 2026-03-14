/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Sidebar — styled sidebar bilesen.
 * Sidebar — styled sidebar component.
 *
 * Daraltilabilir navigasyon paneli. Gruplama, ikon, badge, bolum destegi.
 *
 * @packageDocumentation
 */

import { forwardRef, type ReactNode } from 'react';
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
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

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
export const Sidebar = forwardRef<HTMLElement, SidebarComponentProps>(
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

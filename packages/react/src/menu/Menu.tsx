/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Menu — styled masaustu tarzi menu cubugu bilesen.
 * Menu — styled desktop-style menu bar component.
 *
 * File/Edit/View/Help pattern, submenu, shortcut, divider.
 *
 * @packageDocumentation
 */

import { forwardRef, useEffect, useCallback, type ReactNode } from 'react';
import type { MenuSize, MenuItem } from '@relteco/relui-core';
import { useMenu, type UseMenuProps } from './useMenu';
import {
  menuBarRecipe,
  menuTriggerStyle,
  menuDropdownStyle,
  menuSubmenuStyle,
  menuItemStyle,
  menuItemIconStyle,
  menuItemLabelStyle,
  menuItemShortcutStyle,
  menuItemCheckStyle,
  menuSubmenuIndicatorStyle,
  menuDividerStyle,
} from './menu.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

/**
 * Menu slot isimleri / Menu slot names.
 */
export type MenuSlot =
  | 'root'
  | 'trigger'
  | 'dropdown'
  | 'item'
  | 'itemIcon'
  | 'itemLabel'
  | 'itemShortcut'
  | 'itemCheck'
  | 'submenuIndicator'
  | 'divider';

// ── Menu Component Props ───────────────────────────────────────

export interface MenuComponentProps extends UseMenuProps, SlotStyleProps<MenuSlot> {
  /** Boyut / Size */
  size?: MenuSize;

  /** Ek className / Additional className */
  className?: string;

  /** Inline style / Inline style */
  style?: React.CSSProperties;

  /** id */
  id?: string;

  /** Ikon render callback / Icon render callback */
  renderIcon?: (icon: string) => ReactNode;
}

/**
 * Menu bilesen — masaustu tarzi menu cubugu.
 * Menu component — desktop-style menu bar.
 *
 * @example
 * ```tsx
 * <Menu
 *   items={[
 *     { key: 'file', label: 'Dosya', children: [
 *       { key: 'new', label: 'Yeni', shortcut: 'Ctrl+N' },
 *       { key: 'open', label: 'Ac', shortcut: 'Ctrl+O' },
 *     ]},
 *     { key: 'edit', label: 'Duzenle', children: [...] },
 *   ]}
 *   onSelect={(key) => console.log('Selected:', key)}
 * />
 * ```
 */
export const Menu = forwardRef<HTMLDivElement, MenuComponentProps>(
  function Menu(props, ref) {
    const {
      size = 'md',
      className,
      style: styleProp,
      classNames,
      styles,
      id,
      renderIcon,
      ...menuProps
    } = props;

    const {
      menuBarProps,
      getTriggerProps,
      getMenuItemProps,
      getDropdownProps,
      items,
      isOpen,
      openMenu,
      closeAll,
      toggleMenu,
      selectItem,
      highlight,
      isMenuOpen,
    } = useMenu(menuProps);

    // ── Slots ──
    const rootClass = menuBarRecipe({ size });
    const rootSlot = getSlotProps('root', rootClass, classNames, styles);
    const combinedRootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;
    const combinedRootStyle = styleProp
      ? { ...rootSlot.style, ...styleProp }
      : rootSlot.style;

    const triggerSlot = getSlotProps('trigger', menuTriggerStyle, classNames, styles);
    const dropdownSlot = getSlotProps('dropdown', menuDropdownStyle, classNames, styles);
    const itemSlot = getSlotProps('item', menuItemStyle, classNames, styles);
    const iconSlot = getSlotProps('itemIcon', menuItemIconStyle, classNames, styles);
    const labelSlot = getSlotProps('itemLabel', menuItemLabelStyle, classNames, styles);
    const shortcutSlot = getSlotProps('itemShortcut', menuItemShortcutStyle, classNames, styles);
    const checkSlot = getSlotProps('itemCheck', menuItemCheckStyle, classNames, styles);
    const submenuIndicatorSlot = getSlotProps(
      'submenuIndicator',
      menuSubmenuIndicatorStyle,
      classNames,
      styles,
    );
    const dividerSlot = getSlotProps('divider', menuDividerStyle, classNames, styles);

    // ── Close on outside click / Escape ──
    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (!isOpen) return;
        if (e.key === 'Escape') {
          e.preventDefault();
          closeAll();
        }
      },
      [isOpen, closeAll],
    );

    const handleClickOutside = useCallback(
      (e: MouseEvent) => {
        if (!isOpen) return;
        const target = e.target as HTMLElement;
        if (target.closest('[role="menubar"]') || target.closest('[role="menu"]')) return;
        closeAll();
      },
      [isOpen, closeAll],
    );

    useEffect(() => {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [handleKeyDown, handleClickOutside]);

    // ── Render menu item ──
    function renderMenuItem(item: MenuItem, depth: number) {
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

      const domProps = getMenuItemProps(item);
      const hasChildren = item.children && item.children.length > 0;
      const isSubOpen = isMenuOpen(item.key);

      return (
        <div key={item.key} style={{ position: 'relative' }}>
          <button
            type="button"
            className={itemSlot.className}
            style={itemSlot.style}
            onClick={() => {
              if (!item.disabled) {
                selectItem(item.key);
              }
            }}
            onMouseEnter={() => {
              highlight(item.key);
              if (hasChildren && !item.disabled) {
                selectItem(item.key);
              }
            }}
            {...domProps}
          >
            {/* Check mark */}
            {item.checked !== undefined && (
              <span className={checkSlot.className} style={checkSlot.style}>
                {item.checked ? '\u2713' : ''}
              </span>
            )}

            {/* Icon */}
            {item.icon && (
              <span className={iconSlot.className} style={iconSlot.style}>
                {renderIcon ? renderIcon(item.icon) : item.icon}
              </span>
            )}

            {/* Label */}
            <span className={labelSlot.className} style={labelSlot.style}>
              {item.label}
            </span>

            {/* Shortcut */}
            {item.shortcut && (
              <span className={shortcutSlot.className} style={shortcutSlot.style}>
                {item.shortcut}
              </span>
            )}

            {/* Submenu indicator */}
            {hasChildren && (
              <svg
                className={submenuIndicatorSlot.className}
                style={submenuIndicatorSlot.style}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            )}
          </button>

          {/* Submenu dropdown */}
          {hasChildren && isSubOpen && item.children && (
            <div
              className={menuSubmenuStyle}
              {...getDropdownProps(item.key)}
            >
              {item.children.map((child) => renderMenuItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={combinedRootClassName}
        style={combinedRootStyle}
        id={id}
        {...menuBarProps}
      >
        {items.map((topItem) => {
          const triggerProps = getTriggerProps(topItem.key);
          const menuOpen = isMenuOpen(topItem.key);

          return (
            <div key={topItem.key} style={{ position: 'relative' }}>
              <button
                type="button"
                className={triggerSlot.className}
                style={triggerSlot.style}
                onClick={() => toggleMenu(topItem.key)}
                onMouseEnter={() => {
                  if (isOpen && !menuOpen) {
                    openMenu(topItem.key);
                  }
                }}
                {...triggerProps}
              >
                {topItem.label}
              </button>

              {/* Dropdown */}
              {menuOpen && topItem.children && (
                <div
                  className={dropdownSlot.className}
                  style={dropdownSlot.style}
                  {...getDropdownProps(topItem.key)}
                >
                  {topItem.children.map((item) => renderMenuItem(item, 0))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  },
);

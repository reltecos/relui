/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Menu — styled masaustu tarzi menu cubugu bilesen (Dual API).
 * Menu — styled desktop-style menu bar component (Dual API).
 *
 * Props-based: `<Menu items={[...]} />`
 * Compound:    `<Menu><Menu.Group label="File"><Menu.Item>New</Menu.Item></Menu.Group></Menu>`
 *
 * @packageDocumentation
 */

import { forwardRef, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';
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
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

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

// ── Context (Compound API) ──────────────────────────────────────

interface MenuContextValue {
  size: MenuSize;
  classNames: ClassNames<MenuSlot> | undefined;
  styles: Styles<MenuSlot> | undefined;
}

const MenuContext = createContext<MenuContextValue | null>(null);

function useMenuContext(): MenuContextValue {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error('Menu compound sub-components must be used within <Menu>.');
  return ctx;
}

// ── Compound: Menu.Item ─────────────────────────────────────────

/** Menu.Item props */
export interface MenuItemComponentProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Devre disi mi / Is disabled */
  disabled?: boolean;
  /** Tiklama callback / Click callback */
  onClick?: () => void;
  /** Kisayol / Shortcut */
  shortcut?: string;
  /** Ikon / Icon */
  icon?: ReactNode;
  /** Isaretli mi / Is checked */
  checked?: boolean;
}

const MenuItemCompound = forwardRef<HTMLButtonElement, MenuItemComponentProps>(
  function MenuItem(props, ref) {
    const { children, className, disabled, onClick, shortcut, icon, checked } = props;
    const ctx = useMenuContext();
    const slot = getSlotProps('item', menuItemStyle, ctx.classNames, ctx.styles);
    const iconSlot = getSlotProps('itemIcon', menuItemIconStyle, ctx.classNames, ctx.styles);
    const labelSlot = getSlotProps('itemLabel', menuItemLabelStyle, ctx.classNames, ctx.styles);
    const shortcutSlot = getSlotProps('itemShortcut', menuItemShortcutStyle, ctx.classNames, ctx.styles);
    const checkSlot = getSlotProps('itemCheck', menuItemCheckStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <button
        ref={ref}
        type="button"
        className={cls}
        style={slot.style}
        data-testid="menu-item"
        data-disabled={disabled ? '' : undefined}
        aria-disabled={disabled ? 'true' : undefined}
        role="menuitem"
        onClick={disabled ? undefined : onClick}
      >
        {checked !== undefined && (
          <span className={checkSlot.className} style={checkSlot.style}>
            {checked ? '\u2713' : ''}
          </span>
        )}
        {icon && (
          <span className={iconSlot.className} style={iconSlot.style}>
            {icon}
          </span>
        )}
        <span className={labelSlot.className} style={labelSlot.style}>
          {children}
        </span>
        {shortcut && (
          <span className={shortcutSlot.className} style={shortcutSlot.style}>
            {shortcut}
          </span>
        )}
      </button>
    );
  },
);

// ── Compound: Menu.Group ────────────────────────────────────────

/** Menu.Group props */
export interface MenuGroupProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Grup basligi / Group label */
  label: string;
  /** Ek className / Additional className */
  className?: string;
}

const MenuGroup = forwardRef<HTMLDivElement, MenuGroupProps>(
  function MenuGroup(props, ref) {
    const { children, label, className } = props;
    const ctx = useMenuContext();
    const triggerSlot = getSlotProps('trigger', menuTriggerStyle, ctx.classNames, ctx.styles);
    const dropdownSlot = getSlotProps('dropdown', menuDropdownStyle, ctx.classNames, ctx.styles);

    return (
      <div ref={ref} style={{ position: 'relative' }} data-testid="menu-group">
        <button
          type="button"
          className={className ? `${triggerSlot.className} ${className}` : triggerSlot.className}
          style={triggerSlot.style}
          aria-haspopup="true"
        >
          {label}
        </button>
        <div className={dropdownSlot.className} style={dropdownSlot.style} role="menu">
          {children}
        </div>
      </div>
    );
  },
);

// ── Compound: Menu.Separator ────────────────────────────────────

/** Menu.Separator props */
export interface MenuSeparatorProps {
  /** Ek className / Additional className */
  className?: string;
}

const MenuSeparator = forwardRef<HTMLDivElement, MenuSeparatorProps>(
  function MenuSeparator(props, ref) {
    const { className } = props;
    const ctx = useMenuContext();
    const slot = getSlotProps('divider', menuDividerStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div
        ref={ref}
        className={cls}
        style={slot.style}
        role="separator"
        data-testid="menu-separator"
      />
    );
  },
);

// ── Compound: Menu.Label ────────────────────────────────────────

/** Menu.Label props */
export interface MenuLabelProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const MenuLabel = forwardRef<HTMLDivElement, MenuLabelProps>(
  function MenuLabel(props, ref) {
    const { children, className } = props;
    const ctx = useMenuContext();
    const slot = getSlotProps('itemLabel', menuItemLabelStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div
        ref={ref}
        className={cls}
        style={{ ...slot.style, fontWeight: 600, opacity: 0.7, fontSize: '0.85em', pointerEvents: 'none' }}
        data-testid="menu-label"
      >
        {children}
      </div>
    );
  },
);

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

  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
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
const MenuBase = forwardRef<HTMLDivElement, MenuComponentProps>(
  function Menu(props, ref) {
    const {
      size = 'md',
      className,
      style: styleProp,
      classNames,
      styles,
      id,
      renderIcon,
      children,
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

    const ctxValue: MenuContextValue = { size, classNames, styles };

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

    // ── Compound API ──
    if (children) {
      return (
        <MenuContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={combinedRootClassName}
            style={combinedRootStyle}
            id={id}
            role="menubar"
            aria-label="Menu"
            data-testid="menu-root"
          >
            {children}
          </div>
        </MenuContext.Provider>
      );
    }

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

/**
 * Menu bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Menu items={[...]} onSelect={(key) => handle(key)} />
 * ```
 *
 * @example Compound
 * ```tsx
 * <Menu>
 *   <Menu.Group label="File">
 *     <Menu.Item shortcut="Ctrl+N">New</Menu.Item>
 *     <Menu.Separator />
 *     <Menu.Item shortcut="Ctrl+S">Save</Menu.Item>
 *   </Menu.Group>
 * </Menu>
 * ```
 */
export const Menu = Object.assign(MenuBase, {
  Item: MenuItemCompound,
  Group: MenuGroup,
  Separator: MenuSeparator,
  Label: MenuLabel,
});

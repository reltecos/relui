/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * ContextMenu — sag tik ile acilan menu bilesen.
 * ContextMenu — right-click context menu component.
 *
 * @packageDocumentation
 */

import {
  forwardRef,
  useRef,
  useEffect,
  useReducer,
  useCallback,
  cloneElement,
  isValidElement,
} from 'react';
import { createPortal } from 'react-dom';
import {
  contextMenuStyle,
  contextMenuItemStyle,
  contextMenuItemDisabledStyle,
  contextMenuItemHighlightedStyle,
  contextMenuItemIconStyle,
  contextMenuItemLabelStyle,
  contextMenuItemShortcutStyle,
  contextMenuItemSubmenuArrowStyle,
  contextMenuSeparatorStyle,
  contextMenuSubmenuStyle,
} from './context-menu.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';
import {
  createContextMenu,
  type ContextMenuAPI,
  type ContextMenuItem,
} from '@relteco/relui-core';
import { ChevronRightIcon } from '@relteco/relui-icons';

// ── Slot ──────────────────────────────────────────────

/**
 * ContextMenu slot isimleri / ContextMenu slot names.
 */
export type ContextMenuSlot =
  | 'root'
  | 'menu'
  | 'item'
  | 'itemIcon'
  | 'itemLabel'
  | 'itemShortcut'
  | 'separator'
  | 'submenu';

// ── Component Props ─────────────────────────────────

export interface ContextMenuComponentProps extends SlotStyleProps<ContextMenuSlot> {
  /** Menu ogeleri / Menu items */
  items: ContextMenuItem[];
  /** Oge secilince callback / On item select callback */
  onSelect?: (itemId: string) => void;
  /** Trigger elementi (sag tiklanacak alan) / Trigger element (right-click area) */
  children: React.ReactElement;
  /** Ek className (menu'ye) / Additional className (applied to menu) */
  className?: string;
  /** Inline style (menu'ye) / Inline style (applied to menu) */
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────

/**
 * ContextMenu bilesen — sag tik ile acilan menu.
 * ContextMenu component — right-click context menu.
 *
 * @example
 * ```tsx
 * <ContextMenu
 *   items={[
 *     { id: 'cut', label: 'Kes' },
 *     { id: 'copy', label: 'Kopyala' },
 *     { id: 'paste', label: 'Yapistir' },
 *   ]}
 *   onSelect={(id) => console.log(id)}
 * >
 *   <div style={{ width: 400, height: 200 }}>Sag tikla</div>
 * </ContextMenu>
 * ```
 */
export const ContextMenu = forwardRef<HTMLDivElement, ContextMenuComponentProps>(
  function ContextMenu(props, ref) {
    const {
      items,
      onSelect,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const [, forceRender] = useReducer((c: number) => c + 1, 0);

    // ── Core API ──
    const onSelectRef = useRef(onSelect);
    onSelectRef.current = onSelect;

    const apiRef = useRef<ContextMenuAPI | null>(null);
    if (!apiRef.current) {
      apiRef.current = createContextMenu({
        items,
        onSelect: (itemId) => onSelectRef.current?.(itemId),
      });
    }
    const api = apiRef.current;

    // ── Subscribe ──
    useEffect(() => {
      return api.subscribe(() => forceRender());
    }, [api]);

    const ctx = api.getContext();
    const menuRef = useRef<HTMLDivElement>(null);

    // ── Context menu handler ──
    const handleContextMenu = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      api.send({ type: 'OPEN', x: e.clientX, y: e.clientY });
    }, [api]);

    // ── Outside click ──
    useEffect(() => {
      if (!ctx.open) return;
      const handleClick = (e: MouseEvent) => {
        const menuEl = menuRef.current;
        if (menuEl && menuEl.contains(e.target as Node)) return;
        api.send({ type: 'CLOSE' });
      };
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }, [ctx.open, api]);

    // ── Escape key ──
    useEffect(() => {
      if (!ctx.open) return;
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          api.send({ type: 'CLOSE' });
        }
      };
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }, [ctx.open, api]);

    // ── Keyboard navigation ──
    const getNavigableItems = useCallback((menuItems: ContextMenuItem[]): ContextMenuItem[] => {
      return menuItems.filter((item) => item.type !== 'separator' && !item.disabled);
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      const navigable = getNavigableItems(items);
      if (navigable.length === 0) return;

      const currentIndex = navigable.findIndex((item) => item.id === ctx.highlightedId);

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          const nextIndex = currentIndex < navigable.length - 1 ? currentIndex + 1 : 0;
          const nextItem = navigable[nextIndex];
          if (nextItem) {
            api.send({ type: 'HIGHLIGHT', itemId: nextItem.id });
          }
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : navigable.length - 1;
          const prevItem = navigable[prevIndex];
          if (prevItem) {
            api.send({ type: 'HIGHLIGHT', itemId: prevItem.id });
          }
          break;
        }
        case 'ArrowRight': {
          if (ctx.highlightedId) {
            const item = items.find((i) => i.id === ctx.highlightedId);
            if (item && item.type === 'submenu') {
              api.send({ type: 'OPEN_SUBMENU', itemId: item.id });
            }
          }
          break;
        }
        case 'ArrowLeft': {
          api.send({ type: 'CLOSE_SUBMENU' });
          break;
        }
        case 'Enter':
        case ' ': {
          e.preventDefault();
          if (ctx.highlightedId) {
            const item = items.find((i) => i.id === ctx.highlightedId);
            if (item && item.type === 'submenu') {
              api.send({ type: 'OPEN_SUBMENU', itemId: item.id });
            } else {
              api.send({ type: 'SELECT', itemId: ctx.highlightedId });
            }
          }
          break;
        }
      }
    }, [items, ctx.highlightedId, api, getNavigableItems]);

    // ── Focus on open ──
    useEffect(() => {
      if (ctx.open) {
        const timer = setTimeout(() => {
          menuRef.current?.focus();
        }, 10);
        return () => clearTimeout(timer);
      }
    }, [ctx.open]);

    // ── Trigger clone ──
    const triggerElement = isValidElement(children)
      ? cloneElement(children as React.ReactElement<Record<string, unknown>>, {
          onContextMenu: (e: React.MouseEvent) => {
            handleContextMenu(e);
            const orig = (children as React.ReactElement<Record<string, unknown>>).props.onContextMenu;
            if (typeof orig === 'function') orig(e);
          },
        })
      : children;

    // ── Slots ──
    const menuSlot = getSlotProps('menu', contextMenuStyle, classNames, styles);
    const sepSlot = getSlotProps('separator', contextMenuSeparatorStyle, classNames, styles);
    const iconSlot = getSlotProps('itemIcon', contextMenuItemIconStyle, classNames, styles);
    const labelSlot = getSlotProps('itemLabel', contextMenuItemLabelStyle, classNames, styles);
    const shortcutSlot = getSlotProps('itemShortcut', contextMenuItemShortcutStyle, classNames, styles);
    const submenuSlot = getSlotProps('submenu', contextMenuSubmenuStyle, classNames, styles);

    const menuClassName = className
      ? `${menuSlot.className} ${className}`
      : menuSlot.className;

    // ── Render item ──
    function renderItem(item: ContextMenuItem) {
      if (item.type === 'separator') {
        return (
          <div
            key={item.id}
            className={sepSlot.className}
            style={sepSlot.style}
            role="separator"
            data-testid="context-menu-separator"
          />
        );
      }

      const isHighlighted = ctx.highlightedId === item.id;
      const isDisabled = item.disabled === true;
      const isSubmenu = item.type === 'submenu';
      const isSubmenuOpen = ctx.openSubmenuId === item.id;

      let itemClass = contextMenuItemStyle;
      if (isDisabled) itemClass = contextMenuItemDisabledStyle;
      else if (isHighlighted) itemClass = contextMenuItemHighlightedStyle;

      const itemSlot = getSlotProps('item', itemClass, classNames, styles);

      return (
        <div
          key={item.id}
          className={itemSlot.className}
          style={itemSlot.style}
          role="menuitem"
          aria-disabled={isDisabled || undefined}
          data-item-id={item.id}
          data-highlighted={isHighlighted || undefined}
          data-testid="context-menu-item"
          onClick={() => {
            if (isDisabled) return;
            if (isSubmenu) {
              api.send({ type: 'OPEN_SUBMENU', itemId: item.id });
            } else {
              api.send({ type: 'SELECT', itemId: item.id });
            }
          }}
          onMouseEnter={() => {
            if (!isDisabled) {
              api.send({ type: 'HIGHLIGHT', itemId: item.id });
              if (isSubmenu) {
                api.send({ type: 'OPEN_SUBMENU', itemId: item.id });
              } else {
                api.send({ type: 'CLOSE_SUBMENU' });
              }
            }
          }}
          onMouseLeave={() => {
            if (!isSubmenuOpen) {
              api.send({ type: 'HIGHLIGHT', itemId: null });
            }
          }}
        >
          {item.icon !== undefined && item.icon !== null && (() => {
            const iconNode = item.icon as React.ReactNode;
            return (
              <span className={iconSlot.className} style={iconSlot.style}>
                {iconNode}
              </span>
            );
          })()}
          <span className={labelSlot.className} style={labelSlot.style}>
            {item.label}
          </span>
          {item.shortcut && (
            <span
              className={shortcutSlot.className}
              style={{
                ...shortcutSlot.style,
                ...(isHighlighted ? { color: 'var(--rel-color-text-inverse-muted, rgba(255,255,255,0.7))' } : {}),
              }}
              data-testid="context-menu-shortcut"
            >
              {item.shortcut}
            </span>
          )}
          {isSubmenu && (
            <span className={contextMenuItemSubmenuArrowStyle}>
              <ChevronRightIcon size={12} aria-hidden="true" />
            </span>
          )}
          {isSubmenu && isSubmenuOpen && item.children && (
            <div
              className={submenuSlot.className}
              style={{
                ...submenuSlot.style,
                top: 0,
                left: '100%',
                marginLeft: 2,
              }}
              role="menu"
              data-testid="context-menu-submenu"
            >
              {item.children.map((child) => renderItem(child))}
            </div>
          )}
        </div>
      );
    }

    // ── Render ──
    const menu = ctx.open ? createPortal(
      <div
        ref={(el) => {
          (menuRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }}
        className={menuClassName}
        style={{
          ...menuSlot.style,
          ...styleProp,
          top: ctx.y,
          left: ctx.x,
        }}
        role="menu"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        data-testid="context-menu"
      >
        {items.map((item) => renderItem(item))}
      </div>,
      document.body,
    ) : null;

    return (
      <>
        {triggerElement}
        {menu}
      </>
    );
  },
);

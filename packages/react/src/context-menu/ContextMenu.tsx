/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * ContextMenu — sag tik ile acilan menu bilesen (Dual API).
 * ContextMenu — right-click context menu component (Dual API).
 *
 * Props-based: `<ContextMenu items={[...]} onSelect={fn}><div>Trigger</div></ContextMenu>`
 * Compound:
 * ```tsx
 * <ContextMenu onSelect={fn}>
 *   <ContextMenu.Trigger><div>Trigger</div></ContextMenu.Trigger>
 *   <ContextMenu.Menu>
 *     <ContextMenu.Item id="cut" label="Kes" shortcut="Ctrl+X" />
 *     <ContextMenu.Separator />
 *     <ContextMenu.Submenu id="export" label="Export">
 *       <ContextMenu.Item id="pdf" label="PDF" />
 *     </ContextMenu.Submenu>
 *   </ContextMenu.Menu>
 * </ContextMenu>
 * ```
 *
 * @packageDocumentation
 */

import {
  forwardRef,
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useReducer,
  useCallback,
  cloneElement,
  isValidElement,
  Children,
  type ReactNode,
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
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';
import {
  createContextMenu,
  type ContextMenuAPI,
  type ContextMenuItem as CoreContextMenuItem,
  type ContextMenuContext as CoreCtx,
} from '@relteco/relui-core';
import { ChevronRightIcon } from '@relteco/relui-icons';

// ── Slot ──────────────────────────────────────────────

/** ContextMenu slot isimleri / ContextMenu slot names. */
export type ContextMenuSlot =
  | 'root'
  | 'menu'
  | 'item'
  | 'itemIcon'
  | 'itemLabel'
  | 'itemShortcut'
  | 'separator'
  | 'submenu';

// ── Context (Compound API) ──────────────────────────

interface ContextMenuContextValue {
  api: ContextMenuAPI;
  ctx: CoreCtx;
  classNames: ClassNames<ContextMenuSlot> | undefined;
  styles: Styles<ContextMenuSlot> | undefined;
  handleContextMenu: (e: React.MouseEvent) => void;
  onSelectItem: (itemId: string) => void;
}

const ContextMenuContext = createContext<ContextMenuContextValue | null>(null);

function useContextMenuContext(): ContextMenuContextValue {
  const ctxVal = useContext(ContextMenuContext);
  if (!ctxVal) throw new Error('ContextMenu compound sub-components must be used within <ContextMenu>.');
  return ctxVal;
}

// ── Compound: ContextMenu.Trigger ───────────────────

/** ContextMenu.Trigger props */
export interface ContextMenuTriggerProps {
  /** Trigger icerigi / Trigger content */
  children: ReactNode;
}

const ContextMenuTrigger = forwardRef<HTMLDivElement, ContextMenuTriggerProps>(
  function ContextMenuTrigger(props, ref) {
    const { children } = props;
    const ctxVal = useContextMenuContext();

    if (isValidElement(children)) {
      return cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        ref,
        onContextMenu: (e: React.MouseEvent) => {
          ctxVal.handleContextMenu(e);
          const orig = (children as React.ReactElement<Record<string, unknown>>).props.onContextMenu;
          if (typeof orig === 'function') orig(e);
        },
      });
    }

    return (
      <div ref={ref} onContextMenu={ctxVal.handleContextMenu} data-testid="context-menu-trigger">
        {children}
      </div>
    );
  },
);

// ── Compound: ContextMenu.Item ──────────────────────

/** ContextMenu.Item props */
export interface ContextMenuItemProps {
  /** Benzersiz id / Unique id */
  id: string;
  /** Etiket / Label */
  label: string;
  /** Ikon / Icon */
  icon?: ReactNode;
  /** Kisayol / Shortcut text */
  shortcut?: string;
  /** Devre disi / Disabled */
  disabled?: boolean;
  /** Ek className / Additional className */
  className?: string;
}

const ContextMenuItemCompound = forwardRef<HTMLDivElement, ContextMenuItemProps>(
  function ContextMenuItem(props, ref) {
    const { id, label, icon, shortcut, disabled = false, className } = props;
    const ctxVal = useContextMenuContext();
    const isHighlighted = ctxVal.ctx.highlightedId === id;

    let itemClass = contextMenuItemStyle;
    if (disabled) itemClass = contextMenuItemDisabledStyle;
    else if (isHighlighted) itemClass = contextMenuItemHighlightedStyle;

    const itemSlot = getSlotProps('item', itemClass, ctxVal.classNames, ctxVal.styles);
    const iconSlot = getSlotProps('itemIcon', contextMenuItemIconStyle, ctxVal.classNames, ctxVal.styles);
    const labelSlot = getSlotProps('itemLabel', contextMenuItemLabelStyle, ctxVal.classNames, ctxVal.styles);
    const shortcutSlot = getSlotProps('itemShortcut', contextMenuItemShortcutStyle, ctxVal.classNames, ctxVal.styles);
    const cls = className ? `${itemSlot.className} ${className}` : itemSlot.className;

    return (
      <div
        ref={ref}
        className={cls}
        style={itemSlot.style}
        role="menuitem"
        aria-disabled={disabled || undefined}
        data-item-id={id}
        data-highlighted={isHighlighted || undefined}
        data-testid="context-menu-item"
        onClick={() => {
          if (!disabled) {
            ctxVal.onSelectItem(id);
            ctxVal.api.send({ type: 'CLOSE' });
          }
        }}
        onMouseEnter={() => {
          if (!disabled) {
            ctxVal.api.send({ type: 'HIGHLIGHT', itemId: id });
            ctxVal.api.send({ type: 'CLOSE_SUBMENU' });
          }
        }}
        onMouseLeave={() => {
          ctxVal.api.send({ type: 'HIGHLIGHT', itemId: null });
        }}
      >
        {icon !== undefined && icon !== null && (
          <span className={iconSlot.className} style={iconSlot.style}>{icon}</span>
        )}
        <span className={labelSlot.className} style={labelSlot.style}>{label}</span>
        {shortcut && (
          <span
            className={shortcutSlot.className}
            style={{
              ...shortcutSlot.style,
              ...(isHighlighted ? { color: 'var(--rel-color-text-inverse-muted, rgba(255,255,255,0.7))' } : {}),
            }}
            data-testid="context-menu-shortcut"
          >
            {shortcut}
          </span>
        )}
      </div>
    );
  },
);

// ── Compound: ContextMenu.Separator ─────────────────

/** ContextMenu.Separator props */
export interface ContextMenuSeparatorProps {
  /** Ek className / Additional className */
  className?: string;
}

const ContextMenuSeparatorCompound = forwardRef<HTMLDivElement, ContextMenuSeparatorProps>(
  function ContextMenuSeparator(props, ref) {
    const { className } = props;
    const ctxVal = useContextMenuContext();
    const sepSlot = getSlotProps('separator', contextMenuSeparatorStyle, ctxVal.classNames, ctxVal.styles);
    const cls = className ? `${sepSlot.className} ${className}` : sepSlot.className;

    return (
      <div
        ref={ref}
        className={cls}
        style={sepSlot.style}
        role="separator"
        data-testid="context-menu-separator"
      />
    );
  },
);

// ── Compound: ContextMenu.Submenu ───────────────────

/** ContextMenu.Submenu props */
export interface ContextMenuSubmenuProps {
  /** Benzersiz id / Unique id */
  id: string;
  /** Etiket / Label */
  label: string;
  /** Ikon / Icon */
  icon?: ReactNode;
  /** Alt menu icerigi / Submenu content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const ContextMenuSubmenuCompound = forwardRef<HTMLDivElement, ContextMenuSubmenuProps>(
  function ContextMenuSubmenu(props, ref) {
    const { id, label, icon, children, className } = props;
    const ctxVal = useContextMenuContext();
    const isHighlighted = ctxVal.ctx.highlightedId === id;
    const [isSubmenuOpen, setSubmenuOpen] = useState(false);

    // Menu kapaninca submenu de kapansin
    useEffect(() => {
      if (!ctxVal.ctx.open) setSubmenuOpen(false);
    }, [ctxVal.ctx.open]);

    const itemClass = isHighlighted ? contextMenuItemHighlightedStyle : contextMenuItemStyle;
    const itemSlot = getSlotProps('item', itemClass, ctxVal.classNames, ctxVal.styles);
    const iconSlot = getSlotProps('itemIcon', contextMenuItemIconStyle, ctxVal.classNames, ctxVal.styles);
    const labelSlot = getSlotProps('itemLabel', contextMenuItemLabelStyle, ctxVal.classNames, ctxVal.styles);
    const submenuSlot = getSlotProps('submenu', contextMenuSubmenuStyle, ctxVal.classNames, ctxVal.styles);
    const cls = className ? `${itemSlot.className} ${className}` : itemSlot.className;

    return (
      <div
        ref={ref}
        className={cls}
        style={{ ...itemSlot.style, position: 'relative' }}
        role="menuitem"
        aria-haspopup="true"
        aria-expanded={isSubmenuOpen}
        data-item-id={id}
        data-highlighted={isHighlighted || undefined}
        data-testid="context-menu-item"
        onClick={() => setSubmenuOpen(true)}
        onMouseEnter={() => {
          ctxVal.api.send({ type: 'HIGHLIGHT', itemId: id });
          setSubmenuOpen(true);
        }}
        onMouseLeave={() => {
          if (!isSubmenuOpen) {
            ctxVal.api.send({ type: 'HIGHLIGHT', itemId: null });
          }
        }}
      >
        {icon !== undefined && icon !== null && (
          <span className={iconSlot.className} style={iconSlot.style}>{icon}</span>
        )}
        <span className={labelSlot.className} style={labelSlot.style}>{label}</span>
        <span className={contextMenuItemSubmenuArrowStyle}>
          <ChevronRightIcon size={12} aria-hidden="true" />
        </span>
        {isSubmenuOpen && (
          <div
            className={submenuSlot.className}
            style={{ ...submenuSlot.style, top: 0, left: '100%', marginLeft: 2 }}
            role="menu"
            data-testid="context-menu-submenu"
          >
            {children}
          </div>
        )}
      </div>
    );
  },
);

// ── Compound: ContextMenu.Menu ──────────────────────

/** ContextMenu.Menu props */
export interface ContextMenuMenuProps {
  /** Menu icerigi / Menu content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const ContextMenuMenu = forwardRef<HTMLDivElement, ContextMenuMenuProps>(
  function ContextMenuMenu(props, ref) {
    const { children, className } = props;
    const ctxVal = useContextMenuContext();

    // keyboard collection: gather item ids from children for arrow nav
    const collectItemIds = useCallback((): string[] => {
      const ids: string[] = [];
      Children.forEach(children, (child) => {
        if (isValidElement(child)) {
          const childProps = child.props as Record<string, unknown>;
          if (typeof childProps.id === 'string') ids.push(childProps.id);
        }
      });
      return ids;
    }, [children]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      const navigable = collectItemIds();
      if (navigable.length === 0) return;
      const currentIndex = navigable.indexOf(ctxVal.ctx.highlightedId ?? '');

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          const nextIndex = currentIndex < navigable.length - 1 ? currentIndex + 1 : 0;
          const nextId = navigable[nextIndex];
          if (nextId) ctxVal.api.send({ type: 'HIGHLIGHT', itemId: nextId });
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : navigable.length - 1;
          const prevId = navigable[prevIndex];
          if (prevId) ctxVal.api.send({ type: 'HIGHLIGHT', itemId: prevId });
          break;
        }
        case 'ArrowRight': {
          if (ctxVal.ctx.highlightedId) {
            ctxVal.api.send({ type: 'OPEN_SUBMENU', itemId: ctxVal.ctx.highlightedId });
          }
          break;
        }
        case 'ArrowLeft': {
          ctxVal.api.send({ type: 'CLOSE_SUBMENU' });
          break;
        }
        case 'Enter':
        case ' ': {
          e.preventDefault();
          if (ctxVal.ctx.highlightedId) {
            ctxVal.api.send({ type: 'SELECT', itemId: ctxVal.ctx.highlightedId });
          }
          break;
        }
      }
    }, [ctxVal, collectItemIds]);

    if (!ctxVal.ctx.open) return null;

    const menuSlot = getSlotProps('menu', contextMenuStyle, ctxVal.classNames, ctxVal.styles);
    const cls = className ? `${menuSlot.className} ${className}` : menuSlot.className;

    return createPortal(
      <div
        ref={ref}
        className={cls}
        style={{ ...menuSlot.style, top: ctxVal.ctx.y, left: ctxVal.ctx.x }}
        role="menu"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        data-testid="context-menu"
      >
        {children}
      </div>,
      document.body,
    );
  },
);

// ── Component Props ─────────────────────────────────

export interface ContextMenuComponentProps extends SlotStyleProps<ContextMenuSlot> {
  /** Props-based: menu ogeleri / Menu items */
  items?: CoreContextMenuItem[];
  /** Oge secilince callback / On item select callback */
  onSelect?: (itemId: string) => void;
  /** Trigger elementi (sag tiklanacak alan) / Trigger element (right-click area) */
  children: ReactNode;
  /** Ek className (menu'ye) / Additional className (applied to menu) */
  className?: string;
  /** Inline style (menu'ye) / Inline style (applied to menu) */
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────

const ContextMenuBase = forwardRef<HTMLDivElement, ContextMenuComponentProps>(
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
        items: items ?? [],
        onSelect: (itemId) => onSelectRef.current?.(itemId),
      });
    }
    const api = apiRef.current;

    useEffect(() => api.subscribe(() => forceRender()), [api]);

    const ctx = api.getContext();
    const menuRef = useRef<HTMLDivElement>(null);

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
        if (e.key === 'Escape') api.send({ type: 'CLOSE' });
      };
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }, [ctx.open, api]);

    // ── Focus on open ──
    useEffect(() => {
      if (ctx.open) {
        const timer = setTimeout(() => menuRef.current?.focus(), 10);
        return () => clearTimeout(timer);
      }
    }, [ctx.open]);

    // ── Context value for compound ──
    const ctxValue: ContextMenuContextValue = {
      api,
      ctx,
      classNames,
      styles,
      handleContextMenu,
      onSelectItem: (itemId: string) => onSelectRef.current?.(itemId),
    };

    // ── Detect compound mode ──
    const isCompound = !items && hasCompoundChildren(children);

    if (isCompound) {
      return (
        <ContextMenuContext.Provider value={ctxValue}>
          {children}
        </ContextMenuContext.Provider>
      );
    }

    // ── Props-based API ──
    const menuItems = items ?? [];

    // Keyboard for props-based
    const getNavigableItems = useCallback((menuItemsList: CoreContextMenuItem[]): CoreContextMenuItem[] => {
      return menuItemsList.filter((item) => item.type !== 'separator' && !item.disabled);
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      const navigable = getNavigableItems(menuItems);
      if (navigable.length === 0) return;
      const currentIndex = navigable.findIndex((item) => item.id === ctx.highlightedId);

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          const nextIndex = currentIndex < navigable.length - 1 ? currentIndex + 1 : 0;
          const nextItem = navigable[nextIndex];
          if (nextItem) api.send({ type: 'HIGHLIGHT', itemId: nextItem.id });
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : navigable.length - 1;
          const prevItem = navigable[prevIndex];
          if (prevItem) api.send({ type: 'HIGHLIGHT', itemId: prevItem.id });
          break;
        }
        case 'ArrowRight': {
          if (ctx.highlightedId) {
            const item = menuItems.find((i) => i.id === ctx.highlightedId);
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
            const item = menuItems.find((i) => i.id === ctx.highlightedId);
            if (item && item.type === 'submenu') {
              api.send({ type: 'OPEN_SUBMENU', itemId: item.id });
            } else {
              api.send({ type: 'SELECT', itemId: ctx.highlightedId });
            }
          }
          break;
        }
      }
    }, [menuItems, ctx.highlightedId, api, getNavigableItems]);

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

    // ── Render item (props-based recursive) ──
    function renderItem(item: CoreContextMenuItem) {
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

      const itemSlotLocal = getSlotProps('item', itemClass, classNames, styles);

      return (
        <div
          key={item.id}
          className={itemSlotLocal.className}
          style={itemSlotLocal.style}
          role="menuitem"
          aria-disabled={isDisabled || undefined}
          data-item-id={item.id}
          data-highlighted={isHighlighted || undefined}
          data-testid="context-menu-item"
          onClick={() => {
            if (isDisabled) return;
            if (isSubmenu) api.send({ type: 'OPEN_SUBMENU', itemId: item.id });
            else api.send({ type: 'SELECT', itemId: item.id });
          }}
          onMouseEnter={() => {
            if (!isDisabled) {
              api.send({ type: 'HIGHLIGHT', itemId: item.id });
              if (isSubmenu) api.send({ type: 'OPEN_SUBMENU', itemId: item.id });
              else api.send({ type: 'CLOSE_SUBMENU' });
            }
          }}
          onMouseLeave={() => {
            if (!isSubmenuOpen) api.send({ type: 'HIGHLIGHT', itemId: null });
          }}
        >
          {item.icon !== undefined && item.icon !== null && (
            <span className={iconSlot.className} style={iconSlot.style}>
              {item.icon as ReactNode}
            </span>
          )}
          <span className={labelSlot.className} style={labelSlot.style}>{item.label}</span>
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
              style={{ ...submenuSlot.style, top: 0, left: '100%', marginLeft: 2 }}
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
        style={{ ...menuSlot.style, ...styleProp, top: ctx.y, left: ctx.x }}
        role="menu"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        data-testid="context-menu"
      >
        {menuItems.map((item) => renderItem(item))}
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

// ── Helpers ──────────────────────────────────────────

function hasCompoundChildren(children: ReactNode): boolean {
  let found = false;
  Children.forEach(children, (child) => {
    if (isValidElement(child) && (
      child.type === ContextMenuTrigger ||
      child.type === ContextMenuMenu
    )) {
      found = true;
    }
  });
  return found;
}

/** Compound children dan core items olusturur / Collects core items from compound children */
export function collectItemsFromChildren(children: ReactNode): CoreContextMenuItem[] {
  const result: CoreContextMenuItem[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const childProps = child.props as Record<string, unknown>;

    if (child.type === ContextMenuItemCompound) {
      result.push({
        id: childProps.id as string,
        label: childProps.label as string,
        shortcut: childProps.shortcut as string | undefined,
        disabled: childProps.disabled as boolean | undefined,
      });
    } else if (child.type === ContextMenuSeparatorCompound) {
      result.push({ id: `sep-${result.length}`, type: 'separator' });
    } else if (child.type === ContextMenuSubmenuCompound) {
      result.push({
        id: childProps.id as string,
        label: childProps.label as string,
        type: 'submenu',
        children: collectItemsFromChildren(childProps.children as ReactNode),
      });
    }
  });
  return result;
}

// ── Export ────────────────────────────────────────────

/**
 * ContextMenu bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <ContextMenu items={[{ id: 'cut', label: 'Kes' }]} onSelect={(id) => {}}>
 *   <div>Sag tikla</div>
 * </ContextMenu>
 * ```
 *
 * @example Compound
 * ```tsx
 * <ContextMenu onSelect={(id) => {}}>
 *   <ContextMenu.Trigger><div>Sag tikla</div></ContextMenu.Trigger>
 *   <ContextMenu.Menu>
 *     <ContextMenu.Item id="cut" label="Kes" />
 *     <ContextMenu.Separator />
 *     <ContextMenu.Submenu id="more" label="Daha fazla">
 *       <ContextMenu.Item id="sub1" label="Alt oge" />
 *     </ContextMenu.Submenu>
 *   </ContextMenu.Menu>
 * </ContextMenu>
 * ```
 */
export const ContextMenu = Object.assign(ContextMenuBase, {
  Trigger: ContextMenuTrigger,
  Menu: ContextMenuMenu,
  Item: ContextMenuItemCompound,
  Separator: ContextMenuSeparatorCompound,
  Submenu: ContextMenuSubmenuCompound,
});

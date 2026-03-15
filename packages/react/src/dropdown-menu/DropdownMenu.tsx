/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * DropdownMenu — trigger butonuna tiklanarak acilan menu bilesen.
 * DropdownMenu — menu component opened by clicking a trigger button.
 *
 * @packageDocumentation
 */

import {
  forwardRef,
  createContext,
  useContext,
  useRef,
  useEffect,
  useReducer,
  useCallback,
  cloneElement,
  isValidElement,
  Children,
  useState,
  type ReactNode,
  type ReactElement,
} from 'react';
import { createPortal } from 'react-dom';
import {
  dropdownMenuStyle,
  dropdownMenuItemStyle,
  dropdownMenuItemDisabledStyle,
  dropdownMenuItemHighlightedStyle,
  dropdownMenuItemIconStyle,
  dropdownMenuItemLabelStyle,
  dropdownMenuItemShortcutStyle,
  dropdownMenuItemSubmenuArrowStyle,
  dropdownMenuSeparatorStyle,
  dropdownMenuSubmenuStyle,
} from './dropdown-menu.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';
import {
  createDropdownMenu,
  type DropdownMenuAPI,
  type DropdownMenuPlacement,
} from '@relteco/relui-core';
import type { ContextMenuItem } from '@relteco/relui-core';
import { ChevronRightIcon, ChevronDownIcon } from '@relteco/relui-icons';

import type { ClassNames, Styles } from '../utils/slot-styles';

// ── Context (Compound API) ──────────────────────────

interface DropdownMenuContextValue {
  classNames: ClassNames<DropdownMenuSlot> | undefined;
  styles: Styles<DropdownMenuSlot> | undefined;
}

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);

export function useDropdownMenuContext(): DropdownMenuContextValue {
  const ctx = useContext(DropdownMenuContext);
  if (!ctx) throw new Error('DropdownMenu compound sub-components must be used within <DropdownMenu>.');
  return ctx;
}

// ── Compound: DropdownMenu.Item ──────────────────────

/** DropdownMenu.Item props */
export interface DropdownMenuItemProps {
  /** Oge kimlik / Item id */
  id: string;
  /** Etiket / Label */
  label: ReactNode;
  /** Ikon / Icon */
  icon?: ReactNode;
  /** Kisayol / Shortcut */
  shortcut?: string;
  /** Devre disi / Disabled */
  disabled?: boolean;
  /** Alt ogeler (submenu) / Sub-items */
  children?: ReactNode;
}

const DropdownMenuItem = forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  function DropdownMenuItem(_props, _ref) {
    return null;
  },
);

// ── Compound: DropdownMenu.Separator ─────────────────

/** DropdownMenu.Separator props */
export interface DropdownMenuSeparatorProps {
  /** Oge kimlik / Item id */
  id?: string;
}

const DropdownMenuSeparator = forwardRef<HTMLDivElement, DropdownMenuSeparatorProps>(
  function DropdownMenuSeparator(_props, _ref) {
    return null;
  },
);

// ── Compound: DropdownMenu.Group ─────────────────────

/** DropdownMenu.Group props */
export interface DropdownMenuGroupProps {
  /** Grup etiketi / Group label */
  label?: ReactNode;
  /** Alt ogeler / Child items */
  children?: ReactNode;
}

const DropdownMenuGroup = forwardRef<HTMLDivElement, DropdownMenuGroupProps>(
  function DropdownMenuGroup(_props, _ref) {
    return null;
  },
);

// ── Compound children → items converter ──────────────

function compoundChildrenToItems(children: ReactNode): ContextMenuItem[] {
  const result: ContextMenuItem[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (child.type === DropdownMenuSeparator) {
      const sepProps = child.props as DropdownMenuSeparatorProps;
      result.push({ id: sepProps.id ?? `sep-${result.length}`, type: 'separator', label: '' });
    } else if (child.type === DropdownMenuItem) {
      const itemProps = child.props as DropdownMenuItemProps;
      const item: ContextMenuItem = {
        id: itemProps.id,
        label: itemProps.label as string,
        icon: itemProps.icon as React.ReactNode,
        shortcut: itemProps.shortcut,
        disabled: itemProps.disabled,
      };
      if (itemProps.children) {
        item.type = 'submenu';
        item.children = compoundChildrenToItems(itemProps.children);
      }
      result.push(item);
    } else if (child.type === DropdownMenuGroup) {
      const groupProps = child.props as DropdownMenuGroupProps;
      if (groupProps.children) {
        const groupItems = compoundChildrenToItems(groupProps.children);
        result.push(...groupItems);
      }
    }
  });
  return result;
}

// ── Slot ──────────────────────────────────────────────

/**
 * DropdownMenu slot isimleri / DropdownMenu slot names.
 */
export type DropdownMenuSlot =
  | 'root'
  | 'trigger'
  | 'menu'
  | 'item'
  | 'itemIcon'
  | 'itemLabel'
  | 'itemShortcut'
  | 'separator'
  | 'submenu';

// ── Component Props ─────────────────────────────────

export interface DropdownMenuComponentProps extends SlotStyleProps<DropdownMenuSlot> {
  /** Menu ogeleri (props-based) / Menu items (props-based) */
  items?: ContextMenuItem[];
  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
  /** Oge secilince callback / On item select callback */
  onSelect?: (itemId: string) => void;
  /** Yerlesim / Placement */
  placement?: DropdownMenuPlacement;
  /** Trigger elementi / Trigger element */
  trigger: ReactElement;
  /** Trigger'da chevron goster / Show chevron on trigger */
  showChevron?: boolean;
  /** Portal hedefi / Portal container */
  portalContainer?: HTMLElement;
  /** Ek className (menu'ye) / Additional className (applied to menu) */
  className?: string;
  /** Inline style (menu'ye) / Inline style (applied to menu) */
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────

/**
 * DropdownMenu bilesen — trigger butonuna tiklanarak acilan menu.
 * DropdownMenu component — menu opened by clicking a trigger button.
 *
 * @example
 * ```tsx
 * <DropdownMenu
 *   trigger={<button>Islemler</button>}
 *   items={[
 *     { id: 'edit', label: 'Duzenle' },
 *     { id: 'delete', label: 'Sil' },
 *   ]}
 *   onSelect={(id) => console.log(id)}
 * />
 * ```
 */
const DropdownMenuBase = forwardRef<HTMLDivElement, DropdownMenuComponentProps>(
  function DropdownMenu(props, ref) {
    const {
      items: itemsProp,
      children: compoundChildren,
      onSelect,
      placement = 'bottom-start',
      trigger,
      showChevron = true,
      portalContainer,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    // ── Resolve items (props-based or compound) ──
    const items = itemsProp ?? (compoundChildren ? compoundChildrenToItems(compoundChildren) : []);

    const [, forceRender] = useReducer((c: number) => c + 1, 0);

    // ── Core API ──
    const onSelectRef = useRef(onSelect);
    onSelectRef.current = onSelect;

    const apiRef = useRef<DropdownMenuAPI | null>(null);
    if (!apiRef.current) {
      apiRef.current = createDropdownMenu({
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

    // ── Refs ──
    const triggerRef = useRef<HTMLElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);

    // ── Toggle ──
    const handleTriggerClick = useCallback(() => {
      api.send({ type: 'TOGGLE' });
    }, [api]);

    // ── Position calculation ──
    useEffect(() => {
      if (!ctx.open) {
        setMenuPosition(null);
        return;
      }

      const triggerEl = triggerRef.current;
      if (!triggerEl) return;

      const calculate = () => {
        const triggerRect = triggerEl.getBoundingClientRect();
        const portalTarget = portalContainer ?? document.body;
        const portalRect = portalTarget === document.body
          ? new DOMRect(0, 0, window.innerWidth, window.innerHeight)
          : portalTarget.getBoundingClientRect();

        let top = 0;
        let left = 0;

        switch (placement) {
          case 'bottom-start':
            top = triggerRect.bottom + 4 - portalRect.top;
            left = triggerRect.left - portalRect.left;
            break;
          case 'bottom-end':
            top = triggerRect.bottom + 4 - portalRect.top;
            left = triggerRect.right - portalRect.left;
            break;
          case 'top-start':
            top = triggerRect.top - 4 - portalRect.top;
            left = triggerRect.left - portalRect.left;
            break;
          case 'top-end':
            top = triggerRect.top - 4 - portalRect.top;
            left = triggerRect.right - portalRect.left;
            break;
        }

        setMenuPosition({ top, left });
      };

      const raf = requestAnimationFrame(calculate);
      return () => cancelAnimationFrame(raf);
    }, [ctx.open, placement, portalContainer]);

    // ── Outside click ──
    useEffect(() => {
      if (!ctx.open) return;
      const handleClick = (e: MouseEvent) => {
        const target = e.target as Node;
        const triggerEl = triggerRef.current;
        const menuEl = menuRef.current;
        if (triggerEl && triggerEl.contains(target)) return;
        if (menuEl && menuEl.contains(target)) return;
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
        const timer = setTimeout(() => menuRef.current?.focus(), 10);
        return () => clearTimeout(timer);
      }
    }, [ctx.open]);

    // ── Portal target ──
    const anchorRef = useRef<HTMLSpanElement>(null);
    const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

    useEffect(() => {
      if (portalContainer) {
        setPortalTarget(portalContainer);
        return;
      }
      const anchor = anchorRef.current;
      if (!anchor) return;
      const themeContainer = anchor.closest('[data-theme]') as HTMLElement | null;
      setPortalTarget(themeContainer ?? document.body);
    }, [portalContainer]);

    // ── Trigger clone ──
    const triggerElement = isValidElement(trigger)
      ? cloneElement(trigger as React.ReactElement<Record<string, unknown>>, {
          ref: triggerRef,
          onClick: (e: React.MouseEvent) => {
            handleTriggerClick();
            const orig = (trigger as React.ReactElement<Record<string, unknown>>).props.onClick;
            if (typeof orig === 'function') orig(e);
          },
          'aria-expanded': ctx.open,
          'aria-haspopup': 'menu',
        })
      : trigger;

    // ── Slots ──
    const menuSlot = getSlotProps('menu', dropdownMenuStyle, classNames, styles);
    const sepSlot = getSlotProps('separator', dropdownMenuSeparatorStyle, classNames, styles);
    const iconSlot = getSlotProps('itemIcon', dropdownMenuItemIconStyle, classNames, styles);
    const labelSlot = getSlotProps('itemLabel', dropdownMenuItemLabelStyle, classNames, styles);
    const shortcutSlot = getSlotProps('itemShortcut', dropdownMenuItemShortcutStyle, classNames, styles);
    const submenuSlot = getSlotProps('submenu', dropdownMenuSubmenuStyle, classNames, styles);

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
            data-testid="dropdown-menu-separator"
          />
        );
      }

      const isHighlighted = ctx.highlightedId === item.id;
      const isDisabled = item.disabled === true;
      const isSubmenu = item.type === 'submenu';
      const isSubmenuOpen = ctx.openSubmenuId === item.id;

      let itemClass = dropdownMenuItemStyle;
      if (isDisabled) itemClass = dropdownMenuItemDisabledStyle;
      else if (isHighlighted) itemClass = dropdownMenuItemHighlightedStyle;

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
          data-testid="dropdown-menu-item"
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
              data-testid="dropdown-menu-shortcut"
            >
              {item.shortcut}
            </span>
          )}
          {isSubmenu && (
            <span className={dropdownMenuItemSubmenuArrowStyle}>
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
              data-testid="dropdown-menu-submenu"
            >
              {item.children.map((child) => renderItem(child))}
            </div>
          )}
        </div>
      );
    }

    // ── Render ──
    const anchor = <span ref={anchorRef} style={{ display: 'none' }} data-testid="dropdown-menu-anchor" />;

    // ── Menu position style ──
    const menuStyle: React.CSSProperties = {
      ...menuSlot.style,
      ...styleProp,
    };

    if (menuPosition) {
      menuStyle.top = menuPosition.top;
      menuStyle.left = menuPosition.left;
      // bottom-end ve top-end icin saga hizala
      if (placement === 'bottom-end' || placement === 'top-end') {
        menuStyle.transform = 'translateX(-100%)';
      }
      // top placement icin yukari hizala
      if (placement === 'top-start' || placement === 'top-end') {
        menuStyle.transform = (menuStyle.transform ?? '') + ' translateY(-100%)';
      }
    } else {
      menuStyle.top = -9999;
      menuStyle.left = -9999;
      menuStyle.visibility = 'hidden';
    }

    const menu = ctx.open && portalTarget ? createPortal(
      <div
        ref={(el) => {
          (menuRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }}
        className={menuClassName}
        style={menuStyle}
        role="menu"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        data-placement={placement}
        data-testid="dropdown-menu"
      >
        {items.map((item) => renderItem(item))}
      </div>,
      portalTarget,
    ) : null;

    return (
      <>
        {anchor}
        <span style={{ display: 'inline-flex', alignItems: 'center' }} data-testid="dropdown-menu-trigger-wrapper">
          {triggerElement}
          {showChevron && (
            <ChevronDownIcon
              size={14}
              aria-hidden="true"
              style={{ marginLeft: 4, opacity: 0.6, pointerEvents: 'none' }}
            />
          )}
        </span>
        {menu}
      </>
    );
  },
);

// ── Export ─────────────────────────────────────────────

export const DropdownMenu = Object.assign(DropdownMenuBase, {
  Item: DropdownMenuItem,
  Separator: DropdownMenuSeparator,
  Group: DropdownMenuGroup,
});

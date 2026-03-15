/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Navbar — styled ust navigasyon cubugu bilesen (Dual API).
 * Navbar — styled top navigation bar component (Dual API).
 *
 * Props-based: `<Navbar items={[...]} brand={<Logo />} />`
 * Compound:    `<Navbar><Navbar.Brand>Logo</Navbar.Brand><Navbar.Items>...</Navbar.Items></Navbar>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { NavbarSize, NavbarVariant, NavbarItem } from '@relteco/relui-core';
import { useNavbar, type UseNavbarProps } from './useNavbar';
import {
  navbarRootRecipe,
  navbarBrandStyle,
  navbarItemStyle,
  navbarItemIconStyle,
  navbarItemLabelStyle,
  navbarMobileToggleStyle,
  navbarMobileMenuStyle,
  navbarDesktopContentStyle,
  navbarDesktopActionsStyle,
} from './navbar.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

/**
 * Navbar slot isimleri / Navbar slot names.
 */
export type NavbarSlot =
  | 'root'
  | 'brand'
  | 'content'
  | 'item'
  | 'itemIcon'
  | 'itemLabel'
  | 'actions'
  | 'mobileToggle'
  | 'mobileMenu';

// ── Context (Compound API) ──────────────────────────────────────

interface NavbarContextValue {
  size: NavbarSize;
  variant: NavbarVariant;
  classNames: ClassNames<NavbarSlot> | undefined;
  styles: Styles<NavbarSlot> | undefined;
}

const NavbarContext = createContext<NavbarContextValue | null>(null);

function useNavbarContext(): NavbarContextValue {
  const ctx = useContext(NavbarContext);
  if (!ctx) throw new Error('Navbar compound sub-components must be used within <Navbar>.');
  return ctx;
}

// ── Compound: Navbar.Brand ──────────────────────────────────────

/** Navbar.Brand props */
export interface NavbarBrandProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const NavbarBrand = forwardRef<HTMLDivElement, NavbarBrandProps>(
  function NavbarBrand(props, ref) {
    const { children, className } = props;
    const ctx = useNavbarContext();
    const slot = getSlotProps('brand', navbarBrandStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="navbar-brand">
        {children}
      </div>
    );
  },
);

// ── Compound: Navbar.Items ──────────────────────────────────────

/** Navbar.Items props */
export interface NavbarItemsProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const NavbarItems = forwardRef<HTMLDivElement, NavbarItemsProps>(
  function NavbarItems(props, ref) {
    const { children, className } = props;
    const ctx = useNavbarContext();
    const slot = getSlotProps('content', navbarDesktopContentStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="navbar-items">
        {children}
      </div>
    );
  },
);

// ── Compound: Navbar.Item ───────────────────────────────────────

/** Navbar.Item props */
export interface NavbarItemProps {
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
}

const NavbarItemComponent = forwardRef<HTMLElement, NavbarItemProps>(
  function NavbarItem(props, ref) {
    const { children, className, active, disabled, onClick, href } = props;
    const ctx = useNavbarContext();
    const slot = getSlotProps('item', navbarItemStyle, ctx.classNames, ctx.styles);
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
        data-testid="navbar-item"
        data-active={active ? '' : undefined}
        aria-current={active ? 'page' : undefined}
        aria-disabled={disabled ? 'true' : undefined}
        onClick={disabled ? undefined : onClick}
        {...elementProps}
      >
        {children}
      </Element>
    );
  },
);

// ── Compound: Navbar.Actions ────────────────────────────────────

/** Navbar.Actions props */
export interface NavbarActionsProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const NavbarActions = forwardRef<HTMLDivElement, NavbarActionsProps>(
  function NavbarActions(props, ref) {
    const { children, className } = props;
    const ctx = useNavbarContext();
    const slot = getSlotProps('actions', navbarDesktopActionsStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="navbar-actions">
        {children}
      </div>
    );
  },
);

// ── Navbar Component Props ─────────────────────────────────────

export interface NavbarComponentProps extends UseNavbarProps, SlotStyleProps<NavbarSlot> {
  /** Boyut / Size */
  size?: NavbarSize;

  /** Varyant / Variant */
  variant?: NavbarVariant;

  /** Ek className / Additional className */
  className?: string;

  /** Inline style / Inline style */
  style?: React.CSSProperties;

  /** id */
  id?: string;

  /** Marka/logo bolumu / Brand/logo section */
  brand?: ReactNode;

  /** Sag taraf aksiyonlari / Right-side actions */
  actions?: ReactNode;

  /** Sticky pozisyon / Sticky position */
  sticky?: boolean;

  /** Ikon render callback / Icon render callback */
  renderIcon?: (icon: string) => ReactNode;

  /** Oge render override / Item render override */
  renderItem?: (item: NavbarItem, props: { isActive: boolean }) => ReactNode;

  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
}

/**
 * Navbar bilesen — ust navigasyon cubugu.
 * Navbar component — top navigation bar.
 *
 * @example
 * ```tsx
 * <Navbar
 *   items={[
 *     { key: 'home', label: 'Ana Sayfa', href: '/' },
 *     { key: 'about', label: 'Hakkinda', href: '/about' },
 *   ]}
 *   brand={<span>Logo</span>}
 *   defaultActiveKey="home"
 * />
 * ```
 */
const NavbarBase = forwardRef<HTMLElement, NavbarComponentProps>(
  function Navbar(props, ref) {
    const {
      size = 'md',
      variant = 'solid',
      className,
      style: styleProp,
      classNames,
      styles,
      id,
      brand,
      actions,
      sticky = false,
      renderIcon,
      renderItem,
      children,
      ...navbarProps
    } = props;

    const {
      navProps,
      getItemProps,
      mobileToggleProps,
      items,
      mobileOpen,
      setActive,
      toggleMobile,
    } = useNavbar(navbarProps);

    // ── Slots ──
    const rootClass = navbarRootRecipe({ size, variant });
    const rootSlot = getSlotProps('root', rootClass, classNames, styles);
    const combinedRootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;
    const combinedRootStyle: React.CSSProperties = {
      ...rootSlot.style,
      ...styleProp,
      ...(sticky ? { position: 'sticky', top: 0, zIndex: 100 } : undefined),
    };

    const brandSlot = getSlotProps('brand', navbarBrandStyle, classNames, styles);
    const contentSlot = getSlotProps('content', navbarDesktopContentStyle, classNames, styles);
    const itemSlot = getSlotProps('item', navbarItemStyle, classNames, styles);
    const iconSlot = getSlotProps('itemIcon', navbarItemIconStyle, classNames, styles);
    const labelSlot = getSlotProps('itemLabel', navbarItemLabelStyle, classNames, styles);
    const actionsSlot = getSlotProps('actions', navbarDesktopActionsStyle, classNames, styles);
    const mobileToggleSlot = getSlotProps(
      'mobileToggle',
      navbarMobileToggleStyle,
      classNames,
      styles,
    );
    const mobileMenuSlot = getSlotProps('mobileMenu', navbarMobileMenuStyle, classNames, styles);

    const ctxValue: NavbarContextValue = { size, variant, classNames, styles };

    // ── Compound API ──
    if (children) {
      return (
        <NavbarContext.Provider value={ctxValue}>
          <nav
            ref={ref}
            className={combinedRootClassName}
            style={combinedRootStyle}
            id={id}
            data-variant={variant}
            data-sticky={sticky ? '' : undefined}
            data-testid="navbar-root"
            aria-label="Navbar"
          >
            {children}
          </nav>
        </NavbarContext.Provider>
      );
    }

    // ── Render item ──
    function renderNavItem(item: NavbarItem) {
      // Skip children-only containers in top level (they render as dropdown triggers)
      const domProps = getItemProps(item);
      const isActive = domProps['data-active'] === '';

      if (renderItem) {
        return (
          <div key={item.key}>
            {renderItem(item, { isActive })}
          </div>
        );
      }

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
        </Element>
      );
    }

    return (
      <>
        <nav
          ref={ref}
          className={combinedRootClassName}
          style={combinedRootStyle}
          id={id}
          data-variant={variant}
          data-sticky={sticky ? '' : undefined}
          {...navProps}
        >
          {/* Brand */}
          {brand && (
            <div className={brandSlot.className} style={brandSlot.style}>
              {brand}
            </div>
          )}

          {/* Desktop content */}
          <div className={contentSlot.className} style={contentSlot.style}>
            {items.map((item) => renderNavItem(item))}
          </div>

          {/* Desktop actions */}
          {actions && (
            <div className={actionsSlot.className} style={actionsSlot.style}>
              {actions}
            </div>
          )}

          {/* Mobile toggle */}
          <button
            type="button"
            className={mobileToggleSlot.className}
            style={mobileToggleSlot.style}
            onClick={toggleMobile}
            {...mobileToggleProps}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className={mobileMenuSlot.className} style={mobileMenuSlot.style} role="menu">
            {items.map((item) => renderNavItem(item))}
            {actions && (
              <div style={{ paddingTop: '8px', borderTop: `1px solid var(--rel-color-border-default)` }}>
                {actions}
              </div>
            )}
          </div>
        )}
      </>
    );
  },
);

/**
 * Navbar bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Navbar items={[...]} brand={<Logo />} defaultActiveKey="home" />
 * ```
 *
 * @example Compound
 * ```tsx
 * <Navbar>
 *   <Navbar.Brand>Logo</Navbar.Brand>
 *   <Navbar.Items>
 *     <Navbar.Item active>Ana Sayfa</Navbar.Item>
 *     <Navbar.Item href="/about">Hakkinda</Navbar.Item>
 *   </Navbar.Items>
 *   <Navbar.Actions><button>Login</button></Navbar.Actions>
 * </Navbar>
 * ```
 */
export const Navbar = Object.assign(NavbarBase, {
  Brand: NavbarBrand,
  Items: NavbarItems,
  Item: NavbarItemComponent,
  Actions: NavbarActions,
});

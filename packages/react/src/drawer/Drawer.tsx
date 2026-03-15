/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Drawer — kenardan kayan panel bilesen (Dual API).
 * Drawer — slide-in panel from edge component (Dual API).
 *
 * Props-based: `<Drawer open={open} onClose={fn} title="Menu" placement="left">Icerik</Drawer>`
 * Compound:    `<Drawer open={open} onClose={fn}><Drawer.Header>...</Drawer.Header><Drawer.Body>...</Drawer.Body></Drawer>`
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
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import {
  drawerOverlayStyle,
  drawerPanelRecipe,
  drawerHeaderStyle,
  drawerTitleStyle,
  drawerCloseButtonStyle,
  drawerBodyStyle,
  drawerFooterStyle,
} from './drawer.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';
import {
  createDrawer,
  type DrawerAPI,
  type DrawerPlacement,
  type DrawerSize,
} from '@relteco/relui-core';
import { CloseIcon } from '@relteco/relui-icons';

// ── Slot ──────────────────────────────────────────────

/**
 * Drawer slot isimleri / Drawer slot names.
 */
export type DrawerSlot =
  | 'root'
  | 'overlay'
  | 'panel'
  | 'header'
  | 'title'
  | 'closeButton'
  | 'body'
  | 'footer';

// ── Context (Compound API) ──────────────────────────

interface DrawerContextValue {
  open: boolean;
  onClose: (() => void) | undefined;
  placement: DrawerPlacement;
  classNames: ClassNames<DrawerSlot> | undefined;
  styles: Styles<DrawerSlot> | undefined;
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

function useDrawerContext(): DrawerContextValue {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error('Drawer compound sub-components must be used within <Drawer>.');
  return ctx;
}

// ── Compound: Drawer.Header ─────────────────────────

/** Drawer.Header props */
export interface DrawerHeaderProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const DrawerHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>(
  function DrawerHeader(props, ref) {
    const { children, className } = props;
    const ctx = useDrawerContext();
    const slot = getSlotProps('header', drawerHeaderStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="drawer-header">
        {children}
      </div>
    );
  },
);

// ── Compound: Drawer.Body ───────────────────────────

/** Drawer.Body props */
export interface DrawerBodyProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const DrawerBody = forwardRef<HTMLDivElement, DrawerBodyProps>(
  function DrawerBody(props, ref) {
    const { children, className } = props;
    const ctx = useDrawerContext();
    const slot = getSlotProps('body', drawerBodyStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="drawer-body">
        {children}
      </div>
    );
  },
);

// ── Compound: Drawer.Footer ─────────────────────────

/** Drawer.Footer props */
export interface DrawerFooterProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const DrawerFooter = forwardRef<HTMLDivElement, DrawerFooterProps>(
  function DrawerFooter(props, ref) {
    const { children, className } = props;
    const ctx = useDrawerContext();
    const slot = getSlotProps('footer', drawerFooterStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="drawer-footer">
        {children}
      </div>
    );
  },
);

// ── Compound: Drawer.CloseButton ────────────────────

/** Drawer.CloseButton props */
export interface DrawerCloseButtonProps {
  /** Ek className / Additional className */
  className?: string;
  /** Ikon boyutu / Icon size */
  iconSize?: number;
}

const DrawerCloseButton = forwardRef<HTMLButtonElement, DrawerCloseButtonProps>(
  function DrawerCloseButton(props, ref) {
    const { className, iconSize = 16 } = props;
    const ctx = useDrawerContext();
    const slot = getSlotProps('closeButton', drawerCloseButtonStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <button
        ref={ref}
        className={cls}
        style={slot.style}
        onClick={ctx.onClose}
        type="button"
        aria-label="Kapat"
        data-testid="drawer-close"
      >
        <CloseIcon size={iconSize} aria-hidden="true" />
      </button>
    );
  },
);

// ── Component Props ─────────────────────────────────

export interface DrawerComponentProps extends SlotStyleProps<DrawerSlot> {
  /** Acik mi / Is open */
  open: boolean;
  /** Kapaninca callback / On close callback */
  onClose?: () => void;
  /** Yerlesim / Placement */
  placement?: DrawerPlacement;
  /** Boyut / Size */
  size?: DrawerSize;
  /** Baslik / Title */
  title?: string;
  /** Overlay'e tiklaninca kapat / Close on overlay click */
  closeOnOverlay?: boolean;
  /** Escape ile kapat / Close on Escape */
  closeOnEscape?: boolean;
  /** Kapat butonu goster / Show close button */
  showCloseButton?: boolean;
  /** Footer icerigi / Footer content */
  footer?: React.ReactNode;
  /** Portal hedefi / Portal container */
  portalContainer?: HTMLElement;
  /** Icerik / Content */
  children?: React.ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Compound mode detection ─────────────────────────

function isCompoundMode(children: ReactNode): boolean {
  if (!children) return false;
  const arr = Array.isArray(children) ? children : [children];
  return arr.some(
    (child) =>
      child !== null &&
      child !== undefined &&
      typeof child === 'object' &&
      'type' in child &&
      (child.type === DrawerHeader ||
        child.type === DrawerBody ||
        child.type === DrawerFooter ||
        child.type === DrawerCloseButton),
  );
}

// ── Component ─────────────────────────────────────────

const DrawerBase = forwardRef<HTMLDivElement, DrawerComponentProps>(
  function Drawer(props, ref) {
    const {
      open,
      onClose,
      placement = 'right',
      size = 'md',
      title,
      closeOnOverlay = true,
      closeOnEscape = true,
      showCloseButton = true,
      footer,
      portalContainer,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const [, forceRender] = useReducer((c: number) => c + 1, 0);

    // ── Core API ──
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    const apiRef = useRef<DrawerAPI | null>(null);
    if (!apiRef.current) {
      apiRef.current = createDrawer({
        open: false,
        onOpenChange: (isOpen) => {
          if (!isOpen) onCloseRef.current?.();
        },
      });
    }
    const api = apiRef.current;

    // ── Prop sync: open ──
    const prevOpenRef = useRef<boolean | undefined>(undefined);
    if (open !== prevOpenRef.current) {
      if (open) {
        api.send({ type: 'OPEN' });
      } else {
        api.send({ type: 'CLOSE' });
      }
      prevOpenRef.current = open;
    }

    // ── Subscribe ──
    useEffect(() => {
      return api.subscribe(() => forceRender());
    }, [api]);

    const ctx = api.getContext();

    // ── Focus trap ──
    const panelRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
      if (ctx.open) {
        previousFocusRef.current = document.activeElement as HTMLElement | null;
        const timer = setTimeout(() => {
          const panel = panelRef.current;
          if (!panel) return;
          const focusable = panel.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          );
          const first = focusable[0];
          if (first) first.focus();
        }, 50);
        return () => clearTimeout(timer);
      } else {
        previousFocusRef.current?.focus();
      }
    }, [ctx.open]);

    // ── Body scroll lock ──
    useEffect(() => {
      if (ctx.open) {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
          document.body.style.overflow = prev;
        };
      }
    }, [ctx.open]);

    // ── Escape key ──
    useEffect(() => {
      if (!ctx.open || !closeOnEscape) return;
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          api.send({ type: 'CLOSE' });
        }
      };
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }, [ctx.open, closeOnEscape, api]);

    // ── Focus trap: Tab wrapping ──
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }, []);

    const handleOverlayClick = useCallback(() => {
      if (closeOnOverlay) {
        api.send({ type: 'CLOSE' });
      }
    }, [closeOnOverlay, api]);

    const handleClose = useCallback(() => {
      api.send({ type: 'CLOSE' });
    }, [api]);

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

    // ── Render ──
    const anchor = <span ref={anchorRef} style={{ display: 'none' }} data-testid="drawer-anchor" />;

    if (!ctx.open || !portalTarget) return anchor;

    // ── Slots ──
    const overlaySlot = getSlotProps('overlay', drawerOverlayStyle, classNames, styles);
    const panelClass = drawerPanelRecipe({ placement, size });
    const panelSlot = getSlotProps('panel', panelClass, classNames, styles);

    const panelClassName = className
      ? `${panelSlot.className} ${className}`
      : panelSlot.className;

    // ── Compound vs Props-based detection ──
    const compound = isCompoundMode(children);

    // ── Context value ──
    const ctxValue: DrawerContextValue = { open: ctx.open, onClose, placement, classNames, styles };

    // ── Props-based slots ──
    const headerSlot = getSlotProps('header', drawerHeaderStyle, classNames, styles);
    const titleSlot = getSlotProps('title', drawerTitleStyle, classNames, styles);
    const closeSlot = getSlotProps('closeButton', drawerCloseButtonStyle, classNames, styles);
    const bodySlot = getSlotProps('body', drawerBodyStyle, classNames, styles);
    const footerSlot = getSlotProps('footer', drawerFooterStyle, classNames, styles);

    const hasHeader = title || showCloseButton;

    const content = (
      <div ref={ref} data-testid="drawer-root">
        {/* Overlay */}
        <div
          className={overlaySlot.className}
          style={overlaySlot.style}
          onClick={handleOverlayClick}
          data-testid="drawer-overlay"
          aria-hidden="true"
        />

        {/* Panel */}
        <div
          ref={panelRef}
          className={panelClassName}
          style={{ ...panelSlot.style, ...styleProp }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'drawer-title' : undefined}
          data-placement={placement}
          onKeyDown={handleKeyDown}
          data-testid="drawer-panel"
        >
          {compound ? (
            <DrawerContext.Provider value={ctxValue}>
              {children}
            </DrawerContext.Provider>
          ) : (
            <>
              {hasHeader && (
                <div
                  className={headerSlot.className}
                  style={headerSlot.style}
                  data-testid="drawer-header"
                >
                  {title ? (
                    <h2
                      id="drawer-title"
                      className={titleSlot.className}
                      style={titleSlot.style}
                      data-testid="drawer-title"
                    >
                      {title}
                    </h2>
                  ) : (
                    <span />
                  )}
                  {showCloseButton && (
                    <button
                      className={closeSlot.className}
                      style={closeSlot.style}
                      onClick={handleClose}
                      type="button"
                      aria-label="Kapat"
                      data-testid="drawer-close"
                    >
                      <CloseIcon size={16} aria-hidden="true" />
                    </button>
                  )}
                </div>
              )}

              <div
                className={bodySlot.className}
                style={bodySlot.style}
                data-testid="drawer-body"
              >
                {children}
              </div>

              {footer && (
                <div
                  className={footerSlot.className}
                  style={footerSlot.style}
                  data-testid="drawer-footer"
                >
                  {footer}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );

    return (
      <>
        {anchor}
        {createPortal(content, portalTarget)}
      </>
    );
  },
);

/**
 * Drawer bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Drawer open={isOpen} onClose={() => setIsOpen(false)} title="Menu" placement="left">
 *   <nav>Navigasyon icerigi</nav>
 * </Drawer>
 * ```
 *
 * @example Compound
 * ```tsx
 * <Drawer open={isOpen} onClose={() => setIsOpen(false)}>
 *   <Drawer.Header>
 *     <h2>Menu</h2>
 *     <Drawer.CloseButton />
 *   </Drawer.Header>
 *   <Drawer.Body>
 *     <nav>Navigasyon icerigi</nav>
 *   </Drawer.Body>
 *   <Drawer.Footer>
 *     <button>Kaydet</button>
 *   </Drawer.Footer>
 * </Drawer>
 * ```
 */
export const Drawer = Object.assign(DrawerBase, {
  Header: DrawerHeader,
  Body: DrawerBody,
  Footer: DrawerFooter,
  CloseButton: DrawerCloseButton,
});

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Flyout — trigger elemana bagli non-modal popup panel (Dual API).
 * Flyout — non-modal popup panel attached to a trigger element (Dual API).
 *
 * Props-based: `<Flyout trigger={<button>Detay</button>} title="Detay">Icerik</Flyout>`
 * Compound:    `<Flyout><Flyout.Trigger><button>Detay</button></Flyout.Trigger><Flyout.Content><Flyout.Header>...</Flyout.Header><Flyout.Body>...</Flyout.Body></Flyout.Content></Flyout>`
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
  cloneElement,
  isValidElement,
  Children,
  type ReactNode,
  type ReactElement,
} from 'react';
import { createPortal } from 'react-dom';
import {
  flyoutPanelStyle,
  flyoutHeaderStyle,
  flyoutTitleStyle,
  flyoutCloseButtonStyle,
  flyoutBodyStyle,
  flyoutFooterStyle,
} from './flyout.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';
import {
  createFlyout,
  type FlyoutAPI,
  type FlyoutPlacement,
  type FlyoutSize,
} from '@relteco/relui-core';
import { CloseIcon } from '@relteco/relui-icons';

// ── Slot ──────────────────────────────────────────────

/**
 * Flyout slot isimleri / Flyout slot names.
 */
export type FlyoutSlot =
  | 'root'
  | 'trigger'
  | 'panel'
  | 'header'
  | 'title'
  | 'closeButton'
  | 'body'
  | 'footer';

// ── Size Map ─────────────────────────────────────────

const sizeMap: Record<FlyoutSize, number> = {
  sm: 280,
  md: 360,
  lg: 480,
};

// ── Context (Compound API) ──────────────────────────

interface FlyoutContextValue {
  open: boolean;
  onClose: () => void;
  classNames: ClassNames<FlyoutSlot> | undefined;
  styles: Styles<FlyoutSlot> | undefined;
}

const FlyoutContext = createContext<FlyoutContextValue | null>(null);

function useFlyoutContext(): FlyoutContextValue {
  const ctx = useContext(FlyoutContext);
  if (!ctx) throw new Error('Flyout compound sub-components must be used within <Flyout>.');
  return ctx;
}

// ── Compound: Flyout.Trigger ────────────────────────

/** Flyout.Trigger props */
export interface FlyoutTriggerProps {
  /** Trigger elementi / Trigger element */
  children: ReactElement;
  /** Ek className / Additional className */
  className?: string;
}

const FlyoutTrigger = forwardRef<HTMLElement, FlyoutTriggerProps>(
  function FlyoutTrigger(_props, _ref) {
    // Rendering handled by parent Flyout. Marker only.
    return null;
  },
);

// ── Compound: Flyout.Content ────────────────────────

/** Flyout.Content props */
export interface FlyoutContentProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const FlyoutContent = forwardRef<HTMLDivElement, FlyoutContentProps>(
  function FlyoutContent(_props, _ref) {
    // Rendering handled by parent Flyout. Marker only.
    return null;
  },
);

// ── Compound: Flyout.Header ─────────────────────────

/** Flyout.Header props */
export interface FlyoutHeaderProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const FlyoutHeader = forwardRef<HTMLDivElement, FlyoutHeaderProps>(
  function FlyoutHeader(props, ref) {
    const { children, className } = props;
    const ctx = useFlyoutContext();
    const slot = getSlotProps('header', flyoutHeaderStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="flyout-header">
        {children}
      </div>
    );
  },
);

// ── Compound: Flyout.Body ───────────────────────────

/** Flyout.Body props */
export interface FlyoutBodyProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const FlyoutBody = forwardRef<HTMLDivElement, FlyoutBodyProps>(
  function FlyoutBody(props, ref) {
    const { children, className } = props;
    const ctx = useFlyoutContext();
    const slot = getSlotProps('body', flyoutBodyStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="flyout-body">
        {children}
      </div>
    );
  },
);

// ── Component Props ─────────────────────────────────

export interface FlyoutComponentProps extends SlotStyleProps<FlyoutSlot> {
  /** Acik mi (controlled) / Is open (controlled) */
  open?: boolean;
  /** Varsayilan acik mi (uncontrolled) / Default open (uncontrolled) */
  defaultOpen?: boolean;
  /** Acik/kapali degisince callback / On open change callback */
  onOpenChange?: (open: boolean) => void;
  /** Yerlesim yonu / Placement direction */
  placement?: FlyoutPlacement;
  /** Boyut / Size */
  size?: FlyoutSize;
  /** Trigger'dan uzaklik (px) / Offset from trigger (px) */
  offset?: number;
  /** Baslik / Title */
  title?: string;
  /** Kapat butonu goster / Show close button */
  showCloseButton?: boolean;
  /** Dis tiklamada kapat / Close on outside click */
  closeOnOutsideClick?: boolean;
  /** Escape ile kapat / Close on Escape */
  closeOnEscape?: boolean;
  /** Footer icerigi / Footer content */
  footer?: React.ReactNode;
  /** Trigger elementi (props-based) / Trigger element (props-based) */
  trigger?: React.ReactElement;
  /** Portal hedefi / Portal container */
  portalContainer?: HTMLElement;
  /** Icerik / Content */
  children?: React.ReactNode;
  /** Ek className (panel'e) / Additional className (applied to panel) */
  className?: string;
  /** Inline style (panel'e) / Inline style (applied to panel) */
  style?: React.CSSProperties;
}

// ── Position calculator ─────────────────────────────

function calculateFlyoutPosition(
  triggerRect: DOMRect,
  placement: FlyoutPlacement,
  offset: number,
  panelWidth: number,
  panelHeight: number,
  portalRect: DOMRect,
): { top: number; left: number } {
  let top = 0;
  let left = 0;

  switch (placement) {
    case 'top':
      top = triggerRect.top - panelHeight - offset - portalRect.top;
      left = triggerRect.left + triggerRect.width / 2 - panelWidth / 2 - portalRect.left;
      break;
    case 'bottom':
      top = triggerRect.bottom + offset - portalRect.top;
      left = triggerRect.left + triggerRect.width / 2 - panelWidth / 2 - portalRect.left;
      break;
    case 'left':
      top = triggerRect.top + triggerRect.height / 2 - panelHeight / 2 - portalRect.top;
      left = triggerRect.left - panelWidth - offset - portalRect.left;
      break;
    case 'right':
      top = triggerRect.top + triggerRect.height / 2 - panelHeight / 2 - portalRect.top;
      left = triggerRect.right + offset - portalRect.left;
      break;
  }

  return { top, left };
}

// ── Compound mode helpers ───────────────────────────

function extractCompoundChildren(children: ReactNode): {
  triggerChild: ReactElement | null;
  contentChild: ReactNode;
} {
  let triggerChild: ReactElement | null = null;
  let contentChild: ReactNode = null;

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (child.type === FlyoutTrigger) {
      triggerChild = (child.props as FlyoutTriggerProps).children;
    } else if (child.type === FlyoutContent) {
      contentChild = (child.props as FlyoutContentProps).children;
    }
  });

  return { triggerChild, contentChild };
}

function isCompoundMode(children: ReactNode, trigger: ReactElement | undefined): boolean {
  if (trigger) return false;
  if (!children) return false;
  const arr = Array.isArray(children) ? children : [children];
  return arr.some(
    (child) =>
      child !== null &&
      child !== undefined &&
      typeof child === 'object' &&
      'type' in child &&
      (child.type === FlyoutTrigger ||
        child.type === FlyoutContent ||
        child.type === FlyoutHeader ||
        child.type === FlyoutBody),
  );
}

// ── Component ─────────────────────────────────────────

const FlyoutBase = forwardRef<HTMLDivElement, FlyoutComponentProps>(
  function Flyout(props, ref) {
    const {
      open: controlledOpen,
      defaultOpen,
      onOpenChange,
      placement = 'bottom',
      size = 'md',
      offset: offsetProp = 8,
      title,
      showCloseButton = true,
      closeOnOutsideClick = true,
      closeOnEscape = true,
      footer,
      trigger,
      portalContainer,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const compound = isCompoundMode(children, trigger);

    // ── Extract compound children ──
    const {
      triggerChild: compoundTrigger,
      contentChild: compoundContent,
    } = compound ? extractCompoundChildren(children) : { triggerChild: null, contentChild: null };

    const effectiveTrigger = compound ? compoundTrigger : trigger;
    const effectiveContent = compound ? compoundContent : children;

    const isControlled = controlledOpen !== undefined;
    const [, forceRender] = useReducer((c: number) => c + 1, 0);

    // ── Core API ──
    const onOpenChangeRef = useRef(onOpenChange);
    onOpenChangeRef.current = onOpenChange;

    const apiRef = useRef<FlyoutAPI | null>(null);
    if (!apiRef.current) {
      apiRef.current = createFlyout({
        open: isControlled ? controlledOpen : (defaultOpen ?? false),
        onOpenChange: (isOpen) => {
          onOpenChangeRef.current?.(isOpen);
        },
      });
    }
    const api = apiRef.current;

    // ── Prop sync: controlled open ──
    const prevOpenRef = useRef<boolean | undefined>(undefined);
    if (isControlled && controlledOpen !== prevOpenRef.current) {
      if (controlledOpen) {
        api.send({ type: 'OPEN' });
      } else {
        api.send({ type: 'CLOSE' });
      }
      prevOpenRef.current = controlledOpen;
    }

    // ── Subscribe ──
    useEffect(() => {
      return api.subscribe(() => forceRender());
    }, [api]);

    const ctx = api.getContext();

    // ── Refs ──
    const triggerRef = useRef<HTMLElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

    // ── Toggle handler ──
    const handleTriggerClick = useCallback(() => {
      if (isControlled) {
        onOpenChangeRef.current?.(!ctx.open);
      } else {
        api.send({ type: 'TOGGLE' });
      }
    }, [isControlled, ctx.open, api]);

    // ── Close handler ──
    const handleClose = useCallback(() => {
      if (isControlled) {
        onOpenChangeRef.current?.(false);
      } else {
        api.send({ type: 'CLOSE' });
      }
    }, [isControlled, api]);

    // ── Position calculation ──
    useEffect(() => {
      if (!ctx.open) {
        setPosition(null);
        return;
      }

      const triggerEl = triggerRef.current;
      const panelEl = panelRef.current;
      if (!triggerEl || !panelEl) return;

      const calculate = () => {
        const triggerRect = triggerEl.getBoundingClientRect();
        const panelRect = panelEl.getBoundingClientRect();
        const portalTarget = portalContainer ?? document.body;
        const portalRect = portalTarget === document.body
          ? new DOMRect(0, 0, window.innerWidth, window.innerHeight)
          : portalTarget.getBoundingClientRect();

        const pos = calculateFlyoutPosition(
          triggerRect,
          placement,
          offsetProp,
          panelRect.width,
          panelRect.height,
          portalRect,
        );
        setPosition(pos);
      };

      const raf = requestAnimationFrame(calculate);
      return () => cancelAnimationFrame(raf);
    }, [ctx.open, placement, offsetProp, portalContainer, size]);

    // ── Outside click ──
    useEffect(() => {
      if (!ctx.open || !closeOnOutsideClick) return;

      const handleClick = (e: MouseEvent) => {
        const target = e.target as Node;
        const triggerEl = triggerRef.current;
        const panelEl = panelRef.current;

        if (triggerEl && triggerEl.contains(target)) return;
        if (panelEl && panelEl.contains(target)) return;

        if (isControlled) {
          onOpenChangeRef.current?.(false);
        } else {
          api.send({ type: 'CLOSE' });
        }
      };

      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }, [ctx.open, closeOnOutsideClick, isControlled, api]);

    // ── Escape key ──
    useEffect(() => {
      if (!ctx.open || !closeOnEscape) return;

      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          if (isControlled) {
            onOpenChangeRef.current?.(false);
          } else {
            api.send({ type: 'CLOSE' });
          }
        }
      };

      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }, [ctx.open, closeOnEscape, isControlled, api]);

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
    const triggerElement = isValidElement(effectiveTrigger)
      ? cloneElement(effectiveTrigger as React.ReactElement<Record<string, unknown>>, {
          ref: triggerRef,
          onClick: (e: React.MouseEvent) => {
            handleTriggerClick();
            const origClick = (effectiveTrigger as React.ReactElement<Record<string, unknown>>).props.onClick;
            if (typeof origClick === 'function') {
              origClick(e);
            }
          },
          'aria-expanded': ctx.open,
          'aria-haspopup': 'true',
        })
      : effectiveTrigger;

    // ── Slots ──
    const panelSlot = getSlotProps('panel', flyoutPanelStyle, classNames, styles);
    const headerSlot = getSlotProps('header', flyoutHeaderStyle, classNames, styles);
    const titleSlot = getSlotProps('title', flyoutTitleStyle, classNames, styles);
    const closeSlot = getSlotProps('closeButton', flyoutCloseButtonStyle, classNames, styles);
    const bodySlot = getSlotProps('body', flyoutBodyStyle, classNames, styles);
    const footerSlot = getSlotProps('footer', flyoutFooterStyle, classNames, styles);

    const panelClassName = className
      ? `${panelSlot.className} ${className}`
      : panelSlot.className;

    const panelWidth = sizeMap[size];
    const hasHeader = title !== undefined || showCloseButton;

    // ── Context value ──
    const ctxValue: FlyoutContextValue = {
      open: ctx.open,
      onClose: handleClose,
      classNames,
      styles,
    };

    // ── Render ──
    const anchor = <span ref={anchorRef} style={{ display: 'none' }} data-testid="flyout-anchor" />;

    const panelElement = ctx.open && portalTarget ? createPortal(
      <div
        ref={(el) => {
          (panelRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }}
        className={panelClassName}
        style={{
          ...panelSlot.style,
          ...styleProp,
          width: panelWidth,
          top: position ? position.top : -9999,
          left: position ? position.left : -9999,
          visibility: position ? 'visible' : 'hidden',
        }}
        role="dialog"
        data-placement={placement}
        data-size={size}
        data-testid="flyout-panel"
      >
        {compound ? (
          <FlyoutContext.Provider value={ctxValue}>
            {effectiveContent}
          </FlyoutContext.Provider>
        ) : (
          <>
            {hasHeader && (
              <div
                className={headerSlot.className}
                style={headerSlot.style}
                data-testid="flyout-header"
              >
                {title ? (
                  <h3
                    className={titleSlot.className}
                    style={titleSlot.style}
                    data-testid="flyout-title"
                  >
                    {title}
                  </h3>
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
                    data-testid="flyout-close"
                  >
                    <CloseIcon size={14} aria-hidden="true" />
                  </button>
                )}
              </div>
            )}

            <div
              className={bodySlot.className}
              style={bodySlot.style}
              data-testid="flyout-body"
            >
              {effectiveContent}
            </div>

            {footer && (
              <div
                className={footerSlot.className}
                style={footerSlot.style}
                data-testid="flyout-footer"
              >
                {footer}
              </div>
            )}
          </>
        )}
      </div>,
      portalTarget,
    ) : null;

    return (
      <>
        {anchor}
        {triggerElement}
        {panelElement}
      </>
    );
  },
);

/**
 * Flyout bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Flyout trigger={<button>Detaylar</button>} title="Detaylar" placement="bottom">
 *   <p>Flyout icerigi</p>
 * </Flyout>
 * ```
 *
 * @example Compound
 * ```tsx
 * <Flyout>
 *   <Flyout.Trigger><button>Detaylar</button></Flyout.Trigger>
 *   <Flyout.Content>
 *     <Flyout.Header>
 *       <h3>Detaylar</h3>
 *     </Flyout.Header>
 *     <Flyout.Body>
 *       <p>Flyout icerigi</p>
 *     </Flyout.Body>
 *   </Flyout.Content>
 * </Flyout>
 * ```
 */
export const Flyout = Object.assign(FlyoutBase, {
  Trigger: FlyoutTrigger,
  Content: FlyoutContent,
  Header: FlyoutHeader,
  Body: FlyoutBody,
});

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Tooltip — hover/focus ile gorunen ipucu bilesen (Dual API).
 * Tooltip — hint component shown on hover/focus (Dual API).
 *
 * Props-based: `<Tooltip label="Ipucu"><button>Hover</button></Tooltip>`
 * Compound:    `<Tooltip><Tooltip.Trigger><button>Hover</button></Tooltip.Trigger><Tooltip.Content>Ipucu</Tooltip.Content></Tooltip>`
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
  useId,
  type ReactNode,
  type ReactElement,
} from 'react';
import { createPortal } from 'react-dom';
import { tooltipContentStyle, tooltipArrowStyle } from './tooltip.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';
import {
  createTooltip,
  type TooltipAPI,
  type TooltipPlacement,
  type TooltipAlignment,
} from '@relteco/relui-core';

// ── Slot ──────────────────────────────────────────────

/**
 * Tooltip slot isimleri / Tooltip slot names.
 */
export type TooltipSlot = 'root' | 'trigger' | 'content' | 'arrow';

// ── Context (Compound API) ──────────────────────────

interface TooltipContextValue {
  open: boolean;
  classNames: ClassNames<TooltipSlot> | undefined;
  styles: Styles<TooltipSlot> | undefined;
}

const TooltipContext = createContext<TooltipContextValue | null>(null);

export function useTooltipContext(): TooltipContextValue {
  const ctx = useContext(TooltipContext);
  if (!ctx) throw new Error('Tooltip compound sub-components must be used within <Tooltip>.');
  return ctx;
}

// ── Compound: Tooltip.Trigger ───────────────────────

/** Tooltip.Trigger props */
export interface TooltipTriggerProps {
  /** Trigger elementi / Trigger element */
  children: ReactElement;
  /** Ek className / Additional className */
  className?: string;
}

const TooltipTrigger = forwardRef<HTMLElement, TooltipTriggerProps>(
  function TooltipTrigger(_props, _ref) {
    // Rendering handled by parent Tooltip. Marker only.
    return null;
  },
);

// ── Compound: Tooltip.Content ───────────────────────

/** Tooltip.Content props */
export interface TooltipContentProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  function TooltipContent(_props, _ref) {
    // Rendering handled by parent Tooltip. Marker only.
    return null;
  },
);

// ── Component Props ─────────────────────────────────

export interface TooltipComponentProps extends SlotStyleProps<TooltipSlot> {
  /** Tooltip icerigi (props-based) / Tooltip content (props-based, text or ReactNode) */
  label?: React.ReactNode;
  /** Yerlesim yonu / Placement direction */
  placement?: TooltipPlacement;
  /** Hizalama / Alignment */
  alignment?: TooltipAlignment;
  /** Trigger'dan uzaklik (px) / Offset from trigger (px) */
  offset?: number;
  /** Ok isareti goster / Show arrow */
  showArrow?: boolean;
  /** Acilma gecikmesi (ms) / Open delay (ms) */
  delay?: number;
  /** Kapanma gecikmesi (ms) / Close delay (ms) */
  closeDelay?: number;
  /** Devre disi / Disabled */
  disabled?: boolean;
  /** Portal hedefi / Portal container */
  portalContainer?: HTMLElement;
  /** Trigger elementi veya compound children / Trigger element or compound children */
  children: React.ReactElement | React.ReactNode;
  /** Ek className (content'e) / Additional className (applied to content) */
  className?: string;
  /** Inline style (content'e) / Inline style (applied to content) */
  style?: React.CSSProperties;
}

// ── Position calculator ─────────────────────────────

interface Position {
  top: number;
  left: number;
  arrowTop?: number;
  arrowLeft?: number;
}

function calculatePosition(
  triggerRect: DOMRect,
  contentRect: DOMRect,
  placement: TooltipPlacement,
  alignment: TooltipAlignment,
  offset: number,
  portalRect: DOMRect,
): Position {
  let top = 0;
  let left = 0;

  switch (placement) {
    case 'top':
      top = triggerRect.top - contentRect.height - offset - portalRect.top;
      break;
    case 'bottom':
      top = triggerRect.bottom + offset - portalRect.top;
      break;
    case 'left':
      left = triggerRect.left - contentRect.width - offset - portalRect.left;
      break;
    case 'right':
      left = triggerRect.right + offset - portalRect.left;
      break;
  }

  if (placement === 'top' || placement === 'bottom') {
    switch (alignment) {
      case 'start':
        left = triggerRect.left - portalRect.left;
        break;
      case 'center':
        left = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2 - portalRect.left;
        break;
      case 'end':
        left = triggerRect.right - contentRect.width - portalRect.left;
        break;
    }
  } else {
    switch (alignment) {
      case 'start':
        top = triggerRect.top - portalRect.top;
        break;
      case 'center':
        top = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2 - portalRect.top;
        break;
      case 'end':
        top = triggerRect.bottom - contentRect.height - portalRect.top;
        break;
    }
  }

  // Arrow pozisyonu
  const arrowSize = 8;
  const halfArrow = arrowSize / 2;
  let arrowTop: number | undefined;
  let arrowLeft: number | undefined;

  const triggerCenterX = triggerRect.left + triggerRect.width / 2 - portalRect.left - left;
  const triggerCenterY = triggerRect.top + triggerRect.height / 2 - portalRect.top - top;

  switch (placement) {
    case 'top':
      arrowTop = contentRect.height - halfArrow;
      arrowLeft = Math.max(halfArrow, Math.min(triggerCenterX - halfArrow, contentRect.width - halfArrow * 3));
      break;
    case 'bottom':
      arrowTop = -halfArrow;
      arrowLeft = Math.max(halfArrow, Math.min(triggerCenterX - halfArrow, contentRect.width - halfArrow * 3));
      break;
    case 'left':
      arrowLeft = contentRect.width - halfArrow;
      arrowTop = Math.max(halfArrow, Math.min(triggerCenterY - halfArrow, contentRect.height - halfArrow * 3));
      break;
    case 'right':
      arrowLeft = -halfArrow;
      arrowTop = Math.max(halfArrow, Math.min(triggerCenterY - halfArrow, contentRect.height - halfArrow * 3));
      break;
  }

  return { top, left, arrowTop, arrowLeft };
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
    if (child.type === TooltipTrigger) {
      triggerChild = (child.props as TooltipTriggerProps).children;
    } else if (child.type === TooltipContent) {
      contentChild = (child.props as TooltipContentProps).children;
    }
  });

  return { triggerChild, contentChild };
}

function isCompoundMode(children: ReactNode): boolean {
  if (!children) return false;
  const arr = Array.isArray(children) ? children : [children];
  return arr.some(
    (child) =>
      child !== null &&
      child !== undefined &&
      typeof child === 'object' &&
      'type' in child &&
      (child.type === TooltipTrigger || child.type === TooltipContent),
  );
}

// ── Component ─────────────────────────────────────────

const TooltipBase = forwardRef<HTMLDivElement, TooltipComponentProps>(
  function Tooltip(props, ref) {
    const {
      label,
      placement = 'top',
      alignment = 'center',
      offset: offsetProp = 8,
      showArrow = true,
      delay = 300,
      closeDelay = 100,
      disabled = false,
      portalContainer,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const compound = isCompoundMode(children);

    // ── Extract compound children ──
    const {
      triggerChild: compoundTrigger,
      contentChild: compoundContent,
    } = compound ? extractCompoundChildren(children) : { triggerChild: null, contentChild: null };

    const effectiveTrigger = compound ? compoundTrigger : children;
    const effectiveLabel = compound ? compoundContent : label;

    const tooltipId = useId();
    const [, forceRender] = useReducer((c: number) => c + 1, 0);

    // ── Core API ──
    const apiRef = useRef<TooltipAPI | null>(null);
    if (!apiRef.current) {
      apiRef.current = createTooltip({ open: false });
    }
    const api = apiRef.current;

    // ── Subscribe ──
    useEffect(() => {
      return api.subscribe(() => forceRender());
    }, [api]);

    const ctx = api.getContext();

    // ── Timer refs ──
    const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearTimers = useCallback(() => {
      if (openTimerRef.current) {
        clearTimeout(openTimerRef.current);
        openTimerRef.current = null;
      }
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    }, []);

    // Cleanup timers on unmount
    useEffect(() => clearTimers, [clearTimers]);

    // ── Handlers ──
    const handleOpen = useCallback(() => {
      if (disabled) return;
      clearTimers();
      if (delay > 0) {
        openTimerRef.current = setTimeout(() => {
          api.send({ type: 'OPEN' });
        }, delay);
      } else {
        api.send({ type: 'OPEN' });
      }
    }, [disabled, delay, api, clearTimers]);

    const handleClose = useCallback(() => {
      clearTimers();
      if (closeDelay > 0) {
        closeTimerRef.current = setTimeout(() => {
          api.send({ type: 'CLOSE' });
        }, closeDelay);
      } else {
        api.send({ type: 'CLOSE' });
      }
    }, [closeDelay, api, clearTimers]);

    // ── Refs ──
    const triggerRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<Position | null>(null);

    // ── Position calculation ──
    useEffect(() => {
      if (!ctx.open) {
        setPosition(null);
        return;
      }

      const triggerEl = triggerRef.current;
      const contentEl = contentRef.current;
      if (!triggerEl || !contentEl) return;

      const calculate = () => {
        const triggerRect = triggerEl.getBoundingClientRect();
        const contentRect = contentEl.getBoundingClientRect();
        const portalTarget = portalContainer ?? document.body;
        const portalRect = portalTarget === document.body
          ? new DOMRect(0, 0, window.innerWidth, window.innerHeight)
          : portalTarget.getBoundingClientRect();

        const pos = calculatePosition(
          triggerRect,
          contentRect,
          placement,
          alignment,
          offsetProp,
          portalRect,
        );
        setPosition(pos);
      };

      const raf = requestAnimationFrame(calculate);
      return () => cancelAnimationFrame(raf);
    }, [ctx.open, placement, alignment, offsetProp, portalContainer]);

    // ── Escape key ──
    useEffect(() => {
      if (!ctx.open) return;
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          clearTimers();
          api.send({ type: 'CLOSE' });
        }
      };
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }, [ctx.open, api, clearTimers]);

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
          onMouseEnter: (e: React.MouseEvent) => {
            handleOpen();
            const orig = (effectiveTrigger as React.ReactElement<Record<string, unknown>>).props.onMouseEnter;
            if (typeof orig === 'function') orig(e);
          },
          onMouseLeave: (e: React.MouseEvent) => {
            handleClose();
            const orig = (effectiveTrigger as React.ReactElement<Record<string, unknown>>).props.onMouseLeave;
            if (typeof orig === 'function') orig(e);
          },
          onFocus: (e: React.FocusEvent) => {
            handleOpen();
            const orig = (effectiveTrigger as React.ReactElement<Record<string, unknown>>).props.onFocus;
            if (typeof orig === 'function') orig(e);
          },
          onBlur: (e: React.FocusEvent) => {
            handleClose();
            const orig = (effectiveTrigger as React.ReactElement<Record<string, unknown>>).props.onBlur;
            if (typeof orig === 'function') orig(e);
          },
          'aria-describedby': ctx.open ? tooltipId : undefined,
          'data-testid': 'tooltip-trigger',
        })
      : effectiveTrigger;

    // ── Slots ──
    const contentSlot = getSlotProps('content', tooltipContentStyle, classNames, styles);
    const arrowSlot = getSlotProps('arrow', tooltipArrowStyle, classNames, styles);

    const contentClassName = className
      ? `${contentSlot.className} ${className}`
      : contentSlot.className;

    // ── Context value ──
    const ctxValue: TooltipContextValue = {
      open: ctx.open,
      classNames,
      styles,
    };

    // ── Render ──
    const anchor = <span ref={anchorRef} style={{ display: 'none' }} data-testid="tooltip-root" />;

    const contentElement = ctx.open && portalTarget ? createPortal(
      <div
        ref={(el) => {
          (contentRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }}
        id={tooltipId}
        role="tooltip"
        className={contentClassName}
        style={{
          ...contentSlot.style,
          ...styleProp,
          top: position ? position.top : -9999,
          left: position ? position.left : -9999,
          visibility: position ? 'visible' : 'hidden',
        }}
        data-placement={placement}
        data-testid="tooltip-content"
      >
        {effectiveLabel}
        {showArrow && position && (
          <span
            className={arrowSlot.className}
            style={{
              ...arrowSlot.style,
              top: position.arrowTop,
              left: position.arrowLeft,
            }}
            data-testid="tooltip-arrow"
          />
        )}
      </div>,
      portalTarget,
    ) : null;

    if (compound) {
      return (
        <TooltipContext.Provider value={ctxValue}>
          {anchor}
          {triggerElement}
          {contentElement}
        </TooltipContext.Provider>
      );
    }

    return (
      <>
        {anchor}
        {triggerElement}
        {contentElement}
      </>
    );
  },
);

/**
 * Tooltip bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Tooltip label="Kaydet">
 *   <button>Kaydet</button>
 * </Tooltip>
 * ```
 *
 * @example Compound
 * ```tsx
 * <Tooltip>
 *   <Tooltip.Trigger><button>Kaydet</button></Tooltip.Trigger>
 *   <Tooltip.Content>Kaydet</Tooltip.Content>
 * </Tooltip>
 * ```
 */
export const Tooltip = Object.assign(TooltipBase, {
  Trigger: TooltipTrigger,
  Content: TooltipContent,
});

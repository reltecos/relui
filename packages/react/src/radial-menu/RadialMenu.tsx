/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * RadialMenu — styled dairesel sag tik menu bilesen (Dual API).
 * RadialMenu — styled radial/pie context menu component (Dual API).
 *
 * Props-based: `<RadialMenu items={[...]} open={true} position={{x:200,y:200}} />`
 * Compound:    `<RadialMenu items={[...]} open={true} position={{x:200,y:200}}><RadialMenu.Center>X</RadialMenu.Center></RadialMenu>`
 *
 * Blender/Maya tarzi sag tik dairesel menu.
 * Mouse hareketi ile sektor vurgulama, birakmakla secim.
 *
 * Portal ile document.body ye render edilir — parent stacking context ten bagimsiz.
 *
 * @packageDocumentation
 */

import {
  forwardRef,
  createContext,
  useContext,
  useEffect,
  useCallback,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import type { RadialMenuSize } from '@relteco/relui-core';
import { useRadialMenu, type UseRadialMenuProps } from './useRadialMenu';
import {
  radialMenuRecipe,
  radialOverlayStyle,
  radialSvgStyle,
  radialSectorStyle,
  radialLabelStyle,
  radialIconStyle,
  radialCenterStyle,
  radialSubmenuIndicatorStyle,
} from './radial-menu.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

/**
 * RadialMenu slot isimleri / RadialMenu slot names.
 */
export type RadialMenuSlot =
  | 'root'
  | 'overlay'
  | 'sector'
  | 'label'
  | 'icon'
  | 'center'
  | 'submenuIndicator';

// ── Boyut haritasi ──────────────────────────────────────────

const SIZE_MAP: Record<RadialMenuSize, number> = {
  xs: 160,
  sm: 200,
  md: 250,
  lg: 300,
  xl: 360,
};

const INNER_RADIUS_RATIO = 0.22;
const LABEL_RADIUS_RATIO = 0.68;

// ── SVG yardimci fonksiyonlari ──────────────────────────────

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleDeg: number,
): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

function sectorPath(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startAngle: number,
  endAngle: number,
): string {
  const sweep = ((endAngle - startAngle + 360) % 360) || 360;
  const largeArc = sweep > 180 ? 1 : 0;

  const outerStart = polarToCartesian(cx, cy, outerR, startAngle);
  const outerEnd = polarToCartesian(cx, cy, outerR, startAngle + sweep);
  const innerStart = polarToCartesian(cx, cy, innerR, startAngle + sweep);
  const innerEnd = polarToCartesian(cx, cy, innerR, startAngle);

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerStart.x} ${innerStart.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}`,
    'Z',
  ].join(' ');
}

// ── Context (Compound API) ──────────────────────────────

interface RadialMenuContextValue {
  size: RadialMenuSize;
  isInSubmenu: boolean;
  highlightedIndex: number;
  classNames: ClassNames<RadialMenuSlot> | undefined;
  styles: Styles<RadialMenuSlot> | undefined;
}

const RadialMenuContext = createContext<RadialMenuContextValue | null>(null);

function useRadialMenuContext(): RadialMenuContextValue {
  const ctx = useContext(RadialMenuContext);
  if (!ctx) throw new Error('RadialMenu compound sub-components must be used within <RadialMenu>.');
  return ctx;
}

// ── Compound: RadialMenu.Item ──────────────────────────

/** RadialMenu.Item props — dekoratif sektor label wrapper. */
export interface RadialMenuItemProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const RadialMenuItem = forwardRef<HTMLDivElement, RadialMenuItemProps>(
  function RadialMenuItem(props, ref) {
    const { children, className } = props;
    const ctx = useRadialMenuContext();
    const slot = getSlotProps('label', radialLabelStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="radial-menu-item">
        {children}
      </div>
    );
  },
);

// ── Compound: RadialMenu.Center ─────────────────────────

/** RadialMenu.Center props — merkez noktasi icerigi. */
export interface RadialMenuCenterProps {
  /** Icerik / Content */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const RadialMenuCenter = forwardRef<HTMLDivElement, RadialMenuCenterProps>(
  function RadialMenuCenter(props, ref) {
    const { children, className } = props;
    const ctx = useRadialMenuContext();
    const slot = getSlotProps('center', radialCenterStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="radial-center">
        {children !== undefined ? children : (
          ctx.isInSubmenu && (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          )
        )}
      </div>
    );
  },
);

// ── Component Props ─────────────────────────────────────────

export interface RadialMenuComponentProps extends UseRadialMenuProps, SlotStyleProps<RadialMenuSlot> {
  /** Boyut / Size */
  size?: RadialMenuSize;

  /** Ek className / Additional className */
  className?: string;

  /** Inline style / Inline style */
  style?: React.CSSProperties;

  /** id */
  id?: string;

  /** Ikon render callback / Icon render callback */
  renderIcon?: (icon: string) => ReactNode;

  /** Deadzone yaricapi (px) — bu alan icinde vurgu iptal olur / Deadzone radius */
  deadzone?: number;

  /** Portal hedef elementi / Portal container element */
  portalContainer?: HTMLElement;

  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
}

// ── Component ─────────────────────────────────────────────

const RadialMenuBase = forwardRef<HTMLDivElement, RadialMenuComponentProps>(
  function RadialMenu(props, ref) {
    const {
      size = 'md',
      className,
      style: styleProp,
      classNames,
      styles,
      id,
      renderIcon,
      deadzone = 20,
      portalContainer,
      children,
      ...menuHookProps
    } = props;

    const {
      menuProps: domMenuProps,
      getSectorProps,
      items,
      sectors,
      isOpen,
      highlightedIndex,
      position,
      close,
      highlightSector,
      select,
      selectIndex,
      highlightNext,
      highlightPrev,
      exitSubmenu,
      isInSubmenu,
      getAngle,
      getSectorIndexFromAngle,
    } = useRadialMenu(menuHookProps);

    const containerRef = useRef<HTMLDivElement>(null);
    const anchorRef = useRef<HTMLSpanElement>(null);
    const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

    // Tema container ini bul — en yakin [data-theme] ancestor
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

    const diameter = SIZE_MAP[size];
    const radius = diameter / 2;
    const innerR = radius * INNER_RADIUS_RATIO;
    const labelR = radius * LABEL_RADIUS_RATIO;

    // ── Slots ──
    const rootClass = radialMenuRecipe({ size });
    const rootSlot = getSlotProps('root', rootClass, classNames, styles);
    const combinedRootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;
    const combinedRootStyle = styleProp
      ? { ...rootSlot.style, ...styleProp }
      : rootSlot.style;

    const overlaySlot = getSlotProps('overlay', radialOverlayStyle, classNames, styles);
    const sectorSlot = getSlotProps('sector', radialSectorStyle, classNames, styles);
    const labelSlot = getSlotProps('label', radialLabelStyle, classNames, styles);
    const iconSlot = getSlotProps('icon', radialIconStyle, classNames, styles);
    const centerSlot = getSlotProps('center', radialCenterStyle, classNames, styles);
    const submenuIndicatorSlot = getSlotProps(
      'submenuIndicator',
      radialSubmenuIndicatorStyle,
      classNames,
      styles,
    );

    // ── Mouse tracking ──
    const handlePointerMove = useCallback(
      (e: React.PointerEvent) => {
        if (!isOpen) return;
        const el = containerRef.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < deadzone) {
          highlightSector(-1);
          return;
        }

        const angle = getAngle(cx, cy, e.clientX, e.clientY);
        const index = getSectorIndexFromAngle(angle);
        highlightSector(index);
      },
      [isOpen, deadzone, highlightSector, getAngle, getSectorIndexFromAngle],
    );

    const handlePointerUp = useCallback(
      (e: React.PointerEvent) => {
        if (!isOpen) return;
        const el = containerRef.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < deadzone) {
          return;
        }

        if (highlightedIndex >= 0) {
          select();
        }
      },
      [isOpen, deadzone, highlightedIndex, select],
    );

    // ── Keyboard handling ──
    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (!isOpen) return;

        switch (e.key) {
          case 'Escape':
            e.preventDefault();
            if (isInSubmenu) {
              exitSubmenu();
            } else {
              close();
            }
            break;
          case 'ArrowDown':
          case 'ArrowRight':
            e.preventDefault();
            highlightNext();
            break;
          case 'ArrowUp':
          case 'ArrowLeft':
            e.preventDefault();
            highlightPrev();
            break;
          case 'Enter':
          case ' ':
            e.preventDefault();
            if (highlightedIndex >= 0) {
              select();
            }
            break;
          case 'Backspace':
            e.preventDefault();
            if (isInSubmenu) {
              exitSubmenu();
            }
            break;
        }
      },
      [isOpen, isInSubmenu, highlightedIndex, close, highlightNext, highlightPrev, select, exitSubmenu],
    );

    // ── Click outside to close ──
    const handleOverlayClick = useCallback(
      (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
          close();
        }
      },
      [close],
    );

    useEffect(() => {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [handleKeyDown]);

    // Gizli anchor — tema container ini bulmak icin DOM da kalmali
    const anchor = <span ref={anchorRef} style={{ display: 'none' }} />;

    if (!isOpen || !portalTarget) return anchor;

    const ctxValue: RadialMenuContextValue = {
      size,
      isInSubmenu,
      highlightedIndex,
      classNames,
      styles,
    };

    // ── children icinden Center sub-component ini bul ──
    let centerContent: ReactNode = null;
    let hasCompoundCenter = false;

    if (children) {
      const childArray = Array.isArray(children) ? children : [children];
      for (const child of childArray) {
        if (
          child &&
          typeof child === 'object' &&
          'type' in child &&
          child.type === RadialMenuCenter
        ) {
          hasCompoundCenter = true;
          centerContent = child;
        }
      }
    }

    const overlay = (
      <RadialMenuContext.Provider value={ctxValue}>
        <div
          className={overlaySlot.className}
          style={overlaySlot.style}
          onClick={handleOverlayClick}
          data-testid="radial-overlay"
        >
          <div
            ref={(node) => {
              (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
              if (typeof ref === 'function') ref(node);
              else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
            }}
            className={combinedRootClassName}
            style={{
              ...combinedRootStyle,
              left: position.x - radius,
              top: position.y - radius,
            }}
            id={id}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            {...domMenuProps}
          >
            {/* SVG sector paths */}
            <svg
              className={radialSvgStyle}
              viewBox={`0 0 ${diameter} ${diameter}`}
              data-testid="radial-svg"
            >
              {sectors.map((sector) => {
                const isHighlighted = highlightedIndex === sector.index;
                const item = items[sector.index];
                const isDisabled = item ? !!item.disabled : false;
                const domProps = getSectorProps(sector.index);

                return (
                  <path
                    key={sector.index}
                    className={sectorSlot.className}
                    style={sectorSlot.style}
                    d={sectorPath(
                      radius,
                      radius,
                      radius - 2,
                      innerR,
                      sector.startAngle,
                      sector.endAngle,
                    )}
                    data-highlighted={isHighlighted ? '' : undefined}
                    data-disabled={isDisabled ? '' : undefined}
                    data-index={sector.index}
                    onPointerEnter={() => {
                      if (!isDisabled) highlightSector(sector.index);
                    }}
                    onClick={() => {
                      if (!isDisabled) selectIndex(sector.index);
                    }}
                    role={domProps.role}
                    aria-label={domProps['aria-label']}
                    aria-disabled={domProps['aria-disabled']}
                  />
                );
              })}
            </svg>

            {/* Labels positioned around the circle */}
            {sectors.map((sector) => {
              const item = items[sector.index];
              if (!item) return null;

              const isHighlighted = highlightedIndex === sector.index;
              const isDisabled = !!item.disabled;
              const hasChildren = item.children && item.children.length > 0;
              const labelPos = polarToCartesian(radius, radius, labelR, sector.midAngle);

              return (
                <div
                  key={`label-${sector.index}`}
                  className={labelSlot.className}
                  style={{
                    ...labelSlot.style,
                    position: 'absolute',
                    left: labelPos.x,
                    top: labelPos.y,
                    transform: 'translate(-50%, -50%)',
                  }}
                  data-highlighted={isHighlighted ? '' : undefined}
                  data-disabled={isDisabled ? '' : undefined}
                >
                  {item.icon && renderIcon && (
                    <span className={iconSlot.className} style={iconSlot.style}>
                      {renderIcon(item.icon)}
                    </span>
                  )}
                  <span>{item.label}</span>
                  {hasChildren && (
                    <span
                      className={submenuIndicatorSlot.className}
                      style={submenuIndicatorSlot.style}
                    />
                  )}
                </div>
              );
            })}

            {/* Center dot — compound veya varsayilan */}
            {hasCompoundCenter ? centerContent : (
              <div
                className={centerSlot.className}
                style={centerSlot.style}
                data-testid="radial-center"
              >
                {isInSubmenu && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                )}
              </div>
            )}
          </div>
        </div>
      </RadialMenuContext.Provider>
    );

    return (
      <>
        {anchor}
        {createPortal(overlay, portalTarget)}
      </>
    );
  },
);

/**
 * RadialMenu bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <RadialMenu
 *   items={[{ key: 'cut', label: 'Kes' }]}
 *   open={isOpen}
 *   position={{ x: 300, y: 200 }}
 *   onSelect={(key) => console.log(key)}
 *   onOpenChange={(open) => setIsOpen(open)}
 * />
 * ```
 *
 * @example Compound
 * ```tsx
 * <RadialMenu items={items} open={isOpen} position={pos}>
 *   <RadialMenu.Center>
 *     <MyCustomIcon />
 *   </RadialMenu.Center>
 * </RadialMenu>
 * ```
 */
export const RadialMenu = Object.assign(RadialMenuBase, {
  Item: RadialMenuItem,
  Center: RadialMenuCenter,
});

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * BackToTop — yukari kaydir butonu (Dual API).
 * BackToTop — scroll to top button (Dual API).
 *
 * Props-based: `<BackToTop icon={<MyIcon />} />`
 * Compound:    `<BackToTop><BackToTop.Icon><MyIcon /></BackToTop.Icon></BackToTop>`
 *
 * Sayfa belli bir miktar kaydirildiktan sonra gorunur olur,
 * tiklaninca sayfa basina kaydirir.
 *
 * @packageDocumentation
 */

import {
  forwardRef,
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { bttRootRecipe, bttIconStyle } from './back-to-top.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

/**
 * BackToTop slot isimleri / BackToTop slot names.
 */
export type BackToTopSlot = 'root' | 'icon';

/**
 * BackToTop boyutlari / BackToTop sizes.
 */
export type BackToTopSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * BackToTop varyantlari / BackToTop variants.
 */
export type BackToTopVariant = 'filled' | 'outline' | 'subtle';

/**
 * BackToTop sekilleri / BackToTop shapes.
 */
export type BackToTopShape = 'rounded' | 'circle';

// ── Context (Compound API) ──────────────────────────────────

interface BackToTopContextValue {
  size: BackToTopSize;
  classNames: ClassNames<BackToTopSlot> | undefined;
  styles: Styles<BackToTopSlot> | undefined;
}

const BackToTopContext = createContext<BackToTopContextValue | null>(null);

function useBackToTopContext(): BackToTopContextValue {
  const ctx = useContext(BackToTopContext);
  if (!ctx) throw new Error('BackToTop compound sub-components must be used within <BackToTop>.');
  return ctx;
}

// ── Compound: BackToTop.Icon ────────────────────────────────

/** BackToTop.Icon props */
export interface BackToTopIconProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const BackToTopIcon = forwardRef<HTMLSpanElement, BackToTopIconProps>(
  function BackToTopIcon(props, ref) {
    const { children, className } = props;
    const ctx = useBackToTopContext();
    const slot = getSlotProps('icon', bttIconStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <span ref={ref} className={cls} style={slot.style} data-testid="back-to-top-icon">
        {children}
      </span>
    );
  },
);

// ── Component Props ─────────────────────────────────────────

export interface BackToTopComponentProps
  extends SlotStyleProps<BackToTopSlot> {
  /** Variant / Variant */
  variant?: BackToTopVariant;

  /** Boyut / Size */
  size?: BackToTopSize;

  /** Sekil / Shape */
  shape?: BackToTopShape;

  /** Gorunurluk esigi (px) / Visibility threshold (px) */
  visibilityThreshold?: number;

  /** Kaydirma davranisi / Scroll behavior */
  scrollBehavior?: ScrollBehavior;

  /** Hedef element / Scroll target element */
  scrollTarget?: HTMLElement | Window;

  /** Props-based: ozel ikon / Custom icon */
  icon?: ReactNode;

  /** Compound API icin children / Children for compound API */
  children?: ReactNode;

  /** Ek className / Additional className */
  className?: string;

  /** Inline style / Inline style */
  style?: React.CSSProperties;

  /** id */
  id?: string;

  /** aria-label */
  'aria-label'?: string;
}

/**
 * Varsayilan ok ikonu / Default arrow up icon.
 */
function DefaultArrowUpIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      width="100%"
      height="100%"
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

// ── Component ───────────────────────────────────────────────

/**
 * BackToTop bilesen — yukari kaydir butonu (Dual API).
 * BackToTop component — scroll to top button (Dual API).
 *
 * @example Props-based
 * ```tsx
 * <BackToTop />
 * <BackToTop variant="outline" size="lg" icon={<ChevronUpIcon />} />
 * ```
 *
 * @example Compound
 * ```tsx
 * <BackToTop>
 *   <BackToTop.Icon><ChevronUpIcon /></BackToTop.Icon>
 * </BackToTop>
 * ```
 */
const BackToTopBase = forwardRef<HTMLButtonElement, BackToTopComponentProps>(
  function BackToTop(props, ref) {
    const {
      variant = 'filled',
      size = 'md',
      shape = 'circle',
      visibilityThreshold = 300,
      scrollBehavior = 'smooth',
      scrollTarget,
      icon,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
      id,
      'aria-label': ariaLabel = 'Back to top',
    } = props;

    const [visible, setVisible] = useState(false);

    // ── Scroll listener ──
    useEffect(() => {
      const target = scrollTarget ?? window;

      const handleScroll = () => {
        if (target instanceof Window) {
          setVisible(window.scrollY > visibilityThreshold);
        } else {
          setVisible(target.scrollTop > visibilityThreshold);
        }
      };

      target.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();

      return () => {
        target.removeEventListener('scroll', handleScroll);
      };
    }, [scrollTarget, visibilityThreshold]);

    // ── Click handler ──
    const handleClick = useCallback(() => {
      const target = scrollTarget ?? window;

      if (target instanceof Window) {
        window.scrollTo({ top: 0, behavior: scrollBehavior });
      } else {
        target.scrollTo({ top: 0, behavior: scrollBehavior });
      }
    }, [scrollTarget, scrollBehavior]);

    // ── Slots ──
    const rootClass = bttRootRecipe({ variant, size, shape });
    const rootSlot = getSlotProps('root', rootClass, classNames, styles);
    const combinedRootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;
    const combinedRootStyle = styleProp
      ? { ...rootSlot.style, ...styleProp }
      : rootSlot.style;

    const ctxValue: BackToTopContextValue = { size, classNames, styles };

    if (!visible) return null;

    // ── Compound API ──
    if (children) {
      return (
        <BackToTopContext.Provider value={ctxValue}>
          <button
            ref={ref}
            className={combinedRootClassName}
            style={combinedRootStyle}
            onClick={handleClick}
            type="button"
            id={id}
            aria-label={ariaLabel}
            data-testid="back-to-top"
          >
            {children}
          </button>
        </BackToTopContext.Provider>
      );
    }

    // ── Props-based API ──
    const iconSlot = getSlotProps('icon', bttIconStyle, classNames, styles);

    return (
      <button
        ref={ref}
        className={combinedRootClassName}
        style={combinedRootStyle}
        onClick={handleClick}
        type="button"
        id={id}
        aria-label={ariaLabel}
        data-testid="back-to-top"
      >
        <span className={iconSlot.className} style={iconSlot.style} data-testid="back-to-top-icon">
          {icon ?? <DefaultArrowUpIcon />}
        </span>
      </button>
    );
  },
);

/**
 * BackToTop bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <BackToTop icon={<ChevronUpIcon />} />
 * ```
 *
 * @example Compound
 * ```tsx
 * <BackToTop>
 *   <BackToTop.Icon><ChevronUpIcon /></BackToTop.Icon>
 * </BackToTop>
 * ```
 */
export const BackToTop = Object.assign(BackToTopBase, {
  Icon: BackToTopIcon,
});

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Carousel — slayt gosterici bilesen (Dual API).
 * Carousel — slide viewer component (Dual API).
 *
 * Props-based: `<Carousel slides={[<Slide1/>,<Slide2/>]} autoplay loop />`
 * Compound:    `<Carousel><Carousel.Slide>...</Carousel.Slide></Carousel>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@relteco/relui-icons';
import {
  rootStyle,
  viewportStyle,
  slideStyle,
  prevButtonStyle,
  nextButtonStyle,
  indicatorsStyle,
  indicatorStyle,
  indicatorActiveStyle,
} from './carousel.css';
import { useCarousel, type UseCarouselProps } from './useCarousel';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** Carousel slot isimleri / Carousel slot names. */
export type CarouselSlot =
  | 'root'
  | 'viewport'
  | 'slide'
  | 'prevButton'
  | 'nextButton'
  | 'indicators'
  | 'indicator';

// ── Context (Compound API) ──────────────────────────

interface CarouselContextValue {
  activeIndex: number;
  slideCount: number;
  loop: boolean;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  classNames: ClassNames<CarouselSlot> | undefined;
  styles: Styles<CarouselSlot> | undefined;
}

const CarouselContext = createContext<CarouselContextValue | null>(null);

function useCarouselContext(): CarouselContextValue {
  const ctx = useContext(CarouselContext);
  if (!ctx) throw new Error('Carousel compound sub-components must be used within <Carousel>.');
  return ctx;
}

// ── Compound: Carousel.Viewport ──────────────────────

/** Carousel.Viewport props */
export interface CarouselViewportProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const CarouselViewport = forwardRef<HTMLDivElement, CarouselViewportProps>(
  function CarouselViewport(props, ref) {
    const { children, className } = props;
    const ctx = useCarouselContext();
    const slot = getSlotProps('viewport', viewportStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div
        ref={ref}
        className={cls}
        style={{
          ...slot.style,
          transform: `translateX(-${ctx.activeIndex * 100}%)`,
        }}
        data-testid="carousel-viewport"
      >
        {children}
      </div>
    );
  },
);

// ── Compound: Carousel.Slide ─────────────────────────

/** Carousel.Slide props */
export interface CarouselSlideProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const CarouselSlide = forwardRef<HTMLDivElement, CarouselSlideProps>(
  function CarouselSlide(props, ref) {
    const { children, className } = props;
    const ctx = useCarouselContext();
    const slot = getSlotProps('slide', slideStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="carousel-slide">
        {children}
      </div>
    );
  },
);

// ── Compound: Carousel.PrevButton ────────────────────

/** Carousel.PrevButton props */
export interface CarouselPrevButtonProps {
  /** Icerik / Content (override icon) */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const CarouselPrevButton = forwardRef<HTMLButtonElement, CarouselPrevButtonProps>(
  function CarouselPrevButton(props, ref) {
    const { children, className } = props;
    const ctx = useCarouselContext();
    const slot = getSlotProps('prevButton', prevButtonStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const disabled = !ctx.loop && ctx.activeIndex === 0;

    return (
      <button
        ref={ref}
        type="button"
        className={cls}
        style={slot.style}
        onClick={ctx.prev}
        disabled={disabled}
        aria-label="Previous slide"
        data-testid="carousel-prevButton"
      >
        {children ?? <ChevronLeftIcon size={16} />}
      </button>
    );
  },
);

// ── Compound: Carousel.NextButton ────────────────────

/** Carousel.NextButton props */
export interface CarouselNextButtonProps {
  /** Icerik / Content (override icon) */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const CarouselNextButton = forwardRef<HTMLButtonElement, CarouselNextButtonProps>(
  function CarouselNextButton(props, ref) {
    const { children, className } = props;
    const ctx = useCarouselContext();
    const slot = getSlotProps('nextButton', nextButtonStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const disabled = !ctx.loop && ctx.activeIndex >= ctx.slideCount - 1;

    return (
      <button
        ref={ref}
        type="button"
        className={cls}
        style={slot.style}
        onClick={ctx.next}
        disabled={disabled}
        aria-label="Next slide"
        data-testid="carousel-nextButton"
      >
        {children ?? <ChevronRightIcon size={16} />}
      </button>
    );
  },
);

// ── Compound: Carousel.Indicators ────────────────────

/** Carousel.Indicators props */
export interface CarouselIndicatorsProps {
  /** Ek className / Additional className */
  className?: string;
}

const CarouselIndicators = forwardRef<HTMLDivElement, CarouselIndicatorsProps>(
  function CarouselIndicators(props, ref) {
    const { className } = props;
    const ctx = useCarouselContext();
    const groupSlot = getSlotProps('indicators', indicatorsStyle, ctx.classNames, ctx.styles);
    const groupCls = className ? `${groupSlot.className} ${className}` : groupSlot.className;

    return (
      <div ref={ref} className={groupCls} style={groupSlot.style} role="tablist" data-testid="carousel-indicators">
        {Array.from({ length: ctx.slideCount }, (_, i) => {
          const isActive = i === ctx.activeIndex;
          const dotBase = isActive
            ? `${indicatorStyle} ${indicatorActiveStyle}`
            : indicatorStyle;
          const dotSlot = getSlotProps('indicator', dotBase, ctx.classNames, ctx.styles);

          return (
            <button
              key={i}
              type="button"
              className={dotSlot.className}
              style={dotSlot.style}
              role="tab"
              aria-selected={isActive}
              aria-label={`Slide ${i + 1}`}
              onClick={() => ctx.goTo(i)}
              data-testid="carousel-indicator"
            />
          );
        })}
      </div>
    );
  },
);

// ── Component Props ─────────────────────────────────

export interface CarouselComponentProps extends SlotStyleProps<CarouselSlot> {
  /** Props-based: slayt icerikleri / Slide contents */
  slides?: ReactNode[];
  /** Otomatik oynatim / Autoplay */
  autoplay?: boolean;
  /** Otomatik oynatim araligi (ms) / Autoplay interval */
  autoplayInterval?: number;
  /** Dongu / Loop */
  loop?: boolean;
  /** Baslangic indexi / Default index */
  defaultIndex?: number;
  /** Navigasyon butonlari gosterilsin mi / Show navigation buttons */
  showNavigation?: boolean;
  /** Gostergeler gosterilsin mi / Show indicators */
  showIndicators?: boolean;
  /** Slayt degisince / On slide change */
  onSlideChange?: (index: number) => void;
  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Component ────────────────────────────────────────

const CarouselBase = forwardRef<HTMLDivElement, CarouselComponentProps>(
  function Carousel(props, ref) {
    const {
      slides,
      autoplay = false,
      autoplayInterval = 3000,
      loop = false,
      defaultIndex = 0,
      showNavigation = true,
      showIndicators = true,
      onSlideChange,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const slideCount = slides ? slides.length : 0;

    const hookProps: UseCarouselProps = {
      slideCount: children ? undefined : slideCount,
      defaultIndex,
      autoplay,
      autoplayInterval,
      loop,
      onSlideChange,
    };

    const carousel = useCarousel(hookProps);

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootClassName = className ? `${rootSlot.className} ${className}` : rootSlot.className;

    // ── Compound API ──
    if (children) {
      const ctxValue: CarouselContextValue = {
        activeIndex: carousel.activeIndex,
        slideCount: carousel.slideCount,
        loop: carousel.loop,
        next: carousel.next,
        prev: carousel.prev,
        goTo: carousel.goTo,
        classNames,
        styles,
      };

      return (
        <CarouselContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={rootClassName}
            style={{ ...rootSlot.style, ...styleProp }}
            role="region"
            aria-roledescription="carousel"
            aria-label="Carousel"
            data-testid="carousel-root"
          >
            {children}
          </div>
        </CarouselContext.Provider>
      );
    }

    // ── Props-based API ──
    const viewportSlot = getSlotProps('viewport', viewportStyle, classNames, styles);
    const slideSlotFn = getSlotProps('slide', slideStyle, classNames, styles);
    const prevSlot = getSlotProps('prevButton', prevButtonStyle, classNames, styles);
    const nextSlot = getSlotProps('nextButton', nextButtonStyle, classNames, styles);
    const indicatorsSlot = getSlotProps('indicators', indicatorsStyle, classNames, styles);

    const prevDisabled = !loop && carousel.activeIndex === 0;
    const nextDisabled = !loop && carousel.activeIndex >= slideCount - 1;

    return (
      <div
        ref={ref}
        className={rootClassName}
        style={{ ...rootSlot.style, ...styleProp }}
        role="region"
        aria-roledescription="carousel"
        aria-label="Carousel"
        data-testid="carousel-root"
      >
        <div
          className={viewportSlot.className}
          style={{
            ...viewportSlot.style,
            transform: `translateX(-${carousel.activeIndex * 100}%)`,
          }}
          data-testid="carousel-viewport"
        >
          {slides?.map((slide, i) => (
            <div
              key={i}
              className={slideSlotFn.className}
              style={slideSlotFn.style}
              data-testid="carousel-slide"
            >
              {slide}
            </div>
          ))}
        </div>

        {showNavigation && slideCount > 1 && (
          <>
            <button
              type="button"
              className={prevSlot.className}
              style={prevSlot.style}
              onClick={carousel.prev}
              disabled={prevDisabled}
              aria-label="Previous slide"
              data-testid="carousel-prevButton"
            >
              <ChevronLeftIcon size={16} />
            </button>
            <button
              type="button"
              className={nextSlot.className}
              style={nextSlot.style}
              onClick={carousel.next}
              disabled={nextDisabled}
              aria-label="Next slide"
              data-testid="carousel-nextButton"
            >
              <ChevronRightIcon size={16} />
            </button>
          </>
        )}

        {showIndicators && slideCount > 1 && (
          <div
            className={indicatorsSlot.className}
            style={indicatorsSlot.style}
            role="tablist"
            data-testid="carousel-indicators"
          >
            {slides?.map((_, i) => {
              const isActive = i === carousel.activeIndex;
              const dotBase = isActive
                ? `${indicatorStyle} ${indicatorActiveStyle}`
                : indicatorStyle;
              const dotSlot = getSlotProps('indicator', dotBase, classNames, styles);
              return (
                <button
                  key={i}
                  type="button"
                  className={dotSlot.className}
                  style={dotSlot.style}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => carousel.goTo(i)}
                  data-testid="carousel-indicator"
                />
              );
            })}
          </div>
        )}
      </div>
    );
  },
);

/**
 * Carousel bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Carousel
 *   slides={[<div>Slide 1</div>, <div>Slide 2</div>]}
 *   autoplay
 *   loop
 * />
 * ```
 *
 * @example Compound
 * ```tsx
 * <Carousel>
 *   <Carousel.Viewport>
 *     <Carousel.Slide>Slide 1</Carousel.Slide>
 *     <Carousel.Slide>Slide 2</Carousel.Slide>
 *   </Carousel.Viewport>
 *   <Carousel.PrevButton />
 *   <Carousel.NextButton />
 *   <Carousel.Indicators />
 * </Carousel>
 * ```
 */
export const Carousel = Object.assign(CarouselBase, {
  Viewport: CarouselViewport,
  Slide: CarouselSlide,
  PrevButton: CarouselPrevButton,
  NextButton: CarouselNextButton,
  Indicators: CarouselIndicators,
});

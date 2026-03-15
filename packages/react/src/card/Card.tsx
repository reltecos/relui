/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Card — icerik karti bilesen (Dual API).
 * Card — content card component (Dual API).
 *
 * Props-based: `<Card title="Baslik" footer={<button>Kaydet</button>}>Icerik</Card>`
 * Compound:    `<Card><Card.Header>...</Card.Header><Card.Body>...</Card.Body></Card>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import {
  cardRootStyle,
  cardVariantStyles,
  cardHeaderStyle,
  cardTitleStyle,
  cardSubtitleStyle,
  cardBodyStyle,
  cardFooterStyle,
  cardMediaStyle,
} from './card.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/**
 * Card slot isimleri / Card slot names.
 */
export type CardSlot = 'root' | 'header' | 'title' | 'subtitle' | 'body' | 'footer' | 'media' | 'action';

// ── Types ────────────────────────────────────────────

/** Card varyantlari / Card variants */
export type CardVariant = 'elevated' | 'outlined' | 'filled';

/** Card media tanimlari / Card media definition */
export interface CardMedia {
  /** Gorsel URL / Image URL */
  src: string;
  /** Alt metin / Alt text */
  alt: string;
  /** Yukseklik / Height */
  height?: number | string;
}

// ── Context (Compound API) ──────────────────────────

interface CardContextValue {
  variant: CardVariant;
  classNames: ClassNames<CardSlot> | undefined;
  styles: Styles<CardSlot> | undefined;
}

const CardContext = createContext<CardContextValue | null>(null);

function useCardContext(): CardContextValue {
  const ctx = useContext(CardContext);
  if (!ctx) throw new Error('Card compound sub-components must be used within <Card>.');
  return ctx;
}

// ── Compound: Card.Header ────────────────────────────

/** Card.Header props */
export interface CardHeaderProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  function CardHeader(props, ref) {
    const { children, className } = props;
    const ctx = useCardContext();
    const slot = getSlotProps('header', cardHeaderStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="card-header">
        {children}
      </div>
    );
  },
);

// ── Compound: Card.Body ──────────────────────────────

/** Card.Body props */
export interface CardBodyProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  function CardBody(props, ref) {
    const { children, className } = props;
    const ctx = useCardContext();
    const slot = getSlotProps('body', cardBodyStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="card-body">
        {children}
      </div>
    );
  },
);

// ── Compound: Card.Footer ────────────────────────────

/** Card.Footer props */
export interface CardFooterProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  function CardFooter(props, ref) {
    const { children, className } = props;
    const ctx = useCardContext();
    const slot = getSlotProps('footer', cardFooterStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="card-footer">
        {children}
      </div>
    );
  },
);

// ── Component Props ─────────────────────────────────

export interface CardComponentProps extends SlotStyleProps<CardSlot> {
  /** Varyant / Variant */
  variant?: CardVariant;
  /** Baslik / Title */
  title?: React.ReactNode;
  /** Alt baslik / Subtitle */
  subtitle?: React.ReactNode;
  /** Gorsel / Media */
  media?: CardMedia;
  /** Sag taraf aksiyonu / Right action in header */
  action?: React.ReactNode;
  /** Footer icerigi / Footer content */
  footer?: React.ReactNode;
  /** Icerik (body) veya compound children / Content (body) or compound children */
  children?: React.ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
  /** Compound API aktif mi (true ise children compound olarak render edilir) */
  compound?: boolean;
}

// ── Component ────────────────────────────────────────

const CardBase = forwardRef<HTMLDivElement, CardComponentProps>(
  function Card(props, ref) {
    const {
      variant = 'elevated',
      title,
      subtitle,
      media,
      action,
      footer,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
      compound,
    } = props;

    // ── Slots ──
    const rootSlot = getSlotProps('root', `${cardRootStyle} ${cardVariantStyles[variant]}`, classNames, styles);
    const rootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    const ctxValue: CardContextValue = { variant, classNames, styles };

    // ── Compound API ──
    // compound=true ile acikca belirtilmeli (Card'da children her zaman body olarak kullanilir)
    const isCompound = compound === true;

    if (isCompound && children) {
      return (
        <CardContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={rootClassName}
            style={{ ...rootSlot.style, ...styleProp }}
            data-variant={variant}
            data-testid="card-root"
          >
            {children}
          </div>
        </CardContext.Provider>
      );
    }

    // ── Props-based API ──
    const headerSlot = getSlotProps('header', cardHeaderStyle, classNames, styles);
    const titleSlot = getSlotProps('title', cardTitleStyle, classNames, styles);
    const subtitleSlot = getSlotProps('subtitle', cardSubtitleStyle, classNames, styles);
    const bodySlot = getSlotProps('body', cardBodyStyle, classNames, styles);
    const footerSlot = getSlotProps('footer', cardFooterStyle, classNames, styles);
    const mediaSlot = getSlotProps('media', cardMediaStyle, classNames, styles);
    const actionSlot = getSlotProps('action', '', classNames, styles);

    const hasHeader = title !== undefined || subtitle !== undefined || action !== undefined;

    return (
      <div
        ref={ref}
        className={rootClassName}
        style={{ ...rootSlot.style, ...styleProp }}
        data-variant={variant}
        data-testid="card-root"
      >
        {/* Media */}
        {media && (
          <img
            src={media.src}
            alt={media.alt}
            className={mediaSlot.className}
            style={{
              ...mediaSlot.style,
              height: media.height ?? undefined,
            }}
            data-testid="card-media"
          />
        )}

        {/* Header */}
        {hasHeader && (
          <div
            className={headerSlot.className}
            style={headerSlot.style}
            data-testid="card-header"
          >
            <div>
              {title !== undefined && (
                <h3
                  className={titleSlot.className}
                  style={titleSlot.style}
                  data-testid="card-title"
                >
                  {title}
                </h3>
              )}
              {subtitle !== undefined && (
                <p
                  className={subtitleSlot.className}
                  style={subtitleSlot.style}
                  data-testid="card-subtitle"
                >
                  {subtitle}
                </p>
              )}
            </div>
            {action !== undefined && (
              <div
                className={actionSlot.className || undefined}
                style={actionSlot.style}
                data-testid="card-action"
              >
                {action}
              </div>
            )}
          </div>
        )}

        {/* Body */}
        {children !== undefined && (
          <div
            className={bodySlot.className}
            style={bodySlot.style}
            data-testid="card-body"
          >
            {children}
          </div>
        )}

        {/* Footer */}
        {footer !== undefined && (
          <div
            className={footerSlot.className}
            style={footerSlot.style}
            data-testid="card-footer"
          >
            {footer}
          </div>
        )}
      </div>
    );
  },
);

/**
 * Card bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Card title="Baslik" subtitle="Alt baslik" footer={<button>Kaydet</button>}>
 *   <p>Icerik</p>
 * </Card>
 * ```
 *
 * @example Compound
 * ```tsx
 * <Card>
 *   <Card.Header>Baslik</Card.Header>
 *   <Card.Body>Icerik</Card.Body>
 *   <Card.Footer>Footer</Card.Footer>
 * </Card>
 * ```
 */
export const Card = Object.assign(CardBase, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});

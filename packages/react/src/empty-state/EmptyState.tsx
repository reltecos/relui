/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * EmptyState — bos veri durumu bilesen (Dual API).
 * EmptyState — empty data state component (Dual API).
 *
 * Props-based: `<EmptyState title="Veri bulunamadi" description="Henuz kayit yok." />`
 * Compound:    `<EmptyState><EmptyState.Icon>...</EmptyState.Icon>...</EmptyState>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import {
  emptyStateRootRecipe,
  emptyStateIconRecipe,
  emptyStateTitleRecipe,
  emptyStateDescriptionRecipe,
  emptyStateActionStyle,
} from './empty-state.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';
import { MessageSquareIcon } from '@relteco/relui-icons';

// ── Slot ──────────────────────────────────────────────

/**
 * EmptyState slot isimleri / EmptyState slot names.
 */
export type EmptyStateSlot = 'root' | 'icon' | 'title' | 'description' | 'action';

// ── Types ─────────────────────────────────────────────

/** EmptyState boyutu / EmptyState size. */
export type EmptyStateSize = 'sm' | 'md' | 'lg';

// ── Context (Compound API) ──────────────────────────

interface EmptyStateContextValue {
  size: EmptyStateSize;
  classNames: ClassNames<EmptyStateSlot> | undefined;
  styles: Styles<EmptyStateSlot> | undefined;
}

const EmptyStateContext = createContext<EmptyStateContextValue | null>(null);

function useEmptyStateContext(): EmptyStateContextValue {
  const ctx = useContext(EmptyStateContext);
  if (!ctx) throw new Error('EmptyState compound sub-components must be used within <EmptyState>.');
  return ctx;
}

// ── Compound: EmptyState.Icon ────────────────────────

/** EmptyState.Icon props */
export interface EmptyStateIconProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const EmptyStateIcon = forwardRef<HTMLDivElement, EmptyStateIconProps>(
  function EmptyStateIcon(props, ref) {
    const { children, className } = props;
    const ctx = useEmptyStateContext();
    const slot = getSlotProps('icon', emptyStateIconRecipe({ size: ctx.size }), ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="empty-state-icon">
        {children}
      </div>
    );
  },
);

// ── Compound: EmptyState.Title ───────────────────────

/** EmptyState.Title props */
export interface EmptyStateTitleProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const EmptyStateTitle = forwardRef<HTMLHeadingElement, EmptyStateTitleProps>(
  function EmptyStateTitle(props, ref) {
    const { children, className } = props;
    const ctx = useEmptyStateContext();
    const slot = getSlotProps('title', emptyStateTitleRecipe({ size: ctx.size }), ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <h3 ref={ref} className={cls} style={slot.style} data-testid="empty-state-title">
        {children}
      </h3>
    );
  },
);

// ── Compound: EmptyState.Description ─────────────────

/** EmptyState.Description props */
export interface EmptyStateDescriptionProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const EmptyStateDescription = forwardRef<HTMLParagraphElement, EmptyStateDescriptionProps>(
  function EmptyStateDescription(props, ref) {
    const { children, className } = props;
    const ctx = useEmptyStateContext();
    const slot = getSlotProps('description', emptyStateDescriptionRecipe({ size: ctx.size }), ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <p ref={ref} className={cls} style={slot.style} data-testid="empty-state-description">
        {children}
      </p>
    );
  },
);

// ── Compound: EmptyState.Action ──────────────────────

/** EmptyState.Action props */
export interface EmptyStateActionProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const EmptyStateAction = forwardRef<HTMLDivElement, EmptyStateActionProps>(
  function EmptyStateAction(props, ref) {
    const { children, className } = props;
    const ctx = useEmptyStateContext();
    const slot = getSlotProps('action', emptyStateActionStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="empty-state-action">
        {children}
      </div>
    );
  },
);

// ── Component Props ───────────────────────────────────

export interface EmptyStateComponentProps extends SlotStyleProps<EmptyStateSlot> {
  /** Ikon / Icon (ReactNode) */
  icon?: ReactNode;
  /** Baslik / Title */
  title?: ReactNode;
  /** Aciklama / Description */
  description?: ReactNode;
  /** Aksiyon alani / Action area (butonlar) */
  action?: ReactNode;
  /** Boyut / Size */
  size?: EmptyStateSize;
  /** Compound API children */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
  /** id */
  id?: string;
}

// ── Component ─────────────────────────────────────────

const EmptyStateBase = forwardRef<HTMLDivElement, EmptyStateComponentProps>(
  function EmptyState(props, ref) {
    const {
      icon,
      title,
      description,
      action,
      size = 'md',
      children,
      className,
      style: styleProp,
      classNames,
      styles,
      id,
    } = props;

    // ── Slots ──
    const rootClass = emptyStateRootRecipe({ size });
    const rootSlot = getSlotProps('root', rootClass, classNames, styles);
    const combinedRootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;
    const combinedRootStyle = styleProp
      ? { ...rootSlot.style, ...styleProp }
      : rootSlot.style;

    const ctxValue: EmptyStateContextValue = { size, classNames, styles };

    // ── Compound API ──
    if (children) {
      return (
        <EmptyStateContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={combinedRootClassName}
            style={combinedRootStyle}
            id={id}
            data-testid="empty-state"
          >
            {children}
          </div>
        </EmptyStateContext.Provider>
      );
    }

    // ── Props-based API ──
    const iconSlot = getSlotProps('icon', emptyStateIconRecipe({ size }), classNames, styles);
    const titleSlot = getSlotProps('title', emptyStateTitleRecipe({ size }), classNames, styles);
    const descSlot = getSlotProps('description', emptyStateDescriptionRecipe({ size }), classNames, styles);
    const actionSlot = getSlotProps('action', emptyStateActionStyle, classNames, styles);

    // ── Resolve icon ──
    const resolvedIcon = icon !== undefined ? icon : <MessageSquareIcon size="100%" />;

    return (
      <div
        ref={ref}
        className={combinedRootClassName}
        style={combinedRootStyle}
        id={id}
        data-testid="empty-state"
      >
        {resolvedIcon !== null && (
          <div className={iconSlot.className} style={iconSlot.style} data-testid="empty-state-icon">
            {resolvedIcon}
          </div>
        )}

        {title && (
          <h3 className={titleSlot.className} style={titleSlot.style} data-testid="empty-state-title">
            {title}
          </h3>
        )}

        {description && (
          <p className={descSlot.className} style={descSlot.style} data-testid="empty-state-description">
            {description}
          </p>
        )}

        {action && (
          <div className={actionSlot.className} style={actionSlot.style} data-testid="empty-state-action">
            {action}
          </div>
        )}
      </div>
    );
  },
);

/**
 * EmptyState bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <EmptyState title="Veri bulunamadi" description="Henuz kayit yok." action={<Button>Ekle</Button>} />
 * ```
 *
 * @example Compound
 * ```tsx
 * <EmptyState>
 *   <EmptyState.Icon><SearchIcon /></EmptyState.Icon>
 *   <EmptyState.Title>Sonuc bulunamadi</EmptyState.Title>
 *   <EmptyState.Description>Farkli anahtar kelimeler deneyin.</EmptyState.Description>
 *   <EmptyState.Action><Button>Yeniden Ara</Button></EmptyState.Action>
 * </EmptyState>
 * ```
 */
export const EmptyState = Object.assign(EmptyStateBase, {
  Icon: EmptyStateIcon,
  Title: EmptyStateTitle,
  Description: EmptyStateDescription,
  Action: EmptyStateAction,
});

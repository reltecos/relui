/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Avatar — kullanici avatari bilesen (Dual API).
 * Avatar — user avatar component (Dual API).
 *
 * Props-based: `<Avatar src="/photo.jpg" name="Ali Veli" />`
 * Compound:    `<Avatar><Avatar.Image src="/photo.jpg" /><Avatar.Fallback>AV</Avatar.Fallback></Avatar>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, useState, type ReactNode } from 'react';
import { avatarRootRecipe, avatarImageStyle, avatarFallbackStyle } from './avatar.css';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** Avatar slot isimleri / Avatar slot names. */
export type AvatarSlot = 'root' | 'image' | 'fallback';

// ── Types ────────────────────────────────────────────

/** Avatar boyutlari / Avatar sizes */
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Avatar varyantlari / Avatar variants */
export type AvatarVariant = 'circle' | 'square';

// ── Token-based Avatar Colors ───────────────────────

const AVATAR_TOKEN_COLORS = [
  'var(--rel-color-primary, #3b82f6)',
  'var(--rel-color-error, #ef4444)',
  'var(--rel-color-success, #10b981)',
  'var(--rel-color-warning, #f59e0b)',
  'var(--rel-color-info, #8b5cf6)',
  'var(--rel-color-danger, #ec4899)',
  'var(--rel-color-info-light, #06b6d4)',
  'var(--rel-color-secondary, #f97316)',
  'var(--rel-color-success-light, #14b8a6)',
  'var(--rel-color-primary-light, #6366f1)',
];

// ── Helpers ─────────────────────────────────────────

/**
 * Isimden bas harfler uretir / Generates initials from name.
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0];
  if (!first) return '';
  if (parts.length === 1) return first.charAt(0).toUpperCase();
  const last = parts[parts.length - 1];
  return (first.charAt(0) + (last ? last.charAt(0) : '')).toUpperCase();
}

/**
 * Isimden deterministik renk uretir (tema token'lari ile).
 * Generates deterministic color from name (using theme tokens).
 */
export function getColorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = AVATAR_TOKEN_COLORS[Math.abs(hash) % AVATAR_TOKEN_COLORS.length];
  return color ?? AVATAR_TOKEN_COLORS[0] ?? 'var(--rel-color-primary, #3b82f6)';
}

// ── Context (Compound API) ─────────────────────────

interface AvatarContextValue {
  size: AvatarSize;
  variant: AvatarVariant;
  name?: string;
  showImage: boolean;
  imgError: boolean;
  onImgError: () => void;
  classNames?: SlotStyleProps<AvatarSlot>['classNames'];
  styles?: SlotStyleProps<AvatarSlot>['styles'];
}

const AvatarContext = createContext<AvatarContextValue | null>(null);

function useAvatarContext(): AvatarContextValue {
  const ctx = useContext(AvatarContext);
  if (!ctx) throw new Error('Avatar compound sub-components must be used within <Avatar>.');
  return ctx;
}

// ── Compound: Avatar.Image ──────────────────────────

/** Avatar.Image props / Avatar.Image props. */
export interface AvatarImageProps {
  /** Gorsel URL / Image URL */
  src: string;
  /** Alt metin / Alt text */
  alt?: string;
}

const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
  function AvatarImage(props, ref) {
    const { src, alt } = props;
    const ctx = useAvatarContext();
    const imageSlot = getSlotProps('image', avatarImageStyle, ctx.classNames, ctx.styles);

    if (ctx.imgError) return null;

    return (
      <img
        ref={ref}
        src={src}
        alt={alt ?? ctx.name ?? 'avatar'}
        className={imageSlot.className}
        style={imageSlot.style}
        onError={ctx.onImgError}
        data-testid="avatar-image"
      />
    );
  },
);

// ── Compound: Avatar.Fallback ───────────────────────

/** Avatar.Fallback props / Avatar.Fallback props. */
export interface AvatarFallbackProps {
  /** Fallback icerigi / Fallback content (overrides initials) */
  children?: ReactNode;
}

const AvatarFallback = forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  function AvatarFallback(props, ref) {
    const { children } = props;
    const ctx = useAvatarContext();
    const fallbackSlot = getSlotProps('fallback', avatarFallbackStyle, ctx.classNames, ctx.styles);

    if (ctx.showImage && !ctx.imgError) return null;

    const content = children ?? (ctx.name ? getInitials(ctx.name) : '');

    return (
      <span
        ref={ref}
        className={fallbackSlot.className}
        style={fallbackSlot.style}
        data-testid="avatar-fallback"
      >
        {content}
      </span>
    );
  },
);

// ── Component Props ─────────────────────────────────

export interface AvatarComponentProps extends SlotStyleProps<AvatarSlot> {
  /** Gorsel URL / Image URL */
  src?: string;
  /** Alt metin / Alt text */
  alt?: string;
  /** Isim (fallback initials icin) / Name for fallback initials */
  name?: string;
  /** Boyut / Size */
  size?: AvatarSize;
  /** Varyant / Variant */
  variant?: AvatarVariant;
  /** Arka plan rengi — token key veya CSS degeri / Background color — token key or CSS value */
  color?: string;
  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Component ────────────────────────────────────────

const AvatarBase = forwardRef<HTMLDivElement, AvatarComponentProps>(
  function Avatar(props, ref) {
    const {
      src,
      alt,
      name,
      size = 'md',
      variant = 'circle',
      color,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const [imgError, setImgError] = useState(false);

    const rootBaseClass = avatarRootRecipe({ size, variant });
    const rootSlot = getSlotProps('root', rootBaseClass, classNames, styles, styleProp);
    const imageSlot = getSlotProps('image', avatarImageStyle, classNames, styles);
    const fallbackSlot = getSlotProps('fallback', avatarFallbackStyle, classNames, styles);

    const rootClassName = className ? `${rootSlot.className} ${className}` : rootSlot.className;

    const showImage = src !== undefined && !imgError;
    const initials = name ? getInitials(name) : '';
    const bgColor = color ?? (name ? getColorFromName(name) : 'var(--rel-color-fg-muted, #9ca3af)');

    // ── Compound API ──
    if (children) {
      const ctxValue: AvatarContextValue = {
        size,
        variant,
        name,
        showImage,
        imgError,
        onImgError: () => setImgError(true),
        classNames,
        styles,
      };

      return (
        <AvatarContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={rootClassName}
            style={{
              ...rootSlot.style,
              ...(!showImage ? { backgroundColor: bgColor, color: 'var(--rel-color-bg, #ffffff)' } : {}),
            }}
            role="img"
            aria-label={alt ?? name ?? 'avatar'}
            data-testid="avatar-root"
            data-size={size}
            data-variant={variant}
          >
            {children}
          </div>
        </AvatarContext.Provider>
      );
    }

    // ── Props-based API ──
    return (
      <div
        ref={ref}
        className={rootClassName}
        style={{
          ...rootSlot.style,
          ...(!showImage ? { backgroundColor: bgColor, color: 'var(--rel-color-bg, #ffffff)' } : {}),
        }}
        role="img"
        aria-label={alt ?? name ?? 'avatar'}
        data-testid="avatar-root"
        data-size={size}
        data-variant={variant}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt ?? name ?? 'avatar'}
            className={imageSlot.className}
            style={imageSlot.style}
            onError={() => setImgError(true)}
            data-testid="avatar-image"
          />
        ) : (
          <span
            className={fallbackSlot.className}
            style={fallbackSlot.style}
            data-testid="avatar-fallback"
          >
            {initials}
          </span>
        )}
      </div>
    );
  },
);

/**
 * Avatar bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Avatar src="/photo.jpg" name="Ali Veli" size="lg" />
 * ```
 *
 * @example Compound
 * ```tsx
 * <Avatar name="Ali Veli">
 *   <Avatar.Image src="/photo.jpg" />
 *   <Avatar.Fallback>AV</Avatar.Fallback>
 * </Avatar>
 * ```
 */
export const Avatar = Object.assign(AvatarBase, {
  Image: AvatarImage,
  Fallback: AvatarFallback,
});

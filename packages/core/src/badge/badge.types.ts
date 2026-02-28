/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Badge type definitions — framework-agnostic.
 * Badge tip tanımları — framework bağımsız.
 *
 * Küçük durum göstergesi / Small status indicator.
 *
 * @packageDocumentation
 */

/**
 * Badge boyutu / Badge size.
 */
export type BadgeSize = 'sm' | 'md' | 'lg';

/**
 * Badge renk şeması / Badge color scheme.
 */
export type BadgeColor = 'accent' | 'neutral' | 'destructive' | 'success' | 'warning';

/**
 * Badge görünüm varyantı / Badge visual variant.
 */
export type BadgeVariant = 'solid' | 'soft' | 'outline';

/**
 * Badge props — framework-agnostic yapılandırma.
 * Badge props — framework-agnostic configuration.
 */
export interface BadgeProps {
  /** Boyut / Size */
  size?: BadgeSize;

  /** Renk şeması / Color scheme */
  color?: BadgeColor;

  /** Görünüm varyantı / Visual variant */
  variant?: BadgeVariant;
}

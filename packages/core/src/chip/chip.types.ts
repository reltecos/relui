/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Chip type definitions — framework-agnostic.
 * Chip tip tanımları — framework bağımsız.
 *
 * Seçilebilir/kaldırılabilir kompakt eleman.
 * Selectable/removable compact element.
 *
 * @packageDocumentation
 */

/**
 * Chip boyutu / Chip size.
 */
export type ChipSize = 'sm' | 'md' | 'lg';

/**
 * Chip renk şeması / Chip color scheme.
 */
export type ChipColor = 'accent' | 'neutral' | 'destructive' | 'success' | 'warning';

/**
 * Chip görünüm varyantı / Chip visual variant.
 */
export type ChipVariant = 'solid' | 'soft' | 'outline';

/**
 * Chip props — framework-agnostic yapılandırma.
 * Chip props — framework-agnostic configuration.
 */
export interface ChipProps {
  /** Boyut / Size */
  size?: ChipSize;

  /** Renk şeması / Color scheme */
  color?: ChipColor;

  /** Görünüm varyantı / Visual variant */
  variant?: ChipVariant;

  /** Seçili durumu / Selected state */
  selected?: boolean;

  /** Kaldırılabilir mi / Is removable */
  removable?: boolean;

  /** Pasif durumu / Disabled state */
  disabled?: boolean;
}

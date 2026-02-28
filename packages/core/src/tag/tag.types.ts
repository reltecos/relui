/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Tag type definitions — framework-agnostic.
 * Tag tip tanımları — framework bağımsız.
 *
 * Etiket / kategorileme bileşeni — opsiyonel kaldırma butonu.
 * Tag / categorization component — optional remove button.
 *
 * @packageDocumentation
 */

/**
 * Tag boyutu / Tag size.
 */
export type TagSize = 'sm' | 'md' | 'lg';

/**
 * Tag renk şeması / Tag color scheme.
 */
export type TagColor = 'accent' | 'neutral' | 'destructive' | 'success' | 'warning';

/**
 * Tag görünüm varyantı / Tag visual variant.
 */
export type TagVariant = 'solid' | 'soft' | 'outline';

/**
 * Tag props — framework-agnostic yapılandırma.
 * Tag props — framework-agnostic configuration.
 */
export interface TagProps {
  /** Boyut / Size */
  size?: TagSize;

  /** Renk şeması / Color scheme */
  color?: TagColor;

  /** Görünüm varyantı / Visual variant */
  variant?: TagVariant;

  /** Kaldırılabilir mi / Is removable */
  removable?: boolean;

  /** Pasif durumu / Disabled state */
  disabled?: boolean;
}

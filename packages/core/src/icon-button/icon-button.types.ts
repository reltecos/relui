/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * IconButton type definitions — framework-agnostic.
 * IconButton tip tanımları — framework bağımsız.
 *
 * IconButton, Button'ın kare (square) varyasyonudur.
 * Sadece ikon içerir, metin içermez. aria-label zorunludur.
 *
 * @packageDocumentation
 */

import type { ButtonVariant, ButtonSize, ButtonColor, ButtonElementType } from '../button';

/**
 * IconButton props — core yapılandırma.
 * IconButton props — core configuration.
 *
 * Button'dan farklı olarak `aria-label` zorunludur çünkü
 * görsel ikon tek başına ekran okuyucular için yeterli değil.
 */
export interface IconButtonProps {
  /** Görsel varyant / Visual variant */
  variant?: ButtonVariant;

  /** Boyut / Size */
  size?: ButtonSize;

  /** Renk şeması / Color scheme */
  color?: ButtonColor;

  /** Pasif durumu / Disabled state */
  disabled?: boolean;

  /** Yüklenme durumu / Loading state */
  loading?: boolean;

  /** HTML button type */
  type?: 'button' | 'submit' | 'reset';

  /** Render edileceği element tipi / Element type to render as */
  elementType?: ButtonElementType;

  /**
   * Erişilebilirlik etiketi — ZORUNLU.
   * Accessibility label — REQUIRED.
   *
   * IconButton metin içermediği için ekran okuyucular bu etiketi kullanır.
   * Since IconButton has no text content, screen readers use this label.
   *
   * @example 'Ayarları aç' / 'Open settings'
   */
  'aria-label': string;
}

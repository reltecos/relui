/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * CopyButton type definitions — framework-agnostic.
 * CopyButton tip tanımları — framework bağımsız.
 *
 * CopyButton, Button'ın kopyalama işlevselliği eklenmiş varyasyonudur.
 * Bir değeri panoya kopyalar ve kısa süre onay ikonu gösterir.
 * Core state machine kullanmaz — Button machine reuse eder.
 *
 * @packageDocumentation
 */

import type { ButtonVariant, ButtonSize, ButtonColor } from '../button';

/**
 * CopyButton boyut tipi — Button ile aynı.
 * CopyButton size type — same as Button.
 */
export type CopyButtonSize = ButtonSize;

/**
 * CopyButton props — core yapılandırma.
 * CopyButton props — core configuration.
 */
export interface CopyButtonProps {
  /** Kopyalanacak metin / Text to copy */
  value: string;

  /** Görsel varyant / Visual variant */
  variant?: ButtonVariant;

  /** Boyut / Size */
  size?: CopyButtonSize;

  /** Renk şeması / Color scheme */
  color?: ButtonColor;

  /** Pasif durumu / Disabled state */
  disabled?: boolean;

  /**
   * Kopyalama sonrası onay süresi (ms) / Copied confirmation duration (ms).
   *
   * @default 2000
   */
  copiedDuration?: number;

  /**
   * Erişilebilirlik etiketi — ZORUNLU.
   * Accessibility label — REQUIRED.
   *
   * @example 'Kopyala' / 'Copy'
   */
  'aria-label': string;
}

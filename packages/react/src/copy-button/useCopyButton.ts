/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useCopyButton — React hook for copy-to-clipboard button.
 * useCopyButton — Panoya kopyalama butonu React hook'u.
 *
 * Clipboard API ile değer kopyalar, kısa süre sonra onay durumu sıfırlanır.
 *
 * @packageDocumentation
 */

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * useCopyButton hook props.
 */
export interface UseCopyButtonProps {
  /** Kopyalanacak metin / Text to copy */
  value: string;

  /**
   * Kopyalama sonrası onay süresi (ms) / Copied confirmation duration (ms).
   *
   * @default 2000
   */
  copiedDuration?: number;

  /** Pasif durumu / Disabled state */
  disabled?: boolean;

  /** Kopyalama sonrası callback / Callback after copy */
  onCopy?: () => void;
}

/**
 * useCopyButton hook dönüş tipi.
 * useCopyButton hook return type.
 */
export interface UseCopyButtonReturn {
  /** Kopyalama başarılı mı / Is copy successful (transient) */
  copied: boolean;

  /** Kopyalama tetikle / Trigger copy */
  copy: () => void;
}

/**
 * Copy-to-clipboard hook'u — clipboard API ile değer kopyalar.
 * Copy-to-clipboard hook — copies value via clipboard API.
 *
 * @example
 * ```tsx
 * const { copied, copy } = useCopyButton({ value: 'hello' });
 *
 * return (
 *   <button onClick={copy}>
 *     {copied ? 'Kopyalandı!' : 'Kopyala'}
 *   </button>
 * );
 * ```
 */
export function useCopyButton(props: UseCopyButtonProps): UseCopyButtonReturn {
  const {
    value,
    copiedDuration = 2000,
    disabled = false,
    onCopy,
  } = props;

  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(() => {
    if (disabled) return;

    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      onCopy?.();

      // Önceki timer'ı temizle / Clear previous timer
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        setCopied(false);
        timerRef.current = null;
      }, copiedDuration);
    });
  }, [value, copiedDuration, disabled, onCopy]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { copied, copy };
}

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Slot-based classNames & styles API.
 *
 * Mantine tarzı slot customization: geliştiriciler iç elementlere
 * className ve inline style verebilir.
 *
 * @packageDocumentation
 */

import type { CSSProperties } from 'react';

/** Slot'lara className atama map'i. */
export type ClassNames<S extends string> = Partial<Record<S, string>>;

/** Slot'lara inline style atama map'i. */
export type Styles<S extends string> = Partial<Record<S, CSSProperties>>;

/** Bileşen prop'larına eklenen slot customization prop'ları. */
export interface SlotStyleProps<S extends string> {
  /** İç slot'lara ek CSS sınıfı atama. */
  classNames?: ClassNames<S>;
  /** İç slot'lara inline stil atama. */
  styles?: Styles<S>;
}

/**
 * Belirli bir slot için className ve style hesaplar.
 *
 * VE class + kullanıcı classNames merge edilir.
 * Mevcut style + kullanıcı styles merge edilir (kullanıcı kazanır).
 */
export function getSlotProps<S extends string>(
  slot: S,
  veClass: string | undefined,
  classNames: ClassNames<S> | undefined,
  styles: Styles<S> | undefined,
  existingStyle?: CSSProperties,
): { className: string; style: CSSProperties | undefined } {
  const userClass = classNames?.[slot];
  const userStyle = styles?.[slot];
  const className = [veClass, userClass].filter(Boolean).join(' ');
  const style =
    existingStyle || userStyle ? { ...existingStyle, ...userStyle } : undefined;
  return { className, style };
}

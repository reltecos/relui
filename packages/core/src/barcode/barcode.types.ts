/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Barcode tipleri.
 * Barcode types.
 *
 * @packageDocumentation
 */

/** Desteklenen barkod formatları / Supported barcode formats */
export type BarcodeFormat = 'code128' | 'code39' | 'ean13';

/** Barkod sonucu / Barcode result */
export interface BarcodeResult {
  /** Bar dizisi (true=siyah, false=beyaz) / Bar array (true=black, false=white) */
  bars: boolean[];
  /** Goruntulenecek metin / Display text */
  text: string;
  /** Format / Format */
  format: BarcodeFormat;
  /** Gecerli mi / Is valid */
  valid: boolean;
}

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/** Hata duzeltme seviyesi / Error correction level */
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

/** QR kod modulu degeri / QR code module value */
export type QRModule = 0 | 1;

/** QR kod matrisi / QR code matrix */
export type QRMatrix = QRModule[][];

/** QR kod olusturma ayarlari / QR code generation config */
export interface QRCodeConfig {
  /** Kodlanacak veri / Data to encode */
  value: string;
  /** Hata duzeltme seviyesi / Error correction level */
  errorCorrection?: ErrorCorrectionLevel;
}

/** QR kod sonucu / QR code result */
export interface QRCodeResult {
  /** Modul matrisi (1=siyah, 0=beyaz) / Module matrix (1=dark, 0=light) */
  matrix: QRMatrix;
  /** Versiyon (1-40) / Version (1-40) */
  version: number;
  /** Matris boyutu / Matrix size */
  size: number;
}

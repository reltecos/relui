/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * DiffViewer tipleri.
 * DiffViewer types.
 *
 * @packageDocumentation
 */

/** Diff satir tipi / Diff line type */
export type DiffLineType = 'add' | 'remove' | 'equal';

/** Diff satiri / Diff line */
export interface DiffLine {
  /** Satir tipi / Line type */
  type: DiffLineType;
  /** Eski satir icerigi / Old line content */
  oldValue: string;
  /** Yeni satir icerigi / New line content */
  newValue: string;
  /** Eski satir numarasi / Old line number */
  oldNum: number | null;
  /** Yeni satir numarasi / New line number */
  newNum: number | null;
}

/** Diff sonucu / Diff result */
export interface DiffResult {
  /** Diff satirlari / Diff lines */
  lines: DiffLine[];
  /** Eklenen satir sayisi / Added line count */
  addedCount: number;
  /** Silinen satir sayisi / Removed line count */
  removedCount: number;
}

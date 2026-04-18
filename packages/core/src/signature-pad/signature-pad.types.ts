/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/** Imza noktasi / Signature point */
export interface SignaturePoint {
  x: number;
  y: number;
  pressure: number;
}

/** Imza yolu / Signature path */
export interface SignaturePath {
  points: SignaturePoint[];
  strokeWidth: number;
  strokeColor: string;
}

/** SignaturePad event tipleri / SignaturePad event types */
export type SignaturePadEvent =
  | { type: 'DRAW_START'; x: number; y: number; pressure?: number }
  | { type: 'DRAW_MOVE'; x: number; y: number; pressure?: number }
  | { type: 'DRAW_END' }
  | { type: 'UNDO' }
  | { type: 'CLEAR' }
  | { type: 'SET_STROKE_WIDTH'; width: number }
  | { type: 'SET_STROKE_COLOR'; color: string };

/** SignaturePad context / SignaturePad context */
export interface SignaturePadContext {
  readonly paths: ReadonlyArray<SignaturePath>;
  readonly currentPath: SignaturePath | null;
  readonly strokeWidth: number;
  readonly strokeColor: string;
  readonly canUndo: boolean;
  readonly isEmpty: boolean;
}

/** SignaturePad yapilandirma / SignaturePad config */
export interface SignaturePadConfig {
  /** Varsayilan kalinlik / Default stroke width */
  defaultStrokeWidth?: number;
  /** Varsayilan renk / Default stroke color */
  defaultStrokeColor?: string;
  /** Degisim callback / On change callback */
  onChange?: (paths: SignaturePath[]) => void;
}

/** SignaturePad API / SignaturePad API */
export interface SignaturePadAPI {
  getContext(): SignaturePadContext;
  send(event: SignaturePadEvent): void;
  subscribe(fn: () => void): () => void;
  destroy(): void;
}

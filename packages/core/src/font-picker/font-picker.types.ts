/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * FontPicker tipleri.
 * FontPicker types.
 *
 * @packageDocumentation
 */

/** Font yapilandirmasi / Font configuration */
export interface FontConfig {
  /** Font ailesi / Font family */
  family: string;
  /** Font boyutu (px) / Font size in pixels */
  size: number;
  /** Font agirligi / Font weight */
  weight: number;
  /** Kalin / Bold */
  bold: boolean;
  /** Italik / Italic */
  italic: boolean;
  /** Alti cizili / Underline */
  underline: boolean;
}

/** FontPicker context */
export interface FontPickerContext {
  readonly config: FontConfig;
  readonly availableFonts: ReadonlyArray<string>;
}

/** FontPicker event leri */
export type FontPickerEvent =
  | { type: 'SET_FAMILY'; family: string }
  | { type: 'SET_SIZE'; size: number }
  | { type: 'SET_WEIGHT'; weight: number }
  | { type: 'TOGGLE_BOLD' }
  | { type: 'TOGGLE_ITALIC' }
  | { type: 'TOGGLE_UNDERLINE' }
  | { type: 'SET_CONFIG'; config: Partial<FontConfig> }
  | { type: 'RESET' };

/** FontPicker yapilandirmasi */
export interface FontPickerMachineConfig {
  defaultConfig?: Partial<FontConfig>;
  fonts?: string[];
  onChange?: (config: FontConfig) => void;
}

/** FontPicker API */
export interface FontPickerAPI {
  getContext(): FontPickerContext;
  send(event: FontPickerEvent): void;
  subscribe(callback: () => void): () => void;
  destroy(): void;
}

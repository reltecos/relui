/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * FontPicker state machine.
 *
 * @packageDocumentation
 */

import type { FontPickerMachineConfig, FontPickerContext, FontPickerEvent, FontPickerAPI, FontConfig } from './font-picker.types';

const DEFAULT_FONTS = [
  'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana',
  'Courier New', 'Trebuchet MS', 'Impact', 'Comic Sans MS', 'Palatino',
];

const DEFAULT_CONFIG: FontConfig = {
  family: 'Arial',
  size: 16,
  weight: 400,
  bold: false,
  italic: false,
  underline: false,
};

export function createFontPicker(config: FontPickerMachineConfig = {}): FontPickerAPI {
  const { onChange } = config;
  const availableFonts = config.fonts ?? [...DEFAULT_FONTS];

  let fontConfig: FontConfig = { ...DEFAULT_CONFIG, ...config.defaultConfig };

  const listeners = new Set<() => void>();
  function notify(): void {
    onChange?.({ ...fontConfig });
    for (const fn of listeners) fn();
  }

  function getContext(): FontPickerContext {
    return { config: { ...fontConfig }, availableFonts: [...availableFonts] };
  }

  function send(event: FontPickerEvent): void {
    switch (event.type) {
      case 'SET_FAMILY':
        fontConfig = { ...fontConfig, family: event.family };
        notify();
        break;
      case 'SET_SIZE':
        fontConfig = { ...fontConfig, size: Math.max(1, Math.min(999, Math.floor(event.size))) };
        notify();
        break;
      case 'SET_WEIGHT':
        fontConfig = { ...fontConfig, weight: event.weight };
        notify();
        break;
      case 'TOGGLE_BOLD':
        fontConfig = { ...fontConfig, bold: !fontConfig.bold, weight: !fontConfig.bold ? 700 : 400 };
        notify();
        break;
      case 'TOGGLE_ITALIC':
        fontConfig = { ...fontConfig, italic: !fontConfig.italic };
        notify();
        break;
      case 'TOGGLE_UNDERLINE':
        fontConfig = { ...fontConfig, underline: !fontConfig.underline };
        notify();
        break;
      case 'SET_CONFIG':
        fontConfig = { ...fontConfig, ...event.config };
        notify();
        break;
      case 'RESET':
        fontConfig = { ...DEFAULT_CONFIG, ...config.defaultConfig };
        notify();
        break;
    }
  }

  function subscribe(callback: () => void): () => void {
    listeners.add(callback);
    return () => { listeners.delete(callback); };
  }

  function destroy(): void { listeners.clear(); }

  return { getContext, send, subscribe, destroy };
}

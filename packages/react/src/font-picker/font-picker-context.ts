/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createContext, useContext } from 'react';
import type { FontPickerAPI, FontPickerContext } from '@relteco/relui-core';
import type { ClassNames, Styles } from '../utils/slot-styles';
import type { FontPickerSlot } from './FontPicker';

export interface FontPickerContextValue {
  api: FontPickerAPI;
  ctx: FontPickerContext;
  classNames: ClassNames<FontPickerSlot> | undefined;
  styles: Styles<FontPickerSlot> | undefined;
}

export const FontPickerCtx = createContext<FontPickerContextValue | null>(null);

export function useFontPickerContext(): FontPickerContextValue {
  const c = useContext(FontPickerCtx);
  if (!c) throw new Error('FontPicker compound sub-components must be used within <FontPicker>.');
  return c;
}

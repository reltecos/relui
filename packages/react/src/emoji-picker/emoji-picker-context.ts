/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createContext, useContext } from 'react';
import type { EmojiPickerAPI, EmojiPickerContext } from '@relteco/relui-core';
import type { ClassNames, Styles } from '../utils/slot-styles';
import type { EmojiPickerSlot } from './EmojiPicker';

export interface EmojiPickerContextValue {
  api: EmojiPickerAPI;
  ctx: EmojiPickerContext;
  columns: number;
  classNames: ClassNames<EmojiPickerSlot> | undefined;
  styles: Styles<EmojiPickerSlot> | undefined;
}

export const EmojiPickerCtx = createContext<EmojiPickerContextValue | null>(null);

export function useEmojiPickerContext(): EmojiPickerContextValue {
  const c = useContext(EmojiPickerCtx);
  if (!c) throw new Error('EmojiPicker compound sub-components must be used within <EmojiPicker>.');
  return c;
}

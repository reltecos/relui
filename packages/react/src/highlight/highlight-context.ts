/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createContext, useContext } from 'react';
import type { HighlightTextResult as HighlightResult } from '@relteco/relui-core';
import type { ClassNames, Styles } from '../utils/slot-styles';
import type { HighlightSlot } from './Highlight';

export interface HighlightContextValue {
  result: HighlightResult;
  classNames: ClassNames<HighlightSlot> | undefined;
  styles: Styles<HighlightSlot> | undefined;
}

export const HighlightCtx = createContext<HighlightContextValue | null>(null);

export function useHighlightContext(): HighlightContextValue {
  const c = useContext(HighlightCtx);
  if (!c) throw new Error('Highlight compound sub-components must be used within <Highlight>.');
  return c;
}

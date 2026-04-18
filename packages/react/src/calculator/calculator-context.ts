/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createContext, useContext } from 'react';
import type { CalculatorAPI, CalculatorContext } from '@relteco/relui-core';
import type { ClassNames, Styles } from '../utils/slot-styles';
import type { CalculatorSlot } from './Calculator';

export interface CalculatorContextValue {
  api: CalculatorAPI;
  ctx: CalculatorContext;
  classNames: ClassNames<CalculatorSlot> | undefined;
  styles: Styles<CalculatorSlot> | undefined;
}

export const CalculatorCtx = createContext<CalculatorContextValue | null>(null);

export function useCalculatorContext(): CalculatorContextValue {
  const c = useContext(CalculatorCtx);
  if (!c) throw new Error('Calculator compound sub-components must be used within <Calculator>.');
  return c;
}

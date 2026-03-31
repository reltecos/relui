/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createContext, useContext } from 'react';
import type { BarcodeResult } from '@relteco/relui-core';
import type { ClassNames, Styles } from '../utils/slot-styles';
import type { BarcodeGeneratorSlot } from './BarcodeGenerator';

export interface BarcodeContextValue {
  result: BarcodeResult;
  width: number;
  height: number;
  barColor: string;
  bgColor: string;
  classNames: ClassNames<BarcodeGeneratorSlot> | undefined;
  styles: Styles<BarcodeGeneratorSlot> | undefined;
}

export const BarcodeCtx = createContext<BarcodeContextValue | null>(null);

export function useBarcodeContext(): BarcodeContextValue {
  const ctx = useContext(BarcodeCtx);
  if (!ctx) throw new Error('BarcodeGenerator compound sub-components must be used within <BarcodeGenerator>.');
  return ctx;
}

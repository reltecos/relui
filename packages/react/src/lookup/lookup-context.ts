/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createContext, useContext } from 'react';
import type { LookupAPI, LookupContext } from '@relteco/relui-core';
import type { ClassNames, Styles } from '../utils/slot-styles';
import type { LookupSlot } from './Lookup';

export interface LookupContextValue {
  api: LookupAPI;
  ctx: LookupContext;
  classNames: ClassNames<LookupSlot> | undefined;
  styles: Styles<LookupSlot> | undefined;
}

export const LookupCtx = createContext<LookupContextValue | null>(null);

export function useLookupContext(): LookupContextValue {
  const c = useContext(LookupCtx);
  if (!c) throw new Error('Lookup compound sub-components must be used within <Lookup>.');
  return c;
}

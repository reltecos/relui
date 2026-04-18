/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createContext, useContext } from 'react';
import type { MentionAPI, MentionContext } from '@relteco/relui-core';
import type { ClassNames, Styles } from '../utils/slot-styles';
import type { MentionSlot } from './Mention';

export interface MentionContextValue {
  api: MentionAPI;
  ctx: MentionContext;
  trigger: string;
  classNames: ClassNames<MentionSlot> | undefined;
  styles: Styles<MentionSlot> | undefined;
}

export const MentionCtx = createContext<MentionContextValue | null>(null);

export function useMentionContext(): MentionContextValue {
  const c = useContext(MentionCtx);
  if (!c) throw new Error('Mention compound sub-components must be used within <Mention>.');
  return c;
}

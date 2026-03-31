/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createContext, useContext } from 'react';
import type { KanbanAPI, KanbanContext } from '@relteco/relui-core';
import type { ClassNames, Styles } from '../utils/slot-styles';
import type { KanbanBoardSlot } from './KanbanBoard';

export interface KanbanContextValue {
  api: KanbanAPI;
  ctx: KanbanContext;
  classNames: ClassNames<KanbanBoardSlot> | undefined;
  styles: Styles<KanbanBoardSlot> | undefined;
}

export const KanbanCtx = createContext<KanbanContextValue | null>(null);

export function useKanbanContext(): KanbanContextValue {
  const c = useContext(KanbanCtx);
  if (!c) throw new Error('KanbanBoard compound sub-components must be used within <KanbanBoard>.');
  return c;
}

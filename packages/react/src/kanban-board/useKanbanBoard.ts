/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect } from 'react';
import {
  createKanban,
  type KanbanAPI,
  type KanbanContext,
  type KanbanCard,
  type KanbanColumn,
  type KanbanSwimlane,
} from '@relteco/relui-core';

export interface UseKanbanBoardProps {
  columns?: KanbanColumn[];
  cards?: KanbanCard[];
  swimlanes?: KanbanSwimlane[];
  onCardMove?: (cardId: string, toColumnId: string, toSwimlaneId?: string) => void;
  onCardAdd?: (card: KanbanCard) => void;
  onCardRemove?: (cardId: string) => void;
}

export interface UseKanbanBoardReturn {
  api: KanbanAPI;
  ctx: KanbanContext;
}

export function useKanbanBoard(props: UseKanbanBoardProps): UseKanbanBoardReturn {
  const { columns, cards, swimlanes, onCardMove, onCardAdd, onCardRemove } = props;

  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<KanbanAPI | null>(null);
  const prevRef = useRef<UseKanbanBoardProps | undefined>(undefined);

  if (apiRef.current === null) {
    apiRef.current = createKanban({ columns, cards, swimlanes, onCardMove, onCardAdd, onCardRemove });
  }
  const api = apiRef.current;

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) { prevRef.current = props; return; }
    prevRef.current = props;
  });

  return { api, ctx: api.getContext() };
}

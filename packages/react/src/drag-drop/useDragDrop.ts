/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import { createDragDrop } from '@relteco/relui-core';
import type { DragDropConfig, DragDropContext, DragDropEvent, DragDropAPI } from '@relteco/relui-core';

export type UseDragDropProps = DragDropConfig;
export interface UseDragDropReturn { context: DragDropContext; send: (e: DragDropEvent) => void; api: DragDropAPI }

export function useDragDrop(props: UseDragDropProps): UseDragDropReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<DragDropAPI | null>(null);
  if (apiRef.current === null) { apiRef.current = createDragDrop(props); }
  const api = apiRef.current;
  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);
  const send = useCallback((e: DragDropEvent) => { api.send(e); }, [api]);
  return { context: api.getContext(), send, api };
}

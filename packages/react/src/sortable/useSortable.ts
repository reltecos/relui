/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import { createSortable } from '@relteco/relui-core';
import type { SortableConfig, SortableContext, SortableEvent, SortableAPI } from '@relteco/relui-core';

export type UseSortableProps = SortableConfig;
export interface UseSortableReturn { context: SortableContext; send: (e: SortableEvent) => void; api: SortableAPI }

export function useSortable(props: UseSortableProps): UseSortableReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<SortableAPI | null>(null);
  if (apiRef.current === null) { apiRef.current = createSortable(props); }
  const api = apiRef.current;
  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);
  const send = useCallback((e: SortableEvent) => { api.send(e); }, [api]);
  return { context: api.getContext(), send, api };
}

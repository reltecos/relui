/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import { createTreeGrid } from '@relteco/relui-core';
import type { TreeGridConfig, TreeGridContext, TreeGridEvent, TreeGridAPI } from '@relteco/relui-core';

export type UseTreeGridProps = TreeGridConfig;

export interface UseTreeGridReturn {
  context: TreeGridContext;
  send: (event: TreeGridEvent) => void;
  api: TreeGridAPI;
}

export function useTreeGrid(props: UseTreeGridProps): UseTreeGridReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<TreeGridAPI | null>(null);
  const prevRef = useRef<UseTreeGridProps | undefined>(undefined);

  if (apiRef.current === null) {
    apiRef.current = createTreeGrid(props);
  }
  const api = apiRef.current;

  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) { prevRef.current = props; return; }
    prevRef.current = props;
  });

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  const send = useCallback(
    (event: TreeGridEvent) => { api.send(event); },
    [api],
  );

  return { context: api.getContext(), send, api };
}

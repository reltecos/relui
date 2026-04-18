/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import { createPropertyGrid } from '@relteco/relui-core';
import type { PropertyGridConfig, PropertyGridContext, PropertyGridEvent, PropertyGridAPI } from '@relteco/relui-core';

export type UsePropertyGridProps = PropertyGridConfig;

export interface UsePropertyGridReturn {
  context: PropertyGridContext;
  send: (event: PropertyGridEvent) => void;
  api: PropertyGridAPI;
}

export function usePropertyGrid(props: UsePropertyGridProps): UsePropertyGridReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<PropertyGridAPI | null>(null);
  const prevRef = useRef<UsePropertyGridProps | undefined>(undefined);

  if (apiRef.current === null) {
    apiRef.current = createPropertyGrid(props);
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
    (event: PropertyGridEvent) => { api.send(event); },
    [api],
  );

  return { context: api.getContext(), send, api };
}

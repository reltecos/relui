/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect } from 'react';
import { createFilterBuilder, type FilterBuilderAPI, type FilterBuilderContext, type FilterGroup } from '@relteco/relui-core';

export interface UseFilterBuilderProps {
  defaultGroup?: FilterGroup;
  onChange?: (group: FilterGroup) => void;
}

export interface UseFilterBuilderReturn {
  api: FilterBuilderAPI;
  ctx: FilterBuilderContext;
}

export function useFilterBuilder(props: UseFilterBuilderProps): UseFilterBuilderReturn {
  const { defaultGroup, onChange } = props;
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<FilterBuilderAPI | null>(null);

  if (apiRef.current === null) {
    apiRef.current = createFilterBuilder({ defaultGroup, onChange });
  }
  const api = apiRef.current;

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  return { api, ctx: api.getContext() };
}

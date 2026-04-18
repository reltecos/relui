/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import { createLookup, type LookupAPI, type LookupContext, type LookupItem } from '@relteco/relui-core';

export interface UseLookupProps {
  /** Async arama fonksiyonu / Async search function */
  onSearch?: (query: string) => Promise<LookupItem[]>;
  /** Secim callback / On select callback */
  onSelect?: (item: LookupItem) => void;
  /** Debounce suresi (ms) / Debounce delay (ms) */
  debounce?: number;
  /** Minimum karakter / Minimum characters */
  minChars?: number;
}

export interface UseLookupReturn {
  api: LookupAPI;
  ctx: LookupContext;
  handleQueryChange: (query: string) => void;
}

export function useLookup(props: UseLookupProps): UseLookupReturn {
  const { onSearch, onSelect, debounce = 300, minChars = 1 } = props;
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<LookupAPI | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (apiRef.current === null) {
    apiRef.current = createLookup({ minChars, onSelect });
  }
  const api = apiRef.current;

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => {
    api.destroy();
    if (debounceRef.current !== null) clearTimeout(debounceRef.current);
  }, [api]);

  const handleQueryChange = useCallback((query: string) => {
    api.send({ type: 'SET_QUERY', query });

    if (debounceRef.current !== null) clearTimeout(debounceRef.current);

    if (query.length < minChars || !onSearch) return;

    api.send({ type: 'SET_LOADING', loading: true });

    debounceRef.current = setTimeout(() => {
      onSearch(query).then((items) => {
        api.send({ type: 'SET_ITEMS', items });
      }).catch(() => {
        api.send({ type: 'SET_ITEMS', items: [] });
      });
    }, debounce);
  }, [api, onSearch, debounce, minChars]);

  return { api, ctx: api.getContext(), handleQueryChange };
}

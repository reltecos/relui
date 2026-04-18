/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect } from 'react';
import { createMention, type MentionAPI, type MentionContext, type MentionItem } from '@relteco/relui-core';

export interface UseMentionProps {
  items?: MentionItem[];
  onSelect?: (item: MentionItem) => void;
}

export interface UseMentionReturn {
  api: MentionAPI;
  ctx: MentionContext;
}

export function useMention(props: UseMentionProps): UseMentionReturn {
  const { items, onSelect } = props;
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<MentionAPI | null>(null);
  const prevRef = useRef<UseMentionProps | undefined>(undefined);

  if (apiRef.current === null) {
    apiRef.current = createMention({ items, onSelect });
  }
  const api = apiRef.current;

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) { prevRef.current = props; return; }
    if (prev.items !== props.items && props.items !== undefined) {
      api.send({ type: 'SET_ITEMS', items: props.items });
      forceRender();
    }
    prevRef.current = props;
  });

  return { api, ctx: api.getContext() };
}

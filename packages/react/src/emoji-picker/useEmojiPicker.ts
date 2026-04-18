/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect } from 'react';
import { createEmojiPicker, type EmojiPickerAPI, type EmojiPickerContext, type EmojiCategory, type SkinTone } from '@relteco/relui-core';

export interface UseEmojiPickerProps {
  recentCount?: number;
  defaultCategory?: EmojiCategory;
  defaultSkinTone?: SkinTone;
  onSelect?: (emoji: string) => void;
}

export interface UseEmojiPickerReturn {
  api: EmojiPickerAPI;
  ctx: EmojiPickerContext;
}

export function useEmojiPicker(props: UseEmojiPickerProps): UseEmojiPickerReturn {
  const { recentCount, defaultCategory, defaultSkinTone, onSelect } = props;
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<EmojiPickerAPI | null>(null);

  if (apiRef.current === null) {
    apiRef.current = createEmojiPicker({ recentCount, defaultCategory, defaultSkinTone, onSelect });
  }
  const api = apiRef.current;

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  return { api, ctx: api.getContext() };
}

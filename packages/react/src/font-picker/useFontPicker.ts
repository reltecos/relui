/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect } from 'react';
import { createFontPicker, type FontPickerAPI, type FontPickerContext, type FontConfig } from '@relteco/relui-core';

export interface UseFontPickerProps {
  defaultConfig?: Partial<FontConfig>;
  fonts?: string[];
  onChange?: (config: FontConfig) => void;
}

export interface UseFontPickerReturn {
  api: FontPickerAPI;
  ctx: FontPickerContext;
}

export function useFontPicker(props: UseFontPickerProps): UseFontPickerReturn {
  const { defaultConfig, fonts, onChange } = props;
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<FontPickerAPI | null>(null);

  if (apiRef.current === null) {
    apiRef.current = createFontPicker({ defaultConfig, fonts, onChange });
  }
  const api = apiRef.current;

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  return { api, ctx: api.getContext() };
}

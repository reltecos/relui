/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect } from 'react';
import { createTimeSpan, type TimeSpanAPI, type TimeSpanContext } from '@relteco/relui-core';

export interface UseTimeSpanEditorProps {
  defaultHours?: number;
  defaultMinutes?: number;
  defaultSeconds?: number;
  min?: number;
  max?: number;
  onChange?: (totalSeconds: number) => void;
}

export interface UseTimeSpanEditorReturn {
  api: TimeSpanAPI;
  ctx: TimeSpanContext;
}

export function useTimeSpanEditor(props: UseTimeSpanEditorProps): UseTimeSpanEditorReturn {
  const { defaultHours, defaultMinutes, defaultSeconds, min, max, onChange } = props;
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<TimeSpanAPI | null>(null);

  if (apiRef.current === null) {
    apiRef.current = createTimeSpan({ defaultHours, defaultMinutes, defaultSeconds, min, max, onChange });
  }
  const api = apiRef.current;

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  return { api, ctx: api.getContext() };
}

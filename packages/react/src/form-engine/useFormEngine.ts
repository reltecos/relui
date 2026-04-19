/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import { createFormEngine, type FormEngineConfig, type FormEngineAPI, type FormFieldDef } from '@relteco/relui-core';

export type UseFormEngineProps = FormEngineConfig;
export type UseFormEngineReturn = ReturnType<FormEngineAPI['getContext']> & {
  setValue: (field: string, value: unknown) => void; setTouched: (field: string) => void;
  validate: () => void; submit: () => void; reset: () => void; setSchema: (fields: FormFieldDef[]) => void;
  api: FormEngineAPI;
};

export function useFormEngine(props: UseFormEngineProps = {}): UseFormEngineReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<FormEngineAPI | null>(null);
  if (apiRef.current === null) apiRef.current = createFormEngine(props);
  const api = apiRef.current;
  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);
  const ctx = api.getContext();
  return {
    ...ctx, api,
    setValue: useCallback((f: string, v: unknown) => api.send({ type: 'SET_VALUE', field: f, value: v }), [api]),
    setTouched: useCallback((f: string) => api.send({ type: 'SET_TOUCHED', field: f }), [api]),
    validate: useCallback(() => api.send({ type: 'VALIDATE' }), [api]),
    submit: useCallback(() => api.send({ type: 'SUBMIT' }), [api]),
    reset: useCallback(() => api.send({ type: 'RESET' }), [api]),
    setSchema: useCallback((fields: FormFieldDef[]) => api.send({ type: 'SET_SCHEMA', fields }), [api]),
  };
}

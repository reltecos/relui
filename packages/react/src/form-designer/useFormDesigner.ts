/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import { createFormDesigner, type FormDesignerConfig, type FormDesignerAPI, type DesignerField } from '@relteco/relui-core';
import type { FormFieldType } from '@relteco/relui-core';

export type UseFormDesignerProps = FormDesignerConfig;
export type UseFormDesignerReturn = ReturnType<FormDesignerAPI['getContext']> & {
  addField: (type: FormFieldType, label?: string) => void; removeField: (id: string) => void;
  updateField: (id: string, updates: Partial<Omit<DesignerField, 'id' | 'order'>>) => void;
  reorder: (id: string, newOrder: number) => void; selectField: (id: string | null) => void;
  api: FormDesignerAPI;
};

export function useFormDesigner(props: UseFormDesignerProps = {}): UseFormDesignerReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<FormDesignerAPI | null>(null);
  if (apiRef.current === null) apiRef.current = createFormDesigner(props);
  const api = apiRef.current;
  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);
  const ctx = api.getContext();
  return {
    ...ctx, api,
    addField: useCallback((type: FormFieldType, label?: string) => api.send({ type: 'ADD_FIELD', fieldType: type, label }), [api]),
    removeField: useCallback((id: string) => api.send({ type: 'REMOVE_FIELD', id }), [api]),
    updateField: useCallback((id: string, updates: Partial<Omit<DesignerField, 'id' | 'order'>>) => api.send({ type: 'UPDATE_FIELD', id, updates }), [api]),
    reorder: useCallback((id: string, newOrder: number) => api.send({ type: 'REORDER', id, newOrder }), [api]),
    selectField: useCallback((id: string | null) => api.send({ type: 'SELECT_FIELD', id }), [api]),
  };
}

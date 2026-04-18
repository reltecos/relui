/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import { createSignaturePad } from '@relteco/relui-core';
import type { SignaturePadConfig, SignaturePadContext, SignaturePadEvent, SignaturePadAPI } from '@relteco/relui-core';

export type UseSignaturePadProps = SignaturePadConfig;

export interface UseSignaturePadReturn {
  context: SignaturePadContext;
  send: (event: SignaturePadEvent) => void;
  api: SignaturePadAPI;
}

export function useSignaturePad(props: UseSignaturePadProps): UseSignaturePadReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<SignaturePadAPI | null>(null);
  const prevRef = useRef<UseSignaturePadProps | undefined>(undefined);

  if (apiRef.current === null) { apiRef.current = createSignaturePad(props); }
  const api = apiRef.current;

  useEffect(() => { const prev = prevRef.current; if (prev === undefined) { prevRef.current = props; return; } prevRef.current = props; });
  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  const send = useCallback((event: SignaturePadEvent) => { api.send(event); }, [api]);
  return { context: api.getContext(), send, api };
}

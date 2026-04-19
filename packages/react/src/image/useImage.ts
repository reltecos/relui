/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import { createImage } from '@relteco/relui-core';
import type { ImageConfig, ImageContext, ImageEvent, ImageAPI } from '@relteco/relui-core';

export type UseImageProps = ImageConfig;
export interface UseImageReturn { context: ImageContext; send: (e: ImageEvent) => void; api: ImageAPI }

export function useImage(props: UseImageProps): UseImageReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<ImageAPI | null>(null);
  if (apiRef.current === null) { apiRef.current = createImage(props); }
  const api = apiRef.current;
  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);
  const send = useCallback((e: ImageEvent) => { api.send(e); }, [api]);
  return { context: api.getContext(), send, api };
}

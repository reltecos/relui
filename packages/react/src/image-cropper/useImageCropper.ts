/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import { createImageCropper } from '@relteco/relui-core';
import type { ImageCropperConfig, ImageCropperContext, ImageCropperEvent, ImageCropperAPI } from '@relteco/relui-core';

export type UseImageCropperProps = ImageCropperConfig;
export interface UseImageCropperReturn { context: ImageCropperContext; send: (e: ImageCropperEvent) => void; api: ImageCropperAPI }

export function useImageCropper(props: UseImageCropperProps): UseImageCropperReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<ImageCropperAPI | null>(null);
  const prevRef = useRef<UseImageCropperProps | undefined>(undefined);
  if (apiRef.current === null) { apiRef.current = createImageCropper(props); }
  const api = apiRef.current;
  useEffect(() => { const p = prevRef.current; if (p === undefined) { prevRef.current = props; return; } prevRef.current = props; });
  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);
  const send = useCallback((e: ImageCropperEvent) => { api.send(e); }, [api]);
  return { context: api.getContext(), send, api };
}

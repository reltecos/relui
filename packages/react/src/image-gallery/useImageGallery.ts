/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import { createImageGallery } from '@relteco/relui-core';
import type { ImageGalleryConfig, ImageGalleryContext, ImageGalleryEvent, ImageGalleryAPI } from '@relteco/relui-core';

export type UseImageGalleryProps = ImageGalleryConfig;
export interface UseImageGalleryReturn { context: ImageGalleryContext; send: (e: ImageGalleryEvent) => void; api: ImageGalleryAPI }

export function useImageGallery(props: UseImageGalleryProps): UseImageGalleryReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<ImageGalleryAPI | null>(null);
  if (apiRef.current === null) { apiRef.current = createImageGallery(props); }
  const api = apiRef.current;
  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);
  const send = useCallback((e: ImageGalleryEvent) => { api.send(e); }, [api]);
  return { context: api.getContext(), send, api };
}

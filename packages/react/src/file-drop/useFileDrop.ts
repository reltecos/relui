/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useFileDrop — FileDrop React hook.
 *
 * @packageDocumentation
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import {
  createFileDrop,
  type FileDropConfig,
  type FileDropAPI,
  type FileDropItem,
  type FileDropStatus,
} from '@relteco/relui-core';

// ── Hook Props ──────────────────────────────────────

export type UseFileDropProps = FileDropConfig;

// ── Hook Return ─────────────────────────────────────

export interface UseFileDropReturn {
  /** Dosya listesi / File list */
  files: readonly FileDropItem[];
  /** Surukleme durumu / Dragging state */
  isDragging: boolean;
  /** Toplam dosya boyutu / Total file size */
  totalSize: number;
  /** Dosya sayisi / File count */
  fileCount: number;
  /** Dosya ekle / Add files */
  addFiles: (files: Array<{ id: string; name: string; size: number; type: string }>) => void;
  /** Dosya kaldir / Remove file */
  removeFile: (id: string) => void;
  /** Ilerleme guncelle / Set progress */
  setProgress: (id: string, progress: number) => void;
  /** Durum guncelle / Set status */
  setStatus: (id: string, status: FileDropStatus, error?: string) => void;
  /** Surukleme durumunu degistir / Set dragging */
  setDragging: (isDragging: boolean) => void;
  /** Tum dosyalari temizle / Clear all files */
  clear: () => void;
  /** Core API / Core API */
  api: FileDropAPI;
}

let idCounter = 0;

/**
 * Native FileList'i state machine formatina cevirir.
 * Converts native FileList to state machine format.
 */
export function processNativeFiles(
  fileList: FileList,
): Array<{ id: string; name: string; size: number; type: string }> {
  const result: Array<{ id: string; name: string; size: number; type: string }> = [];
  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];
    if (!file) continue;
    result.push({
      id: `file-${++idCounter}`,
      name: file.name,
      size: file.size,
      type: file.type,
    });
  }
  return result;
}

/**
 * useFileDrop — FileDrop yonetim hook.
 * useFileDrop — FileDrop management hook.
 */
export function useFileDrop(props: UseFileDropProps = {}): UseFileDropReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  const apiRef = useRef<FileDropAPI | null>(null);
  const prevRef = useRef<UseFileDropProps | undefined>(undefined);

  if (apiRef.current === null) {
    apiRef.current = createFileDrop(props);
  }
  const api = apiRef.current;

  // Prop sync
  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) {
      prevRef.current = props;
      return;
    }
    prevRef.current = props;
  });

  // Subscribe
  useEffect(() => {
    return api.subscribe(() => forceRender());
  }, [api]);

  // Destroy
  useEffect(() => {
    return () => api.destroy();
  }, [api]);

  const ctx = api.getContext();

  const addFiles = useCallback(
    (files: Array<{ id: string; name: string; size: number; type: string }>) => {
      api.send({ type: 'ADD_FILES', files });
    },
    [api],
  );

  const removeFile = useCallback(
    (id: string) => {
      api.send({ type: 'REMOVE_FILE', id });
    },
    [api],
  );

  const setProgress = useCallback(
    (id: string, progress: number) => {
      api.send({ type: 'SET_PROGRESS', id, progress });
    },
    [api],
  );

  const setStatus = useCallback(
    (id: string, status: FileDropStatus, error?: string) => {
      api.send({ type: 'SET_STATUS', id, status, error });
    },
    [api],
  );

  const setDragging = useCallback(
    (isDragging: boolean) => {
      api.send({ type: 'SET_DRAGGING', isDragging });
    },
    [api],
  );

  const clear = useCallback(() => {
    api.send({ type: 'CLEAR' });
  }, [api]);

  return {
    files: ctx.files,
    isDragging: ctx.isDragging,
    totalSize: ctx.totalSize,
    fileCount: ctx.fileCount,
    addFiles,
    removeFile,
    setProgress,
    setStatus,
    setDragging,
    clear,
    api,
  };
}

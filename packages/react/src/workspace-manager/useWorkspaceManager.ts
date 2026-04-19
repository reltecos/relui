/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import {
  createWorkspaceManager,
  type WorkspaceManagerConfig,
  type WorkspaceManagerAPI,
} from '@relteco/relui-core';

export type UseWorkspaceManagerProps = WorkspaceManagerConfig;

export interface UseWorkspaceManagerReturn {
  presets: ReturnType<WorkspaceManagerAPI['getContext']>['presets'];
  activePresetId: string | null;
  selectedPresetId: string | null;
  currentLayout: string;
  addPreset: (name: string, layout: string) => void;
  deletePreset: (id: string) => void;
  renamePreset: (id: string, name: string) => void;
  setDefault: (id: string) => void;
  loadPreset: (id: string) => void;
  saveCurrent: (layout: string) => void;
  importPresets: (data: string) => void;
  selectPreset: (id: string | null) => void;
  exportAll: () => string;
  api: WorkspaceManagerAPI;
}

export function useWorkspaceManager(props: UseWorkspaceManagerProps = {}): UseWorkspaceManagerReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<WorkspaceManagerAPI | null>(null);

  if (apiRef.current === null) {
    apiRef.current = createWorkspaceManager(props);
  }
  const api = apiRef.current;

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  const ctx = api.getContext();

  return {
    presets: ctx.presets,
    activePresetId: ctx.activePresetId,
    selectedPresetId: ctx.selectedPresetId,
    currentLayout: ctx.currentLayout,
    addPreset: useCallback((n: string, l: string) => api.send({ type: 'ADD_PRESET', name: n, layout: l }), [api]),
    deletePreset: useCallback((id: string) => api.send({ type: 'DELETE_PRESET', presetId: id }), [api]),
    renamePreset: useCallback((id: string, n: string) => api.send({ type: 'RENAME_PRESET', presetId: id, name: n }), [api]),
    setDefault: useCallback((id: string) => api.send({ type: 'SET_DEFAULT', presetId: id }), [api]),
    loadPreset: useCallback((id: string) => api.send({ type: 'LOAD_PRESET', presetId: id }), [api]),
    saveCurrent: useCallback((l: string) => api.send({ type: 'SAVE_CURRENT', layout: l }), [api]),
    importPresets: useCallback((d: string) => api.send({ type: 'IMPORT', data: d }), [api]),
    selectPreset: useCallback((id: string | null) => api.send({ type: 'SELECT_PRESET', presetId: id }), [api]),
    exportAll: useCallback(() => api.exportAll(), [api]),
    api,
  };
}

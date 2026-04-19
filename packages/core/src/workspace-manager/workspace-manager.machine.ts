/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * WorkspaceManager state machine.
 *
 * @packageDocumentation
 */

import type {
  WorkspacePreset,
  WorkspaceManagerConfig,
  WorkspaceManagerContext,
  WorkspaceManagerEvent,
  WorkspaceManagerAPI,
} from './workspace-manager.types';

let idCounter = 0;
function nextId(): string { return `ws-${++idCounter}`; }

/** ID counter sifirla (test icin) / Reset ID counter */
export function resetWorkspaceIdCounter(): void { idCounter = 0; }

export function createWorkspaceManager(config: WorkspaceManagerConfig = {}): WorkspaceManagerAPI {
  const { defaultPresets = [], defaultLayout = '{}', onChange, onLoadPreset } = config;

  let presets: WorkspacePreset[] = [...defaultPresets];
  let activePresetId: string | null = defaultPresets.find((p) => p.isDefault)?.id ?? null;
  let selectedPresetId: string | null = null;
  let currentLayout = defaultLayout;

  const listeners = new Set<() => void>();
  function notify(): void { listeners.forEach((fn) => fn()); }

  function send(event: WorkspaceManagerEvent): void {
    switch (event.type) {
      case 'ADD_PRESET': {
        const preset: WorkspacePreset = {
          id: nextId(),
          name: event.name,
          layout: event.layout,
          createdAt: Date.now(),
          isDefault: presets.length === 0,
        };
        presets = [...presets, preset];
        onChange?.(presets, activePresetId);
        notify();
        break;
      }
      case 'DELETE_PRESET': {
        const idx = presets.findIndex((p) => p.id === event.presetId);
        if (idx === -1) return;
        presets = presets.filter((p) => p.id !== event.presetId);
        if (activePresetId === event.presetId) activePresetId = null;
        if (selectedPresetId === event.presetId) selectedPresetId = null;
        onChange?.(presets, activePresetId);
        notify();
        break;
      }
      case 'RENAME_PRESET': {
        const idx = presets.findIndex((p) => p.id === event.presetId);
        if (idx === -1) return;
        presets = presets.map((p) => p.id === event.presetId ? { ...p, name: event.name } : p);
        onChange?.(presets, activePresetId);
        notify();
        break;
      }
      case 'SET_DEFAULT': {
        presets = presets.map((p) => ({ ...p, isDefault: p.id === event.presetId }));
        onChange?.(presets, activePresetId);
        notify();
        break;
      }
      case 'LOAD_PRESET': {
        const preset = presets.find((p) => p.id === event.presetId);
        if (!preset) return;
        activePresetId = preset.id;
        currentLayout = preset.layout;
        onLoadPreset?.(preset.layout);
        onChange?.(presets, activePresetId);
        notify();
        break;
      }
      case 'SAVE_CURRENT': {
        currentLayout = event.layout;
        if (activePresetId) {
          presets = presets.map((p) =>
            p.id === activePresetId ? { ...p, layout: event.layout } : p,
          );
          onChange?.(presets, activePresetId);
        }
        notify();
        break;
      }
      case 'IMPORT': {
        try {
          const imported = JSON.parse(event.data) as WorkspacePreset[];
          if (!Array.isArray(imported)) return;
          for (const item of imported) {
            if (typeof item.name === 'string' && typeof item.layout === 'string') {
              presets = [...presets, { ...item, id: nextId(), createdAt: Date.now(), isDefault: false }];
            }
          }
          onChange?.(presets, activePresetId);
          notify();
        } catch {
          // gecersiz JSON — sessizce atla
        }
        break;
      }
      case 'SELECT_PRESET': {
        if (selectedPresetId === event.presetId) return;
        selectedPresetId = event.presetId;
        notify();
        break;
      }
    }
  }

  return {
    getContext(): WorkspaceManagerContext {
      return { presets, activePresetId, selectedPresetId, currentLayout };
    },
    send,
    subscribe(cb: () => void): () => void {
      listeners.add(cb);
      return () => { listeners.delete(cb); };
    },
    destroy(): void { listeners.clear(); },
    exportAll(): string { return JSON.stringify(presets, null, 2); },
  };
}

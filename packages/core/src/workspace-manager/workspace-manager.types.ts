/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * WorkspaceManager tipleri.
 * WorkspaceManager types.
 *
 * @packageDocumentation
 */

/** Workspace preset / Workspace preset */
export interface WorkspacePreset {
  readonly id: string;
  readonly name: string;
  /** DockLayout JSON layout verisi / DockLayout JSON layout data */
  readonly layout: string;
  readonly createdAt: number;
  readonly isDefault: boolean;
}

/** WorkspaceManager event'leri / WorkspaceManager events */
export type WorkspaceManagerEvent =
  | { type: 'ADD_PRESET'; name: string; layout: string }
  | { type: 'DELETE_PRESET'; presetId: string }
  | { type: 'RENAME_PRESET'; presetId: string; name: string }
  | { type: 'SET_DEFAULT'; presetId: string }
  | { type: 'LOAD_PRESET'; presetId: string }
  | { type: 'SAVE_CURRENT'; layout: string }
  | { type: 'IMPORT'; data: string }
  | { type: 'SELECT_PRESET'; presetId: string | null };

/** WorkspaceManager state / WorkspaceManager context */
export interface WorkspaceManagerContext {
  readonly presets: readonly WorkspacePreset[];
  readonly activePresetId: string | null;
  readonly selectedPresetId: string | null;
  readonly currentLayout: string;
}

/** WorkspaceManager yapilandirmasi / WorkspaceManager configuration */
export interface WorkspaceManagerConfig {
  defaultPresets?: WorkspacePreset[];
  defaultLayout?: string;
  onChange?: (presets: readonly WorkspacePreset[], activePresetId: string | null) => void;
  onLoadPreset?: (layout: string) => void;
}

/** WorkspaceManager API / WorkspaceManager API */
export interface WorkspaceManagerAPI {
  getContext(): WorkspaceManagerContext;
  send(event: WorkspaceManagerEvent): void;
  subscribe(callback: () => void): () => void;
  destroy(): void;
  exportAll(): string;
}

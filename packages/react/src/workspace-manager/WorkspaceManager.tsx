/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * WorkspaceManager — DockLayout preset yonetimi bilesen (Dual API).
 * WorkspaceManager — DockLayout preset management component (Dual API).
 *
 * Props-based: `<WorkspaceManager presets={[...]} onLoadPreset={fn} />`
 * Compound:
 * ```tsx
 * <WorkspaceManager>
 *   <WorkspaceManager.Toolbar />
 *   <WorkspaceManager.PresetList />
 *   <WorkspaceManager.Actions />
 * </WorkspaceManager>
 * ```
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { WorkspacePreset, WorkspaceManagerConfig } from '@relteco/relui-core';
import {
  rootStyle,
  toolbarStyle,
  toolbarButtonStyle,
  presetListStyle,
  presetItemStyle,
  presetNameStyle,
  presetBadgeStyle,
  actionsStyle,
} from './workspace-manager.css';
import { useWorkspaceManager, type UseWorkspaceManagerProps } from './useWorkspaceManager';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

export type WorkspaceManagerSlot = 'root' | 'toolbar' | 'presetList' | 'presetItem' | 'actions';

// ── Context ─────────────────────────────────────────

interface WorkspaceManagerContextValue {
  presets: readonly WorkspacePreset[];
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
  classNames: ClassNames<WorkspaceManagerSlot> | undefined;
  styles: Styles<WorkspaceManagerSlot> | undefined;
}

const WorkspaceManagerContext = createContext<WorkspaceManagerContextValue | null>(null);

function useWorkspaceManagerContext(): WorkspaceManagerContextValue {
  const ctx = useContext(WorkspaceManagerContext);
  if (!ctx) throw new Error('WorkspaceManager compound sub-components must be used within <WorkspaceManager>.');
  return ctx;
}

// ── Compound: Toolbar ───────────────────────────────

export interface WorkspaceManagerToolbarProps { className?: string; }

const WorkspaceManagerToolbar = forwardRef<HTMLDivElement, WorkspaceManagerToolbarProps>(
  function WorkspaceManagerToolbar(props, ref) {
    const { className } = props;
    const ctx = useWorkspaceManagerContext();
    const slot = getSlotProps('toolbar', toolbarStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="workspace-manager-toolbar" role="toolbar">
        <button type="button" className={toolbarButtonStyle} onClick={() => ctx.addPreset('New Preset', ctx.currentLayout)} aria-label="Add preset" data-testid="workspace-manager-btn-add">Add</button>
        <button type="button" className={toolbarButtonStyle} onClick={() => ctx.saveCurrent(ctx.currentLayout)} aria-label="Save current" data-testid="workspace-manager-btn-save">Save</button>
      </div>
    );
  },
);

// ── Compound: PresetList ────────────────────────────

export interface WorkspaceManagerPresetListProps { className?: string; }

const WorkspaceManagerPresetList = forwardRef<HTMLDivElement, WorkspaceManagerPresetListProps>(
  function WorkspaceManagerPresetList(props, ref) {
    const { className } = props;
    const ctx = useWorkspaceManagerContext();
    const slot = getSlotProps('presetList', presetListStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="workspace-manager-preset-list" role="listbox" aria-label="Workspace presets">
        {ctx.presets.map((preset) => {
          const itemSlot = getSlotProps('presetItem', presetItemStyle, ctx.classNames, ctx.styles);
          return (
            <div
              key={preset.id}
              className={itemSlot.className}
              style={itemSlot.style}
              data-active={ctx.activePresetId === preset.id}
              data-selected={ctx.selectedPresetId === preset.id}
              data-testid="workspace-manager-preset-item"
              role="option"
              aria-selected={ctx.selectedPresetId === preset.id}
              onClick={() => ctx.selectPreset(preset.id)}
              onDoubleClick={() => ctx.loadPreset(preset.id)}
            >
              <span className={presetNameStyle} data-testid="workspace-manager-preset-name">{preset.name}</span>
              {preset.isDefault && <span className={presetBadgeStyle} data-testid="workspace-manager-preset-badge">Default</span>}
            </div>
          );
        })}
      </div>
    );
  },
);

// ── Compound: Actions ───────────────────────────────

export interface WorkspaceManagerActionsProps { className?: string; }

const WorkspaceManagerActions = forwardRef<HTMLDivElement, WorkspaceManagerActionsProps>(
  function WorkspaceManagerActions(props, ref) {
    const { className } = props;
    const ctx = useWorkspaceManagerContext();
    const slot = getSlotProps('actions', actionsStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="workspace-manager-actions">
        <button
          type="button"
          className={toolbarButtonStyle}
          onClick={() => { if (ctx.selectedPresetId) ctx.loadPreset(ctx.selectedPresetId); }}
          disabled={!ctx.selectedPresetId}
          aria-label="Load selected"
          data-testid="workspace-manager-btn-load"
        >
          Load
        </button>
        <button
          type="button"
          className={toolbarButtonStyle}
          onClick={() => { if (ctx.selectedPresetId) ctx.deletePreset(ctx.selectedPresetId); }}
          disabled={!ctx.selectedPresetId}
          aria-label="Delete selected"
          data-testid="workspace-manager-btn-delete"
        >
          Delete
        </button>
        <button
          type="button"
          className={toolbarButtonStyle}
          onClick={() => { if (ctx.selectedPresetId) ctx.setDefault(ctx.selectedPresetId); }}
          disabled={!ctx.selectedPresetId}
          aria-label="Set default"
          data-testid="workspace-manager-btn-default"
        >
          Set Default
        </button>
      </div>
    );
  },
);

// ── Component Props ───────────────────────────────────

export interface WorkspaceManagerComponentProps extends SlotStyleProps<WorkspaceManagerSlot> {
  /** Varsayilan presetler / Default presets */
  defaultPresets?: WorkspacePreset[];
  /** Varsayilan layout / Default layout */
  defaultLayout?: string;
  /** Degisince callback / On change */
  onChange?: WorkspaceManagerConfig['onChange'];
  /** Preset yuklenince callback / On load preset */
  onLoadPreset?: WorkspaceManagerConfig['onLoadPreset'];
  /** Compound children / Compound children */
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────

const WorkspaceManagerBase = forwardRef<HTMLDivElement, WorkspaceManagerComponentProps>(
  function WorkspaceManager(props, ref) {
    const {
      defaultPresets,
      defaultLayout,
      onChange,
      onLoadPreset,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const hookProps: UseWorkspaceManagerProps = { defaultPresets, defaultLayout, onChange, onLoadPreset };
    const wm = useWorkspaceManager(hookProps);

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootClassName = className ? `${rootSlot.className} ${className}` : rootSlot.className;

    const ctxValue: WorkspaceManagerContextValue = {
      presets: wm.presets,
      activePresetId: wm.activePresetId,
      selectedPresetId: wm.selectedPresetId,
      currentLayout: wm.currentLayout,
      addPreset: wm.addPreset,
      deletePreset: wm.deletePreset,
      renamePreset: wm.renamePreset,
      setDefault: wm.setDefault,
      loadPreset: wm.loadPreset,
      saveCurrent: wm.saveCurrent,
      importPresets: wm.importPresets,
      selectPreset: wm.selectPreset,
      exportAll: wm.exportAll,
      classNames,
      styles,
    };

    // ── Compound API ──
    if (children) {
      return (
        <WorkspaceManagerContext.Provider value={ctxValue}>
          <div ref={ref} className={rootClassName} style={{ ...rootSlot.style, ...styleProp }} data-testid="workspace-manager-root" role="application" aria-label="Workspace manager">
            {children}
          </div>
        </WorkspaceManagerContext.Provider>
      );
    }

    // ── Props-based API ──
    return (
      <WorkspaceManagerContext.Provider value={ctxValue}>
        <div ref={ref} className={rootClassName} style={{ ...rootSlot.style, ...styleProp }} data-testid="workspace-manager-root" role="application" aria-label="Workspace manager">
          <WorkspaceManagerToolbar />
          <WorkspaceManagerPresetList />
          <WorkspaceManagerActions />
        </div>
      </WorkspaceManagerContext.Provider>
    );
  },
);

export const WorkspaceManager = Object.assign(WorkspaceManagerBase, {
  Toolbar: WorkspaceManagerToolbar,
  PresetList: WorkspaceManagerPresetList,
  Actions: WorkspaceManagerActions,
});

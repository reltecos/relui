/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createWorkspaceManager, resetWorkspaceIdCounter } from './workspace-manager.machine';
import type { WorkspacePreset } from './workspace-manager.types';

beforeEach(() => { resetWorkspaceIdCounter(); });

const preset1: WorkspacePreset = { id: 'p1', name: 'Default', layout: '{"root":"split"}', createdAt: 1000, isDefault: true };
const preset2: WorkspacePreset = { id: 'p2', name: 'Compact', layout: '{"root":"tabs"}', createdAt: 2000, isDefault: false };

describe('createWorkspaceManager', () => {
  it('bos olusturulur', () => {
    const wm = createWorkspaceManager();
    expect(wm.getContext().presets).toHaveLength(0);
    expect(wm.getContext().activePresetId).toBeNull();
  });

  it('defaultPresets ile olusturulur', () => {
    const wm = createWorkspaceManager({ defaultPresets: [preset1, preset2] });
    expect(wm.getContext().presets).toHaveLength(2);
    expect(wm.getContext().activePresetId).toBe('p1');
  });

  it('ADD_PRESET ile preset eklenir', () => {
    const wm = createWorkspaceManager();
    wm.send({ type: 'ADD_PRESET', name: 'New', layout: '{}' });
    expect(wm.getContext().presets).toHaveLength(1);
    expect(wm.getContext().presets[0]?.name).toBe('New');
  });

  it('ilk eklenen preset isDefault olur', () => {
    const wm = createWorkspaceManager();
    wm.send({ type: 'ADD_PRESET', name: 'First', layout: '{}' });
    expect(wm.getContext().presets[0]?.isDefault).toBe(true);
  });

  it('DELETE_PRESET ile preset silinir', () => {
    const wm = createWorkspaceManager({ defaultPresets: [preset1, preset2] });
    wm.send({ type: 'DELETE_PRESET', presetId: 'p2' });
    expect(wm.getContext().presets).toHaveLength(1);
  });

  it('DELETE_PRESET aktif preset i temizler', () => {
    const wm = createWorkspaceManager({ defaultPresets: [preset1] });
    wm.send({ type: 'DELETE_PRESET', presetId: 'p1' });
    expect(wm.getContext().activePresetId).toBeNull();
  });

  it('DELETE_PRESET olmayan id icin notify etmez', () => {
    const wm = createWorkspaceManager();
    const listener = vi.fn();
    wm.subscribe(listener);
    wm.send({ type: 'DELETE_PRESET', presetId: 'nope' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('RENAME_PRESET ile isim guncellenir', () => {
    const wm = createWorkspaceManager({ defaultPresets: [preset1] });
    wm.send({ type: 'RENAME_PRESET', presetId: 'p1', name: 'Renamed' });
    expect(wm.getContext().presets[0]?.name).toBe('Renamed');
  });

  it('SET_DEFAULT ile varsayilan degisir', () => {
    const wm = createWorkspaceManager({ defaultPresets: [preset1, preset2] });
    wm.send({ type: 'SET_DEFAULT', presetId: 'p2' });
    expect(wm.getContext().presets.find((p) => p.id === 'p2')?.isDefault).toBe(true);
    expect(wm.getContext().presets.find((p) => p.id === 'p1')?.isDefault).toBe(false);
  });

  it('LOAD_PRESET ile layout yuklenir', () => {
    const onLoadPreset = vi.fn();
    const wm = createWorkspaceManager({ defaultPresets: [preset1, preset2], onLoadPreset });
    wm.send({ type: 'LOAD_PRESET', presetId: 'p2' });
    expect(wm.getContext().activePresetId).toBe('p2');
    expect(wm.getContext().currentLayout).toBe('{"root":"tabs"}');
    expect(onLoadPreset).toHaveBeenCalledWith('{"root":"tabs"}');
  });

  it('LOAD_PRESET olmayan id icin notify etmez', () => {
    const wm = createWorkspaceManager();
    const listener = vi.fn();
    wm.subscribe(listener);
    wm.send({ type: 'LOAD_PRESET', presetId: 'nope' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('SAVE_CURRENT ile aktif preset guncellenir', () => {
    const wm = createWorkspaceManager({ defaultPresets: [preset1] });
    wm.send({ type: 'LOAD_PRESET', presetId: 'p1' });
    wm.send({ type: 'SAVE_CURRENT', layout: '{"updated":true}' });
    expect(wm.getContext().presets[0]?.layout).toBe('{"updated":true}');
    expect(wm.getContext().currentLayout).toBe('{"updated":true}');
  });

  it('IMPORT ile presetler eklenir', () => {
    const wm = createWorkspaceManager();
    const data = JSON.stringify([{ name: 'Imported', layout: '{"x":1}' }]);
    wm.send({ type: 'IMPORT', data });
    expect(wm.getContext().presets).toHaveLength(1);
    expect(wm.getContext().presets[0]?.name).toBe('Imported');
  });

  it('IMPORT gecersiz JSON icin hata vermez', () => {
    const wm = createWorkspaceManager();
    wm.send({ type: 'IMPORT', data: '{bad json' });
    expect(wm.getContext().presets).toHaveLength(0);
  });

  it('SELECT_PRESET ile preset secilir', () => {
    const wm = createWorkspaceManager({ defaultPresets: [preset1] });
    wm.send({ type: 'SELECT_PRESET', presetId: 'p1' });
    expect(wm.getContext().selectedPresetId).toBe('p1');
  });

  it('exportAll JSON uretir', () => {
    const wm = createWorkspaceManager({ defaultPresets: [preset1] });
    const json = wm.exportAll();
    const parsed = JSON.parse(json) as WorkspacePreset[];
    expect(parsed).toHaveLength(1);
    expect(parsed[0]?.name).toBe('Default');
  });

  it('onChange callback cagirilir', () => {
    const onChange = vi.fn();
    const wm = createWorkspaceManager({ onChange });
    wm.send({ type: 'ADD_PRESET', name: 'X', layout: '{}' });
    expect(onChange).toHaveBeenCalled();
  });

  it('subscribe calisiyor', () => {
    const wm = createWorkspaceManager();
    const listener = vi.fn();
    wm.subscribe(listener);
    wm.send({ type: 'ADD_PRESET', name: 'X', layout: '{}' });
    expect(listener).toHaveBeenCalled();
  });

  it('unsubscribe calisiyor', () => {
    const wm = createWorkspaceManager();
    const listener = vi.fn();
    const unsub = wm.subscribe(listener);
    unsub();
    wm.send({ type: 'ADD_PRESET', name: 'X', layout: '{}' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('destroy calisiyor', () => {
    const wm = createWorkspaceManager();
    const listener = vi.fn();
    wm.subscribe(listener);
    wm.destroy();
    wm.send({ type: 'ADD_PRESET', name: 'X', layout: '{}' });
    expect(listener).not.toHaveBeenCalled();
  });
});

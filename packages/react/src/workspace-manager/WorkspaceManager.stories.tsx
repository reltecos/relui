/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { WorkspaceManager } from './WorkspaceManager';
import type { WorkspacePreset } from '@relteco/relui-core';

const meta: Meta<typeof WorkspaceManager> = {
  title: 'Layout/WorkspaceManager',
  component: WorkspaceManager,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof WorkspaceManager>;

const PRESETS: WorkspacePreset[] = [
  { id: 'p1', name: 'Default Layout', layout: '{"type":"split","direction":"horizontal"}', createdAt: 1000, isDefault: true },
  { id: 'p2', name: 'Compact', layout: '{"type":"tabs"}', createdAt: 2000, isDefault: false },
  { id: 'p3', name: 'Wide', layout: '{"type":"split","direction":"vertical"}', createdAt: 3000, isDefault: false },
];

export const Default: Story = {
  args: { defaultPresets: PRESETS },
  decorators: [(Story) => <div style={{ width: 350 }}><Story /></div>],
};

export const Empty: Story = {
  args: {},
  decorators: [(Story) => <div style={{ width: 350 }}><Story /></div>],
};

export const SinglePreset: Story = {
  args: { defaultPresets: [PRESETS[0] as WorkspacePreset] },
  decorators: [(Story) => <div style={{ width: 350 }}><Story /></div>],
};

export const ManyPresets: Story = {
  args: {
    defaultPresets: Array.from({ length: 8 }, (_, i) => ({
      id: `p${i}`,
      name: `Workspace ${i + 1}`,
      layout: '{}',
      createdAt: Date.now() - i * 86400000,
      isDefault: i === 0,
    })),
  },
  decorators: [(Story) => <div style={{ width: 350, maxHeight: 400, overflow: 'auto' }}><Story /></div>],
};

export const Compound: Story = {
  render: () => (
    <div style={{ width: 350 }}>
      <WorkspaceManager defaultPresets={PRESETS}>
        <WorkspaceManager.Toolbar />
        <WorkspaceManager.PresetList />
        <WorkspaceManager.Actions />
      </WorkspaceManager>
    </div>
  ),
};

export const CompoundToolbarOnly: Story = {
  render: () => (
    <div style={{ width: 350 }}>
      <WorkspaceManager defaultPresets={PRESETS}>
        <WorkspaceManager.Toolbar />
        <WorkspaceManager.PresetList />
      </WorkspaceManager>
    </div>
  ),
};

export const CustomSlotStyles: Story = {
  args: {
    defaultPresets: PRESETS,
    styles: {
      root: { padding: 4 },
      toolbar: { padding: '8px 16px' },
      presetList: { padding: 12 },
    },
  },
  decorators: [(Story) => <div style={{ width: 350 }}><Story /></div>],
};

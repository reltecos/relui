/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { SplitPanel } from './SplitPanel';

const meta: Meta<typeof SplitPanel> = {
  title: 'Window Manager/SplitPanel',
  component: SplitPanel,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    gutterSize: { control: { type: 'range', min: 2, max: 20, step: 2 } },
  },
};

export default meta;
type Story = StoryObj<typeof SplitPanel>;

const panelStyle = (bg: string) => ({
  padding: 24,
  height: '100%',
  background: bg,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 14,
  fontWeight: 500,
  color: 'var(--rel-color-text, #475569)',
});

export const Default: Story = {
  render: (args) => (
    <div style={{ height: 400, border: '1px solid var(--rel-color-border, #e2e8f0)', borderRadius: 12, overflow: 'hidden' }}>
      <SplitPanel {...args}>
        <div style={panelStyle('var(--rel-color-bg-subtle, #f8fafc)')}>Sol Panel</div>
        <div style={panelStyle('var(--rel-color-bg, #fff)')}>Sağ Panel</div>
      </SplitPanel>
    </div>
  ),
  args: {
    orientation: 'horizontal',
    gutterSize: 8,
  },
};

export const Vertical: Story = {
  render: () => (
    <div style={{ height: 500, border: '1px solid var(--rel-color-border, #e2e8f0)', borderRadius: 12, overflow: 'hidden' }}>
      <SplitPanel orientation="vertical">
        <div style={panelStyle('var(--rel-color-bg-subtle, #f8fafc)')}>Üst Panel</div>
        <div style={panelStyle('var(--rel-color-bg, #fff)')}>Alt Panel</div>
      </SplitPanel>
    </div>
  ),
};

export const ThreePanels: Story = {
  render: () => (
    <div style={{ height: 400, border: '1px solid var(--rel-color-border, #e2e8f0)', borderRadius: 12, overflow: 'hidden' }}>
      <SplitPanel>
        <div style={panelStyle('var(--rel-color-bg-subtle, #eff6ff)')}>Sol</div>
        <div style={panelStyle('var(--rel-color-bg, #fff)')}>Orta</div>
        <div style={panelStyle('var(--rel-color-bg-subtle, #f0fdf4)')}>Sağ</div>
      </SplitPanel>
    </div>
  ),
};

export const WithMinSizes: Story = {
  render: () => (
    <div style={{ height: 400, border: '1px solid var(--rel-color-border, #e2e8f0)', borderRadius: 12, overflow: 'hidden' }}>
      <SplitPanel minSizes={[200, 200]}>
        <div style={panelStyle('var(--rel-color-bg-subtle, #fef2f2)')}>
          <div style={{ textAlign: 'center' }}>
            <strong>Min: 200px</strong>
            <br />
            <span style={{ fontSize: 12, color: 'var(--rel-color-text-muted, #94a3b8)' }}>Sürükleyerek dene</span>
          </div>
        </div>
        <div style={panelStyle('var(--rel-color-bg, #fff)')}>
          <div style={{ textAlign: 'center' }}>
            <strong>Min: 200px</strong>
            <br />
            <span style={{ fontSize: 12, color: 'var(--rel-color-text-muted, #94a3b8)' }}>Sürükleyerek dene</span>
          </div>
        </div>
      </SplitPanel>
    </div>
  ),
};

export const Collapsible: Story = {
  render: () => (
    <div style={{ height: 400, border: '1px solid var(--rel-color-border, #e2e8f0)', borderRadius: 12, overflow: 'hidden' }}>
      <SplitPanel collapsible={[true, false]}>
        <div style={panelStyle('var(--rel-color-bg-subtle, #eef2ff)')}>
          <div style={{ textAlign: 'center' }}>
            <strong>Daraltılabilir</strong>
            <br />
            <span style={{ fontSize: 12, color: 'var(--rel-color-text-muted, #94a3b8)' }}>Gutter'a çift tıkla</span>
          </div>
        </div>
        <div style={panelStyle('var(--rel-color-bg, #fff)')}>Sağ Panel</div>
      </SplitPanel>
    </div>
  ),
};

export const NestedSplit: Story = {
  render: () => (
    <div style={{ height: 500, border: '1px solid var(--rel-color-border, #e2e8f0)', borderRadius: 12, overflow: 'hidden' }}>
      <SplitPanel>
        <div style={panelStyle('var(--rel-color-bg-subtle, #f8fafc)')}>Sidebar</div>
        <SplitPanel orientation="vertical">
          <div style={panelStyle('var(--rel-color-bg, #fff)')}>Editor</div>
          <div style={panelStyle('var(--rel-color-bg-subtle, #fafafa)')}>Terminal</div>
        </SplitPanel>
      </SplitPanel>
    </div>
  ),
};

export const CustomSlotStyles: Story = {
  render: () => (
    <div style={{ height: 400, border: '2px dashed var(--rel-color-info, #6366f1)', borderRadius: 12, overflow: 'hidden' }}>
      <SplitPanel
        classNames={{ root: 'custom-split' }}
        styles={{
          root: { background: 'var(--rel-color-bg-subtle, #faf5ff)' },
          gutter: { background: 'var(--rel-color-info, #6366f1)', opacity: 0.3 },
          panel: { padding: 16 },
        }}
      >
        <div>Sol Panel</div>
        <div>Sağ Panel</div>
      </SplitPanel>
    </div>
  ),
};

export const Compound: Story = {
  render: () => (
    <div style={{ height: 400, border: '1px solid var(--rel-color-border, #e2e8f0)', borderRadius: 12, overflow: 'hidden' }}>
      <SplitPanel>
        <SplitPanel.Pane>
          <div style={panelStyle('var(--rel-color-bg-subtle, #eff6ff)')}>Sol Pane (Compound API)</div>
        </SplitPanel.Pane>
        <SplitPanel.Handle />
        <SplitPanel.Pane>
          <div style={panelStyle('var(--rel-color-bg, #fff)')}>Sag Pane (Compound API)</div>
        </SplitPanel.Pane>
      </SplitPanel>
    </div>
  ),
};

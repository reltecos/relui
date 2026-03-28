/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { LoadPanel } from './LoadPanel';

const meta: Meta<typeof LoadPanel> = {
  title: 'Feedback/LoadPanel',
  component: LoadPanel,
  tags: ['autodocs'],
  args: {
    visible: true,
    message: 'Yukleniyor...',
    size: 'md',
    backdrop: 'light',
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    backdrop: { control: 'select', options: ['light', 'dark', 'none'] },
    spinnerColor: { control: 'color' },
    spinnerThickness: { control: { type: 'number', min: 1, max: 8 } },
  },
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', height: 300, border: '1px solid var(--rel-color-border, #e2e8f0)', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ padding: 16, fontFamily: 'system-ui' }}>
          <h3 style={{ margin: '0 0 8px' }}>Icerik Alani</h3>
          <p style={{ margin: 0, color: 'var(--rel-color-text-muted, #64748b)' }}>Bu alan LoadPanel tarafindan kaplanir.</p>
        </div>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LoadPanel>;

export const Default: Story = {};

export const DarkBackdrop: Story = {
  args: {
    backdrop: 'dark',
    message: 'Veriler yukleniyor...',
  },
};

export const NoBackdrop: Story = {
  args: {
    backdrop: 'none',
    message: 'Arkapplansiz',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <div style={{ position: 'relative', width: 200, height: 150, border: '1px solid var(--rel-color-border, #e2e8f0)', borderRadius: 8, overflow: 'hidden' }}>
        <LoadPanel size="sm" message="SM" />
      </div>
      <div style={{ position: 'relative', width: 200, height: 150, border: '1px solid var(--rel-color-border, #e2e8f0)', borderRadius: 8, overflow: 'hidden' }}>
        <LoadPanel size="md" message="MD" />
      </div>
      <div style={{ position: 'relative', width: 200, height: 150, border: '1px solid var(--rel-color-border, #e2e8f0)', borderRadius: 8, overflow: 'hidden' }}>
        <LoadPanel size="lg" message="LG" />
      </div>
    </div>
  ),
};

export const CustomColor: Story = {
  args: {
    spinnerColor: 'var(--rel-color-error, #e11d48)',
    message: 'Ozel renk spinner',
  },
};

export const NoMessage: Story = {
  args: {
    message: undefined,
  },
};

export const CustomIndicator: Story = {
  args: {
    indicator: (
      <div style={{ fontSize: 32, animation: 'pulse 1.5s ease-in-out infinite' }}>
        &#x23F3;
      </div>
    ),
    message: 'Ozel gosterge',
  },
};

// ── Compound ──

export const Compound: Story = {
  render: () => (
    <div style={{ position: 'relative', height: 300, border: '1px solid var(--rel-color-border, #e2e8f0)', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ padding: 16, fontFamily: 'system-ui' }}>
        <h3 style={{ margin: '0 0 8px' }}>Compound LoadPanel</h3>
        <p style={{ margin: 0, color: 'var(--rel-color-text-muted, #64748b)' }}>Sub-component API ile olusturulmus.</p>
      </div>
      <LoadPanel>
        <LoadPanel.Spinner color="var(--rel-color-info, #8b5cf6)" />
        <LoadPanel.Message>Compound yukleniyor...</LoadPanel.Message>
      </LoadPanel>
    </div>
  ),
};

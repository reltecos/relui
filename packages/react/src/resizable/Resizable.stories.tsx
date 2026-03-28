/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Resizable } from './Resizable';

const meta: Meta<typeof Resizable> = {
  title: 'Layout/Resizable',
  component: Resizable,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof Resizable>;

export const Default: Story = {
  render: () => (
    <Resizable
      defaultWidth={300}
      defaultHeight={200}
      style={{ background: 'var(--rel-color-bg-subtle, #f1f5f9)', borderRadius: 12, border: '2px solid var(--rel-color-border, #e2e8f0)' }}
    >
      <div style={{ padding: 16, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Kenarlardan sürükleyerek boyutlandır
      </div>
    </Resizable>
  ),
};

export const WithMinMax: Story = {
  render: () => (
    <Resizable
      defaultWidth={300}
      defaultHeight={200}
      minWidth={150}
      maxWidth={500}
      minHeight={100}
      maxHeight={400}
      style={{ background: 'var(--rel-color-bg-subtle, #eff6ff)', borderRadius: 12, border: '2px solid var(--rel-color-border, #93c5fd)' }}
    >
      <div style={{ padding: 16, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4 }}>
        <strong>Min/Max sınırlı</strong>
        <span style={{ fontSize: 12, color: 'var(--rel-color-text-muted, #64748b)' }}>150-500 x 100-400</span>
      </div>
    </Resizable>
  ),
};

export const RightAndBottom: Story = {
  render: () => (
    <Resizable
      defaultWidth={300}
      defaultHeight={200}
      directions={['right', 'bottom', 'bottomRight']}
      style={{ background: 'var(--rel-color-bg-subtle, #f0fdf4)', borderRadius: 12, border: '2px solid var(--rel-color-border, #86efac)' }}
    >
      <div style={{ padding: 16, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Sadece sağ, alt ve sağ-alt
      </div>
    </Resizable>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Resizable
      defaultWidth={300}
      defaultHeight={200}
      disabled
      style={{ background: 'var(--rel-color-bg-subtle, #fef2f2)', borderRadius: 12, border: '2px solid var(--rel-color-border, #fca5a5)', opacity: 0.7 }}
    >
      <div style={{ padding: 16, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Devre dışı
      </div>
    </Resizable>
  ),
};

export const CustomSlotStyles: Story = {
  render: () => (
    <Resizable
      defaultWidth={300}
      defaultHeight={200}
      classNames={{ root: 'custom-resizable' }}
      styles={{
        root: { border: '2px dashed var(--rel-color-info, #6366f1)', borderRadius: 12 },
        handle: { background: 'var(--rel-color-info, #6366f1)', borderRadius: 2, opacity: 0.5 },
      }}
    >
      <div style={{ padding: 16, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Custom slot styled
      </div>
    </Resizable>
  ),
};

// ── Compound API ──────────────────────────────────────

export const Compound: Story = {
  render: () => (
    <Resizable
      defaultWidth={300}
      defaultHeight={200}
      directions={[]}
      style={{ background: 'var(--rel-color-bg-subtle, #fef3c7)', borderRadius: 12, border: '2px solid var(--rel-color-warning, #fbbf24)' }}
    >
      <div style={{ padding: 16, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Compound Handle API
      </div>
      <Resizable.Handle direction="right" />
      <Resizable.Handle direction="bottom" />
      <Resizable.Handle direction="bottomRight" />
    </Resizable>
  ),
};

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Masonry } from './Masonry';

const meta: Meta<typeof Masonry> = {
  title: 'Layout/Masonry',
  component: Masonry,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    columns: { control: { type: 'range', min: 1, max: 6, step: 1 } },
    gap: { control: { type: 'range', min: 0, max: 64, step: 4 } },
    rowGap: { control: { type: 'range', min: 0, max: 64, step: 4 } },
  },
};

export default meta;
type Story = StoryObj<typeof Masonry>;

const cardStyle = (height: number, bg: string) => ({
  height,
  background: bg,
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 600,
  fontSize: 14,
  color: '#475569',
});

const heights = [120, 180, 90, 200, 140, 160, 100, 220, 130, 170, 110, 150];
const colors = [
  '#e2e8f0', '#bfdbfe', '#bbf7d0', '#fef08a',
  '#fecaca', '#ddd6fe', '#fbcfe8', '#fed7aa',
  '#ccfbf1', '#e0e7ff', '#fce7f3', '#d9f99d',
];

export const Default: Story = {
  render: (args) => (
    <Masonry {...args}>
      {heights.map((h, i) => (
        <div key={i} style={cardStyle(h, colors[i])}>
          Card {i + 1}
        </div>
      ))}
    </Masonry>
  ),
  args: {
    columns: 3,
    gap: 16,
  },
};

export const TwoColumns: Story = {
  render: () => (
    <Masonry columns={2} gap={24}>
      {heights.slice(0, 6).map((h, i) => (
        <div key={i} style={cardStyle(h, colors[i])}>
          Card {i + 1}
        </div>
      ))}
    </Masonry>
  ),
};

export const FourColumns: Story = {
  render: () => (
    <Masonry columns={4} gap={12}>
      {heights.map((h, i) => (
        <div key={i} style={cardStyle(h, colors[i])}>
          Card {i + 1}
        </div>
      ))}
    </Masonry>
  ),
};

export const DifferentGaps: Story = {
  render: () => (
    <Masonry columns={3} gap={32} rowGap={8}>
      {heights.slice(0, 9).map((h, i) => (
        <div key={i} style={cardStyle(h, colors[i])}>
          Card {i + 1}
        </div>
      ))}
    </Masonry>
  ),
};

export const ImageCards: Story = {
  render: () => (
    <Masonry columns={3} gap={16}>
      {heights.map((h, i) => (
        <div key={i} style={{
          borderRadius: 12,
          overflow: 'hidden',
          background: colors[i],
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        }}>
          <div style={{ height: h, background: colors[i] }} />
          <div style={{ padding: '12px 16px', fontSize: 13, color: '#334155' }}>
            Image #{i + 1} — {h}px yüksekliğinde
          </div>
        </div>
      ))}
    </Masonry>
  ),
};

export const CustomSlotStyles: Story = {
  render: () => (
    <Masonry
      columns={3}
      gap={16}
      classNames={{ root: 'custom-masonry' }}
      styles={{
        root: { border: '2px dashed #6366f1', borderRadius: 12, padding: 16 },
        item: { transition: 'transform 0.2s ease' },
      }}
    >
      {heights.slice(0, 6).map((h, i) => (
        <div key={i} style={cardStyle(h, colors[i])}>
          Card {i + 1}
        </div>
      ))}
    </Masonry>
  ),
};

export const Compound: Story = {
  name: 'Compound API',
  render: () => (
    <Masonry columns={3} gap={16}>
      {heights.slice(0, 6).map((h, i) => (
        <Masonry.Item key={i}>
          <div style={cardStyle(h, colors[i])}>
            Card {i + 1}
          </div>
        </Masonry.Item>
      ))}
    </Masonry>
  ),
};

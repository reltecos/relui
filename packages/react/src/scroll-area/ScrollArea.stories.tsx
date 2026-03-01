/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea } from './ScrollArea';
import { Stack } from '../stack';

const meta: Meta<typeof ScrollArea> = {
  title: 'Layout/ScrollArea',
  component: ScrollArea,
  parameters: { layout: 'padded' },
  argTypes: {
    type: {
      control: 'select',
      options: ['auto', 'always', 'hover', 'scroll'],
    },
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal', 'both'],
    },
    scrollbarSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ScrollArea>;

export const Default: Story = {
  render: () => (
    <ScrollArea height={300} style={{ border: '1px solid #e2e8f0', borderRadius: 8 }}>
      <Stack spacing={4} style={{ padding: 16 }}>
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            style={{
              padding: '12px 16px',
              background: i % 2 === 0 ? '#f8fafc' : '#f1f5f9',
              borderRadius: 6,
            }}
          >
            Satır {i + 1} — ScrollArea içeriği
          </div>
        ))}
      </Stack>
    </ScrollArea>
  ),
};

export const AlwaysVisible: Story = {
  render: () => (
    <ScrollArea
      height={250}
      type="always"
      style={{ border: '1px solid #e2e8f0', borderRadius: 8 }}
    >
      <div style={{ padding: 16 }}>
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i} style={{ margin: '8px 0' }}>
            Paragraf {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <ScrollArea
      height={200}
      width={400}
      orientation="horizontal"
      type="always"
      style={{ border: '1px solid #e2e8f0', borderRadius: 8 }}
    >
      <div style={{ display: 'flex', gap: 16, padding: 16, width: 1200 }}>
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            style={{
              minWidth: 150,
              height: 150,
              background: `hsl(${i * 36}, 70%, 90%)`,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
            }}
          >
            Kart {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const BothAxes: Story = {
  render: () => (
    <ScrollArea
      height={300}
      width={400}
      orientation="both"
      type="always"
      style={{ border: '1px solid #e2e8f0', borderRadius: 8 }}
    >
      <div style={{ width: 800, height: 800, padding: 16 }}>
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          800 x 800 İçerik
        </div>
      </div>
    </ScrollArea>
  ),
};

export const SmallScrollbar: Story = {
  render: () => (
    <ScrollArea
      height={200}
      scrollbarSize="sm"
      type="always"
      style={{ border: '1px solid #e2e8f0', borderRadius: 8 }}
    >
      <div style={{ padding: 16 }}>
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i} style={{ margin: '4px 0', fontSize: 14 }}>
            Küçük scrollbar ile satır {i + 1}
          </p>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const LargeScrollbar: Story = {
  render: () => (
    <ScrollArea
      height={200}
      scrollbarSize="lg"
      type="always"
      style={{ border: '1px solid #e2e8f0', borderRadius: 8 }}
    >
      <div style={{ padding: 16 }}>
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i} style={{ margin: '4px 0', fontSize: 14 }}>
            Büyük scrollbar ile satır {i + 1}
          </p>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const MaxHeight: Story = {
  render: () => (
    <ScrollArea
      maxHeight={200}
      type="hover"
      style={{ border: '1px solid #e2e8f0', borderRadius: 8 }}
    >
      <div style={{ padding: 16 }}>
        {Array.from({ length: 15 }, (_, i) => (
          <p key={i} style={{ margin: '6px 0' }}>
            maxHeight=200 ile otomatik scroll — satır {i + 1}
          </p>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const CustomSlotStyles: Story = {
  render: () => (
    <ScrollArea
      height={200}
      type="always"
      classNames={{ root: 'custom-scroll-root' }}
      styles={{
        root: { border: '2px dashed #6366f1', borderRadius: 12 },
        viewport: { padding: 16 },
      }}
    >
      <div>
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i} style={{ margin: '4px 0' }}>
            Custom slot styled satır {i + 1}
          </p>
        ))}
      </div>
    </ScrollArea>
  ),
};

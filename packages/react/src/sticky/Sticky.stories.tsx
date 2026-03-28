/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Sticky } from './Sticky';
import { Stack } from '../stack';
import { ScrollArea } from '../scroll-area';

const meta: Meta<typeof Sticky> = {
  title: 'Layout/Sticky',
  component: Sticky,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    position: {
      control: 'select',
      options: ['top', 'bottom'],
    },
    offset: { control: 'number' },
    zIndex: { control: 'number' },
    enabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Sticky>;

export const Default: Story = {
  render: () => (
    <ScrollArea height={400} style={{ border: '1px solid var(--rel-color-border, #e2e8f0)', borderRadius: 8 }}>
      <div style={{ padding: 16 }}>
        <p style={{ margin: '0 0 16px' }}>Aşağı kaydırın — header yapışacak.</p>

        <Sticky offset={0} style={{ background: 'var(--rel-color-bg-inverse, #1e293b)', color: 'var(--rel-color-text-inverse, white)', padding: '12px 16px', borderRadius: 8 }}>
          <strong>Sticky Header</strong>
        </Sticky>

        <Stack spacing={4} style={{ marginTop: 16 }}>
          {Array.from({ length: 30 }, (_, i) => (
            <div
              key={i}
              style={{
                padding: '12px 16px',
                background: i % 2 === 0 ? 'var(--rel-color-bg-subtle, #f8fafc)' : 'var(--rel-color-bg-subtle, #f1f5f9)',
                borderRadius: 6,
              }}
            >
              İçerik satırı {i + 1}
            </div>
          ))}
        </Stack>
      </div>
    </ScrollArea>
  ),
};

export const WithOffset: Story = {
  render: () => (
    <ScrollArea height={400} style={{ border: '1px solid var(--rel-color-border, #e2e8f0)', borderRadius: 8 }}>
      <div style={{ padding: 16 }}>
        <p style={{ margin: '0 0 16px' }}>16px offset ile sticky header.</p>

        <Sticky offset={16} style={{ background: 'var(--rel-color-primary, #3b82f6)', color: 'var(--rel-color-text-inverse, white)', padding: '12px 16px', borderRadius: 8 }}>
          <strong>Sticky Header (offset: 16px)</strong>
        </Sticky>

        <Stack spacing={4} style={{ marginTop: 16 }}>
          {Array.from({ length: 30 }, (_, i) => (
            <div
              key={i}
              style={{
                padding: '12px 16px',
                background: 'var(--rel-color-bg-subtle, #f1f5f9)',
                borderRadius: 6,
              }}
            >
              Satır {i + 1}
            </div>
          ))}
        </Stack>
      </div>
    </ScrollArea>
  ),
};

export const BottomSticky: Story = {
  render: () => (
    <ScrollArea height={400} style={{ border: '1px solid var(--rel-color-border, #e2e8f0)', borderRadius: 8 }}>
      <div style={{ padding: 16 }}>
        <Stack spacing={4}>
          {Array.from({ length: 30 }, (_, i) => (
            <div
              key={i}
              style={{
                padding: '12px 16px',
                background: 'var(--rel-color-bg-subtle, #f1f5f9)',
                borderRadius: 6,
              }}
            >
              Satır {i + 1}
            </div>
          ))}
        </Stack>

        <Sticky position="bottom" style={{ background: 'var(--rel-color-success, #059669)', color: 'var(--rel-color-text-inverse, white)', padding: '12px 16px', borderRadius: 8, marginTop: 16 }}>
          <strong>Sticky Footer (position: bottom)</strong>
        </Sticky>
      </div>
    </ScrollArea>
  ),
};

export const MultipleStickyHeaders: Story = {
  render: () => (
    <ScrollArea height={500} style={{ border: '1px solid var(--rel-color-border, #e2e8f0)', borderRadius: 8 }}>
      <div style={{ padding: 16 }}>
        {['A', 'B', 'C', 'D'].map((group) => (
          <div key={group} style={{ marginBottom: 16 }}>
            <Sticky offset={0} style={{ background: 'var(--rel-color-info, #6366f1)', color: 'var(--rel-color-text-inverse, white)', padding: '8px 16px', borderRadius: 6 }}>
              <strong>Grup {group}</strong>
            </Sticky>
            <Stack spacing={2} style={{ marginTop: 8 }}>
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    padding: '10px 16px',
                    background: 'var(--rel-color-bg-subtle, #f8fafc)',
                    borderRadius: 4,
                  }}
                >
                  {group} - Öğe {i + 1}
                </div>
              ))}
            </Stack>
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const CustomSlotStyles: Story = {
  render: () => (
    <ScrollArea height={300} style={{ border: '1px solid var(--rel-color-border, #e2e8f0)', borderRadius: 8 }}>
      <div style={{ padding: 16 }}>
        <Sticky
          classNames={{ root: 'custom-sticky' }}
          styles={{ root: { background: 'var(--rel-color-warning-light, #fef3c7)', padding: '12px 16px', border: '2px dashed var(--rel-color-warning, #f59e0b)', borderRadius: 8 } }}
        >
          Custom slot styled sticky
        </Sticky>
        <Stack spacing={4} style={{ marginTop: 16 }}>
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} style={{ padding: '10px', background: 'var(--rel-color-bg-subtle, #f1f5f9)', borderRadius: 4 }}>
              Satir {i + 1}
            </div>
          ))}
        </Stack>
      </div>
    </ScrollArea>
  ),
};

export const Compound: Story = {
  name: 'Compound API',
  render: () => (
    <ScrollArea height={300} style={{ border: '1px solid var(--rel-color-border, #e2e8f0)', borderRadius: 8 }}>
      <div style={{ padding: 16 }}>
        <Sticky offset={0} style={{ background: 'var(--rel-color-info, #7c3aed)', color: 'var(--rel-color-text-inverse, white)', padding: '12px 16px', borderRadius: 8 }}>
          <Sticky.Content>Compound Sticky Header</Sticky.Content>
        </Sticky>
        <Stack spacing={4} style={{ marginTop: 16 }}>
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} style={{ padding: '10px', background: 'var(--rel-color-bg-subtle, #f1f5f9)', borderRadius: 4 }}>
              Satir {i + 1}
            </div>
          ))}
        </Stack>
      </div>
    </ScrollArea>
  ),
};

export const Playground: Story = {
  args: {
    position: 'top',
    offset: 0,
    zIndex: 100,
    enabled: true,
  },
  render: (args) => (
    <ScrollArea height={300} style={{ border: '1px solid var(--rel-color-border, #e2e8f0)', borderRadius: 8 }}>
      <div style={{ padding: 16 }}>
        <Sticky {...args} style={{ background: 'var(--rel-color-primary, #0ea5e9)', color: 'var(--rel-color-text-inverse, white)', padding: '12px 16px', borderRadius: 8 }}>
          Playground Sticky
        </Sticky>
        <Stack spacing={4} style={{ marginTop: 16 }}>
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} style={{ padding: '10px', background: 'var(--rel-color-bg-subtle, #f1f5f9)', borderRadius: 4 }}>
              Satir {i + 1}
            </div>
          ))}
        </Stack>
      </div>
    </ScrollArea>
  ),
};

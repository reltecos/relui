/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { VirtualList } from './VirtualList';

const makeItems = (count: number) =>
  Array.from({ length: count }, (_, i) => ({ id: String(i), label: `Item ${i}`, description: `Aciklama ${i}` }));

const meta: Meta<typeof VirtualList> = {
  title: 'Data Display/VirtualList',
  component: VirtualList,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    height: { control: { type: 'range', min: 200, max: 800, step: 50 } },
    itemHeight: { control: { type: 'range', min: 20, max: 100, step: 5 } },
    overscan: { control: { type: 'range', min: 0, max: 20, step: 1 } },
  },
};

export default meta;
type Story = StoryObj<typeof VirtualList>;

const itemRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '0 16px',
  height: '100%',
  borderBottom: '1px solid var(--rel-color-border, #e5e7eb)',
  fontSize: 'var(--rel-text-sm, 14px)',
};

// ── Default ──

export const Default: Story = {
  args: {
    items: makeItems(100),
    itemHeight: 40,
    height: 400,
    renderItem: (item) => (
      <div style={itemRowStyle}>
        <span style={{ fontWeight: 500 }}>{String(item['label'])}</span>
      </div>
    ),
  },
  decorators: [(Story) => <div style={{ width: 400, border: '1px solid var(--rel-color-border, #e5e7eb)', borderRadius: 8 }}><Story /></div>],
};

// ── Large List (100K) ──

export const LargeList: Story = {
  name: '100K Oge / 100K Items',
  render: () => (
    <div style={{ width: 400, border: '1px solid var(--rel-color-border, #e5e7eb)', borderRadius: 8 }}>
      <VirtualList
        items={makeItems(100000)}
        itemHeight={40}
        height={400}
        renderItem={(item, index) => (
          <div style={itemRowStyle}>
            <span style={{ fontWeight: 500, marginRight: 8 }}>#{index}</span>
            <span>{String(item['label'])}</span>
          </div>
        )}
      />
    </div>
  ),
};

// ── Compound API ──

export const Compound: Story = {
  name: 'Compound API',
  render: () => (
    <div style={{ width: 400, border: '1px solid var(--rel-color-border, #e5e7eb)', borderRadius: 8 }}>
      <VirtualList totalCount={10000} itemHeight={40} height={400}>
        {(index) => (
          <VirtualList.Item key={index} index={index}>
            <div style={itemRowStyle}>
              <span style={{ fontWeight: 500 }}>Compound Row {index}</span>
            </div>
          </VirtualList.Item>
        )}
      </VirtualList>
    </div>
  ),
};

// ── Custom Item Height ──

export const CustomItemHeight: Story = {
  name: 'Ozel Oge Yuksekligi / Custom Item Height',
  render: () => (
    <div style={{ width: 400, border: '1px solid var(--rel-color-border, #e5e7eb)', borderRadius: 8 }}>
      <VirtualList
        items={makeItems(500)}
        itemHeight={80}
        height={400}
        renderItem={(item, index) => (
          <div style={{ ...itemRowStyle, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: 4 }}>
            <span style={{ fontWeight: 600 }}>{String(item['label'])}</span>
            <span style={{ fontSize: 12, opacity: 0.6 }}>Aciklama #{index}</span>
          </div>
        )}
      />
    </div>
  ),
};

// ── Small Overscan ──

export const SmallOverscan: Story = {
  name: 'Kucuk Overscan / Small Overscan',
  args: {
    items: makeItems(1000),
    itemHeight: 40,
    height: 400,
    overscan: 1,
    renderItem: (item) => (
      <div style={itemRowStyle}>
        <span>{String(item['label'])}</span>
      </div>
    ),
  },
  decorators: [(Story) => <div style={{ width: 400, border: '1px solid var(--rel-color-border, #e5e7eb)', borderRadius: 8 }}><Story /></div>],
};

// ── CustomSlotStyles ──

export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  args: {
    items: makeItems(100),
    itemHeight: 40,
    height: 300,
    styles: {
      root: { padding: 4 },
      viewport: { padding: '4px' },
    },
    classNames: { root: 'custom-vl' },
    renderItem: (item) => (
      <div style={itemRowStyle}>
        <span>{String(item['label'])}</span>
      </div>
    ),
  },
  decorators: [(Story) => <div style={{ width: 400, border: '1px solid var(--rel-color-border, #e5e7eb)', borderRadius: 8 }}><Story /></div>],
};

// ── Playground ──

export const Playground: Story = {
  args: {
    items: makeItems(500),
    itemHeight: 40,
    height: 400,
    overscan: 5,
    renderItem: (item) => (
      <div style={itemRowStyle}>
        <span>{String(item['label'])}</span>
      </div>
    ),
  },
  decorators: [(Story) => <div style={{ width: 400, border: '1px solid var(--rel-color-border, #e5e7eb)', borderRadius: 8 }}><Story /></div>],
};

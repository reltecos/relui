/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { DescriptionList } from './DescriptionList';

const sampleItems = [
  { id: '1', term: 'Ad Soyad', description: 'Ali Yilmaz' },
  { id: '2', term: 'E-posta', description: 'ali@ornek.com' },
  { id: '3', term: 'Telefon', description: '+90 555 123 4567' },
  { id: '4', term: 'Adres', description: 'Istanbul, Turkiye' },
];

const meta: Meta<typeof DescriptionList> = {
  title: 'Data Display/DescriptionList',
  component: DescriptionList,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    direction: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'Yon / Direction',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Boyut / Size',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DescriptionList>;

// ── Default (Props-based, Vertical) ──

export const Default: Story = {
  args: {
    items: sampleItems,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
};

// ── Horizontal ──

export const Horizontal: Story = {
  name: 'Yatay / Horizontal',
  args: {
    items: sampleItems,
    direction: 'horizontal',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
};

// ── All Sizes ──

export const AllSizes: Story = {
  name: 'Tum Boyutlar / All Sizes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: 400 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size}>
          <p style={{ margin: '0 0 8px', fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>
            Size: {size}
          </p>
          <DescriptionList
            size={size}
            items={[
              { id: '1', term: 'Ad', description: 'Ali' },
              { id: '2', term: 'Soyad', description: 'Yilmaz' },
            ]}
          />
        </div>
      ))}
    </div>
  ),
};

// ── Horizontal + Sizes ──

export const HorizontalSizes: Story = {
  name: 'Yatay Boyutlar / Horizontal Sizes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: 400 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size}>
          <p style={{ margin: '0 0 8px', fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>
            Size: {size}
          </p>
          <DescriptionList
            direction="horizontal"
            size={size}
            items={[
              { id: '1', term: 'Ad', description: 'Ali' },
              { id: '2', term: 'Soyad', description: 'Yilmaz' },
            ]}
          />
        </div>
      ))}
    </div>
  ),
};

// ── Compound API ──

export const CompoundAPI: Story = {
  name: 'Compound API',
  render: () => (
    <div style={{ width: 400 }}>
      <DescriptionList>
        <DescriptionList.Item term="Proje" description="RelUI" />
        <DescriptionList.Item term="Versiyon" description="1.0.0" />
        <DescriptionList.Item term="Lisans" description="BSL 1.1" />
        <DescriptionList.Item
          term="Aciklama"
          description="Dunyanin en guclu web UI toolkit i"
        />
      </DescriptionList>
    </div>
  ),
};

// ── Compound Horizontal ──

export const CompoundHorizontal: Story = {
  name: 'Compound Yatay / Compound Horizontal',
  render: () => (
    <div style={{ width: 400 }}>
      <DescriptionList direction="horizontal">
        <DescriptionList.Item term="Durum" description="Aktif" />
        <DescriptionList.Item term="Tarih" description="2025-01-15" />
        <DescriptionList.Item term="Sorumlu" description="Gelistirici" />
      </DescriptionList>
    </div>
  ),
};

// ── Slot Customization ──

export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  args: {
    items: sampleItems.slice(0, 3),
    styles: {
      root: { padding: '16px' },
      term: { fontSize: '16px' },
      description: { letterSpacing: '0.02em' },
    },
    classNames: {
      root: 'custom-dl',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
};

// ── Playground ──

export const Playground: Story = {
  args: {
    items: sampleItems,
    direction: 'vertical',
    size: 'md',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
};

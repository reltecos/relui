/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Timeline } from './Timeline';

const meta: Meta<typeof Timeline> = {
  title: 'Data Display/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
    align: {
      control: 'select',
      options: ['left', 'right', 'alternate'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Timeline>;

// ── Default Items ──

const defaultItems = [
  {
    id: 'order',
    title: 'Siparis Alindi',
    description: 'Siparisiniz basariyla olusturuldu.',
    date: '15 Mart 2025, 10:30',
  },
  {
    id: 'process',
    title: 'Hazirlaniyor',
    description: 'Siparisiniz hazirlanmaya baslandi.',
    date: '15 Mart 2025, 11:00',
  },
  {
    id: 'ship',
    title: 'Kargoya Verildi',
    description: 'Siparisiniz kargo firmasina teslim edildi.',
    date: '16 Mart 2025, 09:15',
  },
  {
    id: 'deliver',
    title: 'Teslim Edildi',
    description: 'Siparisiniz basariyla teslim edildi.',
    date: '17 Mart 2025, 14:45',
  },
];

// ── Default ──

export const Default: Story = {
  args: {
    items: defaultItems,
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
  args: {
    items: defaultItems,
    orientation: 'horizontal',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 700 }}>
        <Story />
      </div>
    ),
  ],
};

// ── AlignRight ──

export const AlignRight: Story = {
  args: {
    items: defaultItems,
    align: 'right',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
};

// ── Alternate ──

export const Alternate: Story = {
  args: {
    items: defaultItems,
    align: 'alternate',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 500 }}>
        <Story />
      </div>
    ),
  ],
};

// ── WithColors ──

export const WithColors: Story = {
  args: {
    items: [
      { id: '1', title: 'Basarili', description: 'Islem tamamlandi.', color: '#16a34a' },
      { id: '2', title: 'Devam Ediyor', description: 'Islem suruyor.', color: '#3b82f6' },
      { id: '3', title: 'Beklemede', description: 'Onay bekleniyor.', color: '#f59e0b' },
      { id: '4', title: 'Basarisiz', description: 'Islem basarisiz oldu.', color: '#dc2626' },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
};

// ── Compound ──

export const Compound: Story = {
  render: () => (
    <div style={{ width: 400 }}>
      <Timeline>
        <Timeline.Item
          title="Kayit Olusturuldu"
          description="Kullanici hesabi basariyla olusturuldu."
          date="10 Mart 2025"
        />
        <Timeline.Item
          title="E-posta Dogrulandi"
          description="E-posta adresi dogrulandi."
          date="10 Mart 2025"
          color="#16a34a"
        />
        <Timeline.Item
          title="Profil Tamamlandi"
          description="Kullanici profili dolduruldu."
          date="11 Mart 2025"
        />
      </Timeline>
    </div>
  ),
};

// ── CustomSlotStyles ──

export const CustomSlotStyles: Story = {
  args: {
    items: defaultItems.slice(0, 3),
    styles: {
      root: { padding: 16 },
      title: { fontSize: 16, letterSpacing: '0.02em' },
      description: { fontSize: 13 },
      dot: { opacity: 0.8 },
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

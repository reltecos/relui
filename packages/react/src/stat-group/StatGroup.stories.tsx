/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { StatGroup } from './StatGroup';
import { Stat } from '../stat/Stat';

const meta: Meta<typeof StatGroup> = {
  title: 'Data Display/StatGroup',
  component: StatGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    direction: {
      control: 'select',
      options: ['row', 'column'],
    },
    divider: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof StatGroup>;

// ── Default Items ──

const defaultItems = [
  { id: 'users', value: '1,234', label: 'Kullanicilar' },
  { id: 'orders', value: '567', label: 'Siparisler' },
  { id: 'revenue', value: '$12,345', label: 'Gelir' },
  { id: 'rate', value: '89%', label: 'Basari Orani' },
];

// ── Default ──

export const Default: Story = {
  args: {
    items: defaultItems,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 700 }}>
        <Story />
      </div>
    ),
  ],
};

// ── WithDivider ──

export const WithDivider: Story = {
  args: {
    items: defaultItems,
    divider: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 700 }}>
        <Story />
      </div>
    ),
  ],
};

// ── Column ──

export const Column: Story = {
  args: {
    items: defaultItems.slice(0, 3),
    direction: 'column',
    divider: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 280 }}>
        <Story />
      </div>
    ),
  ],
};

// ── WithTrends ──

export const WithTrends: Story = {
  args: {
    items: [
      { id: '1', value: '1,234', label: 'Kullanicilar', trend: 'up' as const, trendValue: '+12%' },
      { id: '2', value: '567', label: 'Siparisler', trend: 'down' as const, trendValue: '-3%' },
      { id: '3', value: '89%', label: 'Basari', trend: 'neutral' as const, trendValue: '0%' },
    ],
    divider: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 600 }}>
        <Story />
      </div>
    ),
  ],
};

// ── Children (bare) ──

export const Children: Story = {
  render: () => (
    <div style={{ width: 600 }}>
      <StatGroup divider>
        <Stat value="1,234" label="Kullanicilar" trend="up" trendValue="+12%" />
        <Stat value="567" label="Siparisler" />
        <Stat value="89%" label="Basari Orani" />
      </StatGroup>
    </div>
  ),
};

// ── Compound ──

export const Compound: Story = {
  render: () => (
    <div style={{ width: 600 }}>
      <StatGroup divider>
        <StatGroup.Stat>
          <Stat value="1,234" label="Kullanicilar" trend="up" trendValue="+12%" />
        </StatGroup.Stat>
        <StatGroup.Stat>
          <Stat value="567" label="Siparisler" />
        </StatGroup.Stat>
        <StatGroup.Stat>
          <Stat value="89%" label="Basari Orani" />
        </StatGroup.Stat>
      </StatGroup>
    </div>
  ),
};

// ── CompoundColumn ──

export const CompoundColumn: Story = {
  render: () => (
    <div style={{ width: 280 }}>
      <StatGroup direction="column" divider>
        <StatGroup.Stat>
          <Stat value="1,234" label="Kullanicilar" />
        </StatGroup.Stat>
        <StatGroup.Stat>
          <Stat value="567" label="Siparisler" />
        </StatGroup.Stat>
      </StatGroup>
    </div>
  ),
};

// ── CustomSlotStyles ──

export const CustomSlotStyles: Story = {
  args: {
    items: defaultItems.slice(0, 3),
    divider: true,
    styles: {
      root: { padding: 24 },
      stat: { padding: '16px 32px' },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 700 }}>
        <Story />
      </div>
    ),
  ],
};

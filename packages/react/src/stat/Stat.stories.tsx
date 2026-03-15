/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Stat } from './Stat';

const meta: Meta<typeof Stat> = {
  title: 'Data Display/Stat',
  component: Stat,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    trend: {
      control: 'select',
      options: ['up', 'down', 'neutral'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stat>;

// ── Default ──

export const Default: Story = {
  args: {
    value: '1,234',
    label: 'Toplam Kullanici',
  },
};

// ── AllSizes ──

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
      <Stat value="1,234" label="Small" size="sm" />
      <Stat value="1,234" label="Medium" size="md" />
      <Stat value="1,234" label="Large" size="lg" />
    </div>
  ),
};

// ── WithTrend ──

export const WithTrend: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
      <Stat value="1,234" label="Kullanicilar" trend="up" trendValue="+12.5%" />
      <Stat value="567" label="Siparisler" trend="down" trendValue="-3.2%" />
      <Stat value="89%" label="Basari Orani" trend="neutral" trendValue="0%" />
    </div>
  ),
};

// ── WithIcon ──

export const WithIcon: Story = {
  args: {
    value: '2,456',
    label: 'Toplam Gelir',
    helpText: 'Son 30 gun',
    trend: 'up',
    trendValue: '+8.1%',
    icon: (
      <span style={{ fontSize: 24 }}>$</span>
    ),
  },
};

// ── WithHelpText ──

export const WithHelpText: Story = {
  args: {
    value: '456',
    label: 'Aktif Kullanici',
    helpText: 'Son 24 saat icinde giris yapan kullanicilar',
  },
};

// ── CustomSlotStyles ──

export const CustomSlotStyles: Story = {
  args: {
    value: '99.9%',
    label: 'Uptime',
    helpText: 'Son 30 gun',
    trend: 'up',
    trendValue: '+0.1%',
    styles: {
      root: { padding: 20 },
      value: { fontSize: 36, letterSpacing: '-0.02em' },
      label: { fontSize: 16 },
    },
  },
};

// ── Compound ──

export const Compound: Story = {
  render: () => (
    <Stat size="lg">
      <Stat.Icon><span style={{ fontSize: 24 }}>$</span></Stat.Icon>
      <Stat.Value>2,456</Stat.Value>
      <Stat.Label>Toplam Gelir</Stat.Label>
      <Stat.Trend direction="up">+8.1%</Stat.Trend>
      <Stat.HelpText>Son 30 gun</Stat.HelpText>
    </Stat>
  ),
};

// ── CompoundMinimal ──

export const CompoundMinimal: Story = {
  render: () => (
    <Stat>
      <Stat.Value>1,234</Stat.Value>
      <Stat.Label>Kullanicilar</Stat.Label>
    </Stat>
  ),
};

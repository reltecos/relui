/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { DigitalGauge } from './DigitalGauge';

const meta: Meta<typeof DigitalGauge> = {
  title: 'Data Display/DigitalGauge',
  component: DigitalGauge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    precision: {
      control: 'number',
    },
    showMinMax: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DigitalGauge>;

// ── Default ──

export const Default: Story = {
  args: {
    value: 42,
    label: 'Sicaklik',
    unit: '\u00B0C',
  },
};

// ── AllSizes ──

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
      <DigitalGauge value={42} label="Small" unit="\u00B0C" size="sm" />
      <DigitalGauge value={42} label="Medium" unit="\u00B0C" size="md" />
      <DigitalGauge value={42} label="Large" unit="\u00B0C" size="lg" />
    </div>
  ),
};

// ── WithMinMax ──

export const WithMinMax: Story = {
  args: {
    value: 72,
    label: 'Sicaklik',
    unit: '\u00B0C',
    min: 0,
    max: 100,
    showMinMax: true,
  },
};

// ── Precision ──

export const Precision: Story = {
  args: {
    value: 3.14159,
    label: 'Pi',
    precision: 4,
  },
};

// ── NegativeValue ──

export const NegativeValue: Story = {
  args: {
    value: -18,
    label: 'Donma Noktasi',
    unit: '\u00B0C',
    min: -50,
    max: 50,
    showMinMax: true,
  },
};

// ── Compound ──

export const Compound: Story = {
  render: () => (
    <DigitalGauge value={98.6} precision={1} min={90} max={110} size="lg">
      <DigitalGauge.Display />
      <DigitalGauge.Label>Vucut Sicakligi</DigitalGauge.Label>
      <DigitalGauge.MinMax />
    </DigitalGauge>
  ),
};

// ── CompoundCustomDisplay ──

export const CompoundCustomDisplay: Story = {
  render: () => (
    <DigitalGauge value={1234} size="lg">
      <DigitalGauge.Display>
        1,234
        <DigitalGauge.Unit>kWh</DigitalGauge.Unit>
      </DigitalGauge.Display>
      <DigitalGauge.Label>Enerji Tuketimi</DigitalGauge.Label>
    </DigitalGauge>
  ),
};

// ── CustomSlotStyles ──

export const CustomSlotStyles: Story = {
  args: {
    value: 88,
    label: 'Hiz',
    unit: 'km/h',
    min: 0,
    max: 200,
    showMinMax: true,
    styles: {
      root: { padding: 16 },
      display: { padding: '12px 20px', letterSpacing: '0.1em' },
      label: { fontSize: 16 },
    },
  },
};

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RangeSlider } from './RangeSlider';

// ── Meta ──────────────────────────────────────────────────────────────

const meta: Meta<typeof RangeSlider> = {
  title: 'Primitives/RangeSlider',
  component: RangeSlider,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    color: {
      control: 'select',
      options: ['accent', 'neutral', 'destructive', 'success', 'warning'],
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    minDistance: { control: 'number' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    invalid: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof RangeSlider>;

// ── Stories ───────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    'aria-label': 'Min değer',
    'aria-label-end': 'Max değer',
    min: 0,
    max: 100,
    value: [20, 80],
    size: 'md',
    color: 'accent',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '300px' }}>
      <RangeSlider size="sm" value={[20, 70]} aria-label="Küçük" />
      <RangeSlider size="md" value={[30, 80]} aria-label="Orta" />
      <RangeSlider size="lg" value={[10, 60]} aria-label="Büyük" />
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '300px' }}>
      <RangeSlider color="accent" value={[20, 70]} aria-label="Accent" />
      <RangeSlider color="neutral" value={[20, 70]} aria-label="Neutral" />
      <RangeSlider color="destructive" value={[20, 70]} aria-label="Destructive" />
      <RangeSlider color="success" value={[20, 70]} aria-label="Success" />
      <RangeSlider color="warning" value={[20, 70]} aria-label="Warning" />
    </div>
  ),
};

export const MinDistance: Story = {
  name: 'Minimum Mesafe / Min Distance',
  render: () => {
    const [value, setValue] = useState<[number, number]>([30, 70]);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '300px' }}>
        <RangeSlider
          min={0}
          max={100}
          minDistance={20}
          value={value}
          onValueChange={setValue}
          aria-label="Min"
          aria-label-end="Max"
        />
        <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
          Aralık: {value[0]} — {value[1]} (min mesafe: 20)
        </div>
      </div>
    );
  },
};

export const Steps: Story = {
  name: 'Adımlı / With Steps',
  render: () => {
    const [value, setValue] = useState<[number, number]>([20, 80]);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '300px' }}>
        <RangeSlider
          min={0}
          max={100}
          step={10}
          value={value}
          onValueChange={setValue}
          aria-label="Min"
          aria-label-end="Max"
        />
        <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
          Aralık: {value[0]} — {value[1]} (step: 10)
        </div>
      </div>
    );
  },
};

export const Vertical: Story = {
  name: 'Dikey / Vertical',
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', padding: '1rem' }}>
      <RangeSlider orientation="vertical" value={[20, 60]} size="sm" aria-label="SM vertical" />
      <RangeSlider orientation="vertical" value={[30, 70]} size="md" aria-label="MD vertical" />
      <RangeSlider orientation="vertical" value={[10, 90]} size="lg" aria-label="LG vertical" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ maxWidth: '300px' }}>
      <RangeSlider disabled value={[25, 75]} aria-label="Disabled" />
    </div>
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <div style={{ maxWidth: '300px' }}>
      <RangeSlider readOnly value={[30, 70]} aria-label="ReadOnly" />
    </div>
  ),
};

export const Invalid: Story = {
  render: () => (
    <div style={{ maxWidth: '300px' }}>
      <RangeSlider invalid value={[10, 90]} aria-label="Invalid" />
    </div>
  ),
};

export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '300px' }}>
      <RangeSlider
        aria-label="Track ozellestirme"
        value={[20, 80]}
        classNames={{ track: 'my-track' }}
        styles={{
          track: { backgroundColor: '#e0e0e0', borderRadius: '8px' },
          fill: { backgroundColor: 'tomato' },
          startThumb: { border: '2px solid tomato' },
          endThumb: { border: '2px solid orange' },
        }}
      />
      <RangeSlider
        aria-label="Root ozellestirme"
        value={[30, 70]}
        className="legacy"
        classNames={{ root: 'slot-root' }}
        styles={{
          root: { padding: '8px' },
          startThumb: { boxShadow: '0 0 8px rgba(0,0,0,0.3)' },
          endThumb: { boxShadow: '0 0 8px rgba(0,0,0,0.3)' },
        }}
      />
    </div>
  ),
};

export const Controlled: Story = {
  name: 'Kontrollü / Controlled',
  render: () => {
    const [range, setRange] = useState<[number, number]>([200, 800]);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '300px' }}>
        <RangeSlider
          min={0}
          max={1000}
          step={50}
          minDistance={100}
          value={range}
          onValueChange={setRange}
          aria-label="Min fiyat"
          aria-label-end="Max fiyat"
          aria-valuetext={`${range[0]} TL`}
          aria-valuetext-end={`${range[1]} TL`}
          color="success"
        />
        <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
          Fiyat: {range[0]} TL — {range[1]} TL
        </div>
      </div>
    );
  },
};

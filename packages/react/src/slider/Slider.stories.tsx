/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from './Slider';

// ── Meta ──────────────────────────────────────────────────────────────

const meta: Meta<typeof Slider> = {
  title: 'Primitives/Slider',
  component: Slider,
  tags: ['autodocs'],
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
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    invalid: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

// ── Stories ───────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    'aria-label': 'Ses seviyesi',
    min: 0,
    max: 100,
    value: 50,
    size: 'md',
    color: 'accent',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '300px' }}>
      <Slider size="sm" value={30} aria-label="Küçük" />
      <Slider size="md" value={50} aria-label="Orta" />
      <Slider size="lg" value={70} aria-label="Büyük" />
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '300px' }}>
      <Slider color="accent" value={60} aria-label="Accent" />
      <Slider color="neutral" value={60} aria-label="Neutral" />
      <Slider color="destructive" value={60} aria-label="Destructive" />
      <Slider color="success" value={60} aria-label="Success" />
      <Slider color="warning" value={60} aria-label="Warning" />
    </div>
  ),
};

export const Steps: Story = {
  name: 'Adımlı / With Steps',
  render: () => {
    const [value, setValue] = useState(50);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '300px' }}>
        <Slider
          min={0}
          max={100}
          step={10}
          value={value}
          onValueChange={setValue}
          aria-label="Adımlı slider"
        />
        <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
          Değer: {value} (step: 10)
        </div>
      </div>
    );
  },
};

export const Vertical: Story = {
  name: 'Dikey / Vertical',
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', padding: '1rem' }}>
      <Slider orientation="vertical" value={30} size="sm" aria-label="SM vertical" />
      <Slider orientation="vertical" value={50} size="md" aria-label="MD vertical" />
      <Slider orientation="vertical" value={70} size="lg" aria-label="LG vertical" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ maxWidth: '300px' }}>
      <Slider disabled value={40} aria-label="Disabled slider" />
    </div>
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <div style={{ maxWidth: '300px' }}>
      <Slider readOnly value={65} aria-label="ReadOnly slider" />
    </div>
  ),
};

export const Invalid: Story = {
  render: () => (
    <div style={{ maxWidth: '300px' }}>
      <Slider invalid value={90} aria-label="Invalid slider" />
    </div>
  ),
};

export const Controlled: Story = {
  name: 'Kontrollü / Controlled',
  render: () => {
    const [volume, setVolume] = useState(50);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '300px' }}>
        <Slider
          min={0}
          max={100}
          value={volume}
          onValueChange={setVolume}
          aria-label="Ses seviyesi"
          color="success"
        />
        <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
          Ses: %{volume}
        </div>
      </div>
    );
  },
};

export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '300px' }}>
      <Slider
        aria-label="Track ozellestirme"
        value={50}
        classNames={{ track: 'my-track' }}
        styles={{
          track: { backgroundColor: '#e0e0e0', borderRadius: '8px' },
          fill: { backgroundColor: 'tomato' },
          thumb: { border: '2px solid tomato' },
        }}
      />
      <Slider
        aria-label="Root ozellestirme"
        value={70}
        className="legacy"
        classNames={{ root: 'slot-root' }}
        styles={{
          root: { padding: '8px' },
          thumb: { boxShadow: '0 0 8px rgba(0,0,0,0.3)' },
        }}
      />
    </div>
  ),
};

// ── Compound API ────────────────────────────────────────────────────

export const Compound: Story = {
  render: () => {
    const [val, setVal] = useState(50);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '300px' }}>
        <Slider
          min={0}
          max={100}
          value={val}
          onValueChange={setVal}
          aria-label="Compound slider"
        >
          <Slider.Track />
          <Slider.Thumb aria-label="Ses" />
          <Slider.Label>{val}</Slider.Label>
        </Slider>
      </div>
    );
  },
};

// ── Compound + CustomSlotStyles ─────────────────────────────────────

export const CompoundCustomSlotStyles: Story = {
  render: () => (
    <div style={{ maxWidth: '300px' }}>
      <Slider
        value={60}
        aria-label="Ozel stilli slider"
        styles={{
          track: { backgroundColor: '#e0e0e0', borderRadius: '8px' },
          fill: { backgroundColor: 'tomato' },
          thumb: { border: '2px solid tomato' },
        }}
      >
        <Slider.Track />
        <Slider.Thumb aria-label="Ses" />
      </Slider>
    </div>
  ),
};

export const CustomRange: Story = {
  name: 'Özel Aralık / Custom Range',
  render: () => {
    const [temp, setTemp] = useState(22);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '300px' }}>
        <Slider
          min={-10}
          max={40}
          step={0.5}
          value={temp}
          onValueChange={setTemp}
          aria-label="Sıcaklık"
          aria-valuetext={`${temp}°C`}
          color="warning"
        />
        <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
          Sıcaklık: {temp}°C
        </div>
      </div>
    );
  },
};

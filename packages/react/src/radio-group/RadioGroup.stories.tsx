/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup } from './RadioGroup';
import { Radio } from '../radio';

// ── Meta ──────────────────────────────────────────────────────────────

const meta: Meta<typeof RadioGroup> = {
  title: 'Primitives/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'Yon / Orientation',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Boyut / Size',
    },
    color: {
      control: 'select',
      options: ['accent', 'neutral', 'destructive', 'success', 'warning'],
      description: 'Renk / Color',
    },
    disabled: {
      control: 'boolean',
      description: 'Pasif durum / Disabled state',
    },
    readOnly: {
      control: 'boolean',
      description: 'Salt okunur / Read-only',
    },
    invalid: {
      control: 'boolean',
      description: 'Gecersiz / Invalid',
    },
    required: {
      control: 'boolean',
      description: 'Zorunlu / Required',
    },
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

// ── Stories ───────────────────────────────────────────────────────────

/** Varsayilan / Default */
export const Default: Story = {
  render: () => {
    const Comp = () => {
      const [value, setValue] = useState('pro');
      return (
        <RadioGroup value={value} onValueChange={setValue} aria-label="Plan">
          <Radio value="free">Ucretsiz</Radio>
          <Radio value="pro">Pro</Radio>
          <Radio value="enterprise">Enterprise</Radio>
        </RadioGroup>
      );
    };
    return <Comp />;
  },
};

/** Tum boyutlar / All Sizes */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size}>
          <p style={{ fontSize: 12, marginBottom: 8, color: 'var(--rel-color-text-muted, #64748b)' }}>size={size}</p>
          <RadioGroup size={size} aria-label={`Boyut ${size}`}>
            <Radio value="a">Secenek A</Radio>
            <Radio value="b">Secenek B</Radio>
          </RadioGroup>
        </div>
      ))}
    </div>
  ),
};

/** Tum renkler / All Variants (Colors) */
export const Variants: Story = {
  name: 'Renkler / Colors',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {(['accent', 'neutral', 'destructive', 'success', 'warning'] as const).map((color) => (
        <div key={color}>
          <p style={{ fontSize: 12, marginBottom: 8, color: 'var(--rel-color-text-muted, #64748b)' }}>color={color}</p>
          <RadioGroup color={color} aria-label={`Renk ${color}`} orientation="horizontal">
            <Radio value="evet">Evet</Radio>
            <Radio value="hayir">Hayir</Radio>
          </RadioGroup>
        </div>
      ))}
    </div>
  ),
};

/** Compound API */
export const Compound: Story = {
  render: () => {
    const Comp = () => {
      const [value, setValue] = useState('');
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <RadioGroup value={value} onValueChange={setValue} aria-label="Plan" size="md" color="accent">
            <Radio value="free">
              <Radio.Indicator />
              <Radio.Label>Ucretsiz Plan</Radio.Label>
            </Radio>
            <Radio value="pro">
              <Radio.Indicator />
              <Radio.Label>Pro Plan</Radio.Label>
            </Radio>
            <Radio value="enterprise">
              <Radio.Indicator />
              <Radio.Label>Enterprise Plan</Radio.Label>
            </Radio>
          </RadioGroup>
          <p style={{ fontSize: 12, color: 'var(--rel-color-text-muted, #64748b)' }}>Secili: {value || '(yok)'}</p>
        </div>
      );
    };
    return <Comp />;
  },
};

/** Slot Customization */
export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  render: () => {
    const Comp = () => {
      const [value, setValue] = useState('a');
      return (
        <RadioGroup
          value={value}
          onValueChange={setValue}
          aria-label="Custom"
          classNames={{ root: 'custom-radio-group' }}
          styles={{ root: { border: '2px dashed var(--rel-color-info, #6366f1)', borderRadius: 12, padding: 16 } }}
        >
          <Radio value="a">Secenek A</Radio>
          <Radio value="b">Secenek B</Radio>
          <Radio value="c">Secenek C</Radio>
        </RadioGroup>
      );
    };
    return <Comp />;
  },
};

/** Playground — interaktif kontroller */
export const Playground: Story = {
  args: {
    orientation: 'vertical',
    size: 'md',
    color: 'accent',
    disabled: false,
    readOnly: false,
    invalid: false,
    required: false,
  },
  render: (args) => {
    const Comp = () => {
      const [value, setValue] = useState('a');
      return (
        <RadioGroup {...args} value={value} onValueChange={setValue} aria-label="Playground">
          <Radio value="a">Secenek A</Radio>
          <Radio value="b">Secenek B</Radio>
          <Radio value="c">Secenek C</Radio>
        </RadioGroup>
      );
    };
    return <Comp />;
  },
};

/** Horizontal */
export const Horizontal: Story = {
  render: () => {
    const Comp = () => {
      const [value, setValue] = useState('evet');
      return (
        <RadioGroup
          orientation="horizontal"
          value={value}
          onValueChange={setValue}
          aria-label="Onay"
        >
          <Radio value="evet">Evet</Radio>
          <Radio value="hayir">Hayir</Radio>
          <Radio value="belki">Belki</Radio>
        </RadioGroup>
      );
    };
    return <Comp />;
  },
};

/** Disabled */
export const Disabled: Story = {
  render: () => (
    <RadioGroup disabled aria-label="Disabled" value="a">
      <Radio value="a">Secenek A (secili)</Radio>
      <Radio value="b">Secenek B</Radio>
    </RadioGroup>
  ),
};

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from './Radio';
import { RadioGroup } from '../radio-group/RadioGroup';

// ── Meta ──────────────────────────────────────────────────────────────

const meta: Meta<typeof Radio> = {
  title: 'Primitives/Radio',
  component: Radio,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    color: {
      control: 'select',
      options: ['accent', 'neutral', 'destructive', 'success', 'warning'],
    },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    invalid: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

// ── Stories ───────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('a');

    return (
      <RadioGroup value={value} onValueChange={setValue} name="default">
        <Radio value="a">Seçenek A</Radio>
        <Radio value="b">Seçenek B</Radio>
        <Radio value="c">Seçenek C</Radio>
      </RadioGroup>
    );
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <RadioGroup size="sm" name="size-sm">
        <Radio value="a">Küçük (SM) — A</Radio>
        <Radio value="b">Küçük (SM) — B</Radio>
      </RadioGroup>
      <RadioGroup size="md" name="size-md">
        <Radio value="a">Orta (MD) — A</Radio>
        <Radio value="b">Orta (MD) — B</Radio>
      </RadioGroup>
      <RadioGroup size="lg" name="size-lg">
        <Radio value="a">Büyük (LG) — A</Radio>
        <Radio value="b">Büyük (LG) — B</Radio>
      </RadioGroup>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <RadioGroup color="accent" value="a" name="color-accent">
        <Radio value="a">Accent</Radio>
      </RadioGroup>
      <RadioGroup color="neutral" value="a" name="color-neutral">
        <Radio value="a">Neutral</Radio>
      </RadioGroup>
      <RadioGroup color="destructive" value="a" name="color-destructive">
        <Radio value="a">Destructive</Radio>
      </RadioGroup>
      <RadioGroup color="success" value="a" name="color-success">
        <Radio value="a">Success</Radio>
      </RadioGroup>
      <RadioGroup color="warning" value="a" name="color-warning">
        <Radio value="a">Warning</Radio>
      </RadioGroup>
    </div>
  ),
};

export const Horizontal: Story = {
  name: 'Yatay / Horizontal',
  render: () => {
    const [value, setValue] = useState('yes');

    return (
      <RadioGroup
        orientation="horizontal"
        value={value}
        onValueChange={setValue}
        name="horizontal"
      >
        <Radio value="yes">Evet</Radio>
        <Radio value="no">Hayır</Radio>
        <Radio value="maybe">Belki</Radio>
      </RadioGroup>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup disabled value="a" name="disabled">
      <Radio value="a">Disabled seçili</Radio>
      <Radio value="b">Disabled seçilmemiş</Radio>
    </RadioGroup>
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <RadioGroup readOnly value="b" name="readonly">
      <Radio value="a">ReadOnly — A</Radio>
      <Radio value="b">ReadOnly — B (seçili)</Radio>
    </RadioGroup>
  ),
};

export const Invalid: Story = {
  render: () => (
    <RadioGroup invalid name="invalid">
      <Radio value="a">Geçersiz — bir seçim yapmalısınız</Radio>
      <Radio value="b">Seçenek B</Radio>
    </RadioGroup>
  ),
};

export const Controlled: Story = {
  name: 'Kontrollü / Controlled',
  render: () => {
    const [value, setValue] = useState('free');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <RadioGroup value={value} onValueChange={setValue} name="plan">
          <Radio value="free">Ücretsiz Plan</Radio>
          <Radio value="pro">Pro Plan</Radio>
          <Radio value="enterprise">Enterprise Plan</Radio>
        </RadioGroup>
        <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
          Seçili plan: {value}
        </div>
      </div>
    );
  },
};

export const WithoutLabel: Story = {
  name: 'Label\'sız / Without Label',
  render: () => {
    const [value, setValue] = useState('a');

    return (
      <RadioGroup
        orientation="horizontal"
        value={value}
        onValueChange={setValue}
        name="no-label"
      >
        <Radio value="a" aria-label="Seçenek A" />
        <Radio value="b" aria-label="Seçenek B" />
        <Radio value="c" aria-label="Seçenek C" />
      </RadioGroup>
    );
  },
};

export const FormExample: Story = {
  name: 'Form Örneği / Form Example',
  render: () => {
    const [plan, setPlan] = useState('pro');
    const [billing, setBilling] = useState('monthly');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '320px' }}>
        <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
          <legend style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Plan Seçimi</legend>
          <RadioGroup value={plan} onValueChange={setPlan} name="plan" color="accent">
            <Radio value="free">Ücretsiz</Radio>
            <Radio value="pro">Pro — $9/ay</Radio>
            <Radio value="enterprise">Enterprise — $49/ay</Radio>
          </RadioGroup>
        </fieldset>

        <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
          <legend style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Faturalandırma</legend>
          <RadioGroup
            orientation="horizontal"
            value={billing}
            onValueChange={setBilling}
            name="billing"
            color="success"
          >
            <Radio value="monthly">Aylık</Radio>
            <Radio value="yearly">Yıllık</Radio>
          </RadioGroup>
        </fieldset>
      </div>
    );
  },
};

export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  render: () => {
    const [value, setValue] = useState('a');

    return (
      <RadioGroup value={value} onValueChange={setValue} name="slot-custom">
        <Radio
          value="a"
          classNames={{ control: 'my-control' }}
          styles={{
            root: { padding: '4px 8px', borderRadius: '4px', background: 'rgba(0,0,0,0.03)' },
            control: { boxShadow: '0 0 0 2px currentColor' },
            label: { fontWeight: 600 },
          }}
        >
          Custom control + label
        </Radio>
        <Radio
          value="b"
          className="legacy-class"
          classNames={{ root: 'slot-cls' }}
          styles={{ root: { padding: '4px 8px' } }}
        >
          className + classNames merge
        </Radio>
        <Radio
          value="c"
          styles={{ control: { borderWidth: '2px' }, label: { letterSpacing: '0.05em' } }}
        >
          Inline styles only
        </Radio>
      </RadioGroup>
    );
  },
};

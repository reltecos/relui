/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * NumberInput Storybook stories.
 * NumberInput Storybook hikayeleri.
 *
 * @packageDocumentation
 */

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NumberInput } from './NumberInput';

const meta: Meta<typeof NumberInput> = {
  title: 'Components/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
  args: {
    placeholder: '0',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['outline', 'filled', 'flushed'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    invalid: { control: 'boolean' },
    required: { control: 'boolean' },
    hideStepper: { control: 'boolean' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    precision: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof NumberInput>;

// ── Default ─────────────────────────────────────────────────────────

export const Default: Story = {};

// ── Variants ────────────────────────────────────────────────────────

export const Outline: Story = { args: { variant: 'outline' } };
export const Filled: Story = { args: { variant: 'filled' } };
export const Flushed: Story = { args: { variant: 'flushed' } };

// ── Sizes ───────────────────────────────────────────────────────────

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
        <NumberInput key={s} size={s} placeholder={s} value={42} />
      ))}
    </div>
  ),
};

// ── All Variants ────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px' }}>
      {(['outline', 'filled', 'flushed'] as const).map((v) => (
        <NumberInput key={v} variant={v} placeholder={v} value={10} />
      ))}
    </div>
  ),
};

// ── Min / Max / Step ────────────────────────────────────────────────

export const MinMaxStep: Story = {
  args: {
    min: 0,
    max: 100,
    step: 5,
    value: 50,
    placeholder: '0-100 (step 5)',
  },
};

// ── Decimal Precision ───────────────────────────────────────────────

export const DecimalPrecision: Story = {
  args: {
    step: 0.01,
    precision: 2,
    value: 3.14,
    placeholder: '0.00',
  },
};

// ── Disabled ────────────────────────────────────────────────────────

export const Disabled: Story = {
  args: { disabled: true, value: 42 },
};

// ── ReadOnly ────────────────────────────────────────────────────────

export const ReadOnly: Story = {
  args: { readOnly: true, value: 42 },
};

// ── Invalid ─────────────────────────────────────────────────────────

export const Invalid: Story = {
  args: { invalid: true, value: -5, min: 0 },
};

// ── Hide Stepper ────────────────────────────────────────────────────

export const HiddenStepper: Story = {
  args: { hideStepper: true, value: 42 },
};

// ── Controlled ──────────────────────────────────────────────────────

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<number | null>(10);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px' }}>
        <NumberInput
          value={value}
          onValueChange={setValue}
          min={0}
          max={100}
          step={1}
        />
        <p style={{ fontFamily: 'sans-serif', fontSize: '14px' }}>
          Değer: {value !== null ? value : '(boş)'}
        </p>
      </div>
    );
  },
};

// ── Playground ──────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    variant: 'outline',
    size: 'md',
    min: 0,
    max: 100,
    step: 1,
    precision: 0,
    disabled: false,
    readOnly: false,
    invalid: false,
    required: false,
    hideStepper: false,
    placeholder: 'Sayı girin...',
  },
};

// ── Compound API ───────────────────────────────────────────────────

export const Compound: Story = {
  name: 'Compound API',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px' }}>
      <NumberInput aria-label="Sayi" value={42} min={0} max={100}>
        <NumberInput.Field placeholder="Sayi girin" />
        <NumberInput.IncrementButton />
        <NumberInput.DecrementButton />
      </NumberInput>
    </div>
  ),
};

// ── Custom Slot Styles ──────────────────────────────────────────────

export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px' }}>
      <NumberInput
        aria-label="Custom root"
        value={42}
        classNames={{ root: 'my-number-input' }}
        styles={{ root: { borderColor: 'var(--rel-color-warning, #f59e0b)' } }}
      />
      <NumberInput
        aria-label="Custom input"
        value={42}
        classNames={{ input: 'my-input' }}
        styles={{ input: { color: 'var(--rel-color-primary, #3b82f6)', fontWeight: 'bold' } }}
      />
      <NumberInput
        aria-label="Custom stepper"
        value={42}
        styles={{
          incrementButton: { color: 'var(--rel-color-success, #22c55e)' },
          decrementButton: { color: 'var(--rel-color-error, #ef4444)' },
        }}
      />
      <NumberInput
        aria-label="Legacy + slot merge"
        value={42}
        className="legacy-class"
        classNames={{ root: 'slot-class' }}
        style={{ margin: '4px' }}
        styles={{ root: { borderWidth: '2px' } }}
      />
    </div>
  ),
};

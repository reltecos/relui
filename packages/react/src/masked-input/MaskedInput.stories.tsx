/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MaskedInput } from './MaskedInput';
import { MASK_PRESETS } from '@relteco/relui-core';

// ── Meta ─────────────────────────────────────────────────────────────

const meta = {
  title: 'Primitives/MaskedInput',
  component: MaskedInput,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['outline', 'filled', 'flushed'],
      description: 'Gorsel varyant / Visual variant',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Boyut / Size',
    },
    mask: {
      control: 'text',
      description: 'Mask pattern',
    },
    maskChar: {
      control: 'text',
      description: 'Bos slot karakteri / Empty slot character',
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
      description: 'Gecersiz durum / Invalid state',
    },
  },
  args: {
    variant: 'outline',
    size: 'md',
    mask: '(###) ### ## ##',
    maskChar: '_',
  },
} satisfies Meta<typeof MaskedInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Stories ──────────────────────────────────────────────────────────

/** Varsayilan / Default */
export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: 300 }}>
      <MaskedInput {...args} aria-label="Telefon" />
    </div>
  ),
};

/** Turk Telefonu / Turkish Phone */
export const TurkishPhone: Story = {
  name: 'Turk Telefonu / Turkish Phone',
  render: () => (
    <div style={{ maxWidth: 300 }}>
      <MaskedInput
        mask={MASK_PRESETS.phoneTR}
        value="5321234567"
        aria-label="Telefon"
      />
    </div>
  ),
};

/** Kredi Karti / Credit Card */
export const CreditCard: Story = {
  name: 'Kredi Karti / Credit Card',
  render: () => (
    <div style={{ maxWidth: 350 }}>
      <MaskedInput
        mask={MASK_PRESETS.creditCard}
        value="4111111111111111"
        aria-label="Kart Numarasi"
      />
    </div>
  ),
};

/** Tarih / Date */
export const DateMask: Story = {
  name: 'Tarih / Date',
  render: () => (
    <div style={{ maxWidth: 200 }}>
      <MaskedInput mask={MASK_PRESETS.date} aria-label="Tarih" />
    </div>
  ),
};

/** Saat / Time */
export const TimeMask: Story = {
  name: 'Saat / Time',
  render: () => (
    <div style={{ maxWidth: 150 }}>
      <MaskedInput mask={MASK_PRESETS.time} aria-label="Saat" />
    </div>
  ),
};

/** IPv4 */
export const IPv4: Story = {
  name: 'IPv4',
  render: () => (
    <div style={{ maxWidth: 250 }}>
      <MaskedInput
        mask={MASK_PRESETS.ipv4}
        value="192168001001"
        aria-label="IP Adresi"
      />
    </div>
  ),
};

/** TC Kimlik No */
export const TCKimlik: Story = {
  name: 'TC Kimlik No',
  render: () => (
    <div style={{ maxWidth: 250 }}>
      <MaskedInput mask={MASK_PRESETS.tcKimlik} aria-label="TC Kimlik No" />
    </div>
  ),
};

/** IBAN (TR) */
export const IBAN: Story = {
  name: 'IBAN (TR)',
  render: () => (
    <div style={{ maxWidth: 450 }}>
      <MaskedInput mask={MASK_PRESETS.ibanTR} aria-label="IBAN" />
    </div>
  ),
};

/** Tum boyutlar / All sizes */
export const AllSizes: Story = {
  name: 'Tum Boyutlar / All Sizes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 400 }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <MaskedInput
          key={size}
          size={size}
          mask="(###) ### ## ##"
          value="5321234567"
          aria-label={`Telefon ${size}`}
        />
      ))}
    </div>
  ),
};

/** Tum varyantlar / All variants */
export const AllVariants: Story = {
  name: 'Tum Varyantlar / All Variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 400 }}>
      {(['outline', 'filled', 'flushed'] as const).map((variant) => (
        <MaskedInput
          key={variant}
          variant={variant}
          mask="(###) ### ## ##"
          value="5321234567"
          aria-label={`Telefon ${variant}`}
        />
      ))}
    </div>
  ),
};

/** Pasif / Disabled */
export const Disabled: Story = {
  name: 'Pasif / Disabled',
  render: () => (
    <div style={{ maxWidth: 300 }}>
      <MaskedInput mask="(###) ### ## ##" value="5321234567" disabled aria-label="Telefon" />
    </div>
  ),
};

/** Salt okunur / ReadOnly */
export const ReadOnly: Story = {
  name: 'Salt Okunur / ReadOnly',
  render: () => (
    <div style={{ maxWidth: 300 }}>
      <MaskedInput mask="(###) ### ## ##" value="5321234567" readOnly aria-label="Telefon" />
    </div>
  ),
};

/** Gecersiz / Invalid */
export const Invalid: Story = {
  name: 'Gecersiz / Invalid',
  render: () => (
    <div style={{ maxWidth: 300 }}>
      <MaskedInput mask="(###) ### ## ##" invalid aria-label="Telefon" />
    </div>
  ),
};

/** Kontrollu / Controlled */
export const Controlled: Story = {
  name: 'Kontrollu / Controlled',
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 400 }}>
        <MaskedInput
          mask="(###) ### ## ##"
          value={value}
          onValueChange={setValue}
          aria-label="Telefon"
        />
        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Ham deger: {value || '(bos)'}
        </div>
      </div>
    );
  },
};

/** Custom mask / Custom mask */
export const CustomMask: Story = {
  name: 'Custom Mask',
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 400 }}>
        <MaskedInput
          mask="AA-####-**"
          value={value}
          onValueChange={setValue}
          aria-label="Kod"
          placeholder="AA-0000-xx"
        />
        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Ham deger: {value || '(bos)'} | Mask: AA-####-**
        </div>
      </div>
    );
  },
};

/** Playground — interaktif kontroller / Interactive controls */
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div style={{ maxWidth: 300 }}>
      <MaskedInput {...args} aria-label="Telefon" />
    </div>
  ),
};

/** Slot Customization */
export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 400 }}>
      <MaskedInput
        mask="(###) ### ## ##"
        aria-label="Custom"
        classNames={{ root: 'my-masked-input' }}
        styles={{ root: { borderColor: 'orange', fontStyle: 'italic' } }}
      />
      <MaskedInput
        mask="(###) ### ## ##"
        aria-label="Merged"
        className="legacy-class"
        classNames={{ root: 'slot-class' }}
        style={{ margin: '4px' }}
        styles={{ root: { borderWidth: '2px' } }}
      />
    </div>
  ),
};

/** Compound API */
export const Compound: Story = {
  name: 'Compound API',
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 400 }}>
        <MaskedInput mask="(###) ### ## ##" value={value} onValueChange={setValue}>
          <MaskedInput.Field />
        </MaskedInput>
        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Ham deger: {value || '(bos)'}
        </div>
      </div>
    );
  },
};

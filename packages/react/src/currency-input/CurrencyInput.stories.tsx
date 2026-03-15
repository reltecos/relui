/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CurrencyInput } from './CurrencyInput';

// ── Meta ─────────────────────────────────────────────────────────────

const meta = {
  title: 'Primitives/CurrencyInput',
  component: CurrencyInput,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['outline', 'filled', 'flushed'],
      description: 'Görsel varyant / Visual variant',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Boyut / Size',
    },
    locale: {
      control: 'text',
      description: 'Locale kodu / Locale code',
    },
    currency: {
      control: 'text',
      description: 'Para birimi kodu / Currency code (ISO 4217)',
    },
    precision: {
      control: { type: 'number', min: 0, max: 6 },
      description: 'Ondalık basamak / Decimal precision',
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
      description: 'Geçersiz durum / Invalid state',
    },
  },
  args: {
    variant: 'outline',
    size: 'md',
    locale: 'tr-TR',
    currency: 'TRY',
    precision: 2,
  },
} satisfies Meta<typeof CurrencyInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Stories ──────────────────────────────────────────────────────────

/** Varsayılan / Default */
export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: 300 }}>
      <CurrencyInput {...args} aria-label="Fiyat" />
    </div>
  ),
};

/** Türk Lirası / Turkish Lira */
export const TurkishLira: Story = {
  name: 'Türk Lirası / Turkish Lira',
  render: () => (
    <div style={{ maxWidth: 300 }}>
      <CurrencyInput value={12500.75} locale="tr-TR" currency="TRY" aria-label="Tutar" />
    </div>
  ),
};

/** ABD Doları / US Dollar */
export const USDollar: Story = {
  name: 'ABD Doları / US Dollar',
  render: () => (
    <div style={{ maxWidth: 300 }}>
      <CurrencyInput value={9999.99} locale="en-US" currency="USD" aria-label="Amount" />
    </div>
  ),
};

/** Euro */
export const Euro: Story = {
  name: 'Euro',
  render: () => (
    <div style={{ maxWidth: 300 }}>
      <CurrencyInput value={5432.10} locale="de-DE" currency="EUR" aria-label="Betrag" />
    </div>
  ),
};

/** Tüm boyutlar / All sizes */
export const AllSizes: Story = {
  name: 'Tüm Boyutlar / All Sizes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 400 }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <CurrencyInput key={size} size={size} value={1234.56} aria-label={`Fiyat ${size}`} />
      ))}
    </div>
  ),
};

/** Tüm varyantlar / All variants */
export const AllVariants: Story = {
  name: 'Tüm Varyantlar / All Variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 400 }}>
      {(['outline', 'filled', 'flushed'] as const).map((variant) => (
        <CurrencyInput
          key={variant}
          variant={variant}
          value={1234.56}
          aria-label={`Fiyat ${variant}`}
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
      <CurrencyInput value={500} disabled aria-label="Fiyat" />
    </div>
  ),
};

/** Salt okunur / ReadOnly */
export const ReadOnly: Story = {
  name: 'Salt Okunur / ReadOnly',
  render: () => (
    <div style={{ maxWidth: 300 }}>
      <CurrencyInput value={7890.50} readOnly aria-label="Fiyat" />
    </div>
  ),
};

/** Geçersiz / Invalid */
export const Invalid: Story = {
  name: 'Geçersiz / Invalid',
  render: () => (
    <div style={{ maxWidth: 300 }}>
      <CurrencyInput value={-50} invalid allowNegative aria-label="Fiyat" />
    </div>
  ),
};

/** Min/Max sınırı / Min/Max bounds */
export const MinMax: Story = {
  name: 'Min/Max Sınırı / Min/Max Bounds',
  render: () => {
    const [value, setValue] = useState<number | null>(50);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 400 }}>
        <CurrencyInput
          value={value}
          onValueChange={setValue}
          min={0}
          max={1000}
          aria-label="Fiyat"
        />
        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Değer: {value ?? '(boş)'} | Min: 0 | Max: 1.000
        </div>
      </div>
    );
  },
};

/** Sembolsüz / Without symbol */
export const NoSymbol: Story = {
  name: 'Sembolsüz / Without Symbol',
  render: () => (
    <div style={{ maxWidth: 300 }}>
      <CurrencyInput value={1234.56} currencyDisplay="none" aria-label="Fiyat" />
    </div>
  ),
};

/** Kontrollü / Controlled */
export const Controlled: Story = {
  name: 'Kontrollü / Controlled',
  render: () => {
    const [value, setValue] = useState<number | null>(null);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 400 }}>
        <CurrencyInput
          value={value}
          onValueChange={setValue}
          aria-label="Fiyat"
          placeholder="0,00"
        />
        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Ham değer: {value !== null ? value : '(null)'}
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
      <CurrencyInput {...args} aria-label="Fiyat" />
    </div>
  ),
};

/** Compound API */
export const Compound: Story = {
  name: 'Compound API',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 400 }}>
      <CurrencyInput aria-label="Compound TRY" value={1234.56} locale="tr-TR" currency="TRY">
        <CurrencyInput.Symbol />
      </CurrencyInput>
      <CurrencyInput aria-label="Compound USD" value={9999.99} locale="en-US" currency="USD">
        <CurrencyInput.Symbol />
      </CurrencyInput>
      <CurrencyInput aria-label="Custom sembol" value={500}>
        <CurrencyInput.Symbol>TL</CurrencyInput.Symbol>
      </CurrencyInput>
    </div>
  ),
};

/** Slot Customization */
export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 400 }}>
      <CurrencyInput
        aria-label="Custom root"
        value={1234.56}
        classNames={{ root: 'my-currency-root' }}
        styles={{ root: { border: '2px dashed orange' } }}
      />
      <CurrencyInput
        aria-label="Custom input"
        value={1234.56}
        classNames={{ input: 'my-currency-input' }}
        styles={{ input: { fontWeight: 'bold', color: 'blue' } }}
      />
      <CurrencyInput
        aria-label="Custom prefix"
        value={9999.99}
        locale="en-US"
        currency="USD"
        classNames={{ adornPrefix: 'my-prefix' }}
        styles={{ adornPrefix: { color: 'green', fontWeight: 'bold' } }}
      />
      <CurrencyInput
        aria-label="Legacy + slot merge"
        value={500}
        className="legacy-class"
        classNames={{ input: 'slot-class' }}
        style={{ margin: '4px' }}
        styles={{ root: { borderWidth: '2px' } }}
      />
    </div>
  ),
};

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

// ── Test Verileri ───────────────────────────────────────────────────

const countries = [
  { value: 'tr', label: 'Türkiye' },
  { value: 'us', label: 'ABD' },
  { value: 'de', label: 'Almanya' },
  { value: 'fr', label: 'Fransa' },
  { value: 'jp', label: 'Japonya' },
  { value: 'gb', label: 'Birleşik Krallık' },
];

const groupedCountries = [
  {
    label: 'Avrupa',
    options: [
      { value: 'tr', label: 'Türkiye' },
      { value: 'de', label: 'Almanya' },
      { value: 'fr', label: 'Fransa' },
      { value: 'gb', label: 'Birleşik Krallık' },
    ],
  },
  {
    label: 'Amerika',
    options: [
      { value: 'us', label: 'ABD' },
      { value: 'ca', label: 'Kanada' },
      { value: 'br', label: 'Brezilya' },
    ],
  },
  {
    label: 'Asya',
    options: [
      { value: 'jp', label: 'Japonya' },
      { value: 'kr', label: 'Güney Kore' },
      { value: 'cn', label: 'Çin' },
    ],
  },
];

const withDisabled = [
  { value: 'a', label: 'Aktif seçenek' },
  { value: 'b', label: 'Pasif seçenek', disabled: true },
  { value: 'c', label: 'Başka aktif seçenek' },
];

// ── Meta ─────────────────────────────────────────────────────────────

const meta = {
  title: 'Primitives/Select',
  component: Select,
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
    options: countries,
    placeholder: 'Ülke seçin',
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Stories ──────────────────────────────────────────────────────────

/** Varsayilan / Default */
export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: 300 }}>
      <Select {...args} aria-label="Ulke" />
    </div>
  ),
};

/** Secili deger / With value */
export const WithValue: Story = {
  name: 'Secili Deger / With Value',
  render: () => (
    <div style={{ maxWidth: 300 }}>
      <Select
        options={countries}
        value="tr"
        placeholder="Ulke secin"
        aria-label="Ulke"
      />
    </div>
  ),
};

/** Gruplu secenekler / Grouped options */
export const Grouped: Story = {
  name: 'Gruplu / Grouped',
  render: () => (
    <div style={{ maxWidth: 300 }}>
      <Select
        options={groupedCountries}
        placeholder="Ulke secin"
        aria-label="Ulke"
      />
    </div>
  ),
};

/** Pasif secenek / Disabled option */
export const DisabledOption: Story = {
  name: 'Pasif Secenek / Disabled Option',
  render: () => (
    <div style={{ maxWidth: 300 }}>
      <Select
        options={withDisabled}
        placeholder="Secenek secin"
        aria-label="Secenek"
      />
    </div>
  ),
};

/** Tum boyutlar / All sizes */
export const AllSizes: Story = {
  name: 'Tum Boyutlar / All Sizes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 300 }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Select
          key={size}
          size={size}
          options={countries}
          value="tr"
          aria-label={`Ulke ${size}`}
        />
      ))}
    </div>
  ),
};

/** Tum varyantlar / All variants */
export const AllVariants: Story = {
  name: 'Tum Varyantlar / All Variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 300 }}>
      {(['outline', 'filled', 'flushed'] as const).map((variant) => (
        <Select
          key={variant}
          variant={variant}
          options={countries}
          value="tr"
          aria-label={`Ulke ${variant}`}
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
      <Select
        options={countries}
        value="tr"
        disabled
        aria-label="Ulke"
      />
    </div>
  ),
};

/** Salt okunur / ReadOnly */
export const ReadOnly: Story = {
  name: 'Salt Okunur / ReadOnly',
  render: () => (
    <div style={{ maxWidth: 300 }}>
      <Select
        options={countries}
        value="tr"
        readOnly
        aria-label="Ulke"
      />
    </div>
  ),
};

/** Gecersiz / Invalid */
export const Invalid: Story = {
  name: 'Gecersiz / Invalid',
  render: () => (
    <div style={{ maxWidth: 300 }}>
      <Select
        options={countries}
        invalid
        placeholder="Ulke secin"
        aria-label="Ulke"
      />
    </div>
  ),
};

/** Kontrollu / Controlled */
export const Controlled: Story = {
  name: 'Kontrollu / Controlled',
  render: () => {
    const [value, setValue] = useState<string | number | undefined>(undefined);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 300 }}>
        <Select
          options={countries}
          value={value}
          onValueChange={setValue}
          placeholder="Ulke secin"
          aria-label="Ulke"
        />
        <div style={{ fontSize: '0.875rem', color: 'var(--rel-color-text-muted, #64748b)' }}>
          Secili: {value !== undefined ? String(value) : '(bos)'}
        </div>
        <button
          type="button"
          onClick={() => setValue(undefined)}
          style={{ alignSelf: 'flex-start', fontSize: '0.75rem' }}
        >
          Temizle
        </button>
      </div>
    );
  },
};

/** Bos liste / Empty list */
export const Empty: Story = {
  name: 'Bos Liste / Empty',
  render: () => (
    <div style={{ maxWidth: 300 }}>
      <Select
        options={[]}
        placeholder="Secenek yok"
        aria-label="Bos"
      />
    </div>
  ),
};

/** Slot Customization */
export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 300 }}>
      <Select
        options={countries}
        placeholder="classNames ile customize"
        aria-label="Custom"
        classNames={{ root: 'my-select', trigger: 'my-trigger' }}
        styles={{
          root: { border: '2px solid var(--rel-color-warning, #f59e0b)' },
          trigger: { fontStyle: 'italic' },
          listbox: { maxHeight: '150px' },
          option: { padding: '8px 12px' },
        }}
      />
      <Select
        options={groupedCountries}
        placeholder="className + classNames merge"
        aria-label="Merged"
        className="legacy-class"
        classNames={{ root: 'slot-cls', trigger: 'slot-trigger' }}
        styles={{
          trigger: { fontWeight: 'bold' },
          groupLabel: { color: 'var(--rel-color-warning, #f59e0b)', fontWeight: 'bold' },
        }}
      />
    </div>
  ),
};

/** Compound API */
export const Compound: Story = {
  name: 'Compound API',
  render: () => (
    <div style={{ maxWidth: 300 }}>
      <Select options={countries} aria-label="Ulke">
        <Select.Trigger>
          <Select.Value placeholder="Ulke secin" />
        </Select.Trigger>
        <Select.Content />
      </Select>
    </div>
  ),
};

/** Playground — interaktif kontroller / Interactive controls */
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div style={{ maxWidth: 300 }}>
      <Select {...args} aria-label="Ulke" />
    </div>
  ),
};

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { SelectValue } from '@relteco/relui-core';
import { Combobox } from './Combobox';

// ── Test Verileri ───────────────────────────────────────────────────

const countries = [
  { value: 'tr', label: 'Türkiye' },
  { value: 'us', label: 'ABD' },
  { value: 'de', label: 'Almanya' },
  { value: 'fr', label: 'Fransa' },
  { value: 'jp', label: 'Japonya' },
  { value: 'gb', label: 'Birleşik Krallık' },
  { value: 'ca', label: 'Kanada' },
  { value: 'br', label: 'Brezilya' },
  { value: 'kr', label: 'Güney Kore' },
  { value: 'cn', label: 'Çin' },
];

const withDisabled = [
  { value: 'a', label: 'Aktif seçenek' },
  { value: 'b', label: 'Pasif seçenek', disabled: true },
  { value: 'c', label: 'Başka aktif seçenek' },
  { value: 'd', label: 'Dördüncü seçenek' },
];

// ── Meta ─────────────────────────────────────────────────────────────

const meta = {
  title: 'Primitives/Combobox',
  component: Combobox,
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
    placeholder: 'Ülke arayın...',
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Stories ──────────────────────────────────────────────────────────

/** Varsayilan / Default */
export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: 300 }}>
      <Combobox {...args} aria-label="Ulke" />
    </div>
  ),
};

/** Secili deger / With value */
export const WithValue: Story = {
  name: 'Secili Deger / With Value',
  render: () => (
    <div style={{ maxWidth: 300 }}>
      <Combobox
        options={countries}
        value="tr"
        placeholder="Ulke arayin"
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
      <Combobox
        options={withDisabled}
        placeholder="Secenek arayin"
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
        <Combobox
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
        <Combobox
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
      <Combobox
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
      <Combobox
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
      <Combobox
        options={countries}
        invalid
        placeholder="Ulke arayin"
        aria-label="Ulke"
      />
    </div>
  ),
};

/** Kontrollu / Controlled */
export const Controlled: Story = {
  name: 'Kontrollu / Controlled',
  render: () => {
    const [value, setValue] = useState<SelectValue | undefined>(undefined);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 300 }}>
        <Combobox
          options={countries}
          value={value}
          onValueChange={setValue}
          placeholder="Ulke arayin"
          aria-label="Ulke"
        />
        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
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

/** Serbest deger / Allow custom value */
export const AllowCustomValue: Story = {
  name: 'Serbest Deger / Allow Custom Value',
  render: () => {
    const [value, setValue] = useState<SelectValue | undefined>(undefined);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 300 }}>
        <Combobox
          options={countries}
          value={value}
          onValueChange={setValue}
          allowCustomValue
          placeholder="Yazip secebilirsiniz"
          aria-label="Ulke"
        />
        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Secili: {value !== undefined ? String(value) : '(bos)'}
        </div>
      </div>
    );
  },
};

/** Compound API */
export const Compound: Story = {
  name: 'Compound API',
  render: () => (
    <div style={{ maxWidth: 300 }}>
      <Combobox options={countries} aria-label="Ulke" placeholder="Ulke arayin">
        <Combobox.Input />
        <Combobox.Content />
      </Combobox>
    </div>
  ),
};

/** Playground — interaktif kontroller / Interactive controls */
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div style={{ maxWidth: 300 }}>
      <Combobox {...args} aria-label="Ulke" />
    </div>
  ),
};

/** Slot customization — classNames & styles API */
export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 400 }}>
      <Combobox
        options={countries}
        placeholder="classNames ile ozellestirilmis"
        aria-label="Custom"
        classNames={{ root: 'my-combobox' }}
        styles={{
          root: { border: '2px solid orange' },
          input: { fontStyle: 'italic' },
          listbox: { maxHeight: '150px' },
        }}
      />
      <Combobox
        options={countries}
        placeholder="className + classNames birlikte"
        aria-label="Merged"
        className="legacy-class"
        classNames={{ root: 'slot-class' }}
        style={{ margin: '4px' }}
        styles={{ root: { borderWidth: '2px' } }}
      />
    </div>
  ),
};

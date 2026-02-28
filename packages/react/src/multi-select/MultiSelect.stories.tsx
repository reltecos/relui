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
import { MultiSelect } from './MultiSelect';

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
  { value: 'd', label: 'Dördüncü seçenek' },
];

// ── Meta ─────────────────────────────────────────────────────────────

const meta = {
  title: 'Primitives/MultiSelect',
  component: MultiSelect,
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
    maxSelections: {
      control: 'number',
      description: 'Maksimum secim / Max selections',
    },
  },
  args: {
    variant: 'outline',
    size: 'md',
    options: countries,
    placeholder: 'Ülke seçin',
  },
} satisfies Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Stories ──────────────────────────────────────────────────────────

/** Varsayilan / Default */
export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: 350 }}>
      <MultiSelect {...args} aria-label="Ulke" />
    </div>
  ),
};

/** Secili degerler / With values */
export const WithValues: Story = {
  name: 'Secili Degerler / With Values',
  render: () => (
    <div style={{ maxWidth: 350 }}>
      <MultiSelect
        options={countries}
        value={['tr', 'us', 'de']}
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
    <div style={{ maxWidth: 350 }}>
      <MultiSelect
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
    <div style={{ maxWidth: 350 }}>
      <MultiSelect
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 350 }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <MultiSelect
          key={size}
          size={size}
          options={countries}
          value={['tr', 'us']}
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 350 }}>
      {(['outline', 'filled', 'flushed'] as const).map((variant) => (
        <MultiSelect
          key={variant}
          variant={variant}
          options={countries}
          value={['tr', 'us']}
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
    <div style={{ maxWidth: 350 }}>
      <MultiSelect
        options={countries}
        value={['tr', 'us']}
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
    <div style={{ maxWidth: 350 }}>
      <MultiSelect
        options={countries}
        value={['tr', 'us']}
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
    <div style={{ maxWidth: 350 }}>
      <MultiSelect
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
    const [values, setValues] = useState<SelectValue[]>([]);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 350 }}>
        <MultiSelect
          options={countries}
          value={values}
          onValueChange={setValues}
          placeholder="Ulke secin"
          aria-label="Ulke"
        />
        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Secili ({values.length}): {values.length > 0 ? values.map(String).join(', ') : '(bos)'}
        </div>
        <button
          type="button"
          onClick={() => setValues([])}
          style={{ alignSelf: 'flex-start', fontSize: '0.75rem' }}
        >
          Temizle
        </button>
      </div>
    );
  },
};

/** Maksimum secim / Max selections */
export const MaxSelections: Story = {
  name: 'Maksimum Secim / Max Selections',
  render: () => {
    const [values, setValues] = useState<SelectValue[]>([]);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 350 }}>
        <MultiSelect
          options={countries}
          value={values}
          onValueChange={setValues}
          maxSelections={3}
          placeholder="En fazla 3 ulke secin"
          aria-label="Ulke"
        />
        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Secili: {values.length}/3
        </div>
      </div>
    );
  },
};

/** Bos liste / Empty list */
export const Empty: Story = {
  name: 'Bos Liste / Empty',
  render: () => (
    <div style={{ maxWidth: 350 }}>
      <MultiSelect
        options={[]}
        placeholder="Secenek yok"
        aria-label="Bos"
      />
    </div>
  ),
};

/** Slot Customization — classNames & styles API */
export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 350 }}>
      <MultiSelect
        options={countries}
        value={['tr', 'us']}
        classNames={{
          root: 'my-root',
          trigger: 'my-trigger',
          tag: 'my-tag',
        }}
        styles={{
          trigger: { borderColor: 'orange', borderWidth: '2px' },
          tag: { background: '#fef3c7', borderRadius: '9999px' },
          tagRemoveButton: { color: 'red' },
        }}
        aria-label="Ulke"
      />
      <MultiSelect
        options={countries}
        placeholder="className + classNames merge"
        className="legacy-class"
        classNames={{ root: 'slot-root' }}
        styles={{
          root: { boxShadow: '0 0 0 2px orange' },
          listbox: { border: '2px solid orange' },
          option: { fontStyle: 'italic' },
        }}
        aria-label="Ulke2"
      />
    </div>
  ),
};

/** Playground — interaktif kontroller / Interactive controls */
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div style={{ maxWidth: 350 }}>
      <MultiSelect {...args} aria-label="Ulke" />
    </div>
  ),
};

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { InPlaceEditor } from './InPlaceEditor';

// ── Meta ──────────────────────────────────────────────────────────────

const meta: Meta<typeof InPlaceEditor> = {
  title: 'Editors/InPlaceEditor',
  component: InPlaceEditor,
  argTypes: {
    variant: {
      control: 'select',
      options: ['outline', 'filled', 'flushed'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    activationMode: {
      control: 'select',
      options: ['click', 'doubleClick'],
    },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    submitOnBlur: { control: 'boolean' },
    selectOnEdit: { control: 'boolean' },
    showActions: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof InPlaceEditor>;

// ── Stories ───────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    defaultValue: 'Tıklayarak düzenle',
    placeholder: 'Bir metin girin',
    variant: 'outline',
    size: 'md',
  },
};

export const WithPlaceholder: Story = {
  name: 'Placeholder',
  args: {
    placeholder: 'İsim girin...',
    variant: 'outline',
    size: 'md',
  },
};

export const DoubleClickActivation: Story = {
  name: 'Çift Tıklama / Double Click',
  args: {
    defaultValue: 'Çift tıklayarak düzenle',
    activationMode: 'doubleClick',
    showActions: true,
  },
};

export const WithoutActions: Story = {
  name: 'Aksiyonsuz / Without Actions',
  args: {
    defaultValue: 'Enter kaydet, Escape iptal',
    showActions: false,
  },
};

export const SubmitOnBlurOff: Story = {
  name: 'Blur ile kaydetme kapalı',
  args: {
    defaultValue: 'Sadece butonlar veya Enter ile kaydet',
    submitOnBlur: false,
    showActions: true,
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <InPlaceEditor defaultValue="Outline varyant" variant="outline" />
      <InPlaceEditor defaultValue="Filled varyant" variant="filled" />
      <InPlaceEditor defaultValue="Flushed varyant" variant="flushed" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <InPlaceEditor defaultValue="XS boyut" size="xs" />
      <InPlaceEditor defaultValue="SM boyut" size="sm" />
      <InPlaceEditor defaultValue="MD boyut" size="md" />
      <InPlaceEditor defaultValue="LG boyut" size="lg" />
      <InPlaceEditor defaultValue="XL boyut" size="xl" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    defaultValue: 'Düzenlenemez',
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    defaultValue: 'Salt okunur',
    readOnly: true,
  },
};

export const Controlled: Story = {
  name: 'Controlled / Kontrollü',
  render: () => {
    const [value, setValue] = useState('Kontrollü değer');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <InPlaceEditor
          value={value}
          onValueChange={setValue}
          placeholder="Bir metin girin"
        />
        <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>
          Mevcut değer: <strong>{value}</strong>
        </div>
      </div>
    );
  },
};

export const EditableList: Story = {
  name: 'Düzenlenebilir Liste / Editable List',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        maxWidth: '300px',
        border: '1px solid var(--rel-border-default)',
        borderRadius: 'var(--rel-radius-md)',
        padding: '0.5rem',
      }}
    >
      <InPlaceEditor defaultValue="Alışveriş yap" size="sm" />
      <InPlaceEditor defaultValue="Toplantıya katıl" size="sm" />
      <InPlaceEditor defaultValue="Rapor gönder" size="sm" />
      <InPlaceEditor placeholder="Yeni görev ekle..." size="sm" />
    </div>
  ),
};

// ── Slot Customization ──────────────────────────────────────────────

export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <InPlaceEditor
        defaultValue="Root styled"
        styles={{ root: { border: '2px dashed hotpink', padding: '4px' } }}
      />
      <InPlaceEditor
        defaultValue="Display styled"
        styles={{ display: { fontWeight: 'bold', letterSpacing: '1px' } }}
      />
      <InPlaceEditor
        defaultValue="Input styled (düzenle)"
        styles={{ input: { letterSpacing: '2px' } }}
      />
    </div>
  ),
};

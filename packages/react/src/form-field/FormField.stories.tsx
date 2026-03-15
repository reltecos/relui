/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FormField } from './FormField';
import { Input } from '../input';

// ── Meta ──────────────────────────────────────────────────────────────

const meta: Meta<typeof FormField> = {
  title: 'Form/FormField',
  component: FormField,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof FormField>;

// ── Stories ───────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    label: 'E-posta adresi',
    helperText: 'İş e-postanızı girin',
    size: 'md',
  },
  render: (args) => (
    <FormField {...args}>
      <Input placeholder="ornek@sirket.com" />
    </FormField>
  ),
};

export const Required: Story = {
  render: () => (
    <FormField label="Kullanıcı adı" required helperText="En az 3 karakter">
      <Input placeholder="Kullanıcı adınız" />
    </FormField>
  ),
};

export const WithError: Story = {
  name: 'Hata Mesajlı / With Error',
  render: () => (
    <FormField
      label="E-posta"
      required
      errorMessage="Geçerli bir e-posta adresi girin"
      helperText="Bu metin hata varken gizlenir"
    >
      <Input placeholder="ornek@sirket.com" />
    </FormField>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '300px' }}>
      <FormField label="Küçük" size="sm" helperText="sm boyut">
        <Input size="sm" placeholder="sm" />
      </FormField>
      <FormField label="Orta" size="md" helperText="md boyut">
        <Input size="md" placeholder="md" />
      </FormField>
      <FormField label="Büyük" size="lg" helperText="lg boyut">
        <Input size="lg" placeholder="lg" />
      </FormField>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <FormField label="Pasif alan" disabled helperText="Bu alan düzenlenemez">
      <Input placeholder="Pasif" disabled />
    </FormField>
  ),
};

export const Validation: Story = {
  name: 'Doğrulama / Validation',
  render: () => {
    const [value, setValue] = useState('');
    const error = value.length > 0 && value.length < 3 ? 'En az 3 karakter gerekli' : undefined;

    return (
      <FormField
        label="Kullanıcı adı"
        required
        helperText="En az 3 karakter girin"
        errorMessage={error}
      >
        <Input
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
          placeholder="Kullanıcı adınız"
        />
      </FormField>
    );
  },
};

export const NoLabel: Story = {
  name: 'Etiketsiz / No Label',
  render: () => (
    <FormField helperText="Etiket olmadan yardımcı metin">
      <Input placeholder="Etiketsiz alan" aria-label="Etiketsiz" />
    </FormField>
  ),
};

export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '300px' }}>
      <FormField
        label="E-posta"
        helperText="Yardimci metin"
        classNames={{ root: 'my-root' }}
        styles={{ root: { border: '2px dashed orange', padding: '0.5rem' } }}
      >
        <Input placeholder="classNames.root" />
      </FormField>
      <FormField
        label="Sifre"
        helperText="En az 8 karakter"
        styles={{ helperText: { fontStyle: 'italic', color: 'blue' } }}
      >
        <Input placeholder="styles.helperText" />
      </FormField>
      <FormField
        label="Kullanici adi"
        errorMessage="Bu alan zorunlu"
        classNames={{ errorMessage: 'my-error' }}
        styles={{ errorMessage: { fontWeight: 'bold', letterSpacing: '0.05em' } }}
      >
        <Input placeholder="styles.errorMessage" />
      </FormField>
      <FormField
        label="Legacy"
        helperText="Geriye uyumlu"
        className="legacy-class"
        classNames={{ root: 'slot-class' }}
      >
        <Input placeholder="className + classNames" />
      </FormField>
    </div>
  ),
};

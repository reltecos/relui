/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { FormGroup } from './FormGroup';
import { FormField } from '../form-field';
import { Input } from '../input';

// ── Meta ──────────────────────────────────────────────────────────────

const meta: Meta<typeof FormGroup> = {
  title: 'Form/FormGroup',
  component: FormGroup,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof FormGroup>;

// ── Stories ───────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <FormGroup legend="Kişisel Bilgiler">
      <FormField label="Ad" required>
        <Input placeholder="Adınız" />
      </FormField>
      <FormField label="Soyad" required>
        <Input placeholder="Soyadınız" />
      </FormField>
      <FormField label="E-posta" helperText="İş e-postanızı girin">
        <Input placeholder="ornek@sirket.com" />
      </FormField>
    </FormGroup>
  ),
};

export const Horizontal: Story = {
  name: 'Yatay / Horizontal',
  render: () => (
    <FormGroup legend="İletişim" orientation="horizontal">
      <FormField label="Telefon">
        <Input placeholder="0555 123 4567" />
      </FormField>
      <FormField label="Faks">
        <Input placeholder="0212 123 4567" />
      </FormField>
    </FormGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <FormGroup legend="Pasif Grup" disabled>
      <FormField label="Ad">
        <Input placeholder="Adınız" />
      </FormField>
      <FormField label="Soyad">
        <Input placeholder="Soyadınız" />
      </FormField>
    </FormGroup>
  ),
};

export const NoLegend: Story = {
  name: 'Başlıksız / No Legend',
  render: () => (
    <FormGroup>
      <FormField label="Şehir">
        <Input placeholder="Şehriniz" />
      </FormField>
      <FormField label="İlçe">
        <Input placeholder="İlçeniz" />
      </FormField>
    </FormGroup>
  ),
};

export const Nested: Story = {
  name: 'İç İçe / Nested',
  render: () => (
    <FormGroup legend="Kayıt Formu">
      <FormGroup legend="Kişisel">
        <FormField label="Ad" required>
          <Input placeholder="Adınız" />
        </FormField>
        <FormField label="Soyad" required>
          <Input placeholder="Soyadınız" />
        </FormField>
      </FormGroup>
      <FormGroup legend="İletişim" orientation="horizontal">
        <FormField label="Telefon">
          <Input placeholder="0555 123 4567" />
        </FormField>
        <FormField label="E-posta">
          <Input placeholder="ornek@sirket.com" />
        </FormField>
      </FormGroup>
    </FormGroup>
  ),
};

export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <FormGroup
        legend="Slot Root"
        classNames={{ root: 'my-fieldset' }}
        styles={{ root: { border: '2px dashed orange', padding: '1rem' } }}
      >
        <FormField label="Ad">
          <Input placeholder="classNames.root" />
        </FormField>
      </FormGroup>
      <FormGroup
        legend="Slot Legend"
        classNames={{ legend: 'my-legend' }}
        styles={{ legend: { color: 'blue', fontStyle: 'italic', letterSpacing: '0.1em' } }}
      >
        <FormField label="Soyad">
          <Input placeholder="styles.legend" />
        </FormField>
      </FormGroup>
      <FormGroup
        legend="Legacy + Slot"
        className="legacy-class"
        classNames={{ root: 'slot-class' }}
      >
        <FormField label="E-posta">
          <Input placeholder="className + classNames" />
        </FormField>
      </FormGroup>
    </div>
  ),
};

export const Compound: Story = {
  name: 'Compound API',
  render: () => (
    <FormGroup>
      <FormGroup.Legend>Kisisel Bilgiler</FormGroup.Legend>
      <FormGroup.Content>
        <FormField label="Ad" required>
          <Input placeholder="Adiniz" />
        </FormField>
        <FormField label="Soyad" required>
          <Input placeholder="Soyadiniz" />
        </FormField>
      </FormGroup.Content>
    </FormGroup>
  ),
};

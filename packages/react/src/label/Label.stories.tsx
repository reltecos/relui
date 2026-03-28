/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './Label';

// ── Meta ──────────────────────────────────────────────────────────────

const meta: Meta<typeof Label> = {
  title: 'Form/Label',
  component: Label,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

// ── Stories ───────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    children: 'E-posta adresi',
    size: 'md',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Label size="sm">Küçük etiket</Label>
      <Label size="md">Orta etiket</Label>
      <Label size="lg">Büyük etiket</Label>
    </div>
  ),
};

export const Required: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Label required>Zorunlu alan</Label>
      <Label>Opsiyonel alan</Label>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Label disabled>Pasif etiket</Label>
  ),
};

export const WithHtmlFor: Story = {
  name: 'Form Bağlantılı / With htmlFor',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Label htmlFor="demo-input" required>
        Kullanıcı adı
      </Label>
      <input id="demo-input" type="text" placeholder="Adınızı girin" />
    </div>
  ),
};

// ── Compound ──

export const Compound: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Label htmlFor="email-compound">
        <Label.Text>E-posta adresi</Label.Text>
        <Label.RequiredIndicator />
      </Label>
      <input id="email-compound" type="email" placeholder="ornek@mail.com" />
    </div>
  ),
};

export const CompoundCustomIndicator: Story = {
  name: 'Compound - Ozel Gosterge',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Label htmlFor="name-compound">
        <Label.Text>Ad Soyad</Label.Text>
        <Label.RequiredIndicator> (zorunlu)</Label.RequiredIndicator>
      </Label>
      <input id="name-compound" type="text" placeholder="Adinizi girin" />
    </div>
  ),
};

export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Label
        required
        classNames={{ root: 'my-label' }}
        styles={{ requiredIndicator: { color: 'var(--rel-color-warning, #f59e0b)', fontSize: '1.2em' } }}
      >
        Ozel stil
      </Label>
    </div>
  ),
};

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

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { CheckboxCheckedState } from '@relteco/relui-core';
import { Checkbox } from './Checkbox';

// ── Meta ──────────────────────────────────────────────────────────────

const meta: Meta<typeof Checkbox> = {
  title: 'Primitives/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    color: {
      control: 'select',
      options: ['accent', 'neutral', 'destructive', 'success', 'warning'],
    },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    invalid: { control: 'boolean' },
    required: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

// ── Stories ───────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    children: 'Şartları kabul ediyorum',
    size: 'md',
    color: 'accent',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Checkbox size="sm">Küçük (SM)</Checkbox>
      <Checkbox size="md">Orta (MD)</Checkbox>
      <Checkbox size="lg">Büyük (LG)</Checkbox>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Checkbox color="accent" checked>Accent</Checkbox>
      <Checkbox color="neutral" checked>Neutral</Checkbox>
      <Checkbox color="destructive" checked>Destructive</Checkbox>
      <Checkbox color="success" checked>Success</Checkbox>
      <Checkbox color="warning" checked>Warning</Checkbox>
    </div>
  ),
};

export const States: Story = {
  name: 'Durumlar / States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Checkbox>İşaretlenmemiş / Unchecked</Checkbox>
      <Checkbox checked>İşaretlenmiş / Checked</Checkbox>
      <Checkbox checked="indeterminate">Belirsiz / Indeterminate</Checkbox>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Checkbox disabled>Disabled unchecked</Checkbox>
      <Checkbox disabled checked>Disabled checked</Checkbox>
      <Checkbox disabled checked="indeterminate">Disabled indeterminate</Checkbox>
    </div>
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Checkbox readOnly checked>ReadOnly checked</Checkbox>
      <Checkbox readOnly>ReadOnly unchecked</Checkbox>
    </div>
  ),
};

export const Invalid: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Checkbox invalid>Geçersiz — Şartları kabul etmelisiniz</Checkbox>
      <Checkbox invalid checked>Geçersiz + işaretli</Checkbox>
    </div>
  ),
};

export const Controlled: Story = {
  name: 'Kontrollü / Controlled',
  render: () => {
    const [checked, setChecked] = useState<CheckboxCheckedState>(false);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <Checkbox checked={checked} onCheckedChange={setChecked}>
          Kontrollü checkbox: {String(checked)}
        </Checkbox>
        <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
          Durum: {checked === true ? 'checked' : checked === false ? 'unchecked' : 'indeterminate'}
        </div>
      </div>
    );
  },
};

export const WithoutLabel: Story = {
  name: 'Label\'sız / Without Label',
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Checkbox aria-label="Seçenek 1" />
      <Checkbox aria-label="Seçenek 2" checked />
      <Checkbox aria-label="Seçenek 3" checked="indeterminate" />
    </div>
  ),
};

export const Compound: Story = {
  name: 'Compound API',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Checkbox>
        <Checkbox.Indicator />
        <Checkbox.Label>Compound checkbox — unchecked</Checkbox.Label>
      </Checkbox>
      <Checkbox checked>
        <Checkbox.Indicator />
        <Checkbox.Label>Compound checkbox — checked</Checkbox.Label>
      </Checkbox>
      <Checkbox checked="indeterminate">
        <Checkbox.Indicator />
        <Checkbox.Label>Compound checkbox — indeterminate</Checkbox.Label>
      </Checkbox>
      <Checkbox disabled>
        <Checkbox.Indicator />
        <Checkbox.Label>Compound checkbox — disabled</Checkbox.Label>
      </Checkbox>
    </div>
  ),
};

export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Checkbox
        classNames={{ root: 'my-root', control: 'my-control' }}
        styles={{ root: { padding: '4px' }, control: { borderColor: 'var(--rel-color-warning, #f59e0b)' } }}
      >
        Root + Control slot
      </Checkbox>
      <Checkbox
        checked
        classNames={{ label: 'my-label' }}
        styles={{ label: { fontWeight: 'bold', color: 'purple' } }}
      >
        Label slot
      </Checkbox>
      <Checkbox
        checked
        className="legacy"
        classNames={{ root: 'slot-cls' }}
        style={{ margin: '4px' }}
        styles={{ root: { borderRadius: '8px' } }}
      >
        className + classNames merge
      </Checkbox>
    </div>
  ),
};

export const FormExample: Story = {
  name: 'Form Örneği / Form Example',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '320px' }}>
      <Checkbox name="terms" required>
        Kullanım şartlarını kabul ediyorum
      </Checkbox>
      <Checkbox name="newsletter">
        Bülten aboneliği
      </Checkbox>
      <Checkbox name="marketing" color="success">
        Pazarlama iletişimlerine izin veriyorum
      </Checkbox>
      <Checkbox name="data" invalid>
        Veri işleme politikasını okudum
      </Checkbox>
    </div>
  ),
};

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './Switch';

// ── Meta ──────────────────────────────────────────────────────────────

const meta: Meta<typeof Switch> = {
  title: 'Primitives/Switch',
  component: Switch,
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
type Story = StoryObj<typeof Switch>;

// ── Stories ───────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    children: 'Bildirimleri aç',
    size: 'md',
    color: 'accent',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Switch size="sm">Küçük (SM)</Switch>
      <Switch size="md">Orta (MD)</Switch>
      <Switch size="lg">Büyük (LG)</Switch>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Switch color="accent" checked>Accent</Switch>
      <Switch color="neutral" checked>Neutral</Switch>
      <Switch color="destructive" checked>Destructive</Switch>
      <Switch color="success" checked>Success</Switch>
      <Switch color="warning" checked>Warning</Switch>
    </div>
  ),
};

export const States: Story = {
  name: 'Durumlar / States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Switch>Kapalı / Off</Switch>
      <Switch checked>Açık / On</Switch>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Switch disabled>Disabled off</Switch>
      <Switch disabled checked>Disabled on</Switch>
    </div>
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Switch readOnly checked>ReadOnly on</Switch>
      <Switch readOnly>ReadOnly off</Switch>
    </div>
  ),
};

export const Invalid: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Switch invalid>Geçersiz — bu ayar zorunludur</Switch>
      <Switch invalid checked>Geçersiz + açık</Switch>
    </div>
  ),
};

export const Controlled: Story = {
  name: 'Kontrollü / Controlled',
  render: () => {
    const [checked, setChecked] = useState(false);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <Switch checked={checked} onCheckedChange={setChecked}>
          Karanlık mod: {checked ? 'Açık' : 'Kapalı'}
        </Switch>
        <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
          Durum: {checked ? 'on' : 'off'}
        </div>
      </div>
    );
  },
};

export const WithoutLabel: Story = {
  name: 'Label\'sız / Without Label',
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Switch aria-label="WiFi" />
      <Switch aria-label="Bluetooth" checked />
      <Switch aria-label="GPS" />
    </div>
  ),
};

export const FormExample: Story = {
  name: 'Form Örneği / Form Example',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '320px' }}>
      <Switch name="notifications" color="success" checked>
        Bildirimleri aç
      </Switch>
      <Switch name="darkMode">
        Karanlık mod
      </Switch>
      <Switch name="analytics" color="warning">
        Analitik verisi paylaş
      </Switch>
      <Switch name="required" invalid>
        Kullanım şartlarını kabul et
      </Switch>
    </div>
  ),
};

export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Switch
        classNames={{ track: 'my-track' }}
        styles={{
          root: { padding: '4px 8px', borderRadius: '4px', background: 'rgba(0,0,0,0.03)' },
          track: { boxShadow: '0 0 0 2px currentColor' },
          label: { fontWeight: 600 },
        }}
      >
        Custom track + label
      </Switch>
      <Switch
        className="legacy-class"
        classNames={{ root: 'slot-cls' }}
        styles={{ root: { padding: '4px 8px' } }}
      >
        className + classNames merge
      </Switch>
      <Switch
        checked
        styles={{ knob: { background: 'orange' }, label: { letterSpacing: '0.05em' } }}
      >
        Custom knob + label
      </Switch>
    </div>
  ),
};

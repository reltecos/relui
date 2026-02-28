/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PasswordInput } from './PasswordInput';

// ── Meta ─────────────────────────────────────────────────────────────

const meta = {
  title: 'Primitives/PasswordInput',
  component: PasswordInput,
  argTypes: {
    variant: {
      control: 'select',
      options: ['outline', 'filled', 'flushed'],
      description: 'Görsel varyant / Visual variant',
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
      description: 'Geçersiz durum / Invalid state',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder metni / Placeholder text',
    },
  },
  args: {
    variant: 'outline',
    size: 'md',
    placeholder: 'Şifre girin',
  },
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Stories ──────────────────────────────────────────────────────────

/** Varsayılan / Default */
export const Default: Story = {};

/** Outline varyant / Outline variant */
export const Outline: Story = {
  name: 'Outline',
  args: { variant: 'outline' },
};

/** Filled varyant / Filled variant */
export const Filled: Story = {
  name: 'Filled',
  args: { variant: 'filled' },
};

/** Flushed varyant / Flushed variant */
export const Flushed: Story = {
  name: 'Flushed',
  args: { variant: 'flushed' },
};

/** Tüm boyutlar / All sizes */
export const AllSizes: Story = {
  name: 'Tüm Boyutlar / All Sizes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 400 }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <PasswordInput key={size} size={size} placeholder={`Size: ${size}`} />
      ))}
    </div>
  ),
};

/** Tüm varyantlar / All variants */
export const AllVariants: Story = {
  name: 'Tüm Varyantlar / All Variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 400 }}>
      {(['outline', 'filled', 'flushed'] as const).map((variant) => (
        <PasswordInput key={variant} variant={variant} placeholder={`Variant: ${variant}`} />
      ))}
    </div>
  ),
};

/** Pasif / Disabled */
export const Disabled: Story = {
  name: 'Pasif / Disabled',
  args: { disabled: true, placeholder: 'Pasif şifre alanı' },
};

/** Salt okunur / ReadOnly */
export const ReadOnly: Story = {
  name: 'Salt Okunur / ReadOnly',
  render: () => (
    <PasswordInput readOnly value="gizli-sifre-123" />
  ),
};

/** Geçersiz / Invalid */
export const Invalid: Story = {
  name: 'Geçersiz / Invalid',
  args: { invalid: true, placeholder: 'Hatalı şifre' },
};

/** Başlangıçta görünür / Initially visible */
export const DefaultVisible: Story = {
  name: 'Başlangıçta Görünür / Initially Visible',
  render: () => (
    <PasswordInput defaultVisible placeholder="Şifre görünür başlar" />
  ),
};

/** Kontrollü / Controlled */
export const Controlled: Story = {
  name: 'Kontrollü / Controlled',
  render: () => {
    const [value, setValue] = useState('');
    const [visible, setVisible] = useState(false);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 400 }}>
        <PasswordInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          visible={visible}
          onVisibleChange={setVisible}
          placeholder="Kontrollü şifre"
        />
        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Değer: {value || '(boş)'} | Görünür: {visible ? 'evet' : 'hayır'}
        </div>
      </div>
    );
  },
};

/** Özel ikonlar / Custom icons */
export const CustomIcons: Story = {
  name: 'Özel İkonlar / Custom Icons',
  render: () => (
    <PasswordInput
      showIcon={<span style={{ fontSize: '0.875rem' }}>👁</span>}
      hideIcon={<span style={{ fontSize: '0.875rem' }}>🔒</span>}
      placeholder="Özel ikonlu şifre"
    />
  ),
};

/** Playground — interaktif kontroller / Interactive controls */
export const Playground: Story = {
  name: 'Playground',
};

/** Slot Customization */
export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 400 }}>
      <PasswordInput
        placeholder="classNames ile root"
        classNames={{ root: 'my-pw-root' }}
        styles={{ root: { border: '2px dashed orange' } }}
      />
      <PasswordInput
        placeholder="classNames ile input"
        classNames={{ input: 'my-pw-input' }}
        styles={{ input: { fontStyle: 'italic' } }}
      />
      <PasswordInput
        placeholder="classNames ile toggleButton"
        classNames={{ toggleButton: 'my-toggle' }}
        styles={{ toggleButton: { backgroundColor: 'lightyellow' } }}
      />
      <PasswordInput
        placeholder="Legacy + slot merge"
        className="legacy-class"
        classNames={{ input: 'slot-class' }}
        style={{ margin: '4px' }}
        styles={{ root: { borderWidth: '2px' } }}
      />
    </div>
  ),
};

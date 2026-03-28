/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

// ── Demo İkonlar / Demo Icons ─────────────────────────────────────────

const SearchIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const MailIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const LockIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const UserIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// ── Meta ──────────────────────────────────────────────────────────────

const meta: Meta<typeof Input> = {
  title: 'Primitives/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['outline', 'filled', 'flushed'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'tel', 'url', 'search'],
    },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    invalid: { control: 'boolean' },
    required: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

// ── Stories ───────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    placeholder: 'Metin girin...',
    variant: 'outline',
    size: 'md',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '320px' }}>
      <Input placeholder="Outline (varsayılan)" variant="outline" />
      <Input placeholder="Filled" variant="filled" />
      <Input placeholder="Flushed" variant="flushed" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '320px' }}>
      <Input placeholder="XS" size="xs" />
      <Input placeholder="SM" size="sm" />
      <Input placeholder="MD" size="md" />
      <Input placeholder="LG" size="lg" />
      <Input placeholder="XL" size="xl" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '320px' }}>
      <Input placeholder="Outline disabled" variant="outline" disabled />
      <Input placeholder="Filled disabled" variant="filled" disabled />
      <Input placeholder="Flushed disabled" variant="flushed" disabled />
    </div>
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '320px' }}>
      <Input value="Salt okunur değer" readOnly />
      <Input value="Filled readonly" variant="filled" readOnly />
    </div>
  ),
};

export const Invalid: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '320px' }}>
      <Input placeholder="Geçersiz e-posta" type="email" invalid />
      <Input placeholder="Filled invalid" variant="filled" invalid />
      <Input placeholder="Flushed invalid" variant="flushed" invalid />
    </div>
  ),
};

export const WithElements: Story = {
  name: 'Element\'li / With Elements',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '320px' }}>
      <Input placeholder="Ara..." leftElement={<SearchIcon />} />
      <Input placeholder="E-posta" type="email" leftElement={<MailIcon />} />
      <Input placeholder="Şifre" type="password" leftElement={<LockIcon />} rightElement={<EyeIcon />} />
      <Input placeholder="Kullanıcı adı" leftElement={<UserIcon />} />
    </div>
  ),
};

export const TypeVariants: Story = {
  name: 'Input Tipleri / Input Types',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '320px' }}>
      <Input placeholder="Metin" type="text" />
      <Input placeholder="E-posta" type="email" />
      <Input placeholder="Şifre" type="password" />
      <Input placeholder="Sayı" type="number" />
      <Input placeholder="Telefon" type="tel" />
      <Input placeholder="URL" type="url" />
      <Input placeholder="Arama" type="search" />
    </div>
  ),
};

export const SizeVariantMatrix: Story = {
  name: 'Size × Variant Matrix',
  render: () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
    const variants = ['outline', 'filled', 'flushed'] as const;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {sizes.map((size) => (
          <div key={size} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ width: '2rem', fontSize: '0.75rem', opacity: 0.7 }}>{size}</span>
            {variants.map((variant) => (
              <Input
                key={variant}
                placeholder={`${size} ${variant}`}
                size={size}
                variant={variant}
                style={{ maxWidth: '200px' }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  },
};

export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '320px' }}>
      <Input
        placeholder="classNames ile root slot"
        classNames={{ root: 'my-input' }}
        styles={{ root: { borderColor: 'var(--rel-color-warning, #f59e0b)', fontStyle: 'italic' } }}
      />
      <Input
        placeholder="Wrapper + element slot"
        leftElement={<SearchIcon />}
        classNames={{ wrapper: 'my-wrapper', leftElement: 'my-left' }}
        styles={{ wrapper: { background: 'var(--rel-color-bg-subtle, rgba(0,0,0,0.02))' } }}
      />
      <Input
        placeholder="className + classNames merge"
        className="legacy"
        classNames={{ root: 'slot-cls' }}
        style={{ margin: '4px' }}
        styles={{ root: { borderWidth: '2px' } }}
      />
    </div>
  ),
};

export const Compound: Story = {
  name: 'Compound API',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '320px' }}>
      <Input placeholder="Ara...">
        <Input.LeftAddon><SearchIcon /></Input.LeftAddon>
      </Input>
      <Input placeholder="E-posta" type="email">
        <Input.LeftAddon><MailIcon /></Input.LeftAddon>
        <Input.RightAddon><EyeIcon /></Input.RightAddon>
      </Input>
      <Input placeholder="Sadece sag addon">
        <Input.RightAddon><LockIcon /></Input.RightAddon>
      </Input>
    </div>
  ),
};

export const FormExample: Story = {
  name: 'Form Örneği / Form Example',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '320px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
          Ad Soyad
        </label>
        <Input placeholder="Ad Soyad" leftElement={<UserIcon />} required />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
          E-posta
        </label>
        <Input placeholder="ornek@email.com" type="email" leftElement={<MailIcon />} required />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
          Şifre
        </label>
        <Input
          placeholder="En az 8 karakter"
          type="password"
          leftElement={<LockIcon />}
          rightElement={<EyeIcon />}
          required
        />
      </div>
    </div>
  ),
};

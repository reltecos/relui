/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

// ── Meta ──────────────────────────────────────────────────────────────

const meta: Meta<typeof Textarea> = {
  title: 'Primitives/Textarea',
  component: Textarea,
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
    resize: {
      control: 'select',
      options: ['none', 'vertical', 'horizontal', 'both'],
    },
    rows: { control: 'number' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    invalid: { control: 'boolean' },
    required: { control: 'boolean' },
    autoResize: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

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
      <Textarea placeholder="Outline (varsayılan)" variant="outline" />
      <Textarea placeholder="Filled" variant="filled" />
      <Textarea placeholder="Flushed" variant="flushed" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '320px' }}>
      <Textarea placeholder="XS" size="xs" rows={2} />
      <Textarea placeholder="SM" size="sm" rows={2} />
      <Textarea placeholder="MD" size="md" rows={2} />
      <Textarea placeholder="LG" size="lg" rows={2} />
      <Textarea placeholder="XL" size="xl" rows={2} />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '320px' }}>
      <Textarea placeholder="Outline disabled" variant="outline" disabled />
      <Textarea placeholder="Filled disabled" variant="filled" disabled />
      <Textarea placeholder="Flushed disabled" variant="flushed" disabled />
    </div>
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '320px' }}>
      <Textarea value="Salt okunur değer — düzenlenemez." readOnly />
      <Textarea value="Filled readonly" variant="filled" readOnly />
    </div>
  ),
};

export const Invalid: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '320px' }}>
      <Textarea placeholder="Geçersiz içerik" invalid />
      <Textarea placeholder="Filled invalid" variant="filled" invalid />
      <Textarea placeholder="Flushed invalid" variant="flushed" invalid />
    </div>
  ),
};

export const ResizeModes: Story = {
  name: 'Resize Modları / Resize Modes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '320px' }}>
      <Textarea placeholder="Resize: vertical (varsayılan)" resize="vertical" rows={2} />
      <Textarea placeholder="Resize: horizontal" resize="horizontal" rows={2} />
      <Textarea placeholder="Resize: both" resize="both" rows={2} />
      <Textarea placeholder="Resize: none" resize="none" rows={2} />
    </div>
  ),
};

export const AutoResize: Story = {
  name: 'Otomatik Boyutlandırma / Auto Resize',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '320px' }}>
      <Textarea placeholder="Yazdıkça büyür..." autoResize rows={1} />
      <Textarea placeholder="Filled auto resize" variant="filled" autoResize rows={2} />
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
          <div key={size} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
            <span style={{ width: '2rem', fontSize: '0.75rem', opacity: 0.7, paddingTop: '0.5rem' }}>
              {size}
            </span>
            {variants.map((variant) => (
              <Textarea
                key={variant}
                placeholder={`${size} ${variant}`}
                size={size}
                variant={variant}
                rows={2}
                style={{ maxWidth: '200px' }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  },
};

export const FormExample: Story = {
  name: 'Form Örneği / Form Example',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '320px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
          Açıklama
        </label>
        <Textarea placeholder="Proje açıklaması..." rows={3} required />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
          Notlar (opsiyonel)
        </label>
        <Textarea placeholder="Ekstra notlar..." rows={2} autoResize />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
          Hata Mesajı
        </label>
        <Textarea placeholder="Hata detayları..." invalid rows={3} />
        <span style={{ fontSize: '0.75rem', color: 'var(--rel-color-destructive-default)' }}>
          Bu alan zorunludur.
        </span>
      </div>
    </div>
  ),
};

export const Compound: Story = {
  name: 'Compound API',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '320px' }}>
      <Textarea placeholder="Aciklama yazin...">
        <Textarea.Label>Aciklama</Textarea.Label>
      </Textarea>
      <Textarea placeholder="Notlar...">
        <Textarea.Label>Notlar</Textarea.Label>
        <Textarea.Counter count={42} max={500} />
      </Textarea>
      <Textarea placeholder="Sadece counter">
        <Textarea.Counter count={0} max={200} />
      </Textarea>
    </div>
  ),
};

export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '320px' }}>
      <Textarea
        placeholder="classNames + styles ile customize"
        classNames={{ root: 'my-textarea' }}
        styles={{ root: { borderColor: 'var(--rel-color-warning, #f59e0b)', fontStyle: 'italic' } }}
      />
      <Textarea
        placeholder="className + classNames merge"
        className="legacy"
        classNames={{ root: 'slot-cls' }}
        style={{ margin: '4px' }}
        styles={{ root: { borderWidth: '2px' } }}
      />
    </div>
  ),
};

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Primitives/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'ghost', 'soft', 'link'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    color: {
      control: 'select',
      options: ['accent', 'neutral', 'destructive', 'success', 'warning'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    loadingText: { control: 'text' },
    onClick: { action: 'clicked' },
  },
  args: {
    children: 'Button',
    variant: 'solid',
    size: 'md',
    color: 'accent',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Temel / Default ──────────────────────────────────────────────────

/** Varsayılan buton — solid, accent, md */
export const Default: Story = {};

// ── Varyantlar / Variants ────────────────────────────────────────────

/** Tüm varyantlar yan yana / All variants side by side */
export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <Button {...args} variant="solid">Solid</Button>
      <Button {...args} variant="outline">Outline</Button>
      <Button {...args} variant="ghost">Ghost</Button>
      <Button {...args} variant="soft">Soft</Button>
      <Button {...args} variant="link">Link</Button>
    </div>
  ),
};

// ── Boyutlar / Sizes ─────────────────────────────────────────────────

/** Tüm boyutlar yan yana / All sizes side by side */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <Button {...args} size="xs">XS</Button>
      <Button {...args} size="sm">SM</Button>
      <Button {...args} size="md">MD</Button>
      <Button {...args} size="lg">LG</Button>
      <Button {...args} size="xl">XL</Button>
    </div>
  ),
};

// ── Renkler / Colors ─────────────────────────────────────────────────

/** Tüm renkler — solid / All colors — solid */
export const Colors: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <Button {...args} color="accent">Accent</Button>
      <Button {...args} color="neutral">Neutral</Button>
      <Button {...args} color="destructive">Destructive</Button>
      <Button {...args} color="success">Success</Button>
      <Button {...args} color="warning">Warning</Button>
    </div>
  ),
};

// ── Varyant × Renk Matrisi / Variant × Color Matrix ─────────────────

/** 5×5 matris — tüm kombinasyonlar / 5×5 matrix — all combinations */
export const VariantColorMatrix: Story = {
  render: () => {
    const variants = ['solid', 'outline', 'ghost', 'soft', 'link'] as const;
    const colors = ['accent', 'neutral', 'destructive', 'success', 'warning'] as const;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {variants.map((variant) => (
          <div key={variant} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span style={{ width: '60px', fontSize: '0.75rem', color: 'var(--rel-color-fg-muted)' }}>
              {variant}
            </span>
            {colors.map((color) => (
              <Button key={`${variant}-${color}`} variant={variant} color={color}>
                {color}
              </Button>
            ))}
          </div>
        ))}
      </div>
    );
  },
};

// ── Durumlar / States ────────────────────────────────────────────────

/** Disabled durumu / Disabled state */
export const Disabled: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <Button {...args} disabled variant="solid">Solid</Button>
      <Button {...args} disabled variant="outline">Outline</Button>
      <Button {...args} disabled variant="ghost">Ghost</Button>
      <Button {...args} disabled variant="soft">Soft</Button>
      <Button {...args} disabled variant="link">Link</Button>
    </div>
  ),
};

/** Loading durumu / Loading state */
export const Loading: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <Button {...args} loading>Kaydet</Button>
      <Button {...args} loading loadingText="Kaydediliyor...">Kaydet</Button>
      <Button {...args} loading variant="outline">Yükleniyor</Button>
      <Button {...args} loading variant="ghost" color="destructive">Siliniyor</Button>
    </div>
  ),
};

// ── İkonlu / With Icons ──────────────────────────────────────────────

/**
 * SVG ikon örnekleri — gerçek ikon kütüphanesi yerine basit SVG.
 * SVG icon examples — simple SVGs instead of a real icon library.
 */
const PlusIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 2a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 8 2Z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M8.22 2.97a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06l2.97-2.97H3a.75.75 0 0 1 0-1.5h8.19L8.22 4.03a.75.75 0 0 1 0-1.06Z"
    />
  </svg>
);

const SearchIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M11.5 7a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm-.82 4.74a6 6 0 1 1 1.06-1.06l3.04 3.04a.75.75 0 1 1-1.06 1.06l-3.04-3.04Z"
    />
  </svg>
);

/** Sol ve sağ ikon / Left and right icon */
export const WithIcons: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <Button {...args} leftIcon={<PlusIcon />}>Ekle</Button>
      <Button {...args} rightIcon={<ArrowRightIcon />}>Devam</Button>
      <Button {...args} leftIcon={<SearchIcon />} rightIcon={<ArrowRightIcon />}>
        Ara
      </Button>
      <Button {...args} leftIcon={<PlusIcon />} variant="outline">Yeni</Button>
      <Button {...args} leftIcon={<SearchIcon />} variant="ghost" color="neutral">
        Ara
      </Button>
    </div>
  ),
};

// ── Tam Genişlik / Full Width ────────────────────────────────────────

/** Tam genişlik butonlar / Full width buttons */
export const FullWidth: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '300px' }}>
      <Button {...args} fullWidth variant="solid">Onayla</Button>
      <Button {...args} fullWidth variant="outline">İptal</Button>
      <Button {...args} fullWidth variant="ghost" color="destructive">Sil</Button>
    </div>
  ),
};

// ── Boyut × Varyant Matrisi / Size × Variant Matrix ─────────────────

/** Tüm boyut × varyant kombinasyonları */
export const SizeVariantMatrix: Story = {
  render: () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
    const variants = ['solid', 'outline', 'ghost', 'soft'] as const;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {sizes.map((size) => (
          <div key={size} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span style={{ width: '30px', fontSize: '0.75rem', color: 'var(--rel-color-fg-muted)' }}>
              {size}
            </span>
            {variants.map((variant) => (
              <Button key={`${size}-${variant}`} size={size} variant={variant}>
                {variant}
              </Button>
            ))}
          </div>
        ))}
      </div>
    );
  },
};

// ── Compound API ─────────────────────────────────────────────────────

/** Compound API ile ikon kullanimi / Icon usage with Compound API */
export const Compound: Story = {
  name: 'Compound API',
  render: (args) => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <Button {...args}>
        <Button.LeftIcon><PlusIcon /></Button.LeftIcon>
        Ekle
      </Button>
      <Button {...args} variant="outline">
        Devam
        <Button.RightIcon><ArrowRightIcon /></Button.RightIcon>
      </Button>
      <Button {...args} variant="ghost" color="neutral">
        <Button.LeftIcon><SearchIcon /></Button.LeftIcon>
        Ara
        <Button.RightIcon><ArrowRightIcon /></Button.RightIcon>
      </Button>
    </div>
  ),
};

// ── Slot Customization ──────────────────────────────────────────────

/** classNames & styles ile slot customization / Slot customization with classNames & styles */
export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Button
        classNames={{ root: 'custom-root' }}
        styles={{ root: { border: '2px dashed var(--rel-color-accent, #ec4899)' } }}
      >
        Root slot styled
      </Button>
      <Button
        loading
        styles={{ spinner: { borderColor: 'var(--rel-color-accent, #ec4899)' } }}
      >
        Spinner slot styled
      </Button>
      <Button
        leftIcon={<PlusIcon />}
        styles={{ leftIcon: { color: 'var(--rel-color-accent, #ec4899)' } }}
      >
        LeftIcon slot styled
      </Button>
      <Button
        rightIcon={<ArrowRightIcon />}
        styles={{ rightIcon: { color: 'var(--rel-color-success, #16a34a)' } }}
      >
        RightIcon slot styled
      </Button>
      <Button
        leftIcon={<PlusIcon />}
        rightIcon={<ArrowRightIcon />}
        styles={{
          root: { border: '2px dashed var(--rel-color-primary, #3b82f6)' },
          leftIcon: { color: 'var(--rel-color-accent, #ec4899)' },
          rightIcon: { color: 'var(--rel-color-success, #16a34a)' },
        }}
      >
        Tum slotlar / All slots
      </Button>
    </div>
  ),
};

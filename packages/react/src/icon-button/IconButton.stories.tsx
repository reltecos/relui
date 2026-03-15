/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './IconButton';

// ── Demo İkonlar / Demo Icons ─────────────────────────────────────────

const SearchIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const TrashIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const PlusIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const CloseIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ── Meta ──────────────────────────────────────────────────────────────

const meta: Meta<typeof IconButton> = {
  title: 'Primitives/IconButton',
  component: IconButton,
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
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

// ── Stories ───────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    icon: <SearchIcon />,
    'aria-label': 'Ara',
    variant: 'solid',
    size: 'md',
    color: 'accent',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <IconButton icon={<SearchIcon />} aria-label="Solid" variant="solid" />
      <IconButton icon={<SearchIcon />} aria-label="Outline" variant="outline" />
      <IconButton icon={<SearchIcon />} aria-label="Ghost" variant="ghost" />
      <IconButton icon={<SearchIcon />} aria-label="Soft" variant="soft" />
      <IconButton icon={<SearchIcon />} aria-label="Link" variant="link" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <IconButton icon={<PlusIcon />} aria-label="XS" size="xs" />
      <IconButton icon={<PlusIcon />} aria-label="SM" size="sm" />
      <IconButton icon={<PlusIcon />} aria-label="MD" size="md" />
      <IconButton icon={<PlusIcon />} aria-label="LG" size="lg" />
      <IconButton icon={<PlusIcon />} aria-label="XL" size="xl" />
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <IconButton icon={<PlusIcon />} aria-label="Accent" color="accent" />
      <IconButton icon={<PlusIcon />} aria-label="Neutral" color="neutral" />
      <IconButton icon={<TrashIcon />} aria-label="Destructive" color="destructive" />
      <IconButton icon={<PlusIcon />} aria-label="Success" color="success" />
      <IconButton icon={<PlusIcon />} aria-label="Warning" color="warning" />
    </div>
  ),
};

export const VariantColorMatrix: Story = {
  name: 'Variant × Color Matrix',
  render: () => {
    const variants = ['solid', 'outline', 'ghost', 'soft'] as const;
    const colors = ['accent', 'neutral', 'destructive', 'success', 'warning'] as const;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {variants.map((variant) => (
          <div key={variant} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ width: '4rem', fontSize: '0.75rem', opacity: 0.7 }}>{variant}</span>
            {colors.map((color) => (
              <IconButton
                key={color}
                icon={<SettingsIcon />}
                aria-label={`${variant} ${color}`}
                variant={variant}
                color={color}
              />
            ))}
          </div>
        ))}
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <IconButton icon={<SearchIcon />} aria-label="Disabled solid" disabled />
      <IconButton icon={<SearchIcon />} aria-label="Disabled outline" variant="outline" disabled />
      <IconButton icon={<SearchIcon />} aria-label="Disabled ghost" variant="ghost" disabled />
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <IconButton icon={<SearchIcon />} aria-label="Yükleniyor" loading />
      <IconButton icon={<SearchIcon />} aria-label="Yükleniyor" variant="outline" loading />
      <IconButton icon={<SearchIcon />} aria-label="Yükleniyor" variant="ghost" loading />
    </div>
  ),
};

export const UseCases: Story = {
  name: 'Gerçek Kullanım / Real Use Cases',
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <IconButton icon={<CloseIcon />} aria-label="Kapat" variant="ghost" color="neutral" />
      <IconButton icon={<TrashIcon />} aria-label="Sil" variant="ghost" color="destructive" />
      <IconButton icon={<SettingsIcon />} aria-label="Ayarlar" variant="outline" color="neutral" />
      <IconButton icon={<PlusIcon />} aria-label="Ekle" variant="solid" color="accent" />
      <IconButton icon={<SearchIcon />} aria-label="Ara" variant="soft" color="accent" />
    </div>
  ),
};

export const SizeVariantMatrix: Story = {
  name: 'Size × Variant Matrix',
  render: () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
    const variants = ['solid', 'outline', 'ghost', 'soft'] as const;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {sizes.map((size) => (
          <div key={size} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ width: '2rem', fontSize: '0.75rem', opacity: 0.7 }}>{size}</span>
            {variants.map((variant) => (
              <IconButton
                key={variant}
                icon={<PlusIcon />}
                aria-label={`${size} ${variant}`}
                size={size}
                variant={variant}
              />
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
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <IconButton aria-label="Ara" variant="ghost">
        <IconButton.Icon><SearchIcon /></IconButton.Icon>
      </IconButton>
      <IconButton aria-label="Sil" variant="solid" color="destructive">
        <IconButton.Icon><TrashIcon /></IconButton.Icon>
      </IconButton>
      <IconButton aria-label="Ekle" variant="outline">
        <IconButton.Icon><PlusIcon /></IconButton.Icon>
      </IconButton>
      <IconButton aria-label="Ayarlar" variant="soft" color="neutral">
        <IconButton.Icon><SettingsIcon /></IconButton.Icon>
      </IconButton>
    </div>
  ),
};

// ── Slot Customization ──────────────────────────────────────────────

/** classNames & styles ile slot customization / Slot customization with classNames & styles */
export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <IconButton
        icon={<SearchIcon />}
        aria-label="Root styled"
        styles={{ root: { border: '2px dashed hotpink' } }}
      />
      <IconButton
        icon={<SearchIcon />}
        aria-label="Spinner styled"
        loading
        styles={{ spinner: { borderColor: 'hotpink' } }}
      />
      <IconButton
        icon={<SettingsIcon />}
        aria-label="Icon styled"
        variant="outline"
        styles={{ icon: { color: 'hotpink' } }}
      />
      <IconButton
        icon={<PlusIcon />}
        aria-label="Tum slotlar"
        classNames={{ root: 'custom-root' }}
        styles={{
          root: { border: '2px dashed royalblue' },
          icon: { color: 'limegreen' },
        }}
      />
    </div>
  ),
};

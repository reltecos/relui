/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { CopyButton } from './CopyButton';

// ── Meta ──────────────────────────────────────────────────────────────

const meta: Meta<typeof CopyButton> = {
  title: 'Primitives/CopyButton',
  component: CopyButton,
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
    copiedDuration: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof CopyButton>;

// ── Stories ───────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    value: 'Merhaba Dünya!',
    'aria-label': 'Kopyala',
    variant: 'ghost',
    size: 'md',
    color: 'neutral',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <CopyButton value="solid" aria-label="Solid" variant="solid" />
      <CopyButton value="outline" aria-label="Outline" variant="outline" />
      <CopyButton value="ghost" aria-label="Ghost" variant="ghost" />
      <CopyButton value="soft" aria-label="Soft" variant="soft" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <CopyButton value="xs" aria-label="XS" size="xs" />
      <CopyButton value="sm" aria-label="SM" size="sm" />
      <CopyButton value="md" aria-label="MD" size="md" />
      <CopyButton value="lg" aria-label="LG" size="lg" />
      <CopyButton value="xl" aria-label="XL" size="xl" />
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <CopyButton value="accent" aria-label="Accent" color="accent" />
      <CopyButton value="neutral" aria-label="Neutral" color="neutral" />
      <CopyButton value="success" aria-label="Success" color="success" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <CopyButton value="disabled" aria-label="Disabled ghost" disabled />
      <CopyButton value="disabled" aria-label="Disabled outline" variant="outline" disabled />
      <CopyButton value="disabled" aria-label="Disabled solid" variant="solid" disabled />
    </div>
  ),
};

export const WithCodeBlock: Story = {
  name: 'Kod Bloğu / Code Block',
  render: () => {
    const code = 'npm install @relteco/relui-react';

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1rem',
          borderRadius: '0.5rem',
          backgroundColor: 'var(--rel-bg-subtle)',
          fontFamily: 'monospace',
          fontSize: '0.875rem',
        }}
      >
        <code style={{ flex: 1 }}>{code}</code>
        <CopyButton value={code} aria-label="Kodu kopyala" size="sm" />
      </div>
    );
  },
};

export const CustomDuration: Story = {
  name: 'Özel Süre / Custom Duration',
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <CopyButton value="1sn" aria-label="1 saniye" copiedDuration={1000} />
      <CopyButton value="5sn" aria-label="5 saniye" copiedDuration={5000} />
    </div>
  ),
};

// ── Slot Customization ──────────────────────────────────────────────

export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <CopyButton
        value="root styled"
        aria-label="Root styled"
        styles={{ root: { border: '2px dashed var(--rel-color-accent, #ec4899)' } }}
      />
      <CopyButton
        value="icon styled"
        aria-label="Icon styled"
        variant="outline"
        styles={{ icon: { color: 'var(--rel-color-accent, #ec4899)' } }}
      />
      <CopyButton
        value="all slots"
        aria-label="Tum slotlar"
        classNames={{ root: 'custom-root' }}
        styles={{
          root: { border: '2px dashed var(--rel-color-primary, #3b82f6)' },
          icon: { color: 'var(--rel-color-success, #16a34a)' },
        }}
      />
    </div>
  ),
};

/** Compound API */
export const Compound: Story = {
  name: 'Compound API',
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <CopyButton value="compound text" aria-label="Kopyala" variant="outline">
        <CopyButton.Icon />
        <CopyButton.Label>Kopyala</CopyButton.Label>
      </CopyButton>
      <CopyButton value="sadece ikon" aria-label="Ikon" variant="ghost">
        <CopyButton.Icon />
      </CopyButton>
    </div>
  ),
};

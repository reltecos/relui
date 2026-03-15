/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { ButtonGroup } from './ButtonGroup';
import { Button } from '../button/Button';
import { IconButton } from '../icon-button/IconButton';

// ── Demo İkonlar / Demo Icons ─────────────────────────────────────────

const BoldIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
  </svg>
);

const ItalicIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="4" x2="10" y2="4" />
    <line x1="14" y1="20" x2="5" y2="20" />
    <line x1="15" y1="4" x2="9" y2="20" />
  </svg>
);

const UnderlineIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
    <line x1="4" y1="21" x2="20" y2="21" />
  </svg>
);

const AlignLeftIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="17" y1="10" x2="3" y2="10" />
    <line x1="21" y1="6" x2="3" y2="6" />
    <line x1="21" y1="14" x2="3" y2="14" />
    <line x1="17" y1="18" x2="3" y2="18" />
  </svg>
);

const AlignCenterIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="10" x2="6" y2="10" />
    <line x1="21" y1="6" x2="3" y2="6" />
    <line x1="21" y1="14" x2="3" y2="14" />
    <line x1="18" y1="18" x2="6" y2="18" />
  </svg>
);

const AlignRightIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="21" y1="10" x2="7" y2="10" />
    <line x1="21" y1="6" x2="3" y2="6" />
    <line x1="21" y1="14" x2="3" y2="14" />
    <line x1="21" y1="18" x2="7" y2="18" />
  </svg>
);

// ── Meta ──────────────────────────────────────────────────────────────

const meta: Meta<typeof ButtonGroup> = {
  title: 'Primitives/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'ghost', 'soft'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    color: {
      control: 'select',
      options: ['accent', 'neutral', 'destructive', 'success', 'warning'],
    },
    attached: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

// ── Stories ───────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <ButtonGroup>
      <Button>Sol</Button>
      <Button>Orta</Button>
      <Button>Sağ</Button>
    </ButtonGroup>
  ),
};

export const SharedVariant: Story = {
  name: 'Ortak Variant / Shared Variant',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ButtonGroup variant="solid">
        <Button>Solid 1</Button>
        <Button>Solid 2</Button>
        <Button>Solid 3</Button>
      </ButtonGroup>

      <ButtonGroup variant="outline">
        <Button>Outline 1</Button>
        <Button>Outline 2</Button>
        <Button>Outline 3</Button>
      </ButtonGroup>

      <ButtonGroup variant="ghost">
        <Button>Ghost 1</Button>
        <Button>Ghost 2</Button>
        <Button>Ghost 3</Button>
      </ButtonGroup>

      <ButtonGroup variant="soft">
        <Button>Soft 1</Button>
        <Button>Soft 2</Button>
        <Button>Soft 3</Button>
      </ButtonGroup>
    </div>
  ),
};

export const SharedSize: Story = {
  name: 'Ortak Boyut / Shared Size',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
      <ButtonGroup size="xs" variant="outline">
        <Button>XS 1</Button>
        <Button>XS 2</Button>
      </ButtonGroup>

      <ButtonGroup size="sm" variant="outline">
        <Button>SM 1</Button>
        <Button>SM 2</Button>
      </ButtonGroup>

      <ButtonGroup size="md" variant="outline">
        <Button>MD 1</Button>
        <Button>MD 2</Button>
      </ButtonGroup>

      <ButtonGroup size="lg" variant="outline">
        <Button>LG 1</Button>
        <Button>LG 2</Button>
      </ButtonGroup>

      <ButtonGroup size="xl" variant="outline">
        <Button>XL 1</Button>
        <Button>XL 2</Button>
      </ButtonGroup>
    </div>
  ),
};

export const Attached: Story = {
  name: 'Yapışık / Attached',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
      <ButtonGroup attached variant="outline">
        <Button>Sol</Button>
        <Button>Orta</Button>
        <Button>Sağ</Button>
      </ButtonGroup>

      <ButtonGroup attached variant="solid">
        <Button>1</Button>
        <Button>2</Button>
        <Button>3</Button>
      </ButtonGroup>

      <ButtonGroup attached variant="ghost">
        <Button>A</Button>
        <Button>B</Button>
        <Button>C</Button>
      </ButtonGroup>
    </div>
  ),
};

export const AttachedIconButtons: Story = {
  name: 'Yapışık İkon Butonlar / Attached Icon Buttons',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
      <ButtonGroup attached variant="outline" color="neutral">
        <IconButton icon={<BoldIcon />} aria-label="Kalın" />
        <IconButton icon={<ItalicIcon />} aria-label="İtalik" />
        <IconButton icon={<UnderlineIcon />} aria-label="Altı çizili" />
      </ButtonGroup>

      <ButtonGroup attached variant="outline" color="neutral">
        <IconButton icon={<AlignLeftIcon />} aria-label="Sola hizala" />
        <IconButton icon={<AlignCenterIcon />} aria-label="Ortala" />
        <IconButton icon={<AlignRightIcon />} aria-label="Sağa hizala" />
      </ButtonGroup>
    </div>
  ),
};

export const Vertical: Story = {
  name: 'Dikey / Vertical',
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
      <ButtonGroup orientation="vertical" variant="outline">
        <Button>Üst</Button>
        <Button>Orta</Button>
        <Button>Alt</Button>
      </ButtonGroup>

      <ButtonGroup orientation="vertical" attached variant="outline">
        <Button>Üst</Button>
        <Button>Orta</Button>
        <Button>Alt</Button>
      </ButtonGroup>
    </div>
  ),
};

export const Disabled: Story = {
  name: 'Devre Dışı / Disabled',
  render: () => (
    <ButtonGroup variant="outline" disabled>
      <Button>Bir</Button>
      <Button>İki</Button>
      <Button>Üç</Button>
    </ButtonGroup>
  ),
};

export const Mixed: Story = {
  name: 'Karışık / Mixed Buttons and IconButtons',
  render: () => (
    <ButtonGroup variant="outline" color="neutral">
      <Button>Metin</Button>
      <IconButton icon={<BoldIcon />} aria-label="Kalın" />
      <IconButton icon={<ItalicIcon />} aria-label="İtalik" />
    </ButtonGroup>
  ),
};

export const ColorVariants: Story = {
  name: 'Renk Varyantları / Color Variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
      <ButtonGroup attached variant="solid" color="accent">
        <Button>Accent</Button>
        <Button>Grup</Button>
      </ButtonGroup>

      <ButtonGroup attached variant="solid" color="destructive">
        <Button>Destructive</Button>
        <Button>Grup</Button>
      </ButtonGroup>

      <ButtonGroup attached variant="solid" color="success">
        <Button>Success</Button>
        <Button>Grup</Button>
      </ButtonGroup>
    </div>
  ),
};

export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
      <ButtonGroup
        variant="outline"
        classNames={{ root: 'my-btn-group' }}
        styles={{ root: { border: '2px dashed orange', padding: '0.5rem' } }}
      >
        <Button>Sol</Button>
        <Button>Orta</Button>
        <Button>Sag</Button>
      </ButtonGroup>
    </div>
  ),
};

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'Data Display/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    color: { control: 'select', options: ['accent', 'neutral', 'destructive', 'success', 'warning'] },
    variant: { control: 'select', options: ['solid', 'soft', 'outline'] },
    removable: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: { children: 'TypeScript', size: 'md', color: 'accent', variant: 'soft' },
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Tag color="accent">React</Tag>
      <Tag color="neutral">HTML</Tag>
      <Tag color="success">Node.js</Tag>
      <Tag color="warning">Beta</Tag>
      <Tag color="destructive">Deprecated</Tag>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Tag variant="solid">Solid</Tag>
      <Tag variant="soft">Soft</Tag>
      <Tag variant="outline">Outline</Tag>
    </div>
  ),
};

export const Removable: Story = {
  name: 'Kaldırılabilir / Removable',
  render: () => {
    const [tags, setTags] = useState(['React', 'TypeScript', 'Node.js', 'Vitest']);

    return (
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {tags.map((tag) => (
          <Tag
            key={tag}
            removable
            onRemove={() => setTags((prev) => prev.filter((t) => t !== tag))}
            color="accent"
          >
            {tag}
          </Tag>
        ))}
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Tag disabled>Pasif</Tag>
      <Tag disabled removable>Pasif + Kaldırılabilir</Tag>
    </div>
  ),
};

// ── Compound ──

export const Compound: Story = {
  render: () => {
    const [tags, setTags] = useState(['React', 'TypeScript', 'Node.js']);

    return (
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {tags.map((tag) => (
          <Tag key={tag} color="accent" onRemove={() => setTags((prev) => prev.filter((t) => t !== tag))}>
            <Tag.Icon><span style={{ fontSize: '0.75em' }}>#</span></Tag.Icon>
            {tag}
            <Tag.RemoveButton />
          </Tag>
        ))}
      </div>
    );
  },
};

export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Tag
        classNames={{ root: 'my-tag' }}
        styles={{ root: { letterSpacing: '0.05em' } }}
      >
        Custom
      </Tag>
      <Tag
        removable
        styles={{ removeButton: { opacity: 0.3 } }}
      >
        Styled Remove
      </Tag>
    </div>
  ),
};

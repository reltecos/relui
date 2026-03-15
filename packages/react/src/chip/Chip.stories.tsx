/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Chip } from './Chip';

const meta: Meta<typeof Chip> = {
  title: 'Data Display/Chip',
  component: Chip,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    color: { control: 'select', options: ['accent', 'neutral', 'destructive', 'success', 'warning'] },
    selected: { control: 'boolean' },
    removable: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {
  args: { children: 'Chip', size: 'md', color: 'accent' },
};

export const Selectable: Story = {
  name: 'Seçilebilir / Selectable',
  render: () => {
    const [selected, setSelected] = useState<Set<string>>(new Set(['React']));

    const toggle = (name: string) => {
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(name)) next.delete(name); else next.add(name);
        return next;
      });
    };

    return (
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {['React', 'Vue', 'Angular', 'Svelte', 'Solid'].map((fw) => (
          <Chip
            key={fw}
            selected={selected.has(fw)}
            onSelectedChange={() => toggle(fw)}
          >
            {fw}
          </Chip>
        ))}
      </div>
    );
  },
};

export const Removable: Story = {
  name: 'Kaldırılabilir / Removable',
  render: () => {
    const [items, setItems] = useState(['React', 'TypeScript', 'Vitest']);

    return (
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {items.map((item) => (
          <Chip
            key={item}
            removable
            selected
            onRemove={() => setItems((prev) => prev.filter((i) => i !== item))}
            color="accent"
          >
            {item}
          </Chip>
        ))}
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <Chip size="sm" selected>Küçük</Chip>
      <Chip size="md" selected>Orta</Chip>
      <Chip size="lg" selected>Büyük</Chip>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Chip disabled>Pasif</Chip>
      <Chip disabled selected>Pasif + Seçili</Chip>
    </div>
  ),
};

// ── Compound ──

export const Compound: Story = {
  render: () => {
    const [items, setItems] = useState(['React', 'Vue', 'Svelte']);

    return (
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {items.map((item) => (
          <Chip
            key={item}
            selected
            onRemove={() => setItems((prev) => prev.filter((i) => i !== item))}
          >
            <Chip.Icon><span style={{ fontSize: '0.75em' }}>&#9733;</span></Chip.Icon>
            {item}
            <Chip.RemoveButton />
          </Chip>
        ))}
      </div>
    );
  },
};

export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Chip
        selected
        classNames={{ root: 'my-chip' }}
        styles={{ root: { boxShadow: '0 0 0 2px currentColor' } }}
      >
        Custom
      </Chip>
    </div>
  ),
};

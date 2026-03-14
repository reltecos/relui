/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TableOfContents } from './TableOfContents';
import type { TocItem } from '@relteco/relui-core';

const meta: Meta<typeof TableOfContents> = {
  title: 'Navigation/TableOfContents',
  component: TableOfContents,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TableOfContents>;

// ── Demo items ──────────────────────────────────────────

const demoItems: TocItem[] = [
  { id: 'intro', label: 'Introduction', depth: 0 },
  { id: 'getting-started', label: 'Getting Started', depth: 0 },
  { id: 'installation', label: 'Installation', depth: 1 },
  { id: 'configuration', label: 'Configuration', depth: 1 },
  { id: 'usage', label: 'Usage', depth: 0 },
  { id: 'basic-usage', label: 'Basic Usage', depth: 1 },
  { id: 'advanced-usage', label: 'Advanced Usage', depth: 1 },
  { id: 'api', label: 'API Reference', depth: 0 },
  { id: 'props', label: 'Props', depth: 1 },
  { id: 'methods', label: 'Methods', depth: 1 },
  { id: 'types', label: 'Types', depth: 2 },
  { id: 'faq', label: 'FAQ', depth: 0 },
];

// ── Default ─────────────────────────────────────────────

export const Default: Story = {
  args: {
    items: demoItems,
    activeId: 'usage',
  },
};

// ── All Variants ────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '48px' }}>
      <div>
        <h4 style={{ marginBottom: 8, fontSize: 12, color: '#64748b' }}>Default</h4>
        <TableOfContents items={demoItems} activeId="usage" variant="default" />
      </div>
      <div>
        <h4 style={{ marginBottom: 8, fontSize: 12, color: '#64748b' }}>Filled</h4>
        <TableOfContents items={demoItems} activeId="usage" variant="filled" />
      </div>
      <div>
        <h4 style={{ marginBottom: 8, fontSize: 12, color: '#64748b' }}>Dots</h4>
        <TableOfContents items={demoItems} activeId="usage" variant="dots" />
      </div>
    </div>
  ),
};

// ── All Sizes ───────────────────────────────────────────

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div key={size}>
          <h4 style={{ marginBottom: 8, fontSize: 12, color: '#64748b' }}>{size}</h4>
          <TableOfContents items={demoItems.slice(0, 5)} activeId="getting-started" size={size} />
        </div>
      ))}
    </div>
  ),
};

// ── With Disabled ───────────────────────────────────────

export const WithDisabled: Story = {
  args: {
    items: [
      ...demoItems.slice(0, 4),
      { id: 'deprecated', label: 'Deprecated Section', depth: 0, disabled: true },
      ...demoItems.slice(4),
    ],
    activeId: 'usage',
  },
};

// ── Controlled ──────────────────────────────────────────

export const Controlled: Story = {
  render: () => {
    const [active, setActive] = useState<string | null>('intro');
    return (
      <div style={{ display: 'flex', gap: '24px', alignItems: 'start' }}>
        <TableOfContents
          items={demoItems}
          activeId={active}
          onChange={setActive}
        />
        <div style={{ fontSize: 14, color: '#64748b' }}>
          Active: <strong>{active ?? 'none'}</strong>
        </div>
      </div>
    );
  },
};

// ── Deep Nesting ────────────────────────────────────────

export const DeepNesting: Story = {
  args: {
    items: [
      { id: 'root', label: 'Root Section', depth: 0 },
      { id: 'child-1', label: 'Child 1', depth: 1 },
      { id: 'grandchild-1', label: 'Grandchild 1', depth: 2 },
      { id: 'great-grandchild', label: 'Great Grandchild', depth: 3 },
      { id: 'child-2', label: 'Child 2', depth: 1 },
      { id: 'grandchild-2', label: 'Grandchild 2', depth: 2 },
    ],
    activeId: 'grandchild-1',
    depthIndent: 20,
  },
};

// ── Custom Slot Styles ──────────────────────────────────

export const CustomSlotStyles: Story = {
  args: {
    items: demoItems,
    activeId: 'api',
    styles: {
      root: {
        backgroundColor: '#1a1a2e',
        padding: '12px',
        borderRadius: '8px',
        borderLeft: '2px solid #334155',
      },
      link: {
        color: '#94a3b8',
      },
    },
  },
};

// ── Playground ──────────────────────────────────────────

export const Playground: Story = {
  args: {
    items: demoItems,
    activeId: 'getting-started',
    variant: 'default',
    size: 'md',
    depthIndent: 16,
  },
};

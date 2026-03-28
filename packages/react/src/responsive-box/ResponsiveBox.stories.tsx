/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { ResponsiveBox } from './ResponsiveBox';
import { Box } from '../box';

const meta: Meta<typeof ResponsiveBox> = {
  title: 'Layout/ResponsiveBox',
  component: ResponsiveBox,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof ResponsiveBox>;

export const Default: Story = {
  render: () => (
    <ResponsiveBox
      display={{ base: 'block', md: 'flex' }}
      flexDirection={{ base: 'column', lg: 'row' }}
      gap={{ base: 4, md: 6 }}
      p={{ base: 4, md: 8 }}
      style={{ background: 'var(--rel-color-bg-subtle, #f8fafc)', borderRadius: 12 }}
    >
      <Box
        p={4}
        width={{ base: 'full', md: '1/2' }}
        style={{ background: 'var(--rel-color-border, #e2e8f0)', borderRadius: 8 }}
      >
        Sol Panel
      </Box>
      <Box
        p={4}
        width={{ base: 'full', md: '1/2' }}
        style={{ background: 'var(--rel-color-border, #e2e8f0)', borderRadius: 8 }}
      >
        Sag Panel
      </Box>
    </ResponsiveBox>
  ),
};

export const ThreeColumns: Story = {
  render: () => (
    <ResponsiveBox
      display="flex"
      flexDirection={{ base: 'column', md: 'row' }}
      gap={{ base: 3, md: 5 }}
      p={4}
      style={{ background: 'var(--rel-color-bg-subtle, #eff6ff)', borderRadius: 12 }}
    >
      <Box p={4} width={{ base: 'full', md: '1/3' }} style={{ background: 'var(--rel-color-bg-subtle, #dbeafe)', borderRadius: 8 }}>
        Kolon 1
      </Box>
      <Box p={4} width={{ base: 'full', md: '1/3' }} style={{ background: 'var(--rel-color-bg-subtle, #dbeafe)', borderRadius: 8 }}>
        Kolon 2
      </Box>
      <Box p={4} width={{ base: 'full', md: '1/3' }} style={{ background: 'var(--rel-color-bg-subtle, #dbeafe)', borderRadius: 8 }}>
        Kolon 3
      </Box>
    </ResponsiveBox>
  ),
};

export const GridLayout: Story = {
  render: () => (
    <ResponsiveBox
      display="grid"
      gridTemplateColumns={{ base: 1, md: 2, lg: 3 }}
      gap={{ base: 3, md: 4 }}
      p={4}
      style={{ background: 'var(--rel-color-bg-subtle, #f0fdf4)', borderRadius: 12 }}
    >
      {Array.from({ length: 6 }, (_, i) => (
        <Box
          key={i}
          p={4}
          style={{ background: 'var(--rel-color-bg-subtle, #dcfce7)', borderRadius: 8, textAlign: 'center' }}
        >
          Kart {i + 1}
        </Box>
      ))}
    </ResponsiveBox>
  ),
};

export const CustomSlotStyles: Story = {
  render: () => (
    <ResponsiveBox
      display="flex"
      gap={4}
      classNames={{ root: 'custom-responsive' }}
      styles={{ root: { border: '2px dashed var(--rel-color-info, #6366f1)', borderRadius: 12, padding: 16 } }}
    >
      <Box p={4} style={{ background: 'var(--rel-color-bg-subtle, #e0e7ff)', borderRadius: 8, flex: 1 }}>Sol</Box>
      <Box p={4} style={{ background: 'var(--rel-color-bg-subtle, #e0e7ff)', borderRadius: 8, flex: 1 }}>Sag</Box>
    </ResponsiveBox>
  ),
};

export const Compound: Story = {
  name: 'Compound API',
  render: () => (
    <ResponsiveBox display="flex" gap={4} p={4} style={{ background: 'var(--rel-color-bg-subtle, #f0fdf4)', borderRadius: 12 }}>
      <ResponsiveBox.Item p={4} style={{ background: 'var(--rel-color-bg-subtle, #dcfce7)', borderRadius: 8, flex: 1 }}>
        Oge 1
      </ResponsiveBox.Item>
      <ResponsiveBox.Item p={4} style={{ background: 'var(--rel-color-bg-subtle, #dcfce7)', borderRadius: 8, flex: 1 }}>
        Oge 2
      </ResponsiveBox.Item>
      <ResponsiveBox.Item p={4} style={{ background: 'var(--rel-color-bg-subtle, #dcfce7)', borderRadius: 8, flex: 1 }}>
        Oge 3
      </ResponsiveBox.Item>
    </ResponsiveBox>
  ),
};

export const Playground: Story = {
  render: () => (
    <ResponsiveBox
      display={{ base: 'block', md: 'flex' }}
      gap={{ base: 3, md: 5 }}
      p={{ base: 3, md: 6 }}
      style={{ background: 'var(--rel-color-bg-subtle, #fef3c7)', borderRadius: 12 }}
    >
      <Box p={4} style={{ background: 'var(--rel-color-bg-subtle, #fde68a)', borderRadius: 8, flex: 1 }}>A</Box>
      <Box p={4} style={{ background: 'var(--rel-color-bg-subtle, #fde68a)', borderRadius: 8, flex: 1 }}>B</Box>
    </ResponsiveBox>
  ),
};

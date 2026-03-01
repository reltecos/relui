/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Box } from './Box';

const meta: Meta<typeof Box> = {
  title: 'Layout/Box',
  component: Box,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Box>;

/** Temel kullanım — padding ve display. */
export const Default: Story = {
  render: () => (
    <Box p={4} display="flex" gap={4}>
      <Box p={4} style={{ background: '#e0e7ff', borderRadius: '8px' }}>
        Kutu 1
      </Box>
      <Box p={4} style={{ background: '#dbeafe', borderRadius: '8px' }}>
        Kutu 2
      </Box>
      <Box p={4} style={{ background: '#e0f2fe', borderRadius: '8px' }}>
        Kutu 3
      </Box>
    </Box>
  ),
};

/** Responsive layout — mobilde dikey, masaüstünde yatay. */
export const Responsive: Story = {
  render: () => (
    <Box
      display="flex"
      flexDirection={{ base: 'column', md: 'row' }}
      gap={{ base: 2, md: 4 }}
      p={{ base: 2, md: 4, lg: 6 }}
    >
      <Box p={4} style={{ background: '#fef3c7', borderRadius: '8px', flex: 1 }}>
        base: column → md: row
      </Box>
      <Box p={4} style={{ background: '#fed7aa', borderRadius: '8px', flex: 1 }}>
        gap: 2 → md: 4
      </Box>
      <Box p={4} style={{ background: '#fecaca', borderRadius: '8px', flex: 1 }}>
        padding: 2 → md: 4 → lg: 6
      </Box>
    </Box>
  ),
};

/** Grid layout — 3 sütunlu grid. */
export const GridLayout: Story = {
  render: () => (
    <Box display="grid" gridTemplateColumns={{ base: 1, md: 2, lg: 3 }} gap={4}>
      {Array.from({ length: 6 }, (_, i) => (
        <Box
          key={i}
          p={4}
          style={{ background: '#e0e7ff', borderRadius: '8px', textAlign: 'center' }}
        >
          Item {i + 1}
        </Box>
      ))}
    </Box>
  ),
};

/** Flex layout — hizalama ve dağılım. */
export const FlexLayout: Story = {
  render: () => (
    <Box display="flex" alignItems="center" justifyContent="space-between" gap={4} p={4}>
      <Box p={4} style={{ background: '#dcfce7', borderRadius: '8px' }}>
        Sol
      </Box>
      <Box p={4} style={{ background: '#dcfce7', borderRadius: '8px' }}>
        Orta
      </Box>
      <Box p={4} style={{ background: '#dcfce7', borderRadius: '8px' }}>
        Sağ
      </Box>
    </Box>
  ),
};

/** Polymorphic — farklı HTML elementleri. */
export const AsElement: Story = {
  render: () => (
    <Box display="flex" flexDirection="column" gap={4}>
      <Box as="section" p={4} style={{ background: '#f3e8ff', borderRadius: '8px' }}>
        &lt;section&gt;
      </Box>
      <Box as="nav" p={4} style={{ background: '#fce7f3', borderRadius: '8px' }}>
        &lt;nav&gt;
      </Box>
      <Box as="article" p={4} style={{ background: '#ecfccb', borderRadius: '8px' }}>
        &lt;article&gt;
      </Box>
    </Box>
  ),
};

/** Sizing — width ve height. */
export const Sizing: Story = {
  render: () => (
    <Box display="flex" gap={4} alignItems="flex-end">
      <Box
        width={24}
        height={24}
        style={{ background: '#bfdbfe', borderRadius: '8px' }}
      />
      <Box
        width={32}
        height={16}
        style={{ background: '#93c5fd', borderRadius: '8px' }}
      />
      <Box
        width="full"
        height={8}
        style={{ background: '#60a5fa', borderRadius: '8px' }}
      />
    </Box>
  ),
};

/** Nested — iç içe Box'lar. */
export const Nested: Story = {
  render: () => (
    <Box p={6} style={{ background: '#f1f5f9', borderRadius: '12px' }}>
      <Box
        display="flex"
        flexDirection={{ base: 'column', lg: 'row' }}
        gap={4}
      >
        <Box p={4} width={{ base: 'full', lg: '1/3' }} style={{ background: '#e2e8f0', borderRadius: '8px' }}>
          <Box p={2} style={{ background: '#cbd5e1', borderRadius: '4px' }}>
            İç kutu 1
          </Box>
        </Box>
        <Box p={4} width={{ base: 'full', lg: '2/3' }} style={{ background: '#e2e8f0', borderRadius: '8px' }}>
          <Box display="grid" gridTemplateColumns={2} gap={2}>
            <Box p={2} style={{ background: '#cbd5e1', borderRadius: '4px' }}>Grid 1</Box>
            <Box p={2} style={{ background: '#cbd5e1', borderRadius: '4px' }}>Grid 2</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  ),
};

/** CustomSlotStyles — classNames + styles ile slot customization. */
export const CustomSlotStyles: Story = {
  render: () => (
    <Box
      p={4}
      display="flex"
      gap={4}
      classNames={{ root: 'my-custom-box' }}
      styles={{ root: { border: '2px dashed #6366f1', borderRadius: '12px' } }}
    >
      <Box p={4} styles={{ root: { background: '#eef2ff' } }}>
        Slot styled kutu 1
      </Box>
      <Box p={4} styles={{ root: { background: '#fef3c7' } }}>
        Slot styled kutu 2
      </Box>
    </Box>
  ),
};

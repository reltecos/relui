/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Container } from './Container';
import { Box } from '../box';

const meta: Meta<typeof Container> = {
  title: 'Layout/Container',
  component: Container,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {
  render: () => (
    <Container px={4} style={{ background: '#f1f5f9' }}>
      <Box p={6} style={{ background: '#e2e8f0', borderRadius: '8px' }}>
        Varsayılan: max-width 1024px, ortalanmış.
      </Box>
    </Container>
  ),
};

export const Small: Story = {
  render: () => (
    <Container size="sm" px={4} style={{ background: '#fef3c7' }}>
      <Box p={6} style={{ background: '#fde68a', borderRadius: '8px' }}>
        size=sm: max-width 640px
      </Box>
    </Container>
  ),
};

export const ExtraLarge: Story = {
  render: () => (
    <Container size="2xl" px={4} style={{ background: '#dcfce7' }}>
      <Box p={6} style={{ background: '#bbf7d0', borderRadius: '8px' }}>
        size=2xl: max-width 1536px
      </Box>
    </Container>
  ),
};

export const Full: Story = {
  render: () => (
    <Container size="full" px={4} style={{ background: '#ede9fe' }}>
      <Box p={6} style={{ background: '#ddd6fe', borderRadius: '8px' }}>
        size=full: max-width 100%
      </Box>
    </Container>
  ),
};

export const CenteredContent: Story = {
  render: () => (
    <Container size="md" centerContent px={4} style={{ background: '#fce7f3', minHeight: '200px' }}>
      <Box p={6} style={{ background: '#fbcfe8', borderRadius: '8px' }}>
        Ortalanmış içerik (centerContent)
      </Box>
    </Container>
  ),
};

export const CustomSlotStyles: Story = {
  render: () => (
    <Container
      px={4}
      classNames={{ root: 'custom-container' }}
      styles={{ root: { border: '2px dashed #f59e0b', borderRadius: '12px', padding: '16px' } }}
    >
      <Box p={4} style={{ background: '#fef3c7', borderRadius: '8px' }}>
        Slot styled Container
      </Box>
    </Container>
  ),
};

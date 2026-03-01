/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Section } from './Section';
import { Box } from '../box';
import { Stack } from '../stack';

const meta: Meta<typeof Section> = {
  title: 'Layout/Section',
  component: Section,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof Section>;

export const Default: Story = {
  render: () => (
    <Section p={6} style={{ background: '#f8fafc', borderRadius: '12px' }}>
      <h2 style={{ margin: '0 0 12px' }}>Bölüm Başlığı</h2>
      <p style={{ margin: 0 }}>Bu bir semantik section bileşenidir.</p>
    </Section>
  ),
};

export const Responsive: Story = {
  render: () => (
    <Section
      display="flex"
      flexDirection={{ base: 'column', md: 'row' }}
      gap={{ base: 4, md: 6 }}
      p={{ base: 4, md: 8 }}
      style={{ background: '#f1f5f9', borderRadius: '12px' }}
    >
      <Box p={4} width={{ base: 'full', md: '1/2' }} style={{ background: '#e2e8f0', borderRadius: '8px' }}>
        Sol Panel
      </Box>
      <Box p={4} width={{ base: 'full', md: '1/2' }} style={{ background: '#e2e8f0', borderRadius: '8px' }}>
        Sağ Panel
      </Box>
    </Section>
  ),
};

export const MultipleSections: Story = {
  render: () => (
    <Stack spacing={6}>
      <Section p={6} style={{ background: '#eff6ff', borderRadius: '12px' }}>
        <h2 style={{ margin: '0 0 8px' }}>Özellikler</h2>
        <p style={{ margin: 0 }}>Ürün özellikleri bölümü.</p>
      </Section>
      <Section p={6} style={{ background: '#f0fdf4', borderRadius: '12px' }}>
        <h2 style={{ margin: '0 0 8px' }}>Fiyatlandırma</h2>
        <p style={{ margin: 0 }}>Fiyat planları bölümü.</p>
      </Section>
      <Section p={6} style={{ background: '#fef3c7', borderRadius: '12px' }}>
        <h2 style={{ margin: '0 0 8px' }}>SSS</h2>
        <p style={{ margin: 0 }}>Sıkça sorulan sorular.</p>
      </Section>
    </Stack>
  ),
};

export const CustomSlotStyles: Story = {
  render: () => (
    <Section
      p={6}
      classNames={{ root: 'custom-section' }}
      styles={{ root: { border: '2px dashed #6366f1', borderRadius: '12px' } }}
    >
      Slot styled Section
    </Section>
  ),
};

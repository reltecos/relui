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
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof Section>;

export const Default: Story = {
  render: () => (
    <Section p={6} style={{ background: 'var(--rel-color-bg-subtle, #f8fafc)', borderRadius: '12px' }}>
      <h2 style={{ margin: '0 0 12px' }}>Bolum Basligi</h2>
      <p style={{ margin: 0 }}>Bu bir semantik section bilesenidir.</p>
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
      style={{ background: 'var(--rel-color-bg-subtle, #f1f5f9)', borderRadius: '12px' }}
    >
      <Box p={4} width={{ base: 'full', md: '1/2' }} style={{ background: 'var(--rel-color-bg-subtle, #e2e8f0)', borderRadius: '8px' }}>
        Sol Panel
      </Box>
      <Box p={4} width={{ base: 'full', md: '1/2' }} style={{ background: 'var(--rel-color-bg-subtle, #e2e8f0)', borderRadius: '8px' }}>
        Sag Panel
      </Box>
    </Section>
  ),
};

export const MultipleSections: Story = {
  render: () => (
    <Stack spacing={6}>
      <Section p={6} style={{ background: 'var(--rel-color-bg-subtle, #eff6ff)', borderRadius: '12px' }}>
        <h2 style={{ margin: '0 0 8px' }}>Ozellikler</h2>
        <p style={{ margin: 0 }}>Urun ozellikleri bolumu.</p>
      </Section>
      <Section p={6} style={{ background: 'var(--rel-color-bg-subtle, #f0fdf4)', borderRadius: '12px' }}>
        <h2 style={{ margin: '0 0 8px' }}>Fiyatlandirma</h2>
        <p style={{ margin: 0 }}>Fiyat planlari bolumu.</p>
      </Section>
    </Stack>
  ),
};

/** Compound API — Section.Header + Section.Content ile kullanim. */
export const Compound: Story = {
  render: () => (
    <Section p={6} style={{ background: 'var(--rel-color-bg-subtle, #f8fafc)', borderRadius: '12px' }}>
      <Section.Header>Bolum Basligi</Section.Header>
      <Section.Content>
        Bu bir compound API ile kullanilan section bilesenidir.
        Header ve Content sub-component olarak ayrilmistir.
      </Section.Content>
    </Section>
  ),
};

/** Compound — farkli heading seviyesi. */
export const CompoundWithH3: Story = {
  render: () => (
    <Section p={6} style={{ background: 'var(--rel-color-bg-subtle, #f0fdf4)', borderRadius: '12px' }}>
      <Section.Header as="h3">H3 Baslik</Section.Header>
      <Section.Content>
        as prop ile heading seviyesi degistirilebilir.
      </Section.Content>
    </Section>
  ),
};

export const CustomSlotStyles: Story = {
  render: () => (
    <Section
      p={6}
      classNames={{ root: 'custom-section' }}
      styles={{ root: { border: '2px dashed var(--rel-color-primary, #6366f1)', borderRadius: '12px' } }}
    >
      <Section.Header>Slot Styled Baslik</Section.Header>
      <Section.Content>Slot styled section icerigi.</Section.Content>
    </Section>
  ),
};

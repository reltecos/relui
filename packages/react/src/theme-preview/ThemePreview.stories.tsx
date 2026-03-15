/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { ThemePreview } from './ThemePreview';

const meta: Meta<typeof ThemePreview> = {
  title: 'Tokens/ThemePreview',
  component: ThemePreview,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { disable: true },
  },
  argTypes: {
    defaultTheme: {
      control: 'select',
      options: ['default-dark', 'default-light', 'ocean-dark', 'ocean-light', 'forest-dark', 'forest-light'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Varsayilan / Default — tum renk gruplari */
export const Default: Story = {};

/** Sadece belirli temalar / Custom Variants */
export const CustomVariants: Story = {
  name: 'Ozel Temalar / Custom Variants',
  render: () => (
    <ThemePreview variants={['default-dark', 'default-light']} />
  ),
};

/** Sadece belirli renk gruplari / Custom Color Groups */
export const CustomColorGroups: Story = {
  name: 'Ozel Gruplar / Custom Color Groups',
  render: () => (
    <ThemePreview
      colorGroups={[
        { title: 'Accent', vars: [{ name: 'accentDefault', label: 'Default' }, { name: 'accentHover', label: 'Hover' }] },
        { title: 'Success', vars: [{ name: 'successDefault', label: 'Default' }, { name: 'successHover', label: 'Hover' }] },
      ]}
    />
  ),
};

/** Compound API */
export const Compound: Story = {
  render: () => (
    <ThemePreview>
      <ThemePreview.ColorSection
        title="Accent Renkleri"
        vars={[
          { name: 'accentDefault', label: 'Default' },
          { name: 'accentHover', label: 'Hover' },
          { name: 'accentActive', label: 'Active' },
          { name: 'accentSubtle', label: 'Subtle' },
        ]}
      />
      <ThemePreview.ColorSection
        title="Surface"
        vars={[
          { name: 'surfaceRaised', label: 'Raised' },
          { name: 'surfaceOverlay', label: 'Overlay' },
        ]}
      />
      <ThemePreview.TypographySection>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 24, fontWeight: 700 }}>Heading</span>
          <span style={{ fontSize: 14 }}>Body text</span>
          <span style={{ fontSize: 12, opacity: 0.6 }}>Caption</span>
        </div>
      </ThemePreview.TypographySection>
    </ThemePreview>
  ),
};

/** Slot Customization */
export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  render: () => (
    <ThemePreview
      classNames={{ root: 'custom-theme-preview' }}
      styles={{
        root: { border: '2px dashed #6366f1', maxWidth: 700 },
        selector: { gap: 12 },
      }}
      variants={['default-dark', 'default-light']}
      colorGroups={[
        { title: 'Accent', vars: [{ name: 'accentDefault', label: 'Default' }] },
      ]}
    />
  ),
};

/** Playground */
export const Playground: Story = {
  args: {
    defaultTheme: 'default-dark',
  },
};

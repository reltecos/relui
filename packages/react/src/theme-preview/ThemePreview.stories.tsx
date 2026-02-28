/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { ThemePreview } from './ThemePreview';

const meta = {
  title: 'Tokens/Theme Preview',
  component: ThemePreview,
  parameters: {
    layout: 'padded',
    backgrounds: { disable: true },
  },
} satisfies Meta<typeof ThemePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Tüm tema renklerinin interaktif önizlemesi.
 * Interactive preview of all theme colors.
 */
export const Default: Story = {};

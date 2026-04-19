/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 */

import type { Preview } from '@storybook/react';
import { ThemeDecorator } from './ThemeDecorator';

const preview: Preview = {
  decorators: [ThemeDecorator],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0a0a0b' },
        { name: 'light', value: '#fafafa' },
      ],
    },
    layout: 'centered',
  },
  globalTypes: {
    theme: {
      description: 'RelUI theme variant',
      defaultValue: 'default-dark',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'default-dark', title: 'Default Dark' },
          { value: 'default-light', title: 'Default Light' },
          { value: 'ocean-dark', title: 'Ocean Dark' },
          { value: 'ocean-light', title: 'Ocean Light' },
          { value: 'forest-dark', title: 'Forest Dark' },
          { value: 'forest-light', title: 'Forest Light' },
          { value: 'midnight-dark', title: 'Midnight Dark' },
          { value: 'midnight-light', title: 'Midnight Light' },
          { value: 'sunrise-dark', title: 'Sunrise Dark' },
          { value: 'sunrise-light', title: 'Sunrise Light' },
          { value: 'slate-dark', title: 'Slate Dark' },
          { value: 'slate-light', title: 'Slate Light' },
          { value: 'rose-dark', title: 'Rose Dark' },
          { value: 'rose-light', title: 'Rose Light' },
          { value: 'amber-dark', title: 'Amber Dark' },
          { value: 'amber-light', title: 'Amber Light' },
        ],
        dynamicTitle: true,
      },
    },
    direction: {
      description: 'Text direction',
      defaultValue: 'ltr',
      toolbar: {
        title: 'Direction',
        icon: 'paragraph',
        items: ['ltr', 'rtl'],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;

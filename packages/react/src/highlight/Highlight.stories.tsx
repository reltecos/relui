/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Highlight } from './Highlight';

const meta: Meta<typeof Highlight> = {
  title: 'Data Display/Highlight',
  component: Highlight,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    caseSensitive: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Highlight>;

export const Default: Story = {
  args: { text: 'The quick brown fox jumps over the lazy dog', terms: 'fox' },
};

export const MultipleTerms: Story = {
  args: { text: 'The quick brown fox jumps over the lazy dog', terms: ['quick', 'fox', 'lazy'] },
};

export const CaseSensitive: Story = {
  args: { text: 'Hello World hello world', terms: 'Hello', caseSensitive: true },
};

export const NoMatch: Story = {
  args: { text: 'The quick brown fox jumps over the lazy dog', terms: 'cat' },
};

export const MultipleOccurrences: Story = {
  args: { text: 'banana bandana cabana banana', terms: 'banana' },
};

export const LongText: Story = {
  args: {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    terms: ['ipsum', 'tempor', 'veniam'],
  },
};

export const Compound: Story = {
  render: () => (
    <Highlight text="hello world" terms="world">
      <Highlight.Text>hello </Highlight.Text>
      <Highlight.Mark>world</Highlight.Mark>
    </Highlight>
  ),
};

export const CustomSlotStyles: Story = {
  args: {
    text: 'Search results for: react hooks tutorial',
    terms: ['react', 'hooks'],
    styles: {
      root: { padding: 8 },
      mark: { fontWeight: 700 },
    },
  },
};

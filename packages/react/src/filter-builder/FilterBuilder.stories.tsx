/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { FilterBuilder } from './FilterBuilder';
import type { FilterField, FilterGroup, FilterRule } from '@relteco/relui-core';

const fields: FilterField[] = [
  { key: 'name', label: 'Name', type: 'string' },
  { key: 'age', label: 'Age', type: 'number' },
  { key: 'email', label: 'Email', type: 'string' },
  { key: 'status', label: 'Status', type: 'string' },
  { key: 'created', label: 'Created Date', type: 'date' },
];

const prefilledGroup: FilterGroup = {
  id: 'root',
  combinator: 'and',
  children: [
    { id: 'r1', field: 'name', operator: 'contains', value: 'Ali' } as FilterRule,
    { id: 'r2', field: 'age', operator: '>', value: '25' } as FilterRule,
  ],
};

const nestedGroup: FilterGroup = {
  id: 'root',
  combinator: 'and',
  children: [
    { id: 'r1', field: 'status', operator: '=', value: 'active' } as FilterRule,
    {
      id: 'g1',
      combinator: 'or',
      children: [
        { id: 'r2', field: 'name', operator: 'contains', value: 'Ali' } as FilterRule,
        { id: 'r3', field: 'email', operator: 'ends_with', value: '@example.com' } as FilterRule,
      ],
    },
  ],
};

const meta: Meta<typeof FilterBuilder> = {
  title: 'Input/FilterBuilder',
  component: FilterBuilder,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof FilterBuilder>;

export const Default: Story = { args: { fields } };
export const Prefilled: Story = { args: { fields, defaultGroup: prefilledGroup } };
export const Nested: Story = { args: { fields, defaultGroup: nestedGroup } };

export const FewFields: Story = {
  args: { fields: fields.slice(0, 2), defaultGroup: { id: 'root', combinator: 'and', children: [{ id: 'r1', field: 'name', operator: '=', value: '' }] } },
};

export const CustomOperators: Story = {
  args: { fields, operators: ['=', '!=', 'contains', 'starts_with', 'ends_with'] },
};

export const Compound: Story = {
  render: () => (
    <FilterBuilder fields={fields}>
      <FilterBuilder.Group />
    </FilterBuilder>
  ),
};

export const CustomSlotStyles: Story = {
  args: {
    fields,
    defaultGroup: prefilledGroup,
    styles: {
      root: { padding: 24 },
      group: { padding: 16 },
      rule: { padding: '12px 0' },
    },
  },
};

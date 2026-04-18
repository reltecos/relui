/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import type { PropertyDef } from '@relteco/relui-core';
import { PropertyGrid } from './PropertyGrid';

const widgetProps: PropertyDef[] = [
  { key: 'name', label: 'Name', type: 'string', category: 'General', value: 'MyWidget', description: 'Widget adi' },
  { key: 'id', label: 'ID', type: 'string', category: 'General', value: 'w-001', readonly: true },
  { key: 'visible', label: 'Visible', type: 'boolean', category: 'General', value: true },
  { key: 'enabled', label: 'Enabled', type: 'boolean', category: 'General', value: true },
  { key: 'width', label: 'Width', type: 'number', category: 'Layout', value: 200 },
  { key: 'height', label: 'Height', type: 'number', category: 'Layout', value: 100 },
  { key: 'x', label: 'X', type: 'number', category: 'Layout', value: 0 },
  { key: 'y', label: 'Y', type: 'number', category: 'Layout', value: 0 },
  { key: 'dock', label: 'Dock', type: 'enum', category: 'Layout', value: 'none', options: ['none', 'top', 'bottom', 'left', 'right', 'fill'] },
  { key: 'bgColor', label: 'Background', type: 'color', category: 'Appearance', value: '#ffffff' },
  { key: 'fgColor', label: 'Foreground', type: 'color', category: 'Appearance', value: '#374151' },
  { key: 'fontSize', label: 'Font Size', type: 'number', category: 'Appearance', value: 14 },
  { key: 'fontFamily', label: 'Font', type: 'enum', category: 'Appearance', value: 'sans-serif', options: ['sans-serif', 'serif', 'monospace'] },
];

const meta: Meta<typeof PropertyGrid> = {
  title: 'Data Entry/PropertyGrid',
  component: PropertyGrid,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    showSearch: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof PropertyGrid>;

export const Default: Story = {
  args: { properties: widgetProps },
  decorators: [(Story) => <div style={{ width: 360 }}><Story /></div>],
};

export const WithoutSearch: Story = {
  name: 'Aramasiz / Without Search',
  args: { properties: widgetProps, showSearch: false },
  decorators: [(Story) => <div style={{ width: 360 }}><Story /></div>],
};

export const ReadonlyProperties: Story = {
  name: 'Salt Okunur / Readonly',
  args: {
    properties: widgetProps.map((p) => ({ ...p, readonly: true })),
  },
  decorators: [(Story) => <div style={{ width: 360 }}><Story /></div>],
};

export const FewProperties: Story = {
  name: 'Az Ozellik / Few Properties',
  args: {
    properties: [
      { key: 'title', label: 'Title', type: 'string' as const, value: 'Hello' },
      { key: 'count', label: 'Count', type: 'number' as const, value: 42 },
      { key: 'active', label: 'Active', type: 'boolean' as const, value: true },
    ],
  },
  decorators: [(Story) => <div style={{ width: 360 }}><Story /></div>],
};

export const Compound: Story = {
  name: 'Compound API',
  render: () => (
    <div style={{ width: 360 }}>
      <PropertyGrid properties={widgetProps}>
        <PropertyGrid.Category label="General">
          <PropertyGrid.Property propertyKey="name" />
          <PropertyGrid.Property propertyKey="visible" />
        </PropertyGrid.Category>
        <PropertyGrid.Category label="Layout">
          <PropertyGrid.Property propertyKey="width" />
          <PropertyGrid.Property propertyKey="height" />
        </PropertyGrid.Category>
      </PropertyGrid>
    </div>
  ),
};

export const CustomEditor: Story = {
  name: 'Ozel Editor / Custom Editor',
  render: () => (
    <div style={{ width: 360 }}>
      <PropertyGrid properties={widgetProps}>
        <PropertyGrid.Category label="Custom">
          <div style={{ display: 'flex', alignItems: 'center', padding: '4px 12px' }}>
            <span style={{ flex: '0 0 45%' }}>Custom</span>
            <PropertyGrid.Editor propertyKey="name">
              {(value, setValue) => (
                <button type="button" onClick={() => setValue('Clicked')}>
                  {String(value)}
                </button>
              )}
            </PropertyGrid.Editor>
          </div>
        </PropertyGrid.Category>
      </PropertyGrid>
    </div>
  ),
};

export const CustomSlotStyles: Story = {
  name: 'Slot Customization',
  args: {
    properties: widgetProps,
    styles: { root: { padding: 4 }, category: { padding: '4px' }, label: { fontSize: '13px' } },
    classNames: { root: 'custom-pg' },
  },
  decorators: [(Story) => <div style={{ width: 360 }}><Story /></div>],
};

export const Playground: Story = {
  args: { properties: widgetProps, showSearch: true },
  decorators: [(Story) => <div style={{ width: 360 }}><Story /></div>],
};

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Sortable } from './Sortable';

const items = ['Elma', 'Muz', 'Kiraz', 'Uzum', 'Portakal'];

const meta: Meta<typeof Sortable> = { title: 'Interaction/Sortable', component: Sortable, tags: ['autodocs'], parameters: { layout: 'centered' }, argTypes: { direction: { control: 'select', options: ['vertical', 'horizontal'] } } };
export default meta;
type Story = StoryObj<typeof Sortable>;

export const Default: Story = { args: { items, renderItem: (id) => id }, decorators: [(Story) => <div style={{ width: 300 }}><Story /></div>] };
export const Horizontal: Story = { name: 'Yatay / Horizontal', args: { items, direction: 'horizontal', renderItem: (id) => id } };
export const Compound: Story = { name: 'Compound API', render: () => (<div style={{ width: 300 }}><Sortable items={items}>{items.map((id) => (<Sortable.Item key={id} itemId={id}>{id}</Sortable.Item>))}</Sortable></div>) };
export const WithPlaceholder: Story = { name: 'Placeholder ile', render: () => (<div style={{ width: 300 }}><Sortable items={items}>{items.map((id) => (<Sortable.Item key={id} itemId={id}>{id}</Sortable.Item>))}<Sortable.Placeholder /></Sortable></div>) };
export const CustomSlotStyles: Story = { name: 'Slot Customization', args: { items, renderItem: (id) => id, styles: { root: { padding: 8 }, item: { padding: '12px' } }, classNames: { root: 'custom-s' } }, decorators: [(Story) => <div style={{ width: 300 }}><Story /></div>] };
export const ManyItems: Story = { name: 'Cok Oge', args: { items: Array.from({ length: 20 }, (_, i) => `Oge ${i + 1}`), renderItem: (id) => id }, decorators: [(Story) => <div style={{ width: 300 }}><Story /></div>] };
export const Playground: Story = { args: { items, direction: 'vertical', renderItem: (id) => id }, decorators: [(Story) => <div style={{ width: 300 }}><Story /></div>] };

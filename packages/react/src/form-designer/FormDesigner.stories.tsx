/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { FormDesigner } from './FormDesigner';

const meta: Meta<typeof FormDesigner> = { title: 'Form/FormDesigner', component: FormDesigner, tags: ['autodocs'], parameters: { layout: 'padded' } };
export default meta;
type Story = StoryObj<typeof FormDesigner>;

export const Default: Story = { args: {} };
export const WithPresetFields: Story = { args: { fields: [{ id: 'f1', order: 0, name: 'name', type: 'text', label: 'Isim' }, { id: 'f2', order: 1, name: 'email', type: 'email', label: 'E-posta' }] } };
export const Compound: Story = { render: () => (<FormDesigner><FormDesigner.Palette /><FormDesigner.Canvas /><FormDesigner.FieldConfig /></FormDesigner>) };
export const CustomSlotStyles: Story = { args: { styles: { root: { gap: 24 }, palette: { padding: 16 }, canvas: { padding: 20 } } } };
export const CompactView: Story = { args: {}, decorators: [(S) => <div style={{ width: 600 }}><S /></div>] };
export const WideView: Story = { args: {}, decorators: [(S) => <div style={{ width: 1000 }}><S /></div>] };
export const PaletteOnly: Story = { render: () => (<FormDesigner><FormDesigner.Palette /></FormDesigner>) };

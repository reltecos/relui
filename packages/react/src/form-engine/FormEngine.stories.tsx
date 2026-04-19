/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { FormEngine } from './FormEngine';

const meta: Meta<typeof FormEngine> = { title: 'Form/FormEngine', component: FormEngine, tags: ['autodocs'], parameters: { layout: 'centered' } };
export default meta;
type Story = StoryObj<typeof FormEngine>;

const FIELDS = [
  { name: 'name', type: 'text' as const, label: 'Isim', required: true, placeholder: 'Adinizi girin' },
  { name: 'email', type: 'email' as const, label: 'E-posta', required: true, placeholder: 'ornek@mail.com' },
  { name: 'age', type: 'number' as const, label: 'Yas', min: 0, max: 150 },
  { name: 'bio', type: 'textarea' as const, label: 'Hakkinda', placeholder: 'Kendinizi tanitin' },
  { name: 'role', type: 'select' as const, label: 'Rol', options: [{ label: 'Gelistirici', value: 'dev' }, { label: 'Tasarimci', value: 'design' }] },
  { name: 'terms', type: 'checkbox' as const, label: 'Kosullari kabul ediyorum', required: true },
];

export const Default: Story = { args: { fields: FIELDS }, decorators: [(S) => <div style={{ width: 400 }}><S /></div>] };
export const WithDefaults: Story = { args: { fields: FIELDS[0] ? [{ ...FIELDS[0], defaultValue: 'Ali' }, ...FIELDS.slice(1)] : FIELDS }, decorators: [(S) => <div style={{ width: 400 }}><S /></div>] };
export const MinimalFields: Story = { args: { fields: FIELDS.slice(0, 2) }, decorators: [(S) => <div style={{ width: 400 }}><S /></div>] };
export const AllTypes: Story = { args: { fields: FIELDS }, decorators: [(S) => <div style={{ width: 400 }}><S /></div>] };
export const Compound: Story = { render: () => (<div style={{ width: 400 }}><FormEngine fields={FIELDS}>{FIELDS.map((f) => <FormEngine.Field key={f.name} field={f} />)}<FormEngine.SubmitButton>Kaydet</FormEngine.SubmitButton></FormEngine></div>) };
export const CustomSlotStyles: Story = { args: { fields: FIELDS, styles: { root: { gap: 20 }, field: { padding: 8 }, submitButton: { borderRadius: 20 } } }, decorators: [(S) => <div style={{ width: 400 }}><S /></div>] };
export const WithValidation: Story = { args: { fields: [{ name: 'code', type: 'text' as const, label: 'Kod', required: true, pattern: '^[A-Z]{3}$', placeholder: 'ABC' }] }, decorators: [(S) => <div style={{ width: 400 }}><S /></div>] };

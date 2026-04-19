/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { FormEngine } from './FormEngine';
import type { FormFieldDef } from '@relteco/relui-core';

const FIELDS: FormFieldDef[] = [
  { name: 'name', type: 'text', label: 'Isim', required: true },
  { name: 'email', type: 'email', label: 'E-posta', required: true },
  { name: 'age', type: 'number', label: 'Yas' },
];

describe('FormEngine', () => {
  it('root render edilir', () => { render(<FormEngine fields={FIELDS} />); expect(screen.getByTestId('form-engine-root')).toBeInTheDocument(); });
  it('alanlar render edilir', () => { render(<FormEngine fields={FIELDS} />); expect(screen.getAllByTestId('form-engine-field')).toHaveLength(3); });
  it('label lar render edilir', () => { render(<FormEngine fields={FIELDS} />); expect(screen.getAllByTestId('form-engine-label')).toHaveLength(3); });
  it('input lar render edilir', () => { render(<FormEngine fields={FIELDS} />); expect(screen.getAllByTestId('form-engine-input')).toHaveLength(3); });
  it('submit butonu render edilir', () => { render(<FormEngine fields={FIELDS} />); expect(screen.getByTestId('form-engine-submitButton')).toBeInTheDocument(); });
  it('deger girilince guncellenir', () => { render(<FormEngine fields={FIELDS} />); const inputs = screen.getAllByTestId('form-engine-input'); fireEvent.change(inputs[0] as HTMLInputElement, { target: { value: 'Ali' } }); expect(inputs[0]).toHaveValue('Ali'); });
  it('required alan bos birakilinca hata gosterilir', () => { render(<FormEngine fields={FIELDS} />); const inputs = screen.getAllByTestId('form-engine-input'); fireEvent.blur(inputs[0] as HTMLInputElement); expect(screen.getByTestId('form-engine-error')).toBeInTheDocument(); });
  it('gecerli deger girilince hata gosterilmez', () => { render(<FormEngine fields={FIELDS} />); const inputs = screen.getAllByTestId('form-engine-input'); fireEvent.change(inputs[0] as HTMLInputElement, { target: { value: 'Ali' } }); fireEvent.blur(inputs[0] as HTMLInputElement); expect(screen.queryAllByTestId('form-engine-error')).toHaveLength(0); });
  it('submit gecerli formda onSubmit cagirir', () => { const onSubmit = vi.fn(); render(<FormEngine fields={[{ name: 'x', type: 'text', label: 'X' }]} onSubmit={onSubmit} />); const input = screen.getByTestId('form-engine-input'); fireEvent.change(input, { target: { value: 'test' } }); fireEvent.click(screen.getByTestId('form-engine-submitButton')); expect(onSubmit).toHaveBeenCalled(); });
  it('submit gecersiz formda onSubmit cagirilmaz', () => { const onSubmit = vi.fn(); render(<FormEngine fields={FIELDS} onSubmit={onSubmit} />); fireEvent.click(screen.getByTestId('form-engine-submitButton')); expect(onSubmit).not.toHaveBeenCalled(); });
  it('select alani render edilir', () => { render(<FormEngine fields={[{ name: 's', type: 'select', label: 'Sec', options: [{ label: 'A', value: 'a' }] }]} />); expect(screen.getByTestId('form-engine-input').tagName).toBe('SELECT'); });
  it('textarea alani render edilir', () => { render(<FormEngine fields={[{ name: 't', type: 'textarea', label: 'Metin' }]} />); expect(screen.getByTestId('form-engine-input').tagName).toBe('TEXTAREA'); });
  it('checkbox alani render edilir', () => { render(<FormEngine fields={[{ name: 'c', type: 'checkbox', label: 'Onay' }]} />); expect(screen.getByTestId('form-engine-input')).toHaveAttribute('type', 'checkbox'); });

  // ── Slot API ──
  it('className root elemana eklenir', () => { render(<FormEngine fields={FIELDS} className="my-fe" />); expect(screen.getByTestId('form-engine-root').className).toContain('my-fe'); });
  it('style root elemana eklenir', () => { render(<FormEngine fields={FIELDS} style={{ padding: '8px' }} />); expect(screen.getByTestId('form-engine-root')).toHaveStyle({ padding: '8px' }); });
  it('classNames.root eklenir', () => { render(<FormEngine fields={FIELDS} classNames={{ root: 'cr' }} />); expect(screen.getByTestId('form-engine-root').className).toContain('cr'); });
  it('styles.root eklenir', () => { render(<FormEngine fields={FIELDS} styles={{ root: { padding: '12px' } }} />); expect(screen.getByTestId('form-engine-root')).toHaveStyle({ padding: '12px' }); });
  it('classNames.field eklenir', () => { render(<FormEngine fields={FIELDS} classNames={{ field: 'cf' }} />); expect(screen.getAllByTestId('form-engine-field')[0]?.className).toContain('cf'); });
  it('styles.field eklenir', () => { render(<FormEngine fields={FIELDS} styles={{ field: { padding: '6px' } }} />); expect(screen.getAllByTestId('form-engine-field')[0]).toHaveStyle({ padding: '6px' }); });
  it('classNames.label eklenir', () => { render(<FormEngine fields={FIELDS} classNames={{ label: 'cl' }} />); expect(screen.getAllByTestId('form-engine-label')[0]?.className).toContain('cl'); });
  it('styles.label eklenir', () => { render(<FormEngine fields={FIELDS} styles={{ label: { fontSize: '16px' } }} />); expect(screen.getAllByTestId('form-engine-label')[0]).toHaveStyle({ fontSize: '16px' }); });
  it('classNames.submitButton eklenir', () => { render(<FormEngine fields={FIELDS} classNames={{ submitButton: 'cs' }} />); expect(screen.getByTestId('form-engine-submitButton').className).toContain('cs'); });
  it('styles.submitButton eklenir', () => { render(<FormEngine fields={FIELDS} styles={{ submitButton: { padding: '14px' } }} />); expect(screen.getByTestId('form-engine-submitButton')).toHaveStyle({ padding: '14px' }); });
  it('ref forward edilir', () => { const ref = vi.fn(); render(<FormEngine fields={FIELDS} ref={ref} />); expect(ref).toHaveBeenCalled(); });
});

describe('FormEngine (Compound)', () => {
  it('compound: Field render edilir', () => { render(<FormEngine fields={FIELDS}><FormEngine.Field field={FIELDS[0] as (typeof FIELDS)[0]} /></FormEngine>); expect(screen.getByTestId('form-engine-field')).toBeInTheDocument(); });
  it('compound: SubmitButton render edilir', () => { render(<FormEngine fields={FIELDS}><FormEngine.SubmitButton /></FormEngine>); expect(screen.getByTestId('form-engine-submitButton')).toBeInTheDocument(); });
  it('compound: classNames context ile aktarilir', () => { render(<FormEngine fields={FIELDS} classNames={{ field: 'cf' }}><FormEngine.Field field={FIELDS[0] as (typeof FIELDS)[0]} /></FormEngine>); expect(screen.getByTestId('form-engine-field').className).toContain('cf'); });
  it('compound: styles context ile aktarilir', () => { render(<FormEngine fields={FIELDS} styles={{ field: { padding: '20px' } }}><FormEngine.Field field={FIELDS[0] as (typeof FIELDS)[0]} /></FormEngine>); expect(screen.getByTestId('form-engine-field')).toHaveStyle({ padding: '20px' }); });
  it('FormEngine.Field context disinda hata firlatir', () => { expect(() => render(<FormEngine.Field field={FIELDS[0] as (typeof FIELDS)[0]} />)).toThrow(); });
});

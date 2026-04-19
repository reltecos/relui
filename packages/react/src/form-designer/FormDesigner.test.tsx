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
import { FormDesigner } from './FormDesigner';

describe('FormDesigner', () => {
  it('root render edilir', () => { render(<FormDesigner />); expect(screen.getByTestId('form-designer-root')).toBeInTheDocument(); });
  it('palette render edilir', () => { render(<FormDesigner />); expect(screen.getByTestId('form-designer-palette')).toBeInTheDocument(); });
  it('palette item lar render edilir', () => { render(<FormDesigner />); expect(screen.getAllByTestId('form-designer-paletteItem').length).toBeGreaterThanOrEqual(5); });
  it('canvas render edilir', () => { render(<FormDesigner />); expect(screen.getByTestId('form-designer-canvas')).toBeInTheDocument(); });
  it('fieldConfig render edilir', () => { render(<FormDesigner />); expect(screen.getByTestId('form-designer-fieldConfig')).toBeInTheDocument(); });
  it('palette item tiklaninca alan eklenir', () => { render(<FormDesigner />); const items = screen.getAllByTestId('form-designer-paletteItem'); fireEvent.click(items[0] as HTMLButtonElement); expect(screen.getByTestId('form-designer-canvasField')).toBeInTheDocument(); });
  it('alan eklendikten sonra config gosterilir', () => { render(<FormDesigner />); fireEvent.click(screen.getAllByTestId('form-designer-paletteItem')[0] as HTMLButtonElement); expect(screen.getByTestId('form-designer-configLabel')).toBeInTheDocument(); });
  it('alan silinir', () => { render(<FormDesigner />); fireEvent.click(screen.getAllByTestId('form-designer-paletteItem')[0] as HTMLButtonElement); fireEvent.click(screen.getByTestId('form-designer-removeButton')); expect(screen.queryByTestId('form-designer-canvasField')).not.toBeInTheDocument(); });
  it('alan label duzenlenebilir', () => { render(<FormDesigner />); fireEvent.click(screen.getAllByTestId('form-designer-paletteItem')[0] as HTMLButtonElement); const input = screen.getByTestId('form-designer-configLabel') as HTMLInputElement; fireEvent.change(input, { target: { value: 'Yeni Label' } }); expect(input.value).toBe('Yeni Label'); });
  it('required checkbox calisir', () => { render(<FormDesigner />); fireEvent.click(screen.getAllByTestId('form-designer-paletteItem')[0] as HTMLButtonElement); const cb = screen.getByTestId('form-designer-configRequired') as HTMLInputElement; fireEvent.click(cb); expect(cb.checked).toBe(true); });
  it('bos canvas mesaj gosterir', () => { render(<FormDesigner />); expect(screen.getByText('Paletten alan ekleyin')).toBeInTheDocument(); });
  it('birden fazla alan eklenebilir', () => { render(<FormDesigner />); const items = screen.getAllByTestId('form-designer-paletteItem'); fireEvent.click(items[0] as HTMLButtonElement); fireEvent.click(items[1] as HTMLButtonElement); expect(screen.getAllByTestId('form-designer-canvasField')).toHaveLength(2); });

  // ── Slot API ──
  it('className root elemana eklenir', () => { render(<FormDesigner className="my-fd" />); expect(screen.getByTestId('form-designer-root').className).toContain('my-fd'); });
  it('style root elemana eklenir', () => { render(<FormDesigner style={{ padding: '8px' }} />); expect(screen.getByTestId('form-designer-root')).toHaveStyle({ padding: '8px' }); });
  it('classNames.root eklenir', () => { render(<FormDesigner classNames={{ root: 'cr' }} />); expect(screen.getByTestId('form-designer-root').className).toContain('cr'); });
  it('styles.root eklenir', () => { render(<FormDesigner styles={{ root: { padding: '12px' } }} />); expect(screen.getByTestId('form-designer-root')).toHaveStyle({ padding: '12px' }); });
  it('classNames.palette eklenir', () => { render(<FormDesigner classNames={{ palette: 'cp' }} />); expect(screen.getByTestId('form-designer-palette').className).toContain('cp'); });
  it('styles.palette eklenir', () => { render(<FormDesigner styles={{ palette: { padding: '10px' } }} />); expect(screen.getByTestId('form-designer-palette')).toHaveStyle({ padding: '10px' }); });
  it('classNames.canvas eklenir', () => { render(<FormDesigner classNames={{ canvas: 'cc' }} />); expect(screen.getByTestId('form-designer-canvas').className).toContain('cc'); });
  it('styles.canvas eklenir', () => { render(<FormDesigner styles={{ canvas: { padding: '16px' } }} />); expect(screen.getByTestId('form-designer-canvas')).toHaveStyle({ padding: '16px' }); });
  it('classNames.fieldConfig eklenir', () => { render(<FormDesigner classNames={{ fieldConfig: 'cfc' }} />); expect(screen.getByTestId('form-designer-fieldConfig').className).toContain('cfc'); });
  it('styles.fieldConfig eklenir', () => { render(<FormDesigner styles={{ fieldConfig: { padding: '14px' } }} />); expect(screen.getByTestId('form-designer-fieldConfig')).toHaveStyle({ padding: '14px' }); });
  it('ref forward edilir', () => { const ref = vi.fn(); render(<FormDesigner ref={ref} />); expect(ref).toHaveBeenCalled(); });
});

describe('FormDesigner (Compound)', () => {
  it('compound: Palette render edilir', () => { render(<FormDesigner><FormDesigner.Palette /></FormDesigner>); expect(screen.getByTestId('form-designer-palette')).toBeInTheDocument(); });
  it('compound: Canvas render edilir', () => { render(<FormDesigner><FormDesigner.Canvas /></FormDesigner>); expect(screen.getByTestId('form-designer-canvas')).toBeInTheDocument(); });
  it('compound: FieldConfig render edilir', () => { render(<FormDesigner><FormDesigner.FieldConfig /></FormDesigner>); expect(screen.getByTestId('form-designer-fieldConfig')).toBeInTheDocument(); });
  it('compound: classNames context ile aktarilir', () => { render(<FormDesigner classNames={{ palette: 'cp' }}><FormDesigner.Palette /></FormDesigner>); expect(screen.getByTestId('form-designer-palette').className).toContain('cp'); });
  it('compound: styles context ile aktarilir', () => { render(<FormDesigner styles={{ palette: { padding: '20px' } }}><FormDesigner.Palette /></FormDesigner>); expect(screen.getByTestId('form-designer-palette')).toHaveStyle({ padding: '20px' }); });
  it('FormDesigner.Palette context disinda hata firlatir', () => { expect(() => render(<FormDesigner.Palette />)).toThrow(); });
});

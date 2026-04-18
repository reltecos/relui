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
import { PropertyGrid } from './PropertyGrid';
import type { PropertyDef } from '@relteco/relui-core';

const sampleProps: PropertyDef[] = [
  { key: 'name', label: 'Name', type: 'string', category: 'General', value: 'Widget' },
  { key: 'width', label: 'Width', type: 'number', category: 'Layout', value: 100 },
  { key: 'height', label: 'Height', type: 'number', category: 'Layout', value: 50 },
  { key: 'visible', label: 'Visible', type: 'boolean', category: 'General', value: true },
  { key: 'bg', label: 'Background', type: 'color', category: 'Appearance', value: '#ffffff' },
  { key: 'align', label: 'Align', type: 'enum', category: 'Layout', value: 'left', options: ['left', 'center', 'right'] },
  { key: 'id', label: 'ID', type: 'string', category: 'General', value: 'w1', readonly: true },
];

describe('PropertyGrid', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<PropertyGrid properties={sampleProps} />);
    expect(screen.getByTestId('propertygrid-root')).toBeInTheDocument();
  });

  it('root role grid', () => {
    render(<PropertyGrid properties={sampleProps} />);
    expect(screen.getByTestId('propertygrid-root')).toHaveAttribute('role', 'grid');
  });

  // ── Categories ──

  it('kategoriler render edilir', () => {
    render(<PropertyGrid properties={sampleProps} />);
    const cats = screen.getAllByTestId('propertygrid-category');
    expect(cats.length).toBe(3); // General, Layout, Appearance
  });

  it('kategori basliklari gorunur', () => {
    render(<PropertyGrid properties={sampleProps} />);
    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Layout')).toBeInTheDocument();
    expect(screen.getByText('Appearance')).toBeInTheDocument();
  });

  it('kategori tikla ile kapanir', () => {
    render(<PropertyGrid properties={sampleProps} />);
    fireEvent.click(screen.getByText('Layout'));
    expect(screen.queryByText('Width')).not.toBeInTheDocument();
  });

  it('kapali kategori tikla ile acilir', () => {
    render(<PropertyGrid properties={sampleProps} />);
    fireEvent.click(screen.getByText('Layout'));
    fireEvent.click(screen.getByText('Layout'));
    expect(screen.getByText('Width')).toBeInTheDocument();
  });

  // ── Properties ──

  it('ozellikler render edilir', () => {
    render(<PropertyGrid properties={sampleProps} />);
    const props = screen.getAllByTestId('propertygrid-property');
    expect(props.length).toBe(7);
  });

  it('label ler gorunur', () => {
    render(<PropertyGrid properties={sampleProps} />);
    const labels = screen.getAllByTestId('propertygrid-label');
    expect(labels.length).toBe(7);
    expect(labels[0]).toHaveTextContent('Name');
  });

  // ── Editors ──

  it('string editor text input', () => {
    render(<PropertyGrid properties={sampleProps} />);
    const inputs = screen.getAllByTestId('propertygrid-editor-text');
    expect((inputs[0] as HTMLInputElement).value).toBe('Widget');
  });

  it('number editor number input', () => {
    render(<PropertyGrid properties={sampleProps} />);
    const inputs = screen.getAllByTestId('propertygrid-editor-number');
    expect((inputs[0] as HTMLInputElement).value).toBe('100');
  });

  it('boolean editor checkbox', () => {
    render(<PropertyGrid properties={sampleProps} />);
    const cb = screen.getByTestId('propertygrid-editor-checkbox') as HTMLInputElement;
    expect(cb.checked).toBe(true);
  });

  it('color editor color input', () => {
    render(<PropertyGrid properties={sampleProps} />);
    const colorInput = screen.getByTestId('propertygrid-editor-color') as HTMLInputElement;
    expect(colorInput.type).toBe('color');
  });

  it('enum editor select', () => {
    render(<PropertyGrid properties={sampleProps} />);
    const select = screen.getByTestId('propertygrid-editor-select') as HTMLSelectElement;
    expect(select.value).toBe('left');
  });

  // ── Value editing ──

  it('string deger degistirilir', () => {
    const onValueChange = vi.fn();
    render(<PropertyGrid properties={sampleProps} onValueChange={onValueChange} />);
    const inputs = screen.getAllByTestId('propertygrid-editor-text');
    fireEvent.change(inputs[0] as HTMLElement, { target: { value: 'NewName' } });
    expect(onValueChange).toHaveBeenCalledWith('name', 'NewName');
  });

  it('number deger degistirilir', () => {
    const onValueChange = vi.fn();
    render(<PropertyGrid properties={sampleProps} onValueChange={onValueChange} />);
    const inputs = screen.getAllByTestId('propertygrid-editor-number');
    fireEvent.change(inputs[0] as HTMLElement, { target: { value: '200' } });
    expect(onValueChange).toHaveBeenCalledWith('width', 200);
  });

  it('boolean deger degistirilir', () => {
    const onValueChange = vi.fn();
    render(<PropertyGrid properties={sampleProps} onValueChange={onValueChange} />);
    const cb = screen.getByTestId('propertygrid-editor-checkbox') as HTMLInputElement;
    fireEvent.click(cb);
    expect(onValueChange).toHaveBeenCalledWith('visible', false);
  });

  it('enum deger degistirilir', () => {
    const onValueChange = vi.fn();
    render(<PropertyGrid properties={sampleProps} onValueChange={onValueChange} />);
    const select = screen.getByTestId('propertygrid-editor-select') as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'center' } });
    expect(onValueChange).toHaveBeenCalledWith('align', 'center');
  });

  it('readonly ozellik degistirilemez', () => {
    const onValueChange = vi.fn();
    render(<PropertyGrid properties={sampleProps} onValueChange={onValueChange} />);
    // ID is readonly — the last text input
    const inputs = screen.getAllByTestId('propertygrid-editor-text');
    const readonlyInput = inputs[inputs.length - 1] as HTMLInputElement;
    expect(readonlyInput.disabled).toBe(true);
  });

  // ── Search ──

  it('arama input gorunur', () => {
    render(<PropertyGrid properties={sampleProps} />);
    expect(screen.getByTestId('propertygrid-searchInput')).toBeInTheDocument();
  });

  it('arama ile filtreleme calisir', () => {
    render(<PropertyGrid properties={sampleProps} />);
    const searchInput = screen.getByTestId('propertygrid-searchInput');
    fireEvent.change(searchInput, { target: { value: 'width' } });
    const propEls = screen.getAllByTestId('propertygrid-property');
    expect(propEls.length).toBe(1);
  });

  it('showSearch false ise arama gizlenir', () => {
    render(<PropertyGrid properties={sampleProps} showSearch={false} />);
    expect(screen.queryByTestId('propertygrid-searchInput')).not.toBeInTheDocument();
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<PropertyGrid properties={sampleProps} className="my-pg" />);
    expect(screen.getByTestId('propertygrid-root').className).toContain('my-pg');
  });

  it('style root elemana eklenir', () => {
    render(<PropertyGrid properties={sampleProps} style={{ padding: '16px' }} />);
    expect(screen.getByTestId('propertygrid-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<PropertyGrid properties={sampleProps} classNames={{ root: 'c-root' }} />);
    expect(screen.getByTestId('propertygrid-root').className).toContain('c-root');
  });

  it('classNames.category category elemana eklenir', () => {
    render(<PropertyGrid properties={sampleProps} classNames={{ category: 'c-cat' }} />);
    const cats = screen.getAllByTestId('propertygrid-category');
    expect(cats[0]?.className).toContain('c-cat');
  });

  it('classNames.property property elemana eklenir', () => {
    render(<PropertyGrid properties={sampleProps} classNames={{ property: 'c-prop' }} />);
    const propEls = screen.getAllByTestId('propertygrid-property');
    expect(propEls[0]?.className).toContain('c-prop');
  });

  it('classNames.label label elemana eklenir', () => {
    render(<PropertyGrid properties={sampleProps} classNames={{ label: 'c-lbl' }} />);
    const labels = screen.getAllByTestId('propertygrid-label');
    expect(labels[0]?.className).toContain('c-lbl');
  });

  it('classNames.editor editor elemana eklenir', () => {
    render(<PropertyGrid properties={sampleProps} classNames={{ editor: 'c-ed' }} />);
    const editors = screen.getAllByTestId('propertygrid-editor');
    expect(editors[0]?.className).toContain('c-ed');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<PropertyGrid properties={sampleProps} styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('propertygrid-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.category category elemana eklenir', () => {
    render(<PropertyGrid properties={sampleProps} styles={{ category: { padding: '8px' } }} />);
    const cats = screen.getAllByTestId('propertygrid-category');
    expect(cats[0]).toHaveStyle({ padding: '8px' });
  });

  it('styles.property property elemana eklenir', () => {
    render(<PropertyGrid properties={sampleProps} styles={{ property: { padding: '4px' } }} />);
    const propEls = screen.getAllByTestId('propertygrid-property');
    expect(propEls[0]).toHaveStyle({ padding: '4px' });
  });

  it('styles.label label elemana eklenir', () => {
    render(<PropertyGrid properties={sampleProps} styles={{ label: { fontSize: '16px' } }} />);
    const labels = screen.getAllByTestId('propertygrid-label');
    expect(labels[0]).toHaveStyle({ fontSize: '16px' });
  });

  it('styles.editor editor elemana eklenir', () => {
    render(<PropertyGrid properties={sampleProps} styles={{ editor: { padding: '6px' } }} />);
    const editors = screen.getAllByTestId('propertygrid-editor');
    expect(editors[0]).toHaveStyle({ padding: '6px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<PropertyGrid ref={ref} properties={sampleProps} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('PropertyGrid (Compound)', () => {
  it('compound: category render edilir', () => {
    render(
      <PropertyGrid properties={sampleProps}>
        <PropertyGrid.Category label="General">
          <PropertyGrid.Property propertyKey="name" />
        </PropertyGrid.Category>
      </PropertyGrid>,
    );
    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('compound: property render edilir', () => {
    render(
      <PropertyGrid properties={sampleProps}>
        <PropertyGrid.Category label="Layout">
          <PropertyGrid.Property propertyKey="width" />
        </PropertyGrid.Category>
      </PropertyGrid>,
    );
    expect(screen.getByTestId('propertygrid-property')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <PropertyGrid properties={sampleProps} classNames={{ category: 'cmp-cat' }}>
        <PropertyGrid.Category label="General">
          <PropertyGrid.Property propertyKey="name" />
        </PropertyGrid.Category>
      </PropertyGrid>,
    );
    expect(screen.getByTestId('propertygrid-category').className).toContain('cmp-cat');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <PropertyGrid properties={sampleProps} styles={{ editor: { padding: '10px' } }}>
        <PropertyGrid.Category label="General">
          <PropertyGrid.Property propertyKey="name" />
        </PropertyGrid.Category>
      </PropertyGrid>,
    );
    expect(screen.getByTestId('propertygrid-editor')).toHaveStyle({ padding: '10px' });
  });

  it('compound: custom editor render calisir', () => {
    render(
      <PropertyGrid properties={sampleProps}>
        <PropertyGrid.Editor propertyKey="name">
          {(value, setValue) => (
            <button type="button" data-testid="custom-editor" onClick={() => setValue('Custom')}>
              {String(value)}
            </button>
          )}
        </PropertyGrid.Editor>
      </PropertyGrid>,
    );
    expect(screen.getByTestId('custom-editor')).toHaveTextContent('Widget');
  });

  it('PropertyGrid.Category context disinda hata firlatir', () => {
    expect(() => render(<PropertyGrid.Category label="Test" />)).toThrow();
  });
});

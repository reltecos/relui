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
import { FilterBuilder } from './FilterBuilder';
import type { FilterField, FilterGroup, FilterRule } from '@relteco/relui-core';

const fields: FilterField[] = [
  { key: 'name', label: 'Name', type: 'string' },
  { key: 'age', label: 'Age', type: 'number' },
  { key: 'email', label: 'Email', type: 'string' },
];

const groupWithRule: FilterGroup = {
  id: 'root',
  combinator: 'and',
  children: [{ id: 'r1', field: 'name', operator: '=', value: 'Ali' } as FilterRule],
};

describe('FilterBuilder', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<FilterBuilder fields={fields} />);
    expect(screen.getByTestId('filter-builder-root')).toBeInTheDocument();
  });

  it('grup render edilir', () => {
    render(<FilterBuilder fields={fields} />);
    expect(screen.getByTestId('filter-builder-group')).toBeInTheDocument();
  });

  it('combinator butonu render edilir', () => {
    render(<FilterBuilder fields={fields} />);
    expect(screen.getByTestId('filter-builder-combinator')).toHaveTextContent('AND');
  });

  it('combinator tiklaninca degisir', () => {
    render(<FilterBuilder fields={fields} />);
    fireEvent.click(screen.getByTestId('filter-builder-combinator'));
    expect(screen.getByTestId('filter-builder-combinator')).toHaveTextContent('OR');
  });

  // ── Rules ──

  it('varsayilan bostan baslar', () => {
    render(<FilterBuilder fields={fields} />);
    expect(screen.queryByTestId('filter-builder-rule')).not.toBeInTheDocument();
  });

  it('defaultGroup ile kural gosterilir', () => {
    render(<FilterBuilder fields={fields} defaultGroup={groupWithRule} />);
    expect(screen.getByTestId('filter-builder-rule')).toBeInTheDocument();
  });

  it('add rule butonuyla kural eklenir', () => {
    render(<FilterBuilder fields={fields} />);
    fireEvent.click(screen.getByTestId('filter-builder-add-rule'));
    expect(screen.getByTestId('filter-builder-rule')).toBeInTheDocument();
  });

  it('remove rule butonuyla kural silinir', () => {
    render(<FilterBuilder fields={fields} defaultGroup={groupWithRule} />);
    fireEvent.click(screen.getByTestId('filter-builder-remove-rule'));
    expect(screen.queryByTestId('filter-builder-rule')).not.toBeInTheDocument();
  });

  it('field select render edilir', () => {
    render(<FilterBuilder fields={fields} defaultGroup={groupWithRule} />);
    expect(screen.getByTestId('filter-builder-field')).toBeInTheDocument();
  });

  it('operator select render edilir', () => {
    render(<FilterBuilder fields={fields} defaultGroup={groupWithRule} />);
    expect(screen.getByTestId('filter-builder-operator')).toBeInTheDocument();
  });

  it('value input render edilir', () => {
    render(<FilterBuilder fields={fields} defaultGroup={groupWithRule} />);
    expect(screen.getByTestId('filter-builder-value')).toBeInTheDocument();
  });

  it('field degistirilir', () => {
    render(<FilterBuilder fields={fields} defaultGroup={groupWithRule} />);
    fireEvent.change(screen.getByTestId('filter-builder-field'), { target: { value: 'email' } });
    expect(screen.getByTestId('filter-builder-field')).toHaveValue('email');
  });

  it('operator degistirilir', () => {
    render(<FilterBuilder fields={fields} defaultGroup={groupWithRule} />);
    fireEvent.change(screen.getByTestId('filter-builder-operator'), { target: { value: 'contains' } });
    expect(screen.getByTestId('filter-builder-operator')).toHaveValue('contains');
  });

  it('value degistirilir', () => {
    render(<FilterBuilder fields={fields} defaultGroup={groupWithRule} />);
    fireEvent.change(screen.getByTestId('filter-builder-value'), { target: { value: 'Veli' } });
    expect(screen.getByTestId('filter-builder-value')).toHaveValue('Veli');
  });

  // ── Groups ──

  it('add group butonuyla alt grup eklenir', () => {
    render(<FilterBuilder fields={fields} />);
    fireEvent.click(screen.getByTestId('filter-builder-add-group'));
    expect(screen.getAllByTestId('filter-builder-group')).toHaveLength(2);
  });

  it('alt grup silinir', () => {
    render(<FilterBuilder fields={fields} />);
    fireEvent.click(screen.getByTestId('filter-builder-add-group'));
    fireEvent.click(screen.getByTestId('filter-builder-remove-group'));
    expect(screen.getAllByTestId('filter-builder-group')).toHaveLength(1);
  });

  it('onChange callback cagrilir', () => {
    const onChange = vi.fn();
    render(<FilterBuilder fields={fields} onChange={onChange} />);
    fireEvent.click(screen.getByTestId('filter-builder-add-rule'));
    expect(onChange).toHaveBeenCalled();
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<FilterBuilder fields={fields} className="my-fb" />);
    expect(screen.getByTestId('filter-builder-root').className).toContain('my-fb');
  });

  it('style root elemana eklenir', () => {
    render(<FilterBuilder fields={fields} style={{ padding: '24px' }} />);
    expect(screen.getByTestId('filter-builder-root')).toHaveStyle({ padding: '24px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<FilterBuilder fields={fields} classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('filter-builder-root').className).toContain('custom-root');
  });

  it('classNames.group group elemana eklenir', () => {
    render(<FilterBuilder fields={fields} classNames={{ group: 'custom-group' }} />);
    expect(screen.getByTestId('filter-builder-group').className).toContain('custom-group');
  });

  it('classNames.rule rule elemana eklenir', () => {
    render(<FilterBuilder fields={fields} defaultGroup={groupWithRule} classNames={{ rule: 'custom-rule' }} />);
    expect(screen.getByTestId('filter-builder-rule').className).toContain('custom-rule');
  });

  it('classNames.field field elemana eklenir', () => {
    render(<FilterBuilder fields={fields} defaultGroup={groupWithRule} classNames={{ field: 'custom-field' }} />);
    expect(screen.getByTestId('filter-builder-field').className).toContain('custom-field');
  });

  it('classNames.operator operator elemana eklenir', () => {
    render(<FilterBuilder fields={fields} defaultGroup={groupWithRule} classNames={{ operator: 'custom-op' }} />);
    expect(screen.getByTestId('filter-builder-operator').className).toContain('custom-op');
  });

  it('classNames.value value elemana eklenir', () => {
    render(<FilterBuilder fields={fields} defaultGroup={groupWithRule} classNames={{ value: 'custom-val' }} />);
    expect(screen.getByTestId('filter-builder-value').className).toContain('custom-val');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<FilterBuilder fields={fields} styles={{ root: { padding: '32px' } }} />);
    expect(screen.getByTestId('filter-builder-root')).toHaveStyle({ padding: '32px' });
  });

  it('styles.group group elemana eklenir', () => {
    render(<FilterBuilder fields={fields} styles={{ group: { padding: '16px' } }} />);
    expect(screen.getByTestId('filter-builder-group')).toHaveStyle({ padding: '16px' });
  });

  it('styles.rule rule elemana eklenir', () => {
    render(<FilterBuilder fields={fields} defaultGroup={groupWithRule} styles={{ rule: { padding: '8px' } }} />);
    expect(screen.getByTestId('filter-builder-rule')).toHaveStyle({ padding: '8px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<FilterBuilder fields={fields} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('FilterBuilder (Compound)', () => {
  it('compound: group render edilir', () => {
    render(
      <FilterBuilder fields={fields}>
        <FilterBuilder.Group />
      </FilterBuilder>,
    );
    expect(screen.getByTestId('filter-builder-group')).toBeInTheDocument();
  });

  it('compound: add button render edilir', () => {
    render(
      <FilterBuilder fields={fields}>
        <FilterBuilder.AddButton />
      </FilterBuilder>,
    );
    expect(screen.getByTestId('filter-builder-add-btn')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <FilterBuilder fields={fields} classNames={{ group: 'cmp-group' }}>
        <FilterBuilder.Group />
      </FilterBuilder>,
    );
    expect(screen.getByTestId('filter-builder-group').className).toContain('cmp-group');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <FilterBuilder fields={fields} styles={{ group: { padding: '20px' } }}>
        <FilterBuilder.Group />
      </FilterBuilder>,
    );
    expect(screen.getByTestId('filter-builder-group')).toHaveStyle({ padding: '20px' });
  });

  it('FilterBuilder.Group context disinda hata firlatir', () => {
    expect(() => render(<FilterBuilder.Group />)).toThrow();
  });
});

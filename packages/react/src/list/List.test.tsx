/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { List } from './List';

describe('List', () => {
  // ── Root ──

  it('root role="list" ile render edilir', () => {
    render(<List items={[]} />);
    expect(screen.getByTestId('list-root')).toBeInTheDocument();
    expect(screen.getByTestId('list-root')).toHaveAttribute('role', 'list');
  });

  // ── Props-based ──

  it('items prop ile item lar render edilir', () => {
    render(
      <List
        items={[
          { id: '1', primary: 'Elma' },
          { id: '2', primary: 'Armut' },
        ]}
      />,
    );
    const items = screen.getAllByTestId('list-item');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveAttribute('role', 'listitem');
  });

  it('primary metin render edilir', () => {
    render(<List items={[{ id: '1', primary: 'Elma' }]} />);
    expect(screen.getByTestId('list-item-primary')).toHaveTextContent('Elma');
  });

  it('secondary metin render edilir', () => {
    render(<List items={[{ id: '1', primary: 'Elma', secondary: 'Meyve' }]} />);
    expect(screen.getByTestId('list-item-secondary')).toHaveTextContent('Meyve');
  });

  it('secondary olmadan secondary render edilmez', () => {
    render(<List items={[{ id: '1', primary: 'Elma' }]} />);
    expect(screen.queryByTestId('list-item-secondary')).not.toBeInTheDocument();
  });

  it('icon render edilir', () => {
    render(
      <List items={[{ id: '1', primary: 'Elma', icon: <span data-testid="my-icon">I</span> }]} />,
    );
    expect(screen.getByTestId('list-item-icon')).toBeInTheDocument();
    expect(screen.getByTestId('my-icon')).toBeInTheDocument();
  });

  it('icon olmadan icon render edilmez', () => {
    render(<List items={[{ id: '1', primary: 'Elma' }]} />);
    expect(screen.queryByTestId('list-item-icon')).not.toBeInTheDocument();
  });

  it('action render edilir', () => {
    render(
      <List
        items={[{ id: '1', primary: 'Elma', action: <button>Sil</button> }]}
      />,
    );
    expect(screen.getByTestId('list-item-action')).toBeInTheDocument();
    expect(screen.getByText('Sil')).toBeInTheDocument();
  });

  it('action olmadan action render edilmez', () => {
    render(<List items={[{ id: '1', primary: 'Elma' }]} />);
    expect(screen.queryByTestId('list-item-action')).not.toBeInTheDocument();
  });

  // ── Compound ──

  it('compound List.Item ile render edilir', () => {
    render(
      <List>
        <List.Item primary="Elma" secondary="Meyve" />
        <List.Item primary="Havuc" />
      </List>,
    );
    const items = screen.getAllByTestId('list-item');
    expect(items).toHaveLength(2);
    expect(screen.getByText('Elma')).toBeInTheDocument();
    expect(screen.getByText('Meyve')).toBeInTheDocument();
    expect(screen.getByText('Havuc')).toBeInTheDocument();
  });

  it('compound List.Item icon ve action destekler', () => {
    render(
      <List>
        <List.Item
          primary="Dosya"
          icon={<span data-testid="compound-icon">IC</span>}
          action={<button>Ac</button>}
        />
      </List>,
    );
    expect(screen.getByTestId('compound-icon')).toBeInTheDocument();
    expect(screen.getByText('Ac')).toBeInTheDocument();
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<List className="my-list" items={[]} />);
    expect(screen.getByTestId('list-root').className).toContain('my-list');
  });

  it('style root elemana eklenir', () => {
    render(<List style={{ padding: '20px' }} items={[]} />);
    expect(screen.getByTestId('list-root')).toHaveStyle({ padding: '20px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<List classNames={{ root: 'custom-root' }} items={[]} />);
    expect(screen.getByTestId('list-root').className).toContain('custom-root');
  });

  it('classNames.item item elemana eklenir', () => {
    render(
      <List classNames={{ item: 'custom-item' }} items={[{ id: '1', primary: 'Test' }]} />,
    );
    expect(screen.getByTestId('list-item').className).toContain('custom-item');
  });

  it('classNames.itemPrimary primary elemana eklenir', () => {
    render(
      <List
        classNames={{ itemPrimary: 'custom-primary' }}
        items={[{ id: '1', primary: 'Test' }]}
      />,
    );
    expect(screen.getByTestId('list-item-primary').className).toContain('custom-primary');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<List styles={{ root: { padding: '24px' } }} items={[]} />);
    expect(screen.getByTestId('list-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.item item elemana eklenir', () => {
    render(
      <List styles={{ item: { padding: '16px' } }} items={[{ id: '1', primary: 'Test' }]} />,
    );
    expect(screen.getByTestId('list-item')).toHaveStyle({ padding: '16px' });
  });

  it('styles.itemPrimary primary elemana eklenir', () => {
    render(
      <List
        styles={{ itemPrimary: { fontSize: '18px' } }}
        items={[{ id: '1', primary: 'Test' }]}
      />,
    );
    expect(screen.getByTestId('list-item-primary')).toHaveStyle({ fontSize: '18px' });
  });

  it('styles.itemSecondary secondary elemana eklenir', () => {
    render(
      <List
        styles={{ itemSecondary: { fontSize: '14px' } }}
        items={[{ id: '1', primary: 'Test', secondary: 'Alt metin' }]}
      />,
    );
    expect(screen.getByTestId('list-item-secondary')).toHaveStyle({ fontSize: '14px' });
  });

  it('styles.itemIcon icon elemana eklenir', () => {
    render(
      <List
        styles={{ itemIcon: { padding: '20px' } }}
        items={[{ id: '1', primary: 'Test', icon: <span>I</span> }]}
      />,
    );
    expect(screen.getByTestId('list-item-icon')).toHaveStyle({ padding: '20px' });
  });

  it('styles.itemAction action elemana eklenir', () => {
    render(
      <List
        styles={{ itemAction: { opacity: '0.5' } }}
        items={[{ id: '1', primary: 'Test', action: <button>Sil</button> }]}
      />,
    );
    expect(screen.getByTestId('list-item-action')).toHaveStyle({ opacity: '0.5' });
  });

  // ── Compound + Slot API ──

  it('compound kullanim slot API destekler', () => {
    render(
      <List classNames={{ item: 'ctx-item' }} styles={{ itemPrimary: { fontWeight: '700' } }}>
        <List.Item primary="Slotlu" />
      </List>,
    );
    expect(screen.getByTestId('list-item').className).toContain('ctx-item');
    expect(screen.getByTestId('list-item-primary')).toHaveStyle({ fontWeight: '700' });
  });

  it('List.Item context disinda hata firlatir', () => {
    expect(() => render(<List.Item primary="Test" />)).toThrow();
  });
});

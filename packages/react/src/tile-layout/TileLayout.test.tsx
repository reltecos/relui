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
import { TileLayout } from './TileLayout';

const defaultRender = (tile: { id: string }) => <div>{tile.id}</div>;

describe('TileLayout', () => {
  it('renders empty with no tiles', () => {
    const { container } = render(
      <TileLayout renderTile={defaultRender} data-testid="root" />,
    );
    expect(screen.getByTestId('root')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-tile-id]')).toHaveLength(0);
  });

  it('renders tiles', () => {
    render(
      <TileLayout
        tiles={[
          { id: 'a', row: 0, col: 0 },
          { id: 'b', row: 0, col: 1 },
        ]}
        renderTile={defaultRender}
      />,
    );
    expect(screen.getByText('a')).toBeInTheDocument();
    expect(screen.getByText('b')).toBeInTheDocument();
  });

  it('applies grid layout styles', () => {
    render(
      <TileLayout
        data-testid="root"
        columns={4}
        rowHeight={150}
        gap={12}
        tiles={[{ id: 'a', row: 0, col: 0 }]}
        renderTile={defaultRender}
      />,
    );
    const root = screen.getByTestId('root');
    // display: grid CSS class'indan gelir (rootStyle), inline style degil
    expect(root).toHaveStyle({ gap: '12px' });
  });

  it('sets data-columns attribute', () => {
    render(
      <TileLayout
        data-testid="root"
        columns={5}
        tiles={[]}
        renderTile={defaultRender}
      />,
    );
    expect(screen.getByTestId('root')).toHaveAttribute('data-columns', '5');
  });

  it('sets data-total-rows attribute', () => {
    render(
      <TileLayout
        data-testid="root"
        tiles={[
          { id: 'a', row: 0, col: 0 },
          { id: 'b', row: 1, col: 0, rowSpan: 2 },
        ]}
        renderTile={defaultRender}
      />,
    );
    expect(screen.getByTestId('root')).toHaveAttribute('data-total-rows', '3');
  });

  it('sets data-tile-id on each tile', () => {
    const { container } = render(
      <TileLayout
        tiles={[
          { id: 'x', row: 0, col: 0 },
          { id: 'y', row: 0, col: 1 },
        ]}
        renderTile={defaultRender}
      />,
    );
    expect(container.querySelector('[data-tile-id="x"]')).toBeInTheDocument();
    expect(container.querySelector('[data-tile-id="y"]')).toBeInTheDocument();
  });

  it('applies grid placement to tiles', () => {
    const { container } = render(
      <TileLayout
        tiles={[{ id: 'a', row: 1, col: 2, rowSpan: 2, colSpan: 3 }]}
        renderTile={defaultRender}
      />,
    );
    const tile = container.querySelector('[data-tile-id="a"]') as HTMLElement;
    expect(tile).toHaveStyle({ gridRow: '2 / span 2' });
    expect(tile).toHaveStyle({ gridColumn: '3 / span 3' });
  });

  it('forwards ref', () => {
    let refValue: HTMLDivElement | null = null;
    render(
      <TileLayout
        ref={(el) => { refValue = el; }}
        data-testid="root"
        renderTile={defaultRender}
      />,
    );
    expect(refValue).toBe(screen.getByTestId('root'));
  });

  it('passes through HTML attributes', () => {
    render(
      <TileLayout
        data-testid="root"
        id="my-grid"
        aria-label="Tiles"
        renderTile={defaultRender}
      />,
    );
    const el = screen.getByTestId('root');
    expect(el).toHaveAttribute('id', 'my-grid');
    expect(el).toHaveAttribute('aria-label', 'Tiles');
  });

  it('has data-tile-layout attribute', () => {
    render(
      <TileLayout data-testid="root" renderTile={defaultRender} />,
    );
    expect(screen.getByTestId('root')).toHaveAttribute('data-tile-layout');
  });

  // ── Custom renderTile ───────────────────────────────────

  it('passes tile to renderTile', () => {
    render(
      <TileLayout
        tiles={[{ id: 'foo', row: 0, col: 0, rowSpan: 2, colSpan: 3 }]}
        renderTile={(tile) => (
          <div data-testid="custom">
            {tile.id}-{tile.rowSpan}-{tile.colSpan}
          </div>
        )}
      />,
    );
    expect(screen.getByTestId('custom')).toHaveTextContent('foo-2-3');
  });

  // ── classNames & styles ─────────────────────────────────

  describe('classNames & styles', () => {
    it('applies classNames.root', () => {
      render(
        <TileLayout
          data-testid="root"
          classNames={{ root: 'slot-root' }}
          renderTile={defaultRender}
        />,
      );
      expect(screen.getByTestId('root')).toHaveClass('slot-root');
    });

    it('applies styles.root', () => {
      render(
        <TileLayout
          data-testid="root"
          styles={{ root: { opacity: '0.9' } }}
          renderTile={defaultRender}
        />,
      );
      expect(screen.getByTestId('root')).toHaveStyle({ opacity: '0.9' });
    });

    it('merges className + classNames.root', () => {
      render(
        <TileLayout
          data-testid="root"
          className="outer"
          classNames={{ root: 'inner' }}
          renderTile={defaultRender}
        />,
      );
      const el = screen.getByTestId('root');
      expect(el).toHaveClass('outer');
      expect(el).toHaveClass('inner');
    });

    it('merges style + styles.root', () => {
      render(
        <TileLayout
          data-testid="root"
          style={{ margin: 4 }}
          styles={{ root: { padding: 8 } }}
          renderTile={defaultRender}
        />,
      );
      const el = screen.getByTestId('root');
      expect(el).toHaveStyle({ margin: '4px', padding: '8px' });
    });

    it('applies classNames.tile', () => {
      const { container } = render(
        <TileLayout
          tiles={[{ id: 'a', row: 0, col: 0 }]}
          classNames={{ tile: 'custom-tile' }}
          renderTile={defaultRender}
        />,
      );
      const tile = container.querySelector('[data-tile-id="a"]');
      expect(tile).toHaveClass('custom-tile');
    });

    it('applies styles.tile', () => {
      const { container } = render(
        <TileLayout
          tiles={[{ id: 'a', row: 0, col: 0 }]}
          styles={{ tile: { background: 'red' } }}
          renderTile={defaultRender}
        />,
      );
      const tile = container.querySelector('[data-tile-id="a"]') as HTMLElement;
      expect(tile).toHaveStyle({ background: 'red' });
    });
  });

  // ── Compound API ──────────────────────────────────────

  describe('compound API', () => {
    it('renders TileLayout.Tile with content', () => {
      render(
        <TileLayout columns={3}>
          <TileLayout.Tile row={0} col={0} id="t1">Tile 1 Content</TileLayout.Tile>
        </TileLayout>,
      );
      expect(screen.getByText('Tile 1 Content')).toBeInTheDocument();
    });

    it('renders TileLayout.Tile with data-tile-id', () => {
      const { container } = render(
        <TileLayout columns={3}>
          <TileLayout.Tile row={0} col={0} id="abc">Content</TileLayout.Tile>
        </TileLayout>,
      );
      expect(container.querySelector('[data-tile-id="abc"]')).toBeInTheDocument();
    });

    it('renders multiple TileLayout.Tile elements', () => {
      const { container } = render(
        <TileLayout columns={3}>
          <TileLayout.Tile row={0} col={0} id="a">A</TileLayout.Tile>
          <TileLayout.Tile row={0} col={1} id="b">B</TileLayout.Tile>
          <TileLayout.Tile row={1} col={0} id="c" colSpan={2}>C</TileLayout.Tile>
        </TileLayout>,
      );
      expect(container.querySelector('[data-tile-id="a"]')).toBeInTheDocument();
      expect(container.querySelector('[data-tile-id="b"]')).toBeInTheDocument();
      expect(container.querySelector('[data-tile-id="c"]')).toBeInTheDocument();
    });

    it('compound root has data-tile-layout attribute', () => {
      render(
        <TileLayout data-testid="root" columns={2}>
          <TileLayout.Tile row={0} col={0}>Content</TileLayout.Tile>
        </TileLayout>,
      );
      expect(screen.getByTestId('root')).toHaveAttribute('data-tile-layout');
    });

    it('TileLayout.Tile applies grid placement', () => {
      const { container } = render(
        <TileLayout columns={4}>
          <TileLayout.Tile row={1} col={2} rowSpan={2} colSpan={3} id="x">X</TileLayout.Tile>
        </TileLayout>,
      );
      const tile = container.querySelector('[data-tile-id="x"]') as HTMLElement;
      expect(tile).toHaveStyle({ gridRow: '2 / span 2' });
      expect(tile).toHaveStyle({ gridColumn: '3 / span 3' });
    });
  });
});

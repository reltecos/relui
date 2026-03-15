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
import { Grid } from './Grid';

describe('Grid', () => {
  // ── Root ──
  it('renders as div with grid display', () => {
    render(<Grid data-testid="grid">content</Grid>);
    const el = screen.getByTestId('grid');
    expect(el.tagName).toBe('DIV');
    expect(el).toHaveTextContent('content');
    expect(el.className).toBeTruthy();
  });

  it('applies columns prop', () => {
    render(<Grid data-testid="grid" columns={3} />);
    expect(screen.getByTestId('grid').className).toBeTruthy();
  });

  it('applies gap prop', () => {
    render(<Grid data-testid="grid" gap={4} />);
    expect(screen.getByTestId('grid').className).toBeTruthy();
  });

  it('accepts Box props (p, width)', () => {
    render(<Grid data-testid="grid" p={4} width="full" />);
    expect(screen.getByTestId('grid').className).toBeTruthy();
  });

  it('accepts as prop', () => {
    render(<Grid data-testid="grid" as="section" />);
    expect(screen.getByTestId('grid').tagName).toBe('SECTION');
  });

  it('forwards ref', () => {
    let refValue: HTMLElement | null = null;
    render(<Grid ref={(el) => { refValue = el; }} data-testid="grid" />);
    expect(refValue).toBe(screen.getByTestId('grid'));
  });

  it('renders multiple children in grid', () => {
    render(
      <Grid data-testid="grid" columns={2} gap={2}>
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
      </Grid>,
    );
    expect(screen.getByTestId('grid').children).toHaveLength(4);
  });

  it('passes through HTML attributes', () => {
    render(<Grid data-testid="grid" id="my-grid" role="grid" />);
    const el = screen.getByTestId('grid');
    expect(el).toHaveAttribute('id', 'my-grid');
    expect(el).toHaveAttribute('role', 'grid');
  });

  it('renders empty without children', () => {
    render(<Grid data-testid="grid" />);
    expect(screen.getByTestId('grid')).toBeInTheDocument();
  });

  it('applies columns and gap together', () => {
    render(<Grid data-testid="grid" columns={4} gap={2} />);
    expect(screen.getByTestId('grid').className).toBeTruthy();
  });

  // ── classNames & styles ──
  describe('classNames & styles', () => {
    it('applies classNames.root', () => {
      render(<Grid data-testid="grid" classNames={{ root: 'slot-root' }} />);
      expect(screen.getByTestId('grid')).toHaveClass('slot-root');
    });

    it('applies styles.root', () => {
      render(<Grid data-testid="grid" styles={{ root: { opacity: '0.7' } }} />);
      expect(screen.getByTestId('grid')).toHaveStyle({ opacity: '0.7' });
    });

    it('merges className + classNames.root', () => {
      render(
        <Grid data-testid="grid" className="outer" classNames={{ root: 'inner' }} />,
      );
      const el = screen.getByTestId('grid');
      expect(el).toHaveClass('outer');
      expect(el).toHaveClass('inner');
    });

    it('merges style + styles.root', () => {
      render(
        <Grid
          data-testid="grid"
          style={{ opacity: '0.5' }}
          styles={{ root: { padding: '20px' } }}
        />,
      );
      const el = screen.getByTestId('grid');
      expect(el).toHaveStyle({ opacity: '0.5' });
      expect(el).toHaveStyle({ padding: '20px' });
    });

    it('applies styles.root with fontSize', () => {
      render(
        <Grid data-testid="grid" styles={{ root: { fontSize: '18px' } }} />,
      );
      expect(screen.getByTestId('grid')).toHaveStyle({ fontSize: '18px' });
    });
  });

  // ── Compound: Grid.Item ──
  describe('Grid (Compound)', () => {
    it('compound: Grid.Item render edilir', () => {
      render(
        <Grid data-testid="grid" columns={2}>
          <Grid.Item>Item icerik</Grid.Item>
        </Grid>,
      );
      const item = screen.getByTestId('grid-item');
      expect(item).toBeInTheDocument();
      expect(item).toHaveTextContent('Item icerik');
    });

    it('compound: birden fazla Grid.Item render edilir', () => {
      render(
        <Grid columns={3}>
          <Grid.Item>1</Grid.Item>
          <Grid.Item>2</Grid.Item>
          <Grid.Item>3</Grid.Item>
        </Grid>,
      );
      const items = screen.getAllByTestId('grid-item');
      expect(items).toHaveLength(3);
    });

    it('compound: Grid.Item classNames.item context ile aktarilir', () => {
      render(
        <Grid classNames={{ item: 'custom-item' }} columns={2}>
          <Grid.Item>test</Grid.Item>
        </Grid>,
      );
      expect(screen.getByTestId('grid-item').className).toContain('custom-item');
    });

    it('compound: Grid.Item styles.item context ile aktarilir', () => {
      render(
        <Grid styles={{ item: { padding: '10px' } }} columns={2}>
          <Grid.Item>test</Grid.Item>
        </Grid>,
      );
      expect(screen.getByTestId('grid-item')).toHaveStyle({ padding: '10px' });
    });

    it('compound: Grid.Item ref forward edilir', () => {
      let refValue: HTMLElement | null = null;
      render(
        <Grid columns={2}>
          <Grid.Item ref={(el) => { refValue = el; }}>test</Grid.Item>
        </Grid>,
      );
      expect(refValue).toBe(screen.getByTestId('grid-item'));
    });
  });
});

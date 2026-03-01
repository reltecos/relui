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
  });
});

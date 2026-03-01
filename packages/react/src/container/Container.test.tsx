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
import { Container } from './Container';

describe('Container', () => {
  it('renders as div with max-width', () => {
    render(<Container data-testid="container">content</Container>);
    const el = screen.getByTestId('container');
    expect(el.tagName).toBe('DIV');
    expect(el).toHaveTextContent('content');
    expect(el).toHaveStyle({ maxWidth: '1024px' });
  });

  it('applies size=sm (640px)', () => {
    render(<Container data-testid="container" size="sm" />);
    expect(screen.getByTestId('container')).toHaveStyle({ maxWidth: '640px' });
  });

  it('applies size=md (768px)', () => {
    render(<Container data-testid="container" size="md" />);
    expect(screen.getByTestId('container')).toHaveStyle({ maxWidth: '768px' });
  });

  it('applies size=xl (1280px)', () => {
    render(<Container data-testid="container" size="xl" />);
    expect(screen.getByTestId('container')).toHaveStyle({ maxWidth: '1280px' });
  });

  it('applies size=2xl (1536px)', () => {
    render(<Container data-testid="container" size="2xl" />);
    expect(screen.getByTestId('container')).toHaveStyle({ maxWidth: '1536px' });
  });

  it('applies size=full (100%)', () => {
    render(<Container data-testid="container" size="full" />);
    expect(screen.getByTestId('container')).toHaveStyle({ maxWidth: '100%' });
  });

  it('accepts as prop', () => {
    render(<Container data-testid="container" as="main" />);
    expect(screen.getByTestId('container').tagName).toBe('MAIN');
  });

  it('forwards ref', () => {
    let refValue: HTMLElement | null = null;
    render(<Container ref={(el) => { refValue = el; }} data-testid="container" />);
    expect(refValue).toBe(screen.getByTestId('container'));
  });

  it('accepts Box props (p)', () => {
    render(<Container data-testid="container" p={4} />);
    expect(screen.getByTestId('container').className).toBeTruthy();
  });

  describe('classNames & styles', () => {
    it('applies classNames.root', () => {
      render(<Container data-testid="container" classNames={{ root: 'slot-root' }} />);
      expect(screen.getByTestId('container')).toHaveClass('slot-root');
    });

    it('applies styles.root', () => {
      render(
        <Container data-testid="container" styles={{ root: { opacity: '0.7' } }} />,
      );
      expect(screen.getByTestId('container')).toHaveStyle({ opacity: '0.7' });
    });

    it('merges className + classNames.root', () => {
      render(
        <Container
          data-testid="container"
          className="outer"
          classNames={{ root: 'inner' }}
        />,
      );
      const el = screen.getByTestId('container');
      expect(el).toHaveClass('outer');
      expect(el).toHaveClass('inner');
    });
  });
});

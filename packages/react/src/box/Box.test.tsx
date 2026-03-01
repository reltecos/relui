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
import { Box } from './Box';

describe('Box', () => {
  it('renders as div by default', () => {
    render(<Box data-testid="box">content</Box>);
    const el = screen.getByTestId('box');
    expect(el.tagName).toBe('DIV');
    expect(el).toHaveTextContent('content');
  });

  it('renders as custom element via as prop', () => {
    render(<Box as="section" data-testid="box">content</Box>);
    expect(screen.getByTestId('box').tagName).toBe('SECTION');
  });

  it('renders as nav element', () => {
    render(<Box as="nav" data-testid="box">nav</Box>);
    expect(screen.getByTestId('box').tagName).toBe('NAV');
  });

  it('passes through HTML attributes', () => {
    render(<Box data-testid="box" id="my-box" role="region" aria-label="test" />);
    const el = screen.getByTestId('box');
    expect(el).toHaveAttribute('id', 'my-box');
    expect(el).toHaveAttribute('role', 'region');
    expect(el).toHaveAttribute('aria-label', 'test');
  });

  it('applies className', () => {
    render(<Box data-testid="box" className="custom" />);
    expect(screen.getByTestId('box')).toHaveClass('custom');
  });

  it('applies inline style', () => {
    render(<Box data-testid="box" style={{ opacity: '0.5' }} />);
    expect(screen.getByTestId('box')).toHaveStyle({ opacity: '0.5' });
  });

  it('renders children', () => {
    render(
      <Box data-testid="box">
        <span>child1</span>
        <span>child2</span>
      </Box>,
    );
    const el = screen.getByTestId('box');
    expect(el.children).toHaveLength(2);
  });

  it('forwards ref', () => {
    let refValue: HTMLElement | null = null;
    render(<Box ref={(el) => { refValue = el; }} data-testid="box" />);
    expect(refValue).toBe(screen.getByTestId('box'));
  });

  it('applies sprinkles display prop as className', () => {
    render(<Box data-testid="box" display="flex" />);
    const el = screen.getByTestId('box');
    // Sprinkles atomic class uygulanmış olmalı
    expect(el.className).toBeTruthy();
  });

  it('applies multiple sprinkles props', () => {
    render(<Box data-testid="box" display="flex" flexDirection="column" gap={4} />);
    const el = screen.getByTestId('box');
    expect(el.className).toBeTruthy();
  });

  it('does not pass sprinkles props to DOM element', () => {
    render(<Box data-testid="box" display="flex" gap={4} />);
    const el = screen.getByTestId('box');
    // Sprinkles prop'ları DOM attribute olarak geçmemeli
    expect(el).not.toHaveAttribute('gap');
  });

  describe('classNames & styles', () => {
    it('applies classNames.root', () => {
      render(<Box data-testid="box" classNames={{ root: 'slot-root' }} />);
      expect(screen.getByTestId('box')).toHaveClass('slot-root');
    });

    it('applies styles.root', () => {
      render(<Box data-testid="box" styles={{ root: { opacity: '0.7' } }} />);
      expect(screen.getByTestId('box')).toHaveStyle({ opacity: '0.7' });
    });

    it('merges className + classNames.root', () => {
      render(
        <Box data-testid="box" className="outer" classNames={{ root: 'inner' }} />,
      );
      const el = screen.getByTestId('box');
      expect(el).toHaveClass('outer');
      expect(el).toHaveClass('inner');
    });

    it('merges style + styles.root (user override wins)', () => {
      render(
        <Box
          data-testid="box"
          style={{ opacity: '0.5', fontSize: '14px' }}
          styles={{ root: { opacity: '0.9' } }}
        />,
      );
      const el = screen.getByTestId('box');
      expect(el).toHaveStyle({ opacity: '0.9' });
      expect(el).toHaveStyle({ fontSize: '14px' });
    });

    it('merges sprinkles className + classNames.root + className', () => {
      render(
        <Box
          data-testid="box"
          display="flex"
          className="extra"
          classNames={{ root: 'slot' }}
        />,
      );
      const el = screen.getByTestId('box');
      expect(el).toHaveClass('extra');
      expect(el).toHaveClass('slot');
      // Sprinkles class da dahil
      expect(el.className.split(' ').length).toBeGreaterThanOrEqual(3);
    });
  });
});

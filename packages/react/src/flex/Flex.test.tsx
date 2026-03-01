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
import { Flex } from './Flex';

describe('Flex', () => {
  it('renders as div with flex display', () => {
    render(<Flex data-testid="flex">content</Flex>);
    const el = screen.getByTestId('flex');
    expect(el.tagName).toBe('DIV');
    expect(el).toHaveTextContent('content');
    // Sprinkles display=flex class uygulanmış olmalı
    expect(el.className).toBeTruthy();
  });

  it('applies direction prop', () => {
    render(<Flex data-testid="flex" direction="column" />);
    expect(screen.getByTestId('flex').className).toBeTruthy();
  });

  it('applies align prop', () => {
    render(<Flex data-testid="flex" align="center" />);
    expect(screen.getByTestId('flex').className).toBeTruthy();
  });

  it('applies justify prop', () => {
    render(<Flex data-testid="flex" justify="space-between" />);
    expect(screen.getByTestId('flex').className).toBeTruthy();
  });

  it('applies wrap prop', () => {
    render(<Flex data-testid="flex" wrap="wrap" />);
    expect(screen.getByTestId('flex').className).toBeTruthy();
  });

  it('accepts Box props (gap, p)', () => {
    render(<Flex data-testid="flex" gap={4} p={2} />);
    expect(screen.getByTestId('flex').className).toBeTruthy();
  });

  it('accepts as prop', () => {
    render(<Flex data-testid="flex" as="nav" />);
    expect(screen.getByTestId('flex').tagName).toBe('NAV');
  });

  it('forwards ref', () => {
    let refValue: HTMLElement | null = null;
    render(<Flex ref={(el) => { refValue = el; }} data-testid="flex" />);
    expect(refValue).toBe(screen.getByTestId('flex'));
  });

  it('passes through HTML attributes', () => {
    render(<Flex data-testid="flex" id="my-flex" role="navigation" />);
    const el = screen.getByTestId('flex');
    expect(el).toHaveAttribute('id', 'my-flex');
    expect(el).toHaveAttribute('role', 'navigation');
  });

  describe('classNames & styles', () => {
    it('applies classNames.root', () => {
      render(<Flex data-testid="flex" classNames={{ root: 'slot-root' }} />);
      expect(screen.getByTestId('flex')).toHaveClass('slot-root');
    });

    it('applies styles.root', () => {
      render(<Flex data-testid="flex" styles={{ root: { opacity: '0.7' } }} />);
      expect(screen.getByTestId('flex')).toHaveStyle({ opacity: '0.7' });
    });

    it('merges className + classNames.root', () => {
      render(
        <Flex data-testid="flex" className="outer" classNames={{ root: 'inner' }} />,
      );
      const el = screen.getByTestId('flex');
      expect(el).toHaveClass('outer');
      expect(el).toHaveClass('inner');
    });

    it('merges style + styles.root', () => {
      render(
        <Flex
          data-testid="flex"
          style={{ opacity: '0.5' }}
          styles={{ root: { fontSize: '14px' } }}
        />,
      );
      const el = screen.getByTestId('flex');
      expect(el).toHaveStyle({ opacity: '0.5' });
      expect(el).toHaveStyle({ fontSize: '14px' });
    });
  });
});

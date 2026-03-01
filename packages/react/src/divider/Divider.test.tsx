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
import { Divider } from './Divider';

describe('Divider', () => {
  it('renders as hr element', () => {
    render(<Divider data-testid="divider" />);
    const el = screen.getByTestId('divider');
    expect(el.tagName).toBe('HR');
  });

  it('applies horizontal orientation by default', () => {
    render(<Divider data-testid="divider" />);
    const el = screen.getByTestId('divider');
    expect(el.className).toBeTruthy();
    // Horizontal: role/aria-orientation yoktur
    expect(el).not.toHaveAttribute('role');
    expect(el).not.toHaveAttribute('aria-orientation');
  });

  it('applies vertical orientation with a11y attributes', () => {
    render(<Divider data-testid="divider" orientation="vertical" />);
    const el = screen.getByTestId('divider');
    expect(el).toHaveAttribute('role', 'separator');
    expect(el).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('applies variant prop', () => {
    render(<Divider data-testid="divider" variant="dashed" />);
    expect(screen.getByTestId('divider').className).toBeTruthy();
  });

  it('applies dotted variant', () => {
    render(<Divider data-testid="divider" variant="dotted" />);
    expect(screen.getByTestId('divider').className).toBeTruthy();
  });

  it('forwards ref', () => {
    let refValue: HTMLHRElement | null = null;
    render(<Divider ref={(el) => { refValue = el; }} data-testid="divider" />);
    expect(refValue).toBe(screen.getByTestId('divider'));
  });

  it('applies spacing prop', () => {
    render(<Divider data-testid="divider" spacing={4} />);
    expect(screen.getByTestId('divider').className).toBeTruthy();
  });

  describe('classNames & styles', () => {
    it('applies classNames.root', () => {
      render(<Divider data-testid="divider" classNames={{ root: 'slot-root' }} />);
      expect(screen.getByTestId('divider')).toHaveClass('slot-root');
    });

    it('applies styles.root', () => {
      render(
        <Divider data-testid="divider" styles={{ root: { opacity: '0.5' } }} />,
      );
      expect(screen.getByTestId('divider')).toHaveStyle({ opacity: '0.5' });
    });

    it('merges className + classNames.root', () => {
      render(
        <Divider
          data-testid="divider"
          className="outer"
          classNames={{ root: 'inner' }}
        />,
      );
      const el = screen.getByTestId('divider');
      expect(el).toHaveClass('outer');
      expect(el).toHaveClass('inner');
    });
  });
});

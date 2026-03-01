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
import { ResponsiveBox } from './ResponsiveBox';

describe('ResponsiveBox', () => {
  it('renders children', () => {
    render(
      <ResponsiveBox data-testid="box">
        <p>Content</p>
      </ResponsiveBox>,
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders as div by default', () => {
    render(<ResponsiveBox data-testid="box">Content</ResponsiveBox>);
    expect(screen.getByTestId('box').tagName).toBe('DIV');
  });

  it('applies sprinkles props', () => {
    render(<ResponsiveBox data-testid="box" display="flex" gap={4} />);
    expect(screen.getByTestId('box').className).toBeTruthy();
  });

  it('forwards ref', () => {
    let refValue: HTMLElement | null = null;
    render(
      <ResponsiveBox ref={(el) => { refValue = el; }} data-testid="box">
        Content
      </ResponsiveBox>,
    );
    expect(refValue).toBe(screen.getByTestId('box'));
  });

  it('passes through HTML attributes', () => {
    render(
      <ResponsiveBox data-testid="box" id="responsive" aria-label="layout">
        Content
      </ResponsiveBox>,
    );
    const el = screen.getByTestId('box');
    expect(el).toHaveAttribute('id', 'responsive');
  });

  it('supports polymorphic as prop', () => {
    render(
      <ResponsiveBox data-testid="box" as="section">
        Content
      </ResponsiveBox>,
    );
    expect(screen.getByTestId('box').tagName).toBe('SECTION');
  });

  describe('classNames & styles', () => {
    it('applies classNames.root', () => {
      render(
        <ResponsiveBox data-testid="box" classNames={{ root: 'slot-root' }}>
          Content
        </ResponsiveBox>,
      );
      expect(screen.getByTestId('box')).toHaveClass('slot-root');
    });

    it('applies styles.root', () => {
      render(
        <ResponsiveBox data-testid="box" styles={{ root: { opacity: '0.5' } }}>
          Content
        </ResponsiveBox>,
      );
      expect(screen.getByTestId('box')).toHaveStyle({ opacity: '0.5' });
    });

    it('merges className + classNames.root', () => {
      render(
        <ResponsiveBox data-testid="box" className="outer" classNames={{ root: 'inner' }}>
          Content
        </ResponsiveBox>,
      );
      const el = screen.getByTestId('box');
      expect(el).toHaveClass('outer');
      expect(el).toHaveClass('inner');
    });
  });
});

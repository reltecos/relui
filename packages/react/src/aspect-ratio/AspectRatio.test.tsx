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
import { AspectRatio } from './AspectRatio';

describe('AspectRatio', () => {
  it('renders as div with aspect-ratio: 1 by default', () => {
    render(<AspectRatio data-testid="ar">content</AspectRatio>);
    const el = screen.getByTestId('ar');
    expect(el.tagName).toBe('DIV');
    expect(el).toHaveStyle({ aspectRatio: '1' });
  });

  it('applies numeric ratio', () => {
    render(<AspectRatio data-testid="ar" ratio={16 / 9} />);
    const el = screen.getByTestId('ar');
    expect(el).toHaveStyle({ aspectRatio: String(16 / 9) });
  });

  it('applies string ratio', () => {
    render(<AspectRatio data-testid="ar" ratio="4/3" />);
    expect(screen.getByTestId('ar')).toHaveStyle({ aspectRatio: '4/3' });
  });

  it('renders children', () => {
    render(
      <AspectRatio data-testid="ar">
        <div data-testid="child">child</div>
      </AspectRatio>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('accepts as prop', () => {
    render(<AspectRatio data-testid="ar" as="figure" />);
    expect(screen.getByTestId('ar').tagName).toBe('FIGURE');
  });

  it('accepts Box props (width, p)', () => {
    render(<AspectRatio data-testid="ar" width="full" p={4} />);
    expect(screen.getByTestId('ar').className).toBeTruthy();
  });

  it('forwards ref', () => {
    let refValue: HTMLElement | null = null;
    render(<AspectRatio ref={(el) => { refValue = el; }} data-testid="ar" />);
    expect(refValue).toBe(screen.getByTestId('ar'));
  });

  describe('classNames & styles', () => {
    it('applies classNames.root', () => {
      render(<AspectRatio data-testid="ar" classNames={{ root: 'slot-root' }} />);
      expect(screen.getByTestId('ar')).toHaveClass('slot-root');
    });

    it('applies styles.root', () => {
      render(
        <AspectRatio data-testid="ar" styles={{ root: { opacity: '0.5' } }} />,
      );
      expect(screen.getByTestId('ar')).toHaveStyle({ opacity: '0.5' });
    });

    it('merges className + classNames.root', () => {
      render(
        <AspectRatio
          data-testid="ar"
          className="outer"
          classNames={{ root: 'inner' }}
        />,
      );
      const el = screen.getByTestId('ar');
      expect(el).toHaveClass('outer');
      expect(el).toHaveClass('inner');
    });
  });
});

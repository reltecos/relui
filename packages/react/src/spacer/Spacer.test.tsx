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
import { Spacer } from './Spacer';

describe('Spacer', () => {
  it('renders as div with flex: 1 by default', () => {
    render(<Spacer data-testid="spacer" />);
    const el = screen.getByTestId('spacer');
    expect(el.tagName).toBe('DIV');
    expect(el).toHaveStyle({ flex: '1' });
  });

  it('is aria-hidden', () => {
    render(<Spacer data-testid="spacer" />);
    expect(screen.getByTestId('spacer')).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies fixed size (number → px)', () => {
    render(<Spacer data-testid="spacer" size={24} />);
    const el = screen.getByTestId('spacer');
    expect(el).toHaveStyle({ width: '24px', height: '24px' });
  });

  it('applies fixed size (string)', () => {
    render(<Spacer data-testid="spacer" size="2rem" />);
    const el = screen.getByTestId('spacer');
    expect(el).toHaveStyle({ width: '2rem', height: '2rem' });
  });

  it('forwards ref', () => {
    let refValue: HTMLDivElement | null = null;
    render(<Spacer ref={(el) => { refValue = el; }} data-testid="spacer" />);
    expect(refValue).toBe(screen.getByTestId('spacer'));
  });

  describe('classNames & styles', () => {
    it('applies classNames.root', () => {
      render(<Spacer data-testid="spacer" classNames={{ root: 'slot-root' }} />);
      expect(screen.getByTestId('spacer')).toHaveClass('slot-root');
    });

    it('applies styles.root', () => {
      render(
        <Spacer data-testid="spacer" styles={{ root: { opacity: '0.5' } }} />,
      );
      expect(screen.getByTestId('spacer')).toHaveStyle({ opacity: '0.5' });
    });

    it('merges className + classNames.root', () => {
      render(
        <Spacer
          data-testid="spacer"
          className="outer"
          classNames={{ root: 'inner' }}
        />,
      );
      const el = screen.getByTestId('spacer');
      expect(el).toHaveClass('outer');
      expect(el).toHaveClass('inner');
    });
  });
});

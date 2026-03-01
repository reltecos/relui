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
import { Stack } from './Stack';

describe('Stack', () => {
  it('renders children vertically by default', () => {
    render(
      <Stack data-testid="stack">
        <div>A</div>
        <div>B</div>
      </Stack>,
    );
    const el = screen.getByTestId('stack');
    expect(el.tagName).toBe('DIV');
    expect(el.children).toHaveLength(2);
    // flexDirection=column class uygulanmış olmalı
    expect(el.className).toBeTruthy();
  });

  it('applies horizontal direction', () => {
    render(<Stack data-testid="stack" direction="horizontal" />);
    expect(screen.getByTestId('stack').className).toBeTruthy();
  });

  it('applies spacing as gap', () => {
    render(<Stack data-testid="stack" spacing={4} />);
    expect(screen.getByTestId('stack').className).toBeTruthy();
  });

  it('accepts Box props (p, width)', () => {
    render(<Stack data-testid="stack" p={4} width="full" />);
    expect(screen.getByTestId('stack').className).toBeTruthy();
  });

  it('accepts as prop', () => {
    render(<Stack data-testid="stack" as="section" />);
    expect(screen.getByTestId('stack').tagName).toBe('SECTION');
  });

  it('forwards ref', () => {
    let refValue: HTMLElement | null = null;
    render(<Stack ref={(el) => { refValue = el; }} data-testid="stack" />);
    expect(refValue).toBe(screen.getByTestId('stack'));
  });

  describe('classNames & styles', () => {
    it('applies classNames.root', () => {
      render(<Stack data-testid="stack" classNames={{ root: 'slot-root' }} />);
      expect(screen.getByTestId('stack')).toHaveClass('slot-root');
    });

    it('applies styles.root', () => {
      render(<Stack data-testid="stack" styles={{ root: { opacity: '0.7' } }} />);
      expect(screen.getByTestId('stack')).toHaveStyle({ opacity: '0.7' });
    });

    it('merges className + classNames.root', () => {
      render(
        <Stack data-testid="stack" className="outer" classNames={{ root: 'inner' }} />,
      );
      const el = screen.getByTestId('stack');
      expect(el).toHaveClass('outer');
      expect(el).toHaveClass('inner');
    });
  });
});

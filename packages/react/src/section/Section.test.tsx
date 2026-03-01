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
import { Section } from './Section';

describe('Section', () => {
  it('renders as section element', () => {
    render(<Section data-testid="section">content</Section>);
    const el = screen.getByTestId('section');
    expect(el.tagName).toBe('SECTION');
    expect(el).toHaveTextContent('content');
  });

  it('applies sprinkles props', () => {
    render(<Section data-testid="section" display="flex" gap={4} p={6} />);
    expect(screen.getByTestId('section').className).toBeTruthy();
  });

  it('passes through HTML attributes', () => {
    render(
      <Section data-testid="section" id="features" aria-labelledby="title" />,
    );
    const el = screen.getByTestId('section');
    expect(el).toHaveAttribute('id', 'features');
    expect(el).toHaveAttribute('aria-labelledby', 'title');
  });

  it('forwards ref', () => {
    let refValue: HTMLElement | null = null;
    render(<Section ref={(el) => { refValue = el; }} data-testid="section" />);
    expect(refValue).toBe(screen.getByTestId('section'));
  });

  describe('classNames & styles', () => {
    it('applies classNames.root', () => {
      render(<Section data-testid="section" classNames={{ root: 'slot-root' }} />);
      expect(screen.getByTestId('section')).toHaveClass('slot-root');
    });

    it('applies styles.root', () => {
      render(
        <Section data-testid="section" styles={{ root: { opacity: '0.7' } }} />,
      );
      expect(screen.getByTestId('section')).toHaveStyle({ opacity: '0.7' });
    });

    it('merges className + classNames.root', () => {
      render(
        <Section
          data-testid="section"
          className="outer"
          classNames={{ root: 'inner' }}
        />,
      );
      const el = screen.getByTestId('section');
      expect(el).toHaveClass('outer');
      expect(el).toHaveClass('inner');
    });
  });
});

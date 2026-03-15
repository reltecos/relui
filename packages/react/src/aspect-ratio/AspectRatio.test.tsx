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
  // ── Root ──
  it('renders as div with aspect-ratio: 1 by default', () => {
    render(<AspectRatio>content</AspectRatio>);
    const el = screen.getByTestId('aspect-ratio-root');
    expect(el.tagName).toBe('DIV');
    expect(el).toHaveStyle({ aspectRatio: '1' });
  });

  it('applies numeric ratio', () => {
    render(<AspectRatio ratio={16 / 9} />);
    const el = screen.getByTestId('aspect-ratio-root');
    expect(el).toHaveStyle({ aspectRatio: String(16 / 9) });
  });

  it('applies string ratio', () => {
    render(<AspectRatio ratio="4/3" />);
    expect(screen.getByTestId('aspect-ratio-root')).toHaveStyle({ aspectRatio: '4/3' });
  });

  it('applies ratio 1 for square', () => {
    render(<AspectRatio ratio={1} />);
    expect(screen.getByTestId('aspect-ratio-root')).toHaveStyle({ aspectRatio: '1' });
  });

  it('renders children', () => {
    render(
      <AspectRatio>
        <div data-testid="child">child</div>
      </AspectRatio>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders empty without children', () => {
    render(<AspectRatio />);
    expect(screen.getByTestId('aspect-ratio-root')).toBeInTheDocument();
  });

  it('accepts Box props (width, p)', () => {
    render(<AspectRatio width="full" p={4} />);
    expect(screen.getByTestId('aspect-ratio-root').className).toBeTruthy();
  });

  it('forwards ref', () => {
    let refValue: HTMLElement | null = null;
    render(<AspectRatio ref={(el) => { refValue = el; }} />);
    expect(refValue).toBe(screen.getByTestId('aspect-ratio-root'));
  });

  it('passes through HTML attributes', () => {
    render(<AspectRatio id="my-ar" role="img" aria-label="photo" />);
    const el = screen.getByTestId('aspect-ratio-root');
    expect(el).toHaveAttribute('id', 'my-ar');
    expect(el).toHaveAttribute('role', 'img');
    expect(el).toHaveAttribute('aria-label', 'photo');
  });

  it('renders with data-testid', () => {
    render(<AspectRatio />);
    expect(screen.getByTestId('aspect-ratio-root')).toBeInTheDocument();
  });

  it('applies className', () => {
    render(<AspectRatio className="custom" />);
    expect(screen.getByTestId('aspect-ratio-root')).toHaveClass('custom');
  });

  it('applies inline style', () => {
    render(<AspectRatio style={{ opacity: '0.5' }} />);
    expect(screen.getByTestId('aspect-ratio-root')).toHaveStyle({ opacity: '0.5' });
  });

  it('renders multiple children', () => {
    render(
      <AspectRatio>
        <div>1</div>
        <div>2</div>
      </AspectRatio>,
    );
    expect(screen.getByTestId('aspect-ratio-root').children).toHaveLength(2);
  });

  it('applies widescreen ratio', () => {
    render(<AspectRatio ratio={21 / 9} />);
    expect(screen.getByTestId('aspect-ratio-root')).toHaveStyle({ aspectRatio: String(21 / 9) });
  });

  // ── classNames & styles ──
  describe('classNames & styles', () => {
    it('applies classNames.root', () => {
      render(<AspectRatio classNames={{ root: 'slot-root' }} />);
      expect(screen.getByTestId('aspect-ratio-root')).toHaveClass('slot-root');
    });

    it('applies styles.root', () => {
      render(<AspectRatio styles={{ root: { opacity: '0.5' } }} />);
      expect(screen.getByTestId('aspect-ratio-root')).toHaveStyle({ opacity: '0.5' });
    });

    it('merges className + classNames.root', () => {
      render(<AspectRatio className="outer" classNames={{ root: 'inner' }} />);
      const el = screen.getByTestId('aspect-ratio-root');
      expect(el).toHaveClass('outer');
      expect(el).toHaveClass('inner');
    });

    it('merges style + styles.root', () => {
      render(
        <AspectRatio
          style={{ opacity: '0.5' }}
          styles={{ root: { padding: '20px' } }}
        />,
      );
      const el = screen.getByTestId('aspect-ratio-root');
      expect(el).toHaveStyle({ opacity: '0.5' });
      expect(el).toHaveStyle({ padding: '20px' });
    });

    it('styles.root with fontSize', () => {
      render(<AspectRatio styles={{ root: { fontSize: '18px' } }} />);
      expect(screen.getByTestId('aspect-ratio-root')).toHaveStyle({ fontSize: '18px' });
    });

    it('classNames.root + ratio birlikte calisir', () => {
      render(<AspectRatio ratio={16 / 9} classNames={{ root: 'wide-ar' }} />);
      const el = screen.getByTestId('aspect-ratio-root');
      expect(el).toHaveClass('wide-ar');
      expect(el).toHaveStyle({ aspectRatio: String(16 / 9) });
    });
  });
});

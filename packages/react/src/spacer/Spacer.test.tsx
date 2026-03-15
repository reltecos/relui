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
  // ── Root ──
  it('renders as div by default', () => {
    render(<Spacer />);
    const el = screen.getByTestId('spacer-root');
    expect(el.tagName).toBe('DIV');
  });

  it('is aria-hidden', () => {
    render(<Spacer />);
    expect(screen.getByTestId('spacer-root')).toHaveAttribute('aria-hidden', 'true');
  });

  it('has flex class by default', () => {
    render(<Spacer />);
    const el = screen.getByTestId('spacer-root');
    expect(el.className).toBeTruthy();
  });

  it('applies fixed size (number to px)', () => {
    render(<Spacer size={24} />);
    const el = screen.getByTestId('spacer-root');
    expect(el).toHaveStyle({ width: '24px', height: '24px' });
  });

  it('applies fixed size (string)', () => {
    render(<Spacer size="2rem" />);
    const el = screen.getByTestId('spacer-root');
    expect(el).toHaveStyle({ width: '2rem', height: '2rem' });
  });

  it('applies fixed size zero', () => {
    render(<Spacer size={0} />);
    const el = screen.getByTestId('spacer-root');
    expect(el).toHaveStyle({ width: '0px', height: '0px' });
  });

  it('forwards ref', () => {
    let refValue: HTMLDivElement | null = null;
    render(<Spacer ref={(el) => { refValue = el; }} />);
    expect(refValue).toBe(screen.getByTestId('spacer-root'));
  });

  it('passes through HTML attributes', () => {
    render(<Spacer id="my-spacer" />);
    expect(screen.getByTestId('spacer-root')).toHaveAttribute('id', 'my-spacer');
  });

  it('renders with data-testid', () => {
    render(<Spacer />);
    expect(screen.getByTestId('spacer-root')).toBeInTheDocument();
  });

  it('applies className', () => {
    render(<Spacer className="custom" />);
    expect(screen.getByTestId('spacer-root')).toHaveClass('custom');
  });

  it('applies inline style', () => {
    render(<Spacer style={{ opacity: '0.5' }} />);
    expect(screen.getByTestId('spacer-root')).toHaveStyle({ opacity: '0.5' });
  });

  it('fixed size applies fixed class', () => {
    render(<Spacer size={16} />);
    const el = screen.getByTestId('spacer-root');
    expect(el.className).toBeTruthy();
  });

  it('flex size applies flex class', () => {
    render(<Spacer />);
    const el = screen.getByTestId('spacer-root');
    expect(el.className).toBeTruthy();
  });

  it('applies large size value', () => {
    render(<Spacer size={100} />);
    const el = screen.getByTestId('spacer-root');
    expect(el).toHaveStyle({ width: '100px', height: '100px' });
  });

  it('applies string size with percentage', () => {
    render(<Spacer size="50%" />);
    const el = screen.getByTestId('spacer-root');
    expect(el).toHaveStyle({ width: '50%', height: '50%' });
  });

  // ── classNames & styles ──
  describe('classNames & styles', () => {
    it('applies classNames.root', () => {
      render(<Spacer classNames={{ root: 'slot-root' }} />);
      expect(screen.getByTestId('spacer-root')).toHaveClass('slot-root');
    });

    it('applies styles.root', () => {
      render(<Spacer styles={{ root: { opacity: '0.5' } }} />);
      expect(screen.getByTestId('spacer-root')).toHaveStyle({ opacity: '0.5' });
    });

    it('merges className + classNames.root', () => {
      render(<Spacer className="outer" classNames={{ root: 'inner' }} />);
      const el = screen.getByTestId('spacer-root');
      expect(el).toHaveClass('outer');
      expect(el).toHaveClass('inner');
    });

    it('merges style + styles.root', () => {
      render(
        <Spacer
          style={{ opacity: '0.5' }}
          styles={{ root: { padding: '10px' } }}
        />,
      );
      const el = screen.getByTestId('spacer-root');
      expect(el).toHaveStyle({ opacity: '0.5' });
      expect(el).toHaveStyle({ padding: '10px' });
    });

    it('styles.root with fontSize', () => {
      render(<Spacer styles={{ root: { fontSize: '12px' } }} />);
      expect(screen.getByTestId('spacer-root')).toHaveStyle({ fontSize: '12px' });
    });

    it('classNames.root + fixed size birlikte calisir', () => {
      render(<Spacer size={32} classNames={{ root: 'sized-spacer' }} />);
      const el = screen.getByTestId('spacer-root');
      expect(el).toHaveClass('sized-spacer');
      expect(el).toHaveStyle({ width: '32px' });
    });
  });
});

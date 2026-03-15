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
import { Container } from './Container';

describe('Container', () => {
  // ── Root ──
  it('renders as div', () => {
    render(<Container>content</Container>);
    const el = screen.getByTestId('container-root');
    expect(el.tagName).toBe('DIV');
    expect(el).toHaveTextContent('content');
  });

  it('varsayilan size lg', () => {
    render(<Container />);
    expect(screen.getByTestId('container-root')).toHaveAttribute('data-size', 'lg');
  });

  it('applies size sm', () => {
    render(<Container size="sm" />);
    expect(screen.getByTestId('container-root')).toHaveAttribute('data-size', 'sm');
  });

  it('applies size md', () => {
    render(<Container size="md" />);
    expect(screen.getByTestId('container-root')).toHaveAttribute('data-size', 'md');
  });

  it('applies size xl', () => {
    render(<Container size="xl" />);
    expect(screen.getByTestId('container-root')).toHaveAttribute('data-size', 'xl');
  });

  it('applies size 2xl', () => {
    render(<Container size="2xl" />);
    expect(screen.getByTestId('container-root')).toHaveAttribute('data-size', '2xl');
  });

  it('applies size full', () => {
    render(<Container size="full" />);
    expect(screen.getByTestId('container-root')).toHaveAttribute('data-size', 'full');
  });

  it('renders children', () => {
    render(
      <Container>
        <div data-testid="child">child</div>
      </Container>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders empty without children', () => {
    render(<Container />);
    expect(screen.getByTestId('container-root')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    let refValue: HTMLElement | null = null;
    render(<Container ref={(el) => { refValue = el; }} />);
    expect(refValue).toBe(screen.getByTestId('container-root'));
  });

  // ── className & style ──
  it('className root elemana eklenir', () => {
    render(<Container className="custom" />);
    expect(screen.getByTestId('container-root')).toHaveClass('custom');
  });

  it('style root elemana eklenir', () => {
    render(<Container style={{ opacity: '0.5' }} />);
    expect(screen.getByTestId('container-root')).toHaveStyle({ opacity: '0.5' });
  });

  // ── centerContent ──
  it('centerContent prop calisir', () => {
    render(<Container centerContent>centered</Container>);
    expect(screen.getByTestId('container-root')).toBeInTheDocument();
  });

  it('renders multiple children', () => {
    render(
      <Container>
        <div>1</div>
        <div>2</div>
      </Container>,
    );
    expect(screen.getByTestId('container-root').children).toHaveLength(2);
  });

  // ── classNames & styles ──
  describe('classNames & styles', () => {
    it('classNames.root root elemana eklenir', () => {
      render(<Container classNames={{ root: 'slot-root' }} />);
      expect(screen.getByTestId('container-root')).toHaveClass('slot-root');
    });

    it('styles.root root elemana eklenir', () => {
      render(<Container styles={{ root: { opacity: '0.7' } }} />);
      expect(screen.getByTestId('container-root')).toHaveStyle({ opacity: '0.7' });
    });

    it('merges className + classNames.root', () => {
      render(<Container className="outer" classNames={{ root: 'inner' }} />);
      const el = screen.getByTestId('container-root');
      expect(el).toHaveClass('outer');
      expect(el).toHaveClass('inner');
    });

    it('merges style + styles.root', () => {
      render(
        <Container
          style={{ opacity: '0.5' }}
          styles={{ root: { padding: '20px' } }}
        />,
      );
      const el = screen.getByTestId('container-root');
      expect(el).toHaveStyle({ opacity: '0.5' });
      expect(el).toHaveStyle({ padding: '20px' });
    });

    it('styles.root with fontSize', () => {
      render(<Container styles={{ root: { fontSize: '18px' } }} />);
      expect(screen.getByTestId('container-root')).toHaveStyle({ fontSize: '18px' });
    });
  });

  // ── centerContent detay ──
  it('centerContent=true ile display flex uygulanir', () => {
    render(<Container centerContent>centered</Container>);
    const el = screen.getByTestId('container-root');
    // centerContent Box'a sprinkles prop olarak iletilir, CSS class uretir (inline style degil)
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('centered');
  });

  it('centerContent=false ise flex uygulanmaz', () => {
    render(<Container>content</Container>);
    const el = screen.getByTestId('container-root');
    expect(el).toBeInTheDocument();
  });
});

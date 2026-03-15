/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
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

// ── Compound API ──

describe('ResponsiveBox (Compound)', () => {
  it('compound: ResponsiveBox.Item render edilir', () => {
    render(
      <ResponsiveBox data-testid="box" display="flex">
        <ResponsiveBox.Item>Oge 1</ResponsiveBox.Item>
      </ResponsiveBox>,
    );
    expect(screen.getByTestId('responsive-box-item')).toBeInTheDocument();
    expect(screen.getByText('Oge 1')).toBeInTheDocument();
  });

  it('compound: birden fazla Item render edilir', () => {
    render(
      <ResponsiveBox data-testid="box" display="flex">
        <ResponsiveBox.Item>A</ResponsiveBox.Item>
        <ResponsiveBox.Item>B</ResponsiveBox.Item>
      </ResponsiveBox>,
    );
    const items = screen.getAllByTestId('responsive-box-item');
    expect(items).toHaveLength(2);
  });

  it('compound: Item classNames.item context ile uygulanir', () => {
    render(
      <ResponsiveBox display="flex" classNames={{ item: 'custom-item' }}>
        <ResponsiveBox.Item>Oge</ResponsiveBox.Item>
      </ResponsiveBox>,
    );
    expect(screen.getByTestId('responsive-box-item').className).toContain('custom-item');
  });

  it('compound: Item styles.item context ile uygulanir', () => {
    render(
      <ResponsiveBox display="flex" styles={{ item: { padding: '12px' } }}>
        <ResponsiveBox.Item>Oge</ResponsiveBox.Item>
      </ResponsiveBox>,
    );
    expect(screen.getByTestId('responsive-box-item')).toHaveStyle({ padding: '12px' });
  });

  it('compound: Item ref forward edilir', () => {
    const ref = vi.fn();
    render(
      <ResponsiveBox display="flex">
        <ResponsiveBox.Item ref={ref}>Oge</ResponsiveBox.Item>
      </ResponsiveBox>,
    );
    expect(ref).toHaveBeenCalled();
  });

  it('compound: Item className merge edilir', () => {
    render(
      <ResponsiveBox display="flex">
        <ResponsiveBox.Item className="extra">Oge</ResponsiveBox.Item>
      </ResponsiveBox>,
    );
    expect(screen.getByTestId('responsive-box-item').className).toContain('extra');
  });

  it('compound: Item context disinda hata firlatir', () => {
    expect(() => {
      render(<ResponsiveBox.Item>Oge</ResponsiveBox.Item>);
    }).toThrow();
  });

  it('compound: styles.root uygulanir', () => {
    render(
      <ResponsiveBox data-testid="box" styles={{ root: { padding: '20px' } }}>
        Content
      </ResponsiveBox>,
    );
    expect(screen.getByTestId('box')).toHaveStyle({ padding: '20px' });
  });

  it('compound: birden fazla Item farkli icerikle render edilir', () => {
    render(
      <ResponsiveBox display="flex">
        <ResponsiveBox.Item>A</ResponsiveBox.Item>
        <ResponsiveBox.Item>B</ResponsiveBox.Item>
        <ResponsiveBox.Item>C</ResponsiveBox.Item>
      </ResponsiveBox>,
    );
    const items = screen.getAllByTestId('responsive-box-item');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('A');
    expect(items[2]).toHaveTextContent('C');
  });

  it('compound: rules prop kabul edilir', () => {
    render(
      <ResponsiveBox
        data-testid="box"
        display="flex"
        rules={[{ minWidth: 640, props: { gap: 8 } }]}
      >
        <ResponsiveBox.Item>Oge</ResponsiveBox.Item>
      </ResponsiveBox>,
    );
    expect(screen.getByTestId('box')).toBeInTheDocument();
  });
});

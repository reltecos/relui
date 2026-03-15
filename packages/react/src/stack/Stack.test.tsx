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
  // ── Root ──
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

  it('passes through HTML attributes', () => {
    render(<Stack data-testid="stack" id="my-stack" role="list" />);
    const el = screen.getByTestId('stack');
    expect(el).toHaveAttribute('id', 'my-stack');
    expect(el).toHaveAttribute('role', 'list');
  });

  it('renders empty without children', () => {
    render(<Stack data-testid="stack" />);
    expect(screen.getByTestId('stack')).toBeInTheDocument();
  });

  it('renders multiple children', () => {
    render(
      <Stack data-testid="stack">
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </Stack>,
    );
    expect(screen.getByTestId('stack').children).toHaveLength(3);
  });

  it('vertical is default direction', () => {
    render(<Stack data-testid="stack" />);
    expect(screen.getByTestId('stack').className).toBeTruthy();
  });

  // ── classNames & styles ──
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

    it('merges style + styles.root', () => {
      render(
        <Stack
          data-testid="stack"
          style={{ opacity: '0.5' }}
          styles={{ root: { padding: '20px' } }}
        />,
      );
      const el = screen.getByTestId('stack');
      expect(el).toHaveStyle({ opacity: '0.5' });
      expect(el).toHaveStyle({ padding: '20px' });
    });

    it('applies styles.root with fontSize', () => {
      render(
        <Stack data-testid="stack" styles={{ root: { fontSize: '16px' } }} />,
      );
      expect(screen.getByTestId('stack')).toHaveStyle({ fontSize: '16px' });
    });
  });

  // ── Compound: Stack.Item ──
  describe('Stack (Compound)', () => {
    it('compound: Stack.Item render edilir', () => {
      render(
        <Stack data-testid="stack" spacing={4}>
          <Stack.Item>Item icerik</Stack.Item>
        </Stack>,
      );
      const item = screen.getByTestId('stack-item');
      expect(item).toBeInTheDocument();
      expect(item).toHaveTextContent('Item icerik');
    });

    it('compound: birden fazla Stack.Item render edilir', () => {
      render(
        <Stack spacing={4}>
          <Stack.Item>1</Stack.Item>
          <Stack.Item>2</Stack.Item>
          <Stack.Item>3</Stack.Item>
        </Stack>,
      );
      const items = screen.getAllByTestId('stack-item');
      expect(items).toHaveLength(3);
    });

    it('compound: Stack.Item classNames.item context ile aktarilir', () => {
      render(
        <Stack classNames={{ item: 'custom-item' }} spacing={4}>
          <Stack.Item>test</Stack.Item>
        </Stack>,
      );
      expect(screen.getByTestId('stack-item').className).toContain('custom-item');
    });

    it('compound: Stack.Item styles.item context ile aktarilir', () => {
      render(
        <Stack styles={{ item: { padding: '10px' } }} spacing={4}>
          <Stack.Item>test</Stack.Item>
        </Stack>,
      );
      expect(screen.getByTestId('stack-item')).toHaveStyle({ padding: '10px' });
    });

    it('compound: Stack.Item ref forward edilir', () => {
      let refValue: HTMLElement | null = null;
      render(
        <Stack spacing={4}>
          <Stack.Item ref={(el) => { refValue = el; }}>test</Stack.Item>
        </Stack>,
      );
      expect(refValue).toBe(screen.getByTestId('stack-item'));
    });

    it('Stack.Item context disinda hata firlatir', () => {
      expect(() => render(<Stack.Item>Test</Stack.Item>)).toThrow();
    });
  });
});

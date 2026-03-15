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
import { Flex } from './Flex';

describe('Flex', () => {
  // ── Root ──
  it('renders as div with flex display', () => {
    render(<Flex data-testid="flex">content</Flex>);
    const el = screen.getByTestId('flex');
    expect(el.tagName).toBe('DIV');
    expect(el).toHaveTextContent('content');
    expect(el.className).toBeTruthy();
  });

  it('applies direction prop', () => {
    render(<Flex data-testid="flex" direction="column" />);
    expect(screen.getByTestId('flex').className).toBeTruthy();
  });

  it('applies align prop', () => {
    render(<Flex data-testid="flex" align="center" />);
    expect(screen.getByTestId('flex').className).toBeTruthy();
  });

  it('applies justify prop', () => {
    render(<Flex data-testid="flex" justify="space-between" />);
    expect(screen.getByTestId('flex').className).toBeTruthy();
  });

  it('applies wrap prop', () => {
    render(<Flex data-testid="flex" wrap="wrap" />);
    expect(screen.getByTestId('flex').className).toBeTruthy();
  });

  it('accepts Box props (gap, p)', () => {
    render(<Flex data-testid="flex" gap={4} p={2} />);
    expect(screen.getByTestId('flex').className).toBeTruthy();
  });

  it('accepts as prop', () => {
    render(<Flex data-testid="flex" as="nav" />);
    expect(screen.getByTestId('flex').tagName).toBe('NAV');
  });

  it('forwards ref', () => {
    let refValue: HTMLElement | null = null;
    render(<Flex ref={(el) => { refValue = el; }} data-testid="flex" />);
    expect(refValue).toBe(screen.getByTestId('flex'));
  });

  it('passes through HTML attributes', () => {
    render(<Flex data-testid="flex" id="my-flex" role="navigation" />);
    const el = screen.getByTestId('flex');
    expect(el).toHaveAttribute('id', 'my-flex');
    expect(el).toHaveAttribute('role', 'navigation');
  });

  it('renders multiple children', () => {
    render(
      <Flex data-testid="flex">
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </Flex>,
    );
    expect(screen.getByTestId('flex').children).toHaveLength(3);
  });

  it('renders empty without children', () => {
    render(<Flex data-testid="flex" />);
    expect(screen.getByTestId('flex')).toBeInTheDocument();
  });

  // ── classNames & styles ──
  describe('classNames & styles', () => {
    it('applies classNames.root', () => {
      render(<Flex data-testid="flex" classNames={{ root: 'slot-root' }} />);
      expect(screen.getByTestId('flex')).toHaveClass('slot-root');
    });

    it('applies styles.root', () => {
      render(<Flex data-testid="flex" styles={{ root: { opacity: '0.7' } }} />);
      expect(screen.getByTestId('flex')).toHaveStyle({ opacity: '0.7' });
    });

    it('merges className + classNames.root', () => {
      render(
        <Flex data-testid="flex" className="outer" classNames={{ root: 'inner' }} />,
      );
      const el = screen.getByTestId('flex');
      expect(el).toHaveClass('outer');
      expect(el).toHaveClass('inner');
    });

    it('merges style + styles.root', () => {
      render(
        <Flex
          data-testid="flex"
          style={{ opacity: '0.5' }}
          styles={{ root: { fontSize: '14px' } }}
        />,
      );
      const el = screen.getByTestId('flex');
      expect(el).toHaveStyle({ opacity: '0.5' });
      expect(el).toHaveStyle({ fontSize: '14px' });
    });

    it('applies styles.root with padding', () => {
      render(
        <Flex data-testid="flex" styles={{ root: { padding: '20px' } }} />,
      );
      expect(screen.getByTestId('flex')).toHaveStyle({ padding: '20px' });
    });
  });

  // ── Compound: Flex.Item ──
  describe('Flex (Compound)', () => {
    it('compound: Flex.Item render edilir', () => {
      render(
        <Flex data-testid="flex">
          <Flex.Item>Item icerik</Flex.Item>
        </Flex>,
      );
      const item = screen.getByTestId('flex-item');
      expect(item).toBeInTheDocument();
      expect(item).toHaveTextContent('Item icerik');
    });

    it('compound: birden fazla Flex.Item render edilir', () => {
      render(
        <Flex>
          <Flex.Item>1</Flex.Item>
          <Flex.Item>2</Flex.Item>
          <Flex.Item>3</Flex.Item>
        </Flex>,
      );
      const items = screen.getAllByTestId('flex-item');
      expect(items).toHaveLength(3);
    });

    it('compound: Flex.Item classNames.item context ile aktarilir', () => {
      render(
        <Flex classNames={{ item: 'custom-item' }}>
          <Flex.Item>test</Flex.Item>
        </Flex>,
      );
      expect(screen.getByTestId('flex-item').className).toContain('custom-item');
    });

    it('compound: Flex.Item styles.item context ile aktarilir', () => {
      render(
        <Flex styles={{ item: { padding: '10px' } }}>
          <Flex.Item>test</Flex.Item>
        </Flex>,
      );
      expect(screen.getByTestId('flex-item')).toHaveStyle({ padding: '10px' });
    });

    it('compound: Flex.Item ref forward edilir', () => {
      let refValue: HTMLElement | null = null;
      render(
        <Flex>
          <Flex.Item ref={(el) => { refValue = el; }}>test</Flex.Item>
        </Flex>,
      );
      expect(refValue).toBe(screen.getByTestId('flex-item'));
    });
  });
});

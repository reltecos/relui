/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MasterDetailLayout } from './MasterDetailLayout';

describe('MasterDetailLayout', () => {
  const defaultProps = {
    master: <div>Master Content</div>,
    detail: <div>Detail Content</div>,
  };

  it('renders master and detail panels', () => {
    render(<MasterDetailLayout {...defaultProps} />);
    expect(screen.getByText('Master Content')).toBeInTheDocument();
    expect(screen.getByText('Detail Content')).toBeInTheDocument();
  });

  it('sets data-panel attributes on panels', () => {
    const { container } = render(<MasterDetailLayout {...defaultProps} />);
    expect(container.querySelector('[data-panel="master"]')).toBeInTheDocument();
    expect(container.querySelector('[data-panel="detail"]')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    let refValue: HTMLDivElement | null = null;
    render(
      <MasterDetailLayout
        ref={(el) => { refValue = el; }}
        data-testid="root"
        {...defaultProps}
      />,
    );
    expect(refValue).toBe(screen.getByTestId('root'));
  });

  it('passes through HTML attributes', () => {
    render(
      <MasterDetailLayout
        data-testid="root"
        id="layout"
        aria-label="Master detail"
        {...defaultProps}
      />,
    );
    const el = screen.getByTestId('root');
    expect(el).toHaveAttribute('id', 'layout');
    expect(el).toHaveAttribute('aria-label', 'Master detail');
  });

  // ── Position ──────────────────────────────────────────

  describe('position', () => {
    it('defaults to left position (flex-direction: row)', () => {
      render(<MasterDetailLayout data-testid="root" {...defaultProps} />);
      const root = screen.getByTestId('root');
      expect(root).toHaveStyle({ flexDirection: 'row' });
      expect(root).toHaveAttribute('data-position', 'left');
    });

    it('right position uses row-reverse', () => {
      render(<MasterDetailLayout data-testid="root" masterPosition="right" {...defaultProps} />);
      const root = screen.getByTestId('root');
      expect(root).toHaveStyle({ flexDirection: 'row-reverse' });
      expect(root).toHaveAttribute('data-position', 'right');
    });

    it('top position uses column', () => {
      render(<MasterDetailLayout data-testid="root" masterPosition="top" {...defaultProps} />);
      const root = screen.getByTestId('root');
      expect(root).toHaveStyle({ flexDirection: 'column' });
      expect(root).toHaveAttribute('data-position', 'top');
    });

    it('bottom position uses column-reverse', () => {
      render(
        <MasterDetailLayout data-testid="root" masterPosition="bottom" {...defaultProps} />,
      );
      const root = screen.getByTestId('root');
      expect(root).toHaveStyle({ flexDirection: 'column-reverse' });
      expect(root).toHaveAttribute('data-position', 'bottom');
    });
  });

  // ── Master size ───────────────────────────────────────

  describe('master size', () => {
    it('defaults to 300px width', () => {
      const { container } = render(<MasterDetailLayout {...defaultProps} />);
      const master = container.querySelector('[data-panel="master"]') as HTMLElement;
      expect(master).toHaveStyle({ width: '300px' });
    });

    it('accepts custom number size', () => {
      const { container } = render(
        <MasterDetailLayout masterSize={400} {...defaultProps} />,
      );
      const master = container.querySelector('[data-panel="master"]') as HTMLElement;
      expect(master).toHaveStyle({ width: '400px' });
    });

    it('accepts string size like percentage', () => {
      const { container } = render(
        <MasterDetailLayout masterSize="30%" {...defaultProps} />,
      );
      const master = container.querySelector('[data-panel="master"]') as HTMLElement;
      expect(master).toHaveStyle({ width: '30%' });
    });

    it('top/bottom position uses height instead of width', () => {
      const { container } = render(
        <MasterDetailLayout masterPosition="top" masterSize={200} {...defaultProps} />,
      );
      const master = container.querySelector('[data-panel="master"]') as HTMLElement;
      expect(master).toHaveStyle({ height: '200px' });
    });
  });

  // ── Collapse ──────────────────────────────────────────

  describe('collapse', () => {
    it('does not show collapse button by default', () => {
      const { container } = render(<MasterDetailLayout {...defaultProps} />);
      expect(container.querySelector('[data-collapse-button]')).not.toBeInTheDocument();
    });

    it('shows collapse button when collapsible', () => {
      const { container } = render(
        <MasterDetailLayout collapsible {...defaultProps} />,
      );
      expect(container.querySelector('[data-collapse-button]')).toBeInTheDocument();
    });

    it('collapse button has aria-label and aria-expanded', () => {
      const { container } = render(
        <MasterDetailLayout collapsible {...defaultProps} />,
      );
      const btn = container.querySelector('[data-collapse-button]') as HTMLElement;
      expect(btn).toHaveAttribute('aria-label', 'Collapse panel');
      expect(btn).toHaveAttribute('aria-expanded', 'true');
    });

    it('clicking collapse button toggles state', () => {
      const onCollapseChange = vi.fn();
      const { container } = render(
        <MasterDetailLayout collapsible onCollapseChange={onCollapseChange} {...defaultProps} />,
      );
      const btn = container.querySelector('[data-collapse-button]') as HTMLElement;
      fireEvent.click(btn);
      expect(onCollapseChange).toHaveBeenCalledWith(true);
    });

    it('collapsed master has width 0', () => {
      const { container } = render(
        <MasterDetailLayout collapsible collapsed {...defaultProps} />,
      );
      const master = container.querySelector('[data-panel="master"]') as HTMLElement;
      expect(master).toHaveStyle({ width: '0' });
    });

    it('sets data-collapsed on root when collapsed', () => {
      render(
        <MasterDetailLayout
          data-testid="root"
          collapsible
          collapsed
          {...defaultProps}
        />,
      );
      expect(screen.getByTestId('root')).toHaveAttribute('data-collapsed');
    });
  });

  // ── Detail visibility ─────────────────────────────────

  describe('detail visibility', () => {
    it('always mode: detail always visible', () => {
      const { container } = render(
        <MasterDetailLayout detailVisibility="always" {...defaultProps} />,
      );
      const detail = container.querySelector('[data-panel="detail"]') as HTMLElement;
      expect(detail.style.display).not.toBe('none');
    });

    it('onSelect mode: detail hidden without selection', () => {
      const { container } = render(
        <MasterDetailLayout detailVisibility="onSelect" {...defaultProps} />,
      );
      const detail = container.querySelector('[data-panel="detail"]') as HTMLElement;
      expect(detail).toHaveStyle({ display: 'none' });
    });

    it('onSelect mode: detail visible with selection', () => {
      const { container } = render(
        <MasterDetailLayout detailVisibility="onSelect" selectedId="item-1" {...defaultProps} />,
      );
      const detail = container.querySelector('[data-panel="detail"]') as HTMLElement;
      expect(detail.style.display).not.toBe('none');
    });
  });

  // ── Detail flex ──────────────────────────────────────

  it('detail panel has flex: 1', () => {
    const { container } = render(<MasterDetailLayout {...defaultProps} />);
    const detail = container.querySelector('[data-panel="detail"]') as HTMLElement;
    expect(detail).toHaveStyle({ flex: '1' });
  });

  // ── classNames & styles ───────────────────────────────

  describe('classNames & styles', () => {
    it('applies classNames.root', () => {
      render(
        <MasterDetailLayout
          data-testid="root"
          classNames={{ root: 'slot-root' }}
          {...defaultProps}
        />,
      );
      expect(screen.getByTestId('root')).toHaveClass('slot-root');
    });

    it('applies styles.root', () => {
      render(
        <MasterDetailLayout
          data-testid="root"
          styles={{ root: { opacity: '0.5' } }}
          {...defaultProps}
        />,
      );
      expect(screen.getByTestId('root')).toHaveStyle({ opacity: '0.5' });
    });

    it('merges className + classNames.root', () => {
      render(
        <MasterDetailLayout
          data-testid="root"
          className="outer"
          classNames={{ root: 'inner' }}
          {...defaultProps}
        />,
      );
      const el = screen.getByTestId('root');
      expect(el).toHaveClass('outer');
      expect(el).toHaveClass('inner');
    });

    it('merges style + styles.root', () => {
      render(
        <MasterDetailLayout
          data-testid="root"
          style={{ margin: 4 }}
          styles={{ root: { padding: 8 } }}
          {...defaultProps}
        />,
      );
      const el = screen.getByTestId('root');
      expect(el).toHaveStyle({ margin: '4px', padding: '8px' });
    });

    it('applies classNames.master to master panel', () => {
      const { container } = render(
        <MasterDetailLayout
          classNames={{ master: 'custom-master' }}
          {...defaultProps}
        />,
      );
      const master = container.querySelector('[data-panel="master"]') as HTMLElement;
      expect(master).toHaveClass('custom-master');
    });

    it('applies styles.master to master panel', () => {
      const { container } = render(
        <MasterDetailLayout
          styles={{ master: { background: 'red' } }}
          {...defaultProps}
        />,
      );
      const master = container.querySelector('[data-panel="master"]') as HTMLElement;
      expect(master).toHaveStyle({ background: 'red' });
    });

    it('applies classNames.detail to detail panel', () => {
      const { container } = render(
        <MasterDetailLayout
          classNames={{ detail: 'custom-detail' }}
          {...defaultProps}
        />,
      );
      const detail = container.querySelector('[data-panel="detail"]') as HTMLElement;
      expect(detail).toHaveClass('custom-detail');
    });

    it('applies styles.detail to detail panel', () => {
      const { container } = render(
        <MasterDetailLayout
          styles={{ detail: { background: 'blue' } }}
          {...defaultProps}
        />,
      );
      const detail = container.querySelector('[data-panel="detail"]') as HTMLElement;
      expect(detail).toHaveStyle({ background: 'blue' });
    });

    it('applies classNames.collapseButton to collapse button', () => {
      const { container } = render(
        <MasterDetailLayout
          collapsible
          classNames={{ collapseButton: 'custom-btn' }}
          {...defaultProps}
        />,
      );
      const btn = container.querySelector('[data-collapse-button]') as HTMLElement;
      expect(btn).toHaveClass('custom-btn');
    });
  });
});

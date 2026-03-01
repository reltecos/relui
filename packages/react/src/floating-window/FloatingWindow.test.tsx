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
import { FloatingWindow } from './FloatingWindow';

describe('FloatingWindow', () => {
  it('renders children', () => {
    render(
      <FloatingWindow title="Test">
        <p>Window content</p>
      </FloatingWindow>,
    );
    expect(screen.getByText('Window content')).toBeInTheDocument();
  });

  it('renders title', () => {
    render(
      <FloatingWindow title="My Window">
        <div>Content</div>
      </FloatingWindow>,
    );
    expect(screen.getByText('My Window')).toBeInTheDocument();
  });

  it('renders title bar', () => {
    const { container } = render(
      <FloatingWindow title="Test">
        <div>Content</div>
      </FloatingWindow>,
    );
    expect(container.querySelector('[data-title-bar]')).toBeInTheDocument();
  });

  it('renders window content area', () => {
    const { container } = render(
      <FloatingWindow title="Test">
        <div>Content</div>
      </FloatingWindow>,
    );
    expect(container.querySelector('[data-window-content]')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    let refValue: HTMLDivElement | null = null;
    render(
      <FloatingWindow ref={(el) => { refValue = el; }} data-testid="root" title="Test">
        <div>Content</div>
      </FloatingWindow>,
    );
    expect(refValue).toBe(screen.getByTestId('root'));
  });

  it('passes through HTML attributes', () => {
    render(
      <FloatingWindow data-testid="root" id="window" aria-label="Window" title="Test">
        <div>Content</div>
      </FloatingWindow>,
    );
    const el = screen.getByTestId('root');
    expect(el).toHaveAttribute('id', 'window');
    expect(el).toHaveAttribute('aria-label', 'Window');
  });

  it('has position: absolute style', () => {
    render(
      <FloatingWindow data-testid="root" title="Test">
        <div>Content</div>
      </FloatingWindow>,
    );
    expect(screen.getByTestId('root')).toHaveStyle({ position: 'absolute' });
  });

  it('applies default position and size', () => {
    render(
      <FloatingWindow
        data-testid="root"
        title="Test"
        defaultPosition={{ x: 200, y: 150 }}
        defaultSize={{ width: 500, height: 400 }}
      >
        <div>Content</div>
      </FloatingWindow>,
    );
    const root = screen.getByTestId('root');
    expect(root).toHaveStyle({ left: '200px', top: '150px', width: '500px', height: '400px' });
  });

  // ── Window controls ─────────────────────────────────────

  describe('window controls', () => {
    it('renders minimize, maximize, close buttons', () => {
      const { container } = render(
        <FloatingWindow title="Test">
          <div>Content</div>
        </FloatingWindow>,
      );
      expect(container.querySelector('[data-window-control="minimize"]')).toBeInTheDocument();
      expect(container.querySelector('[data-window-control="maximize"]')).toBeInTheDocument();
      expect(container.querySelector('[data-window-control="close"]')).toBeInTheDocument();
    });

    it('hides minimize when showMinimize=false', () => {
      const { container } = render(
        <FloatingWindow title="Test" showMinimize={false}>
          <div>Content</div>
        </FloatingWindow>,
      );
      expect(container.querySelector('[data-window-control="minimize"]')).not.toBeInTheDocument();
    });

    it('hides maximize when showMaximize=false', () => {
      const { container } = render(
        <FloatingWindow title="Test" showMaximize={false}>
          <div>Content</div>
        </FloatingWindow>,
      );
      expect(container.querySelector('[data-window-control="maximize"]')).not.toBeInTheDocument();
    });

    it('hides close when showClose=false', () => {
      const { container } = render(
        <FloatingWindow title="Test" showClose={false}>
          <div>Content</div>
        </FloatingWindow>,
      );
      expect(container.querySelector('[data-window-control="close"]')).not.toBeInTheDocument();
    });

    it('close button calls onClose', () => {
      const onClose = vi.fn();
      const { container } = render(
        <FloatingWindow title="Test" onClose={onClose}>
          <div>Content</div>
        </FloatingWindow>,
      );
      const closeBtn = container.querySelector('[data-window-control="close"]') as HTMLElement;
      fireEvent.click(closeBtn);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('minimize button hides window', () => {
      const { container } = render(
        <FloatingWindow data-testid="root" title="Test">
          <div>Content</div>
        </FloatingWindow>,
      );
      const minimizeBtn = container.querySelector('[data-window-control="minimize"]') as HTMLElement;
      fireEvent.click(minimizeBtn);
      expect(screen.getByTestId('root')).toHaveStyle({ display: 'none' });
      expect(screen.getByTestId('root')).toHaveAttribute('data-window-state', 'minimized');
    });

    it('control buttons have aria-labels', () => {
      const { container } = render(
        <FloatingWindow title="Test">
          <div>Content</div>
        </FloatingWindow>,
      );
      expect(container.querySelector('[data-window-control="minimize"]')).toHaveAttribute('aria-label', 'Minimize');
      expect(container.querySelector('[data-window-control="maximize"]')).toHaveAttribute('aria-label', 'Maximize');
      expect(container.querySelector('[data-window-control="close"]')).toHaveAttribute('aria-label', 'Close');
    });
  });

  // ── Window state ────────────────────────────────────────

  describe('window state', () => {
    it('defaults to normal state', () => {
      render(
        <FloatingWindow data-testid="root" title="Test">
          <div>Content</div>
        </FloatingWindow>,
      );
      expect(screen.getByTestId('root')).toHaveAttribute('data-window-state', 'normal');
    });
  });

  // ── classNames & styles ────────────────────────────────

  describe('classNames & styles', () => {
    it('applies classNames.root', () => {
      render(
        <FloatingWindow data-testid="root" classNames={{ root: 'slot-root' }} title="Test">
          <div>Content</div>
        </FloatingWindow>,
      );
      expect(screen.getByTestId('root')).toHaveClass('slot-root');
    });

    it('applies styles.root', () => {
      render(
        <FloatingWindow data-testid="root" styles={{ root: { opacity: '0.9' } }} title="Test">
          <div>Content</div>
        </FloatingWindow>,
      );
      expect(screen.getByTestId('root')).toHaveStyle({ opacity: '0.9' });
    });

    it('merges className + classNames.root', () => {
      render(
        <FloatingWindow data-testid="root" className="outer" classNames={{ root: 'inner' }} title="Test">
          <div>Content</div>
        </FloatingWindow>,
      );
      const el = screen.getByTestId('root');
      expect(el).toHaveClass('outer');
      expect(el).toHaveClass('inner');
    });

    it('merges style + styles.root', () => {
      render(
        <FloatingWindow data-testid="root" style={{ margin: 4 }} styles={{ root: { padding: 8 } }} title="Test">
          <div>Content</div>
        </FloatingWindow>,
      );
      const el = screen.getByTestId('root');
      expect(el).toHaveStyle({ margin: '4px', padding: '8px' });
    });

    it('applies classNames.titleBar', () => {
      const { container } = render(
        <FloatingWindow classNames={{ titleBar: 'custom-bar' }} title="Test">
          <div>Content</div>
        </FloatingWindow>,
      );
      const bar = container.querySelector('[data-title-bar]');
      expect(bar).toHaveClass('custom-bar');
    });

    it('applies classNames.content', () => {
      const { container } = render(
        <FloatingWindow classNames={{ content: 'custom-content' }} title="Test">
          <div>Content</div>
        </FloatingWindow>,
      );
      const content = container.querySelector('[data-window-content]');
      expect(content).toHaveClass('custom-content');
    });

    it('applies styles.content', () => {
      const { container } = render(
        <FloatingWindow styles={{ content: { padding: 24 } }} title="Test">
          <div>Content</div>
        </FloatingWindow>,
      );
      const content = container.querySelector('[data-window-content]') as HTMLElement;
      expect(content).toHaveStyle({ padding: '24px' });
    });
  });
});

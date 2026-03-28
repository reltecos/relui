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
import { MDI } from './MDI';

class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
vi.stubGlobal('ResizeObserver', MockResizeObserver);

const defaultRender = (id: string, title: string) => <div data-testid={`win-${id}`}>{title} Content</div>;

describe('MDI', () => {
  it('renders with data-mdi', () => {
    render(
      <MDI data-testid="mdi-root" renderWindow={defaultRender} />,
    );
    expect(screen.getByTestId('mdi-root')).toHaveAttribute('data-mdi');
  });

  it('renders empty without windows', () => {
    const { container } = render(
      <MDI renderWindow={defaultRender} />,
    );
    expect(container.querySelector('[data-mdi-window]')).not.toBeInTheDocument();
  });

  it('renders windows', () => {
    const { container } = render(
      <MDI
        windows={[
          { id: 'a', title: 'Window A' },
          { id: 'b', title: 'Window B' },
        ]}
        renderWindow={defaultRender}
      />,
    );
    expect(container.querySelector('[data-mdi-window="a"]')).toBeInTheDocument();
    expect(container.querySelector('[data-mdi-window="b"]')).toBeInTheDocument();
  });

  it('renders window content', () => {
    render(
      <MDI
        windows={[{ id: 'a', title: 'Test' }]}
        renderWindow={defaultRender}
      />,
    );
    expect(screen.getByTestId('win-a')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders window title in title bar', () => {
    const { container } = render(
      <MDI
        windows={[{ id: 'a', title: 'My Window' }]}
        renderWindow={defaultRender}
      />,
    );
    const titleBar = container.querySelector('[data-mdi-title-bar]');
    expect(titleBar).toHaveTextContent('My Window');
  });

  it('marks active window', () => {
    const { container } = render(
      <MDI
        windows={[
          { id: 'a', title: 'A' },
          { id: 'b', title: 'B' },
        ]}
        renderWindow={defaultRender}
      />,
    );
    // Last window should be active
    const winB = container.querySelector('[data-mdi-window="b"]');
    expect(winB).toHaveAttribute('data-mdi-active');
  });

  // ── Window controls ────────────────────────────────

  describe('window controls', () => {
    it('renders minimize, maximize, close buttons', () => {
      const { container } = render(
        <MDI
          windows={[{ id: 'a', title: 'A' }]}
          renderWindow={defaultRender}
        />,
      );
      expect(container.querySelector('[data-mdi-control="minimize"]')).toBeInTheDocument();
      expect(container.querySelector('[data-mdi-control="maximize"]')).toBeInTheDocument();
      expect(container.querySelector('[data-mdi-control="close"]')).toBeInTheDocument();
    });

    it('minimize hides window', () => {
      const { container } = render(
        <MDI
          windows={[{ id: 'a', title: 'A' }]}
          renderWindow={defaultRender}
        />,
      );
      const minimizeBtn = container.querySelector('[data-mdi-control="minimize"]') as HTMLElement;
      fireEvent.click(minimizeBtn);
      expect(container.querySelector('[data-mdi-window="a"]')).not.toBeInTheDocument();
    });

    it('close removes window and calls onWindowClose', () => {
      const onWindowClose = vi.fn();
      const { container } = render(
        <MDI
          windows={[{ id: 'a', title: 'A' }]}
          renderWindow={defaultRender}
          onWindowClose={onWindowClose}
        />,
      );
      const closeBtn = container.querySelector('[data-mdi-control="close"]') as HTMLElement;
      fireEvent.click(closeBtn);
      expect(container.querySelector('[data-mdi-window="a"]')).not.toBeInTheDocument();
      expect(onWindowClose).toHaveBeenCalledWith('a');
    });

    it('control buttons have aria-labels', () => {
      const { container } = render(
        <MDI
          windows={[{ id: 'a', title: 'A' }]}
          renderWindow={defaultRender}
        />,
      );
      expect(container.querySelector('[data-mdi-control="minimize"]')).toHaveAttribute('aria-label', 'Minimize');
      expect(container.querySelector('[data-mdi-control="maximize"]')).toHaveAttribute('aria-label', 'Maximize');
      expect(container.querySelector('[data-mdi-control="close"]')).toHaveAttribute('aria-label', 'Close');
    });
  });

  // ── Taskbar ────────────────────────────────────────

  describe('taskbar', () => {
    it('renders taskbar', () => {
      const { container } = render(
        <MDI
          windows={[{ id: 'a', title: 'A' }]}
          renderWindow={defaultRender}
        />,
      );
      expect(container.querySelector('[data-mdi-taskbar]')).toBeInTheDocument();
    });

    it('renders taskbar items for each window', () => {
      const { container } = render(
        <MDI
          windows={[
            { id: 'a', title: 'Window A' },
            { id: 'b', title: 'Window B' },
          ]}
          renderWindow={defaultRender}
        />,
      );
      expect(container.querySelector('[data-mdi-taskbar-item="a"]')).toBeInTheDocument();
      expect(container.querySelector('[data-mdi-taskbar-item="b"]')).toBeInTheDocument();
    });

    it('activates window on taskbar click', () => {
      const onActiveWindowChange = vi.fn();
      const { container } = render(
        <MDI
          windows={[
            { id: 'a', title: 'A' },
            { id: 'b', title: 'B' },
          ]}
          renderWindow={defaultRender}
          onActiveWindowChange={onActiveWindowChange}
        />,
      );
      const itemA = container.querySelector('[data-mdi-taskbar-item="a"]') as HTMLElement;
      fireEvent.click(itemA);
      expect(onActiveWindowChange).toHaveBeenCalledWith('a');
    });

    it('hides taskbar when showTaskbar=false', () => {
      const { container } = render(
        <MDI
          windows={[{ id: 'a', title: 'A' }]}
          showTaskbar={false}
          renderWindow={defaultRender}
        />,
      );
      expect(container.querySelector('[data-mdi-taskbar]')).not.toBeInTheDocument();
    });
  });

  // ── Ref & HTML attributes ──────────────────────────

  it('forwards ref', () => {
    let refValue: HTMLDivElement | null = null;
    render(
      <MDI
        ref={(el) => { refValue = el; }}
        data-testid="mdi-root"
        renderWindow={defaultRender}
      />,
    );
    expect(refValue).toBe(screen.getByTestId('mdi-root'));
  });

  it('passes through HTML attributes', () => {
    render(
      <MDI
        data-testid="mdi-root"
        id="mdi"
        aria-label="MDI"
        renderWindow={defaultRender}
      />,
    );
    const el = screen.getByTestId('mdi-root');
    expect(el).toHaveAttribute('id', 'mdi');
    expect(el).toHaveAttribute('aria-label', 'MDI');
  });

  // ── classNames & styles ────────────────────────────

  describe('classNames & styles', () => {
    it('applies classNames.root', () => {
      render(
        <MDI
          data-testid="mdi-root"
          classNames={{ root: 'slot-root' }}
          renderWindow={defaultRender}
        />,
      );
      expect(screen.getByTestId('mdi-root')).toHaveClass('slot-root');
    });

    it('applies styles.root', () => {
      render(
        <MDI
          data-testid="mdi-root"
          styles={{ root: { opacity: '0.9' } }}
          renderWindow={defaultRender}
        />,
      );
      expect(screen.getByTestId('mdi-root')).toHaveStyle({ opacity: '0.9' });
    });

    it('merges className + classNames.root', () => {
      render(
        <MDI
          data-testid="mdi-root"
          className="outer"
          classNames={{ root: 'inner' }}
          renderWindow={defaultRender}
        />,
      );
      const el = screen.getByTestId('mdi-root');
      expect(el).toHaveClass('outer');
      expect(el).toHaveClass('inner');
    });

    it('merges style + styles.root', () => {
      render(
        <MDI
          data-testid="mdi-root"
          style={{ margin: 4 }}
          styles={{ root: { padding: 8 } }}
          renderWindow={defaultRender}
        />,
      );
      const el = screen.getByTestId('mdi-root');
      expect(el).toHaveStyle({ margin: '4px', padding: '8px' });
    });

    it('applies classNames.window', () => {
      const { container } = render(
        <MDI
          windows={[{ id: 'a', title: 'A' }]}
          classNames={{ window: 'custom-window' }}
          renderWindow={defaultRender}
        />,
      );
      const win = container.querySelector('[data-mdi-window="a"]');
      expect(win).toHaveClass('custom-window');
    });

    it('applies classNames.taskbar', () => {
      const { container } = render(
        <MDI
          windows={[{ id: 'a', title: 'A' }]}
          classNames={{ taskbar: 'custom-taskbar' }}
          renderWindow={defaultRender}
        />,
      );
      const taskbar = container.querySelector('[data-mdi-taskbar]');
      expect(taskbar).toHaveClass('custom-taskbar');
    });

    it('styles.window window elemana padding eklenir', () => {
      render(
        <MDI
          windows={[{ id: 'a', title: 'A' }]}
          styles={{ window: { padding: '20px' } }}
          renderWindow={defaultRender}
        />,
      );
      expect(screen.getByTestId('mdi-window')).toHaveStyle({ padding: '20px' });
    });

    it('styles.titleBar titleBar elemana fontSize eklenir', () => {
      render(
        <MDI
          windows={[{ id: 'a', title: 'A' }]}
          styles={{ titleBar: { fontSize: '18px' } }}
          renderWindow={defaultRender}
        />,
      );
      expect(screen.getByTestId('mdi-title-bar')).toHaveStyle({ fontSize: '18px' });
    });

    it('styles.title title elemana letterSpacing eklenir', () => {
      render(
        <MDI
          windows={[{ id: 'a', title: 'A' }]}
          styles={{ title: { letterSpacing: '2px' } }}
          renderWindow={defaultRender}
        />,
      );
      expect(screen.getByTestId('mdi-title')).toHaveStyle({ letterSpacing: '2px' });
    });

    it('styles.controls controls elemana padding eklenir', () => {
      render(
        <MDI
          windows={[{ id: 'a', title: 'A' }]}
          styles={{ controls: { padding: '8px' } }}
          renderWindow={defaultRender}
        />,
      );
      expect(screen.getByTestId('mdi-controls')).toHaveStyle({ padding: '8px' });
    });

    it('styles.content content elemana fontSize eklenir', () => {
      render(
        <MDI
          windows={[{ id: 'a', title: 'A' }]}
          styles={{ content: { fontSize: '14px' } }}
          renderWindow={defaultRender}
        />,
      );
      expect(screen.getByTestId('mdi-content')).toHaveStyle({ fontSize: '14px' });
    });

    it('styles.taskbar taskbar elemana padding eklenir', () => {
      render(
        <MDI
          windows={[{ id: 'a', title: 'A' }]}
          styles={{ taskbar: { padding: '20px' } }}
          renderWindow={defaultRender}
        />,
      );
      expect(screen.getByTestId('mdi-taskbar')).toHaveStyle({ padding: '20px' });
    });

    it('styles.taskbarItem taskbarItem elemana letterSpacing eklenir', () => {
      render(
        <MDI
          windows={[{ id: 'a', title: 'A' }]}
          styles={{ taskbarItem: { letterSpacing: '1px' } }}
          renderWindow={defaultRender}
        />,
      );
      expect(screen.getByTestId('mdi-taskbar-item')).toHaveStyle({ letterSpacing: '1px' });
    });
  });

  // ── Compound API ──────────────────────────────────────

  describe('compound API', () => {
    it('renders MDI.Window with data-mdi-window', () => {
      const { container } = render(
        <MDI>
          <MDI.Window id="doc1" title="Document 1">
            <div>Doc 1 Content</div>
          </MDI.Window>
        </MDI>,
      );
      expect(container.querySelector('[data-mdi-window="doc1"]')).toBeInTheDocument();
      expect(screen.getByText('Doc 1 Content')).toBeInTheDocument();
    });

    it('renders MDI.Window title in title bar', () => {
      const { container } = render(
        <MDI>
          <MDI.Window id="a" title="My Window">
            <div>Content</div>
          </MDI.Window>
        </MDI>,
      );
      const titleBar = container.querySelector('[data-mdi-title-bar]');
      expect(titleBar).toHaveTextContent('My Window');
    });

    it('renders MDI.Toolbar with data-mdi-taskbar', () => {
      const { container } = render(
        <MDI>
          <MDI.Window id="a" title="A"><div>Content</div></MDI.Window>
          <MDI.Toolbar>Custom Toolbar</MDI.Toolbar>
        </MDI>,
      );
      expect(container.querySelector('[data-mdi-taskbar]')).toBeInTheDocument();
      expect(screen.getByText('Custom Toolbar')).toBeInTheDocument();
    });

    it('compound MDI root has data-mdi attribute', () => {
      render(
        <MDI data-testid="mdi-root">
          <MDI.Window id="a" title="A"><div>Content</div></MDI.Window>
        </MDI>,
      );
      expect(screen.getByTestId('mdi-root')).toHaveAttribute('data-mdi');
    });

    it('renders multiple MDI.Window elements', () => {
      const { container } = render(
        <MDI>
          <MDI.Window id="a" title="Window A"><div>A</div></MDI.Window>
          <MDI.Window id="b" title="Window B"><div>B</div></MDI.Window>
        </MDI>,
      );
      expect(container.querySelector('[data-mdi-window="a"]')).toBeInTheDocument();
      expect(container.querySelector('[data-mdi-window="b"]')).toBeInTheDocument();
    });
  });
});

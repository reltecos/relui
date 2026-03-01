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
import { DockLayout } from './DockLayout';
import type { DockSplitNode } from '@relteco/relui-core';

const defaultRender = (id: string, title: string) => (
  <div data-testid={`panel-${id}`}>{title} Content</div>
);

describe('DockLayout', () => {
  // ── Basic rendering ─────────────────────────────

  it('renders with data-dock-layout', () => {
    render(
      <DockLayout data-testid="root" renderPanel={defaultRender} />,
    );
    expect(screen.getByTestId('root')).toHaveAttribute('data-dock-layout');
  });

  it('renders empty when no panels', () => {
    const { container } = render(
      <DockLayout renderPanel={defaultRender} />,
    );
    expect(container.querySelector('[data-dock-group]')).not.toBeInTheDocument();
  });

  it('renders panel content', () => {
    render(
      <DockLayout
        panels={[{ id: 'a', title: 'Panel A' }]}
        renderPanel={defaultRender}
      />,
    );
    expect(screen.getByTestId('panel-a')).toBeInTheDocument();
    expect(screen.getByText('Panel A Content')).toBeInTheDocument();
  });

  // ── Tree rendering ────────────────────────────────

  it('renders single group', () => {
    const { container } = render(
      <DockLayout
        panels={[
          { id: 'a', title: 'A' },
          { id: 'b', title: 'B' },
        ]}
        renderPanel={defaultRender}
      />,
    );
    expect(container.querySelector('[data-dock-group]')).toBeInTheDocument();
  });

  it('renders split tree with initialRoot', () => {
    const initialRoot: DockSplitNode = {
      type: 'split',
      id: 's1',
      direction: 'horizontal',
      children: [
        { type: 'group', id: 'g1', panelIds: ['a'], activePanelId: 'a' },
        { type: 'group', id: 'g2', panelIds: ['b'], activePanelId: 'b' },
      ],
      sizes: [0.5, 0.5],
    };

    const { container } = render(
      <DockLayout
        initialRoot={initialRoot}
        panels={[
          { id: 'a', title: 'Panel A' },
          { id: 'b', title: 'Panel B' },
        ]}
        renderPanel={defaultRender}
      />,
    );

    expect(container.querySelector('[data-dock-split="s1"]')).toBeInTheDocument();
    expect(container.querySelector('[data-dock-group="g1"]')).toBeInTheDocument();
    expect(container.querySelector('[data-dock-group="g2"]')).toBeInTheDocument();
    expect(container.querySelector('[data-dock-direction="horizontal"]')).toBeInTheDocument();
  });

  it('renders nested splits', () => {
    const initialRoot: DockSplitNode = {
      type: 'split',
      id: 's1',
      direction: 'horizontal',
      children: [
        { type: 'group', id: 'g1', panelIds: ['a'], activePanelId: 'a' },
        {
          type: 'split',
          id: 's2',
          direction: 'vertical',
          children: [
            { type: 'group', id: 'g2', panelIds: ['b'], activePanelId: 'b' },
            { type: 'group', id: 'g3', panelIds: ['c'], activePanelId: 'c' },
          ],
          sizes: [0.7, 0.3],
        },
      ],
      sizes: [0.3, 0.7],
    };

    const { container } = render(
      <DockLayout
        initialRoot={initialRoot}
        panels={[
          { id: 'a', title: 'A' },
          { id: 'b', title: 'B' },
          { id: 'c', title: 'C' },
        ]}
        renderPanel={defaultRender}
      />,
    );

    expect(container.querySelector('[data-dock-split="s1"]')).toBeInTheDocument();
    expect(container.querySelector('[data-dock-split="s2"]')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-dock-group]')).toHaveLength(3);
  });

  // ── Tab bar ───────────────────────────────────────

  it('renders tab bar with panel title', () => {
    const { container } = render(
      <DockLayout
        panels={[{ id: 'a', title: 'Explorer' }]}
        renderPanel={defaultRender}
      />,
    );
    const tab = container.querySelector('[data-dock-tab="a"]');
    expect(tab).toBeInTheDocument();
    expect(tab).toHaveTextContent('Explorer');
  });

  it('renders multiple tabs', () => {
    const { container } = render(
      <DockLayout
        panels={[
          { id: 'a', title: 'A' },
          { id: 'b', title: 'B' },
        ]}
        renderPanel={defaultRender}
      />,
    );
    expect(container.querySelector('[data-dock-tab="a"]')).toBeInTheDocument();
    expect(container.querySelector('[data-dock-tab="b"]')).toBeInTheDocument();
  });

  it('has active tab marker', () => {
    const { container } = render(
      <DockLayout
        panels={[
          { id: 'a', title: 'A' },
          { id: 'b', title: 'B' },
        ]}
        renderPanel={defaultRender}
      />,
    );
    const tabB = container.querySelector('[data-dock-tab="b"]');
    expect(tabB).toHaveAttribute('data-active');
  });

  // ── Tab switching ─────────────────────────────────

  it('switches active panel on tab click', () => {
    const { container } = render(
      <DockLayout
        panels={[
          { id: 'a', title: 'A' },
          { id: 'b', title: 'B' },
        ]}
        renderPanel={defaultRender}
      />,
    );
    const tabA = container.querySelector('[data-dock-tab="a"]') as HTMLElement;
    fireEvent.click(tabA);
    expect(tabA).toHaveAttribute('data-active');
  });

  it('calls onActivePanelChange on tab click', () => {
    const onActivePanelChange = vi.fn();
    const { container } = render(
      <DockLayout
        panels={[
          { id: 'a', title: 'A' },
          { id: 'b', title: 'B' },
        ]}
        renderPanel={defaultRender}
        onActivePanelChange={onActivePanelChange}
      />,
    );
    const tabA = container.querySelector('[data-dock-tab="a"]') as HTMLElement;
    fireEvent.click(tabA);
    expect(onActivePanelChange).toHaveBeenCalledWith('a');
  });

  // ── Close panel ───────────────────────────────────

  it('renders close button on closable tab', () => {
    const { container } = render(
      <DockLayout
        panels={[{ id: 'a', title: 'A', closable: true }]}
        renderPanel={defaultRender}
      />,
    );
    expect(container.querySelector('[data-dock-tab-close]')).toBeInTheDocument();
  });

  it('does not render close button on non-closable tab', () => {
    const { container } = render(
      <DockLayout
        panels={[{ id: 'a', title: 'A', closable: false }]}
        renderPanel={defaultRender}
      />,
    );
    expect(container.querySelector('[data-dock-tab-close]')).not.toBeInTheDocument();
  });

  it('closes panel on close button click', () => {
    const onPanelClose = vi.fn();
    const { container } = render(
      <DockLayout
        panels={[{ id: 'a', title: 'A' }]}
        renderPanel={defaultRender}
        onPanelClose={onPanelClose}
      />,
    );
    const closeBtn = container.querySelector('[data-dock-tab-close]') as HTMLElement;
    fireEvent.click(closeBtn);
    expect(onPanelClose).toHaveBeenCalledWith('a');
    expect(container.querySelector('[data-dock-tab="a"]')).not.toBeInTheDocument();
  });

  // ── Resize handle ─────────────────────────────────

  it('renders resize handles between split children', () => {
    const initialRoot: DockSplitNode = {
      type: 'split',
      id: 's1',
      direction: 'horizontal',
      children: [
        { type: 'group', id: 'g1', panelIds: ['a'], activePanelId: 'a' },
        { type: 'group', id: 'g2', panelIds: ['b'], activePanelId: 'b' },
      ],
      sizes: [0.5, 0.5],
    };
    const { container } = render(
      <DockLayout
        initialRoot={initialRoot}
        panels={[{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }]}
        renderPanel={defaultRender}
      />,
    );
    expect(container.querySelector('[data-dock-resize-handle]')).toBeInTheDocument();
  });

  it('resize handle has correct split-id attribute', () => {
    const initialRoot: DockSplitNode = {
      type: 'split',
      id: 's1',
      direction: 'horizontal',
      children: [
        { type: 'group', id: 'g1', panelIds: ['a'], activePanelId: 'a' },
        { type: 'group', id: 'g2', panelIds: ['b'], activePanelId: 'b' },
      ],
      sizes: [0.5, 0.5],
    };
    const { container } = render(
      <DockLayout
        initialRoot={initialRoot}
        panels={[{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }]}
        renderPanel={defaultRender}
      />,
    );
    const handle = container.querySelector('[data-dock-resize-handle]');
    expect(handle).toHaveAttribute('data-dock-split-id', 's1');
    expect(handle).toHaveAttribute('data-dock-handle-index', '0');
  });

  // ── Auto-hide bars ────────────────────────────────

  it('does not render auto-hide bars when no auto-hidden panels', () => {
    const { container } = render(
      <DockLayout
        panels={[{ id: 'a', title: 'A' }]}
        renderPanel={defaultRender}
      />,
    );
    expect(container.querySelector('[data-dock-autohide-bar]')).not.toBeInTheDocument();
  });

  // ── Floating panels ───────────────────────────────

  it('does not render floating panels initially', () => {
    const { container } = render(
      <DockLayout
        panels={[{ id: 'a', title: 'A' }]}
        renderPanel={defaultRender}
      />,
    );
    expect(container.querySelector('[data-dock-floating]')).not.toBeInTheDocument();
  });

  // ── Maximized overlay ─────────────────────────────

  it('does not render maximized overlay initially', () => {
    const { container } = render(
      <DockLayout
        panels={[{ id: 'a', title: 'A' }]}
        renderPanel={defaultRender}
      />,
    );
    expect(container.querySelector('[data-dock-maximized]')).not.toBeInTheDocument();
  });

  // ── Ref & HTML attributes ─────────────────────────

  it('forwards ref', () => {
    let refValue: HTMLDivElement | null = null;
    render(
      <DockLayout
        ref={(el) => { refValue = el; }}
        data-testid="root"
        renderPanel={defaultRender}
      />,
    );
    expect(refValue).toBe(screen.getByTestId('root'));
  });

  it('passes through HTML attributes', () => {
    render(
      <DockLayout
        data-testid="root"
        id="dock"
        aria-label="Dock Layout"
        renderPanel={defaultRender}
      />,
    );
    const el = screen.getByTestId('root');
    expect(el).toHaveAttribute('id', 'dock');
    expect(el).toHaveAttribute('aria-label', 'Dock Layout');
  });

  // ── Context menu ──────────────────────────────────

  describe('context menu', () => {
    it('opens context menu on tab right-click', () => {
      const { container } = render(
        <DockLayout
          panels={[{ id: 'a', title: 'Panel A' }]}
          renderPanel={defaultRender}
        />,
      );
      const tab = container.querySelector('[data-dock-tab="a"]') as HTMLElement;
      fireEvent.contextMenu(tab);
      expect(container.querySelector('[data-dock-context-menu]')).toBeInTheDocument();
    });

    it('context menu has float action', () => {
      const { container } = render(
        <DockLayout
          panels={[{ id: 'a', title: 'Panel A' }]}
          renderPanel={defaultRender}
        />,
      );
      const tab = container.querySelector('[data-dock-tab="a"]') as HTMLElement;
      fireEvent.contextMenu(tab);
      expect(container.querySelector('[data-dock-context-action="float"]')).toBeInTheDocument();
    });

    it('context menu has maximize action', () => {
      const { container } = render(
        <DockLayout
          panels={[{ id: 'a', title: 'Panel A' }]}
          renderPanel={defaultRender}
        />,
      );
      const tab = container.querySelector('[data-dock-tab="a"]') as HTMLElement;
      fireEvent.contextMenu(tab);
      expect(container.querySelector('[data-dock-context-action="maximize"]')).toBeInTheDocument();
    });

    it('context menu has close action for closable panel', () => {
      const { container } = render(
        <DockLayout
          panels={[{ id: 'a', title: 'Panel A', closable: true }]}
          renderPanel={defaultRender}
        />,
      );
      const tab = container.querySelector('[data-dock-tab="a"]') as HTMLElement;
      fireEvent.contextMenu(tab);
      expect(container.querySelector('[data-dock-context-action="close"]')).toBeInTheDocument();
    });

    it('context menu float action creates floating panel', () => {
      const { container } = render(
        <DockLayout
          panels={[
            { id: 'a', title: 'Panel A' },
            { id: 'b', title: 'Panel B' },
          ]}
          renderPanel={defaultRender}
        />,
      );
      const tab = container.querySelector('[data-dock-tab="a"]') as HTMLElement;
      fireEvent.contextMenu(tab);
      const floatAction = container.querySelector('[data-dock-context-action="float"]') as HTMLElement;
      fireEvent.click(floatAction);
      expect(container.querySelector('[data-dock-floating]')).toBeInTheDocument();
    });

    it('context menu maximize action shows maximized overlay', () => {
      const { container } = render(
        <DockLayout
          panels={[{ id: 'a', title: 'Panel A' }]}
          renderPanel={defaultRender}
        />,
      );
      const tab = container.querySelector('[data-dock-tab="a"]') as HTMLElement;
      fireEvent.contextMenu(tab);
      const maximizeAction = container.querySelector('[data-dock-context-action="maximize"]') as HTMLElement;
      fireEvent.click(maximizeAction);
      expect(container.querySelector('[data-dock-maximized]')).toBeInTheDocument();
    });

    it('context menu close action removes panel', () => {
      const onPanelClose = vi.fn();
      const { container } = render(
        <DockLayout
          panels={[
            { id: 'a', title: 'Panel A' },
            { id: 'b', title: 'Panel B' },
          ]}
          renderPanel={defaultRender}
          onPanelClose={onPanelClose}
        />,
      );
      const tab = container.querySelector('[data-dock-tab="a"]') as HTMLElement;
      fireEvent.contextMenu(tab);
      const closeAction = container.querySelector('[data-dock-context-action="close"]') as HTMLElement;
      fireEvent.click(closeAction);
      expect(onPanelClose).toHaveBeenCalledWith('a');
    });

    it('context menu auto-hide has sub-menu with 4 sides', () => {
      const { container } = render(
        <DockLayout
          panels={[{ id: 'a', title: 'Panel A' }]}
          renderPanel={defaultRender}
        />,
      );
      const tab = container.querySelector('[data-dock-tab="a"]') as HTMLElement;
      fireEvent.contextMenu(tab);
      expect(container.querySelector('[data-dock-context-action="auto-hide"]')).toBeInTheDocument();
      expect(container.querySelector('[data-dock-context-submenu]')).toBeInTheDocument();
    });

    it('context menu auto-hide bottom creates auto-hidden panel', () => {
      const { container } = render(
        <DockLayout
          panels={[
            { id: 'a', title: 'Panel A' },
            { id: 'b', title: 'Panel B' },
          ]}
          renderPanel={defaultRender}
        />,
      );
      const tab = container.querySelector('[data-dock-tab="a"]') as HTMLElement;
      fireEvent.contextMenu(tab);
      const autoHideBottom = container.querySelector('[data-dock-context-action="auto-hide-bottom"]') as HTMLElement;
      fireEvent.click(autoHideBottom);
      expect(container.querySelector('[data-dock-autohide-bar="bottom"]')).toBeInTheDocument();
      expect(container.querySelector('[data-dock-autohide-tab="a"]')).toBeInTheDocument();
    });
  });

  // ── Drag & drop ───────────────────────────────────

  describe('drag and drop', () => {
    it('shows drag ghost after threshold', () => {
      const { container } = render(
        <DockLayout
          panels={[
            { id: 'a', title: 'Panel A' },
            { id: 'b', title: 'Panel B' },
          ]}
          renderPanel={defaultRender}
        />,
      );
      const tab = container.querySelector('[data-dock-tab="a"]') as HTMLElement;
      fireEvent.pointerDown(tab, { clientX: 100, clientY: 100, button: 0 });
      // Move past threshold (5px)
      fireEvent.pointerMove(window, { clientX: 120, clientY: 100 });
      expect(container.querySelector('[data-dock-drag-ghost]')).toBeInTheDocument();
    });

    it('drag ghost shows panel title', () => {
      const { container } = render(
        <DockLayout
          panels={[
            { id: 'a', title: 'Panel A' },
            { id: 'b', title: 'Panel B' },
          ]}
          renderPanel={defaultRender}
        />,
      );
      const tab = container.querySelector('[data-dock-tab="a"]') as HTMLElement;
      fireEvent.pointerDown(tab, { clientX: 100, clientY: 100, button: 0 });
      fireEvent.pointerMove(window, { clientX: 120, clientY: 100 });
      const ghost = container.querySelector('[data-dock-drag-ghost]');
      expect(ghost).toHaveTextContent('Panel A');
    });

    it('does not show drag ghost before threshold', () => {
      const { container } = render(
        <DockLayout
          panels={[
            { id: 'a', title: 'Panel A' },
            { id: 'b', title: 'Panel B' },
          ]}
          renderPanel={defaultRender}
        />,
      );
      const tab = container.querySelector('[data-dock-tab="a"]') as HTMLElement;
      fireEvent.pointerDown(tab, { clientX: 100, clientY: 100, button: 0 });
      // Move less than threshold
      fireEvent.pointerMove(window, { clientX: 102, clientY: 100 });
      expect(container.querySelector('[data-dock-drag-ghost]')).not.toBeInTheDocument();
    });

    it('drag ghost disappears on pointer up', () => {
      const { container } = render(
        <DockLayout
          panels={[
            { id: 'a', title: 'Panel A' },
            { id: 'b', title: 'Panel B' },
          ]}
          renderPanel={defaultRender}
        />,
      );
      const tab = container.querySelector('[data-dock-tab="a"]') as HTMLElement;
      fireEvent.pointerDown(tab, { clientX: 100, clientY: 100, button: 0 });
      fireEvent.pointerMove(window, { clientX: 120, clientY: 100 });
      expect(container.querySelector('[data-dock-drag-ghost]')).toBeInTheDocument();
      fireEvent.pointerUp(window, { clientX: 120, clientY: 100 });
      expect(container.querySelector('[data-dock-drag-ghost]')).not.toBeInTheDocument();
    });

    it('escape key cancels drag', () => {
      const { container } = render(
        <DockLayout
          panels={[
            { id: 'a', title: 'Panel A' },
            { id: 'b', title: 'Panel B' },
          ]}
          renderPanel={defaultRender}
        />,
      );
      const tab = container.querySelector('[data-dock-tab="a"]') as HTMLElement;
      fireEvent.pointerDown(tab, { clientX: 100, clientY: 100, button: 0 });
      fireEvent.pointerMove(window, { clientX: 120, clientY: 100 });
      expect(container.querySelector('[data-dock-drag-ghost]')).toBeInTheDocument();
      fireEvent.keyDown(window, { key: 'Escape' });
      expect(container.querySelector('[data-dock-drag-ghost]')).not.toBeInTheDocument();
    });

    it('shows compass rose indicators during drag', () => {
      const { container } = render(
        <DockLayout
          panels={[
            { id: 'a', title: 'Panel A' },
            { id: 'b', title: 'Panel B' },
          ]}
          renderPanel={defaultRender}
        />,
      );
      const tab = container.querySelector('[data-dock-tab="a"]') as HTMLElement;
      fireEvent.pointerDown(tab, { clientX: 100, clientY: 100, button: 0 });
      fireEvent.pointerMove(window, { clientX: 120, clientY: 100 });
      // Compass rose should appear for each group
      const compassZones = container.querySelectorAll('[data-dock-compass-zone]');
      expect(compassZones.length).toBeGreaterThan(0);
    });

    it('shows root edge indicators during drag', () => {
      const { container } = render(
        <DockLayout
          panels={[
            { id: 'a', title: 'Panel A' },
            { id: 'b', title: 'Panel B' },
          ]}
          renderPanel={defaultRender}
        />,
      );
      const tab = container.querySelector('[data-dock-tab="a"]') as HTMLElement;
      fireEvent.pointerDown(tab, { clientX: 100, clientY: 100, button: 0 });
      fireEvent.pointerMove(window, { clientX: 120, clientY: 100 });
      expect(container.querySelector('[data-dock-root-edge="top"]')).toBeInTheDocument();
      expect(container.querySelector('[data-dock-root-edge="bottom"]')).toBeInTheDocument();
      expect(container.querySelector('[data-dock-root-edge="left"]')).toBeInTheDocument();
      expect(container.querySelector('[data-dock-root-edge="right"]')).toBeInTheDocument();
    });

    it('does not show compass rose when not dragging', () => {
      const { container } = render(
        <DockLayout
          panels={[{ id: 'a', title: 'Panel A' }]}
          renderPanel={defaultRender}
        />,
      );
      expect(container.querySelectorAll('[data-dock-compass-zone]')).toHaveLength(0);
    });

    it('right-click does not start drag', () => {
      const { container } = render(
        <DockLayout
          panels={[
            { id: 'a', title: 'Panel A' },
            { id: 'b', title: 'Panel B' },
          ]}
          renderPanel={defaultRender}
        />,
      );
      const tab = container.querySelector('[data-dock-tab="a"]') as HTMLElement;
      fireEvent.pointerDown(tab, { clientX: 100, clientY: 100, button: 2 });
      fireEvent.pointerMove(window, { clientX: 120, clientY: 100 });
      expect(container.querySelector('[data-dock-drag-ghost]')).not.toBeInTheDocument();
    });
  });

  // ── Double-click maximize ─────────────────────────

  describe('double-click maximize', () => {
    it('maximizes panel on tab double-click', () => {
      const { container } = render(
        <DockLayout
          panels={[{ id: 'a', title: 'Panel A' }]}
          renderPanel={defaultRender}
        />,
      );
      const tab = container.querySelector('[data-dock-tab="a"]') as HTMLElement;
      fireEvent.doubleClick(tab);
      expect(container.querySelector('[data-dock-maximized]')).toBeInTheDocument();
    });

    it('restore maximized button works', () => {
      const { container } = render(
        <DockLayout
          panels={[{ id: 'a', title: 'Panel A' }]}
          renderPanel={defaultRender}
        />,
      );
      const tab = container.querySelector('[data-dock-tab="a"]') as HTMLElement;
      fireEvent.doubleClick(tab);
      expect(container.querySelector('[data-dock-maximized]')).toBeInTheDocument();
      const restoreBtn = container.querySelector('[data-dock-restore-maximized]') as HTMLElement;
      fireEvent.click(restoreBtn);
      expect(container.querySelector('[data-dock-maximized]')).not.toBeInTheDocument();
    });
  });

  // ── Floating panel features ───────────────────────

  describe('floating panels', () => {
    it('floating panel has resize handles', () => {
      const { container } = render(
        <DockLayout
          panels={[
            { id: 'a', title: 'Panel A' },
            { id: 'b', title: 'Panel B' },
          ]}
          renderPanel={defaultRender}
        />,
      );
      // Float via context menu
      const tab = container.querySelector('[data-dock-tab="a"]') as HTMLElement;
      fireEvent.contextMenu(tab);
      const floatAction = container.querySelector('[data-dock-context-action="float"]') as HTMLElement;
      fireEvent.click(floatAction);

      // Check resize handles
      expect(container.querySelector('[data-dock-float-resize="e"]')).toBeInTheDocument();
      expect(container.querySelector('[data-dock-float-resize="w"]')).toBeInTheDocument();
      expect(container.querySelector('[data-dock-float-resize="n"]')).toBeInTheDocument();
      expect(container.querySelector('[data-dock-float-resize="s"]')).toBeInTheDocument();
      expect(container.querySelector('[data-dock-float-resize="ne"]')).toBeInTheDocument();
      expect(container.querySelector('[data-dock-float-resize="nw"]')).toBeInTheDocument();
      expect(container.querySelector('[data-dock-float-resize="se"]')).toBeInTheDocument();
      expect(container.querySelector('[data-dock-float-resize="sw"]')).toBeInTheDocument();
    });

    it('floating panel has title bar', () => {
      const { container } = render(
        <DockLayout
          panels={[
            { id: 'a', title: 'Panel A' },
            { id: 'b', title: 'Panel B' },
          ]}
          renderPanel={defaultRender}
        />,
      );
      const tab = container.querySelector('[data-dock-tab="a"]') as HTMLElement;
      fireEvent.contextMenu(tab);
      const floatAction = container.querySelector('[data-dock-context-action="float"]') as HTMLElement;
      fireEvent.click(floatAction);
      expect(container.querySelector('[data-dock-floating-titlebar]')).toBeInTheDocument();
    });

    it('floating panel has close button', () => {
      const { container } = render(
        <DockLayout
          panels={[
            { id: 'a', title: 'Panel A' },
            { id: 'b', title: 'Panel B' },
          ]}
          renderPanel={defaultRender}
        />,
      );
      const tab = container.querySelector('[data-dock-tab="a"]') as HTMLElement;
      fireEvent.contextMenu(tab);
      const floatAction = container.querySelector('[data-dock-context-action="float"]') as HTMLElement;
      fireEvent.click(floatAction);
      expect(container.querySelector('[data-dock-floating-close]')).toBeInTheDocument();
    });

    it('floating panel close removes floating panel', () => {
      const { container } = render(
        <DockLayout
          panels={[
            { id: 'a', title: 'Panel A' },
            { id: 'b', title: 'Panel B' },
          ]}
          renderPanel={defaultRender}
        />,
      );
      const tab = container.querySelector('[data-dock-tab="a"]') as HTMLElement;
      fireEvent.contextMenu(tab);
      const floatAction = container.querySelector('[data-dock-context-action="float"]') as HTMLElement;
      fireEvent.click(floatAction);
      const closeBtn = container.querySelector('[data-dock-floating-close]') as HTMLElement;
      fireEvent.click(closeBtn);
      expect(container.querySelector('[data-dock-floating]')).not.toBeInTheDocument();
    });
  });

  // ── Auto-hide and peek ────────────────────────────

  describe('auto-hide', () => {
    it('auto-hide creates auto-hide bar and tab', () => {
      const { container } = render(
        <DockLayout
          panels={[
            { id: 'a', title: 'Panel A' },
            { id: 'b', title: 'Panel B' },
          ]}
          renderPanel={defaultRender}
        />,
      );
      const tab = container.querySelector('[data-dock-tab="a"]') as HTMLElement;
      fireEvent.contextMenu(tab);
      const action = container.querySelector('[data-dock-context-action="auto-hide-left"]') as HTMLElement;
      fireEvent.click(action);
      expect(container.querySelector('[data-dock-autohide-bar="left"]')).toBeInTheDocument();
      expect(container.querySelector('[data-dock-autohide-tab="a"]')).toBeInTheDocument();
    });

    it('auto-hide tab click restores panel', () => {
      const { container } = render(
        <DockLayout
          panels={[
            { id: 'a', title: 'Panel A' },
            { id: 'b', title: 'Panel B' },
          ]}
          renderPanel={defaultRender}
        />,
      );
      const tab = container.querySelector('[data-dock-tab="a"]') as HTMLElement;
      fireEvent.contextMenu(tab);
      const action = container.querySelector('[data-dock-context-action="auto-hide-left"]') as HTMLElement;
      fireEvent.click(action);
      expect(container.querySelector('[data-dock-autohide-tab="a"]')).toBeInTheDocument();

      const autoHideTab = container.querySelector('[data-dock-autohide-tab="a"]') as HTMLElement;
      fireEvent.click(autoHideTab);
      expect(container.querySelector('[data-dock-autohide-tab="a"]')).not.toBeInTheDocument();
      expect(container.querySelector('[data-dock-tab="a"]')).toBeInTheDocument();
    });

    it('auto-hide tab hover shows peek panel', () => {
      const { container } = render(
        <DockLayout
          panels={[
            { id: 'a', title: 'Panel A' },
            { id: 'b', title: 'Panel B' },
          ]}
          renderPanel={defaultRender}
        />,
      );
      const tab = container.querySelector('[data-dock-tab="a"]') as HTMLElement;
      fireEvent.contextMenu(tab);
      const action = container.querySelector('[data-dock-context-action="auto-hide-left"]') as HTMLElement;
      fireEvent.click(action);

      const autoHideTab = container.querySelector('[data-dock-autohide-tab="a"]') as HTMLElement;
      fireEvent.mouseEnter(autoHideTab);
      expect(container.querySelector('[data-dock-peek-panel="a"]')).toBeInTheDocument();
    });
  });

  // ── Tab bar as group drag handle ──────────────────

  describe('group drag', () => {
    it('renders tab bar for group drag', () => {
      const { container } = render(
        <DockLayout
          panels={[
            { id: 'a', title: 'Panel A' },
            { id: 'b', title: 'Panel B' },
          ]}
          renderPanel={defaultRender}
        />,
      );
      const tabBar = container.querySelector('[data-dock-tab-bar]') as HTMLElement;
      expect(tabBar).toBeInTheDocument();
    });

    it('group drag shows ghost with panel count', () => {
      const { container } = render(
        <DockLayout
          panels={[
            { id: 'a', title: 'Panel A' },
            { id: 'b', title: 'Panel B' },
          ]}
          renderPanel={defaultRender}
        />,
      );
      const tabBar = container.querySelector('[data-dock-tab-bar]') as HTMLElement;
      // Pointer down on empty area of tab bar (not on tab itself)
      fireEvent.pointerDown(tabBar, { clientX: 300, clientY: 10, button: 0 });
      fireEvent.pointerMove(window, { clientX: 320, clientY: 10 });
      const ghost = container.querySelector('[data-dock-drag-ghost]');
      expect(ghost).toBeInTheDocument();
      // Group ghost should include count and titles
      expect(ghost?.textContent).toContain('[2]');
    });
  });

  // ── classNames & styles ───────────────────────────

  describe('classNames & styles', () => {
    it('applies classNames.root', () => {
      render(
        <DockLayout
          data-testid="root"
          classNames={{ root: 'slot-root' }}
          renderPanel={defaultRender}
        />,
      );
      expect(screen.getByTestId('root')).toHaveClass('slot-root');
    });

    it('applies styles.root', () => {
      render(
        <DockLayout
          data-testid="root"
          styles={{ root: { opacity: '0.9' } }}
          renderPanel={defaultRender}
        />,
      );
      expect(screen.getByTestId('root')).toHaveStyle({ opacity: '0.9' });
    });

    it('merges className + classNames.root', () => {
      render(
        <DockLayout
          data-testid="root"
          className="outer"
          classNames={{ root: 'inner' }}
          renderPanel={defaultRender}
        />,
      );
      const el = screen.getByTestId('root');
      expect(el).toHaveClass('outer');
      expect(el).toHaveClass('inner');
    });

    it('merges style + styles.root', () => {
      render(
        <DockLayout
          data-testid="root"
          style={{ margin: 4 }}
          styles={{ root: { padding: 8 } }}
          renderPanel={defaultRender}
        />,
      );
      const el = screen.getByTestId('root');
      expect(el).toHaveStyle({ margin: '4px', padding: '8px' });
    });

    it('applies classNames.group', () => {
      const { container } = render(
        <DockLayout
          panels={[{ id: 'a', title: 'A' }]}
          classNames={{ group: 'custom-group' }}
          renderPanel={defaultRender}
        />,
      );
      const group = container.querySelector('[data-dock-group]');
      expect(group).toHaveClass('custom-group');
    });

    it('applies classNames.tabBar', () => {
      const { container } = render(
        <DockLayout
          panels={[{ id: 'a', title: 'A' }]}
          classNames={{ tabBar: 'custom-tabbar' }}
          renderPanel={defaultRender}
        />,
      );
      const tabBar = container.querySelector('[data-dock-tab-bar]');
      expect(tabBar).toHaveClass('custom-tabbar');
    });

    it('applies styles.tab', () => {
      const { container } = render(
        <DockLayout
          panels={[{ id: 'a', title: 'A' }]}
          styles={{ tab: { letterSpacing: '2px' } }}
          renderPanel={defaultRender}
        />,
      );
      const tab = container.querySelector('[data-dock-tab="a"]');
      expect(tab).toHaveStyle({ letterSpacing: '2px' });
    });

    it('applies classNames.splitContainer', () => {
      const initialRoot: DockSplitNode = {
        type: 'split',
        id: 's1',
        direction: 'horizontal',
        children: [
          { type: 'group', id: 'g1', panelIds: ['a'], activePanelId: 'a' },
          { type: 'group', id: 'g2', panelIds: ['b'], activePanelId: 'b' },
        ],
        sizes: [0.5, 0.5],
      };
      const { container } = render(
        <DockLayout
          initialRoot={initialRoot}
          panels={[{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }]}
          classNames={{ splitContainer: 'custom-split' }}
          renderPanel={defaultRender}
        />,
      );
      const split = container.querySelector('[data-dock-split]');
      expect(split).toHaveClass('custom-split');
    });

    it('applies styles.resizeHandle', () => {
      const initialRoot: DockSplitNode = {
        type: 'split',
        id: 's1',
        direction: 'horizontal',
        children: [
          { type: 'group', id: 'g1', panelIds: ['a'], activePanelId: 'a' },
          { type: 'group', id: 'g2', panelIds: ['b'], activePanelId: 'b' },
        ],
        sizes: [0.5, 0.5],
      };
      const { container } = render(
        <DockLayout
          initialRoot={initialRoot}
          panels={[{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }]}
          styles={{ resizeHandle: { opacity: '0.5' } }}
          renderPanel={defaultRender}
        />,
      );
      const handle = container.querySelector('[data-dock-resize-handle]');
      expect(handle).toHaveStyle({ opacity: '0.5' });
    });

    it('applies styles.panelContent', () => {
      const { container } = render(
        <DockLayout
          panels={[{ id: 'a', title: 'A' }]}
          styles={{ panelContent: { padding: '16px' } }}
          renderPanel={defaultRender}
        />,
      );
      const content = container.querySelector('[data-dock-panel="a"]');
      expect(content).toHaveStyle({ padding: '16px' });
    });
  });
});

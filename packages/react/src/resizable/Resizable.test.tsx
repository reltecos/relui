/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Resizable } from './Resizable';

describe('Resizable', () => {
  it('renders children', () => {
    render(
      <Resizable>
        <p>Content</p>
      </Resizable>,
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies default size', () => {
    render(
      <Resizable data-testid="resizable-root" defaultWidth={300} defaultHeight={250}>
        <div>Content</div>
      </Resizable>,
    );
    const el = screen.getByTestId('resizable-root');
    expect(el).toHaveStyle({ width: '300px', height: '250px' });
  });

  it('renders 8 handles by default', () => {
    const { container } = render(
      <Resizable>
        <div>Content</div>
      </Resizable>,
    );
    const handles = container.querySelectorAll('[data-direction]');
    expect(handles).toHaveLength(8);
  });

  it('renders only specified direction handles', () => {
    const { container } = render(
      <Resizable directions={['right', 'bottom']}>
        <div>Content</div>
      </Resizable>,
    );
    const handles = container.querySelectorAll('[data-direction]');
    expect(handles).toHaveLength(2);
    const dirs = Array.from(handles).map(h => h.getAttribute('data-direction'));
    expect(dirs).toContain('right');
    expect(dirs).toContain('bottom');
  });

  it('hides handles when disabled', () => {
    const { container } = render(
      <Resizable disabled>
        <div>Content</div>
      </Resizable>,
    );
    const handles = container.querySelectorAll('[data-direction]');
    expect(handles).toHaveLength(0);
  });

  it('sets data-disabled attribute when disabled', () => {
    render(
      <Resizable data-testid="resizable-root" disabled>
        <div>Content</div>
      </Resizable>,
    );
    expect(screen.getByTestId('resizable-root')).toHaveAttribute('data-disabled');
  });

  it('forwards ref', () => {
    let refValue: HTMLDivElement | null = null;
    render(
      <Resizable ref={(el) => { refValue = el; }} data-testid="resizable-root">
        <div>Content</div>
      </Resizable>,
    );
    expect(refValue).toBe(screen.getByTestId('resizable-root'));
  });

  it('passes through HTML attributes', () => {
    render(
      <Resizable data-testid="resizable-root" id="panel" aria-label="Resizable panel">
        <div>Content</div>
      </Resizable>,
    );
    const el = screen.getByTestId('resizable-root');
    expect(el).toHaveAttribute('id', 'panel');
  });

  it('handles have aria-hidden', () => {
    const { container } = render(
      <Resizable>
        <div>Content</div>
      </Resizable>,
    );
    const handles = container.querySelectorAll('[data-direction]');
    handles.forEach((h) => {
      expect(h).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('pointer interaction', () => {
    it('starts resize on pointer down on handle', () => {
      const { container } = render(
        <Resizable data-testid="resizable-root" defaultWidth={200} defaultHeight={200}>
          <div>Content</div>
        </Resizable>,
      );
      const rightHandle = container.querySelector('[data-direction="right"]');
      expect(rightHandle).toBeInTheDocument();

      fireEvent.pointerDown(rightHandle as HTMLElement, { clientX: 200, clientY: 100 });
      expect(screen.getByTestId('resizable-root')).toHaveAttribute('data-resizing');
    });
  });

  describe('classNames & styles', () => {
    it('applies classNames.root', () => {
      render(
        <Resizable data-testid="resizable-root" classNames={{ root: 'slot-root' }}>
          <div>Content</div>
        </Resizable>,
      );
      expect(screen.getByTestId('resizable-root')).toHaveClass('slot-root');
    });

    it('applies styles.root', () => {
      render(
        <Resizable data-testid="resizable-root" styles={{ root: { opacity: '0.5' } }}>
          <div>Content</div>
        </Resizable>,
      );
      expect(screen.getByTestId('resizable-root')).toHaveStyle({ opacity: '0.5' });
    });

    it('merges className + classNames.root', () => {
      render(
        <Resizable data-testid="resizable-root" className="outer" classNames={{ root: 'inner' }}>
          <div>Content</div>
        </Resizable>,
      );
      const el = screen.getByTestId('resizable-root');
      expect(el).toHaveClass('outer');
      expect(el).toHaveClass('inner');
    });

    it('merges style + styles.root', () => {
      render(
        <Resizable data-testid="resizable-root" style={{ margin: 4 }} styles={{ root: { padding: 8 } }}>
          <div>Content</div>
        </Resizable>,
      );
      const el = screen.getByTestId('resizable-root');
      expect(el).toHaveStyle({ margin: '4px', padding: '8px' });
    });

    it('applies classNames.handle to handle elements', () => {
      const { container } = render(
        <Resizable classNames={{ handle: 'custom-handle' }} directions={['right']}>
          <div>Content</div>
        </Resizable>,
      );
      const handle = container.querySelector('[data-direction="right"]');
      expect(handle).toHaveClass('custom-handle');
    });
  });
});

// ── Compound API ──────────────────────────────────────

describe('Resizable (Compound)', () => {
  it('compound: Handle sub-component render edilir', () => {
    render(
      <Resizable data-testid="resizable-root" defaultWidth={200} defaultHeight={200} directions={[]}>
        <div>Content</div>
        <Resizable.Handle direction="right" />
      </Resizable>,
    );
    expect(screen.getByTestId('resizable-handle-right')).toBeInTheDocument();
  });

  it('compound: Handle data-direction attribute set edilir', () => {
    render(
      <Resizable data-testid="resizable-root" defaultWidth={200} defaultHeight={200} directions={[]}>
        <div>Content</div>
        <Resizable.Handle direction="bottom" />
      </Resizable>,
    );
    expect(screen.getByTestId('resizable-handle-bottom')).toHaveAttribute('data-direction', 'bottom');
  });

  it('compound: Handle aria-hidden="true" tasir', () => {
    render(
      <Resizable data-testid="resizable-root" defaultWidth={200} defaultHeight={200} directions={[]}>
        <div>Content</div>
        <Resizable.Handle direction="right" />
      </Resizable>,
    );
    expect(screen.getByTestId('resizable-handle-right')).toHaveAttribute('aria-hidden', 'true');
  });

  it('compound: classNames context ile Handle a aktarilir', () => {
    render(
      <Resizable data-testid="resizable-root" defaultWidth={200} defaultHeight={200} directions={[]} classNames={{ handle: 'cmp-handle' }}>
        <div>Content</div>
        <Resizable.Handle direction="right" />
      </Resizable>,
    );
    expect(screen.getByTestId('resizable-handle-right').className).toContain('cmp-handle');
  });

  it('compound: birden fazla Handle render edilir', () => {
    render(
      <Resizable data-testid="resizable-root" defaultWidth={200} defaultHeight={200} directions={[]}>
        <div>Content</div>
        <Resizable.Handle direction="right" />
        <Resizable.Handle direction="bottom" />
        <Resizable.Handle direction="bottomRight" />
      </Resizable>,
    );
    expect(screen.getByTestId('resizable-handle-right')).toBeInTheDocument();
    expect(screen.getByTestId('resizable-handle-bottom')).toBeInTheDocument();
    expect(screen.getByTestId('resizable-handle-bottomRight')).toBeInTheDocument();
  });
});

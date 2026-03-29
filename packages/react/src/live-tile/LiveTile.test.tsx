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
import { LiveTile } from './LiveTile';

const FACES = [
  <div key="1">Face 1</div>,
  <div key="2">Face 2</div>,
  <div key="3">Face 3</div>,
];

describe('LiveTile', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<LiveTile faces={FACES} />);
    expect(screen.getByTestId('live-tile-root')).toBeInTheDocument();
  });

  it('varsayilan size md', () => {
    render(<LiveTile faces={FACES} />);
    expect(screen.getByTestId('live-tile-root')).toHaveAttribute('data-size', 'md');
  });

  it('size sm set edilir', () => {
    render(<LiveTile faces={FACES} size="sm" />);
    expect(screen.getByTestId('live-tile-root')).toHaveAttribute('data-size', 'sm');
  });

  it('size lg set edilir', () => {
    render(<LiveTile faces={FACES} size="lg" />);
    expect(screen.getByTestId('live-tile-root')).toHaveAttribute('data-size', 'lg');
  });

  // ── Faces ──

  it('faces render edilir', () => {
    render(<LiveTile faces={FACES} />);
    const faces = screen.getAllByTestId('live-tile-face');
    expect(faces).toHaveLength(3);
  });

  it('ilk face aktif olarak render edilir', () => {
    render(<LiveTile faces={FACES} />);
    const faces = screen.getAllByTestId('live-tile-face');
    expect(faces[0]).toHaveAttribute('data-active', 'true');
    expect(faces[1]).toHaveAttribute('data-active', 'false');
  });

  it('face container render edilir', () => {
    render(<LiveTile faces={FACES} />);
    expect(screen.getByTestId('live-tile-face-container')).toBeInTheDocument();
  });

  // ── Animation ──

  it('varsayilan animation slide', () => {
    render(<LiveTile faces={FACES} />);
    expect(screen.getByTestId('live-tile-root')).toHaveAttribute('data-animation', 'slide');
  });

  it('animation flip set edilir', () => {
    render(<LiveTile faces={FACES} animation="flip" />);
    expect(screen.getByTestId('live-tile-root')).toHaveAttribute('data-animation', 'flip');
  });

  it('animation fade set edilir', () => {
    render(<LiveTile faces={FACES} animation="fade" />);
    expect(screen.getByTestId('live-tile-root')).toHaveAttribute('data-animation', 'fade');
  });

  // ── Indicator ──

  it('indicator render edilir', () => {
    render(<LiveTile faces={FACES} />);
    expect(screen.getByTestId('live-tile-indicator')).toBeInTheDocument();
  });

  it('indicator dot lar render edilir', () => {
    render(<LiveTile faces={FACES} />);
    const dots = screen.getAllByTestId('live-tile-indicator-dot');
    expect(dots).toHaveLength(3);
  });

  it('ilk dot aktif', () => {
    render(<LiveTile faces={FACES} />);
    const dots = screen.getAllByTestId('live-tile-indicator-dot');
    expect(dots[0]).toHaveAttribute('data-active', 'true');
    expect(dots[1]).toHaveAttribute('data-active', 'false');
  });

  it('showIndicator false ile indicator render edilmez', () => {
    render(<LiveTile faces={FACES} showIndicator={false} />);
    expect(screen.queryByTestId('live-tile-indicator')).not.toBeInTheDocument();
  });

  it('tek face ile indicator render edilmez', () => {
    render(<LiveTile faces={[<div key="1">Solo</div>]} />);
    expect(screen.queryByTestId('live-tile-indicator')).not.toBeInTheDocument();
  });

  it('dot a tiklaninca ilgili face e gecilir', () => {
    render(<LiveTile faces={FACES} paused />);
    const dots = screen.getAllByTestId('live-tile-indicator-dot');
    fireEvent.click(dots[2]);
    const faces = screen.getAllByTestId('live-tile-face');
    expect(faces[2]).toHaveAttribute('data-active', 'true');
  });

  // ── Paused ──

  it('paused data attribute set edilir', () => {
    render(<LiveTile faces={FACES} paused />);
    expect(screen.getByTestId('live-tile-root')).toHaveAttribute('data-paused', 'true');
  });

  // ── A11y ──

  it('aria-roledescription set edilir', () => {
    render(<LiveTile faces={FACES} />);
    expect(screen.getByTestId('live-tile-root')).toHaveAttribute('aria-roledescription', 'live tile');
  });

  it('aria-live set edilir', () => {
    render(<LiveTile faces={FACES} />);
    expect(screen.getByTestId('live-tile-root')).toHaveAttribute('aria-live', 'polite');
  });

  it('inaktif face aria-hidden true', () => {
    render(<LiveTile faces={FACES} />);
    const faces = screen.getAllByTestId('live-tile-face');
    expect(faces[1]).toHaveAttribute('aria-hidden', 'true');
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<LiveTile faces={FACES} className="my-tile" />);
    expect(screen.getByTestId('live-tile-root').className).toContain('my-tile');
  });

  it('style root elemana eklenir', () => {
    render(<LiveTile faces={FACES} style={{ padding: '16px' }} />);
    expect(screen.getByTestId('live-tile-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<LiveTile faces={FACES} classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('live-tile-root').className).toContain('custom-root');
  });

  it('classNames.face face elemana eklenir', () => {
    render(<LiveTile faces={FACES} classNames={{ face: 'custom-face' }} />);
    const faces = screen.getAllByTestId('live-tile-face');
    expect(faces[0].className).toContain('custom-face');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<LiveTile faces={FACES} styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('live-tile-root')).toHaveStyle({ padding: '24px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<LiveTile faces={FACES} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('LiveTile (Compound)', () => {
  it('compound: children face olarak render edilir', () => {
    render(
      <LiveTile>
        <div>Face A</div>
        <div>Face B</div>
      </LiveTile>,
    );
    const faces = screen.getAllByTestId('live-tile-face');
    expect(faces).toHaveLength(2);
  });

  it('compound: ilk face aktif', () => {
    render(
      <LiveTile>
        <div>Face A</div>
        <div>Face B</div>
      </LiveTile>,
    );
    const faces = screen.getAllByTestId('live-tile-face');
    expect(faces[0]).toHaveAttribute('data-active', 'true');
  });

  it('compound: indicator render edilir', () => {
    render(
      <LiveTile>
        <div>Face A</div>
        <div>Face B</div>
      </LiveTile>,
    );
    expect(screen.getByTestId('live-tile-indicator')).toBeInTheDocument();
  });

  it('compound: size context ile aktarilir', () => {
    render(
      <LiveTile size="lg">
        <div>Face A</div>
      </LiveTile>,
    );
    expect(screen.getByTestId('live-tile-root')).toHaveAttribute('data-size', 'lg');
  });

  it('compound: animation context ile aktarilir', () => {
    render(
      <LiveTile animation="flip">
        <div>Face A</div>
        <div>Face B</div>
      </LiveTile>,
    );
    expect(screen.getByTestId('live-tile-root')).toHaveAttribute('data-animation', 'flip');
  });

  it('compound: classNames.root eklenir', () => {
    render(
      <LiveTile classNames={{ root: 'cmp-root' }}>
        <div>Face A</div>
      </LiveTile>,
    );
    expect(screen.getByTestId('live-tile-root').className).toContain('cmp-root');
  });

  it('LiveTile.Face context disinda hata firlatir', () => {
    expect(() => render(<LiveTile.Face>Test</LiveTile.Face>)).toThrow();
  });
});

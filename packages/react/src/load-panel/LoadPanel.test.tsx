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
import { LoadPanel } from './LoadPanel';

describe('LoadPanel', () => {
  // ── Render ────────────────────────────────────────
  it('varsayilan olarak render eder', () => {
    render(<LoadPanel />);
    const el = screen.getByTestId('load-panel');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('role', 'status');
    expect(el).toHaveAttribute('aria-busy', 'true');
  });

  it('ref iletir', () => {
    const ref = vi.fn();
    render(<LoadPanel ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  // ── Visibility ────────────────────────────────────
  it('visible=false iken render etmez', () => {
    render(<LoadPanel visible={false} />);
    expect(screen.queryByTestId('load-panel')).not.toBeInTheDocument();
  });

  it('visible=true iken render eder', () => {
    render(<LoadPanel visible={true} />);
    expect(screen.getByTestId('load-panel')).toBeInTheDocument();
  });

  // ── Spinner ───────────────────────────────────────
  it('varsayilan spinner render eder', () => {
    render(<LoadPanel />);
    expect(screen.getByTestId('load-panel-spinner')).toBeInTheDocument();
  });

  it('ozel indicator destekler', () => {
    render(<LoadPanel indicator={<span data-testid="custom-ind">*</span>} />);
    expect(screen.getByTestId('custom-ind')).toBeInTheDocument();
    expect(screen.queryByTestId('load-panel-spinner')).not.toBeInTheDocument();
  });

  // ── Message ───────────────────────────────────────
  it('mesaj gosterir', () => {
    render(<LoadPanel message="Yukleniyor..." />);
    expect(screen.getByTestId('load-panel-message')).toHaveTextContent('Yukleniyor...');
  });

  it('mesaj yoksa message render edilmez', () => {
    render(<LoadPanel />);
    expect(screen.queryByTestId('load-panel-message')).not.toBeInTheDocument();
  });

  it('mesaj ReactNode destekler', () => {
    render(<LoadPanel message={<em data-testid="msg-em">Bekleyin</em>} />);
    expect(screen.getByTestId('msg-em')).toBeInTheDocument();
  });

  // ── ARIA ──────────────────────────────────────────
  it('string mesaj aria-label olarak kullanilir', () => {
    render(<LoadPanel message="Veri yukleniyor" />);
    const el = screen.getByTestId('load-panel');
    expect(el).toHaveAttribute('aria-label', 'Veri yukleniyor');
  });

  it('mesaj yoksa varsayilan aria-label', () => {
    render(<LoadPanel />);
    const el = screen.getByTestId('load-panel');
    expect(el).toHaveAttribute('aria-label', 'Yukleniyor');
  });

  // ── Size ──────────────────────────────────────────
  it('size sm uygulanir', () => {
    render(<LoadPanel size="sm" />);
    expect(screen.getByTestId('load-panel')).toBeInTheDocument();
  });

  it('size lg uygulanir', () => {
    render(<LoadPanel size="lg" />);
    expect(screen.getByTestId('load-panel')).toBeInTheDocument();
  });

  // ── Backdrop ──────────────────────────────────────
  it('dark backdrop uygulanir', () => {
    render(<LoadPanel backdrop="dark" />);
    expect(screen.getByTestId('load-panel')).toBeInTheDocument();
  });

  it('none backdrop uygulanir', () => {
    render(<LoadPanel backdrop="none" />);
    expect(screen.getByTestId('load-panel')).toBeInTheDocument();
  });

  // ── Fullscreen ────────────────────────────────────
  it('fullscreen prop uygulanir', () => {
    render(<LoadPanel fullscreen />);
    expect(screen.getByTestId('load-panel')).toBeInTheDocument();
  });

  // ── ID & className ────────────────────────────────
  it('id prop iletir', () => {
    render(<LoadPanel id="lp-1" />);
    expect(screen.getByTestId('load-panel')).toHaveAttribute('id', 'lp-1');
  });

  it('className prop eklenir', () => {
    render(<LoadPanel className="custom" />);
    expect(screen.getByTestId('load-panel').className).toContain('custom');
  });

  it('style prop eklenir', () => {
    render(<LoadPanel style={{ opacity: 0.9 }} />);
    expect(screen.getByTestId('load-panel')).toHaveStyle({ opacity: '0.9' });
  });

  // ── Slot API ──────────────────────────────────────
  it('classNames root slot uygulanir', () => {
    render(<LoadPanel classNames={{ root: 'my-root' }} />);
    expect(screen.getByTestId('load-panel').className).toContain('my-root');
  });

  it('styles root slot uygulanir', () => {
    render(<LoadPanel styles={{ root: { padding: '16px' } }} />);
    expect(screen.getByTestId('load-panel')).toHaveStyle({ padding: '16px' });
  });

  it('classNames message slot uygulanir', () => {
    render(
      <LoadPanel message="Test" classNames={{ message: 'my-msg' }} />
    );
    expect(screen.getByTestId('load-panel-message').className).toContain('my-msg');
  });

  it('styles message slot uygulanir', () => {
    render(
      <LoadPanel message="Test" styles={{ message: { fontSize: '16px' } }} />
    );
    expect(screen.getByTestId('load-panel-message')).toHaveStyle({ fontSize: '16px' });
  });
});

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
import { Result } from './Result';

describe('Result', () => {
  // ── Render ────────────────────────────────────────
  it('varsayilan olarak render eder', () => {
    render(<Result title="Basarili" />);
    const el = screen.getByTestId('result');
    expect(el).toBeInTheDocument();
  });

  it('ref iletir', () => {
    const ref = vi.fn();
    render(<Result title="Basarili" ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  // ── Status ────────────────────────────────────────
  it('data-status attribute ayarlanir', () => {
    render(<Result title="Basarili" status="success" />);
    expect(screen.getByTestId('result')).toHaveAttribute('data-status', 'success');
  });

  it('varsayilan status info', () => {
    render(<Result title="Bilgi" />);
    expect(screen.getByTestId('result')).toHaveAttribute('data-status', 'info');
  });

  it('error status ayarlanir', () => {
    render(<Result title="Hata" status="error" />);
    expect(screen.getByTestId('result')).toHaveAttribute('data-status', 'error');
  });

  it('warning status ayarlanir', () => {
    render(<Result title="Uyari" status="warning" />);
    expect(screen.getByTestId('result')).toHaveAttribute('data-status', 'warning');
  });

  it('404 status ayarlanir', () => {
    render(<Result title="Bulunamadi" status="404" />);
    expect(screen.getByTestId('result')).toHaveAttribute('data-status', '404');
  });

  // ── Title ─────────────────────────────────────────
  it('baslik gosterir', () => {
    render(<Result title="Odeme basarili!" />);
    expect(screen.getByTestId('result-title')).toHaveTextContent('Odeme basarili!');
  });

  it('title h2 elementi olarak render eder', () => {
    render(<Result title="Basarili" />);
    const title = screen.getByTestId('result-title');
    expect(title.tagName).toBe('H2');
  });

  // ── Subtitle ──────────────────────────────────────
  it('alt baslik gosterir', () => {
    render(<Result title="Basarili" subtitle="Siparisiniz onaylandi." />);
    expect(screen.getByTestId('result-subtitle')).toHaveTextContent('Siparisiniz onaylandi.');
  });

  it('subtitle olmazsa render edilmez', () => {
    render(<Result title="Basarili" />);
    expect(screen.queryByTestId('result-subtitle')).not.toBeInTheDocument();
  });

  // ── Icon ──────────────────────────────────────────
  it('varsayilan ikon render eder', () => {
    render(<Result title="Basarili" status="success" />);
    expect(screen.getByTestId('result-icon')).toBeInTheDocument();
  });

  it('ozel ikon destekler', () => {
    render(<Result title="Basarili" icon={<span data-testid="custom-icon">OK</span>} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('icon=null iken ikon gizlenir', () => {
    render(<Result title="Basarili" icon={null} />);
    expect(screen.queryByTestId('result-icon')).not.toBeInTheDocument();
  });

  it('her status icin farkli varsayilan ikon render eder', () => {
    const { rerender } = render(<Result title="Test" status="success" />);
    expect(screen.getByTestId('result-icon')).toBeInTheDocument();
    rerender(<Result title="Test" status="error" />);
    expect(screen.getByTestId('result-icon')).toBeInTheDocument();
    rerender(<Result title="Test" status="warning" />);
    expect(screen.getByTestId('result-icon')).toBeInTheDocument();
    rerender(<Result title="Test" status="404" />);
    expect(screen.getByTestId('result-icon')).toBeInTheDocument();
  });

  // ── Action ────────────────────────────────────────
  it('aksiyon alani gosterir', () => {
    render(
      <Result
        title="Basarili"
        action={<button data-testid="action-btn">Devam</button>}
      />
    );
    expect(screen.getByTestId('result-action')).toBeInTheDocument();
    expect(screen.getByTestId('action-btn')).toHaveTextContent('Devam');
  });

  it('aksiyon olmazsa render edilmez', () => {
    render(<Result title="Basarili" />);
    expect(screen.queryByTestId('result-action')).not.toBeInTheDocument();
  });

  // ── Extra ─────────────────────────────────────────
  it('extra icerik gosterir', () => {
    render(
      <Result
        title="Basarili"
        extra={<span data-testid="extra-content">Detaylar</span>}
      />
    );
    expect(screen.getByTestId('result-extra')).toBeInTheDocument();
    expect(screen.getByTestId('extra-content')).toBeInTheDocument();
  });

  it('extra olmazsa render edilmez', () => {
    render(<Result title="Basarili" />);
    expect(screen.queryByTestId('result-extra')).not.toBeInTheDocument();
  });

  // ── Size ──────────────────────────────────────────
  it('size sm uygulanir', () => {
    render(<Result title="Basarili" size="sm" />);
    expect(screen.getByTestId('result')).toBeInTheDocument();
  });

  it('size lg uygulanir', () => {
    render(<Result title="Basarili" size="lg" />);
    expect(screen.getByTestId('result')).toBeInTheDocument();
  });

  // ── ID & className ────────────────────────────────
  it('id prop iletir', () => {
    render(<Result title="Basarili" id="res-1" />);
    expect(screen.getByTestId('result')).toHaveAttribute('id', 'res-1');
  });

  it('className prop eklenir', () => {
    render(<Result title="Basarili" className="custom" />);
    expect(screen.getByTestId('result').className).toContain('custom');
  });

  it('style prop eklenir', () => {
    render(<Result title="Basarili" style={{ opacity: 0.9 }} />);
    expect(screen.getByTestId('result')).toHaveStyle({ opacity: '0.9' });
  });

  // ── Slot API ──────────────────────────────────────
  it('classNames slot API calisir', () => {
    render(
      <Result
        title="Basarili"
        subtitle="Detay"
        classNames={{ title: 'my-title', subtitle: 'my-sub' }}
      />
    );
    expect(screen.getByTestId('result-title').className).toContain('my-title');
    expect(screen.getByTestId('result-subtitle').className).toContain('my-sub');
  });

  it('styles slot API calisir', () => {
    render(
      <Result
        title="Basarili"
        subtitle="Detay"
        styles={{
          title: { fontSize: '28px' },
          subtitle: { letterSpacing: '1px' },
        }}
      />
    );
    expect(screen.getByTestId('result-title')).toHaveStyle({ fontSize: '28px' });
    expect(screen.getByTestId('result-subtitle')).toHaveStyle({ letterSpacing: '1px' });
  });

  it('root slot classNames ve styles eklenir', () => {
    render(
      <Result
        title="Basarili"
        classNames={{ root: 'root-cls' }}
        styles={{ root: { padding: '20px' } }}
      />
    );
    const el = screen.getByTestId('result');
    expect(el.className).toContain('root-cls');
    expect(el).toHaveStyle({ padding: '20px' });
  });

  it('icon slot styles uygulanir', () => {
    render(
      <Result
        title="Basarili"
        styles={{ icon: { opacity: '0.7' } }}
      />
    );
    expect(screen.getByTestId('result-icon')).toHaveStyle({ opacity: '0.7' });
  });

  it('action slot classNames uygulanir', () => {
    render(
      <Result
        title="Basarili"
        action={<button>Devam</button>}
        classNames={{ action: 'my-action' }}
      />
    );
    expect(screen.getByTestId('result-action').className).toContain('my-action');
  });

  // ── ReactNode title ───────────────────────────────
  it('title ReactNode olarak calisir', () => {
    render(
      <Result title={<span data-testid="jsx-title">JSX Baslik</span>} />
    );
    expect(screen.getByTestId('jsx-title')).toBeInTheDocument();
  });
});

// ── Compound API ──

describe('Result (Compound)', () => {
  it('compound: icon render edilir', () => {
    render(
      <Result status="success">
        <Result.Icon><span data-testid="cmp-icon">OK</span></Result.Icon>
        <Result.Title>Basarili</Result.Title>
      </Result>,
    );
    expect(screen.getByTestId('result-icon')).toBeInTheDocument();
    expect(screen.getByTestId('cmp-icon')).toBeInTheDocument();
  });

  it('compound: title render edilir', () => {
    render(
      <Result>
        <Result.Title>Islem tamamlandi</Result.Title>
      </Result>,
    );
    expect(screen.getByTestId('result-title')).toHaveTextContent('Islem tamamlandi');
  });

  it('compound: title h2 elementi olarak render eder', () => {
    render(
      <Result>
        <Result.Title>Basarili</Result.Title>
      </Result>,
    );
    expect(screen.getByTestId('result-title').tagName).toBe('H2');
  });

  it('compound: description render edilir', () => {
    render(
      <Result>
        <Result.Title>Basarili</Result.Title>
        <Result.Description>Siparisiniz onaylandi.</Result.Description>
      </Result>,
    );
    expect(screen.getByTestId('result-subtitle')).toHaveTextContent('Siparisiniz onaylandi.');
  });

  it('compound: extra render edilir', () => {
    render(
      <Result>
        <Result.Title>Basarili</Result.Title>
        <Result.Extra><span data-testid="cmp-extra">Detay</span></Result.Extra>
      </Result>,
    );
    expect(screen.getByTestId('result-extra')).toBeInTheDocument();
    expect(screen.getByTestId('cmp-extra')).toBeInTheDocument();
  });

  it('compound: tum sub-component lar birlikte render edilir', () => {
    render(
      <Result status="error">
        <Result.Icon><span>X</span></Result.Icon>
        <Result.Title>Hata</Result.Title>
        <Result.Description>Aciklama</Result.Description>
        <Result.Extra><span>Ek bilgi</span></Result.Extra>
      </Result>,
    );
    expect(screen.getByTestId('result-icon')).toBeInTheDocument();
    expect(screen.getByTestId('result-title')).toBeInTheDocument();
    expect(screen.getByTestId('result-subtitle')).toBeInTheDocument();
    expect(screen.getByTestId('result-extra')).toBeInTheDocument();
  });

  it('compound: status context ile aktarilir', () => {
    render(
      <Result status="error">
        <Result.Title>Hata</Result.Title>
      </Result>,
    );
    expect(screen.getByTestId('result')).toHaveAttribute('data-status', 'error');
  });

  it('compound: classNames context ile sub-component lara aktarilir', () => {
    render(
      <Result classNames={{ title: 'cmp-title' }}>
        <Result.Title>Basarili</Result.Title>
      </Result>,
    );
    expect(screen.getByTestId('result-title').className).toContain('cmp-title');
  });

  it('compound: styles context ile sub-component lara aktarilir', () => {
    render(
      <Result styles={{ title: { fontSize: '32px' } }}>
        <Result.Title>Basarili</Result.Title>
      </Result>,
    );
    expect(screen.getByTestId('result-title')).toHaveStyle({ fontSize: '32px' });
  });

  it('compound: context disinda kullanim hata firlat', () => {
    expect(() => render(<Result.Title>Baslik</Result.Title>)).toThrow(
      'Result compound sub-components must be used within <Result>.',
    );
  });
});

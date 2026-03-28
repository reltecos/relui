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
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  // ── Render ────────────────────────────────────────
  it('varsayilan olarak render eder', () => {
    render(<EmptyState title="Bos" />);
    const el = screen.getByTestId('empty-state');
    expect(el).toBeInTheDocument();
  });

  it('ref iletir', () => {
    const ref = vi.fn();
    render(<EmptyState title="Bos" ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  // ── Title ─────────────────────────────────────────
  it('baslik gosterir', () => {
    render(<EmptyState title="Veri bulunamadi" />);
    expect(screen.getByTestId('empty-state-title')).toHaveTextContent('Veri bulunamadi');
  });

  it('baslik olmazsa title render edilmez', () => {
    render(<EmptyState />);
    expect(screen.queryByTestId('empty-state-title')).not.toBeInTheDocument();
  });

  // ── Description ───────────────────────────────────
  it('aciklama gosterir', () => {
    render(<EmptyState title="Bos" description="Henuz kayit yok." />);
    expect(screen.getByTestId('empty-state-description')).toHaveTextContent('Henuz kayit yok.');
  });

  it('aciklama olmazsa render edilmez', () => {
    render(<EmptyState title="Bos" />);
    expect(screen.queryByTestId('empty-state-description')).not.toBeInTheDocument();
  });

  // ── Icon ──────────────────────────────────────────
  it('varsayilan ikon render eder', () => {
    render(<EmptyState title="Bos" />);
    expect(screen.getByTestId('empty-state-icon')).toBeInTheDocument();
  });

  it('ozel ikon destekler', () => {
    render(<EmptyState title="Bos" icon={<span data-testid="custom-icon">*</span>} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('icon=null iken ikon gizlenir', () => {
    render(<EmptyState title="Bos" icon={null} />);
    expect(screen.queryByTestId('empty-state-icon')).not.toBeInTheDocument();
  });

  // ── Action ────────────────────────────────────────
  it('aksiyon alani gosterir', () => {
    render(
      <EmptyState
        title="Bos"
        action={<button data-testid="action-btn">Ekle</button>}
      />
    );
    expect(screen.getByTestId('empty-state-action')).toBeInTheDocument();
    expect(screen.getByTestId('action-btn')).toHaveTextContent('Ekle');
  });

  it('aksiyon olmazsa render edilmez', () => {
    render(<EmptyState title="Bos" />);
    expect(screen.queryByTestId('empty-state-action')).not.toBeInTheDocument();
  });

  // ── Size ──────────────────────────────────────────
  it('size sm uygulanir', () => {
    render(<EmptyState title="Bos" size="sm" />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('size lg uygulanir', () => {
    render(<EmptyState title="Bos" size="lg" />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  // ── ID & className ────────────────────────────────
  it('id prop iletir', () => {
    render(<EmptyState title="Bos" id="es-1" />);
    expect(screen.getByTestId('empty-state')).toHaveAttribute('id', 'es-1');
  });

  it('className prop eklenir', () => {
    render(<EmptyState title="Bos" className="custom" />);
    expect(screen.getByTestId('empty-state').className).toContain('custom');
  });

  it('style prop eklenir', () => {
    render(<EmptyState title="Bos" style={{ opacity: 0.8 }} />);
    expect(screen.getByTestId('empty-state')).toHaveStyle({ opacity: '0.8' });
  });

  // ── Slot API ──────────────────────────────────────
  it('classNames slot API calisir', () => {
    render(
      <EmptyState
        title="Bos"
        description="Aciklama"
        classNames={{ title: 'my-title', description: 'my-desc' }}
      />
    );
    expect(screen.getByTestId('empty-state-title').className).toContain('my-title');
    expect(screen.getByTestId('empty-state-description').className).toContain('my-desc');
  });

  it('styles slot API calisir', () => {
    render(
      <EmptyState
        title="Bos"
        description="Aciklama"
        styles={{
          title: { fontSize: '20px' },
          description: { letterSpacing: '1px' },
        }}
      />
    );
    expect(screen.getByTestId('empty-state-title')).toHaveStyle({ fontSize: '20px' });
    expect(screen.getByTestId('empty-state-description')).toHaveStyle({ letterSpacing: '1px' });
  });

  it('root slot classNames ve styles eklenir', () => {
    render(
      <EmptyState
        title="Bos"
        classNames={{ root: 'root-cls' }}
        styles={{ root: { padding: '10px' } }}
      />
    );
    const el = screen.getByTestId('empty-state');
    expect(el.className).toContain('root-cls');
    expect(el).toHaveStyle({ padding: '10px' });
  });

  it('icon slot styles uygulanir', () => {
    render(
      <EmptyState
        title="Bos"
        styles={{ icon: { opacity: '0.5' } }}
      />
    );
    expect(screen.getByTestId('empty-state-icon')).toHaveStyle({ opacity: '0.5' });
  });

  it('action slot classNames uygulanir', () => {
    render(
      <EmptyState
        title="Bos"
        action={<button>Ekle</button>}
        classNames={{ action: 'my-action' }}
      />
    );
    expect(screen.getByTestId('empty-state-action').className).toContain('my-action');
  });

  it('styles.action action elemana eklenir', () => {
    render(
      <EmptyState
        title="Bos"
        action={<button>Ekle</button>}
        styles={{ action: { padding: '20px' } }}
      />
    );
    expect(screen.getByTestId('empty-state-action')).toHaveStyle({ padding: '20px' });
  });

  // ── ReactNode title & description ─────────────────
  it('title ReactNode olarak calisir', () => {
    render(
      <EmptyState
        title={<span data-testid="jsx-title">JSX Baslik</span>}
      />
    );
    expect(screen.getByTestId('jsx-title')).toBeInTheDocument();
  });

  it('description ReactNode olarak calisir', () => {
    render(
      <EmptyState
        title="Bos"
        description={<em data-testid="jsx-desc">Italic desc</em>}
      />
    );
    expect(screen.getByTestId('jsx-desc')).toBeInTheDocument();
  });
});

// ── Compound API ──

describe('EmptyState (Compound)', () => {
  it('compound: icon render edilir', () => {
    render(
      <EmptyState>
        <EmptyState.Icon><span data-testid="cmp-icon">*</span></EmptyState.Icon>
        <EmptyState.Title>Bos</EmptyState.Title>
      </EmptyState>,
    );
    expect(screen.getByTestId('empty-state-icon')).toBeInTheDocument();
    expect(screen.getByTestId('cmp-icon')).toBeInTheDocument();
  });

  it('compound: title render edilir', () => {
    render(
      <EmptyState>
        <EmptyState.Title>Veri bulunamadi</EmptyState.Title>
      </EmptyState>,
    );
    expect(screen.getByTestId('empty-state-title')).toHaveTextContent('Veri bulunamadi');
  });

  it('compound: description render edilir', () => {
    render(
      <EmptyState>
        <EmptyState.Title>Bos</EmptyState.Title>
        <EmptyState.Description>Henuz kayit yok.</EmptyState.Description>
      </EmptyState>,
    );
    expect(screen.getByTestId('empty-state-description')).toHaveTextContent('Henuz kayit yok.');
  });

  it('compound: action render edilir', () => {
    render(
      <EmptyState>
        <EmptyState.Title>Bos</EmptyState.Title>
        <EmptyState.Action><button data-testid="cmp-btn">Ekle</button></EmptyState.Action>
      </EmptyState>,
    );
    expect(screen.getByTestId('empty-state-action')).toBeInTheDocument();
    expect(screen.getByTestId('cmp-btn')).toBeInTheDocument();
  });

  it('compound: tum sub-component lar birlikte render edilir', () => {
    render(
      <EmptyState>
        <EmptyState.Icon><span>*</span></EmptyState.Icon>
        <EmptyState.Title>Bos</EmptyState.Title>
        <EmptyState.Description>Aciklama</EmptyState.Description>
        <EmptyState.Action><button>Ekle</button></EmptyState.Action>
      </EmptyState>,
    );
    expect(screen.getByTestId('empty-state-icon')).toBeInTheDocument();
    expect(screen.getByTestId('empty-state-title')).toBeInTheDocument();
    expect(screen.getByTestId('empty-state-description')).toBeInTheDocument();
    expect(screen.getByTestId('empty-state-action')).toBeInTheDocument();
  });

  it('compound: size context ile sub-component lara aktarilir', () => {
    render(
      <EmptyState size="lg">
        <EmptyState.Title>Bos</EmptyState.Title>
      </EmptyState>,
    );
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('compound: classNames context ile sub-component lara aktarilir', () => {
    render(
      <EmptyState classNames={{ title: 'cmp-title' }}>
        <EmptyState.Title>Bos</EmptyState.Title>
      </EmptyState>,
    );
    expect(screen.getByTestId('empty-state-title').className).toContain('cmp-title');
  });

  it('compound: styles context ile sub-component lara aktarilir', () => {
    render(
      <EmptyState styles={{ title: { fontSize: '24px' } }}>
        <EmptyState.Title>Bos</EmptyState.Title>
      </EmptyState>,
    );
    expect(screen.getByTestId('empty-state-title')).toHaveStyle({ fontSize: '24px' });
  });

  it('compound: context disinda kullanim hata firlat', () => {
    expect(() => render(<EmptyState.Title>Bos</EmptyState.Title>)).toThrow(
      'EmptyState compound sub-components must be used within <EmptyState>.',
    );
  });
});

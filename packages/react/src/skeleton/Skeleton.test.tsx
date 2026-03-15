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
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  // ── Render ────────────────────────────────────────
  it('varsayilan text olarak render eder', () => {
    render(<Skeleton />);
    const el = screen.getByTestId('skeleton');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('role', 'status');
    expect(el).toHaveAttribute('aria-busy', 'true');
  });

  it('ref iletir', () => {
    const ref = vi.fn();
    render(<Skeleton ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  // ── Variants ──────────────────────────────────────
  it('circle varyanti render eder', () => {
    render(<Skeleton variant="circle" width={48} />);
    const el = screen.getByTestId('skeleton');
    expect(el).toHaveStyle({ width: '48px', height: '48px' });
  });

  it('circle varyanti varsayilan boyut kullanir', () => {
    render(<Skeleton variant="circle" />);
    const el = screen.getByTestId('skeleton');
    expect(el).toHaveStyle({ width: '40px', height: '40px' });
  });

  it('rect varyanti render eder', () => {
    render(<Skeleton variant="rect" width={200} height={100} />);
    const el = screen.getByTestId('skeleton');
    expect(el).toHaveStyle({ width: '200px', height: '100px' });
  });

  it('rect varyanti ozel radius destekler', () => {
    render(<Skeleton variant="rect" width={200} height={100} radius={12} />);
    const el = screen.getByTestId('skeleton');
    expect(el).toHaveStyle({ borderRadius: '12px' });
  });

  // ── Width & Height ────────────────────────────────
  it('string width destekler', () => {
    render(<Skeleton width="80%" />);
    const el = screen.getByTestId('skeleton');
    expect(el).toHaveStyle({ width: '80%' });
  });

  it('number width px a cevrilir', () => {
    render(<Skeleton width={300} />);
    const el = screen.getByTestId('skeleton');
    expect(el).toHaveStyle({ width: '300px' });
  });

  it('number height px a cevrilir', () => {
    render(<Skeleton height={20} />);
    const el = screen.getByTestId('skeleton');
    expect(el).toHaveStyle({ height: '20px' });
  });

  // ── Multi-line text ───────────────────────────────
  it('lines > 1 ile coklu satir render eder', () => {
    render(<Skeleton lines={3} />);
    const group = screen.getByTestId('skeleton-group');
    expect(group).toBeInTheDocument();
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons.length).toBe(3);
  });

  it('son satir %60 genislikte olur', () => {
    render(<Skeleton lines={3} />);
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons[2]).toHaveStyle({ width: '60%' });
  });

  it('coklu satir grubu role=status tasir', () => {
    render(<Skeleton lines={2} />);
    const group = screen.getByTestId('skeleton-group');
    expect(group).toHaveAttribute('role', 'status');
    expect(group).toHaveAttribute('aria-busy', 'true');
  });

  it('coklu satir ref iletir', () => {
    const ref = vi.fn();
    render(<Skeleton lines={2} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  // ── Loaded ────────────────────────────────────────
  it('loaded=true ve children varsa children gosterir', () => {
    render(
      <Skeleton loaded>
        <span data-testid="content">Gercek icerik</span>
      </Skeleton>
    );
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
  });

  it('loaded=false iken skeleton gosterir', () => {
    render(
      <Skeleton loaded={false}>
        <span data-testid="content">Gercek icerik</span>
      </Skeleton>
    );
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    expect(screen.queryByTestId('content')).not.toBeInTheDocument();
  });

  // ── ARIA ──────────────────────────────────────────
  it('aria-label prop ile ayarlanir', () => {
    render(<Skeleton aria-label="Profil yukleniyor" />);
    const el = screen.getByTestId('skeleton');
    expect(el).toHaveAttribute('aria-label', 'Profil yukleniyor');
  });

  it('varsayilan aria-label kullanilir', () => {
    render(<Skeleton />);
    const el = screen.getByTestId('skeleton');
    expect(el).toHaveAttribute('aria-label', 'Yukleniyor');
  });

  // ── ID & className ────────────────────────────────
  it('id prop iletir', () => {
    render(<Skeleton id="sk-1" />);
    expect(screen.getByTestId('skeleton')).toHaveAttribute('id', 'sk-1');
  });

  it('className prop eklenir', () => {
    render(<Skeleton className="custom" />);
    expect(screen.getByTestId('skeleton').className).toContain('custom');
  });

  it('style prop eklenir', () => {
    render(<Skeleton style={{ opacity: 0.5 }} />);
    expect(screen.getByTestId('skeleton')).toHaveStyle({ opacity: '0.5' });
  });

  // ── Slot API ──────────────────────────────────────
  it('classNames root slot API calisir', () => {
    render(<Skeleton classNames={{ root: 'sk-root' }} />);
    expect(screen.getByTestId('skeleton').className).toContain('sk-root');
  });

  it('styles root slot API calisir', () => {
    render(<Skeleton styles={{ root: { padding: '4px' } }} />);
    expect(screen.getByTestId('skeleton')).toHaveStyle({ padding: '4px' });
  });

  // ── Animation ─────────────────────────────────────
  it('pulse animasyonu uygulanir', () => {
    render(<Skeleton animation="pulse" />);
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('none animasyonu uygulanir', () => {
    render(<Skeleton animation="none" />);
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  // ── Line gap ──────────────────────────────────────
  it('lineGap coklu satirda uygulanir', () => {
    render(<Skeleton lines={2} lineGap={12} />);
    const group = screen.getByTestId('skeleton-group');
    expect(group).toHaveStyle({ gap: '12px' });
  });
});

// ── Compound API ──

describe('Skeleton (Compound)', () => {
  it('compound: circle render edilir', () => {
    render(
      <Skeleton compound>
        <Skeleton.Circle width={56} />
      </Skeleton>,
    );
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons.length).toBe(1);
    expect(skeletons[0]).toHaveStyle({ width: '56px', height: '56px' });
  });

  it('compound: rect render edilir', () => {
    render(
      <Skeleton compound>
        <Skeleton.Rect width={200} height={100} radius={8} />
      </Skeleton>,
    );
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons.length).toBe(1);
    expect(skeletons[0]).toHaveStyle({ width: '200px', height: '100px', borderRadius: '8px' });
  });

  it('compound: text render edilir', () => {
    render(
      <Skeleton compound>
        <Skeleton.Text lines={3} />
      </Skeleton>,
    );
    const group = screen.getAllByTestId('skeleton-group')[0];
    expect(group).toBeInTheDocument();
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons.length).toBe(3);
  });

  it('compound: text tek satir render edilir', () => {
    render(
      <Skeleton compound>
        <Skeleton.Text width="80%" height={16} />
      </Skeleton>,
    );
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons.length).toBe(1);
  });

  it('compound: birden fazla sub-component birlikte render edilir', () => {
    render(
      <Skeleton compound>
        <Skeleton.Circle width={48} />
        <Skeleton.Text lines={2} />
        <Skeleton.Rect width="100%" height={80} />
      </Skeleton>,
    );
    // 1 circle + 2 text lines + 1 rect = 4 skeleton
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons.length).toBe(4);
  });

  it('compound: animation context ile aktarilir', () => {
    render(
      <Skeleton compound animation="pulse">
        <Skeleton.Circle width={40} />
      </Skeleton>,
    );
    expect(screen.getByTestId('skeleton-group')).toBeInTheDocument();
  });

  it('compound: classNames context ile sub-component lara aktarilir', () => {
    render(
      <Skeleton compound classNames={{ root: 'cmp-root' }}>
        <Skeleton.Circle width={40} />
      </Skeleton>,
    );
    const skeleton = screen.getAllByTestId('skeleton')[0];
    expect(skeleton.className).toContain('cmp-root');
  });

  it('compound: styles context ile sub-component lara aktarilir', () => {
    render(
      <Skeleton compound styles={{ root: { opacity: '0.5' } }}>
        <Skeleton.Rect width={100} height={50} />
      </Skeleton>,
    );
    const skeleton = screen.getAllByTestId('skeleton')[0];
    expect(skeleton).toHaveStyle({ opacity: '0.5' });
  });

  it('compound: context disinda kullanim hata firlat', () => {
    expect(() => render(<Skeleton.Circle width={40} />)).toThrow(
      'Skeleton compound sub-components must be used within <Skeleton>.',
    );
  });

  it('compound: wrapper role=status ve aria-busy tasir', () => {
    render(
      <Skeleton compound>
        <Skeleton.Circle width={40} />
      </Skeleton>,
    );
    const group = screen.getByTestId('skeleton-group');
    expect(group).toHaveAttribute('role', 'status');
    expect(group).toHaveAttribute('aria-busy', 'true');
  });
});

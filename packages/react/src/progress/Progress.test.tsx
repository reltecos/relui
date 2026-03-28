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
import { Progress } from './Progress';

describe('Progress', () => {
  // ── Render ────────────────────────────────────────
  it('varsayilan bar olarak render eder', () => {
    render(<Progress value={50} />);
    const el = screen.getByTestId('progress');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('role', 'progressbar');
  });

  it('ref iletir', () => {
    const ref = vi.fn();
    render(<Progress value={50} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  // ── ARIA ──────────────────────────────────────────
  it('aria-valuenow deger ile ayarlanir', () => {
    render(<Progress value={75} />);
    const el = screen.getByTestId('progress');
    expect(el).toHaveAttribute('aria-valuenow', '75');
    expect(el).toHaveAttribute('aria-valuemin', '0');
    expect(el).toHaveAttribute('aria-valuemax', '100');
  });

  it('aria-label prop ile ayarlanir', () => {
    render(<Progress value={50} aria-label="Yukleniyor" />);
    const el = screen.getByTestId('progress');
    expect(el).toHaveAttribute('aria-label', 'Yukleniyor');
  });

  it('label yoksa varsayilan aria-label kullanilir', () => {
    render(<Progress value={50} />);
    const el = screen.getByTestId('progress');
    expect(el).toHaveAttribute('aria-label', 'Progress');
  });

  it('indeterminate modda aria-valuenow yok', () => {
    render(<Progress indeterminate />);
    const el = screen.getByTestId('progress');
    expect(el).not.toHaveAttribute('aria-valuenow');
  });

  it('ozel min-max aria attributelerini ayarlar', () => {
    render(<Progress value={50} min={10} max={200} />);
    const el = screen.getByTestId('progress');
    expect(el).toHaveAttribute('aria-valuemin', '10');
    expect(el).toHaveAttribute('aria-valuemax', '200');
  });

  // ── Bar type ──────────────────────────────────────
  it('bar track ve fill render eder', () => {
    render(<Progress value={60} />);
    expect(screen.getByTestId('progress-track')).toBeInTheDocument();
    expect(screen.getByTestId('progress-fill')).toBeInTheDocument();
  });

  it('fill genisligi yuzdeye gore ayarlanir', () => {
    render(<Progress value={40} />);
    const fill = screen.getByTestId('progress-fill');
    expect(fill).toHaveStyle({ width: '40%' });
  });

  it('value 0 iken fill %0', () => {
    render(<Progress value={0} />);
    const fill = screen.getByTestId('progress-fill');
    expect(fill).toHaveStyle({ width: '0%' });
  });

  it('value max iken fill %100', () => {
    render(<Progress value={100} />);
    const fill = screen.getByTestId('progress-fill');
    expect(fill).toHaveStyle({ width: '100%' });
  });

  // ── Indeterminate bar ─────────────────────────────
  it('indeterminate modda fill data-testid yok (animasyonlu)', () => {
    render(<Progress indeterminate />);
    expect(screen.getByTestId('progress-track')).toBeInTheDocument();
    expect(screen.queryByTestId('progress-fill')).not.toBeInTheDocument();
  });

  // ── Circular type ─────────────────────────────────
  it('circular turde SVG render eder', () => {
    render(<Progress type="circular" value={50} />);
    expect(screen.getByTestId('progress-circular')).toBeInTheDocument();
    expect(screen.queryByTestId('progress-track')).not.toBeInTheDocument();
  });

  it('circular SVG iki circle icerir', () => {
    render(<Progress type="circular" value={50} />);
    const svg = screen.getByTestId('progress-circular');
    const circles = svg.querySelectorAll('circle');
    expect(circles.length).toBe(2);
  });

  // ── Chunk type ────────────────────────────────────
  it('chunk turde parcali bar render eder', () => {
    render(<Progress type="chunk" value={60} chunks={5} />);
    expect(screen.getByTestId('progress-chunk-track')).toBeInTheDocument();
    const chunkEls = screen.getAllByTestId('progress-chunk');
    expect(chunkEls.length).toBe(5);
  });

  it('chunk dolgulari yuzdeye gore ayarlanir', () => {
    render(<Progress type="chunk" value={60} chunks={5} />);
    const chunkEls = screen.getAllByTestId('progress-chunk');
    // %60 -> 5 parcadan 3 dolu
    const filledCount = chunkEls.filter(
      (el) => el.getAttribute('data-filled') === 'true'
    ).length;
    expect(filledCount).toBe(3);
  });

  it('chunk 0 deger hic dolgu olmaz', () => {
    render(<Progress type="chunk" value={0} chunks={4} />);
    const chunkEls = screen.getAllByTestId('progress-chunk');
    const filledCount = chunkEls.filter(
      (el) => el.getAttribute('data-filled') === 'true'
    ).length;
    expect(filledCount).toBe(0);
  });

  it('chunk 100 deger tamamen dolu', () => {
    render(<Progress type="chunk" value={100} chunks={4} />);
    const chunkEls = screen.getAllByTestId('progress-chunk');
    const filledCount = chunkEls.filter(
      (el) => el.getAttribute('data-filled') === 'true'
    ).length;
    expect(filledCount).toBe(4);
  });

  // ── Show value ────────────────────────────────────
  it('showValue ile deger metni gosterir', () => {
    render(<Progress value={75} showValue />);
    expect(screen.getByTestId('progress-value')).toHaveTextContent('75%');
  });

  it('showValue circular turde de calisir', () => {
    render(<Progress type="circular" value={50} showValue />);
    expect(screen.getByTestId('progress-value')).toHaveTextContent('50%');
  });

  it('showValue indeterminate modda gosterilmez', () => {
    render(<Progress indeterminate showValue />);
    expect(screen.queryByTestId('progress-value')).not.toBeInTheDocument();
  });

  // ── Format value ──────────────────────────────────
  it('formatValue ile ozel formatlama', () => {
    render(
      <Progress
        value={30}
        showValue
        formatValue={(val) => `${val}/100`}
      />
    );
    expect(screen.getByTestId('progress-value')).toHaveTextContent('30/100');
  });

  it('formatValue percent parametresi alir', () => {
    render(
      <Progress
        value={25}
        min={0}
        max={50}
        showValue
        formatValue={(_val, pct) => `${Math.round(pct)}% tamamlandi`}
      />
    );
    expect(screen.getByTestId('progress-value')).toHaveTextContent('50% tamamlandi');
  });

  // ── Label ─────────────────────────────────────────
  it('label prop ile etiket gosterir', () => {
    render(<Progress value={50} label="Yukleniyor" />);
    expect(screen.getByTestId('progress-label')).toHaveTextContent('Yukleniyor');
  });

  // ── Color ─────────────────────────────────────────
  it('color prop ile fill rengi ayarlanir', () => {
    render(<Progress value={50} color="#e11d48" />);
    const fill = screen.getByTestId('progress-fill');
    const bg = fill.style.backgroundColor;
    expect(bg === '#e11d48' || bg === 'rgb(225, 29, 72)').toBe(true);
  });

  it('color prop chunk turunde calisir', () => {
    render(<Progress type="chunk" value={100} chunks={2} color="#e11d48" />);
    const chunkEls = screen.getAllByTestId('progress-chunk');
    const filledChunk = chunkEls.find(
      (el) => el.getAttribute('data-filled') === 'true'
    );
    const bg = filledChunk?.style.backgroundColor ?? '';
    expect(bg === '#e11d48' || bg === 'rgb(225, 29, 72)').toBe(true);
  });

  // ── ID & className ────────────────────────────────
  it('id prop iletir', () => {
    render(<Progress value={50} id="my-progress" />);
    expect(screen.getByTestId('progress')).toHaveAttribute('id', 'my-progress');
  });

  it('className prop eklenir', () => {
    render(<Progress value={50} className="custom" />);
    expect(screen.getByTestId('progress').className).toContain('custom');
  });

  it('style prop eklenir', () => {
    render(<Progress value={50} style={{ opacity: 0.5 }} />);
    expect(screen.getByTestId('progress')).toHaveStyle({ opacity: '0.5' });
  });

  // ── Slot API ──────────────────────────────────────
  it('classNames slot API calisir', () => {
    render(
      <Progress
        value={50}
        showValue
        label="Test"
        classNames={{ label: 'my-label', value: 'my-value' }}
      />
    );
    expect(screen.getByTestId('progress-label').className).toContain('my-label');
    expect(screen.getByTestId('progress-value').className).toContain('my-value');
  });

  it('styles slot API calisir', () => {
    render(
      <Progress
        value={50}
        showValue
        label="Test"
        styles={{
          label: { fontSize: '20px' },
          value: { letterSpacing: '2px' },
        }}
      />
    );
    expect(screen.getByTestId('progress-label')).toHaveStyle({ fontSize: '20px' });
    expect(screen.getByTestId('progress-value')).toHaveStyle({ letterSpacing: '2px' });
  });

  it('root slot classNames ve styles eklenir', () => {
    render(
      <Progress
        value={50}
        classNames={{ root: 'root-cls' }}
        styles={{ root: { padding: '8px' } }}
      />
    );
    const el = screen.getByTestId('progress');
    expect(el.className).toContain('root-cls');
    expect(el).toHaveStyle({ padding: '8px' });
  });

  it('styles.track track elemana padding eklenir', () => {
    render(<Progress value={50} styles={{ track: { padding: '20px' } }} />);
    expect(screen.getByTestId('progress-track')).toHaveStyle({ padding: '20px' });
  });

  it('styles.fill fill elemana opacity eklenir', () => {
    render(<Progress value={50} styles={{ fill: { opacity: '0.5' } }} />);
    expect(screen.getByTestId('progress-fill')).toHaveStyle({ opacity: '0.5' });
  });

  it('styles.circle circle elemana opacity eklenir', () => {
    render(<Progress type="circular" value={50} styles={{ circle: { opacity: '0.8' } }} />);
    expect(screen.getByTestId('progress-circular')).toHaveStyle({ opacity: '0.8' });
  });

  it('styles.chunk chunk elemana padding eklenir', () => {
    render(<Progress type="chunk" value={100} chunks={3} styles={{ chunk: { padding: '4px' } }} />);
    const chunks = screen.getAllByTestId('progress-chunk');
    expect(chunks[0]).toHaveStyle({ padding: '4px' });
  });

  // ── Striped ───────────────────────────────────────
  it('striped prop bar a uygulanir', () => {
    render(<Progress value={50} striped />);
    const fill = screen.getByTestId('progress-fill');
    expect(fill.className).toBeTruthy();
  });

  // ── Size variants ─────────────────────────────────
  it('size xs uygulanir', () => {
    render(<Progress value={50} size="xs" />);
    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });

  it('size xl uygulanir', () => {
    render(<Progress value={50} size="xl" />);
    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });

  // ── Circular size ─────────────────────────────────
  it('circular size lg uygulanir', () => {
    render(<Progress type="circular" value={50} size="lg" />);
    expect(screen.getByTestId('progress-circular')).toBeInTheDocument();
  });

  // ── Circular thickness ────────────────────────────
  it('circular thickness prop uygulanir', () => {
    render(<Progress type="circular" value={50} thickness={8} />);
    const svg = screen.getByTestId('progress-circular');
    const circles = svg.querySelectorAll('circle');
    expect(circles[0].getAttribute('stroke-width')).toBe('8');
    expect(circles[1].getAttribute('stroke-width')).toBe('8');
  });

  // ── Circular indeterminate ────────────────────────
  it('circular indeterminate render eder', () => {
    render(<Progress type="circular" indeterminate />);
    expect(screen.getByTestId('progress-circular')).toBeInTheDocument();
  });
});

// ── Compound API ──────────────────────────────────────

describe('Progress (Compound)', () => {
  it('compound: Track sub-component render edilir', () => {
    render(
      <Progress value={50}>
        <Progress.Track>
          <Progress.Fill />
        </Progress.Track>
      </Progress>,
    );
    expect(screen.getByTestId('progress-track')).toBeInTheDocument();
    expect(screen.getByTestId('progress-fill')).toBeInTheDocument();
  });

  it('compound: Fill genisligi yuzdeye gore ayarlanir', () => {
    render(
      <Progress value={40}>
        <Progress.Track>
          <Progress.Fill />
        </Progress.Track>
      </Progress>,
    );
    const fill = screen.getByTestId('progress-fill');
    expect(fill).toHaveStyle({ width: '40%' });
  });

  it('compound: Label sub-component render edilir', () => {
    render(
      <Progress value={50}>
        <Progress.Label>Yukleniyor</Progress.Label>
        <Progress.Track>
          <Progress.Fill />
        </Progress.Track>
      </Progress>,
    );
    expect(screen.getByTestId('progress-label')).toHaveTextContent('Yukleniyor');
  });

  it('compound: Value sub-component otomatik formatlanir', () => {
    render(
      <Progress value={75}>
        <Progress.Track>
          <Progress.Fill />
        </Progress.Track>
        <Progress.Value />
      </Progress>,
    );
    expect(screen.getByTestId('progress-value')).toHaveTextContent('75%');
  });

  it('compound: classNames context ile sub-component lara aktarilir', () => {
    render(
      <Progress value={50} classNames={{ label: 'cmp-label', value: 'cmp-value' }}>
        <Progress.Label>Test</Progress.Label>
        <Progress.Track>
          <Progress.Fill />
        </Progress.Track>
        <Progress.Value />
      </Progress>,
    );
    expect(screen.getByTestId('progress-label').className).toContain('cmp-label');
    expect(screen.getByTestId('progress-value').className).toContain('cmp-value');
  });
});

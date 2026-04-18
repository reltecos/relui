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
import { Gauge } from './Gauge';

describe('Gauge', () => {
  it('root render edilir', () => {
    render(<Gauge value={50} />);
    expect(screen.getByTestId('gauge-root')).toBeInTheDocument();
  });

  it('svg role=img olarak set edilir', () => {
    render(<Gauge value={50} />);
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Gauge');
  });

  it('needle render edilir', () => {
    render(<Gauge value={50} />);
    expect(screen.getByTestId('gauge-needle')).toBeInTheDocument();
  });

  it('value render edilir', () => {
    render(<Gauge value={75} />);
    expect(screen.getByTestId('gauge-value')).toHaveTextContent('75');
  });

  it('label render edilir', () => {
    render(<Gauge value={50} label="Hiz" />);
    expect(screen.getByTestId('gauge-label')).toHaveTextContent('Hiz');
  });

  it('label yoksa label render edilmez', () => {
    render(<Gauge value={50} />);
    expect(screen.queryByTestId('gauge-label')).not.toBeInTheDocument();
  });

  it('segments ile arc render edilir', () => {
    render(
      <Gauge
        value={50}
        segments={[
          { from: 0, to: 50, color: 'var(--rel-color-success, #10b981)' },
          { from: 50, to: 100, color: 'var(--rel-color-error, #ef4444)' },
        ]}
      />,
    );
    const arcs = screen.getAllByTestId('gauge-arc');
    expect(arcs).toHaveLength(2);
  });

  it('min/max props desteklenir', () => {
    render(<Gauge value={50} min={0} max={200} />);
    expect(screen.getByTestId('gauge-value')).toHaveTextContent('50');
  });

  it('custom size SVG genisligini set eder', () => {
    render(<Gauge value={50} size={200} />);
    const svg = screen.getByRole('img');
    expect(svg).toHaveAttribute('width', '200');
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<Gauge value={50} className="my-gauge" />);
    expect(screen.getByTestId('gauge-root').className).toContain('my-gauge');
  });

  it('style root elemana eklenir', () => {
    render(<Gauge value={50} style={{ padding: '8px' }} />);
    expect(screen.getByTestId('gauge-root')).toHaveStyle({ padding: '8px' });
  });

  // ── Slot API ──

  it('classNames.root root elemana eklenir', () => {
    render(<Gauge value={50} classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('gauge-root').className).toContain('custom-root');
  });

  it('styles.root root elemana eklenir', () => {
    render(<Gauge value={50} styles={{ root: { padding: '12px' } }} />);
    expect(screen.getByTestId('gauge-root')).toHaveStyle({ padding: '12px' });
  });

  it('classNames.value value elemana eklenir', () => {
    render(<Gauge value={50} classNames={{ value: 'cv' }} />);
    expect(screen.getByTestId('gauge-value').getAttribute('class')).toContain('cv');
  });

  it('styles.value value elemana eklenir', () => {
    render(<Gauge value={50} styles={{ value: { fontSize: '20px' } }} />);
    expect(screen.getByTestId('gauge-value')).toHaveStyle({ fontSize: '20px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<Gauge value={50} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

describe('Gauge (Compound)', () => {
  it('compound: Arc render edilir', () => {
    render(
      <Gauge value={50}>
        <Gauge.Arc />
      </Gauge>,
    );
    expect(screen.getByTestId('gauge-arc')).toBeInTheDocument();
  });

  it('compound: Needle render edilir', () => {
    render(
      <Gauge value={50}>
        <Gauge.Needle />
      </Gauge>,
    );
    expect(screen.getByTestId('gauge-needle')).toBeInTheDocument();
  });

  it('compound: Value render edilir', () => {
    render(
      <Gauge value={75}>
        <Gauge.Value />
      </Gauge>,
    );
    expect(screen.getByTestId('gauge-value')).toHaveTextContent('75');
  });

  it('compound: Label render edilir', () => {
    render(
      <Gauge value={50}>
        <Gauge.Label>Speed</Gauge.Label>
      </Gauge>,
    );
    expect(screen.getByTestId('gauge-label')).toHaveTextContent('Speed');
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <Gauge value={50} classNames={{ value: 'cmp-val' }}>
        <Gauge.Value />
      </Gauge>,
    );
    expect(screen.getByTestId('gauge-value').getAttribute('class')).toContain('cmp-val');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <Gauge value={50} styles={{ value: { fontSize: '32px' } }}>
        <Gauge.Value />
      </Gauge>,
    );
    expect(screen.getByTestId('gauge-value')).toHaveStyle({ fontSize: '32px' });
  });

  it('Gauge.Arc context disinda hata firlatir', () => {
    expect(() => render(<Gauge.Arc />)).toThrow();
  });
});

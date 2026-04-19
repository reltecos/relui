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
import { SunburstChart } from './SunburstChart';
import type { SunburstNode } from '@relteco/relui-core';

const data: SunburstNode[] = [
  {
    name: 'Tech',
    value: 100,
    children: [
      { name: 'Frontend', value: 40 },
      { name: 'Backend', value: 60 },
    ],
  },
  { name: 'Marketing', value: 50 },
  { name: 'Sales', value: 30 },
];

describe('SunburstChart', () => {
  it('root render edilir', () => {
    render(<SunburstChart data={data} />);
    expect(screen.getByTestId('sunburst-chart-root')).toBeInTheDocument();
  });

  it('svg render edilir', () => {
    render(<SunburstChart data={data} />);
    expect(screen.getByTestId('sunburst-chart-root').querySelector('svg')).toBeInTheDocument();
  });

  it('arc path render edilir', () => {
    render(<SunburstChart data={data} />);
    expect(screen.getAllByTestId('sunburst-chart-arc-path').length).toBeGreaterThan(0);
  });

  it('label text render edilir', () => {
    render(<SunburstChart data={data} />);
    expect(screen.getAllByTestId('sunburst-chart-label-text').length).toBeGreaterThan(0);
  });

  it('label icerik dogru', () => {
    render(<SunburstChart data={data} />);
    const labels = screen.getAllByTestId('sunburst-chart-label-text');
    const textContents = labels.map((l) => l.textContent);
    expect(textContents).toContain('Tech');
  });

  it('showLabels false ile label gizlenir', () => {
    render(<SunburstChart data={data} showLabels={false} />);
    expect(screen.queryByTestId('sunburst-chart-label-text')).not.toBeInTheDocument();
  });

  it('legend render edilir', () => {
    render(<SunburstChart data={data} />);
    expect(screen.getByTestId('sunburst-chart-legend')).toBeInTheDocument();
  });

  it('showLegend false ile legend gizlenir', () => {
    render(<SunburstChart data={data} showLegend={false} />);
    expect(screen.queryByTestId('sunburst-chart-legend')).not.toBeInTheDocument();
  });

  it('svg role img ve aria-label', () => {
    render(<SunburstChart data={data} />);
    const svg = screen.getByTestId('sunburst-chart-root').querySelector('svg');
    expect(svg).toHaveAttribute('role', 'img');
    expect(svg).toHaveAttribute('aria-label', 'Sunburst chart');
  });

  it('bos veri ile hata vermez', () => {
    render(<SunburstChart data={[]} />);
    expect(screen.getByTestId('sunburst-chart-root')).toBeInTheDocument();
  });

  it('custom size ile render edilir', () => {
    render(<SunburstChart data={data} size={400} />);
    const svg = screen.getByTestId('sunburst-chart-root').querySelector('svg');
    expect(svg).toHaveAttribute('width', '400');
    expect(svg).toHaveAttribute('height', '400');
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<SunburstChart data={data} className="my-sunburst" />);
    expect(screen.getByTestId('sunburst-chart-root').className).toContain('my-sunburst');
  });

  it('style root elemana eklenir', () => {
    render(<SunburstChart data={data} style={{ padding: '16px' }} />);
    expect(screen.getByTestId('sunburst-chart-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<SunburstChart data={data} classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('sunburst-chart-root').className).toContain('custom-root');
  });

  it('classNames.arc arc elemana eklenir', () => {
    render(<SunburstChart data={data} classNames={{ arc: 'custom-arc' }} />);
    expect(screen.getAllByTestId('sunburst-chart-arc-path')[0].getAttribute('class')).toContain('custom-arc');
  });

  it('classNames.label label elemana eklenir', () => {
    render(<SunburstChart data={data} classNames={{ label: 'custom-label' }} />);
    expect(screen.getAllByTestId('sunburst-chart-label-text')[0].getAttribute('class')).toContain('custom-label');
  });

  it('classNames.legend legend elemana eklenir', () => {
    render(<SunburstChart data={data} classNames={{ legend: 'custom-legend' }} />);
    expect(screen.getByTestId('sunburst-chart-legend').className).toContain('custom-legend');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<SunburstChart data={data} styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('sunburst-chart-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.legend legend elemana eklenir', () => {
    render(<SunburstChart data={data} styles={{ legend: { padding: '8px' } }} />);
    expect(screen.getByTestId('sunburst-chart-legend')).toHaveStyle({ padding: '8px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<SunburstChart data={data} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('SunburstChart (Compound)', () => {
  it('compound: arc render edilir', () => {
    render(
      <SunburstChart data={data}>
        <SunburstChart.Arc />
      </SunburstChart>,
    );
    expect(screen.getByTestId('sunburst-chart-arc')).toBeInTheDocument();
  });

  it('compound: label render edilir', () => {
    render(
      <SunburstChart data={data}>
        <SunburstChart.Arc />
        <SunburstChart.Label />
      </SunburstChart>,
    );
    expect(screen.getByTestId('sunburst-chart-label')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <SunburstChart data={data} classNames={{ legend: 'cmp-legend' }}>
        <SunburstChart.Arc />
        <SunburstChart.Label />
        <SunburstChart.Legend />
      </SunburstChart>,
    );
  });

  it('compound: legend compound modda render edilir', () => {
    render(
      <SunburstChart data={data}>
        <SunburstChart.Arc />
        <SunburstChart.Legend />
      </SunburstChart>,
    );
    expect(screen.getByTestId('sunburst-chart-legend')).toBeInTheDocument();
  });

  it('SunburstChart.Arc context disinda hata firlatir', () => {
    expect(() => render(<SunburstChart.Arc />)).toThrow();
  });

  it('SunburstChart.Label context disinda hata firlatir', () => {
    expect(() => render(<SunburstChart.Label />)).toThrow();
  });

  it('SunburstChart.Legend context disinda hata firlatir', () => {
    expect(() => render(<SunburstChart.Legend />)).toThrow();
  });
});

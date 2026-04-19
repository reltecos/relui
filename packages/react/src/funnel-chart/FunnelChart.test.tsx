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
import { FunnelChart } from './FunnelChart';

const layers = [
  { name: 'Visitors', value: 1000 },
  { name: 'Leads', value: 600 },
  { name: 'Sales', value: 100 },
];

describe('FunnelChart', () => {
  it('root render edilir', () => {
    render(<FunnelChart layers={layers} />);
    expect(screen.getByTestId('funnel-chart-root')).toBeInTheDocument();
  });

  it('svg render edilir', () => {
    render(<FunnelChart layers={layers} />);
    expect(screen.getByTestId('funnel-chart-root').querySelector('svg')).toBeInTheDocument();
  });

  it('layer path render edilir', () => {
    render(<FunnelChart layers={layers} />);
    expect(screen.getAllByTestId('funnel-chart-layer-path')).toHaveLength(3);
  });

  it('label text render edilir', () => {
    render(<FunnelChart layers={layers} />);
    expect(screen.getAllByTestId('funnel-chart-label-text')).toHaveLength(3);
  });

  it('label percentage iceriyor', () => {
    render(<FunnelChart layers={layers} />);
    expect(screen.getAllByTestId('funnel-chart-label-text')[0]).toHaveTextContent('100%');
  });

  it('showLabels false ile label gizlenir', () => {
    render(<FunnelChart layers={layers} showLabels={false} />);
    expect(screen.queryByTestId('funnel-chart-label-text')).not.toBeInTheDocument();
  });

  it('legend render edilir', () => {
    render(<FunnelChart layers={layers} />);
    expect(screen.getByTestId('funnel-chart-legend')).toBeInTheDocument();
  });

  it('showLegend false ile legend gizlenir', () => {
    render(<FunnelChart layers={layers} showLegend={false} />);
    expect(screen.queryByTestId('funnel-chart-legend')).not.toBeInTheDocument();
  });

  it('svg role img', () => {
    render(<FunnelChart layers={layers} />);
    const svg = screen.getByTestId('funnel-chart-root').querySelector('svg');
    expect(svg).toHaveAttribute('role', 'img');
  });

  it('bos layers ile hata vermez', () => {
    render(<FunnelChart layers={[]} />);
    expect(screen.getByTestId('funnel-chart-root')).toBeInTheDocument();
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<FunnelChart layers={layers} className="my-funnel" />);
    expect(screen.getByTestId('funnel-chart-root').className).toContain('my-funnel');
  });

  it('style root elemana eklenir', () => {
    render(<FunnelChart layers={layers} style={{ padding: '16px' }} />);
    expect(screen.getByTestId('funnel-chart-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<FunnelChart layers={layers} classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('funnel-chart-root').className).toContain('custom-root');
  });

  it('classNames.layer layer elemana eklenir', () => {
    render(<FunnelChart layers={layers} classNames={{ layer: 'custom-layer' }} />);
    expect(screen.getAllByTestId('funnel-chart-layer-path')[0].getAttribute('class')).toContain('custom-layer');
  });

  it('classNames.legend legend elemana eklenir', () => {
    render(<FunnelChart layers={layers} classNames={{ legend: 'custom-legend' }} />);
    expect(screen.getByTestId('funnel-chart-legend').className).toContain('custom-legend');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<FunnelChart layers={layers} styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('funnel-chart-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.legend legend elemana eklenir', () => {
    render(<FunnelChart layers={layers} styles={{ legend: { padding: '8px' } }} />);
    expect(screen.getByTestId('funnel-chart-legend')).toHaveStyle({ padding: '8px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<FunnelChart layers={layers} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound ──

describe('FunnelChart (Compound)', () => {
  it('compound: layer render edilir', () => {
    render(
      <FunnelChart layers={layers}>
        <FunnelChart.Layer />
      </FunnelChart>,
    );
    expect(screen.getByTestId('funnel-chart-layer')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <FunnelChart layers={layers} classNames={{ legend: 'cmp-legend' }}>
        <FunnelChart.Layer />
        <FunnelChart.Legend />
      </FunnelChart>,
    );
  });

  it('FunnelChart.Layer context disinda hata firlatir', () => {
    expect(() => render(<FunnelChart.Layer />)).toThrow();
  });
});

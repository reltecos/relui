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
import { StockChart } from './StockChart';
import type { StockDataPoint } from '@relteco/relui-core';

const data: StockDataPoint[] = [
  { date: '2024-01-01', open: 100, high: 110, low: 95, close: 105, volume: 1000 },
  { date: '2024-01-02', open: 105, high: 115, low: 100, close: 98, volume: 1200 },
  { date: '2024-01-03', open: 98, high: 108, low: 92, close: 106, volume: 800 },
  { date: '2024-01-04', open: 106, high: 112, low: 104, close: 103, volume: 900 },
  { date: '2024-01-05', open: 103, high: 118, low: 102, close: 115, volume: 1500 },
];

describe('StockChart', () => {
  it('root render edilir', () => {
    render(<StockChart data={data} />);
    expect(screen.getByTestId('stock-chart-root')).toBeInTheDocument();
  });

  it('svg render edilir', () => {
    render(<StockChart data={data} />);
    expect(screen.getByTestId('stock-chart-root').querySelector('svg')).toBeInTheDocument();
  });

  it('candle rect render edilir', () => {
    render(<StockChart data={data} />);
    expect(screen.getAllByTestId('stock-chart-candle-rect')).toHaveLength(5);
  });

  it('wick render edilir', () => {
    render(<StockChart data={data} />);
    expect(screen.getAllByTestId('stock-chart-wick')).toHaveLength(5);
  });

  it('volume bar render edilir', () => {
    render(<StockChart data={data} />);
    expect(screen.getAllByTestId('stock-chart-volume-bar')).toHaveLength(5);
  });

  it('showVolume false ile volume gizlenir', () => {
    render(<StockChart data={data} showVolume={false} />);
    expect(screen.queryByTestId('stock-chart-volume-bar')).not.toBeInTheDocument();
  });

  it('legend render edilir', () => {
    render(<StockChart data={data} />);
    expect(screen.getByTestId('stock-chart-legend')).toBeInTheDocument();
  });

  it('showLegend false ile legend gizlenir', () => {
    render(<StockChart data={data} showLegend={false} />);
    expect(screen.queryByTestId('stock-chart-legend')).not.toBeInTheDocument();
  });

  it('svg role img ve aria-label', () => {
    render(<StockChart data={data} />);
    const svg = screen.getByTestId('stock-chart-root').querySelector('svg');
    expect(svg).toHaveAttribute('role', 'img');
    expect(svg).toHaveAttribute('aria-label', 'Stock chart');
  });

  it('bos veri ile hata vermez', () => {
    render(<StockChart data={[]} />);
    expect(screen.getByTestId('stock-chart-root')).toBeInTheDocument();
  });

  it('custom width/height ile render edilir', () => {
    render(<StockChart data={data} width={800} height={500} />);
    const svg = screen.getByTestId('stock-chart-root').querySelector('svg');
    expect(svg).toHaveAttribute('width', '800');
    expect(svg).toHaveAttribute('height', '500');
  });

  it('legend bullish/bearish sayilarini gosterir', () => {
    render(<StockChart data={data} />);
    const legend = screen.getByTestId('stock-chart-legend');
    expect(legend).toHaveTextContent('Bullish');
    expect(legend).toHaveTextContent('Bearish');
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<StockChart data={data} className="my-stock" />);
    expect(screen.getByTestId('stock-chart-root').className).toContain('my-stock');
  });

  it('style root elemana eklenir', () => {
    render(<StockChart data={data} style={{ padding: '16px' }} />);
    expect(screen.getByTestId('stock-chart-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<StockChart data={data} classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('stock-chart-root').className).toContain('custom-root');
  });

  it('classNames.candle candle elemana eklenir', () => {
    render(<StockChart data={data} classNames={{ candle: 'custom-candle' }} />);
    expect(screen.getAllByTestId('stock-chart-candle-rect')[0].getAttribute('class')).toContain('custom-candle');
  });

  it('classNames.volume volume elemana eklenir', () => {
    render(<StockChart data={data} classNames={{ volume: 'custom-volume' }} />);
    expect(screen.getAllByTestId('stock-chart-volume-bar')[0].getAttribute('class')).toContain('custom-volume');
  });

  it('classNames.legend legend elemana eklenir', () => {
    render(<StockChart data={data} classNames={{ legend: 'custom-legend' }} />);
    expect(screen.getByTestId('stock-chart-legend').className).toContain('custom-legend');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<StockChart data={data} styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('stock-chart-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.legend legend elemana eklenir', () => {
    render(<StockChart data={data} styles={{ legend: { padding: '8px' } }} />);
    expect(screen.getByTestId('stock-chart-legend')).toHaveStyle({ padding: '8px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<StockChart data={data} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('StockChart (Compound)', () => {
  it('compound: candle render edilir', () => {
    render(
      <StockChart data={data}>
        <StockChart.Candle />
      </StockChart>,
    );
    expect(screen.getByTestId('stock-chart-candle')).toBeInTheDocument();
  });

  it('compound: volume render edilir', () => {
    render(
      <StockChart data={data}>
        <StockChart.Candle />
        <StockChart.Volume />
      </StockChart>,
    );
    expect(screen.getByTestId('stock-chart-volume')).toBeInTheDocument();
  });

  it('compound: axis render edilir', () => {
    render(
      <StockChart data={data}>
        <StockChart.Candle />
        <StockChart.Axis />
      </StockChart>,
    );
    expect(screen.getByTestId('stock-chart-axis')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <StockChart data={data} classNames={{ legend: 'cmp-legend' }}>
        <StockChart.Candle />
        <StockChart.Volume />
        <StockChart.Legend />
      </StockChart>,
    );
  });

  it('compound: legend compound modda render edilir', () => {
    render(
      <StockChart data={data}>
        <StockChart.Candle />
        <StockChart.Legend />
      </StockChart>,
    );
    expect(screen.getByTestId('stock-chart-legend')).toBeInTheDocument();
  });

  it('StockChart.Candle context disinda hata firlatir', () => {
    expect(() => render(<StockChart.Candle />)).toThrow();
  });

  it('StockChart.Volume context disinda hata firlatir', () => {
    expect(() => render(<StockChart.Volume />)).toThrow();
  });

  it('StockChart.Axis context disinda hata firlatir', () => {
    expect(() => render(<StockChart.Axis />)).toThrow();
  });

  it('StockChart.Legend context disinda hata firlatir', () => {
    expect(() => render(<StockChart.Legend />)).toThrow();
  });
});

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
import { Sparkline } from './Sparkline';

const DATA = [10, 25, 15, 30, 20, 35];

describe('Sparkline', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<Sparkline data={DATA} />);
    expect(screen.getByTestId('sparkline-root')).toBeInTheDocument();
  });

  it('svg role=img olarak set edilir', () => {
    render(<Sparkline data={DATA} />);
    const svg = screen.getByRole('img');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-label', 'Sparkline chart');
  });

  // ── Line mode ──

  it('line mode varsayilan', () => {
    render(<Sparkline data={DATA} />);
    expect(screen.getByTestId('sparkline-line')).toBeInTheDocument();
  });

  it('line mode da area gosterilmez', () => {
    render(<Sparkline data={DATA} mode="line" />);
    expect(screen.queryByTestId('sparkline-area')).not.toBeInTheDocument();
  });

  // ── Area mode ──

  it('area mode hem line hem area gosterir', () => {
    render(<Sparkline data={DATA} mode="area" />);
    expect(screen.getByTestId('sparkline-line')).toBeInTheDocument();
    expect(screen.getByTestId('sparkline-area')).toBeInTheDocument();
  });

  // ── Bar mode ──

  it('bar mode bar gosterir', () => {
    render(<Sparkline data={DATA} mode="bar" />);
    expect(screen.getByTestId('sparkline-bar')).toBeInTheDocument();
  });

  it('bar mode da line gosterilmez', () => {
    render(<Sparkline data={DATA} mode="bar" />);
    expect(screen.queryByTestId('sparkline-line')).not.toBeInTheDocument();
  });

  // ── Dots ──

  it('showDots noktalar gosterir', () => {
    render(<Sparkline data={DATA} showDots />);
    expect(screen.getByTestId('sparkline-point')).toBeInTheDocument();
  });

  it('showDots false ise noktalar gosterilmez', () => {
    render(<Sparkline data={DATA} showDots={false} />);
    expect(screen.queryByTestId('sparkline-point')).not.toBeInTheDocument();
  });

  // ── Size ──

  it('custom width/height viewBox a yansir', () => {
    render(<Sparkline data={DATA} width={200} height={50} />);
    const svg = screen.getByRole('img');
    expect(svg).toHaveAttribute('viewBox', '0 0 200 50');
  });

  // ── Empty data ──

  it('bos data ile line gosterilmez', () => {
    render(<Sparkline data={[]} />);
    expect(screen.queryByTestId('sparkline-line')).not.toBeInTheDocument();
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<Sparkline data={DATA} className="my-spark" />);
    expect(screen.getByTestId('sparkline-root').className).toContain('my-spark');
  });

  it('style root elemana eklenir', () => {
    render(<Sparkline data={DATA} style={{ padding: '4px' }} />);
    expect(screen.getByTestId('sparkline-root')).toHaveStyle({ padding: '4px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<Sparkline data={DATA} classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('sparkline-root').className).toContain('custom-root');
  });

  it('classNames.line line elemana eklenir', () => {
    render(<Sparkline data={DATA} classNames={{ line: 'custom-line' }} />);
    expect(screen.getByTestId('sparkline-line').getAttribute('class')).toContain('custom-line');
  });

  it('classNames.bar bar elemana eklenir', () => {
    render(<Sparkline data={DATA} mode="bar" classNames={{ bar: 'custom-bar' }} />);
    const bars = screen.getByTestId('sparkline-bar');
    const firstRect = bars.querySelector('rect');
    expect(firstRect?.getAttribute('class')).toContain('custom-bar');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<Sparkline data={DATA} styles={{ root: { padding: '8px' } }} />);
    expect(screen.getByTestId('sparkline-root')).toHaveStyle({ padding: '8px' });
  });

  it('styles.line line elemana eklenir', () => {
    render(<Sparkline data={DATA} styles={{ line: { opacity: '0.7' } }} />);
    expect(screen.getByTestId('sparkline-line')).toHaveStyle({ opacity: '0.7' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<Sparkline data={DATA} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('Sparkline (Compound)', () => {
  it('compound: Line render edilir', () => {
    render(
      <Sparkline data={DATA}>
        <Sparkline.Line />
      </Sparkline>,
    );
    expect(screen.getByTestId('sparkline-line')).toBeInTheDocument();
  });

  it('compound: Area render edilir', () => {
    render(
      <Sparkline data={DATA}>
        <Sparkline.Area />
      </Sparkline>,
    );
    expect(screen.getByTestId('sparkline-area')).toBeInTheDocument();
  });

  it('compound: Bar render edilir', () => {
    render(
      <Sparkline data={DATA}>
        <Sparkline.Bar />
      </Sparkline>,
    );
    expect(screen.getByTestId('sparkline-bar')).toBeInTheDocument();
  });

  it('compound: Point render edilir', () => {
    render(
      <Sparkline data={DATA}>
        <Sparkline.Point />
      </Sparkline>,
    );
    expect(screen.getByTestId('sparkline-point')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <Sparkline data={DATA} classNames={{ line: 'cmp-line' }}>
        <Sparkline.Line />
      </Sparkline>,
    );
    expect(screen.getByTestId('sparkline-line').getAttribute('class')).toContain('cmp-line');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <Sparkline data={DATA} styles={{ line: { opacity: '0.5' } }}>
        <Sparkline.Line />
      </Sparkline>,
    );
    expect(screen.getByTestId('sparkline-line')).toHaveStyle({ opacity: '0.5' });
  });

  it('Sparkline.Line context disinda hata firlatir', () => {
    expect(() => render(<Sparkline.Line />)).toThrow();
  });
});

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
import { DigitalGauge } from './DigitalGauge';

describe('DigitalGauge', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<DigitalGauge value={42} label="Test" />);
    expect(screen.getByTestId('digital-gauge-root')).toBeInTheDocument();
  });

  it('varsayilan size md', () => {
    render(<DigitalGauge value={0} />);
    expect(screen.getByTestId('digital-gauge-root')).toHaveAttribute('data-size', 'md');
  });

  it('size sm set edilir', () => {
    render(<DigitalGauge value={0} size="sm" />);
    expect(screen.getByTestId('digital-gauge-root')).toHaveAttribute('data-size', 'sm');
  });

  it('size lg set edilir', () => {
    render(<DigitalGauge value={0} size="lg" />);
    expect(screen.getByTestId('digital-gauge-root')).toHaveAttribute('data-size', 'lg');
  });

  // ── Display ──

  it('display render edilir', () => {
    render(<DigitalGauge value={42} />);
    expect(screen.getByTestId('digital-gauge-display')).toBeInTheDocument();
  });

  it('digit ler render edilir', () => {
    render(<DigitalGauge value={42} />);
    const digits = screen.getAllByTestId('digital-gauge-digit');
    expect(digits).toHaveLength(2);
    expect(digits[0]).toHaveTextContent('4');
    expect(digits[1]).toHaveTextContent('2');
  });

  it('precision ile ondalik gosterilir', () => {
    render(<DigitalGauge value={3.14} precision={2} />);
    const digits = screen.getAllByTestId('digital-gauge-digit');
    expect(digits).toHaveLength(4); // 3, ., 1, 4
  });

  it('negatif deger gosterilir', () => {
    render(<DigitalGauge value={-5} />);
    const digits = screen.getAllByTestId('digital-gauge-digit');
    expect(digits[0]).toHaveTextContent('-');
    expect(digits[1]).toHaveTextContent('5');
  });

  // ── Label ──

  it('label render edilir', () => {
    render(<DigitalGauge value={42} label="Sicaklik" />);
    expect(screen.getByTestId('digital-gauge-label')).toHaveTextContent('Sicaklik');
  });

  it('label olmadan label render edilmez', () => {
    render(<DigitalGauge value={42} />);
    expect(screen.queryByTestId('digital-gauge-label')).not.toBeInTheDocument();
  });

  // ── Unit ──

  it('unit render edilir', () => {
    render(<DigitalGauge value={42} unit="C" />);
    expect(screen.getByTestId('digital-gauge-unit')).toHaveTextContent('C');
  });

  it('unit olmadan unit render edilmez', () => {
    render(<DigitalGauge value={42} />);
    expect(screen.queryByTestId('digital-gauge-unit')).not.toBeInTheDocument();
  });

  // ── MinMax ──

  it('showMinMax true ile minmax render edilir', () => {
    render(<DigitalGauge value={42} min={0} max={100} showMinMax />);
    const minMax = screen.getByTestId('digital-gauge-minmax');
    expect(minMax).toBeInTheDocument();
    expect(minMax).toHaveTextContent('Min: 0');
    expect(minMax).toHaveTextContent('Max: 100');
  });

  it('showMinMax false ile minmax render edilmez', () => {
    render(<DigitalGauge value={42} min={0} max={100} />);
    expect(screen.queryByTestId('digital-gauge-minmax')).not.toBeInTheDocument();
  });

  // ── A11y ──

  it('role meter set edilir', () => {
    render(<DigitalGauge value={42} />);
    expect(screen.getByTestId('digital-gauge-root')).toHaveAttribute('role', 'meter');
  });

  it('aria-valuenow set edilir', () => {
    render(<DigitalGauge value={42} />);
    expect(screen.getByTestId('digital-gauge-root')).toHaveAttribute('aria-valuenow', '42');
  });

  it('aria-label string label den alinir', () => {
    render(<DigitalGauge value={42} label="Sicaklik" />);
    expect(screen.getByTestId('digital-gauge-root')).toHaveAttribute('aria-label', 'Sicaklik');
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<DigitalGauge value={0} className="my-gauge" />);
    expect(screen.getByTestId('digital-gauge-root').className).toContain('my-gauge');
  });

  it('style root elemana eklenir', () => {
    render(<DigitalGauge value={0} style={{ padding: '16px' }} />);
    expect(screen.getByTestId('digital-gauge-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<DigitalGauge value={0} classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('digital-gauge-root').className).toContain('custom-root');
  });

  it('classNames.display display elemana eklenir', () => {
    render(<DigitalGauge value={0} classNames={{ display: 'custom-display' }} />);
    expect(screen.getByTestId('digital-gauge-display').className).toContain('custom-display');
  });

  it('classNames.digit digit elemana eklenir', () => {
    render(<DigitalGauge value={5} classNames={{ digit: 'custom-digit' }} />);
    expect(screen.getByTestId('digital-gauge-digit').className).toContain('custom-digit');
  });

  it('classNames.label label elemana eklenir', () => {
    render(<DigitalGauge value={0} label="T" classNames={{ label: 'custom-label' }} />);
    expect(screen.getByTestId('digital-gauge-label').className).toContain('custom-label');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<DigitalGauge value={0} styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('digital-gauge-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.display display elemana eklenir', () => {
    render(<DigitalGauge value={0} styles={{ display: { padding: '20px' } }} />);
    expect(screen.getByTestId('digital-gauge-display')).toHaveStyle({ padding: '20px' });
  });

  it('styles.digit digit elemana eklenir', () => {
    render(<DigitalGauge value={5} styles={{ digit: { letterSpacing: '0.1em' } }} />);
    expect(screen.getByTestId('digital-gauge-digit')).toHaveStyle({ letterSpacing: '0.1em' });
  });

  it('styles.label label elemana eklenir', () => {
    render(<DigitalGauge value={0} label="T" styles={{ label: { fontSize: '18px' } }} />);
    expect(screen.getByTestId('digital-gauge-label')).toHaveStyle({ fontSize: '18px' });
  });

  it('styles.minMax minmax elemana eklenir', () => {
    render(<DigitalGauge value={0} min={0} max={100} showMinMax styles={{ minMax: { padding: '8px' } }} />);
    expect(screen.getByTestId('digital-gauge-minmax')).toHaveStyle({ padding: '8px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<DigitalGauge value={0} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('DigitalGauge (Compound)', () => {
  it('compound: Display render edilir', () => {
    render(
      <DigitalGauge value={42}>
        <DigitalGauge.Display />
      </DigitalGauge>,
    );
    expect(screen.getByTestId('digital-gauge-display')).toBeInTheDocument();
    const digits = screen.getAllByTestId('digital-gauge-digit');
    expect(digits).toHaveLength(2);
  });

  it('compound: Label render edilir', () => {
    render(
      <DigitalGauge value={42}>
        <DigitalGauge.Display />
        <DigitalGauge.Label>Sicaklik</DigitalGauge.Label>
      </DigitalGauge>,
    );
    expect(screen.getByTestId('digital-gauge-label')).toHaveTextContent('Sicaklik');
  });

  it('compound: Unit render edilir', () => {
    render(
      <DigitalGauge value={42}>
        <DigitalGauge.Display>
          42
          <DigitalGauge.Unit>C</DigitalGauge.Unit>
        </DigitalGauge.Display>
      </DigitalGauge>,
    );
    expect(screen.getByTestId('digital-gauge-unit')).toHaveTextContent('C');
  });

  it('compound: MinMax render edilir', () => {
    render(
      <DigitalGauge value={42} min={0} max={100}>
        <DigitalGauge.Display />
        <DigitalGauge.MinMax />
      </DigitalGauge>,
    );
    expect(screen.getByTestId('digital-gauge-minmax')).toBeInTheDocument();
  });

  it('compound: size context ile aktarilir', () => {
    render(
      <DigitalGauge value={42} size="lg">
        <DigitalGauge.Display />
      </DigitalGauge>,
    );
    expect(screen.getByTestId('digital-gauge-root')).toHaveAttribute('data-size', 'lg');
  });

  it('compound: classNames context ile sub-component lara aktarilir', () => {
    render(
      <DigitalGauge value={42} classNames={{ display: 'cmp-disp' }}>
        <DigitalGauge.Display />
      </DigitalGauge>,
    );
    expect(screen.getByTestId('digital-gauge-display').className).toContain('cmp-disp');
  });

  it('compound: styles context ile sub-component lara aktarilir', () => {
    render(
      <DigitalGauge value={42} styles={{ display: { padding: '30px' } }}>
        <DigitalGauge.Display />
      </DigitalGauge>,
    );
    expect(screen.getByTestId('digital-gauge-display')).toHaveStyle({ padding: '30px' });
  });

  it('DigitalGauge.Display context disinda hata firlatir', () => {
    expect(() => render(<DigitalGauge.Display />)).toThrow();
  });
});

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
import { Stat } from './Stat';

describe('Stat', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<Stat value="100" label="Test" />);
    expect(screen.getByTestId('stat-root')).toBeInTheDocument();
  });

  it('varsayilan size md', () => {
    render(<Stat value="100" label="Test" />);
    expect(screen.getByTestId('stat-root')).toHaveAttribute('data-size', 'md');
  });

  it('size sm set edilir', () => {
    render(<Stat value="100" label="Test" size="sm" />);
    expect(screen.getByTestId('stat-root')).toHaveAttribute('data-size', 'sm');
  });

  it('size lg set edilir', () => {
    render(<Stat value="100" label="Test" size="lg" />);
    expect(screen.getByTestId('stat-root')).toHaveAttribute('data-size', 'lg');
  });

  // ── Value ──

  it('value render edilir', () => {
    render(<Stat value="1,234" label="Test" />);
    expect(screen.getByTestId('stat-value')).toHaveTextContent('1,234');
  });

  it('value ReactNode olabilir', () => {
    render(<Stat value={<strong data-testid="bold-val">999</strong>} label="Test" />);
    expect(screen.getByTestId('bold-val')).toBeInTheDocument();
  });

  // ── Label ──

  it('label render edilir', () => {
    render(<Stat value="100" label="Toplam Kullanici" />);
    expect(screen.getByTestId('stat-label')).toHaveTextContent('Toplam Kullanici');
  });

  // ── HelpText ──

  it('helpText render edilir', () => {
    render(<Stat value="100" label="Test" helpText="Son 30 gun" />);
    expect(screen.getByTestId('stat-helptext')).toHaveTextContent('Son 30 gun');
  });

  it('helpText olmadan helpText render edilmez', () => {
    render(<Stat value="100" label="Test" />);
    expect(screen.queryByTestId('stat-helptext')).not.toBeInTheDocument();
  });

  // ── Icon ──

  it('icon render edilir', () => {
    render(<Stat value="100" label="Test" icon={<span data-testid="stat-icon-el">I</span>} />);
    expect(screen.getByTestId('stat-icon-el')).toBeInTheDocument();
  });

  it('icon olmadan icon render edilmez', () => {
    render(<Stat value="100" label="Test" />);
    expect(screen.queryByTestId('stat-icon')).not.toBeInTheDocument();
  });

  // ── Trend ──

  it('trend up render edilir', () => {
    render(<Stat value="100" label="Test" trend="up" trendValue="+12%" />);
    const trendEl = screen.getByTestId('stat-trend');
    expect(trendEl).toBeInTheDocument();
    expect(trendEl).toHaveAttribute('data-trend', 'up');
    expect(trendEl).toHaveTextContent('+12%');
  });

  it('trend down render edilir', () => {
    render(<Stat value="100" label="Test" trend="down" trendValue="-5%" />);
    expect(screen.getByTestId('stat-trend')).toHaveAttribute('data-trend', 'down');
  });

  it('trend neutral render edilir', () => {
    render(<Stat value="100" label="Test" trend="neutral" />);
    expect(screen.getByTestId('stat-trend')).toHaveAttribute('data-trend', 'neutral');
  });

  it('trend olmadan trend render edilmez', () => {
    render(<Stat value="100" label="Test" />);
    expect(screen.queryByTestId('stat-trend')).not.toBeInTheDocument();
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<Stat value="100" label="Test" className="my-stat" />);
    expect(screen.getByTestId('stat-root').className).toContain('my-stat');
  });

  it('style root elemana eklenir', () => {
    render(<Stat value="100" label="Test" style={{ padding: '16px' }} />);
    expect(screen.getByTestId('stat-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<Stat value="100" label="Test" classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('stat-root').className).toContain('custom-root');
  });

  it('classNames.value value elemana eklenir', () => {
    render(<Stat value="100" label="Test" classNames={{ value: 'custom-value' }} />);
    expect(screen.getByTestId('stat-value').className).toContain('custom-value');
  });

  it('classNames.label label elemana eklenir', () => {
    render(<Stat value="100" label="Test" classNames={{ label: 'custom-label' }} />);
    expect(screen.getByTestId('stat-label').className).toContain('custom-label');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<Stat value="100" label="Test" styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('stat-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.value value elemana eklenir', () => {
    render(<Stat value="100" label="Test" styles={{ value: { fontSize: '32px' } }} />);
    expect(screen.getByTestId('stat-value')).toHaveStyle({ fontSize: '32px' });
  });

  it('styles.label label elemana eklenir', () => {
    render(<Stat value="100" label="Test" styles={{ label: { letterSpacing: '0.05em' } }} />);
    expect(screen.getByTestId('stat-label')).toHaveStyle({ letterSpacing: '0.05em' });
  });

  it('styles.helpText helpText elemana eklenir', () => {
    render(
      <Stat value="100" label="Test" helpText="H" styles={{ helpText: { padding: '4px' } }} />,
    );
    expect(screen.getByTestId('stat-helptext')).toHaveStyle({ padding: '4px' });
  });

  it('styles.icon icon elemana eklenir', () => {
    render(
      <Stat value="100" label="Test" icon={<span>I</span>} styles={{ icon: { padding: '20px' } }} />,
    );
    expect(screen.getByTestId('stat-icon')).toHaveStyle({ padding: '20px' });
  });

  it('styles.trend trend elemana eklenir', () => {
    render(
      <Stat value="100" label="Test" trend="up" trendValue="+5%" styles={{ trend: { fontSize: '14px' } }} />,
    );
    expect(screen.getByTestId('stat-trend')).toHaveStyle({ fontSize: '14px' });
  });

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<Stat value="100" label="Test" ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('Stat (Compound)', () => {
  it('compound: value render edilir', () => {
    render(
      <Stat>
        <Stat.Value>1,234</Stat.Value>
        <Stat.Label>Kullanicilar</Stat.Label>
      </Stat>,
    );
    expect(screen.getByTestId('stat-value')).toHaveTextContent('1,234');
  });

  it('compound: label render edilir', () => {
    render(
      <Stat>
        <Stat.Value>100</Stat.Value>
        <Stat.Label>Test Label</Stat.Label>
      </Stat>,
    );
    expect(screen.getByTestId('stat-label')).toHaveTextContent('Test Label');
  });

  it('compound: helptext render edilir', () => {
    render(
      <Stat>
        <Stat.Value>100</Stat.Value>
        <Stat.Label>Test</Stat.Label>
        <Stat.HelpText>Son 30 gun</Stat.HelpText>
      </Stat>,
    );
    expect(screen.getByTestId('stat-helptext')).toHaveTextContent('Son 30 gun');
  });

  it('compound: icon render edilir', () => {
    render(
      <Stat>
        <Stat.Icon><span data-testid="cmp-icon">$</span></Stat.Icon>
        <Stat.Value>100</Stat.Value>
        <Stat.Label>Test</Stat.Label>
      </Stat>,
    );
    expect(screen.getByTestId('cmp-icon')).toBeInTheDocument();
    expect(screen.getByTestId('stat-icon')).toBeInTheDocument();
  });

  it('compound: trend render edilir', () => {
    render(
      <Stat>
        <Stat.Value>100</Stat.Value>
        <Stat.Label>Test</Stat.Label>
        <Stat.Trend direction="up">+12%</Stat.Trend>
      </Stat>,
    );
    const trendEl = screen.getByTestId('stat-trend');
    expect(trendEl).toHaveAttribute('data-trend', 'up');
    expect(trendEl).toHaveTextContent('+12%');
  });

  it('compound: trend down render edilir', () => {
    render(
      <Stat>
        <Stat.Value>100</Stat.Value>
        <Stat.Label>Test</Stat.Label>
        <Stat.Trend direction="down">-5%</Stat.Trend>
      </Stat>,
    );
    expect(screen.getByTestId('stat-trend')).toHaveAttribute('data-trend', 'down');
  });

  it('compound: size context ile sub-component lara aktarilir', () => {
    render(
      <Stat size="lg">
        <Stat.Value>100</Stat.Value>
        <Stat.Label>Test</Stat.Label>
      </Stat>,
    );
    expect(screen.getByTestId('stat-root')).toHaveAttribute('data-size', 'lg');
  });

  it('compound: classNames context ile sub-component lara aktarilir', () => {
    render(
      <Stat classNames={{ value: 'cmp-val' }}>
        <Stat.Value>100</Stat.Value>
        <Stat.Label>Test</Stat.Label>
      </Stat>,
    );
    expect(screen.getByTestId('stat-value').className).toContain('cmp-val');
  });

  it('compound: styles context ile sub-component lara aktarilir', () => {
    render(
      <Stat styles={{ value: { fontSize: '40px' } }}>
        <Stat.Value>100</Stat.Value>
        <Stat.Label>Test</Stat.Label>
      </Stat>,
    );
    expect(screen.getByTestId('stat-value')).toHaveStyle({ fontSize: '40px' });
  });

  it('Stat.Value context disinda hata firlatir', () => {
    expect(() => render(<Stat.Value>100</Stat.Value>)).toThrow();
  });
});

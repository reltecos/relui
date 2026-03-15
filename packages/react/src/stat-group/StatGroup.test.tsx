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
import { StatGroup } from './StatGroup';
import { Stat } from '../stat/Stat';

const defaultItems = [
  { id: '1', value: '1,234', label: 'Kullanicilar' },
  { id: '2', value: '567', label: 'Siparisler' },
  { id: '3', value: '89%', label: 'Basari Orani' },
];

describe('StatGroup', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<StatGroup items={defaultItems} />);
    expect(screen.getByTestId('stat-group-root')).toBeInTheDocument();
  });

  it('varsayilan direction row', () => {
    render(<StatGroup items={defaultItems} />);
    expect(screen.getByTestId('stat-group-root')).toHaveAttribute('data-direction', 'row');
  });

  it('direction column set edilir', () => {
    render(<StatGroup items={defaultItems} direction="column" />);
    expect(screen.getByTestId('stat-group-root')).toHaveAttribute('data-direction', 'column');
  });

  it('divider false varsayilan', () => {
    render(<StatGroup items={defaultItems} />);
    expect(screen.getByTestId('stat-group-root')).toHaveAttribute('data-divider', 'false');
  });

  it('divider true set edilir', () => {
    render(<StatGroup items={defaultItems} divider />);
    expect(screen.getByTestId('stat-group-root')).toHaveAttribute('data-divider', 'true');
  });

  // ── Items (props-based) ──

  it('items ile stat lar render edilir', () => {
    render(<StatGroup items={defaultItems} />);
    const stats = screen.getAllByTestId('stat-group-stat');
    expect(stats).toHaveLength(3);
  });

  it('items icindeki value lar render edilir', () => {
    render(<StatGroup items={defaultItems} />);
    expect(screen.getByText('1,234')).toBeInTheDocument();
    expect(screen.getByText('567')).toBeInTheDocument();
    expect(screen.getByText('89%')).toBeInTheDocument();
  });

  it('items icindeki label lar render edilir', () => {
    render(<StatGroup items={defaultItems} />);
    expect(screen.getByText('Kullanicilar')).toBeInTheDocument();
    expect(screen.getByText('Siparisler')).toBeInTheDocument();
    expect(screen.getByText('Basari Orani')).toBeInTheDocument();
  });

  it('items ile trend desteklenir', () => {
    render(
      <StatGroup
        items={[{ id: '1', value: '100', label: 'Test', trend: 'up', trendValue: '+10%' }]}
      />,
    );
    expect(screen.getByTestId('stat-trend')).toBeInTheDocument();
    expect(screen.getByText('+10%')).toBeInTheDocument();
  });

  // ── Children (bare — backward compat) ──

  it('children ile Stat render edilir', () => {
    render(
      <StatGroup>
        <Stat value="100" label="A" />
        <Stat value="200" label="B" />
      </StatGroup>,
    );
    const stats = screen.getAllByTestId('stat-group-stat');
    expect(stats).toHaveLength(2);
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<StatGroup items={defaultItems} className="my-group" />);
    expect(screen.getByTestId('stat-group-root').className).toContain('my-group');
  });

  it('style root elemana eklenir', () => {
    render(<StatGroup items={defaultItems} style={{ padding: '20px' }} />);
    expect(screen.getByTestId('stat-group-root')).toHaveStyle({ padding: '20px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<StatGroup items={defaultItems} classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('stat-group-root').className).toContain('custom-root');
  });

  it('classNames.stat stat wrapper elemana eklenir', () => {
    render(
      <StatGroup items={[{ id: '1', value: 'V', label: 'L' }]} classNames={{ stat: 'custom-stat' }} />,
    );
    expect(screen.getByTestId('stat-group-stat').className).toContain('custom-stat');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<StatGroup items={defaultItems} styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('stat-group-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.stat stat wrapper elemana eklenir', () => {
    render(
      <StatGroup
        items={[{ id: '1', value: 'V', label: 'L' }]}
        styles={{ stat: { padding: '16px' } }}
      />,
    );
    expect(screen.getByTestId('stat-group-stat')).toHaveStyle({ padding: '16px' });
  });

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<StatGroup items={defaultItems} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API (StatGroup.Stat) ──

describe('StatGroup (Compound)', () => {
  it('compound: StatGroup.Stat ile render edilir', () => {
    render(
      <StatGroup>
        <StatGroup.Stat>
          <Stat value="100" label="A" />
        </StatGroup.Stat>
        <StatGroup.Stat>
          <Stat value="200" label="B" />
        </StatGroup.Stat>
      </StatGroup>,
    );
    const stats = screen.getAllByTestId('stat-group-stat');
    expect(stats).toHaveLength(2);
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
  });

  it('compound: classNames context ile StatGroup.Stat a aktarilir', () => {
    render(
      <StatGroup classNames={{ stat: 'cmp-stat' }}>
        <StatGroup.Stat>
          <Stat value="100" label="A" />
        </StatGroup.Stat>
      </StatGroup>,
    );
    expect(screen.getByTestId('stat-group-stat').className).toContain('cmp-stat');
  });

  it('compound: styles context ile StatGroup.Stat a aktarilir', () => {
    render(
      <StatGroup styles={{ stat: { padding: '32px' } }}>
        <StatGroup.Stat>
          <Stat value="100" label="A" />
        </StatGroup.Stat>
      </StatGroup>,
    );
    expect(screen.getByTestId('stat-group-stat')).toHaveStyle({ padding: '32px' });
  });

  it('compound: divider context ile aktarilir', () => {
    render(
      <StatGroup divider>
        <StatGroup.Stat>
          <Stat value="100" label="A" />
        </StatGroup.Stat>
        <StatGroup.Stat>
          <Stat value="200" label="B" />
        </StatGroup.Stat>
      </StatGroup>,
    );
    expect(screen.getByTestId('stat-group-root')).toHaveAttribute('data-divider', 'true');
    expect(screen.getAllByTestId('stat-group-stat')).toHaveLength(2);
  });

  it('compound: direction column context ile aktarilir', () => {
    render(
      <StatGroup direction="column">
        <StatGroup.Stat>
          <Stat value="100" label="A" />
        </StatGroup.Stat>
      </StatGroup>,
    );
    expect(screen.getByTestId('stat-group-root')).toHaveAttribute('data-direction', 'column');
  });

  it('StatGroup.Stat context disinda hata firlatir', () => {
    expect(() => render(<StatGroup.Stat><Stat value="100" label="A" /></StatGroup.Stat>)).toThrow();
  });
});

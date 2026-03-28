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
import { Timeline } from './Timeline';

const defaultItems = [
  { id: '1', title: 'Adim 1', description: 'Birinci adim', date: '2025-01-01' },
  { id: '2', title: 'Adim 2', description: 'Ikinci adim', date: '2025-02-01' },
  { id: '3', title: 'Adim 3' },
];

describe('Timeline', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<Timeline items={defaultItems} />);
    expect(screen.getByTestId('timeline-root')).toBeInTheDocument();
  });

  it('varsayilan orientation vertical', () => {
    render(<Timeline items={defaultItems} />);
    expect(screen.getByTestId('timeline-root')).toHaveAttribute('data-orientation', 'vertical');
  });

  it('orientation horizontal set edilir', () => {
    render(<Timeline items={defaultItems} orientation="horizontal" />);
    expect(screen.getByTestId('timeline-root')).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('varsayilan align left', () => {
    render(<Timeline items={defaultItems} />);
    expect(screen.getByTestId('timeline-root')).toHaveAttribute('data-align', 'left');
  });

  it('align right set edilir', () => {
    render(<Timeline items={defaultItems} align="right" />);
    expect(screen.getByTestId('timeline-root')).toHaveAttribute('data-align', 'right');
  });

  it('align alternate set edilir', () => {
    render(<Timeline items={defaultItems} align="alternate" />);
    expect(screen.getByTestId('timeline-root')).toHaveAttribute('data-align', 'alternate');
  });

  // ── Items (props-based) ──

  it('items ile item lar render edilir', () => {
    render(<Timeline items={defaultItems} />);
    const items = screen.getAllByTestId('timeline-item');
    expect(items).toHaveLength(3);
  });

  it('title render edilir', () => {
    render(<Timeline items={[{ id: '1', title: 'Test Baslik' }]} />);
    expect(screen.getByTestId('timeline-title')).toHaveTextContent('Test Baslik');
  });

  it('description render edilir', () => {
    render(<Timeline items={[{ id: '1', title: 'T', description: 'Aciklama metni' }]} />);
    expect(screen.getByTestId('timeline-description')).toHaveTextContent('Aciklama metni');
  });

  it('description olmadan description render edilmez', () => {
    render(<Timeline items={[{ id: '1', title: 'T' }]} />);
    expect(screen.queryByTestId('timeline-description')).not.toBeInTheDocument();
  });

  it('date render edilir', () => {
    render(<Timeline items={[{ id: '1', title: 'T', date: '2025-03-15' }]} />);
    expect(screen.getByTestId('timeline-date')).toHaveTextContent('2025-03-15');
  });

  it('date olmadan date render edilmez', () => {
    render(<Timeline items={[{ id: '1', title: 'T' }]} />);
    expect(screen.queryByTestId('timeline-date')).not.toBeInTheDocument();
  });

  // ── Dot ──

  it('dot render edilir', () => {
    render(<Timeline items={[{ id: '1', title: 'T' }]} />);
    expect(screen.getByTestId('timeline-dot')).toBeInTheDocument();
  });

  it('color ile dot rengi degisir', () => {
    render(<Timeline items={[{ id: '1', title: 'T', color: '#ff0000' }]} />);
    const dot = screen.getByTestId('timeline-dot');
    const bg = dot.style.backgroundColor;
    expect(bg === '#ff0000' || bg === 'rgb(255, 0, 0)').toBe(true);
  });

  it('icon dot icinde render edilir', () => {
    render(<Timeline items={[{ id: '1', title: 'T', icon: <span data-testid="custom-icon">X</span> }]} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  // ── Connector ──

  it('son item haric connector render edilir', () => {
    render(<Timeline items={defaultItems} />);
    const connectors = screen.getAllByTestId('timeline-connector');
    expect(connectors).toHaveLength(2);
  });

  it('tek item da connector render edilmez', () => {
    render(<Timeline items={[{ id: '1', title: 'Tek' }]} />);
    expect(screen.queryByTestId('timeline-connector')).not.toBeInTheDocument();
  });

  // ── Compound API ──

  it('compound ile item render edilir', () => {
    render(
      <Timeline>
        <Timeline.Item title="Compound 1" />
        <Timeline.Item title="Compound 2" />
      </Timeline>,
    );
    const items = screen.getAllByTestId('timeline-item');
    expect(items).toHaveLength(2);
    expect(screen.getByText('Compound 1')).toBeInTheDocument();
    expect(screen.getByText('Compound 2')).toBeInTheDocument();
  });

  it('compound son item da connector yok', () => {
    render(
      <Timeline>
        <Timeline.Item title="A" />
        <Timeline.Item title="B" />
      </Timeline>,
    );
    const connectors = screen.getAllByTestId('timeline-connector');
    expect(connectors).toHaveLength(1);
  });

  it('compound description ve date destekler', () => {
    render(
      <Timeline>
        <Timeline.Item title="T" description="Desc" date="2025-01-01" />
      </Timeline>,
    );
    expect(screen.getByTestId('timeline-description')).toHaveTextContent('Desc');
    expect(screen.getByTestId('timeline-date')).toHaveTextContent('2025-01-01');
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<Timeline items={defaultItems} className="my-timeline" />);
    expect(screen.getByTestId('timeline-root').className).toContain('my-timeline');
  });

  it('style root elemana eklenir', () => {
    render(<Timeline items={defaultItems} style={{ padding: '20px' }} />);
    expect(screen.getByTestId('timeline-root')).toHaveStyle({ padding: '20px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<Timeline items={defaultItems} classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('timeline-root').className).toContain('custom-root');
  });

  it('classNames.item item elemana eklenir', () => {
    render(<Timeline items={[{ id: '1', title: 'T' }]} classNames={{ item: 'custom-item' }} />);
    expect(screen.getByTestId('timeline-item').className).toContain('custom-item');
  });

  it('classNames.title title elemana eklenir', () => {
    render(<Timeline items={[{ id: '1', title: 'T' }]} classNames={{ title: 'custom-title' }} />);
    expect(screen.getByTestId('timeline-title').className).toContain('custom-title');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<Timeline items={defaultItems} styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('timeline-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.title title elemana eklenir', () => {
    render(<Timeline items={[{ id: '1', title: 'T' }]} styles={{ title: { fontSize: '18px' } }} />);
    expect(screen.getByTestId('timeline-title')).toHaveStyle({ fontSize: '18px' });
  });

  it('styles.content content elemana eklenir', () => {
    render(
      <Timeline items={[{ id: '1', title: 'T' }]} styles={{ content: { padding: '12px' } }} />,
    );
    expect(screen.getByTestId('timeline-content')).toHaveStyle({ padding: '12px' });
  });

  it('styles.dot dot elemana eklenir', () => {
    render(
      <Timeline items={[{ id: '1', title: 'T' }]} styles={{ dot: { opacity: '0.5' } }} />,
    );
    expect(screen.getByTestId('timeline-dot')).toHaveStyle({ opacity: '0.5' });
  });

  it('styles.item item elemana eklenir', () => {
    render(
      <Timeline items={[{ id: '1', title: 'T' }]} styles={{ item: { padding: '20px' } }} />,
    );
    expect(screen.getByTestId('timeline-item')).toHaveStyle({ padding: '20px' });
  });

  it('styles.connector connector elemana eklenir', () => {
    render(
      <Timeline
        items={[
          { id: '1', title: 'A' },
          { id: '2', title: 'B' },
        ]}
        styles={{ connector: { opacity: '0.3' } }}
      />,
    );
    expect(screen.getByTestId('timeline-connector')).toHaveStyle({ opacity: '0.3' });
  });

  it('styles.description description elemana eklenir', () => {
    render(
      <Timeline
        items={[{ id: '1', title: 'T', description: 'Desc' }]}
        styles={{ description: { letterSpacing: '1px' } }}
      />,
    );
    expect(screen.getByTestId('timeline-description')).toHaveStyle({ letterSpacing: '1px' });
  });

  it('styles.date date elemana eklenir', () => {
    render(
      <Timeline
        items={[{ id: '1', title: 'T', date: '2025-01-01' }]}
        styles={{ date: { fontSize: '12px' } }}
      />,
    );
    expect(screen.getByTestId('timeline-date')).toHaveStyle({ fontSize: '12px' });
  });

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<Timeline items={defaultItems} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

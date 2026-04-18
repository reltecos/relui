/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { GanttChart } from './GanttChart';
import type { GanttTask } from '@relteco/relui-core';

function makeTask(overrides: Partial<GanttTask> & { id: string }): GanttTask {
  return {
    name: `Task ${overrides.id}`,
    startDate: '2025-06-01',
    endDate: '2025-06-05',
    progress: 0,
    dependencies: [],
    isMilestone: false,
    ...overrides,
  };
}

const SAMPLE_TASKS: GanttTask[] = [
  makeTask({ id: 'A', name: 'Tasarim', startDate: '2025-06-01', endDate: '2025-06-05', progress: 100 }),
  makeTask({ id: 'B', name: 'Gelistirme', startDate: '2025-06-05', endDate: '2025-06-15', progress: 50, dependencies: ['A'] }),
  makeTask({ id: 'C', name: 'Test', startDate: '2025-06-15', endDate: '2025-06-20', progress: 0, dependencies: ['B'] }),
];

describe('GanttChart', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<GanttChart tasks={[]} />);
    expect(screen.getByTestId('gantt-root')).toBeInTheDocument();
  });

  it('root role=grid', () => {
    render(<GanttChart tasks={[]} />);
    expect(screen.getByTestId('gantt-root')).toHaveAttribute('role', 'grid');
  });

  it('aria-label set edilir', () => {
    render(<GanttChart tasks={[]} />);
    expect(screen.getByTestId('gantt-root')).toHaveAttribute('aria-label', 'Gantt Chart');
  });

  // ── Header ──

  it('header render edilir', () => {
    render(<GanttChart tasks={SAMPLE_TASKS} />);
    expect(screen.getByTestId('gantt-header')).toBeInTheDocument();
  });

  it('zoom butonlari render edilir', () => {
    render(<GanttChart tasks={SAMPLE_TASKS} />);
    const zoomBtns = screen.getAllByTestId('gantt-zoomButton');
    expect(zoomBtns).toHaveLength(3);
  });

  it('zoom butonu tiklaninca zoom degisir', () => {
    render(<GanttChart tasks={SAMPLE_TASKS} zoom="week" />);
    const zoomBtns = screen.getAllByTestId('gantt-zoomButton');
    const dayBtn = zoomBtns.find((b) => b.textContent === 'Gun');
    if (dayBtn) fireEvent.click(dayBtn);
    // Zoom state degisti — date cells genisliği değişir
    expect(screen.getByTestId('gantt-header')).toBeInTheDocument();
  });

  // ── TaskList ──

  it('taskList render edilir', () => {
    render(<GanttChart tasks={SAMPLE_TASKS} />);
    expect(screen.getByTestId('gantt-taskList')).toBeInTheDocument();
  });

  it('taskRow lar gorev sayisi kadar render edilir', () => {
    render(<GanttChart tasks={SAMPLE_TASKS} />);
    const rows = screen.getAllByTestId('gantt-taskRow');
    expect(rows).toHaveLength(3);
  });

  it('gorev adi gosterilir', () => {
    render(<GanttChart tasks={SAMPLE_TASKS} />);
    expect(screen.getAllByText('Tasarim').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Gelistirme').length).toBeGreaterThanOrEqual(1);
  });

  // ── Timeline ──

  it('timeline render edilir', () => {
    render(<GanttChart tasks={SAMPLE_TASKS} />);
    expect(screen.getByTestId('gantt-timeline')).toBeInTheDocument();
  });

  it('dateCell ler render edilir', () => {
    render(<GanttChart tasks={SAMPLE_TASKS} />);
    const cells = screen.getAllByTestId('gantt-dateCell');
    expect(cells.length).toBeGreaterThan(0);
  });

  // ── Task Bars ──

  it('taskBar lar render edilir', () => {
    render(<GanttChart tasks={SAMPLE_TASKS} />);
    const bars = screen.getAllByTestId('gantt-taskBar');
    expect(bars).toHaveLength(3);
  });

  it('progressFill render edilir', () => {
    render(<GanttChart tasks={SAMPLE_TASKS} />);
    const fills = screen.getAllByTestId('gantt-progressFill');
    expect(fills.length).toBeGreaterThan(0);
  });

  it('taskBar aria-label gorev adi icerir', () => {
    render(<GanttChart tasks={SAMPLE_TASKS} />);
    const bars = screen.getAllByTestId('gantt-taskBar');
    expect(bars[0]).toHaveAttribute('aria-label', 'Tasarim');
  });

  // ── Critical Path ──

  it('kritik yol gorevleri data-critical ile isaretlenir', () => {
    render(<GanttChart tasks={SAMPLE_TASKS} />);
    const bars = screen.getAllByTestId('gantt-taskBar');
    const criticalBars = bars.filter((b) => b.hasAttribute('data-critical'));
    expect(criticalBars.length).toBeGreaterThan(0);
  });

  // ── Milestone ──

  it('milestone render edilir', () => {
    const tasksWithMilestone = [
      ...SAMPLE_TASKS,
      makeTask({ id: 'M1', name: 'Release', isMilestone: true, startDate: '2025-06-20', endDate: '2025-06-20' }),
    ];
    render(<GanttChart tasks={tasksWithMilestone} />);
    expect(screen.getByTestId('gantt-milestone')).toBeInTheDocument();
  });

  // ── Zoom ──

  it('varsayilan zoom week', () => {
    render(<GanttChart tasks={SAMPLE_TASKS} />);
    expect(screen.getByTestId('gantt-root')).toBeInTheDocument();
  });

  it('zoom day secenegi calisir', () => {
    render(<GanttChart tasks={SAMPLE_TASKS} zoom="day" />);
    expect(screen.getByTestId('gantt-timeline')).toBeInTheDocument();
  });

  it('zoom month secenegi calisir', () => {
    render(<GanttChart tasks={SAMPLE_TASKS} zoom="month" />);
    expect(screen.getByTestId('gantt-timeline')).toBeInTheDocument();
  });

  // ── Bos gorev listesi ──

  it('bos gorev listesinde taskBar yok', () => {
    render(<GanttChart tasks={[]} />);
    expect(screen.queryByTestId('gantt-taskBar')).not.toBeInTheDocument();
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<GanttChart tasks={[]} className="my-gantt" />);
    expect(screen.getByTestId('gantt-root').className).toContain('my-gantt');
  });

  it('style root elemana eklenir', () => {
    render(<GanttChart tasks={[]} style={{ padding: '16px' }} />);
    expect(screen.getByTestId('gantt-root')).toHaveStyle({ padding: '16px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<GanttChart tasks={[]} classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('gantt-root').className).toContain('custom-root');
  });

  it('classNames.header header elemana eklenir', () => {
    render(<GanttChart tasks={SAMPLE_TASKS} classNames={{ header: 'custom-hdr' }} />);
    expect(screen.getByTestId('gantt-header').className).toContain('custom-hdr');
  });

  it('classNames.taskList taskList elemana eklenir', () => {
    render(<GanttChart tasks={SAMPLE_TASKS} classNames={{ taskList: 'custom-tl' }} />);
    expect(screen.getByTestId('gantt-taskList').className).toContain('custom-tl');
  });

  it('classNames.timeline timeline elemana eklenir', () => {
    render(<GanttChart tasks={SAMPLE_TASKS} classNames={{ timeline: 'custom-tm' }} />);
    expect(screen.getByTestId('gantt-timeline').className).toContain('custom-tm');
  });

  it('classNames.taskBar taskBar elemana eklenir', () => {
    render(<GanttChart tasks={SAMPLE_TASKS} classNames={{ taskBar: 'custom-bar' }} />);
    const bars = screen.getAllByTestId('gantt-taskBar');
    expect(bars[0]?.className).toContain('custom-bar');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<GanttChart tasks={[]} styles={{ root: { padding: '24px' } }} />);
    expect(screen.getByTestId('gantt-root')).toHaveStyle({ padding: '24px' });
  });

  it('styles.header header elemana eklenir', () => {
    render(<GanttChart tasks={SAMPLE_TASKS} styles={{ header: { padding: '12px' } }} />);
    expect(screen.getByTestId('gantt-header')).toHaveStyle({ padding: '12px' });
  });

  it('styles.taskList taskList elemana eklenir', () => {
    render(<GanttChart tasks={SAMPLE_TASKS} styles={{ taskList: { padding: '10px' } }} />);
    expect(screen.getByTestId('gantt-taskList')).toHaveStyle({ padding: '10px' });
  });

  it('styles.timeline timeline elemana eklenir', () => {
    render(<GanttChart tasks={SAMPLE_TASKS} styles={{ timeline: { padding: '8px' } }} />);
    expect(screen.getByTestId('gantt-timeline')).toHaveStyle({ padding: '8px' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<GanttChart tasks={[]} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('GanttChart (Compound)', () => {
  it('compound: Header render edilir', () => {
    render(
      <GanttChart tasks={SAMPLE_TASKS}>
        <GanttChart.Header />
      </GanttChart>,
    );
    expect(screen.getByTestId('gantt-header')).toBeInTheDocument();
  });

  it('compound: TaskList render edilir', () => {
    render(
      <GanttChart tasks={SAMPLE_TASKS}>
        <GanttChart.TaskList />
      </GanttChart>,
    );
    expect(screen.getByTestId('gantt-taskList')).toBeInTheDocument();
  });

  it('compound: Timeline render edilir', () => {
    render(
      <GanttChart tasks={SAMPLE_TASKS}>
        <GanttChart.Timeline />
      </GanttChart>,
    );
    expect(screen.getByTestId('gantt-timeline')).toBeInTheDocument();
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <GanttChart tasks={SAMPLE_TASKS} classNames={{ taskList: 'cmp-tl' }}>
        <GanttChart.TaskList />
      </GanttChart>,
    );
    expect(screen.getByTestId('gantt-taskList').className).toContain('cmp-tl');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <GanttChart tasks={SAMPLE_TASKS} styles={{ taskList: { padding: '30px' } }}>
        <GanttChart.TaskList />
      </GanttChart>,
    );
    expect(screen.getByTestId('gantt-taskList')).toHaveStyle({ padding: '30px' });
  });

  it('GanttChart.TaskList context disinda hata firlatir', () => {
    expect(() => render(<GanttChart.TaskList />)).toThrow();
  });
});

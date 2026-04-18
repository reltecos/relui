/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createGanttChart, calculateCriticalPath, daysBetween, addDays } from './gantt-chart.machine';
import type { GanttTask } from './gantt-chart.types';

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

describe('daysBetween', () => {
  it('ayni gun 0 doner', () => {
    expect(daysBetween('2025-06-01', '2025-06-01')).toBe(0);
  });

  it('5 gun farki hesaplar', () => {
    expect(daysBetween('2025-06-01', '2025-06-06')).toBe(5);
  });

  it('negatif fark hesaplar', () => {
    expect(daysBetween('2025-06-06', '2025-06-01')).toBe(-5);
  });
});

describe('addDays', () => {
  it('3 gun ekler', () => {
    expect(addDays('2025-06-01', 3)).toBe('2025-06-04');
  });

  it('ay sinirini gecer', () => {
    expect(addDays('2025-06-29', 3)).toBe('2025-07-02');
  });

  it('0 gun ekler', () => {
    expect(addDays('2025-06-15', 0)).toBe('2025-06-15');
  });
});

describe('calculateCriticalPath', () => {
  it('bos gorev listesi bos doner', () => {
    expect(calculateCriticalPath([])).toEqual([]);
  });

  it('tek gorev kritik yoldadir', () => {
    const tasks = [makeTask({ id: 'A' })];
    expect(calculateCriticalPath(tasks)).toEqual(['A']);
  });

  it('bagimsiz gorevlerin hepsi kritik yoldadir', () => {
    const tasks = [
      makeTask({ id: 'A', startDate: '2025-06-01', endDate: '2025-06-10' }),
      makeTask({ id: 'B', startDate: '2025-06-01', endDate: '2025-06-05' }),
    ];
    const cp = calculateCriticalPath(tasks);
    expect(cp).toContain('A');
  });

  it('seri bagimli gorevler kritik yol olusturur', () => {
    const tasks = [
      makeTask({ id: 'A', startDate: '2025-06-01', endDate: '2025-06-05' }),
      makeTask({ id: 'B', startDate: '2025-06-05', endDate: '2025-06-10', dependencies: ['A'] }),
      makeTask({ id: 'C', startDate: '2025-06-10', endDate: '2025-06-15', dependencies: ['B'] }),
    ];
    const cp = calculateCriticalPath(tasks);
    expect(cp).toContain('A');
    expect(cp).toContain('B');
    expect(cp).toContain('C');
  });

  it('paralel dalda kisa gorev kritik yolda olmayabilir', () => {
    const tasks = [
      makeTask({ id: 'A', startDate: '2025-06-01', endDate: '2025-06-05' }),
      makeTask({ id: 'B', startDate: '2025-06-05', endDate: '2025-06-15', dependencies: ['A'] }),
      makeTask({ id: 'C', startDate: '2025-06-05', endDate: '2025-06-07', dependencies: ['A'] }),
      makeTask({ id: 'D', startDate: '2025-06-15', endDate: '2025-06-20', dependencies: ['B', 'C'] }),
    ];
    const cp = calculateCriticalPath(tasks);
    expect(cp).toContain('A');
    expect(cp).toContain('B');
    expect(cp).toContain('D');
  });
});

describe('createGanttChart', () => {
  // ── Init ──

  it('varsayilan context doner', () => {
    const api = createGanttChart();
    const ctx = api.getContext();
    expect(ctx.tasks).toHaveLength(0);
    expect(ctx.zoom).toBe('week');
    expect(ctx.criticalPath).toHaveLength(0);
    api.destroy();
  });

  it('config.tasks ile baslar', () => {
    const tasks = [makeTask({ id: 'A' }), makeTask({ id: 'B' })];
    const api = createGanttChart({ tasks });
    expect(api.getContext().tasks).toHaveLength(2);
    api.destroy();
  });

  it('config.zoom ile baslar', () => {
    const api = createGanttChart({ zoom: 'day' });
    expect(api.getContext().zoom).toBe('day');
    api.destroy();
  });

  // ── ADD_TASK ──

  it('ADD_TASK gorev ekler', () => {
    const api = createGanttChart();
    api.send({ type: 'ADD_TASK', task: makeTask({ id: 'A' }) });
    expect(api.getContext().tasks).toHaveLength(1);
    expect(api.getContext().tasks[0]?.id).toBe('A');
    api.destroy();
  });

  // ── UPDATE_TASK ──

  it('UPDATE_TASK gorev gunceller', () => {
    const onTaskChange = vi.fn();
    const api = createGanttChart({
      tasks: [makeTask({ id: 'A', name: 'Eski' })],
      onTaskChange,
    });
    api.send({ type: 'UPDATE_TASK', id: 'A', updates: { name: 'Yeni' } });
    expect(api.getContext().tasks[0]?.name).toBe('Yeni');
    expect(onTaskChange).toHaveBeenCalled();
    api.destroy();
  });

  it('UPDATE_TASK progress gunceller', () => {
    const api = createGanttChart({ tasks: [makeTask({ id: 'A', progress: 0 })] });
    api.send({ type: 'UPDATE_TASK', id: 'A', updates: { progress: 50 } });
    expect(api.getContext().tasks[0]?.progress).toBe(50);
    api.destroy();
  });

  it('UPDATE_TASK olmayan gorev icin islem yapmaz', () => {
    const api = createGanttChart();
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'UPDATE_TASK', id: 'nonexistent', updates: { name: 'x' } });
    expect(listener).not.toHaveBeenCalled();
    api.destroy();
  });

  // ── REMOVE_TASK ──

  it('REMOVE_TASK gorev siler', () => {
    const api = createGanttChart({ tasks: [makeTask({ id: 'A' }), makeTask({ id: 'B' })] });
    api.send({ type: 'REMOVE_TASK', id: 'A' });
    expect(api.getContext().tasks).toHaveLength(1);
    expect(api.getContext().tasks[0]?.id).toBe('B');
    api.destroy();
  });

  it('REMOVE_TASK silinen goreve olan bagimliliklari temizler', () => {
    const api = createGanttChart({
      tasks: [
        makeTask({ id: 'A' }),
        makeTask({ id: 'B', dependencies: ['A'] }),
      ],
    });
    api.send({ type: 'REMOVE_TASK', id: 'A' });
    expect(api.getContext().tasks[0]?.dependencies).toHaveLength(0);
    api.destroy();
  });

  // ── SET_ZOOM ──

  it('SET_ZOOM zoom degistirir', () => {
    const api = createGanttChart();
    api.send({ type: 'SET_ZOOM', zoom: 'day' });
    expect(api.getContext().zoom).toBe('day');
    api.destroy();
  });

  it('SET_ZOOM ayni zoom icin notify etmez', () => {
    const api = createGanttChart({ zoom: 'week' });
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'SET_ZOOM', zoom: 'week' });
    expect(listener).not.toHaveBeenCalled();
    api.destroy();
  });

  it('SET_ZOOM month secenegi', () => {
    const api = createGanttChart();
    api.send({ type: 'SET_ZOOM', zoom: 'month' });
    expect(api.getContext().zoom).toBe('month');
    api.destroy();
  });

  // ── SET_SCROLL_DATE ──

  it('SET_SCROLL_DATE scroll tarihini gunceller', () => {
    const api = createGanttChart();
    api.send({ type: 'SET_SCROLL_DATE', date: '2025-07-01' });
    expect(api.getContext().scrollDate).toBe('2025-07-01');
    api.destroy();
  });

  // ── SET_TASKS ──

  it('SET_TASKS tum gorevleri degistirir', () => {
    const api = createGanttChart({ tasks: [makeTask({ id: 'A' })] });
    api.send({ type: 'SET_TASKS', tasks: [makeTask({ id: 'X' }), makeTask({ id: 'Y' })] });
    expect(api.getContext().tasks).toHaveLength(2);
    expect(api.getContext().tasks[0]?.id).toBe('X');
    api.destroy();
  });

  // ── Date Range ──

  it('dateRange min/max tarih hesaplar', () => {
    const api = createGanttChart({
      tasks: [
        makeTask({ id: 'A', startDate: '2025-06-01', endDate: '2025-06-10' }),
        makeTask({ id: 'B', startDate: '2025-06-05', endDate: '2025-06-20' }),
      ],
    });
    const range = api.getContext().dateRange;
    expect(range.start).toBe('2025-06-01');
    expect(range.end).toBe('2025-06-20');
    api.destroy();
  });

  // ── Dependencies ──

  it('dependencies listesi olusturulur', () => {
    const api = createGanttChart({
      tasks: [
        makeTask({ id: 'A' }),
        makeTask({ id: 'B', dependencies: ['A'] }),
      ],
    });
    const deps = api.getContext().dependencies;
    expect(deps).toHaveLength(1);
    expect(deps[0]).toEqual({ fromId: 'A', toId: 'B' });
    api.destroy();
  });

  // ── Critical Path ──

  it('criticalPath hesaplanir', () => {
    const api = createGanttChart({
      tasks: [
        makeTask({ id: 'A', startDate: '2025-06-01', endDate: '2025-06-05' }),
        makeTask({ id: 'B', startDate: '2025-06-05', endDate: '2025-06-10', dependencies: ['A'] }),
      ],
    });
    const cp = api.getContext().criticalPath;
    expect(cp).toContain('A');
    expect(cp).toContain('B');
    api.destroy();
  });

  // ── Milestone ──

  it('milestone gorev eklenebilir', () => {
    const api = createGanttChart();
    api.send({
      type: 'ADD_TASK',
      task: makeTask({ id: 'M1', isMilestone: true, startDate: '2025-06-15', endDate: '2025-06-15' }),
    });
    expect(api.getContext().tasks[0]?.isMilestone).toBe(true);
    api.destroy();
  });

  // ── Subscribe ──

  it('subscribe listener cagirilir', () => {
    const api = createGanttChart();
    const listener = vi.fn();
    api.subscribe(listener);
    api.send({ type: 'ADD_TASK', task: makeTask({ id: 'A' }) });
    expect(listener).toHaveBeenCalledTimes(1);
    api.destroy();
  });

  it('unsubscribe listener kaldirilir', () => {
    const api = createGanttChart();
    const listener = vi.fn();
    const unsub = api.subscribe(listener);
    unsub();
    api.send({ type: 'ADD_TASK', task: makeTask({ id: 'A' }) });
    expect(listener).not.toHaveBeenCalled();
    api.destroy();
  });

  // ── Destroy ──

  it('destroy listeners temizler', () => {
    const api = createGanttChart();
    const listener = vi.fn();
    api.subscribe(listener);
    api.destroy();
    api.send({ type: 'ADD_TASK', task: makeTask({ id: 'A' }) });
    expect(listener).not.toHaveBeenCalled();
  });
});

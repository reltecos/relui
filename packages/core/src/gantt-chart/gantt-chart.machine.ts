/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * GanttChart state machine — framework-agnostic proje yonetimi mantigi.
 * GanttChart state machine — framework-agnostic project management logic.
 *
 * Gorev CRUD, kritik yol hesaplama, tarih araligi, zoom yonetimi.
 * Task CRUD, critical path calculation, date range, zoom management.
 *
 * @packageDocumentation
 */

import type {
  GanttChartConfig,
  GanttChartContext,
  GanttChartEvent,
  GanttChartAPI,
  GanttTask,
  GanttDependency,
  GanttZoomLevel,
} from './gantt-chart.types';

// ── Date helpers ─────────────────────────────────────

/**
 * Iki tarih arasindaki gun farki.
 * Day difference between two dates.
 */
export function daysBetween(start: string, end: string): number {
  const s = new Date(start + 'T00:00:00');
  const e = new Date(end + 'T00:00:00');
  return Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Tarihe gun ekle.
 * Add days to a date.
 */
export function addDays(date: string, days: number): string {
  const d = new Date(date + 'T00:00:00');
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// ── Critical Path ────────────────────────────────────

/**
 * Kritik yol hesaplar (Finish-to-Start bagimliliklari ile).
 * Calculates critical path using Finish-to-Start dependencies.
 *
 * Algoritma:
 * 1. Topolojik siralama (Kahn's)
 * 2. Forward pass: en erken baslangic (ES), en erken bitis (EF)
 * 3. Backward pass: en gec bitis (LF), en gec baslangic (LS)
 * 4. Slack = LS - ES. Slack = 0 olan gorevler kritik yoldadir.
 */
export function calculateCriticalPath(tasks: readonly GanttTask[]): string[] {
  if (tasks.length === 0) return [];

  const taskMap = new Map<string, GanttTask>();
  for (const t of tasks) {
    taskMap.set(t.id, t);
  }

  // Build adjacency
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();

  for (const t of tasks) {
    if (!inDegree.has(t.id)) inDegree.set(t.id, 0);
    if (!adj.has(t.id)) adj.set(t.id, []);
  }

  for (const t of tasks) {
    for (const depId of t.dependencies) {
      if (!taskMap.has(depId)) continue;
      const adjList = adj.get(depId);
      if (adjList) adjList.push(t.id);
      inDegree.set(t.id, (inDegree.get(t.id) ?? 0) + 1);
    }
  }

  // Topological sort (Kahn's)
  const queue: string[] = [];
  for (const [id, deg] of inDegree) {
    if (deg === 0) queue.push(id);
  }

  const topoOrder: string[] = [];
  while (queue.length > 0) {
    const id = queue.shift();
    if (!id) break;
    topoOrder.push(id);
    const neighbors = adj.get(id) ?? [];
    for (const n of neighbors) {
      const newDeg = (inDegree.get(n) ?? 1) - 1;
      inDegree.set(n, newDeg);
      if (newDeg === 0) queue.push(n);
    }
  }

  // If not all tasks in order, there's a cycle — return empty
  if (topoOrder.length !== tasks.length) return [];

  // Forward pass: ES (earliest start), EF (earliest finish)
  const es = new Map<string, number>();
  const ef = new Map<string, number>();

  for (const id of topoOrder) {
    const task = taskMap.get(id);
    if (!task) continue;
    const duration = daysBetween(task.startDate, task.endDate);
    let earliest = 0;

    for (const depId of task.dependencies) {
      const depEF = ef.get(depId);
      if (depEF !== undefined && depEF > earliest) {
        earliest = depEF;
      }
    }

    es.set(id, earliest);
    ef.set(id, earliest + duration);
  }

  // Project finish
  let projectFinish = 0;
  for (const val of ef.values()) {
    if (val > projectFinish) projectFinish = val;
  }

  // Backward pass: LF (latest finish), LS (latest start)
  const lf = new Map<string, number>();
  const ls = new Map<string, number>();

  // Initialize all LF to project finish
  for (const id of topoOrder) {
    lf.set(id, projectFinish);
  }

  // Reverse order
  for (let i = topoOrder.length - 1; i >= 0; i--) {
    const id = topoOrder[i];
    if (!id) continue;
    const task = taskMap.get(id);
    if (!task) continue;
    const duration = daysBetween(task.startDate, task.endDate);

    // Check successors
    const neighbors = adj.get(id) ?? [];
    let latest = projectFinish;
    for (const n of neighbors) {
      const nLS = ls.get(n);
      if (nLS !== undefined && nLS < latest) {
        latest = nLS;
      }
    }

    lf.set(id, latest);
    ls.set(id, latest - duration);
  }

  // Critical path: slack = LS - ES = 0
  const critical: string[] = [];
  for (const id of topoOrder) {
    const slack = (ls.get(id) ?? 0) - (es.get(id) ?? 0);
    if (slack === 0) {
      critical.push(id);
    }
  }

  return critical;
}

// ── Helper functions ─────────────────────────────────

function computeDateRange(tasks: readonly GanttTask[]): { start: string; end: string } {
  if (tasks.length === 0) {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    const todayStr = `${y}-${m}-${d}`;
    return { start: todayStr, end: todayStr };
  }

  const first = tasks[0];
  if (!first) return { start: '', end: '' };
  let minDate = first.startDate;
  let maxDate = first.endDate;

  for (const t of tasks) {
    if (t.startDate < minDate) minDate = t.startDate;
    if (t.endDate > maxDate) maxDate = t.endDate;
  }

  return { start: minDate, end: maxDate };
}

function buildDependencies(tasks: readonly GanttTask[]): GanttDependency[] {
  const deps: GanttDependency[] = [];
  const idSet = new Set(tasks.map((t) => t.id));

  for (const t of tasks) {
    for (const depId of t.dependencies) {
      if (idSet.has(depId)) {
        deps.push({ fromId: depId, toId: t.id });
      }
    }
  }

  return deps;
}

// ── Factory ──────────────────────────────────────────

/**
 * GanttChart state machine olusturur.
 * Creates a GanttChart state machine.
 */
export function createGanttChart(config: GanttChartConfig = {}): GanttChartAPI {
  const { onTaskChange } = config;

  // ── State ──
  let tasks: GanttTask[] = config.tasks ? [...config.tasks] : [];
  let zoom: GanttZoomLevel = config.zoom ?? 'week';
  let scrollDate = computeDateRange(tasks).start;

  // ── Subscribers ──
  const listeners = new Set<() => void>();

  function notify(): void {
    listeners.forEach((fn) => fn());
  }

  // ── Send ──
  function send(event: GanttChartEvent): void {
    switch (event.type) {
      case 'ADD_TASK': {
        tasks = [...tasks, event.task];
        notify();
        break;
      }
      case 'UPDATE_TASK': {
        const idx = tasks.findIndex((t) => t.id === event.id);
        if (idx === -1) return;
        const current = tasks[idx];
        if (!current) return;
        const updated: GanttTask = { ...current, ...event.updates };
        tasks = [...tasks];
        tasks[idx] = updated;
        onTaskChange?.(updated);
        notify();
        break;
      }
      case 'REMOVE_TASK': {
        const idx = tasks.findIndex((t) => t.id === event.id);
        if (idx === -1) return;
        tasks = tasks.filter((t) => t.id !== event.id);
        // Remove references
        tasks = tasks.map((t) => {
          if (t.dependencies.includes(event.id)) {
            return { ...t, dependencies: t.dependencies.filter((d) => d !== event.id) };
          }
          return t;
        });
        notify();
        break;
      }
      case 'SET_ZOOM': {
        if (event.zoom === zoom) return;
        zoom = event.zoom;
        notify();
        break;
      }
      case 'SET_SCROLL_DATE': {
        if (event.date === scrollDate) return;
        scrollDate = event.date;
        notify();
        break;
      }
      case 'SET_TASKS': {
        tasks = [...event.tasks];
        notify();
        break;
      }
    }
  }

  // ── API ──
  return {
    getContext(): GanttChartContext {
      return {
        tasks,
        zoom,
        scrollDate,
        criticalPath: calculateCriticalPath(tasks),
        dateRange: computeDateRange(tasks),
        dependencies: buildDependencies(tasks),
      };
    },
    send,
    subscribe(callback: () => void): () => void {
      listeners.add(callback);
      return () => {
        listeners.delete(callback);
      };
    },
    destroy(): void {
      listeners.clear();
    },
  };
}

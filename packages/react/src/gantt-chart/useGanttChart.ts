/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useGanttChart — GanttChart React hook.
 *
 * @packageDocumentation
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import {
  createGanttChart,
  type GanttChartConfig,
  type GanttChartAPI,
  type GanttTask,
  type GanttZoomLevel,
} from '@relteco/relui-core';

// ── Hook Props ──────────────────────────────────────

export interface UseGanttChartProps {
  /** Gorevler / Tasks */
  tasks?: GanttTask[];
  /** Zoom seviyesi / Zoom level */
  zoom?: GanttZoomLevel;
  /** Gorev degisince / On task change */
  onTaskChange?: (task: GanttTask) => void;
}

// ── Hook Return ─────────────────────────────────────

export interface UseGanttChartReturn {
  /** Gorevler / Tasks */
  tasks: readonly GanttTask[];
  /** Zoom / Zoom */
  zoom: GanttZoomLevel;
  /** Scroll tarihi / Scroll date */
  scrollDate: string;
  /** Kritik yol / Critical path */
  criticalPath: readonly string[];
  /** Tarih araligi / Date range */
  dateRange: { start: string; end: string };
  /** Bagimliliklar / Dependencies */
  dependencies: ReturnType<GanttChartAPI['getContext']>['dependencies'];
  /** Gorev ekle / Add task */
  addTask: (task: GanttTask) => void;
  /** Gorev guncelle / Update task */
  updateTask: (id: string, updates: Partial<Omit<GanttTask, 'id'>>) => void;
  /** Gorev sil / Remove task */
  removeTask: (id: string) => void;
  /** Zoom ayarla / Set zoom */
  setZoom: (zoom: GanttZoomLevel) => void;
  /** Scroll tarihi ayarla / Set scroll date */
  setScrollDate: (date: string) => void;
  /** Core API / Core API */
  api: GanttChartAPI;
}

/**
 * useGanttChart — GanttChart yonetim hook.
 * useGanttChart — GanttChart management hook.
 */
export function useGanttChart(props: UseGanttChartProps = {}): UseGanttChartReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  const apiRef = useRef<GanttChartAPI | null>(null);
  const prevRef = useRef<UseGanttChartProps | undefined>(undefined);

  if (apiRef.current === null) {
    const cfg: GanttChartConfig = {
      tasks: props.tasks,
      zoom: props.zoom,
      onTaskChange: props.onTaskChange,
    };
    apiRef.current = createGanttChart(cfg);
  }
  const api = apiRef.current;

  // ── Prop sync ──
  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) {
      prevRef.current = props;
      return;
    }
    if (prev.tasks !== props.tasks && props.tasks !== undefined) {
      api.send({ type: 'SET_TASKS', tasks: props.tasks });
      forceRender();
    }
    if (prev.zoom !== props.zoom && props.zoom !== undefined) {
      api.send({ type: 'SET_ZOOM', zoom: props.zoom });
      forceRender();
    }
    prevRef.current = props;
  });

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  const ctx = api.getContext();

  const addTask = useCallback((task: GanttTask) => api.send({ type: 'ADD_TASK', task }), [api]);
  const updateTask = useCallback(
    (id: string, updates: Partial<Omit<GanttTask, 'id'>>) =>
      api.send({ type: 'UPDATE_TASK', id, updates }),
    [api],
  );
  const removeTask = useCallback((id: string) => api.send({ type: 'REMOVE_TASK', id }), [api]);
  const setZoom = useCallback(
    (z: GanttZoomLevel) => api.send({ type: 'SET_ZOOM', zoom: z }),
    [api],
  );
  const setScrollDate = useCallback(
    (date: string) => api.send({ type: 'SET_SCROLL_DATE', date }),
    [api],
  );

  return {
    tasks: ctx.tasks,
    zoom: ctx.zoom,
    scrollDate: ctx.scrollDate,
    criticalPath: ctx.criticalPath,
    dateRange: ctx.dateRange,
    dependencies: ctx.dependencies,
    addTask,
    updateTask,
    removeTask,
    setZoom,
    setScrollDate,
    api,
  };
}

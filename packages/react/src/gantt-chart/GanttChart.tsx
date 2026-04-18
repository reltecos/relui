/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * GanttChart — proje yonetimi zaman cizelgesi bilesen (Dual API).
 * GanttChart — project management timeline component (Dual API).
 *
 * Props-based: `<GanttChart tasks={tasks} zoom="week" />`
 * Compound:    `<GanttChart><GanttChart.TaskList /><GanttChart.Timeline /></GanttChart>`
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { GanttTask, GanttZoomLevel, GanttDependency } from '@relteco/relui-core';
import { daysBetween } from '@relteco/relui-core';
import {
  rootStyle,
  headerStyle,
  zoomControlStyle,
  zoomButtonStyle,
  zoomButtonActiveStyle,
  contentStyle,
  taskListStyle,
  taskRowStyle,
  taskNameStyle,
  timelineStyle,
  timelineHeaderStyle,
  dateCellStyle,
  timelineRowStyle,
  taskBarStyle,
  taskBarCriticalStyle,
  progressFillStyle,
  taskBarLabelStyle,
  milestoneStyle,
} from './gantt-chart.css';
import { useGanttChart, type UseGanttChartProps } from './useGanttChart';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** GanttChart slot isimleri / GanttChart slot names. */
export type GanttChartSlot =
  | 'root'
  | 'header'
  | 'taskList'
  | 'taskRow'
  | 'timeline'
  | 'taskBar'
  | 'progressFill'
  | 'milestone'
  | 'dateCell';

// ── Helpers ──────────────────────────────────────────

const CELL_WIDTH_DAY = 40;
const CELL_WIDTH_WEEK = 24;
const CELL_WIDTH_MONTH = 16;

function getCellWidth(zoom: GanttZoomLevel): number {
  switch (zoom) {
    case 'day': return CELL_WIDTH_DAY;
    case 'week': return CELL_WIDTH_WEEK;
    case 'month': return CELL_WIDTH_MONTH;
  }
}

function generateDateHeaders(start: string, end: string, zoom: GanttZoomLevel): string[] {
  const headers: string[] = [];
  const totalDays = daysBetween(start, end) + 1;

  if (zoom === 'day') {
    for (let i = 0; i < totalDays; i++) {
      const d = new Date(start + 'T00:00:00');
      d.setDate(d.getDate() + i);
      headers.push(`${d.getDate()}`);
    }
  } else if (zoom === 'week') {
    for (let i = 0; i < totalDays; i++) {
      const d = new Date(start + 'T00:00:00');
      d.setDate(d.getDate() + i);
      if (d.getDay() === 1 || i === 0) {
        headers.push(`${d.getDate()}/${d.getMonth() + 1}`);
      } else {
        headers.push('');
      }
    }
  } else {
    for (let i = 0; i < totalDays; i++) {
      const d = new Date(start + 'T00:00:00');
      d.setDate(d.getDate() + i);
      if (d.getDate() === 1 || i === 0) {
        const months = ['Ock', 'Sub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Agu', 'Eyl', 'Eki', 'Kas', 'Ara'];
        headers.push(months[d.getMonth()] ?? '');
      } else {
        headers.push('');
      }
    }
  }

  return headers;
}

function getTaskPosition(
  task: GanttTask,
  rangeStart: string,
  cellWidth: number,
): { left: number; width: number } {
  const offsetDays = daysBetween(rangeStart, task.startDate);
  const durationDays = Math.max(daysBetween(task.startDate, task.endDate), 1);
  return {
    left: offsetDays * cellWidth,
    width: durationDays * cellWidth,
  };
}

// ── Context (Compound API) ──────────────────────────

interface GanttChartContextValue {
  tasks: readonly GanttTask[];
  zoom: GanttZoomLevel;
  criticalPath: readonly string[];
  dateRange: { start: string; end: string };
  dependencies: readonly GanttDependency[];
  setZoom: (zoom: GanttZoomLevel) => void;
  updateTask: (id: string, updates: Partial<Omit<GanttTask, 'id'>>) => void;
  classNames: ClassNames<GanttChartSlot> | undefined;
  styles: Styles<GanttChartSlot> | undefined;
}

const GanttChartContext = createContext<GanttChartContextValue | null>(null);

function useGanttChartContext(): GanttChartContextValue {
  const ctx = useContext(GanttChartContext);
  if (!ctx) throw new Error('GanttChart compound sub-components must be used within <GanttChart>.');
  return ctx;
}

// ── Compound: GanttChart.Header ──────────────────────

/** GanttChart.Header props */
export interface GanttChartHeaderProps {
  /** Ek className / Additional className */
  className?: string;
}

const GanttChartHeader = forwardRef<HTMLDivElement, GanttChartHeaderProps>(
  function GanttChartHeader(props, ref) {
    const { className } = props;
    const ctx = useGanttChartContext();
    const slot = getSlotProps('header', headerStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const zooms: GanttZoomLevel[] = ['day', 'week', 'month'];
    const labels: Record<GanttZoomLevel, string> = { day: 'Gun', week: 'Hafta', month: 'Ay' };

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="gantt-header">
        <span style={{ fontWeight: 600, fontSize: 'var(--rel-text-sm, 14px)' }}>Gantt Chart</span>
        <div className={zoomControlStyle}>
          {zooms.map((z) => (
            <button
              key={z}
              type="button"
              className={z === ctx.zoom ? `${zoomButtonStyle} ${zoomButtonActiveStyle}` : zoomButtonStyle}
              onClick={() => ctx.setZoom(z)}
              data-testid="gantt-zoomButton"
            >
              {labels[z]}
            </button>
          ))}
        </div>
      </div>
    );
  },
);

// ── Compound: GanttChart.TaskList ─────────────────────

/** GanttChart.TaskList props */
export interface GanttChartTaskListProps {
  /** Ek className / Additional className */
  className?: string;
}

const GanttChartTaskList = forwardRef<HTMLDivElement, GanttChartTaskListProps>(
  function GanttChartTaskList(props, ref) {
    const { className } = props;
    const ctx = useGanttChartContext();
    const slot = getSlotProps('taskList', taskListStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const rowSlot = getSlotProps('taskRow', taskRowStyle, ctx.classNames, ctx.styles);

    return (
      <div ref={ref} className={cls} style={slot.style} role="list" data-testid="gantt-taskList">
        {ctx.tasks.map((task) => (
          <div
            key={task.id}
            className={rowSlot.className}
            style={rowSlot.style}
            role="listitem"
            data-testid="gantt-taskRow"
          >
            <span className={taskNameStyle}>{task.name}</span>
            {task.isMilestone && <span style={{ fontSize: 10 }}>◆</span>}
          </div>
        ))}
      </div>
    );
  },
);

// ── Compound: GanttChart.Timeline ─────────────────────

/** GanttChart.Timeline props */
export interface GanttChartTimelineProps {
  /** Ek className / Additional className */
  className?: string;
}

const GanttChartTimeline = forwardRef<HTMLDivElement, GanttChartTimelineProps>(
  function GanttChartTimeline(props, ref) {
    const { className } = props;
    const ctx = useGanttChartContext();
    const slot = getSlotProps('timeline', timelineStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const dcSlot = getSlotProps('dateCell', dateCellStyle, ctx.classNames, ctx.styles);
    const barSlot = getSlotProps('taskBar', taskBarStyle, ctx.classNames, ctx.styles);
    const fillSlot = getSlotProps('progressFill', progressFillStyle, ctx.classNames, ctx.styles);
    const msSlot = getSlotProps('milestone', milestoneStyle, ctx.classNames, ctx.styles);

    const cellWidth = getCellWidth(ctx.zoom);
    const headers = generateDateHeaders(ctx.dateRange.start, ctx.dateRange.end, ctx.zoom);
    const totalWidth = headers.length * cellWidth;
    const critSet = new Set(ctx.criticalPath);

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="gantt-timeline">
        {/* Date header */}
        <div className={timelineHeaderStyle} style={{ width: totalWidth }}>
          {headers.map((h, i) => (
            <div
              key={i}
              className={dcSlot.className}
              style={{ ...dcSlot.style, width: cellWidth }}
              data-testid="gantt-dateCell"
            >
              {h}
            </div>
          ))}
        </div>

        {/* Task rows */}
        {ctx.tasks.map((task) => {
          const pos = getTaskPosition(task, ctx.dateRange.start, cellWidth);
          const isCritical = critSet.has(task.id);

          return (
            <div key={task.id} className={timelineRowStyle} style={{ width: totalWidth }}>
              {task.isMilestone ? (
                <div
                  className={msSlot.className}
                  style={{ ...msSlot.style, left: pos.left }}
                  data-testid="gantt-milestone"
                  aria-label={`Milestone: ${task.name}`}
                />
              ) : (
                <div
                  className={isCritical ? `${barSlot.className} ${taskBarCriticalStyle}` : barSlot.className}
                  style={{ ...barSlot.style, left: pos.left, width: Math.max(pos.width, 4) }}
                  data-testid="gantt-taskBar"
                  data-critical={isCritical || undefined}
                  aria-label={task.name}
                >
                  <div
                    className={fillSlot.className}
                    style={{ ...fillSlot.style, width: `${task.progress}%` }}
                    data-testid="gantt-progressFill"
                  />
                  <span className={taskBarLabelStyle}>{task.name}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  },
);

// ── Compound: GanttChart.Task ─────────────────────────

/** GanttChart.Task props */
export interface GanttChartTaskProps {
  /** Gorev verisi / Task data */
  task: GanttTask;
  /** Ek className / Additional className */
  className?: string;
}

const GanttChartTask = forwardRef<HTMLDivElement, GanttChartTaskProps>(
  function GanttChartTask(props, ref) {
    const { task, className } = props;
    const ctx = useGanttChartContext();
    const isCritical = ctx.criticalPath.includes(task.id);
    const barBase = isCritical ? `${taskBarStyle} ${taskBarCriticalStyle}` : taskBarStyle;
    const slot = getSlotProps('taskBar', barBase, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const fillSlot = getSlotProps('progressFill', progressFillStyle, ctx.classNames, ctx.styles);

    const cellWidth = getCellWidth(ctx.zoom);
    const pos = getTaskPosition(task, ctx.dateRange.start, cellWidth);

    return (
      <div
        ref={ref}
        className={cls}
        style={{ ...slot.style, left: pos.left, width: Math.max(pos.width, 4), position: 'absolute', top: 8, height: 24 }}
        data-testid="gantt-taskBar"
        data-critical={isCritical || undefined}
        aria-label={task.name}
      >
        <div
          className={fillSlot.className}
          style={{ ...fillSlot.style, width: `${task.progress}%` }}
          data-testid="gantt-progressFill"
        />
        <span className={taskBarLabelStyle}>{task.name}</span>
      </div>
    );
  },
);

// ── Compound: GanttChart.Milestone ────────────────────

/** GanttChart.Milestone props */
export interface GanttChartMilestoneProps {
  /** Gorev verisi / Task data */
  task: GanttTask;
  /** Ek className / Additional className */
  className?: string;
}

const GanttChartMilestone = forwardRef<HTMLDivElement, GanttChartMilestoneProps>(
  function GanttChartMilestone(props, ref) {
    const { task, className } = props;
    const ctx = useGanttChartContext();
    const slot = getSlotProps('milestone', milestoneStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const cellWidth = getCellWidth(ctx.zoom);
    const pos = getTaskPosition(task, ctx.dateRange.start, cellWidth);

    return (
      <div
        ref={ref}
        className={cls}
        style={{ ...slot.style, left: pos.left, position: 'absolute', top: 12 }}
        data-testid="gantt-milestone"
        aria-label={`Milestone: ${task.name}`}
      />
    );
  },
);

// ── Component Props ─────────────────────────────────

export interface GanttChartComponentProps extends SlotStyleProps<GanttChartSlot> {
  /** Gorevler / Tasks */
  tasks?: GanttTask[];
  /** Zoom seviyesi / Zoom level */
  zoom?: GanttZoomLevel;
  /** Gorev degisince callback / On task change */
  onTaskChange?: (task: GanttTask) => void;
  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Component ────────────────────────────────────────

const GanttChartBase = forwardRef<HTMLDivElement, GanttChartComponentProps>(
  function GanttChart(props, ref) {
    const {
      tasks: tasksProp,
      zoom: zoomProp,
      onTaskChange,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const hookProps: UseGanttChartProps = {
      tasks: tasksProp,
      zoom: zoomProp,
      onTaskChange,
    };
    const gantt = useGanttChart(hookProps);

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootClassName = className ? `${rootSlot.className} ${className}` : rootSlot.className;

    const ctxValue: GanttChartContextValue = {
      tasks: gantt.tasks,
      zoom: gantt.zoom,
      criticalPath: gantt.criticalPath,
      dateRange: gantt.dateRange,
      dependencies: gantt.dependencies,
      setZoom: gantt.setZoom,
      updateTask: gantt.updateTask,
      classNames,
      styles,
    };

    // ── Compound API ──
    if (children) {
      return (
        <GanttChartContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={rootClassName}
            style={{ ...rootSlot.style, ...styleProp }}
            role="grid"
            aria-label="Gantt Chart"
            data-testid="gantt-root"
          >
            {children}
          </div>
        </GanttChartContext.Provider>
      );
    }

    // ── Props-based API ──
    return (
      <GanttChartContext.Provider value={ctxValue}>
        <div
          ref={ref}
          className={rootClassName}
          style={{ ...rootSlot.style, ...styleProp }}
          role="grid"
          aria-label="Gantt Chart"
          data-testid="gantt-root"
        >
          <GanttChartHeader />
          <div className={contentStyle}>
            <GanttChartTaskList />
            <GanttChartTimeline />
          </div>
        </div>
      </GanttChartContext.Provider>
    );
  },
);

/**
 * GanttChart bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <GanttChart tasks={tasks} zoom="week" />
 * ```
 *
 * @example Compound
 * ```tsx
 * <GanttChart tasks={tasks}>
 *   <GanttChart.Header />
 *   <GanttChart.TaskList />
 *   <GanttChart.Timeline />
 * </GanttChart>
 * ```
 */
export const GanttChart = Object.assign(GanttChartBase, {
  Header: GanttChartHeader,
  TaskList: GanttChartTaskList,
  Timeline: GanttChartTimeline,
  Task: GanttChartTask,
  Milestone: GanttChartMilestone,
});

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * GanttChart tipleri.
 * GanttChart types.
 *
 * @packageDocumentation
 */

// ── Task Types ───────────────────────────────────────

/** Gorev tanimi / Task definition */
export interface GanttTask {
  /** Benzersiz kimlik / Unique ID */
  readonly id: string;
  /** Gorev adi / Task name */
  readonly name: string;
  /** Baslangic tarihi (ISO) / Start date (ISO) */
  readonly startDate: string;
  /** Bitis tarihi (ISO) / End date (ISO) */
  readonly endDate: string;
  /** Ilerleme (0-100) / Progress (0-100) */
  readonly progress: number;
  /** Bagimliliklar (gorev ID) / Dependencies (task IDs) */
  readonly dependencies: readonly string[];
  /** Kilometre tasi mi / Is milestone */
  readonly isMilestone: boolean;
  /** Kaynak / Resource */
  readonly resource?: string;
  /** Ust gorev ID / Parent task ID */
  readonly parentId?: string;
}

/** Bagimlilik tanimi / Dependency definition */
export interface GanttDependency {
  /** Kaynak gorev ID / Source task ID */
  readonly fromId: string;
  /** Hedef gorev ID / Target task ID */
  readonly toId: string;
}

/** Zoom seviyesi / Zoom level */
export type GanttZoomLevel = 'day' | 'week' | 'month';

// ── Events ───────────────────────────────────────────

/** GanttChart event'leri / GanttChart events */
export type GanttChartEvent =
  | { type: 'ADD_TASK'; task: GanttTask }
  | { type: 'UPDATE_TASK'; id: string; updates: Partial<Omit<GanttTask, 'id'>> }
  | { type: 'REMOVE_TASK'; id: string }
  | { type: 'SET_ZOOM'; zoom: GanttZoomLevel }
  | { type: 'SET_SCROLL_DATE'; date: string }
  | { type: 'SET_TASKS'; tasks: GanttTask[] };

// ── Context ──────────────────────────────────────────

/** GanttChart state / GanttChart context */
export interface GanttChartContext {
  /** Gorevler / Tasks */
  readonly tasks: readonly GanttTask[];
  /** Zoom seviyesi / Zoom level */
  readonly zoom: GanttZoomLevel;
  /** Scroll tarihi / Scroll date */
  readonly scrollDate: string;
  /** Kritik yol gorev ID leri / Critical path task IDs */
  readonly criticalPath: readonly string[];
  /** Tarih araligi / Date range */
  readonly dateRange: { readonly start: string; readonly end: string };
  /** Bagimliliklar / Dependencies */
  readonly dependencies: readonly GanttDependency[];
}

// ── Config ───────────────────────────────────────────

/** GanttChart yapilandirmasi / GanttChart configuration */
export interface GanttChartConfig {
  /** Baslangic gorevleri / Initial tasks */
  tasks?: GanttTask[];
  /** Zoom seviyesi / Zoom level */
  zoom?: GanttZoomLevel;
  /** Gorev degisince callback / On task change callback */
  onTaskChange?: (task: GanttTask) => void;
}

// ── API ──────────────────────────────────────────────

/** GanttChart API / GanttChart API */
export interface GanttChartAPI {
  /** Guncel context / Get current context */
  getContext(): GanttChartContext;
  /** Event gonder / Send event */
  send(event: GanttChartEvent): void;
  /** Degisikliklere abone ol / Subscribe to changes */
  subscribe(callback: () => void): () => void;
  /** Temizlik / Cleanup */
  destroy(): void;
}

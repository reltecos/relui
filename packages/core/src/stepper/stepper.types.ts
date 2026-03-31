/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Stepper tipleri.
 * Stepper types.
 *
 * @packageDocumentation
 */

// ── Step Status ──────────────────────────────────────

/** Adim durumu / Step status */
export type StepStatus = 'pending' | 'active' | 'completed' | 'error';

// ── Step Info ────────────────────────────────────────

/** Adim bilgisi / Step information */
export interface StepInfo {
  /** Adim basligi / Step title */
  title: string;
  /** Adim aciklamasi / Step description */
  description?: string;
  /** Adim durumu / Step status */
  status: StepStatus;
}

// ── Events ───────────────────────────────────────────

/** Stepper event'leri / Stepper events */
export type StepperEvent =
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'GO_TO'; index: number }
  | { type: 'SET_STATUS'; index: number; status: StepStatus }
  | { type: 'RESET' }
  | { type: 'SET_STEP_COUNT'; count: number };

// ── Context ──────────────────────────────────────────

/** Stepper state / Stepper context */
export interface StepperContext {
  /** Aktif adim indeksi / Active step index */
  readonly activeIndex: number;
  /** Adim listesi / Steps array */
  readonly steps: readonly StepInfo[];
  /** Ilk adimda mi / Is at first step */
  readonly isFirst: boolean;
  /** Son adimda mi / Is at last step */
  readonly isLast: boolean;
  /** Toplam adim sayisi / Total step count */
  readonly stepCount: number;
}

// ── Config ───────────────────────────────────────────

/** Stepper yapilandirmasi / Stepper configuration */
export interface StepperConfig {
  /** Toplam adim sayisi / Total step count (default: 3) */
  stepCount?: number;
  /** Baslangic adim indeksi / Default active step index (default: 0) */
  defaultIndex?: number;
  /** Adim basliklari / Step titles */
  stepTitles?: string[];
  /** Adim degistiginde callback / On step change callback */
  onStepChange?: (index: number) => void;
}

// ── API ──────────────────────────────────────────────

/** Stepper API / Stepper API */
export interface StepperAPI {
  /** Guncel context / Get current context */
  getContext(): StepperContext;
  /** Event gonder / Send event */
  send(event: StepperEvent): void;
  /** Degisikliklere abone ol / Subscribe to changes */
  subscribe(callback: () => void): () => void;
  /** Temizle / Cleanup */
  destroy(): void;
}

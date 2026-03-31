/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useStepper — Stepper React hook.
 *
 * @packageDocumentation
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import {
  createStepper,
  type StepperConfig,
  type StepperAPI,
  type StepInfo,
  type StepStatus,
} from '@relteco/relui-core';

// ── Hook Props ──────────────────────────────────────

export type UseStepperProps = StepperConfig;

// ── Hook Return ─────────────────────────────────────

export interface UseStepperReturn {
  /** Aktif adim indeksi / Active step index */
  activeIndex: number;
  /** Adim listesi / Steps array */
  steps: readonly StepInfo[];
  /** Ilk adimda mi / Is at first step */
  isFirst: boolean;
  /** Son adimda mi / Is at last step */
  isLast: boolean;
  /** Toplam adim sayisi / Total step count */
  stepCount: number;
  /** Sonraki adima git / Go to next step */
  next: () => void;
  /** Onceki adima git / Go to previous step */
  prev: () => void;
  /** Belirli adima git / Go to specific step */
  goTo: (index: number) => void;
  /** Adim durumunu ayarla / Set step status */
  setStatus: (index: number, status: StepStatus) => void;
  /** Sifirla / Reset */
  reset: () => void;
  /** Core API / Core API */
  api: StepperAPI;
}

/**
 * useStepper — Stepper yonetim hook.
 * useStepper — Stepper management hook.
 */
export function useStepper(props: UseStepperProps = {}): UseStepperReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  const apiRef = useRef<StepperAPI | null>(null);
  const prevRef = useRef<UseStepperProps | undefined>(undefined);

  if (apiRef.current === null) {
    apiRef.current = createStepper(props);
  }
  const api = apiRef.current;

  // ── Prop sync ──
  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) {
      prevRef.current = props;
      return;
    }
    if (prev.stepCount !== props.stepCount && props.stepCount !== undefined) {
      api.send({ type: 'SET_STEP_COUNT', count: props.stepCount });
      forceRender();
    }
    prevRef.current = props;
  });

  // ── Subscribe ──
  useEffect(() => api.subscribe(forceRender), [api]);

  // ── Destroy ──
  useEffect(() => () => api.destroy(), [api]);

  const ctx = api.getContext();

  const next = useCallback(() => {
    api.send({ type: 'NEXT' });
  }, [api]);

  const prev = useCallback(() => {
    api.send({ type: 'PREV' });
  }, [api]);

  const goTo = useCallback(
    (index: number) => {
      api.send({ type: 'GO_TO', index });
    },
    [api],
  );

  const setStatus = useCallback(
    (index: number, status: StepStatus) => {
      api.send({ type: 'SET_STATUS', index, status });
    },
    [api],
  );

  const reset = useCallback(() => {
    api.send({ type: 'RESET' });
  }, [api]);

  return {
    activeIndex: ctx.activeIndex,
    steps: ctx.steps,
    isFirst: ctx.isFirst,
    isLast: ctx.isLast,
    stepCount: ctx.stepCount,
    next,
    prev,
    goTo,
    setStatus,
    reset,
    api,
  };
}

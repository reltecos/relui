/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Stepper state machine.
 *
 * @packageDocumentation
 */

import type {
  StepperConfig,
  StepperContext,
  StepperEvent,
  StepperAPI,
  StepInfo,
  StepStatus,
} from './stepper.types';

/**
 * Stepper state machine olusturur.
 * Creates a stepper state machine.
 */
export function createStepper(config: StepperConfig = {}): StepperAPI {
  const {
    stepCount: initialStepCount = 3,
    defaultIndex = 0,
    stepTitles,
    onStepChange,
  } = config;

  // ── Helpers ──

  function buildSteps(count: number, activeIdx: number, titles?: string[]): StepInfo[] {
    const result: StepInfo[] = [];
    for (let i = 0; i < count; i++) {
      let status: StepStatus = 'pending';
      if (i < activeIdx) status = 'completed';
      else if (i === activeIdx) status = 'active';

      result.push({
        title: titles?.[i] ?? `Step ${i + 1}`,
        status,
      });
    }
    return result;
  }

  function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  // ── State ──

  let stepCount = initialStepCount;
  let activeIndex = clamp(defaultIndex, 0, stepCount - 1);
  let steps: StepInfo[] = buildSteps(stepCount, activeIndex, stepTitles);

  // ── Subscribers ──

  const listeners = new Set<() => void>();

  function notify(): void {
    for (const fn of listeners) fn();
  }

  // ── Context ──

  function getContext(): StepperContext {
    return {
      activeIndex,
      steps,
      isFirst: activeIndex === 0,
      isLast: activeIndex === stepCount - 1,
      stepCount,
    };
  }

  // ── Send ──

  function send(event: StepperEvent): void {
    switch (event.type) {
      case 'NEXT': {
        if (activeIndex >= stepCount - 1) return;
        steps = steps.map((s, i) => {
          if (i === activeIndex) return { ...s, status: 'completed' as StepStatus };
          if (i === activeIndex + 1) return { ...s, status: 'active' as StepStatus };
          return s;
        });
        activeIndex += 1;
        onStepChange?.(activeIndex);
        notify();
        break;
      }
      case 'PREV': {
        if (activeIndex <= 0) return;
        steps = steps.map((s, i) => {
          if (i === activeIndex) return { ...s, status: 'pending' as StepStatus };
          if (i === activeIndex - 1) return { ...s, status: 'active' as StepStatus };
          return s;
        });
        activeIndex -= 1;
        onStepChange?.(activeIndex);
        notify();
        break;
      }
      case 'GO_TO': {
        const target = clamp(event.index, 0, stepCount - 1);
        if (target === activeIndex) return;
        steps = steps.map((s, i) => {
          if (i < target) return { ...s, status: 'completed' as StepStatus };
          if (i === target) return { ...s, status: 'active' as StepStatus };
          return { ...s, status: 'pending' as StepStatus };
        });
        activeIndex = target;
        onStepChange?.(activeIndex);
        notify();
        break;
      }
      case 'SET_STATUS': {
        const idx = event.index;
        if (idx < 0 || idx >= stepCount) return;
        steps = steps.map((s, i) => {
          if (i === idx) return { ...s, status: event.status };
          return s;
        });
        notify();
        break;
      }
      case 'RESET': {
        activeIndex = 0;
        steps = steps.map((s, i) => ({
          ...s,
          status: (i === 0 ? 'active' : 'pending') as StepStatus,
        }));
        notify();
        break;
      }
      case 'SET_STEP_COUNT': {
        const newCount = Math.max(1, event.count);
        if (newCount === stepCount) return;
        stepCount = newCount;
        activeIndex = clamp(activeIndex, 0, stepCount - 1);
        steps = buildSteps(stepCount, activeIndex, stepTitles);
        notify();
        break;
      }
    }
  }

  // ── Subscribe ──

  function subscribe(callback: () => void): () => void {
    listeners.add(callback);
    return () => {
      listeners.delete(callback);
    };
  }

  // ── Destroy ──

  function destroy(): void {
    listeners.clear();
  }

  return { getContext, send, subscribe, destroy };
}

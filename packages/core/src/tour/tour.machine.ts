/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * createTour — Tour state machine.
 *
 * Adim adim rehber overlay yonetimi.
 * Manages step-by-step guide overlay.
 *
 * @packageDocumentation
 */

import type {
  TourConfig,
  TourContext,
  TourEvent,
  TourStep,
  TourAPI,
} from './tour.types';

export function createTour(config: TourConfig): TourAPI {
  const listeners = new Set<() => void>();
  const steps = config.steps;

  const ctx: TourContext = {
    active: false,
    currentStep: 0,
    totalSteps: steps.length,
  };

  function notify(): void {
    listeners.forEach((fn) => fn());
  }

  function send(event: TourEvent): void {
    switch (event.type) {
      case 'START': {
        if (ctx.active || steps.length === 0) return;
        ctx.active = true;
        ctx.currentStep = 0;
        config.onStepChange?.(0);
        notify();
        break;
      }
      case 'STOP': {
        if (!ctx.active) return;
        ctx.active = false;
        notify();
        break;
      }
      case 'NEXT': {
        if (!ctx.active) return;
        if (ctx.currentStep >= steps.length - 1) {
          // Son adim — tur tamamlandi
          ctx.active = false;
          config.onComplete?.();
          notify();
          return;
        }
        ctx.currentStep++;
        config.onStepChange?.(ctx.currentStep);
        notify();
        break;
      }
      case 'PREV': {
        if (!ctx.active || ctx.currentStep <= 0) return;
        ctx.currentStep--;
        config.onStepChange?.(ctx.currentStep);
        notify();
        break;
      }
      case 'GO_TO': {
        if (!ctx.active) return;
        const idx = event.index;
        if (idx < 0 || idx >= steps.length || idx === ctx.currentStep) return;
        ctx.currentStep = idx;
        config.onStepChange?.(idx);
        notify();
        break;
      }
    }
  }

  return {
    getContext(): TourContext {
      return ctx;
    },
    getStep(): TourStep | undefined {
      if (!ctx.active) return undefined;
      return steps[ctx.currentStep];
    },
    send,
    subscribe(fn: () => void): () => void {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}

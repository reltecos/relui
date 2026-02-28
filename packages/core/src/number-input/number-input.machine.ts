/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * NumberInput state machine — framework-agnostic headless number input logic.
 * NumberInput state machine — framework bağımsız headless sayısal input mantığı.
 *
 * Value yönetimi, min/max/step/precision, increment/decrement,
 * spin (basılı tutma), clampOnBlur desteği.
 *
 * @packageDocumentation
 */

import type {
  NumberInputProps,
  NumberInputMachineContext,
  NumberInputEvent,
  NumberInputDOMProps,
  NumberInputRootDOMProps,
  NumberInputStepperDOMProps,
  NumberInputInteractionState,
} from './number-input.types';

// ── Yardımcılar / Helpers ───────────────────────────────────────────

/**
 * Step değerinden otomatik precision hesapla.
 * Auto-calculate precision from step value.
 *
 * @example stepToPrecision(0.01) → 2
 * @example stepToPrecision(1) → 0
 * @example stepToPrecision(0.5) → 1
 */
function stepToPrecision(step: number): number {
  const str = String(step);
  const dotIndex = str.indexOf('.');
  if (dotIndex === -1) return 0;
  return str.length - dotIndex - 1;
}

/**
 * Değeri precision'a göre yuvarla.
 * Round value to given precision.
 */
function roundToPrecision(value: number, precision: number): number {
  const factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
}

/**
 * Değeri min/max sınırlarına clamp et.
 * Clamp value to min/max boundaries.
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// ── Context oluşturucu / Context creator ────────────────────────────

function createInitialContext(props: NumberInputProps): NumberInputMachineContext {
  const step = props.step ?? 1;
  const precision = props.precision ?? stepToPrecision(step);
  const min = props.min ?? -Infinity;
  const max = props.max ?? Infinity;

  let value = props.value ?? null;
  if (value !== null) {
    value = roundToPrecision(value, precision);
  }

  return {
    interactionState: 'idle',
    value,
    min,
    max,
    step,
    precision,
    clampOnBlur: props.clampOnBlur ?? true,
    allowEmpty: props.allowEmpty ?? true,
    disabled: props.disabled ?? false,
    readOnly: props.readOnly ?? false,
    invalid: props.invalid ?? false,
    required: props.required ?? false,
    spinning: false,
  };
}

// ── Transition ──────────────────────────────────────────────────────

function transition(
  ctx: NumberInputMachineContext,
  event: NumberInputEvent,
): NumberInputMachineContext {
  // ── Prop güncellemeleri her zaman uygulanır ──
  if (event.type === 'SET_DISABLED') {
    if (event.value === ctx.disabled) return ctx;
    return {
      ...ctx,
      disabled: event.value,
      interactionState: event.value ? 'idle' : ctx.interactionState,
      spinning: event.value ? false : ctx.spinning,
    };
  }

  if (event.type === 'SET_READ_ONLY') {
    if (event.value === ctx.readOnly) return ctx;
    return { ...ctx, readOnly: event.value };
  }

  if (event.type === 'SET_INVALID') {
    if (event.value === ctx.invalid) return ctx;
    return { ...ctx, invalid: event.value };
  }

  // ── SET_VALUE — dışarıdan kontrollü değer set etme ──
  if (event.type === 'SET_VALUE') {
    const newVal = event.value === null
      ? null
      : roundToPrecision(event.value, ctx.precision);
    if (newVal === ctx.value) return ctx;
    return { ...ctx, value: newVal };
  }

  // ── SET_VALUE_FROM_STRING — input'tan gelen metin ──
  if (event.type === 'SET_VALUE_FROM_STRING') {
    const str = event.value.trim();

    // Boş string
    if (str === '' || str === '-') {
      if (ctx.allowEmpty && ctx.value === null) return ctx;
      if (ctx.allowEmpty) return { ...ctx, value: null };
      return ctx;
    }

    const parsed = parseFloat(str);
    if (isNaN(parsed)) return ctx;

    const rounded = roundToPrecision(parsed, ctx.precision);
    if (rounded === ctx.value) return ctx;
    return { ...ctx, value: rounded };
  }

  // ── Disabled durumda etkileşim engellenir ──
  if (ctx.disabled) return ctx;

  // ── INCREMENT / DECREMENT ──
  if (event.type === 'INCREMENT' || event.type === 'DECREMENT') {
    // readOnly durumda increment/decrement engellenir
    if (ctx.readOnly) return ctx;

    const direction = event.type === 'INCREMENT' ? 1 : -1;
    const base = ctx.value ?? 0;
    const raw = base + direction * ctx.step;
    const rounded = roundToPrecision(raw, ctx.precision);
    const clamped = clamp(rounded, ctx.min, ctx.max);

    // Zaten sınırdaysa ve aynı yöne artırma/azaltma yapılıyorsa değiştirme
    if (clamped === ctx.value) return ctx;

    return { ...ctx, value: clamped };
  }

  // ── SPIN_START / SPIN_STOP ──
  if (event.type === 'SPIN_START') {
    if (ctx.readOnly) return ctx;
    if (ctx.spinning) return ctx;
    return { ...ctx, spinning: true };
  }

  if (event.type === 'SPIN_STOP') {
    if (!ctx.spinning) return ctx;
    return { ...ctx, spinning: false };
  }

  // ── Etkileşim state geçişleri ──
  const { interactionState } = ctx;
  let nextState: NumberInputInteractionState = interactionState;

  switch (event.type) {
    case 'POINTER_ENTER':
      if (interactionState === 'idle') {
        nextState = 'hover';
      }
      break;

    case 'POINTER_LEAVE':
      if (interactionState === 'hover') {
        nextState = 'idle';
      }
      break;

    case 'FOCUS':
      nextState = 'focused';
      break;

    case 'BLUR': {
      nextState = 'idle';

      // clampOnBlur: focus kaybedince min/max'a clamp et
      if (ctx.clampOnBlur && ctx.value !== null) {
        const clamped = clamp(ctx.value, ctx.min, ctx.max);
        if (clamped !== ctx.value) {
          return { ...ctx, interactionState: nextState, value: clamped, spinning: false };
        }
      }

      if (nextState === interactionState && !ctx.spinning) return ctx;
      return { ...ctx, interactionState: nextState, spinning: false };
    }
  }

  if (nextState === interactionState) return ctx;
  return { ...ctx, interactionState: nextState };
}

// ── DOM Props üreticileri / DOM Props generators ────────────────────

function getRootProps(ctx: NumberInputMachineContext): NumberInputRootDOMProps {
  return {
    'data-state': ctx.interactionState,
    'data-disabled': ctx.disabled ? '' : undefined,
    'data-readonly': ctx.readOnly ? '' : undefined,
    'data-invalid': ctx.invalid ? '' : undefined,
  };
}

function getInputProps(ctx: NumberInputMachineContext): NumberInputDOMProps {
  return {
    type: 'text',
    inputMode: 'decimal',
    role: 'spinbutton',
    disabled: ctx.disabled ? true : undefined,
    readOnly: ctx.readOnly ? true : undefined,
    required: ctx.required ? true : undefined,
    'aria-invalid': ctx.invalid ? true : undefined,
    'aria-required': ctx.required ? true : undefined,
    'aria-readonly': ctx.readOnly ? true : undefined,
    'aria-valuemin': ctx.min,
    'aria-valuemax': ctx.max,
    'aria-valuenow': ctx.value ?? undefined,
    'aria-valuetext': ctx.value !== null ? formatValueText(ctx.value, ctx.precision) : undefined,
    'data-state': ctx.interactionState,
    'data-disabled': ctx.disabled ? '' : undefined,
    'data-readonly': ctx.readOnly ? '' : undefined,
    'data-invalid': ctx.invalid ? '' : undefined,
  };
}

function getIncrementProps(ctx: NumberInputMachineContext): NumberInputStepperDOMProps {
  const isAtMax = ctx.value !== null && ctx.value >= ctx.max;
  const isBlocked = ctx.disabled || ctx.readOnly || isAtMax;

  return {
    role: 'button',
    tabIndex: -1,
    'aria-label': 'Artır / Increment',
    'aria-disabled': isBlocked ? true : undefined,
    'data-disabled': isBlocked ? '' : undefined,
  };
}

function getDecrementProps(ctx: NumberInputMachineContext): NumberInputStepperDOMProps {
  const isAtMin = ctx.value !== null && ctx.value <= ctx.min;
  const isBlocked = ctx.disabled || ctx.readOnly || isAtMin;

  return {
    role: 'button',
    tabIndex: -1,
    'aria-label': 'Azalt / Decrement',
    'aria-disabled': isBlocked ? true : undefined,
    'data-disabled': isBlocked ? '' : undefined,
  };
}

/**
 * Değeri string'e çevir / Format value as text.
 */
function formatValueText(value: number, precision: number): string {
  return value.toFixed(precision);
}

// ── Public API ──────────────────────────────────────────────────────

/**
 * NumberInput API — state machine, props üretici ve durum sorgulama.
 * NumberInput API — state machine, props generator and state queries.
 */
export interface NumberInputAPI {
  /** Mevcut context / Current context */
  getContext(): NumberInputMachineContext;

  /** Event gönder, yeni context döner / Send event, returns new context */
  send(event: NumberInputEvent): NumberInputMachineContext;

  /** Kök element DOM attribute'ları / Root element DOM attributes */
  getRootProps(): NumberInputRootDOMProps;

  /** Input element DOM attribute'ları / Input element DOM attributes */
  getInputProps(): NumberInputDOMProps;

  /** Artır butonu DOM attribute'ları / Increment button DOM attributes */
  getIncrementProps(): NumberInputStepperDOMProps;

  /** Azalt butonu DOM attribute'ları / Decrement button DOM attributes */
  getDecrementProps(): NumberInputStepperDOMProps;

  /** Etkileşim engellenmiş mi (sadece disabled) / Is interaction blocked */
  isInteractionBlocked(): boolean;

  /** Değeri formatlanmış string olarak döndür / Return formatted value string */
  getFormattedValue(): string;
}

/**
 * NumberInput state machine oluştur.
 * Create a number input state machine.
 *
 * @example
 * ```ts
 * const numberInput = createNumberInput({ min: 0, max: 100, step: 5 });
 * numberInput.send({ type: 'INCREMENT' }); // value: 5
 * numberInput.send({ type: 'INCREMENT' }); // value: 10
 * const inputProps = numberInput.getInputProps();
 * ```
 */
export function createNumberInput(props: NumberInputProps = {}): NumberInputAPI {
  let ctx = createInitialContext(props);

  return {
    getContext() {
      return ctx;
    },

    send(event: NumberInputEvent) {
      ctx = transition(ctx, event);
      return ctx;
    },

    getRootProps() {
      return getRootProps(ctx);
    },

    getInputProps() {
      return getInputProps(ctx);
    },

    getIncrementProps() {
      return getIncrementProps(ctx);
    },

    getDecrementProps() {
      return getDecrementProps(ctx);
    },

    isInteractionBlocked() {
      return ctx.disabled;
    },

    getFormattedValue() {
      if (ctx.value === null) return '';
      return formatValueText(ctx.value, ctx.precision);
    },
  };
}

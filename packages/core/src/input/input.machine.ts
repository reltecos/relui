/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Input state machine — framework-agnostic headless input logic.
 * Input state machine — framework bağımsız headless input mantığı.
 *
 * @packageDocumentation
 */

import type {
  InputProps,
  InputMachineContext,
  InputEvent,
  InputDOMProps,
  InputInteractionState,
} from './input.types';

/**
 * Varsayılan context / Default context.
 */
function createInitialContext(props: InputProps): InputMachineContext {
  return {
    interactionState: 'idle',
    disabled: props.disabled ?? false,
    readOnly: props.readOnly ?? false,
    invalid: props.invalid ?? false,
    required: props.required ?? false,
    type: props.type ?? 'text',
  };
}

/**
 * Interaction state geçişi / Interaction state transition.
 *
 * readOnly durumda etkileşim engellenmez — kullanıcı focus edebilir,
 * hover yapabilir, sadece yazamaz (native davranış).
 * Disabled durumda tüm etkileşim engellenir.
 */
function transition(
  ctx: InputMachineContext,
  event: InputEvent,
): InputMachineContext {
  // Prop güncellemeleri her zaman uygulanır
  if (event.type === 'SET_DISABLED') {
    if (event.value === ctx.disabled) {
      return ctx;
    }
    return {
      ...ctx,
      disabled: event.value,
      interactionState: event.value ? 'idle' : ctx.interactionState,
    };
  }

  if (event.type === 'SET_READ_ONLY') {
    if (event.value === ctx.readOnly) {
      return ctx;
    }
    return { ...ctx, readOnly: event.value };
  }

  if (event.type === 'SET_INVALID') {
    if (event.value === ctx.invalid) {
      return ctx;
    }
    return { ...ctx, invalid: event.value };
  }

  // Disabled durumda etkileşim engellenir
  if (ctx.disabled) {
    return ctx;
  }

  const { interactionState } = ctx;
  let nextState: InputInteractionState = interactionState;

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

    case 'BLUR':
      nextState = 'idle';
      break;
  }

  if (nextState === interactionState) {
    return ctx;
  }

  return { ...ctx, interactionState: nextState };
}

/**
 * DOM attribute'larını üret / Generate DOM attributes.
 */
function getInputProps(ctx: InputMachineContext): InputDOMProps {
  return {
    type: ctx.type,
    disabled: ctx.disabled ? true : undefined,
    readOnly: ctx.readOnly ? true : undefined,
    required: ctx.required ? true : undefined,
    'aria-invalid': ctx.invalid ? true : undefined,
    'aria-required': ctx.required ? true : undefined,
    'aria-readonly': ctx.readOnly ? true : undefined,
    'data-state': ctx.interactionState,
    'data-disabled': ctx.disabled ? '' : undefined,
    'data-readonly': ctx.readOnly ? '' : undefined,
    'data-invalid': ctx.invalid ? '' : undefined,
  };
}

/**
 * Input API — state machine, props üretici ve durum sorgulama.
 * Input API — state machine, props generator and state queries.
 */
export interface InputAPI {
  /** Mevcut context / Current context */
  getContext(): InputMachineContext;

  /** Event gönder, yeni context döner / Send event, returns new context */
  send(event: InputEvent): InputMachineContext;

  /** DOM attribute'larını üret / Generate DOM attributes */
  getInputProps(): InputDOMProps;

  /** Etkileşim engellenmiş mi (sadece disabled) / Is interaction blocked */
  isInteractionBlocked(): boolean;
}

/**
 * Input state machine oluştur.
 * Create an input state machine.
 *
 * @example
 * ```ts
 * const input = createInput({ type: 'email', required: true });
 * const domProps = input.getInputProps();
 * input.send({ type: 'FOCUS' });
 * ```
 */
export function createInput(props: InputProps = {}): InputAPI {
  let ctx = createInitialContext(props);

  return {
    getContext() {
      return ctx;
    },

    send(event: InputEvent) {
      ctx = transition(ctx, event);
      return ctx;
    },

    getInputProps() {
      return getInputProps(ctx);
    },

    isInteractionBlocked() {
      return ctx.disabled;
    },
  };
}

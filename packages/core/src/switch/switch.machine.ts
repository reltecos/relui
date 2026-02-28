/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Switch state machine — framework-agnostic headless switch logic.
 * Switch state machine — framework bağımsız headless switch mantığı.
 *
 * Checkbox ile aynı toggle semantiği ama indeterminate yok.
 * role="switch" kullanır (role="checkbox" değil).
 *
 * @packageDocumentation
 */

import type {
  SwitchProps,
  SwitchMachineContext,
  SwitchEvent,
  SwitchDOMProps,
  SwitchInteractionState,
} from './switch.types';

/**
 * Varsayılan context / Default context.
 */
function createInitialContext(props: SwitchProps): SwitchMachineContext {
  return {
    interactionState: 'idle',
    checked: props.checked ?? false,
    disabled: props.disabled ?? false,
    readOnly: props.readOnly ?? false,
    invalid: props.invalid ?? false,
    required: props.required ?? false,
  };
}

/**
 * State geçişi / State transition.
 */
function transition(
  ctx: SwitchMachineContext,
  event: SwitchEvent,
): SwitchMachineContext {
  // Prop güncellemeleri her zaman uygulanır
  if (event.type === 'SET_CHECKED') {
    if (event.value === ctx.checked) {
      return ctx;
    }
    return { ...ctx, checked: event.value };
  }

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

  if (event.type === 'SET_INVALID') {
    if (event.value === ctx.invalid) {
      return ctx;
    }
    return { ...ctx, invalid: event.value };
  }

  // Disabled durumda tüm etkileşim engellenir
  if (ctx.disabled) {
    return ctx;
  }

  // TOGGLE — readOnly durumda yoksayılır
  if (event.type === 'TOGGLE') {
    if (ctx.readOnly) {
      return ctx;
    }
    return { ...ctx, checked: !ctx.checked };
  }

  // Etkileşim state geçişleri
  const { interactionState } = ctx;
  let nextState: SwitchInteractionState = interactionState;

  switch (event.type) {
    case 'POINTER_ENTER':
      if (interactionState === 'idle' || interactionState === 'focused') {
        nextState = 'hover';
      }
      break;

    case 'POINTER_LEAVE':
      if (interactionState === 'hover' || interactionState === 'active') {
        nextState = 'idle';
      }
      break;

    case 'POINTER_DOWN':
      if (interactionState === 'hover') {
        nextState = 'active';
      }
      break;

    case 'POINTER_UP':
      if (interactionState === 'active') {
        nextState = 'hover';
      }
      break;

    case 'FOCUS':
      if (interactionState === 'idle') {
        nextState = 'focused';
      }
      break;

    case 'BLUR':
      if (interactionState === 'focused') {
        nextState = 'idle';
      }
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
function getSwitchProps(ctx: SwitchMachineContext): SwitchDOMProps {
  return {
    role: 'switch',
    tabIndex: 0,
    'aria-checked': ctx.checked,
    'aria-disabled': ctx.disabled ? true : undefined,
    'aria-invalid': ctx.invalid ? true : undefined,
    'aria-required': ctx.required ? true : undefined,
    'aria-readonly': ctx.readOnly ? true : undefined,
    'data-state': ctx.checked ? 'checked' : 'unchecked',
    'data-disabled': ctx.disabled ? '' : undefined,
    'data-readonly': ctx.readOnly ? '' : undefined,
    'data-invalid': ctx.invalid ? '' : undefined,
    'data-focus': ctx.interactionState === 'focused' ? '' : undefined,
    'data-hover': ctx.interactionState === 'hover' ? '' : undefined,
    'data-active': ctx.interactionState === 'active' ? '' : undefined,
  };
}

/**
 * Switch API — state machine, props üretici ve durum sorgulama.
 * Switch API — state machine, props generator and state queries.
 */
export interface SwitchAPI {
  /** Mevcut context / Current context */
  getContext(): SwitchMachineContext;

  /** Event gönder, yeni context döner / Send event, returns new context */
  send(event: SwitchEvent): SwitchMachineContext;

  /** DOM attribute'larını üret / Generate DOM attributes */
  getSwitchProps(): SwitchDOMProps;

  /** Etkileşim engellenmiş mi (sadece disabled) / Is interaction blocked */
  isInteractionBlocked(): boolean;
}

/**
 * Switch state machine oluştur.
 * Create a switch state machine.
 *
 * @example
 * ```ts
 * const sw = createSwitch({ checked: false });
 * const domProps = sw.getSwitchProps();
 * sw.send({ type: 'TOGGLE' });
 * // → checked: true
 * ```
 */
export function createSwitch(props: SwitchProps = {}): SwitchAPI {
  let ctx = createInitialContext(props);

  return {
    getContext() {
      return ctx;
    },

    send(event: SwitchEvent) {
      ctx = transition(ctx, event);
      return ctx;
    },

    getSwitchProps() {
      return getSwitchProps(ctx);
    },

    isInteractionBlocked() {
      return ctx.disabled;
    },
  };
}

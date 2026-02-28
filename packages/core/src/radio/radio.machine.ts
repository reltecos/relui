/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Radio state machine — framework-agnostic headless radio logic.
 * Radio state machine — framework bağımsız headless radio mantığı.
 *
 * WAI-ARIA Radio Group pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
 *
 * Checkbox'tan farkı:
 * - Toggle yok — sadece SELECT (unchecked → checked, checked kalır)
 * - Grup deselect'i RadioGroup context'inde yönetilir
 * - tabIndex: checked olan 0, diğerleri -1 (roving tabindex)
 *
 * @packageDocumentation
 */

import type {
  RadioProps,
  RadioMachineContext,
  RadioEvent,
  RadioDOMProps,
  RadioInteractionState,
} from './radio.types';

/**
 * Varsayılan context / Default context.
 */
function createInitialContext(props: RadioProps): RadioMachineContext {
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
 * Interaction state geçişi / Interaction state transition.
 */
function transition(
  ctx: RadioMachineContext,
  event: RadioEvent,
): RadioMachineContext {
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

  // SELECT — readOnly durumda yoksayılır, zaten checked ise değişmez
  if (event.type === 'SELECT') {
    if (ctx.readOnly || ctx.checked) {
      return ctx;
    }
    return { ...ctx, checked: true };
  }

  // Etkileşim state geçişleri
  const { interactionState } = ctx;
  let nextState: RadioInteractionState = interactionState;

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
 *
 * Roving tabindex: checked olan radio tabIndex=0,
 * diğerleri tabIndex=-1 (grup içinde ok tuşları ile navigasyon).
 */
function getRadioProps(ctx: RadioMachineContext): RadioDOMProps {
  return {
    role: 'radio',
    tabIndex: ctx.checked ? 0 : -1,
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
 * Radio API — state machine, props üretici ve durum sorgulama.
 * Radio API — state machine, props generator and state queries.
 */
export interface RadioAPI {
  /** Mevcut context / Current context */
  getContext(): RadioMachineContext;

  /** Event gönder, yeni context döner / Send event, returns new context */
  send(event: RadioEvent): RadioMachineContext;

  /** DOM attribute'larını üret / Generate DOM attributes */
  getRadioProps(): RadioDOMProps;

  /** Etkileşim engellenmiş mi (sadece disabled) / Is interaction blocked */
  isInteractionBlocked(): boolean;
}

/**
 * Radio state machine oluştur.
 * Create a radio state machine.
 *
 * @example
 * ```ts
 * const radio = createRadio({ value: 'option1' });
 * const domProps = radio.getRadioProps();
 * radio.send({ type: 'SELECT' });
 * // → checked: true
 * ```
 */
export function createRadio(props: RadioProps = {}): RadioAPI {
  let ctx = createInitialContext(props);

  return {
    getContext() {
      return ctx;
    },

    send(event: RadioEvent) {
      ctx = transition(ctx, event);
      return ctx;
    },

    getRadioProps() {
      return getRadioProps(ctx);
    },

    isInteractionBlocked() {
      return ctx.disabled;
    },
  };
}

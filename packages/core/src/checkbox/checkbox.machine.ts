/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Checkbox state machine — framework-agnostic headless checkbox logic.
 * Checkbox state machine — framework bağımsız headless checkbox mantığı.
 *
 * WAI-ARIA Checkbox pattern: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
 *
 * Toggle semantiği:
 * - unchecked ↔ checked (normal toggle)
 * - indeterminate → checked (indeterminate'ten toggle checked yapar)
 *
 * Etkileşim:
 * - disabled → tüm etkileşim engellenir
 * - readOnly → etkileşim çalışır ama TOGGLE yoksayılır (görebilir ama değiştiremez)
 *
 * @packageDocumentation
 */

import type {
  CheckboxProps,
  CheckboxMachineContext,
  CheckboxEvent,
  CheckboxDOMProps,
  CheckboxInteractionState,
  CheckboxCheckedState,
} from './checkbox.types';

/**
 * Varsayılan context / Default context.
 */
function createInitialContext(props: CheckboxProps): CheckboxMachineContext {
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
 * Checked state'ten data-state string'ine çevir.
 */
function getCheckedDataState(checked: CheckboxCheckedState): 'checked' | 'unchecked' | 'indeterminate' {
  if (checked === 'indeterminate') return 'indeterminate';
  return checked ? 'checked' : 'unchecked';
}

/**
 * Checked state'ten aria-checked değerine çevir.
 */
function getAriaChecked(checked: CheckboxCheckedState): boolean | 'mixed' {
  if (checked === 'indeterminate') return 'mixed';
  return checked;
}

/**
 * Toggle işlemi — indeterminate → checked, checked ↔ unchecked.
 */
function toggleChecked(checked: CheckboxCheckedState): CheckboxCheckedState {
  if (checked === 'indeterminate') return true;
  return !checked;
}

/**
 * Interaction state geçişi / Interaction state transition.
 */
function transition(
  ctx: CheckboxMachineContext,
  event: CheckboxEvent,
): CheckboxMachineContext {
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
    return { ...ctx, checked: toggleChecked(ctx.checked) };
  }

  // Etkileşim state geçişleri
  const { interactionState } = ctx;
  let nextState: CheckboxInteractionState = interactionState;

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
function getCheckboxProps(ctx: CheckboxMachineContext): CheckboxDOMProps {
  return {
    role: 'checkbox',
    tabIndex: 0,
    'aria-checked': getAriaChecked(ctx.checked),
    'aria-disabled': ctx.disabled ? true : undefined,
    'aria-invalid': ctx.invalid ? true : undefined,
    'aria-required': ctx.required ? true : undefined,
    'aria-readonly': ctx.readOnly ? true : undefined,
    'data-state': getCheckedDataState(ctx.checked),
    'data-disabled': ctx.disabled ? '' : undefined,
    'data-readonly': ctx.readOnly ? '' : undefined,
    'data-invalid': ctx.invalid ? '' : undefined,
    'data-focus': ctx.interactionState === 'focused' ? '' : undefined,
    'data-hover': ctx.interactionState === 'hover' ? '' : undefined,
    'data-active': ctx.interactionState === 'active' ? '' : undefined,
  };
}

/**
 * Checkbox API — state machine, props üretici ve durum sorgulama.
 * Checkbox API — state machine, props generator and state queries.
 */
export interface CheckboxAPI {
  /** Mevcut context / Current context */
  getContext(): CheckboxMachineContext;

  /** Event gönder, yeni context döner / Send event, returns new context */
  send(event: CheckboxEvent): CheckboxMachineContext;

  /** DOM attribute'larını üret / Generate DOM attributes */
  getCheckboxProps(): CheckboxDOMProps;

  /** Etkileşim engellenmiş mi (sadece disabled) / Is interaction blocked */
  isInteractionBlocked(): boolean;
}

/**
 * Checkbox state machine oluştur.
 * Create a checkbox state machine.
 *
 * @example
 * ```ts
 * const checkbox = createCheckbox({ checked: false });
 * const domProps = checkbox.getCheckboxProps();
 * checkbox.send({ type: 'TOGGLE' });
 * // → checked: true
 * ```
 */
export function createCheckbox(props: CheckboxProps = {}): CheckboxAPI {
  let ctx = createInitialContext(props);

  return {
    getContext() {
      return ctx;
    },

    send(event: CheckboxEvent) {
      ctx = transition(ctx, event);
      return ctx;
    },

    getCheckboxProps() {
      return getCheckboxProps(ctx);
    },

    isInteractionBlocked() {
      return ctx.disabled;
    },
  };
}

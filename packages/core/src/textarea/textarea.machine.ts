/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Textarea state machine — framework-agnostic headless textarea logic.
 * Textarea state machine — framework bağımsız headless textarea mantığı.
 *
 * Input machine ile aynı etkileşim modeli: readOnly etkileşimi engellemez,
 * sadece disabled engeller. Ek olarak resize/autoResize/rows yönetimi.
 *
 * @packageDocumentation
 */

import type {
  TextareaProps,
  TextareaMachineContext,
  TextareaEvent,
  TextareaDOMProps,
  TextareaInteractionState,
} from './textarea.types';

/**
 * Varsayılan context / Default context.
 */
function createInitialContext(props: TextareaProps): TextareaMachineContext {
  return {
    interactionState: 'idle',
    disabled: props.disabled ?? false,
    readOnly: props.readOnly ?? false,
    invalid: props.invalid ?? false,
    required: props.required ?? false,
    resize: props.resize ?? 'vertical',
    autoResize: props.autoResize ?? false,
    rows: props.rows ?? 3,
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
  ctx: TextareaMachineContext,
  event: TextareaEvent,
): TextareaMachineContext {
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
  let nextState: TextareaInteractionState = interactionState;

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
function getTextareaProps(ctx: TextareaMachineContext): TextareaDOMProps {
  return {
    disabled: ctx.disabled ? true : undefined,
    readOnly: ctx.readOnly ? true : undefined,
    required: ctx.required ? true : undefined,
    rows: ctx.rows,
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
 * Textarea API — state machine, props üretici ve durum sorgulama.
 * Textarea API — state machine, props generator and state queries.
 */
export interface TextareaAPI {
  /** Mevcut context / Current context */
  getContext(): TextareaMachineContext;

  /** Event gönder, yeni context döner / Send event, returns new context */
  send(event: TextareaEvent): TextareaMachineContext;

  /** DOM attribute'larını üret / Generate DOM attributes */
  getTextareaProps(): TextareaDOMProps;

  /** Etkileşim engellenmiş mi (sadece disabled) / Is interaction blocked */
  isInteractionBlocked(): boolean;
}

/**
 * Textarea state machine oluştur.
 * Create a textarea state machine.
 *
 * @example
 * ```ts
 * const textarea = createTextarea({ rows: 5, resize: 'vertical' });
 * const domProps = textarea.getTextareaProps();
 * textarea.send({ type: 'FOCUS' });
 * ```
 */
export function createTextarea(props: TextareaProps = {}): TextareaAPI {
  let ctx = createInitialContext(props);

  return {
    getContext() {
      return ctx;
    },

    send(event: TextareaEvent) {
      ctx = transition(ctx, event);
      return ctx;
    },

    getTextareaProps() {
      return getTextareaProps(ctx);
    },

    isInteractionBlocked() {
      return ctx.disabled;
    },
  };
}

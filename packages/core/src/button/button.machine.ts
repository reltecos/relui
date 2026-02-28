/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Button state machine — framework-agnostic headless button logic.
 * Button state machine — framework bağımsız headless buton mantığı.
 *
 * WAI-ARIA Button pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
 *
 * @packageDocumentation
 */

import type {
  ButtonProps,
  ButtonMachineContext,
  ButtonEvent,
  ButtonDOMProps,
  ButtonInteractionState,
} from './button.types';

/**
 * Varsayılan context / Default context.
 */
function createInitialContext(props: ButtonProps): ButtonMachineContext {
  return {
    interactionState: 'idle',
    disabled: props.disabled ?? false,
    loading: props.loading ?? false,
    elementType: props.elementType ?? 'button',
    type: props.type ?? 'button',
  };
}

/**
 * Etkileşim engellenmiş mi kontrol et.
 * Check if interaction is blocked.
 *
 * Disabled veya loading durumda kullanıcı etkileşimi engellenir.
 */
function isInteractionBlocked(ctx: ButtonMachineContext): boolean {
  return ctx.disabled || ctx.loading;
}

/**
 * Interaction state geçişi / Interaction state transition.
 *
 * Basit, deterministic state machine. Disabled/loading durumda
 * tüm etkileşim event'leri yoksayılır.
 */
function transition(
  ctx: ButtonMachineContext,
  event: ButtonEvent,
): ButtonMachineContext {
  // Prop güncellemeleri her zaman uygulanır / Prop updates always apply
  if (event.type === 'SET_DISABLED') {
    // Değer aynıysa yeni obje yaratma / Skip if value unchanged
    if (event.value === ctx.disabled) {
      return ctx;
    }
    return {
      ...ctx,
      disabled: event.value,
      // Disable olunca idle'a dön / Reset to idle on disable
      interactionState: event.value ? 'idle' : ctx.interactionState,
    };
  }

  if (event.type === 'SET_LOADING') {
    // Değer aynıysa yeni obje yaratma / Skip if value unchanged
    if (event.value === ctx.loading) {
      return ctx;
    }
    return {
      ...ctx,
      loading: event.value,
      // Loading olunca idle'a dön / Reset to idle on loading
      interactionState: event.value ? 'idle' : ctx.interactionState,
    };
  }

  // Etkileşim engelliyse geri dön / If interaction is blocked, return
  if (isInteractionBlocked(ctx)) {
    return ctx;
  }

  const { interactionState } = ctx;
  let nextState: ButtonInteractionState = interactionState;

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

    case 'KEY_DOWN':
      if (
        (event.key === 'Enter' || event.key === ' ') &&
        (interactionState === 'focused' || interactionState === 'hover')
      ) {
        nextState = 'active';
      }
      break;

    case 'KEY_UP':
      if (
        (event.key === 'Enter' || event.key === ' ') &&
        interactionState === 'active'
      ) {
        nextState = 'focused';
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
 * Element tipine göre doğru role, tabIndex ve diğer attribute'ları döner.
 * Native `<button>` için minimal attribute, diğer element'ler için
 * tam WAI-ARIA desteği sağlar.
 */
function getButtonProps(ctx: ButtonMachineContext): ButtonDOMProps {
  const isNativeButton = ctx.elementType === 'button';
  const isInteractive = !ctx.disabled && !ctx.loading;

  return {
    // Native button'da role gereksiz / role unnecessary for native button
    role: isNativeButton ? undefined : 'button',

    // Sadece native button'da type attribute / type only for native button
    type: isNativeButton ? ctx.type : undefined,

    // Native button'da tabIndex gereksiz (default 0), non-native'de 0 ver
    // Disabled non-native element'te tabIndex kalır (aria-disabled pattern)
    tabIndex: isNativeButton ? undefined : 0,

    // Native button'da disabled attribute engeller / disabled attr blocks native button
    // Non-native element'te aria-disabled kullanılır (fokus korunur)
    disabled: isNativeButton && !isInteractive ? true : undefined,

    // Tüm element'ler için aria-disabled / aria-disabled for all elements
    'aria-disabled': !isInteractive ? true : undefined,

    // Loading durumda aria-busy / aria-busy when loading
    'aria-busy': ctx.loading ? true : undefined,

    // Data attribute'lar — CSS styling için / Data attrs for CSS styling
    'data-state': ctx.interactionState,
    'data-disabled': ctx.disabled ? '' : undefined,
    'data-loading': ctx.loading ? '' : undefined,
  };
}

/**
 * Button API — state machine, props üretici ve durum sorgulama.
 * Button API — state machine, props generator and state queries.
 */
export interface ButtonAPI {
  /** Mevcut context / Current context */
  getContext(): ButtonMachineContext;

  /** Event gönder, yeni context döner / Send event, returns new context */
  send(event: ButtonEvent): ButtonMachineContext;

  /** DOM attribute'larını üret / Generate DOM attributes */
  getButtonProps(): ButtonDOMProps;

  /** Etkileşim engellenmiş mi / Is interaction blocked */
  isInteractionBlocked(): boolean;
}

/**
 * Button state machine oluştur.
 * Create a button state machine.
 *
 * Framework-agnostic — React, Vue, Svelte, Angular, Solid
 * hepsi bu core'u kullanır.
 *
 * @example
 * ```ts
 * const button = createButton({ variant: 'solid', size: 'md' });
 * const domProps = button.getButtonProps();
 * button.send({ type: 'POINTER_ENTER' });
 * ```
 */
export function createButton(props: ButtonProps = {}): ButtonAPI {
  let ctx = createInitialContext(props);

  return {
    getContext() {
      return ctx;
    },

    send(event: ButtonEvent) {
      ctx = transition(ctx, event);
      return ctx;
    },

    getButtonProps() {
      return getButtonProps(ctx);
    },

    isInteractionBlocked() {
      return isInteractionBlocked(ctx);
    },
  };
}

/**
 * Keyboard event handler — non-native button element'ler için.
 * Keyboard event handler — for non-native button elements.
 *
 * Native `<button>` Space ve Enter'ı otomatik handle eder.
 * Non-native element'ler (div, span, a) için click simüle eder.
 *
 * @returns Click tetiklenmeli mi / Should click be triggered
 */
export function shouldTriggerClick(key: string, elementType: ButtonProps['elementType']): boolean {
  if (elementType === 'button') {
    return false; // Native button bunu zaten yapar / Native button handles this
  }

  // Non-native: Enter anında, Space key-up'ta tetikler
  // Non-native: Enter triggers immediately, Space on key-up
  return key === 'Enter';
}

/**
 * Space key-up'ta click tetiklenmeli mi.
 * Should click trigger on Space key-up.
 *
 * @returns Click tetiklenmeli mi / Should click be triggered
 */
export function shouldTriggerClickOnKeyUp(
  key: string,
  elementType: ButtonProps['elementType'],
): boolean {
  if (elementType === 'button') {
    return false;
  }

  return key === ' ';
}

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * InPlaceEditor state machine — framework-agnostic.
 * InPlaceEditor durum makinesi — framework bağımsız.
 *
 * reading ↔ editing geçişleri, value yönetimi, confirm/cancel mantığı.
 *
 * @packageDocumentation
 */

import type {
  InPlaceEditorProps,
  InPlaceEditorEvent,
  InPlaceEditorMachineContext,
  InPlaceEditorDisplayDOMProps,
  InPlaceEditorInputDOMProps,
  InPlaceEditorAPI,
} from './in-place-editor.types';

/**
 * InPlaceEditor state machine oluştur.
 * Create an InPlaceEditor state machine.
 *
 * @example
 * ```ts
 * const editor = createInPlaceEditor({ defaultValue: 'Merhaba' });
 * editor.send({ type: 'EDIT' });
 * editor.send({ type: 'SET_EDIT_VALUE', value: 'Yeni değer' });
 * editor.send({ type: 'CONFIRM' });
 * // editor.getContext().value === 'Yeni değer'
 * ```
 */
export function createInPlaceEditor(props: InPlaceEditorProps = {}): InPlaceEditorAPI {
  const {
    defaultValue = '',
    disabled = false,
    readOnly = false,
  } = props;

  // ── Mutable context ────────────────────────────────────────
  const ctx: InPlaceEditorMachineContext = {
    state: 'reading',
    value: defaultValue,
    editValue: defaultValue,
    disabled,
    readOnly,
  };

  // ── Event handler ──────────────────────────────────────────
  function send(event: InPlaceEditorEvent): void {
    switch (event.type) {
      case 'EDIT': {
        if (ctx.disabled || ctx.readOnly) return;
        if (ctx.state === 'editing') return;
        ctx.state = 'editing';
        ctx.editValue = ctx.value;
        break;
      }

      case 'CONFIRM': {
        if (ctx.state !== 'editing') return;
        ctx.value = ctx.editValue;
        ctx.state = 'reading';
        break;
      }

      case 'CANCEL': {
        if (ctx.state !== 'editing') return;
        ctx.editValue = ctx.value;
        ctx.state = 'reading';
        break;
      }

      case 'SET_VALUE': {
        ctx.value = event.value;
        if (ctx.state === 'reading') {
          ctx.editValue = event.value;
        }
        break;
      }

      case 'SET_EDIT_VALUE': {
        if (ctx.state !== 'editing') return;
        ctx.editValue = event.value;
        break;
      }

      case 'SET_DISABLED': {
        ctx.disabled = event.disabled;
        // Disabled olursa edit modundan çık, iptal et
        if (event.disabled && ctx.state === 'editing') {
          ctx.editValue = ctx.value;
          ctx.state = 'reading';
        }
        break;
      }

      case 'SET_READ_ONLY': {
        ctx.readOnly = event.readOnly;
        // ReadOnly olursa edit modundan çık, iptal et
        if (event.readOnly && ctx.state === 'editing') {
          ctx.editValue = ctx.value;
          ctx.state = 'reading';
        }
        break;
      }
    }
  }

  // ── DOM Props üreticileri ──────────────────────────────────

  function getDisplayProps(): InPlaceEditorDisplayDOMProps {
    return {
      role: 'button',
      tabIndex: ctx.disabled ? -1 : 0,
      ...(ctx.disabled ? { 'aria-disabled': true, 'data-disabled': '' as const } : {}),
      ...(ctx.readOnly ? { 'aria-readonly': true, 'data-readonly': '' as const } : {}),
      'data-state': ctx.state,
    };
  }

  function getInputProps(): InPlaceEditorInputDOMProps {
    return {
      value: ctx.editValue,
      disabled: ctx.disabled,
      readOnly: ctx.readOnly,
      'data-state': ctx.state,
    };
  }

  return {
    getContext: () => ctx,
    send,
    getDisplayProps,
    getInputProps,
  };
}

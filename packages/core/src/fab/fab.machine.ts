/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * createFAB — floating action button state machine.
 * createFAB — floating action button state machine.
 *
 * Speed dial acma/kapama, aksiyon secimi.
 *
 * @packageDocumentation
 */

import type {
  FabAction,
  FabEvent,
  FabContext,
  FabConfig,
  FabAPI,
} from './fab.types';

// ── Factory ────────────────────────────────────────────

export function createFAB(config: FabConfig = {}): FabAPI {
  // ── State ──
  const ctx: FabContext = {
    open: config.open ?? false,
    actions: config.actions ?? [],
    selectedActionId: null,
  };

  const listeners = new Set<() => void>();

  function notify() {
    listeners.forEach((fn) => fn());
  }

  // ── Helpers ──

  function findAction(id: string): FabAction | undefined {
    return ctx.actions.find((a) => a.id === id);
  }

  function setOpen(open: boolean) {
    if (ctx.open !== open) {
      ctx.open = open;
      config.onOpenChange?.(open);
      notify();
    }
  }

  // ── Send ──

  function send(event: FabEvent): void {
    switch (event.type) {
      case 'OPEN': {
        setOpen(true);
        break;
      }

      case 'CLOSE': {
        setOpen(false);
        break;
      }

      case 'TOGGLE': {
        setOpen(!ctx.open);
        break;
      }

      case 'SELECT_ACTION': {
        const action = findAction(event.actionId);
        if (!action || action.disabled) return;

        ctx.selectedActionId = event.actionId;
        config.onSelectAction?.(event.actionId);
        setOpen(false);
        break;
      }

      case 'SET_ACTIONS': {
        ctx.actions = event.actions;
        notify();
        break;
      }

      case 'SET_OPEN': {
        setOpen(event.open);
        break;
      }
    }
  }

  // ── DOM Props ──

  function getButtonProps(): Record<string, unknown> {
    return {
      type: 'button',
      'aria-expanded': ctx.open,
      'aria-haspopup': ctx.actions.length > 0 ? 'true' : undefined,
      'aria-label': ctx.open ? 'Close actions' : 'Open actions',
    };
  }

  function getActionProps(actionId: string): Record<string, unknown> {
    const action = findAction(actionId);
    const isDisabled = action?.disabled ?? false;

    return {
      type: 'button',
      role: 'menuitem',
      'aria-label': action?.label,
      'aria-disabled': isDisabled || undefined,
      tabIndex: isDisabled ? -1 : 0,
    };
  }

  // ── API ──

  return {
    getContext: () => ctx,
    send,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
    getButtonProps,
    getActionProps,
  };
}

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useFAB — FloatingActionButton hook.
 *
 * Core machine'i React'a baglar, prop sync yapar.
 *
 * @packageDocumentation
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import {
  createFAB,
  type FabAction,
  type FabAPI,
  type FabContext,
} from '@relteco/relui-core';

// ── Props ────────────────────────────────────────────────

export interface UseFABProps {
  /** Aksiyonlar / Action items */
  actions?: FabAction[];

  /** Kontrol edilen acik/kapali / Controlled open state */
  open?: boolean;

  /** Acik/kapali degisiklik callback / Open change callback */
  onOpenChange?: (open: boolean) => void;

  /** Aksiyon secildiginde / Action selected callback */
  onSelectAction?: (actionId: string) => void;
}

// ── Return ───────────────────────────────────────────────

export interface UseFABReturn {
  /** Machine context */
  context: FabContext;

  /** Core API */
  api: FabAPI;

  /** Toggle open/close */
  toggle: () => void;

  /** Aksiyon sec / Select action */
  selectAction: (actionId: string) => void;
}

// ── Hook ────────────────────────────────────────────────

export function useFAB(props: UseFABProps = {}): UseFABReturn {
  const {
    actions,
    open: openProp,
    onOpenChange,
    onSelectAction,
  } = props;

  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  // ── Stable callback refs ──
  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;
  const onSelectActionRef = useRef(onSelectAction);
  onSelectActionRef.current = onSelectAction;

  // ── Machine singleton ──
  const apiRef = useRef<FabAPI | null>(null);
  if (!apiRef.current) {
    apiRef.current = createFAB({
      actions: actions ?? [],
      open: openProp ?? false,
      onOpenChange: (o) => onOpenChangeRef.current?.(o),
      onSelectAction: (id) => onSelectActionRef.current?.(id),
    });
  }
  const api = apiRef.current;

  // ── Prop sync ──
  const prevActionsRef = useRef<FabAction[] | undefined>(undefined);
  if (actions !== undefined && actions !== prevActionsRef.current) {
    api.send({ type: 'SET_ACTIONS', actions });
    prevActionsRef.current = actions;
    forceRender();
  }

  const prevOpenRef = useRef<boolean | undefined>(undefined);
  if (openProp !== undefined && openProp !== prevOpenRef.current) {
    api.send({ type: 'SET_OPEN', open: openProp });
    prevOpenRef.current = openProp;
    forceRender();
  }

  // ── Subscribe ──
  useEffect(() => {
    return api.subscribe(() => forceRender());
  }, [api]);

  // ── Actions ──
  const toggle = useCallback(() => {
    api.send({ type: 'TOGGLE' });
  }, [api]);

  const selectAction = useCallback(
    (actionId: string) => {
      api.send({ type: 'SELECT_ACTION', actionId });
    },
    [api],
  );

  return {
    context: api.getContext(),
    api,
    toggle,
    selectAction,
  };
}

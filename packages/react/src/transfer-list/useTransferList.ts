/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useTransferList — TransferList core binding hook.
 *
 * @packageDocumentation
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import { createTransferList } from '@relteco/relui-core';
import type { TransferListConfig, TransferListContext, TransferListEvent, TransferListAPI } from '@relteco/relui-core';

export type UseTransferListProps = TransferListConfig;

export interface UseTransferListReturn {
  /** Mevcut context / Current context */
  context: TransferListContext;
  /** Event gonder / Send event */
  send: (event: TransferListEvent) => void;
  /** Core API / Core API */
  api: TransferListAPI;
}

export function useTransferList(props: UseTransferListProps): UseTransferListReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<TransferListAPI | null>(null);
  const prevRef = useRef<UseTransferListProps | undefined>(undefined);

  if (apiRef.current === null) {
    apiRef.current = createTransferList(props);
  }
  const api = apiRef.current;

  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) { prevRef.current = props; return; }
    prevRef.current = props;
  });

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  const send = useCallback(
    (event: TransferListEvent) => { api.send(event); },
    [api],
  );

  return {
    context: api.getContext(),
    send,
    api,
  };
}

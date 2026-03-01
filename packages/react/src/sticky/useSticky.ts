/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useSticky — React hook for sticky element state tracking.
 * useSticky — Yapışkan eleman state takibi React hook'u.
 *
 * IntersectionObserver ile elemanın stuck durumunu takip eder.
 *
 * @packageDocumentation
 */

import { useEffect, useReducer, useRef } from 'react';
import { createSticky } from '@relteco/relui-core';
import type {
  StickyPosition,
  StickyState,
  StickyAPI,
} from '@relteco/relui-core';

/** useSticky hook props. */
export interface UseStickyProps {
  /** Yapışma pozisyonu. Varsayılan: 'top'. */
  position?: StickyPosition;
  /** Yapışma ofseti (px). Varsayılan: 0. */
  offset?: number;
  /** Aktif mi. Varsayılan: true. */
  enabled?: boolean;
  /** Stuck state değiştiğinde çağrılır. */
  onStickyChange?: (stuck: boolean) => void;
}

/** useSticky hook dönüş değeri. */
export interface UseStickyReturn {
  /** Sentinel ref — sticky elemanın hemen üstüne/altına yerleştirilir. */
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  /** Sticky element ref. */
  stickyRef: React.RefObject<HTMLDivElement | null>;
  /** Mevcut state. */
  state: StickyState;
  /** Yapışmış mı. */
  isStuck: boolean;
  /** Core API. */
  api: StickyAPI;
}

/**
 * Sticky React hook'u.
 *
 * IntersectionObserver sentinel pattern'ı kullanır:
 * Sentinel (0px yükseklik div) sticky elemanın hemen üstüne/altına yerleştirilir.
 * Sentinel viewport dışına çıktığında → element stuck state'e geçer.
 */
export function useSticky(props: UseStickyProps = {}): UseStickyReturn {
  const { position = 'top', offset = 0, enabled = true, onStickyChange } = props;

  const apiRef = useRef<StickyAPI | null>(null);
  if (apiRef.current === null) {
    apiRef.current = createSticky({ position, offset, enabled });
  }
  const api = apiRef.current;

  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const prevStuckRef = useRef(false);

  // ── Prop sync ────────────────────────────────────────

  useEffect(() => {
    api.send({ type: 'SET_POSITION', value: position });
  }, [api, position]);

  useEffect(() => {
    api.send({ type: 'SET_OFFSET', value: offset });
  }, [api, offset]);

  useEffect(() => {
    api.send({ type: 'SET_ENABLED', value: enabled });
    forceRender();
  }, [api, enabled]);

  // ── IntersectionObserver ──────────────────────────────

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !enabled) return;

    const rootMargin = position === 'top'
      ? `-${offset + 1}px 0px 0px 0px`
      : `0px 0px -${offset + 1}px 0px`;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const stuck = !entry.isIntersecting;

          if (stuck) {
            api.send({
              type: 'UPDATE',
              containerTop: entry.boundingClientRect.top,
              containerBottom: entry.boundingClientRect.bottom,
              viewportHeight: entry.rootBounds?.height ?? window.innerHeight,
            });
          } else {
            api.send({
              type: 'UPDATE',
              containerTop: entry.boundingClientRect.top,
              containerBottom: entry.boundingClientRect.bottom,
              viewportHeight: entry.rootBounds?.height ?? window.innerHeight,
            });
          }

          if (prevStuckRef.current !== api.isStuck()) {
            prevStuckRef.current = api.isStuck();
            onStickyChange?.(api.isStuck());
          }

          forceRender();
        }
      },
      { threshold: [0, 1], rootMargin },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [api, enabled, offset, position, onStickyChange]);

  return {
    sentinelRef,
    stickyRef,
    state: api.getState(),
    isStuck: api.isStuck(),
    api,
  };
}

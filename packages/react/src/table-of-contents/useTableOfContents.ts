/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useTableOfContents — TableOfContents hook.
 *
 * Core machine'i React'a baglar, scroll spy (IntersectionObserver)
 * ile aktif basligi izler, scrollTo destekler.
 *
 * @packageDocumentation
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import {
  createTableOfContents,
  type TocItem,
  type TocAPI,
  type TocContext,
} from '@relteco/relui-core';

// ── Props ────────────────────────────────────────────────

export interface UseTableOfContentsProps {
  /** Baslik listesi / Heading items */
  items: TocItem[];

  /** Kontrol edilen aktif id / Controlled active id */
  activeId?: string | null;

  /** Scroll offset (px) / Scroll detection offset */
  offset?: number;

  /** Scroll davranisi / Scroll behavior */
  scrollBehavior?: ScrollBehavior;

  /** Scroll container (default: window) / Scroll container element */
  scrollContainer?: HTMLElement | null;

  /** Degisiklik callback / Change callback */
  onChange?: (activeId: string | null) => void;
}

// ── Return ───────────────────────────────────────────────

export interface UseTableOfContentsReturn {
  /** Machine context */
  context: TocContext;

  /** Core API */
  api: TocAPI;

  /** Belirli bir basligi kaydir / Scroll to a heading */
  scrollTo: (id: string) => void;
}

// ── Hook ────────────────────────────────────────────────

export function useTableOfContents(props: UseTableOfContentsProps): UseTableOfContentsReturn {
  const {
    items,
    activeId: activeIdProp,
    offset = 0,
    scrollBehavior = 'smooth',
    scrollContainer,
    onChange,
  } = props;

  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  // ── Machine singleton ──
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const apiRef = useRef<TocAPI | null>(null);
  if (!apiRef.current) {
    apiRef.current = createTableOfContents({
      items,
      activeId: activeIdProp ?? null,
      offset,
      onChange: (id) => onChangeRef.current?.(id),
    });
  }
  const api = apiRef.current;

  // ── Prop sync ──
  const prevItemsRef = useRef<TocItem[] | undefined>(undefined);
  if (items !== prevItemsRef.current) {
    api.send({ type: 'SET_ITEMS', items });
    prevItemsRef.current = items;
    forceRender();
  }

  const prevActiveIdRef = useRef<string | null | undefined>(undefined);
  if (activeIdProp !== undefined && activeIdProp !== prevActiveIdRef.current) {
    api.send({ type: 'SET_ACTIVE', id: activeIdProp });
    prevActiveIdRef.current = activeIdProp;
    forceRender();
  }

  const prevOffsetRef = useRef<number | undefined>(undefined);
  if (offset !== prevOffsetRef.current) {
    api.send({ type: 'SET_OFFSET', offset });
    prevOffsetRef.current = offset;
  }

  // ── Subscribe ──
  useEffect(() => {
    return api.subscribe(() => forceRender());
  }, [api]);

  // ── Scroll Spy (IntersectionObserver) ──
  useEffect(() => {
    if (items.length === 0) return;

    // Scroll spy sadece controlled değilse çalışır
    if (activeIdProp !== undefined) return;

    const root = scrollContainer ?? null;
    const rootMargin = `-${offset}px 0px 0px 0px`;

    const visibleIds = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleIds.add(entry.target.id);
          } else {
            visibleIds.delete(entry.target.id);
          }
        }

        // Items sırasına göre ilk görünen'i bul
        for (const item of items) {
          if (visibleIds.has(item.id)) {
            api.send({ type: 'SET_ACTIVE', id: item.id });
            return;
          }
        }

        // Hiçbiri görünmüyorsa null yapma (son aktif kalsın)
      },
      {
        root,
        rootMargin,
        threshold: 0,
      },
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items, offset, scrollContainer, activeIdProp, api]);

  // ── ScrollTo handler ──
  const scrollTo = useCallback(
    (id: string) => {
      api.send({ type: 'SCROLL_TO', id });

      const el = document.getElementById(id);
      if (!el) return;

      const container = scrollContainer ?? window;

      if (container instanceof Window) {
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: scrollBehavior });
      } else {
        const top = el.offsetTop - offset;
        container.scrollTo({ top, behavior: scrollBehavior });
      }
    },
    [api, scrollContainer, offset, scrollBehavior],
  );

  return {
    context: api.getContext(),
    api,
    scrollTo,
  };
}

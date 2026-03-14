/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * usePagination — React hook for pagination state machine.
 * usePagination — Pagination state machine React hook'u.
 *
 * @packageDocumentation
 */

import { useCallback, useReducer, useRef } from 'react';
import { createPagination } from '@relteco/relui-core';
import type {
  PaginationProps as CorePaginationProps,
  PaginationEvent,
  PaginationRangeItem,
  PaginationNavDOMProps,
  PaginationPageDOMProps,
  PaginationControlDOMProps,
} from '@relteco/relui-core';

/**
 * usePagination hook props.
 */
export interface UsePaginationProps extends CorePaginationProps {
  /** Sayfa degisim callback'i / Page change callback */
  onPageChange?: (page: number) => void;
}

/**
 * usePagination hook donus tipi.
 */
export interface UsePaginationReturn {
  /** Nav DOM attribute'lari / Nav DOM attributes */
  navProps: PaginationNavDOMProps;

  /** Sayfa araligi / Page range */
  pageRange: PaginationRangeItem[];

  /** Sayfa butonu DOM props / Page button DOM props */
  getPageProps: (page: number) => PaginationPageDOMProps & { onClick: () => void };

  /** Onceki buton DOM props / Prev button DOM props */
  prevProps: PaginationControlDOMProps & { onClick: () => void };

  /** Sonraki buton DOM props / Next button DOM props */
  nextProps: PaginationControlDOMProps & { onClick: () => void };

  /** Ilk buton DOM props / First button DOM props */
  firstProps: PaginationControlDOMProps & { onClick: () => void };

  /** Son buton DOM props / Last button DOM props */
  lastProps: PaginationControlDOMProps & { onClick: () => void };

  /** Mevcut sayfa / Current page */
  page: number;

  /** Toplam sayfa / Total pages */
  totalPages: number;

  /** Onceki sayfa var mi / Has previous page */
  hasPrevPage: boolean;

  /** Sonraki sayfa var mi / Has next page */
  hasNextPage: boolean;

  /** Oge araligi / Item range */
  itemRange: { start: number; end: number };
}

export function usePagination(props: UsePaginationProps): UsePaginationReturn {
  const { onPageChange, ...coreProps } = props;

  const machineRef = useRef<ReturnType<typeof createPagination> | null>(null);
  if (!machineRef.current) {
    machineRef.current = createPagination(coreProps);
  }
  const machine = machineRef.current;

  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  // Prop sync
  const prevTotalItemsRef = useRef(coreProps.totalItems);
  const prevPageSizeRef = useRef(coreProps.pageSize);
  const prevPageRef = useRef(coreProps.page);

  if (coreProps.totalItems !== prevTotalItemsRef.current) {
    machine.send({ type: 'SET_TOTAL_ITEMS', totalItems: coreProps.totalItems });
    prevTotalItemsRef.current = coreProps.totalItems;
    forceRender();
  }
  if (coreProps.pageSize !== undefined && coreProps.pageSize !== prevPageSizeRef.current) {
    machine.send({ type: 'SET_PAGE_SIZE', pageSize: coreProps.pageSize });
    prevPageSizeRef.current = coreProps.pageSize;
    forceRender();
  }
  if (coreProps.page !== undefined && coreProps.page !== prevPageRef.current) {
    machine.send({ type: 'SET_PAGE', page: coreProps.page });
    prevPageRef.current = coreProps.page;
    forceRender();
  }

  const send = useCallback(
    (event: PaginationEvent) => {
      const prevCtx = machine.getContext();
      const nextCtx = machine.send(event);
      if (nextCtx !== prevCtx) {
        forceRender();
        if (nextCtx.page !== prevCtx.page) {
          onPageChange?.(nextCtx.page);
        }
      }
      return nextCtx;
    },
    [machine, onPageChange],
  );

  const goToPage = useCallback(
    (page: number) => {
      send({ type: 'GO_TO_PAGE', page });
    },
    [send],
  );

  const goToPrev = useCallback(() => {
    send({ type: 'PREV_PAGE' });
  }, [send]);

  const goToNext = useCallback(() => {
    send({ type: 'NEXT_PAGE' });
  }, [send]);

  const goToFirst = useCallback(() => {
    send({ type: 'FIRST_PAGE' });
  }, [send]);

  const goToLast = useCallback(() => {
    send({ type: 'LAST_PAGE' });
  }, [send]);

  const getPageProps = useCallback(
    (page: number) => ({
      ...machine.getPageProps(page),
      onClick: () => goToPage(page),
    }),
    [machine, goToPage],
  );

  return {
    navProps: machine.getNavProps(),
    pageRange: machine.getPageRange(),
    getPageProps,
    prevProps: { ...machine.getPrevProps(), onClick: goToPrev },
    nextProps: { ...machine.getNextProps(), onClick: goToNext },
    firstProps: { ...machine.getFirstProps(), onClick: goToFirst },
    lastProps: { ...machine.getLastProps(), onClick: goToLast },
    page: machine.getPage(),
    totalPages: machine.getTotalPages(),
    hasPrevPage: machine.hasPrevPage(),
    hasNextPage: machine.hasNextPage(),
    itemRange: machine.getItemRange(),
  };
}

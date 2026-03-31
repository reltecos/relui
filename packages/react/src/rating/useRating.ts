/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useRating — React hook for rating state machine.
 * useRating — Rating state machine React hook'u.
 *
 * Core state machine'i React state ile senkronize eder.
 *
 * @packageDocumentation
 */

import { useRef, useReducer, useEffect } from 'react';
import { createRating } from '@relteco/relui-core';
import type { RatingAPI } from '@relteco/relui-core';

/**
 * useRating hook props.
 */
export interface UseRatingProps {
  /** Varsayilan deger / Default value */
  defaultValue?: number;
  /** Yildiz sayisi / Star count */
  count?: number;
  /** Yarim yildiz destegi / Allow half star */
  allowHalf?: boolean;
  /** Salt okunur mu / Read only */
  readOnly?: boolean;
  /** Deger degistiginde callback / On change callback */
  onChange?: (value: number) => void;
}

/**
 * useRating hook donus tipi.
 */
export interface UseRatingReturn {
  /** Secili deger / Current value */
  value: number;
  /** Hover edilen deger / Hovered value */
  hoveredValue: number | null;
  /** Hover durumunda mi / Is hovering */
  isHovering: boolean;
  /** Deger ata / Set value */
  setValue: (value: number) => void;
  /** Hover baslat / Start hover */
  hover: (value: number) => void;
  /** Hover bitir / End hover */
  hoverEnd: () => void;
  /** Temizle / Clear */
  clear: () => void;
  /** Core API referansi / Core API reference */
  api: RatingAPI;
}

/**
 * Rating state machine React hook'u.
 *
 * @example
 * ```tsx
 * const { value, setValue, hover, hoverEnd } = useRating({
 *   defaultValue: 3,
 *   count: 5,
 *   onChange: (v) => console.log(v),
 * });
 * ```
 */
export function useRating(props: UseRatingProps = {}): UseRatingReturn {
  const { defaultValue, count, allowHalf, readOnly, onChange } = props;

  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<RatingAPI | null>(null);
  const prevRef = useRef<UseRatingProps | undefined>(undefined);

  if (apiRef.current === null) {
    apiRef.current = createRating({
      defaultValue,
      count,
      allowHalf,
      readOnly,
      onChange,
    });
  }
  const api = apiRef.current;

  // Prop sync
  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) {
      prevRef.current = props;
      return;
    }
    prevRef.current = props;
  });

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  const ctx = api.getContext();

  return {
    value: ctx.value,
    hoveredValue: ctx.hoveredValue,
    isHovering: ctx.isHovering,
    setValue: (value: number) => api.send({ type: 'SET_VALUE', value }),
    hover: (value: number) => api.send({ type: 'HOVER', value }),
    hoverEnd: () => api.send({ type: 'HOVER_END' }),
    clear: () => api.send({ type: 'CLEAR' }),
    api,
  };
}

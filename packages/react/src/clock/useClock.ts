/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useClock — Clock React hook.
 *
 * @packageDocumentation
 */

import { useRef, useReducer, useEffect } from 'react';
import {
  createClock,
  type ClockConfig,
  type ClockAPI,
  type ClockContext,
} from '@relteco/relui-core';

// ── Hook Props ──────────────────────────────────────

export interface UseClockProps {
  /** 24 saat formati / 24-hour format */
  is24h?: boolean;
  /** Saat dilimi (IANA) / Timezone (IANA) */
  timezone?: string;
  /** Tick callback */
  onTick?: (ctx: ClockContext) => void;
  /** Tick araligi (ms) / Tick interval (default 1000) */
  tickInterval?: number;
}

// ── Hook Return ─────────────────────────────────────

export interface UseClockReturn {
  /** Saat / Hours */
  hours: number;
  /** Dakika / Minutes */
  minutes: number;
  /** Saniye / Seconds */
  seconds: number;
  /** AM/PM */
  period: 'AM' | 'PM';
  /** 24 saat mi / Is 24h */
  is24h: boolean;
  /** Saat dilimi / Timezone */
  timezone: string;
  /** Ham saat (0-23) / Raw hours */
  rawHours: number;
  /** Core API / Core API */
  api: ClockAPI;
}

/**
 * useClock — Clock yonetim hook.
 * useClock — Clock management hook.
 */
export function useClock(props: UseClockProps = {}): UseClockReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  const apiRef = useRef<ClockAPI | null>(null);
  const prevRef = useRef<UseClockProps | undefined>(undefined);

  if (apiRef.current === null) {
    const cfg: ClockConfig = {
      is24h: props.is24h,
      timezone: props.timezone,
      onTick: props.onTick,
    };
    apiRef.current = createClock(cfg);
  }
  const api = apiRef.current;

  // ── Prop sync ──
  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) {
      prevRef.current = props;
      return;
    }
    if (prev.timezone !== props.timezone && props.timezone !== undefined) {
      api.send({ type: 'SET_TIMEZONE', timezone: props.timezone });
      forceRender();
    }
    if (prev.is24h !== props.is24h && props.is24h !== undefined) {
      api.send({ type: 'SET_FORMAT', is24h: props.is24h });
      forceRender();
    }
    prevRef.current = props;
  });

  // ── Subscribe ──
  useEffect(() => api.subscribe(forceRender), [api]);

  // ── Auto-tick interval ──
  useEffect(() => {
    const interval = setInterval(() => {
      api.send({ type: 'TICK' });
    }, props.tickInterval ?? 1000);
    return () => clearInterval(interval);
  }, [api, props.tickInterval]);

  // ── Cleanup ──
  useEffect(() => () => api.destroy(), [api]);

  const ctx = api.getContext();

  return {
    hours: ctx.hours,
    minutes: ctx.minutes,
    seconds: ctx.seconds,
    period: ctx.period,
    is24h: ctx.is24h,
    timezone: ctx.timezone,
    rawHours: ctx.rawHours,
    api,
  };
}

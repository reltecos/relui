/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * useColorPicker — ColorPicker React hook.
 *
 * @packageDocumentation
 */

import { useRef, useReducer, useEffect, useCallback } from 'react';
import {
  createColorPicker,
  type ColorPickerConfig,
  type ColorPickerAPI,
} from '@relteco/relui-core';

// ── Hook Props ──────────────────────────────────────

export interface UseColorPickerProps extends ColorPickerConfig {
  /** Controlled hex renk / Controlled hex color */
  value?: string;
  /** Controlled alpha / Controlled alpha */
  alpha?: number;
}

// ── Hook Return ─────────────────────────────────────

export interface UseColorPickerReturn {
  /** Hex renk / Hex color */
  hex: string;
  /** RGB / RGB */
  rgb: { r: number; g: number; b: number };
  /** HSL / HSL */
  hsl: { h: number; s: number; l: number };
  /** HSV / HSV */
  hsv: { h: number; s: number; v: number };
  /** Alpha / Alpha */
  alpha: number;
  /** Hex ayarla / Set hex */
  setHex: (hex: string) => void;
  /** Hue ayarla / Set hue */
  setHue: (hue: number) => void;
  /** Saturation-Value ayarla / Set saturation-value */
  setSaturationValue: (s: number, v: number) => void;
  /** Alpha ayarla / Set alpha */
  setAlpha: (alpha: number) => void;
  /** Core API / Core API */
  api: ColorPickerAPI;
}

/**
 * useColorPicker — ColorPicker yonetim hook.
 * useColorPicker — ColorPicker management hook.
 */
export function useColorPicker(props: UseColorPickerProps = {}): UseColorPickerReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);

  const apiRef = useRef<ColorPickerAPI | null>(null);
  const prevRef = useRef<UseColorPickerProps | undefined>(undefined);

  if (apiRef.current === null) {
    apiRef.current = createColorPicker({
      defaultColor: props.value ?? props.defaultColor,
      defaultAlpha: props.alpha ?? props.defaultAlpha,
      onChange: props.onChange,
    });
  }
  const api = apiRef.current;

  // ── Prop sync ──
  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) {
      prevRef.current = props;
      return;
    }

    if (prev.value !== props.value && props.value !== undefined) {
      api.send({ type: 'SET_HEX', hex: props.value });
      forceRender();
    }
    if (prev.alpha !== props.alpha && props.alpha !== undefined) {
      api.send({ type: 'SET_ALPHA', alpha: props.alpha });
      forceRender();
    }

    prevRef.current = props;
  });

  // ── Subscribe ──
  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  const ctx = api.getContext();

  const setHex = useCallback((hex: string) => api.send({ type: 'SET_HEX', hex }), [api]);
  const setHue = useCallback((hue: number) => api.send({ type: 'SET_HUE', hue }), [api]);
  const setSaturationValue = useCallback(
    (s: number, v: number) => api.send({ type: 'SET_SATURATION_VALUE', s, v }),
    [api],
  );
  const setAlpha = useCallback(
    (a: number) => api.send({ type: 'SET_ALPHA', alpha: a }),
    [api],
  );

  return {
    hex: ctx.hex,
    rgb: ctx.rgb,
    hsl: ctx.hsl,
    hsv: ctx.hsv,
    alpha: ctx.alpha,
    setHex,
    setHue,
    setSaturationValue,
    setAlpha,
    api,
  };
}

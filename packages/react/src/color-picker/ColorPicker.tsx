/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * ColorPicker — renk secici bilesen (Dual API).
 * ColorPicker — color picker component (Dual API).
 *
 * Props-based:
 * ```tsx
 * <ColorPicker value="#3b82f6" onChange={(hex) => {}} showAlpha showInput />
 * ```
 *
 * Compound:
 * ```tsx
 * <ColorPicker value="#3b82f6" onChange={(hex) => {}}>
 *   <ColorPicker.Spectrum />
 *   <ColorPicker.HueSlider />
 *   <ColorPicker.AlphaSlider />
 *   <ColorPicker.Input />
 *   <ColorPicker.Presets colors={['#ff0000', '#00ff00', '#0000ff']} />
 * </ColorPicker>
 * ```
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, useCallback, type ReactNode, type KeyboardEvent } from 'react';
import {
  rootStyle,
  sizeStyles,
  spectrumStyle,
  spectrumSizeStyles,
  spectrumThumbStyle,
  hueSliderStyle,
  alphaSliderStyle,
  sliderThumbStyle,
  inputWrapperStyle,
  hexInputStyle,
  swatchStyle,
  swatchGridStyle,
  presetSwatchStyle,
} from './color-picker.css';
import {
  getSlotProps,
  type SlotStyleProps,
  type ClassNames,
  type Styles,
} from '../utils/slot-styles';
import { useColorPicker, type UseColorPickerProps } from './useColorPicker';

// ── Slot ──────────────────────────────────────────────

/** ColorPicker slot isimleri / ColorPicker slot names. */
export type ColorPickerSlot =
  | 'root'
  | 'spectrum'
  | 'spectrumThumb'
  | 'hueSlider'
  | 'alphaSlider'
  | 'input'
  | 'swatch'
  | 'swatchGrid';

// ── Types ─────────────────────────────────────────────

/** ColorPicker boyutu / ColorPicker size */
export type ColorPickerSize = 'sm' | 'md' | 'lg';

// ── Context (Compound API) ──────────────────────────

interface ColorPickerContextValue {
  size: ColorPickerSize;
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  hsv: { h: number; s: number; v: number };
  alpha: number;
  setHex: (hex: string) => void;
  setHue: (hue: number) => void;
  setSaturationValue: (s: number, v: number) => void;
  setAlpha: (alpha: number) => void;
  classNames: ClassNames<ColorPickerSlot> | undefined;
  styles: Styles<ColorPickerSlot> | undefined;
}

const ColorPickerContext = createContext<ColorPickerContextValue | null>(null);

function useColorPickerContext(): ColorPickerContextValue {
  const ctx = useContext(ColorPickerContext);
  if (!ctx) {
    throw new Error(
      'ColorPicker compound sub-components must be used within <ColorPicker>.',
    );
  }
  return ctx;
}

// ── Compound: ColorPicker.Spectrum ───────────────────

/** ColorPicker.Spectrum props */
export interface ColorPickerSpectrumProps {
  /** Ek className / Additional className */
  className?: string;
}

const ColorPickerSpectrum = forwardRef<HTMLDivElement, ColorPickerSpectrumProps>(
  function ColorPickerSpectrum(props, ref) {
    const { className } = props;
    const ctx = useColorPickerContext();
    const slot = getSlotProps(
      'spectrum',
      `${spectrumStyle} ${spectrumSizeStyles[ctx.size]}`,
      ctx.classNames,
      ctx.styles,
    );
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const thumbSlot = getSlotProps(
      'spectrumThumb',
      spectrumThumbStyle,
      ctx.classNames,
      ctx.styles,
    );

    return (
      <div
        ref={ref}
        className={cls}
        style={{
          ...slot.style,
          background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${ctx.hsv.h}, 100%, 50%))`,
        }}
        data-testid="color-picker-spectrum"
      >
        <div
          className={thumbSlot.className}
          style={{
            ...thumbSlot.style,
            left: `${ctx.hsv.s}%`,
            top: `${100 - ctx.hsv.v}%`,
          }}
          data-testid="color-picker-spectrum-thumb"
        />
      </div>
    );
  },
);

// ── Compound: ColorPicker.HueSlider ─────────────────

/** ColorPicker.HueSlider props */
export interface ColorPickerHueSliderProps {
  /** Ek className / Additional className */
  className?: string;
}

const ColorPickerHueSlider = forwardRef<HTMLDivElement, ColorPickerHueSliderProps>(
  function ColorPickerHueSlider(props, ref) {
    const { className } = props;
    const ctx = useColorPickerContext();
    const slot = getSlotProps(
      'hueSlider',
      hueSliderStyle,
      ctx.classNames,
      ctx.styles,
    );
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
      const step = e.shiftKey ? 10 : 1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        ctx.setHue(Math.min(360, ctx.hsv.h + step));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        ctx.setHue(Math.max(0, ctx.hsv.h - step));
      }
    }, [ctx]);

    return (
      <div
        ref={ref}
        className={cls}
        style={slot.style}
        data-testid="color-picker-hue-slider"
        role="slider"
        tabIndex={0}
        aria-label="Hue"
        aria-valuemin={0}
        aria-valuemax={360}
        aria-valuenow={ctx.hsv.h}
        onKeyDown={handleKeyDown}
      >
        <div
          className={sliderThumbStyle}
          style={{ left: `${(ctx.hsv.h / 360) * 100}%` }}
          data-testid="color-picker-hue-thumb"
        />
      </div>
    );
  },
);

// ── Compound: ColorPicker.AlphaSlider ───────────────

/** ColorPicker.AlphaSlider props */
export interface ColorPickerAlphaSliderProps {
  /** Ek className / Additional className */
  className?: string;
}

const ColorPickerAlphaSlider = forwardRef<HTMLDivElement, ColorPickerAlphaSliderProps>(
  function ColorPickerAlphaSlider(props, ref) {
    const { className } = props;
    const ctx = useColorPickerContext();
    const slot = getSlotProps(
      'alphaSlider',
      alphaSliderStyle,
      ctx.classNames,
      ctx.styles,
    );
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
      const step = e.shiftKey ? 0.1 : 0.01;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        ctx.setAlpha(Math.min(1, ctx.alpha + step));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        ctx.setAlpha(Math.max(0, ctx.alpha - step));
      }
    }, [ctx]);

    return (
      <div
        ref={ref}
        className={cls}
        style={slot.style}
        data-testid="color-picker-alpha-slider"
        role="slider"
        tabIndex={0}
        aria-label="Alpha"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(ctx.alpha * 100)}
        onKeyDown={handleKeyDown}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            background: `linear-gradient(to right, transparent, ${ctx.hex})`,
          }}
        />
        <div
          className={sliderThumbStyle}
          style={{ left: `${ctx.alpha * 100}%` }}
          data-testid="color-picker-alpha-thumb"
        />
      </div>
    );
  },
);

// ── Compound: ColorPicker.Input ─────────────────────

/** ColorPicker.Input props */
export interface ColorPickerInputProps {
  /** Ek className / Additional className */
  className?: string;
}

const ColorPickerInput = forwardRef<HTMLDivElement, ColorPickerInputProps>(
  function ColorPickerInput(props, ref) {
    const { className } = props;
    const ctx = useColorPickerContext();
    const slot = getSlotProps(
      'input',
      inputWrapperStyle,
      ctx.classNames,
      ctx.styles,
    );
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const swatchSlot = getSlotProps('swatch', swatchStyle, ctx.classNames, ctx.styles);

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="color-picker-input">
        <input
          type="text"
          className={hexInputStyle}
          value={ctx.hex}
          onChange={(e) => ctx.setHex(e.target.value)}
          aria-label="Hex color value"
          data-testid="color-picker-hex-input"
        />
        <div
          className={swatchSlot.className}
          style={{ ...swatchSlot.style, backgroundColor: ctx.hex }}
          data-testid="color-picker-swatch"
        />
      </div>
    );
  },
);

// ── Compound: ColorPicker.Swatch ────────────────────

/** ColorPicker.Swatch props */
export interface ColorPickerSwatchProps {
  /** Renk degeri / Color value */
  color?: string;
  /** Ek className / Additional className */
  className?: string;
}

const ColorPickerSwatch = forwardRef<HTMLDivElement, ColorPickerSwatchProps>(
  function ColorPickerSwatch(props, ref) {
    const { color, className } = props;
    const ctx = useColorPickerContext();
    const slot = getSlotProps('swatch', swatchStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const displayColor = color ?? ctx.hex;

    return (
      <div
        ref={ref}
        className={cls}
        style={{ ...slot.style, backgroundColor: displayColor }}
        data-testid="color-picker-swatch"
      />
    );
  },
);

// ── Compound: ColorPicker.Presets ───────────────────

/** ColorPicker.Presets props */
export interface ColorPickerPresetsProps {
  /** Preset renk listesi / Preset color list */
  colors: string[];
  /** Ek className / Additional className */
  className?: string;
}

const ColorPickerPresets = forwardRef<HTMLDivElement, ColorPickerPresetsProps>(
  function ColorPickerPresets(props, ref) {
    const { colors, className } = props;
    const ctx = useColorPickerContext();
    const slot = getSlotProps(
      'swatchGrid',
      swatchGridStyle,
      ctx.classNames,
      ctx.styles,
    );
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="color-picker-swatch-grid">
        {colors.map((c) => (
          <button
            key={c}
            type="button"
            className={presetSwatchStyle}
            style={{ backgroundColor: c }}
            onClick={() => ctx.setHex(c)}
            aria-label={`Select color ${c}`}
            data-testid="color-picker-preset"
          />
        ))}
      </div>
    );
  },
);

// ── Component Props ───────────────────────────────────

export interface ColorPickerComponentProps extends SlotStyleProps<ColorPickerSlot> {
  /** Controlled hex renk degeri / Controlled hex color value */
  value?: string;
  /** Renk degistiginde callback / On color change callback */
  onChange?: (hex: string, alpha: number) => void;
  /** Alpha slider goster / Show alpha slider */
  showAlpha?: boolean;
  /** Hex input goster / Show hex input */
  showInput?: boolean;
  /** Preset renkler / Preset colors */
  presets?: string[];
  /** Boyut / Size */
  size?: ColorPickerSize;
  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────

const ColorPickerBase = forwardRef<HTMLDivElement, ColorPickerComponentProps>(
  function ColorPicker(props, ref) {
    const {
      value,
      onChange,
      showAlpha = false,
      showInput = false,
      presets,
      size = 'md',
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const hookProps: UseColorPickerProps = {
      value,
      onChange,
    };
    const picker = useColorPicker(hookProps);

    // ── Slots ──
    const rootSlot = getSlotProps(
      'root',
      `${rootStyle} ${sizeStyles[size]}`,
      classNames,
      styles,
    );
    const rootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    const ctxValue: ColorPickerContextValue = {
      size,
      hex: picker.hex,
      rgb: picker.rgb,
      hsl: picker.hsl,
      hsv: picker.hsv,
      alpha: picker.alpha,
      setHex: picker.setHex,
      setHue: picker.setHue,
      setSaturationValue: picker.setSaturationValue,
      setAlpha: picker.setAlpha,
      classNames,
      styles,
    };

    // ── Compound API ──
    if (children) {
      return (
        <ColorPickerContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={rootClassName}
            style={{ ...rootSlot.style, ...styleProp }}
            data-testid="color-picker-root"
            data-size={size}
            role="application"
            aria-label="Color picker"
          >
            {children}
          </div>
        </ColorPickerContext.Provider>
      );
    }

    // ── Props-based API ──
    const spectrumSlot = getSlotProps(
      'spectrum',
      `${spectrumStyle} ${spectrumSizeStyles[size]}`,
      classNames,
      styles,
    );
    const spectrumThumbSlot = getSlotProps(
      'spectrumThumb',
      spectrumThumbStyle,
      classNames,
      styles,
    );
    const hueSliderSlot = getSlotProps(
      'hueSlider',
      hueSliderStyle,
      classNames,
      styles,
    );
    const alphaSliderSlot = getSlotProps(
      'alphaSlider',
      alphaSliderStyle,
      classNames,
      styles,
    );
    const inputSlot = getSlotProps(
      'input',
      inputWrapperStyle,
      classNames,
      styles,
    );
    const swatchSlot = getSlotProps('swatch', swatchStyle, classNames, styles);
    const swatchGridSlot = getSlotProps(
      'swatchGrid',
      swatchGridStyle,
      classNames,
      styles,
    );

    return (
      <div
        ref={ref}
        className={rootClassName}
        style={{ ...rootSlot.style, ...styleProp }}
        data-testid="color-picker-root"
        data-size={size}
        role="application"
        aria-label="Color picker"
      >
        {/* Spectrum */}
        <div
          className={spectrumSlot.className}
          style={{
            ...spectrumSlot.style,
            background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${picker.hsv.h}, 100%, 50%))`,
          }}
          data-testid="color-picker-spectrum"
        >
          <div
            className={spectrumThumbSlot.className}
            style={{
              ...spectrumThumbSlot.style,
              left: `${picker.hsv.s}%`,
              top: `${100 - picker.hsv.v}%`,
            }}
            data-testid="color-picker-spectrum-thumb"
          />
        </div>

        {/* Hue Slider */}
        <div
          className={hueSliderSlot.className}
          style={hueSliderSlot.style}
          data-testid="color-picker-hue-slider"
          role="slider"
          tabIndex={0}
          aria-label="Hue"
          aria-valuemin={0}
          aria-valuemax={360}
          aria-valuenow={picker.hsv.h}
          onKeyDown={(e) => {
            const step = e.shiftKey ? 10 : 1;
            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
              e.preventDefault();
              picker.setHue(Math.min(360, picker.hsv.h + step));
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
              e.preventDefault();
              picker.setHue(Math.max(0, picker.hsv.h - step));
            }
          }}
        >
          <div
            className={sliderThumbStyle}
            style={{ left: `${(picker.hsv.h / 360) * 100}%` }}
            data-testid="color-picker-hue-thumb"
          />
        </div>

        {/* Alpha Slider */}
        {showAlpha && (
          <div
            className={alphaSliderSlot.className}
            style={alphaSliderSlot.style}
            data-testid="color-picker-alpha-slider"
            role="slider"
            tabIndex={0}
            aria-label="Alpha"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(picker.alpha * 100)}
            onKeyDown={(e) => {
              const step = e.shiftKey ? 0.1 : 0.01;
              if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                e.preventDefault();
                picker.setAlpha(Math.min(1, picker.alpha + step));
              } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                e.preventDefault();
                picker.setAlpha(Math.max(0, picker.alpha - step));
              }
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 'inherit',
                background: `linear-gradient(to right, transparent, ${picker.hex})`,
              }}
            />
            <div
              className={sliderThumbStyle}
              style={{ left: `${picker.alpha * 100}%` }}
              data-testid="color-picker-alpha-thumb"
            />
          </div>
        )}

        {/* Input */}
        {showInput && (
          <div
            className={inputSlot.className}
            style={inputSlot.style}
            data-testid="color-picker-input"
          >
            <input
              type="text"
              className={hexInputStyle}
              value={picker.hex}
              onChange={(e) => picker.setHex(e.target.value)}
              aria-label="Hex color value"
              data-testid="color-picker-hex-input"
            />
            <div
              className={swatchSlot.className}
              style={{ ...swatchSlot.style, backgroundColor: picker.hex }}
              data-testid="color-picker-swatch"
            />
          </div>
        )}

        {/* Presets */}
        {presets !== undefined && presets.length > 0 && (
          <div
            className={swatchGridSlot.className}
            style={swatchGridSlot.style}
            data-testid="color-picker-swatch-grid"
          >
            {presets.map((c) => (
              <button
                key={c}
                type="button"
                className={presetSwatchStyle}
                style={{ backgroundColor: c }}
                onClick={() => picker.setHex(c)}
                aria-label={`Select color ${c}`}
                data-testid="color-picker-preset"
              />
            ))}
          </div>
        )}
      </div>
    );
  },
);

/**
 * ColorPicker bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <ColorPicker value="#3b82f6" onChange={(hex) => {}} showAlpha showInput />
 * ```
 *
 * @example Compound
 * ```tsx
 * <ColorPicker value="#3b82f6" onChange={(hex) => {}}>
 *   <ColorPicker.Spectrum />
 *   <ColorPicker.HueSlider />
 *   <ColorPicker.AlphaSlider />
 *   <ColorPicker.Input />
 *   <ColorPicker.Presets colors={['#ff0000', '#00ff00', '#0000ff']} />
 * </ColorPicker>
 * ```
 */
export const ColorPicker = Object.assign(ColorPickerBase, {
  Spectrum: ColorPickerSpectrum,
  HueSlider: ColorPickerHueSlider,
  AlphaSlider: ColorPickerAlphaSlider,
  Input: ColorPickerInput,
  Swatch: ColorPickerSwatch,
  Presets: ColorPickerPresets,
});

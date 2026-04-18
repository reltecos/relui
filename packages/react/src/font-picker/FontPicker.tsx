/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * FontPicker — yazi tipi secici bilesen (Dual API).
 * FontPicker — font picker component (Dual API).
 *
 * Props-based: `<FontPicker onChange={fn} />`
 * Compound:    `<FontPicker><FontPicker.FamilySelect /><FontPicker.SizeInput /><FontPicker.StyleToggle /><FontPicker.Preview /></FontPicker>`
 *
 * @packageDocumentation
 */

import { forwardRef, type ReactNode } from 'react';
import type { FontConfig } from '@relteco/relui-core';
import {
  rootStyle, familySelectStyle, sizeInputStyle, styleToggleStyle,
  styleToggleActiveStyle, previewStyle, labelStyle, controlRowStyle,
} from './font-picker.css';
import { FontPickerCtx, useFontPickerContext, type FontPickerContextValue } from './font-picker-context';
import { useFontPicker, type UseFontPickerProps } from './useFontPicker';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

export type FontPickerSlot = 'root' | 'familySelect' | 'sizeInput' | 'styleToggle' | 'weightSelect' | 'preview' | 'label';

// ── Sub: FontPicker.FamilySelect ────────────────────

export interface FontPickerFamilySelectProps { className?: string; }

export const FontPickerFamilySelect = forwardRef<HTMLSelectElement, FontPickerFamilySelectProps>(
  function FontPickerFamilySelect(props, ref) {
    const { className } = props;
    const fpCtx = useFontPickerContext();
    const slot = getSlotProps('familySelect', familySelectStyle, fpCtx.classNames, fpCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <select
        ref={ref}
        className={cls}
        style={{ ...slot.style, fontFamily: fpCtx.ctx.config.family }}
        value={fpCtx.ctx.config.family}
        onChange={(e) => fpCtx.api.send({ type: 'SET_FAMILY', family: e.target.value })}
        data-testid="font-picker-family"
        aria-label="Font family"
      >
        {fpCtx.ctx.availableFonts.map((font) => (
          <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
        ))}
      </select>
    );
  },
);

// ── Sub: FontPicker.SizeInput ───────────────────────

export interface FontPickerSizeInputProps { className?: string; }

export const FontPickerSizeInput = forwardRef<HTMLInputElement, FontPickerSizeInputProps>(
  function FontPickerSizeInput(props, ref) {
    const { className } = props;
    const fpCtx = useFontPickerContext();
    const slot = getSlotProps('sizeInput', sizeInputStyle, fpCtx.classNames, fpCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <input
        ref={ref}
        className={cls}
        style={slot.style}
        type="number"
        min={1}
        max={999}
        value={fpCtx.ctx.config.size}
        onChange={(e) => fpCtx.api.send({ type: 'SET_SIZE', size: parseInt(e.target.value, 10) || 16 })}
        data-testid="font-picker-size"
        aria-label="Font size"
      />
    );
  },
);

// ── Sub: FontPicker.StyleToggle ─────────────────────

export interface FontPickerStyleToggleProps { className?: string; }

export const FontPickerStyleToggle = forwardRef<HTMLDivElement, FontPickerStyleToggleProps>(
  function FontPickerStyleToggle(props, ref) {
    const { className } = props;
    const fpCtx = useFontPickerContext();
    const slot = getSlotProps('styleToggle', '', fpCtx.classNames, fpCtx.styles);
    const cls = className ?? '';

    const btnCls = (active: boolean) =>
      active ? `${styleToggleStyle} ${styleToggleActiveStyle}` : styleToggleStyle;

    return (
      <div ref={ref} className={`${controlRowStyle} ${slot.className} ${cls}`} style={slot.style} data-testid="font-picker-style-toggle">
        <button
          className={btnCls(fpCtx.ctx.config.bold)}
          onClick={() => fpCtx.api.send({ type: 'TOGGLE_BOLD' })}
          type="button"
          aria-pressed={fpCtx.ctx.config.bold}
          aria-label="Bold"
          data-testid="font-picker-bold"
        >
          B
        </button>
        <button
          className={btnCls(fpCtx.ctx.config.italic)}
          onClick={() => fpCtx.api.send({ type: 'TOGGLE_ITALIC' })}
          type="button"
          aria-pressed={fpCtx.ctx.config.italic}
          aria-label="Italic"
          data-testid="font-picker-italic"
          style={{ fontStyle: 'italic' }}
        >
          I
        </button>
        <button
          className={btnCls(fpCtx.ctx.config.underline)}
          onClick={() => fpCtx.api.send({ type: 'TOGGLE_UNDERLINE' })}
          type="button"
          aria-pressed={fpCtx.ctx.config.underline}
          aria-label="Underline"
          data-testid="font-picker-underline"
          style={{ textDecoration: 'underline' }}
        >
          U
        </button>
      </div>
    );
  },
);

// ── Sub: FontPicker.Preview ─────────────────────────

export interface FontPickerPreviewProps { text?: string; className?: string; }

export const FontPickerPreview = forwardRef<HTMLDivElement, FontPickerPreviewProps>(
  function FontPickerPreview(props, ref) {
    const { text = 'The quick brown fox jumps over the lazy dog', className } = props;
    const fpCtx = useFontPickerContext();
    const slot = getSlotProps('preview', previewStyle, fpCtx.classNames, fpCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const cfg = fpCtx.ctx.config;

    return (
      <div
        ref={ref}
        className={cls}
        style={{
          ...slot.style,
          fontFamily: cfg.family,
          fontSize: cfg.size,
          fontWeight: cfg.weight,
          fontStyle: cfg.italic ? 'italic' : 'normal',
          textDecoration: cfg.underline ? 'underline' : 'none',
        }}
        data-testid="font-picker-preview"
      >
        {text}
      </div>
    );
  },
);

// ── Component Props ──────────────────────────────────

export interface FontPickerComponentProps extends SlotStyleProps<FontPickerSlot> {
  /** Varsayilan yapilandirma / Default config */
  defaultConfig?: Partial<FontConfig>;
  /** Font listesi / Available fonts */
  fonts?: string[];
  /** Onizleme goster / Show preview */
  showPreview?: boolean;
  /** Degisiklik callback / On change */
  onChange?: (config: FontConfig) => void;
  /** Compound children */
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// ── Component ────────────────────────────────────────

export const FontPickerBase = forwardRef<HTMLDivElement, FontPickerComponentProps>(
  function FontPicker(props, ref) {
    const {
      defaultConfig, fonts, showPreview = true, onChange,
      children, className, style: styleProp, classNames, styles,
    } = props;

    const hookProps: UseFontPickerProps = { defaultConfig, fonts, onChange };
    const { api, ctx } = useFontPicker(hookProps);

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootCls = className ? `${rootSlot.className} ${className}` : rootSlot.className;
    const ctxValue: FontPickerContextValue = { api, ctx, classNames, styles };

    if (children) {
      return (
        <FontPickerCtx.Provider value={ctxValue}>
          <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="font-picker-root">{children}</div>
        </FontPickerCtx.Provider>
      );
    }

    const lSlot = getSlotProps('label', labelStyle, classNames, styles);

    return (
      <FontPickerCtx.Provider value={ctxValue}>
        <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="font-picker-root">
          <div>
            <div className={lSlot.className} style={lSlot.style} data-testid="font-picker-label">Font Family</div>
            <FontPickerFamilySelect />
          </div>
          <div className={controlRowStyle}>
            <div>
              <div className={lSlot.className} style={lSlot.style} data-testid="font-picker-label">Size</div>
              <FontPickerSizeInput />
            </div>
            <div>
              <div className={lSlot.className} style={lSlot.style} data-testid="font-picker-label">Style</div>
              <FontPickerStyleToggle />
            </div>
          </div>
          {showPreview && (
            <div>
              <div className={lSlot.className} style={lSlot.style} data-testid="font-picker-label">Preview</div>
              <FontPickerPreview />
            </div>
          )}
        </div>
      </FontPickerCtx.Provider>
    );
  },
);

/**
 * FontPicker bilesen — Dual API (props-based + compound).
 */
export const FontPicker = Object.assign(FontPickerBase, {
  FamilySelect: FontPickerFamilySelect,
  SizeInput: FontPickerSizeInput,
  StyleToggle: FontPickerStyleToggle,
  Preview: FontPickerPreview,
});

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * FormDesigner — form tasarimi bilesen (Dual API).
 * FormDesigner — form designer component (Dual API).
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { DesignerField, FormFieldDef } from '@relteco/relui-core';
import type { FormFieldType } from '@relteco/relui-core';
import { CloseIcon, ChevronUpIcon, ChevronDownIcon } from '@relteco/relui-icons';
import {
  rootStyle, paletteStyle, paletteItemStyle, canvasStyle, canvasFieldStyle, canvasFieldSelectedStyle,
  fieldConfigStyle, configLabelStyle, configInputStyle, moveButtonStyle, removeButtonStyle,
} from './form-designer.css';
import { useFormDesigner, type UseFormDesignerProps } from './useFormDesigner';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

export type FormDesignerSlot = 'root' | 'palette' | 'canvas' | 'fieldConfig' | 'paletteItem' | 'canvasField';

interface FormDesignerContextValue {
  fields: readonly DesignerField[]; selectedFieldId: string | null; schema: readonly FormFieldDef[];
  addField: (type: FormFieldType, label?: string) => void; removeField: (id: string) => void;
  updateField: (id: string, updates: Partial<Omit<DesignerField, 'id' | 'order'>>) => void;
  reorder: (id: string, newOrder: number) => void; selectField: (id: string | null) => void;
  classNames: ClassNames<FormDesignerSlot> | undefined; styles: Styles<FormDesignerSlot> | undefined;
}

const FormDesignerContext = createContext<FormDesignerContextValue | null>(null);
function useFormDesignerContext(): FormDesignerContextValue {
  const ctx = useContext(FormDesignerContext);
  if (!ctx) throw new Error('FormDesigner compound sub-components must be used within <FormDesigner>.');
  return ctx;
}

const FIELD_TYPES: { type: FormFieldType; label: string }[] = [
  { type: 'text', label: 'Metin' }, { type: 'number', label: 'Sayi' }, { type: 'email', label: 'E-posta' },
  { type: 'select', label: 'Secim' }, { type: 'checkbox', label: 'Onay' }, { type: 'textarea', label: 'Uzun Metin' },
];

export interface FormDesignerPaletteProps { className?: string; }
const FormDesignerPalette = forwardRef<HTMLDivElement, FormDesignerPaletteProps>(
  function FormDesignerPalette(props, ref) {
    const { className } = props;
    const ctx = useFormDesignerContext();
    const slot = getSlotProps('palette', paletteStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const piSlot = getSlotProps('paletteItem', paletteItemStyle, ctx.classNames, ctx.styles);
    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="form-designer-palette">
        {FIELD_TYPES.map((ft) => (
          <button key={ft.type} type="button" className={piSlot.className} style={piSlot.style} onClick={() => ctx.addField(ft.type, ft.label)} data-testid="form-designer-paletteItem">{ft.label}</button>
        ))}
      </div>
    );
  },
);

export interface FormDesignerCanvasProps { className?: string; }
const FormDesignerCanvas = forwardRef<HTMLDivElement, FormDesignerCanvasProps>(
  function FormDesignerCanvas(props, ref) {
    const { className } = props;
    const ctx = useFormDesignerContext();
    const slot = getSlotProps('canvas', canvasStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const cfSlot = getSlotProps('canvasField', canvasFieldStyle, ctx.classNames, ctx.styles);
    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="form-designer-canvas">
        {ctx.fields.length === 0 && <span style={{ color: 'var(--rel-color-text-secondary, #9ca3af)', fontSize: 'var(--rel-text-sm, 14px)' }}>Paletten alan ekleyin</span>}
        {ctx.fields.map((f) => {
          const isSelected = f.id === ctx.selectedFieldId;
          const fieldCls = isSelected ? `${cfSlot.className} ${canvasFieldSelectedStyle}` : cfSlot.className;
          return (
            <div key={f.id} className={fieldCls} style={cfSlot.style} onClick={() => ctx.selectField(f.id)} data-testid="form-designer-canvasField" data-selected={isSelected || undefined}>
              <button type="button" className={moveButtonStyle} onClick={(e) => { e.stopPropagation(); ctx.reorder(f.id, f.order - 1); }} aria-label="Move up"><ChevronUpIcon size={10} /></button>
              <button type="button" className={moveButtonStyle} onClick={(e) => { e.stopPropagation(); ctx.reorder(f.id, f.order + 1); }} aria-label="Move down"><ChevronDownIcon size={10} /></button>
              <span style={{ flex: 1 }}>{f.label} ({f.type})</span>
              <button type="button" className={removeButtonStyle} onClick={(e) => { e.stopPropagation(); ctx.removeField(f.id); }} aria-label="Remove" data-testid="form-designer-removeButton"><CloseIcon size={12} /></button>
            </div>
          );
        })}
      </div>
    );
  },
);

export interface FormDesignerFieldConfigProps { className?: string; }
const FormDesignerFieldConfig = forwardRef<HTMLDivElement, FormDesignerFieldConfigProps>(
  function FormDesignerFieldConfig(props, ref) {
    const { className } = props;
    const ctx = useFormDesignerContext();
    const slot = getSlotProps('fieldConfig', fieldConfigStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const selected = ctx.fields.find((f) => f.id === ctx.selectedFieldId);
    if (!selected) return <div ref={ref} className={cls} style={slot.style} data-testid="form-designer-fieldConfig"><span style={{ color: 'var(--rel-color-text-secondary, #9ca3af)' }}>Alan secin</span></div>;
    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="form-designer-fieldConfig">
        <div><span className={configLabelStyle}>Label</span><input className={configInputStyle} value={selected.label} onChange={(e) => ctx.updateField(selected.id, { label: e.target.value })} data-testid="form-designer-configLabel" /></div>
        <div><span className={configLabelStyle}>Name</span><input className={configInputStyle} value={selected.name} onChange={(e) => ctx.updateField(selected.id, { name: e.target.value })} data-testid="form-designer-configName" /></div>
        <div><span className={configLabelStyle}>Placeholder</span><input className={configInputStyle} value={selected.placeholder ?? ''} onChange={(e) => ctx.updateField(selected.id, { placeholder: e.target.value })} data-testid="form-designer-configPlaceholder" /></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><input type="checkbox" checked={selected.required ?? false} onChange={(e) => ctx.updateField(selected.id, { required: e.target.checked })} data-testid="form-designer-configRequired" /><span className={configLabelStyle}>Zorunlu</span></div>
      </div>
    );
  },
);

export interface FormDesignerComponentProps extends SlotStyleProps<FormDesignerSlot>, UseFormDesignerProps {
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const FormDesignerBase = forwardRef<HTMLDivElement, FormDesignerComponentProps>(
  function FormDesigner(props, ref) {
    const { fields: fieldsProp, onChange, children, className, style: styleProp, classNames, styles } = props;
    const designer = useFormDesigner({ fields: fieldsProp, onChange });
    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootCls = className ? `${rootSlot.className} ${className}` : rootSlot.className;

    const ctxValue: FormDesignerContextValue = {
      fields: designer.fields, selectedFieldId: designer.selectedFieldId, schema: designer.schema,
      addField: designer.addField, removeField: designer.removeField, updateField: designer.updateField,
      reorder: designer.reorder, selectField: designer.selectField, classNames, styles,
    };

    if (children) {
      return (
        <FormDesignerContext.Provider value={ctxValue}>
          <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="form-designer-root">{children}</div>
        </FormDesignerContext.Provider>
      );
    }

    return (
      <FormDesignerContext.Provider value={ctxValue}>
        <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="form-designer-root">
          <FormDesignerPalette />
          <FormDesignerCanvas />
          <FormDesignerFieldConfig />
        </div>
      </FormDesignerContext.Provider>
    );
  },
);

export const FormDesigner = Object.assign(FormDesignerBase, {
  Palette: FormDesignerPalette, Canvas: FormDesignerCanvas, FieldConfig: FormDesignerFieldConfig,
});

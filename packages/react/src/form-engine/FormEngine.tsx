/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * FormEngine — schema-driven form bilesen (Dual API).
 * FormEngine — schema-driven form component (Dual API).
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { FormFieldDef, ValidationError } from '@relteco/relui-core';
import { rootStyle, fieldStyle, labelStyle, inputStyle, errorStyle, submitButtonStyle } from './form-engine.css';
import { useFormEngine, type UseFormEngineProps } from './useFormEngine';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

export type FormEngineSlot = 'root' | 'field' | 'label' | 'input' | 'error' | 'submitButton';

interface FormEngineContextValue {
  fields: readonly FormFieldDef[]; values: Readonly<Record<string, unknown>>;
  errors: readonly ValidationError[]; touched: Readonly<Record<string, boolean>>;
  dirty: boolean; isValid: boolean; isSubmitting: boolean;
  setValue: (f: string, v: unknown) => void; setTouched: (f: string) => void;
  submit: () => void; reset: () => void;
  classNames: ClassNames<FormEngineSlot> | undefined; styles: Styles<FormEngineSlot> | undefined;
}

const FormEngineContext = createContext<FormEngineContextValue | null>(null);
function useFormEngineContext(): FormEngineContextValue {
  const ctx = useContext(FormEngineContext);
  if (!ctx) throw new Error('FormEngine compound sub-components must be used within <FormEngine>.');
  return ctx;
}

export interface FormEngineFieldProps { field: FormFieldDef; className?: string; }
const FormEngineField = forwardRef<HTMLDivElement, FormEngineFieldProps>(
  function FormEngineField(props, ref) {
    const { field, className } = props;
    const ctx = useFormEngineContext();
    const slot = getSlotProps('field', fieldStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const lbSlot = getSlotProps('label', labelStyle, ctx.classNames, ctx.styles);
    const inSlot = getSlotProps('input', inputStyle, ctx.classNames, ctx.styles);
    const erSlot = getSlotProps('error', errorStyle, ctx.classNames, ctx.styles);
    const value = ctx.values[field.name] ?? '';
    const fieldError = ctx.errors.find((e) => e.field === field.name);
    const isTouched = ctx.touched[field.name];

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="form-engine-field">
        <label className={lbSlot.className} style={lbSlot.style} data-testid="form-engine-label">
          {field.label}{field.required && <span style={{ color: 'var(--rel-color-error, #ef4444)' }}> *</span>}
        </label>
        {field.type === 'checkbox' ? (
          <input type="checkbox" checked={!!value} onChange={(e) => ctx.setValue(field.name, e.target.checked)} onBlur={() => ctx.setTouched(field.name)} data-testid="form-engine-input" />
        ) : field.type === 'select' ? (
          <select className={inSlot.className} style={inSlot.style} value={String(value)} onChange={(e) => ctx.setValue(field.name, e.target.value)} onBlur={() => ctx.setTouched(field.name)} data-testid="form-engine-input">
            <option value="">{field.placeholder ?? 'Secin...'}</option>
            {field.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        ) : field.type === 'textarea' ? (
          <textarea className={inSlot.className} style={inSlot.style} value={String(value)} placeholder={field.placeholder} onChange={(e) => ctx.setValue(field.name, e.target.value)} onBlur={() => ctx.setTouched(field.name)} rows={3} data-testid="form-engine-input" />
        ) : (
          <input type={field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : 'text'} className={inSlot.className} style={inSlot.style} value={String(value)} placeholder={field.placeholder} onChange={(e) => ctx.setValue(field.name, field.type === 'number' ? Number(e.target.value) : e.target.value)} onBlur={() => ctx.setTouched(field.name)} data-testid="form-engine-input" />
        )}
        {isTouched && fieldError && <span className={erSlot.className} style={erSlot.style} data-testid="form-engine-error">{fieldError.message}</span>}
      </div>
    );
  },
);

export interface FormEngineSubmitButtonProps { children?: ReactNode; className?: string; }
const FormEngineSubmitButton = forwardRef<HTMLButtonElement, FormEngineSubmitButtonProps>(
  function FormEngineSubmitButton(props, ref) {
    const { children = 'Gonder', className } = props;
    const ctx = useFormEngineContext();
    const slot = getSlotProps('submitButton', submitButtonStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return (
      <button ref={ref} type="button" className={cls} style={slot.style} onClick={ctx.submit} disabled={ctx.isSubmitting} data-testid="form-engine-submitButton">
        {ctx.isSubmitting ? 'Gonderiliyor...' : children}
      </button>
    );
  },
);

export interface FormEngineComponentProps extends SlotStyleProps<FormEngineSlot>, UseFormEngineProps {
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const FormEngineBase = forwardRef<HTMLFormElement, FormEngineComponentProps>(
  function FormEngine(props, ref) {
    const { fields: fieldsDef, onSubmit, onChange, children, className, style: styleProp, classNames, styles } = props;
    const form = useFormEngine({ fields: fieldsDef, onSubmit, onChange });
    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootCls = className ? `${rootSlot.className} ${className}` : rootSlot.className;

    const ctxValue: FormEngineContextValue = {
      fields: form.fields, values: form.values, errors: form.errors, touched: form.touched,
      dirty: form.dirty, isValid: form.isValid, isSubmitting: form.isSubmitting,
      setValue: form.setValue, setTouched: form.setTouched, submit: form.submit, reset: form.reset,
      classNames, styles,
    };

    if (children) {
      return (
        <FormEngineContext.Provider value={ctxValue}>
          <form ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} onSubmit={(e) => { e.preventDefault(); form.submit(); }} data-testid="form-engine-root">{children}</form>
        </FormEngineContext.Provider>
      );
    }

    return (
      <FormEngineContext.Provider value={ctxValue}>
        <form ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} onSubmit={(e) => { e.preventDefault(); form.submit(); }} data-testid="form-engine-root">
          {form.fields.map((f) => <FormEngineField key={f.name} field={f} />)}
          <FormEngineSubmitButton />
        </form>
      </FormEngineContext.Provider>
    );
  },
);

export const FormEngine = Object.assign(FormEngineBase, {
  Field: FormEngineField, SubmitButton: FormEngineSubmitButton,
});

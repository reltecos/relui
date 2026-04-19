/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {
  FormEngineConfig, FormEngineContext, FormEngineEvent, FormEngineAPI,
  FormFieldDef, ValidationError,
} from './form-engine.types';

function validateField(field: FormFieldDef, value: unknown): string | null {
  const strVal = String(value ?? '');

  if (field.required) {
    if (value === undefined || value === null || value === '' || value === false) {
      return `${field.label} zorunlu`;
    }
  }

  if (field.type === 'number' && value !== '' && value !== undefined) {
    const num = Number(value);
    if (isNaN(num)) return `${field.label} gecerli bir sayi olmali`;
    if (field.min !== undefined && num < field.min) return `${field.label} en az ${field.min} olmali`;
    if (field.max !== undefined && num > field.max) return `${field.label} en fazla ${field.max} olmali`;
  }

  if (field.type === 'text' || field.type === 'email' || field.type === 'textarea') {
    if (field.min !== undefined && strVal.length < field.min) return `${field.label} en az ${field.min} karakter olmali`;
    if (field.max !== undefined && strVal.length > field.max) return `${field.label} en fazla ${field.max} karakter olmali`;
  }

  if (field.type === 'email' && strVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strVal)) {
    return `${field.label} gecerli bir e-posta olmali`;
  }

  if (field.pattern && strVal) {
    const re = new RegExp(field.pattern);
    if (!re.test(strVal)) return `${field.label} formatı uygun degil`;
  }

  if (field.customValidate) {
    return field.customValidate(value);
  }

  return null;
}

function validateAll(fields: readonly FormFieldDef[], values: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = [];
  for (const f of fields) {
    const msg = validateField(f, values[f.name]);
    if (msg) errors.push({ field: f.name, message: msg });
  }
  return errors;
}

export function createFormEngine(config: FormEngineConfig = {}): FormEngineAPI {
  let fields: FormFieldDef[] = config.fields ? [...config.fields] : [];
  const values: Record<string, unknown> = {};
  const touched: Record<string, boolean> = {};
  let errors: ValidationError[] = [];
  let dirty = false;
  let isSubmitting = false;

  // Init defaults
  for (const f of fields) {
    if (f.defaultValue !== undefined) values[f.name] = f.defaultValue;
  }

  const listeners = new Set<() => void>();
  function notify(): void { listeners.forEach((fn) => fn()); }

  function send(event: FormEngineEvent): void {
    switch (event.type) {
      case 'SET_VALUE': {
        values[event.field] = event.value;
        dirty = true;
        config.onChange?.({ ...values });
        // Validate touched field
        const fieldDef = fields.find((f) => f.name === event.field);
        if (fieldDef && touched[event.field]) {
          errors = errors.filter((e) => e.field !== event.field);
          const msg = validateField(fieldDef, event.value);
          if (msg) errors.push({ field: event.field, message: msg });
        }
        notify(); break;
      }
      case 'SET_TOUCHED': {
        touched[event.field] = true;
        const fieldDef = fields.find((f) => f.name === event.field);
        if (fieldDef) {
          errors = errors.filter((e) => e.field !== event.field);
          const msg = validateField(fieldDef, values[event.field]);
          if (msg) errors.push({ field: event.field, message: msg });
        }
        notify(); break;
      }
      case 'VALIDATE': {
        errors = validateAll(fields, values);
        notify(); break;
      }
      case 'SUBMIT': {
        for (const f of fields) touched[f.name] = true;
        errors = validateAll(fields, values);
        if (errors.length === 0) {
          isSubmitting = true;
          notify();
          const result = config.onSubmit?.({ ...values });
          if (result instanceof Promise) {
            result.finally(() => { isSubmitting = false; notify(); });
          } else {
            isSubmitting = false;
            notify();
          }
        } else {
          notify();
        }
        break;
      }
      case 'RESET': {
        for (const key of Object.keys(values)) delete values[key];
        for (const key of Object.keys(touched)) delete touched[key];
        for (const f of fields) { if (f.defaultValue !== undefined) values[f.name] = f.defaultValue; }
        errors = [];
        dirty = false;
        isSubmitting = false;
        notify(); break;
      }
      case 'SET_SCHEMA': {
        fields = [...event.fields];
        for (const key of Object.keys(values)) delete values[key];
        for (const key of Object.keys(touched)) delete touched[key];
        for (const f of fields) { if (f.defaultValue !== undefined) values[f.name] = f.defaultValue; }
        errors = [];
        dirty = false;
        notify(); break;
      }
    }
  }

  return {
    getContext(): FormEngineContext {
      return {
        fields, values: { ...values }, errors, touched: { ...touched },
        dirty, isValid: errors.length === 0, isSubmitting,
      };
    },
    send,
    subscribe(cb) { listeners.add(cb); return () => { listeners.delete(cb); }; },
    destroy() { listeners.clear(); },
  };
}

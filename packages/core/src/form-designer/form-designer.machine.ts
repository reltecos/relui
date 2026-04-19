/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { FormFieldDef } from '../form-engine/form-engine.types';
import type {
  FormDesignerConfig, FormDesignerContext, FormDesignerEvent, FormDesignerAPI, DesignerField,
} from './form-designer.types';

let idCounter = 0;
export function resetDesignerIdCounter(): void { idCounter = 0; }

function toSchema(fields: readonly DesignerField[]): FormFieldDef[] {
  return [...fields].sort((a, b) => a.order - b.order).map(({ id: _id, order: _order, ...rest }) => rest);
}

export function createFormDesigner(config: FormDesignerConfig = {}): FormDesignerAPI {
  let fields: DesignerField[] = config.fields ? [...config.fields] : [];
  let selectedFieldId: string | null = null;

  const listeners = new Set<() => void>();
  function notify(): void { config.onChange?.([...fields]); listeners.forEach((fn) => fn()); }

  function send(event: FormDesignerEvent): void {
    switch (event.type) {
      case 'ADD_FIELD': {
        const id = `field-${++idCounter}`;
        const order = fields.length;
        const name = `${event.fieldType}_${id}`;
        const label = event.label ?? `${event.fieldType} field`;
        fields = [...fields, { id, order, name, type: event.fieldType, label }];
        selectedFieldId = id;
        notify(); break;
      }
      case 'REMOVE_FIELD': {
        fields = fields.filter((f) => f.id !== event.id);
        fields = fields.map((f, i) => ({ ...f, order: i }));
        if (selectedFieldId === event.id) selectedFieldId = null;
        notify(); break;
      }
      case 'UPDATE_FIELD': {
        const idx = fields.findIndex((f) => f.id === event.id);
        if (idx === -1) return;
        const current = fields[idx];
        if (!current) return;
        fields = [...fields];
        fields[idx] = { ...current, ...event.updates };
        notify(); break;
      }
      case 'REORDER': {
        const idx = fields.findIndex((f) => f.id === event.id);
        if (idx === -1) return;
        const field = fields[idx];
        if (!field) return;
        const newOrder = Math.max(0, Math.min(fields.length - 1, event.newOrder));
        const reordered = fields.filter((f) => f.id !== event.id);
        reordered.splice(newOrder, 0, field);
        fields = reordered.map((f, i) => ({ ...f, order: i }));
        notify(); break;
      }
      case 'SELECT_FIELD': {
        if (event.id === selectedFieldId) return;
        selectedFieldId = event.id;
        notify(); break;
      }
      case 'SET_FIELDS': {
        fields = [...event.fields];
        notify(); break;
      }
    }
  }

  return {
    getContext(): FormDesignerContext {
      return { fields: [...fields].sort((a, b) => a.order - b.order), selectedFieldId, schema: toSchema(fields), fieldCount: fields.length };
    },
    send,
    subscribe(cb) { listeners.add(cb); return () => { listeners.delete(cb); }; },
    destroy() { listeners.clear(); },
  };
}

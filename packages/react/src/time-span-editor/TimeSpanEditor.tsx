/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * TimeSpanEditor — sure girisi bilesen (Dual API).
 * TimeSpanEditor — time span input component (Dual API).
 *
 * Props-based: `<TimeSpanEditor onChange={fn} />`
 * Compound:    `<TimeSpanEditor><TimeSpanEditor.Field field="hours" /></TimeSpanEditor>`
 *
 * @packageDocumentation
 */

import { forwardRef, useCallback, type ReactNode } from 'react';
import type { TimeSpanField } from '@relteco/relui-core';
import { ChevronUpIcon, ChevronDownIcon } from '@relteco/relui-icons';
import {
  rootStyle, fieldStyle, labelStyle, inputStyle, buttonStyle, separatorStyle,
} from './time-span-editor.css';
import { TimeSpanEditorCtx, useTimeSpanEditorContext, type TimeSpanEditorContextValue } from './time-span-editor-context';
import { useTimeSpanEditor, type UseTimeSpanEditorProps } from './useTimeSpanEditor';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

export type TimeSpanEditorSlot = 'root' | 'field' | 'label' | 'input' | 'incrementButton' | 'decrementButton';

// ── Sub: TimeSpanEditor.Field ───────────────────────

export interface TimeSpanEditorFieldProps {
  field: TimeSpanField;
  className?: string;
}

export const TimeSpanEditorField = forwardRef<HTMLDivElement, TimeSpanEditorFieldProps>(
  function TimeSpanEditorField(props, ref) {
    const { field, className } = props;
    const tsCtx = useTimeSpanEditorContext();
    const fSlot = getSlotProps('field', fieldStyle, tsCtx.classNames, tsCtx.styles);
    const cls = className ? `${fSlot.className} ${className}` : fSlot.className;

    const value = field === 'hours' ? tsCtx.ctx.hours : field === 'minutes' ? tsCtx.ctx.minutes : tsCtx.ctx.seconds;

    return (
      <div ref={ref} className={cls} style={fSlot.style} data-testid="time-span-field" data-field={field}>
        <FieldButton field={field} direction="up" tsCtx={tsCtx} />
        <FieldInput field={field} value={value} tsCtx={tsCtx} />
        <FieldButton field={field} direction="down" tsCtx={tsCtx} />
        <FieldLabel field={field} tsCtx={tsCtx} />
      </div>
    );
  },
);

// ── Internal: FieldInput ────────────────────────────

function FieldInput({ field, value, tsCtx }: { field: TimeSpanField; value: number; tsCtx: TimeSpanEditorContextValue }) {
  const iSlot = getSlotProps('input', inputStyle, tsCtx.classNames, tsCtx.styles);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(e.target.value, 10);
    if (!Number.isNaN(num)) {
      tsCtx.api.send({ type: 'SET_FIELD', field, value: num });
    }
  }, [tsCtx.api, field]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') { e.preventDefault(); tsCtx.api.send({ type: 'INCREMENT', field }); }
    if (e.key === 'ArrowDown') { e.preventDefault(); tsCtx.api.send({ type: 'DECREMENT', field }); }
  }, [tsCtx.api, field]);

  return (
    <input
      className={iSlot.className}
      style={iSlot.style}
      type="text"
      inputMode="numeric"
      value={String(value).padStart(2, '0')}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      data-testid="time-span-input"
      aria-label={field}
    />
  );
}

// ── Internal: FieldButton ───────────────────────────

function FieldButton({ field, direction, tsCtx }: { field: TimeSpanField; direction: 'up' | 'down'; tsCtx: TimeSpanEditorContextValue }) {
  const slotName = direction === 'up' ? 'incrementButton' as const : 'decrementButton' as const;
  const bSlot = getSlotProps(slotName, buttonStyle, tsCtx.classNames, tsCtx.styles);

  return (
    <button
      className={bSlot.className}
      style={bSlot.style}
      onClick={() => tsCtx.api.send({ type: direction === 'up' ? 'INCREMENT' : 'DECREMENT', field })}
      type="button"
      data-testid={direction === 'up' ? 'time-span-increment' : 'time-span-decrement'}
      aria-label={`${direction === 'up' ? 'Increment' : 'Decrement'} ${field}`}
    >
      {direction === 'up' ? <ChevronUpIcon size={12} /> : <ChevronDownIcon size={12} />}
    </button>
  );
}

// ── Internal: FieldLabel ────────────────────────────

function FieldLabel({ field, tsCtx }: { field: TimeSpanField; tsCtx: TimeSpanEditorContextValue }) {
  const lSlot = getSlotProps('label', labelStyle, tsCtx.classNames, tsCtx.styles);
  const labels: Record<TimeSpanField, string> = { hours: 'hrs', minutes: 'min', seconds: 'sec' };
  return <span className={lSlot.className} style={lSlot.style} data-testid="time-span-label">{labels[field]}</span>;
}

// ── Sub: TimeSpanEditor.IncrementButton ─────────────

export interface TimeSpanEditorIncrementButtonProps { field: TimeSpanField; className?: string; }

export const TimeSpanEditorIncrementButton = forwardRef<HTMLButtonElement, TimeSpanEditorIncrementButtonProps>(
  function TimeSpanEditorIncrementButton(props, ref) {
    const { field, className } = props;
    const tsCtx = useTimeSpanEditorContext();
    const slot = getSlotProps('incrementButton', buttonStyle, tsCtx.classNames, tsCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return (
      <button ref={ref} className={cls} style={slot.style} onClick={() => tsCtx.api.send({ type: 'INCREMENT', field })} type="button" data-testid="time-span-increment" aria-label={`Increment ${field}`}>
        <ChevronUpIcon size={12} />
      </button>
    );
  },
);

// ── Sub: TimeSpanEditor.DecrementButton ─────────────

export interface TimeSpanEditorDecrementButtonProps { field: TimeSpanField; className?: string; }

export const TimeSpanEditorDecrementButton = forwardRef<HTMLButtonElement, TimeSpanEditorDecrementButtonProps>(
  function TimeSpanEditorDecrementButton(props, ref) {
    const { field, className } = props;
    const tsCtx = useTimeSpanEditorContext();
    const slot = getSlotProps('decrementButton', buttonStyle, tsCtx.classNames, tsCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return (
      <button ref={ref} className={cls} style={slot.style} onClick={() => tsCtx.api.send({ type: 'DECREMENT', field })} type="button" data-testid="time-span-decrement" aria-label={`Decrement ${field}`}>
        <ChevronDownIcon size={12} />
      </button>
    );
  },
);

// ── Component Props ──────────────────────────────────

export interface TimeSpanEditorComponentProps extends SlotStyleProps<TimeSpanEditorSlot> {
  defaultHours?: number;
  defaultMinutes?: number;
  defaultSeconds?: number;
  showSeconds?: boolean;
  min?: number;
  max?: number;
  onChange?: (totalSeconds: number) => void;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// ── Component ────────────────────────────────────────

export const TimeSpanEditorBase = forwardRef<HTMLDivElement, TimeSpanEditorComponentProps>(
  function TimeSpanEditor(props, ref) {
    const {
      defaultHours, defaultMinutes, defaultSeconds,
      showSeconds = true, min, max, onChange,
      children, className, style: styleProp, classNames, styles,
    } = props;

    const hookProps: UseTimeSpanEditorProps = { defaultHours, defaultMinutes, defaultSeconds, min, max, onChange };
    const { api, ctx } = useTimeSpanEditor(hookProps);

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootCls = className ? `${rootSlot.className} ${className}` : rootSlot.className;
    const ctxValue: TimeSpanEditorContextValue = { api, ctx, showSeconds, classNames, styles };

    if (children) {
      return (
        <TimeSpanEditorCtx.Provider value={ctxValue}>
          <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="time-span-root" role="group" aria-label="Time span editor">{children}</div>
        </TimeSpanEditorCtx.Provider>
      );
    }

    return (
      <TimeSpanEditorCtx.Provider value={ctxValue}>
        <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="time-span-root" role="group" aria-label="Time span editor">
          <TimeSpanEditorField field="hours" />
          <span className={separatorStyle}>:</span>
          <TimeSpanEditorField field="minutes" />
          {showSeconds && (
            <>
              <span className={separatorStyle}>:</span>
              <TimeSpanEditorField field="seconds" />
            </>
          )}
        </div>
      </TimeSpanEditorCtx.Provider>
    );
  },
);

/**
 * TimeSpanEditor bilesen — Dual API (props-based + compound).
 */
export const TimeSpanEditor = Object.assign(TimeSpanEditorBase, {
  Field: TimeSpanEditorField,
  IncrementButton: TimeSpanEditorIncrementButton,
  DecrementButton: TimeSpanEditorDecrementButton,
});

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Calculator — gomulubilir hesap makinesi bilesen (Dual API).
 * Calculator — embeddable calculator component (Dual API).
 *
 * Props-based: `<Calculator onResult={fn} />`
 * Compound:    `<Calculator><Calculator.Display /><Calculator.Keypad /></Calculator>`
 *
 * @packageDocumentation
 */

import { forwardRef, type ReactNode } from 'react';
import {
  rootStyle, displayStyle, expressionStyle, displayValueStyle,
  keypadStyle, keyStyle, operatorKeyStyle, equalsKeyStyle, memoryKeyStyle,
  historyStyle, historyItemStyle,
} from './calculator.css';
import { CalculatorCtx, useCalculatorContext, type CalculatorContextValue } from './calculator-context';
import { useCalculator, type UseCalculatorProps } from './useCalculator';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

export type CalculatorSlot = 'root' | 'display' | 'expression' | 'keypad' | 'key' | 'memoryKey' | 'history';

// ── Sub: Calculator.Display ─────────────────────────

export interface CalculatorDisplayProps { className?: string; }

export const CalculatorDisplay = forwardRef<HTMLDivElement, CalculatorDisplayProps>(
  function CalculatorDisplay(props, ref) {
    const { className } = props;
    const cCtx = useCalculatorContext();
    const slot = getSlotProps('display', displayStyle, cCtx.classNames, cCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const exSlot = getSlotProps('expression', expressionStyle, cCtx.classNames, cCtx.styles);

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="calculator-display">
        <div className={exSlot.className} style={exSlot.style} data-testid="calculator-expression">
          {cCtx.ctx.expression}
        </div>
        <div className={displayValueStyle} data-testid="calculator-display-value">
          {cCtx.ctx.display}
        </div>
      </div>
    );
  },
);

// ── Sub: Calculator.Keypad ──────────────────────────

export interface CalculatorKeypadProps { className?: string; }

export const CalculatorKeypad = forwardRef<HTMLDivElement, CalculatorKeypadProps>(
  function CalculatorKeypad(props, ref) {
    const { className } = props;
    const cCtx = useCalculatorContext();
    const slot = getSlotProps('keypad', keypadStyle, cCtx.classNames, cCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const kSlot = getSlotProps('key', keyStyle, cCtx.classNames, cCtx.styles);
    const mSlot = getSlotProps('memoryKey', memoryKeyStyle, cCtx.classNames, cCtx.styles);

    const send = cCtx.api.send.bind(cCtx.api);

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="calculator-keypad" role="group" aria-label="Calculator keys">
        {/* Memory row */}
        <button className={mSlot.className} style={mSlot.style} onClick={() => send({ type: 'MEMORY_CLEAR' })} type="button" data-testid="calculator-key" aria-label="Memory Clear">MC</button>
        <button className={mSlot.className} style={mSlot.style} onClick={() => send({ type: 'MEMORY_RECALL' })} type="button" data-testid="calculator-key" aria-label="Memory Recall">MR</button>
        <button className={mSlot.className} style={mSlot.style} onClick={() => send({ type: 'MEMORY_ADD' })} type="button" data-testid="calculator-key" aria-label="Memory Add">M+</button>
        <button className={mSlot.className} style={mSlot.style} onClick={() => send({ type: 'MEMORY_SUBTRACT' })} type="button" data-testid="calculator-key" aria-label="Memory Subtract">M-</button>

        {/* Function row */}
        <button className={kSlot.className} style={kSlot.style} onClick={() => send({ type: 'CLEAR' })} type="button" data-testid="calculator-key" aria-label="Clear">C</button>
        <button className={kSlot.className} style={kSlot.style} onClick={() => send({ type: 'CLEAR_ENTRY' })} type="button" data-testid="calculator-key" aria-label="Clear Entry">CE</button>
        <button className={kSlot.className} style={kSlot.style} onClick={() => send({ type: 'BACKSPACE' })} type="button" data-testid="calculator-key" aria-label="Backspace">&larr;</button>
        <button className={`${kSlot.className} ${operatorKeyStyle}`} style={kSlot.style} onClick={() => send({ type: 'OPERATOR', operator: '/' })} type="button" data-testid="calculator-key" aria-label="Divide">&divide;</button>

        {/* Number rows */}
        {['7','8','9'].map((d) => (
          <button key={d} className={kSlot.className} style={kSlot.style} onClick={() => send({ type: 'DIGIT', digit: d })} type="button" data-testid="calculator-key">{d}</button>
        ))}
        <button className={`${kSlot.className} ${operatorKeyStyle}`} style={kSlot.style} onClick={() => send({ type: 'OPERATOR', operator: '*' })} type="button" data-testid="calculator-key" aria-label="Multiply">&times;</button>

        {['4','5','6'].map((d) => (
          <button key={d} className={kSlot.className} style={kSlot.style} onClick={() => send({ type: 'DIGIT', digit: d })} type="button" data-testid="calculator-key">{d}</button>
        ))}
        <button className={`${kSlot.className} ${operatorKeyStyle}`} style={kSlot.style} onClick={() => send({ type: 'OPERATOR', operator: '-' })} type="button" data-testid="calculator-key" aria-label="Subtract">&minus;</button>

        {['1','2','3'].map((d) => (
          <button key={d} className={kSlot.className} style={kSlot.style} onClick={() => send({ type: 'DIGIT', digit: d })} type="button" data-testid="calculator-key">{d}</button>
        ))}
        <button className={`${kSlot.className} ${operatorKeyStyle}`} style={kSlot.style} onClick={() => send({ type: 'OPERATOR', operator: '+' })} type="button" data-testid="calculator-key" aria-label="Add">+</button>

        <button className={kSlot.className} style={kSlot.style} onClick={() => send({ type: 'NEGATE' })} type="button" data-testid="calculator-key" aria-label="Negate">&plusmn;</button>
        <button className={kSlot.className} style={kSlot.style} onClick={() => send({ type: 'DIGIT', digit: '0' })} type="button" data-testid="calculator-key">0</button>
        <button className={kSlot.className} style={kSlot.style} onClick={() => send({ type: 'DECIMAL' })} type="button" data-testid="calculator-key" aria-label="Decimal">.</button>
        <button className={`${kSlot.className} ${equalsKeyStyle}`} style={kSlot.style} onClick={() => send({ type: 'EQUALS' })} type="button" data-testid="calculator-key" aria-label="Equals">=</button>
      </div>
    );
  },
);

// ── Sub: Calculator.Key ─────────────────────────────

export interface CalculatorKeyProps { children?: ReactNode; className?: string; }

export const CalculatorKey = forwardRef<HTMLButtonElement, CalculatorKeyProps>(
  function CalculatorKey(props, ref) {
    const { children, className } = props;
    const cCtx = useCalculatorContext();
    const slot = getSlotProps('key', keyStyle, cCtx.classNames, cCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return <button ref={ref} className={cls} style={slot.style} type="button" data-testid="calculator-key">{children}</button>;
  },
);

// ── Sub: Calculator.History ─────────────────────────

export interface CalculatorHistoryProps { className?: string; }

export const CalculatorHistory = forwardRef<HTMLDivElement, CalculatorHistoryProps>(
  function CalculatorHistory(props, ref) {
    const { className } = props;
    const cCtx = useCalculatorContext();
    const slot = getSlotProps('history', historyStyle, cCtx.classNames, cCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    if (cCtx.ctx.history.length === 0) return null;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="calculator-history" role="log" aria-label="Calculation history">
        {cCtx.ctx.history.map((entry, i) => (
          <div key={i} className={historyItemStyle} data-testid="calculator-history-item">{entry}</div>
        ))}
      </div>
    );
  },
);

// ── Component Props ──────────────────────────────────

export interface CalculatorComponentProps extends SlotStyleProps<CalculatorSlot> {
  /** Sonuc hassasiyeti / Result precision */
  precision?: number;
  /** Gecmis goster / Show history */
  showHistory?: boolean;
  /** Sonuc callback / On result callback */
  onResult?: (result: number) => void;
  /** Compound children */
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// ── Component ────────────────────────────────────────

export const CalculatorBase = forwardRef<HTMLDivElement, CalculatorComponentProps>(
  function Calculator(props, ref) {
    const {
      precision, showHistory = false, onResult,
      children, className, style: styleProp, classNames, styles,
    } = props;

    const hookProps: UseCalculatorProps = { precision, onResult };
    const { api, ctx, handleKeyboard } = useCalculator(hookProps);

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootCls = className ? `${rootSlot.className} ${className}` : rootSlot.className;
    const ctxValue: CalculatorContextValue = { api, ctx, classNames, styles };

    if (children) {
      return (
        <CalculatorCtx.Provider value={ctxValue}>
          <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="calculator-root" tabIndex={0} onKeyDown={handleKeyboard} role="application" aria-label="Calculator">
            {children}
          </div>
        </CalculatorCtx.Provider>
      );
    }

    return (
      <CalculatorCtx.Provider value={ctxValue}>
        <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="calculator-root" tabIndex={0} onKeyDown={handleKeyboard} role="application" aria-label="Calculator">
          <CalculatorDisplay />
          <CalculatorKeypad />
          {showHistory && <CalculatorHistory />}
        </div>
      </CalculatorCtx.Provider>
    );
  },
);

/**
 * Calculator bilesen — Dual API (props-based + compound).
 */
export const Calculator = Object.assign(CalculatorBase, {
  Display: CalculatorDisplay,
  Keypad: CalculatorKeypad,
  Key: CalculatorKey,
  History: CalculatorHistory,
});

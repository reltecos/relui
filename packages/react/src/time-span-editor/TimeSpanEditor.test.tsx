/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { TimeSpanEditor } from './TimeSpanEditor';

describe('TimeSpanEditor', () => {
  // ── Root ──

  it('root render edilir', () => {
    render(<TimeSpanEditor />);
    expect(screen.getByTestId('time-span-root')).toBeInTheDocument();
  });

  it('role group ve aria-label set edilir', () => {
    render(<TimeSpanEditor />);
    expect(screen.getByTestId('time-span-root')).toHaveAttribute('role', 'group');
  });

  // ── Fields ──

  it('3 field render edilir (hours, minutes, seconds)', () => {
    render(<TimeSpanEditor />);
    expect(screen.getAllByTestId('time-span-field')).toHaveLength(3);
  });

  it('showSeconds false ile 2 field render edilir', () => {
    render(<TimeSpanEditor showSeconds={false} />);
    expect(screen.getAllByTestId('time-span-field')).toHaveLength(2);
  });

  it('input lar 00 ile baslar', () => {
    render(<TimeSpanEditor />);
    const inputs = screen.getAllByTestId('time-span-input');
    expect(inputs[0]).toHaveValue('00');
  });

  it('default degerler gosterilir', () => {
    render(<TimeSpanEditor defaultHours={2} defaultMinutes={30} defaultSeconds={15} />);
    const inputs = screen.getAllByTestId('time-span-input');
    expect(inputs[0]).toHaveValue('02');
    expect(inputs[1]).toHaveValue('30');
    expect(inputs[2]).toHaveValue('15');
  });

  // ── Increment/Decrement ──

  it('increment butonu tiklaninca deger artar', () => {
    render(<TimeSpanEditor />);
    const increments = screen.getAllByTestId('time-span-increment');
    fireEvent.click(increments[2]); // seconds increment
    const inputs = screen.getAllByTestId('time-span-input');
    expect(inputs[2]).toHaveValue('01');
  });

  it('decrement butonu tiklaninca deger azalir', () => {
    render(<TimeSpanEditor defaultMinutes={5} />);
    const decrements = screen.getAllByTestId('time-span-decrement');
    fireEvent.click(decrements[1]); // minutes decrement
    const inputs = screen.getAllByTestId('time-span-input');
    expect(inputs[1]).toHaveValue('04');
  });

  it('increment ve decrement butonlari her field de var', () => {
    render(<TimeSpanEditor />);
    expect(screen.getAllByTestId('time-span-increment')).toHaveLength(3);
    expect(screen.getAllByTestId('time-span-decrement')).toHaveLength(3);
  });

  // ── Input ──

  it('input a deger girilir', () => {
    render(<TimeSpanEditor />);
    const inputs = screen.getAllByTestId('time-span-input');
    fireEvent.change(inputs[0], { target: { value: '5' } });
    expect(inputs[0]).toHaveValue('05');
  });

  // ── Keyboard ──

  it('ArrowUp ile deger artar', () => {
    render(<TimeSpanEditor />);
    const inputs = screen.getAllByTestId('time-span-input');
    fireEvent.keyDown(inputs[0], { key: 'ArrowUp' });
    expect(inputs[0]).toHaveValue('01');
  });

  it('ArrowDown ile deger azalir', () => {
    render(<TimeSpanEditor defaultHours={3} />);
    const inputs = screen.getAllByTestId('time-span-input');
    fireEvent.keyDown(inputs[0], { key: 'ArrowDown' });
    expect(inputs[0]).toHaveValue('02');
  });

  // ── Labels ──

  it('label lar gosterilir (hrs, min, sec)', () => {
    render(<TimeSpanEditor />);
    const labels = screen.getAllByTestId('time-span-label');
    expect(labels[0]).toHaveTextContent('hrs');
    expect(labels[1]).toHaveTextContent('min');
    expect(labels[2]).toHaveTextContent('sec');
  });

  // ── Callback ──

  it('onChange callback cagrilir', () => {
    const onChange = vi.fn();
    render(<TimeSpanEditor onChange={onChange} />);
    fireEvent.click(screen.getAllByTestId('time-span-increment')[0]);
    expect(onChange).toHaveBeenCalledWith(3600);
  });

  // ── className & style ──

  it('className root elemana eklenir', () => {
    render(<TimeSpanEditor className="my-ts" />);
    expect(screen.getByTestId('time-span-root').className).toContain('my-ts');
  });

  it('style root elemana eklenir', () => {
    render(<TimeSpanEditor style={{ padding: '8px' }} />);
    expect(screen.getByTestId('time-span-root')).toHaveStyle({ padding: '8px' });
  });

  // ── Slot API: classNames ──

  it('classNames.root root elemana eklenir', () => {
    render(<TimeSpanEditor classNames={{ root: 'custom-root' }} />);
    expect(screen.getByTestId('time-span-root').className).toContain('custom-root');
  });

  it('classNames.field field elemana eklenir', () => {
    render(<TimeSpanEditor classNames={{ field: 'custom-field' }} />);
    expect(screen.getAllByTestId('time-span-field')[0].className).toContain('custom-field');
  });

  it('classNames.input input elemana eklenir', () => {
    render(<TimeSpanEditor classNames={{ input: 'custom-input' }} />);
    expect(screen.getAllByTestId('time-span-input')[0].className).toContain('custom-input');
  });

  it('classNames.label label elemana eklenir', () => {
    render(<TimeSpanEditor classNames={{ label: 'custom-label' }} />);
    expect(screen.getAllByTestId('time-span-label')[0].className).toContain('custom-label');
  });

  it('classNames.incrementButton increment elemana eklenir', () => {
    render(<TimeSpanEditor classNames={{ incrementButton: 'custom-inc' }} />);
    expect(screen.getAllByTestId('time-span-increment')[0].className).toContain('custom-inc');
  });

  it('classNames.decrementButton decrement elemana eklenir', () => {
    render(<TimeSpanEditor classNames={{ decrementButton: 'custom-dec' }} />);
    expect(screen.getAllByTestId('time-span-decrement')[0].className).toContain('custom-dec');
  });

  // ── Slot API: styles ──

  it('styles.root root elemana eklenir', () => {
    render(<TimeSpanEditor styles={{ root: { padding: '16px' } }} />);
    expect(screen.getByTestId('time-span-root')).toHaveStyle({ padding: '16px' });
  });

  it('styles.field field elemana eklenir', () => {
    render(<TimeSpanEditor styles={{ field: { padding: '4px' } }} />);
    expect(screen.getAllByTestId('time-span-field')[0]).toHaveStyle({ padding: '4px' });
  });

  it('styles.input input elemana eklenir', () => {
    render(<TimeSpanEditor styles={{ input: { fontSize: '20px' } }} />);
    expect(screen.getAllByTestId('time-span-input')[0]).toHaveStyle({ fontSize: '20px' });
  });

  it('styles.label label elemana eklenir', () => {
    render(<TimeSpanEditor styles={{ label: { letterSpacing: '0.1em' } }} />);
    expect(screen.getAllByTestId('time-span-label')[0]).toHaveStyle({ letterSpacing: '0.1em' });
  });

  // ── Ref ──

  it('ref forward edilir', () => {
    const ref = vi.fn();
    render(<TimeSpanEditor ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

// ── Compound API ──

describe('TimeSpanEditor (Compound)', () => {
  it('compound: field render edilir', () => {
    render(
      <TimeSpanEditor>
        <TimeSpanEditor.Field field="hours" />
        <TimeSpanEditor.Field field="minutes" />
      </TimeSpanEditor>,
    );
    expect(screen.getAllByTestId('time-span-field')).toHaveLength(2);
  });

  it('compound: classNames context ile aktarilir', () => {
    render(
      <TimeSpanEditor classNames={{ field: 'cmp-field' }}>
        <TimeSpanEditor.Field field="hours" />
      </TimeSpanEditor>,
    );
    expect(screen.getByTestId('time-span-field').className).toContain('cmp-field');
  });

  it('compound: styles context ile aktarilir', () => {
    render(
      <TimeSpanEditor styles={{ field: { padding: '12px' } }}>
        <TimeSpanEditor.Field field="hours" />
      </TimeSpanEditor>,
    );
    expect(screen.getByTestId('time-span-field')).toHaveStyle({ padding: '12px' });
  });

  it('TimeSpanEditor.Field context disinda hata firlatir', () => {
    expect(() => render(<TimeSpanEditor.Field field="hours" />)).toThrow();
  });
});

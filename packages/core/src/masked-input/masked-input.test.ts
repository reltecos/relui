/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import {
  createMaskedInput,
  parseMask,
  applyMask,
  stripMask,
  filterRawValue,
  isComplete,
  getNextEditableIndex,
  MASK_PRESETS,
} from './masked-input.machine';
// ── parseMask ──────────────────────────────────────────────────────

describe('parseMask', () => {
  it('# karakteri digit slot uretir / # produces digit slot', () => {
    const slots = parseMask('#');
    expect(slots).toHaveLength(1);
    expect(slots[0].type).toBe('editable');
    expect(slots[0].accept?.test('5')).toBe(true);
    expect(slots[0].accept?.test('a')).toBe(false);
  });

  it('A karakteri letter slot uretir / A produces letter slot', () => {
    const slots = parseMask('A');
    expect(slots).toHaveLength(1);
    expect(slots[0].type).toBe('editable');
    expect(slots[0].accept?.test('a')).toBe(true);
    expect(slots[0].accept?.test('Z')).toBe(true);
    expect(slots[0].accept?.test('5')).toBe(false);
  });

  it('* karakteri any slot uretir / * produces any slot', () => {
    const slots = parseMask('*');
    expect(slots).toHaveLength(1);
    expect(slots[0].type).toBe('editable');
    expect(slots[0].accept?.test('5')).toBe(true);
    expect(slots[0].accept?.test('a')).toBe(true);
    expect(slots[0].accept?.test('!')).toBe(false);
  });

  it('sabit karakterler static slot uretir / static chars produce static slot', () => {
    const slots = parseMask('(');
    expect(slots).toHaveLength(1);
    expect(slots[0].type).toBe('static');
    expect(slots[0].char).toBe('(');
  });

  it('telefon mask dogru parse edilir / phone mask parsed correctly', () => {
    const slots = parseMask('(###) ### ## ##');
    expect(slots).toHaveLength(15);

    // (
    expect(slots[0]).toEqual({ type: 'static', char: '(' });
    // #, #, #
    expect(slots[1].type).toBe('editable');
    expect(slots[2].type).toBe('editable');
    expect(slots[3].type).toBe('editable');
    // )
    expect(slots[4]).toEqual({ type: 'static', char: ')' });
    // space
    expect(slots[5]).toEqual({ type: 'static', char: ' ' });
  });

  it('escape ile ozel karakter static olur / escape makes special char static', () => {
    const slots = parseMask('\\##');
    expect(slots).toHaveLength(2);
    expect(slots[0]).toEqual({ type: 'static', char: '#' });
    expect(slots[1].type).toBe('editable');
  });

  it('escape A ile harf static olur / escape A makes letter static', () => {
    const slots = parseMask('\\A#');
    expect(slots).toHaveLength(2);
    expect(slots[0]).toEqual({ type: 'static', char: 'A' });
    expect(slots[1].type).toBe('editable');
  });

  it('bos mask bos dizi uretir / empty mask produces empty array', () => {
    expect(parseMask('')).toEqual([]);
  });
});

// ── applyMask ──────────────────────────────────────────────────────

describe('applyMask', () => {
  const phoneSlots = parseMask('(###) ### ## ##');

  it('tam deger dogru formatlanir / full value formatted correctly', () => {
    expect(applyMask('5321234567', phoneSlots, '_')).toBe('(532) 123 45 67');
  });

  it('kismi deger maskChar ile tamamlanir / partial value filled with maskChar', () => {
    expect(applyMask('532', phoneSlots, '_')).toBe('(532) ___ __ __');
  });

  it('bos deger tamamen maskChar / empty value all maskChar', () => {
    expect(applyMask('', phoneSlots, '_')).toBe('(___) ___ __ __');
  });

  it('fazla karakter kesilir / excess chars truncated', () => {
    expect(applyMask('53212345678999', phoneSlots, '_')).toBe('(532) 123 45 67');
  });

  it('farkli maskChar kullanilabilir / different maskChar works', () => {
    expect(applyMask('', phoneSlots, '0')).toBe('(000) 000 00 00');
  });

  it('showPlaceholder=false ile bos slotlar kesilir / empty slots trimmed', () => {
    expect(applyMask('532', phoneSlots, '_', false)).toBe('(532');
  });

  it('showPlaceholder=false tam deger / full value with showPlaceholder=false', () => {
    expect(applyMask('5321234567', phoneSlots, '_', false)).toBe('(532) 123 45 67');
  });

  it('showPlaceholder=false bos deger / empty value with showPlaceholder=false', () => {
    expect(applyMask('', phoneSlots, '_', false)).toBe('');
  });

  it('tarih mask dogru formatlanir / date mask formatted correctly', () => {
    const dateSlots = parseMask('##/##/####');
    expect(applyMask('25122025', dateSlots, '_')).toBe('25/12/2025');
  });

  it('IP mask dogru formatlanir / IP mask formatted correctly', () => {
    const ipSlots = parseMask('###.###.###.###');
    expect(applyMask('192168001001', ipSlots, '_')).toBe('192.168.001.001');
  });
});

// ── stripMask ──────────────────────────────────────────────────────

describe('stripMask', () => {
  const phoneSlots = parseMask('(###) ### ## ##');

  it('formatli degerden raw cikarir / extracts raw from formatted', () => {
    expect(stripMask('(532) 123 45 67', phoneSlots, '_')).toBe('5321234567');
  });

  it('kismi degerden raw cikarir / extracts raw from partial', () => {
    expect(stripMask('(532) ___ __ __', phoneSlots, '_')).toBe('532');
  });

  it('tamamen bos degerden bos raw / empty from all maskChar', () => {
    expect(stripMask('(___) ___ __ __', phoneSlots, '_')).toBe('');
  });

  it('tarih mask strip / date mask strip', () => {
    const dateSlots = parseMask('##/##/####');
    expect(stripMask('25/12/2025', dateSlots, '_')).toBe('25122025');
  });
});

// ── filterRawValue ─────────────────────────────────────────────────

describe('filterRawValue', () => {
  it('sadece gecerli karakterleri alir / keeps only valid chars', () => {
    const slots = parseMask('###');
    expect(filterRawValue('1a2b3', slots)).toBe('123');
  });

  it('harf mask ile sadece harfleri alir / letter mask keeps only letters', () => {
    const slots = parseMask('AAA');
    expect(filterRawValue('a1b2c', slots)).toBe('abc');
  });

  it('mixed mask dogru filtreler / mixed mask filters correctly', () => {
    const slots = parseMask('A##');
    expect(filterRawValue('X12', slots)).toBe('X12');
  });

  it('fazla karakterler kesilir / excess chars truncated', () => {
    const slots = parseMask('##');
    expect(filterRawValue('12345', slots)).toBe('12');
  });

  it('bos string bos doner / empty string returns empty', () => {
    const slots = parseMask('###');
    expect(filterRawValue('', slots)).toBe('');
  });
});

// ── isComplete ─────────────────────────────────────────────────────

describe('isComplete', () => {
  const phoneSlots = parseMask('(###) ### ## ##');

  it('tam deger complete / full value is complete', () => {
    expect(isComplete('5321234567', phoneSlots)).toBe(true);
  });

  it('kismi deger incomplete / partial value is incomplete', () => {
    expect(isComplete('532', phoneSlots)).toBe(false);
  });

  it('bos deger incomplete / empty value is incomplete', () => {
    expect(isComplete('', phoneSlots)).toBe(false);
  });

  it('fazla deger complete / excess value is complete', () => {
    expect(isComplete('53212345679999', phoneSlots)).toBe(true);
  });
});

// ── getNextEditableIndex ───────────────────────────────────────────

describe('getNextEditableIndex', () => {
  const phoneSlots = parseMask('(###) ###');

  it('ileri yonde sonraki editable / forward next editable', () => {
    // index 0 = '(' static, 1 = # editable
    expect(getNextEditableIndex(0, phoneSlots, 'forward')).toBe(1);
  });

  it('editable pozisyonda kendini doner / returns self on editable', () => {
    expect(getNextEditableIndex(1, phoneSlots, 'forward')).toBe(1);
  });

  it('geri yonde onceki editable / backward previous editable', () => {
    // index 4 = ')' static, 3 = # editable
    expect(getNextEditableIndex(4, phoneSlots, 'backward')).toBe(3);
  });

  it('sondan tasarsa slots.length doner / returns slots.length if past end', () => {
    // (###) ### = 8 slot, index 8 = past end
    const slots = parseMask('(###) ###');
    expect(getNextEditableIndex(slots.length, slots, 'forward')).toBe(slots.length);
  });
});

// ── MASK_PRESETS ────────────────────────────────────────────────────

describe('MASK_PRESETS', () => {
  it('phoneTR dogru formatlama / phoneTR correct format', () => {
    const slots = parseMask(MASK_PRESETS.phoneTR);
    expect(applyMask('5321234567', slots, '_')).toBe('(532) 123 45 67');
  });

  it('creditCard dogru formatlama / creditCard correct format', () => {
    const slots = parseMask(MASK_PRESETS.creditCard);
    expect(applyMask('4111111111111111', slots, '_')).toBe('4111 1111 1111 1111');
  });

  it('date dogru formatlama / date correct format', () => {
    const slots = parseMask(MASK_PRESETS.date);
    expect(applyMask('25122025', slots, '_')).toBe('25/12/2025');
  });

  it('time dogru formatlama / time correct format', () => {
    const slots = parseMask(MASK_PRESETS.time);
    expect(applyMask('1430', slots, '_')).toBe('14:30');
  });

  it('ipv4 dogru formatlama / ipv4 correct format', () => {
    const slots = parseMask(MASK_PRESETS.ipv4);
    expect(applyMask('192168001001', slots, '_')).toBe('192.168.001.001');
  });

  it('tcKimlik dogru formatlama / tcKimlik correct format', () => {
    const slots = parseMask(MASK_PRESETS.tcKimlik);
    // 3+3+2+3 = 11 editable slot
    expect(applyMask('12345678901', slots, '_')).toBe('123 456 78 901');
  });

  it('ibanTR dogru formatlama / ibanTR correct format', () => {
    const slots = parseMask(MASK_PRESETS.ibanTR);
    // TR + 24 digit = 26 editable
    expect(applyMask('1234567890123456789012345', slots, '_'))
      .toBe('TR12 3456 7890 1234 5678 9012 34');
  });
});

// ── createMaskedInput (Machine) ────────────────────────────────────

describe('createMaskedInput', () => {
  // ── Varsayilan degerler / Defaults ──

  it('varsayilan context dogru / default context is correct', () => {
    const m = createMaskedInput({ mask: '###' });
    const ctx = m.getContext();
    expect(ctx.interactionState).toBe('idle');
    expect(ctx.rawValue).toBe('');
    expect(ctx.maskChar).toBe('_');
    expect(ctx.editableCount).toBe(3);
    expect(ctx.disabled).toBe(false);
    expect(ctx.readOnly).toBe(false);
    expect(ctx.invalid).toBe(false);
    expect(ctx.required).toBe(false);
  });

  it('baslangic degeri filtrelenir / initial value filtered', () => {
    const m = createMaskedInput({ mask: '###', value: '1a2b3' });
    expect(m.getRawValue()).toBe('123');
  });

  it('ozel maskChar kullanilabilir / custom maskChar works', () => {
    const m = createMaskedInput({ mask: '###', maskChar: '0' });
    expect(m.getFormattedValue()).toBe('000');
  });

  // ── getFormattedValue / getRawValue ──

  it('formatli deger dogru / formatted value correct', () => {
    const m = createMaskedInput({ mask: '(###) ###', value: '532123' });
    expect(m.getFormattedValue()).toBe('(532) 123');
  });

  it('kismi deger formatli / partial value formatted', () => {
    const m = createMaskedInput({ mask: '(###) ###', value: '53' });
    expect(m.getFormattedValue()).toBe('(53_) ___');
  });

  it('raw deger dogru / raw value correct', () => {
    const m = createMaskedInput({ mask: '(###) ###', value: '532123' });
    expect(m.getRawValue()).toBe('532123');
  });

  // ── isComplete ──

  it('tam deger complete / full value is complete', () => {
    const m = createMaskedInput({ mask: '###', value: '123' });
    expect(m.isComplete()).toBe(true);
  });

  it('kismi deger incomplete / partial value is incomplete', () => {
    const m = createMaskedInput({ mask: '###', value: '12' });
    expect(m.isComplete()).toBe(false);
  });

  // ── getPlaceholder ──

  it('placeholder dogru / placeholder correct', () => {
    const m = createMaskedInput({ mask: '(###) ###' });
    expect(m.getPlaceholder()).toBe('(___) ___');
  });

  // ── SET_RAW_VALUE ──

  it('SET_RAW_VALUE degeri filtreler / filters raw value', () => {
    const m = createMaskedInput({ mask: '###' });
    m.send({ type: 'SET_RAW_VALUE', value: '1a2b3' });
    expect(m.getRawValue()).toBe('123');
    expect(m.getFormattedValue()).toBe('123');
  });

  it('SET_RAW_VALUE ayni deger referans esitligi / same value reference equality', () => {
    const m = createMaskedInput({ mask: '###', value: '123' });
    const ctx1 = m.getContext();
    const ctx2 = m.send({ type: 'SET_RAW_VALUE', value: '123' });
    expect(ctx1).toBe(ctx2);
  });

  it('SET_RAW_VALUE fazla karakter kesilir / excess chars truncated', () => {
    const m = createMaskedInput({ mask: '##' });
    m.send({ type: 'SET_RAW_VALUE', value: '12345' });
    expect(m.getRawValue()).toBe('12');
  });

  // ── SET_INPUT_VALUE ──

  it('SET_INPUT_VALUE formatli degerden raw cikarir / extracts raw from formatted', () => {
    const m = createMaskedInput({ mask: '(###) ###' });
    m.send({ type: 'SET_INPUT_VALUE', value: '(532) 123' });
    expect(m.getRawValue()).toBe('532123');
  });

  it('SET_INPUT_VALUE kismi degerden raw cikarir / extracts raw from partial', () => {
    const m = createMaskedInput({ mask: '(###) ###' });
    m.send({ type: 'SET_INPUT_VALUE', value: '(53_) ___' });
    expect(m.getRawValue()).toBe('53');
  });

  it('SET_INPUT_VALUE ayni deger referans esitligi / same value reference equality', () => {
    const m = createMaskedInput({ mask: '###', value: '123' });
    const ctx1 = m.getContext();
    const ctx2 = m.send({ type: 'SET_INPUT_VALUE', value: '123' });
    expect(ctx1).toBe(ctx2);
  });

  // ── Etkilesim state gecisleri / Interaction state transitions ──

  it('POINTER_ENTER idle->hover / POINTER_ENTER idle->hover', () => {
    const m = createMaskedInput({ mask: '#' });
    m.send({ type: 'POINTER_ENTER' });
    expect(m.getContext().interactionState).toBe('hover');
  });

  it('POINTER_LEAVE hover->idle / POINTER_LEAVE hover->idle', () => {
    const m = createMaskedInput({ mask: '#' });
    m.send({ type: 'POINTER_ENTER' });
    m.send({ type: 'POINTER_LEAVE' });
    expect(m.getContext().interactionState).toBe('idle');
  });

  it('FOCUS -> focused / FOCUS -> focused', () => {
    const m = createMaskedInput({ mask: '#' });
    m.send({ type: 'FOCUS' });
    expect(m.getContext().interactionState).toBe('focused');
  });

  it('BLUR focused->idle / BLUR focused->idle', () => {
    const m = createMaskedInput({ mask: '#' });
    m.send({ type: 'FOCUS' });
    m.send({ type: 'BLUR' });
    expect(m.getContext().interactionState).toBe('idle');
  });

  it('disabled durumda etkilesim engellenir / interaction blocked when disabled', () => {
    const m = createMaskedInput({ mask: '#', disabled: true });
    const ctx1 = m.getContext();
    const ctx2 = m.send({ type: 'POINTER_ENTER' });
    expect(ctx1).toBe(ctx2);
    expect(m.getContext().interactionState).toBe('idle');
  });

  // ── SET_DISABLED / SET_READ_ONLY / SET_INVALID ──

  it('SET_DISABLED degeri gunceller / updates disabled value', () => {
    const m = createMaskedInput({ mask: '#' });
    m.send({ type: 'SET_DISABLED', value: true });
    expect(m.getContext().disabled).toBe(true);
    expect(m.isInteractionBlocked()).toBe(true);
  });

  it('SET_DISABLED ayni deger referans esitligi / same value reference equality', () => {
    const m = createMaskedInput({ mask: '#', disabled: true });
    const ctx1 = m.getContext();
    const ctx2 = m.send({ type: 'SET_DISABLED', value: true });
    expect(ctx1).toBe(ctx2);
  });

  it('SET_DISABLED true hover durumunda idle yapar / resets to idle on disable', () => {
    const m = createMaskedInput({ mask: '#' });
    m.send({ type: 'POINTER_ENTER' });
    expect(m.getContext().interactionState).toBe('hover');
    m.send({ type: 'SET_DISABLED', value: true });
    expect(m.getContext().interactionState).toBe('idle');
  });

  it('SET_READ_ONLY degeri gunceller / updates readOnly value', () => {
    const m = createMaskedInput({ mask: '#' });
    m.send({ type: 'SET_READ_ONLY', value: true });
    expect(m.getContext().readOnly).toBe(true);
  });

  it('SET_INVALID degeri gunceller / updates invalid value', () => {
    const m = createMaskedInput({ mask: '#' });
    m.send({ type: 'SET_INVALID', value: true });
    expect(m.getContext().invalid).toBe(true);
  });

  // ── DOM Props ──

  it('DOM props dogru / DOM props correct', () => {
    const m = createMaskedInput({ mask: '#' });
    const props = m.getInputProps();
    expect(props.type).toBe('text');
    expect(props['data-state']).toBe('idle');
    expect(props.disabled).toBeUndefined();
    expect(props.readOnly).toBeUndefined();
    expect(props['data-disabled']).toBeUndefined();
  });

  it('disabled DOM props / disabled DOM props', () => {
    const m = createMaskedInput({ mask: '#', disabled: true });
    const props = m.getInputProps();
    expect(props.disabled).toBe(true);
    expect(props['data-disabled']).toBe('');
  });

  it('readOnly DOM props / readOnly DOM props', () => {
    const m = createMaskedInput({ mask: '#', readOnly: true });
    const props = m.getInputProps();
    expect(props.readOnly).toBe(true);
    expect(props['data-readonly']).toBe('');
    expect(props['aria-readonly']).toBe(true);
  });

  it('invalid DOM props / invalid DOM props', () => {
    const m = createMaskedInput({ mask: '#', invalid: true });
    const props = m.getInputProps();
    expect(props['aria-invalid']).toBe(true);
    expect(props['data-invalid']).toBe('');
  });

  it('required DOM props / required DOM props', () => {
    const m = createMaskedInput({ mask: '#', required: true });
    const props = m.getInputProps();
    expect(props.required).toBe(true);
    expect(props['aria-required']).toBe(true);
  });

  // ── isInteractionBlocked ──

  it('disabled ise blocked / blocked when disabled', () => {
    const m = createMaskedInput({ mask: '#', disabled: true });
    expect(m.isInteractionBlocked()).toBe(true);
  });

  it('normal ise not blocked / not blocked normally', () => {
    const m = createMaskedInput({ mask: '#' });
    expect(m.isInteractionBlocked()).toBe(false);
  });

  // ── Telefon senaryosu / Phone scenario ──

  it('telefon senaryosu uc uca / phone scenario end-to-end', () => {
    const m = createMaskedInput({ mask: MASK_PRESETS.phoneTR });
    expect(m.getFormattedValue()).toBe('(___) ___ __ __');
    expect(m.getRawValue()).toBe('');
    expect(m.isComplete()).toBe(false);

    m.send({ type: 'SET_RAW_VALUE', value: '5321234567' });
    expect(m.getFormattedValue()).toBe('(532) 123 45 67');
    expect(m.getRawValue()).toBe('5321234567');
    expect(m.isComplete()).toBe(true);
  });

  // ── Kredi karti senaryosu / Credit card scenario ──

  it('kredi karti senaryosu / credit card scenario', () => {
    const m = createMaskedInput({ mask: MASK_PRESETS.creditCard });
    m.send({ type: 'SET_RAW_VALUE', value: '4111111111111111' });
    expect(m.getFormattedValue()).toBe('4111 1111 1111 1111');
    expect(m.isComplete()).toBe(true);
  });
});

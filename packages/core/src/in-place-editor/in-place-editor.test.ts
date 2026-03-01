/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { createInPlaceEditor } from './in-place-editor.machine';

describe('InPlaceEditor Machine', () => {
  // ──────────────────────────────────────────
  // Başlangıç durumu / Initial state
  // ──────────────────────────────────────────

  it('varsayilan reading durumunda baslar', () => {
    const editor = createInPlaceEditor();
    const ctx = editor.getContext();

    expect(ctx.state).toBe('reading');
    expect(ctx.value).toBe('');
    expect(ctx.editValue).toBe('');
  });

  it('defaultValue ile baslar', () => {
    const editor = createInPlaceEditor({ defaultValue: 'Merhaba' });
    const ctx = editor.getContext();

    expect(ctx.value).toBe('Merhaba');
    expect(ctx.editValue).toBe('Merhaba');
  });

  it('disabled ile baslar', () => {
    const editor = createInPlaceEditor({ disabled: true });

    expect(editor.getContext().disabled).toBe(true);
  });

  it('readOnly ile baslar', () => {
    const editor = createInPlaceEditor({ readOnly: true });

    expect(editor.getContext().readOnly).toBe(true);
  });

  // ──────────────────────────────────────────
  // EDIT event
  // ──────────────────────────────────────────

  it('EDIT ile editing durumuna gecer', () => {
    const editor = createInPlaceEditor({ defaultValue: 'test' });

    editor.send({ type: 'EDIT' });
    const ctx = editor.getContext();

    expect(ctx.state).toBe('editing');
    expect(ctx.editValue).toBe('test');
  });

  it('disabled iken EDIT yoksayilir', () => {
    const editor = createInPlaceEditor({ disabled: true });

    editor.send({ type: 'EDIT' });

    expect(editor.getContext().state).toBe('reading');
  });

  it('readOnly iken EDIT yoksayilir', () => {
    const editor = createInPlaceEditor({ readOnly: true });

    editor.send({ type: 'EDIT' });

    expect(editor.getContext().state).toBe('reading');
  });

  it('zaten editing iken EDIT yoksayilir', () => {
    const editor = createInPlaceEditor({ defaultValue: 'ilk' });

    editor.send({ type: 'EDIT' });
    editor.send({ type: 'SET_EDIT_VALUE', value: 'degisti' });
    editor.send({ type: 'EDIT' });

    // editValue sıfırlanmamalı
    expect(editor.getContext().editValue).toBe('degisti');
  });

  // ──────────────────────────────────────────
  // SET_EDIT_VALUE event
  // ──────────────────────────────────────────

  it('SET_EDIT_VALUE ile editValue guncellenir', () => {
    const editor = createInPlaceEditor({ defaultValue: 'eski' });

    editor.send({ type: 'EDIT' });
    editor.send({ type: 'SET_EDIT_VALUE', value: 'yeni' });

    expect(editor.getContext().editValue).toBe('yeni');
  });

  it('reading durumunda SET_EDIT_VALUE yoksayilir', () => {
    const editor = createInPlaceEditor({ defaultValue: 'test' });

    editor.send({ type: 'SET_EDIT_VALUE', value: 'yeni' });

    expect(editor.getContext().editValue).toBe('test');
  });

  // ──────────────────────────────────────────
  // CONFIRM event
  // ──────────────────────────────────────────

  it('CONFIRM ile deger kaydedilir ve reading durumuna gecer', () => {
    const editor = createInPlaceEditor({ defaultValue: 'eski' });

    editor.send({ type: 'EDIT' });
    editor.send({ type: 'SET_EDIT_VALUE', value: 'yeni' });
    editor.send({ type: 'CONFIRM' });

    const ctx = editor.getContext();
    expect(ctx.state).toBe('reading');
    expect(ctx.value).toBe('yeni');
    expect(ctx.editValue).toBe('yeni');
  });

  it('reading durumunda CONFIRM yoksayilir', () => {
    const editor = createInPlaceEditor({ defaultValue: 'test' });

    editor.send({ type: 'CONFIRM' });

    expect(editor.getContext().state).toBe('reading');
    expect(editor.getContext().value).toBe('test');
  });

  // ──────────────────────────────────────────
  // CANCEL event
  // ──────────────────────────────────────────

  it('CANCEL ile deger geri alinir ve reading durumuna gecer', () => {
    const editor = createInPlaceEditor({ defaultValue: 'eski' });

    editor.send({ type: 'EDIT' });
    editor.send({ type: 'SET_EDIT_VALUE', value: 'yeni' });
    editor.send({ type: 'CANCEL' });

    const ctx = editor.getContext();
    expect(ctx.state).toBe('reading');
    expect(ctx.value).toBe('eski');
    expect(ctx.editValue).toBe('eski');
  });

  it('reading durumunda CANCEL yoksayilir', () => {
    const editor = createInPlaceEditor({ defaultValue: 'test' });

    editor.send({ type: 'CANCEL' });

    expect(editor.getContext().state).toBe('reading');
  });

  // ──────────────────────────────────────────
  // SET_VALUE event
  // ──────────────────────────────────────────

  it('SET_VALUE ile deger guncellenir (reading)', () => {
    const editor = createInPlaceEditor({ defaultValue: 'eski' });

    editor.send({ type: 'SET_VALUE', value: 'yeni' });

    const ctx = editor.getContext();
    expect(ctx.value).toBe('yeni');
    expect(ctx.editValue).toBe('yeni');
  });

  it('SET_VALUE editing durumunda editValue degistirmez', () => {
    const editor = createInPlaceEditor({ defaultValue: 'eski' });

    editor.send({ type: 'EDIT' });
    editor.send({ type: 'SET_EDIT_VALUE', value: 'duzenleniyor' });
    editor.send({ type: 'SET_VALUE', value: 'disaridan' });

    const ctx = editor.getContext();
    expect(ctx.value).toBe('disaridan');
    expect(ctx.editValue).toBe('duzenleniyor');
  });

  // ──────────────────────────────────────────
  // SET_DISABLED event
  // ──────────────────────────────────────────

  it('SET_DISABLED ile disabled guncellenir', () => {
    const editor = createInPlaceEditor();

    editor.send({ type: 'SET_DISABLED', disabled: true });

    expect(editor.getContext().disabled).toBe(true);
  });

  it('editing iken disabled olursa iptal edilir', () => {
    const editor = createInPlaceEditor({ defaultValue: 'eski' });

    editor.send({ type: 'EDIT' });
    editor.send({ type: 'SET_EDIT_VALUE', value: 'yeni' });
    editor.send({ type: 'SET_DISABLED', disabled: true });

    const ctx = editor.getContext();
    expect(ctx.state).toBe('reading');
    expect(ctx.value).toBe('eski');
    expect(ctx.editValue).toBe('eski');
  });

  // ──────────────────────────────────────────
  // SET_READ_ONLY event
  // ──────────────────────────────────────────

  it('SET_READ_ONLY ile readOnly guncellenir', () => {
    const editor = createInPlaceEditor();

    editor.send({ type: 'SET_READ_ONLY', readOnly: true });

    expect(editor.getContext().readOnly).toBe(true);
  });

  it('editing iken readOnly olursa iptal edilir', () => {
    const editor = createInPlaceEditor({ defaultValue: 'eski' });

    editor.send({ type: 'EDIT' });
    editor.send({ type: 'SET_EDIT_VALUE', value: 'yeni' });
    editor.send({ type: 'SET_READ_ONLY', readOnly: true });

    const ctx = editor.getContext();
    expect(ctx.state).toBe('reading');
    expect(ctx.value).toBe('eski');
    expect(ctx.editValue).toBe('eski');
  });

  // ──────────────────────────────────────────
  // Tam akis / Full flow
  // ──────────────────────────────────────────

  it('birden fazla edit/confirm dongusu', () => {
    const editor = createInPlaceEditor({ defaultValue: 'v1' });

    // İlk düzenleme
    editor.send({ type: 'EDIT' });
    editor.send({ type: 'SET_EDIT_VALUE', value: 'v2' });
    editor.send({ type: 'CONFIRM' });
    expect(editor.getContext().value).toBe('v2');

    // İkinci düzenleme
    editor.send({ type: 'EDIT' });
    editor.send({ type: 'SET_EDIT_VALUE', value: 'v3' });
    editor.send({ type: 'CONFIRM' });
    expect(editor.getContext().value).toBe('v3');
  });

  it('edit → cancel → edit yeni editValue alir', () => {
    const editor = createInPlaceEditor({ defaultValue: 'original' });

    editor.send({ type: 'EDIT' });
    editor.send({ type: 'SET_EDIT_VALUE', value: 'changed' });
    editor.send({ type: 'CANCEL' });

    expect(editor.getContext().editValue).toBe('original');

    editor.send({ type: 'EDIT' });
    expect(editor.getContext().editValue).toBe('original');
  });

  // ──────────────────────────────────────────
  // getDisplayProps
  // ──────────────────────────────────────────

  it('getDisplayProps dogru doner (normal)', () => {
    const editor = createInPlaceEditor();
    const props = editor.getDisplayProps();

    expect(props.role).toBe('button');
    expect(props.tabIndex).toBe(0);
    expect(props['data-state']).toBe('reading');
    expect(props['aria-disabled']).toBeUndefined();
    expect(props['data-disabled']).toBeUndefined();
  });

  it('getDisplayProps dogru doner (disabled)', () => {
    const editor = createInPlaceEditor({ disabled: true });
    const props = editor.getDisplayProps();

    expect(props.tabIndex).toBe(-1);
    expect(props['aria-disabled']).toBe(true);
    expect(props['data-disabled']).toBe('');
  });

  it('getDisplayProps dogru doner (readOnly)', () => {
    const editor = createInPlaceEditor({ readOnly: true });
    const props = editor.getDisplayProps();

    expect(props['aria-readonly']).toBe(true);
    expect(props['data-readonly']).toBe('');
  });

  it('getDisplayProps data-state editing durumunu yansitir', () => {
    const editor = createInPlaceEditor();

    editor.send({ type: 'EDIT' });

    expect(editor.getDisplayProps()['data-state']).toBe('editing');
  });

  // ──────────────────────────────────────────
  // getInputProps
  // ──────────────────────────────────────────

  it('getInputProps dogru doner', () => {
    const editor = createInPlaceEditor({ defaultValue: 'test' });
    const props = editor.getInputProps();

    expect(props.value).toBe('test');
    expect(props.disabled).toBe(false);
    expect(props.readOnly).toBe(false);
    expect(props['data-state']).toBe('reading');
  });

  it('getInputProps editing durumunda editValue doner', () => {
    const editor = createInPlaceEditor({ defaultValue: 'eski' });

    editor.send({ type: 'EDIT' });
    editor.send({ type: 'SET_EDIT_VALUE', value: 'yeni' });

    const props = editor.getInputProps();
    expect(props.value).toBe('yeni');
    expect(props['data-state']).toBe('editing');
  });
});

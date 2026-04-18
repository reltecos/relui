/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { evaluateFormula, parseRef, toRef } from './formula';
import { createSpreadsheet } from './spreadsheet.machine';

// ── Formula Parser Tests ──

describe('Formula Parser', () => {
  const emptyLookup = () => null;

  it('sayi literal dondurur', () => {
    expect(evaluateFormula('42', emptyLookup)).toBe(42);
  });

  it('string literal dondurur', () => {
    expect(evaluateFormula('"hello"', emptyLookup)).toBe('hello');
  });

  it('boolean TRUE dondurur', () => {
    expect(evaluateFormula('TRUE', emptyLookup)).toBe(true);
  });

  it('boolean FALSE dondurur', () => {
    expect(evaluateFormula('FALSE', emptyLookup)).toBe(false);
  });

  it('toplama islemi', () => {
    expect(evaluateFormula('1+2', emptyLookup)).toBe(3);
  });

  it('cikarma islemi', () => {
    expect(evaluateFormula('10-3', emptyLookup)).toBe(7);
  });

  it('carpma islemi', () => {
    expect(evaluateFormula('4*5', emptyLookup)).toBe(20);
  });

  it('bolme islemi', () => {
    expect(evaluateFormula('10/4', emptyLookup)).toBe(2.5);
  });

  it('sifira bolme null dondurur', () => {
    expect(evaluateFormula('10/0', emptyLookup)).toBeNull();
  });

  it('islem onceligi dogru', () => {
    expect(evaluateFormula('2+3*4', emptyLookup)).toBe(14);
  });

  it('parantezli islem', () => {
    expect(evaluateFormula('(2+3)*4', emptyLookup)).toBe(20);
  });

  it('karsilastirma >', () => {
    expect(evaluateFormula('5>3', emptyLookup)).toBe(true);
  });

  it('karsilastirma <', () => {
    expect(evaluateFormula('2<1', emptyLookup)).toBe(false);
  });

  it('hucre referansi A1', () => {
    const lookup = (r: number, c: number) => r === 0 && c === 0 ? 42 : null;
    expect(evaluateFormula('A1', lookup)).toBe(42);
  });

  it('hucre referansi B2', () => {
    const lookup = (r: number, c: number) => r === 1 && c === 1 ? 99 : null;
    expect(evaluateFormula('B2', lookup)).toBe(99);
  });

  it('SUM fonksiyonu', () => {
    const lookup = (r: number, c: number) => {
      if (r === 0 && c === 0) return 10;
      if (r === 1 && c === 0) return 20;
      if (r === 2 && c === 0) return 30;
      return null;
    };
    expect(evaluateFormula('SUM(A1:A3)', lookup)).toBe(60);
  });

  it('AVG fonksiyonu', () => {
    const lookup = (r: number, c: number) => {
      if (c === 0 && r <= 2) return (r + 1) * 10;
      return null;
    };
    expect(evaluateFormula('AVG(A1:A3)', lookup)).toBe(20);
  });

  it('COUNT fonksiyonu', () => {
    const lookup = (r: number, c: number) => {
      if (c === 0 && r <= 2) return r + 1;
      return null;
    };
    expect(evaluateFormula('COUNT(A1:A3)', lookup)).toBe(3);
  });

  it('MIN fonksiyonu', () => {
    const lookup = (r: number, c: number) => {
      if (r === 0 && c === 0) return 5;
      if (r === 1 && c === 0) return 2;
      if (r === 2 && c === 0) return 8;
      return null;
    };
    expect(evaluateFormula('MIN(A1:A3)', lookup)).toBe(2);
  });

  it('MAX fonksiyonu', () => {
    const lookup = (r: number, c: number) => {
      if (r === 0 && c === 0) return 5;
      if (r === 1 && c === 0) return 2;
      if (r === 2 && c === 0) return 8;
      return null;
    };
    expect(evaluateFormula('MAX(A1:A3)', lookup)).toBe(8);
  });

  it('IF fonksiyonu true dalı', () => {
    expect(evaluateFormula('IF(1>0, "yes", "no")', emptyLookup)).toBe('yes');
  });

  it('IF fonksiyonu false dalı', () => {
    expect(evaluateFormula('IF(1<0, "yes", "no")', emptyLookup)).toBe('no');
  });

  it('CONCAT fonksiyonu', () => {
    expect(evaluateFormula('CONCAT("a","b","c")', emptyLookup)).toBe('abc');
  });

  it('bilinmeyen fonksiyon hata dondurur', () => {
    expect(evaluateFormula('UNKNOWN(1)', emptyLookup)).toBe('#ERROR');
  });

  it('bos formul null dondurur', () => {
    expect(evaluateFormula('', emptyLookup)).toBeNull();
  });
});

// ── Ref Helpers ──

describe('Cell Reference Helpers', () => {
  it('parseRef A1 -> {row:0, col:0}', () => {
    expect(parseRef('A1')).toEqual({ row: 0, col: 0 });
  });

  it('parseRef Z26 -> {row:25, col:25}', () => {
    expect(parseRef('Z26')).toEqual({ row: 25, col: 25 });
  });

  it('parseRef AA1 -> {row:0, col:26}', () => {
    expect(parseRef('AA1')).toEqual({ row: 0, col: 26 });
  });

  it('toRef {0,0} -> A1', () => {
    expect(toRef(0, 0)).toBe('A1');
  });

  it('toRef {25,25} -> Z26', () => {
    expect(toRef(25, 25)).toBe('Z26');
  });

  it('toRef {0,26} -> AA1', () => {
    expect(toRef(0, 26)).toBe('AA1');
  });
});

// ── Spreadsheet Machine Tests ──

describe('createSpreadsheet', () => {
  it('baslangicta 1 sheet olusur', () => {
    const api = createSpreadsheet();
    expect(api.getContext().sheets.length).toBe(1);
  });

  it('baslangic secim A1', () => {
    const api = createSpreadsheet();
    expect(api.getContext().selection.active).toEqual({ row: 0, col: 0 });
  });

  it('SET_CELL ile hucre degeri ayarlanir', () => {
    const api = createSpreadsheet();
    api.send({ type: 'SET_CELL', row: 0, col: 0, raw: 'Hello' });
    const cell = api.getCellData(0, 0);
    expect(cell?.value).toBe('Hello');
    expect(cell?.type).toBe('text');
  });

  it('SET_CELL sayi degeri', () => {
    const api = createSpreadsheet();
    api.send({ type: 'SET_CELL', row: 0, col: 0, raw: '42' });
    expect(api.getCellData(0, 0)?.value).toBe(42);
    expect(api.getCellData(0, 0)?.type).toBe('number');
  });

  it('SET_CELL boolean degeri', () => {
    const api = createSpreadsheet();
    api.send({ type: 'SET_CELL', row: 0, col: 0, raw: 'true' });
    expect(api.getCellData(0, 0)?.value).toBe(true);
  });

  it('SET_CELL formul degeri', () => {
    const api = createSpreadsheet();
    api.send({ type: 'SET_CELL', row: 0, col: 0, raw: '10' });
    api.send({ type: 'SET_CELL', row: 1, col: 0, raw: '20' });
    api.send({ type: 'SET_CELL', row: 2, col: 0, raw: '=A1+A2' });
    expect(api.getCellData(2, 0)?.value).toBe(30);
  });

  it('SET_CELL SUM formulu', () => {
    const api = createSpreadsheet();
    api.send({ type: 'SET_CELL', row: 0, col: 0, raw: '10' });
    api.send({ type: 'SET_CELL', row: 1, col: 0, raw: '20' });
    api.send({ type: 'SET_CELL', row: 2, col: 0, raw: '30' });
    api.send({ type: 'SET_CELL', row: 3, col: 0, raw: '=SUM(A1:A3)' });
    expect(api.getCellData(3, 0)?.value).toBe(60);
  });

  it('SELECT_CELL ile secim degisir', () => {
    const api = createSpreadsheet();
    api.send({ type: 'SELECT_CELL', row: 2, col: 3 });
    expect(api.getContext().selection.active).toEqual({ row: 2, col: 3 });
  });

  it('SELECT_RANGE ile aralik secilir', () => {
    const api = createSpreadsheet();
    api.send({ type: 'SELECT_RANGE', startRow: 0, startCol: 0, endRow: 5, endCol: 3 });
    const sel = api.getContext().selection;
    expect(sel.range?.start).toEqual({ row: 0, col: 0 });
    expect(sel.range?.end).toEqual({ row: 5, col: 3 });
  });

  it('START_EDIT ve COMMIT_EDIT calisir', () => {
    const api = createSpreadsheet();
    api.send({ type: 'SET_CELL', row: 0, col: 0, raw: 'Old' });
    api.send({ type: 'START_EDIT', row: 0, col: 0 });
    expect(api.getContext().editingCell).toEqual({ row: 0, col: 0 });
    expect(api.getContext().editingValue).toBe('Old');
    api.send({ type: 'COMMIT_EDIT', value: 'New' });
    expect(api.getCellData(0, 0)?.value).toBe('New');
    expect(api.getContext().editingCell).toBeNull();
  });

  it('CANCEL_EDIT duzenlemeyi iptal eder', () => {
    const api = createSpreadsheet();
    api.send({ type: 'START_EDIT', row: 0, col: 0 });
    api.send({ type: 'CANCEL_EDIT' });
    expect(api.getContext().editingCell).toBeNull();
  });

  it('UNDO son islem geri alinir', () => {
    const api = createSpreadsheet();
    api.send({ type: 'SET_CELL', row: 0, col: 0, raw: 'A' });
    api.send({ type: 'SET_CELL', row: 0, col: 0, raw: 'B' });
    api.send({ type: 'UNDO' });
    expect(api.getCellData(0, 0)?.value).toBe('A');
  });

  it('REDO geri alinan islem tekrarlanir', () => {
    const api = createSpreadsheet();
    api.send({ type: 'SET_CELL', row: 0, col: 0, raw: 'A' });
    api.send({ type: 'SET_CELL', row: 0, col: 0, raw: 'B' });
    api.send({ type: 'UNDO' });
    api.send({ type: 'REDO' });
    expect(api.getCellData(0, 0)?.value).toBe('B');
  });

  it('canUndo ve canRedo dogru', () => {
    const api = createSpreadsheet();
    expect(api.getContext().canUndo).toBe(false);
    api.send({ type: 'SET_CELL', row: 0, col: 0, raw: 'X' });
    expect(api.getContext().canUndo).toBe(true);
    api.send({ type: 'UNDO' });
    expect(api.getContext().canRedo).toBe(true);
  });

  it('ADD_SHEET yeni sheet ekler', () => {
    const api = createSpreadsheet();
    api.send({ type: 'ADD_SHEET', name: 'Sheet 2' });
    expect(api.getContext().sheets.length).toBe(2);
  });

  it('REMOVE_SHEET sheet siler', () => {
    const api = createSpreadsheet({ initialSheets: 2 });
    const sheetId = api.getContext().sheets[1]?.id ?? '';
    api.send({ type: 'REMOVE_SHEET', sheetId });
    expect(api.getContext().sheets.length).toBe(1);
  });

  it('REMOVE_SHEET son sheet silinemez', () => {
    const api = createSpreadsheet();
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'REMOVE_SHEET', sheetId: api.getContext().sheets[0]?.id ?? '' });
    expect(fn).not.toHaveBeenCalled();
  });

  it('SWITCH_SHEET aktif sheet degisir', () => {
    const api = createSpreadsheet({ initialSheets: 2 });
    const secondId = api.getContext().sheets[1]?.id ?? '';
    api.send({ type: 'SWITCH_SHEET', sheetId: secondId });
    expect(api.getContext().activeSheetId).toBe(secondId);
  });

  it('RENAME_SHEET sheet adini degistirir', () => {
    const api = createSpreadsheet();
    const id = api.getContext().sheets[0]?.id ?? '';
    api.send({ type: 'RENAME_SHEET', sheetId: id, name: 'Data' });
    expect(api.getContext().sheets[0]?.name).toBe('Data');
  });

  it('SET_FROZEN donmus satir/sutun ayarlar', () => {
    const api = createSpreadsheet();
    api.send({ type: 'SET_FROZEN', rows: 1, cols: 2 });
    expect(api.getContext().frozenRows).toBe(1);
    expect(api.getContext().frozenCols).toBe(2);
  });

  it('onCellChange callback cagirilir', () => {
    const onCellChange = vi.fn();
    const api = createSpreadsheet({ onCellChange });
    api.send({ type: 'SET_CELL', row: 0, col: 0, raw: 'Test' });
    expect(onCellChange).toHaveBeenCalled();
  });

  it('subscribe ve destroy calisir', () => {
    const api = createSpreadsheet();
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'SET_CELL', row: 0, col: 0, raw: 'X' });
    expect(fn).toHaveBeenCalledTimes(1);
    api.destroy();
    api.send({ type: 'SET_CELL', row: 0, col: 0, raw: 'Y' });
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createPivotTable, computePivot } from './pivot-table.machine';
import type { PivotField, PivotPlacement } from './pivot-table.types';

const fields: PivotField[] = [
  { key: 'category', label: 'Kategori' },
  { key: 'year', label: 'Yil' },
  { key: 'amount', label: 'Tutar' },
];

const sampleData = [
  { category: 'A', year: '2023', amount: 100 },
  { category: 'A', year: '2024', amount: 150 },
  { category: 'B', year: '2023', amount: 200 },
  { category: 'B', year: '2024', amount: 250 },
  { category: 'A', year: '2023', amount: 50 },
];

describe('computePivot', () => {
  it('sum agregasyonu dogru hesaplanir', () => {
    const placement: PivotPlacement = {
      rowFields: ['category'],
      columnFields: ['year'],
      valueFields: [{ key: 'amount', aggregate: 'sum' }],
    };
    const result = computePivot(sampleData, placement);
    expect(result.rowHeaders.length).toBe(2); // A, B
    expect(result.columnHeaders.length).toBe(2); // 2023, 2024
    // A-2023: 100+50=150, A-2024: 150, B-2023: 200, B-2024: 250
    expect(result.values[0]?.[0]).toBe(150);
    expect(result.values[0]?.[1]).toBe(150);
    expect(result.values[1]?.[0]).toBe(200);
    expect(result.values[1]?.[1]).toBe(250);
  });

  it('count agregasyonu dogru hesaplanir', () => {
    const placement: PivotPlacement = {
      rowFields: ['category'],
      columnFields: ['year'],
      valueFields: [{ key: 'amount', aggregate: 'count' }],
    };
    const result = computePivot(sampleData, placement);
    // A-2023: 2, A-2024: 1, B-2023: 1, B-2024: 1
    expect(result.values[0]?.[0]).toBe(2);
    expect(result.values[0]?.[1]).toBe(1);
  });

  it('average agregasyonu dogru hesaplanir', () => {
    const placement: PivotPlacement = {
      rowFields: ['category'],
      columnFields: ['year'],
      valueFields: [{ key: 'amount', aggregate: 'average' }],
    };
    const result = computePivot(sampleData, placement);
    // A-2023: (100+50)/2 = 75
    expect(result.values[0]?.[0]).toBe(75);
  });

  it('min agregasyonu dogru hesaplanir', () => {
    const placement: PivotPlacement = {
      rowFields: ['category'],
      columnFields: ['year'],
      valueFields: [{ key: 'amount', aggregate: 'min' }],
    };
    const result = computePivot(sampleData, placement);
    // A-2023: min(100,50) = 50
    expect(result.values[0]?.[0]).toBe(50);
  });

  it('max agregasyonu dogru hesaplanir', () => {
    const placement: PivotPlacement = {
      rowFields: ['category'],
      columnFields: ['year'],
      valueFields: [{ key: 'amount', aggregate: 'max' }],
    };
    const result = computePivot(sampleData, placement);
    // A-2023: max(100,50) = 100
    expect(result.values[0]?.[0]).toBe(100);
  });

  it('row totals dogru hesaplanir', () => {
    const placement: PivotPlacement = {
      rowFields: ['category'],
      columnFields: ['year'],
      valueFields: [{ key: 'amount', aggregate: 'sum' }],
    };
    const result = computePivot(sampleData, placement);
    // A total: 150+150=300, B total: 200+250=450
    expect(result.rowTotals[0]).toBe(300);
    expect(result.rowTotals[1]).toBe(450);
  });

  it('column totals dogru hesaplanir', () => {
    const placement: PivotPlacement = {
      rowFields: ['category'],
      columnFields: ['year'],
      valueFields: [{ key: 'amount', aggregate: 'sum' }],
    };
    const result = computePivot(sampleData, placement);
    // 2023 total: 150+200=350, 2024 total: 150+250=400
    expect(result.columnTotals[0]).toBe(350);
    expect(result.columnTotals[1]).toBe(400);
  });

  it('grand total dogru hesaplanir', () => {
    const placement: PivotPlacement = {
      rowFields: ['category'],
      columnFields: ['year'],
      valueFields: [{ key: 'amount', aggregate: 'sum' }],
    };
    const result = computePivot(sampleData, placement);
    expect(result.grandTotal).toBe(750);
  });

  it('bos data icin bos sonuc doner', () => {
    const placement: PivotPlacement = {
      rowFields: ['category'],
      columnFields: ['year'],
      valueFields: [{ key: 'amount', aggregate: 'sum' }],
    };
    const result = computePivot([], placement);
    expect(result.rowHeaders.length).toBe(0);
    expect(result.grandTotal).toBeNull();
  });

  it('bos valueFields icin bos sonuc doner', () => {
    const placement: PivotPlacement = { rowFields: ['category'], columnFields: [], valueFields: [] };
    const result = computePivot(sampleData, placement);
    expect(result.values.length).toBe(0);
  });

  it('veri olmayan hucre null doner', () => {
    const data = [
      { cat: 'A', yr: '2023', val: 10 },
      { cat: 'B', yr: '2024', val: 20 },
    ];
    const placement: PivotPlacement = {
      rowFields: ['cat'],
      columnFields: ['yr'],
      valueFields: [{ key: 'val', aggregate: 'sum' }],
    };
    const result = computePivot(data, placement);
    // A-2024: null, B-2023: null
    expect(result.values[0]?.[1]).toBeNull();
    expect(result.values[1]?.[0]).toBeNull();
  });
});

describe('createPivotTable', () => {
  // ── Initial state ──

  it('baslangic placement bos', () => {
    const api = createPivotTable({ fields });
    const ctx = api.getContext();
    expect(ctx.placement.rowFields.length).toBe(0);
    expect(ctx.placement.columnFields.length).toBe(0);
    expect(ctx.placement.valueFields.length).toBe(0);
  });

  it('defaultPlacement uygulanir', () => {
    const api = createPivotTable({
      fields,
      defaultPlacement: {
        rowFields: ['category'],
        columnFields: ['year'],
        valueFields: [{ key: 'amount', aggregate: 'sum' }],
      },
    });
    const ctx = api.getContext();
    expect(ctx.placement.rowFields).toEqual(['category']);
    expect(ctx.placement.columnFields).toEqual(['year']);
  });

  // ── MOVE_FIELD ──

  it('MOVE_FIELD alan row a tasir', () => {
    const api = createPivotTable({ fields });
    api.send({ type: 'MOVE_FIELD', fieldKey: 'category', from: 'unused', to: 'row' });
    expect(api.getContext().placement.rowFields).toEqual(['category']);
  });

  it('MOVE_FIELD alan column a tasir', () => {
    const api = createPivotTable({ fields });
    api.send({ type: 'MOVE_FIELD', fieldKey: 'year', from: 'unused', to: 'column' });
    expect(api.getContext().placement.columnFields).toEqual(['year']);
  });

  it('MOVE_FIELD alan row dan column a tasir', () => {
    const api = createPivotTable({
      fields,
      defaultPlacement: { rowFields: ['category'], columnFields: [], valueFields: [] },
    });
    api.send({ type: 'MOVE_FIELD', fieldKey: 'category', from: 'row', to: 'column' });
    expect(api.getContext().placement.rowFields).toEqual([]);
    expect(api.getContext().placement.columnFields).toEqual(['category']);
  });

  it('MOVE_FIELD alan unused a tasir (kaldirir)', () => {
    const api = createPivotTable({
      fields,
      defaultPlacement: { rowFields: ['category'], columnFields: [], valueFields: [] },
    });
    api.send({ type: 'MOVE_FIELD', fieldKey: 'category', from: 'row', to: 'unused' });
    expect(api.getContext().placement.rowFields).toEqual([]);
  });

  // ── SET_AGGREGATE ──

  it('SET_AGGREGATE agregasyon tipini degistirir', () => {
    const api = createPivotTable({
      fields,
      defaultPlacement: { rowFields: [], columnFields: [], valueFields: [{ key: 'amount', aggregate: 'sum' }] },
    });
    api.send({ type: 'SET_AGGREGATE', fieldKey: 'amount', aggregate: 'average' });
    expect(api.getContext().placement.valueFields[0]?.aggregate).toBe('average');
  });

  // ── ADD/REMOVE VALUE FIELD ──

  it('ADD_VALUE_FIELD deger alani ekler', () => {
    const api = createPivotTable({ fields });
    api.send({ type: 'ADD_VALUE_FIELD', field: { key: 'amount', aggregate: 'sum' } });
    expect(api.getContext().placement.valueFields.length).toBe(1);
  });

  it('ADD_VALUE_FIELD ayni alan tekrar eklenmez', () => {
    const api = createPivotTable({
      fields,
      defaultPlacement: { rowFields: [], columnFields: [], valueFields: [{ key: 'amount', aggregate: 'sum' }] },
    });
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'ADD_VALUE_FIELD', field: { key: 'amount', aggregate: 'sum' } });
    expect(fn).not.toHaveBeenCalled();
  });

  it('REMOVE_VALUE_FIELD deger alani kaldirir', () => {
    const api = createPivotTable({
      fields,
      defaultPlacement: { rowFields: [], columnFields: [], valueFields: [{ key: 'amount', aggregate: 'sum' }] },
    });
    api.send({ type: 'REMOVE_VALUE_FIELD', fieldKey: 'amount' });
    expect(api.getContext().placement.valueFields.length).toBe(0);
  });

  // ── SET_PLACEMENT ──

  it('SET_PLACEMENT tum yerlesimi degistirir', () => {
    const api = createPivotTable({ fields });
    api.send({
      type: 'SET_PLACEMENT',
      placement: { rowFields: ['category'], columnFields: ['year'], valueFields: [{ key: 'amount', aggregate: 'count' }] },
    });
    const ctx = api.getContext();
    expect(ctx.placement.rowFields).toEqual(['category']);
    expect(ctx.placement.valueFields[0]?.aggregate).toBe('count');
  });

  // ── Callbacks ──

  it('onPlacementChange cagirilir', () => {
    const fn = vi.fn();
    const api = createPivotTable({ fields, onPlacementChange: fn });
    api.send({ type: 'MOVE_FIELD', fieldKey: 'category', from: 'unused', to: 'row' });
    expect(fn).toHaveBeenCalled();
  });

  // ── Subscribe/Destroy ──

  it('subscribe calisir', () => {
    const api = createPivotTable({ fields });
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'MOVE_FIELD', fieldKey: 'category', from: 'unused', to: 'row' });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('destroy temizler', () => {
    const api = createPivotTable({ fields });
    const fn = vi.fn();
    api.subscribe(fn);
    api.destroy();
    api.send({ type: 'MOVE_FIELD', fieldKey: 'category', from: 'unused', to: 'row' });
    expect(fn).not.toHaveBeenCalled();
  });
});

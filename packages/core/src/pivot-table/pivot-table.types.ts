/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/** Pivot alan tanimi / Pivot field definition */
export interface PivotField {
  /** Benzersiz anahtar / Unique key */
  key: string;
  /** Etiket / Label */
  label: string;
}

/** Agregasyon tipi / Aggregation type */
export type PivotAggregateType = 'sum' | 'count' | 'average' | 'min' | 'max';

/** Deger alani tanimi / Value field definition */
export interface PivotValueField {
  /** Alan anahtari / Field key */
  key: string;
  /** Agregasyon tipi / Aggregation type */
  aggregate: PivotAggregateType;
}

/** Alan yerlestirme / Field placement */
export interface PivotPlacement {
  /** Satir alanlari / Row fields */
  rowFields: string[];
  /** Sutun alanlari / Column fields */
  columnFields: string[];
  /** Deger alanlari / Value fields */
  valueFields: PivotValueField[];
}

/** Pivot hesaplama sonucu / Pivot computation result */
export interface PivotResult {
  /** Satir baslik listesi / Row headers */
  rowHeaders: string[][];
  /** Sutun baslik listesi / Column headers */
  columnHeaders: string[][];
  /** Deger matrisi [row][col] / Value matrix */
  values: (number | null)[][];
  /** Satir toplamlari / Row totals */
  rowTotals: (number | null)[];
  /** Sutun toplamlari / Column totals */
  columnTotals: (number | null)[];
  /** Genel toplam / Grand total */
  grandTotal: number | null;
}

/** PivotTable event tipleri / PivotTable event types */
export type PivotTableEvent =
  | { type: 'SET_PLACEMENT'; placement: PivotPlacement }
  | { type: 'MOVE_FIELD'; fieldKey: string; from: 'row' | 'column' | 'unused'; to: 'row' | 'column' | 'unused' }
  | { type: 'SET_AGGREGATE'; fieldKey: string; aggregate: PivotAggregateType }
  | { type: 'ADD_VALUE_FIELD'; field: PivotValueField }
  | { type: 'REMOVE_VALUE_FIELD'; fieldKey: string };

/** PivotTable context / PivotTable context */
export interface PivotTableContext {
  readonly placement: PivotPlacement;
}

/** PivotTable yapilandirma / PivotTable config */
export interface PivotTableConfig {
  /** Kullanilabilir alanlar / Available fields */
  fields: PivotField[];
  /** Baslangic yerlestirme / Initial placement */
  defaultPlacement?: PivotPlacement;
  /** Yerlestirme degisince / On placement change */
  onPlacementChange?: (placement: PivotPlacement) => void;
}

/** PivotTable API / PivotTable API */
export interface PivotTableAPI {
  getContext(): PivotTableContext;
  send(event: PivotTableEvent): void;
  subscribe(fn: () => void): () => void;
  destroy(): void;
}

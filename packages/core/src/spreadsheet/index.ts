/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export { createSpreadsheet } from './spreadsheet.machine';
export { evaluateFormula, parseRef, toRef } from './formula';
export type {
  CellType,
  CellValue,
  CellAddress,
  CellData,
  CellSelection,
  SheetData,
  UndoEntry,
  SpreadsheetEvent,
  SpreadsheetContext,
  SpreadsheetConfig,
  SpreadsheetAPI,
} from './spreadsheet.types';

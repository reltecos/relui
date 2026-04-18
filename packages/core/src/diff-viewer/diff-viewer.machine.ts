/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * DiffViewer — LCS tabanli satir diff algoritmasi.
 * DiffViewer — LCS-based line diff algorithm.
 *
 * @packageDocumentation
 */

import type { DiffLine, DiffResult } from './diff-viewer.types';

/**
 * Iki metin arasi farki hesaplar / Computes diff between two texts.
 */
export function computeDiff(oldText: string, newText: string): DiffResult {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');

  // LCS table
  const m = oldLines.length;
  const n = newLines.length;
  const dp: number[][] = [];
  for (let i = 0; i <= m; i++) {
    dp[i] = new Array(n + 1).fill(0);
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const dpRow = dp[i];
      const dpPrevRow = dp[i - 1];
      if (dpRow === undefined || dpPrevRow === undefined) continue;
      if (oldLines[i - 1] === newLines[j - 1]) {
        dpRow[j] = (dpPrevRow[j - 1] ?? 0) + 1;
      } else {
        dpRow[j] = Math.max(dpPrevRow[j] ?? 0, dpRow[j - 1] ?? 0);
      }
    }
  }

  // Backtrack to build diff
  const lines: DiffLine[] = [];
  let i = m;
  let j = n;

  const tempLines: DiffLine[] = [];

  while (i > 0 || j > 0) {
    const dpRow = dp[i];
    const dpPrevRow = i > 0 ? dp[i - 1] : undefined;
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      tempLines.push({
        type: 'equal',
        oldValue: oldLines[i - 1] ?? '',
        newValue: newLines[j - 1] ?? '',
        oldNum: i,
        newNum: j,
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || (dpRow !== undefined && dpPrevRow !== undefined && (dpRow[j] ?? 0) > (dpPrevRow[j] ?? 0)))) {
      tempLines.push({
        type: 'add',
        oldValue: '',
        newValue: newLines[j - 1] ?? '',
        oldNum: null,
        newNum: j,
      });
      j--;
    } else {
      tempLines.push({
        type: 'remove',
        oldValue: oldLines[i - 1] ?? '',
        newValue: '',
        oldNum: i,
        newNum: null,
      });
      i--;
    }
  }

  // Reverse (backtrack produces reverse order)
  for (let k = tempLines.length - 1; k >= 0; k--) {
    const line = tempLines[k];
    if (line !== undefined) lines.push(line);
  }

  let addedCount = 0;
  let removedCount = 0;
  for (const line of lines) {
    if (line.type === 'add') addedCount++;
    if (line.type === 'remove') removedCount++;
  }

  return { lines, addedCount, removedCount };
}

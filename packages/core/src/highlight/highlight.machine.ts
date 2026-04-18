/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Highlight metin parcalama algoritmasi.
 * Highlight text segmentation algorithm.
 *
 * @packageDocumentation
 */

import type { HighlightSegment, HighlightResult } from './highlight.types';

/**
 * Metni verilen terimlere gore parcalar.
 * Segments text by given search terms.
 */
export function highlightText(
  text: string,
  terms: string | string[],
  caseSensitive = false,
): HighlightResult {
  const termList = Array.isArray(terms) ? terms : [terms];
  const validTerms = termList.filter((t) => t.length > 0);

  if (text.length === 0 || validTerms.length === 0) {
    return {
      segments: text.length > 0 ? [{ type: 'text', value: text, termIndex: -1 }] : [],
      matchCount: 0,
    };
  }

  // Build match map: for each char position, store which term matches
  const matchMap: Array<{ termIndex: number; length: number } | null> = new Array(text.length).fill(null);
  const compareText = caseSensitive ? text : text.toLowerCase();
  let matchCount = 0;

  for (let ti = 0; ti < validTerms.length; ti++) {
    const rawTerm = validTerms[ti];
    if (rawTerm === undefined) continue;
    const term = caseSensitive ? rawTerm : rawTerm.toLowerCase();
    let searchFrom = 0;
    while (searchFrom <= compareText.length - term.length) {
      const idx = compareText.indexOf(term, searchFrom);
      if (idx === -1) break;

      // Mark positions (longer match wins if overlap)
      let canMark = true;
      for (let j = idx; j < idx + term.length; j++) {
        const existing = matchMap[j];
        if (existing !== null && existing !== undefined && existing.length >= term.length) {
          canMark = false;
          break;
        }
      }

      if (canMark) {
        for (let j = idx; j < idx + term.length; j++) {
          matchMap[j] = { termIndex: ti, length: term.length };
        }
        matchCount++;
      }

      searchFrom = idx + 1;
    }
  }

  // Build segments from match map
  const segments: HighlightSegment[] = [];
  let i = 0;

  while (i < text.length) {
    const match = matchMap[i];
    if (match !== null && match !== undefined) {
      // Find contiguous match with same termIndex
      const matchTi = match.termIndex;
      let end = i;
      while (end < text.length) {
        const cur = matchMap[end];
        if (cur === null || cur === undefined || cur.termIndex !== matchTi) break;
        end++;
      }
      segments.push({ type: 'match', value: text.slice(i, end), termIndex: matchTi });
      i = end;
    } else {
      let end = i;
      while (end < text.length && matchMap[end] === null) {
        end++;
      }
      segments.push({ type: 'text', value: text.slice(i, end), termIndex: -1 });
      i = end;
    }
  }

  return { segments, matchCount };
}

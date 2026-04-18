/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Highlight tipleri.
 * Highlight types.
 *
 * @packageDocumentation
 */

/** Segment tipi / Segment type */
export type HighlightSegmentType = 'match' | 'text';

/** Metin segmenti / Text segment */
export interface HighlightSegment {
  /** Segment tipi / Segment type */
  type: HighlightSegmentType;
  /** Segment icerigi / Segment content */
  value: string;
  /** Eslesen terim indeksi (sadece match icin) / Matched term index (match only) */
  termIndex: number;
}

/** Highlight sonucu / Highlight result */
export interface HighlightResult {
  /** Segmentler / Segments */
  segments: HighlightSegment[];
  /** Toplam eslesen / Total matches */
  matchCount: number;
}

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * SplitPanel state machine — yatay/dikey bölme layout yönetimi.
 *
 * Panel boyutları, gutter sürükleme ve daraltma yönetir.
 *
 * @packageDocumentation
 */

import type {
  SplitPanelProps,
  SplitPanelEvent,
  SplitPanelAPI,
  SplitOrientation,
} from './split-panel.types';

/**
 * SplitPanel state machine oluşturur.
 *
 * @param props - SplitPanel yapılandırması.
 * @returns SplitPanel API.
 */
export function createSplitPanel(props: SplitPanelProps = {}): SplitPanelAPI {
  const panelCount = Math.max(2, props.panelCount ?? 2);
  let orientation: SplitOrientation = props.orientation ?? 'horizontal';
  const gutterSize = props.gutterSize ?? 8;
  const minSizes = props.minSizes ?? new Array(panelCount).fill(0) as number[];
  const maxSizes = props.maxSizes ?? new Array(panelCount).fill(Infinity) as number[];
  const collapsible = props.collapsible ?? new Array(panelCount).fill(false) as boolean[];
  let containerSize = props.containerSize ?? 0;

  // Panellerin px boyutları
  let sizes: number[] = props.defaultSizes
    ? [...props.defaultSizes]
    : new Array(panelCount).fill(0) as number[];

  // Daraltılmış panel'lerin eski boyutları
  const collapsedSizes: (number | null)[] = new Array(panelCount).fill(null) as (number | null)[];

  // Sürükleme state'i
  let dragging = false;
  let activeGutter: number | null = null;
  let dragStartSizes: number[] = [];

  /** Toplam gutter genişliği. */
  function totalGutterSize(): number {
    return gutterSize * (panelCount - 1);
  }

  /** Kullanılabilir alan. */
  function availableSpace(): number {
    return Math.max(0, containerSize - totalGutterSize());
  }

  /** Boyutları eşit dağıt (initial setup). */
  function distributeSizes(): void {
    const space = availableSpace();
    const perPanel = space / panelCount;
    for (let i = 0; i < panelCount; i++) {
      sizes[i] = perPanel;
    }
  }

  /** Boyutu min/max ile kısıtla. */
  function clampSize(index: number, size: number): number {
    const min = (minSizes[index] as number | undefined) ?? 0;
    const max = (maxSizes[index] as number | undefined) ?? Infinity;
    return Math.max(min, Math.min(max, size));
  }

  /** Başlangıçta boyutları ayarla. */
  if (containerSize > 0 && !props.defaultSizes) {
    distributeSizes();
  } else if (containerSize > 0 && props.defaultSizes) {
    // defaultSizes toplamı available space'e normalize et
    const sum = sizes.reduce((a, b) => a + b, 0);
    const space = availableSpace();
    if (sum > 0 && Math.abs(sum - space) > 1) {
      const ratio = space / sum;
      for (let i = 0; i < panelCount; i++) {
        sizes[i] = (sizes[i] as number) * ratio;
      }
    }
  }

  function send(event: SplitPanelEvent): void {
    switch (event.type) {
      case 'SET_CONTAINER_SIZE': {
        const oldSpace = availableSpace();
        containerSize = event.value;
        const newSpace = availableSpace();

        if (oldSpace <= 0) {
          // İlk boyut ayarı
          if (props.defaultSizes) {
            const sum = sizes.reduce((a, b) => a + b, 0);
            if (sum > 0) {
              const ratio = newSpace / sum;
              for (let i = 0; i < panelCount; i++) {
                sizes[i] = (sizes[i] as number) * ratio;
              }
            } else {
              distributeSizes();
            }
          } else {
            distributeSizes();
          }
        } else if (newSpace > 0) {
          // Oranları koru
          const ratio = newSpace / oldSpace;
          for (let i = 0; i < panelCount; i++) {
            sizes[i] = (sizes[i] as number) * ratio;
          }
        }
        break;
      }

      case 'DRAG_START': {
        if (event.gutterIndex < 0 || event.gutterIndex >= panelCount - 1) break;
        dragging = true;
        activeGutter = event.gutterIndex;
        dragStartSizes = [...sizes];
        break;
      }

      case 'DRAG': {
        if (!dragging || activeGutter === null) break;
        const g = activeGutter;
        const leftStart = dragStartSizes[g] as number;
        const rightStart = dragStartSizes[g + 1] as number;
        const total = leftStart + rightStart;

        let leftNew = leftStart + event.delta;
        let rightNew = rightStart - event.delta;

        // Min/max kısıtlama
        leftNew = clampSize(g, leftNew);
        rightNew = total - leftNew;
        rightNew = clampSize(g + 1, rightNew);
        leftNew = total - rightNew;
        leftNew = clampSize(g, leftNew);

        sizes[g] = leftNew;
        sizes[g + 1] = rightNew;
        break;
      }

      case 'DRAG_END': {
        dragging = false;
        activeGutter = null;
        dragStartSizes = [];
        break;
      }

      case 'TOGGLE_COLLAPSE': {
        const idx = event.panelIndex;
        if (idx < 0 || idx >= panelCount) break;
        if (!(collapsible[idx] as boolean | undefined)) break;

        if (collapsedSizes[idx] !== null) {
          // Expand — eski boyutu geri yükle
          const restoreSize = collapsedSizes[idx] as number;
          // Komşudan yer al
          const neighbor = idx === 0 ? 1 : idx - 1;
          const neighborSize = sizes[neighbor] as number;
          const take = Math.min(restoreSize, neighborSize - ((minSizes[neighbor] as number | undefined) ?? 0));

          sizes[idx] = take;
          sizes[neighbor] = neighborSize - take;
          collapsedSizes[idx] = null;
        } else {
          // Collapse — boyutu kaydet, sıfırla, komşuya ver
          const currentSize = sizes[idx] as number;
          collapsedSizes[idx] = currentSize;
          const neighbor = idx === 0 ? 1 : idx - 1;
          sizes[neighbor] = (sizes[neighbor] as number) + currentSize;
          sizes[idx] = 0;
        }
        break;
      }

      case 'SET_SIZES': {
        if (event.sizes.length === panelCount) {
          sizes = [...event.sizes];
          // Collapsed state'leri resetle
          for (let i = 0; i < panelCount; i++) {
            collapsedSizes[i] = null;
          }
        }
        break;
      }

      case 'SET_ORIENTATION': {
        orientation = event.value;
        break;
      }
    }
  }

  return {
    getSizes: () => [...sizes],
    isCollapsed: (panelIndex: number) => collapsedSizes[panelIndex] !== null,
    isDragging: () => dragging,
    getActiveGutter: () => activeGutter,
    getOrientation: () => orientation,
    getGutterSize: () => gutterSize,
    getPanelCount: () => panelCount,
    send,
  };
}

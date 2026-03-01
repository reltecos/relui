/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Sticky state machine — yapışkan eleman state yönetimi.
 *
 * Scroll pozisyonuna göre elemanın stuck/idle durumunu hesaplar.
 *
 * @packageDocumentation
 */

import type {
  StickyProps,
  StickyEvent,
  StickyAPI,
  StickyPosition,
  StickyState,
} from './sticky.types';

/**
 * Sticky state machine oluşturur.
 *
 * @param props - Sticky yapılandırması.
 * @returns Sticky API.
 */
export function createSticky(props: StickyProps = {}): StickyAPI {
  let position: StickyPosition = props.position ?? 'top';
  let offset: number = props.offset ?? 0;
  let enabled: boolean = props.enabled ?? true;
  let state: StickyState = 'idle';

  function computeState(
    containerTop: number,
    containerBottom: number,
    viewportHeight: number,
  ): StickyState {
    if (!enabled) return 'idle';

    if (position === 'top') {
      // Container'ın üstü viewport üst kenarı + offset'in üstündeyse → stuck
      if (containerTop <= offset) {
        // Container'ın altı da viewport'un üst kenarı + offset'in üstündeyse → released (geçti)
        if (containerBottom <= offset) {
          return 'released';
        }
        return 'stuck';
      }
      return 'idle';
    } else {
      // position === 'bottom'
      const threshold = viewportHeight - offset;
      if (containerBottom >= threshold) {
        if (containerTop >= threshold) {
          return 'released';
        }
        return 'stuck';
      }
      return 'idle';
    }
  }

  function send(event: StickyEvent): void {
    switch (event.type) {
      case 'UPDATE':
        state = computeState(
          event.containerTop,
          event.containerBottom,
          event.viewportHeight,
        );
        break;

      case 'SET_POSITION':
        position = event.value;
        break;

      case 'SET_OFFSET':
        offset = event.value;
        break;

      case 'SET_ENABLED':
        enabled = event.value;
        if (!enabled) state = 'idle';
        break;
    }
  }

  return {
    getState: () => state,
    isStuck: () => state === 'stuck',
    getPosition: () => position,
    getOffset: () => offset,
    isEnabled: () => enabled,
    send,
  };
}

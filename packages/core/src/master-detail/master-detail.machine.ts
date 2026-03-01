/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * MasterDetail state machine — liste + detay layout yönetimi.
 *
 * Seçim, panel daraltma, pozisyon ve görünürlük durumu yönetimi.
 *
 * @packageDocumentation
 */

import type {
  MasterDetailProps,
  MasterDetailEvent,
  MasterDetailAPI,
  MasterPosition,
  DetailVisibility,
} from './master-detail.types';

/**
 * MasterDetail state machine oluşturur.
 *
 * @param props - MasterDetail yapılandırması.
 * @returns MasterDetail API.
 */
export function createMasterDetail(props: MasterDetailProps = {}): MasterDetailAPI {
  let masterPosition: MasterPosition = props.masterPosition ?? 'left';
  let masterSize: number | string = props.masterSize ?? 300;
  const detailVisibility: DetailVisibility = props.detailVisibility ?? 'always';
  let selectedId: string | null = props.selectedId ?? null;
  let collapsed: boolean = props.collapsed ?? false;
  const collapsible: boolean = props.collapsible ?? false;

  function isDetailVisible(): boolean {
    switch (detailVisibility) {
      case 'always':
        return true;
      case 'onSelect':
        return selectedId !== null;
      case 'responsive':
        return true; // React tarafında breakpoint ile kontrol edilir
      default:
        return true;
    }
  }

  function send(event: MasterDetailEvent): void {
    switch (event.type) {
      case 'SELECT':
        selectedId = event.id;
        break;

      case 'DESELECT':
        selectedId = null;
        break;

      case 'TOGGLE_COLLAPSE':
        if (collapsible) {
          collapsed = !collapsed;
        }
        break;

      case 'SET_COLLAPSED':
        if (collapsible) {
          collapsed = event.value;
        }
        break;

      case 'SET_MASTER_SIZE':
        masterSize = event.value;
        break;

      case 'SET_MASTER_POSITION':
        masterPosition = event.value;
        break;
    }
  }

  return {
    getSelectedId: () => selectedId,
    hasSelection: () => selectedId !== null,
    isCollapsed: () => collapsed,
    getMasterPosition: () => masterPosition,
    getMasterSize: () => masterSize,
    isDetailVisible,
    send,
  };
}

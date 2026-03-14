/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Breadcrumb type definitions — framework-agnostic.
 * Breadcrumb tip tanımları — framework bağımsız.
 *
 * WAI-ARIA Breadcrumb pattern:
 * https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/
 *
 * @packageDocumentation
 */

/**
 * Breadcrumb boyutu / Breadcrumb size.
 */
export type BreadcrumbSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Tek breadcrumb öğesi / Single breadcrumb item.
 */
export interface BreadcrumbItem {
  /** Benzersiz tanımlayıcı / Unique identifier */
  key: string;

  /** Görünen etiket / Display label */
  label: string;

  /** Bağlantı adresi (opsiyonel, yoksa tıklanamaz) / Link href (optional) */
  href?: string;

  /** Pasif mi / Is disabled */
  disabled?: boolean;
}

/**
 * Core Breadcrumb props — framework-agnostic yapılandırma.
 * Core Breadcrumb props — framework-agnostic configuration.
 */
export interface BreadcrumbProps {
  /** Breadcrumb öğeleri / Breadcrumb items */
  items: BreadcrumbItem[];

  /** Maksimum görünen öğe sayısı (0=sınırsız) / Max visible items (0=unlimited) */
  maxItems?: number;

  /** Daraltıldığında baştan kaç öğe gösterilsin / Items to show from start when collapsed */
  itemsBeforeCollapse?: number;

  /** Daraltıldığında sondan kaç öğe gösterilsin / Items to show from end when collapsed */
  itemsAfterCollapse?: number;
}

/**
 * Breadcrumb machine context — iç durum.
 * Breadcrumb machine context — internal state.
 */
export interface BreadcrumbMachineContext {
  /** Tüm öğeler / All items */
  items: BreadcrumbItem[];

  /** Daraltılmış mı / Is collapsed */
  collapsed: boolean;

  /** Maksimum görünen öğe / Max visible items */
  maxItems: number;

  /** Baştan kaç öğe / Items from start */
  itemsBeforeCollapse: number;

  /** Sondan kaç öğe / Items from end */
  itemsAfterCollapse: number;
}

/**
 * State machine'e gönderilebilecek event'ler.
 * Events that can be sent to the state machine.
 */
export type BreadcrumbEvent =
  | { type: 'EXPAND' }
  | { type: 'COLLAPSE' }
  | { type: 'SET_ITEMS'; items: BreadcrumbItem[] }
  | { type: 'SET_MAX_ITEMS'; maxItems: number };

/**
 * Görünür öğe bilgisi / Visible item info.
 *
 * Daraltma durumunda orta kısım ellipsis ile değiştirilir.
 */
export interface BreadcrumbVisibleItem {
  /** Gerçek öğe veya ellipsis placeholder / Real item or ellipsis placeholder */
  type: 'item' | 'ellipsis';

  /** Öğe (type='item' ise) / Item (if type='item') */
  item?: BreadcrumbItem;

  /** Son öğe mi (aria-current="page") / Is last item */
  isLast: boolean;
}

/**
 * Nav DOM attribute'ları / Nav DOM attributes.
 */
export interface BreadcrumbNavDOMProps {
  'aria-label': string;
}

/**
 * Liste DOM attribute'ları / List DOM attributes.
 */
export interface BreadcrumbListDOMProps {
  role: undefined;
}

/**
 * Öğe DOM attribute'ları / Item DOM attributes.
 */
export interface BreadcrumbItemDOMProps {
  'aria-current': 'page' | undefined;
  'aria-disabled': true | undefined;
  'data-disabled': '' | undefined;
}

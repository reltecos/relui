/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/** Ozellik tipi / Property type */
export type PropertyType = 'string' | 'number' | 'boolean' | 'color' | 'enum';

/** Ozellik tanimi / Property definition */
export interface PropertyDef {
  /** Benzersiz anahtar / Unique key */
  key: string;
  /** Etiket / Label */
  label: string;
  /** Tip / Type */
  type: PropertyType;
  /** Kategori / Category */
  category?: string;
  /** Deger / Value */
  value: unknown;
  /** Enum secenekleri / Enum options */
  options?: string[];
  /** Salt okunur / Readonly */
  readonly?: boolean;
  /** Aciklama / Description */
  description?: string;
}

/** PropertyGrid event tipleri / PropertyGrid event types */
export type PropertyGridEvent =
  | { type: 'SET_VALUE'; key: string; value: unknown }
  | { type: 'TOGGLE_CATEGORY'; category: string }
  | { type: 'EXPAND_ALL' }
  | { type: 'COLLAPSE_ALL'; categories: string[] }
  | { type: 'SET_FILTER'; filter: string };

/** PropertyGrid context / PropertyGrid context */
export interface PropertyGridContext {
  readonly values: ReadonlyMap<string, unknown>;
  readonly collapsedCategories: ReadonlySet<string>;
  readonly filter: string;
}

/** PropertyGrid yapilandirma / PropertyGrid config */
export interface PropertyGridConfig {
  /** Ozellik tanimlari / Property definitions */
  properties: PropertyDef[];
  /** Deger degisince / On value change */
  onValueChange?: (key: string, value: unknown) => void;
}

/** PropertyGrid API / PropertyGrid API */
export interface PropertyGridAPI {
  getContext(): PropertyGridContext;
  send(event: PropertyGridEvent): void;
  subscribe(fn: () => void): () => void;
  destroy(): void;
}

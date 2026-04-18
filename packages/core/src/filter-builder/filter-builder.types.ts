/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * FilterBuilder tipleri.
 * FilterBuilder types.
 *
 * @packageDocumentation
 */

/** Filtre operatoru / Filter operator */
export type FilterBuilderOperator = '=' | '!=' | '>' | '<' | '>=' | '<=' | 'contains' | 'not_contains' | 'starts_with' | 'ends_with' | 'between' | 'is_empty' | 'is_not_empty';

/** Grup birlestiricisi / Group combinator */
export type FilterCombinator = 'and' | 'or';

/** Alan tanimlari / Field definition */
export interface FilterField {
  /** Alan anahtari / Field key */
  key: string;
  /** Alan etiketi / Field label */
  label: string;
  /** Alan tipi / Field type */
  type: 'string' | 'number' | 'date' | 'boolean';
}

/** Tekil kural / Single rule */
export interface FilterRule {
  /** Benzersiz id / Unique ID */
  id: string;
  /** Alan anahtari / Field key */
  field: string;
  /** Operator / Operator */
  operator: FilterBuilderOperator;
  /** Deger / Value */
  value: string;
  /** Ikinci deger (between icin) / Second value (for between) */
  value2?: string;
}

/** Kural grubu / Rule group */
export interface FilterGroup {
  /** Benzersiz id / Unique ID */
  id: string;
  /** Birlestiricisi / Combinator */
  combinator: FilterCombinator;
  /** Kurallar ve alt gruplar / Rules and sub-groups */
  children: Array<FilterRule | FilterGroup>;
}

/** Kural mi grup mu / Is rule or group */
export function isFilterGroup(item: FilterRule | FilterGroup): item is FilterGroup {
  return 'combinator' in item && 'children' in item;
}

/** FilterBuilder context */
export interface FilterBuilderContext {
  /** Kok grup / Root group */
  readonly rootGroup: FilterGroup;
}

/** FilterBuilder event leri */
export type FilterBuilderEvent =
  | { type: 'ADD_RULE'; groupId: string; rule: FilterRule }
  | { type: 'REMOVE_RULE'; ruleId: string }
  | { type: 'UPDATE_RULE'; ruleId: string; updates: Partial<Pick<FilterRule, 'field' | 'operator' | 'value' | 'value2'>> }
  | { type: 'ADD_GROUP'; parentGroupId: string; group: FilterGroup }
  | { type: 'REMOVE_GROUP'; groupId: string }
  | { type: 'SET_COMBINATOR'; groupId: string; combinator: FilterCombinator }
  | { type: 'RESET' };

/** FilterBuilder yapilandirmasi */
export interface FilterBuilderConfig {
  /** Baslangic grubu / Initial root group */
  defaultGroup?: FilterGroup;
  /** Degisiklik callback / On change callback */
  onChange?: (group: FilterGroup) => void;
}

/** FilterBuilder API */
export interface FilterBuilderAPI {
  getContext(): FilterBuilderContext;
  send(event: FilterBuilderEvent): void;
  subscribe(callback: () => void): () => void;
  destroy(): void;
  /** JSON serialize */
  toJSON(): FilterGroup;
}

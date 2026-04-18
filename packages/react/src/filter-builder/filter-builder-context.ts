/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createContext, useContext } from 'react';
import type { FilterBuilderAPI, FilterBuilderContext, FilterField, FilterBuilderOperator } from '@relteco/relui-core';
import type { ClassNames, Styles } from '../utils/slot-styles';
import type { FilterBuilderSlot } from './FilterBuilder';

export interface FilterBuilderContextValue {
  api: FilterBuilderAPI;
  ctx: FilterBuilderContext;
  fields: FilterField[];
  operators: FilterBuilderOperator[];
  classNames: ClassNames<FilterBuilderSlot> | undefined;
  styles: Styles<FilterBuilderSlot> | undefined;
}

export const FilterBuilderCtx = createContext<FilterBuilderContextValue | null>(null);

export function useFilterBuilderContext(): FilterBuilderContextValue {
  const c = useContext(FilterBuilderCtx);
  if (!c) throw new Error('FilterBuilder compound sub-components must be used within <FilterBuilder>.');
  return c;
}

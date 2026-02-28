/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * ButtonGroup React context — child bileşenlere grup props aktarır.
 * ButtonGroup React context — passes group props to child components.
 *
 * @packageDocumentation
 */

import { createContext, useContext } from 'react';
import type { ButtonGroupContext as ButtonGroupContextType } from '@relteco/relui-core';

/**
 * ButtonGroup context.
 *
 * null = bir ButtonGroup içinde değil (child kendi props'unu kullanır).
 */
const ButtonGroupCtx = createContext<ButtonGroupContextType | null>(null);

/**
 * ButtonGroup context provider.
 */
export const ButtonGroupProvider = ButtonGroupCtx.Provider;

/**
 * ButtonGroup context hook'u.
 *
 * Child Button/IconButton bu hook ile grup props'larını alır.
 * Grup dışındayken null döner — child kendi props'unu kullanır.
 *
 * @example
 * ```ts
 * const groupCtx = useButtonGroupContext();
 * const effectiveSize = groupCtx?.size ?? props.size ?? 'md';
 * ```
 */
export function useButtonGroupContext(): ButtonGroupContextType | null {
  return useContext(ButtonGroupCtx);
}

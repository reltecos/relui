/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * RadioGroup context — child Radio'lara ortak props aktarır.
 * RadioGroup context — passes shared props to child Radio components.
 *
 * @packageDocumentation
 */

import { createContext, useContext } from 'react';
import type { RadioGroupContext as RadioGroupContextType } from '@relteco/relui-core';

const RadioGroupCtx = createContext<RadioGroupContextType | null>(null);

export const RadioGroupProvider = RadioGroupCtx.Provider;

/**
 * RadioGroup context'ini oku.
 * Read RadioGroup context.
 *
 * @returns RadioGroup context veya null (grup dışında)
 */
export function useRadioGroupContext(): RadioGroupContextType | null {
  return useContext(RadioGroupCtx);
}

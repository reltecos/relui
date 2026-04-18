/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createContext, useContext } from 'react';
import type { TimeSpanAPI, TimeSpanContext } from '@relteco/relui-core';
import type { ClassNames, Styles } from '../utils/slot-styles';
import type { TimeSpanEditorSlot } from './TimeSpanEditor';

export interface TimeSpanEditorContextValue {
  api: TimeSpanAPI;
  ctx: TimeSpanContext;
  showSeconds: boolean;
  classNames: ClassNames<TimeSpanEditorSlot> | undefined;
  styles: Styles<TimeSpanEditorSlot> | undefined;
}

export const TimeSpanEditorCtx = createContext<TimeSpanEditorContextValue | null>(null);

export function useTimeSpanEditorContext(): TimeSpanEditorContextValue {
  const c = useContext(TimeSpanEditorCtx);
  if (!c) throw new Error('TimeSpanEditor compound sub-components must be used within <TimeSpanEditor>.');
  return c;
}

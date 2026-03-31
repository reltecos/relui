/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createContext, useContext } from 'react';
import type { CalendarAPI, CalendarContext, CalendarDay } from '@relteco/relui-core';
import type { ClassNames, Styles } from '../utils/slot-styles';
import type { CalendarSlot } from './Calendar';

export interface CalendarContextValue {
  api: CalendarAPI;
  ctx: CalendarContext;
  days: CalendarDay[];
  weekdayNames: string[];
  locale: string;
  monthLabel: string;
  classNames: ClassNames<CalendarSlot> | undefined;
  styles: Styles<CalendarSlot> | undefined;
}

export const CalendarCtx = createContext<CalendarContextValue | null>(null);

export function useCalendarContext(): CalendarContextValue {
  const c = useContext(CalendarCtx);
  if (!c) throw new Error('Calendar compound sub-components must be used within <Calendar>.');
  return c;
}

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createContext, useContext } from 'react';
import type { DiffResult } from '@relteco/relui-core';
import type { ClassNames, Styles } from '../utils/slot-styles';
import type { DiffViewerSlot, DiffViewerMode } from './DiffViewer';

export interface DiffViewerContextValue {
  result: DiffResult;
  mode: DiffViewerMode;
  showLineNumbers: boolean;
  classNames: ClassNames<DiffViewerSlot> | undefined;
  styles: Styles<DiffViewerSlot> | undefined;
}

export const DiffViewerCtx = createContext<DiffViewerContextValue | null>(null);

export function useDiffViewerContext(): DiffViewerContextValue {
  const c = useContext(DiffViewerCtx);
  if (!c) throw new Error('DiffViewer compound sub-components must be used within <DiffViewer>.');
  return c;
}

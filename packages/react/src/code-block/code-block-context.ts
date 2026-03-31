/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createContext, useContext } from 'react';
import type { CodeLanguage, HighlightResult } from '@relteco/relui-core';
import type { ClassNames, Styles } from '../utils/slot-styles';
import type { CodeBlockSlot } from './CodeBlock';

/** CodeBlock Context icerigi / CodeBlock context value */
export interface CodeBlockContextValue {
  code: string;
  language: CodeLanguage;
  theme: 'light' | 'dark';
  showLineNumbers: boolean;
  result: HighlightResult;
  classNames: ClassNames<CodeBlockSlot> | undefined;
  styles: Styles<CodeBlockSlot> | undefined;
}

export const CodeBlockCtx = createContext<CodeBlockContextValue | null>(null);

export function useCodeBlockContext(): CodeBlockContextValue {
  const ctx = useContext(CodeBlockCtx);
  if (!ctx) throw new Error('CodeBlock compound sub-components must be used within <CodeBlock>.');
  return ctx;
}

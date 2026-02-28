/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * FormField React context.
 *
 * Alt bileşenlere (Input, Textarea, Select vs.) form field bağlamını aktarır.
 * Passes form field context to child components (Input, Textarea, Select, etc.).
 *
 * @packageDocumentation
 */

import { createContext, useContext } from 'react';
import type { FormFieldContext } from '@relteco/relui-core';

/**
 * FormField React context'i.
 */
export const FormFieldReactContext = createContext<FormFieldContext | null>(null);

/**
 * FormField context hook'u.
 * Null dönebilir — FormField dışında kullanıldığında.
 *
 * @example
 * ```tsx
 * const field = useFormFieldContext();
 * if (field) {
 *   // FormField içinde
 * }
 * ```
 */
export function useFormFieldContext(): FormFieldContext | null {
  return useContext(FormFieldReactContext);
}

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { createFormFieldIds } from './form-field.types';

describe('createFormFieldIds', () => {
  it('doğru ID\'ler üretir / generates correct IDs', () => {
    const ids = createFormFieldIds('email');

    expect(ids.inputId).toBe('email');
    expect(ids.labelId).toBe('email-label');
    expect(ids.helperId).toBe('email-helper');
    expect(ids.errorId).toBe('email-error');
  });

  it('farklı baseId ile çalışır', () => {
    const ids = createFormFieldIds('user-name');

    expect(ids.inputId).toBe('user-name');
    expect(ids.labelId).toBe('user-name-label');
    expect(ids.helperId).toBe('user-name-helper');
    expect(ids.errorId).toBe('user-name-error');
  });
});

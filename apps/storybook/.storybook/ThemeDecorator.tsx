/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 */

import React, { useMemo } from 'react';
import type { Decorator } from '@storybook/react';
import { generateCSS, themes } from '@relteco/relui-tokens';

/**
 * Storybook tema decorator'ı.
 *
 * Token CSS'lerini inject eder ve data-theme attribute'unu
 * toolbar'daki tema seçimine göre ayarlar.
 */
export const ThemeDecorator: Decorator = (Story, context) => {
  const themeVariant = context.globals['theme'] ?? 'default-dark';

  const tokenCSS = useMemo(() => generateCSS(themes), []);

  return (
    <div data-theme={themeVariant} style={{ padding: '1rem' }}>
      <style>{tokenCSS}</style>
      <Story />
    </div>
  );
};

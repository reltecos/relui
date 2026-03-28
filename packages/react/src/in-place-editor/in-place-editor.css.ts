/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * InPlaceEditor CSS — Vanilla Extract.
 * Display (okuma modu) ve actions stili.
 * Input stili input.css.ts'den reuse edilir.
 *
 * @packageDocumentation
 */

import { style } from '@vanilla-extract/css';
import { cssVar } from '@relteco/relui-tokens';

/** Root wrapper — inline-flex container */
export const inPlaceEditorRootStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  color: 'var(--rel-color-text, #374151)',
  gap: 'var(--rel-spacing-1)',
  width: '100%',
});

/** Display (okuma modu) — tıklanabilir metin */
export const inPlaceEditorDisplayStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 'var(--rel-spacing-8)',
  padding: '2px 4px',
  borderRadius: 'var(--rel-radius-sm)',
  border: '1px solid transparent',
  cursor: 'pointer',
  transition: 'border-color 150ms ease, background-color 150ms ease',
  width: '100%',
  lineHeight: 1.5,
  color: cssVar.textDefault,

  ':hover': {
    borderColor: cssVar.borderDefault,
    backgroundColor: cssVar.bgSubtle,
  },

  ':focus-visible': {
    outline: `2px solid ${cssVar.focusRing}`,
    outlineOffset: '1px',
  },

  selectors: {
    '&[data-disabled]': {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
    '&[data-disabled]:hover': {
      borderColor: 'transparent',
      backgroundColor: 'transparent',
    },
    '&[data-readonly]': {
      cursor: 'default',
    },
    '&[data-readonly]:hover': {
      borderColor: 'transparent',
      backgroundColor: 'transparent',
    },
  },
});

/** Placeholder metin stili */
export const inPlaceEditorPlaceholderStyle = style({
  color: cssVar.textMuted,
  fontStyle: 'italic',
});

/** Actions container — onay/iptal butonları */
export const inPlaceEditorActionsStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--rel-spacing-1)',
  flexShrink: 0,
});

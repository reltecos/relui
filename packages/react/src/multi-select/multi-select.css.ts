/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * MultiSelect ek stiller — Select CSS'ini reuse eder.
 * MultiSelect extra styles — reuses Select CSS.
 *
 * @packageDocumentation
 */

import { style } from '@vanilla-extract/css';
import { cssVar } from '@relteco/relui-tokens';

// ── Trigger içindeki chip/tag alanı ─────────────────────────────────

export const multiSelectTagsStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.25rem',
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
});

export const multiSelectTagStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
  maxWidth: '100%',
  padding: '0 0.375rem',
  height: '1.25rem',
  fontSize: 'var(--rel-text-2xs)',
  lineHeight: 1,
  borderRadius: 'var(--rel-radius-sm)',
  background: cssVar.bgSubtle,
  color: cssVar.fgDefault,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const multiSelectTagRemoveStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '0.875rem',
  height: '0.875rem',
  borderRadius: 'var(--rel-radius-sm)',
  border: 'none',
  background: 'transparent',
  color: cssVar.fgMuted,
  cursor: 'pointer',
  padding: 0,
  fontSize: '0.625rem',
  lineHeight: 1,
  transition: 'background-color var(--rel-duration-fast) var(--rel-ease-ease)',
  selectors: {
    '&:hover': {
      background: cssVar.borderDefault,
      color: cssVar.fgDefault,
    },
  },
});

// ── Checkbox göstergesi (option içinde) ─────────────────────────────

export const multiSelectCheckboxStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '1rem',
  height: '1rem',
  borderRadius: 'var(--rel-radius-sm)',
  border: `1.5px solid ${cssVar.borderDefault}`,
  background: 'transparent',
  transition: 'all var(--rel-duration-fast) var(--rel-ease-ease)',
  selectors: {
    '&[data-checked]': {
      background: cssVar.accentDefault,
      borderColor: cssVar.accentDefault,
      color: 'var(--rel-color-text-inverse, #fff)',
    },
  },
});

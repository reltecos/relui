/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * DropdownTree styles — Vanilla Extract.
 * DropdownTree stilleri — Vanilla Extract.
 *
 * Trigger: Select trigger recipe reuse.
 * Panel: Tree view dropdown paneli.
 *
 * @packageDocumentation
 */

import { style } from '@vanilla-extract/css';
import { cssVar } from '@relteco/relui-tokens';

// ── Root wrapper — color token for DropdownTree ─────────────────────
export const dropdownTreeRootStyle = style({
  color: 'var(--rel-color-text, #374151)',
});

// ── Tree node (treeitem satırı) ──────────────────────────────────────

export const dropdownTreeNodeStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--rel-spacing-1.5)',
  paddingTop: 'var(--rel-spacing-1)',
  paddingBottom: 'var(--rel-spacing-1)',
  paddingRight: 'var(--rel-spacing-3)',
  fontSize: 'var(--rel-text-sm)',
  lineHeight: '1.5',
  cursor: 'pointer',
  color: cssVar.fgDefault,
  transition: 'background-color var(--rel-duration-fast) var(--rel-ease-ease)',
  userSelect: 'none',

  selectors: {
    '&[data-highlighted]': {
      background: cssVar.bgSubtle,
    },

    '&[aria-selected="true"]': {
      fontWeight: 'var(--rel-font-medium)',
      color: cssVar.accentDefault,
    },

    '&[data-disabled]': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
});

// ── Expand/collapse toggle ikonu ─────────────────────────────────────

export const dropdownTreeExpandIconStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '1rem',
  height: '1rem',
  color: cssVar.fgMuted,
  transition: 'transform var(--rel-duration-fast) var(--rel-ease-ease)',

  selectors: {
    '&[data-expanded]': {
      transform: 'rotate(90deg)',
    },
  },
});

// ── Expand spacer (leaf node için boşluk) ────────────────────────────

export const dropdownTreeExpandSpacerStyle = style({
  display: 'inline-block',
  width: '1rem',
  flexShrink: 0,
});

// ── Checkbox göstergesi (multiple mode) ──────────────────────────────

export const dropdownTreeCheckboxStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '1rem',
  height: '1rem',
  borderRadius: 'var(--rel-radius-sm)',
  border: `1.5px solid ${cssVar.borderDefault}`,
  flexShrink: 0,
  transition: 'border-color var(--rel-duration-fast) var(--rel-ease-ease), background-color var(--rel-duration-fast) var(--rel-ease-ease)',

  selectors: {
    '&[data-checked]': {
      background: cssVar.accentDefault,
      borderColor: cssVar.accentDefault,
    },
  },
});

// ── Node label ───────────────────────────────────────────────────────

export const dropdownTreeNodeLabelStyle = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flex: 1,
});

// ── Tag (multiple mode — seçili tag'ler trigger'da) ──────────────────

export const dropdownTreeTagsStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--rel-spacing-1)',
  alignItems: 'center',
  overflow: 'hidden',
  flex: 1,
});

export const dropdownTreeTagStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--rel-spacing-0.5)',
  paddingLeft: 'var(--rel-spacing-1.5)',
  paddingRight: 'var(--rel-spacing-1)',
  paddingTop: '1px',
  paddingBottom: '1px',
  fontSize: 'var(--rel-text-xs)',
  lineHeight: '1.4',
  borderRadius: 'var(--rel-radius-sm)',
  background: cssVar.bgSubtle,
  color: cssVar.fgDefault,
  maxWidth: '10rem',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const dropdownTreeTagRemoveStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '0.875rem',
  height: '0.875rem',
  borderRadius: 'var(--rel-radius-xs)',
  background: 'transparent',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  color: cssVar.fgMuted,
  flexShrink: 0,

  selectors: {
    '&:hover': {
      background: cssVar.bgDefault,
      color: cssVar.fgDefault,
    },
  },
});

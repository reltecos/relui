/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style } from '@vanilla-extract/css';

// ── Root ────────────────────────────────────────────

export const rootStyle = style({
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  fontSize: 'var(--rel-text-sm, 14px)',
  color: 'var(--rel-color-text, #374151)',
  lineHeight: 1.5,
  height: '100%',
});

// ── MessageList ─────────────────────────────────────

export const messageListStyle = style({
  flex: 1,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: '16px',
});

// ── Message ─────────────────────────────────────────

export const messageStyle = style({
  display: 'flex',
  gap: 8,
  maxWidth: '80%',
});

export const messageIncomingStyle = style({
  alignSelf: 'flex-start',
});

export const messageOutgoingStyle = style({
  alignSelf: 'flex-end',
  flexDirection: 'row-reverse',
});

// ── Bubble ──────────────────────────────────────────

export const bubbleStyle = style({
  padding: '8px 12px',
  borderRadius: 12,
  fontSize: 'var(--rel-text-sm, 14px)',
  lineHeight: 1.5,
  wordBreak: 'break-word',
  maxWidth: '100%',
});

export const bubbleIncomingStyle = style({
  backgroundColor: 'var(--rel-color-bg-muted, #f3f4f6)',
  color: 'var(--rel-color-text, #374151)',
  borderBottomLeftRadius: 4,
});

export const bubbleOutgoingStyle = style({
  backgroundColor: 'var(--rel-color-primary, #3b82f6)',
  color: 'var(--rel-color-bg, #ffffff)',
  borderBottomRightRadius: 4,
});

// ── Avatar ──────────────────────────────────────────

export const avatarStyle = style({
  width: 32,
  height: 32,
  borderRadius: '50%',
  flexShrink: 0,
  objectFit: 'cover',
  backgroundColor: 'var(--rel-color-bg-muted, #e5e7eb)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 'var(--rel-text-xs, 12px)',
  fontWeight: 600,
  color: 'var(--rel-color-text-secondary, #6b7280)',
  overflow: 'hidden',
});

// ── Timestamp ───────────────────────────────────────

export const timestampStyle = style({
  fontSize: 'var(--rel-text-xs, 11px)',
  color: 'var(--rel-color-text-secondary, #9ca3af)',
  marginTop: 2,
  lineHeight: 1.3,
});

// ── Input ───────────────────────────────────────────

export const inputContainerStyle = style({
  display: 'flex',
  gap: 8,
  padding: '12px 16px',
  borderTop: '1px solid var(--rel-color-border, #e5e7eb)',
  backgroundColor: 'var(--rel-color-bg, #ffffff)',
});

export const inputFieldStyle = style({
  flex: 1,
  padding: '8px 12px',
  border: '1px solid var(--rel-color-border, #d1d5db)',
  borderRadius: 20,
  fontSize: 'var(--rel-text-sm, 14px)',
  outline: 'none',
  backgroundColor: 'var(--rel-color-bg, #ffffff)',
  color: 'var(--rel-color-text, #374151)',
  lineHeight: 1.5,
  resize: 'none',
  fontFamily: 'inherit',
});

export const sendButtonStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  borderRadius: '50%',
  border: 'none',
  backgroundColor: 'var(--rel-color-primary, #3b82f6)',
  color: 'var(--rel-color-bg, #ffffff)',
  cursor: 'pointer',
  padding: 0,
  flexShrink: 0,
  alignSelf: 'flex-end',
  fontSize: 'var(--rel-text-sm, 14px)',
  fontWeight: 600,
  transition: 'opacity 150ms ease',
  ':hover': {
    opacity: 0.85,
  },
  ':disabled': {
    opacity: 0.5,
    cursor: 'default',
  },
});

// ── Typing Indicator ────────────────────────────────

export const typingIndicatorStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  padding: '4px 16px',
  fontSize: 'var(--rel-text-xs, 12px)',
  color: 'var(--rel-color-text-secondary, #9ca3af)',
  fontStyle: 'italic',
});

// ── Date Separator ──────────────────────────────────

export const dateSeparatorStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '8px 0',
});

export const dateSeparatorTextStyle = style({
  fontSize: 'var(--rel-text-xs, 11px)',
  fontWeight: 500,
  color: 'var(--rel-color-text-secondary, #9ca3af)',
  padding: '2px 12px',
  backgroundColor: 'var(--rel-color-bg-muted, #f3f4f6)',
  borderRadius: 10,
});

// ── Reactions ───────────────────────────────────────

export const reactionsStyle = style({
  display: 'flex',
  gap: 4,
  marginTop: 4,
  flexWrap: 'wrap',
});

export const reactionBadgeStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 2,
  padding: '1px 6px',
  borderRadius: 10,
  fontSize: 'var(--rel-text-xs, 11px)',
  backgroundColor: 'var(--rel-color-bg-muted, #f3f4f6)',
  border: '1px solid var(--rel-color-border, #e5e7eb)',
  cursor: 'pointer',
  lineHeight: 1.6,
});

// ── Status ──────────────────────────────────────────

export const statusStyle = style({
  fontSize: 9,
  lineHeight: 1,
  color: 'var(--rel-color-text-secondary, #9ca3af)',
  textAlign: 'right',
  marginTop: 2,
});

export const statusReadStyle = style({
  color: 'var(--rel-color-primary, #3b82f6)',
});

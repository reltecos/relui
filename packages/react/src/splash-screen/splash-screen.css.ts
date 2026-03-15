/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { style, keyframes } from '@vanilla-extract/css';

// ── Animations ──────────────────────────────────────

const fadeIn = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

const fadeOut = keyframes({
  '0%': { opacity: 1 },
  '100%': { opacity: 0 },
});

const progressStripe = keyframes({
  '0%': { backgroundPosition: '0 0' },
  '100%': { backgroundPosition: '40px 0' },
});

// ── Root / Overlay ─────────────────────────────────

export const splashScreenRootStyle = style({
  position: 'fixed',
  inset: 0,
  zIndex: 99999,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'var(--rel-color-bg, #ffffff)',
  fontFamily: 'var(--rel-font-sans, system-ui, sans-serif)',
  animation: `${fadeIn} 300ms ease-out`,
});

export const splashScreenRootClosingStyle = style({
  animation: `${fadeOut} 400ms ease-in forwards`,
});

// ── Content ─────────────────────────────────────────

export const splashScreenContentStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 24,
  maxWidth: 400,
  width: '100%',
  padding: '0 24px',
});

// ── Logo ────────────────────────────────────────────

export const splashScreenLogoStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 8,
});

// ── Title ───────────────────────────────────────────

export const splashScreenTitleStyle = style({
  fontSize: 'var(--rel-text-xl, 24px)',
  fontWeight: 700,
  color: 'var(--rel-color-text, #111827)',
  textAlign: 'center',
  margin: 0,
});

// ── Message ─────────────────────────────────────────

export const splashScreenMessageStyle = style({
  fontSize: 'var(--rel-text-sm, 13px)',
  color: 'var(--rel-color-text-secondary, #6b7280)',
  textAlign: 'center',
  minHeight: 20,
});

// ── Progress track ──────────────────────────────────

export const splashScreenProgressTrackStyle = style({
  width: '100%',
  height: 4,
  borderRadius: 2,
  backgroundColor: 'var(--rel-color-bg-hover, #e5e7eb)',
  overflow: 'hidden',
});

// ── Progress fill ───────────────────────────────────

export const splashScreenProgressFillStyle = style({
  height: '100%',
  borderRadius: 2,
  backgroundColor: 'var(--rel-color-primary, #3b82f6)',
  transition: 'width 300ms ease',
  backgroundImage:
    'linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)',
  backgroundSize: '40px 40px',
  animation: `${progressStripe} 1s linear infinite`,
});

// ── Version ─────────────────────────────────────────

export const splashScreenVersionStyle = style({
  fontSize: 11,
  color: 'var(--rel-color-text-secondary, #9ca3af)',
  marginTop: 8,
});

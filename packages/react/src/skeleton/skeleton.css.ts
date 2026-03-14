/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { recipe } from '@vanilla-extract/recipes';
import { keyframes } from '@vanilla-extract/css';

// ── Animations ──────────────────────────────────────

const shimmer = keyframes({
  '0%': { backgroundPosition: '-200% 0' },
  '100%': { backgroundPosition: '200% 0' },
});

const pulse = keyframes({
  '0%, 100%': { opacity: 1 },
  '50%': { opacity: 0.4 },
});

// ── Root recipe ─────────────────────────────────────

export const skeletonRootRecipe = recipe({
  base: {
    display: 'block',
    backgroundColor: 'var(--rel-color-neutral-100, #e2e8f0)',
    overflow: 'hidden',
    position: 'relative' as const,
  },
  variants: {
    variant: {
      text: {
        borderRadius: 4,
        height: '1em',
        width: '100%',
      },
      circle: {
        borderRadius: '50%',
      },
      rect: {
        borderRadius: 4,
      },
    },
    animation: {
      shimmer: {
        background: `linear-gradient(
          90deg,
          var(--rel-color-neutral-100, #e2e8f0) 25%,
          var(--rel-color-neutral-50, #f8fafc) 37%,
          var(--rel-color-neutral-100, #e2e8f0) 63%
        )`,
        backgroundSize: '200% 100%',
        animation: `${shimmer} 1.5s ease-in-out infinite`,
      },
      pulse: {
        animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
      },
      none: {
        animation: 'none',
      },
    },
  },
  defaultVariants: {
    variant: 'text',
    animation: 'shimmer',
  },
});

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @relteco/relui-tokens
 *
 * Design tokens for RelUI — colors, typography, spacing, radius, shadow.
 * CSS Variables + design token sistemi, framework-agnostic.
 *
 * 3 tema ailesi: Default (mavi), Ocean (teal), Forest (yeşil)
 * Her birinin dark + light varyantı mevcut.
 *
 * @packageDocumentation
 */

// Primitive tokens
export * from './primitives';

// Theme definitions
export * from './themes';

// CSS generation utilities
export { generateCSS, cssVar } from './css';

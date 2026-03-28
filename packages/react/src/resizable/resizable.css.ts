/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Resizable styles — Vanilla Extract.
 * Boyutlandırılabilir eleman ve handle stilleri.
 *
 * @packageDocumentation
 */

import { style } from '@vanilla-extract/css';

export const rootStyle = style({
  position: 'relative',
  overflow: 'hidden',
  color: 'var(--rel-color-text, #374151)',
});

const handleBase = style({
  position: 'absolute',
  zIndex: 1,
  touchAction: 'none',
  userSelect: 'none',
});

/** Handle boyut sabitleri. */
const EDGE_SIZE = 6;
const CORNER_SIZE = 10;

export const handleTop = style([handleBase, {
  top: 0,
  left: CORNER_SIZE,
  right: CORNER_SIZE,
  height: EDGE_SIZE,
  cursor: 'ns-resize',
}]);

export const handleBottom = style([handleBase, {
  bottom: 0,
  left: CORNER_SIZE,
  right: CORNER_SIZE,
  height: EDGE_SIZE,
  cursor: 'ns-resize',
}]);

export const handleLeft = style([handleBase, {
  top: CORNER_SIZE,
  bottom: CORNER_SIZE,
  left: 0,
  width: EDGE_SIZE,
  cursor: 'ew-resize',
}]);

export const handleRight = style([handleBase, {
  top: CORNER_SIZE,
  bottom: CORNER_SIZE,
  right: 0,
  width: EDGE_SIZE,
  cursor: 'ew-resize',
}]);

export const handleTopLeft = style([handleBase, {
  top: 0,
  left: 0,
  width: CORNER_SIZE,
  height: CORNER_SIZE,
  cursor: 'nwse-resize',
}]);

export const handleTopRight = style([handleBase, {
  top: 0,
  right: 0,
  width: CORNER_SIZE,
  height: CORNER_SIZE,
  cursor: 'nesw-resize',
}]);

export const handleBottomLeft = style([handleBase, {
  bottom: 0,
  left: 0,
  width: CORNER_SIZE,
  height: CORNER_SIZE,
  cursor: 'nesw-resize',
}]);

export const handleBottomRight = style([handleBase, {
  bottom: 0,
  right: 0,
  width: CORNER_SIZE,
  height: CORNER_SIZE,
  cursor: 'nwse-resize',
}]);

/** Handle style map. */
export const handleStyles: Record<string, string> = {
  top: handleTop,
  bottom: handleBottom,
  left: handleLeft,
  right: handleRight,
  topLeft: handleTopLeft,
  topRight: handleTopRight,
  bottomLeft: handleBottomLeft,
  bottomRight: handleBottomRight,
};

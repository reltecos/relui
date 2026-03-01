/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export {
  createDockLayout,
  generateId as generateDockId,
  resetIdCounter as resetDockIdCounter,
  findNode,
  findParent,
  findGroupByPanelId,
  collectAllGroups,
  removeNodeFromTree,
  splitGroup,
  normalizeSizes,
  serializeNode,
  deserializeNode,
} from './dock-layout.machine';
export type {
  DockNode,
  DockSplitNode,
  DockGroupNode,
  DockPanelConfig,
  DockPanelState,
  DockFloatingGroup,
  DockAutoHiddenPanel,
  DropPosition,
  DropTarget,
  DragState,
  ResizeHandleState,
  DockWorkspace,
  DockLayoutSnapshot,
  SerializedNode,
  SerializedSplitNode,
  SerializedGroupNode,
  SerializedPanelState,
  SerializedFloatingGroup,
  DockLayoutProps,
  DockLayoutEvent,
  DockLayoutAPI,
} from './dock-layout.types';

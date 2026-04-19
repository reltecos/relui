/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export { createWorkspaceManager, resetWorkspaceIdCounter } from './workspace-manager.machine';
export type {
  WorkspacePreset,
  WorkspaceManagerEvent,
  WorkspaceManagerContext,
  WorkspaceManagerConfig,
  WorkspaceManagerAPI,
} from './workspace-manager.types';

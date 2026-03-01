/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * DockLayout state machine — VS Code seviyesi recursive split tree dock layout.
 *
 * Recursive binary/n-ary tree mimarisi ile:
 * - Panel dock/float/auto-hide/maximize
 * - Tab drag & drop (center = tab, kenar = split)
 * - Split resize (pointer drag)
 * - Workspace preset'leri (kaydet/yükle/sil)
 * - Layout serialize/deserialize
 *
 * @packageDocumentation
 */

import type {
  DockLayoutProps,
  DockLayoutEvent,
  DockLayoutAPI,
  DockPanelConfig,
  DockPanelState,
  DockNode,
  DockSplitNode,
  DockGroupNode,
  DockFloatingGroup,
  DockAutoHiddenPanel,
  DockLayoutSnapshot,
  DockWorkspace,
  DragState,
  ResizeHandleState,
  SerializedNode,
  SerializedFloatingGroup,
} from './dock-layout.types';

// ── ID Generator ────────────────────────────────────

let idCounter = 0;

/** Benzersiz node ID üret. */
export function generateId(prefix: string = 'dock'): string {
  return `${prefix}-${++idCounter}`;
}

/** ID counter'ı sıfırla (test için). */
export function resetIdCounter(): void {
  idCounter = 0;
}

// ── Tree Helpers ────────────────────────────────────

/** Herhangi bir node'u ID ile bul (DFS). */
export function findNode(root: DockNode, id: string): DockNode | undefined {
  if (root.id === id) return root;
  if (root.type === 'split') {
    for (const child of root.children) {
      const found = findNode(child, id);
      if (found) return found;
    }
  }
  return undefined;
}

/** Parent split node'u bul. */
export function findParent(root: DockNode, childId: string): DockSplitNode | undefined {
  if (root.type !== 'split') return undefined;
  for (const child of root.children) {
    if (child.id === childId) return root;
    if (child.type === 'split') {
      const found = findParent(child, childId);
      if (found) return found;
    }
  }
  return undefined;
}

/** Panel'in bulunduğu group'u bul. */
export function findGroupByPanelId(root: DockNode, panelId: string): DockGroupNode | undefined {
  if (root.type === 'group') {
    return root.panelIds.includes(panelId) ? root : undefined;
  }
  for (const child of root.children) {
    const found = findGroupByPanelId(child, panelId);
    if (found) return found;
  }
  return undefined;
}

/** Tüm group node'larını topla. */
export function collectAllGroups(root: DockNode): DockGroupNode[] {
  if (root.type === 'group') return [root];
  const result: DockGroupNode[] = [];
  for (const child of root.children) {
    result.push(...collectAllGroups(child));
  }
  return result;
}

/** Node'u tree'den sil. Parent tek çocuk kalırsa collapse et. */
export function removeNodeFromTree(root: DockNode, nodeId: string): DockNode | null {
  if (root.id === nodeId) return null;
  if (root.type !== 'split') return root;

  const idx = root.children.findIndex((c) => c.id === nodeId);
  if (idx !== -1) {
    root.children.splice(idx, 1);
    root.sizes.splice(idx, 1);
    // Size'ları normalize et
    normalizeSizes(root.sizes);
    // Tek çocuk kaldıysa collapse et
    if (root.children.length === 1) {
      const child = root.children[0];
      if (child) return child;
    }
    if (root.children.length === 0) return null;
    return root;
  }

  // Rekürsif arama
  for (let i = 0; i < root.children.length; i++) {
    const child = root.children[i];
    if (child && child.type === 'split') {
      const result = removeNodeFromTree(child, nodeId);
      if (result === null) {
        // Child tamamen silindi
        root.children.splice(i, 1);
        root.sizes.splice(i, 1);
        normalizeSizes(root.sizes);
        if (root.children.length === 1) {
          const remaining = root.children[0];
          if (remaining) return remaining;
        }
        if (root.children.length === 0) return null;
        return root;
      }
      if (result !== child) {
        // Child collapse oldu, yerine koy
        root.children[i] = result;
      }
    }
  }

  return root;
}

/** Group'u ikiye böl (split). */
export function splitGroup(
  root: DockNode,
  groupId: string,
  direction: 'horizontal' | 'vertical',
  newNode: DockGroupNode,
  position: 'before' | 'after',
): DockNode {
  // Eğer root bu group ise, yeni split oluştur
  if (root.id === groupId) {
    const children = position === 'before' ? [newNode, root] : [root, newNode];
    return {
      type: 'split',
      id: generateId('split'),
      direction,
      children,
      sizes: [0.5, 0.5],
    };
  }

  if (root.type !== 'split') return root;

  // Parent split'te ara
  const childIdx = root.children.findIndex((c) => c.id === groupId);
  if (childIdx !== -1) {
    const parent = root;
    const targetChild = parent.children[childIdx];
    if (!targetChild) return root;

    if (parent.direction === direction) {
      // Aynı yön — node'u ekle, size'ları böl
      const oldSize = parent.sizes[childIdx] ?? 0.5;
      const halfSize = oldSize / 2;
      if (position === 'before') {
        parent.children.splice(childIdx, 0, newNode);
        parent.sizes.splice(childIdx, 0, halfSize);
        const nextIdx = childIdx + 1;
        if (nextIdx < parent.sizes.length) {
          parent.sizes[nextIdx] = halfSize;
        }
      } else {
        parent.children.splice(childIdx + 1, 0, newNode);
        parent.sizes.splice(childIdx + 1, 0, halfSize);
        parent.sizes[childIdx] = halfSize;
      }
    } else {
      // Farklı yön — yeni split node oluştur, target child'ı wrap et
      const newSplit: DockSplitNode = {
        type: 'split',
        id: generateId('split'),
        direction,
        children: position === 'before' ? [newNode, targetChild] : [targetChild, newNode],
        sizes: [0.5, 0.5],
      };
      parent.children[childIdx] = newSplit;
    }
    return root;
  }

  // Rekürsif arama
  for (let i = 0; i < root.children.length; i++) {
    const child = root.children[i];
    if (child && child.type === 'split') {
      const result = splitGroup(child, groupId, direction, newNode, position);
      if (result !== child) {
        root.children[i] = result;
      }
    }
  }

  return root;
}

/** Size'ları normalize et (toplam = 1.0). */
export function normalizeSizes(sizes: number[]): void {
  const total = sizes.reduce((sum, s) => sum + s, 0);
  if (total === 0 || sizes.length === 0) return;
  for (let i = 0; i < sizes.length; i++) {
    sizes[i] = (sizes[i] ?? 0) / total;
  }
}

/** Node'u serialize et. */
export function serializeNode(node: DockNode): SerializedNode {
  if (node.type === 'group') {
    return {
      type: 'group',
      id: node.id,
      panelIds: [...node.panelIds],
      activePanelId: node.activePanelId,
    };
  }
  return {
    type: 'split',
    id: node.id,
    direction: node.direction,
    children: node.children.map(serializeNode),
    sizes: [...node.sizes],
  };
}

/** Serialized node'dan tree oluştur. */
export function deserializeNode(obj: SerializedNode): DockNode {
  if (obj.type === 'group') {
    return {
      type: 'group',
      id: obj.id,
      panelIds: [...obj.panelIds],
      activePanelId: obj.activePanelId,
    };
  }
  return {
    type: 'split',
    id: obj.id,
    direction: obj.direction,
    children: obj.children.map(deserializeNode),
    sizes: [...obj.sizes],
  };
}

/** Deep copy a DockNode tree. */
function deepCopyNode(node: DockNode): DockNode {
  if (node.type === 'group') {
    return {
      type: 'group',
      id: node.id,
      panelIds: [...node.panelIds],
      activePanelId: node.activePanelId,
    };
  }
  return {
    type: 'split',
    id: node.id,
    direction: node.direction,
    children: node.children.map(deepCopyNode),
    sizes: [...node.sizes],
  };
}

// ── Main Machine ────────────────────────────────────

/**
 * DockLayout state machine oluşturur.
 *
 * @param props - DockLayout yapılandırması.
 * @returns DockLayout API.
 */
export function createDockLayout(props: DockLayoutProps = {}): DockLayoutAPI {
  const panels = new Map<string, DockPanelState>();
  let root: DockNode | null = null;
  const floatingGroups: DockFloatingGroup[] = [];
  const autoHiddenPanels: DockAutoHiddenPanel[] = [];
  let maximizedPanelId: string | null = null;
  let dragState: DragState | null = null;
  let resizeState: ResizeHandleState | null = null;
  const workspaces = new Map<string, DockWorkspace>();
  let nextZIndex = 100;

  // ── Register Panel Helper ─────────────────────────

  function registerPanel(config: DockPanelConfig): void {
    if (panels.has(config.id)) return;
    panels.set(config.id, {
      id: config.id,
      title: config.title,
      closable: config.closable ?? true,
      floatable: config.floatable ?? true,
      autoHideable: config.autoHideable ?? true,
      minimizable: config.minimizable ?? true,
    });
  }

  // ── Find first group in tree ──────────────────────

  function findFirstGroup(node: DockNode): DockGroupNode | undefined {
    if (node.type === 'group') return node;
    for (const child of node.children) {
      const found = findFirstGroup(child);
      if (found) return found;
    }
    return undefined;
  }

  // ── Remove panel from wherever it is ──────────────

  function removePanelFromTree(panelId: string): void {
    if (!root) return;
    const group = findGroupByPanelId(root, panelId);
    if (!group) return;

    const idx = group.panelIds.indexOf(panelId);
    if (idx !== -1) {
      group.panelIds.splice(idx, 1);
      if (group.activePanelId === panelId) {
        const newActive = group.panelIds[Math.min(idx, group.panelIds.length - 1)];
        group.activePanelId = newActive ?? '';
      }
    }

    // Boş group'u tree'den sil
    if (group.panelIds.length === 0) {
      const result = removeNodeFromTree(root, group.id);
      root = result;
    }
  }

  function removePanelFromFloating(panelId: string): void {
    for (let i = floatingGroups.length - 1; i >= 0; i--) {
      const fg = floatingGroups[i];
      if (!fg) continue;
      const idx = fg.group.panelIds.indexOf(panelId);
      if (idx !== -1) {
        fg.group.panelIds.splice(idx, 1);
        if (fg.group.activePanelId === panelId) {
          const newActive = fg.group.panelIds[Math.min(idx, fg.group.panelIds.length - 1)];
          fg.group.activePanelId = newActive ?? '';
        }
        if (fg.group.panelIds.length === 0) {
          floatingGroups.splice(i, 1);
        }
        return;
      }
    }
  }

  function removePanelFromAutoHidden(panelId: string): void {
    const idx = autoHiddenPanels.findIndex((p) => p.panelId === panelId);
    if (idx !== -1) {
      autoHiddenPanels.splice(idx, 1);
    }
  }

  function removePanelEverywhere(panelId: string): void {
    removePanelFromTree(panelId);
    removePanelFromFloating(panelId);
    removePanelFromAutoHidden(panelId);
    if (maximizedPanelId === panelId) {
      maximizedPanelId = null;
    }
  }

  // ── Add panel to group ────────────────────────────

  function addPanelToGroup(panelId: string, group: DockGroupNode, index?: number): void {
    if (group.panelIds.includes(panelId)) return;
    if (index !== undefined && index >= 0 && index <= group.panelIds.length) {
      group.panelIds.splice(index, 0, panelId);
    } else {
      group.panelIds.push(panelId);
    }
    group.activePanelId = panelId;
  }

  // ── Ensure root exists ────────────────────────────

  function ensureRoot(): DockGroupNode {
    if (root && root.type === 'group') return root;
    if (root && root.type === 'split') {
      const group = findFirstGroup(root);
      if (group) return group;
    }
    const group: DockGroupNode = {
      type: 'group',
      id: generateId('group'),
      panelIds: [],
      activePanelId: '',
    };
    if (!root) {
      root = group;
    }
    return group;
  }

  // ── Floating panel finder ─────────────────────────

  function findFloatingGroupByPanelId(panelId: string): DockFloatingGroup | undefined {
    return floatingGroups.find((fg) => fg.group.panelIds.includes(panelId));
  }

  // ── Determine where a panel lives ─────────────────

  function isPanelInTree(panelId: string): boolean {
    if (!root) return false;
    return !!findGroupByPanelId(root, panelId);
  }


  // ── Initialize ────────────────────────────────────

  if (props.initialRoot) {
    root = deepCopyNode(props.initialRoot);
    // Register panels from tree
    const groups = collectAllGroups(root);
    for (const group of groups) {
      for (const pid of group.panelIds) {
        if (!panels.has(pid)) {
          panels.set(pid, {
            id: pid,
            title: pid,
            closable: true,
            floatable: true,
            autoHideable: true,
            minimizable: true,
          });
        }
      }
    }
  }

  if (props.panels) {
    for (const config of props.panels) {
      // initialRoot'tan auto-register edilen panel'in metadata'sını güncelle
      if (panels.has(config.id)) {
        const existing = panels.get(config.id);
        if (existing) {
          existing.title = config.title;
          existing.closable = config.closable ?? true;
          existing.floatable = config.floatable ?? true;
          existing.autoHideable = config.autoHideable ?? true;
          existing.minimizable = config.minimizable ?? true;
        }
      } else {
        registerPanel(config);
      }
      // Panel zaten tree'de mevcutsa (initialRoot'tan) tekrar ekleme
      if (isPanelInTree(config.id)) continue;

      if (config.targetGroupId && root) {
        const group = findNode(root, config.targetGroupId);
        if (group && group.type === 'group') {
          addPanelToGroup(config.id, group);
          continue;
        }
      }
      // Default: ilk gruba ekle
      const group = ensureRoot();
      addPanelToGroup(config.id, group);
    }
  }

  // ── Serialize ─────────────────────────────────────

  function serialize(): DockLayoutSnapshot {
    const panelRecord: Record<string, { title: string; closable: boolean; floatable: boolean; autoHideable: boolean; minimizable: boolean }> = {};
    for (const [id, p] of panels) {
      panelRecord[id] = {
        title: p.title,
        closable: p.closable,
        floatable: p.floatable,
        autoHideable: p.autoHideable,
        minimizable: p.minimizable,
      };
    }

    return {
      root: root ? serializeNode(root) : { type: 'group', id: 'empty', panelIds: [], activePanelId: '' },
      panels: panelRecord,
      floatingGroups: floatingGroups.map((fg) => ({
        id: fg.id,
        group: serializeNode(fg.group) as SerializedFloatingGroup['group'],
        x: fg.x,
        y: fg.y,
        width: fg.width,
        height: fg.height,
      })),
      autoHiddenPanels: autoHiddenPanels.map((p) => ({ ...p })),
    };
  }

  // ── Event Handler ─────────────────────────────────

  function send(event: DockLayoutEvent): void {
    switch (event.type) {
      case 'ADD_PANEL': {
        if (panels.has(event.panel.id)) break;
        registerPanel(event.panel);
        const targetId = event.targetGroupId ?? event.panel.targetGroupId;
        if (targetId && root) {
          const group = findNode(root, targetId);
          if (group && group.type === 'group') {
            addPanelToGroup(event.panel.id, group);
            break;
          }
        }
        const group = ensureRoot();
        addPanelToGroup(event.panel.id, group);
        break;
      }

      case 'REMOVE_PANEL': {
        if (!panels.has(event.panelId)) break;
        removePanelEverywhere(event.panelId);
        panels.delete(event.panelId);
        break;
      }

      case 'CLOSE_PANEL': {
        const panel = panels.get(event.panelId);
        if (!panel || !panel.closable) break;
        removePanelEverywhere(event.panelId);
        panels.delete(event.panelId);
        break;
      }

      case 'ACTIVATE_PANEL': {
        const panel = panels.get(event.panelId);
        if (!panel) break;

        // Tree'de mi?
        if (root) {
          const group = findGroupByPanelId(root, event.panelId);
          if (group) {
            group.activePanelId = event.panelId;
            break;
          }
        }

        // Floating'te mi?
        const fg = findFloatingGroupByPanelId(event.panelId);
        if (fg) {
          fg.group.activePanelId = event.panelId;
        }
        break;
      }

      case 'SET_PANEL_TITLE': {
        const panel = panels.get(event.panelId);
        if (panel) {
          panel.title = event.title;
        }
        break;
      }

      case 'MOVE_PANEL': {
        if (!panels.has(event.panelId)) break;
        if (!root) break;
        const targetGroup = findNode(root, event.targetGroupId);
        if (!targetGroup || targetGroup.type !== 'group') break;

        removePanelEverywhere(event.panelId);
        addPanelToGroup(event.panelId, targetGroup, event.index);
        break;
      }

      case 'SPLIT_GROUP': {
        if (!root) break;
        const existingGroup = findNode(root, event.groupId);
        if (!existingGroup || existingGroup.type !== 'group') break;

        // Panel'i kaynak group'tan çıkar
        removePanelEverywhere(event.panelId);

        // Yeni group oluştur
        const newGroup: DockGroupNode = {
          type: 'group',
          id: generateId('group'),
          panelIds: [event.panelId],
          activePanelId: event.panelId,
        };

        // Register panel if not exists
        if (!panels.has(event.panelId)) {
          panels.set(event.panelId, {
            id: event.panelId,
            title: event.panelId,
            closable: true,
            floatable: true,
            autoHideable: true,
            minimizable: true,
          });
        }

        root = splitGroup(root, event.groupId, event.direction, newGroup, event.position);
        break;
      }

      case 'RESIZE_START': {
        if (!root) break;
        const splitNode = findNode(root, event.splitId);
        if (!splitNode || splitNode.type !== 'split') break;
        resizeState = {
          splitId: event.splitId,
          handleIndex: event.handleIndex,
          startSizes: [...splitNode.sizes],
        };
        break;
      }

      case 'RESIZE_DRAG': {
        if (!resizeState || !root) break;
        const splitNode = findNode(root, resizeState.splitId);
        if (!splitNode || splitNode.type !== 'split') break;

        const { handleIndex, startSizes } = resizeState;
        const leftIdx = handleIndex;
        const rightIdx = handleIndex + 1;
        const leftStart = startSizes[leftIdx];
        const rightStart = startSizes[rightIdx];
        if (leftStart === undefined || rightStart === undefined) break;

        const totalPair = leftStart + rightStart;
        const minSize = 0.05; // minimum %5
        let newLeft = leftStart + event.delta;
        let newRight = rightStart - event.delta;

        // Clamp
        if (newLeft < minSize) {
          newLeft = minSize;
          newRight = totalPair - minSize;
        }
        if (newRight < minSize) {
          newRight = minSize;
          newLeft = totalPair - minSize;
        }

        splitNode.sizes[leftIdx] = newLeft;
        splitNode.sizes[rightIdx] = newRight;
        break;
      }

      case 'RESIZE_END': {
        resizeState = null;
        break;
      }

      case 'SET_SIZES': {
        if (!root) break;
        const splitNode = findNode(root, event.splitId);
        if (!splitNode || splitNode.type !== 'split') break;
        if (event.sizes.length === splitNode.children.length) {
          splitNode.sizes = [...event.sizes];
          normalizeSizes(splitNode.sizes);
        }
        break;
      }

      case 'DRAG_START': {
        const panel = panels.get(event.panelId);
        if (!panel) break;

        let sourceGroupId = '';
        if (root) {
          const group = findGroupByPanelId(root, event.panelId);
          if (group) sourceGroupId = group.id;
        }
        if (!sourceGroupId) {
          const fg = findFloatingGroupByPanelId(event.panelId);
          if (fg) sourceGroupId = fg.group.id;
        }
        if (!sourceGroupId) break;

        dragState = { panelId: event.panelId, sourceGroupId };
        break;
      }

      case 'DROP': {
        if (!dragState || !root) {
          dragState = null;
          break;
        }

        const { panelId } = dragState;
        dragState = null;

        if (event.target.position === 'center') {
          // Tab olarak ekle
          const targetGroup = findNode(root, event.target.groupId);
          if (!targetGroup || targetGroup.type !== 'group') break;
          removePanelEverywhere(panelId);
          addPanelToGroup(panelId, targetGroup);
        } else {
          // Split
          const direction =
            event.target.position === 'left' || event.target.position === 'right'
              ? 'horizontal'
              : 'vertical';
          const position =
            event.target.position === 'left' || event.target.position === 'top'
              ? 'before'
              : 'after';

          removePanelEverywhere(panelId);

          const newGroup: DockGroupNode = {
            type: 'group',
            id: generateId('group'),
            panelIds: [panelId],
            activePanelId: panelId,
          };

          root = splitGroup(root, event.target.groupId, direction, newGroup, position);
        }
        break;
      }

      case 'DROP_TO_FLOAT': {
        if (!panels.has(event.panelId)) break;
        const panel = panels.get(event.panelId);
        if (!panel || !panel.floatable) break;

        dragState = null;
        removePanelEverywhere(event.panelId);

        const fg: DockFloatingGroup = {
          id: generateId('float'),
          group: {
            type: 'group',
            id: generateId('group'),
            panelIds: [event.panelId],
            activePanelId: event.panelId,
          },
          x: event.x,
          y: event.y,
          width: event.width,
          height: event.height,
          zIndex: nextZIndex++,
        };
        floatingGroups.push(fg);
        break;
      }

      case 'DRAG_CANCEL': {
        dragState = null;
        break;
      }

      case 'FLOAT_PANEL': {
        const panel = panels.get(event.panelId);
        if (!panel || !panel.floatable) break;

        removePanelEverywhere(event.panelId);

        const fg: DockFloatingGroup = {
          id: generateId('float'),
          group: {
            type: 'group',
            id: generateId('group'),
            panelIds: [event.panelId],
            activePanelId: event.panelId,
          },
          x: event.x ?? 100,
          y: event.y ?? 100,
          width: event.width ?? 400,
          height: event.height ?? 300,
          zIndex: nextZIndex++,
        };
        floatingGroups.push(fg);
        break;
      }

      case 'DOCK_PANEL': {
        const panel = panels.get(event.panelId);
        if (!panel) break;

        removePanelEverywhere(event.panelId);

        // Tree'ye geri ekle
        if (event.targetGroupId && root) {
          const group = findNode(root, event.targetGroupId);
          if (group && group.type === 'group') {
            addPanelToGroup(event.panelId, group);
            break;
          }
        }

        // Default: ilk gruba ekle veya yeni root oluştur
        const group = ensureRoot();
        addPanelToGroup(event.panelId, group);
        break;
      }

      case 'MOVE_FLOATING': {
        const fg = floatingGroups.find((f) => f.id === event.floatingGroupId);
        if (fg) {
          fg.x = event.x;
          fg.y = event.y;
        }
        break;
      }

      case 'RESIZE_FLOATING': {
        const fg = floatingGroups.find((f) => f.id === event.floatingGroupId);
        if (fg) {
          fg.width = Math.max(100, event.width);
          fg.height = Math.max(50, event.height);
        }
        break;
      }

      case 'ACTIVATE_FLOATING': {
        const fg = floatingGroups.find((f) => f.id === event.floatingGroupId);
        if (fg) {
          fg.zIndex = nextZIndex++;
        }
        break;
      }

      case 'AUTO_HIDE_PANEL': {
        const panel = panels.get(event.panelId);
        if (!panel || !panel.autoHideable) break;

        removePanelEverywhere(event.panelId);

        autoHiddenPanels.push({
          panelId: event.panelId,
          side: event.side,
        });
        break;
      }

      case 'RESTORE_PANEL': {
        const panel = panels.get(event.panelId);
        if (!panel) break;

        // Auto-hidden'dan kaldır
        const ahIdx = autoHiddenPanels.findIndex((p) => p.panelId === event.panelId);
        if (ahIdx !== -1) {
          autoHiddenPanels.splice(ahIdx, 1);
        }

        // Floating'ten kaldır
        removePanelFromFloating(event.panelId);

        // Tree'ye geri ekle
        const group = ensureRoot();
        addPanelToGroup(event.panelId, group);
        break;
      }

      case 'MAXIMIZE_PANEL': {
        if (!panels.has(event.panelId)) break;
        maximizedPanelId = event.panelId;
        break;
      }

      case 'RESTORE_MAXIMIZED': {
        maximizedPanelId = null;
        break;
      }

      case 'SAVE_WORKSPACE': {
        workspaces.set(event.name, {
          name: event.name,
          snapshot: serialize(),
        });
        break;
      }

      case 'LOAD_WORKSPACE': {
        const ws = workspaces.get(event.name);
        if (!ws) break;
        loadSnapshot(ws.snapshot);
        break;
      }

      case 'DELETE_WORKSPACE': {
        workspaces.delete(event.name);
        break;
      }

      case 'DESERIALIZE': {
        loadSnapshot(event.snapshot);
        break;
      }
    }
  }

  // ── Load snapshot ─────────────────────────────────

  function loadSnapshot(snapshot: DockLayoutSnapshot): void {
    panels.clear();
    floatingGroups.length = 0;
    autoHiddenPanels.length = 0;
    maximizedPanelId = null;
    dragState = null;
    resizeState = null;

    root = deserializeNode(snapshot.root);

    for (const [id, p] of Object.entries(snapshot.panels)) {
      panels.set(id, {
        id,
        title: p.title,
        closable: p.closable,
        floatable: p.floatable,
        autoHideable: p.autoHideable,
        minimizable: p.minimizable,
      });
    }

    for (const fg of snapshot.floatingGroups) {
      floatingGroups.push({
        id: fg.id,
        group: deserializeNode(fg.group) as DockGroupNode,
        x: fg.x,
        y: fg.y,
        width: fg.width,
        height: fg.height,
        zIndex: nextZIndex++,
      });
    }

    for (const ah of snapshot.autoHiddenPanels) {
      autoHiddenPanels.push({ ...ah });
    }
  }

  // ── API ─────────────────────────────────────────

  function copyPanel(p: DockPanelState): DockPanelState {
    return { ...p };
  }

  return {
    getRoot: () => (root ? deepCopyNode(root) : null),
    getNode: (id: string) => {
      if (!root) return undefined;
      const node = findNode(root, id);
      return node ? deepCopyNode(node) : undefined;
    },
    getPanel: (id: string) => {
      const p = panels.get(id);
      return p ? copyPanel(p) : undefined;
    },
    getPanels: () => Array.from(panels.values()).map(copyPanel),
    getGroupByPanelId: (panelId: string) => {
      if (root) {
        const g = findGroupByPanelId(root, panelId);
        if (g) return deepCopyNode(g) as DockGroupNode;
      }
      // Check floating
      for (const fg of floatingGroups) {
        if (fg.group.panelIds.includes(panelId)) {
          return deepCopyNode(fg.group) as DockGroupNode;
        }
      }
      return undefined;
    },
    getFloatingGroups: () =>
      floatingGroups.map((fg) => ({
        ...fg,
        group: deepCopyNode(fg.group) as DockGroupNode,
      })),
    getAutoHiddenPanels: () => autoHiddenPanels.map((p) => ({ ...p })),
    getMaximizedPanelId: () => maximizedPanelId,
    getDragState: () => (dragState ? { ...dragState } : null),
    getResizeState: () =>
      resizeState ? { ...resizeState, startSizes: [...resizeState.startSizes] } : null,
    getWorkspaces: () =>
      Array.from(workspaces.values()).map((ws) => ({
        name: ws.name,
        snapshot: { ...ws.snapshot },
      })),
    serialize,
    send,
  };
}

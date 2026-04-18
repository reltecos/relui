/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * JSONEditor state machine.
 *
 * @packageDocumentation
 */

import type {
  JsonNode,
  JsonNodeType,
  JsonEditorMode,
  JsonEditorConfig,
  JsonEditorContext,
  JsonEditorEvent,
  JsonEditorAPI,
} from './json-editor.types';

// ── Helpers ──────────────────────────────────────────

let idCounter = 0;

function nextId(): string {
  return `jn-${++idCounter}`;
}

/** ID counter sifirla (test icin) / Reset ID counter (for testing) */
export function resetJsonNodeIdCounter(): void {
  idCounter = 0;
}

/** Deger tipini belirle / Detect value type */
export function detectType(value: unknown): JsonNodeType {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  const t = typeof value;
  if (t === 'string') return 'string';
  if (t === 'number') return 'number';
  if (t === 'boolean') return 'boolean';
  if (t === 'object') return 'object';
  return 'string';
}

/** JSON degerinden agac olustur / Build tree from JSON value */
export function jsonToTree(
  value: unknown,
  parentId: string | null,
  key: string,
  depth: number,
): JsonNode {
  const id = nextId();
  const type = detectType(value);

  if (type === 'object' && value !== null && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>;
    const children = Object.keys(obj).map((k) =>
      jsonToTree(obj[k], id, k, depth + 1),
    );
    return { id, key, value: null, type: 'object', parentId, children, depth };
  }

  if (type === 'array' && Array.isArray(value)) {
    const children = value.map((item, i) =>
      jsonToTree(item, id, String(i), depth + 1),
    );
    return { id, key, value: null, type: 'array', parentId, children, depth };
  }

  return {
    id,
    key,
    value: value as string | number | boolean | null,
    type,
    parentId,
    children: [],
    depth,
  };
}

/** Agactan JSON degeri olustur / Build JSON value from tree */
export function treeToJson(node: JsonNode): unknown {
  if (node.type === 'object') {
    const obj: Record<string, unknown> = {};
    for (const child of node.children) {
      obj[child.key] = treeToJson(child);
    }
    return obj;
  }
  if (node.type === 'array') {
    return node.children.map((child) => treeToJson(child));
  }
  return node.value;
}

/** Guvenli JSON parse / Safe JSON parse */
export function parseJsonSafe(text: string): { value: unknown; valid: boolean; error: string | null } {
  try {
    const value = JSON.parse(text) as unknown;
    return { value, valid: true, error: null };
  } catch (e) {
    return { value: undefined, valid: false, error: (e as Error).message };
  }
}

/** Agactaki tum node id lerini topla / Collect all node ids in tree */
function collectAllIds(node: JsonNode): string[] {
  const ids = [node.id];
  for (const child of node.children) {
    ids.push(...collectAllIds(child));
  }
  return ids;
}

/** Agacta node guncelle / Update node in tree (immutable) */
function updateNode(root: JsonNode, nodeId: string, updater: (n: JsonNode) => JsonNode): JsonNode {
  if (root.id === nodeId) return updater(root);
  return {
    ...root,
    children: root.children.map((child) => updateNode(child, nodeId, updater)),
  };
}

/** Agactan node sil / Delete node from tree (immutable) */
function deleteNode(root: JsonNode, nodeId: string): JsonNode {
  return {
    ...root,
    children: root.children
      .filter((child) => child.id !== nodeId)
      .map((child) => deleteNode(child, nodeId)),
  };
}

/** Agaca node ekle / Add node to tree (immutable) */
function addChildNode(
  root: JsonNode,
  parentId: string,
  newNode: JsonNode,
): JsonNode {
  if (root.id === parentId) {
    return { ...root, children: [...root.children, newNode] };
  }
  return {
    ...root,
    children: root.children.map((child) => addChildNode(child, parentId, newNode)),
  };
}

// ── State Machine ────────────────────────────────────

/**
 * JSONEditor state machine olusturur.
 * Creates a JSONEditor state machine.
 */
export function createJsonEditor(config: JsonEditorConfig = {}): JsonEditorAPI {
  const {
    defaultValue = {},
    defaultMode = 'tree',
    onChange,
    onValidate,
  } = config;

  // ── State ──
  let rootNode: JsonNode | null = jsonToTree(defaultValue, null, 'root', 0);
  let text = JSON.stringify(defaultValue, null, 2);
  let mode: JsonEditorMode = defaultMode;
  let valid = true;
  let error: string | null = null;
  const expandedIds = new Set<string>();
  let selectedNodeId: string | null = null;

  // Expand root by default
  if (rootNode) expandedIds.add(rootNode.id);

  const listeners = new Set<() => void>();

  function notify(): void {
    listeners.forEach((fn) => fn());
  }

  function syncTextFromTree(): void {
    if (rootNode) {
      const value = treeToJson(rootNode);
      text = JSON.stringify(value, null, 2);
      valid = true;
      error = null;
      onChange?.(value, text);
    }
  }

  function syncTreeFromText(): void {
    const result = parseJsonSafe(text);
    valid = result.valid;
    error = result.error;
    onValidate?.(valid, error);
    if (result.valid && result.value !== undefined) {
      rootNode = jsonToTree(result.value, null, 'root', 0);
      if (rootNode) expandedIds.add(rootNode.id);
      onChange?.(result.value, text);
    }
  }

  // ── Send ──
  function send(event: JsonEditorEvent): void {
    switch (event.type) {
      case 'SET_JSON': {
        rootNode = jsonToTree(event.value, null, 'root', 0);
        text = JSON.stringify(event.value, null, 2);
        valid = true;
        error = null;
        if (rootNode) expandedIds.add(rootNode.id);
        onChange?.(event.value, text);
        notify();
        break;
      }
      case 'SET_TEXT': {
        text = event.text;
        const result = parseJsonSafe(text);
        valid = result.valid;
        error = result.error;
        onValidate?.(valid, error);
        if (result.valid && result.value !== undefined) {
          rootNode = jsonToTree(result.value, null, 'root', 0);
          if (rootNode) expandedIds.add(rootNode.id);
          onChange?.(result.value, text);
        }
        notify();
        break;
      }
      case 'TOGGLE_NODE': {
        if (expandedIds.has(event.nodeId)) {
          expandedIds.delete(event.nodeId);
        } else {
          expandedIds.add(event.nodeId);
        }
        notify();
        break;
      }
      case 'EXPAND_ALL': {
        if (rootNode) {
          for (const id of collectAllIds(rootNode)) {
            expandedIds.add(id);
          }
        }
        notify();
        break;
      }
      case 'COLLAPSE_ALL': {
        expandedIds.clear();
        if (rootNode) expandedIds.add(rootNode.id);
        notify();
        break;
      }
      case 'UPDATE_NODE_VALUE': {
        if (!rootNode) return;
        rootNode = updateNode(rootNode, event.nodeId, (n) => ({
          ...n,
          value: event.value,
          type: event.valueType,
          children: (event.valueType === 'object' || event.valueType === 'array') ? n.children : [],
        }));
        syncTextFromTree();
        notify();
        break;
      }
      case 'UPDATE_NODE_KEY': {
        if (!rootNode) return;
        rootNode = updateNode(rootNode, event.nodeId, (n) => ({
          ...n,
          key: event.key,
        }));
        syncTextFromTree();
        notify();
        break;
      }
      case 'ADD_NODE': {
        if (!rootNode) return;
        const newNode: JsonNode = {
          id: nextId(),
          key: event.key,
          value: event.value,
          type: event.valueType,
          parentId: event.parentId,
          children: [],
          depth: 0,
        };
        rootNode = addChildNode(rootNode, event.parentId, newNode);
        expandedIds.add(event.parentId);
        syncTextFromTree();
        notify();
        break;
      }
      case 'DELETE_NODE': {
        if (!rootNode) return;
        if (event.nodeId === rootNode.id) return;
        rootNode = deleteNode(rootNode, event.nodeId);
        expandedIds.delete(event.nodeId);
        if (selectedNodeId === event.nodeId) selectedNodeId = null;
        syncTextFromTree();
        notify();
        break;
      }
      case 'SET_MODE': {
        if (mode === event.mode) return;
        const prevMode = mode;
        mode = event.mode;
        if (prevMode === 'text' && mode === 'tree') {
          syncTreeFromText();
        } else if (prevMode === 'tree' && mode === 'text') {
          syncTextFromTree();
        }
        notify();
        break;
      }
      case 'SELECT_NODE': {
        if (selectedNodeId === event.nodeId) return;
        selectedNodeId = event.nodeId;
        notify();
        break;
      }
    }
  }

  // ── API ──
  return {
    getContext(): JsonEditorContext {
      return {
        rootNode,
        mode,
        text,
        valid,
        error,
        expandedIds,
        selectedNodeId,
      };
    },
    send,
    subscribe(callback: () => void): () => void {
      listeners.add(callback);
      return () => { listeners.delete(callback); };
    },
    destroy(): void {
      listeners.clear();
    },
  };
}

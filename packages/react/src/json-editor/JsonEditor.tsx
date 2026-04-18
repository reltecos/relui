/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * JSONEditor — JSON agac/metin duzenleyici bilesen (Dual API).
 * JSONEditor — JSON tree/text editor component (Dual API).
 *
 * Props-based: `<JSONEditor value={obj} onChange={fn} />`
 * Compound:
 * ```tsx
 * <JSONEditor value={obj}>
 *   <JSONEditor.Toolbar />
 *   <JSONEditor.Tree />
 *   <JSONEditor.Text />
 * </JSONEditor>
 * ```
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { JsonNode, JsonNodeType, JsonEditorMode } from '@relteco/relui-core';
import {
  rootStyle,
  toolbarStyle,
  toolbarButtonStyle,
  treeStyle,
  textAreaStyle,
  nodeStyle,
  nodeExpandStyle,
  nodeKeyStyle,
  nodeValueStyle,
  nodeTypeStyle,
  nodeActionsStyle,
  nodeActionButtonStyle,
  validationStyle,
  validationValidStyle,
  validationInvalidStyle,
} from './json-editor.css';
import { useJsonEditor, type UseJsonEditorProps } from './useJsonEditor';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** JSONEditor slot isimleri / JSONEditor slot names. */
export type JsonEditorSlot =
  | 'root'
  | 'toolbar'
  | 'tree'
  | 'textArea'
  | 'node'
  | 'nodeKey'
  | 'nodeValue'
  | 'nodeType'
  | 'nodeActions';

// ── Context (Compound API) ──────────────────────────

interface JsonEditorContextValue {
  rootNode: JsonNode | null;
  mode: JsonEditorMode;
  text: string;
  valid: boolean;
  error: string | null;
  expandedIds: ReadonlySet<string>;
  selectedNodeId: string | null;
  setJson: (value: unknown) => void;
  setText: (text: string) => void;
  toggleNode: (nodeId: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  updateNodeValue: (nodeId: string, value: string | number | boolean | null, valueType: JsonNodeType) => void;
  updateNodeKey: (nodeId: string, key: string) => void;
  addNode: (parentId: string, key: string, value: string | number | boolean | null, valueType: JsonNodeType) => void;
  deleteNode: (nodeId: string) => void;
  setMode: (mode: JsonEditorMode) => void;
  selectNode: (nodeId: string | null) => void;
  classNames: ClassNames<JsonEditorSlot> | undefined;
  styles: Styles<JsonEditorSlot> | undefined;
}

const JsonEditorContext = createContext<JsonEditorContextValue | null>(null);

function useJsonEditorContext(): JsonEditorContextValue {
  const ctx = useContext(JsonEditorContext);
  if (!ctx) throw new Error('JSONEditor compound sub-components must be used within <JSONEditor>.');
  return ctx;
}

// ── Internal: Tree Node Renderer ────────────────────

function TreeNodeRenderer(props: {
  node: JsonNode;
  ctx: JsonEditorContextValue;
}) {
  const { node, ctx } = props;
  const isExpanded = ctx.expandedIds.has(node.id);
  const isSelected = ctx.selectedNodeId === node.id;
  const isContainer = node.type === 'object' || node.type === 'array';

  const nodeSlot = getSlotProps('node', nodeStyle, ctx.classNames, ctx.styles);
  const keySlot = getSlotProps('nodeKey', nodeKeyStyle, ctx.classNames, ctx.styles);
  const valueSlot = getSlotProps('nodeValue', nodeValueStyle, ctx.classNames, ctx.styles);
  const typeSlot = getSlotProps('nodeType', nodeTypeStyle, ctx.classNames, ctx.styles);
  const actionsSlot = getSlotProps('nodeActions', nodeActionsStyle, ctx.classNames, ctx.styles);

  const displayValue = (): string => {
    if (node.type === 'string') return `"${String(node.value)}"`;
    if (node.type === 'null') return 'null';
    return String(node.value);
  };

  return (
    <div style={{ paddingLeft: node.depth * 20 }}>
      <div
        className={nodeSlot.className}
        style={nodeSlot.style}
        data-selected={isSelected}
        data-testid="json-editor-node"
        data-node-id={node.id}
        onClick={() => ctx.selectNode(node.id)}
      >
        {/* Expand/Collapse toggle */}
        <span
          className={nodeExpandStyle}
          onClick={(e) => {
            e.stopPropagation();
            if (isContainer) ctx.toggleNode(node.id);
          }}
          data-testid="json-editor-node-expand"
        >
          {isContainer ? (isExpanded ? '\u25BE' : '\u25B8') : ' '}
        </span>

        {/* Key */}
        {node.parentId !== null && (
          <span className={keySlot.className} style={keySlot.style} data-testid="json-editor-node-key">
            {node.key}:
          </span>
        )}

        {/* Value or container indicator */}
        {isContainer ? (
          <span className={typeSlot.className} style={typeSlot.style} data-testid="json-editor-node-type">
            {node.type === 'object' ? `{${node.children.length}}` : `[${node.children.length}]`}
          </span>
        ) : (
          <span className={valueSlot.className} style={valueSlot.style} data-testid="json-editor-node-value">
            {displayValue()}
          </span>
        )}

        {/* Type badge */}
        {!isContainer && (
          <span className={typeSlot.className} style={typeSlot.style} data-testid="json-editor-node-type">
            {node.type}
          </span>
        )}

        {/* Actions */}
        <span className={actionsSlot.className} style={actionsSlot.style} data-testid="json-editor-node-actions">
          {isContainer && (
            <button
              type="button"
              className={nodeActionButtonStyle}
              onClick={(e) => {
                e.stopPropagation();
                ctx.addNode(node.id, node.type === 'array' ? String(node.children.length) : 'newKey', '', 'string');
              }}
              aria-label="Add child"
              data-testid="json-editor-add-btn"
            >
              +
            </button>
          )}
          {node.parentId !== null && (
            <button
              type="button"
              className={nodeActionButtonStyle}
              onClick={(e) => {
                e.stopPropagation();
                ctx.deleteNode(node.id);
              }}
              aria-label="Delete node"
              data-testid="json-editor-delete-btn"
            >
              \u00D7
            </button>
          )}
        </span>
      </div>

      {/* Children */}
      {isContainer && isExpanded && node.children.map((child) => (
        <TreeNodeRenderer key={child.id} node={child} ctx={ctx} />
      ))}
    </div>
  );
}

// ── Compound: JSONEditor.Toolbar ────────────────────

/** JSONEditor.Toolbar props */
export interface JsonEditorToolbarProps {
  /** Ek className / Additional className */
  className?: string;
}

const JsonEditorToolbar = forwardRef<HTMLDivElement, JsonEditorToolbarProps>(
  function JsonEditorToolbar(props, ref) {
    const { className } = props;
    const ctx = useJsonEditorContext();
    const slot = getSlotProps('toolbar', toolbarStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="json-editor-toolbar" role="toolbar">
        <button
          type="button"
          className={toolbarButtonStyle}
          data-active={ctx.mode === 'tree'}
          onClick={() => ctx.setMode('tree')}
          aria-label="Tree mode"
          data-testid="json-editor-mode-tree"
        >
          Tree
        </button>
        <button
          type="button"
          className={toolbarButtonStyle}
          data-active={ctx.mode === 'text'}
          onClick={() => ctx.setMode('text')}
          aria-label="Text mode"
          data-testid="json-editor-mode-text"
        >
          Text
        </button>
        <button
          type="button"
          className={toolbarButtonStyle}
          onClick={() => ctx.expandAll()}
          aria-label="Expand all"
          data-testid="json-editor-expand-all"
        >
          Expand
        </button>
        <button
          type="button"
          className={toolbarButtonStyle}
          onClick={() => ctx.collapseAll()}
          aria-label="Collapse all"
          data-testid="json-editor-collapse-all"
        >
          Collapse
        </button>
      </div>
    );
  },
);

// ── Compound: JSONEditor.Tree ───────────────────────

/** JSONEditor.Tree props */
export interface JsonEditorTreeProps {
  /** Ek className / Additional className */
  className?: string;
}

const JsonEditorTree = forwardRef<HTMLDivElement, JsonEditorTreeProps>(
  function JsonEditorTree(props, ref) {
    const { className } = props;
    const ctx = useJsonEditorContext();
    const slot = getSlotProps('tree', treeStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="json-editor-tree" role="tree">
        {ctx.rootNode && (
          <TreeNodeRenderer node={ctx.rootNode} ctx={ctx} />
        )}
      </div>
    );
  },
);

// ── Compound: JSONEditor.Text ───────────────────────

/** JSONEditor.Text props */
export interface JsonEditorTextProps {
  /** Ek className / Additional className */
  className?: string;
}

const JsonEditorText = forwardRef<HTMLTextAreaElement, JsonEditorTextProps>(
  function JsonEditorText(props, ref) {
    const { className } = props;
    const ctx = useJsonEditorContext();
    const slot = getSlotProps('textArea', textAreaStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <textarea
        ref={ref}
        className={cls}
        style={slot.style}
        value={ctx.text}
        onChange={(e) => ctx.setText(e.target.value)}
        spellCheck={false}
        aria-label="JSON text editor"
        data-testid="json-editor-textarea"
      />
    );
  },
);

// ── Compound: JSONEditor.Node (standalone compound node) ──

/** JSONEditor.Node props */
export interface JsonEditorNodeProps {
  /** Node id / Node id */
  nodeId: string;
  /** Ek className / Additional className */
  className?: string;
}

const JsonEditorNode = forwardRef<HTMLDivElement, JsonEditorNodeProps>(
  function JsonEditorNode(props, ref) {
    const { nodeId, className } = props;
    const ctx = useJsonEditorContext();

    // Find the node in the tree
    function findNodeById(node: JsonNode | null, id: string): JsonNode | null {
      if (!node) return null;
      if (node.id === id) return node;
      for (const child of node.children) {
        const found = findNodeById(child, id);
        if (found) return found;
      }
      return null;
    }

    const node = findNodeById(ctx.rootNode, nodeId);
    if (!node) return null;

    const nodeSlot = getSlotProps('node', nodeStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${nodeSlot.className} ${className}` : nodeSlot.className;

    return (
      <div ref={ref} className={cls} style={nodeSlot.style} data-testid="json-editor-node">
        <span data-testid="json-editor-node-key">{node.key}</span>
        <span data-testid="json-editor-node-value">{String(node.value)}</span>
      </div>
    );
  },
);

// ── Component Props ───────────────────────────────────

export interface JsonEditorComponentProps extends SlotStyleProps<JsonEditorSlot> {
  /** JSON degeri / JSON value */
  value?: unknown;
  /** Varsayilan deger / Default value */
  defaultValue?: unknown;
  /** Deger degisince / On change */
  onChange?: (value: unknown, text: string) => void;
  /** Dogrulama callback / On validate */
  onValidate?: (valid: boolean, error: string | null) => void;
  /** Mod / Mode */
  mode?: JsonEditorMode;
  /** Varsayilan mod / Default mode */
  defaultMode?: JsonEditorMode;
  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Component ─────────────────────────────────────────

const JsonEditorBase = forwardRef<HTMLDivElement, JsonEditorComponentProps>(
  function JSONEditor(props, ref) {
    const {
      value,
      defaultValue,
      onChange,
      onValidate,
      mode: modeProp,
      defaultMode,
      children,
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const hookProps: UseJsonEditorProps = {
      value,
      defaultValue,
      mode: modeProp,
      defaultMode,
      onChange,
      onValidate,
    };
    const editor = useJsonEditor(hookProps);

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootClassName = className ? `${rootSlot.className} ${className}` : rootSlot.className;

    const ctxValue: JsonEditorContextValue = {
      rootNode: editor.rootNode,
      mode: editor.mode,
      text: editor.text,
      valid: editor.valid,
      error: editor.error,
      expandedIds: editor.expandedIds,
      selectedNodeId: editor.selectedNodeId,
      setJson: editor.setJson,
      setText: editor.setText,
      toggleNode: editor.toggleNode,
      expandAll: editor.expandAll,
      collapseAll: editor.collapseAll,
      updateNodeValue: editor.updateNodeValue,
      updateNodeKey: editor.updateNodeKey,
      addNode: editor.addNode,
      deleteNode: editor.deleteNode,
      setMode: editor.setMode,
      selectNode: editor.selectNode,
      classNames,
      styles,
    };

    // ── Compound API ──
    if (children) {
      return (
        <JsonEditorContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={rootClassName}
            style={{ ...rootSlot.style, ...styleProp }}
            data-testid="json-editor-root"
            data-mode={editor.mode}
            role="application"
            aria-label="JSON editor"
          >
            {children}
          </div>
        </JsonEditorContext.Provider>
      );
    }

    // ── Props-based API ──
    const toolbarSlot = getSlotProps('toolbar', toolbarStyle, classNames, styles);
    const treeSlot = getSlotProps('tree', treeStyle, classNames, styles);
    const textSlot = getSlotProps('textArea', textAreaStyle, classNames, styles);

    return (
      <JsonEditorContext.Provider value={ctxValue}>
        <div
          ref={ref}
          className={rootClassName}
          style={{ ...rootSlot.style, ...styleProp }}
          data-testid="json-editor-root"
          data-mode={editor.mode}
          role="application"
          aria-label="JSON editor"
        >
          {/* Toolbar */}
          <div className={toolbarSlot.className} style={toolbarSlot.style} data-testid="json-editor-toolbar" role="toolbar">
            <button
              type="button"
              className={toolbarButtonStyle}
              data-active={editor.mode === 'tree'}
              onClick={() => editor.setMode('tree')}
              aria-label="Tree mode"
              data-testid="json-editor-mode-tree"
            >
              Tree
            </button>
            <button
              type="button"
              className={toolbarButtonStyle}
              data-active={editor.mode === 'text'}
              onClick={() => editor.setMode('text')}
              aria-label="Text mode"
              data-testid="json-editor-mode-text"
            >
              Text
            </button>
            <button
              type="button"
              className={toolbarButtonStyle}
              onClick={() => editor.expandAll()}
              aria-label="Expand all"
              data-testid="json-editor-expand-all"
            >
              Expand
            </button>
            <button
              type="button"
              className={toolbarButtonStyle}
              onClick={() => editor.collapseAll()}
              aria-label="Collapse all"
              data-testid="json-editor-collapse-all"
            >
              Collapse
            </button>
          </div>

          {/* Tree mode */}
          {editor.mode === 'tree' && (
            <div className={treeSlot.className} style={treeSlot.style} data-testid="json-editor-tree" role="tree">
              {editor.rootNode && (
                <TreeNodeRenderer node={editor.rootNode} ctx={ctxValue} />
              )}
            </div>
          )}

          {/* Text mode */}
          {editor.mode === 'text' && (
            <textarea
              className={textSlot.className}
              style={textSlot.style}
              value={editor.text}
              onChange={(e) => editor.setText(e.target.value)}
              spellCheck={false}
              aria-label="JSON text editor"
              data-testid="json-editor-textarea"
            />
          )}

          {/* Validation status */}
          <div
            className={`${validationStyle} ${editor.valid ? validationValidStyle : validationInvalidStyle}`}
            data-testid="json-editor-validation"
            data-valid={editor.valid}
          >
            {editor.valid ? 'Valid JSON' : `Error: ${editor.error}`}
          </div>
        </div>
      </JsonEditorContext.Provider>
    );
  },
);

/**
 * JSONEditor bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <JSONEditor value={{ name: "Ali", age: 30 }} onChange={(v) => {}} />
 * ```
 *
 * @example Compound
 * ```tsx
 * <JSONEditor value={{ name: "Ali" }}>
 *   <JSONEditor.Toolbar />
 *   <JSONEditor.Tree />
 * </JSONEditor>
 * ```
 */
export const JSONEditor = Object.assign(JsonEditorBase, {
  Toolbar: JsonEditorToolbar,
  Tree: JsonEditorTree,
  Text: JsonEditorText,
  Node: JsonEditorNode,
});

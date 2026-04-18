/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * DragDrop — surukle-birak primitives bilesen (Dual API).
 * DragDrop — drag and drop primitives component (Dual API).
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import type { DragDropContext as CoreDDContext } from '@relteco/relui-core';
import { rootStyle, draggableStyle, droppableStyle, overlayStyle } from './drag-drop.css';
import { useDragDrop, type UseDragDropProps } from './useDragDrop';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

export type DragDropSlot = 'root' | 'draggable' | 'droppable' | 'overlay';

interface DragDropContextValue {
  ddCtx: CoreDDContext;
  classNames: ClassNames<DragDropSlot> | undefined;
  styles: Styles<DragDropSlot> | undefined;
}

const DragDropCtx = createContext<DragDropContextValue | null>(null);
function useDragDropContext(): DragDropContextValue {
  const ctx = useContext(DragDropCtx);
  if (!ctx) throw new Error('DragDrop compound sub-components must be used within <DragDrop>.');
  return ctx;
}

// ── Sub: Draggable ──

export interface DragDropDraggableProps { children: ReactNode; className?: string }

const DragDropDraggable = forwardRef<HTMLDivElement, DragDropDraggableProps>(
  function DragDropDraggable(props, ref) {
    const { children, className } = props;
    const ctx = useDragDropContext();
    const slot = getSlotProps('draggable', draggableStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return (<div ref={ref} className={cls} style={slot.style} data-testid="dragdrop-draggable" draggable>{children}</div>);
  },
);

// ── Sub: Droppable ──

export interface DragDropDroppableProps { children?: ReactNode; className?: string; isOver?: boolean }

const DragDropDroppable = forwardRef<HTMLDivElement, DragDropDroppableProps>(
  function DragDropDroppable(props, ref) {
    const { children, className, isOver = false } = props;
    const ctx = useDragDropContext();
    const slot = getSlotProps('droppable', droppableStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return (<div ref={ref} className={cls} style={slot.style} data-testid="dragdrop-droppable" data-over={isOver}>{children}</div>);
  },
);

// ── Sub: Overlay ──

export interface DragDropOverlayProps { children?: ReactNode; className?: string }

const DragDropOverlay = forwardRef<HTMLDivElement, DragDropOverlayProps>(
  function DragDropOverlay(props, ref) {
    const { children, className } = props;
    const ctx = useDragDropContext();
    const slot = getSlotProps('overlay', overlayStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const pos = ctx.ddCtx.position;
    if (!ctx.ddCtx.isDragging || !pos) return null;
    return (<div ref={ref} className={cls} style={{ ...slot.style, left: pos.x, top: pos.y }} data-testid="dragdrop-overlay">{children}</div>);
  },
);

// ── Props ──

export interface DragDropComponentProps extends SlotStyleProps<DragDropSlot> {
  onDrop?: (item: { id: string; type: string }, targetId: string) => void;
  onDragStart?: (item: { id: string; type: string }) => void;
  onDragEnd?: () => void;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const DragDropBase = forwardRef<HTMLDivElement, DragDropComponentProps>(
  function DragDrop(props, ref) {
    const { onDrop, onDragStart, onDragEnd, children, className, style: styleProp, classNames, styles } = props;
    const hookProps: UseDragDropProps = { onDrop, onDragStart, onDragEnd };
    const { context: ddCtx } = useDragDrop(hookProps);

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootCls = className ? `${rootSlot.className} ${className}` : rootSlot.className;
    const ctxValue: DragDropContextValue = { ddCtx, classNames, styles };

    return (
      <DragDropCtx.Provider value={ctxValue}>
        <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="dragdrop-root">
          {children}
        </div>
      </DragDropCtx.Provider>
    );
  },
);

export const DragDrop = Object.assign(DragDropBase, {
  Draggable: DragDropDraggable,
  Droppable: DragDropDroppable,
  Overlay: DragDropOverlay,
});

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * KanbanBoard — kanban tahta bilesen (Dual API).
 * KanbanBoard — kanban board component (Dual API).
 *
 * Props-based: `<KanbanBoard columns={cols} cards={cards} />`
 * Compound:    `<KanbanBoard columns={cols} cards={cards}><KanbanBoard.Column id="todo" /></KanbanBoard>`
 *
 * @packageDocumentation
 */

import { forwardRef, useCallback, type ReactNode } from 'react';
import type { KanbanCard, KanbanColumn, KanbanSwimlane } from '@relteco/relui-core';
import { FilePlusIcon } from '@relteco/relui-icons';
import {
  rootStyle, columnStyle, columnHeaderStyle, columnBodyStyle,
  cardStyle, cardTitleStyle, cardDescriptionStyle,
  wipIndicatorStyle, wipOverStyle, addButtonStyle,
  swimlaneStyle, swimlaneHeaderStyle,
} from './kanban-board.css';
import { KanbanCtx, useKanbanContext, type KanbanContextValue } from './kanban-context';
import { useKanbanBoard, type UseKanbanBoardProps } from './useKanbanBoard';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

export type KanbanBoardSlot = 'root' | 'column' | 'columnHeader' | 'card' | 'cardTitle' | 'cardDescription' | 'swimlane' | 'addButton' | 'wipIndicator';

// ── Sub: KanbanBoard.Column ─────────────────────────

export interface KanbanBoardColumnProps {
  /** Sutun id / Column id */
  columnId: string;
  children?: ReactNode;
  className?: string;
}

export const KanbanBoardColumn = forwardRef<HTMLDivElement, KanbanBoardColumnProps>(
  function KanbanBoardColumn(props, ref) {
    const { columnId, children, className } = props;
    const kCtx = useKanbanContext();
    const col = kCtx.ctx.columns.find((c) => c.id === columnId);
    if (!col) return null;

    const slot = getSlotProps('column', columnStyle, kCtx.classNames, kCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const hdrSlot = getSlotProps('columnHeader', columnHeaderStyle, kCtx.classNames, kCtx.styles);
    const colCards = kCtx.ctx.cards
      .filter((c) => c.columnId === columnId)
      .sort((a, b) => a.order - b.order);

    const isOverWip = col.wipLimit !== undefined && colCards.length > col.wipLimit;
    const wipCls = isOverWip ? `${wipIndicatorStyle} ${wipOverStyle}` : wipIndicatorStyle;

    return (
      <div
        ref={ref}
        className={cls}
        style={slot.style}
        data-testid="kanban-column"
        data-column-id={columnId}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => {
          if (kCtx.ctx.dragState) {
            kCtx.api.send({ type: 'MOVE_CARD', cardId: kCtx.ctx.dragState.cardId, toColumnId: columnId });
            kCtx.api.send({ type: 'END_DRAG' });
          }
        }}
      >
        <div className={hdrSlot.className} style={hdrSlot.style} data-testid="kanban-column-header">
          <span>{col.title}</span>
          {col.wipLimit !== undefined && (
            <span className={wipCls} data-testid="kanban-wip-indicator">{colCards.length}/{col.wipLimit}</span>
          )}
        </div>
        <div className={columnBodyStyle}>
          {children ?? colCards.map((card) => (
            <InternalCard key={card.id} card={card} kCtx={kCtx} />
          ))}
        </div>
      </div>
    );
  },
);

// ── Internal Card ───────────────────────────────────

function InternalCard({ card, kCtx }: { card: KanbanCard; kCtx: KanbanContextValue }) {
  const cSlot = getSlotProps('card', cardStyle, kCtx.classNames, kCtx.styles);
  const tSlot = getSlotProps('cardTitle', cardTitleStyle, kCtx.classNames, kCtx.styles);
  const dSlot = getSlotProps('cardDescription', cardDescriptionStyle, kCtx.classNames, kCtx.styles);

  const handleDragStart = useCallback(() => {
    kCtx.api.send({ type: 'START_DRAG', cardId: card.id });
  }, [kCtx.api, card.id]);

  return (
    <div
      className={cSlot.className}
      style={cSlot.style}
      data-testid="kanban-card"
      data-card-id={card.id}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={() => kCtx.api.send({ type: 'END_DRAG' })}
      role="listitem"
    >
      <p className={tSlot.className} style={tSlot.style} data-testid="kanban-card-title">{card.title}</p>
      {card.description && (
        <p className={dSlot.className} style={dSlot.style} data-testid="kanban-card-description">{card.description}</p>
      )}
    </div>
  );
}

// ── Sub: KanbanBoard.Card ───────────────────────────

export interface KanbanBoardCardProps {
  children?: ReactNode;
  className?: string;
}

export const KanbanBoardCard = forwardRef<HTMLDivElement, KanbanBoardCardProps>(
  function KanbanBoardCard(props, ref) {
    const { children, className } = props;
    const kCtx = useKanbanContext();
    const slot = getSlotProps('card', cardStyle, kCtx.classNames, kCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="kanban-card" role="listitem">
        {children}
      </div>
    );
  },
);

// ── Sub: KanbanBoard.Header ─────────────────────────

export interface KanbanBoardHeaderProps {
  children?: ReactNode;
  className?: string;
}

export const KanbanBoardHeader = forwardRef<HTMLDivElement, KanbanBoardHeaderProps>(
  function KanbanBoardHeader(props, ref) {
    const { children, className } = props;
    const kCtx = useKanbanContext();
    const slot = getSlotProps('columnHeader', columnHeaderStyle, kCtx.classNames, kCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return <div ref={ref} className={cls} style={slot.style} data-testid="kanban-column-header">{children}</div>;
  },
);

// ── Sub: KanbanBoard.Swimlane ───────────────────────

export interface KanbanBoardSwimlaneProps {
  children?: ReactNode;
  className?: string;
  title?: string;
}

export const KanbanBoardSwimlane = forwardRef<HTMLDivElement, KanbanBoardSwimlaneProps>(
  function KanbanBoardSwimlane(props, ref) {
    const { children, className, title } = props;
    const kCtx = useKanbanContext();
    const slot = getSlotProps('swimlane', swimlaneStyle, kCtx.classNames, kCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return (
      <div ref={ref} className={cls} style={slot.style} data-testid="kanban-swimlane">
        {title && <div className={swimlaneHeaderStyle} data-testid="kanban-swimlane-header">{title}</div>}
        {children}
      </div>
    );
  },
);

// ── Sub: KanbanBoard.AddButton ──────────────────────

export interface KanbanBoardAddButtonProps {
  columnId: string;
  onClick?: () => void;
  className?: string;
}

export const KanbanBoardAddButton = forwardRef<HTMLButtonElement, KanbanBoardAddButtonProps>(
  function KanbanBoardAddButton(props, ref) {
    const { columnId, onClick, className } = props;
    const kCtx = useKanbanContext();
    const slot = getSlotProps('addButton', addButtonStyle, kCtx.classNames, kCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const handleClick = useCallback(() => {
      if (onClick) { onClick(); return; }
      kCtx.api.send({
        type: 'ADD_CARD',
        card: { id: `card-${Date.now()}`, title: 'New Card', columnId },
      });
    }, [onClick, kCtx.api, columnId]);

    return (
      <button ref={ref} className={cls} style={slot.style} onClick={handleClick} type="button" data-testid="kanban-add-btn" aria-label="Add card">
        <FilePlusIcon size={14} /> Add Card
      </button>
    );
  },
);

// ── Component Props ──────────────────────────────────

export interface KanbanBoardComponentProps extends SlotStyleProps<KanbanBoardSlot> {
  columns: KanbanColumn[];
  cards?: KanbanCard[];
  swimlanes?: KanbanSwimlane[];
  onCardMove?: (cardId: string, toColumnId: string, toSwimlaneId?: string) => void;
  onCardAdd?: (card: KanbanCard) => void;
  onCardRemove?: (cardId: string) => void;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// ── Component ────────────────────────────────────────

export const KanbanBoardBase = forwardRef<HTMLDivElement, KanbanBoardComponentProps>(
  function KanbanBoard(props, ref) {
    const {
      columns, cards = [], swimlanes,
      onCardMove, onCardAdd, onCardRemove,
      children, className, style: styleProp, classNames, styles,
    } = props;

    const hookProps: UseKanbanBoardProps = { columns, cards, swimlanes, onCardMove, onCardAdd, onCardRemove };
    const { api, ctx } = useKanbanBoard(hookProps);

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootCls = className ? `${rootSlot.className} ${className}` : rootSlot.className;
    const ctxValue: KanbanContextValue = { api, ctx, classNames, styles };

    if (children) {
      return (
        <KanbanCtx.Provider value={ctxValue}>
          <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="kanban-root" role="region" aria-label="Kanban board">
            {children}
          </div>
        </KanbanCtx.Provider>
      );
    }

    return (
      <KanbanCtx.Provider value={ctxValue}>
        <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="kanban-root" role="region" aria-label="Kanban board">
          {[...ctx.columns].sort((a, b) => a.order - b.order).map((col) => (
            <KanbanBoardColumn key={col.id} columnId={col.id} />
          ))}
        </div>
      </KanbanCtx.Provider>
    );
  },
);

/**
 * KanbanBoard bilesen — Dual API (props-based + compound).
 */
export const KanbanBoard = Object.assign(KanbanBoardBase, {
  Column: KanbanBoardColumn,
  Card: KanbanBoardCard,
  Header: KanbanBoardHeader,
  Swimlane: KanbanBoardSwimlane,
  AddButton: KanbanBoardAddButton,
});

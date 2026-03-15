/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Timeline — zaman cizelgesi bilesen. Dual API destekler.
 * Timeline — timeline component. Supports Dual API.
 *
 * @packageDocumentation
 */

import { forwardRef, createContext, useContext, type ReactNode } from 'react';
import {
  rootVerticalStyle,
  rootHorizontalStyle,
  itemVerticalStyle,
  itemHorizontalStyle,
  dotStyle,
  connectorVerticalStyle,
  connectorHorizontalStyle,
  contentVerticalStyle,
  contentHorizontalStyle,
  titleStyle,
  descriptionStyle,
  dateStyle,
  alignStyles,
  contentAlignRightStyle,
  connectorAlignRightStyle,
} from './timeline.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

/** Timeline slot isimleri / Timeline slot names. */
export type TimelineSlot = 'root' | 'item' | 'dot' | 'connector' | 'content' | 'title' | 'description' | 'date';

// ── Types ─────────────────────────────────────────────

/** Timeline yon / Timeline orientation */
export type TimelineOrientation = 'vertical' | 'horizontal';

/** Timeline hizalama (sadece vertical) / Timeline alignment (vertical only) */
export type TimelineAlign = 'left' | 'right' | 'alternate';

/** Timeline item tanimlari (props-based) / Timeline item definition (props-based) */
export interface TimelineItemDef {
  /** Benzersiz kimlik / Unique identifier */
  id: string;
  /** Baslik / Title */
  title: ReactNode;
  /** Aciklama / Description */
  description?: ReactNode;
  /** Tarih / Date */
  date?: ReactNode;
  /** Ikon / Icon */
  icon?: ReactNode;
  /** Nokta rengi / Dot color */
  color?: string;
}

// ── Context ───────────────────────────────────────────

interface TimelineContextValue {
  orientation: TimelineOrientation;
  align: TimelineAlign;
  classNames: ClassNames<TimelineSlot> | undefined;
  styles: Styles<TimelineSlot> | undefined;
  isLast: boolean;
  index: number;
}

const TimelineContext = createContext<TimelineContextValue | null>(null);

function useTimelineContext(): TimelineContextValue {
  const ctx = useContext(TimelineContext);
  if (!ctx) throw new Error('Timeline.Item must be used within <Timeline>');
  return ctx;
}

// ── Component Props ───────────────────────────────────

export interface TimelineComponentProps extends SlotStyleProps<TimelineSlot> {
  /** Props-based: item listesi / Item list for auto-render */
  items?: TimelineItemDef[];
  /** Compound: children ile manual render */
  children?: ReactNode;
  /** Yon / Orientation */
  orientation?: TimelineOrientation;
  /** Hizalama (sadece vertical) / Alignment (vertical only) */
  align?: TimelineAlign;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
}

// ── Internal Item Renderer ────────────────────────────

interface TimelineItemInternalProps {
  title: ReactNode;
  description?: ReactNode;
  date?: ReactNode;
  icon?: ReactNode;
  color?: string;
  isLast: boolean;
  index: number;
  orientation: TimelineOrientation;
  align: TimelineAlign;
  classNames: ClassNames<TimelineSlot> | undefined;
  styles: Styles<TimelineSlot> | undefined;
}

function TimelineItemInternal(props: TimelineItemInternalProps) {
  const {
    title,
    description,
    date,
    icon,
    color,
    isLast,
    index,
    orientation,
    align,
    classNames: cn,
    styles: st,
  } = props;

  const isHorizontal = orientation === 'horizontal';
  const isRight = !isHorizontal && (align === 'right' || (align === 'alternate' && index % 2 === 1));

  const itemBase = isHorizontal ? itemHorizontalStyle : itemVerticalStyle;
  const contentBase = isHorizontal ? contentHorizontalStyle : contentVerticalStyle;

  const itemCls = isRight ? `${itemBase} ${alignStyles.right}` : itemBase;
  const contentCls = isRight ? `${contentBase} ${contentAlignRightStyle}` : contentBase;

  const itemSlot = getSlotProps('item', itemCls, cn, st);
  const dotSlot = getSlotProps('dot', dotStyle, cn, st);
  const contentSlot = getSlotProps('content', contentCls, cn, st);
  const titleSlot = getSlotProps('title', titleStyle, cn, st);
  const descSlot = getSlotProps('description', descriptionStyle, cn, st);
  const dateSlot = getSlotProps('date', dateStyle, cn, st);

  const connectorBase = isHorizontal ? connectorHorizontalStyle : connectorVerticalStyle;
  const connectorCls = isRight ? `${connectorBase} ${connectorAlignRightStyle}` : connectorBase;
  const connectorSlot = getSlotProps('connector', connectorCls, cn, st);

  const dotInlineStyle = color
    ? { ...dotSlot.style, backgroundColor: color }
    : dotSlot.style;

  return (
    <div
      className={itemSlot.className}
      style={itemSlot.style}
      data-testid="timeline-item"
    >
      {/* Dot */}
      <div
        className={dotSlot.className}
        style={dotInlineStyle}
        data-testid="timeline-dot"
      >
        {icon}
      </div>

      {/* Connector */}
      {!isLast && (
        <div
          className={connectorSlot.className}
          style={connectorSlot.style}
          data-testid="timeline-connector"
        />
      )}

      {/* Content */}
      <div
        className={contentSlot.className}
        style={contentSlot.style}
        data-testid="timeline-content"
      >
        <p
          className={titleSlot.className}
          style={titleSlot.style}
          data-testid="timeline-title"
        >
          {title}
        </p>
        {description !== undefined && (
          <p
            className={descSlot.className}
            style={descSlot.style}
            data-testid="timeline-description"
          >
            {description}
          </p>
        )}
        {date !== undefined && (
          <p
            className={dateSlot.className}
            style={dateSlot.style}
            data-testid="timeline-date"
          >
            {date}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────

const TimelineBase = forwardRef<HTMLDivElement, TimelineComponentProps>(
  function Timeline(props, ref) {
    const {
      items,
      children,
      orientation = 'vertical',
      align = 'left',
      className,
      style: styleProp,
      classNames,
      styles,
    } = props;

    const rootBase = orientation === 'horizontal' ? rootHorizontalStyle : rootVerticalStyle;
    const rootSlot = getSlotProps('root', rootBase, classNames, styles);

    const rootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    const totalItems = items ? items.length : 0;

    return (
      <div
        ref={ref}
        className={rootClassName}
        style={{ ...rootSlot.style, ...styleProp }}
        data-testid="timeline-root"
        data-orientation={orientation}
        data-align={align}
      >
        {/* Props-based */}
        {items && items.map((item, index) => (
          <TimelineItemInternal
            key={item.id}
            title={item.title}
            description={item.description}
            date={item.date}
            icon={item.icon}
            color={item.color}
            isLast={index === totalItems - 1}
            index={index}
            orientation={orientation}
            align={align}
            classNames={classNames}
            styles={styles}
          />
        ))}
        {/* Compound */}
        {!items && children !== undefined && (
          <TimelineCompoundWrapper
            orientation={orientation}
            align={align}
            classNames={classNames}
            styles={styles}
          >
            {children}
          </TimelineCompoundWrapper>
        )}
      </div>
    );
  },
);

// ── Compound Wrapper ──────────────────────────────────

interface TimelineCompoundWrapperProps {
  children: ReactNode;
  orientation: TimelineOrientation;
  align: TimelineAlign;
  classNames: ClassNames<TimelineSlot> | undefined;
  styles: Styles<TimelineSlot> | undefined;
}

function TimelineCompoundWrapper(props: TimelineCompoundWrapperProps) {
  const { children, orientation, align, classNames, styles } = props;
  const childArray = Array.isArray(children) ? children.flat().filter(Boolean) : [children];
  const total = childArray.length;

  return (
    <>
      {childArray.map((child, index) => (
        <TimelineContext.Provider
          key={index}
          value={{
            orientation,
            align,
            classNames,
            styles,
            isLast: index === total - 1,
            index,
          }}
        >
          {child}
        </TimelineContext.Provider>
      ))}
    </>
  );
}

// ── Sub-component (compound) ──────────────────────────

export interface TimelineItemProps {
  /** Baslik / Title */
  title: ReactNode;
  /** Aciklama / Description */
  description?: ReactNode;
  /** Tarih / Date */
  date?: ReactNode;
  /** Ikon / Icon */
  icon?: ReactNode;
  /** Nokta rengi / Dot color */
  color?: string;
}

const TimelineItem = forwardRef<HTMLDivElement, TimelineItemProps>(
  function TimelineItem(props, _ref) {
    const ctx = useTimelineContext();
    return (
      <TimelineItemInternal
        title={props.title}
        description={props.description}
        date={props.date}
        icon={props.icon}
        color={props.color}
        isLast={ctx.isLast}
        index={ctx.index}
        orientation={ctx.orientation}
        align={ctx.align}
        classNames={ctx.classNames}
        styles={ctx.styles}
      />
    );
  },
);

// ── Export ─────────────────────────────────────────────

export const Timeline = Object.assign(TimelineBase, {
  Item: TimelineItem,
});

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Accordion — acilip kapanabilen icerik panelleri (Dual API).
 * Accordion — collapsible content panels (Dual API).
 *
 * Props-based: `<Accordion items={[...]} />`
 * Compound:    `<Accordion><Accordion.Item>...<Accordion.Trigger>...<Accordion.Content>...</Accordion>`
 *
 * @packageDocumentation
 */

import {
  forwardRef,
  useRef,
  useEffect,
  useReducer,
  useCallback,
  useId,
  createContext,
  useContext,
  type ReactNode,
} from 'react';
import {
  accordionRootStyle,
  accordionItemStyle,
  accordionTriggerStyle,
  accordionIconStyle,
  accordionContentStyle,
} from './accordion.css';
import { getSlotProps, type SlotStyleProps, type ClassNames, type Styles } from '../utils/slot-styles';
import {
  createAccordion,
  type AccordionAPI,
} from '@relteco/relui-core';
import { ChevronDownIcon } from '@relteco/relui-icons';

// ── Slot ──────────────────────────────────────────────

/**
 * Accordion slot isimleri / Accordion slot names.
 */
export type AccordionSlot = 'root' | 'item' | 'trigger' | 'icon' | 'content';

// ── Item Type ────────────────────────────────────────

/** Accordion item tanimlari / Accordion item definitions */
export interface AccordionItemDef {
  /** Benzersiz id / Unique ID */
  id: string;
  /** Baslik / Title */
  title: React.ReactNode;
  /** Icerik / Content */
  content: React.ReactNode;
  /** Devre disi / Disabled */
  disabled?: boolean;
}

// ── Context (Compound API) ──────────────────────────

interface AccordionContextValue {
  classNames: ClassNames<AccordionSlot> | undefined;
  styles: Styles<AccordionSlot> | undefined;
  expandedIds: ReadonlySet<string>;
  handleToggle: (itemId: string) => void;
  instanceId: string;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext(): AccordionContextValue {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error('Accordion compound sub-components must be used within <Accordion>.');
  return ctx;
}

// ── Item Context (her item icin) ────────────────────

interface AccordionItemContextValue {
  itemId: string;
  disabled: boolean;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

function useAccordionItemContext(): AccordionItemContextValue {
  const ctx = useContext(AccordionItemContext);
  if (!ctx) throw new Error('Accordion.Trigger/Content must be used within <Accordion.Item>.');
  return ctx;
}

// ── Compound: Accordion.Item ────────────────────────

/** Accordion.Item props */
export interface AccordionItemProps {
  /** Benzersiz id / Unique ID */
  id: string;
  /** Devre disi / Disabled */
  disabled?: boolean;
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  function AccordionItem(props, ref) {
    const { id, disabled = false, children, className } = props;
    const ctx = useAccordionContext();

    const slot = getSlotProps('item', accordionItemStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const itemCtx: AccordionItemContextValue = { itemId: id, disabled };

    return (
      <AccordionItemContext.Provider value={itemCtx}>
        <div
          ref={ref}
          className={cls}
          style={slot.style}
          data-testid={`accordion-item-${id}`}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  },
);

// ── Compound: Accordion.Trigger ─────────────────────

/** Accordion.Trigger props */
export interface AccordionTriggerProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  function AccordionTrigger(props, ref) {
    const { children, className } = props;
    const ctx = useAccordionContext();
    const itemCtx = useAccordionItemContext();

    const isExpanded = ctx.expandedIds.has(itemCtx.itemId);
    const triggerId = `${ctx.instanceId}-trigger-${itemCtx.itemId}`;
    const contentId = `${ctx.instanceId}-content-${itemCtx.itemId}`;

    const slot = getSlotProps('trigger', accordionTriggerStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    const iconSlot = getSlotProps('icon', accordionIconStyle, ctx.classNames, ctx.styles);

    return (
      <button
        ref={ref}
        id={triggerId}
        className={cls}
        style={slot.style}
        type="button"
        onClick={() => !itemCtx.disabled && ctx.handleToggle(itemCtx.itemId)}
        aria-expanded={isExpanded}
        aria-controls={contentId}
        aria-disabled={itemCtx.disabled || undefined}
        disabled={itemCtx.disabled}
        data-testid={`accordion-trigger-${itemCtx.itemId}`}
      >
        <span>{children}</span>
        <span
          className={iconSlot.className}
          style={{
            ...iconSlot.style,
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
          aria-hidden="true"
        >
          <ChevronDownIcon size={16} />
        </span>
      </button>
    );
  },
);

// ── Compound: Accordion.Content ─────────────────────

/** Accordion.Content props */
export interface AccordionContentProps {
  /** Icerik / Content */
  children: ReactNode;
  /** Ek className / Additional className */
  className?: string;
}

const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  function AccordionContent(props, ref) {
    const { children, className } = props;
    const ctx = useAccordionContext();
    const itemCtx = useAccordionItemContext();

    const isExpanded = ctx.expandedIds.has(itemCtx.itemId);
    const triggerId = `${ctx.instanceId}-trigger-${itemCtx.itemId}`;
    const contentId = `${ctx.instanceId}-content-${itemCtx.itemId}`;

    if (!isExpanded) return null;

    const slot = getSlotProps('content', accordionContentStyle, ctx.classNames, ctx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div
        ref={ref}
        id={contentId}
        className={cls}
        style={slot.style}
        role="region"
        aria-labelledby={triggerId}
        data-testid={`accordion-content-${itemCtx.itemId}`}
      >
        {children}
      </div>
    );
  },
);

// ── Component Props ─────────────────────────────────

export interface AccordionComponentProps extends SlotStyleProps<AccordionSlot> {
  /** Accordion ogeleri / Accordion items */
  items?: AccordionItemDef[];
  /** Birden fazla item ayni anda acik olabilir mi / Allow multiple open */
  allowMultiple?: boolean;
  /** Baslangicta acik olan id ler / Initially expanded IDs */
  defaultExpanded?: string[];
  /** Acik olan id ler (controlled) / Expanded IDs (controlled) */
  expanded?: string[];
  /** Expand/collapse degisince callback / On expand change callback */
  onExpandChange?: (expandedIds: string[]) => void;
  /** Ek className / Additional className */
  className?: string;
  /** Inline style / Inline style */
  style?: React.CSSProperties;
  /** Compound API icin children / Children for compound API */
  children?: ReactNode;
}

// ── Component ─────────────────────────────────────────

const AccordionBase = forwardRef<HTMLDivElement, AccordionComponentProps>(
  function Accordion(props, ref) {
    const {
      items,
      allowMultiple = false,
      defaultExpanded,
      expanded: controlledExpanded,
      onExpandChange,
      className,
      style: styleProp,
      classNames,
      styles,
      children,
    } = props;

    const isControlled = controlledExpanded !== undefined;
    const [, forceRender] = useReducer((c: number) => c + 1, 0);
    const instanceId = useId();

    // ── Core API ──
    const onExpandChangeRef = useRef(onExpandChange);
    onExpandChangeRef.current = onExpandChange;

    const apiRef = useRef<AccordionAPI | null>(null);
    if (!apiRef.current) {
      apiRef.current = createAccordion({
        allowMultiple,
        defaultExpanded: isControlled ? controlledExpanded : defaultExpanded,
        onExpandChange: (ids) => {
          onExpandChangeRef.current?.(ids);
        },
      });
    }
    const api = apiRef.current;

    // ── Prop sync: controlled expanded ──
    const prevExpandedRef = useRef<string[] | undefined>(undefined);
    if (isControlled && controlledExpanded !== prevExpandedRef.current) {
      const currentIds = api.getContext().expandedIds;
      const targetSet = new Set(controlledExpanded);

      // Collapse items that should be closed
      currentIds.forEach((id) => {
        if (!targetSet.has(id)) {
          api.send({ type: 'COLLAPSE', itemId: id });
        }
      });

      // Expand items that should be open
      controlledExpanded.forEach((id) => {
        if (!currentIds.has(id)) {
          api.send({ type: 'EXPAND', itemId: id });
        }
      });

      prevExpandedRef.current = controlledExpanded;
    }

    // ── Subscribe ──
    useEffect(() => {
      return api.subscribe(() => forceRender());
    }, [api]);

    const ctx = api.getContext();

    // ── Toggle handler ──
    const handleToggle = useCallback((itemId: string) => {
      if (isControlled) {
        const currentIds = Array.from(api.getContext().expandedIds);
        const isExpanded = currentIds.includes(itemId);
        let nextIds: string[];

        if (isExpanded) {
          nextIds = currentIds.filter((id) => id !== itemId);
        } else {
          if (allowMultiple) {
            nextIds = [...currentIds, itemId];
          } else {
            nextIds = [itemId];
          }
        }

        onExpandChangeRef.current?.(nextIds);
      } else {
        api.send({ type: 'TOGGLE', itemId });
      }
    }, [isControlled, allowMultiple, api]);

    // ── Slots ──
    const rootSlot = getSlotProps('root', accordionRootStyle, classNames, styles);
    const rootClassName = className
      ? `${rootSlot.className} ${className}`
      : rootSlot.className;

    // ── Compound API ──
    if (children && !items) {
      const ctxValue: AccordionContextValue = {
        classNames,
        styles,
        expandedIds: ctx.expandedIds,
        handleToggle,
        instanceId,
      };

      return (
        <AccordionContext.Provider value={ctxValue}>
          <div
            ref={ref}
            className={rootClassName}
            style={{ ...rootSlot.style, ...styleProp }}
            data-testid="accordion-root"
          >
            {children}
          </div>
        </AccordionContext.Provider>
      );
    }

    // ── Props-based API ──
    const itemSlot = getSlotProps('item', accordionItemStyle, classNames, styles);
    const triggerSlot = getSlotProps('trigger', accordionTriggerStyle, classNames, styles);
    const iconSlot = getSlotProps('icon', accordionIconStyle, classNames, styles);
    const contentSlot = getSlotProps('content', accordionContentStyle, classNames, styles);

    return (
      <div
        ref={ref}
        className={rootClassName}
        style={{ ...rootSlot.style, ...styleProp }}
        data-testid="accordion-root"
      >
        {items && items.map((item) => {
          const isExpanded = ctx.expandedIds.has(item.id);
          const triggerId = `${instanceId}-trigger-${item.id}`;
          const contentId = `${instanceId}-content-${item.id}`;

          return (
            <div
              key={item.id}
              className={itemSlot.className}
              style={itemSlot.style}
              data-testid={`accordion-item-${item.id}`}
            >
              <button
                id={triggerId}
                className={triggerSlot.className}
                style={triggerSlot.style}
                type="button"
                onClick={() => !item.disabled && handleToggle(item.id)}
                aria-expanded={isExpanded}
                aria-controls={contentId}
                aria-disabled={item.disabled || undefined}
                disabled={item.disabled}
                data-testid={`accordion-trigger-${item.id}`}
              >
                <span>{item.title}</span>
                <span
                  className={iconSlot.className}
                  style={{
                    ...iconSlot.style,
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                  aria-hidden="true"
                >
                  <ChevronDownIcon size={16} />
                </span>
              </button>

              {isExpanded && (
                <div
                  id={contentId}
                  className={contentSlot.className}
                  style={contentSlot.style}
                  role="region"
                  aria-labelledby={triggerId}
                  data-testid={`accordion-content-${item.id}`}
                >
                  {item.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  },
);

/**
 * Accordion bilesen — Dual API (props-based + compound).
 *
 * @example Props-based
 * ```tsx
 * <Accordion
 *   items={[
 *     { id: '1', title: 'Bolum 1', content: <p>Icerik 1</p> },
 *     { id: '2', title: 'Bolum 2', content: <p>Icerik 2</p> },
 *   ]}
 * />
 * ```
 *
 * @example Compound
 * ```tsx
 * <Accordion>
 *   <Accordion.Item id="1">
 *     <Accordion.Trigger>Bolum 1</Accordion.Trigger>
 *     <Accordion.Content>Icerik 1</Accordion.Content>
 *   </Accordion.Item>
 *   <Accordion.Item id="2">
 *     <Accordion.Trigger>Bolum 2</Accordion.Trigger>
 *     <Accordion.Content>Icerik 2</Accordion.Content>
 *   </Accordion.Item>
 * </Accordion>
 * ```
 */
export const Accordion = Object.assign(AccordionBase, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * FilterBuilder — gorsel sorgu olusturucu bilesen (Dual API).
 * FilterBuilder — visual query builder component (Dual API).
 *
 * Props-based: `<FilterBuilder fields={fields} onChange={fn} />`
 * Compound:    `<FilterBuilder fields={fields}><FilterBuilder.Group /><FilterBuilder.AddButton /></FilterBuilder>`
 *
 * @packageDocumentation
 */

import { forwardRef, useCallback, type ReactNode } from 'react';
import { type FilterField, type FilterGroup, type FilterRule, type FilterBuilderOperator, isFilterGroup } from '@relteco/relui-core';
import { CloseIcon } from '@relteco/relui-icons';
import {
  rootStyle, groupStyle, groupHeaderStyle, combinatorStyle, ruleStyle,
  fieldStyle, operatorStyle, valueStyle, addButtonStyle, removeButtonStyle,
} from './filter-builder.css';
import { FilterBuilderCtx, useFilterBuilderContext, type FilterBuilderContextValue } from './filter-builder-context';
import { useFilterBuilder, type UseFilterBuilderProps } from './useFilterBuilder';
import { getSlotProps, type SlotStyleProps } from '../utils/slot-styles';

// ── Slot ──────────────────────────────────────────────

export type FilterBuilderSlot = 'root' | 'group' | 'groupHeader' | 'rule' | 'field' | 'operator' | 'value' | 'addButton';

// ── Default operators ───────────────────────────────

const DEFAULT_OPERATORS: FilterBuilderOperator[] = ['=', '!=', '>', '<', '>=', '<=', 'contains', 'not_contains', 'starts_with', 'ends_with', 'between', 'is_empty', 'is_not_empty'];

// ── Internal: Recursive Group Renderer ──────────────

function GroupRenderer({ groupId, fbCtx }: { groupId: string; fbCtx: ReturnType<typeof useFilterBuilderContext> }) {
  const group = findGroup(fbCtx.ctx.rootGroup, groupId);
  if (!group) return null;

  const slot = getSlotProps('group', groupStyle, fbCtx.classNames, fbCtx.styles);
  const ghSlot = getSlotProps('groupHeader', groupHeaderStyle, fbCtx.classNames, fbCtx.styles);

  return (
    <div className={slot.className} style={slot.style} data-testid="filter-builder-group" data-group-id={group.id}>
      <div className={ghSlot.className} style={ghSlot.style} data-testid="filter-builder-group-header">
        <button
          className={combinatorStyle}
          onClick={() => fbCtx.api.send({ type: 'SET_COMBINATOR', groupId: group.id, combinator: group.combinator === 'and' ? 'or' : 'and' })}
          type="button"
          data-testid="filter-builder-combinator"
        >
          {group.combinator.toUpperCase()}
        </button>
        {group.id !== fbCtx.ctx.rootGroup.id && (
          <button className={removeButtonStyle} onClick={() => fbCtx.api.send({ type: 'REMOVE_GROUP', groupId: group.id })} type="button" data-testid="filter-builder-remove-group" aria-label="Remove group">
            <CloseIcon size={12} />
          </button>
        )}
      </div>
      {group.children.map((child) =>
        isFilterGroup(child) ? (
          <GroupRenderer key={child.id} groupId={child.id} fbCtx={fbCtx} />
        ) : (
          <RuleRow key={child.id} rule={child} fbCtx={fbCtx} />
        ),
      )}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className={addButtonStyle}
            onClick={() => fbCtx.api.send({ type: 'ADD_RULE', groupId: group.id, rule: { id: `rule-${Date.now()}`, field: fbCtx.fields[0]?.key ?? '', operator: '=', value: '' } })}
            type="button"
            data-testid="filter-builder-add-rule"
          >
            + Rule
          </button>
          <button
            className={addButtonStyle}
            onClick={() => fbCtx.api.send({ type: 'ADD_GROUP', parentGroupId: group.id, group: { id: `group-${Date.now()}`, combinator: 'and', children: [] } })}
            type="button"
            data-testid="filter-builder-add-group"
          >
            + Group
          </button>
        </div>
      </div>
    );
}

// ── Sub: FilterBuilder.Group ────────────────────────

export interface FilterBuilderGroupProps { groupId?: string; className?: string; }

export const FilterBuilderGroup = forwardRef<HTMLDivElement, FilterBuilderGroupProps>(
  function FilterBuilderGroup(props, ref) {
    const { groupId, className } = props;
    const fbCtx = useFilterBuilderContext();
    const targetId = groupId ?? fbCtx.ctx.rootGroup.id;
    const slot = getSlotProps('group', groupStyle, fbCtx.classNames, fbCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;

    return (
      <div ref={ref} className={cls} style={slot.style}>
        <GroupRenderer groupId={targetId} fbCtx={fbCtx} />
      </div>
    );
  },
);

// ── Internal: RuleRow ───────────────────────────────

function RuleRow({ rule, fbCtx }: { rule: FilterRule; fbCtx: FilterBuilderContextValue }) {
  const rSlot = getSlotProps('rule', ruleStyle, fbCtx.classNames, fbCtx.styles);
  const fSlot = getSlotProps('field', fieldStyle, fbCtx.classNames, fbCtx.styles);
  const oSlot = getSlotProps('operator', operatorStyle, fbCtx.classNames, fbCtx.styles);
  const vSlot = getSlotProps('value', valueStyle, fbCtx.classNames, fbCtx.styles);

  return (
    <div className={rSlot.className} style={rSlot.style} data-testid="filter-builder-rule" data-rule-id={rule.id}>
      <select className={fSlot.className} style={fSlot.style} value={rule.field} onChange={(e) => fbCtx.api.send({ type: 'UPDATE_RULE', ruleId: rule.id, updates: { field: e.target.value } })} data-testid="filter-builder-field">
        {fbCtx.fields.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
      </select>
      <select className={oSlot.className} style={oSlot.style} value={rule.operator} onChange={(e) => fbCtx.api.send({ type: 'UPDATE_RULE', ruleId: rule.id, updates: { operator: e.target.value as FilterBuilderOperator } })} data-testid="filter-builder-operator">
        {fbCtx.operators.map((op) => <option key={op} value={op}>{op}</option>)}
      </select>
      <input className={vSlot.className} style={vSlot.style} value={rule.value} onChange={(e) => fbCtx.api.send({ type: 'UPDATE_RULE', ruleId: rule.id, updates: { value: e.target.value } })} data-testid="filter-builder-value" placeholder="Value..." />
      <button className={removeButtonStyle} onClick={() => fbCtx.api.send({ type: 'REMOVE_RULE', ruleId: rule.id })} type="button" data-testid="filter-builder-remove-rule" aria-label="Remove rule">
        <CloseIcon size={12} />
      </button>
    </div>
  );
}

// ── Sub: FilterBuilder.Rule ─���───────────────────────

export interface FilterBuilderRuleProps { children?: ReactNode; className?: string; }

export const FilterBuilderRule = forwardRef<HTMLDivElement, FilterBuilderRuleProps>(
  function FilterBuilderRule(props, ref) {
    const { children, className } = props;
    const fbCtx = useFilterBuilderContext();
    const slot = getSlotProps('rule', ruleStyle, fbCtx.classNames, fbCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    return <div ref={ref} className={cls} style={slot.style} data-testid="filter-builder-rule">{children}</div>;
  },
);

// ── Sub: FilterBuilder.AddButton ────────────────────

export interface FilterBuilderAddButtonProps { groupId?: string; className?: string; }

export const FilterBuilderAddButton = forwardRef<HTMLButtonElement, FilterBuilderAddButtonProps>(
  function FilterBuilderAddButton(props, ref) {
    const { groupId, className } = props;
    const fbCtx = useFilterBuilderContext();
    const slot = getSlotProps('addButton', addButtonStyle, fbCtx.classNames, fbCtx.styles);
    const cls = className ? `${slot.className} ${className}` : slot.className;
    const targetId = groupId ?? fbCtx.ctx.rootGroup.id;

    const handleClick = useCallback(() => {
      fbCtx.api.send({
        type: 'ADD_RULE',
        groupId: targetId,
        rule: { id: `rule-${Date.now()}`, field: fbCtx.fields[0]?.key ?? '', operator: '=', value: '' },
      });
    }, [fbCtx, targetId]);

    return <button ref={ref} className={cls} style={slot.style} onClick={handleClick} type="button" data-testid="filter-builder-add-btn">+ Add Rule</button>;
  },
);

// ── Component Props ──────────────────────────────────

export interface FilterBuilderComponentProps extends SlotStyleProps<FilterBuilderSlot> {
  /** Alan tanimlari / Field definitions */
  fields: FilterField[];
  /** Baslangic grubu / Default group */
  defaultGroup?: FilterGroup;
  /** Operatorler / Available operators */
  operators?: FilterBuilderOperator[];
  /** Degisiklik callback / On change */
  onChange?: (group: FilterGroup) => void;
  /** Compound children */
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// ── Component ────────────────────────────────────────

export const FilterBuilderBase = forwardRef<HTMLDivElement, FilterBuilderComponentProps>(
  function FilterBuilder(props, ref) {
    const {
      fields, defaultGroup, operators = DEFAULT_OPERATORS, onChange,
      children, className, style: styleProp, classNames, styles,
    } = props;

    const hookProps: UseFilterBuilderProps = { defaultGroup, onChange };
    const { api, ctx } = useFilterBuilder(hookProps);

    const rootSlot = getSlotProps('root', rootStyle, classNames, styles);
    const rootCls = className ? `${rootSlot.className} ${className}` : rootSlot.className;
    const ctxValue: FilterBuilderContextValue = { api, ctx, fields, operators, classNames, styles };

    if (children) {
      return (
        <FilterBuilderCtx.Provider value={ctxValue}>
          <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="filter-builder-root">{children}</div>
        </FilterBuilderCtx.Provider>
      );
    }

    return (
      <FilterBuilderCtx.Provider value={ctxValue}>
        <div ref={ref} className={rootCls} style={{ ...rootSlot.style, ...styleProp }} data-testid="filter-builder-root">
          <FilterBuilderGroup />
        </div>
      </FilterBuilderCtx.Provider>
    );
  },
);

// ── Helper ──────────────────────────────────────────

function findGroup(group: FilterGroup, id: string): FilterGroup | null {
  if (group.id === id) return group;
  for (const child of group.children) {
    if (isFilterGroup(child)) {
      const found = findGroup(child, id);
      if (found) return found;
    }
  }
  return null;
}

/**
 * FilterBuilder bilesen — Dual API (props-based + compound).
 */
export const FilterBuilder = Object.assign(FilterBuilderBase, {
  Group: FilterBuilderGroup,
  Rule: FilterBuilderRule,
  AddButton: FilterBuilderAddButton,
});

/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { createFilterBuilder } from './filter-builder.machine';
import type { FilterGroup, FilterRule } from './filter-builder.types';

function makeRule(id: string, field = 'name', op: FilterRule['operator'] = '=', value = 'test'): FilterRule {
  return { id, field, operator: op, value };
}

function makeGroup(id: string, combinator: FilterGroup['combinator'] = 'and', children: FilterGroup['children'] = []): FilterGroup {
  return { id, combinator, children };
}

describe('createFilterBuilder', () => {
  it('baslangic state bos root group', () => {
    const api = createFilterBuilder();
    const ctx = api.getContext();
    expect(ctx.rootGroup.id).toBe('root');
    expect(ctx.rootGroup.combinator).toBe('and');
    expect(ctx.rootGroup.children).toHaveLength(0);
  });

  it('defaultGroup ile baslatilir', () => {
    const group = makeGroup('r', 'or', [makeRule('r1')]);
    const api = createFilterBuilder({ defaultGroup: group });
    expect(api.getContext().rootGroup.children).toHaveLength(1);
  });

  it('ADD_RULE kural ekler', () => {
    const api = createFilterBuilder();
    api.send({ type: 'ADD_RULE', groupId: 'root', rule: makeRule('r1') });
    expect(api.getContext().rootGroup.children).toHaveLength(1);
  });

  it('REMOVE_RULE kural siler', () => {
    const api = createFilterBuilder({ defaultGroup: makeGroup('root', 'and', [makeRule('r1')]) });
    api.send({ type: 'REMOVE_RULE', ruleId: 'r1' });
    expect(api.getContext().rootGroup.children).toHaveLength(0);
  });

  it('UPDATE_RULE kural gunceller', () => {
    const api = createFilterBuilder({ defaultGroup: makeGroup('root', 'and', [makeRule('r1', 'name', '=', 'old')]) });
    api.send({ type: 'UPDATE_RULE', ruleId: 'r1', updates: { value: 'new' } });
    const rule = api.getContext().rootGroup.children[0] as FilterRule;
    expect(rule.value).toBe('new');
  });

  it('UPDATE_RULE field degistirir', () => {
    const api = createFilterBuilder({ defaultGroup: makeGroup('root', 'and', [makeRule('r1')]) });
    api.send({ type: 'UPDATE_RULE', ruleId: 'r1', updates: { field: 'email' } });
    const rule = api.getContext().rootGroup.children[0] as FilterRule;
    expect(rule.field).toBe('email');
  });

  it('UPDATE_RULE operator degistirir', () => {
    const api = createFilterBuilder({ defaultGroup: makeGroup('root', 'and', [makeRule('r1')]) });
    api.send({ type: 'UPDATE_RULE', ruleId: 'r1', updates: { operator: 'contains' } });
    const rule = api.getContext().rootGroup.children[0] as FilterRule;
    expect(rule.operator).toBe('contains');
  });

  it('ADD_GROUP alt grup ekler', () => {
    const api = createFilterBuilder();
    api.send({ type: 'ADD_GROUP', parentGroupId: 'root', group: makeGroup('g1', 'or') });
    expect(api.getContext().rootGroup.children).toHaveLength(1);
  });

  it('REMOVE_GROUP alt grup siler', () => {
    const api = createFilterBuilder({ defaultGroup: makeGroup('root', 'and', [makeGroup('g1', 'or')]) });
    api.send({ type: 'REMOVE_GROUP', groupId: 'g1' });
    expect(api.getContext().rootGroup.children).toHaveLength(0);
  });

  it('REMOVE_GROUP root silinmez', () => {
    const api = createFilterBuilder();
    api.send({ type: 'REMOVE_GROUP', groupId: 'root' });
    expect(api.getContext().rootGroup.id).toBe('root');
  });

  it('SET_COMBINATOR birlestiricisi degistirir', () => {
    const api = createFilterBuilder();
    api.send({ type: 'SET_COMBINATOR', groupId: 'root', combinator: 'or' });
    expect(api.getContext().rootGroup.combinator).toBe('or');
  });

  it('RESET state sifirlar', () => {
    const api = createFilterBuilder({ defaultGroup: makeGroup('root', 'or', [makeRule('r1')]) });
    api.send({ type: 'RESET' });
    expect(api.getContext().rootGroup.children).toHaveLength(0);
    expect(api.getContext().rootGroup.combinator).toBe('and');
  });

  it('nested group icinde kural eklenir', () => {
    const api = createFilterBuilder({ defaultGroup: makeGroup('root', 'and', [makeGroup('g1', 'or')]) });
    api.send({ type: 'ADD_RULE', groupId: 'g1', rule: makeRule('r1') });
    const g1 = api.getContext().rootGroup.children[0] as FilterGroup;
    expect(g1.children).toHaveLength(1);
  });

  it('nested group icinde kural silinir', () => {
    const api = createFilterBuilder({
      defaultGroup: makeGroup('root', 'and', [makeGroup('g1', 'or', [makeRule('r1')])]),
    });
    api.send({ type: 'REMOVE_RULE', ruleId: 'r1' });
    const g1 = api.getContext().rootGroup.children[0] as FilterGroup;
    expect(g1.children).toHaveLength(0);
  });

  it('toJSON root group doner', () => {
    const api = createFilterBuilder({ defaultGroup: makeGroup('root', 'and', [makeRule('r1')]) });
    const json = api.toJSON();
    expect(json.id).toBe('root');
    expect(json.children).toHaveLength(1);
  });

  it('onChange callback cagrilir', () => {
    const onChange = vi.fn();
    const api = createFilterBuilder({ onChange });
    api.send({ type: 'ADD_RULE', groupId: 'root', rule: makeRule('r1') });
    expect(onChange).toHaveBeenCalled();
  });

  it('subscribe bildirim alir', () => {
    const api = createFilterBuilder();
    const fn = vi.fn();
    api.subscribe(fn);
    api.send({ type: 'ADD_RULE', groupId: 'root', rule: makeRule('r1') });
    expect(fn).toHaveBeenCalledOnce();
  });

  it('destroy listener temizler', () => {
    const api = createFilterBuilder();
    const fn = vi.fn();
    api.subscribe(fn);
    api.destroy();
    api.send({ type: 'ADD_RULE', groupId: 'root', rule: makeRule('r1') });
    expect(fn).not.toHaveBeenCalled();
  });

  it('getContext immutable kopya doner', () => {
    const api = createFilterBuilder({ defaultGroup: makeGroup('root', 'and', [makeRule('r1')]) });
    const ctx1 = api.getContext();
    const ctx2 = api.getContext();
    expect(ctx1.rootGroup).not.toBe(ctx2.rootGroup);
    expect(ctx1.rootGroup).toEqual(ctx2.rootGroup);
  });
});

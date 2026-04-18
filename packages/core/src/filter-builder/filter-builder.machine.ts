/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * FilterBuilder state machine.
 *
 * @packageDocumentation
 */

import type {
  FilterBuilderConfig,
  FilterBuilderContext,
  FilterBuilderEvent,
  FilterBuilderAPI,
  FilterGroup,
  FilterRule,
} from './filter-builder.types';
import { isFilterGroup } from './filter-builder.types';

function deepCloneGroup(group: FilterGroup): FilterGroup {
  return {
    id: group.id,
    combinator: group.combinator,
    children: group.children.map((child) =>
      isFilterGroup(child) ? deepCloneGroup(child) : { ...child },
    ),
  };
}

function findAndModifyGroup(
  group: FilterGroup,
  groupId: string,
  modifier: (g: FilterGroup) => FilterGroup,
): FilterGroup {
  if (group.id === groupId) return modifier(deepCloneGroup(group));
  return {
    ...group,
    children: group.children.map((child) =>
      isFilterGroup(child) ? findAndModifyGroup(child, groupId, modifier) : child,
    ),
  };
}

function removeFromGroup(group: FilterGroup, targetId: string): FilterGroup {
  return {
    ...group,
    children: group.children
      .filter((child) => {
        if (isFilterGroup(child)) return child.id !== targetId;
        return child.id !== targetId;
      })
      .map((child) => (isFilterGroup(child) ? removeFromGroup(child, targetId) : child)),
  };
}

function updateRuleInGroup(
  group: FilterGroup,
  ruleId: string,
  updates: Partial<Pick<FilterRule, 'field' | 'operator' | 'value' | 'value2'>>,
): FilterGroup {
  return {
    ...group,
    children: group.children.map((child) => {
      if (isFilterGroup(child)) return updateRuleInGroup(child, ruleId, updates);
      if (child.id === ruleId) return { ...child, ...updates };
      return child;
    }),
  };
}

const DEFAULT_GROUP: FilterGroup = { id: 'root', combinator: 'and', children: [] };

export function createFilterBuilder(config: FilterBuilderConfig = {}): FilterBuilderAPI {
  const { onChange } = config;

  let rootGroup: FilterGroup = config.defaultGroup ? deepCloneGroup(config.defaultGroup) : deepCloneGroup(DEFAULT_GROUP);

  const listeners = new Set<() => void>();
  function notify(): void {
    onChange?.(deepCloneGroup(rootGroup));
    for (const fn of listeners) fn();
  }

  function getContext(): FilterBuilderContext {
    return { rootGroup: deepCloneGroup(rootGroup) };
  }

  function send(event: FilterBuilderEvent): void {
    switch (event.type) {
      case 'ADD_RULE':
        rootGroup = findAndModifyGroup(rootGroup, event.groupId, (g) => ({
          ...g,
          children: [...g.children, { ...event.rule }],
        }));
        notify();
        break;
      case 'REMOVE_RULE':
        rootGroup = removeFromGroup(rootGroup, event.ruleId);
        notify();
        break;
      case 'UPDATE_RULE':
        rootGroup = updateRuleInGroup(rootGroup, event.ruleId, event.updates);
        notify();
        break;
      case 'ADD_GROUP':
        rootGroup = findAndModifyGroup(rootGroup, event.parentGroupId, (g) => ({
          ...g,
          children: [...g.children, deepCloneGroup(event.group)],
        }));
        notify();
        break;
      case 'REMOVE_GROUP':
        if (event.groupId === rootGroup.id) break; // Root silinmez
        rootGroup = removeFromGroup(rootGroup, event.groupId);
        notify();
        break;
      case 'SET_COMBINATOR':
        rootGroup = findAndModifyGroup(rootGroup, event.groupId, (g) => ({
          ...g,
          combinator: event.combinator,
        }));
        notify();
        break;
      case 'RESET':
        rootGroup = deepCloneGroup(DEFAULT_GROUP);
        notify();
        break;
    }
  }

  function subscribe(callback: () => void): () => void {
    listeners.add(callback);
    return () => { listeners.delete(callback); };
  }

  function destroy(): void { listeners.clear(); }

  function toJSON(): FilterGroup {
    return deepCloneGroup(rootGroup);
  }

  return { getContext, send, subscribe, destroy, toJSON };
}

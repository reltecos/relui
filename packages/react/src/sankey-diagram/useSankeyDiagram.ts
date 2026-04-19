/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer, useEffect } from 'react';
import { createSankey, type SankeyAPI, type SankeyNodeDef, type SankeyLinkDef } from '@relteco/relui-core';

export interface UseSankeyDiagramProps {
  nodes?: SankeyNodeDef[];
  links?: SankeyLinkDef[];
  width?: number;
  height?: number;
  nodeWidth?: number;
  nodePadding?: number;
}

export type UseSankeyDiagramReturn = ReturnType<SankeyAPI['getContext']> & { api: SankeyAPI };

export function useSankeyDiagram(props: UseSankeyDiagramProps = {}): UseSankeyDiagramReturn {
  const [, forceRender] = useReducer((c: number) => c + 1, 0);
  const apiRef = useRef<SankeyAPI | null>(null);
  const prevRef = useRef<UseSankeyDiagramProps | undefined>(undefined);

  if (apiRef.current === null) {
    apiRef.current = createSankey({
      nodes: props.nodes, links: props.links,
      width: props.width, height: props.height,
      nodeWidth: props.nodeWidth, nodePadding: props.nodePadding,
    });
  }
  const api = apiRef.current;

  useEffect(() => {
    const prev = prevRef.current;
    if (prev === undefined) { prevRef.current = props; return; }
    if ((prev.nodes !== props.nodes || prev.links !== props.links) && props.nodes && props.links) {
      api.send({ type: 'SET_DATA', nodes: props.nodes, links: props.links });
      forceRender();
    }
    prevRef.current = props;
  });

  useEffect(() => api.subscribe(forceRender), [api]);
  useEffect(() => () => api.destroy(), [api]);

  return { ...api.getContext(), api };
}

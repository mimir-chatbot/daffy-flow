import type { Edge, Node } from '@vue-flow/core'
import type { DaffyGraph } from './models/graph'

export function fromDaffyDuck(graph: DaffyGraph): { nodes: Node[], edges: Edge[] } {
  const nodes: Node[] = [], edges: Edge[] = []

  return {
    nodes,
    edges,
  }
}

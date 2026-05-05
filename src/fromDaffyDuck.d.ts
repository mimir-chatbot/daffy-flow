import type { Edge, Node } from '@vue-flow/core'
import type { DaffyGraph } from './models/graph'

export declare function fromDaffyDuck(graph: DaffyGraph): {
  nodes: Node[]
  edges: Edge[]
}

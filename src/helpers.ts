import type { Edge } from '@vue-flow/core'
import type { DaffyEdge } from './models/graph'
import { DAFFY_END } from './constants'

export function findToolSource(source: string, edges: Edge[]): [index?: number, source?: string] {
  for (const [index, edge] of edges.entries()) {
    if (source === edge.target) return [index, edge.source]
    if (source === edge.source) return [index, edge.target]
  }
  return []
}

export function findConditionalEdgeTarget(source: string, target: string, edges: DaffyEdge[]): [index?: number, source?: string] {
  for (const [index, edge] of edges.entries())
    if (source === edge.source) return [index, edge.target]

  return []
}

export function endTargetExist(source: string, edges: DaffyEdge[]): boolean {
  for (const edge of edges) {
    if (edge.source === source && edge.target === DAFFY_END)
      return true
  }

  return false
}

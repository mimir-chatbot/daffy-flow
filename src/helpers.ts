import type { Edge } from '@vue-flow/core'

export function findToolSource(source: string, edges: Edge[]): [index?: number, source?: string] {
  for (const [index, edge] of edges.entries()) {
    if (source === edge.target) return [index, edge.source]
    if (source === edge.source) return [index, edge.target]
  }
  return []
}

import type { Edge, Node } from '@vue-flow/core'
import type { DaffyEdge, DaffyGraph, DaffyNode, DaffyTool } from './models/graph'
import { DAFFY_END, FLOW_TO_DAFFY_NODES, FLOW_TO_DAFFY_TOOLS } from './constants'
import { endTargetExist, findToolSource } from './helpers'

export function toDaffyDuck(nodes: Node[], edges: Edge[]): DaffyGraph {
  const daffyNodes: DaffyNode[] = []
  const daffyEdges: DaffyEdge[] = []
  const tools: Record<string, DaffyTool[]> = {}

  const end_nodes: string[] = []
  for (const node of nodes) {
    if (node.type === 'start' || node.type === 'end') {
      end_nodes.push(node.id)
      continue
    }

    const nodeType = FLOW_TO_DAFFY_NODES[node.type as keyof typeof FLOW_TO_DAFFY_NODES]

    if (nodeType === 'ToolNode') {
      const [index, toolSource] = findToolSource(node.id, edges)
      const toolType = node.data.value as string
      if (!toolSource || index === undefined || !(toolType in FLOW_TO_DAFFY_TOOLS)) continue

      const daffyToolName = FLOW_TO_DAFFY_TOOLS[toolType as keyof typeof FLOW_TO_DAFFY_TOOLS]

      if (!Object.keys(tools).includes(toolSource))
        tools[toolSource] = []

      tools[toolSource].push({
        id: node.id,
        position: node.position,
        name: daffyToolName,
        settings: node.data.config,
      })

      edges.splice(index, 1)
      continue
    }

    if (nodeType === 'AgentNode') {
      const { parallel_tool_calling = true, ...settings } = node.data ?? {}
      daffyNodes.push({
        id: node.id,
        node: FLOW_TO_DAFFY_NODES.agent,
        position: node.position,
        settings,
        parallel_tool_calling,
        tools: [],
      })
      continue
    }

    daffyNodes.push({
      id: node.id,
      node: nodeType,
      settings: node.data,
      position: node.position,
    })
  }

  for (const edge of edges) {
    let target = edge.target
    if (end_nodes.includes(target))
      target = DAFFY_END

    if (target === DAFFY_END && endTargetExist(edge.source, daffyEdges))
      continue

    daffyEdges.push({
      id: edge.id,
      source: edge.source,
      target,
      source_handle: edge.sourceHandle || undefined,
      target_handle: edge.targetHandle || undefined,
    } satisfies DaffyEdge)
  }

  return {
    nodes: daffyNodes,
    edges: daffyEdges,
  }
}

import type { Edge, Node } from '@vue-flow/core'
import type { DaffyGraph } from './models/graph'
import { DAFFY_TO_FLOW_NODES, DAFFY_TO_FLOW_TOOLS } from './constants'

export function fromDaffyDuck(graph: DaffyGraph): { nodes: Node[], edges: Edge[] } {
  const nodes: Node[] = [
    { id: 'START', type: DAFFY_TO_FLOW_NODES.StartNode, position: { x: -500, y: 0 } },
    { id: 'END', type: DAFFY_TO_FLOW_NODES.EndNode, position: { x: 500, y: 0 } },
  ]
  const edges: Edge[] = []

  for (const daffyNode of graph.nodes) {
    const toolConfig = 'tools' in daffyNode && daffyNode.tools.length > 0 ? daffyNode.tools[0] : undefined
    nodes.push({
      id: daffyNode.id,
      type: DAFFY_TO_FLOW_NODES[daffyNode.node],
      position: daffyNode.position,
      data: {
        config: toolConfig && daffyNode.node === 'ToolNode' ? toolConfig.settings : daffyNode.settings,
        ...('parallel_tool_calling' in daffyNode ? { parallel_tool_calling: daffyNode.parallel_tool_calling } : {}),
        ...(toolConfig && daffyNode.node === 'ToolNode' ? { value: DAFFY_TO_FLOW_TOOLS[toolConfig.name] } : {}),
      },
    })
  }

  edges.push(...graph.edges.map(e => ({
    id: e.id,
    source: e.source,
    target: e.target,
    sourceHandle: e.source_handle,
    targetHandle: e.target_handle,
  } as Edge)))

  return {
    nodes,
    edges,
  }
}

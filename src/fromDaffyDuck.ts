import type { Edge, Node } from '@vue-flow/core'
import type { DaffyGraph } from './models/graph'
import { DAFFY_TO_FLOW_NODES, DAFFY_TO_FLOW_TOOLS } from './constants'

export function fromDaffyDuck(graph: DaffyGraph): { nodes: Node[], edges: Edge[] } {
  const nodes: Node[] = [
    { id: 'START', type: DAFFY_TO_FLOW_NODES.StartNode, position: { x: -500, y: 0 } },
    { id: 'END', type: DAFFY_TO_FLOW_NODES.EndNode, position: { x: 500, y: 0 } },
  ]
  const edges: Edge[] = []

  for (const daffyNode of graph.nodes.filter(n => n.node !== 'ToolNode')) {
    nodes.push({
      id: daffyNode.id,
      type: DAFFY_TO_FLOW_NODES[daffyNode.node],
      position: daffyNode.position,
      data: {
        config: daffyNode.settings,
        ...('parallel_tool_calling' in daffyNode ? { parallel_tool_calling: daffyNode.parallel_tool_calling } : {}),
      },
    })
  }

  graph.nodes.filter(n => n.node === 'AgentNode').forEach((node) => {
    node.tools.forEach((tool, index) => {
      const toolType = DAFFY_TO_FLOW_TOOLS[tool.name]
      nodes.push({
        id: `tool_node_${toolType}_${index}`,
        type: DAFFY_TO_FLOW_NODES.ToolNode,
        position: { x: 0, y: 0 },
        data: {
          value: toolType,
          config: tool.settings,
        },
      })
    })
    edges.push(...node.tools.map((tool, index) => {
      const toolType = DAFFY_TO_FLOW_TOOLS[tool.name]
      return {
        id: `end_tool_node_${toolType}_${index}`,
        source: node.id,
        target: `tool_node_${toolType}_${index}`,
        sourceHandle: 'tools',
      } satisfies Edge
    }))
  })

  edges.push(...graph.edges.filter(e => !e.id?.startsWith('tool_node')).map((e, index) => ({
    id: e.id || `${e.source}_${e.target}_${index}`,
    source: e.source,
    target: e.target || '',
    sourceHandle: e.source_handle,
    targetHandle: e.target_handle,
  } satisfies Edge)))

  return {
    nodes,
    edges,
  }
}

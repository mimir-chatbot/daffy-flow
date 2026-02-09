import type { Edge, Node } from '@vue-flow/core'
import type { DaffyGraph } from './models/graph'
import { DAFFY_TO_FLOW_NODES, DAFFY_TO_FLOW_TOOLS } from './constants'

export function fromDaffyDuck(graph: DaffyGraph): { nodes: Node[], edges: Edge[] } {
  const nodes: Node[] = [
    { id: 'START', type: 'start', position: { x: -500, y: 0 }, deletable: false },
    { id: 'END', type: 'end', position: { x: 500, y: 0 }, deletable: false },
  ]
  const edges: Edge[] = []

  for (const daffyNode of graph.nodes.filter(n => n.node !== 'ToolNode')) {
    nodes.push({
      id: daffyNode.id,
      type: DAFFY_TO_FLOW_NODES[daffyNode.node],
      position: daffyNode.position,
      data: {
        ...daffyNode.settings,
        ...('parallel_tool_calling' in daffyNode ? { parallel_tool_calling: daffyNode.parallel_tool_calling } : {}),
      },
    })
  }

  graph.nodes.filter(n => n.node === 'AgentNode').forEach((node) => {
    node.tools.forEach((tool) => {
      const toolType = DAFFY_TO_FLOW_TOOLS[tool.name]
      nodes.push({
        id: tool.id || `tool_node_${toolType}_${node.id}`,
        type: toolType === 'forms' ? 'forms' : DAFFY_TO_FLOW_NODES.ToolNode,
        position: tool.position || { x: 0, y: 0 },
        data: toolType === 'forms' ? tool.settings : { value: toolType, config: tool.settings },
      })
    })
    edges.push(...node.tools.map((tool, index) => {
      const toolType = DAFFY_TO_FLOW_TOOLS[tool.name]
      return {
        id: `tool_node_${toolType}_${index}`,
        source: node.id,
        target: tool.id || `tool_node_${toolType}_${node.id}`,
        sourceHandle: toolType === 'forms' ? 'source-agent-forms' : 'source-agent-tools',
      } satisfies Edge
    }))
  })

  edges.push(...graph.edges.filter(e => !e.source.startsWith('tool_node') && !Object.keys(e.condition || {}).includes('tool_node')).map((e, index) => ({
    id: e.id || `${e.source}_${e.target}_${index}`,
    source: e.source,
    target: e.target || Object.keys(e.condition || {})[0] || 'tool_node',
    sourceHandle: e.source_handle,
    targetHandle: e.target_handle,
  } satisfies Edge)))

  return {
    nodes,
    edges,
  }
}

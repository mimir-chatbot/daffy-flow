import type { Edge, Node } from '@vue-flow/core'
import type { DaffyEdge, DaffyGraph, DaffyNode, DaffyTool, DaffyToolNode } from './models/graph'
import { FLOW_TO_DAFFY_NODES, FLOW_TO_DAFFY_TOOLS } from './constants'
import { findToolSource } from './helpers'

export function toDaffyDuck(nodes: Node[], edges: Edge[]): DaffyGraph {
  const daffyNodes: DaffyNode[] = []
  const daffyEdges: DaffyEdge[] = []
  const tools: Record<string, DaffyTool[]> = {}

  for (const node of nodes) {
    if (node.type === 'start' || node.type === 'end') continue

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

  daffyEdges.push(...edges.map(e => ({
    id: e.id,
    source: e.source,
    target: e.target,
    source_handle: e.sourceHandle || undefined,
    target_handle: e.targetHandle || undefined,
  } satisfies DaffyEdge)))

  if (Object.keys(tools).length > 0) {
    const toolId = 'tool_node'

    const toolNode: DaffyToolNode = {
      id: toolId,
      node: FLOW_TO_DAFFY_NODES.tool,
      parallel_tool_calling: true,
      position: {
        x: 0,
        y: 0,
      },
      settings: {},
      tools: [],
    }

    for (const source in tools) {
      toolNode.tools.push(...tools[source])
      for (const node of daffyNodes) {
        if (node.id === source && node.node === FLOW_TO_DAFFY_NODES.agent) {
          node.tools.push(...tools[source])
          break
        }
      }

      daffyEdges.push({
        id: `start_${toolId}_${source}`,
        source,
        source_handle: 'tools',
        condition: {
          [toolId]: 'tools_condition',
        },
      }, {
        id: `end_${toolId}_${source}`,
        source: toolId,
        target: source,
        target_handle: 'tools',
      })
    }

    daffyNodes.push(toolNode)
  }

  return {
    nodes: daffyNodes,
    edges: daffyEdges,
  }
}

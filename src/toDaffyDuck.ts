import type { Edge, Node } from '@vue-flow/core'
import type { DaffyEdge, DaffyGraph, DaffyNode, DaffyTool, DaffyToolNode } from './models/graph'
import { DAFFY_TO_FLOW_NODES, FLOW_TO_DAFFY_NODES, FLOW_TO_DAFFY_TOOLS } from './constants'

function findToolTarget(source: string, edges: Edge[]): [index?: number, source?: string] {
  for (const [index, edge] of edges.entries()) {
    if (source === edge.source)
      return [index, edge.target]
  }
  return []
}

export function toDaffyDuck(nodes: Node[], edges: Edge[]): DaffyGraph {
  const daffyNodes: DaffyNode[] = []
  const daffyEdges: DaffyEdge[] = []
  const tools: Record<string, DaffyTool> = {}

  for (const node of nodes) {
    if (node.type === DAFFY_TO_FLOW_NODES.StartNode || node.type === DAFFY_TO_FLOW_NODES.EndNode) continue

    if (node.type === DAFFY_TO_FLOW_NODES.ToolNode) {
      const [index, targetTool] = findToolTarget(node.id, edges)
      const toolType = node.data.value as string
      if (!targetTool || !index || !(toolType in FLOW_TO_DAFFY_TOOLS)) continue

      const daffyToolName = FLOW_TO_DAFFY_TOOLS[toolType as keyof typeof FLOW_TO_DAFFY_TOOLS]

      tools[targetTool] = {
        name: daffyToolName,
        settings: node.data.config,
      }

      edges.splice(index, 1)
    }

    if (node.type === DAFFY_TO_FLOW_NODES.AgentNode) {
      daffyNodes.push({
        id: node.id,
        node: FLOW_TO_DAFFY_NODES.agent,
        settings: node.data.config,
        position: node.position,
        parallel_tool_calling: node.data.parallel_tool_calling ?? true,
        tools: [],
      })
    }

    if (node.type === DAFFY_TO_FLOW_NODES.RagNode) {
      daffyNodes.push({
        id: node.id,
        node: FLOW_TO_DAFFY_NODES.rag,
        settings: node.data.config,
        position: node.position,
      })
    }
  }

  daffyEdges.push(...edges.map(e => ({
    id: e.id,
    source: e.source,
    target: e.target,
    source_handle: e.sourceHandle || undefined,
    target_handle: e.targetHandle || undefined,
  } satisfies DaffyEdge)))

  if (Object.keys(tools).length > 0) {
    const toolNode: DaffyToolNode = {
      id: 'tool_node',
      node: FLOW_TO_DAFFY_NODES.tool,
      parallel_tool_calling: true,
      position: {
        x: 0,
        y: 0,
      },
      settings: {},
      tools: [],
    }

    for (const target in tools) {
      toolNode.tools.push(tools[target])
      for (const node of daffyNodes) {
        if (node.id === target && node.node === FLOW_TO_DAFFY_NODES.agent) {
          node.tools.push(tools[target])
          break
        }
      }

      daffyNodes.push(toolNode)
      daffyEdges.push({
        id: `${toolNode.id}_${target}`,
        source: target,
        condition: {
          tool_node: 'tools_condition',
        },
      }, {
        id: `end_${toolNode.id}`,
        source: 'tool_node',
        target,
      })
    }
  }

  return {
    nodes: daffyNodes,
    edges: daffyEdges,
  }
}

import type { Edge, Node } from '@vue-flow/core'
import type { DaffyEdge, DaffyGraph, DaffyNode, DaffyTool, DaffyToolNode } from './models/graph'
import { DAFFY_NODES, DAFFY_TOOLS } from './constants'

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
    if (node.type === DAFFY_NODES.START || node.type === DAFFY_NODES.END) continue

    if (node.type === DAFFY_NODES.TOOL) {
      const [index, targetTool] = findToolTarget(node.id, edges)
      const toolType = node.data.value
      if (!targetTool || !index || !(toolType in DAFFY_TOOLS)) continue

      const daffyToolName = DAFFY_TOOLS[toolType as keyof typeof DAFFY_TOOLS]

      tools[targetTool] = {
        name: daffyToolName,
        settings: node.data.config,
      }

      edges.splice(index, 1)
    }

    if (node.type === DAFFY_NODES.AGENT) {
      daffyNodes.push({
        id: node.id,
        node: 'AgentNode',
        settings: {
          api_key: node.data.config.api_key,
          stream: node.data.config.stream ?? false,
          system_prompt: node.data.config.system_prompt,
          temperature: node.data.config.temperature ?? 0.1,
          model: node.data.config.model,
        },
        position: node.position,
        parallel_tool_calling: node.data.parallel_tool_calling ?? true,
        tools: [],
      })
    }

    if (node.type === DAFFY_NODES.RAG) {
      daffyNodes.push({
        id: node.id,
        node: 'RagNode',
        settings: (node.data.config as Record<string, any>) ?? {},
        position: node.position,
      })
    }
  }

  daffyEdges.push(...edges.map(e => ({
    source: e.source,
    target: e.target,
    source_handle: e.sourceHandle,
    target_handle: e.targetHandle,
  } as DaffyEdge)))

  if (Object.keys(tools).length > 0) {
    const toolNode: DaffyToolNode = {
      id: 'tool_node',
      node: 'ToolNode',
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
        if (node.id === target && node.node === 'AgentNode') {
          node.tools.push(tools[target])
          break
        }
      }

      daffyNodes.push(toolNode)
      daffyEdges.push({
        source: target,
        condition: {
          tool_node: 'tools_condition',
        },
      }, {
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

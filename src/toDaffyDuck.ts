import type { Edge, Node } from '@vue-flow/core'
import type { DaffyEdge, DaffyGraph, DaffyNode, DaffyTool, DaffyToolNode } from './models/graph'
import { DAFFY_END, FLOW_TO_DAFFY_NODES, FLOW_TO_DAFFY_TOOLS } from './constants'
import { endTargetExist, findConditionalEdgeTarget, findToolSource } from './helpers'

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

    if (edge.data?.excluded) continue

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

  for (const source in tools) {
    const toolId = `tool_node_${source}`

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
    toolNode.tools.push(...tools[source])
    let target: string | undefined
    for (const node of daffyNodes) {
      if (node.id === source && node.node === FLOW_TO_DAFFY_NODES.agent) {
        const [index, edgeTarget] = findConditionalEdgeTarget(source, daffyEdges)

        if (index) {
          target = edgeTarget
          daffyEdges.splice(index, 1)
        }

        if (!index)
          target = DAFFY_END

        node.tools.push(...tools[source])
        break
      }
    }

    if (target && end_nodes.includes(target))
      target = DAFFY_END

    daffyNodes.push(toolNode)
    daffyEdges.push({
      id: `start_${toolId}_${source}`,
      source,
      target,
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

  return {
    nodes: daffyNodes,
    edges: daffyEdges,
  }
}

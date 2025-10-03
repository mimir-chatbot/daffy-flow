import type {
  DaffyEdge,
  DaffyGraph, DaffyMSSQLIntrospectionNode,
  DaffyNodeAgent,
  DaffyNodeBase, DaffyPostgressIntrospectionNode,
  DaffyRagNode,
  DaffyTool,
  DaffyToolNode
} from "./models/graph";
import type {Edge, Node} from "@vue-flow/core";
import * as console from "node:console";
// export class DaffyFlow {
//
//   constructor() {
//   }
//
//   public toDaffyGraph(nodes: Node[], edges: Edge[]): DaffyGraph {
//
//
//
//   }
//
//
// }
//

export const START: string = "start";
export const END: string = "end";
export const AGENT: string = "agent";
export const RAG: string = "rag";
export const TOOL: string = "tool";
export const TOOL_MCP: string = "mcp";
export const TOOL_EXCEL: string = "excel";
export const TOOL_POSTGRES: string = "postgres";

export const DAFFY_TOOLS: Record<string, string> = {
  mcp: "MCPTool",
  excel: "ExcelGeneratorTool",
  postgres: "PostgressTool",
}

function findToolTarget(source: string, edges: Edge[]): [index: null|number, source?: null|string] {
  for (const [index, edge] of edges.entries()) {
    if (source === edge.source) {
      return [index, edge.target];
    }
  }
  return [null, null]
}


export const toDaffyDuck  =  (nodes: Node[] = [], edges: Edge[] = []): DaffyGraph => {

  const daffyNodes: (DaffyNodeAgent|DaffyToolNode|DaffyRagNode|DaffyPostgressIntrospectionNode|DaffyMSSQLIntrospectionNode)[] = [];
  const daffyEdges: DaffyEdge[] = [];
  const tools: Record<string, DaffyTool> = {}

  for (const node of nodes) {
    if (node.type === START) {
      continue;
    }
    if (node.type === END) {
      continue;
    }
    if (node.type === TOOL) {
      const [index, targetTool] = findToolTarget(node.id, edges)
      if (targetTool === null || index === null) {
        continue
      }
      const daffyToolName = DAFFY_TOOLS[node?.data["value"]]


      tools[targetTool as string] = {
        name: daffyToolName,
        settings: node?.data["config"],
      }

      edges.splice(index, 1)
    }

    if (node.type === AGENT) {
      const daffyNodeAgent: DaffyNodeAgent = {
        id: node.id,
        node: "AgentNode",
        settings: {
          api_key: node?.data["config"]["api_key"],
          stream: node?.data["config"]["stream"] ?? false,
          system_prompt: node?.data["config"]["system_prompt"],
          temperature: node?.data["config"]["temperature"] ?? 0.1,
          model: node?.data["config"]["model"]
        },
        position: node.position,
        parallel_tool_calling: node?.data["parallel_tool_calling"] ?? true,
        tools: []
      }
      daffyNodes.push(daffyNodeAgent)
      continue
    }

    if (node.type === RAG) {
      const daffyRAGNode: DaffyRagNode = {
        id: node.id,
        node: "RagNode",
        settings: (node?.data["config"] as Record<string, any>) ?? {},
        position: node.position
      }
      daffyNodes.push(daffyRAGNode)
    }

  }

  for(const edge of edges) {
    const daffyEdge: DaffyEdge = {
      source: edge.source,
      target: edge.target,
      source_handle: edge.sourceHandle ?? "",
      target_handle: edge.targetHandle ?? ""
    }
    daffyEdges.push(daffyEdge)
  }

  if (Object.keys(tools).length > 0) {

    const toolNode: DaffyToolNode = {
      id: "tool_node",
      node: "ToolNode",
      parallel_tool_calling: true,
      position: {
        x: 0,
        y: 0
      },
      settings: {},
      tools: []
    }

    for (const target in tools) {

      toolNode.tools.push(tools[target])
      for (const node of daffyNodes) {
        if (node.id === target && node.node == "AgentNode" ) {
          node.tools.push(tools[target])
          break
        }
      }

      daffyNodes.push(toolNode)
      daffyEdges.push({
        source: target,
        condition: {
          "tool_node": "tools_condition",
        }
      })
      daffyEdges.push({
        source: "tool_node",
        target: target,
      })
    }

  }

  return {
    nodes: daffyNodes,
    edges: daffyEdges
  }

}


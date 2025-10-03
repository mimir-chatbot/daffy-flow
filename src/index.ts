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

const START: string = "start";
const END: string = "end";
const AGENT: string = "agent";
const RAG: string = "rag";
const TOOL: string = "tool";
const TOOL_MCP: string = "mcp";
const TOOL_EXCEL: string = "excel";
const TOOL_POSTGRES: string = "postgres";

const DAFFY_TOOLS: Record<string, string> = {
  TOOL_MCP: "MCPTool",
  TOOL_EXCEL: "ExcelGeneratorTool",
  TOOL_POSTGRES: "PostgressTool",
}

function findToolTarget(source: string, edges: Edge[]): [index: number, source: string]|null {
  for (const [index, edge] of edges.entries()) {
    if (source === edge.source) {
      return (index, edge.target);
    }
  }
  return null
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
      if (targetTool === null) {
        continue
      }
      const daffyToolName = DAFFY_TOOLS[node?.data["value"]]


      tools[targetTool[1]] = {
        name: daffyToolName,
        settings: node?.data["settings"],
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
    }
    daffyEdges.push(daffyEdge)
  }

  if (tools.length > 0) {
    const toolNode: DaffyToolNode = {
      id: "tool_node",
      node: "ToolNode",
      parallel_tool_calling: false,
      position: {
        x: 0,
        y: 0
      },
      settings: {},
      tools: []
    }

    for (const target in tools) {
      for (const tool of tools[target]) {
        toolNode.tools.push(tool)
      }

      // daffyEdges.push({
      //   source: target,
      //   conditions: {
      //     "tool_node": "tool_conditions"
      //   }
      // })
    }

  }


  return {
    nodes: daffyNodes,
    edges: daffyEdges
  }

}


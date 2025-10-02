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

function findToolTarget(source: string, edges: Edge[]): string|null {
  for (const edge of edges) {
    if (source === edge.source) {
      return edge.target;
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
      const targetTool: string|null = findToolTarget(node.id, edges)
      if (targetTool === null) {
        continue
      }
      tools[targetTool] = {
        name: node.data["value"],
        settings: node.data["settings"],
      }

    }

    if (node.type === AGENT) {
      const daffyNodeAgent: DaffyNodeAgent = {
        id: node.id,
        node: "AgentNode",
        settings: {
          api_key: node.data["config"]["api_key"],
          stream: node.data["config"]["stream"] ?? false,
          system_prompt: node.data["config"]["system_prompt"],
          temperature: node.data["config"]["temperature"],
          model: node.data["config"]["model"]
        },
        position: node.position,
        parallel_tool_calling: node.data["parallel_tool_calling"] ?? true,
        tools: []
      }
      daffyNodes.push(
        daffyNodeAgent
      )
    }

  }

  return {
    nodes: daffyNodes,
    edges: daffyEdges
  }

}

